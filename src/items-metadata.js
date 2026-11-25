// 物品资讯百科数据（基础底材 / 魔法与亮金极品 / 全部 32 套绿色套装 / 全阶梯暗金装备 / 常用方块公式）
// 参考 D2R 3.4 术士君临版本与 d2r.world 物品分类体系
import { ALL_BASE_ITEMS } from "./items-base-data.js";
import { ALL_SET_ITEMS, ALL_UNIQUE_ITEMS } from "./items-sets-uniques-data.js";
import { SET_DETAILS } from "./items-set-details.js";
import { BASE_NORM_ICON_MAP, ITEM_ICON_MAP } from "./items-icons-map.js";
import { BASE_OFFICIAL_STATS, ITEM_I18N_MAP, SET_PIECE_BASE_INFO, UNIQUE_BASE_INFO } from "./items-i18n-data.js";
import { BASE_UPGRADE_TIERS, SUNDER_COMMON_POOLS, SUNDER_CRAFTS_34, UNIQUE_UPGRADE_META } from "./cube-upgrader.js";
import { BASE_CODE_RULES } from "./paperdoll-data.js";

const CLASS_ONLY_LABELS = {
  ama: "亚马逊专用",
  ass: "刺客专用",
  bar: "野蛮人专用",
  dru: "德鲁伊专用",
  nec: "死灵专用",
  pal: "圣骑士专用",
  sor: "法师专用",
  war: "术士专用"
};

