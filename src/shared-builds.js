import { VALID_CLASS_IDS, checkSameOriginCsrf, sha256Hex } from "./auth-crypto.js";
import { authJson, getAuthenticatedUser, readJsonBody } from "./auth.js";
import { getSkillsCatalog } from "./skills-catalog.js";
import { getItemsCatalog } from "./items-metadata.js";
import { getRunewordsCatalog } from "./runewords-metadata.js";
import { getPaperdollCatalog } from "./paperdoll-data.js";
import { DASHBOARD_THEME_VERSION } from "./dashboard.js";

const KEY_SHARE_BUILD_PREFIX = "share:build:";
const KEY_SHARE_RL_PREFIX = "share:rl:";
const KEY_USER_SHARES_PREFIX = "user:shares:";
const MAX_USER_SHARES = 50;
const MAX_SHARE_BODY_BYTES = 64 * 1024;
const SHARE_RL_WINDOW_SECONDS = 600;
const SHARE_RL_MAX_CREATES = 20;
const SHARE_ID_ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz";
const SHARE_ID_PATTERN = /^[a-z0-9]{6,16}$/;

const CHAR_SLOTS = [
  { id: "weapon", area: "weapon", label: "主手武器", bg: "/images/ui/inventory_paperdoll_weapon.webp", tall: true },
  { id: "head", area: "head", label: "头盔", bg: "/images/ui/inventory_paperdoll_headarmor.webp" },
  { id: "offhand", area: "offhand", label: "副手/盾/魔典", bg: "/images/ui/inventory_paperdoll_shield.webp", tall: true },
  { id: "torso", area: "torso", label: "盔甲", bg: "/images/ui/inventory_paperdoll_chestarmor.webp", tall: true },
  { id: "gloves", area: "gloves", label: "手套", bg: "/images/ui/inventory_paperdoll_glove.webp" },
  { id: "belt", area: "belt", label: "腰带", bg: "/images/ui/inventory_paperdoll_belt.webp", mini: true },
  { id: "boots", area: "boots", label: "鞋子", bg: "/images/ui/inventory_paperdoll_boots.webp" },
  { id: "ring1", area: "ring1", label: "左戒指", bg: "/images/ui/inventory_paperdoll_ring.webp", mini: true },
  { id: "amulet", area: "amulet", label: "护身符(项链)", bg: "/images/ui/inventory_paperdoll_amulet.webp", mini: true },
  { id: "ring2", area: "ring2", label: "右戒指", bg: "/images/ui/inventory_paperdoll_ring.webp", mini: true }
];

const MERC_SLOTS = [
  { id: "weapon", label: "佣兵武器", bg: "/images/ui/inventory_paperdoll_weapon.webp", tall: true },
  { id: "head", label: "佣兵头盔", bg: "/images/ui/inventory_paperdoll_headarmor.webp" },
  { id: "offhand", label: "佣兵副手", bg: "/images/ui/inventory_paperdoll_shield.webp", tall: true },
  { id: "torso", label: "佣兵盔甲", bg: "/images/ui/inventory_paperdoll_chestarmor.webp", gridSpan: 3 }
];

const BASE_TYPE_ICON_FALLBACK = {
  swor: "/images/items/weapon/sword/crystal_sword.webp",
  mace: "/images/items/weapon/mace/flail.webp",
  scep: "/images/items/weapon/scepter/war_scepter.webp",
  axe: "/images/items/weapon/axe/war_axe.webp",
  taxe: "/images/items/weapon/axe/throwing_axe.webp",
  club: "/images/items/weapon/club/club.webp",
  hamm: "/images/items/weapon/hammer/war_hammer.webp",
  knif: "/images/items/weapon/knife/dagger.webp",
  tkni: "/images/items/weapon/knife/throwing_knife.webp",
  jave: "/images/items/weapon/javelin/javelin.webp",
  ajav: "/images/items/weapon/javelin/maiden_javelin.webp",
  spea: "/images/items/weapon/spear/spear.webp",
  aspe: "/images/items/weapon/spear/maiden_spear.webp",
  pole: "/images/items/weapon/polearm/scythe.webp",
  staf: "/images/items/weapon/staff/war_staff.webp",
  wand: "/images/items/weapon/wand/bone_wand.webp",
  orb: "/images/items/weapon/orb/eagle_orb.webp",
  bow: "/images/items/weapon/bow/long_bow.webp",
  abow: "/images/items/weapon/bow/stag_bow.webp",
  xbow: "/images/items/weapon/bow/crossbow.webp",
  h2h: "/images/items/weapon/h2h/claws.webp",
  h2h2: "/images/items/weapon/h2h/claws.webp",
  ashd: "/images/items/armor/shield/targe.webp",
  shie: "/images/items/armor/shield/kite_shield.webp",
  grim: "/images/items/armor/grimoires/grimoire.webp",
  head: "/images/items/armor/voodoo_head/preserved_head.webp",
  tors: "/images/items/armor/armor/light_plate.webp",
  helm: "/images/items/armor/helmet/helm.webp",
  phlm: "/images/items/armor/helmet/avenger_guard.webp",
  pelt: "/images/items/armor/pelt/wolf_head.webp",
  circ: "/images/items/armor/circlet/diadem.webp",
  glov: "/images/items/armor/glove/heavy_gloves.webp",
  boot: "/images/items/armor/boot/chain_boots.webp",
  belt: "/images/items/armor/belt/light_belt.webp"
};

const SLOT_ICON_FALLBACK = {
  weapon: "/images/items/weapon/sword/crystal_sword.webp",
  offhand: "/images/items/armor/shield/kite_shield.webp",
  head: "/images/items/armor/helmet/helm.webp",
  torso: "/images/items/armor/armor/light_plate.webp",
  gloves: "/images/items/armor/glove/heavy_gloves.webp",
  belt: "/images/items/armor/belt/light_belt.webp",
  boots: "/images/items/armor/boot/chain_boots.webp",
  amulet: "/images/items/misc/amulet/amulet2.webp",
  ring1: "/images/items/misc/ring/ring2.webp",
  ring2: "/images/items/misc/ring/ring2.webp"
};

const MERC_VARIANT_LABELS = {
  "a2-might": "第二幕 · 沙漠米山（进攻 · 力量灵气 Might）",
  "a2-hf": "第二幕 · 沙漠米山（防御 · 神圣冰冻 Holy Freeze）",
  "a2-prayer": "第二幕 · 沙漠米山（战斗 · 祈祷灵气 Prayer）",
  "a2-defiance": "第二幕 · 沙漠米山（防御 · 反抗灵气 Defiance）",
  "a2-ba": "第二幕 · 沙漠米山（进攻 · 祝福瞄准 Blessed Aim）",
  "a1-cold": "第一幕 · 萝格斥候（冰冷箭 + 冻结箭 + 内视）",
  "a1-fire": "第一幕 · 萝格斥候（火焰箭 + 爆裂箭 + 内视）",
  "a3-fire": "第三幕 · 东方铁狼法师（火焰强化 + 火球）",
  "a3-ltng": "第三幕 · 东方铁狼法师（静电力场 + 闪电）",
  "a3-cold": "第三幕 · 东方铁狼法师（冰尖柱 + 寒冰装甲）",
  "a5-frenzy": "第五幕 · 野蛮人狂乱双刀（狂乱 + 嘲讽）",
  "a5-bash": "第五幕 · 野蛮人重击双手（重击 + 晕眩）"
};

const MERC_BASE_PROFILES = {
  "a2-might": { baseLvl: 75, hp: 1430, hpLvl: 40, str: 173, str8: 14, dex: 139, dex8: 12, def: 1027, defLvl: 28, res: 142, res4: 4, skills: [{ name: "戳刺 Jab", base: 23, per32: 0 }, { name: "力量灵气 Might", base: 15, per32: 8, auraDesc: (l) => `全队物理伤害 +${30 + l * 10}%` }] },
  "a2-hf": { baseLvl: 75, hp: 1430, hpLvl: 40, str: 173, str8: 14, dex: 139, dex8: 12, def: 1027, defLvl: 28, res: 142, res4: 4, skills: [{ name: "戳刺 Jab", base: 23, per32: 0 }, { name: "神圣冰冻 Holy Freeze", base: 16, per32: 0, auraDesc: (l) => `大范围冰冷控场减速 ${Math.min(58, 25 + l * 2)}%` }] },
  "a2-prayer": { baseLvl: 75, hp: 1430, hpLvl: 40, str: 173, str8: 14, dex: 139, dex8: 12, def: 1027, defLvl: 28, res: 142, res4: 4, skills: [{ name: "戳刺 Jab", base: 24, per32: 10 }, { name: "祈祷灵气 Prayer", base: 18, per32: 0, auraDesc: (l) => `单层每秒回血 +${l * 2 - 5}` }] },
  "a2-defiance": { baseLvl: 75, hp: 1430, hpLvl: 40, str: 173, str8: 14, dex: 139, dex8: 12, def: 1027, defLvl: 28, res: 142, res4: 4, skills: [{ name: "戳刺 Jab", base: 24, per32: 0 }, { name: "反抗灵气 Defiance", base: 18, per32: 0, auraDesc: (l) => `全队防御 +${60 + l * 10}%` }] },
  "a2-ba": { baseLvl: 75, hp: 1430, hpLvl: 40, str: 173, str8: 14, dex: 139, dex8: 12, def: 1027, defLvl: 28, res: 142, res4: 4, skills: [{ name: "戳刺 Jab", base: 24, per32: 0 }, { name: "祝福瞄准 Blessed Aim", base: 18, per32: 0, auraDesc: (l) => `全队命中率 +${60 + l * 15}%` }] },
  "a1-cold": { baseLvl: 67, hp: 900, hpLvl: 30, str: 116, str8: 10, dex: 173, dex8: 16, def: 744, defLvl: 23, res: 121, res4: 5, skills: [{ name: "内视 Inner Sight", base: 22, per32: 10, auraDesc: (l) => `降敌防御 -${40 + l * 45}` }, { name: "冰冷箭 Cold Arrow", base: 22, per32: 10 }, { name: "冻结箭 Freezing Arrow", base: 7, per32: 3 }] },
  "a1-fire": { baseLvl: 67, hp: 900, hpLvl: 30, str: 116, str8: 10, dex: 173, dex8: 16, def: 744, defLvl: 23, res: 121, res4: 5, skills: [{ name: "内视 Inner Sight", base: 22, per32: 10 }, { name: "火焰箭 Fire Arrow", base: 22, per32: 10 }, { name: "爆裂箭 Exploding Arrow", base: 12, per32: 5 }] },
  "a3-fire": { baseLvl: 79, hp: 1224, hpLvl: 34, str: 130, str8: 10, dex: 104, dex8: 8, def: 907, defLvl: 25, res: 155, res4: 5, skills: [{ name: "火焰强化 Enchant", base: 26, per32: 20, auraDesc: (l) => `附加火伤与 +${20 + l * 9}% 命中` }, { name: "火球术 Fire Ball", base: 25, per32: 10 }, { name: "火焰弹 Fire Bolt", base: 27, per32: 10 }] },
  "a3-ltng": { baseLvl: 79, hp: 1224, hpLvl: 34, str: 130, str8: 10, dex: 104, dex8: 8, def: 907, defLvl: 25, res: 155, res4: 5, skills: [{ name: "静电力场 Static Field", base: 18, per32: 8, auraDesc: (l) => `削减怪物 25% 当前生命` }, { name: "闪电 Lightning", base: 24, per32: 10 }, { name: "充能弹 Charged Bolt", base: 25, per32: 10 }] },
  "a3-cold": { baseLvl: 79, hp: 1224, hpLvl: 34, str: 130, str8: 10, dex: 104, dex8: 8, def: 907, defLvl: 25, res: 155, res4: 5, skills: [{ name: "冰尖柱 Glacial Spike", base: 22, per32: 10, auraDesc: () => "群体冻结控场" }, { name: "寒冰装甲 Chilling Armor", base: 27, per32: 15 }, { name: "冰风暴 Ice Blast", base: 27, per32: 10 }] },
  "a5-frenzy": { baseLvl: 80, hp: 1680, hpLvl: 45, str: 200, str8: 15, dex: 129, dex8: 10, def: 1332, defLvl: 35, res: 148, res4: 4, skills: [{ name: "狂乱 Frenzy", base: 13, per32: 7, auraDesc: (l) => `攻速与移速叠加 (Lv.${l})` }, { name: "钢铁皮肤 Iron Skin", base: 12, per32: 6 }, { name: "嘲讽 Taunt", base: 17, per32: 6 }] },
  "a5-bash": { baseLvl: 80, hp: 1680, hpLvl: 45, str: 200, str8: 15, dex: 129, dex8: 10, def: 1332, defLvl: 35, res: 148, res4: 4, skills: [{ name: "战吼 Battle Cry", base: 19, per32: 8, auraDesc: (l) => `降敌防御 -${48 + l * 2}% 与伤害 -${24 + l}%` }, { name: "猛击 Bash", base: 25, per32: 10 }, { name: "击晕 Stun", base: 20, per32: 8 }] }
};

const CHAR_AURA_LABELS = {
  "fana-20": "狂热灵气 Fanaticism",
  "conc-20": "专注灵气 Concentration",
  "conv-20": "信念灵气 Conviction",
  might: "力量灵气 Might",
  ba: "祝福瞄准 Blessed Aim",
  "salv-20": "救助灵气 Salvation",
  defiance: "反抗灵气 Defiance",
  vigor: "活力灵气 Vigor",
  "oak-20": "橡木智者 Oak Sage",
  how: "狼獾之心 Heart of Wolverine",
  "enchant-23": "恶魔肢体附魔 Lv.23"
};

const DEMON_AURA_LABELS = {
  vigor: "活力 Vigor",
  fana: "狂热 Fanaticism",
  conc: "专注 Concentration",
  hf: "神圣冰冻 Holy Freeze",
  thorns: "荆棘 Thorns",
  might: "力量 Might",
  conv: "信念 Conviction",
  ba: "祝福瞄准 Blessed Aim"
};

const WARLOCK_HEX_LABELS = {
  "Hex Bane": "邪咒：灾祸 (Hex: Bane)",
  "Hex Purge": "邪咒：消灭 (Hex: Purge)",
  "Hex Siphon": "邪咒：虹吸 (Hex: Siphon)"
};

const ENEMY_DEBUFF_LABELS = {
  amp: "伤害加深 (-100% 敌物抗)",
  decrep: "衰老 Decrepify (-50% 敌物抗与减速)",
  "lr-10": "降低抵抗 Lv.10 (-55% 敌元素抗)",
  "lr-16": "降低抵抗 Lv.16 (-61% 敌元素抗)"
};

const CLASS_FALLBACK_NAMES = {
  war: "术士",
  sor: "法师",
  pal: "圣骑士",
  ama: "亚马逊",
  nec: "死灵法师",
  bar: "野蛮人",
  dru: "德鲁伊",
  ass: "刺客"
};

let cachedCatalogIndex = null;

function getCatalogIndex() {
  if (cachedCatalogIndex) return cachedCatalogIndex;
  const skillsCat = getSkillsCatalog();
  const itemsCat = getItemsCatalog();
  const rwCat = getRunewordsCatalog();
  const pdCat = getPaperdollCatalog();

  const classById = new Map();
  for (const cls of skillsCat.classes || []) {
    classById.set(cls.id, cls);
  }

  const uniqueByEn = new Map();
  const uniqueByEnLower = new Map();
  for (const u of itemsCat.uniqueItems || []) {
    if (u && u.nameEn) {
      uniqueByEn.set(u.nameEn, u);
      uniqueByEnLower.set(u.nameEn.toLowerCase(), u);
    }
  }

  const setPieceByEn = new Map();
  const setPieceByEnLower = new Map();
  for (const s of itemsCat.setItems || itemsCat.sets || []) {
    const pieces = (s?.detail && Array.isArray(s.detail.pieces)) ? s.detail.pieces : (s?.pieces || []);
    for (const p of pieces) {
      if (p && p.nameEn) {
        const entry = { piece: p, set: s };
        setPieceByEn.set(p.nameEn, entry);
        setPieceByEnLower.set(p.nameEn.toLowerCase(), entry);
      }
    }
  }

  const baseItemIconByEn = new Map();
  for (const bi of itemsCat.baseItems || []) {
    if (bi && bi.nameEn && bi.icon) {
      baseItemIconByEn.set(bi.nameEn.toLowerCase(), bi.icon);
    }
  }

  const rwById = new Map();
  for (const r of rwCat.runewords || []) {
    if (r && r.id) rwById.set(r.id, r);
  }

  const baseByCode = new Map();
  for (const [code, b] of Object.entries(pdCat.baseRules || {})) {
    if (b) {
      const iconFromBase = (pdCat.baseIcons && pdCat.baseIcons[code]) ||
        b.icon ||
        (b.nameEn ? baseItemIconByEn.get(b.nameEn.toLowerCase()) : "") ||
        BASE_TYPE_ICON_FALLBACK[b.type] ||
        "";
      baseByCode.set(code, {
        ...b,
        code,
        icon: iconFromBase
      });
    }
  }

  const socketableById = new Map();
  for (const s of pdCat.socketables || []) {
    if (s && s.id) socketableById.set(s.id, s);
  }

  const charmById = new Map();
  for (const c of pdCat.inventoryCharms || []) {
    if (c && c.id) charmById.set(c.id, c);
  }

  const craftedById = new Map();
  for (const c of pdCat.craftedItems || []) {
    if (c && c.id) craftedById.set(c.id, c);
  }

  cachedCatalogIndex = {
    classById,
    uniqueByEn,
    uniqueByEnLower,
    setPieceByEn,
    setPieceByEnLower,
    baseItemIconByEn,
    rwById,
    baseByCode,
    socketableById,
    charmById,
    craftedById,
    jewelAffixes: pdCat.jewelAffixes || { prefixes: [], suffixes: [] },
    affixCatalog: pdCat.affixCatalog || { prefixes: [], suffixes: [] }
  };
  return cachedCatalogIndex;
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function sanitizeText(value, maxLen = 80) {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

function sanitizeMultilineText(value, maxLen = 400) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLen);
}

function sanitizeInt(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

function sanitizeSkillsObject(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out = {};
  let count = 0;
  for (const [key, val] of Object.entries(raw)) {
    if (count >= 40) break;
    if (typeof key !== "string" || !key || key.length > 64) continue;
    const pts = Math.floor(Number(val));
    if (Number.isFinite(pts) && pts >= 1 && pts <= 20) {
      out[key] = pts;
      count += 1;
    }
  }
  return out;
}

function sanitizeRollsMap(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out = {};
  let count = 0;
  for (const [k, v] of Object.entries(raw)) {
    if (count >= 24) break;
    if (typeof k !== "string" || !k || k.length > 32) continue;
    const n = Number(v);
    if (Number.isFinite(n) && n >= -999 && n <= 9999) {
      out[k] = n;
      count += 1;
    }
  }
  return out;
}

function sanitizeSockets(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const entry of raw.slice(0, 6)) {
    if (typeof entry === "string" && entry.length <= 40) {
      out.push(entry);
    } else if (entry && typeof entry === "object" && !Array.isArray(entry) && entry.customJewel) {
      const sanitizeAffixList = (arr, limit) =>
        Array.isArray(arr)
          ? arr
              .slice(0, limit)
              .filter((x) => x && typeof x === "object" && typeof x.id === "string" && x.id.length <= 32)
              .map((x) => ({ id: x.id, val: sanitizeInt(x.val, -100, 999, 0) }))
          : [];
      out.push({
        customJewel: true,
        rarity: entry.rarity === "rare" ? "rare" : "magic",
        pre: sanitizeAffixList(entry.pre, 3),
        suf: sanitizeAffixList(entry.suf, 3)
      });
    }
  }
  return out;
}

