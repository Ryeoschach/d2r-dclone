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

test("公开读取全部恐怖地带图鉴列表", async () => {
  const response = await worker.fetch(
    new Request("https://example.com/api/terror-zones"),
    createEnv()
  );
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.ok, true);
  assert.equal(data.terrorZones.length, 37);
  assert.ok(data.terrorZones.some((item) => item.zoneZh === "秘密奶牛关"));
});

test("公开读取全部符文之语与符文需求统计", async () => {
  const response = await worker.fetch(
    new Request("https://example.com/api/runewords"),
    createEnv()
  );
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.ok, true);
  assert.equal(data.version, "3.4");
  assert.equal(data.totalRunewords, 99);
  assert.equal(data.runes.length, 33);
  assert.equal(data.runewords.length, 99);
  assert.ok(data.runewords.some((item) => item.zhName === "谜团"));
});

test("公开读取魔法亮金手工物品词缀范围与配方", async () => {
  const response = await worker.fetch(
    new Request("https://example.com/api/affixes"),
    createEnv()
  );
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.ok, true);
  assert.equal(data.qualityRules.length, 3);
  assert.equal(data.craftRecipes.length, 4);
  assert.equal(data.slots.length, 12);
  assert.equal(data.simulatorBases.length, 15);
  assert.ok(data.totalAffixes > 140);
  assert.ok(data.affixes.some((item) => item.slot === "amulet" && item.range.includes("FCR")));
  assert.ok(data.affixes.some((item) => item.slot === "charm_sc" && item.nameEn.includes("Steel") && item.range.includes("25–36")));
  assert.ok(data.affixes.some((item) => item.slot === "charm_sc" && item.nameEn.includes("of Balance") && item.range.includes("5%")));
  assert.ok(data.affixes.some((item) => item.slot === "jewel" && item.nameEn.includes("of Fervor")));
});

test("公开读取物品资讯百科数据（基础/蓝黄/绿装/暗金/方块）", async () => {
  const response = await worker.fetch(
    new Request("https://example.com/api/items"),
    createEnv()
  );
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.ok, true);
  assert.ok(data.baseItems.length >= 90);
  assert.ok(data.baseItems.every((item) => Array.isArray(item.sockets) && item.sockets.length === 3));
  assert.ok(data.magicRareGems.length >= 10);
  assert.equal(data.setItems.length, 34);
  assert.ok(data.setItems.every((s) => s.detail && Array.isArray(s.detail.pieces) && s.detail.pieces.length === s.pieces));
  assert.ok(data.setItems.some((s) => s.id === "horazons-splendor"));
  assert.ok(data.uniqueItems.length >= 110);
  assert.ok(data.uniqueItems.every((u) => !u.nameEn.includes("/")));
  assert.ok(data.uniqueItems.some((u) => u.nameEn === "Ars Dul'Mephistos"));
  assert.ok(data.uniqueItems.some((u) => u.nameEn === "Hellwarden's Will"));
  assert.ok(data.uniqueItems.some((u) => u.nameEn === "Gheed's Wager"));
  const horazon = data.setItems.find((s) => s.id === "horazons-splendor");
  const hold = horazon.detail.pieces.find((p) => p.nameEn === "Horazon's Hold");
  assert.ok(Array.isArray(hold.setPieceBonus) && hold.setPieceBonus.some((b) => b.includes("7% 击中偷取法力")));
  assert.ok(data.uniqueItems.some((u) => u.nameEn === "The Atlantean"));
  assert.ok(data.uniqueItems.some((u) => u.nameEn === "Crack of the Heavens"));
  assert.ok(data.uniqueItems.some((u) => u.nameEn === "Defender's Fire"));
  assert.ok(data.uniqueItems.some((u) => u.nameEn === "Guardian's Light"));
  assert.ok(data.cubeRecipes.length >= 8);
  assert.ok(data.uniqueUpgradeMeta && data.uniqueUpgradeMeta["Titan's Revenge"]);
  assert.ok(Array.isArray(data.sunderCrafts34) && data.sunderCrafts34.length === 6);
});

test("公开读取八大职业技能树与加点模拟器数据（含 3.4 术士 Warlock）", async () => {
  const response = await worker.fetch(
    new Request("https://example.com/api/skills"),
    createEnv()
  );
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.ok, true);
  assert.equal(data.totalClasses, 8);
  assert.equal(data.totalSkills, 240);
  const warlock = data.classes.find((c) => c.id === "war");
  assert.ok(warlock, "应包含 3.4 新职业术士 Warlock");
  assert.equal(warlock.skills.length, 30);
  assert.ok(warlock.skills.some((s) => s.key === "Apocalypse" && s.nameZh === "末日"));
  assert.ok(warlock.skills.some((s) => s.key === "Abyss" && s.nameZh === "深渊"));
  assert.ok(warlock.skills.some((s) => s.key === "Bind Demon" && s.nameZh === "束缚恶魔"));
});

test("公开读取恐怖地带与首领掉率计算器数据（含 3.4 远古雕像与 96 级 TZ 首领）", async () => {
  const response = await worker.fetch(
    new Request("https://example.com/api/drops"),
    createEnv()
  );
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.ok, true);
  assert.ok(Array.isArray(data.sources) && data.sources.length >= 16);
  const andyTz = data.sources.find((s) => s.id === "andariel-tz");
  assert.ok(andyTz && andyTz.mlvl === 96 && andyTz.leaves.ci3 > 0 && andyTz.leaves.ua1 > 0);
  assert.ok(Array.isArray(data.uniquePools.ci3) && data.uniquePools.ci3.some((u) => u.nameEn === "Griffon's Eye"));
  assert.ok(Array.isArray(data.specialDrops) && data.specialDrops.some((sp) => sp.code === "ua1"));
});
