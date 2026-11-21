import assert from "node:assert/strict";
import test from "node:test";

import {
  RUNES,
  RUNEWORDS,
  calculateRuneCounts,
  getRunewordsCatalog
} from "../src/runewords-metadata.js";

test("包含全部 33 颗符文与 D2R 3.4 官方全 99 种符文之语", () => {
  assert.equal(RUNES.length, 33);
  assert.equal(RUNEWORDS.length, 99);

  const uniqueIds = new Set(RUNEWORDS.map((rw) => rw.id));
  const uniqueNames = new Set(RUNEWORDS.map((rw) => rw.name));
  assert.equal(uniqueIds.size, 99);
  assert.equal(uniqueNames.size, 99);
});

test("多底材符文之语合并为一栏且符文只统计一次", () => {
  const multiBaseNames = ["Spirit", "Fortitude", "Dragon", "Dream", "Phoenix"];
  for (const name of multiBaseNames) {
    const matches = RUNEWORDS.filter((rw) => rw.name === name);
    assert.equal(matches.length, 1, `${name} 应当只出现一次`);
    assert.equal(matches[0].types.length, 2, `${name} 应当包含两个底材分类`);
  }

  // 3.0+ 将原 Hustle 拆分为 Mania（武器）和 Hysteria（盔甲）
  assert.ok(RUNEWORDS.some((rw) => rw.name === "Mania" && rw.types.includes("weapon")));
  assert.ok(RUNEWORDS.some((rw) => rw.name === "Hysteria" && rw.types.includes("armor")));

  const spirit = RUNEWORDS.find((rw) => rw.name === "Spirit");
  assert.deepEqual(spirit.runes, ["Tal", "Thul", "Ort", "Amn"]);

  const fortitude = RUNEWORDS.find((rw) => rw.name === "Fortitude");
  assert.deepEqual(fortitude.runes, ["El", "Sol", "Dol", "Lo"]);
});

test("包含术士君临（Reign of the Warlock）新增 5 个符文之语与 3.4 赛季重做标注", () => {
  const rotw = RUNEWORDS.filter((rw) => rw.patch === "RotW");
  assert.equal(rotw.length, 5);
  assert.deepEqual(
    rotw.map((rw) => rw.name).sort(),
    ["Authority", "Coven", "Ritual", "Vigilance", "Void"]
  );

  const eternity = RUNEWORDS.find((rw) => rw.id === "eternity");
  assert.equal(eternity.ladderStatus, "ladder-rework");
  assert.match(eternity.basesZh, /弓弩/);
});

test("统计所有符文需求数量并在勾选后正确扣减剩余数量", () => {
  const all = calculateRuneCounts(RUNEWORDS);
  assert.equal(all.totalRunewords, 99);
  assert.equal(all.completedRunewords, 0);
  assert.equal(all.totalRunesNeeded, all.remainingRunesNeeded);

  const zod = all.runes.find((r) => r.name === "Zod");
  // Zod 用于 Breath of the Dying, Obsession, Void 共 3 个符文之语
  assert.equal(zod.total, 3);
  assert.equal(zod.remaining, 3);

  const ber = all.runes.find((r) => r.name === "Ber");
  // Ber 用于 Beast(1), Chains of Honor(1), Destruction(1), Enigma(1), Eternity(1), Infinity(2), Last Wish(1), Wrath(1) = 9
  assert.equal(ber.total, 9);

  const afterEnigma = calculateRuneCounts(RUNEWORDS, new Set(["enigma"]));
  assert.equal(afterEnigma.completedRunewords, 1);
  assert.equal(afterEnigma.remainingRunesNeeded, all.totalRunesNeeded - 3);
  const berAfter = afterEnigma.runes.find((r) => r.name === "Ber");
  assert.equal(berAfter.total, 9);
  assert.equal(berAfter.remaining, 8);
  assert.equal(berAfter.completed, 1);
});

test("getRunewordsCatalog 返回完整符文与符文之语信息", () => {
  const catalog = getRunewordsCatalog();
  assert.equal(catalog.version, "3.4");
  assert.equal(catalog.totalRunewords, 99);
  assert.equal(catalog.runes.length, 33);
  assert.equal(catalog.runewords.length, 99);
  const enigma = catalog.runewords.find((rw) => rw.id === "enigma");
  assert.equal(enigma.reqLevel, 65);
  assert.equal(enigma.ladderStatus, "universal");
  assert.equal(enigma.ladderLabel, "非赛/赛季通用");
  assert.ok(Array.isArray(enigma.stats) && enigma.stats.length > 0);

  for (const rw of catalog.runewords) {
    const hasStats = Array.isArray(rw.stats) && rw.stats.length > 0;
    const hasGroups = Array.isArray(rw.statGroups) && rw.statGroups.length > 0;
    assert.ok(hasStats || hasGroups, `${rw.name} 必须包含详细属性资料`);
  }

  const spirit = catalog.runewords.find((rw) => rw.id === "spirit");
  assert.ok(Array.isArray(spirit.statGroups) && spirit.statGroups.length === 3);
});
