// Pure client-side D2R / D2R 3.4 (.d2s) offline save exporter.
// Generates a structurally valid single-player test save (header, quests, waypoints,
// gf attributes bitstream, 30-skill block, player/merc items, merc metadata, and 32-bit rotating checksum)
// 100% locally in the browser.
import {
  D2S_ITEM_STAT_SPECS,
  D2S_UNIQUE_IDS,
  D2S_SET_IDS,
  D2S_RUNEWORD_IDS,
  D2S_CHARM_UNIQUE_IDS,
  D2S_AURA_SKILL_IDS,
  D2S_OSKILL_IDS,
  D2S_ADV_STACKABLE_META,
  D2S_ITEM_SIZES
} from "./d2s-tables.js?v=fdc967a0a2";

export {
  D2S_ITEM_STAT_SPECS,
  D2S_UNIQUE_IDS,
  D2S_SET_IDS,
  D2S_RUNEWORD_IDS,
  D2S_CHARM_UNIQUE_IDS,
  D2S_AURA_SKILL_IDS,
  D2S_OSKILL_IDS,
  D2S_ADV_STACKABLE_META,
  D2S_ITEM_SIZES
};

export const D2S_MAGIC = 0xaa55aa55;

export const CLASS_ID_TO_CODE = {
  ama: 0,
  sor: 1,
  nec: 2,
  pal: 3,
  bar: 4,
  dru: 5,
  ass: 6,
  war: 7
};

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

const MERC_VARIANT_TO_TYPE_ID = {
  "a1-fire": 0,
  "a1-cold": 1,
  "a2-prayer": 6,
  "a2-defiance": 7,
  "a2-ba": 8,
  "a2-hf": 10,
  "a2-might": 11,
  "a3-fire": 15,
  "a3-cold": 16,
  "a3-ltng": 17,
  "a5-bash": 24,
  "a5-frenzy": 36
};

// Official D2R 3.4 hireling.txt Exp/Lvl formula: Exp(L) = expPerLvl * L^2 * (L + 1)
// Verified against native AbyssLock.d2s: Id=11 (a2-might, expPerLvl=120), Lv.98 => 120 * 98 * 98 * 99 = 114,095,520 exact.
export function computeMercExp(mercVariant, mercLvl) {
  const lvl = Math.min(98, Math.max(1, Math.round(Number(mercLvl) || 1)));
  let expPerLvl = 120;
  switch (mercVariant) {
    case "a1-fire": expPerLvl = lvl >= 67 ? 120 : (lvl >= 36 ? 110 : 100); break;
    case "a1-cold": expPerLvl = lvl >= 67 ? 125 : (lvl >= 36 ? 115 : 105); break;
    case "a2-prayer":
    case "a2-defiance":
    case "a2-ba": expPerLvl = 110; break;
    case "a2-hf":
    case "a2-might": expPerLvl = 120; break;
    case "a3-fire":
    case "a3-ltng": expPerLvl = lvl >= 79 ? 130 : (lvl >= 49 ? 120 : 110); break;
    case "a3-cold": expPerLvl = lvl >= 79 ? 140 : (lvl >= 49 ? 130 : 120); break;
    case "a5-bash":
    case "a5-frenzy": expPerLvl = lvl >= 80 ? 140 : (lvl >= 58 ? 130 : 120); break;
    default: expPerLvl = 120; break;
  }
  return expPerLvl * lvl * lvl * (lvl + 1);
}

