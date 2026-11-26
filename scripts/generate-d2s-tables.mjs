#!/usr/bin/env node
// Generates public/assets/d2s-tables.js from official D2R 3.4 extracted excel & string tables.
// Sources:
//   extracted/data/global/excel/itemstatcost.txt
//   extracted/data/global/excel/uniqueitems.txt
//   extracted/data/global/excel/setitems.txt
//   extracted/data/global/excel/runes.txt
//   extracted/data/global/excel/skills.txt
//   extracted/data/local/lng/strings/item-names.json
//   extracted/data/local/lng/strings/item-runes.json

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ALL_UNIQUE_ITEMS } from "../src/items-sets-uniques-data.js";
import { SET_DETAILS } from "../src/items-set-details.js";
import { RUNEWORDS } from "../src/runewords-metadata.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const EXCEL = path.join(ROOT, "extracted/data/global/excel");
const STRINGS = path.join(ROOT, "extracted/data/local/lng/strings");
const OUT = path.join(ROOT, "public/assets/d2s-tables.js");

function readTsv(filePath) {
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/).filter(Boolean);
  const headers = lines[0].split("\t");
  return lines.slice(1).map((line, rowIdx) => {
    const cols = line.split("\t");
    const obj = { _row: rowIdx };
    headers.forEach((h, i) => {
      obj[h] = cols[i] ?? "";
    });
    return obj;
  });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function normName(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*/g, "")
    .replace(/^the\s+/, "")
    .replace(/[^a-z0-9]/g, "");
}

// 1. ItemStatCost.txt -> { [statId]: [saveBits, saveAdd, saveParamBits] }
const iscRows = readTsv(path.join(EXCEL, "itemstatcost.txt"));
const itemStatSpecs = {};
for (const r of iscRows) {
  const id = Number(r["*ID"]);
  const bits = Number(r["Save Bits"] || 0);
  if (!Number.isFinite(id) || bits <= 0) continue;
  const saveAdd = Number(r["Save Add"] || 0);
  const paramBits = Number(r["Save Param Bits"] || 0);
  itemStatSpecs[id] = [bits, saveAdd, paramBits];
}

// Load localization maps
const itemNames = readJson(path.join(STRINGS, "item-names.json"));
const keyToEn = new Map();
for (const row of itemNames) {
  if (row.Key && row.enUS) {
    keyToEn.set(row.Key, row.enUS);
    keyToEn.set(row.Key.toLowerCase(), row.enUS);
  }
}

// 2. UniqueItems.txt -> exact *ID map (keyed by simulator nameEn + canonical display/index names)
const uRows = readTsv(path.join(EXCEL, "uniqueitems.txt")).filter((r) => r.index && r["*ID"] !== "");
const uByNorm = new Map();
for (const r of uRows) {
  const id = Number(r["*ID"]);
  if (!Number.isFinite(id)) continue;
  const dispEn = keyToEn.get(r.index) || keyToEn.get(r.index.toLowerCase()) || "";
  for (const nm of [r.index, dispEn]) {
    if (!nm) continue;
    const k = normName(nm);
    if (k && !uByNorm.has(k)) uByNorm.set(k, id);
  }
}

const uniqueIds = {};
const uMissed = [];
for (const u of ALL_UNIQUE_ITEMS) {
  const id = uByNorm.get(normName(u.nameEn));
  if (id === undefined) {
    uMissed.push(u.nameEn);
    continue;
  }
  uniqueIds[u.nameEn] = id;
  // Also include clean name without parenthetical alias (e.g. "Harlequin Crest" for "Harlequin Crest (Shako)")
  const cleanEn = u.nameEn.replace(/\s*\([^)]*\)\s*/g, "").trim();
  if (cleanEn && cleanEn !== u.nameEn && uniqueIds[cleanEn] === undefined) {
    uniqueIds[cleanEn] = id;
  }
}
// Ensure all unique charms & sunder charms are present
for (const r of uRows.filter((x) => x.code === "cm1" || x.code === "cm2" || x.code === "cm3")) {
  const id = Number(r["*ID"]);
  if (uniqueIds[r.index] === undefined) uniqueIds[r.index] = id;
}

