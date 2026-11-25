import assert from "node:assert/strict";
import test from "node:test";

import {
  D2R_HUFFMAN_CODES,
  D2S_MAGIC,
  mapParsedD2sToPaperdoll,
  parseD2sBuffer
} from "../public/assets/d2s-parser.js";
import {
  buildD2sBuffer,
  computeD2sChecksum
} from "../public/assets/d2s-exporter.js";
import { getSkillsCatalog } from "../src/skills-catalog.js";
import { getPaperdollCatalog } from "../src/paperdoll-data.js";
import { getRunewordsCatalog } from "../src/runewords-metadata.js";
import { getItemsCatalog } from "../src/items-metadata.js";

class BitWriter {
  constructor() {
    this.bits = [];
  }
  writeBits(value, count) {
    for (let i = 0; i < count; i += 1) {
      this.bits.push((Math.floor(value / 2 ** i)) & 1);
    }
  }
  alignToByte() {
    while (this.bits.length % 8 !== 0) this.bits.push(0);
  }
  toUint8Array() {
    this.alignToByte();
    const out = new Uint8Array(this.bits.length / 8);
    for (let i = 0; i < this.bits.length; i += 1) {
      if (this.bits[i]) out[i >>> 3] |= 1 << (i & 7);
    }
    return out;
  }
}

function encodeV96Item({
  code,
  location = 1,
  equippedId = 0,
  storePage = 0,
  simple = false,
  ethereal = false,
  socketed = false,
  runeword = false,
  quality = 2,
  nrOfItemsInSockets = 0
}) {
  const bw = new BitWriter();
  bw.writeBits(0x4a, 8); // 'J'
  bw.writeBits(0x4d, 8); // 'M'
  bw.writeBits(0, 4); // 0..3
  bw.writeBits(1, 1); // 4 identified
  bw.writeBits(0, 6); // 5..10
  bw.writeBits(socketed ? 1 : 0, 1); // 11 socketed
  bw.writeBits(0, 1); // 12
  bw.writeBits(0, 1); // 13 new
  bw.writeBits(0, 2); // 14..15
  bw.writeBits(0, 1); // 16 ear
  bw.writeBits(0, 1); // 17 starter
  bw.writeBits(0, 3); // 18..20
  bw.writeBits(simple ? 1 : 0, 1); // 21 simple
  bw.writeBits(ethereal ? 1 : 0, 1); // 22 ethereal
  bw.writeBits(0, 1); // 23
  bw.writeBits(0, 1); // 24 personalized
  bw.writeBits(0, 1); // 25
  bw.writeBits(runeword ? 1 : 0, 1); // 26 runeword
  bw.writeBits(0, 5); // 27..31
  bw.writeBits(101, 10); // v96 version
  bw.writeBits(location, 3);
  bw.writeBits(equippedId, 4);
  bw.writeBits(0, 4); // x
  bw.writeBits(0, 4); // y
  bw.writeBits(storePage, 3);
  const padded = code.padEnd(4, " ");
  for (let i = 0; i < 4; i += 1) {
    bw.writeBits(padded.charCodeAt(i), 8);
  }
  if (!simple) {
    bw.writeBits(nrOfItemsInSockets, 3);
    bw.writeBits(0x12345678, 32); // id
    bw.writeBits(85, 7); // ilvl
    bw.writeBits(quality, 4);
    bw.writeBits(0, 1); // multipleGfx
    bw.writeBits(0, 1); // classAuto
    if (quality === 7) bw.writeBits(100, 12);
    if (quality === 5) bw.writeBits(10, 12);
  }
  return bw.toUint8Array();
}