// Verified D2R 3.4 (v105) Warlock Bound Demon `lf` (120-byte) templates captured from in-game saves
export const WARLOCK_DEMON_LF_TEMPLATES = {
  fana: "6c66010018000100be004d8b080010000203000000000000030000006b0000005500000000000000000000000000000000000000000000000700000002000000010000000000000000000000000000000000000005061b1e0000000000000000676606002e5e000e005cbc0030a802000068903f1000f01f",
  conc: "6c66010018000100be000e17080010000203000000000000030000006b0000005500000000000000000000000000000000000000000000000700000002000000010000000000000000000000000000000000000005061b1e0000000000000000676606006869000e00d0d20030a802000068903f1000f01f",
  hf: "6c660100180001003601a084080010000203000000000000030000006b0000005500000000000000000000000000000000000000000000000700000002000000010000000000000000000000000000000000000005061b1e000000000000000067660600406a000e0080d40030a802000068907f1100f01f",
  thorns: "6c660100180001006a01d7af080010000203000000000000030000006b0000005500000000000000000000000000000000000000000000000700000002000000010000000000000000030000000000000000000005061b1e000000000000000067660600a069000e0040d30030a802000068903f1000f01f",
  vigor: "6c660100180001006a012c90180010000203000000000000034700006b0000005c0100001900000000000000000000000000000000000000070000000200000001000000000000000003000000000000000000001b0805061e000000005234d067660600409c000e0080380130d002000068200d7800f01f"
};
WARLOCK_DEMON_LF_TEMPLATES.holyfreeze = WARLOCK_DEMON_LF_TEMPLATES.hf;

function hexToBytes(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

// Official D2R v97+ / v105 Huffman table for 4-char item codes
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

export const RUNE_NAME_TO_CODE = {
  El: "r01", Eld: "r02", Tir: "r03", Nef: "r04", Eth: "r05", Ith: "r06",
  Tal: "r07", Ral: "r08", Ort: "r09", Thul: "r10", Amn: "r11", Sol: "r12",
  Shael: "r13", Dol: "r14", Hel: "r15", Io: "r16", Lum: "r17", Ko: "r18",
  Fal: "r19", Lem: "r20", Pul: "r21", Um: "r22", Mal: "r23", Ist: "r24",
  Gul: "r25", Vex: "r26", Ohm: "r27", Lo: "r28", Sur: "r29", Ber: "r30",
  Jah: "r31", Cham: "r32", Zod: "r33"
};

export const SLOT_TO_EQUIPPED_ID = {
  head: 1,
  amulet: 2,
  torso: 3,
  weapon: 4,
  offhand: 5,
  ring1: 6,
  ring2: 7,
  belt: 8,
  boots: 9,
  gloves: 10,
  swapWeapon: 11,
  swapOffhand: 12
};

// Complete D2R 3.4 (v105) ID tables auto-generated from uniqueitems.txt, setitems.txt, runes.txt, itemstatcost.txt
export const KNOWN_UNIQUE_IDS = D2S_UNIQUE_IDS;
export const KNOWN_SET_IDS = D2S_SET_IDS;
export const KNOWN_RUNEWORD_IDS = D2S_RUNEWORD_IDS;

function normLookupKey(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*/g, "")
    .replace(/^the\s+/, "")
    .replace(/[^a-z0-9]/g, "");
}

const UNIQUE_BY_NORM = new Map(Object.entries(D2S_UNIQUE_IDS).map(([k, v]) => [normLookupKey(k), v]));
const SET_BY_NORM = new Map(Object.entries(D2S_SET_IDS).map(([k, v]) => [normLookupKey(k), v]));
const RUNEWORD_BY_NORM = new Map(Object.entries(D2S_RUNEWORD_IDS).map(([k, v]) => [normLookupKey(k), v]));

export function lookupUniqueId(name) {
  if (!name) return undefined;
  if (D2S_UNIQUE_IDS[name] !== undefined) return D2S_UNIQUE_IDS[name];
  return UNIQUE_BY_NORM.get(normLookupKey(name));
}

export function lookupSetId(name) {
  if (!name) return undefined;
  if (D2S_SET_IDS[name] !== undefined) return D2S_SET_IDS[name];
  return SET_BY_NORM.get(normLookupKey(name));
}

export function lookupRunewordId(idOrName) {
  if (!idOrName) return undefined;
  if (D2S_RUNEWORD_IDS[idOrName] !== undefined) return D2S_RUNEWORD_IDS[idOrName];
  return RUNEWORD_BY_NORM.get(normLookupKey(idOrName));
}

