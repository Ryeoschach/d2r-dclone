import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

import worker from "../src/index.js";
import {
  createD1KvAdapter,
  createD1WithKvFallbackAdapter,
  getStorageBackendInfo,
  resolveStorageEnv
} from "../src/storage.js";
import { createNodeSqliteKvAdapter } from "../src/sqlite-storage.js";

// Faithful Cloudflare D1 mock backed by real SQLite (:memory:)
function createMockD1Database() {
  const db = new DatabaseSync(":memory:");
  return {
    async exec(sql) {
      db.exec(sql);
    },
    prepare(sql) {
      const normalizedSql = sql.replace(/\?(\d+)/g, "?");
      const makeBound = (params) => ({
        async first() {
          const row = db.prepare(normalizedSql).get(...params);
          return row ?? null;
        },
        async all() {
          const results = db.prepare(normalizedSql).all(...params);
          return { results, success: true };
        },
        async run() {
          const info = db.prepare(normalizedSql).run(...params);
          return { success: true, meta: { changes: info.changes } };
        }
      });
      return {
        bind(...params) {
          return makeBound(params);
        },
        ...makeBound([])
      };
    },
    close() {
      db.close();
    }
  };
}

function createCountingKv() {
  const map = new Map();
  let putCount = 0;
  return {
    map,
    get putCount() { return putCount; },
    async get(k, type) {
      const v = map.get(k);
      if (v === undefined) return null;
      return type === "json" ? JSON.parse(v) : v;
    },
    async put(k, v) {
      putCount += 1;
      map.set(k, String(v));
    },
    async delete(k) {
      map.delete(k);
    },
    async list({ prefix = "" } = {}) {
      const keys = [...map.keys()]
        .filter((k) => k.startsWith(prefix))
        .sort()
        .map((name) => ({ name }));
      return { keys, list_complete: true };
    }
  };
}

test("Cloudflare D1 存储适配器：读写、JSON 解析、前缀分页 list 与 TTL 过期淘汰", async () => {
  const d1 = createMockD1Database();
  let fakeNow = 1700000000;
  const store = createD1KvAdapter(d1, { nowSeconds: () => fakeNow });

  await store.put("auth:user:u1", JSON.stringify({ id: "u1", name: "Paladin" }));
  await store.put("auth:user:u2", JSON.stringify({ id: "u2", name: "Warlock" }));
  await store.put("auth:user:u3", JSON.stringify({ id: "u3", name: "Sorceress" }));
  await store.put("auth:sess:s1", "token-1", { expirationTtl: 60 });

  const u1 = await store.get("auth:user:u1", "json");
  assert.deepEqual(u1, { id: "u1", name: "Paladin" });
  assert.equal(await store.get("auth:sess:s1"), "token-1");

  // Prefix list with pagination (limit = 2)
  const page1 = await store.list({ prefix: "auth:user:", limit: 2 });
  assert.deepEqual(page1.keys.map((k) => k.name), ["auth:user:u1", "auth:user:u2"]);
  assert.equal(page1.list_complete, false);
  assert.equal(page1.cursor, "auth:user:u2");

  const page2 = await store.list({ prefix: "auth:user:", limit: 2, cursor: page1.cursor });
  assert.deepEqual(page2.keys.map((k) => k.name), ["auth:user:u3"]);
  assert.equal(page2.list_complete, true);

  // Advance time past TTL -> session expires cleanly
  fakeNow += 61;
  assert.equal(await store.get("auth:sess:s1"), null);
  const sessList = await store.list({ prefix: "auth:sess:" });
  assert.equal(sessList.keys.length, 0);

  await store.delete("auth:user:u2");
  assert.equal(await store.get("auth:user:u2"), null);
  d1.close();
});