function sanitizeEquippedItem(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const validCats = new Set(["unique", "set", "rw", "craft", "magic", "rare", "base"]);
  const cat = validCats.has(raw.cat) ? raw.cat : "";
  if (!cat) return null;

  const item = {
    cat,
    id: sanitizeText(raw.id, 90),
    eth: Boolean(raw.eth),
    sockets: sanitizeSockets(raw.sockets),
    rolls: sanitizeRollsMap(raw.rolls)
  };
  if (typeof raw.baseCode === "string" && raw.baseCode.length <= 16) {
    item.baseCode = raw.baseCode.trim();
  }
  if (raw.supEd !== undefined) item.supEd = sanitizeInt(raw.supEd, 0, 15, 0);
  if (raw.supAr !== undefined) item.supAr = sanitizeInt(raw.supAr, 0, 3, 0);
  if (raw.supDef !== undefined) item.supDef = sanitizeInt(raw.supDef, 0, 15, 0);
  if (raw.palModType === "res" || raw.palModType === "dmg" || raw.palModType === "none") {
    item.palModType = raw.palModType;
  }
  if (raw.palRes !== undefined) item.palRes = sanitizeInt(raw.palRes, 0, 45, 0);
  if (raw.palEd !== undefined) item.palEd = sanitizeInt(raw.palEd, 0, 65, 0);
  if (raw.palAr !== undefined) item.palAr = sanitizeInt(raw.palAr, 0, 121, 0);
  if (raw.affixes && typeof raw.affixes === "object" && !Array.isArray(raw.affixes)) {
    const cleanAffixes = {};
    for (const key of ["pre", "suf", "prefixes", "suffixes"]) {
      if (Array.isArray(raw.affixes[key])) {
        cleanAffixes[key] = raw.affixes[key].slice(0, 6).map((x) => {
          if (typeof x === "string") return sanitizeText(x, 60);
          if (x && typeof x === "object") {
            return {
              id: sanitizeText(x.id, 48),
              val: sanitizeInt(x.val, -100, 999, 0)
            };
          }
          return null;
        }).filter(Boolean);
      }
    }
    if (Object.keys(cleanAffixes).length > 0) item.affixes = cleanAffixes;
  }
  const sanitizeRangeAffixArr = (arr) =>
    Array.isArray(arr)
      ? arr
          .slice(0, 4)
          .filter((x) => x && typeof x === "object" && typeof x.range === "string")
          .map((x) => ({
            id: sanitizeText(x.id, 48),
            group: sanitizeText(x.group, 40),
            nameZh: sanitizeText(x.nameZh, 48),
            range: sanitizeText(x.range, 100)
          }))
      : null;
  const cleanPre = sanitizeRangeAffixArr(raw.prefixes);
  if (cleanPre) item.prefixes = cleanPre;
  const cleanSuf = sanitizeRangeAffixArr(raw.suffixes);
  if (cleanSuf) item.suffixes = cleanSuf;
  if (raw.craftSkill && typeof raw.craftSkill === "object" && !Array.isArray(raw.craftSkill)) {
    const mode = ["none", "class", "tab"].includes(raw.craftSkill.mode) ? raw.craftSkill.mode : "none";
    item.craftSkill = {
      mode,
      tabPage: sanitizeInt(raw.craftSkill.tabPage, 1, 3, 1),
      lvl: sanitizeInt(raw.craftSkill.lvl, 1, 3, 2)
    };
  }
  if (raw.customStats && typeof raw.customStats === "string") {
    item.customStats = sanitizeText(raw.customStats, 240);
  }
  return item;
}

function sanitizeLoadout(raw, slotList) {
  const out = {};
  for (const s of slotList) {
    out[s.id] = raw && typeof raw === "object" ? sanitizeEquippedItem(raw[s.id]) : null;
  }
  return out;
}

function sanitizeBag(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (let i = 0; i < Math.min(raw.length, 40); i += 1) {
    const b = raw[i];
    if (!b || typeof b !== "object" || Array.isArray(b)) continue;
    const charmId = sanitizeText(b.charmId, 48);
    if (!charmId) continue;
    const entry = {
      uid: sanitizeText(b.uid, 24) || `b${i + 1}`,
      charmId,
      tabPage: sanitizeInt(b.tabPage, 0, 3, 0),
      rolls: sanitizeRollsMap(b.rolls)
    };
    if (b.affixes && typeof b.affixes === "object" && !Array.isArray(b.affixes)) {
      const cleanAff = {};
      if (typeof b.affixes.pre === "string") cleanAff.pre = sanitizeText(b.affixes.pre, 48);
      if (typeof b.affixes.suf === "string") cleanAff.suf = sanitizeText(b.affixes.suf, 48);
      if (Object.keys(cleanAff).length) entry.affixes = cleanAff;
    }
    if (Array.isArray(b.prefixes) && b.prefixes.length) {
      entry.prefixes = b.prefixes.slice(0, 3).map((p) => (p && typeof p === "object"
        ? { id: sanitizeText(p.id, 48), nameZh: sanitizeText(p.nameZh, 48), range: sanitizeText(p.range, 96) }
        : null)).filter(Boolean);
    }
    if (Array.isArray(b.suffixes) && b.suffixes.length) {
      entry.suffixes = b.suffixes.slice(0, 3).map((s) => (s && typeof s === "object"
        ? { id: sanitizeText(s.id, 48), nameZh: sanitizeText(s.nameZh, 48), range: sanitizeText(s.range, 96) }
        : null)).filter(Boolean);
    }
    out.push(entry);
  }
  return out;
}

function sanitizePaperdollSnapshot(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const statAllocRaw = raw.statAlloc && typeof raw.statAlloc === "object" ? raw.statAlloc : {};
  const charBag = sanitizeBag(raw.charBag);
  const swapRaw = raw.swapLoadout && typeof raw.swapLoadout === "object" ? raw.swapLoadout : {};
  return {
    charLoadout: sanitizeLoadout(raw.charLoadout, CHAR_SLOTS),
    swapLoadout: {
      weapon: sanitizeEquippedItem(swapRaw.weapon),
      offhand: sanitizeEquippedItem(swapRaw.offhand)
    },
    activeWeaponSet: raw.activeWeaponSet === 2 ? 2 : 1,
    mercLoadout: sanitizeLoadout(raw.mercLoadout, MERC_SLOTS),
    charBag,
    bagNextUid: Math.max(sanitizeInt(raw.bagNextUid, 1, 9999, 1), charBag.length + 1),
    statAlloc: {
      str: sanitizeInt(statAllocRaw.str, 0, 600, 0),
      dex: sanitizeInt(statAllocRaw.dex, 0, 600, 0),
      vit: sanitizeInt(statAllocRaw.vit, 0, 600, 0),
      enr: sanitizeInt(statAllocRaw.enr, 0, 600, 0)
    },
    charLvl: sanitizeInt(raw.charLvl, 1, 99, 90),
    mercVariant: sanitizeText(raw.mercVariant, 32) || "a2-might",
    mercLvl: sanitizeInt(raw.mercLvl, 1, 98, 90),
    mercEnabled: raw.mercEnabled !== undefined ? Boolean(raw.mercEnabled) : true,
    mercAuraOn: raw.mercAuraOn !== undefined ? Boolean(raw.mercAuraOn) : true,
    ctaOn: raw.ctaOn !== undefined ? Boolean(raw.ctaOn) : true,
    holyShieldOn: raw.holyShieldOn !== undefined ? Boolean(raw.holyShieldOn) : true,
    charAura: sanitizeText(raw.charAura, 32) || "none",
    demonAura: sanitizeText(raw.demonAura, 32) || "none",
    demonMlvl: sanitizeInt(raw.demonMlvl, 1, 99, 96),
    warlockHex: sanitizeText(raw.warlockHex, 32) || "none",
    enemyDebuff: sanitizeText(raw.enemyDebuff, 32) || "none",
    selectedSkillKey: sanitizeText(raw.selectedSkillKey, 64) || "",
    maxMode: Boolean(raw.maxMode)
  };
}

function sanitizeMercSummary(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const hpMultRaw = Number(raw.hpMult);
  const hpMult = Number.isFinite(hpMultRaw) ? Math.min(10, Math.max(1, Math.round(hpMultRaw * 100) / 100)) : 1;
  const apsRaw = Number(raw.aps);
  const aps = Number.isFinite(apsRaw) ? Math.min(10, Math.max(0, Math.round(apsRaw * 100) / 100)) : 0;
  return {
    enabled: raw.enabled !== undefined ? Boolean(raw.enabled) : true,
    innateAuraOn: raw.innateAuraOn !== undefined ? Boolean(raw.innateAuraOn) : true,
    variant: sanitizeText(raw.variant, 32) || "a2-might",
    lvl: sanitizeInt(raw.lvl, 1, 98, 90),
    hp: sanitizeInt(raw.hp, 0, 999999, 0),
    hpMult,
    def: sanitizeInt(raw.def, 0, 999999, 0),
    dmgMin: sanitizeInt(raw.dmgMin, 0, 999999, 0),
    dmgMax: sanitizeInt(raw.dmgMax, 0, 999999, 0),
    ar: sanitizeInt(raw.ar, 0, 999999, 0),
    str: sanitizeInt(raw.str, 0, 1500, 0),
    baseStr: sanitizeInt(raw.baseStr, 0, 1500, 0),
    dex: sanitizeInt(raw.dex, 0, 1500, 0),
    baseDex: sanitizeInt(raw.baseDex, 0, 1500, 0),
    reqStr: sanitizeInt(raw.reqStr, 0, 1500, 0),
    reqDex: sanitizeInt(raw.reqDex, 0, 1500, 0),
    reqOk: raw.reqOk !== undefined ? Boolean(raw.reqOk) : true,
    allSkills: sanitizeInt(raw.allSkills, 0, 30, 0),
    resF: sanitizeInt(raw.resF, -100, 95, 0),
    resC: sanitizeInt(raw.resC, -100, 95, 0),
    resL: sanitizeInt(raw.resL, -100, 95, 0),
    resP: sanitizeInt(raw.resP, -100, 95, 0),
    baseResHell: sanitizeInt(raw.baseResHell, -100, 95, 0),
    ias: sanitizeInt(raw.ias, 0, 500, 0),
    wsm: sanitizeInt(raw.wsm, -60, 60, 0),
    fanaEias: sanitizeInt(raw.fanaEias, 0, 100, 0),
    atkFrame: sanitizeInt(raw.atkFrame, 0, 30, 0),
    aps,
    ll: sanitizeInt(raw.ll, 0, 200, 0),
    cb: sanitizeInt(raw.cb, 0, 200, 0),
    ds: sanitizeInt(raw.ds, 0, 200, 0),
    dr: sanitizeInt(raw.dr, 0, 50, 0),
    cbf: Boolean(raw.cbf),
    skills: sanitizeText(raw.skills, 220),
    gearAuras: sanitizeText(raw.gearAuras, 120)
  };
}

function sanitizeSummary(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const merc = sanitizeMercSummary(raw.merc);
  return {
    hp: sanitizeInt(raw.hp, 0, 999999, 0),
    mana: sanitizeInt(raw.mana, 0, 999999, 0),
    def: sanitizeInt(raw.def, 0, 999999, 0),
    blockChance: sanitizeInt(raw.blockChance, 0, 75, 0),
    fcr: sanitizeInt(raw.fcr, 0, 500, 0),
    fcrFrame: sanitizeInt(raw.fcrFrame, 0, 30, 0),
    fhr: sanitizeInt(raw.fhr, 0, 500, 0),
    fhrFrame: sanitizeInt(raw.fhrFrame, 0, 30, 0),
    ias: sanitizeInt(raw.ias, 0, 500, 0),
    iasFrame: sanitizeInt(raw.iasFrame, 0, 30, 0),
    fbr: sanitizeInt(raw.fbr, 0, 500, 0),
    fbrFrame: sanitizeInt(raw.fbrFrame, 0, 30, 0),
    mf: sanitizeInt(raw.mf, 0, 2000, 0),
    dr: sanitizeInt(raw.dr, 0, 50, 0),
    resF: sanitizeInt(raw.resF, -100, 95, 0),
    resC: sanitizeInt(raw.resC, -100, 95, 0),
    resL: sanitizeInt(raw.resL, -100, 95, 0),
    resP: sanitizeInt(raw.resP, -100, 95, 0),
    allSkillBonus: sanitizeInt(raw.allSkillBonus, 0, 60, 0),
    totalStr: sanitizeInt(raw.totalStr, 0, 1500, 0),
    totalDex: sanitizeInt(raw.totalDex, 0, 1500, 0),
    totalVit: sanitizeInt(raw.totalVit, 0, 1500, 0),
    totalEnr: sanitizeInt(raw.totalEnr, 0, 1500, 0),
    skillName: sanitizeText(raw.skillName, 64),
    skillLvl: sanitizeInt(raw.skillLvl, 0, 99, 0),
    skillDmg: sanitizeText(raw.skillDmg, 64),
    dps: sanitizeInt(raw.dps, 0, 99999999, 0),
    weaponName: sanitizeText(raw.weaponName, 80),
    shieldName: sanitizeText(raw.shieldName, 80),
    ...(merc ? { merc } : {})
  };
}

export function sanitizeSharedBuildInput(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "无效的 BD 分享数据" };
  }
  const classId = String(raw.classId || "").trim().toLowerCase();
  if (!VALID_CLASS_IDS.has(classId)) {
    return { ok: false, error: "无效的职业 ID" };
  }
  const skills = sanitizeSkillsObject(raw.skills);
  const paperdoll = sanitizePaperdollSnapshot(raw.paperdoll);
  if (!paperdoll && Object.keys(skills).length === 0) {
    return { ok: false, error: "分享内容不能为空（请至少配置技能或装备）" };
  }
  const className = CLASS_FALLBACK_NAMES[classId] || classId;
  const lvl = paperdoll ? paperdoll.charLvl : 90;
  const title = sanitizeText(raw.title, 60) || `${className} Lv.${lvl} 完整 BD 配装方案`;
  const notes = sanitizeMultilineText(raw.notes, 400);
  const summary = sanitizeSummary(raw.summary);

  return {
    ok: true,
    data: {
      classId,
      title,
      notes,
      skills,
      paperdoll,
      summary
    }
  };
}

function generateShareId(length = 8) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let id = "";
  for (let i = 0; i < length; i += 1) {
    id += SHARE_ID_ALPHABET[bytes[i] % SHARE_ID_ALPHABET.length];
  }
  return id;
}

async function checkShareRateLimit(request, env) {
  if (!env?.DCLONE_STATE) return { blocked: false, rlKey: "", count: 0 };
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for") ||
    "local";
  const rlKey = `${KEY_SHARE_RL_PREFIX}${await sha256Hex(ip)}`;
  const raw = await env.DCLONE_STATE.get(rlKey, "json");
  const count = Number(raw?.count || 0);
  return { rlKey, count, blocked: count >= SHARE_RL_MAX_CREATES };
}

async function recordShareCreate(env, rlKey, count) {
  if (!env?.DCLONE_STATE || !rlKey) return;
  await env.DCLONE_STATE.put(
    rlKey,
    JSON.stringify({ count: count + 1, updatedAt: new Date().toISOString() }),
    { expirationTtl: SHARE_RL_WINDOW_SECONDS }
  );
}

function describeSocketEntry(entry, idx) {
  if (typeof entry === "string") {
    const s = idx.socketableById.get(entry);
    return s ? s.nameZh : entry;
  }
  if (entry && typeof entry === "object" && entry.customJewel) {
    const tag = entry.rarity === "rare" ? "自定义黄珠宝" : "自定义蓝珠宝";
    const totalMods = (entry.pre?.length || 0) + (entry.suf?.length || 0);
    return totalMods > 0 ? `${tag}(${totalMods}词缀)` : tag;
  }
  return "";
}

const QUALITY_LABELS = {
  unique: "暗金 Unique",
  set: "套装 Set",
  rw: "符文之语 Runeword",
  craft: "手工橙装 Crafted",
  rare: "亮金黄装 Rare",
  magic: "魔法蓝装 Magic",
  base: "打孔底材 Base"
};

function describeSocketDetail(entry, idx, bRule, slotId = "") {
  if (typeof entry === "string") {
    const s = idx.socketableById.get(entry);
    if (!s) return { label: entry, bonus: "", icon: "" };
    const mode = bRule
      ? bRule.gemApplyType
      : (slotId === "offhand" ? 2 : (slotId === "head" || slotId === "torso" ? 1 : 0));
    const bonus = mode === 2 ? (s.shield || "") : (mode === 1 ? (s.helm || "") : (s.weapon || ""));
    return { label: s.nameZh, bonus, icon: s.icon || "" };
  }
  if (entry && typeof entry === "object" && entry.customJewel) {
    const isRare = entry.rarity === "rare" || entry.customJewel === "rare";
    const tag = isRare ? "自定义黄珠宝" : "自定义蓝珠宝";
    const ja = idx.jewelAffixes || { prefixes: [], suffixes: [] };
    const parts = [];
    for (const p of (entry.pre || []).slice(0, isRare ? 3 : 1)) {
      const def = (ja.prefixes || []).find((x) => x.id === p.id);
      if (def && def.fmt) parts.push(def.fmt.replace("{v}", String(p.val ?? def.max ?? "")));
    }
    for (const s of (entry.suf || []).slice(0, isRare ? 3 : 1)) {
      const def = (ja.suffixes || []).find((x) => x.id === s.id);
      if (def && def.fmt) parts.push(def.fmt.replace("{v}", String(s.val ?? def.max ?? "")));
    }
    const totalMods = (entry.pre?.length || 0) + (entry.suf?.length || 0);
    return {
      label: totalMods > 0 ? `${tag}(${totalMods}词缀)` : tag,
      bonus: parts.join(" · "),
      icon: isRare ? "/images/items/misc/body_part/fragment_lightning.webp" : "/images/items/misc/body_part/fragment_magic.webp"
    };
  }
  return null;
}

function getRunewordDisplayStatLines(rw, bRule) {
  if (!rw) return [];
  if (Array.isArray(rw.stats)) return rw.stats.slice();
  if (Array.isArray(rw.statGroups)) {
    const slot = bRule ? bRule.slot : "weapon";
    const out = [];
    for (const g of rw.statGroups) {
      const lbl = String(g.label || "");
      const items = Array.isArray(g.items) ? g.items : [];
      if (lbl.includes("通用") || lbl.includes("3.4 赛季")) {
        out.push(...items);
      } else if (slot === "weapon" && (lbl.includes("武器") || lbl.includes("剑"))) {
        out.push(...items);
      } else if (slot === "offhand" && lbl.includes("盾牌")) {
        out.push(...items);
      } else if (slot === "torso" && lbl.includes("盔甲")) {
        out.push(...items);
      } else if (slot === "head" && lbl.includes("头盔")) {
        out.push(...items);
      }
    }
    return out;
  }
  if (typeof rw.stats === "string") return rw.stats.split(/\s*(?:·|\||\n)\s*/).filter(Boolean);
  return [];
}

