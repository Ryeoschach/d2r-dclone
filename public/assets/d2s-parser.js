// Pure client-side D2 / D2R / D2R 3.4 (.d2s) offline save parser.
// Runs 100% locally in the browser — save files are never uploaded to any server.

export const D2S_MAGIC = 0xaa55aa55;

export const D2S_CLASS_MAP = [
  "ama", // 0: Amazon
  "sor", // 1: Sorceress
  "nec", // 2: Necromancer
  "pal", // 3: Paladin
  "bar", // 4: Barbarian
  "dru", // 5: Druid
  "ass", // 6: Assassin
  "war"  // 7: Warlock (D2R 3.4 Reign of the Warlock)
];

// Official D2R ItemStatCost.txt CSvBits for core gf attributes (statId 0..15)
const ATTR_STAT_BITS = {
  0: 10,  // strength
  1: 10,  // energy
  2: 10,  // dexterity
  3: 10,  // vitality
  4: 10,  // statpts
  5: 8,   // newskills
  6: 21,  // hitpoints (<< 8)
  7: 21,  // maxhp (<< 8)
  8: 21,  // mana (<< 8)
  9: 21,  // maxmana (<< 8)
  10: 21, // stamina (<< 8)
  11: 21, // maxstamina (<< 8)
  12: 7,  // level
  13: 32, // experience
  14: 25, // gold
  15: 25  // goldbank
};

// Canonical D2R (v97+) Huffman tree for 4-character item codes
export const D2R_HUFFMAN_CODES = {
  " ": "10",
  "0": "11111011",
  "1": "1111100",
  "2": "001100",
  "3": "1101101",
  "4": "11111010",
  "5": "00010110",
  "6": "1101111",
  "7": "01111",
  "8": "000100",
  "9": "01110",
  a: "11110",
  b: "0101",
  c: "01000",
  d: "110001",
  e: "110000",
  f: "010011",
  g: "11010",
  h: "00011",
  i: "1111110",
  j: "000101110",
  k: "010010",
  l: "11101",
  m: "01101",
  n: "001101",
  o: "1111111",
  p: "11001",
  q: "11011001",
  r: "11100",
  s: "0010",
  t: "01100",
  u: "00001",
  v: "1101110",
  w: "00000",
  x: "00111",
  y: "0001010",
  z: "11011000"
};

const HUFFMAN_ROOT = (() => {
  const root = {};
  for (const [ch, bits] of Object.entries(D2R_HUFFMAN_CODES)) {
    let node = root;
    for (let i = 0; i < bits.length; i += 1) {
      const b = bits[i];
      if (!node[b]) node[b] = {};
      node = node[b];
    }
    node.ch = ch;
  }
  return root;
})();

// Equipped slot IDs in .d2s item header (4-bit equippedId when location === 1)
const EQUIP_SLOT_MAP = {
  1: { set: 0, slot: "head" },
  2: { set: 0, slot: "amulet" },
  3: { set: 0, slot: "torso" },
  4: { set: 1, slot: "weapon" },
  5: { set: 1, slot: "offhand" },
  6: { set: 0, slot: "ring1" },
  7: { set: 0, slot: "ring2" },
  8: { set: 0, slot: "belt" },
  9: { set: 0, slot: "boots" },
  10: { set: 0, slot: "gloves" },
  11: { set: 2, slot: "weapon" },
  12: { set: 2, slot: "offhand" }
};

const RUNE_CODE_TO_NAME = {
  r01: "El", r02: "Eld", r03: "Tir", r04: "Nef", r05: "Eth",
  r06: "Ith", r07: "Tal", r08: "Ral", r09: "Ort", r10: "Thul",
  r11: "Amn", r12: "Sol", r13: "Shael", r14: "Dol", r15: "Hel",
  r16: "Io", r17: "Lum", r18: "Ko", r19: "Fal", r20: "Lem",
  r21: "Pul", r22: "Um", r23: "Mal", r24: "Ist", r25: "Gul",
  r26: "Vex", r27: "Ohm", r28: "Lo", r29: "Sur", r30: "Ber",
  r31: "Jah", r32: "Cham", r33: "Zod"
};

