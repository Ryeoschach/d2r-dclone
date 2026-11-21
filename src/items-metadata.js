// 物品资讯百科数据（基础底材 / 魔法与亮金极品 / 全部 32 套绿色套装 / 全阶梯暗金装备 / 常用方块公式）
// 参考 D2R 3.4 术士君临版本与 d2r.world 物品分类体系
import { ALL_BASE_ITEMS } from "./items-base-data.js";
import { ALL_SET_ITEMS, ALL_UNIQUE_ITEMS } from "./items-sets-uniques-data.js";
import { SET_DETAILS } from "./items-set-details.js";
import { ITEM_ICON_MAP } from "./items-icons-map.js";
import { BASE_OFFICIAL_STATS, ITEM_I18N_MAP, SET_PIECE_BASE_INFO, UNIQUE_BASE_INFO } from "./items-i18n-data.js";

export const BASE_ITEMS = ALL_BASE_ITEMS.map((item) => ({
  ...item,
  maxSockets: item.sockets[2],
  icon: ITEM_ICON_MAP[item.nameEn] || null,
  i18n: ITEM_I18N_MAP[item.nameEn] || null,
  officialStats: BASE_OFFICIAL_STATS[item.nameEn] || null
}));

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
export const UNIQUE_ITEMS = ALL_UNIQUE_ITEMS.map((item) => ({
  ...item,
  icon: ITEM_ICON_MAP[item.nameEn] || null,
  i18n: ITEM_I18N_MAP[item.nameEn] || null,
  baseInfo: UNIQUE_BASE_INFO[item.nameEn] || null
}));

export const CUBE_RECIPES = [
  { title: "白色底材随机打孔", formula: "白色防具/武器 + 对应符文 + 完美宝石", detail: "盔甲: #7 塔尔 + #10 图尔 + 完美黄宝石 | 盾牌: #7 塔尔 + #11 安姆 + 完美红宝石 | 武器: #8 拉尔 + #11 安姆 + 完美紫宝石 | 头盔: #8 拉尔 + #10 图尔 + 完美蓝宝石 | 注意：超强/有ED或耐久加成的底材不能用方块打孔，需找 A5 拉祖克直接打满孔" },
  { title: "暗金装备升级（普通→扩展→精华）", formula: "暗金防具/武器 + 符文 + 完美宝石", detail: "防具升扩展: #7 塔尔 + #13 沙伊 + 完美钻石 | 防具升精华: #18 科 + #20 兰姆 + 完美钻石 | 武器升扩展: #8 拉尔 + #12 索尔 + 完美绿宝石 | 武器升精华: #17 卢姆 + #21 普尔 + 完美绿宝石（如升级海蛇皮甲、泰坦、蚀肉骑士）" },
  { title: "亮金装备升级（黄装升阶）", formula: "亮金防具/武器 + 符文 + 完美宝石", detail: "防具升扩展: #8 拉尔 + #10 图尔 + 完美紫宝石 | 防具升精华: #18 科 + #21 普尔 + 完美紫宝石 | 武器升扩展: #9 欧特 + #11 安姆 + 完美蓝宝石 | 武器升精华: #19 法尔 + #22 乌姆 + 完美蓝宝石" },
  { title: "重铸蓝色护身符 / 权冠", formula: "蓝色护身符(或任意权冠) + 3 颗完美宝石", detail: "洗 91+ 级巴尔/TZ 超大护身符 (GC) 出 45 生命技能板 | 用 6 颗完美骷髅重铸黄权冠（权冠 ilvl 虽降但 magic_lvl=18 仍能出 +2 技能）" },
  { title: "装备快速维修与充能", formula: "非无形武器/防具 + 符文 (+ 碎裂宝石)", detail: "武器回耐久: #9 欧特 | 武器回耐久+满充能: #9 欧特 + 任意碎裂宝石 | 防具回耐久: #8 拉尔 | 防具回耐久+满充能: #8 拉尔 + 任意裂开宝石" },
  { title: "破免护身符升级（潜能 Latent → 焕新 Renewed）", formula: "潜能破免板 + 对应完美宝石 + 对应符文 + 世界石碎片(Worldstone Shard)", detail: "破电(天堂之裂): 完美黄宝石 + #19 法尔 + 南部碎片 | 破火(火焰裂隙): 完美红宝石 + #16 艾欧 + 深层碎片 | 破冰(寒冰裂隙): 完美蓝宝石 + #17 卢姆 + 东部碎片 | 破毒(腐朽裂隙): 完美绿宝石 + #18 科 + 西部碎片 | 破物(裂骨): 完美紫宝石 + #21 普尔 + 北部碎片 | 破魔(黑裂): 完美钻石 + #23 玛尔 + 南/深/北三枚碎片（焕新版会随机新增元素/技能/降抗等强力词缀）" },
  { title: "巨像先祖暗金珠宝掉落规则（术士 DLC）", formula: "挑战巨像先祖(Colossal Ancients) — 最后击杀决定掉落池", detail: "限装备 1 颗，需求 75 级，共享 +3–5% 经验 / +15–35% MF / +25–50% EG | 最后击杀塔力克(Talic): 守御者之火(火伤)/之胆(毒伤) | 最后击杀科力克(Korlic): 护卫者之霜(冰伤)/之石(50% ED/-10%敌物抗) | 最后击杀马道克(Madawc): 守护者之雷(电伤)/之光(魔伤)" }
];

export function getItemsCatalog() {
  return {
    baseItems: BASE_ITEMS,
    magicRareGems: MAGIC_RARE_GEMS_WITH_ICONS,
    setItems: SET_ITEMS,
    uniqueItems: UNIQUE_ITEMS,
    cubeRecipes: CUBE_RECIPES
  };
}