function expandCompositeStatLines(statsText) {
  const rawParts = Array.isArray(statsText)
    ? statsText.flatMap((x) => String(x || "").split(/\s*(?:·|\||\n)\s*/))
    : String(statsText || "").split(/\s*(?:·|\||\n)\s*/);
  const out = [];
  for (const raw of rawParts) {
    const line = String(raw || "").trim();
    if (!line) continue;
    const normSlash = line.replace(/）\//g, "） / ");
    const subParts = normSlash
      .split(/\s+\/\s+(?=[+-]?\d|需求|伤害)/)
      .map((x) => x.trim())
      .filter(Boolean);
    for (const p of subParts) {
      let m;
      if ((m = p.match(/^冰\/电\/火抗性\s*(.+)$/))) {
        out.push("冰冷抗性 " + m[1], "闪电抗性 " + m[1], "火焰抗性 " + m[1]);
      } else if ((m = p.match(/^([+-]?\d+(?:[–-]\d+)?%)\s*火\/电抗$/))) {
        out.push("火焰抗性 " + m[1], "闪电抗性 " + m[1]);
      } else if ((m = p.match(/^([+-]?\d+(?:[–-]\d+)?%)\s*冰\/火\/电伤$/))) {
        out.push(m[1] + " 冰冷技能伤害", m[1] + " 火焰技能伤害", m[1] + " 闪电技能伤害");
      } else if ((m = p.match(/^([+-]?\d+(?:[–-]\d+)?%)\s*电\/火伤$/))) {
        out.push(m[1] + " 闪电技能伤害", m[1] + " 火焰技能伤害");
      } else if ((m = p.match(/^([+-]?\d+(?:[–-]\d+)?%)\s*冰冷\s*\/\s*闪电\s*\/\s*火焰技能伤害$/))) {
        out.push(m[1] + " 冰冷技能伤害", m[1] + " 闪电技能伤害", m[1] + " 火焰技能伤害");
      } else if ((m = p.match(/^伤害\/魔伤减少\s*(.+)$/))) {
        out.push("物理伤害减少 " + m[1] + " (PDR)", "魔法伤害减少 " + m[1] + " (MDR)");
      } else if ((m = p.match(/^(\d+(?:[–-]\d+)?)\s*EK\/LK$/i))) {
        out.push("+" + m[1] + " 每杀一个敌人恢复法力 (MAEK)", "+" + m[1] + " 每杀一个敌人恢复生命 (LAEK)");
      } else if ((m = p.match(/^(\+\d+(?:[–-]\d+)?)\s*击杀生命\/法力$/))) {
        out.push(m[1] + " 每杀一个敌人恢复生命 (LAEK)", m[1] + " 每杀一个敌人恢复法力 (MAEK)");
      } else if ((m = p.match(/^(\+\d+(?:[–-]\d+)?)\s*召唤\/毒素与白骨\/诅咒技能$/))) {
        out.push(m[1] + " 召唤技能", m[1] + " 毒素与白骨技能", m[1] + " 诅咒技能");
      } else if ((m = p.match(/^(\+\d+(?:[–-]\d+)?)\s*冰\/火\/电支配(?:（.*?）)?$/))) {
        out.push(m[1] + " 冰冷支配", m[1] + " 火焰支配", m[1] + " 闪电支配");
      } else if ((m = p.match(/^(\+\d+(?:[–-]\d+)?)\s*火焰波\s*\/\s*火焰之环$/))) {
        out.push(m[1] + " 火焰波", m[1] + " 火焰之环");
      } else if ((m = p.match(/^(\+\d+(?:[–-]\d+)?)\s*血沸\/吞噬\/恶魔精通$/))) {
        out.push(m[1] + " 血沸", m[1] + " 吞噬", m[1] + " 恶魔精通");
      } else {
        out.push(p);
      }
    }
  }
  return out;
}

function extractVariableRanges(statsText) {
  const lines = expandCompositeStatLines(statsText);
  const vars = [];
  lines.forEach((line, idx) => {
    if (/^[+-]?\d+\s*[–-]\s*\d+\s*(?:火焰|冰冷|闪电|毒素|魔法)?伤害/i.test(line)) return;
    if (/附加\s*\d+\s*[–-]\s*\d+/i.test(line)) return;
    const m = line.match(/([+-]?)(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)(%?)/);
    if (m) {
      const a = Number(m[2]);
      const b = Number(m[3]);
      if (b > a) {
        const invertBest = /自身\s*-|自身物理承受伤害/.test(line);
        vars.push({
          key: "L" + idx,
          lineIdx: idx,
          min: a,
          max: b,
          best: invertBest ? a : b
        });
      }
    }
  });
  return { lines, vars };
}

function computePerLevelDisplayValue(line, actorLvl) {
  const lvl = Math.max(1, Math.min(99, Math.floor(Number(actorLvl) || 90)));
  const str = String(line || "");
  let m;
  if ((m = str.match(/([+-]?)\(\s*(\d+(?:\.\d+)?)(%?)\s*\*\s*等级\s*\)(%?)/))) {
    const rate = Number(m[2]);
    const pct = m[3] || m[4] || "";
    if (Number.isFinite(rate) && rate > 0) {
      const sign = m[1] === "-" ? "-" : (m[1] === "+" || !/攻击者受到/.test(str) ? "+" : "");
      return `${sign}${Math.floor(rate * lvl)}${pct}`;
    }
  }
  if ((m = str.match(/([+-]?)(\d+(?:\.\d+)?)(%?)\s*\/\s*级/))) {
    const rate = Number(m[2]);
    const pct = m[3] || "";
    if (Number.isFinite(rate) && rate > 0) {
      return `${m[1] || "+"}${Math.floor(rate * lvl)}${pct}`;
    }
  }
  if ((m = str.match(/(\d+(?:\.\d+)?)(%)\s*（随等级提升）/))) {
    const rate = Number(m[1]);
    if (Number.isFinite(rate) && rate > 0) {
      return `+${Math.floor(rate * lvl)}${m[2]}`;
    }
  }
  return "";
}

function renderStatLineWithLvlCalc(line, actorLvl) {
  const calc = computePerLevelDisplayValue(line, actorLvl);
  if (!calc) return escapeHtml(line);
  const lvl = Math.max(1, Math.min(99, Math.floor(Number(actorLvl) || 90)));
  return `<span class="lvl-calc-badge" title="按当前 Lv.${lvl} 实时折算">${escapeHtml(calc)}</span>${escapeHtml(line)}`;
}

function applyRollsToStatLines(lines, rolls) {
  const { lines: expanded, vars } = extractVariableRanges(lines);
  const varByIdx = new Map(vars.map((v) => [v.lineIdx, v]));
  return expanded.map((line, idx) => {
    const v = varByIdx.get(idx);
    if (!v) return line;
    const rawVal = rolls && rolls[v.key] !== undefined ? Number(rolls[v.key]) : v.best;
    const curVal = Number.isFinite(rawVal) ? Math.min(v.max, Math.max(v.min, rawVal)) : v.best;
    return (
      line.replace(/([+-]?)\d+(?:\.\d+)?\s*[–-]\s*\d+(?:\.\d+)?/, "$1" + curVal) +
      ` [${v.min}–${v.max}]`
    );
  });
}

function resolveAffixLines(affixes, idx) {
  if (!affixes || typeof affixes !== "object") return [];
  const cat = idx.affixCatalog || { prefixes: [], suffixes: [] };
  const allPre = cat.prefixes || [];
  const allSuf = cat.suffixes || [];
  const out = [];
  const resolveOne = (entry, pool) => {
    if (typeof entry === "string") {
      const def = pool.find((x) => x.id === entry);
      return def ? (def.labelZh || def.fmt || entry) : entry;
    }
    if (entry && typeof entry === "object" && entry.id) {
      const def = pool.find((x) => x.id === entry.id);
      if (def) {
        if (def.fmt && entry.val !== undefined) return def.fmt.replace("{v}", String(entry.val));
        return def.labelZh || def.nameZh || entry.id;
      }
      return entry.val ? `${entry.id} (${entry.val})` : entry.id;
    }
    return "";
  };
  for (const p of [...(affixes.pre || []), ...(affixes.prefixes || [])]) {
    const txt = resolveOne(p, allPre);
    if (txt) out.push(txt);
  }
  for (const s of [...(affixes.suf || []), ...(affixes.suffixes || [])]) {
    const txt = resolveOne(s, allSuf);
    if (txt) out.push(txt);
  }
  return out;
}

function resolveDisplayItem(eq, idx, slotId = "", setCounts = null) {
  if (!eq) return null;
  const bRule = eq.baseCode ? idx.baseByCode.get(eq.baseCode) : null;
  const eqIdStr = String(eq.id || "");
  const eqIdLower = eqIdStr.toLowerCase();
  let titleZh = eqIdStr || "装备";
  let titleEn = "";
  let icon = bRule?.icon || "";
  let quality = eq.cat || "unique";
  let runeFormula = "";
  let reqLvl = 0;
  let baseSummary = "";
  let rawStatLines = [];
  let setInfo = null;
  let note = "";

  if (eq.cat === "unique") {
    const u = idx.uniqueByEn.get(eqIdStr) || idx.uniqueByEnLower.get(eqIdLower);
    if (u) {
      titleZh = u.nameZh || u.nameEn;
      titleEn = u.nameEn || "";
      icon = u.icon || icon;
      reqLvl = Number(u.reqLvl || 0);
      note = u.note || "";
      if (u.baseInfo) {
        baseSummary = u.baseInfo.baseStats || u.baseInfo.baseZhCN || "";
      }
      if (u.stats) rawStatLines = [u.stats];
    }
  } else if (eq.cat === "set") {
    const found = idx.setPieceByEn.get(eqIdStr) || idx.setPieceByEnLower.get(eqIdLower);
    if (found) {
      const { piece, set } = found;
      titleZh = piece.nameZh || piece.nameEn;
      titleEn = piece.nameEn || "";
      icon = piece.icon || set?.icon || icon;
      reqLvl = Number(piece.reqLvl || 0);
      if (piece.baseInfo) {
        baseSummary = piece.baseInfo.baseStats || piece.baseInfo.baseZhCN || "";
      }
      if (Array.isArray(piece.stats)) rawStatLines = piece.stats.slice();
      const setName = set?.nameZh || set?.nameEn || "";
      const totalCount = Array.isArray(set?.detail?.pieces) ? set.detail.pieces.length : 0;
      const wornCount = (setCounts && setName && setCounts.get(setName)) || 1;
      setInfo = {
        setName,
        wornCount,
        totalCount,
        pieceBonuses: Array.isArray(piece.setPieceBonus) ? piece.setPieceBonus : [],
        partialBonuses: Array.isArray(set?.detail?.partialBonuses) ? set.detail.partialBonuses : [],
        fullBonuses: Array.isArray(set?.detail?.fullBonuses) ? set.detail.fullBonuses : []
      };
    }
  } else if (eq.cat === "rw") {
    const r = idx.rwById.get(eqIdStr);
    if (r) {
      titleZh = r.zhName || r.nameZh || r.name || eqIdStr;
      titleEn = r.name || r.nameEn || "";
      reqLvl = Number(r.reqLevel || 0);
      if (Array.isArray(r.runes) && r.runes.length) {
        runeFormula = `'${r.runes.join(" + ")}'`;
      }
      rawStatLines = getRunewordDisplayStatLines(r, bRule);
    }
  } else if (eq.cat === "craft") {
    const c = idx.craftedById.get(eqIdStr);
    if (c) {
      titleZh = `[手工] ${c.nameZh.replace(/\s*\([^)]*\)$/, "")}`;
      titleEn = c.nameEn || "";
      icon = c.icon || icon;
      if (c.recipe) baseSummary = `配方：${c.recipe}`;
      if (c.stats) rawStatLines = [c.stats];
    } else {
      titleZh = `[手工] ${eqIdStr}`;
    }
    if (Array.isArray(eq.prefixes)) eq.prefixes.forEach((p) => { if (p && p.range) rawStatLines.push(p.range); });
    if (Array.isArray(eq.suffixes)) eq.suffixes.forEach((s) => { if (s && s.range) rawStatLines.push(s.range); });
    rawStatLines.push(...resolveAffixLines(eq.affixes, idx));
    if (eq.customStats) rawStatLines.push(eq.customStats);
  } else if (eq.cat === "magic" || eq.cat === "rare") {
    const tag = eq.cat === "magic" ? "[蓝装]" : "[黄装]";
    if (bRule) {
      titleZh = `${tag} ${bRule.nameZh}`;
      titleEn = `${eq.cat === "magic" ? "Magic" : "Rare"} ${bRule.nameEn}`;
    } else if (eqIdLower.includes("amulet") || slotId === "amulet") {
      titleZh = `${tag} 护身符(项链)`;
      titleEn = eq.cat === "magic" ? "Magic Amulet" : "Rare Amulet";
      icon = icon || "/images/items/misc/amulet/amulet2.webp";
    } else if (eqIdLower.includes("ring") || slotId === "ring1" || slotId === "ring2") {
      titleZh = `${tag} 戒指`;
      titleEn = eq.cat === "magic" ? "Magic Ring" : "Rare Ring";
      icon = icon || "/images/items/misc/ring/ring2.webp";
    } else {
      titleZh = `${tag} ${eqIdStr}`;
    }
    if (Array.isArray(eq.prefixes)) eq.prefixes.forEach((p) => { if (p && p.range) rawStatLines.push(p.range); });
    if (Array.isArray(eq.suffixes)) eq.suffixes.forEach((s) => { if (s && s.range) rawStatLines.push(s.range); });
    rawStatLines.push(...resolveAffixLines(eq.affixes, idx));
    if (eq.customStats) rawStatLines.push(eq.customStats);
  } else if (eq.cat === "base") {
    titleZh = bRule ? `${bRule.nameZh} (打孔底材)` : eqIdStr;
    quality = "magic";
    if (bRule) {
      rawStatLines.push(`基础底材（最大孔数 ${bRule.maxSockets || 0} 孔）`);
    }
  }

  // Final guaranteed icon fallback so no equipped item ever renders a blank placeholder
  if (!icon) {
    if (eqIdLower.includes("amulet") || slotId === "amulet") {
      icon = "/images/items/misc/amulet/amulet2.webp";
    } else if (eqIdLower.includes("ring") || slotId === "ring1" || slotId === "ring2") {
      icon = "/images/items/misc/ring/ring2.webp";
    } else if (slotId && SLOT_ICON_FALLBACK[slotId]) {
      icon = SLOT_ICON_FALLBACK[slotId];
    } else {
      icon = "/images/items/weapon/sword/crystal_sword.webp";
    }
  }

  if (!baseSummary && bRule) {
    const parts = [];
    if (bRule.nameZh) parts.push(`底材 ${bRule.nameZh}`);
    if (bRule.minDmg && bRule.maxDmg) parts.push(`基础伤害 ${bRule.minDmg}–${bRule.maxDmg}`);
    if (bRule.maxDef > 0) parts.push(`底材防御 ${bRule.minDef || bRule.maxDef}–${bRule.maxDef}`);
    if (bRule.reqStr > 0) parts.push(`需力量 ${bRule.reqStr}`);
    if (bRule.reqDex > 0) parts.push(`需敏捷 ${bRule.reqDex}`);
    if (reqLvl > 0) parts.push(`需等级 ${reqLvl}`);
    baseSummary = parts.join(" · ");
  }

  const tags = [];
  if (bRule && bRule.nameZh && !titleZh.includes(bRule.nameZh)) {
    tags.push(`底材: ${bRule.nameZh}`);
  }
  if (eq.eth) tags.push("无形 Eth");
  if (eq.supEd > 0) tags.push(`+${eq.supEd}% 超强ED`);
  if (eq.supAr > 0) tags.push(`+${eq.supAr} AR`);
  if (eq.supDef > 0) tags.push(`+${eq.supDef}% 超强防`);
  if (eq.palModType === "res" && eq.palRes > 0) tags.push(`圣骑底材 +${eq.palRes}% 全抗`);
  if (eq.palModType === "dmg" && (eq.palEd > 0 || eq.palAr > 0)) {
    tags.push(`圣骑底材 +${eq.palEd || 0}% ED/+${eq.palAr || 0} AR`);
  }

  const statLines = applyRollsToStatLines(rawStatLines, eq.rolls);
  if (eq.supEd > 0) statLines.push(`+${eq.supEd}% 强化伤害（超强底材）`);
  if (eq.supAr > 0) statLines.push(`+${eq.supAr} 攻击准确率（超强底材）`);
  if (eq.supDef > 0) statLines.push(`+${eq.supDef}% 强化防御（超强底材）`);
  if (eq.palModType === "res" && eq.palRes > 0) statLines.push(`+${eq.palRes}% 所有抗性（圣骑士盾底材）`);
  if (eq.palModType === "dmg" && (eq.palEd > 0 || eq.palAr > 0)) {
    statLines.push(`+${eq.palEd || 0}% 强化伤害 / +${eq.palAr || 0} 攻击准确率（圣骑士盾底材）`);
  }

  const socketDetails = (Array.isArray(eq.sockets) ? eq.sockets : [])
    .map((s) => describeSocketDetail(s, idx, bRule, slotId))
    .filter(Boolean);
  const sockets = socketDetails.map((s) => s.label);

  return {
    titleZh,
    titleEn,
    icon,
    quality,
    qualityLabel: QUALITY_LABELS[eq.cat] || "装备",
    runeFormula,
    reqLvl,
    baseSummary,
    statLines,
    setInfo,
    note,
    eth: Boolean(eq.eth),
    baseNameZh: bRule?.nameZh || "",
    tags,
    sockets,
    socketDetails
  };
}

function layoutSharedInventoryBag(bagRaw, idx, cls) {
  const occupied = Array.from({ length: 4 }, () => Array(10).fill(false));
  const placed = [];
  const items = (bagRaw || []).map((b) => {
    const def = idx.charmById.get(b.charmId);
    const w = Math.max(1, Math.min(2, Number(def?.w || 1)));
    const h = Math.max(1, Math.min(3, Number(def?.h || 1)));
    let label = def ? def.nameZh : b.charmId;
    let shortTag = def?.shortZh || def?.shortTag || (h === 3 ? "大板" : h === 2 ? "中板" : "小符");
    let tabLabel = "";
    if (b.tabPage > 0 && cls && Array.isArray(cls.tabs)) {
      const tObj = cls.tabs.find((t) => t.page === b.tabPage);
      if (tObj) {
        tabLabel = tObj.zhCN || tObj.enUS || "";
        label += ` (${tabLabel})`;
        shortTag = tabLabel.slice(0, 2) + "+1";
      }
    }
    const kind = def?.unique ? "is-unique" : (def?.util ? "is-util" : "");
    return {
      b,
      def,
      w,
      h,
      label,
      tabLabel,
      shortTag,
      kind,
      icon: def?.icon || "/images/items/misc/charm/charm_small.webp"
    };
  });
  // Place taller items first for tidy D2R 10x4 packing
  items.sort((a, b) => (b.h * b.w) - (a.h * a.w));
  for (const it of items) {
    let found = false;
    for (let c = 0; c <= 10 - it.w && !found; c += 1) {
      for (let r = 0; r <= 4 - it.h && !found; r += 1) {
        let ok = true;
        for (let dc = 0; dc < it.w && ok; dc += 1) {
          for (let dr = 0; dr < it.h && ok; dr += 1) {
            if (occupied[r + dr][c + dc]) ok = false;
          }
        }
        if (ok) {
          for (let dc = 0; dc < it.w; dc += 1) {
            for (let dr = 0; dr < it.h; dr += 1) {
              occupied[r + dr][c + dc] = true;
            }
          }
          placed.push({ ...it, col: c + 1, row: r + 1 });
          found = true;
        }
      }
    }
  }
  return placed;
}

function buildHtmlResponse(content, status = 200, cacheControl = "public, max-age=300") {
  return new Response(content, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": cacheControl,
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
      "content-security-policy": "frame-ancestors 'none'; object-src 'none'; base-uri 'self'",
      "cross-origin-opener-policy": "same-origin-allow-popups",
      "cross-origin-resource-policy": "same-origin",
      "referrer-policy": "strict-origin-when-cross-origin"
    }
  });
}