class BitReader {
  constructor(bytes, byteOffset = 0) {
    this.bytes = bytes;
    this.bitPos = byteOffset * 8;
    this.totalBits = bytes.length * 8;
  }

  remainingBits() {
    return this.totalBits - this.bitPos;
  }

  readBits(count) {
    if (count <= 0) return 0;
    if (this.bitPos + count > this.totalBits) {
      throw new RangeError("Unexpected EOF in .d2s bitstream");
    }
    let val = 0;
    for (let i = 0; i < count; i += 1) {
      const byteIdx = (this.bitPos + i) >>> 3;
      const bitIdx = (this.bitPos + i) & 7;
      if ((this.bytes[byteIdx] >>> bitIdx) & 1) {
        val += 2 ** i;
      }
    }
    this.bitPos += count;
    return val;
  }

  readBit() {
    return this.readBits(1);
  }

  alignToByte() {
    const mod = this.bitPos & 7;
    if (mod !== 0) this.bitPos += 8 - mod;
  }

  byteOffset() {
    return this.bitPos >>> 3;
  }

  readHuffmanChar() {
    let node = HUFFMAN_ROOT;
    for (let steps = 0; steps < 12; steps += 1) {
      if (node.ch !== undefined) return node.ch;
      const b = this.readBit() ? "1" : "0";
      node = node[b];
      if (!node) return null;
    }
    return node.ch !== undefined ? node.ch : null;
  }
}

function readNullTermUtf8(bytes, offset, maxLen) {
  if (offset < 0 || offset >= bytes.length) return "";
  const end = Math.min(bytes.length, offset + maxLen);
  let len = 0;
  while (offset + len < end && bytes[offset + len] !== 0) {
    len += 1;
  }
  if (len === 0) return "";
  try {
    return new TextDecoder("utf-8", { fatal: false })
      .decode(bytes.subarray(offset, offset + len))
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .trim();
  } catch {
    return "";
  }
}

function mapMercTypeId(typeId) {
  const id = Number(typeId);
  if (!Number.isFinite(id) || id < 0) return "a2-might";
  // Standard D2 / D2R hireling.txt ID ranges across Normal / Nightmare / Hell
  if (id <= 5) return id % 2 === 0 ? "a1-fire" : "a1-cold";
  if (id >= 6 && id <= 14) {
    if (id === 10) return "a2-hf";
    if (id === 11) return "a2-might";
    const mod = (id - 6) % 3;
    if (mod === 0) return "a2-prayer";
    if (mod === 1) return "a2-defiance";
    return "a2-ba";
  }
  if (id >= 15 && id <= 23) {
    const mod = (id - 15) % 3;
    return mod === 0 ? "a3-fire" : (mod === 1 ? "a3-cold" : "a3-ltng");
  }
  if (id >= 24 && id <= 29) return "a5-bash";
  if (id >= 30 && id <= 35) {
    const mod = (id - 30) % 3;
    return mod === 0 ? "a2-prayer" : (mod === 1 ? "a2-defiance" : "a2-ba");
  }
  if (id >= 36 && id <= 38) return "a5-frenzy";
  return "a2-might";
}

