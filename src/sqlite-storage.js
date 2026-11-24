import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { KV_STORE_SCHEMA_SQL } from "./storage.js";

function nowEpochSeconds() {
  return Math.floor(Date.now() / 1000);
}

function prefixUpperBound(prefix) {
  if (!prefix) return null;
  const lastCode = prefix.charCodeAt(prefix.length - 1);
  return prefix.slice(0, -1) + String.fromCharCode(lastCode + 1);
}

export function createNodeSqliteKvAdapter(dbPath = "./data/d2r-sanctuary.sqlite", options = {}) {
  const nowFn = typeof options.nowSeconds === "function" ? options.nowSeconds : nowEpochSeconds;
  if (dbPath !== ":memory:") {
    fs.mkdirSync(path.dirname(path.resolve(dbPath)), { recursive: true });
  }
  const db = new DatabaseSync(dbPath);
  if (dbPath !== ":memory:") {
    db.exec("PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL; PRAGMA busy_timeout = 5000;");
  }
  db.exec(KV_STORE_SCHEMA_SQL);

  const stmtGet = db.prepare("SELECT value, expires_at FROM kv_store WHERE key = ?");
  const stmtPut = db.prepare(
    "INSERT INTO kv_store (key, value, expires_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, expires_at = excluded.expires_at"
  );
  const stmtDel = db.prepare("DELETE FROM kv_store WHERE key = ?");
  const stmtPurge = db.prepare("DELETE FROM kv_store WHERE expires_at IS NOT NULL AND expires_at <= ?");

  return {
    __storageBackend: "sqlite",
    dbPath,

    async get(key, type) {
      const row = stmtGet.get(String(key));
      if (!row) return null;
      if (row.expires_at !== null && row.expires_at !== undefined && Number(row.expires_at) <= nowFn()) {
        stmtDel.run(String(key));
        return null;
      }
      if (type === "json") {
        try {
          return JSON.parse(row.value);
        } catch {
          return null;
        }
      }
      return String(row.value);
    },

    async put(key, value, opts = {}) {
      const ttl = Number(opts?.expirationTtl || 0);
      const expiresAt = Number.isFinite(ttl) && ttl > 0 ? nowFn() + Math.ceil(ttl) : null;
      const serialized = typeof value === "string" ? value : JSON.stringify(value);
      stmtPut.run(String(key), serialized, expiresAt);
    },

    async delete(key) {
      stmtDel.run(String(key));
    },

    async list(opts = {}) {
      const prefix = String(opts?.prefix || "");
      const cursor = String(opts?.cursor || "");
      const limit = Math.min(1000, Math.max(1, Number(opts?.limit || 1000)));
      const now = nowFn();
      const upper = prefixUpperBound(prefix);

      const where = ["(expires_at IS NULL OR expires_at > ?)"];
      const binds = [now];
      if (prefix && upper) {
        where.push("key >= ? AND key < ?");
        binds.push(prefix, upper);
      }
      if (cursor) {
        where.push("key > ?");
        binds.push(cursor);
      }
      binds.push(limit + 1);
      const sql = `SELECT key FROM kv_store WHERE ${where.join(" AND ")} ORDER BY key ASC LIMIT ?`;
      const rows = db.prepare(sql).all(...binds);
      const hasMore = rows.length > limit;
      const page = hasMore ? rows.slice(0, limit) : rows;
      return {
        keys: page.map((r) => ({ name: r.key })),
        list_complete: !hasMore,
        ...(hasMore ? { cursor: page[page.length - 1].key } : {})
      };
    },

    async purgeExpired() {
      stmtPurge.run(nowFn());
    },

    close() {
      db.close();
    }
  };
}