export function renderSharedBuildNotFoundPage(id = "") {
  const safeId = escapeHtml(id);
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>未找到该分享 BD · 庇护之地 D2R 3.4</title>
  <style>
    body { margin:0; min-height:100vh; display:grid; place-items:center; background:#0c0a0b; color:#f2eadf; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif; padding:24px; }
    .card { max-width:460px; width:100%; padding:28px; border-radius:16px; border:1px solid rgba(239,107,91,0.4); background:rgba(20,16,18,0.96); text-align:center; box-shadow:0 18px 44px rgba(0,0,0,0.6); }
    h1 { margin:0 0 10px; font-size:22px; color:#ffd573; }
    p { margin:0 0 20px; font-size:14px; color:#b8afa3; line-height:1.6; }
    a { display:inline-flex; align-items:center; justify-content:center; padding:10px 18px; border-radius:10px; background:linear-gradient(135deg,#c94534,#8f261b); color:#fff; text-decoration:none; font-weight:700; font-size:14px; }
  </style>
</head>
<body>
  <main class="card">
    <h1>未找到分享 BD</h1>
    <p>分享编号 <code>${safeId || "未知"}</code> 不存在或已失效，请检查链接是否完整。</p>
    <a href="/">← 返回庇护之地 D2R 3.4 看板</a>
  </main>
</body>
</html>`;
}

export function renderSharedBuildPage(build, { origin = "" } = {}) {
  const idx = getCatalogIndex();
  const cls = idx.classById.get(build.classId);
  const classNameZh = cls ? cls.nameZh : (CLASS_FALLBACK_NAMES[build.classId] || build.classId);
  const classNameEn = cls ? cls.nameEn : build.classId;
  const classIcon = cls ? cls.icon : "";
  const pd = build.paperdoll;
  const charLvl = pd ? pd.charLvl : 90;
  const sum = build.summary;
  const sharePath = `/build/${encodeURIComponent(build.id)}`;
  const shareUrl = origin ? `${origin.replace(/\/$/, "")}${sharePath}` : sharePath;
  const importPath = `/?import_build=${encodeURIComponent(build.id)}#skills`;

  // Skills breakdown by 3 trees (both compact list & full 3x6 visual tree)
  const skillsMap = build.skills || {};
  let totalSkillPts = 0;
  const treeBlocks = [];
  if (cls && Array.isArray(cls.tabs)) {
    for (const tab of cls.tabs) {
      const pageAll = (cls.skills || [])
        .filter((sk) => sk.page === tab.page)
        .sort((a, b) => (a.row - b.row) || (a.col - b.col));
      const tabSkills = pageAll.filter((sk) => Number(skillsMap[sk.key] || 0) > 0);
      const tabSum = tabSkills.reduce((acc, sk) => acc + Number(skillsMap[sk.key] || 0), 0);
      totalSkillPts += tabSum;
      treeBlocks.push({
        page: tab.page,
        title: tab.zhCN || tab.enUS || `系别 ${tab.page}`,
        pts: tabSum,
        items: tabSkills.map((sk) => ({
          key: sk.key,
          nameZh: sk.nameZh || sk.key,
          nameEn: sk.nameEn || sk.key,
          icon: sk.icon || "",
          pts: Number(skillsMap[sk.key] || 0)
        })),
        allSkills: pageAll.map((sk) => ({
          key: sk.key,
          row: Number(sk.row) || 1,
          col: Number(sk.col) || 1,
          reqs: Array.isArray(sk.reqs) ? sk.reqs : [],
          nameZh: sk.nameZh || sk.key,
          nameEn: sk.nameEn || sk.key,
          icon: sk.icon || "",
          pts: Number(skillsMap[sk.key] || 0)
        }))
      });
    }
  }

  const renderSharedSkillTreeStageHtml = (tb) => {
    const byKey = new Map(tb.allSkills.map((s) => [s.key, s]));
    const cellX = (c) => (c - 0.5) * 100;
    const cellY = (r) => (r - 0.5) * 100;
    const paths = [];
    for (const dst of tb.allSkills) {
      for (const rk of dst.reqs) {
        const src = byKey.get(rk);
        if (!src) continue;
        const sx = cellX(src.col);
        const sy = cellY(src.row);
        const dx = cellX(dst.col);
        const dy = cellY(dst.row);
        const dr = dst.row - src.row;
        const dc = dst.col - src.col;
        let d = "";
        if (dr === 0 && dc !== 0) {
          const x1 = dc > 0 ? sx + 32 : sx - 32;
          const x2 = dc > 0 ? dx - 34 : dx + 34;
          d = `M ${x1} ${sy} L ${x2} ${dy}`;
        } else if (dc === 0) {
          d = `M ${sx} ${sy + 34} L ${dx} ${dy - 36}`;
        } else {
          const midY = dy - 50;
          d = `M ${sx} ${sy + 34} L ${sx} ${midY} L ${dx} ${midY} L ${dx} ${dy - 36}`;
        }
        const active = src.pts > 0 && dst.pts > 0;
        paths.push(`<path class="bd-sk-edge${active ? " is-active" : ""}" d="${d}" />`);
      }
    }
    const nodes = tb.allSkills.map((sk) => {
      const invested = sk.pts > 0;
      const tip = `${sk.nameZh} (${sk.nameEn}) · ${sk.pts} / 20 点`;
      return `<div class="bd-sk-node${invested ? " is-invested" : ""}" style="grid-column:${sk.col};grid-row:${sk.row}" title="${escapeHtml(tip)}">
        <div class="bd-sk-node-ico-wrap">
          ${sk.icon ? `<img class="bd-sk-node-ico" src="${escapeHtml(sk.icon)}" alt="${escapeHtml(sk.nameZh)}" loading="lazy" />` : `<span class="bd-sk-node-ph"></span>`}
          ${invested ? `<span class="bd-sk-node-badge">${sk.pts}</span>` : ""}
        </div>
        <span class="bd-sk-node-name">${escapeHtml(sk.nameZh)}</span>
      </div>`;
    }).join("");
    return `<div class="bd-sk-stage">
      <svg class="bd-sk-svg" viewBox="0 0 300 600" preserveAspectRatio="none" aria-hidden="true">${paths.join("")}</svg>
      <div class="bd-sk-grid">${nodes}</div>
    </div>`;
  };

  // Count worn set pieces per set name so Set Bonuses display accurate progress
  const countWornSets = (loadout) => {
    const counts = new Map();
    if (!loadout || typeof loadout !== "object") return counts;
    for (const eq of Object.values(loadout)) {
      if (!eq || eq.cat !== "set") continue;
      const found = idx.setPieceByEn.get(eq.id) || idx.setPieceByEnLower.get(String(eq.id || "").toLowerCase());
      const sName = found?.set?.nameZh || found?.set?.nameEn || "";
      if (sName) counts.set(sName, (counts.get(sName) || 0) + 1);
    }
    return counts;
  };
  const charSetCounts = countWornSets(pd?.charLoadout);
  const mercSetCounts = countWornSets(pd?.mercLoadout);

  // Character 10-slot gear (+ optional Swap Weapon Set)
  const charGearCards = CHAR_SLOTS.map((slot) => {
    const eq = pd?.charLoadout ? pd.charLoadout[slot.id] : null;
    const item = resolveDisplayItem(eq, idx, slot.id, charSetCounts);
    return { slot, slotId: slot.id, slotLabel: slot.label, item };
  });
  const equippedCount = charGearCards.filter((x) => x.item).length;
  const swapWeaponItem = pd?.swapLoadout?.weapon ? resolveDisplayItem(pd.swapLoadout.weapon, idx, "weapon", charSetCounts) : null;
  const swapOffhandItem = pd?.swapLoadout?.offhand ? resolveDisplayItem(pd.swapLoadout.offhand, idx, "offhand", charSetCounts) : null;
  const hasSwapGear = Boolean(swapWeaponItem || swapOffhandItem);
  const isSet2Active = pd?.activeWeaponSet === 2;
  const activeSetLabel = isSet2Active ? "副手组 II（当前激活）" : "主手组 I（当前激活）";
  const swapSetLabel = isSet2Active ? "主手组 I（W 键切换）" : "副手组 II（W 键切换）";
  const defaultCharPaneEntry = charGearCards.find((x) => x.item) || charGearCards[0];
  const defaultCharKey = `char-${defaultCharPaneEntry.slotId}`;

  // Inventory Bag charms summary (visual 10x4 + grouped pills)
  const bagGrouped = new Map();
  const bagRaw = Array.isArray(pd?.charBag) ? pd.charBag : [];
  for (const b of bagRaw) {
    const cDef = idx.charmById.get(b.charmId);
    let label = cDef ? cDef.nameZh : b.charmId;
    if (b.tabPage > 0 && cls && Array.isArray(cls.tabs)) {
      const tObj = cls.tabs.find((t) => t.page === b.tabPage);
      if (tObj) label += ` (${tObj.zhCN})`;
    }
    const key = `${b.charmId}:${b.tabPage || 0}`;
    const prev = bagGrouped.get(key);
    if (prev) prev.count += 1;
    else bagGrouped.set(key, { label, icon: cDef?.icon || "/images/items/misc/charm/charm_small.webp", count: 1 });
  }
  const bagList = [...bagGrouped.values()];
  const bagPlaced = layoutSharedInventoryBag(bagRaw, idx, cls);

  // Mercenary & team buffs
  const mercEnabled = pd ? pd.mercEnabled !== false : false;
  const mercName = pd ? (MERC_VARIANT_LABELS[pd.mercVariant] || pd.mercVariant) : "未配置";
  const mercGearCards = MERC_SLOTS.map((slot) => {
    const eq = pd?.mercLoadout ? pd.mercLoadout[slot.id] : null;
    const item = resolveDisplayItem(eq, idx, slot.id, mercSetCounts);
    return { slot, slotId: slot.id, slotLabel: slot.label, item };
  });
  const defaultMercPaneEntry = mercGearCards.find((x) => x.item) || mercGearCards[0];
  const defaultMercKey = `merc-${defaultMercPaneEntry.slotId}`;

  const buffBadges = [];
  if (pd?.ctaOn) buffBadges.push("⚔️ 战争召唤 CTA (+1 全技能 · +65% 血/蓝)");
  if (build.classId === "pal" && pd?.holyShieldOn !== false && Number(build.skills?.["Holy Shield"] || 0) > 0) {
    buffBadges.push(`🛡️ 神圣之盾 Holy Shield（已开启 · 基础 ${Number(build.skills["Holy Shield"])} 点）`);
  }
  if (pd?.charAura && pd.charAura !== "none") {
    buffBadges.push(`🌟 主动灵气：${CHAR_AURA_LABELS[pd.charAura] || pd.charAura}`);
  }
  if (mercEnabled) {
    buffBadges.push(pd?.mercAuraOn !== false ? "🧭 佣兵自带光环：野外激活" : "⏸ 佣兵自带光环：城镇未激活");
  }
  if (build.classId === "war" && pd?.demonAura && pd.demonAura !== "none") {
    buffBadges.push(`🔥 束缚恶魔：${DEMON_AURA_LABELS[pd.demonAura] || pd.demonAura} (mlvl ${pd.demonMlvl || 96})`);
  }
  if (build.classId === "war" && pd?.warlockHex && pd.warlockHex !== "none") {
    buffBadges.push(`🔮 邪咒：${WARLOCK_HEX_LABELS[pd.warlockHex] || pd.warlockHex}`);
  }
  if (pd?.enemyDebuff && pd.enemyDebuff !== "none") {
    buffBadges.push(`💀 对敌减益：${ENEMY_DEBUFF_LABELS[pd.enemyDebuff] || pd.enemyDebuff}`);
  }

  const ogDescParts = [
    `${classNameZh} Lv.${charLvl}`,
    `技能 ${totalSkillPts}/110`,
    `装备 ${equippedCount}/10`
  ];
  if (sum?.weaponName) ogDescParts.push(`主手 ${sum.weaponName}`);
  if (sum?.fcr > 0) ogDescParts.push(`FCR ${sum.fcr}%`);
  if (sum?.ias > 0) ogDescParts.push(`IAS ${sum.ias}%`);
  if (sum?.hp > 0) ogDescParts.push(`血量 ${sum.hp.toLocaleString()}`);
  const ogDescription = ogDescParts.join(" · ");

  const createdLabel = build.createdAt
    ? new Date(build.createdAt).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai", hour12: false })
    : "";

  const renderPaperdollSlot = ({ slot, item }, target, swapTag = "", activeKey = "") => {
    const classes = ["pd-slot"];
    if (slot.tall) classes.push("tall");
    if (slot.mini) classes.push("mini");
    if (item) {
      classes.push("equipped", `q-${item.quality}`);
      if (item.eth) classes.push("is-eth");
    }
    const slotKey = `${target}-${slot.id}${swapTag ? `-${swapTag}` : ""}`;
    if (activeKey && slotKey === activeKey) classes.push("is-selected");
    const areaStyle = slot.area
      ? `grid-area:${slot.area};`
      : (slot.gridSpan ? `grid-column:span ${slot.gridSpan};` : "");
    const sockBadge = item && item.sockets.length > 0
      ? `<span class="pd-slot-sock">[${item.sockets.length}孔]</span>`
      : "";
    return `<button type="button" class="${classes.join(" ")}" data-bd-slot="${escapeHtml(slotKey)}" data-bd-target="${escapeHtml(target)}" data-bd-id="${escapeHtml(slot.id)}" style="${areaStyle}background-image:url(${escapeHtml(slot.bg)})">
      <span class="pd-slot-label"><span>${escapeHtml(slot.label)}</span>${sockBadge}</span>
      ${item
        ? `<img class="pd-slot-img${item.eth ? " is-eth-img" : ""}" src="${escapeHtml(item.icon)}" alt="${escapeHtml(item.titleZh)}" loading="lazy" />`
        : `<span class="pd-slot-empty-gap"></span>`}
      <span class="pd-slot-name">${escapeHtml(item ? ((item.eth ? "[无形] " : "") + item.titleZh) : "未装备")}</span>
    </button>`;
  };

  const renderInspectorPane = ({ slotId, slotLabel, item }, target = "char", extraKey = "", activeKey = "") => {
    const paneKey = `${target}-${slotId}${extraKey ? `-${extraKey}` : ""}`;
    const isActive = paneKey === activeKey;
    const actorLvl = target === "merc" ? (pd?.mercLvl || 90) : charLvl;
    if (!item) {
      return `<div class="bd-insp-pane${isActive ? " active" : ""}" data-bd-pane="${escapeHtml(paneKey)}" data-bd-pane-target="${escapeHtml(target)}">
        <div class="bd-insp-empty">
          <div class="bd-insp-slot-pill">${escapeHtml(slotLabel)}</div>
          <div style="font-size:14px;color:var(--muted);margin-top:8px">该部位当前未穿戴装备</div>
          <div style="font-size:12px;color:rgba(173,163,152,0.75);margin-top:4px">点击左侧纸娃娃上任意已装备部位，即可查看完整暗黑 2 词条属性、镶嵌效果与套装加成</div>
        </div>
      </div>`;
    }
    const tagsHtml = item.tags.length
      ? `<div class="gear-tags" style="margin-top:8px">${item.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>`
      : "";
    const statsHtml = item.statLines.length
      ? `<ul class="bd-insp-stats">${item.statLines.map((line) => `<li>${renderStatLineWithLvlCalc(line, actorLvl)}</li>`).join("")}</ul>`
      : `<div class="bd-insp-muted">暂无独立词条数据</div>`;
    const socksHtml = item.socketDetails.length
      ? `<div class="bd-insp-box is-sock">
          <div class="bd-insp-box-title">💎 已镶嵌符文 / 宝石 / 珠宝（${item.socketDetails.length} 孔）</div>
          <div class="bd-insp-sock-list">${item.socketDetails.map((sd, i) => `<div class="bd-insp-sock-row">
            ${sd.icon ? `<img class="bd-insp-sock-icon" src="${escapeHtml(sd.icon)}" alt="" loading="lazy" />` : ""}
            <span><strong>孔 ${i + 1} · ${escapeHtml(sd.label)}</strong>${sd.bonus ? `：${escapeHtml(sd.bonus)}` : ""}</span>
          </div>`).join("")}</div>
        </div>`
      : "";
    const formatPartialBonus = (pb) => {
      if (pb && typeof pb === "object" && Array.isArray(pb.stats)) {
        const req = Number(pb.count) || 2;
        const active = item.setInfo.wornCount >= req;
        const text = `${req} 件：${pb.stats.join(" · ")}`;
        return `<li class="${active ? "is-on" : "is-off"}">${active ? "✓ " : "○ "}${renderStatLineWithLvlCalc(text, actorLvl)}</li>`;
      }
      return `<li>${renderStatLineWithLvlCalc(String(pb || ""), actorLvl)}</li>`;
    };
    const setHtml = item.setInfo
      ? `<div class="bd-insp-box is-set">
          <div class="bd-insp-box-title">🌿 ${escapeHtml(item.setInfo.setName)}（当前已穿戴 ${item.setInfo.wornCount}${item.setInfo.totalCount ? ` / ${item.setInfo.totalCount}` : ""} 件）</div>
          ${item.setInfo.pieceBonuses.length
            ? `<div class="bd-insp-set-sub">单件套装附加：</div><ul class="bd-insp-set-list">${item.setInfo.pieceBonuses.map((b) => {
                const pm = String(b).match(/(\d+)\s*件/);
                const req = pm ? Number(pm[1]) : 2;
                const active = item.setInfo.wornCount >= req;
                return `<li class="${active ? "is-on" : "is-off"}">${active ? "✓ " : "○ "}${renderStatLineWithLvlCalc(b, actorLvl)}</li>`;
              }).join("")}</ul>`
            : ""}
          ${item.setInfo.partialBonuses.length
            ? `<div class="bd-insp-set-sub">套装部分加成：</div><ul class="bd-insp-set-list">${item.setInfo.partialBonuses.map(formatPartialBonus).join("")}</ul>`
            : ""}
          ${item.setInfo.fullBonuses.length
            ? `<div class="bd-insp-set-sub">全套集齐加成：</div><ul class="bd-insp-set-list is-full">${item.setInfo.fullBonuses.map((b) => `<li class="${item.setInfo.totalCount && item.setInfo.wornCount >= item.setInfo.totalCount ? "is-on" : "is-off"}">${renderStatLineWithLvlCalc(b, actorLvl)}</li>`).join("")}</ul>`
            : ""}
        </div>`
      : "";
    return `<div class="bd-insp-pane q-${escapeHtml(item.quality)}${isActive ? " active" : ""}" data-bd-pane="${escapeHtml(paneKey)}" data-bd-pane-target="${escapeHtml(target)}">
      <div class="bd-insp-head">
        <div class="bd-insp-icon-wrap q-${escapeHtml(item.quality)}">
          <img class="bd-insp-icon${item.eth ? " is-eth-img" : ""}" src="${escapeHtml(item.icon)}" alt="${escapeHtml(item.titleZh)}" loading="lazy" />
        </div>
        <div class="bd-insp-title-col">
          <div class="bd-insp-kicker">
            <span class="bd-insp-slot-pill">${escapeHtml(slotLabel)}</span>
            <span class="bd-insp-q-pill q-${escapeHtml(item.quality)}">${escapeHtml(item.qualityLabel)}</span>
            ${item.eth ? `<span class="bd-insp-eth-pill">无形 Eth</span>` : ""}
          </div>
          <h3 class="bd-insp-name">${escapeHtml((item.eth ? "[无形] " : "") + item.titleZh)}</h3>
          ${item.titleEn ? `<div class="bd-insp-en">${escapeHtml(item.titleEn)}</div>` : ""}
          ${item.runeFormula ? `<div class="bd-insp-runes">${escapeHtml(item.runeFormula)}</div>` : ""}
        </div>
      </div>
      ${item.baseSummary ? `<div class="bd-insp-base">${escapeHtml(item.baseSummary)}</div>` : ""}
      ${tagsHtml}
      <div class="bd-insp-divider"></div>
      ${statsHtml}
      ${socksHtml}
      ${setHtml}
      ${item.note ? `<div class="bd-insp-note">💡 ${escapeHtml(item.note)}</div>` : ""}
    </div>`;
  };

  // Build alternate Paperdoll HTML when Swap Gear is present (allows instant I / II visual toggle)
  const charDollPrimaryHtml = charGearCards.map((entry) => renderPaperdollSlot(entry, "char", "", defaultCharKey)).join("");
  const charDollSwapHtml = hasSwapGear
    ? charGearCards.map((entry) => {
        if (entry.slotId === "weapon") {
          return renderPaperdollSlot({ ...entry, item: swapWeaponItem }, "char", "swap", defaultCharKey);
        }
        if (entry.slotId === "offhand") {
          return renderPaperdollSlot({ ...entry, item: swapOffhandItem }, "char", "swap", defaultCharKey);
        }
        return renderPaperdollSlot(entry, "char", "", defaultCharKey);
      }).join("")
    : "";

  const charInspectorPanesHtml = [
    ...charGearCards.map((entry) => renderInspectorPane(entry, "char", "", defaultCharKey)),
    ...(hasSwapGear
      ? [
          renderInspectorPane({ slotId: "weapon", slotLabel: `${isSet2Active ? "主手组 I" : "副手组 II"} · 主手武器`, item: swapWeaponItem }, "char", "swap", defaultCharKey),
          renderInspectorPane({ slotId: "offhand", slotLabel: `${isSet2Active ? "主手组 I" : "副手组 II"} · 副手/盾/魔典`, item: swapOffhandItem }, "char", "swap", defaultCharKey)
        ]
      : [])
  ].join("");

  const mercInspectorPanesHtml = mercGearCards
    .map((entry) => renderInspectorPane(entry, "merc", "", defaultMercKey))
    .join("");

  const resolveDisplayBagItem = (p) => {
    const def = p.def;
    const b = p.b || {};
    const rawStatLines = [];
    if (def && def.stats) {
      let st = String(def.stats);
      if (p.tabLabel && /单系技能|本系技能/.test(st)) {
        st = st.replace(/(\+1\s*)(?:单系技能|本系技能)/g, `$1${p.tabLabel} 技能`);
      }
      rawStatLines.push(st);
    }
    if (Array.isArray(b.prefixes)) {
      b.prefixes.forEach((pr) => { if (pr && pr.range) rawStatLines.push(pr.range); });
    }
    if (Array.isArray(b.suffixes)) {
      b.suffixes.forEach((sf) => { if (sf && sf.range) rawStatLines.push(sf.range); });
    }
    if (b.affixes && typeof b.affixes === "object") {
      rawStatLines.push(...resolveAffixLines(b.affixes, idx));
    }
    const statLines = applyRollsToStatLines(rawStatLines, b.rolls);
    const quality = def?.unique ? "unique" : (def?.util ? "base" : "magic");
    const qualityLabel = def?.unique ? "暗金咒符" : (def?.util ? "实用物品" : "魔法咒符");
    const sizeText = `${p.w}×${p.h}` + (def?.size ? ` (${def.size})` : "");
    const tags = [`占格 ${sizeText}`];
    if (p.tabLabel) tags.push(`专精系别：${p.tabLabel}`);
    return {
      titleZh: p.label,
      titleEn: def?.nameEn || "",
      icon: p.icon,
      quality,
      qualityLabel,
      runeFormula: "",
      reqLvl: 0,
      baseSummary: def?.isBlankMagic && !statLines.length
        ? "空白蓝装咒符（未配置自定义前后缀）"
        : `角色背包咒符 · 占格 ${sizeText}`,
      statLines,
      setInfo: null,
      note: "",
      eth: false,
      baseNameZh: "",
      tags,
      sockets: [],
      socketDetails: []
    };
  };

  const bagEntries = bagPlaced.map((p, i) => ({
    slotId: String(i),
    paneKey: `bag-${i}`,
    slotLabel: p.def?.size ? `背包咒符 · ${p.def.size}` : "背包咒符",
    placed: p,
    item: resolveDisplayBagItem(p)
  }));
  const defaultBagKey = bagEntries.length ? bagEntries[0].paneKey : "";

  const bagInspectorPanesHtml = bagEntries
    .map((entry) => renderInspectorPane(
      { slotId: entry.slotId, slotLabel: entry.slotLabel, item: entry.item },
      "bag",
      "",
      defaultBagKey
    ))
    .join("");

  const renderBagGridHtml = () => {
    let cells = "";
    for (let r = 1; r <= 4; r += 1) {
      for (let c = 1; c <= 10; c += 1) {
        cells += `<div class="pd-inv-cell" style="grid-column:${c};grid-row:${r}"></div>`;
      }
    }
    const itemsHtml = bagEntries.map((entry) => {
      const p = entry.placed;
      const isSel = entry.paneKey === defaultBagKey;
      const style = `grid-column:${p.col} / span ${p.w};grid-row:${p.row} / span ${p.h};`;
      const tip = entry.item.statLines.length
        ? `${p.label}：${entry.item.statLines.join(" · ")}`
        : p.label;
      return `<button type="button" class="pd-inv-item ${p.kind}${isSel ? " is-selected" : ""}" data-bd-slot="${escapeHtml(entry.paneKey)}" data-bd-target="bag" style="${style}" title="${escapeHtml(tip)}">
        <img src="${escapeHtml(p.icon)}" alt="${escapeHtml(p.label)}" loading="lazy" />
        <span class="pd-inv-item-tag">${escapeHtml(p.shortTag)}</span>
      </button>`;
    }).join("");
    return `<div class="pd-inv-grid" aria-label="10×4 角色背包格">${cells}${itemsHtml}</div>`;
  };

  const renderMercStatsHtml = () => {
    if (!mercEnabled) return "";
    const ms = sum?.merc && typeof sum.merc === "object" ? sum.merc : null;
    if (ms && ms.hp > 0) {
      const reqBanner = ms.reqOk
        ? `<div class="merc-req-banner is-ok">✓ <strong>佣兵属性达标可穿戴全部装备</strong>（总力量 <strong>${ms.str}</strong> / 需 ${ms.reqStr} · 总敏捷 <strong>${ms.dex}</strong> / 需 ${ms.reqDex}）</div>`
        : `<div class="merc-req-banner is-warn">⚠️ <strong>佣兵穿戴属性不足</strong>（总力量 <strong>${ms.str}</strong> / 需 ${ms.reqStr} · 总敏捷 <strong>${ms.dex}</strong> / 需 ${ms.reqDex}）</div>`;
      const hpMultTxt = ms.hpMult > 1 ? ` <span class="merc-sub">(含团队增益 ×${ms.hpMult.toFixed(2)})</span>` : "";
      const fanaTxt = ms.fanaEias > 0 ? ` +狂热${ms.fanaEias}%` : "";
      const atkTxt = ms.atkFrame > 0
        ? `IAS ${ms.ias}%${fanaTxt} [WSM ${ms.wsm}] → <strong>${ms.atkFrame} 帧</strong> (${ms.aps.toFixed(2)} 次/秒)`
        : `IAS ${ms.ias}%`;
      const gearAuraTxt = ms.gearAuras && ms.gearAuras !== "无"
        ? `${ms.gearAuras}（装备光环在城里常驻生效）`
        : "无";
      return `<div class="merc-stats-wrap" aria-label="佣兵完整属性面板">
        ${reqBanner}
        <div class="stat-grid merc-stat-grid">
          <div class="stat-box"><span class="stat-k">生命值 / 总防御</span><strong class="stat-v"><span style="color:#ff8a75">${ms.hp.toLocaleString()}</span>${hpMultTxt} · ${ms.def.toLocaleString()}</strong></div>
          <div class="stat-box"><span class="stat-k">面板伤害 / 准确率 AR</span><strong class="stat-v">${ms.dmgMin.toLocaleString()}–${ms.dmgMax.toLocaleString()} · <span style="color:#78b7ff">AR ${ms.ar.toLocaleString()}</span></strong></div>
          <div class="stat-box"><span class="stat-k">力量 / 敏捷 / 全技能</span><strong class="stat-v">力 ${ms.str} <span class="merc-sub">(裸${ms.baseStr})</span> · 敏 ${ms.dex} <span class="merc-sub">(裸${ms.baseDex})</span> · +${ms.allSkills}</strong></div>
          <div class="stat-box"><span class="stat-k">地狱四抗 (火/冰/电/毒)</span><strong class="stat-v">${ms.resF}% / ${ms.resC}% / ${ms.resL}% / ${ms.resP}% <span class="merc-sub">(裸抗 ${ms.baseResHell}%)</span></strong></div>
          <div class="stat-box stat-box-span2"><span class="stat-k">攻击速度档位</span><strong class="stat-v">${atkTxt}</strong></div>
          <div class="stat-box stat-box-span2"><span class="stat-k">战斗特效 (LL / CB / DS / DR / CBF)</span><strong class="stat-v">吸血 ${ms.ll}% · 压碎 ${ms.cb}% · 致命 ${ms.ds}% · 物免 ${ms.dr}% · 无法冰冻 ${ms.cbf ? "✓" : "✗"}</strong></div>
          ${ms.skills ? `<div class="stat-box stat-box-span2"><span class="stat-k">自带技能与光环</span><strong class="stat-v" style="color:#8af49f">${escapeHtml(ms.skills)}</strong></div>` : ""}
          <div class="stat-box stat-box-span2"><span class="stat-k">装备赋予光环</span><strong class="stat-v" style="color:#e284db">${escapeHtml(gearAuraTxt)}</strong></div>
        </div>
      </div>`;
    }
    // Graceful fallback for older shares created before summary.merc existed
    const mLvl = pd?.mercLvl || 90;
    const prof = MERC_BASE_PROFILES[pd?.mercVariant || "a2-might"] || MERC_BASE_PROFILES["a2-might"];
    const dLvl = Math.max(0, mLvl - prof.baseLvl);
    const bStr = prof.str + Math.floor((dLvl * prof.str8) / 8);
    const bDex = prof.dex + Math.floor((dLvl * prof.dex8) / 8);
    const bHp = prof.hp + dLvl * prof.hpLvl;
    const bDef = prof.def + dLvl * prof.defLvl;
    const bResHell = prof.res + Math.floor((dLvl * prof.res4) / 4) - 100;
    const ctaBonus = pd?.ctaOn ? 1 : 0;
    const skillStr = prof.skills.map((sk) => {
      const effL = sk.base + Math.floor((dLvl * sk.per32) / 32) + ctaBonus;
      return sk.auraDesc
        ? `${sk.name} Lv.${effL}（${sk.auraDesc(effL)}${pd?.mercAuraOn === false ? " · 城镇未激活" : ""}）`
        : `${sk.name} Lv.${effL}`;
    }).join(" · ");
    const mercEquippedCount = mercGearCards.filter((x) => x.item).length;
    return `<div class="merc-stats-wrap" aria-label="佣兵基础属性面板">
      <div class="merc-req-banner is-info">ℹ️ <strong>佣兵基础面板（Lv.${mLvl} · 已穿戴 ${mercEquippedCount}/4 件装备）</strong> · 此旧版分享未含装备联动快照，点击右上角「导入到我的模拟器」可实时查看完整加成</div>
      <div class="stat-grid merc-stat-grid">
        <div class="stat-box"><span class="stat-k">基础生命 / 基础防御</span><strong class="stat-v"><span style="color:#ff8a75">${bHp.toLocaleString()}</span> · ${bDef.toLocaleString()}</strong></div>
        <div class="stat-box"><span class="stat-k">裸力量 / 裸敏捷</span><strong class="stat-v">力 ${bStr} · 敏 ${bDex}</strong></div>
        <div class="stat-box"><span class="stat-k">地狱基础四抗</span><strong class="stat-v">${Math.min(75, bResHell)}% / ${Math.min(75, bResHell)}% / ${Math.min(75, bResHell)}% / ${Math.min(75, bResHell)}%</strong></div>
        <div class="stat-box"><span class="stat-k">自带光环状态</span><strong class="stat-v">${pd?.mercAuraOn !== false ? "野外激活" : "城镇未激活"}</strong></div>
        <div class="stat-box stat-box-wide"><span class="stat-k">自带技能与光环（不含装备技能加成）</span><strong class="stat-v" style="color:#8af49f">${escapeHtml(skillStr)}</strong></div>
      </div>
    </div>`;
  };
  const mercStatsHtml = renderMercStatsHtml();

  const summaryHtml = sum
    ? `<section class="panel" aria-label="核心面板与档位总览">
        <h2 class="panel-title">📊 核心面板与速度档位快照</h2>
        <div class="stat-grid">
          <div class="stat-box"><span class="stat-k">生命 / 法力</span><strong class="stat-v"><span style="color:#ff8a75">${sum.hp.toLocaleString()}</span> / <span style="color:#78b7ff">${sum.mana.toLocaleString()}</span></strong></div>
          <div class="stat-box"><span class="stat-k">防御 / 格挡</span><strong class="stat-v">${sum.def.toLocaleString()} · ${sum.blockChance}%</strong></div>
          <div class="stat-box"><span class="stat-k">地狱四抗 (火/冰/电/毒)</span><strong class="stat-v">${sum.resF}% / ${sum.resC}% / ${sum.resL}% / ${sum.resP}%</strong></div>
          <div class="stat-box"><span class="stat-k">四维 (力/敏/体/精)</span><strong class="stat-v">${sum.totalStr} / ${sum.totalDex} / ${sum.totalVit} / ${sum.totalEnr}</strong></div>
          <div class="stat-box"><span class="stat-k">FCR 施法</span><strong class="stat-v">${sum.fcr}%${sum.fcrFrame ? ` → ${sum.fcrFrame} 帧` : ""}</strong></div>
          <div class="stat-box"><span class="stat-k">FHR 打击恢复</span><strong class="stat-v">${sum.fhr}%${sum.fhrFrame ? ` → ${sum.fhrFrame} 帧` : ""}</strong></div>
          <div class="stat-box"><span class="stat-k">IAS 攻速</span><strong class="stat-v">${sum.ias}%${sum.iasFrame ? ` → ${sum.iasFrame} 帧` : ""}</strong></div>
          <div class="stat-box"><span class="stat-k">FBR / MF / DR</span><strong class="stat-v">FBR ${sum.fbr}% · MF +${sum.mf}% · DR ${sum.dr}%</strong></div>
          ${sum.skillName ? `<div class="stat-box stat-box-wide"><span class="stat-k">主力技能模拟（全技能 +${sum.allSkillBonus}）</span><strong class="stat-v" style="color:#ffd573">${escapeHtml(sum.skillName)} Lv.${sum.skillLvl}${sum.skillDmg ? ` · 单次 ${escapeHtml(sum.skillDmg)}` : ""}${sum.dps > 0 ? ` · 理论 DPS ${sum.dps.toLocaleString()}/秒` : ""}</strong></div>` : ""}
        </div>
      </section>`
    : "";

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(build.title)} · D2R 3.4 BD 分享</title>
  <meta name="description" content="${escapeHtml(ogDescription)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(build.title)} · 庇护之地 D2R 3.4" />
  <meta property="og:description" content="${escapeHtml(ogDescription)}" />
  <meta property="og:url" content="${escapeHtml(shareUrl)}" />
  <meta name="theme-color" content="#090809" />
  <script src="/assets/theme-init.js?v=${DASHBOARD_THEME_VERSION}"></script>
  <style>
    :root {
      --bg: #0c0a0b;
      --panel: rgba(18, 14, 16, 0.94);
      --border: rgba(213, 167, 72, 0.28);
      --gold: #f5cf7b;
      --text: #f3ece2;
      --muted: #ada398;
    }
    .bd-theme-bar { display: inline-flex; align-items: center; gap: 2px; padding: 3px; border-radius: 999px; border: 1px solid var(--border); background: rgba(0, 0, 0, 0.34); }
    .bd-theme-btn { border: 0; border-radius: 999px; padding: 4px 8px; background: transparent; color: var(--muted); font: inherit; font-size: 11px; font-weight: 700; cursor: pointer; }
    .bd-theme-btn.active { background: linear-gradient(180deg, rgba(213, 167, 72, 0.36), rgba(145, 98, 28, 0.36)); color: #ffe7ad; box-shadow: inset 0 0 0 1px rgba(246, 206, 118, 0.52); }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(circle at 20% 0%, rgba(120, 32, 24, 0.28), transparent 52%),
        radial-gradient(circle at 85% 15%, rgba(213, 167, 72, 0.08), transparent 44%),
        var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif;
      line-height: 1.5;
    }
    .shell { max-width: 1240px; margin: 0 auto; padding: 24px 18px 56px; display: flex; flex-direction: column; gap: 18px; }
    .hero {
      padding: 20px 22px;
      border-radius: 16px;
      border: 1px solid rgba(245, 207, 123, 0.44);
      background: linear-gradient(135deg, rgba(42, 26, 18, 0.94), rgba(16, 13, 15, 0.98));
      box-shadow: 0 14px 36px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 224, 150, 0.12);
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }
    .hero-left { display: flex; align-items: flex-start; gap: 14px; min-width: 0; flex: 1; }
    .hero-avatar { width: 60px; height: 60px; border-radius: 12px; border: 1.5px solid rgba(245, 207, 123, 0.55); background: #140f10; object-fit: cover; flex-shrink: 0; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.6); }
    .hero-title { margin: 0; font-size: 22px; font-weight: 900; color: #ffe08c; }
    .hero-meta { margin-top: 6px; display: flex; flex-wrap: wrap; gap: 8px 14px; font-size: 12.5px; color: var(--muted); }
    .hero-notes { margin-top: 10px; padding: 10px 13px; border-radius: 10px; background: rgba(0, 0, 0, 0.34); border: 1px solid rgba(255, 255, 255, 0.08); font-size: 13px; color: #dfd6ca; white-space: pre-wrap; }
    .hero-actions { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .btn {
      display: inline-flex; align-items: center; gap: 6px; padding: 9px 14px; border-radius: 10px;
      font-size: 13px; font-weight: 700; text-decoration: none; cursor: pointer; border: 1px solid transparent;
      transition: filter .15s ease, background .15s ease, border-color .15s ease;
    }
    .btn-primary { background: linear-gradient(135deg, #d84b38, #97271a); color: #fff; border-color: rgba(255, 165, 130, 0.45); }
    .btn-primary:hover { filter: brightness(1.08); }
    .btn-secondary { background: rgba(255, 255, 255, 0.06); color: #f2eadf; border-color: rgba(245, 207, 123, 0.35); }
    .btn-secondary:hover { background: rgba(245, 207, 123, 0.14); }
    .readonly-pill { display: inline-flex; align-items: center; padding: 2px 9px; border-radius: 999px; font-size: 11px; font-weight: 700; color: #8af49f; border: 1px solid rgba(103, 232, 122, 0.42); background: rgba(20, 56, 30, 0.48); }
    .panel {
      padding: 20px 22px;
      border-radius: 16px;
      border: 1px solid var(--border);
      background: var(--panel);
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.38);
    }
    .panel-title { margin: 0 0 16px; font-size: 16.5px; font-weight: 800; color: #f5d287; display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
    .stat-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
    .stat-box { padding: 11px 13px; border-radius: 10px; background: rgba(0, 0, 0, 0.34); border: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; gap: 3px; }
    .stat-box-span2 { grid-column: span 2; }
    .stat-box-wide { grid-column: 1 / -1; }
    .stat-k { font-size: 11.5px; color: var(--muted); }
    .stat-v { font-size: 14px; font-variant-numeric: tabular-nums; color: #f6efe6; }
    .merc-stats-wrap { margin-bottom: 14px; display: flex; flex-direction: column; gap: 10px; }
    .merc-req-banner { padding: 8px 12px; border-radius: 9px; font-size: 12.5px; border: 1px solid rgba(255, 255, 255, 0.12); background: rgba(0, 0, 0, 0.32); }
    .merc-req-banner.is-ok { border-color: rgba(103, 232, 122, 0.45); background: rgba(18, 52, 28, 0.42); color: #9af4a8; }
    .merc-req-banner.is-warn { border-color: rgba(255, 138, 117, 0.55); background: rgba(74, 22, 18, 0.48); color: #ffb3a6; }
    .merc-req-banner.is-info { border-color: rgba(120, 183, 255, 0.42); background: rgba(18, 36, 58, 0.45); color: #b7d7ff; }
    .merc-sub { font-size: 11px; font-weight: 500; color: var(--muted); }

    /* Authentic D2R Paperdoll Showcase Layout */
    .pd-showcase {
      display: grid;
      grid-template-columns: minmax(320px, 410px) minmax(0, 1fr);
      gap: 18px;
      align-items: start;
    }
    .pd-doll-col {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .pd-swap-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
      padding: 7px 10px;
      border-radius: 10px;
      border: 1px solid rgba(213, 167, 72, 0.34);
      background: rgba(18, 14, 15, 0.92);
    }
    .pd-swap-tabs { display: inline-flex; align-items: center; gap: 5px; }
    .pd-swap-tab {
      padding: 4px 10px;
      border-radius: 7px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: rgba(255, 255, 255, 0.04);
      color: var(--muted);
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
    }
    .pd-swap-tab.active[data-set="1"] {
      border-color: rgba(245, 207, 123, 0.75);
      background: rgba(245, 207, 123, 0.18);
      color: #ffe08c;
    }
    .pd-swap-tab.active[data-set="2"] {
      border-color: rgba(110, 198, 255, 0.78);
      background: rgba(72, 160, 235, 0.22);
      color: #a8e1ff;
    }
    .pd-swap-hint { font-size: 11px; color: var(--muted); }
    .pd-swap-hint kbd {
      padding: 0 5px;
      border-radius: 4px;
      border: 1px solid rgba(245, 207, 123, 0.35);
      background: rgba(0, 0, 0, 0.45);
      color: #ffd573;
      font-family: ui-monospace, SFMono-Regular, monospace;
      font-size: 10.5px;
    }
    .pd-doll-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      grid-template-areas:
        "weapon head    offhand"
        "weapon torso   offhand"
        "gloves belt    boots"
        "ring1  amulet  ring2";
      gap: 8px;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid rgba(213, 167, 72, 0.36);
      background:
        radial-gradient(circle at 50% 35%, rgba(62, 42, 24, 0.48), rgba(10, 8, 8, 0.96)),
        repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 16px),
        repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 16px);
      box-shadow: inset 0 0 24px rgba(0, 0, 0, 0.55);
      transition: border-color .18s ease, box-shadow .18s ease;
    }
    .pd-doll-grid.is-swap-active {
      border-color: rgba(110, 198, 255, 0.68);
      box-shadow: inset 0 0 24px rgba(72, 160, 235, 0.18);
    }
    .pd-merc-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid rgba(87, 219, 112, 0.34);
      background:
        radial-gradient(circle at 50% 35%, rgba(22, 52, 34, 0.46), rgba(10, 12, 10, 0.96)),
        repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 16px),
        repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 16px);
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
    }
    .pd-slot {
      position: relative;
      appearance: none;
      font: inherit;
      color: var(--text);
      min-height: 82px;
      padding: 6px;
      border-radius: 9px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background-color: rgba(14, 11, 10, 0.88);
      background-repeat: no-repeat;
      background-position: center;
      background-size: 46px 46px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      transition: border-color .15s ease, transform .14s ease, box-shadow .15s ease;
      overflow: hidden;
    }
    .pd-slot.tall { min-height: 122px; background-size: 56px 84px; }
    .pd-slot.mini { min-height: 68px; background-size: 32px 32px; }
    .pd-slot:hover {
      border-color: rgba(245, 207, 123, 0.8);
      transform: translateY(-1px);
    }
    .pd-slot.is-selected {
      outline: 2px solid #ff8a75;
      outline-offset: 1px;
      box-shadow: 0 0 16px rgba(255, 138, 117, 0.42);
      z-index: 2;
    }
    .pd-slot.equipped {
      background-image: none !important;
      border-color: rgba(213, 167, 72, 0.68);
      background-color: rgba(28, 21, 14, 0.95);
      box-shadow: inset 0 0 14px rgba(213, 167, 72, 0.12);
    }
    .pd-slot.equipped.q-set {
      border-color: rgba(87, 219, 112, 0.74);
      background-color: rgba(14, 34, 21, 0.95);
      box-shadow: inset 0 0 14px rgba(87, 219, 112, 0.12);
    }
    .pd-slot.equipped.q-rw {
      border-color: rgba(255, 178, 107, 0.82);
      background-color: rgba(34, 22, 12, 0.96);
      box-shadow: inset 0 0 14px rgba(255, 178, 107, 0.14);
    }
    .pd-slot.equipped.q-craft {
      border-color: rgba(255, 150, 48, 0.88);
      background-color: rgba(44, 24, 10, 0.96);
    }
    .pd-slot.equipped.q-magic {
      border-color: rgba(105, 169, 255, 0.85);
      background-color: rgba(12, 24, 46, 0.96);
    }
    .pd-slot.equipped.q-rare {
      border-color: rgba(248, 233, 122, 0.88);
      background-color: rgba(40, 36, 12, 0.96);
    }
    .pd-slot-label {
      font-size: 10px;
      color: var(--muted);
      font-weight: 700;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 4px;
    }
    .pd-slot-sock { color: #9ad8ff; font-weight: 800; }
    .pd-slot-img {
      max-width: 52px;
      max-height: 54px;
      object-fit: contain;
      filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.92));
      margin: 2px 0;
    }
    .pd-slot.tall .pd-slot-img { max-height: 76px; max-width: 60px; }
    .pd-slot.mini .pd-slot-img { max-height: 36px; max-width: 36px; }
    .is-eth-img {
      opacity: 0.74;
      filter: drop-shadow(0 0 6px rgba(154, 216, 255, 0.45)) saturate(0.82);
    }
    .pd-slot-empty-gap { height: 28px; }
    .pd-slot-name {
      font-size: 11px;
      font-weight: 800;
      color: #f5cf7b;
      line-height: 1.2;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pd-slot:not(.equipped) .pd-slot-name { color: rgba(173, 163, 152, 0.65); font-weight: 600; }
    .pd-slot.q-set .pd-slot-name { color: #67e87a; }
    .pd-slot.q-rw .pd-slot-name { color: #ffb26b; }
    .pd-slot.q-craft .pd-slot-name { color: #ffaa4d; }
    .pd-slot.q-magic .pd-slot-name { color: #7cb6ff; }
    .pd-slot.q-rare .pd-slot-name { color: #f8e97a; }

    /* Right-side Live D2R Item Inspector */
    .bd-right-col { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
    .bd-inspector {
      border-radius: 14px;
      border: 1px solid rgba(213, 167, 72, 0.42);
      background:
        radial-gradient(circle at 85% 0%, rgba(213, 167, 72, 0.1), transparent 260px),
        linear-gradient(180deg, rgba(24, 18, 16, 0.97), rgba(11, 9, 10, 0.99));
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 224, 150, 0.12);
      overflow: hidden;
    }
    .bd-insp-pane { display: none; padding: 18px 20px; flex-direction: column; gap: 10px; }
    .bd-insp-pane.active { display: flex; }
    .bd-insp-pane.q-set { background: radial-gradient(circle at 90% 0%, rgba(87, 219, 112, 0.11), transparent 260px); }
    .bd-insp-pane.q-rw { background: radial-gradient(circle at 90% 0%, rgba(255, 178, 107, 0.12), transparent 260px); }
    .bd-insp-pane.q-magic { background: radial-gradient(circle at 90% 0%, rgba(105, 169, 255, 0.12), transparent 260px); }
    .bd-insp-pane.q-rare { background: radial-gradient(circle at 90% 0%, rgba(248, 233, 122, 0.11), transparent 260px); }
    .bd-insp-pane.q-craft { background: radial-gradient(circle at 90% 0%, rgba(255, 150, 48, 0.12), transparent 260px); }
    .bd-insp-empty { padding: 18px 8px; text-align: center; }
    .bd-insp-head { display: flex; align-items: center; gap: 14px; min-width: 0; }
    .bd-insp-icon-wrap {
      width: 68px;
      height: 68px;
      border-radius: 12px;
      border: 1.5px solid rgba(213, 167, 72, 0.55);
      background: radial-gradient(circle at 50% 35%, rgba(54, 40, 26, 0.85), rgba(8, 7, 7, 0.98));
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      flex-shrink: 0;
      box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.65);
    }
    .bd-insp-icon-wrap.q-set { border-color: rgba(87, 219, 112, 0.72); background: radial-gradient(circle, rgba(16, 48, 26, 0.9), rgba(8, 12, 9, 0.98)); }
    .bd-insp-icon-wrap.q-rw { border-color: rgba(255, 178, 107, 0.75); }
    .bd-insp-icon-wrap.q-magic { border-color: rgba(105, 169, 255, 0.75); }
    .bd-insp-icon-wrap.q-rare { border-color: rgba(248, 233, 122, 0.75); }
    .bd-insp-icon-wrap.q-craft { border-color: rgba(255, 150, 48, 0.75); }
    .bd-insp-icon { max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.95)); }
    .bd-insp-title-col { min-width: 0; flex: 1; }
    .bd-insp-kicker { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-bottom: 4px; }
    .bd-insp-slot-pill { display: inline-flex; padding: 1px 8px; border-radius: 999px; font-size: 11px; font-weight: 700; color: #d8cfc3; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.14); }
    .bd-insp-q-pill { display: inline-flex; padding: 1px 8px; border-radius: 999px; font-size: 11px; font-weight: 700; color: #f5cf7b; background: rgba(213, 167, 72, 0.14); border: 1px solid rgba(213, 167, 72, 0.42); }
    .bd-insp-q-pill.q-set { color: #67e87a; background: rgba(87, 219, 112, 0.14); border-color: rgba(87, 219, 112, 0.45); }
    .bd-insp-q-pill.q-rw { color: #ffb26b; background: rgba(255, 178, 107, 0.14); border-color: rgba(255, 178, 107, 0.45); }
    .bd-insp-q-pill.q-craft { color: #ffaa4d; background: rgba(255, 150, 48, 0.14); border-color: rgba(255, 150, 48, 0.45); }
    .bd-insp-q-pill.q-rare { color: #ffe76e; background: rgba(248, 233, 122, 0.14); border-color: rgba(248, 233, 122, 0.45); }
    .bd-insp-q-pill.q-magic { color: #7cb6ff; background: rgba(105, 169, 255, 0.14); border-color: rgba(105, 169, 255, 0.45); }
    .bd-insp-eth-pill { display: inline-flex; padding: 1px 8px; border-radius: 999px; font-size: 11px; font-weight: 700; color: #9ad8ff; background: rgba(110, 198, 255, 0.15); border: 1px solid rgba(110, 198, 255, 0.45); }
    .bd-insp-name { margin: 0; font-size: 19px; font-weight: 900; color: #f5cf7b; line-height: 1.25; }
    .bd-insp-pane.q-set .bd-insp-name { color: #67e87a; }
    .bd-insp-pane.q-rw .bd-insp-name { color: #ffb26b; }
    .bd-insp-pane.q-craft .bd-insp-name { color: #ffaa4d; }
    .bd-insp-pane.q-rare .bd-insp-name { color: #ffe76e; }
    .bd-insp-pane.q-magic .bd-insp-name { color: #7cb6ff; }
    .bd-insp-en { font-size: 12px; color: var(--muted); margin-top: 2px; }
    .bd-insp-runes { font-size: 13px; font-weight: 800; color: #ffd983; margin-top: 4px; letter-spacing: 0.03em; }
    .bd-insp-base { font-size: 12px; color: #cdc3b6; padding: 7px 10px; border-radius: 8px; background: rgba(0, 0, 0, 0.36); border: 1px solid rgba(255, 255, 255, 0.08); }
    .bd-insp-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(213, 167, 72, 0.32), transparent); margin: 2px 0; }
    .bd-insp-stats { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 5px; text-align: center; }
    .bd-insp-stats li { font-size: 13.5px; font-weight: 600; color: #8cbcff; line-height: 1.5; }
    .lvl-calc-badge {
      display: inline-block;
      margin-right: 6px;
      padding: 0 6px;
      border-radius: 5px;
      background: rgba(245, 207, 123, 0.16);
      border: 1px solid rgba(245, 207, 123, 0.48);
      color: #ffe294;
      font-size: 12px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
      vertical-align: baseline;
    }
    .bd-insp-set-list li.is-off { color: #72808e; }
    .bd-insp-set-list.is-full li.is-off { color: #8a7f6b; }
    .bd-insp-muted { font-size: 12.5px; color: var(--muted); text-align: center; }
    .bd-insp-box { padding: 10px 12px; border-radius: 10px; display: flex; flex-direction: column; gap: 6px; }
    .bd-insp-box.is-sock { background: rgba(16, 32, 54, 0.42); border: 1px solid rgba(110, 198, 255, 0.32); }
    .bd-insp-box.is-set { background: rgba(14, 42, 22, 0.42); border: 1px solid rgba(87, 219, 112, 0.36); }
    .bd-insp-box-title { font-size: 12.5px; font-weight: 800; color: #9ad8ff; }
    .bd-insp-box.is-set .bd-insp-box-title { color: #67e87a; }
    .bd-insp-sock-list { display: flex; flex-direction: column; gap: 6px; }
    .bd-insp-sock-row { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #dbeeff; }
    .bd-insp-sock-icon { width: 22px; height: 22px; object-fit: contain; flex-shrink: 0; }
    .bd-insp-set-sub { font-size: 11.5px; font-weight: 700; color: #9be8a8; margin-top: 2px; }
    .bd-insp-set-list { margin: 0; padding-left: 16px; display: flex; flex-direction: column; gap: 3px; font-size: 12.5px; color: #67e87a; }
    .bd-insp-set-list.is-full { color: #ffe08c; }
    .bd-insp-note { font-size: 12px; color: #f2d28b; padding: 7px 10px; border-radius: 8px; background: rgba(213, 167, 72, 0.1); border: 1px solid rgba(213, 167, 72, 0.25); }
    .bd-quick-title { font-size: 12px; font-weight: 800; color: var(--muted); display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px; }

    /* Right-side Compact Gear Overview Cards */
    .gear-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
    .gear-card {
      appearance: none;
      width: 100%;
      text-align: left;
      font: inherit;
      color: var(--text);
      cursor: pointer;
      padding: 10px 11px;
      border-radius: 10px;
      background: linear-gradient(160deg, rgba(22, 18, 17, 0.94), rgba(12, 10, 11, 0.98));
      border: 1px solid rgba(255, 255, 255, 0.12);
      display: flex;
      flex-direction: column;
      gap: 6px;
      transition: border-color .15s ease, box-shadow .15s ease, transform .14s ease;
    }
    .gear-card:hover { border-color: rgba(245, 207, 123, 0.7); transform: translateY(-1px); }
    .gear-card.is-empty { opacity: 0.5; border-style: dashed; }
    .gear-card.q-unique { border-color: rgba(212, 175, 95, 0.46); }
    .gear-card.q-rw { border-color: rgba(255, 178, 107, 0.48); }
    .gear-card.q-set { border-color: rgba(94, 214, 114, 0.48); }
    .gear-card.q-craft { border-color: rgba(255, 165, 76, 0.48); }
    .gear-card.q-rare { border-color: rgba(255, 232, 102, 0.48); }
    .gear-card.q-magic { border-color: rgba(105, 169, 255, 0.48); }
    .gear-card.is-highlighted {
      outline: 2px solid #ff8a75;
      box-shadow: 0 0 18px rgba(255, 138, 117, 0.35);
      transform: translateY(-1px);
    }
    .gear-head { display: flex; align-items: center; gap: 11px; min-width: 0; }
    .gear-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 9px;
      background: radial-gradient(circle at 50% 35%, rgba(44, 34, 24, 0.8), rgba(8, 7, 7, 0.96));
      border: 1px solid rgba(213, 167, 72, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      flex-shrink: 0;
    }
    .gear-icon-box.q-set { border-color: rgba(87, 219, 112, 0.5); background: radial-gradient(circle, rgba(16, 44, 24, 0.85), rgba(8, 12, 9, 0.96)); }
    .gear-icon-box.q-rw { border-color: rgba(255, 178, 107, 0.55); }
    .gear-icon-box.q-magic { border-color: rgba(105, 169, 255, 0.55); }
    .gear-icon-box.q-rare { border-color: rgba(248, 233, 122, 0.55); }
    .gear-icon-box.q-craft { border-color: rgba(255, 150, 48, 0.55); }
    .gear-icon { max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.9)); }
    .gear-meta { min-width: 0; flex: 1; }
    .gear-slot { font-size: 10.5px; color: var(--muted); }
    .gear-name { font-size: 13.5px; font-weight: 800; color: #f5cf7b; word-break: break-word; }
    .gear-card.q-rw .gear-name { color: #ffb26b; }
    .gear-card.q-set .gear-name { color: #67e87a; }
    .gear-card.q-craft .gear-name { color: #ffaa4d; }
    .gear-card.q-rare .gear-name { color: #ffe76e; }
    .gear-card.q-magic .gear-name { color: #7cb6ff; }
    .gear-en { font-size: 11px; color: var(--muted); }
    .gear-empty-txt { font-size: 12px; color: var(--muted); }
    .gear-tags, .gear-socks, .buff-row, .bag-grid { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
    .tag { padding: 2px 7px; border-radius: 6px; font-size: 11px; background: rgba(255, 255, 255, 0.06); color: #d8cfc3; border: 1px solid rgba(255, 255, 255, 0.1); }
    .gear-socks { font-size: 11px; color: var(--muted); }
    .sock-pill { padding: 2px 7px; border-radius: 999px; font-size: 11px; background: rgba(154, 216, 255, 0.12); color: #9ad8ff; border: 1px solid rgba(154, 216, 255, 0.35); }
    .buff-pill { padding: 4px 10px; border-radius: 999px; font-size: 12px; background: rgba(245, 207, 123, 0.12); color: #ffe08c; border: 1px solid rgba(245, 207, 123, 0.35); }

    /* Authentic D2R 10x4 Visual Inventory Bag */
    .pd-inv-grid {
      display: grid;
      grid-template-columns: repeat(10, minmax(0, 1fr));
      grid-template-rows: repeat(4, 38px);
      gap: 3px;
      padding: 6px;
      border-radius: 10px;
      border: 1px solid rgba(213, 167, 72, 0.34);
      background: #090808;
      margin-bottom: 12px;
      max-width: 640px;
    }
    .pd-inv-cell {
      border: 1px solid rgba(255, 255, 255, 0.06);
      background: rgba(255, 255, 255, 0.02);
      border-radius: 3px;
    }
    .pd-inv-item {
      border-radius: 5px;
      border: 1px solid rgba(104, 164, 255, 0.7);
      background: linear-gradient(180deg, rgba(24, 36, 62, 0.95), rgba(12, 18, 34, 0.98));
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2px;
      overflow: hidden;
      z-index: 2;
      position: relative;
    }
    .pd-inv-item.is-unique {
      border-color: rgba(213, 167, 72, 0.88);
      background: linear-gradient(180deg, rgba(52, 36, 16, 0.96), rgba(22, 16, 10, 0.98));
    }
    .pd-inv-item.is-util {
      border-color: rgba(160, 165, 175, 0.55);
      background: linear-gradient(180deg, rgba(36, 37, 42, 0.94), rgba(18, 19, 22, 0.98));
    }
    .pd-inv-item { cursor: pointer; font: inherit; color: inherit; transition: border-color 140ms ease, transform 120ms ease, box-shadow 140ms ease; }
    .pd-inv-item:hover { border-color: #ffd573; transform: translateY(-1px); z-index: 3; }
    .pd-inv-item.is-selected { outline: 2px solid #ff8a75; outline-offset: 1px; box-shadow: 0 0 12px rgba(255, 138, 117, 0.55); z-index: 4; }
    .pd-inv-item img { max-width: 86%; max-height: 62%; object-fit: contain; filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.95)); }
    .pd-inv-item-tag { font-size: 9px; font-weight: 800; line-height: 1.05; color: #b7d7ff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
    .pd-inv-item.is-unique .pd-inv-item-tag { color: #ffd573; }
    .bag-chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 9px; background: rgba(0, 0, 0, 0.36); border: 1px solid rgba(182, 146, 86, 0.35); font: inherit; font-size: 12.5px; color: inherit; cursor: pointer; transition: border-color 140ms ease, background 140ms ease; }
    .bag-chip:hover, .bag-chip.is-selected { border-color: rgba(255, 213, 115, 0.85); background: rgba(213, 167, 72, 0.16); }
    .bag-chip img { width: 22px; height: 22px; object-fit: contain; }
    .trees-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
    .tree-col { padding: 13px; border-radius: 12px; background: rgba(12, 10, 12, 0.86); border: 1px solid rgba(213, 167, 72, 0.24); display: flex; flex-direction: column; gap: 8px; }
    .tree-head { display: flex; align-items: center; justify-content: space-between; padding-bottom: 6px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 13.5px; font-weight: 800; color: #f3d28e; }
    .sk-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 8px; border-radius: 8px; background: rgba(255, 255, 255, 0.035); font-size: 12.5px; }
    .sk-row-l { display: flex; align-items: center; gap: 7px; min-width: 0; }
    .sk-icon { width: 24px; height: 24px; border-radius: 5px; object-fit: cover; flex-shrink: 0; }
    .sk-pts { font-weight: 800; color: #f5cf7b; white-space: nowrap; }
    .bd-sk-head-r { display: inline-flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .bd-sk-view-tabs { display: inline-flex; gap: 4px; padding: 3px; border-radius: 9px; background: rgba(0, 0, 0, 0.45); border: 1px solid rgba(213, 167, 72, 0.28); }
    .bd-sk-tab { border: 0; border-radius: 6px; padding: 4px 10px; font: inherit; font-size: 11.5px; font-weight: 700; cursor: pointer; background: transparent; color: var(--muted); transition: all 140ms ease; }
    .bd-sk-tab.active { background: linear-gradient(180deg, rgba(213, 167, 72, 0.34), rgba(145, 98, 28, 0.34)); color: #ffe7ad; box-shadow: inset 0 0 0 1px rgba(246, 206, 118, 0.52); }
    .bd-sk-stage { position: relative; width: 100%; height: 432px; border-radius: 10px; background: rgba(7, 6, 8, 0.65); border: 1px solid rgba(213, 167, 72, 0.16); overflow: hidden; }
    .bd-sk-svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
    .bd-sk-edge { fill: none; stroke: rgba(164, 150, 128, 0.34); stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
    .bd-sk-edge.is-active { stroke: rgba(245, 207, 123, 0.88); stroke-width: 2.8; }
    .bd-sk-grid { position: relative; z-index: 2; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-rows: repeat(6, 72px); width: 100%; height: 100%; }
    .bd-sk-node { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; padding: 2px; opacity: 0.42; filter: grayscale(0.55); transition: opacity 140ms ease, transform 140ms ease; }
    .bd-sk-node:hover { opacity: 0.92; filter: none; }
    .bd-sk-node.is-invested { opacity: 1; filter: none; }
    .bd-sk-node-ico-wrap { position: relative; width: 38px; height: 38px; border-radius: 6px; border: 1px solid rgba(182, 152, 98, 0.36); background: rgba(18, 14, 12, 0.9); display: flex; align-items: center; justify-content: center; overflow: visible; }
    .bd-sk-node.is-invested .bd-sk-node-ico-wrap { border-color: rgba(255, 213, 115, 0.92); box-shadow: 0 0 12px rgba(240, 184, 76, 0.42); }
    .bd-sk-node-ico { width: 34px; height: 34px; border-radius: 4px; object-fit: cover; display: block; }
    .bd-sk-node-ph { width: 34px; height: 34px; border-radius: 4px; background: rgba(255,255,255,0.06); }
    .bd-sk-node-badge { position: absolute; right: -6px; bottom: -5px; min-width: 18px; height: 16px; padding: 0 4px; border-radius: 999px; background: linear-gradient(180deg, #ffdd8a, #c98a24); color: #191006; font-size: 10px; font-weight: 900; line-height: 16px; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.85); }
    .bd-sk-node-name { font-size: 10px; line-height: 1.1; color: #ddd2be; max-width: 96%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; }
    .bd-sk-node.is-invested .bd-sk-node-name { color: #ffe7ad; font-weight: 700; }
    @media (max-width: 960px) {
      .pd-showcase { grid-template-columns: 1fr; }
      .stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .trees-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .gear-grid { grid-template-columns: 1fr; }
    }

    /* 浅色模式完整覆写（置于样式表最末，确保同权重下严格生效） */
    :root[data-theme="light"] {
      color-scheme: light;
      --bg: #f1e8d4;
      --panel: #faf4e6;
      --border: rgba(154, 114, 52, 0.42);
      --gold: #7c4d0e;
      --text: #271d14;
      --muted: #665541;
    }
    :root[data-theme="light"] body { background: radial-gradient(circle at 20% 0%, rgba(196, 146, 68, 0.22), transparent 54%), var(--bg); }
    :root[data-theme="light"] .hero { background: linear-gradient(135deg, #fbf6ea, #ede0c4); border-color: rgba(154, 114, 52, 0.45); box-shadow: 0 8px 24px rgba(74, 52, 22, 0.12); }
    :root[data-theme="light"] .hero-avatar { background: #efe3c8; border-color: rgba(154, 114, 52, 0.52); box-shadow: 0 4px 12px rgba(74, 52, 22, 0.16); }
    :root[data-theme="light"] .hero-title,
    :root[data-theme="light"] .panel-title { color: #6b3f08; }
    :root[data-theme="light"] .hero-notes,
    :root[data-theme="light"] .stat-box,
    :root[data-theme="light"] .tree-col,
    :root[data-theme="light"] .bag-chip { background: #f2e7cf; border-color: rgba(154, 114, 52, 0.36); color: #271d14; }
    :root[data-theme="light"] .bag-chip:hover,
    :root[data-theme="light"] .bag-chip.is-selected { background: #e9d9b6; border-color: #9b6516; }
    :root[data-theme="light"] .stat-v,
    :root[data-theme="light"] .sk-row { color: #241a10; }
    :root[data-theme="light"] .stat-v[style*="color:#ffd573"] { color: #7a4805 !important; }
    :root[data-theme="light"] .stat-v[style*="color:#8af49f"] { color: #11692a !important; }
    :root[data-theme="light"] .stat-v[style*="color:#e284db"] { color: #7d1f76 !important; }
    :root[data-theme="light"] .stat-v [style*="color:#ff8a75"] { color: #a82418 !important; }
    :root[data-theme="light"] .stat-v [style*="color:#78b7ff"] { color: #1548a8 !important; }
    :root[data-theme="light"] .merc-req-banner.is-ok { background: #e8f5e7; border-color: rgba(24, 132, 58, 0.46); color: #105e24; }
    :root[data-theme="light"] .merc-req-banner.is-warn { background: #fdece8; border-color: rgba(186, 46, 28, 0.48); color: #9c1f14; }
    :root[data-theme="light"] .merc-req-banner.is-info { background: #e9f1fc; border-color: rgba(24, 82, 178, 0.42); color: #1548a8; }
    :root[data-theme="light"] .sk-pts,
    :root[data-theme="light"] .tree-head,
    :root[data-theme="light"] .tree-head span,
    :root[data-theme="light"] .bag-chip strong { color: #7a4805 !important; }
    :root[data-theme="light"] .readonly-pill { color: #11692a; background: rgba(20, 128, 52, 0.12); border-color: rgba(20, 128, 52, 0.4); }
    :root[data-theme="light"] .buff-pill { background: #efe3c8; border-color: rgba(154, 114, 52, 0.38); color: #2b2016; }
    :root[data-theme="light"] .btn-secondary { background: #f3e8d0; color: #2b2016; border-color: rgba(154, 114, 52, 0.45); }
    :root[data-theme="light"] .bd-theme-bar { background: #efe3c8; }
    :root[data-theme="light"] .bd-theme-btn.active { background: #9b6516; color: #fffaf0; box-shadow: none; }
    :root[data-theme="light"] .bd-sk-view-tabs { background: #e9dcc0; border-color: rgba(154, 114, 52, 0.4); }
    :root[data-theme="light"] .bd-sk-tab.active { background: #9b6516; color: #fffaf0; box-shadow: none; }
    :root[data-theme="light"] .pd-swap-bar { background: #f2e7cf; border-color: rgba(154, 114, 52, 0.42); }
    :root[data-theme="light"] .pd-swap-tab { background: #faf4e6; border-color: rgba(154, 114, 52, 0.36); color: #5c4b37; }
    :root[data-theme="light"] .pd-swap-tab.active[data-set="1"] { background: #9b6516; border-color: #7a4b06; color: #fffaf0; }
    :root[data-theme="light"] .pd-swap-tab.active[data-set="2"] { background: #1e57a8; border-color: #143f7d; color: #fffaf0; }
    :root[data-theme="light"] .pd-swap-hint kbd { background: #fffdf8; border-color: rgba(154, 114, 52, 0.48); color: #6b3f08; }
    :root[data-theme="light"] .pd-doll-grid { background: radial-gradient(circle at 50% 35%, #eee1c6, #dfd0ae); border-color: rgba(154, 114, 52, 0.5); box-shadow: inset 0 0 18px rgba(96, 68, 28, 0.14); }
    :root[data-theme="light"] .pd-merc-grid { background: radial-gradient(circle at 50% 35%, #e3ecde, #d1dfca); border-color: rgba(42, 128, 68, 0.48); box-shadow: inset 0 0 18px rgba(28, 86, 44, 0.12); }
    :root[data-theme="light"] .pd-slot { background-color: #f6eedc; border-color: rgba(154, 114, 52, 0.48); color: #2b2016; }
    :root[data-theme="light"] .pd-slot:not(.equipped) { background-image: none !important; border-style: dashed; background-color: #f4ebd7; }
    :root[data-theme="light"] .pd-slot:not(.equipped) .pd-slot-name { color: #68553f; font-weight: 700; }
    :root[data-theme="light"] .pd-slot.is-selected { outline-color: #c43824; box-shadow: 0 0 12px rgba(196, 56, 36, 0.28); }
    :root[data-theme="light"] .pd-slot.equipped { background-color: #fdf5e2; border-color: rgba(176, 124, 34, 0.72); }
    :root[data-theme="light"] .pd-slot.equipped.q-set { background-color: #e8f5e7; border-color: rgba(36, 136, 62, 0.72); }
    :root[data-theme="light"] .pd-slot.equipped.q-rw { background-color: #fcecd9; border-color: rgba(196, 108, 34, 0.78); }
    :root[data-theme="light"] .pd-slot.equipped.q-magic { background-color: #e8f0fc; border-color: rgba(53, 104, 204, 0.76); }
    :root[data-theme="light"] .pd-slot.equipped.q-rare { background-color: #faf3d0; border-color: rgba(176, 138, 20, 0.8); }
    :root[data-theme="light"] .pd-slot.equipped.q-craft { background-color: #fbe8d6; border-color: rgba(194, 86, 16, 0.8); }
    :root[data-theme="light"] .pd-slot-label { color: #5c4b37; }
    :root[data-theme="light"] .pd-slot-sock { color: #1548a8; }
    :root[data-theme="light"] .pd-slot-name { color: #594734; }
    :root[data-theme="light"] .pd-slot.equipped .pd-slot-name { color: #754504; }
    :root[data-theme="light"] .pd-slot.q-set .pd-slot-name { color: #105e24; }
    :root[data-theme="light"] .pd-slot.q-rw .pd-slot-name { color: #8f3f06; }
    :root[data-theme="light"] .pd-slot.q-craft .pd-slot-name { color: #8c3704; }
    :root[data-theme="light"] .pd-slot.q-magic .pd-slot-name { color: #144099; }
    :root[data-theme="light"] .pd-slot.q-rare .pd-slot-name { color: #6e4e00; }
    :root[data-theme="light"] .pd-slot-img { filter: drop-shadow(0 2px 5px rgba(34, 20, 8, 0.45)); }
    :root[data-theme="light"] .pd-inv-grid { background: #e7d9bc; border-color: rgba(154, 114, 52, 0.48); }
    :root[data-theme="light"] .pd-inv-cell { border-color: rgba(145, 108, 52, 0.28); background: rgba(252, 247, 236, 0.45); }
    :root[data-theme="light"] .pd-inv-item { background: #fcf7eb; border-color: rgba(53, 104, 204, 0.5); }
    :root[data-theme="light"] .pd-inv-item.is-unique { background: #fdf2d6; border-color: rgba(176, 124, 34, 0.72); }
    :root[data-theme="light"] .pd-inv-item.is-util { background: #eee3ca; border-color: rgba(138, 112, 74, 0.48); }
    :root[data-theme="light"] .pd-inv-item.is-selected { outline-color: #c43824; box-shadow: 0 0 10px rgba(196, 56, 36, 0.32); }
    :root[data-theme="light"] .pd-inv-item img { filter: drop-shadow(0 1px 3px rgba(34, 20, 8, 0.42)); }
    :root[data-theme="light"] .pd-inv-item-tag { color: #1548a8; }
    :root[data-theme="light"] .pd-inv-item.is-unique .pd-inv-item-tag { color: #7a4805; }
    :root[data-theme="light"] .bd-inspector { background: #fcf7ec; border-color: rgba(154, 114, 52, 0.45); color: #241a10; box-shadow: 0 8px 24px rgba(74, 52, 22, 0.10); }
    :root[data-theme="light"] .bd-insp-pane.q-set,
    :root[data-theme="light"] .bd-insp-pane.q-rw,
    :root[data-theme="light"] .bd-insp-pane.q-magic,
    :root[data-theme="light"] .bd-insp-pane.q-rare,
    :root[data-theme="light"] .bd-insp-pane.q-craft { background: transparent; }
    :root[data-theme="light"] .bd-insp-icon-wrap { background: radial-gradient(circle at 50% 35%, #fdf7e8, #ecdcb8); border-color: rgba(176, 124, 34, 0.68); box-shadow: inset 0 1px 4px rgba(92, 64, 24, 0.12); }
    :root[data-theme="light"] .bd-insp-icon-wrap.q-set { background: radial-gradient(circle at 50% 35%, #eef8ee, #d6ebd5); border-color: rgba(36, 136, 62, 0.68); }
    :root[data-theme="light"] .bd-insp-icon-wrap.q-rw { background: radial-gradient(circle at 50% 35%, #fdf2e4, #f2d9bc); border-color: rgba(196, 108, 34, 0.72); }
    :root[data-theme="light"] .bd-insp-icon-wrap.q-magic { background: radial-gradient(circle at 50% 35%, #eef4fd, #d5e4fa); border-color: rgba(53, 104, 204, 0.7); }
    :root[data-theme="light"] .bd-insp-icon-wrap.q-rare { background: radial-gradient(circle at 50% 35%, #fcf7dc, #efe3a8); border-color: rgba(176, 138, 20, 0.74); }
    :root[data-theme="light"] .bd-insp-icon-wrap.q-craft { background: radial-gradient(circle at 50% 35%, #fdf0e4, #f3d5b8); border-color: rgba(194, 86, 16, 0.74); }
    :root[data-theme="light"] .bd-insp-icon { filter: drop-shadow(0 2px 5px rgba(34, 20, 8, 0.45)); }
    :root[data-theme="light"] .bd-insp-slot-pill,
    :root[data-theme="light"] .tag { background: #efe3c8; border-color: rgba(154, 114, 52, 0.45); color: #3a2b1c; font-weight: 700; }
    :root[data-theme="light"] .bd-insp-q-pill { background: rgba(168, 112, 24, 0.16); border-color: rgba(168, 112, 24, 0.5); color: #7a4805; }
    :root[data-theme="light"] .bd-insp-q-pill.q-set { background: rgba(24, 132, 58, 0.14); border-color: rgba(24, 132, 58, 0.48); color: #11692a; }
    :root[data-theme="light"] .bd-insp-q-pill.q-rw,
    :root[data-theme="light"] .bd-insp-q-pill.q-craft { background: rgba(188, 92, 22, 0.14); border-color: rgba(188, 92, 22, 0.48); color: #9e4308; }
    :root[data-theme="light"] .bd-insp-q-pill.q-rare { background: rgba(176, 138, 20, 0.18); border-color: rgba(176, 138, 20, 0.5); color: #6e4e00; }
    :root[data-theme="light"] .bd-insp-q-pill.q-magic { background: rgba(21, 72, 168, 0.13); border-color: rgba(21, 72, 168, 0.46); color: #1548a8; }
    :root[data-theme="light"] .bd-insp-eth-pill { background: rgba(21, 72, 168, 0.14); border-color: rgba(21, 72, 168, 0.5); color: #123e94; }
    :root[data-theme="light"] .bd-insp-name { color: #7a4805; }
    :root[data-theme="light"] .bd-insp-pane.q-set .bd-insp-name { color: #11692a; }
    :root[data-theme="light"] .bd-insp-pane.q-rw .bd-insp-name,
    :root[data-theme="light"] .bd-insp-pane.q-craft .bd-insp-name { color: #9e4308; }
    :root[data-theme="light"] .bd-insp-pane.q-magic .bd-insp-name { color: #1548a8; }
    :root[data-theme="light"] .bd-insp-pane.q-rare .bd-insp-name { color: #6e4e00; }
    :root[data-theme="light"] .bd-insp-runes { color: #7a4805; }
    :root[data-theme="light"] .bd-insp-base { background: #f2e7cf; border-color: rgba(154, 114, 52, 0.34); color: #362819; }
    :root[data-theme="light"] .bd-insp-stats li { color: #1548a8; }
    :root[data-theme="light"] .lvl-calc-badge { background: rgba(168, 108, 20, 0.16); border-color: rgba(154, 96, 16, 0.5); color: #6b3c02; }
    :root[data-theme="light"] .bd-insp-box.is-sock { background: rgba(24, 82, 178, 0.08); border-color: rgba(24, 82, 178, 0.3); }
    :root[data-theme="light"] .bd-insp-box-title { color: #1548a8; }
    :root[data-theme="light"] .bd-insp-sock-row { color: #241a10; }
    :root[data-theme="light"] .bd-insp-box.is-set { background: rgba(20, 118, 48, 0.08); border-color: rgba(20, 118, 48, 0.32); }
    :root[data-theme="light"] .bd-insp-box.is-set .bd-insp-box-title,
    :root[data-theme="light"] .bd-insp-set-sub,
    :root[data-theme="light"] .bd-insp-set-list { color: #11692a; }
    :root[data-theme="light"] .bd-insp-set-list.is-full { color: #7a4805; }
    :root[data-theme="light"] .bd-insp-note { background: #f4e8cd; border-color: rgba(154, 114, 52, 0.38); color: #6b3f08; }
    :root[data-theme="light"] .bd-sk-stage { background: #efe3c8; border-color: rgba(154, 114, 52, 0.38); }
    :root[data-theme="light"] .bd-sk-edge { stroke: rgba(120, 96, 62, 0.38); }
    :root[data-theme="light"] .bd-sk-edge.is-active { stroke: #9b6516; }
    :root[data-theme="light"] .bd-sk-node-ico-wrap { background: #f6eedc; border-color: rgba(154, 114, 52, 0.48); }
    :root[data-theme="light"] .bd-sk-node-name { color: #5c4b37; }
    :root[data-theme="light"] .bd-sk-node.is-invested .bd-sk-node-name { color: #6b3f08; }
  </style>
</head>
<body>
  <main class="shell">
    <header class="hero">
      <div class="hero-left">
        ${classIcon ? `<img class="hero-avatar" src="${escapeHtml(classIcon)}" alt="${escapeHtml(classNameZh)}" />` : ""}
        <div>
          <h1 class="hero-title">${escapeHtml(build.title)}</h1>
          <div class="hero-meta">
            <span class="readonly-pill">只读公开分享 · #${escapeHtml(build.id)}</span>
            <span>职业：<strong>${escapeHtml(classNameZh)} (${escapeHtml(classNameEn)})</strong> · Lv.${charLvl}</span>
            <span>分享者：<strong>${escapeHtml(build.authorName || "庇护之地冒险者")}</strong></span>
            ${createdLabel ? `<span>创建于：${escapeHtml(createdLabel)}</span>` : ""}
          </div>
          ${build.notes ? `<div class="hero-notes">${escapeHtml(build.notes)}</div>` : ""}
        </div>
      </div>
      <div class="hero-actions">
        <div class="bd-theme-bar" role="group" aria-label="深浅外观切换">
          <button type="button" class="bd-theme-btn active" data-theme-mode="auto" aria-pressed="true" title="跟随系统自动切换">🌓 跟随</button>
          <button type="button" class="bd-theme-btn" data-theme-mode="dark" aria-pressed="false" title="深色模式">🌙 深色</button>
          <button type="button" class="bd-theme-btn" data-theme-mode="light" aria-pressed="false" title="浅色模式">☀ 浅色</button>
        </div>
        <a class="btn btn-primary" id="import-build-link" href="${escapeHtml(importPath)}">📥 导入到我的模拟器</a>
        <button type="button" class="btn btn-secondary" id="copy-share-url-btn" data-url="${escapeHtml(shareUrl)}">🔗 复制分享链接</button>
        <a class="btn btn-secondary" href="/">← 返回主站</a>
      </div>
    </header>

    ${summaryHtml}

    <section class="panel" aria-label="角色 10 部位配装纸娃娃与详情">
      <h2 class="panel-title">
        <span>🛡️ 角色纸娃娃配装（10 部位）</span>
        <span style="font-size:12px;color:var(--muted)">${escapeHtml(activeSetLabel)} · 已穿戴 ${equippedCount} / 10 部位（点击左侧纸娃娃部位查看右侧完整属性详情）</span>
      </h2>
      <div class="pd-showcase">
        <div class="pd-doll-col">
          ${hasSwapGear ? `<div class="pd-swap-bar">
            <div class="pd-swap-tabs" role="tablist" aria-label="主副手武器组切换">
              <button type="button" class="pd-swap-tab${!isSet2Active ? " active" : ""}" data-set="1" data-pane-mode="${!isSet2Active ? "primary" : "swap"}" aria-selected="${!isSet2Active ? "true" : "false"}">I 主手组${!isSet2Active ? "（当前）" : ""}</button>
              <button type="button" class="pd-swap-tab${isSet2Active ? " active" : ""}" data-set="2" data-pane-mode="${isSet2Active ? "primary" : "swap"}" aria-selected="${isSet2Active ? "true" : "false"}">II 副手组${isSet2Active ? "（当前）" : ""}</button>
            </div>
            <span class="pd-swap-hint">⇄ ${escapeHtml(swapSetLabel)} · 按 <kbd>W</kbd></span>
          </div>` : ""}
          <div class="pd-doll-grid${isSet2Active ? " is-swap-active" : ""}" id="bd-char-doll-primary">${charDollPrimaryHtml}</div>
          ${hasSwapGear ? `<div class="pd-doll-grid${!isSet2Active ? " is-swap-active" : ""}" id="bd-char-doll-swap" style="display:none">${charDollSwapHtml}</div>` : ""}
        </div>
        <div class="bd-right-col">
          <div class="bd-inspector" id="bd-char-inspector" aria-label="选中装备属性详情">${charInspectorPanesHtml}</div>
        </div>
      </div>
    </section>

    <section class="panel" aria-label="角色背包咒符清单">
      <h2 class="panel-title">
        <span>🎒 角色背包咒符（10×4）</span>
        <span style="font-size:12px;color:var(--muted)">共 ${bagRaw.length} 件（点击左侧任意咒符查看右侧完整属性与变量）</span>
      </h2>
      ${bagEntries.length
        ? `<div class="pd-showcase">
            <div class="pd-doll-col">
              ${renderBagGridHtml()}
              <div class="bag-grid">${bagList.map((b) => {
                const match = bagEntries.find((e) => e.placed.label === b.label);
                const keyAttr = match ? ` data-bd-slot="${escapeHtml(match.paneKey)}" data-bd-target="bag"` : "";
                return `<button type="button" class="bag-chip"${keyAttr}><img src="${escapeHtml(b.icon)}" alt="" loading="lazy" /><span>${escapeHtml(b.label)}</span>${b.count > 1 ? `<strong style="color:#ffd573">×${b.count}</strong>` : ""}</button>`;
              }).join("")}</div>
            </div>
            <div class="bd-right-col">
              <div class="bd-inspector" id="bd-bag-inspector" aria-label="选中背包咒符属性详情">${bagInspectorPanesHtml}</div>
            </div>
          </div>`
        : `<div style="font-size:13px;color:var(--muted)">未配置背包咒符</div>`}
    </section>

    <section class="panel" aria-label="职业技能树加点明细">
      <h2 class="panel-title">
        <span>✨ 技能树加点明细</span>
        <span class="bd-sk-head-r">
          <span style="font-size:12px;color:var(--muted)">已分配 ${totalSkillPts} / 110 点</span>
          <span class="bd-sk-view-tabs" role="tablist" aria-label="技能展示视图切换">
            <button type="button" class="bd-sk-tab active" data-bd-sk-view="list" aria-selected="true">📋 紧凑列表</button>
            <button type="button" class="bd-sk-tab" data-bd-sk-view="tree" aria-selected="false">🌳 技能树视图</button>
          </span>
        </span>
      </h2>
      <div class="trees-grid" id="bd-sk-view-list">
        ${treeBlocks.map((tb) => `<div class="tree-col">
          <div class="tree-head"><span>${escapeHtml(tb.title)}</span><span style="color:#f5cf7b">${tb.pts} 点</span></div>
          ${tb.items.length
            ? tb.items.map((sk) => `<div class="sk-row"><div class="sk-row-l">${sk.icon ? `<img class="sk-icon" src="${escapeHtml(sk.icon)}" alt="" loading="lazy" />` : ""}<span>${escapeHtml(sk.nameZh)}</span></div><span class="sk-pts">${sk.pts} / 20</span></div>`).join("")
            : `<div style="font-size:12px;color:var(--muted)">本系未投入技能点</div>`}
        </div>`).join("")}
      </div>
      <div class="trees-grid" id="bd-sk-view-tree" style="display:none">
        ${treeBlocks.map((tb) => `<div class="tree-col">
          <div class="tree-head"><span>${escapeHtml(tb.title)}</span><span style="color:#f5cf7b">${tb.pts} 点</span></div>
          ${renderSharedSkillTreeStageHtml(tb)}
        </div>`).join("")}
      </div>
    </section>

    <section class="panel" aria-label="佣兵配装与团队光环">
      <h2 class="panel-title">
        <span>⚔️ 佣兵配置与团队光环联动</span>
        <span style="font-size:12px;color:var(--muted)">${mercEnabled ? `${escapeHtml(mercName)} · Lv.${pd?.mercLvl || 90}` : "未携带佣兵"}</span>
      </h2>
      ${buffBadges.length ? `<div class="buff-row" style="margin-bottom:14px">${buffBadges.map((b) => `<span class="buff-pill">${escapeHtml(b)}</span>`).join("")}</div>` : ""}
      ${mercStatsHtml}
      ${mercEnabled
        ? `<div class="pd-showcase">
            <div class="pd-doll-col">
              <div class="pd-merc-grid">${mercGearCards.map((entry) => renderPaperdollSlot(entry, "merc", "", defaultMercKey)).join("")}</div>
            </div>
            <div class="bd-right-col">
              <div class="bd-inspector" id="bd-merc-inspector" aria-label="佣兵装备属性详情">${mercInspectorPanesHtml}</div>
            </div>
          </div>`
        : `<div style="font-size:13px;color:var(--muted)">该 BD 未携带佣兵</div>`}
    </section>
  </main>
  <script>
    (function () {
      const btn = document.getElementById("copy-share-url-btn");
      if (btn) {
        btn.addEventListener("click", function () {
          const targetUrl = window.location.href || btn.dataset.url || "";
          const done = function () {
            const orig = btn.textContent;
            btn.textContent = "✓ 已复制分享短链";
            setTimeout(function () { btn.textContent = orig; }, 1600);
          };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(targetUrl).then(done).catch(done);
          } else {
            const ta = document.createElement("textarea");
            ta.value = targetUrl;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand("copy"); } catch (e) {}
            ta.remove();
            done();
          }
        });
      }

      function selectInspectKey(target, key) {
        if (!target || !key) return;
        document.querySelectorAll('[data-bd-slot][data-bd-target="' + target + '"]').forEach(function (el) {
          el.classList.toggle("is-selected", el.getAttribute("data-bd-slot") === key);
        });
        document.querySelectorAll('[data-bd-pane][data-bd-pane-target="' + target + '"]').forEach(function (el) {
          el.classList.toggle("active", el.getAttribute("data-bd-pane") === key);
        });
      }

      // Click Paperdoll slot -> show full item details in right Inspector
      document.querySelectorAll("[data-bd-slot]").forEach(function (slotBtn) {
        slotBtn.addEventListener("click", function () {
          const key = slotBtn.getAttribute("data-bd-slot");
          const target = slotBtn.getAttribute("data-bd-target") || "char";
          selectInspectKey(target, key);
        });
      });

      const primaryDoll = document.getElementById("bd-char-doll-primary");
      const swapDoll = document.getElementById("bd-char-doll-swap");
      const swapTabs = document.querySelectorAll(".pd-swap-tab");
      let curMode = "primary";
      const setSwapMode = function (mode) {
        if (!primaryDoll || !swapDoll) return;
        curMode = mode === "swap" ? "swap" : "primary";
        primaryDoll.style.display = curMode === "primary" ? "grid" : "none";
        swapDoll.style.display = curMode === "swap" ? "grid" : "none";
        swapTabs.forEach(function (t) {
          const on = t.getAttribute("data-pane-mode") === curMode;
          t.classList.toggle("active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
      };

      if (primaryDoll && swapDoll && swapTabs.length) {
        swapTabs.forEach(function (t) {
          t.addEventListener("click", function () {
            const nextMode = t.getAttribute("data-pane-mode") || "primary";
            setSwapMode(nextMode);
            selectInspectKey("char", nextMode === "swap" ? "char-weapon-swap" : "char-weapon");
          });
        });
        document.addEventListener("keydown", function (e) {
          if (e.key !== "w" && e.key !== "W") return;
          if (e.metaKey || e.ctrlKey || e.altKey) return;
          const tag = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : "";
          if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
          const nextMode = curMode === "primary" ? "swap" : "primary";
          setSwapMode(nextMode);
          selectInspectKey("char", nextMode === "swap" ? "char-weapon-swap" : "char-weapon");
        });
      }

      const skListEl = document.getElementById("bd-sk-view-list");
      const skTreeEl = document.getElementById("bd-sk-view-tree");
      const skViewTabs = document.querySelectorAll("[data-bd-sk-view]");
      if (skListEl && skTreeEl && skViewTabs.length) {
        skViewTabs.forEach(function (tabBtn) {
          tabBtn.addEventListener("click", function () {
            const view = tabBtn.getAttribute("data-bd-sk-view") === "tree" ? "tree" : "list";
            skListEl.style.display = view === "list" ? "grid" : "none";
            skTreeEl.style.display = view === "tree" ? "grid" : "none";
            skViewTabs.forEach(function (b) {
              const on = b.getAttribute("data-bd-sk-view") === view;
              b.classList.toggle("active", on);
              b.setAttribute("aria-selected", on ? "true" : "false");
            });
          });
        });
      }
    })();
  </script>
</body>
</html>`;
}

async function handleCreateSharedBuild(request, env, url) {
  if (!checkSameOriginCsrf(request, url)) {
    return authJson({ ok: false, error: "跨站请求被拦截" }, 403);
  }
  if (!env?.DCLONE_STATE) {
    return authJson({ ok: false, error: "KV 存储未绑定，暂无法生成分享短链" }, 503);
  }

  const rl = await checkShareRateLimit(request, env);
  if (rl.blocked) {
    return authJson({ ok: false, error: "生成分享链接过于频繁，请 10 分钟后再试" }, 429);
  }

  const parsed = await readJsonBody(request, MAX_SHARE_BODY_BYTES);
  if (!parsed.ok) {
    return authJson({ ok: false, error: parsed.error }, parsed.status);
  }

  const clean = sanitizeSharedBuildInput(parsed.data);
  if (!clean.ok) {
    return authJson({ ok: false, error: clean.error }, 400);
  }

  let authorName = "庇护之地冒险者";
  let authorUserId = "";
  try {
    const auth = await getAuthenticatedUser(request, env);
    if (auth?.user) {
      authorName = sanitizeText(auth.user.displayName || auth.user.username || "庇护之地冒险者", 40);
      authorUserId = auth.user.id || "";
    }
  } catch {
    // Public sharing works anonymously even if session lookup fails
  }

  let shareId = "";
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = generateShareId(8);
    const exists = await env.DCLONE_STATE.get(`${KEY_SHARE_BUILD_PREFIX}${candidate}`);
    if (!exists) {
      shareId = candidate;
      break;
    }
  }
  if (!shareId) {
    return authJson({ ok: false, error: "生成分享编号失败，请重试" }, 500);
  }

  const now = new Date().toISOString();
  const record = {
    id: shareId,
    version: 1,
    classId: clean.data.classId,
    title: clean.data.title,
    notes: clean.data.notes,
    skills: clean.data.skills,
    paperdoll: clean.data.paperdoll,
    summary: clean.data.summary,
    authorName,
    authorUserId,
    createdAt: now
  };

  await env.DCLONE_STATE.put(`${KEY_SHARE_BUILD_PREFIX}${shareId}`, JSON.stringify(record));
  await recordShareCreate(env, rl.rlKey, rl.count);
  if (authorUserId) {
    await appendUserShareIndex(env, authorUserId, {
      id: shareId,
      title: record.title,
      classId: record.classId,
      className: CLASS_FALLBACK_NAMES[record.classId] || record.classId,
      charLvl: Number(record.paperdoll?.charLvl) || 90,
      sharePath: `/build/${shareId}`,
      createdAt: now
    });
  }

  const sharePath = `/build/${shareId}`;
  const shareUrl = `${url.origin}${sharePath}`;
  const publicBuild = { ...record };
  delete publicBuild.authorUserId;

  return authJson({ ok: true, id: shareId, sharePath, shareUrl, build: publicBuild }, 201);
}

async function appendUserShareIndex(env, userId, entry) {
  if (!env?.DCLONE_STATE || !userId || !entry?.id) return;
  const key = `${KEY_USER_SHARES_PREFIX}${userId}`;
  try {
    const existing = await env.DCLONE_STATE.get(key, "json");
    const list = Array.isArray(existing) ? existing.filter((x) => x && x.id && x.id !== entry.id) : [];
    list.unshift(entry);
    await env.DCLONE_STATE.put(key, JSON.stringify(list.slice(0, MAX_USER_SHARES)));
  } catch {
    // Non-fatal: share record itself is already persisted
  }
}

async function removeUserShareIndex(env, userId, shareId) {
  if (!env?.DCLONE_STATE || !userId || !shareId) return;
  const key = `${KEY_USER_SHARES_PREFIX}${userId}`;
  try {
    const existing = await env.DCLONE_STATE.get(key, "json");
    if (!Array.isArray(existing)) return;
    const next = existing.filter((x) => x && x.id !== shareId);
    await env.DCLONE_STATE.put(key, JSON.stringify(next));
  } catch {
    // ignore
  }
}

async function handleListUserShares(request, env, url) {
  if (!env?.DCLONE_STATE) {
    return authJson({ ok: false, error: "KV 存储未绑定" }, 503);
  }
  const auth = await getAuthenticatedUser(request, env);
  if (!auth?.user?.id) {
    return authJson({ ok: false, error: "请先登录账号" }, 401);
  }
  const raw = await env.DCLONE_STATE.get(`${KEY_USER_SHARES_PREFIX}${auth.user.id}`, "json");
  const list = Array.isArray(raw) ? raw : [];
  const shares = list
    .filter((item) => item && typeof item === "object" && SHARE_ID_PATTERN.test(String(item.id || "")))
    .map((item) => ({
      id: item.id,
      title: String(item.title || "未命名 BD"),
      classId: String(item.classId || "sor"),
      className: String(item.className || CLASS_FALLBACK_NAMES[item.classId] || item.classId || ""),
      charLvl: Number(item.charLvl) || 90,
      createdAt: String(item.createdAt || ""),
      sharePath: `/build/${item.id}`,
      shareUrl: `${url.origin}/build/${item.id}`
    }));
  return authJson({ ok: true, shares }, 200);
}

async function handleDeleteSharedBuild(request, env, url, rawId) {
  if (!checkSameOriginCsrf(request, url)) {
    return authJson({ ok: false, error: "跨站请求被拦截" }, 403);
  }
  if (!env?.DCLONE_STATE) {
    return authJson({ ok: false, error: "KV 存储未绑定" }, 503);
  }
  if (!SHARE_ID_PATTERN.test(rawId)) {
    return authJson({ ok: false, error: "无效的分享编号" }, 400);
  }
  const auth = await getAuthenticatedUser(request, env);
  if (!auth?.user?.id) {
    return authJson({ ok: false, error: "请先登录账号" }, 401);
  }
  const key = `${KEY_SHARE_BUILD_PREFIX}${rawId}`;
  const record = await env.DCLONE_STATE.get(key, "json");
  if (!record || typeof record !== "object") {
    await removeUserShareIndex(env, auth.user.id, rawId);
    return authJson({ ok: false, error: "未找到该分享 BD 或已被撤销" }, 404);
  }
  const isOwner = Boolean(record.authorUserId && record.authorUserId === auth.user.id);
  const isAdmin = auth.user.role === "admin";
  if (!isOwner && !isAdmin) {
    return authJson({ ok: false, error: "无权撤销他人的分享链接" }, 403);
  }
  await env.DCLONE_STATE.delete(key);
  if (record.authorUserId) {
    await removeUserShareIndex(env, record.authorUserId, rawId);
  }
  if (auth.user.id !== record.authorUserId) {
    await removeUserShareIndex(env, auth.user.id, rawId);
  }
  return authJson({ ok: true, id: rawId, deleted: true }, 200);
}

async function getSharedBuildById(env, shareId) {
  if (!env?.DCLONE_STATE || !SHARE_ID_PATTERN.test(shareId)) return null;
  const raw = await env.DCLONE_STATE.get(`${KEY_SHARE_BUILD_PREFIX}${shareId}`, "json");
  if (!raw || typeof raw !== "object" || !VALID_CLASS_IDS.has(raw.classId)) return null;
  const publicBuild = { ...raw };
  delete publicBuild.authorUserId;
  return publicBuild;
}

export async function handleSharedBuildRequest(request, env, url) {
  const path = url.pathname;

  if (request.method === "GET" && path === "/api/user/shares") {
    return handleListUserShares(request, env, url);
  }

  if (request.method === "POST" && path === "/api/builds/share") {
    return handleCreateSharedBuild(request, env, url);
  }

  if (request.method === "DELETE" && path.startsWith("/api/builds/share/")) {
    const rawId = path.slice("/api/builds/share/".length).replace(/\/+$/, "").toLowerCase();
    return handleDeleteSharedBuild(request, env, url, rawId);
  }

  if (request.method === "GET" && path.startsWith("/api/builds/share/")) {
    const rawId = path.slice("/api/builds/share/".length).replace(/\/+$/, "").toLowerCase();
    if (!SHARE_ID_PATTERN.test(rawId)) {
      return authJson({ ok: false, error: "无效的分享编号" }, 400);
    }
    const build = await getSharedBuildById(env, rawId);
    if (!build) {
      return authJson({ ok: false, error: "未找到该分享 BD 或链接已失效" }, 404);
    }
    return authJson({ ok: true, build }, 200);
  }

  if (request.method === "GET" && (path.startsWith("/build/") && path.length > "/build/".length)) {
    const rawId = path.slice("/build/".length).replace(/\/+$/, "").toLowerCase();
    if (!SHARE_ID_PATTERN.test(rawId)) {
      return buildHtmlResponse(renderSharedBuildNotFoundPage(rawId), 404, "no-store");
    }
    const build = await getSharedBuildById(env, rawId);
    if (!build) {
      return buildHtmlResponse(renderSharedBuildNotFoundPage(rawId), 404, "no-store");
    }
    return buildHtmlResponse(renderSharedBuildPage(build, { origin: url.origin }), 200, "public, max-age=300");
  }

  return null;
}