function scanAttributesAndSkills(bytes) {
  // Scan from 0x180 onward for valid "gf" -> stats -> 0x1FF -> byte-aligned "if" -> 30 skill bytes -> "JM"
  const startScan = Math.min(bytes.length, 0x180);
  for (let pos = startScan; pos < bytes.length - 36; pos += 1) {
    if (bytes[pos] !== 0x67 || bytes[pos + 1] !== 0x66) continue; // "gf"
    try {
      const reader = new BitReader(bytes, pos + 2);
      const attrs = {};
      let ok = true;
      let seenAny = false;
      for (let guard = 0; guard < 32; guard += 1) {
        if (reader.remainingBits() < 9) { ok = false; break; }
        const statId = reader.readBits(9);
        if (statId === 0x1ff) break;
        const bitLen = ATTR_STAT_BITS[statId];
        if (!bitLen || reader.remainingBits() < bitLen) { ok = false; break; }
        const val = reader.readBits(bitLen);
        attrs[statId] = val;
        seenAny = true;
      }
      if (!ok || !seenAny) continue;
      reader.alignToByte();
      const ifPos = reader.byteOffset();
      if (ifPos + 34 > bytes.length) continue;
      if (bytes[ifPos] !== 0x69 || bytes[ifPos + 1] !== 0x66) continue; // "if"

      const skillBytes = [];
      let skillsPlausible = true;
      for (let i = 0; i < 30; i += 1) {
        const pts = bytes[ifPos + 2 + i];
        if (pts > 30) { skillsPlausible = false; break; }
        skillBytes.push(Math.min(20, pts));
      }
      if (!skillsPlausible) continue;

      const jmPos = ifPos + 32;
      if (bytes[jmPos] !== 0x4a || bytes[jmPos + 1] !== 0x4d) continue; // "JM"

      return {
        gfOffset: pos,
        ifOffset: ifPos,
        itemsOffset: jmPos,
        attributes: {
          str: attrs[0] || 0,
          enr: attrs[1] || 0,
          dex: attrs[2] || 0,
          vit: attrs[3] || 0,
          statPts: attrs[4] || 0,
          skillPts: attrs[5] || 0,
          hp: Math.floor((attrs[6] || 0) / 256),
          maxHp: Math.floor((attrs[7] || 0) / 256),
          mana: Math.floor((attrs[8] || 0) / 256),
          maxMana: Math.floor((attrs[9] || 0) / 256),
          level: attrs[12] || 0,
          exp: attrs[13] || 0,
          gold: attrs[14] || 0,
          stashGold: attrs[15] || 0
        },
        skillPointsRaw: skillBytes
      };
    } catch {
      continue;
    }
  }
  return null;
}

function parseSingleItemHeader(reader, isD2rHuffman) {
  if (!isD2rHuffman) {
    // Classic v96 LoD item starts with "JM"
    const m0 = reader.readBits(8);
    const m1 = reader.readBits(8);
    if (m0 !== 0x4a || m1 !== 0x4d) return null;
  }

  reader.readBits(4); // unknown 0..3
  const identified = Boolean(reader.readBit()); // 4
  reader.readBits(6); // 5..10
  const socketed = Boolean(reader.readBit()); // 11
  reader.readBits(1); // 12
  const newItem = Boolean(reader.readBit()); // 13
  reader.readBits(2); // 14..15
  const ear = Boolean(reader.readBit()); // 16
  const starter = Boolean(reader.readBit()); // 17
  reader.readBits(3); // 18..20
  const simple = Boolean(reader.readBit()); // 21
  const ethereal = Boolean(reader.readBit()); // 22
  reader.readBits(1); // 23
  const personalized = Boolean(reader.readBit()); // 24
  reader.readBits(1); // 25
  const runeword = Boolean(reader.readBit()); // 26
  reader.readBits(5); // 27..31

  if (isD2rHuffman) {
    reader.readBits(3); // version (3 bits in D2R v97+)
  } else {
    reader.readBits(10); // version (10 bits in LoD v96)
  }

  const location = reader.readBits(3);
  const equippedId = reader.readBits(4);
  const x = reader.readBits(4);
  const y = reader.readBits(4);
  const storePage = reader.readBits(3);

  if (ear) {
    return { ear: true, simple: true, code: "ear", location, equippedId, x, y, storePage, ethereal, socketed, runeword };
  }

  let code = "";
  if (isD2rHuffman) {
    for (let i = 0; i < 4; i += 1) {
      const ch = reader.readHuffmanChar();
      if (ch === null) return null;
      code += ch;
    }
  } else {
    for (let i = 0; i < 4; i += 1) {
      code += String.fromCharCode(reader.readBits(8));
    }
  }
  code = code.trim();
  if (!/^[a-z0-9]{2,4}$/.test(code)) return null;

  const item = {
    code,
    identified,
    socketed,
    newItem,
    starter,
    simple,
    ethereal,
    personalized,
    runeword,
    location,
    equippedId,
    x,
    y,
    storePage,
    nrOfItemsInSockets: 0,
    ilvl: 0,
    quality: 2,
    uniqueId: null,
    setId: null,
    socketedItems: []
  };

  if (!simple) {
    item.nrOfItemsInSockets = reader.readBits(3);
    item.itemId = reader.readBits(32);
    item.ilvl = reader.readBits(7);
    item.quality = reader.readBits(4);
    const hasMultipleGfx = reader.readBit();
    if (hasMultipleGfx) reader.readBits(3);
    const hasClassAuto = reader.readBit();
    if (hasClassAuto) reader.readBits(11);

    if (item.quality === 1 || item.quality === 3) {
      reader.readBits(3); // low/superior subtype
    } else if (item.quality === 4) {
      reader.readBits(11); // magic prefix
      reader.readBits(11); // magic suffix
    } else if (item.quality === 5) {
      item.setId = reader.readBits(12);
    } else if (item.quality === 6 || item.quality === 8) {
      reader.readBits(8); // rare/craft name 1
      reader.readBits(8); // rare/craft name 2
      for (let a = 0; a < 6; a += 1) {
        if (reader.readBit()) reader.readBits(11);
      }
    } else if (item.quality === 7) {
      item.uniqueId = reader.readBits(12);
    }
  }

  return item;
}

