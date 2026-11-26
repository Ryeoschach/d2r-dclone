import assert from "node:assert/strict";
import test from "node:test";

import {
  D2S_ADV_STACKABLE_META,
  D2S_ITEM_SIZES,
  D2S_MAGIC,
  buildD2sBuffer,
  computeD2sChecksum,
  lookupRunewordId,
  lookupSetId,
  lookupUniqueId
} from "../public/assets/d2s-exporter.js";
import {
  buildD2iBuffer,
  encodeAdvancedStackItem,
  getItemGridSize,
  packItemsInto10x10,
  parseD2iBuffer
} from "../public/assets/d2i-stash.js";
import { getSkillsCatalog } from "../src/skills-catalog.js";
import { getPaperdollCatalog } from "../src/paperdoll-data.js";

test("D2R 3.4 仓库 10x10 自动排版不重叠且正确识别超额物品", () => {
  assert.equal(Object.keys(D2S_ADV_STACKABLE_META).length, 91);
  assert.deepEqual(getItemGridSize("xtp"), [2, 3]);
  assert.deepEqual(getItemGridSize("pk1"), [1, 2]);
  assert.deepEqual(getItemGridSize("r30"), [1, 1]);
  assert.ok(Object.keys(D2S_ITEM_SIZES).length >= 500);

  // Fill 10x10 with 15 x (2x3=6 cells -> 5x3 grid = 90 cells) + 10 x (1x1 -> bottom row = 10 cells) = 100 cells exact, plus 1 overflow
  const specs = [
    ...Array.from({ length: 15 }, (_, i) => ({ code: "xtp", id: "armor-" + i })),
    ...Array.from({ length: 11 }, (_, i) => ({ code: "r30", id: "rune-" + i }))
  ];
  const packed = packItemsInto10x10(specs);
  assert.equal(packed.placed.length, 25);
  assert.equal(packed.overflow.length, 1);
  assert.equal(packed.usedCells, 100);
  assert.equal(packed.freeCells, 0);

  // Verify zero coordinate overlaps
  const seen = new Set();
  for (const p of packed.placed) {
    assert.equal(p.storePage, 5);
    assert.equal(p.location, 0);
    for (let dx = 0; dx < p.w; dx += 1) {
      for (let dy = 0; dy < p.h; dy += 1) {
        const key = `${p.x + dx},${p.y + dy}`;
        assert.equal(seen.has(key), false, `Grid overlap at ${key}`);
        seen.add(key);
      }
    }
  }
});

