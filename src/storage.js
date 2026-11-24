export const KV_STORE_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS kv_store (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  expires_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_kv_store_expires ON kv_store(expires_at);
`.trim();

function nowEpochSeconds() {
  return Math.floor(Date.now() / 1000);
}

function prefixUpperBound(prefix) {
  if (!prefix) return null;
  const lastCode = prefix.charCodeAt(prefix.length - 1);
  return prefix.slice(0, -1) + String.fromCharCode(lastCode + 1);
}

function parseMaybeJson(raw, type) {
  if (raw === null || raw === undefined) return null;
  if (type === "json") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return String(raw);
}

const d1AdapterCache = new WeakMap();

export function createD1KvAdapter(db, options = {}) {
  if (!db || typeof db.prepare !== "function") {
    throw new Error("无效的 Cloudflare D1 数据库绑定");
  }
  const nowFn = typeof options.nowSeconds === "function" ? options.nowSeconds : nowEpochSeconds;
  let schemaReadyPromise = null;

  async function ensureSchema() {
    if (!schemaReadyPromise) {
      schemaReadyPromise = (async () => {
        if (typeof db.exec === "function") {
          await db.exec(KV_STORE_SCHEMA_SQL);
        } else {
          await db
            .prepare(
              "CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value TEXT NOT NULL, expires_at INTEGER)"
            )
            .run();
          await db
            .prepare("CREATE INDEX IF NOT EXISTS idx_kv_store_expires ON kv_store(expires_at)")
            .run();
        }
      })().catch((err) => {
        schemaReadyPromise = null;
        throw err;
      });
    }
    return schemaReadyPromise;
  }

  return {
    __storageBackend: "d1",

    async get(key, type) {
      await ensureSchema();
      const row = await db
        .prepare("SELECT value, expires_at FROM kv_store WHERE key = ?1")
        .bind(String(key))
        .first();
      if (!row) return null;
      if (row.expires_at !== null && row.expires_at !== undefined && Number(row.expires_at) <= nowFn()) {
        await db.prepare("DELETE FROM kv_store WHERE key = ?1").bind(String(key)).run();
        return null;
      }
      return parseMaybeJson(row.value, type);
    },

    async put(key, value, opts = {}) {
      await ensureSchema();
      const ttl = Number(opts?.expirationTtl || 0);
      const expiresAt = Number.isFinite(ttl) && ttl > 0 ? nowFn() + Math.ceil(ttl) : null;
      const serialized = typeof value === "string" ? value : JSON.stringify(value);
      await db
        .prepare(
          "INSERT INTO kv_store (key, value, expires_at) VALUES (?1, ?2, ?3) ON CONFLICT(key) DO UPDATE SET value = excluded.value, expires_at = excluded.expires_at"
        )
        .bind(String(key), serialized, expiresAt)
        .run();
    },

    async delete(key) {
      await ensureSchema();
      await db.prepare("DELETE FROM kv_store WHERE key = ?1").bind(String(key)).run();
    },

    async list(opts = {}) {
      await ensureSchema();
      const prefix = String(opts?.prefix || "");
      const cursor = String(opts?.cursor || "");
      const limit = Math.min(1000, Math.max(1, Number(opts?.limit || 1000)));
      const now = nowFn();
      const upper = prefixUpperBound(prefix);

      const where = ["(expires_at IS NULL OR expires_at > ?1)"];
      const binds = [now];
      if (prefix && upper) {
        binds.push(prefix, upper);
        where.push(`key >= ?${binds.length - 1} AND key < ?${binds.length}`);
      }
      if (cursor) {
        binds.push(cursor);
        where.push(`key > ?${binds.length}`);
      }
      binds.push(limit + 1);
      const sql = `SELECT key FROM kv_store WHERE ${where.join(" AND ")} ORDER BY key ASC LIMIT ?${binds.length}`;
      const res = await db.prepare(sql).bind(...binds).all();
      const rows = Array.isArray(res?.results) ? res.results : [];
      const hasMore = rows.length > limit;
      const page = hasMore ? rows.slice(0, limit) : rows;
      return {
        keys: page.map((r) => ({ name: r.key })),
        list_complete: !hasMore,
        ...(hasMore ? { cursor: page[page.length - 1].key } : {})
      };
    },

    async purgeExpired() {
      await ensureSchema();
      await db.prepare("DELETE FROM kv_store WHERE expires_at IS NOT NULL AND expires_at <= ?1").bind(nowFn()).run();
    }
  };
}

export function createD1WithKvFallbackAdapter(d1Adapter, legacyKv) {
  return {
    __storageBackend: "d1+kv-fallback",

    async get(key, type) {
      const fromD1 = await d1Adapter.get(key, type);
      if (fromD1 !== null) return fromD1;
      if (!legacyKv || typeof legacyKv.get !== "function") return null;
      const fromKv = await legacyKv.get(key, type);
      if (fromKv !== null && fromKv !== undefined) {
        // Lazy read-through migration into D1 (zero KV writes consumed)
        try {
          const rawStr = typeof fromKv === "string" ? fromKv : JSON.stringify(fromKv);
          await d1Adapter.put(key, rawStr);
        } catch {
          // Non-fatal; caller still gets legacy KV value
        }
      }
      return fromKv ?? null;
    },

    async put(key, value, opts) {
      // Write strictly to D1 to avoid KV daily write quota
      return d1Adapter.put(key, value, opts);
    },

    async delete(key) {
      await d1Adapter.delete(key);
      if (legacyKv && typeof legacyKv.delete === "function") {
        try {
          await legacyKv.delete(key);
        } catch {
          // Best-effort cleanup of legacy KV key
        }
      }
    },

    async list(opts = {}) {
      const d1List = await d1Adapter.list(opts);
      const seen = new Set((d1List.keys || []).map((k) => k.name));
      if (legacyKv && typeof legacyKv.list === "function" && !opts?.cursor) {
        try {
          const kvList = await legacyKv.list({ prefix: opts?.prefix || "", limit: opts?.limit || 1000 });
          for (const entry of kvList?.keys || []) {
            if (entry?.name && !seen.has(entry.name)) {
              seen.add(entry.name);
            }
          }
        } catch {
          // Fallback silently to D1 list
        }
      }
      return {
        keys: [...seen].sort().map((name) => ({ name })),
        list_complete: d1List.list_complete,
        ...(d1List.cursor ? { cursor: d1List.cursor } : {})
      };
    }
  };
}

export function resolveStorageEnv(env) {
  if (!env || typeof env !== "object") return env;
  const forced = String(env.STORAGE_BACKEND || "").trim().toLowerCase();
  if (forced === "kv") return env;

  if (env.DCLONE_DB && typeof env.DCLONE_DB.prepare === "function") {
    let d1Adapter = d1AdapterCache.get(env.DCLONE_DB);
    if (!d1Adapter) {
      d1Adapter = createD1KvAdapter(env.DCLONE_DB);
      d1AdapterCache.set(env.DCLONE_DB, d1Adapter);
    }
    const disableFallback = String(env.D1_DISABLE_KV_FALLBACK || "").toLowerCase() === "true";
    const legacyKv =
      !disableFallback &&
      env.DCLONE_STATE &&
      typeof env.DCLONE_STATE.get === "function" &&
      !env.DCLONE_STATE.__storageBackend
        ? env.DCLONE_STATE
        : null;
    const activeStore = legacyKv ? createD1WithKvFallbackAdapter(d1Adapter, legacyKv) : d1Adapter;
    return {
      ...env,
      DCLONE_STATE: activeStore
    };
  }

  return env;
}

export function getStorageBackendInfo(env) {
  const store = env?.DCLONE_STATE;
  if (!store) return { backend: "none", label: "未绑定存储" };
  if (store.__storageBackend === "d1") {
    return { backend: "d1", label: "Cloudflare D1 (SQLite)" };
  }
  if (store.__storageBackend === "d1+kv-fallback") {
    return { backend: "d1+kv-fallback", label: "Cloudflare D1（含旧 KV 自动平滑迁移）" };
  }
  if (store.__storageBackend === "sqlite") {
    return { backend: "sqlite", label: "Linux 本地 SQLite (WAL)" };
  }
  return { backend: "kv", label: "Cloudflare KV" };
}