function scanV96ItemList(bytes, startOffset, endLimit) {
  if (startOffset + 4 > endLimit) return { items: [], nextOffset: startOffset, partial: false };
  if (bytes[startOffset] !== 0x4a || bytes[startOffset + 1] !== 0x4d) {
    return { items: [], nextOffset: startOffset, partial: false };
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const count = view.getUint16(startOffset + 2, true);
  if (count === 0) return { items: [], nextOffset: startOffset + 4, partial: false };

  // In v96, every top-level and socketed item begins with "JM" (0x4A 0x4D).
  const jmOffsets = [];
  for (let p = startOffset + 4; p < endLimit - 2; p += 1) {
    if (bytes[p] === 0x4a && bytes[p + 1] === 0x4d) {
      jmOffsets.push(p);
    }
  }

  const flatItems = [];
  for (const off of jmOffsets) {
    try {
      const reader = new BitReader(bytes, off);
      const parsed = parseSingleItemHeader(reader, false);
      if (parsed) flatItems.push({ offset: off, item: parsed });
    } catch {
      // Skip non-item "JM" occurrences inside random bitstreams
    }
  }

  const topItems = [];
  let i = 0;
  while (i < flatItems.length && topItems.length < count) {
    const cur = flatItems[i].item;
    i += 1;
    const sockCount = cur.nrOfItemsInSockets || 0;
    for (let s = 0; s < sockCount && i < flatItems.length; s += 1) {
      cur.socketedItems.push(flatItems[i].item);
      i += 1;
    }
    topItems.push(cur);
  }
  return { items: topItems, nextOffset: endLimit, partial: topItems.length < count };
}

function findSectionMarker(bytes, fromOffset, b0, b1) {
  for (let i = fromOffset; i < bytes.length - 1; i += 1) {
    if (bytes[i] === b0 && bytes[i + 1] === b1) return i;
  }
  return -1;
}

export function parseD2sBuffer(buffer, fileName = "") {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  if (bytes.length < 0x100) {
    throw new Error("文件过小，不是有效的暗黑 2 (.d2s) 角色存档");
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const magic = view.getUint32(0, true);
  if (magic !== D2S_MAGIC) {
    throw new Error("文件头签名不匹配（非标准 .d2s 存档文件）");
  }

  const version = view.getUint32(4, true);
  if (version < 92 || version > 120) {
    throw new Error("不支持的 .d2s 存档版本号（v" + version + "）");
  }

  const fileSize = view.getUint32(8, true);
  const activeWeaponSet = view.getUint32(16, true) === 1 ? 2 : 1;

  const isV105Plus = version >= 105;
  // Character name: offset 0x12B (D2R 3.4 v105+), or 0x14 (classic & D2R v97/98), fallback 0x10B / filename
  let name = isV105Plus
    ? readNullTermUtf8(bytes, 0x12b, 16)
    : readNullTermUtf8(bytes, 0x14, 16);
  if (!name && bytes.length > 0x120) {
    name = readNullTermUtf8(bytes, 0x10b, 16) || readNullTermUtf8(bytes, 0x12b, 16);
  }
  if (!name && fileName) {
    name = String(fileName).replace(/\.d2s$/i, "").slice(0, 24);
  }
  if (!name) name = "未命名角色";

  const statusByte = bytes[isV105Plus ? 0x14 : 0x24];
  const status = {
    hardcore: Boolean(statusByte & 0x04),
    died: Boolean(statusByte & 0x08),
    expansion: isV105Plus ? true : Boolean(statusByte & 0x20),
    ladder: Boolean(statusByte & 0x40)
  };

  const classCode = bytes[isV105Plus ? 0x18 : 0x28];
  const classId = D2S_CLASS_MAP[classCode];
  if (!classId) {
    throw new Error("无法识别的职业代码（class=" + classCode + "）");
  }

  const headerLevel = Math.min(99, Math.max(1, bytes[isV105Plus ? 0x1b : 0x2b] || 1));

  // Mercenary header metadata (shifted -0x10 in D2R 3.4 v105+)
  const mercBase = isV105Plus ? 0xa1 : 0xb1;
  const mercDead = view.getUint16(mercBase, true) !== 0;
  const mercSeed = view.getUint32(mercBase + 2, true);
  const mercTypeId = view.getUint16(mercBase + 8, true);
  const mercExp = view.getUint32(mercBase + 10, true);
  const mercVariant = mapMercTypeId(mercTypeId);

  const sectionData = scanAttributesAndSkills(bytes);
  if (!sectionData) {
    throw new Error("未能定位存档中的属性 (gf) 与技能 (if) 数据段，请确认是完整未损坏的 .d2s 文件");
  }

  const level = Math.min(99, Math.max(1, sectionData.attributes.level || headerLevel));

  // Locate Mercenary section marker "jf" (0x6A 0x66) after player item list
  const jfOffset = findSectionMarker(bytes, sectionData.itemsOffset + 4, 0x6a, 0x66);
  const playerItemsEnd = jfOffset > sectionData.itemsOffset ? jfOffset : bytes.length;

  let playerItems = [];
  let mercItems = [];
  let itemsPartial = false;

  if (version <= 96) {
    const pRes = scanV96ItemList(bytes, sectionData.itemsOffset, playerItemsEnd);
    playerItems = pRes.items;
    itemsPartial = pRes.partial;
    if (jfOffset > 0 && mercSeed !== 0 && jfOffset + 6 <= bytes.length) {
      const mRes = scanV96ItemList(bytes, jfOffset + 2, bytes.length);
      mercItems = mRes.items;
    }
  } else {
    // D2R v97+ Huffman item list: attempt header parse of first item(s); gracefully fallback if variable property bits differ
    const playerCount = view.getUint16(sectionData.itemsOffset + 2, true);
    if (playerCount > 0) {
      try {
        const reader = new BitReader(bytes, sectionData.itemsOffset + 4);
        const first = parseSingleItemHeader(reader, true);
        if (first && first.simple) {
          playerItems.push(first);
        }
      } catch {
        // Non-fatal: header/stats/skills are already 100% parsed!
      }
      if (playerItems.length < playerCount) {
        itemsPartial = true;
      }
    }
  }

  return {
    version,
    fileSize,
    name,
    classCode,
    classId,
    level,
    status,
    activeWeaponSet,
    mercEnabled: mercSeed !== 0,
    mercDead,
    mercSeed,
    mercTypeId,
    mercExp,
    mercVariant,
    attributes: sectionData.attributes,
    skillPointsRaw: sectionData.skillPointsRaw,
    playerItems,
    mercItems,
    itemsPartial
  };
}

function mapRawItemToPaperdollEq(rawItem, catalogs) {
  if (!rawItem || !rawItem.code) return null;
  const code = rawItem.code;
  const pdBases = (catalogs && catalogs.baseRules) || {};
  const rwList = (catalogs && catalogs.rwList) || [];
  const uniqueItems = (catalogs && catalogs.uniqueItems) || [];
  const setPieces = (catalogs && catalogs.setPieces) || [];

  // 1. Runeword: match exact rune sequence from socketed items!
  if (rawItem.runeword && Array.isArray(rawItem.socketedItems) && rawItem.socketedItems.length >= 2) {
    const runeNames = rawItem.socketedItems
      .map((s) => RUNE_CODE_TO_NAME[s.code] || "")
      .filter(Boolean);
    if (runeNames.length >= 2) {
      const sig = runeNames.join(",");
      const matchedRw = rwList.find((r) => Array.isArray(r.runes) && r.runes.join(",") === sig);
      if (matchedRw) {
        return {
          cat: "rw",
          id: matchedRw.id,
          baseCode: pdBases[code] ? code : undefined,
          eth: Boolean(rawItem.ethereal),
          sockets: [],
          rolls: {}
        };
      }
    }
  }

  // Collect socketed runes/gems for non-runeword items
  const sockets = (rawItem.socketedItems || [])
    .map((s) => (RUNE_CODE_TO_NAME[s.code] ? s.code : ""))
    .filter(Boolean);

  // 2. Unique item: match by baseCode if unambiguous
  if (rawItem.quality === 7) {
    const byBase = uniqueItems.filter((u) => u && u.baseCode === code);
    if (byBase.length === 1) {
      return { cat: "unique", id: byBase[0].nameEn, eth: Boolean(rawItem.ethereal), sockets, rolls: {} };
    }
  }

  // 3. Set item: match by baseCode if unambiguous
  if (rawItem.quality === 5) {
    const byBase = setPieces.filter((p) => p && p.baseCode === code);
    if (byBase.length === 1) {
      return { cat: "set", id: byBase[0].nameEn, eth: Boolean(rawItem.ethereal), sockets, rolls: {} };
    }
  }

  // 4. Fallback to Base / Magic / Rare / Craft using exact official baseCode
  if (pdBases[code]) {
    const cat = rawItem.quality === 4 ? "magic" : (rawItem.quality === 6 ? "rare" : (rawItem.quality === 8 ? "craft" : "base"));
    return {
      cat,
      id: code,
      baseCode: code,
      eth: Boolean(rawItem.ethereal),
      sockets,
      rolls: {}
    };
  }

  return null;
}

export function mapParsedD2sToPaperdoll(parsed, catalogs = {}) {
  const clsObj = (catalogs.classes || []).find((c) => c.id === parsed.classId) || null;
  const charBase = (catalogs.charBaseStats && catalogs.charBaseStats[parsed.classId]) || {
    str: 20, dex: 20, vit: 20, enr: 20
  };

  // 1. Map 30 skill bytes -> exact skill keys (sorted by official skills.txt ID!)
  const skills = {};
  let totalSkillPts = 0;
  if (clsObj && Array.isArray(clsObj.skills)) {
    const orderedSkills = [...clsObj.skills].sort((a, b) => a.id - b.id);
    for (let i = 0; i < Math.min(30, orderedSkills.length); i += 1) {
      const pts = Math.min(20, Math.max(0, Number(parsed.skillPointsRaw[i] || 0)));
      if (pts > 0) {
        skills[orderedSkills[i].key] = pts;
        totalSkillPts += pts;
      }
    }
  }

  // 2. Map naked attributes -> exact Paperdoll statAlloc (subtracting base class stats)
  const statAlloc = {
    str: Math.max(0, (parsed.attributes.str || 0) - charBase.str),
    dex: Math.max(0, (parsed.attributes.dex || 0) - charBase.dex),
    vit: Math.max(0, (parsed.attributes.vit || 0) - charBase.vit),
    enr: Math.max(0, (parsed.attributes.enr || 0) - charBase.enr)
  };

  // 3. Map equipped items (Set I, Set II, armor/jewelry) & inventory charms
  const set1Loadout = {
    head: null, amulet: null, weapon: null, torso: null, offhand: null,
    gloves: null, ring1: null, belt: null, ring2: null, boots: null
  };
  const set2Weapons = { weapon: null, offhand: null };
  const charBag = [];
  let bagUid = 1;
  let mappedGearCount = 0;

  for (const rawItem of parsed.playerItems || []) {
    if (rawItem.location === 1) {
      const target = EQUIP_SLOT_MAP[rawItem.equippedId];
      if (!target) continue;
      const eq = mapRawItemToPaperdollEq(rawItem, catalogs);
      if (!eq) continue;
      mappedGearCount += 1;
      if (target.set === 2) set2Weapons[target.slot] = eq;
      else set1Loadout[target.slot] = eq;
    } else if (rawItem.location === 0 && rawItem.storePage === 1) {
      // Inventory charms & cube/tomes
      let charmId = "";
      if (rawItem.code === "cm1") charmId = rawItem.quality === 7 ? "anni" : "sc-20-5";
      else if (rawItem.code === "cm2") charmId = rawItem.quality === 7 ? "torch" : "magic-sc";
      else if (rawItem.code === "cm3") charmId = rawItem.quality === 7 ? "gheed" : "gc-sk-life";
      else if (rawItem.code === "box") charmId = "util-cube";
      else if (rawItem.code === "ibk") charmId = "util-id";
      else if (rawItem.code === "tbk") charmId = "util-tp";
      if (charmId && charBag.length < 40) {
        const firstTab = (clsObj && clsObj.tabs && clsObj.tabs[0]) ? clsObj.tabs[0].page : 1;
        charBag.push({
          uid: "b" + bagUid++,
          charmId,
          tabPage: charmId === "gc-sk-life" ? firstTab : 0,
          rolls: {}
        });
      }
    }
  }

  // Respect activeWeaponSet from .d2s header
  const isSet2Active = parsed.activeWeaponSet === 2;
  const charLoadout = Object.assign({}, set1Loadout);
  let swapLoadout = { weapon: set2Weapons.weapon, offhand: set2Weapons.offhand };
  if (isSet2Active) {
    swapLoadout = { weapon: set1Loadout.weapon, offhand: set1Loadout.offhand };
    charLoadout.weapon = set2Weapons.weapon;
    charLoadout.offhand = set2Weapons.offhand;
  }

  // 4. Map mercenary items
  const mercLoadout = { head: null, torso: null, weapon: null, offhand: null };
  let mappedMercCount = 0;
  for (const rawItem of parsed.mercItems || []) {
    if (rawItem.location !== 1) continue;
    const target = EQUIP_SLOT_MAP[rawItem.equippedId];
    if (!target || !["head", "torso", "weapon", "offhand"].includes(target.slot)) continue;
    const eq = mapRawItemToPaperdollEq(rawItem, catalogs);
    if (eq) {
      mercLoadout[target.slot] = eq;
      mappedMercCount += 1;
    }
  }

  return {
    classId: parsed.classId,
    name: parsed.name,
    level: parsed.level,
    version: parsed.version,
    status: parsed.status,
    skills,
    totalSkillPts,
    statAlloc,
    charLoadout,
    swapLoadout,
    activeWeaponSet: parsed.activeWeaponSet,
    charBag,
    bagNextUid: bagUid,
    mercEnabled: parsed.mercEnabled,
    mercVariant: parsed.mercVariant,
    mercLvl: Math.min(98, Math.max(75, parsed.level)),
    mercLoadout,
    mappedGearCount,
    mappedMercCount,
    itemsPartial: parsed.itemsPartial
  };
}