const BASE_TYPE_META = {
  tors: { category: "armor", subCategory: "armor", subCategoryZh: "盔甲", sockCaps: [3, 4, 4], order: 10 },
  shie: { category: "shield", subCategory: "shie", subCategoryZh: "通用盾牌", sockCaps: [3, 4, 4], order: 20 },
  ashd: { category: "shield", subCategory: "pal-shd", subCategoryZh: "圣骑士专用盾", sockCaps: [3, 4, 4], order: 21 },
  head: { category: "shield", subCategory: "nec-head", subCategoryZh: "死灵专用首级", sockCaps: [2, 2, 2], order: 22 },
  grim: { category: "shield", subCategory: "war-grim", subCategoryZh: "术士专用魔典", sockCaps: [2, 2, 2], order: 23 },
  helm: { category: "helm", subCategory: "helm", subCategoryZh: "通用头盔", sockCaps: [2, 3, 3], order: 30 },
  circ: { category: "helm", subCategory: "circ", subCategoryZh: "头环 / 权冠", sockCaps: [1, 2, 3], order: 31 },
  phlm: { category: "helm", subCategory: "bar-helm", subCategoryZh: "野蛮人专用头盔", sockCaps: [2, 3, 3], order: 32 },
  pelt: { category: "helm", subCategory: "dru-pelt", subCategoryZh: "德鲁伊专用狼头", sockCaps: [2, 3, 3], order: 33 },
  swor: { category: "weapon", subCategory: "swor", subCategoryZh: "剑", sockCaps: [3, 4, 6], order: 40 },
  axe:  { category: "weapon", subCategory: "axe", subCategoryZh: "斧", sockCaps: [3, 4, 6], order: 41 },
  pole: { category: "weapon", subCategory: "pole", subCategoryZh: "长柄", sockCaps: [3, 4, 6], order: 42 },
  spea: { category: "weapon", subCategory: "spea", subCategoryZh: "长矛", sockCaps: [3, 4, 6], order: 43 },
  mace: { category: "weapon", subCategory: "mace", subCategoryZh: "钉锤 / 连枷", sockCaps: [3, 4, 6], order: 44 },
  hamm: { category: "weapon", subCategory: "mace", subCategoryZh: "重锤", sockCaps: [3, 4, 6], order: 45 },
  club: { category: "weapon", subCategory: "mace", subCategoryZh: "木棒", sockCaps: [3, 4, 6], order: 46 },
  scep: { category: "weapon", subCategory: "scep", subCategoryZh: "权杖", sockCaps: [3, 4, 6], order: 47 },
  staf: { category: "weapon", subCategory: "staf", subCategoryZh: "双手法杖", sockCaps: [3, 4, 6], order: 48 },
  wand: { category: "weapon", subCategory: "wand", subCategoryZh: "单手魔杖", sockCaps: [2, 2, 2], order: 49 },
  bow:  { category: "weapon", subCategory: "bow", subCategoryZh: "弓", sockCaps: [3, 4, 6], order: 50 },
  xbow: { category: "weapon", subCategory: "xbow", subCategoryZh: "弩", sockCaps: [3, 4, 6], order: 51 },
  knif: { category: "weapon", subCategory: "knif", subCategoryZh: "匕首", sockCaps: [2, 3, 3], order: 52 },
  jave: { category: "weapon", subCategory: "jave", subCategoryZh: "标枪", sockCaps: [0, 0, 0], order: 53 },
  tkni: { category: "weapon", subCategory: "throw", subCategoryZh: "飞刀 (投掷)", sockCaps: [0, 0, 0], order: 54 },
  taxe: { category: "weapon", subCategory: "throw", subCategoryZh: "飞斧 (投掷)", sockCaps: [0, 0, 0], order: 55 },
  abow: { category: "weapon", subCategory: "ama-weap", subCategoryZh: "亚马逊专用弓", sockCaps: [3, 4, 6], order: 56 },
  aspe: { category: "weapon", subCategory: "ama-weap", subCategoryZh: "亚马逊专用矛", sockCaps: [3, 4, 6], order: 57 },
  ajav: { category: "weapon", subCategory: "ama-weap", subCategoryZh: "亚马逊专用标枪", sockCaps: [0, 0, 0], order: 58 },
  h2h:  { category: "weapon", subCategory: "ass-claw", subCategoryZh: "刺客专用拳刃/爪", sockCaps: [2, 3, 3], order: 59 },
  h2h2: { category: "weapon", subCategory: "ass-claw", subCategoryZh: "刺客专用拳刃/爪", sockCaps: [2, 3, 3], order: 60 },
  orb:  { category: "weapon", subCategory: "sor-orb", subCategoryZh: "法师专用法珠", sockCaps: [2, 3, 3], order: 61 },
  glov: { category: "accessory", subCategory: "glov", subCategoryZh: "手套", sockCaps: [0, 0, 0], order: 70 },
  boot: { category: "accessory", subCategory: "boot", subCategoryZh: "鞋子", sockCaps: [0, 0, 0], order: 71 },
  belt: { category: "accessory", subCategory: "belt", subCategoryZh: "腰带", sockCaps: [0, 0, 0], order: 72 }
};

const TIER_LABELS = { 1: "普通", 2: "扩展", 3: "精华" };