// 3. SetItems.txt -> 0-based setId excluding the "Expansion" divider row
const sRows = readTsv(path.join(EXCEL, "setitems.txt")).filter((r) => r.index && r.index !== "Expansion");
const sByNorm = new Map();
sRows.forEach((r, idx) => {
  const dispEn = keyToEn.get(r.index) || keyToEn.get(r.index.toLowerCase()) || "";
  for (const nm of [r.index, dispEn]) {
    if (!nm) continue;
    const k = normName(nm);
    if (k && !sByNorm.has(k)) sByNorm.set(k, idx);
  }
});

const SET_NAME_ALIASES = {
  "Whistan's Guard": "Whitstan's Guard"
};

const setIds = {};
const sMissed = [];
for (const detail of Object.values(SET_DETAILS)) {
  for (const p of detail.pieces || []) {
    const lookup = SET_NAME_ALIASES[p.nameEn] || p.nameEn;
    const id = sByNorm.get(normName(lookup));
    if (id === undefined) {
      sMissed.push(p.nameEn);
      continue;
    }
    setIds[p.nameEn] = id;
    if (lookup !== p.nameEn) setIds[lookup] = id;
  }
}

// 4. Runes.txt + item-runes.json -> 12-bit runewordId (item-runes.json[Name].id & 0xfff)
const rwRows = readTsv(path.join(EXCEL, "runes.txt")).filter((r) => r.complete === "1");
const runesJson = readJson(path.join(STRINGS, "item-runes.json"));
const rjByKey = new Map(runesJson.map((r) => [r.Key, r]));
const rwByNorm = new Map();
for (const r of rwRows) {
  const entry = rjByKey.get(r.Name);
  if (!entry) continue;
  const id12 = entry.id & 0xfff;
  for (const nm of [r["*Rune Name"], entry.enUS, String(r["*Rune Name"] || "").replace(/\s*\([^)]*\)/g, "")]) {
    if (!nm) continue;
    const k = normName(nm);
    if (k && !rwByNorm.has(k)) rwByNorm.set(k, id12);
  }
}

const runewordIds = {};
const rwMissed = [];
for (const rw of RUNEWORDS) {
  const id12 = rwByNorm.get(normName(rw.name));
  if (id12 === undefined) {
    rwMissed.push(`${rw.id}:${rw.name}`);
    continue;
  }
  runewordIds[rw.id] = id12;
}

// 5. Skills.txt -> Aura & Oskill IDs
const skRows = readTsv(path.join(EXCEL, "skills.txt"));
const skByName = new Map(skRows.filter((r) => r.skill && r["*Id"] !== "").map((r) => [r.skill, Number(r["*Id"])]));

const auraSkillMap = {
  力量: skByName.get("Might"),
  祈祷: skByName.get("Prayer"),
  荆棘: skByName.get("Thorns"),
  反抗: skByName.get("Defiance"),
  祝福瞄准: skByName.get("Blessed Aim"),
  净化: skByName.get("Cleansing"),
  专注: skByName.get("Concentration"),
  神圣火焰: skByName.get("Holy Fire"),
  神圣冰冻: skByName.get("Holy Freeze"),
  活力: skByName.get("Vigor"),
  神圣冲击: skByName.get("Holy Shock"),
  圣冲击: skByName.get("Holy Shock"),
  庇护所: skByName.get("Sanctuary"),
  冥想: skByName.get("Meditation"),
  狂热: skByName.get("Fanaticism"),
  信念: skByName.get("Conviction"),
  救赎: skByName.get("Redemption"),
  救助: skByName.get("Salvation")
};

