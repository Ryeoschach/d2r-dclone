import assert from "node:assert/strict";
import test from "node:test";

import {
  D2R_HUFFMAN_CODES,
  D2S_MAGIC,
  mapParsedD2sToPaperdoll,
  parseD2sBuffer
} from "../public/assets/d2s-parser.js";
import {
  D2S_ITEM_STAT_SPECS,
  D2S_UNIQUE_IDS,
  D2S_SET_IDS,
  D2S_RUNEWORD_IDS,
  D2S_CHARM_UNIQUE_IDS,
  D2S_AURA_SKILL_IDS,
  D2S_OSKILL_IDS,
  buildD2sBuffer,
  computeD2sChecksum,
  computeMercExp,
  encodeD2rV5Item,
  lookupUniqueId,
  lookupSetId,
  lookupRunewordId
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
  assert.equal(palExport.meta.version, 105);
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

  // Case 2: D2R 3.4 Warlock Lv.95 (v105, class 7, Set II active, with Fanaticism bound demon)
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
    mercVariant: "a2-might",
    demonAura: "fana"
  });
  assert.equal(warExport.meta.version, 105);
  assert.equal(warExport.meta.demonAura, "fana");
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

  // Case 3: D2R 3.4 Warlock v105 with equipped Runeword (Enigma) + Unique (Shako) + Set (Trang-Oul's Claws) + Sunder/Anni/Cube + Mercenary Gear (Andy/Fortitude/Infinity) + Bound Demon
  const fullWar = buildD2sBuffer({
    name: "FullGearWar",
    classId: "war",
    level: 95,
    statAlloc: { str: 65, dex: 25, vit: 375, enr: 10 },
    charBaseStats: catalogs.charBaseStats.war,
    skills: { Abyss: 20, "Bind Demon": 20 },
    classSkills: warCls.skills,
    mercEnabled: true,
    mercVariant: "a2-might",
    demonAura: "fana",
    items: [
      {
        code: "xtp",
        location: 1,
        equippedId: 3,
        quality: 2,
        runewordId: lookupRunewordId("enigma"),
        socketRuneCodes: ["r31", "r06", "r30"],
        isArmor: true,
        defense: 261,
        maxDur: 60,
        runewordStats: [
          { id: 127, val: 2 },
          { id: 96, val: 45 },
          { id: 97, param: D2S_OSKILL_IDS.Teleport, val: 1 },
          { id: 31, val: 775 }
        ]
      },
      {
        code: "uap",
        location: 1,
        equippedId: 1,
        quality: 7,
        uniqueId: lookupUniqueId("Harlequin Crest"),
        isArmor: true,
        defense: 141,
        maxDur: 12,
        socketItems: [
          { code: "jew", simple: false, quality: 7, uniqueId: 392, ilvl: 85, stats: [{ id: 330, val: 5 }, { id: 334, val: 5 }] }
        ],
        socketCount: 1,
        stats: [{ id: 127, val: 2 }, { id: 36, val: 10 }, { id: 80, val: 50 }]
      },
      {
        code: "xmg",
        location: 1,
        equippedId: 10,
        quality: 5,
        setId: lookupSetId("Trang-Oul's Claws"),
        isArmor: true,
        defense: 74,
        maxDur: 14,
        stats: [{ id: 105, val: 20 }, { id: 43, val: 30 }, { id: 332, val: 25 }]
      },
      {
        code: "cm3",
        location: 0,
        storePage: 1,
        x: 0,
        y: 0,
        quality: 7,
        uniqueId: D2S_CHARM_UNIQUE_IDS["sunder-ltng"],
        stats: [{ id: 190, val: 300 }, { id: 41, val: -70 }]
      },
      {
        code: "cm1",
        location: 0,
        storePage: 1,
        x: 1,
        y: 0,
        quality: 7,
        uniqueId: D2S_CHARM_UNIQUE_IDS.anni,
        stats: [{ id: 127, val: 1 }, { id: 0, val: 20 }, { id: 39, val: 20 }]
      },
      {
        code: "box",
        location: 0,
        storePage: 1,
        x: 8,
        y: 0,
        quality: 2,
        ilvl: 85,
        stats: []
      }
    ],
    mercItems: [
      {
        code: "usk",
        location: 1,
        equippedId: 1,
        ethereal: true,
        quality: 7,
        uniqueId: lookupUniqueId("Andariel's Visage"),
        isArmor: true,
        defense: 154,
        maxDur: 20,
        socketItems: [
          { code: "jew", simple: false, quality: 4, ilvl: 85, stats: [{ id: 39, val: 30 }, { id: 93, val: 15 }] }
        ],
        socketCount: 1,
        stats: [{ id: 127, val: 2 }, { id: 16, val: 150 }, { id: 93, val: 20 }, { id: 60, val: 10 }, { id: 39, val: -30 }]
      },
      {
        code: "utp",
        location: 1,
        equippedId: 3,
        ethereal: true,
        quality: 2,
        runewordId: lookupRunewordId("fortitude"),
        socketRuneCodes: ["r01", "r12", "r14", "r28"],
        isArmor: true,
        defense: 524,
        maxDur: 60,
        runewordStats: [{ id: 16, val: 200 }, { id: 39, val: 30 }, { id: 41, val: 30 }, { id: 43, val: 30 }, { id: 45, val: 30 }]
      },
      {
        code: "7wc",
        location: 1,
        equippedId: 4,
        ethereal: true,
        quality: 2,
        runewordId: lookupRunewordId("infinity"),
        socketRuneCodes: ["r30", "r23", "r30", "r24"],
        isWeapon: true,
        maxDur: 65,
        runewordStats: [
          { id: 151, param: D2S_AURA_SKILL_IDS["信念"], val: 12 },
          { id: 17, val: 325 },
          { id: 136, val: 40 },
          { id: 334, val: 55 }
        ]
      }
    ]
  });
  assert.equal(fullWar.meta.itemCount, 6);
  assert.equal(fullWar.meta.mercItemCount, 3);
  assert.equal(fullWar.meta.demonAura, "fana");
  const fullView = new DataView(fullWar.bytes.buffer);
  assert.equal(fullView.getInt32(12, true), computeD2sChecksum(fullWar.bytes));
  const fullParsed = parseD2sBuffer(fullWar.bytes, fullWar.filename);
  assert.equal(fullParsed.classId, "war");
  assert.equal(fullParsed.level, 95);
  assert.equal(encodeD2rV5Item({ code: "r31", simple: true, v105: true, location: 6 }).length, 11);
  assert.equal(encodeD2rV5Item({ code: "r31", simple: true, v105: false, location: 6 }).length, 10);
  // Regression test: v105 complex item whose pre-tail bitstream is an exact multiple of 8 bits (272 bits -> 273 bits -> 35 bytes)
  const griffonV105 = encodeD2rV5Item({
    code: "ci3",
    location: 1,
    equippedId: 1,
    quality: 7,
    uniqueId: lookupUniqueId("Griffon's Eye"),
    isArmor: true,
    defense: 60,
    maxDur: 40,
    stats: [{ id: 31, val: 200 }, { id: 93, val: 15 }, { id: 105, val: 25 }, { id: 127, val: 1 }, { id: 330, val: 15 }, { id: 334, val: 20 }]
  });
  assert.equal(griffonV105.length, 35);
  assert.equal(griffonV105[34], 0x00);
  // Empty 4-socket white Monarch base (flags socketed=1, nrSock=0, totalSockets=4)
  const emptyMonarch = encodeD2rV5Item({
    code: "uit",
    location: 0,
    storePage: 5,
    quality: 2,
    isArmor: true,
    defense: 148,
    maxDur: 40,
    socketCount: 4,
    stats: []
  });
  assert.ok((new DataView(emptyMonarch.buffer).getUint32(0, true) & 0x800) !== 0);
  // Horadric Cube (box) as complex normal item in v105 is 17 bytes exact (matches native AbyssLock.d2s)
  assert.equal(encodeD2rV5Item({ code: "box", location: 0, storePage: 1, x: 8, y: 0, quality: 2, ilvl: 85, stats: [] }).length, 17);

  // Strict bit-level v105 verification of both player JM and merc jf->JM streams up to kf/lf
  const armorSet = new Set(["xtp", "uap", "xmg", "usk", "utp"]);
  const weaponSet = new Set(["7wc"]);
  const huffRev = new Map(Object.entries(D2R_HUFFMAN_CODES).map(([ch, bits]) => [bits, ch]));
  let bpos = (0x341 + 2) * 8;
  const rb = (n) => {
    let v = 0;
    for (let i = 0; i < n; i += 1) {
      v += ((fullWar.bytes[bpos >>> 3] >>> (bpos & 7)) & 1) * (2 ** i);
      bpos += 1;
    }
    return v;
  };
  const attrBits = { 0: 10, 1: 10, 2: 10, 3: 10, 4: 10, 5: 8, 6: 21, 7: 21, 8: 21, 9: 21, 10: 21, 11: 21, 12: 7, 13: 32, 14: 25, 15: 25 };
  while (true) {
    const aid = rb(9);
    if (aid === 0x1ff) break;
    rb(attrBits[aid]);
  }
  bpos = Math.ceil(bpos / 8) * 8 + 32 * 8; // skip 'if' + 30 skill bytes
  const readHuff = () => {
    let s = "";
    for (let k = 0; k < 4; k += 1) {
      let acc = "";
      while (!huffRev.has(acc)) acc += rb(1) ? "1" : "0";
      s += huffRev.get(acc);
    }
    return s.trim();
  };
  const readStatBlock = () => {
    const out = [];
    while (true) {
      const sid = rb(9);
      if (sid === 0x1ff) break;
      const spec = D2S_ITEM_STAT_SPECS[sid];
      assert.ok(spec, `Unknown stat id ${sid}`);
      const [bits, add, pbits] = spec;
      const param = pbits ? rb(pbits) : undefined;
      const val = rb(bits) - add;
      out.push(param !== undefined ? { id: sid, param, val } : { id: sid, val });
      if (sid === 17) assert.equal(rb(bits) - add, val);
    }
    return out;
  };
  const decodeV105Jm = () => {
    assert.equal(String.fromCharCode(rb(8), rb(8)), "JM");
    const cnt = rb(16);
    const decoded = [];
    let pending = 0;
    for (let i = 0; i < cnt + pending; i += 1) {
      const flags = rb(32);
      assert.equal(rb(3), 5);
      const loc = rb(3);
      const eqId = rb(4);
      rb(4); rb(4); rb(3);
      const code = readHuff();
      const simple = Boolean(flags & 0x200000);
      const socketed = Boolean(flags & 0x800);
      const rw = Boolean(flags & 0x4000000);
      if (simple) {
        assert.equal(rb(1), 0);
        if (/^r\d\d$/.test(code)) { assert.equal(rb(1), 1); assert.equal(rb(8), 0); }
        else { assert.equal(rb(1), 0); }
        bpos = Math.ceil(bpos / 8) * 8;
        decoded.push({ code, simple: true, loc });
        continue;
      }
      const nrSock = rb(3);
      pending += nrSock;
      rb(32); rb(7);
      const q = rb(4);
      assert.equal(rb(1), 0);
      assert.equal(rb(1), 0);
      let uid = null, sid = null, rwid = null;
      if (q === 4) { rb(11); rb(11); }
      else if (q === 5) { sid = rb(12); }
      else if (q === 7) { uid = rb(12); }
      if (rw) { rwid = rb(12); assert.equal(rb(4), 5); }
      assert.equal(rb(1), 0);
      if (armorSet.has(code)) rb(11);
      if (armorSet.has(code) || weaponSet.has(code)) {
        const md = rb(8);
        if (md > 0) rb(9);
      }
      assert.equal(rb(1), 0); // v105 flag
      if (socketed) assert.equal(rb(4), nrSock);
      if (q === 5) assert.equal(rb(5), 0);
      const st1 = readStatBlock();
      const st2 = rw ? readStatBlock() : [];
      assert.equal(rb(1), 0); // v105 mandatory 1-bit tail flag after final 0x1ff
      bpos = Math.ceil(bpos / 8) * 8;
      decoded.push({ code, loc, eqId, q, uid, sid, rwid, st1, st2 });
    }
    return { cnt, decoded };
  };

  const pList = decodeV105Jm();
  assert.equal(pList.cnt, 6);
  assert.equal(pList.decoded.find((x) => x.code === "xtp").rwid, 59);
  assert.equal(pList.decoded.find((x) => x.code === "uap").uid, 248);
  const shakoFacet = pList.decoded.find((x) => x.code === "jew" && x.loc === 6);
  assert.equal(shakoFacet.uid, 392);
  assert.deepEqual(shakoFacet.st1, [{ id: 330, val: 5 }, { id: 334, val: 5 }]);
  assert.equal(pList.decoded.find((x) => x.code === "xmg").sid, 88);
  const sunder = pList.decoded.find((x) => x.code === "cm3");
  assert.equal(sunder.uid, 403);
  assert.deepEqual(sunder.st1, [{ id: 41, val: -70 }, { id: 190, val: 300 }]);
  const corpse = decodeV105Jm();
  assert.equal(corpse.cnt, 0);
  assert.equal(String.fromCharCode(rb(8), rb(8)), "jf");
  const mList = decodeV105Jm();
  assert.equal(mList.cnt, 3);
  assert.equal(mList.decoded.find((x) => x.code === "usk").uid, 345);
  const andyJewel = mList.decoded.find((x) => x.code === "jew" && x.loc === 6);
  assert.equal(andyJewel.q, 4);
  assert.deepEqual(andyJewel.st1, [{ id: 39, val: 30 }, { id: 93, val: 15 }]);
  assert.equal(mList.decoded.find((x) => x.code === "utp").rwid, 67);
  const inf = mList.decoded.find((x) => x.code === "7wc");
  assert.equal(inf.rwid, 86);
  assert.deepEqual(inf.st2.find((s) => s.id === 151), { id: 151, param: 123, val: 12 });
  assert.deepEqual(inf.st2.find((s) => s.id === 136), { id: 136, val: 40 });
  assert.deepEqual(inf.st2.find((s) => s.id === 334), { id: 334, val: 55 });
  assert.equal(String.fromCharCode(rb(8), rb(8)), "kf");
  assert.equal(rb(8), 0);
  assert.equal(rb(8), 1);
  assert.equal(rb(8), 0);
  assert.equal(String.fromCharCode(rb(8), rb(8)), "lf");

  // Case 4: Non-Warlock D2R 3.4 v105 Paladin with Grief (Phase Blade no-dur) + Merc Eth Infinity
  const palFull = buildD2sBuffer({
    name: "ZealPal",
    classId: "pal",
    level: 94,
    statAlloc: { str: 80, dex: 120, vit: 280, enr: 0 },
    charBaseStats: catalogs.charBaseStats.pal,
    skills: { Fanaticism: 20, Zeal: 20, "Holy Shield": 20 },
    classSkills: palCls.skills,
    mercEnabled: true,
    mercVariant: "a2-might",
    items: [
      {
        code: "7cr",
        location: 1,
        equippedId: 4,
        quality: 2,
        runewordId: lookupRunewordId("grief"),
        socketRuneCodes: ["r05", "r03", "r28", "r23", "r08"],
        isWeapon: true,
        maxDur: 0,
        runewordStats: [{ id: 93, val: 40 }, { id: 111, val: 400 }, { id: 141, val: 20 }, { id: 115, val: 1 }]
      }
    ],
    mercItems: [
      {
        code: "7wc",
        location: 1,
        equippedId: 4,
        ethereal: true,
        quality: 2,
        runewordId: lookupRunewordId("infinity"),
        socketRuneCodes: ["r30", "r23", "r30", "r24"],
        isWeapon: true,
        maxDur: 65,
        runewordStats: [{ id: 151, param: D2S_AURA_SKILL_IDS["信念"], val: 12 }, { id: 136, val: 40 }]
      }
    ]
  });
  assert.equal(palFull.meta.version, 105);
  assert.equal(palFull.meta.itemCount, 1);
  assert.equal(palFull.meta.mercItemCount, 1);
  const palFullView = new DataView(palFull.bytes.buffer);
  assert.equal(palFullView.getInt32(12, true), computeD2sChecksum(palFull.bytes));
  const palFullParsed = parseD2sBuffer(palFull.bytes, palFull.filename);
  assert.equal(palFullParsed.classId, "pal");
  assert.equal(palFullParsed.name, "ZealPal");
  assert.equal(palFullParsed.level, 94);
  // Tail ends with kf 00 01 00 lf 00 00 and v105 PreviewData GameVersion=3 at 0x0f8 for non-Warlock classes
  assert.equal(palFull.bytes[0xf8], 0x03);
  assert.equal(palFull.bytes[0x103], 0x04);
  assert.equal(Buffer.from(palFull.bytes.subarray(palFull.bytes.length - 9)).toString("hex"), "6b660001006c660000");

  // Exact D2R 3.4 hireling.txt EXP verification: a2-might Lv.98 => 120 * 98 * 98 * 99 = 114,095,520 (matches native AbyssLock.d2s)
  assert.equal(computeMercExp("a2-might", 98), 114095520);
  const lv99Merc98 = buildD2sBuffer({
    name: "MaxMercTest",
    classId: "war",
    level: 99,
    charBaseStats: catalogs.charBaseStats.war,
    classSkills: warCls.skills,
    mercEnabled: true,
    mercVariant: "a2-might",
    mercLevel: 98
  });
  assert.equal(new DataView(lv99Merc98.bytes.buffer).getUint32(0xab, true), 114095520);
});