const ITEM_STAT_SPECS = D2S_ITEM_STAT_SPECS;
// Companion stats automatically written immediately after their parent stat (never written standalone)
const COMPANION_STAT_IDS = new Set([18, 49, 51, 53, 55, 56, 58, 59]);

function writeHuffmanCode(bw, code4) {
  const padded = String(code4 || "    ").toLowerCase().padEnd(4, " ").slice(0, 4);
  for (let i = 0; i < 4; i += 1) {
    const bits = D2R_HUFFMAN_CODES[padded[i]] || D2R_HUFFMAN_CODES[" "];
    for (let j = 0; j < bits.length; j += 1) {
      bw.writeBits(bits[j] === "1" ? 1 : 0, 1);
    }
  }
}

function writeItemStatList(bw, stats) {
  const ordered = [...(stats || [])]
    .filter((st) => st && !COMPANION_STAT_IDS.has(st.id) && ITEM_STAT_SPECS[st.id])
    .sort((a, b) => (a.id - b.id) || ((Number(a.param) || 0) - (Number(b.param) || 0)));
  for (const st of ordered) {
    const spec = ITEM_STAT_SPECS[st.id];
    const [bits, saveAdd, paramBits] = spec;
    const maxRaw = (1 << bits) - 1;
    const rawVal = Math.max(0, Math.min(maxRaw, Math.round((Number(st.val) || 0) + saveAdd)));
    bw.writeBits(st.id, 9);
    if (paramBits > 0) {
      bw.writeBits(Math.max(0, Math.round(Number(st.param) || 0)), paramBits);
    }
    bw.writeBits(rawVal, bits);
    if (st.id === 17) {
      // item_maxdamage_percent (17) is immediately paired with item_mindamage_percent (18)
      bw.writeBits(rawVal, bits);
    }
  }
  bw.writeBits(0x1ff, 9);
}

/**
 * Encode a single D2R ver=5 (v97+/v105) item (plus optional socketed child runes) into bytes.
 */
