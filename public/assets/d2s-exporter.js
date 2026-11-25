// Pure client-side D2R / D2R 3.4 (.d2s) offline save exporter.
// Generates a structurally valid single-player test save (header, quests, waypoints,
// gf attributes bitstream, 30-skill block, merc metadata, and 32-bit rotating checksum)
// 100% locally in the browser.

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
  "a5-frenzy": 30
};

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
  const ascii = String(rawName || "")
    .replace(/[^A-Za-z0-9_-]/g, "")
    .replace(/^[^A-Za-z]+/, "")
    .slice(0, 15);
  return ascii.length >= 2 ? ascii : fallback;
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
  mercVariant = "a2-might"
} = {}) {
  const classCode = CLASS_ID_TO_CODE[classId] !== undefined ? CLASS_ID_TO_CODE[classId] : 1;
  const isWarlock = classCode === 7;
  const version = isWarlock ? 100 : 99;
  const charLvl = Math.min(99, Math.max(1, Math.round(Number(level) || 90)));
  const cleanName = sanitizeD2sCharName(name, `D2R_${String(classId || "hero").toUpperCase()}`);

  // 765-byte (0x2fd) canonical D2R header (character info + quests + waypoints + NPC intros)
  const header = new Uint8Array(0x2fd);
  const hv = new DataView(header.buffer);
  hv.setUint32(0x00, D2S_MAGIC, true);
  hv.setUint32(0x04, version, true);
  // 0x08 length & 0x0c checksum filled at end
  hv.setUint32(0x10, activeWeaponSet === 2 ? 1 : 0, true);
  writeAsciiFixed(header, 0x14, cleanName, 16);
  if (isWarlock) {
    writeAsciiFixed(header, 0x10b, cleanName, 16);
  }

  // Status: 0x20 = Expansion, 0x04 = Hardcore
  header[0x24] = 0x20 | (hardcore ? 0x04 : 0);
  // Progression: 15 (Hell Baal slain — Patriarch / Matriarch)
  header[0x25] = 15;
  // Class code (0..7)
  header[0x28] = classCode;
  header[0x29] = 0x10;
  header[0x2a] = 0x1e;
  header[0x2b] = charLvl;
  hv.setUint32(0x30, Math.floor(Date.now() / 1000), true);

  // Hotkeys: 16 x 0xFFFF (unassigned)
  for (let i = 0; i < 16; i += 1) {
    hv.setUint32(0x38 + i * 4, 0xffff, true);
  }
  // Left/Right skills (default Attack = 0)
  hv.setUint32(0x78, 0, true);
  hv.setUint32(0x7c, 0, true);
  hv.setUint32(0x80, 0, true);
  hv.setUint32(0x84, 0, true);

  // Character appearance (32 bytes at 0x88: 0xFF = default)
  header.fill(0xff, 0x88, 0xa8);

  // Difficulty & starting act (0xA8..0xAA: Normal/NM/Hell active in Hell Act 1)
  header[0xa8] = 0x00;
  header[0xa9] = 0x00;
  header[0xaa] = 0x80; // Hell active, Act 1
  hv.setUint32(0xab, 0x13579bdf, true); // map seed

  // Mercenary header (0xB1..0xBD)
  if (mercEnabled) {
    hv.setUint16(0xb1, 0, true); // alive
    hv.setUint32(0xb3, 0x2468ace0, true); // merc seed (non-zero = hired)
    hv.setUint16(0xb7, 1, true); // name id
    hv.setUint16(0xb9, MERC_VARIANT_TO_TYPE_ID[mercVariant] ?? 11, true);
    hv.setUint32(0xbb, Math.min(EXP_BY_LEVEL[Math.min(98, charLvl)], 0x7fffffff), true);
  }

  // Quests block ("Woo!" at 0x14F, length 298 bytes)
  header[0x14f] = 0x57; // 'W'
  header[0x150] = 0x6f; // 'o'
  header[0x151] = 0x6f; // 'o'
  header[0x152] = 0x21; // '!'
  hv.setUint32(0x153, 6, true); // quest version
  hv.setUint16(0x157, 298, true); // block size
  // Mark Den of Evil, Radament, Lam Esen, Golden Bird, Izual, Anya & Act bosses done in all 3 difficulties
  for (let diff = 0; diff < 3; diff += 1) {
    const base = 0x159 + diff * 96;
    const completedQuestIndices = [1, 6, 9, 14, 17, 20, 22, 25, 26, 27, 28, 37, 40];
    for (const qIdx of completedQuestIndices) {
      hv.setUint16(base + qIdx * 2, 0x0001, true);
    }
  }

  // Waypoints block ("WS" at 0x279, length 80 bytes — unlock all 39 WPs in Normal/NM/Hell)
  header[0x279] = 0x57; // 'W'
  header[0x27a] = 0x53; // 'S'
  hv.setUint32(0x27b, 1, true);
  hv.setUint16(0x27f, 80, true);
  for (let diff = 0; diff < 3; diff += 1) {
    const base = 0x281 + diff * 24;
    header[base] = 0x02;
    header[base + 1] = 0x01;
    header[base + 2] = 0xff;
    header[base + 3] = 0xff;
    header[base + 4] = 0xff;
    header[base + 5] = 0xff;
    header[base + 6] = 0x7f; // 39 waypoints bitmask
  }

  // NPC intro block ("w4" at 0x2C9, length 52 bytes)
  header[0x2c9] = 0x77; // 'w'
  header[0x2ca] = 0x34; // '4'
  hv.setUint16(0x2cb, 52, true);

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

  // Empty valid item list ("JM" 0), corpse ("JM" 0), merc ("jf" + optional "JM" 0), iron golem ("kf" 0)
  const emptyJm = new Uint8Array([0x4a, 0x4d, 0x00, 0x00]);
  const jfParts = [new Uint8Array([0x6a, 0x66])];
  if (mercEnabled) jfParts.push(emptyJm);
  const kfSection = new Uint8Array([0x6b, 0x66, 0x00]);

  const full = concatBytes([header, gfSection, ifSection, emptyJm, emptyJm, ...jfParts, kfSection]);
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
      checksum: fv.getInt32(0x0c, true)
    }
  };
}
