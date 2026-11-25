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
  const cure = data.runewords.find((item) => item.id === "cure");
  assert.ok(cure && Array.isArray(cure.stats) && cure.stats.includes("生命上限提高 5%"));
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
  assert.ok(data.baseItems.length >= 500);
  assert.ok(data.baseItems.every((item) => Array.isArray(item.sockets) && item.sockets.length === 3));
  assert.ok(data.baseItems.every((item) => Boolean(item.icon && item.subCategory && item.subCategoryZh)));
  assert.ok(data.baseItems.some((item) => item.subCategory === "pole" && item.nameEn === "Thresher"));
  assert.ok(data.baseItems.some((item) => item.subCategory === "throw" && item.nameEn === "Winged Knife"));
  assert.ok(data.baseItems.some((item) => item.subCategory === "shie" && item.nameEn === "Monarch"));
  assert.ok(data.baseItems.some((item) => item.subCategory === "pal-shd" && item.classOnly === "pal"));
  assert.ok(data.baseItems.some((item) => item.subCategory === "bar-helm" && item.classOnly === "bar"));
  assert.ok(data.baseItems.some((item) => item.subCategory === "ass-claw" && item.classOnly === "ass"));
  assert.ok(data.baseItems.some((item) => item.subCategory === "sor-orb" && item.classOnly === "sor"));
  assert.ok(data.baseItems.some((item) => item.subCategory === "war-grim" && item.classOnly === "war"));
  assert.ok(data.magicRareGems.length >= 10);
  assert.equal(data.setItems.length, 34);
  assert.ok(data.setItems.every((s) => s.detail && Array.isArray(s.detail.pieces) && s.detail.pieces.length === s.pieces));
  assert.ok(data.setItems.some((s) => s.id === "horazons-splendor"));
  assert.ok(data.uniqueItems.length >= 110);
  assert.ok(data.uniqueItems.every((u) => !u.nameEn.includes("/")));
  assert.ok(data.uniqueItems.every((u) => Boolean(u.subCategory && u.subCategoryZh && u.tierNorm)));
  assert.ok(data.uniqueItems.some((u) => u.nameEn === "Herald of Zakarum" && u.subCategory === "pal-shd" && u.classOnly === "pal" && u.tierNorm === "扩展"));
  assert.ok(data.uniqueItems.some((u) => u.nameEn === "Death's Fathom" && u.subCategory === "sor-orb" && u.classOnly === "sor" && u.tierNorm === "精华"));
  assert.ok(data.uniqueItems.some((u) => u.nameEn === "The Reaper's Toll" && u.subCategory === "pole" && u.tierNorm === "精华"));
  assert.ok(data.uniqueItems.some((u) => u.nameEn === "Ars Dul'Mephistos" && u.stats.includes("强化防御")));
  assert.ok(data.uniqueItems.some((u) => u.nameEn === "Hellwarden's Will" && u.stats.includes("强化防御")));
  assert.ok(data.uniqueItems.some((u) => u.nameEn === "Gheed's Wager"));
  const horazon = data.setItems.find((s) => s.id === "horazons-splendor");
  const hold = horazon.detail.pieces.find((p) => p.nameEn === "Horazon's Hold");
  const dominion = horazon.detail.pieces.find((p) => p.nameEn === "Horazon's Dominion");
  assert.ok(Array.isArray(hold.setPieceBonus) && hold.setPieceBonus.some((b) => b.includes("7% 击中偷取法力")));
  assert.ok(Array.isArray(dominion.setPieceBonus) && dominion.setPieceBonus.some((b) => b.includes("5 件：物理伤害减少 15%")));
  assert.ok(horazon.detail.partialBonuses.some((p) => p.count === 2 && p.stats.includes("+20 敏捷")));
  assert.ok(horazon.detail.partialBonuses.some((p) => p.count === 3 && p.stats.includes("+30 精力")));
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