export function encodeD2rV5Item({
  code,
  simple = false,
  v105 = true,
  location = 0,
  equippedId = 0,
  x = 0,
  y = 0,
  storePage = 0,
  ethereal = false,
  quality = 2,
  uniqueId = null,
  setId = null,
  runewordId = null,
  isArmor = false,
  isWeapon = false,
  stackable = false,
  defense = 0,
  maxDur = 0,
  ilvl = 85,
  itemId = 0x10000001,
  stats = [],
  runewordStats = [],
  socketRuneCodes = [],
  socketItems = [],
  socketCount = 0,
  advQty = null
} = {}) {
  const cleanCode = String(code || "").trim().toLowerCase();
  if (cleanCode.length < 3) return new Uint8Array(0);
  const rawChildren = simple
    ? []
    : (Array.isArray(socketItems) && socketItems.length > 0
      ? socketItems
      : (socketRuneCodes || []).map((c) => ({ code: c, simple: true })));
  const childSpecs = rawChildren
    .map((ch) => (typeof ch === "string" ? { code: ch, simple: true } : ch))
    .filter((ch) => ch && ch.code && String(ch.code).trim().length >= 3)
    .slice(0, 6);
  const isRw = !simple && runewordId !== null && runewordId !== undefined && childSpecs.length > 0;
  const totalSockets = simple
    ? 0
    : Math.min(6, Math.max(Math.round(Number(socketCount) || 0), childSpecs.length));
  const isSocketed = !simple && totalSockets > 0;

  // Bit 4 (0x10) = identified, Bit 23 (0x800000) = D2R v97+/v105 item flag (mandatory in v105!)
  let flags = 0x00800010;
  if (isSocketed) flags |= 0x00000800;
  if (simple) flags |= 0x00200000;
  if (ethereal) flags |= 0x00400000;
  if (isRw) flags |= 0x04000000;

  const bw = new BitWriter();
  bw.writeBits(flags, 32);
  bw.writeBits(5, 3); // D2R v97+/v105 item version = 5
  bw.writeBits(location, 3);
  bw.writeBits(equippedId, 4);
  bw.writeBits(location === 1 ? equippedId : x, 4);
  bw.writeBits(y, 4);
  bw.writeBits(storePage, 3);
  writeHuffmanCode(bw, cleanCode);

  if (simple) {
    bw.writeBits(0, 1); // hasRealmData = 0
    // D2R 3.4 (v105) simple items carry a 1-bit AdvancedStashQuantity flag:
    // items with AdvancedStashStackable=1 (runes, gems, rejuv potions) set 1 + 8-bit quantity (0 when single in bag/stash/socket, 1..99 in AdvancedStash Tab 5);
    // other simple items set 0.
    if (v105) {
      const hasQty = (advQty !== null && advQty !== undefined) || Boolean(D2S_ADV_STACKABLE_META[cleanCode]);
      if (hasQty) {
        bw.writeBits(1, 1);
        bw.writeBits(Math.min(255, Math.max(0, Math.round(Number(advQty) || 0))), 8);
      } else {
        bw.writeBits(0, 1);
      }
    }
    return bw.toUint8Array();
  }

  bw.writeBits(childSpecs.length, 3);
  bw.writeBits(itemId >>> 0, 32);
  bw.writeBits(Math.min(99, Math.max(1, ilvl)), 7);
  const finalQuality = isRw ? 2 : quality;
  bw.writeBits(finalQuality, 4);
  bw.writeBits(0, 1); // multipleGfx
  bw.writeBits(0, 1); // classAuto

  if (finalQuality === 4) {
    bw.writeBits(0, 11); // magic prefix
    bw.writeBits(0, 11); // magic suffix
  } else if (finalQuality === 5) {
    bw.writeBits(Math.max(0, Number(setId) || 0), 12);
  } else if (finalQuality === 7) {
    bw.writeBits(Math.max(0, Number(uniqueId) || 0), 12);
  }

  if (isRw) {
    bw.writeBits(Number(runewordId) || 0, 12);
    bw.writeBits(5, 4);
  }

  bw.writeBits(0, 1); // hasRealmData = 0

  if (isArmor) {
    const defVal = Math.min(2047, Math.max(11, Math.round((Number(defense) || 10) + 10)));
    bw.writeBits(defVal, 11);
  }
  if (isArmor || isWeapon) {
    const dur = Math.min(255, Math.max(0, Math.round(Number(maxDur) || 0)));
    bw.writeBits(dur, 8);
    if (dur > 0) {
      bw.writeBits(dur, 9);
    }
  }
  if (stackable) {
    bw.writeBits(100, 9);
  }
  // D2R v105 mandatory 1-bit flag before sockets/statList on EVERY complex item (armor, weapon, jewelry, charm)
  if (v105) {
    bw.writeBits(0, 1);
  }
  if (isSocketed) {
    bw.writeBits(totalSockets, 4);
  }
  if (finalQuality === 5) {
    bw.writeBits(0, 5); // set list mask
  }

  writeItemStatList(bw, isRw ? [] : stats);
  if (isRw) {
    writeItemStatList(bw, runewordStats && runewordStats.length ? runewordStats : stats);
  }
  // D2R 3.4 (v105) mandatory 1-bit hasAdvancedQuantity tail flag after the final 0x1ff stat terminator on EVERY complex item
  // (0 for normal/equipped/stash gear; 1 + 8-bit quantity for quest materials like keys/organs/essences/shards/statues in AdvancedStash Tab 5)
  if (v105) {
    if (advQty !== null && advQty !== undefined) {
      bw.writeBits(1, 1);
      bw.writeBits(Math.min(255, Math.max(0, Math.round(Number(advQty) || 0))), 8);
    } else {
      bw.writeBits(0, 1);
    }
  }

  const parentBytes = bw.toUint8Array();
  if (childSpecs.length === 0) return parentBytes;

  const childChunks = childSpecs.map((child, sockIdx) =>
    encodeD2rV5Item({
      ...child,
      simple: child.simple !== undefined ? Boolean(child.simple) : false,
      v105,
      location: 6,
      equippedId: 0,
      x: sockIdx,
      y: 0,
      storePage: 0,
      itemId: child.itemId || ((itemId + 0x10000 + sockIdx + 1) >>> 0)
    })
  );
  return concatBytes([parentBytes, ...childChunks]);
}

