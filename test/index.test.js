import assert from "node:assert/strict";
import test from "node:test";

import worker from "../src/index.js";

function createEnv() {
  const values = new Map();
  return {
    MANUAL_TRIGGER_TOKEN: "test-token",
    DCLONE_STATE: {
      async get(key, type) {
        const value = values.get(key);
        return type === "json" && value ? JSON.parse(value) : value ?? null;
      },
      async put(key, value) {
        values.set(key, value);
      }
    }
  };
}

test("公开读取后台拉取设置", async () => {
  const response = await worker.fetch(
    new Request("https://example.com/api/settings"),
    createEnv()
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { pullIntervalMinutes: 5 });
});

test("修改后台拉取设置需要管理令牌", async () => {
  const response = await worker.fetch(
    new Request("https://example.com/api/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pullIntervalMinutes: 2 })
    }),
    createEnv()
  );
  assert.equal(response.status, 401);
});

test("使用管理令牌保存后台拉取设置", async () => {
  const env = createEnv();
  const saveResponse = await worker.fetch(
    new Request("https://example.com/api/settings", {
      method: "POST",
      headers: {
        authorization: "Bearer test-token",
        "content-type": "application/json"
      },
      body: JSON.stringify({ pullIntervalMinutes: 2 })
    }),
    env
  );
  assert.equal(saveResponse.status, 200);
  assert.deepEqual(await saveResponse.json(), {
    ok: true,
    pullIntervalMinutes: 2
  });

  const readResponse = await worker.fetch(
    new Request("https://example.com/api/settings"),
    env
  );
  assert.deepEqual(await readResponse.json(), { pullIntervalMinutes: 2 });
});