const oskillNames = [
  "Teleport", "Battle Command", "Battle Orders", "Battle Cry",
  "Whirlwind", "Zeal", "Berserk", "Enchant", "Fire Ball", "Meteor", "Fire Wall",
  "Warmth", "Inferno", "Static Field", "Feral Rage", "Arctic Blast", "Fury",
  "Guided Arrow", "Valkyrie", "Slow Missiles", "Werewolf", "Shape Shifting"
];
const oskillIds = {};
for (const nm of oskillNames) {
  const id = skByName.get(nm);
  if (id !== undefined) oskillIds[nm] = id;
}
// Canonical aliases for Druid shape skills
if (skByName.has("Werewolf")) oskillIds.Werebear = skByName.get("Wearbear") ?? 228;
if (skByName.has("Shape Shifting")) oskillIds.Lycanthropy = skByName.get("Shape Shifting");

const charmUniqueIds = {
  anni: uniqueIds["Annihilus"],
  torch: uniqueIds["Hellfire Torch"],
  gheed: uniqueIds["Gheed's Fortune"],
  "sunder-cold": uniqueIds["Cold Rupture"],
  "sunder-fire": uniqueIds["Flame Rift"],
  "sunder-ltng": uniqueIds["Crack of the Heavens"],
  "sunder-pois": uniqueIds["Rotting Fissure"],
  "sunder-phys": uniqueIds["Bone Break"],
  "sunder-mag": uniqueIds["Black Cleft"]
};

// 6. AdvancedStashStackable items (91 official D2R 3.4 stackables from misc.txt) & item grid sizes (armor/weapons/misc)
const miscRows = readTsv(path.join(EXCEL, "misc.txt"));
const armorRows = readTsv(path.join(EXCEL, "armor.txt"));
const weaponRows = readTsv(path.join(EXCEL, "weapons.txt"));

const locByKey = new Map();
for (const row of [...itemNames, ...runesJson]) {
  if (row.Key) locByKey.set(row.Key, row);
}

const STACK_ZH_FALLBACK = {
  gsb: "蓝宝石",
  gsg: "绿宝石",
  gsr: "红宝石",
  gsw: "钻石",
  toa: "赦免徽章（洗点）",
  xa1: "西部世界之石碎片",
  xa2: "东部世界之石碎片",
  xa3: "南部世界之石碎片",
  xa4: "深渊世界之石碎片",
  xa5: "北部世界之石碎片"
};

const advStackables = {};
for (const r of miscRows) {
  if (r.AdvancedStashStackable !== "1" || !r.code) continue;
  const loc = locByKey.get(r.namestr) || locByKey.get(r.code);
  const type = r.type || "";
  const cat = type === "rune"
    ? "rune"
    : type.startsWith("gem")
      ? "gem"
      : type === "rpot"
        ? "pot"
        : "mat";
  const complex = type === "ques";
  const en = (loc && loc.enUS) || r.name || r.code;
  let zh = STACK_ZH_FALLBACK[r.code] || (loc && loc.zhCN) || en;
  if (cat === "rune") {
    const num = Number(r.code.slice(1));
    const shortEn = en.replace(/\s+Rune$/i, "");
    zh = `${num}# ${shortEn} (${zh.replace(/符文$/, "")})`;
  }
  advStackables[r.code] = {
    cat,
    complex,
    w: Number(r.invwidth) || 1,
    h: Number(r.invheight) || 1,
    nameZh: zh,
    nameEn: en
  };
}

// Compact [w, h] grid sizes for all non-1x1 items (for exact 10x10 stash auto-packing without overlap)
const itemSizes = {};
for (const r of [...armorRows, ...weaponRows, ...miscRows]) {
  const code = String(r.code || "").trim().toLowerCase();
  if (!code) continue;
  const w = Math.max(1, Number(r.invwidth) || 1);
  const h = Math.max(1, Number(r.invheight) || 1);
  if (w !== 1 || h !== 1) itemSizes[code] = [w, h];
}