// Official D2R cumulative XP thresholds for levels 1..99 (index = level)
const EXP_BY_LEVEL = [
  0, 0, 500, 1500, 3750, 7875, 14175, 22680, 32886, 44396, 57715,
  72144, 90180, 112725, 140906, 176132, 220165, 275207, 344008, 430010, 537513,
  671891, 839864, 1049830, 1312287, 1640359, 2050449, 2563061, 3203826, 3902260, 4663553,
  5493363, 6397855, 7383752, 8458379, 9629723, 10906488, 12298162, 13815086, 15468534, 17270791,
  19235252, 21376515, 23710491, 26254525, 29027522, 32050088, 35344686, 38935798, 42850109, 47116709,
  51767302, 56836449, 62361819, 68384473, 74949165, 82104680, 89904191, 98405658, 107672256, 117772849,
  128782495, 140783010, 153863570, 168121381, 183662396, 200602101, 219066380, 239192444, 261129853, 285041630,
  311105466, 339515048, 370481492, 404234916, 441026148, 481128591, 524840254, 572485967, 624419793, 681027665,
  742730244, 809986056, 883294891, 963201521, 1050299747, 1145236814, 1248718217, 1361512946, 1484459201, 1618470619,
  1764543065, 1923762030, 2097310703, 2286478756, 2492671933, 2717422497, 2962400612, 3229426756, 3520485254
];