test("D1 + 旧 KV 平滑回源迁移：读旧 KV 自动迁入 D1、写入零消耗 KV 配额、删除双端生效", async () => {
  const d1 = createMockD1Database();
  const legacyKv = createCountingKv();
  legacyKv.map.set("auth:user:legacy1", JSON.stringify({ id: "legacy1", username: "creed" }));
  legacyKv.map.set("auth:user:legacy2", JSON.stringify({ id: "legacy2", username: "tyrael" }));

  const env = resolveStorageEnv({
    DCLONE_DB: d1,
    DCLONE_STATE: legacyKv
  });
  assert.equal(getStorageBackendInfo(env).backend, "d1+kv-fallback");

  // Read legacy key -> falls back to KV & lazily migrates to D1 (0 KV writes!)
  const legacyUser = await env.DCLONE_STATE.get("auth:user:legacy1", "json");
  assert.equal(legacyUser.username, "creed");
  assert.equal(legacyKv.putCount, 0);

  // Write new key -> goes strictly to D1 (0 KV writes!)
  await env.DCLONE_STATE.put("auth:user:new1", JSON.stringify({ id: "new1", username: "warlock" }));
  assert.equal(legacyKv.putCount, 0);
  assert.equal(legacyKv.map.has("auth:user:new1"), false);

  // List merges both D1 and legacy KV keys without duplicates
  const listed = await env.DCLONE_STATE.list({ prefix: "auth:user:" });
  assert.deepEqual(
    listed.keys.map((k) => k.name),
    ["auth:user:legacy1", "auth:user:legacy2", "auth:user:new1"]
  );

  // Delete removes from both D1 and legacy KV so it does not resurrect
  await env.DCLONE_STATE.delete("auth:user:legacy2");
  assert.equal(await env.DCLONE_STATE.get("auth:user:legacy2"), null);
  assert.equal(legacyKv.map.has("auth:user:legacy2"), false);

  // Forced KV mode bypasses D1
  const kvOnlyEnv = resolveStorageEnv({ DCLONE_DB: d1, DCLONE_STATE: legacyKv, STORAGE_BACKEND: "kv" });
  assert.equal(getStorageBackendInfo(kvOnlyEnv).backend, "kv");

  // Direct D1 without legacy KV
  const d1OnlyEnv = resolveStorageEnv({ DCLONE_DB: d1 });
  assert.equal(getStorageBackendInfo(d1OnlyEnv).backend, "d1");

  d1.close();
});

test("Linux 本地 SQLite 适配器直连 Worker 全链路（注册、云端存档与公开分享短链）", async () => {
  const sqliteStore = createNodeSqliteKvAdapter(":memory:");
  const env = { DCLONE_STATE: sqliteStore };
  assert.equal(getStorageBackendInfo(env).backend, "sqlite");

  // 1. Register user via Worker backed by Node SQLite
  const regRes = await worker.fetch(
    new Request("https://linux.d2r.local/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json", "sec-fetch-site": "same-origin" },
      body: JSON.stringify({
        account: "linux_hero",
        displayName: "Linux 自建玩家",
        password: "StrongPassword123!"
      })
    }),
    env
  );
  assert.equal(regRes.status, 201);
  const cookies = typeof regRes.headers.getSetCookie === "function" ? regRes.headers.getSetCookie() : [];
  const sessionCookie = cookies.map((c) => c.split(";")[0]).find((c) => c.startsWith("__Host-d2r_session="));
  assert.ok(sessionCookie);

  // 2. Create public /build/:id share via Worker backed by Node SQLite
  const shareRes = await worker.fetch(
    new Request("https://linux.d2r.local/api/builds/share", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "sec-fetch-site": "same-origin",
        cookie: sessionCookie
      },
      body: JSON.stringify({
        classId: "war",
        title: "Linux SQLite 术士BD",
        skills: { "Hex Purge": 20 }
      })
    }),
    env
  );
  assert.equal(shareRes.status, 201);
  const shareData = await shareRes.json();
  assert.equal(shareData.build.authorName, "Linux 自建玩家");

  // 3. Fetch SSR /build/:id page from SQLite
  const pageRes = await worker.fetch(new Request(`https://linux.d2r.local/build/${shareData.id}`), env);
  assert.equal(pageRes.status, 200);
  assert.match(await pageRes.text(), /Linux SQLite 术士BD/);

  sqliteStore.close();
});