// Sanity assertions against verified native D2R 3.4 v105 ground truth (AbyssLock.d2s & ModernSharedStashSoftCoreV2.d2i)
const assertEq = (label, got, exp) => {
  if (got !== exp) throw new Error(`Ground-truth mismatch for ${label}: got ${got}, expected ${exp}`);
};
assertEq("Harlequin Crest", uniqueIds["Harlequin Crest"], 248);
assertEq("Mara's Kaleidoscope", uniqueIds["Mara's Kaleidoscope"], 272);
assertEq("Andariel's Visage", uniqueIds["Andariel's Visage"], 345);
assertEq("Arachnid Mesh", uniqueIds["Arachnid Mesh"], 373);
assertEq("Annihilus", uniqueIds["Annihilus"], 381);
assertEq("Hellfire Torch", uniqueIds["Hellfire Torch"], 400);
assertEq("Wraithstep", uniqueIds["Wraithstep"], 413);
assertEq("Trang-Oul's Claws", setIds["Trang-Oul's Claws"], 88);
assertEq("breath-of-the-dying", runewordIds["breath-of-the-dying"], 37);
assertEq("call-to-arms", runewordIds["call-to-arms"], 39);
assertEq("enigma", runewordIds["enigma"], 59);
assertEq("fortitude", runewordIds["fortitude"], 67);
assertEq("spirit", runewordIds["spirit"], 155);
assertEq("void", runewordIds["void"], 182);
assertEq("infinity", runewordIds["infinity"], 86);
assertEq("item_maxhp_percent", itemStatSpecs[76]?.[1], 10);
assertEq("item_deadlystrike", itemStatSpecs[141]?.[0], 7);
assertEq("advStackables count", Object.keys(advStackables).length, 91);
assertEq("toa complex", advStackables.toa?.complex, true);
assertEq("r30 simple", advStackables.r30?.complex, false);
assertEq("pk1 size", itemSizes.pk1?.join("x"), "1x2");
assertEq("xtp size", itemSizes.xtp?.join("x"), "2x3");

if (uMissed.length || sMissed.length || rwMissed.length) {
  console.warn("Unmatched entries:", { uMissed, sMissed, rwMissed });
}

const sortObj = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));

const output = [
  "// Auto-generated from official D2R 3.4 excel & string tables by scripts/generate-d2s-tables.mjs",
  "// Verified against native D2R 3.4 v105 saves (AbyssLock.d2s).",
  "",
  `export const D2S_ITEM_STAT_SPECS = ${JSON.stringify(itemStatSpecs)};`,
  "",
  `export const D2S_UNIQUE_IDS = ${JSON.stringify(sortObj(uniqueIds), null, 2)};`,
  "",
  `export const D2S_SET_IDS = ${JSON.stringify(sortObj(setIds), null, 2)};`,
  "",
  `export const D2S_RUNEWORD_IDS = ${JSON.stringify(sortObj(runewordIds), null, 2)};`,
  "",
  `export const D2S_CHARM_UNIQUE_IDS = ${JSON.stringify(charmUniqueIds, null, 2)};`,
  "",
  `export const D2S_AURA_SKILL_IDS = ${JSON.stringify(auraSkillMap, null, 2)};`,
  "",
  `export const D2S_OSKILL_IDS = ${JSON.stringify(sortObj(oskillIds), null, 2)};`,
  "",
  `export const D2S_ADV_STACKABLE_META = ${JSON.stringify(advStackables, null, 2)};`,
  "",
  `export const D2S_ITEM_SIZES = ${JSON.stringify(sortObj(itemSizes))};`,
  ""
].join("\n");

fs.writeFileSync(OUT, output, "utf8");
console.log("Generated public/assets/d2s-tables.js:", {
  stats: Object.keys(itemStatSpecs).length,
  uniques: Object.keys(uniqueIds).length,
  sets: Object.keys(setIds).length,
  runewords: Object.keys(runewordIds).length,
  advStackables: Object.keys(advStackables).length,
  itemSizes: Object.keys(itemSizes).length,
  bytes: Buffer.byteLength(output)
});