test("公开读取角色与佣兵纸娃娃配装元数据（含 3.4 术士魔典、最大孔数与 49 种镶嵌物）", async () => {
  const response = await worker.fetch(
    new Request("https://example.com/api/paperdoll"),
    createEnv()
  );
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.ok, true);
  assert.ok(data.baseRules && Object.keys(data.baseRules).length >= 500);
  assert.equal(data.baseRules.waf.type, "grim");
  assert.equal(data.baseRules.waf.classOnly, "war");
  assert.equal(data.baseRules.waf.gemApplyType, 2);
  assert.equal(data.baseRules["7wc"].twoHanded, true);
  assert.ok(data.baseRules["7vo"].nameZh.includes("巨神长柄斧"));
  assert.ok(data.baseRules["6cs"].nameZh.includes("长者法杖"));
  assert.ok(data.baseRules["7vo"].aliasZh.includes("巨神戟"));
  assert.equal(data.uniqueMeta["Harlequin Crest (Shako)"].maxSockets, 1);
  assert.equal(data.uniqueMeta["Crown of Ages (CoA)"].maxSockets, 2);
  assert.equal(data.uniqueMeta["Rune Master"].maxSockets, 5);
  assert.equal(data.uniqueMeta["Ars Al'Diabolos"].code, "waf");
  assert.equal(data.setMeta["Griswold's Redemption"].maxSockets, 4);
  assert.equal(data.setMeta["Tal Rasha's Guardianship"].code, "uth");
  assert.equal(data.setMeta["Whistan's Guard"].code, "xml");
  assert.equal(data.socketables.length, 49);
  assert.ok(data.socketables.some((s) => s.id === "r08" && s.helm.includes("火焰抗性")));
  assert.ok(data.socketables.some((s) => s.id === "jw-55-ltng"));
  assert.equal(Object.keys(data.charBaseStats).length, 8);
  assert.equal(data.charBaseStats.war.lifePerVit, 3);
  assert.equal(data.charBaseStats.bar.lifePerVit, 4);
  assert.ok(data.baseRules["7cr"].maxDmg > 0 && data.baseRules.uit.block > 0);
  assert.ok(data.skillCombatMeta.Zeal && data.skillCombatMeta.Whirlwind && data.skillCombatMeta.Cleave);
  assert.equal(data.skillCombatMeta["Echoing Strike"].srcDam, 116);
  assert.equal(data.skillCombatMeta["Echoing Strike"].edBase, 30);
  assert.equal(data.skillCombatMeta["Echoing Strike"].edLvl, 5);
  assert.equal(data.skillCombatMeta["Echoing Strike"].usesFcr, true);
  assert.equal(data.skillCombatMeta["Echoing Strike"].edSynergies.length, 2);
  assert.equal(data.skillCombatMeta.Zeal.edStartLvl, 5);
  assert.equal(data.skillCombatMeta.Zeal.edSynergies[0].skill, "Sacrifice");
  assert.equal(data.skillCombatMeta.Frenzy.edSynergies.length, 2);
  assert.equal(data.skillCombatMeta.Strafe.edSynergies.length, 2);
  assert.equal(data.skillCombatMeta.Vengeance.eleConvEachBase, 70);
  assert.ok(Array.isArray(data.inventoryCharms) && data.inventoryCharms.length >= 33);
  assert.ok(data.inventoryCharms.some((c) => c.id === "magic-sc" && c.isBlankMagic === true && c.affixSlot === "charm_sc"));
  assert.ok(data.inventoryCharms.some((c) => c.id === "magic-lc" && c.isBlankMagic === true && c.affixSlot === "charm_lc"));
  assert.ok(data.inventoryCharms.some((c) => c.id === "magic-gc" && c.isBlankMagic === true && c.affixSlot === "charm_gc"));
  assert.ok(data.inventoryCharms.some((c) => c.id === "torch" && c.w === 1 && c.h === 2));
  assert.ok(data.inventoryCharms.some((c) => c.id === "anni" && c.w === 1 && c.h === 1));
  assert.ok(data.inventoryCharms.some((c) => c.id === "util-cube" && c.w === 2 && c.h === 2));
  assert.ok(Array.isArray(data.craftedItems) && data.craftedItems.length >= 20);
  assert.ok(data.craftedItems.some((c) => c.id === "craft-amu-caster" && c.slot === "amulet" && c.skillCapable === "all" && c.stats.includes("+5–10% 快速施法 (FCR)") && c.stats.includes("+10–20 法力")));
  assert.ok(data.craftedItems.some((c) => c.id === "craft-glv-blood-cb" && c.slot === "gloves" && c.skillCapable === "tab"));
  assert.ok(data.craftedItems.some((c) => c.id === "craft-weap-blood-axe" && c.maxSockets === 2));
  assert.ok(Array.isArray(data.affixCatalog) && data.affixCatalog.length >= 300);
  assert.ok(data.typeAffixMap && Object.keys(data.typeAffixMap).length >= 38);
  const rareAmuAffixes = data.typeAffixMap.amul.r.map((idx) => data.affixCatalog[idx][3]);
  assert.ok(rareAmuAffixes.includes("物理伤害减少 1–4 (PDR)"));
  assert.ok(rareAmuAffixes.includes("+10% 快速施法 (FCR)"));
  const rareRingAffixes = data.typeAffixMap.ring.r.map((idx) => data.affixCatalog[idx][3]);
  assert.ok(rareRingAffixes.includes("+10–120 命中值 (AR)"));
  assert.ok(rareRingAffixes.includes("+1–90 法力"));
  assert.ok(rareRingAffixes.includes("所有抗性 +3–11%"));
  assert.ok(rareRingAffixes.includes("3–8% 击中偷取生命 (LL)"));
  assert.ok(rareRingAffixes.includes("+1–40 生命"));
  assert.ok(rareRingAffixes.includes("魔法伤害减少 1–2 (MDR)"));
});