function concatBytes(chunks) {
  const total = chunks.reduce((s, c) => s + c.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return out;
}

function buildSyntheticD2s({
  version = 96,
  name = "Hero",
  extendedName = "",
  classCode = 3,
  level = 90,
  statusByte = 0x20,
  activeWeaponSet = 0,
  mercSeed = 0x1234,
  mercTypeId = 11,
  attrs = { 0: 100, 1: 20, 2: 120, 3: 250, 12: 90 },
  skills = new Uint8Array(30),
  playerItemBytes = [],
  playerItemCount = 0,
  mercItemBytes = [],
  mercItemCount = 0
}) {
  const header = new Uint8Array(0x2fd);
  const hv = new DataView(header.buffer);
  hv.setUint32(0, D2S_MAGIC, true);
  hv.setUint32(4, version, true);
  hv.setUint32(16, activeWeaponSet, true);

  if (name) {
    const enc = new TextEncoder().encode(name);
    header.set(enc.subarray(0, 15), 0x14);
  }
  if (extendedName) {
    const enc = new TextEncoder().encode(extendedName);
    header.set(enc.subarray(0, 15), 0x10b);
  }
  header[0x24] = statusByte;
  header[0x28] = classCode;
  header[0x2b] = level;
  hv.setUint16(0xb1, 0, true);
  hv.setUint32(0xb3, mercSeed, true);
  hv.setUint16(0xb9, mercTypeId, true);

  // gf attributes bitstream
  const attrBits = { 0: 10, 1: 10, 2: 10, 3: 10, 4: 10, 5: 8, 6: 21, 7: 21, 8: 21, 9: 21, 10: 21, 11: 21, 12: 7, 13: 32, 14: 25, 15: 25 };
  const abw = new BitWriter();
  for (const [k, v] of Object.entries(attrs)) {
    const id = Number(k);
    abw.writeBits(id, 9);
    abw.writeBits(v, attrBits[id]);
  }
  abw.writeBits(0x1ff, 9);
  const gfSection = concatBytes([new Uint8Array([0x67, 0x66]), abw.toUint8Array()]);

  // if skills (30 bytes)
  const ifSection = concatBytes([new Uint8Array([0x69, 0x66]), skills]);

  // JM player items
  const jmHead = new Uint8Array(4);
  jmHead[0] = 0x4a; jmHead[1] = 0x4d;
  new DataView(jmHead.buffer).setUint16(2, playerItemCount, true);

  // jf merc items
  const jfParts = [new Uint8Array([0x6a, 0x66])];
  if (mercSeed !== 0) {
    const mHead = new Uint8Array(4);
    mHead[0] = 0x4a; mHead[1] = 0x4d;
    new DataView(mHead.buffer).setUint16(2, mercItemCount, true);
    jfParts.push(mHead, ...mercItemBytes);
  }

  const full = concatBytes([header, gfSection, ifSection, jmHead, ...playerItemBytes, ...jfParts]);
  new DataView(full.buffer).setUint32(8, full.length, true);
  return full;
}

function getTestCatalogs() {
  const sk = getSkillsCatalog();
  const pd = getPaperdollCatalog();
  const rw = getRunewordsCatalog();
  const it = getItemsCatalog();
  const setPieces = [];
  for (const s of it.sets || []) {
    for (const p of s.pieces || []) setPieces.push(p);
  }
  return {
    classes: sk.classes,
    charBaseStats: pd.charBaseStats,
    baseRules: pd.baseRules,
    rwList: rw.runewords,
    uniqueItems: it.uniqueItems,
    setPieces
  };
}

test("D2R 物品代码 Huffman 表严格无前缀冲突", () => {
  const entries = Object.entries(D2R_HUFFMAN_CODES);
  assert.equal(entries.length, 37);
  for (let i = 0; i < entries.length; i += 1) {
    for (let j = 0; j < entries.length; j += 1) {
      if (i === j) continue;
      assert.equal(
        entries[j][1].startsWith(entries[i][1]),
        false,
        `Huffman prefix collision between '${entries[i][0]}' and '${entries[j][0]}'`
      );
    }
  }
});

test("解析 LoD v96 圣骑士 .d2s 存档：属性、30 技能、符文之语主/副手、背包咒符与佣兵装备", () => {
  const catalogs = getTestCatalogs();
  const palCls = catalogs.classes.find((c) => c.id === "pal");
  const ordered = [...palCls.skills].sort((a, b) => a.id - b.id);
  const skills = new Uint8Array(30);
  const setSk = (key, pts) => {
    const idx = ordered.findIndex((s) => s.key === key);
    assert.ok(idx >= 0);
    skills[idx] = pts;
  };
  setSk("Fanaticism", 20);
  setSk("Holy Shield", 20);
  setSk("Zeal", 20);
  setSk("Sacrifice", 20);

  // Grief PB (Set I weapon: Eth+Tir+Lo+Mal+Ral)
  const grief = [
    encodeV96Item({ code: "7cr", location: 1, equippedId: 4, socketed: true, runeword: true, nrOfItemsInSockets: 5 }),
    encodeV96Item({ code: "r05", location: 6, simple: true }),
    encodeV96Item({ code: "r03", location: 6, simple: true }),
    encodeV96Item({ code: "r28", location: 6, simple: true }),
    encodeV96Item({ code: "r23", location: 6, simple: true }),
    encodeV96Item({ code: "r08", location: 6, simple: true })
  ];
  // Spirit Sacred Targe (Set I offhand: Tal+Thul+Ort+Amn)
  const spirit = [
    encodeV96Item({ code: "pab", location: 1, equippedId: 5, socketed: true, runeword: true, nrOfItemsInSockets: 4 }),
    encodeV96Item({ code: "r07", location: 6, simple: true }),
    encodeV96Item({ code: "r10", location: 6, simple: true }),
    encodeV96Item({ code: "r09", location: 6, simple: true }),
    encodeV96Item({ code: "r11", location: 6, simple: true })
  ];
  // CTA Crystal Sword (Set II swap weapon: Amn+Ral+Mal+Ist+Ohm)
  const cta = [
    encodeV96Item({ code: "crs", location: 1, equippedId: 11, socketed: true, runeword: true, nrOfItemsInSockets: 5 }),
    encodeV96Item({ code: "r11", location: 6, simple: true }),
    encodeV96Item({ code: "r08", location: 6, simple: true }),
    encodeV96Item({ code: "r23", location: 6, simple: true }),
    encodeV96Item({ code: "r24", location: 6, simple: true }),
    encodeV96Item({ code: "r27", location: 6, simple: true })
  ];
  // Inventory: Anni (unique cm1), Torch (unique cm2), Cube (box)
  const bag = [
    encodeV96Item({ code: "cm1", location: 0, storePage: 1, quality: 7 }),
    encodeV96Item({ code: "cm2", location: 0, storePage: 1, quality: 7 }),
    encodeV96Item({ code: "box", location: 0, storePage: 1, simple: true })
  ];
  // Mercenary: Eth Infinity (Ber+Mal+Ber+Ist) in 7wc
  const mercInf = [
    encodeV96Item({ code: "7wc", location: 1, equippedId: 4, ethereal: true, socketed: true, runeword: true, nrOfItemsInSockets: 4 }),
    encodeV96Item({ code: "r30", location: 6, simple: true }),
    encodeV96Item({ code: "r23", location: 6, simple: true }),
    encodeV96Item({ code: "r30", location: 6, simple: true }),
    encodeV96Item({ code: "r24", location: 6, simple: true })
  ];

  const buf = buildSyntheticD2s({
    version: 96,
    name: "SmiterPro",
    classCode: 3,
    level: 93,
    statusByte: 0x24, // Hardcore + Expansion
    activeWeaponSet: 0,
    mercSeed: 0x9988,
    mercTypeId: 11,
    attrs: { 0: 125, 1: 15, 2: 135, 3: 310, 12: 93 },
    skills,
    playerItemBytes: [...grief, ...spirit, ...cta, ...bag],
    playerItemCount: 6,
    mercItemBytes: mercInf,
    mercItemCount: 1
  });

  const parsed = parseD2sBuffer(buf, "SmiterPro.d2s");
  assert.equal(parsed.name, "SmiterPro");
  assert.equal(parsed.classId, "pal");
  assert.equal(parsed.level, 93);
  assert.equal(parsed.status.hardcore, true);
  assert.equal(parsed.mercEnabled, true);
  assert.equal(parsed.mercVariant, "a2-might");

  const mapped = mapParsedD2sToPaperdoll(parsed, catalogs);
  assert.equal(mapped.classId, "pal");
  assert.equal(mapped.totalSkillPts, 80);
  assert.equal(mapped.skills.Fanaticism, 20);
  assert.equal(mapped.skills["Holy Shield"], 20);
  // Paladin base stats: str 25, dex 20, vit 25, enr 15
  assert.deepEqual(mapped.statAlloc, { str: 100, dex: 115, vit: 285, enr: 0 });
  assert.equal(mapped.charLoadout.weapon.id, "grief");
  assert.equal(mapped.charLoadout.weapon.baseCode, "7cr");
  assert.equal(mapped.charLoadout.offhand.id, "spirit");
  assert.equal(mapped.charLoadout.offhand.baseCode, "pab");
  assert.equal(mapped.swapLoadout.weapon.id, "call-to-arms");
  assert.equal(mapped.swapLoadout.weapon.baseCode, "crs");
  assert.deepEqual(mapped.charBag.map((b) => b.charmId), ["anni", "torch", "util-cube"]);
  assert.equal(mapped.mercLoadout.weapon.id, "infinity");
  assert.equal(mapped.mercLoadout.weapon.eth, true);
});

test("解析 D2R 3.4 v100 术士 (Warlock) 存档：扩展名、职业 7、副手激活与 30 技能硬点", () => {
  const catalogs = getTestCatalogs();
  const warCls = catalogs.classes.find((c) => c.id === "war");
  const ordered = [...warCls.skills].sort((a, b) => a.id - b.id);
  const skills = new Uint8Array(30);
  skills[0] = 20; // Summon Goatman (id 373)
  skills[1] = 20; // Demonic Mastery (id 374)

  const buf = buildSyntheticD2s({
    version: 100,
    name: "",
    extendedName: "术士领主",
    classCode: 7,
    level: 96,
    statusByte: 0x60, // Ladder + Expansion
    activeWeaponSet: 1, // Set II active
    mercSeed: 0,
    attrs: { 0: 95, 1: 40, 2: 80, 3: 325, 12: 96 },
    skills,
    playerItemCount: 0
  });

  const parsed = parseD2sBuffer(buf, "Warlock.d2s");
  assert.equal(parsed.version, 100);
  assert.equal(parsed.name, "术士领主");
  assert.equal(parsed.classId, "war");
  assert.equal(parsed.level, 96);
  assert.equal(parsed.status.ladder, true);
  assert.equal(parsed.activeWeaponSet, 2);
  assert.equal(parsed.mercEnabled, false);

  const mapped = mapParsedD2sToPaperdoll(parsed, catalogs);
  assert.equal(mapped.skills[ordered[0].key], 20);
  assert.equal(mapped.skills[ordered[1].key], 20);
  assert.equal(mapped.totalSkillPts, 40);
});

test("拒绝非法文件头或截断损坏的 .d2s 文件", () => {
  assert.throws(() => parseD2sBuffer(new Uint8Array(64)), /文件过小/);
  const badMagic = new Uint8Array(1024);
  badMagic[0] = 0x00;
  assert.throws(() => parseD2sBuffer(badMagic), /文件头签名不匹配/);
});

test("反向导出 .d2s 单机存档（含 32 位旋转校验和与 D2R 3.4 术士）并往返解析完全一致", () => {
  const catalogs = getTestCatalogs();

  // Case 1: Paladin Lv.93 Hammerdin (v99)
  const palCls = catalogs.classes.find((c) => c.id === "pal");
  const palExport = buildD2sBuffer({
    name: "HammerHero",
    classId: "pal",
    level: 93,
    activeWeaponSet: 1,
    statAlloc: { str: 35, dex: 120, vit: 310, enr: 0 },
    charBaseStats: catalogs.charBaseStats.pal,
    skills: { "Blessed Hammer": 20, Concentration: 20, Vigor: 20, "Blessed Aim": 20, "Holy Shield": 15 },
    classSkills: palCls.skills,
    mercEnabled: true,
    mercVariant: "a2-hf"
  });
  assert.equal(palExport.filename, "HammerHero.d2s");
  assert.equal(palExport.meta.version, 99);
  assert.equal(palExport.meta.usedSkillPts, 95);

  const palView = new DataView(palExport.bytes.buffer);
  assert.equal(palView.getUint32(0, true), D2S_MAGIC);
  assert.equal(palView.getUint32(8, true), palExport.bytes.length);
  assert.equal(palView.getInt32(12, true), computeD2sChecksum(palExport.bytes));

  const palParsed = parseD2sBuffer(palExport.bytes, palExport.filename);
  const palMapped = mapParsedD2sToPaperdoll(palParsed, catalogs);
  assert.equal(palMapped.classId, "pal");
  assert.equal(palMapped.name, "HammerHero");
  assert.equal(palMapped.level, 93);
  assert.equal(palMapped.activeWeaponSet, 1);
  assert.deepEqual(palMapped.statAlloc, { str: 35, dex: 120, vit: 310, enr: 0 });
  assert.equal(palMapped.skills["Blessed Hammer"], 20);
  assert.equal(palMapped.skills.Concentration, 20);
  assert.equal(palMapped.skills["Holy Shield"], 15);
  assert.equal(palMapped.totalSkillPts, 95);

  // Case 2: D2R 3.4 Warlock Lv.95 (v100, class 7, Set II active)
  const warCls = catalogs.classes.find((c) => c.id === "war");
  const warExport = buildD2sBuffer({
    name: "AbyssWarlock",
    classId: "war",
    level: 95,
    activeWeaponSet: 2,
    statAlloc: { str: 65, dex: 25, vit: 375, enr: 10 },
    charBaseStats: catalogs.charBaseStats.war,
    skills: { Abyss: 20, Apocalypse: 20, "Miasma Chains": 20, "Sigil Death": 20, "Enhanced Entropy": 20 },
    classSkills: warCls.skills,
    mercEnabled: true,
    mercVariant: "a2-might"
  });
  assert.equal(warExport.meta.version, 100);
  assert.equal(warExport.meta.classCode, 7);
  const warView = new DataView(warExport.bytes.buffer);
  assert.equal(warView.getInt32(12, true), computeD2sChecksum(warExport.bytes));

  const warParsed = parseD2sBuffer(warExport.bytes, warExport.filename);
  const warMapped = mapParsedD2sToPaperdoll(warParsed, catalogs);
  assert.equal(warMapped.classId, "war");
  assert.equal(warMapped.level, 95);
  assert.equal(warMapped.activeWeaponSet, 2);
  assert.deepEqual(warMapped.statAlloc, { str: 65, dex: 25, vit: 375, enr: 10 });
  assert.equal(warMapped.skills.Abyss, 20);
  assert.equal(warMapped.skills.Apocalypse, 20);
  assert.equal(warMapped.totalSkillPts, 100);
});