function buildAutoBaseUsage(rule, meta, tierLabel, maxSock) {
  if (rule.type === "ashd") return `${tierLabel}圣骑士专用盾，可自带最高 +45 全抗或 +65% ED/+121 AR（最高 ${maxSock} 孔）`;
  if (rule.type === "head") return `${tierLabel}死灵法师专用副手，可自带最高 +3 单项死灵技能（最高 ${maxSock} 孔，可做韵律/辉煌/警戒）`;
  if (rule.type === "grim") return `${tierLabel}术士专用魔典，可自带最高 +3 单项术士技能（最高 ${maxSock} 孔，可做警戒/辉煌/韵律）`;
  if (rule.type === "phlm") return `${tierLabel}野蛮人专用头盔，可自带最高 +3 呐喊/战斗技能（最高 ${maxSock} 孔）`;
  if (rule.type === "pelt") return `${tierLabel}德鲁伊专用头盔，可自带最高 +3 元素/变形/召唤技能（最高 ${maxSock} 孔）`;
  if (rule.type === "abow") return `${tierLabel}亚马逊专用弓，可自带最高 +3 弓与弩技能（最高 ${maxSock} 孔）`;
  if (rule.type === "aspe") return `${tierLabel}亚马逊专用矛，可自带最高 +3 标枪与长矛技能（最高 ${maxSock} 孔）`;
  if (rule.type === "ajav") return `${tierLabel}亚马逊专用标枪，可自带最高 +3 标枪技能（不可打孔，刷蓝/黄/暗金底材）`;
  if (rule.type === "h2h" || rule.type === "h2h2") return `${tierLabel}刺客专用爪，${rule.type === "h2h2" ? "可自带最高 +3 单项刺客技能" : "基础爪类底材"}（最高 ${maxSock} 孔）`;
  if (rule.type === "orb") return `${tierLabel}法师专用法珠，可自带最高 +3 单项法师技能（最高 ${maxSock} 孔，不可做通用武器符文之语）`;
  if (rule.type === "circ") return `${tierLabel}头环底材（无力量需求，极品蓝/黄头环与洗装备底材，最高 ${maxSock} 孔）`;
  if (rule.type === "glov" || rule.type === "boot" || rule.type === "belt") return `${tierLabel}${meta.subCategoryZh}底材（不可打孔，用于手工橙装配方、亮金/蓝装赌博与暗金升阶对照）`;
  if (maxSock === 0) return `${tierLabel}${meta.subCategoryZh}（投掷类不可打孔，用于无形亮金/蓝装投掷流派与暗金升阶对照）`;
  return `${tierLabel}${meta.subCategoryZh}底材（最高 ${maxSock} 孔，支持对应孔数符文之语或拉祖克打孔）`;
}