test("D2R 3.4 (.d2i) 共享仓库 7 页生成、91 种可堆叠物 (1–99) 编码与增量合并保留编年史", () => {
  // Single stackable byte-length verification against native ModernSharedStashSoftCoreV2.d2i
  assert.equal(encodeAdvancedStackItem("r30", 99).length, 11);
  assert.equal(encodeAdvancedStackItem("toa", 99).length, 18);
  assert.equal(encodeAdvancedStackItem("xa1", 50).length, 18);
  assert.equal(encodeAdvancedStackItem("ua5", 16).length, 18);

  // 1. Fresh 7-tab Softcore .d2i with gear in Tab 0 & Tab 1 + all 91 stackables at varied quantities
  const allStacks = {};
  const codes = Object.keys(D2S_ADV_STACKABLE_META);
  codes.forEach((code, idx) => {
    allStacks[code] = idx % 3 === 0 ? 99 : idx % 3 === 1 ? 16 : 5;
  });

  const fresh = buildD2iBuffer({
    normalTabItems: [
      [
        {
          code: "ci3",
          quality: 7,
          uniqueId: lookupUniqueId("Griffon's Eye"),
          isArmor: true,
          defense: 60,
          maxDur: 40,
          stats: [{ id: 127, val: 1 }, { id: 105, val: 25 }, { id: 330, val: 15 }, { id: 334, val: 20 }]
        },
        {
          code: "xtp",
          quality: 2,
          runewordId: lookupRunewordId("enigma"),
          socketRuneCodes: ["r31", "r06", "r30"],
          isArmor: true,
          defense: 261,
          maxDur: 60,
          runewordStats: [{ id: 127, val: 2 }, { id: 96, val: 45 }, { id: 97, param: 54, val: 1 }]
        }
      ],
      [
        {
          code: "xmg",
          quality: 5,
          setId: lookupSetId("Trang-Oul's Claws"),
          isArmor: true,
          defense: 74,
          maxDur: 14,
          stats: [{ id: 105, val: 20 }, { id: 43, val: 30 }]
        }
      ],
      [],
      [],
      []
    ],
    stackables: allStacks,
    gold: 2500000,
    hardcore: false
  });

  assert.equal(fresh.filename, "ModernSharedStashSoftCoreV2.d2i");
  assert.equal(fresh.meta.version, 105);
  assert.equal(fresh.meta.addedGearCount, 3);
  assert.equal(fresh.meta.overflowGearCount, 0);
  assert.equal(fresh.meta.stackTypeCount, 91);

  const parsed = parseD2iBuffer(fresh.bytes);
  assert.equal(parsed.version, 105);
  assert.equal(parsed.tabCount, 7);
  assert.equal(parsed.totalNormalItems, 3);
  assert.equal(parsed.totalStackTypes, 91);
  assert.equal(parsed.stackables.r30, allStacks.r30);
  assert.equal(parsed.stackables.toa, allStacks.toa);
  assert.equal(parsed.stackables.xa1, allStacks.xa1);
  assert.equal(parsed.stackables.ua5, allStacks.ua5);
  assert.equal(parsed.stackables.gpv, allStacks.gpv);
  assert.equal(parsed.chronicleTab.tabLen, 148);

  // 2. Non-destructive incremental merge onto existing .d2i (preserving Tabs 0..4 gear, updating stackables, preserving Chronicle verbatim)
  const merged = buildD2iBuffer({
    baseD2iBytes: fresh.bytes,
    normalTabItems: [
      [
        {
          code: "uap",
          quality: 7,
          uniqueId: lookupUniqueId("Harlequin Crest"),
          isArmor: true,
          defense: 141,
          maxDur: 12,
          stats: [{ id: 127, val: 2 }, { id: 36, val: 10 }, { id: 80, val: 50 }]
        }
      ],
      [], [], [], []
    ],
    stackables: { r30: 77, r31: 88, r01: 0 },
    hardcore: true
  });
  assert.equal(merged.filename, "ModernSharedStashHardCoreV2.d2i");
  assert.equal(merged.meta.mergedFromExisting, true);
  assert.equal(merged.meta.addedGearCount, 1);

  const reparsed = parseD2iBuffer(merged.bytes);
  assert.equal(reparsed.totalNormalItems, 4);
  assert.equal(reparsed.stackables.r30, 77);
  assert.equal(reparsed.stackables.r31, 88);
  assert.equal(reparsed.stackables.r01, undefined);
  assert.equal(reparsed.totalStackTypes, 90);
  assert.equal(
    Buffer.compare(Buffer.from(parsed.chronicleTab.raw), Buffer.from(reparsed.chronicleTab.raw)),
    0,
    "Chronicle tab bytes must be preserved verbatim during merge"
  );
});

test("D2R 3.4 (.d2s) 角色个人仓库 (storePage=5) 支持任意暗金/符文之语/材料导出且校验和合法", () => {
  const warCls = getSkillsCatalog().classes.find((c) => c.id === "war");
  const pdCat = getPaperdollCatalog();
  const packedStash = packItemsInto10x10([
    {
      code: "ci3",
      quality: 7,
      uniqueId: lookupUniqueId("Griffon's Eye"),
      isArmor: true,
      defense: 60,
      maxDur: 40,
      stats: [{ id: 127, val: 1 }, { id: 105, val: 25 }]
    },
    {
      code: "r30",
      simple: true
    },
    {
      code: "toa",
      simple: false,
      quality: 2,
      ilvl: 85,
      stats: []
    }
  ]);

  const res = buildD2sBuffer({
    name: "StashTester",
    classId: "war",
    level: 95,
    charBaseStats: pdCat.charBaseStats.war,
    classSkills: warCls.skills,
    stashItems: packedStash.placed
  });
  assert.equal(res.meta.version, 105);
  assert.equal(res.meta.stashItemCount, 3);
  assert.equal(res.meta.itemCount, 3);
  const dv = new DataView(res.bytes.buffer);
  assert.equal(dv.getUint32(0, true), D2S_MAGIC);
  assert.equal(dv.getInt32(12, true), computeD2sChecksum(res.bytes));
});