class BitWriter {
  constructor() {
    this.bits = [];
  }
  writeBits(value, count) {
    const v = Math.max(0, Math.floor(Number(value) || 0));
    for (let i = 0; i < count; i += 1) {
      this.bits.push(Math.floor(v / (2 ** i)) & 1);
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

function concatBytes(chunks) {
  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return out;
}

/**
 * Official Diablo II / D2R 32-bit rotating checksum algorithm.
 * Bytes 12..15 are treated as zero during accumulation.
 */
export function computeD2sChecksum(bytes) {
  let sum = 0;
  for (let i = 0; i < bytes.length; i += 1) {
    const b = (i >= 12 && i <= 15) ? 0 : bytes[i];
    const carry = (sum & 0x80000000) ? 1 : 0;
    sum = (((sum << 1) | carry) + b) | 0;
  }
  return sum | 0;
}

export function sanitizeD2sCharName(rawName, fallback = "SanctuaryHero") {
  // D2 / D2R character names only allow ASCII letters and at most one '-' or '_' (no digits)
  let seenSep = false;
  let clean = "";
  for (const ch of String(rawName || "")) {
    if ((ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z")) {
      clean += ch;
    } else if ((ch === "-" || ch === "_") && clean.length > 0 && !seenSep) {
      clean += ch;
      seenSep = true;
    }
    if (clean.length >= 15) break;
  }
  clean = clean.replace(/[-_]+$/, "");
  return clean.length >= 2 ? clean : fallback;
}

function writeAsciiFixed(buf, offset, text, maxBytes) {
  const clean = String(text || "").slice(0, maxBytes - 1);
  for (let i = 0; i < clean.length; i += 1) {
    buf[offset + i] = clean.charCodeAt(i) & 0x7f;
  }
}

/**
 * Build a structurally complete D2R / D2R 3.4 .d2s binary save buffer from simulator state.
 */
export function buildD2sBuffer({
  name = "SanctuaryHero",
  classId = "sor",
  level = 90,
  hardcore = false,
  activeWeaponSet = 1,
  statAlloc = { str: 0, dex: 0, vit: 0, enr: 0 },
  charBaseStats = { str: 20, dex: 20, vit: 20, enr: 20, hp: 50, mana: 25, hpPerLvl: 2, manaPerLvl: 1.5, hpPerVit: 2, manaPerEnr: 2 },
  skills = {},
  classSkills = [],
  mercEnabled = true,
  mercVariant = "a2-might",
  mercLevel = null,
  demonAura = "none",
  items = [],
  stashItems = [],
  mercItems = []
} = {}) {
  const classCode = CLASS_ID_TO_CODE[classId] !== undefined ? CLASS_ID_TO_CODE[classId] : 1;
  const isWarlock = classCode === 7;
  // D2R 3.4 (Reign of the Warlock) uses save version 105 across ALL 8 classes so header, item flags,
  // and D2R 3.4 ItemStatCost.txt bit-widths (e.g. 9-bit / SaveAdd=200 resistances) stay 100% consistent.
  const version = 105;
  const charLvl = Math.min(99, Math.max(1, Math.round(Number(level) || 90)));
  const clsCap = String(classId || "Hero").replace(/[^A-Za-z]/g, "");
  const cleanName = sanitizeD2sCharName(name, `Sanctuary${clsCap ? clsCap.charAt(0).toUpperCase() + clsCap.slice(1) : "Hero"}`);

  // Header length: 0x341 (833 bytes) for D2R 3.4 v105
  const header = new Uint8Array(0x341);
  const hv = new DataView(header.buffer);
  hv.setUint32(0x00, D2S_MAGIC, true);
  hv.setUint32(0x04, version, true);
  // 0x08 length & 0x0c checksum filled at end
  hv.setUint32(0x10, activeWeaponSet === 2 ? 1 : 0, true);

  // D2R 3.4 (v105) header layout: fields shifted -0x10, name at 0x12b, Woo! at 0x193, WS at 0x2bd, w4 at 0x30e
  header[0x14] = 0x20 | (hardcore ? 0x04 : 0x00);
  header[0x15] = 15; // Hell Baal slain
  header[0x18] = classCode;
  header[0x19] = 0x10;
  header[0x1a] = 0x1e;
  header[0x1b] = charLvl;
  hv.setUint32(0x20, Math.floor(Date.now() / 1000), true);
  header.fill(0xff, 0x24, 0x28);
  for (let i = 0; i < 16; i += 1) {
    hv.setUint16(0x28 + i * 4, 0xffff, true);
  }
  header.fill(0xff, 0x78, 0x98);
  if (isWarlock) {
    // Warlock default skill signature at 0x6c & appearance byte from native v105 save
    header[0x6c] = 0x8b;
    header[0x6d] = 0x01;
    header[0x7d] = 0x19;
  }
  // D2R 3.4 (v105) PreviewData metadata (mandatory for ALL 8 classes: 0x0f8 = GameVersion 3, 0x103 = 4)
  header[0xf8] = 0x03;
  header[0x103] = 0x04;
  header[0x98] = 0x00;
  header[0x99] = 0x00;
  header[0x9a] = 0x80; // Hell active, Act 1
  hv.setUint32(0x9b, 0x13579bdf, true);
  if (mercEnabled) {
    const finalMercLvl = Math.min(98, charLvl, Math.max(1, Math.round(Number(mercLevel) || charLvl)));
    hv.setUint16(0xa1, 0, true);
    hv.setUint32(0xa3, 0x2468ace0, true);
    hv.setUint16(0xa7, 1, true);
    hv.setUint16(0xa9, MERC_VARIANT_TO_TYPE_ID[mercVariant] ?? 11, true);
    hv.setUint32(0xab, computeMercExp(mercVariant, finalMercLvl), true);
  }
  writeAsciiFixed(header, 0x12b, cleanName, 16);

  // Quests ("Woo!" at 0x193, length 298)
  header[0x193] = 0x57;
  header[0x194] = 0x6f;
  header[0x195] = 0x6f;
  header[0x196] = 0x21;
  hv.setUint32(0x197, 6, true);
  hv.setUint16(0x19b, 298, true);
  for (let diff = 0; diff < 3; diff += 1) {
    const base = 0x19d + diff * 96;
    const completedQuestIndices = [
      0, 1, 2, 3, 4, 5, 6, 7,
      8, 9, 10, 11, 12, 13, 14, 15,
      16, 17, 18, 19, 20, 21, 22, 23,
      24, 25, 26, 27, 28,
      35, 36, 37, 38, 39, 40
    ];
    for (const qIdx of completedQuestIndices) {
      hv.setUint16(base + qIdx * 2, 0x0001, true);
    }
  }

  // Waypoints ("WS" at 0x2bd, length 80 + 0x01 byte at 0x30d)
  header[0x2bd] = 0x57;
  header[0x2be] = 0x53;
  hv.setUint32(0x2bf, 1, true);
  hv.setUint16(0x2c3, 80, true);
  for (let diff = 0; diff < 3; diff += 1) {
    const base = 0x2c5 + diff * 24;
    header[base] = 0x02;
    header[base + 1] = 0x01;
    header[base + 2] = 0xff;
    header[base + 3] = 0xff;
    header[base + 4] = 0xff;
    header[base + 5] = 0xff;
    header[base + 6] = 0x7f;
  }
  header[0x30d] = 0x01;

  // NPC intro ("w4" at 0x30e, 51 bytes; 0x310..0x340 zeroed as in v105)
  header[0x30e] = 0x77;
  header[0x30f] = 0x34;

  // Compute total base attributes + HP/Mana + remaining stat/skill points
  const baseStr = Number(charBaseStats.str) || 20;
  const baseDex = Number(charBaseStats.dex) || 20;
  const baseVit = Number(charBaseStats.vit) || 20;
  const baseEnr = Number(charBaseStats.enr) || 20;
  const addStr = Math.max(0, Math.round(Number(statAlloc.str) || 0));
  const addDex = Math.max(0, Math.round(Number(statAlloc.dex) || 0));
  const addVit = Math.max(0, Math.round(Number(statAlloc.vit) || 0));
  const addEnr = Math.max(0, Math.round(Number(statAlloc.enr) || 0));

  const totalStr = Math.min(1023, baseStr + addStr);
  const totalDex = Math.min(1023, baseDex + addDex);
  const totalVit = Math.min(1023, baseVit + addVit);
  const totalEnr = Math.min(1023, baseEnr + addEnr);

  const maxStatBudget = (charLvl - 1) * 5 + 15;
  const remStatPts = Math.max(0, Math.min(1023, maxStatBudget - (addStr + addDex + addVit + addEnr)));

  const orderedSkills = [...(classSkills || [])].sort((a, b) => a.id - b.id);
  const skillBytes = new Uint8Array(30);
  let usedSkillPts = 0;
  for (let i = 0; i < Math.min(30, orderedSkills.length); i += 1) {
    const pts = Math.min(20, Math.max(0, Math.round(Number(skills[orderedSkills[i].key] || 0))));
    skillBytes[i] = pts;
    usedSkillPts += pts;
  }
  const maxSkillBudget = (charLvl - 1) + 12;
  const remSkillPts = Math.max(0, Math.min(255, maxSkillBudget - usedSkillPts));

  const baseHp = (Number(charBaseStats.hp) || 50) + (charLvl - 1) * (Number(charBaseStats.hpPerLvl) || 2) + addVit * (Number(charBaseStats.hpPerVit) || 2) + 60;
  const baseMana = (Number(charBaseStats.mana) || 25) + (charLvl - 1) * (Number(charBaseStats.manaPerLvl) || 1.5) + addEnr * (Number(charBaseStats.manaPerEnr) || 2);
  const hpScaled = Math.min(0x1fffff, Math.max(256, Math.round(baseHp) << 8));
  const manaScaled = Math.min(0x1fffff, Math.max(256, Math.round(baseMana) << 8));
  const stamScaled = Math.min(0x1fffff, (100 + charLvl * 2) << 8);

  // gf attributes bitstream
  const attrPairs = [
    [0, totalStr],
    [1, totalEnr],
    [2, totalDex],
    [3, totalVit],
    [4, remStatPts],
    [5, remSkillPts],
    [6, hpScaled],
    [7, hpScaled],
    [8, manaScaled],
    [9, manaScaled],
    [10, stamScaled],
    [11, stamScaled],
    [12, charLvl],
    [13, EXP_BY_LEVEL[charLvl] || 0],
    [14, 100000],
    [15, 2500000]
  ];
  const abw = new BitWriter();
  for (const [id, val] of attrPairs) {
    if (val <= 0 && id !== 12 && id !== 13) continue;
    abw.writeBits(id, 9);
    abw.writeBits(val, ATTR_STAT_BITS[id]);
  }
  abw.writeBits(0x1ff, 9);
  const gfSection = concatBytes([new Uint8Array([0x67, 0x66]), abw.toUint8Array()]);

  // if 30-skill block
  const ifSection = concatBytes([new Uint8Array([0x69, 0x66]), skillBytes]);

  // Player item list ("JM" + count + encoded ver=5 items), corpse ("JM" 0), merc ("jf" + "JM" + merc items), iron golem ("kf" 0), plus v105 "lf" bound demon
  const emptyJm = new Uint8Array([0x4a, 0x4d, 0x00, 0x00]);
  const encodeJmList = (itemSpecs, idStart) => {
    const encoded = [];
    let seq = idStart;
    for (const spec of itemSpecs || []) {
      if (!spec || !spec.code) continue;
      const chunk = encodeD2rV5Item({ ...spec, v105: true, itemId: spec.itemId || (seq += 1) });
      if (chunk && chunk.length > 0) encoded.push(chunk);
    }
    if (encoded.length === 0) return { bytes: emptyJm, count: 0 };
    const jmHead = new Uint8Array(4);
    jmHead[0] = 0x4a;
    jmHead[1] = 0x4d;
    new DataView(jmHead.buffer).setUint16(2, encoded.length, true);
    return { bytes: concatBytes([jmHead, ...encoded]), count: encoded.length };
  };
  const normalizedStash = (stashItems || [])
    .filter((s) => s && s.code)
    .map((s) => ({ ...s, location: 0, equippedId: 0, storePage: 5 }));
  const playerJmRes = encodeJmList([...(items || []), ...normalizedStash], 0x10000100);
  const mercJmRes = mercEnabled ? encodeJmList(mercItems, 0x20000100) : { bytes: emptyJm, count: 0 };
  const jfParts = [new Uint8Array([0x6a, 0x66])];
  if (mercEnabled) jfParts.push(mercJmRes.bytes);
  const demonKey = String(demonAura || "none").toLowerCase();
  const demonHex = isWarlock ? WARLOCK_DEMON_LF_TEMPLATES[demonKey] : null;
  const kfSection = concatBytes([
    new Uint8Array([0x6b, 0x66, 0x00, 0x01, 0x00]),
    demonHex ? hexToBytes(demonHex) : new Uint8Array([0x6c, 0x66, 0x00, 0x00])
  ]);

  const full = concatBytes([header, gfSection, ifSection, playerJmRes.bytes, emptyJm, ...jfParts, kfSection]);
  const fv = new DataView(full.buffer);
  fv.setUint32(0x08, full.length, true);
  fv.setInt32(0x0c, computeD2sChecksum(full), true);

  return {
    bytes: full,
    filename: `${cleanName}.d2s`,
    meta: {
      name: cleanName,
      version,
      classId,
      classCode,
      level: charLvl,
      usedSkillPts,
      remSkillPts,
      remStatPts,
      itemCount: playerJmRes.count,
      stashItemCount: normalizedStash.length,
      mercItemCount: mercJmRes.count,
      demonAura: demonHex ? demonKey : "none",
      checksum: fv.getInt32(0x0c, true)
    }
  };
}