function buildFullBaseItems() {
  const curatedByEn = new Map();
  for (const item of ALL_BASE_ITEMS) {
    if (item && item.nameEn) curatedByEn.set(item.nameEn.toLowerCase(), item);
  }
  const items = [];
  for (const rule of Object.values(BASE_CODE_RULES)) {
    if (!rule || rule.type === "tpot") continue;
    const meta = BASE_TYPE_META[rule.type];
    if (!meta) continue;
    const tierInfo = BASE_UPGRADE_TIERS[rule.code] || null;
    const tierNum = tierInfo?.tier || 1;
    const tierLabel = TIER_LABELS[tierNum] || "普通";
    const curated = curatedByEn.get(String(rule.nameEn || "").toLowerCase()) || null;
    const maxSock = Math.max(0, Number(rule.maxSockets || 0));
    let sockets;
    if (curated && Array.isArray(curated.sockets) && curated.sockets.length === 3) {
      sockets = curated.sockets;
    } else if (rule.code === "ci3") {
      sockets = [3, 3, 3];
    } else {
      sockets = meta.sockCaps.map((cap) => Math.min(maxSock, cap));
    }
    const statParts = [];
    if (rule.slot === "weapon") {
      if (tierInfo?.d1 && tierInfo.d1[1] > 0) statParts.push(`单手伤害 ${tierInfo.d1[0]}–${tierInfo.d1[1]}`);
      if (tierInfo?.d2 && tierInfo.d2[1] > 0) statParts.push(`双手伤害 ${tierInfo.d2[0]}–${tierInfo.d2[1]}`);
      if (tierInfo?.dt && tierInfo.dt[1] > 0) statParts.push(`投掷伤害 ${tierInfo.dt[0]}–${tierInfo.dt[1]}`);
      if (statParts.length === 0 && rule.maxDmg > 0) statParts.push(`单手伤害 ${rule.minDmg}–${rule.maxDmg}`);
      if (statParts.length === 0 && rule.twoHandMax > 0) statParts.push(`双手伤害 ${rule.twoHandMin}–${rule.twoHandMax}`);
      statParts.push(`基础攻速 WSM [${rule.wsm || 0}]`);
      if (rule.oneOrTwoHanded) statParts.push("野蛮人可单持");
      else if (rule.twoHanded) statParts.push("双手武器");
    } else {
      if (rule.maxDef > 0) statParts.push(`基础防御 ${rule.minDef}–${rule.maxDef}`);
      if (rule.block > 0) {
        if (rule.type === "ashd") statParts.push(`圣骑士格挡 ${rule.block + 30}%`);
        else if (rule.type === "head") statParts.push(`死灵格挡 ${rule.block + 20}%`);
        else if (rule.type === "grim") statParts.push(`术士格挡 ${rule.block + 25}%`);
        else statParts.push(`格挡 ${rule.block + 20}%–${rule.block + 30}%`);
      }
      if (rule.smiteMax > 0) statParts.push(`盾击伤害 ${rule.smiteMin}–${rule.smiteMax}`);
      if (rule.kickMax > 0) statParts.push(`踢击伤害 ${rule.kickMin}–${rule.kickMax}`);
    }
    const zhCN = (tierInfo && tierInfo.zhCN) || curated?.nameZh || rule.nameZh;
    const zhTW = (tierInfo && tierInfo.zhTW) || ITEM_I18N_MAP[rule.nameEn]?.zhTW || zhCN;
    const normCode = (tierInfo && tierInfo.norm) || rule.code;
    const icon = ITEM_ICON_MAP[rule.nameEn] || BASE_NORM_ICON_MAP[normCode] || null;
    const classOnly = rule.classOnly || "";
    const classOnlyZh = CLASS_ONLY_LABELS[classOnly] || "";
    const slug = curated?.id || String(rule.nameEn || rule.code).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const curatedExtra = curated?.stats
      ? String(curated.stats)
          .split(/\s*(?:·|\|)\s*/)
          .map((s) => s.trim())
          .filter((p) => {
            if (!p) return false;
            if (/^防\s*\d/.test(p)) return false;
            if (/^格挡\s*\d+%/.test(p) && rule.block > 0) return false;
            if (/^攻速\s*\[/.test(p)) return false;
            if (/^(?:最多|全系最多|最大)?\s*\d+\s*孔$/.test(p)) return false;
            return true;
          })
      : [];
    const mergedStats = statParts.concat(curatedExtra).join(" · ");
    items.push({
      id: slug,
      code: rule.code,
      category: meta.category,
      subCategory: meta.subCategory,
      subCategoryZh: meta.subCategoryZh,
      rawType: rule.type,
      classOnly,
      classOnlyZh,
      tier: tierLabel,
      tierNum,
      nameZh: zhCN,
      nameEn: rule.nameEn,
      reqStr: Number(rule.reqStr || 0),
      reqDex: Number(rule.reqDex || 0),
      reqLvl: Number(rule.reqLvl || 0),
      sockets,
      maxSockets: sockets[2],
      stats: mergedStats,
      usage: curated?.usage || buildAutoBaseUsage(rule, meta, tierLabel, sockets[2]),
      icon,
      i18n: ITEM_I18N_MAP[rule.nameEn] || { zhCN, zhTW, enUS: rule.nameEn },
      officialStats: BASE_OFFICIAL_STATS[rule.nameEn] || null,
      _order: meta.order
    });
  }
  items.sort((a, b) =>
    (a._order - b._order) ||
    (a.tierNum - b.tierNum) ||
    (a.reqLvl - b.reqLvl) ||
    (a.reqStr - b.reqStr) ||
    a.nameEn.localeCompare(b.nameEn)
  );
  return items.map(({ _order, ...rest }) => rest);
}

export const BASE_ITEMS = buildFullBaseItems();

export const MAGIC_RARE_GEMS = [
  { quality: "magic", slot: "盾牌", nameZh: "偏向统治者大盾 (JMOD)", nameEn: "Jeweler's Monarch of Deflecting", stats: "4 孔 · +30% FBR · +20% 提高格挡几率", value: "全游戏最昂贵蓝装之一，电标马/元素流镶 4 颗 5/5 电珠毕业盾" },
  { quality: "magic", slot: "盔甲", nameZh: "珠宝匠之巨鲸执政官铠甲", nameEn: "Jeweler's Archon Plate of the Whale", stats: "4 孔 · +81–100 生命", value: "物理弓马/PVP 镶 4 颗 40 ED / 15 IAS 红白猪核心战甲" },
  { quality: "magic", slot: "标枪", nameZh: "+6 标枪 / 40 IAS 标枪", nameEn: "Lancer's Matriarchal Javelin of Quickness", stats: "+6 标枪与长矛技能 · +40% 提高攻击速度", value: "纯电标马极限伤害毕业武器（底材自带 +3 再出 +3 前缀）" },
  { quality: "magic", slot: "头环", nameZh: "珠宝匠之巨鲸权冠 / 3技能 20FCR 头环", nameEn: "Jeweler's Diadem of the Whale / +3 Tree 20 FCR", stats: "珠宝匠之巨鲸：3 孔 · +100 生命 · 法系头环：+3 单系技能 · +20% FCR（拉祖克打 2 孔）", value: "电法/火法/弓马极限配装" },
  { quality: "magic", slot: "手套", nameZh: "+3 标枪 / 20 IAS 蓝手套", nameEn: "Lancer's Gloves of Alacrity", stats: "+3 标枪与长矛技能 · +20% IAS（安亚商店可刷）", value: "标马性价比最高毕业手套" },
  { quality: "magic", slot: "珠宝", nameZh: "红白猪 (40 ED / 15 IAS)", nameEn: "Ruby Jewel of Fervor", stats: "+31–40% 增强伤害 · +15% 提高攻击速度", value: "物理弓马/近战镶嵌 4 孔甲、3 孔头必备" },
  { quality: "magic", slot: "护身符", nameZh: "45 生命技能板 / 3/20/20 小符", nameEn: "Skiller +45 Life GC / 3 Max 20 AR 20 Life SC", stats: "技能板 (GC)：+1 单系技能 · +45 生命 · 小护身符 (SC)：+3 最大伤 · +20 命中 · +20 生命", value: "天梯与非赛硬通货" },
  { quality: "rare", slot: "头环", nameZh: "2/20/2孔 极品黄权冠", nameEn: "+2 Skills / 20 FCR / 2 Sockets + Stats", stats: "+2 本职业技能 · +20% FCR（或 30% FRW） · 2 孔 · +力量/生命/全抗", value: "超越军帽/格里芬的法系与物理顶级头盔" },
  { quality: "rare", slot: "戒指", nameZh: "6 词缀极品黄戒指", nameEn: "10 FCR / Dual Leech / Str / Dex / Life / Res", stats: "+10% FCR · 双吸 · +20 力量 · +15 敏捷 · +40 生命 · +90 法力 · 全抗/单抗", value: "凑 FCR 档位与属性抗性的核心" },
  { quality: "rare", slot: "鞋子", nameZh: "30/10 三抗鞋", nameEn: "30 FRW / 10 FHR / Tri-Res Boots", stats: "+30% FRW · +10% FHR · 火/冰/电三项高抗性（总抗性 90–120%）", value: "全法系与 PVP 毕业鞋" },
  { quality: "rare", slot: "武器", nameZh: "450 ED 愚人无形自修武器", nameEn: "Cruel + Fool's + 40 IAS + Ethereal + Self-Repair", stats: "+300% ED · 愚人词缀 · +40% IAS · 2 孔 · 无形 · 自动恢复耐久", value: "PVP 物理近战顶级神兵" }
];

export const MAGIC_RARE_GEMS_WITH_ICONS = MAGIC_RARE_GEMS.map((item) => ({
  ...item,
  icon: ITEM_ICON_MAP[item.nameEn] || null
}));

export const SET_ITEMS = ALL_SET_ITEMS.map((item) => {
  const rawDetail = SET_DETAILS[item.id] || null;
  const detail = rawDetail
    ? {
        ...rawDetail,
        pieces: (rawDetail.pieces || []).map((p) => ({
          ...p,
          icon: ITEM_ICON_MAP[p.nameEn] || null,
          i18n: ITEM_I18N_MAP[p.nameEn] || null,
          baseInfo: SET_PIECE_BASE_INFO[p.nameEn] || null
        }))
      }
    : null;
  const firstIcon = detail?.pieces?.find((p) => p.icon)?.icon || null;
  return {
    ...item,
    icon: firstIcon,
    i18n: ITEM_I18N_MAP[item.nameEn] || null,
    detail
  };
});
const BASE_RULE_BY_EN = new Map(
  Object.values(BASE_CODE_RULES).map((r) => [String(r.nameEn || "").toLowerCase(), r])
);

const UNIQUE_SLOT_SUB_FALLBACK = {
  armor: { subCategory: "armor", subCategoryZh: "盔甲" },
  gloves: { subCategory: "glov", subCategoryZh: "手套" },
  boots: { subCategory: "boot", subCategoryZh: "鞋子" },
  belt: { subCategory: "belt", subCategoryZh: "腰带" },
  ring: { subCategory: "ring", subCategoryZh: "戒指" },
  amulet: { subCategory: "amulet", subCategoryZh: "护身符" },
  charm: { subCategory: "charm", subCategoryZh: "暗金咒符" },
  jewel: { subCategory: "jewel", subCategoryZh: "暗金珠宝" }
};

export const UNIQUE_ITEMS = ALL_UNIQUE_ITEMS.map((item) => {
  const baseInfo = UNIQUE_BASE_INFO[item.nameEn] || null;
  const baseEn = baseInfo?.baseEnUS ? String(baseInfo.baseEnUS).toLowerCase() : "";
  const rule = baseEn ? BASE_RULE_BY_EN.get(baseEn) : null;
  const typeMeta = rule ? BASE_TYPE_META[rule.type] : null;
  const slotFb = UNIQUE_SLOT_SUB_FALLBACK[item.slot] || { subCategory: item.slot || "", subCategoryZh: "" };
  const tierInfo = rule ? BASE_UPGRADE_TIERS[rule.code] : null;
  const derivedTier = tierInfo ? (TIER_LABELS[tierInfo.tier] || item.tier || "") : (item.tier || "");
  const classOnly = rule?.classOnly || "";
  const classOnlyZh = CLASS_ONLY_LABELS[classOnly] || "";
  return {
    ...item,
    subCategory: typeMeta ? typeMeta.subCategory : slotFb.subCategory,
    subCategoryZh: typeMeta ? typeMeta.subCategoryZh : slotFb.subCategoryZh,
    classOnly,
    classOnlyZh,
    tierNorm: derivedTier || "独特",
    icon: ITEM_ICON_MAP[item.nameEn] || null,
    i18n: ITEM_I18N_MAP[item.nameEn] || null,
    baseInfo
  };
});

export const CUBE_RECIPES = [
  { title: "白色底材随机打孔", formula: "白色防具/武器 + 对应符文 + 完美宝石", detail: "盔甲: #7 塔尔 + #10 图尔 + 完美黄宝石 | 盾牌: #7 塔尔 + #11 安姆 + 完美红宝石 | 武器: #8 拉尔 + #11 安姆 + 完美紫宝石 | 头盔: #8 拉尔 + #10 图尔 + 完美蓝宝石 | 注意：超强/有ED或耐久加成的底材不能用方块打孔，需找 A5 拉祖克直接打满孔" },
  { title: "暗金装备升级（普通→扩展→精华）", formula: "暗金防具/武器 + 符文 + 完美宝石", detail: "防具升扩展: #7 塔尔 + #13 沙伊 + 完美钻石 | 防具升精华: #18 科 + #20 兰姆 + 完美钻石 | 武器升扩展: #8 拉尔 + #12 索尔 + 完美绿宝石 | 武器升精华: #17 卢姆 + #21 普尔 + 完美绿宝石（如升级海蛇皮甲、泰坦、蚀肉骑士）" },
  { title: "亮金装备升级（黄装升阶）", formula: "亮金防具/武器 + 符文 + 完美宝石", detail: "防具升扩展: #8 拉尔 + #10 图尔 + 完美紫宝石 | 防具升精华: #18 科 + #21 普尔 + 完美紫宝石 | 武器升扩展: #9 欧特 + #11 安姆 + 完美蓝宝石 | 武器升精华: #19 法尔 + #22 乌姆 + 完美蓝宝石" },
  { title: "重铸蓝色护身符 / 权冠", formula: "蓝色护身符(或任意权冠) + 3 颗完美宝石", detail: "洗 91+ 级巴尔/TZ 超大护身符 (GC) 出 45 生命技能板 | 用 6 颗完美骷髅重铸黄权冠（权冠 ilvl 虽降但 magic_lvl=18 仍能出 +2 技能）" },
  { title: "装备快速维修与充能", formula: "非无形武器/防具 + 符文 (+ 碎裂宝石)", detail: "武器回耐久: #9 欧特 | 武器回耐久+满充能: #9 欧特 + 任意碎裂宝石 | 防具回耐久: #8 拉尔 | 防具回耐久+满充能: #8 拉尔 + 任意裂开宝石" },
  { title: "破免护身符升级（潜能 Latent → 焕新 Renewed）", formula: "潜能破免板 + 对应完美宝石 + 对应符文 + 世界石碎片(Worldstone Shard)", detail: "破电(天堂之裂): 完美黄宝石 + #19 法尔 + 南部碎片 | 破火(火焰裂隙): 完美红宝石 + #16 艾欧 + 深层碎片 | 破冰(寒冰裂隙): 完美蓝宝石 + #17 卢姆 + 东部碎片 | 破毒(腐朽裂隙): 完美绿宝石 + #18 科 + 西部碎片 | 破物(裂骨): 完美紫宝石 + #21 普尔 + 北部碎片 | 破魔(黑裂): 完美钻石 + #23 玛尔 + 南/深/北三枚碎片（焕新版会随机新增元素/技能/降抗等强力词缀）" },
  { title: "巨像先祖红门开启（3.4 亚瑞特巨峰 Colossal Summit）", formula: "塔力克的痛苦 + 科里克的痛楚 + 马道克的愤怒 + 布尔凯索的噩梦 + 沃鲁斯克的终结", detail: "集齐 96 级恐怖地带五大首领（安达利尔、都瑞尔、墨菲斯托、迪亚波罗、巴尔）掉落的 5 尊远古雕像，在地狱难度第五幕哈洛加斯放入赫拉迪克方块即可开启 lv137 亚瑞特巨峰红门挑战超级巨像先祖" },
  { title: "巨像先祖暗金珠宝掉落规则（术士 DLC）", formula: "挑战巨像先祖(Colossal Ancients) — 最后击杀决定掉落池", detail: "限装备 1 颗，需求 75 级，共享 +3–5% 经验 / +15–35% MF / +25–50% EG | 最后击杀塔力克(Talic): 守御者之火(火伤)/之胆(毒伤) | 最后击杀科力克(Korlic): 护卫者之霜(冰伤)/之石(50% ED/-10%敌物抗) | 最后击杀马道克(Madawc): 守护者之雷(电伤)/之光(魔伤)" }
];

export function getItemsCatalog() {
  return {
    baseItems: BASE_ITEMS,
    magicRareGems: MAGIC_RARE_GEMS_WITH_ICONS,
    setItems: SET_ITEMS,
    uniqueItems: UNIQUE_ITEMS,
    cubeRecipes: CUBE_RECIPES,
    baseUpgradeTiers: BASE_UPGRADE_TIERS,
    uniqueUpgradeMeta: UNIQUE_UPGRADE_META,
    sunderCrafts34: SUNDER_CRAFTS_34,
    sunderCommonPools: SUNDER_COMMON_POOLS
  };
}