test("D2R 3.4 全量 d2s-tables 映射表覆盖全部暗金、套装、符文之语与 ItemStatCost 位宽", () => {
  assert.ok(Object.keys(D2S_ITEM_STAT_SPECS).length >= 250);
  assert.ok(Object.keys(D2S_UNIQUE_IDS).length >= 400);
  assert.ok(Object.keys(D2S_SET_IDS).length >= 135);
  assert.equal(Object.keys(D2S_RUNEWORD_IDS).length, 99);

  // Verified against native D2R 3.4 AbyssLock.d2s & ItemStatCost.txt
  assert.equal(lookupUniqueId("Harlequin Crest"), 248);
  assert.equal(lookupUniqueId("Mara's Kaleidoscope"), 272);
  assert.equal(lookupUniqueId("Andariel's Visage"), 345);
  assert.equal(lookupUniqueId("Arachnid Mesh"), 373);
  assert.equal(lookupUniqueId("Wraithstep"), 413);
  assert.ok(lookupUniqueId("Griffon's Eye") !== undefined);
  assert.ok(lookupUniqueId("The Stone of Jordan") !== undefined);
  assert.ok(lookupUniqueId("Raven Frost") !== undefined);
  assert.ok(lookupUniqueId("Highlord's Wrath") !== undefined);

  assert.equal(lookupSetId("Trang-Oul's Claws"), 88);
  assert.ok(lookupSetId("Laying of Hands") !== undefined);
  assert.ok(lookupSetId("Guillaume's Face") !== undefined);
  assert.ok(lookupSetId("Whistan's Guard") !== undefined);

  assert.equal(lookupRunewordId("breath-of-the-dying"), 37);
  assert.equal(lookupRunewordId("call-to-arms"), 39);
  assert.equal(lookupRunewordId("enigma"), 59);
  assert.equal(lookupRunewordId("fortitude"), 67);
  assert.equal(lookupRunewordId("infinity"), 86);
  assert.equal(lookupRunewordId("spirit"), 155);
  assert.equal(lookupRunewordId("void"), 182);
  assert.ok(lookupRunewordId("grief") !== undefined);

  assert.deepEqual(D2S_ITEM_STAT_SPECS[76], [6, 10, 0]);
  assert.deepEqual(D2S_ITEM_STAT_SPECS[77], [6, 10, 0]);
  assert.deepEqual(D2S_ITEM_STAT_SPECS[39], [9, 200, 0]);
  assert.deepEqual(D2S_ITEM_STAT_SPECS[141], [7, 0, 0]);
  assert.deepEqual(D2S_ITEM_STAT_SPECS[151], [5, 0, 9]);
  assert.deepEqual(D2S_ITEM_STAT_SPECS[190], [10, 0, 0]);
});
