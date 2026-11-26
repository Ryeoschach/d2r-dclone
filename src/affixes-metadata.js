// 魔法物品（蓝）/ 亮金物品（黄）/ 手工物品（橙）词缀生成规则、手工配方与各部位词缀极限范围（D2R 3.4）

export const QUALITY_RULES = [
  {
    id: "magic",
    name: "魔法物品（蓝装）",
    badge: "蓝装",
    icon: "/images/items/misc/gem/perfect_saphire.webp",
    affixLimit: "最多 1 前缀 + 1 后缀（共 1–2 条）",
    highlight: "单项属性上限最高，拥有大量「蓝装专属」极限词缀",
    examples: "4 孔 100 血甲、偏向盾 (JMOD)、+6 标枪/40 IAS 标枪、+3 单系/10 FCR 项链、3 孔/100 血头环、40 ED/15 IAS 珠宝、+1 技能/45 血 GC"
  },
  {
    id: "rare",
    name: "亮金物品（黄装）",
    badge: "黄装",
    icon: "/images/items/misc/gem/perfect_topaz.webp",
    affixLimit: "最多 3 前缀 + 3 后缀（共 3–6 条；亮金珠宝最多 4 条）",
    highlight: "综合属性最强，多条优秀词缀叠加可超越暗金/符文之语",
    examples: "2/20/30力/20全抗/2孔头环、10 FCR/20力/15敏/40血/90蓝/11全抗戒指、450 ED 愚人自修无形武器、30 FRW/10 FHR/三抗鞋"
  },
  {
    id: "crafted",
    name: "手工物品（橙装）",
    badge: "橙装",
    icon: "/images/items/misc/gem/perfect_amethyst.webp",
    affixLimit: "3–4 条固定配方属性 + 1–4 条随机亮金词缀（ilvl ≥ 71 必出 4 条随机）",
    highlight: "固定属性可与随机词缀叠加突破黄装上限（如项链 20% FCR、手套 10% CB）",
    examples: "2 技能/20% FCR 施法橙链、2/20 IAS/10 CB 吸血橙手、10 FCR/24 FHR 施法橙腰带、双吸高力吸血橙戒"
  }
];

export const CRAFT_RECIPES = [
  {
    series: "施法者 (Caster)",
    gem: "完美紫宝石",
    gemIcon: "/images/items/misc/gem/perfect_amethyst.webp",
    items: [
      { slot: "项链", base: "任意蓝色项链", rune: "#8 拉尔", fixed: "5–10% FCR · 4–10% 法力恢复 · +10–20 法力" },
      { slot: "腰带", base: "轻扣带 / 鲨鱼皮腰带 / 吸血鬼獠牙腰带", rune: "#6 伊司", fixed: "5–10% FCR · 4–10% 法力恢复 · +10–20 法力" },
      { slot: "戒指", base: "任意蓝色戒指", rune: "#11 安姆", fixed: "+1–5 精力 · 4–10% 法力恢复 · +10–20 法力" },
      { slot: "鞋子", base: "皮靴 / 魔皮靴 / 飞龙皮靴", rune: "#10 图尔", fixed: "法力上限提高 2–5% · 4–10% 法力恢复 · +10–20 法力" },
      { slot: "手套", base: "皮手套 / 魔皮手套 / 荆棘连指手套", rune: "#9 欧特", fixed: "+1–3 击杀恢复法力 · 4–10% 法力恢复 · +10–20 法力" }
    ]
  },
  {
    series: "吸血 (Blood)",
    gem: "完美红宝石",
    gemIcon: "/images/items/misc/gem/perfect_ruby.webp",
    items: [
      { slot: "手套", base: "重手套 / 鲨鱼皮手套 / 吸血鬼骸骨手套", rune: "#4 奈夫", fixed: "5–10% 压碎性打击 (CB) · 1–3% 生命偷取 · +10–20 生命" },
      { slot: "戒指", base: "任意蓝色戒指", rune: "#12 索尔", fixed: "+1–5 力量 · 1–3% 生命偷取 · +10–20 生命" },
      { slot: "腰带", base: "扣带 / 织网腰带 / 秘银腰带", rune: "#7 塔尔", fixed: "5–10% 撕裂伤口 (OW) · 1–3% 生命偷取 · +10–20 生命" },
      { slot: "项链", base: "任意蓝色项链", rune: "#11 安姆", fixed: "5–10% 更快速跑步/步行 · 1–4% 生命偷取 · +10–20 生命" },
      { slot: "头盔", base: "头盔 / 轻钢盔 / 活动头盔", rune: "#8 拉尔", fixed: "5–10% 双倍打击 (DS) · 1–3% 生命偷取 · +10–20 生命" },
      { slot: "鞋子", base: "轻型金属靴 / 战场之靴 / 镜化靴", rune: "#5 艾斯", fixed: "生命恢复 +5–10 · 1–3% 生命偷取 · +10–20 生命" }
    ]
  },
  {
    series: "击打 (Hit Power)",
    gem: "完美蓝宝石",
    gemIcon: "/images/items/misc/gem/perfect_saphire.webp",
    items: [
      { slot: "手套", base: "锁链手套 / 重型手镯 / 吸血鬼手套", rune: "#9 欧特", fixed: "击退 · 被击中 5% 施放 4 级霜之新星 · 攻击者受伤害 3–7" }
    ]
  },
  {
    series: "安全 (Safety)",
    gem: "完美绿宝石",
    gemIcon: "/images/items/misc/gem/perfect_emerald.webp",
    items: [
      { slot: "项链", base: "任意蓝色项链", rune: "#10 图尔", fixed: "+1–10% 提高格挡几率 · 伤害减少 1–4 · 魔法伤害减少 1–2" },
      { slot: "鞋子", base: "护胫 / 巨战之靴 / 急速靴", rune: "#9 欧特", fixed: "火焰抗性 +5–10% · 伤害减少 1–4 · 魔法伤害减少 1–2" }
    ]
  }
];

export const AFFIX_SLOTS = [
  { id: "amulet", label: "护身符(项链)", icon: "/images/items/misc/amulet/amulet.webp" },
  { id: "ring", label: "戒指", icon: "/images/items/misc/ring/ring.webp" },
  { id: "circlet", label: "头环/权冠", icon: "/images/items/armor/circlet/diadem.webp" },
  { id: "gloves", label: "手套", icon: "/images/items/armor/glove/heavy_gloves.webp" },
  { id: "boots", label: "鞋子", icon: "/images/items/armor/boot/chain_boots.webp" },
  { id: "belt", label: "腰带", icon: "/images/items/armor/belt/light_belt.webp" },
  { id: "weapon", label: "武器", icon: "/images/items/weapon/axe/war_axe.webp" },
  { id: "armor_shield", label: "盔甲/盾牌", icon: "/images/items/armor/shield/kite_shield.webp" },
  { id: "charm_sc", label: "小型咒符(SC)", icon: "/images/items/misc/charm/charm_small.webp" },
  { id: "charm_lc", label: "大型咒符(LC)", icon: "/images/items/misc/charm/charm_medium.webp" },
  { id: "charm_gc", label: "巨型咒符(GC)", icon: "/images/items/misc/charm/charm_large.webp" },
  { id: "jewel", label: "珠宝", icon: "/images/items/misc/gem/perfect_diamond1.webp" }
];

// quality: "all" (蓝/黄/橙通用) | "rare" (黄/橙极限) | "magic" (仅蓝装专属/蓝装极限) | "crafted" (手工橙装固定属性)
// type: "prefix" (前缀) | "suffix" (后缀) | "crafted" (手工固定)
export const AFFIX_RANGES = [
  // 📿 项链
  { slot: "amulet", type: "crafted", quality: "crafted", nameZh: "施法者项链（#8 拉尔 + 完美紫）", nameEn: "Caster Amulet (#8 Ral + Perfect Amethyst)", range: "+5–10% FCR · +10–20 法力 · 4–10% 法力恢复", alvl: 1, note: "与随机后缀 10% FCR 叠加，最高可达 20% FCR（即 2/20 极品橙链的来源）" },
  { slot: "amulet", type: "crafted", quality: "crafted", nameZh: "吸血项链（#11 安姆 + 完美红）", nameEn: "Blood Amulet (#11 Amn + Perfect Ruby)", range: "+5–10% FRW · 1–4% 生命偷取 · +10–20 生命", alvl: 1, note: "可额外随机出 4 条黄装词缀，适合高跑双吸物理项链" },
  { slot: "amulet", type: "crafted", quality: "crafted", nameZh: "安全项链（#10 图尔 + 完美绿）", nameEn: "Safety Amulet (#10 Thul + Perfect Emerald)", range: "+1–10% 格挡率 · 伤害减少 1–4 · 魔伤减少 1–2", alvl: 1, note: "圣盾/格挡流派专用" },
  { slot: "amulet", type: "prefix", quality: "all", nameZh: "全职业技能", nameEn: "of Class Skills", range: "+2 本职业全部技能", alvl: 90, note: "洗施法橙链需 ≥93 级人物赌博或恐怖地带底材确保 ilvl≥90" },
  { slot: "amulet", type: "prefix", quality: "magic", nameZh: "单系技能（蓝专属）", nameEn: "Skill Tree", range: "+3 单系技能树", alvl: 60, note: "如 +3 闪电/冰冷/火焰/战斗/陷阱/毒骨，黄/橙装最高仅 +2" },
  { slot: "amulet", type: "suffix", quality: "all", nameZh: "更快速施法", nameEn: "of the Apprentice", range: "+10% FCR", alvl: 5, note: "单条词缀最高 10% FCR；只有「施法者橙链」才能与固定 5–10% FCR 叠加至 20% FCR" },
  { slot: "amulet", type: "prefix", quality: "all", nameZh: "全抗（棱镜）", nameEn: "Prismatic", range: "+16–20% 所有抗性", alvl: 42, note: "蓝装还可出 Chromatic（+21–30% 全抗，alvl 55 蓝专属）" },
  { slot: "amulet", type: "prefix", quality: "all", nameZh: "火焰抗性（红宝石）", nameEn: "Ruby", range: "+31–40% 火焰抗性", alvl: 25, note: "黄/橙装可与全抗前缀共存（最多 3 前缀）" },
  { slot: "amulet", type: "prefix", quality: "all", nameZh: "冰冷抗性（蓝宝石）", nameEn: "Sapphire", range: "+31–40% 冰冷抗性", alvl: 25, note: "黄/橙装可与全抗前缀共存" },
  { slot: "amulet", type: "prefix", quality: "all", nameZh: "闪电抗性（琥珀）", nameEn: "Amber", range: "+31–40% 闪电抗性", alvl: 25, note: "黄/橙装可与全抗前缀共存" },
  { slot: "amulet", type: "prefix", quality: "all", nameZh: "毒素抗性（翡翠）", nameEn: "Emerald", range: "+31–40% 毒素抗性", alvl: 25, note: "黄/橙装可与全抗前缀共存" },
  { slot: "amulet", type: "suffix", quality: "all", nameZh: "力量（阿特拉斯）", nameEn: "of the Atlas", range: "+21–30 力量", alvl: 71, note: "蓝/黄/橙均可出到 30 力量" },
  { slot: "amulet", type: "suffix", quality: "all", nameZh: "敏捷（完美）", nameEn: "of Perfection", range: "+16–20 敏捷", alvl: 59, note: "" },
  { slot: "amulet", type: "suffix", quality: "all", nameZh: "精力（巫师）", nameEn: "of the Magi", range: "+16–20 精力", alvl: 31, note: "ES 顶球法师高法力池实用属性" },
  { slot: "amulet", type: "suffix", quality: "magic", nameZh: "生命（巨鲸·蓝极限）", nameEn: "of the Whale", range: "+81–100 生命", alvl: 50, note: "蓝装专属上限；黄/橙装生命后缀最高 +41–60（巨像 of the Colossus）" },
  { slot: "amulet", type: "suffix", quality: "rare", nameZh: "生命（巨像·黄/橙极限）", nameEn: "of the Colossus", range: "+41–60 生命", alvl: 30, note: "黄/橙项链单条生命最高 60（吸血橙链叠加固定 +20 可达 80 生命）" },
  { slot: "amulet", type: "prefix", quality: "magic", nameZh: "法力（巴哈姆特·蓝极限）", nameEn: "Bahamut's", range: "+91–120 法力", alvl: 45, note: "黄/橙装最高为 Great Wyrm's (+61–90 法力，alvl 37)" },
  { slot: "amulet", type: "prefix", quality: "rare", nameZh: "法力（巨龙·黄/橙极限）", nameEn: "Great Wyrm's", range: "+61–90 法力", alvl: 37, note: "施法橙链叠加固定 +20 法力最高可达 110 法力" },
  { slot: "amulet", type: "suffix", quality: "all", nameZh: "生命恢复", nameEn: "of Regeneration", range: "+6–10 生命恢复", alvl: 41, note: "" },
  { slot: "amulet", type: "suffix", quality: "all", nameZh: "生命偷取（水蛭）", nameEn: "of the Lamprey", range: "+5–6% 击中偷取生命 (LL)", alvl: 78, note: "物理项链吸血核心后缀" },
  { slot: "amulet", type: "suffix", quality: "all", nameZh: "法力偷取（怨灵）", nameEn: "of the Wraith", range: "+7–8% 击中偷取法力 (ML)", alvl: 78, note: "物理项链吸蓝核心后缀，可与生命偷取共存组成双吸链" },
  { slot: "amulet", type: "suffix", quality: "all", nameZh: "毒素持续时间缩短", nameEn: "of Amelioration", range: "毒素持续时间缩短 75%", alvl: 18, note: "顶球 ES 法师极品防毒后缀" },
  { slot: "amulet", type: "suffix", quality: "all", nameZh: "寻宝率 MF", nameEn: "of Luck", range: "+26–35% MF", alvl: 26, note: "蓝装叠加前缀 Fortuitous (+11–15%) 最高可达 50% MF" },
  { slot: "amulet", type: "suffix", quality: "all", nameZh: "额外金币 EG", nameEn: "of Greed", range: "+41–80% EG", alvl: 1, note: "打钱野蛮人 2/80 EG 项链" },
  { slot: "amulet", type: "suffix", quality: "all", nameZh: "传送聚气", nameEn: "of Teleportation", range: "2 级传送（25 次充能）", alvl: 48, note: "开荒期无需谜团即可飞图" },

  // 💍 戒指
  { slot: "ring", type: "crafted", quality: "crafted", nameZh: "吸血戒指（#12 索尔 + 完美红）", nameEn: "Blood Ring (#12 Sol + Perfect Ruby)", range: "+1–5 力量 · 1–3% 生命偷取 · +10–20 生命", alvl: 1, note: "可与随机 20 力 / 8 LL / 40 血叠加，极限达 25 力 / 11 LL / 60 血" },
  { slot: "ring", type: "crafted", quality: "crafted", nameZh: "施法者戒指（#11 安姆 + 完美紫）", nameEn: "Caster Ring (#11 Amn + Perfect Amethyst)", range: "+1–5 精力 · +10–20 法力 · 4–10% 法力恢复", alvl: 1, note: "可与随机 10 FCR / 90 法力叠加，顶球 ES 法师高蓝量选择" },
  { slot: "ring", type: "suffix", quality: "all", nameZh: "更快速施法", nameEn: "of the Apprentice", range: "+10% FCR", alvl: 5, note: "所有品质戒指均最高 10% FCR" },
  { slot: "ring", type: "suffix", quality: "all", nameZh: "力量（泰坦）", nameEn: "of the Titan", range: "+16–20 力量", alvl: 74, note: "吸血橙戒可叠加固定 +1–5 力量，最高达 25 力量" },
  { slot: "ring", type: "suffix", quality: "all", nameZh: "敏捷（精准）", nameEn: "of Precision", range: "+10–15 敏捷", alvl: 56, note: "戒指敏捷上限低于项链与头环" },
  { slot: "ring", type: "suffix", quality: "all", nameZh: "精力（巫师）", nameEn: "of Sorcery", range: "+11–15 精力", alvl: 31, note: "" },
  { slot: "ring", type: "suffix", quality: "all", nameZh: "生命（巨像）", nameEn: "of the Colossus", range: "+31–40 生命", alvl: 68, note: "吸血橙戒可叠加固定 +10–20 生命，最高达 60 生命" },
  { slot: "ring", type: "prefix", quality: "rare", nameZh: "法力（巨龙·黄/橙极限）", nameEn: "Great Wyrm's", range: "+61–90 法力", alvl: 37, note: "蓝戒指最高可达 Bahamut's +91–120 法力 (alvl 45)" },
  { slot: "ring", type: "prefix", quality: "all", nameZh: "全抗（微光）", nameEn: "Scintillating", range: "+8–11% 所有抗性", alvl: 56, note: "蓝戒指最高可达 Shimmering +12–15% 全抗 (alvl 45)" },
  { slot: "ring", type: "prefix", quality: "all", nameZh: "火焰抗性（石榴）", nameEn: "Garnet", range: "+21–30% 火焰抗性", alvl: 18, note: "双抗/三抗戒指核心前缀" },
  { slot: "ring", type: "prefix", quality: "all", nameZh: "冰冷抗性（钴蓝）", nameEn: "Cobalt", range: "+21–30% 冰冷抗性", alvl: 18, note: "双抗/三抗戒指核心前缀" },
  { slot: "ring", type: "prefix", quality: "all", nameZh: "闪电抗性（珊瑚）", nameEn: "Coral", range: "+21–30% 闪电抗性", alvl: 18, note: "双抗/三抗戒指核心前缀" },
  { slot: "ring", type: "prefix", quality: "all", nameZh: "毒素抗性（碧玉）", nameEn: "Jade", range: "+21–30% 毒素抗性", alvl: 18, note: "双抗/三抗戒指核心前缀" },
  { slot: "ring", type: "suffix", quality: "rare", nameZh: "生命偷取", nameEn: "of the Vampire", range: "+7–8% LL", alvl: 77, note: "蓝装最高 9% LL；吸血橙戒叠加固定 1–3% LL 最高可达 11% LL" },
  { slot: "ring", type: "suffix", quality: "all", nameZh: "法力偷取", nameEn: "of the Wraith", range: "+5–6% ML", alvl: 86, note: "双吸戒指高价值词缀" },
  { slot: "ring", type: "prefix", quality: "all", nameZh: "命中率 AR", nameEn: "Platinum", range: "+101–120 命中率", alvl: 22, note: "" },
  { slot: "ring", type: "suffix", quality: "all", nameZh: "最小伤害（表现之）", nameEn: "of Performance", range: "+6–9 最小伤害", alvl: 51, note: "物理戒指极品最小伤增伤词缀" },
  { slot: "ring", type: "suffix", quality: "all", nameZh: "最大伤害（毁伤之）", nameEn: "of Maiming", range: "+3–4 最大伤害", alvl: 42, note: "物理戒指最大伤增伤词缀" },
  { slot: "ring", type: "suffix", quality: "all", nameZh: "生命恢复", nameEn: "of Replenish", range: "+6–9 生命恢复", alvl: 41, note: "PVP 常用高回血词缀" },
  { slot: "ring", type: "suffix", quality: "all", nameZh: "寻宝率 MF", nameEn: "of Fortune", range: "+16–25% MF", alvl: 42, note: "蓝戒指叠加前缀 Fortuitous (+11–15%) 最高可达 40% MF" },

  // 👑 头环 / 宝冠 / 权冠
  { slot: "circlet", type: "prefix", quality: "all", nameZh: "全职业技能", nameEn: "of Class Skills", range: "+2 本职业全部技能", alvl: 90, note: "权冠自带 qlvl 85 + magic_lvl 18，8 级以上角色洗/重铸必能出 +2 技能" },
  { slot: "circlet", type: "prefix", quality: "magic", nameZh: "单系技能（蓝专属）", nameEn: "Skill Tree", range: "+3 单系技能树", alvl: 60, note: "可搭配 20% FCR 或 30% FRW 并打 2 孔" },
  { slot: "circlet", type: "suffix", quality: "all", nameZh: "更快速施法", nameEn: "of the Magus", range: "+20% FCR", alvl: 29, note: "法系 2/20 头环核心" },
  { slot: "circlet", type: "suffix", quality: "all", nameZh: "更快速跑步", nameEn: "of Speed", range: "+30% FRW", alvl: 37, note: "物理/PVP 2/30/20 头环核心" },
  { slot: "circlet", type: "prefix", quality: "magic", nameZh: "珠宝匠 3 孔（蓝专属）", nameEn: "Jeweler's / Artisan's", range: "3 孔", alvl: 55, note: "仅限三重冠 (Tiara) 与权冠 (Diadem)；黄头环最多 2 孔" },
  { slot: "circlet", type: "prefix", quality: "all", nameZh: "技工 2 孔", nameEn: "Mechanic's", range: "1–2 孔", alvl: 10, note: "黄头环 2 孔极品必备前缀" },
  { slot: "circlet", type: "suffix", quality: "all", nameZh: "力量（阿特拉斯）", nameEn: "of the Atlas", range: "+21–30 力量", alvl: 71, note: "" },
  { slot: "circlet", type: "suffix", quality: "all", nameZh: "敏捷（完美）", nameEn: "of Perfection", range: "+16–20 敏捷", alvl: 59, note: "" },
  { slot: "circlet", type: "suffix", quality: "magic", nameZh: "生命（巨鲸·蓝极限）", nameEn: "of the Whale", range: "+81–100 生命", alvl: 50, note: "3 孔 100 血蓝权冠；黄头环生命后缀最高 +41–60" },
  { slot: "circlet", type: "suffix", quality: "rare", nameZh: "生命（巨像·黄装极限）", nameEn: "of the Colossus", range: "+41–60 生命", alvl: 30, note: "" },
  { slot: "circlet", type: "prefix", quality: "all", nameZh: "全抗（棱镜）", nameEn: "Prismatic", range: "+16–20% 所有抗性", alvl: 42, note: "蓝头环最高 Chromatic +21–30% 全抗" },
  { slot: "circlet", type: "prefix", quality: "all", nameZh: "火焰抗性（红宝石）", nameEn: "Ruby", range: "+31–40% 火焰抗性", alvl: 25, note: "" },
  { slot: "circlet", type: "prefix", quality: "all", nameZh: "冰冷抗性（蓝宝石）", nameEn: "Sapphire", range: "+31–40% 冰冷抗性", alvl: 25, note: "" },
  { slot: "circlet", type: "prefix", quality: "all", nameZh: "闪电抗性（琥珀）", nameEn: "Amber", range: "+31–40% 闪电抗性", alvl: 25, note: "" },
  { slot: "circlet", type: "prefix", quality: "all", nameZh: "毒素抗性（翡翠）", nameEn: "Emerald", range: "+31–40% 毒素抗性", alvl: 25, note: "" },
  { slot: "circlet", type: "prefix", quality: "all", nameZh: "强力视觉 (Visionary)", nameEn: "Visionary", range: "+(1% * 等级) 加成命中率", alvl: 25, note: "PVP 物理头环核心前缀" },
  { slot: "circlet", type: "suffix", quality: "all", nameZh: "生命偷取（水蛭）", nameEn: "of the Lamprey", range: "+6–8% 击中偷取生命 (LL)", alvl: 78, note: "" },
  { slot: "circlet", type: "suffix", quality: "all", nameZh: "法力偷取（怨灵）", nameEn: "of the Wraith", range: "+6–8% 击中偷取法力 (ML)", alvl: 78, note: "" },

  // 🧤 手套
  { slot: "gloves", type: "crafted", quality: "crafted", nameZh: "吸血手套（#4 奈夫 + 完美红）", nameEn: "Blood Gloves (#4 Nef + Perfect Ruby)", range: "5–10% 压碎性打击 (CB) · 1–3% LL · +10–20 生命", alvl: 1, note: "与随机 2 技能 / 20 IAS 叠加，即为极品 2/20/10CB 吸血橙手" },
  { slot: "gloves", type: "crafted", quality: "crafted", nameZh: "击打手套（#9 欧特 + 完美蓝）", nameEn: "Hit Power Gloves (#9 Ort + Perfect Sapphire)", range: "击退 · 被击中 5% 霜之新星 · 反伤 3–7", alvl: 1, note: "弓马 PVP/PVE 极品 2/20 击退手套核心" },
  { slot: "gloves", type: "suffix", quality: "all", nameZh: "提高攻击速度", nameEn: "of Alacrity", range: "+20% IAS", alvl: 43, note: "物理/标马/武学刺客手套必备" },
  { slot: "gloves", type: "prefix", quality: "magic", nameZh: "单系技能（蓝专属）", nameEn: "Lancer's / Archer's / Martial", range: "+3 标枪 / 弓 / 被动 / 武学", alvl: 60, note: "+3 标枪 / 20 IAS 蓝手套为亚马逊毕业手套之一" },
  { slot: "gloves", type: "prefix", quality: "rare", nameZh: "单系技能（黄/橙极限）", nameEn: "Spearmaiden's / Fletcher's", range: "+2 标枪 / 弓 / 被动 / 武学", alvl: 40, note: "黄/橙手套最高 +2 技能" },
  { slot: "gloves", type: "suffix", quality: "all", nameZh: "力量（巨人）", nameEn: "of the Giant", range: "+10–15 力量", alvl: 59, note: "" },
  { slot: "gloves", type: "suffix", quality: "all", nameZh: "敏捷（精准）", nameEn: "of Precision", range: "+10–15 敏捷", alvl: 56, note: "" },
  { slot: "gloves", type: "suffix", quality: "all", nameZh: "生命偷取（水蛭）", nameEn: "of the Leech", range: "+1–3% 击中偷取生命 (LL)", alvl: 34, note: "吸血橙手可再与固定 1–3% LL 叠加至 6% LL" },
  { slot: "gloves", type: "suffix", quality: "all", nameZh: "法力偷取（蝙蝠）", nameEn: "of the Bat", range: "+1–3% 击中偷取法力 (ML)", alvl: 34, note: "可与生命偷取共存组成双吸手套" },
  { slot: "gloves", type: "prefix", quality: "all", nameZh: "火焰抗性（石榴）", nameEn: "Garnet", range: "+21–30% 火焰抗性", alvl: 18, note: "" },
  { slot: "gloves", type: "prefix", quality: "all", nameZh: "冰冷抗性（钴蓝）", nameEn: "Cobalt", range: "+21–30% 冰冷抗性", alvl: 18, note: "" },
  { slot: "gloves", type: "prefix", quality: "all", nameZh: "闪电抗性（珊瑚）", nameEn: "Coral", range: "+21–30% 闪电抗性", alvl: 18, note: "" },
  { slot: "gloves", type: "prefix", quality: "all", nameZh: "毒素抗性（碧玉）", nameEn: "Jade", range: "+21–30% 毒素抗性", alvl: 18, note: "" },
  { slot: "gloves", type: "suffix", quality: "all", nameZh: "寻宝率 MF", nameEn: "of Fortune", range: "+16–25% MF", alvl: 16, note: "" },

  // 🥾 鞋子
  { slot: "boots", type: "crafted", quality: "crafted", nameZh: "施法者鞋子（#10 图尔 + 完美紫）", nameEn: "Caster Boots (#10 Thul + Perfect Amethyst)", range: "法力上限 +2–5% · +10–20 法力 · 4–10% 法力恢复", alvl: 1, note: "ES 顶球法师可再配三抗 + 30 FRW + 10 FHR" },
  { slot: "boots", type: "suffix", quality: "all", nameZh: "更快速跑步/步行", nameEn: "of Speed", range: "+30% FRW", alvl: 37, note: "" },
  { slot: "boots", type: "suffix", quality: "all", nameZh: "更快速打击回复", nameEn: "of Balance", range: "+10% FHR", alvl: 5, note: "" },
  { slot: "boots", type: "prefix", quality: "all", nameZh: "火焰抗性（红宝石）", nameEn: "Ruby", range: "+31–40% 火焰抗性", alvl: 25, note: "三抗鞋理论极限为火/冰/电各 +40%（总抗性 120%）" },
  { slot: "boots", type: "prefix", quality: "all", nameZh: "冰冷抗性（蓝宝石）", nameEn: "Sapphire", range: "+31–40% 冰冷抗性", alvl: 25, note: "三抗鞋核心抗性前缀" },
  { slot: "boots", type: "prefix", quality: "all", nameZh: "闪电抗性（琥珀）", nameEn: "Amber", range: "+31–40% 闪电抗性", alvl: 25, note: "三抗鞋核心抗性前缀" },
  { slot: "boots", type: "prefix", quality: "all", nameZh: "毒素抗性（翡翠）", nameEn: "Emerald", range: "+31–40% 毒素抗性", alvl: 25, note: "" },
  { slot: "boots", type: "suffix", quality: "all", nameZh: "敏捷", nameEn: "of Dexterity", range: "+6–9 敏捷", alvl: 46, note: "" },
  { slot: "boots", type: "prefix", quality: "all", nameZh: "法力", nameEn: "Dragon's", range: "+31–40 法力", alvl: 24, note: "" },
  { slot: "boots", type: "suffix", quality: "all", nameZh: "寻宝率 MF", nameEn: "of Fortune", range: "+16–25% MF", alvl: 16, note: "蓝鞋叠加前缀最高 35% MF" },
  { slot: "boots", type: "suffix", quality: "all", nameZh: "额外金币 EG", nameEn: "of Wealth", range: "+41–80% EG", alvl: 17, note: "打钱野蛮人极品三抗打钱鞋核心" },

  // 🥋 腰带
  { slot: "belt", type: "crafted", quality: "crafted", nameZh: "施法者腰带（#6 伊司 + 完美紫）", nameEn: "Caster Belt (#6 Ith + Perfect Amethyst)", range: "+5–10% FCR · +10–20 法力 · 4–10% 法力恢复", alvl: 1, note: "叠加随机 24 FHR / 30 力 / 60 血，法系凑 FCR 档位神器" },
  { slot: "belt", type: "crafted", quality: "crafted", nameZh: "吸血腰带（#7 塔尔 + 完美红）", nameEn: "Blood Belt (#7 Tal + Perfect Ruby)", range: "5–10% 撕裂伤口 (OW) · 1–3% LL · +10–20 生命", alvl: 1, note: "近战/PVP 24 FHR + 30 力 + 80 血 + OW" },
  { slot: "belt", type: "suffix", quality: "all", nameZh: "更快速打击回复", nameEn: "of Stability", range: "+24% FHR", alvl: 18, note: "" },
  { slot: "belt", type: "suffix", quality: "all", nameZh: "力量（阿特拉斯）", nameEn: "of the Atlas", range: "+21–30 力量", alvl: 71, note: "" },
  { slot: "belt", type: "suffix", quality: "rare", nameZh: "生命（巨像·黄/橙极限）", nameEn: "of the Colossus", range: "+41–60 生命", alvl: 30, note: "蓝腰带最高 +81–100 生命" },
  { slot: "belt", type: "prefix", quality: "all", nameZh: "火焰抗性（石榴）", nameEn: "Garnet", range: "+21–30% 火焰抗性", alvl: 18, note: "" },
  { slot: "belt", type: "prefix", quality: "all", nameZh: "冰冷抗性（钴蓝）", nameEn: "Cobalt", range: "+21–30% 冰冷抗性", alvl: 18, note: "" },
  { slot: "belt", type: "prefix", quality: "all", nameZh: "闪电抗性（珊瑚）", nameEn: "Coral", range: "+21–30% 闪电抗性", alvl: 18, note: "" },
  { slot: "belt", type: "prefix", quality: "all", nameZh: "毒素抗性（碧玉）", nameEn: "Jade", range: "+21–30% 毒素抗性", alvl: 18, note: "" },
  { slot: "belt", type: "suffix", quality: "all", nameZh: "额外金币 EG", nameEn: "of Wealth", range: "+41–80% EG", alvl: 17, note: "" },

  // ⚔️ 武器
  { slot: "weapon", type: "prefix", quality: "all", nameZh: "残忍强化伤害", nameEn: "Cruel", range: "+201–300% ED", alvl: 51, note: "黄武器可与 Master's (+101–150% ED / +151–250 AR) 叠加至最高 +450% ED" },
  { slot: "weapon", type: "prefix", quality: "all", nameZh: "大师强化伤害", nameEn: "Master's", range: "+101–150% ED · +151–250 AR", alvl: 56, note: "与 Cruel 并存时黄武器总 ED 可达 450%" },
  { slot: "weapon", type: "prefix", quality: "all", nameZh: "愚人（等级加伤与命中）", nameEn: "Fool's", range: "+(0.5 * 等级) Max · +(16.5 * 等级) AR", alvl: 50, note: "可与 Cruel (+300% ED) 并存，PVP 极品无形自修黄武器核心" },
  { slot: "weapon", type: "suffix", quality: "all", nameZh: "提高攻击速度", nameEn: "of Quickness", range: "+40% IAS", alvl: 46, note: "" },
  { slot: "weapon", type: "suffix", quality: "all", nameZh: "自动恢复耐久", nameEn: "of Self-Repair", range: "每 20/33 秒恢复 1 点耐久", alvl: 3, note: "使无形 (Ethereal) 极品黄武器获得无限耐久与 1.5 倍基础伤害" },
  { slot: "weapon", type: "prefix", quality: "all", nameZh: "技工 2 孔", nameEn: "Mechanic's", range: "1–2 孔", alvl: 10, note: "黄武器 2 孔毕业前缀；蓝武器最高 Jeweler's 4 孔" },
  { slot: "weapon", type: "prefix", quality: "magic", nameZh: "单系技能（蓝专属）", nameEn: "Lancer's / Cunning / Echoing", range: "+3 单系技能", alvl: 60, note: "若底材自带 +3 单系（如标枪/刺客爪），蓝色最高 +6 标枪 / +6 闪电陷阱 / +3 战嚎" },
  { slot: "weapon", type: "prefix", quality: "all", nameZh: "全职业技能", nameEn: "of Class Skills", range: "+2 本职业全部技能", alvl: 50, note: "法珠/权杖/手杖/刺客爪等" },
  { slot: "weapon", type: "suffix", quality: "all", nameZh: "更快速施法", nameEn: "of the Magus", range: "+20% FCR", alvl: 29, note: "法杖/权杖/法珠等法系武器" },

  // 🛡️ 盔甲 / 盾牌
  { slot: "armor_shield", type: "prefix", quality: "magic", nameZh: "珠宝匠 4 孔（蓝专属）", nameEn: "Jeweler's", range: "4 孔", alvl: 55, note: "仅限 4 孔轻甲（执政官/灰暮）或 4 孔盾（统治者大盾），黄装最多 2 孔" },
  { slot: "armor_shield", type: "suffix", quality: "magic", nameZh: "巨鲸生命（蓝极限）", nameEn: "of the Whale", range: "+81–100 生命", alvl: 50, note: "4 孔 100 血蓝甲核心；黄甲/黄盾最高 +41–60 生命" },
  { slot: "armor_shield", type: "suffix", quality: "all", nameZh: "偏向（盾牌 30/20）", nameEn: "of Deflecting", range: "+30% FBR · +20% 提高格挡几率", alvl: 11, note: "搭配 4 孔蓝统盾即为 JMOD（偏向盾）" },
  { slot: "armor_shield", type: "suffix", quality: "all", nameZh: "稳定之（盔甲 FHR）", nameEn: "of Stability", range: "+24% 快速打击恢复 (FHR，限盔甲)", alvl: 18, note: "盔甲 FHR 最高后缀" },
  { slot: "armor_shield", type: "suffix", quality: "all", nameZh: "平衡之（盾牌 FHR）", nameEn: "of Equilibrium", range: "+17% 快速打击恢复 (FHR，限盾牌)", alvl: 9, note: "盾牌 FHR 最高后缀" },
  { slot: "armor_shield", type: "prefix", quality: "magic", nameZh: "彩色全抗（蓝盾专属）", nameEn: "Chromatic", range: "+21–30% 所有抗性", alvl: 55, note: "黄盾牌全抗最高 Prismatic (+16–20%)" },
  { slot: "armor_shield", type: "crafted", quality: "crafted", nameZh: "安全盾牌（#5 艾斯 + 完美绿）", nameEn: "Safety Shield (#5 Eth + Perfect Emerald)", range: "+5–10% 提高格挡几率 · 魔伤减少 1–2 · +10–30% 强化防御", alvl: 1, note: "" },

  // 🧿 小型咒符 (Small Charm, SC · qlvl 28 · 仅限魔法蓝装 1前缀+1后缀)
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "钢铁 (命中值 AR)", nameEn: "Steel (Small Charm)", range: "+25–36 命中值 (AR)", alvl: 57, note: "需求等级 49；搭配 5% FHR 后缀即为 36 AR / 5% FHR 小符，或搭配 20 生命" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "黑铁 (命中值 AR)", nameEn: "Iron (Small Charm)", range: "+13–24 命中值 (AR)", alvl: 39, note: "需求等级 31" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "青铜 (命中值 AR)", nameEn: "Bronze (Small Charm)", range: "+2–12 命中值 (AR)", alvl: 1, note: "需求等级 1–15" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "优良 (最大伤 + 命中)", nameEn: "Fine (Small Charm)", range: "+1–3 最大伤害 · +10–20 命中值 (AR)", alvl: 28, note: "需求等级 21；搭配 20 生命后缀即为物理毕业 3/20/20 小符" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "丹红 (+1 最小伤)", nameEn: "Red (Small Charm)", range: "+1 最小伤害", alvl: 90, note: "需求等级 82" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "参差 (+1 最大伤)", nameEn: "Jagged (Small Charm)", range: "+1 最大伤害", alvl: 81, note: "需求等级 73" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "巨蛇的 (17 法力)", nameEn: "Serpent's (Small Charm)", range: "+13–17 法力", alvl: 48, note: "需求等级 40；搭配 20 生命即为法系极品 20/17 蛇骨小符" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "毒蛇的 (法力)", nameEn: "Snake's (Small Charm)", range: "+8–12 法力", alvl: 32, note: "需求等级 24" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "蜥蜴 (法力)", nameEn: "Lizard's (Small Charm)", range: "+1–7 法力", alvl: 16, note: "需求等级 12" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "光彩 (5% 全抗)", nameEn: "Shimmering (Small Charm)", range: "+3–5% 所有抗性", alvl: 33, note: "需求等级 25；5 全抗 / 20 生命或 5 全抗 / 5 FHR 为全职业毕业小符" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "红宝石 (11% 火抗)", nameEn: "Ruby (Small Charm)", range: "+10–11% 火焰抗性", alvl: 40, note: "需求等级 32；弥补破火板 -70% 抗性缺口首选" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "蓝宝石 (11% 冰抗)", nameEn: "Sapphire (Small Charm)", range: "+10–11% 冰冷抗性", alvl: 40, note: "需求等级 32；弥补破冰板 -70% 抗性缺口首选" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "琥珀 (11% 电抗)", nameEn: "Amber (Small Charm)", range: "+10–11% 闪电抗性", alvl: 40, note: "需求等级 32；弥补破电板 -70% 抗性缺口首选" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "翡翠 (11% 毒抗)", nameEn: "Emerald (Small Charm)", range: "+10–11% 毒素抗性", alvl: 40, note: "需求等级 32；弥补破毒板 -70% 抗性缺口首选" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "敦实 (30 防御)", nameEn: "Stalwart (Small Charm)", range: "+20–30 防御", alvl: 48, note: "需求等级 40" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "厚实 (防御)", nameEn: "Burly (Small Charm)", range: "+15–20 防御", alvl: 36, note: "需求等级 28" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "壮实 (防御)", nameEn: "Stout (Small Charm)", range: "+1–12 防御", alvl: 1, note: "需求等级 1–16" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "耐磨 (耐力上限)", nameEn: "Rugged (Small Charm)", range: "+4–16 耐力上限", alvl: 1, note: "需求等级 1–15" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "凛冬 (冰冷伤害)", nameEn: "Hibernal (Small Charm)", range: "+8–10 至 15–20 冰冷伤害", alvl: 91, note: "需求等级 83；次级极寒 Boreal (+5–7 至 9–14，alvl 66)" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "烈焰 (火焰伤害)", nameEn: "Flaming (Small Charm)", range: "+10–19 至 20–29 火焰伤害", alvl: 89, note: "需求等级 81；次级熏燃 Smoking (+4–9 至 11–19，alvl 64)" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "雷光 (闪电伤害)", nameEn: "Shocking (Small Charm)", range: "+1 至 44–71 闪电伤害", alvl: 90, note: "需求等级 82；搭配雷暴之后缀最高可达 1–99 电伤 SC" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "弧光 (闪电伤害)", nameEn: "Arcing (Small Charm)", range: "+1 至 25–43 闪电伤害", alvl: 65, note: "需求等级 57" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "辉光 (闪电伤害)", nameEn: "Glowing (Small Charm)", range: "+1 至 12–24 闪电伤害", alvl: 41, note: "需求等级 33" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "疫毒 (毒素伤害)", nameEn: "Pestilent (Small Charm)", range: "+175 毒素伤害（持续 6 秒）", alvl: 88, note: "需求等级 80；搭配炭疽之后缀可达 451 毒伤 SC" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "毒素 (毒素伤害)", nameEn: "Toxic (Small Charm)", range: "+100 毒素伤害（持续 5 秒）", alvl: 63, note: "需求等级 55" },
  { slot: "charm_sc", type: "prefix", quality: "magic", nameZh: "污毒 (毒素伤害)", nameEn: "Envenomed (Small Charm)", range: "+50 毒素伤害（持续 5 秒）", alvl: 39, note: "需求等级 31" },
  { slot: "charm_sc", type: "suffix", quality: "magic", nameZh: "生机之 (20 生命)", nameEn: "of Vita (Small Charm)", range: "+16–20 生命", alvl: 47, note: "需求等级 39；小型咒符生命最高档" },
  { slot: "charm_sc", type: "suffix", quality: "magic", nameZh: "续命之 (15 生命)", nameEn: "of Substinence (Small Charm)", range: "+11–15 生命", alvl: 23, note: "需求等级 17；30 级 LLD 低级决斗满血小符" },
  { slot: "charm_sc", type: "suffix", quality: "magic", nameZh: "生命之 (10 生命)", nameEn: "of Life (Small Charm)", range: "+5–10 生命", alvl: 1, note: "需求等级 14" },
  { slot: "charm_sc", type: "suffix", quality: "magic", nameZh: "平衡之 (5% 快速打击恢复 FHR)", nameEn: "of Balance (Small Charm)", range: "+5% 快速打击恢复 (FHR)", alvl: 37, note: "需求等级 29；凑 FHR 档位核心后缀（如 36 AR/5 FHR、5 全抗/5 FHR、11 单抗/5 FHR）" },
  { slot: "charm_sc", type: "suffix", quality: "magic", nameZh: "惯性之 (3% 高跑 FRW)", nameEn: "of Inertia (Small Charm)", range: "+3% 高速跑步/行走 (FRW)", alvl: 35, note: "需求等级 27；物理弓马/标马常用 3/20/3FRW 小符" },
  { slot: "charm_sc", type: "suffix", quality: "magic", nameZh: "好运之 (7% 寻宝 MF)", nameEn: "of Good Luck (Small Charm)", range: "+6–7% 更佳机会取得魔法装备 (MF)", alvl: 47, note: "需求等级 33；搭配 5 全抗或 11 单抗即为毕业 MF 小符" },
  { slot: "charm_sc", type: "suffix", quality: "magic", nameZh: "财富之 (5% 寻宝 MF)", nameEn: "of Fortune (Small Charm)", range: "+3–5% 更佳机会取得魔法装备 (MF)", alvl: 31, note: "需求等级 18" },
  { slot: "charm_sc", type: "suffix", quality: "magic", nameZh: "贪婪之 (10% 额外金币 EG)", nameEn: "of Greed (Small Charm)", range: "+5–10% 额外金币 (EG)", alvl: 1, note: "需求等级 15；打钱野蛮人常用" },
  { slot: "charm_sc", type: "suffix", quality: "magic", nameZh: "力量之 (+2 力量)", nameEn: "of Strength (Small Charm)", range: "+1–2 力量", alvl: 7, note: "需求等级 5–16（+2 力量需 alvl 22）" },
  { slot: "charm_sc", type: "suffix", quality: "magic", nameZh: "敏捷之 (+2 敏捷)", nameEn: "of Dexterity (Small Charm)", range: "+1–2 敏捷", alvl: 7, note: "需求等级 5–16（+2 敏捷需 alvl 22）" },
  { slot: "charm_sc", type: "suffix", quality: "magic", nameZh: "工匠之 (+1 最大伤)", nameEn: "of Craftsmanship (Small Charm)", range: "+1 最大伤害", alvl: 85, note: "需求等级 77；搭配优良 Fine 前缀可组成 +4 最大伤害 / +20 AR 极限伤小符" },
  { slot: "charm_sc", type: "suffix", quality: "magic", nameZh: "炭疽之 (毒素伤害)", nameEn: "of Anthrax (Small Charm)", range: "+50 毒素伤害（持续 6 秒）", alvl: 44, note: "需求等级 36" },
  { slot: "charm_sc", type: "suffix", quality: "magic", nameZh: "寒冬之 (冰冷伤害)", nameEn: "of Winter (Small Charm)", range: "+4–5 至 7–9 冰冷伤害", alvl: 46, note: "需求等级 38" },
  { slot: "charm_sc", type: "suffix", quality: "magic", nameZh: "焚烧之 (火焰伤害)", nameEn: "of Incineration (Small Charm)", range: "+5–7 至 10–13 火焰伤害", alvl: 45, note: "需求等级 37" },
  { slot: "charm_sc", type: "suffix", quality: "magic", nameZh: "雷暴之 (闪电伤害)", nameEn: "of Storms (Small Charm)", range: "+1 至 19–28 闪电伤害", alvl: 45, note: "需求等级 37" },

  // 🧿 大型咒符 (Large Charm, LC · qlvl 14 · 仅限魔法蓝装 1前缀+1后缀)
  { slot: "charm_lc", type: "prefix", quality: "magic", nameZh: "锋利 (最大伤 + 命中)", nameEn: "Sharp (Large Charm)", range: "+4–6 最大伤害 · +21–48 命中值 (AR)", alvl: 28, note: "需求等级 21；搭配 35 生命即为物理高性价比 6/48/35 中符" },
  { slot: "charm_lc", type: "prefix", quality: "magic", nameZh: "优良 (最大伤 + 命中)", nameEn: "Fine (Large Charm)", range: "+1–3 最大伤害 · +10–20 命中值 (AR)", alvl: 19, note: "需求等级 14" },
  { slot: "charm_lc", type: "prefix", quality: "magic", nameZh: "钢铁 (命中值 AR)", nameEn: "Steel (Large Charm)", range: "+52–77 命中值 (AR)", alvl: 43, note: "需求等级 36–44（65–77 AR 需 alvl 52）" },
  { slot: "charm_lc", type: "prefix", quality: "magic", nameZh: "黑铁 (命中值 AR)", nameEn: "Iron (Large Charm)", range: "+26–51 命中值 (AR)", alvl: 25, note: "需求等级 18–26" },
  { slot: "charm_lc", type: "prefix", quality: "magic", nameZh: "青铜 (命中值 AR)", nameEn: "Bronze (Large Charm)", range: "+4–25 命中值 (AR)", alvl: 1, note: "需求等级 1–13" },
  { slot: "charm_lc", type: "prefix", quality: "magic", nameZh: "巨蛇的 (34 法力)", nameEn: "Serpent's (Large Charm)", range: "+24–34 法力", alvl: 41, note: "需求等级 33–41" },
  { slot: "charm_lc", type: "prefix", quality: "magic", nameZh: "光彩 (8% 全抗)", nameEn: "Shimmering (Large Charm)", range: "+3–8% 所有抗性", alvl: 17, note: "需求等级 12–26（6–8% 全抗需 alvl 34）" },
  { slot: "charm_lc", type: "prefix", quality: "magic", nameZh: "红宝石 (15% 火抗)", nameEn: "Ruby (Large Charm)", range: "+13–15% 火焰抗性", alvl: 35, note: "需求等级 27" },
  { slot: "charm_lc", type: "prefix", quality: "magic", nameZh: "蓝宝石 (15% 冰抗)", nameEn: "Sapphire (Large Charm)", range: "+13–15% 冰冷抗性", alvl: 35, note: "需求等级 27" },
  { slot: "charm_lc", type: "prefix", quality: "magic", nameZh: "琥珀 (15% 电抗)", nameEn: "Amber (Large Charm)", range: "+13–15% 闪电抗性", alvl: 35, note: "需求等级 27" },
  { slot: "charm_lc", type: "prefix", quality: "magic", nameZh: "翡翠 (15% 毒抗)", nameEn: "Emerald (Large Charm)", range: "+13–15% 毒素抗性", alvl: 35, note: "需求等级 27" },
  { slot: "charm_lc", type: "prefix", quality: "magic", nameZh: "敦实 (60 防御)", nameEn: "Stalwart (Large Charm)", range: "+30–60 防御", alvl: 38, note: "需求等级 30–37" },
  { slot: "charm_lc", type: "suffix", quality: "magic", nameZh: "生机之 (35 生命)", nameEn: "of Vita (Large Charm)", range: "+26–35 生命", alvl: 58, note: "需求等级 50–66（31–35 生命需 alvl 74）" },
  { slot: "charm_lc", type: "suffix", quality: "magic", nameZh: "续命之 (25 生命)", nameEn: "of Substinence (Large Charm)", range: "+16–25 生命", alvl: 26, note: "需求等级 19–34" },
  { slot: "charm_lc", type: "suffix", quality: "magic", nameZh: "生命之 (15 生命)", nameEn: "of Life (Large Charm)", range: "+6–15 生命", alvl: 1, note: "需求等级 9" },
  { slot: "charm_lc", type: "suffix", quality: "magic", nameZh: "平衡之 (8% 快速打击恢复 FHR)", nameEn: "of Balance (Large Charm)", range: "+8% 快速打击恢复 (FHR)", alvl: 19, note: "需求等级 14" },
  { slot: "charm_lc", type: "suffix", quality: "magic", nameZh: "惯性之 (5% 高跑 FRW)", nameEn: "of Inertia (Large Charm)", range: "+5% 高速跑步/行走 (FRW)", alvl: 24, note: "需求等级 18" },
  { slot: "charm_lc", type: "suffix", quality: "magic", nameZh: "力量之 (+5 力量)", nameEn: "of Strength (Large Charm)", range: "+2–5 力量", alvl: 3, note: "需求等级 2–13（+4–5 力量需 alvl 18）" },
  { slot: "charm_lc", type: "suffix", quality: "magic", nameZh: "敏捷之 (+5 敏捷)", nameEn: "of Dexterity (Large Charm)", range: "+2–5 敏捷", alvl: 3, note: "需求等级 2–13（+4–5 敏捷需 alvl 18）" },
  { slot: "charm_lc", type: "suffix", quality: "magic", nameZh: "贪婪之 (22% 额外金币 EG)", nameEn: "of Greed (Large Charm)", range: "+5–22% 额外金币 (EG)", alvl: 1, note: "需求等级 5–15" },
  { slot: "charm_lc", type: "suffix", quality: "magic", nameZh: "品质之 (+2 最大伤)", nameEn: "of Quality (Large Charm)", range: "+1–2 最大伤害", alvl: 26, note: "搭配锋利 Sharp 前缀可达 +8 最大伤害 LC" },

  // 🧿 巨型咒符 (Grand Charm, GC · qlvl 1 · 仅限魔法蓝装 1前缀+1后缀)
  { slot: "charm_gc", type: "prefix", quality: "magic", nameZh: "八大职业 +1 单系技能板 (含 3.4 术士)", nameEn: "Skiller (+1 Skill Tab, incl. Warlock)", range: "+1 单系技能树（含术士恶魔/邪术/混沌三系）", alvl: 50, note: "需求等级 42；噩梦 A3 大沼泽起即可掉落，搭配 45 生命或 12% FHR / 7% FRW / 40% EG 为毕业大板" },
  { slot: "charm_gc", type: "prefix", quality: "magic", nameZh: "锋利 (10 最大伤 + 76 命中)", nameEn: "Sharp (Grand Charm)", range: "+7–10 最大伤害 · +49–76 命中值 (AR)", alvl: 29, note: "需求等级 21；搭配 45 生命即为物理毕业 10/76/45 肉搏大板" },
  { slot: "charm_gc", type: "prefix", quality: "magic", nameZh: "优良 (最大伤 + 命中)", nameEn: "Fine (Grand Charm)", range: "+4–6 最大伤害 · +21–48 命中值 (AR)", alvl: 16, note: "需求等级 11" },
  { slot: "charm_gc", type: "prefix", quality: "magic", nameZh: "钢铁 (132 命中值 AR)", nameEn: "Steel (Grand Charm)", range: "+103–132 命中值 (AR)", alvl: 41, note: "需求等级 35–41（118–132 AR 需 alvl 49）；搭配 45 生命为 K6Boss/AR 流极品大板" },
  { slot: "charm_gc", type: "prefix", quality: "magic", nameZh: "黑铁 (命中值 AR)", nameEn: "Iron (Grand Charm)", range: "+58–102 命中值 (AR)", alvl: 23, note: "需求等级 18–29" },
  { slot: "charm_gc", type: "prefix", quality: "magic", nameZh: "青铜 (命中值 AR)", nameEn: "Bronze (Grand Charm)", range: "+6–57 命中值 (AR)", alvl: 1, note: "需求等级 1–12" },
  { slot: "charm_gc", type: "prefix", quality: "magic", nameZh: "巨蛇的 (59 法力)", nameEn: "Serpent's (Grand Charm)", range: "+47–59 法力", alvl: 41, note: "需求等级 35–41；顶球法师 45 生命 / 59 法力大板" },
  { slot: "charm_gc", type: "prefix", quality: "magic", nameZh: "光彩 (15% 全抗)", nameEn: "Shimmering (Grand Charm)", range: "+8–15% 所有抗性", alvl: 14, note: "需求等级 12–27（13–15% 全抗需 alvl 35）" },
  { slot: "charm_gc", type: "prefix", quality: "magic", nameZh: "红宝石 (30% 火抗)", nameEn: "Ruby (Grand Charm)", range: "+26–30% 火焰抗性", alvl: 30, note: "需求等级 22" },
  { slot: "charm_gc", type: "prefix", quality: "magic", nameZh: "蓝宝石 (30% 冰抗)", nameEn: "Sapphire (Grand Charm)", range: "+26–30% 冰冷抗性", alvl: 30, note: "需求等级 22" },
  { slot: "charm_gc", type: "prefix", quality: "magic", nameZh: "琥珀 (30% 电抗)", nameEn: "Amber (Grand Charm)", range: "+26–30% 闪电抗性", alvl: 30, note: "需求等级 22" },
  { slot: "charm_gc", type: "prefix", quality: "magic", nameZh: "翡翠 (30% 毒抗)", nameEn: "Emerald (Grand Charm)", range: "+26–30% 毒素抗性", alvl: 30, note: "需求等级 22" },
  { slot: "charm_gc", type: "prefix", quality: "magic", nameZh: "敦实 (100 防御)", nameEn: "Stalwart (Grand Charm)", range: "+75–100 防御", alvl: 35, note: "需求等级 27–32" },
  { slot: "charm_gc", type: "prefix", quality: "magic", nameZh: "幸运 (寻宝率 MF 前缀)", nameEn: "Lucky (Grand Charm)", range: "+1–12% 更佳机会取得魔法装备 (MF)", alvl: 21, note: "" },
  { slot: "charm_gc", type: "suffix", quality: "magic", nameZh: "生机之 (41–45 生命 · 巴尔/TZ 板)", nameEn: "of Vita (41–45 Life Grand Charm)", range: "+41–45 生命", alvl: 91, note: "需求等级 83；仅 ilvl ≥ 91（地狱大菠萝/尼拉塞克/巴尔或 89+ 级角色恐怖地带）的 GC 可洗出" },
  { slot: "charm_gc", type: "suffix", quality: "magic", nameZh: "生机之 (36–40 生命)", nameEn: "of Vita (36–40 Life Grand Charm)", range: "+36–40 生命", alvl: 77, note: "需求等级 69" },
  { slot: "charm_gc", type: "suffix", quality: "magic", nameZh: "续命之 (21–35 生命)", nameEn: "of Substinence (Grand Charm)", range: "+21–35 生命", alvl: 31, note: "需求等级 23–53" },
  { slot: "charm_gc", type: "suffix", quality: "magic", nameZh: "生命之 (5–20 生命)", nameEn: "of Life (Grand Charm)", range: "+5–20 生命", alvl: 1, note: "需求等级 1–14" },
  { slot: "charm_gc", type: "suffix", quality: "magic", nameZh: "平衡之 (12% 快速打击恢复 FHR)", nameEn: "of Balance (Grand Charm)", range: "+12% 快速打击恢复 (FHR)", alvl: 1, note: "需求等级 1；技能 + 12% FHR 大板凑档位极佳" },
  { slot: "charm_gc", type: "suffix", quality: "magic", nameZh: "惯性之 (7% 高跑 FRW)", nameEn: "of Inertia (Grand Charm)", range: "+7% 高速跑步/行走 (FRW)", alvl: 19, note: "需求等级 14；亚马逊/刺客/死灵常用技能 + 7% 高跑大板" },
  { slot: "charm_gc", type: "suffix", quality: "magic", nameZh: "贪婪之 (40% 额外金币 EG)", nameEn: "of Greed (Grand Charm)", range: "+10–40% 额外金币 (EG)", alvl: 1, note: "需求等级 1–14（31–40% EG 需 alvl 19）；打钱蛮子 10 Max/76 AR/40 EG 或战吼/40 EG 核心" },
  { slot: "charm_gc", type: "suffix", quality: "magic", nameZh: "力量之 (+6 力量)", nameEn: "of Strength (Grand Charm)", range: "+3–6 力量", alvl: 1, note: "需求等级 1–10（+5–6 力量需 alvl 14）" },
  { slot: "charm_gc", type: "suffix", quality: "magic", nameZh: "敏捷之 (+6 敏捷)", nameEn: "of Dexterity (Grand Charm)", range: "+3–6 敏捷", alvl: 1, note: "需求等级 1–10（+5–6 敏捷需 alvl 14）" },
  { slot: "charm_gc", type: "suffix", quality: "magic", nameZh: "毁伤之 (+3–4 最大伤)", nameEn: "of Maiming (Grand Charm)", range: "+3–4 最大伤害", alvl: 71, note: "需求等级 63；搭配锋利 Sharp 前缀可组成 +14 最大伤害 / +76 AR 极限伤大板" },

  // 💎 珠宝 (Jewel · qlvl 1 · 蓝珠宝最多1前+1后，黄珠宝最多4词缀：前≤3/后≤3)
  { slot: "jewel", type: "prefix", quality: "magic", nameZh: "红宝石 (40% 增强伤害 · 蓝专属)", nameEn: "Ruby (Jewel)", range: "+31–40% 增强伤害 (ED)", alvl: 66, note: "需求等级 58；搭配 15% IAS 后缀即为 40/15 红白珠（注意：防具上 ED 与 Max/Min 同珠宝存在 Bug，武器无影响）" },
  { slot: "jewel", type: "prefix", quality: "all", nameZh: "雄黄 (30% 增强伤害 · 黄珠极限)", nameEn: "Realgar (Jewel)", range: "+21–30% 增强伤害 (ED)", alvl: 45, note: "需求等级 37；黄珠宝最高 ED 前缀，可配 9 力 / 9 敏 / 7 FHR 或 -15% 需求" },
  { slot: "jewel", type: "prefix", quality: "all", nameZh: "红锈 (20% 增强伤害)", nameEn: "Rusty (Jewel)", range: "+11–20% 增强伤害 (ED)", alvl: 13, note: "需求等级 9" },
  { slot: "jewel", type: "prefix", quality: "all", nameZh: "朱砂 (10% 增强伤害)", nameEn: "Cinnabar (Jewel)", range: "+5–10% 增强伤害 (ED)", alvl: 1, note: "需求等级 1" },
  { slot: "jewel", type: "prefix", quality: "magic", nameZh: "朱红 (+15 最大伤害 · 蓝专属)", nameEn: "Vermillion (Jewel)", range: "+11–15 最大伤害", alvl: 58, note: "需求等级 50；搭配克害之 (+15 Max) 后缀可达 +30 最大伤害蓝珠宝" },
  { slot: "jewel", type: "prefix", quality: "all", nameZh: "深红 (+9 最大伤害 · 黄珠极限)", nameEn: "Carmine (Jewel)", range: "+6–9 最大伤害", alvl: 35, note: "需求等级 27；30 级 LLD 低级决斗核心词缀" },
  { slot: "jewel", type: "prefix", quality: "all", nameZh: "猩红 (+8 最小伤害)", nameEn: "Crimson (Jewel)", range: "+5–8 最小伤害", alvl: 38, note: "需求等级 30；蓝/黄通用" },
  { slot: "jewel", type: "prefix", quality: "magic", nameZh: "亮银 (+100 命中值 · 蓝专属)", nameEn: "Argent (Jewel)", range: "+61–100 命中值 (AR)", alvl: 44, note: "需求等级 36" },
  { slot: "jewel", type: "prefix", quality: "all", nameZh: "白银 (+60 命中值 · 黄珠极限)", nameEn: "Silver (Jewel)", range: "+41–60 命中值 (AR)", alvl: 25, note: "需求等级 18" },
  { slot: "jewel", type: "prefix", quality: "magic", nameZh: "五彩 (15% 全抗 · 蓝专属)", nameEn: "Scintillating (Jewel)", range: "+11–15% 所有抗性", alvl: 34, note: "需求等级 26；搭配 15% IAS、7% FHR、20 生命或 -15% 需求均为顶级蓝珠" },
  { slot: "jewel", type: "prefix", quality: "all", nameZh: "光彩 (10% 全抗 · 黄珠极限)", nameEn: "Shimmering (Jewel)", range: "+5–10% 所有抗性", alvl: 16, note: "需求等级 12；黄珠宝全抗上限" },
  { slot: "jewel", type: "prefix", quality: "all", nameZh: "红宝石 (30% 火抗)", nameEn: "Ruby (Jewel)", range: "+16–30% 火焰抗性", alvl: 19, note: "需求等级 13；15% IAS / 30% 火抗珠为安达利尔的面容毕业镶嵌物" },
  { slot: "jewel", type: "prefix", quality: "all", nameZh: "蓝宝石 (30% 冰抗)", nameEn: "Sapphire (Jewel)", range: "+16–30% 冰冷抗性", alvl: 19, note: "需求等级 14" },
  { slot: "jewel", type: "prefix", quality: "all", nameZh: "龙涎香 (30% 电抗)", nameEn: "Ambergris (Jewel)", range: "+16–30% 闪电抗性", alvl: 19, note: "需求等级 14" },
  { slot: "jewel", type: "prefix", quality: "all", nameZh: "碧玉 (30% 毒抗)", nameEn: "Jade (Jewel)", range: "+16–30% 毒素抗性", alvl: 19, note: "需求等级 14" },
  { slot: "jewel", type: "prefix", quality: "magic", nameZh: "绿松石 (+20 法力 · 蓝专属)", nameEn: "Turquoise (Jewel)", range: "+16–20 法力", alvl: 29, note: "需求等级 21；黄珠宝最高为赤锆 Jacinth (+11–15 法力)" },
  { slot: "jewel", type: "prefix", quality: "magic", nameZh: "象牙 (+64 防御 · 蓝专属)", nameEn: "Ivory (Jewel)", range: "+41–64 防御", alvl: 64, note: "需求等级 56；黄珠宝最高为白骨 Bone (+21–40 防御)" },
  { slot: "jewel", type: "prefix", quality: "all", nameZh: "光轮 (+3 击杀回蓝 EK)", nameEn: "Aureolin (Jewel)", range: "+1–3 每杀一个敌人恢复法力 (MAEK)", alvl: 22, note: "需求等级 16；标马/电法续航极品前缀" },
  { slot: "jewel", type: "prefix", quality: "all", nameZh: "索债 (12% 受损转法力)", nameEn: "Dun (Jewel)", range: "7–12% 受到的伤害转化为法力", alvl: 7, note: "需求等级 5" },
  { slot: "jewel", type: "prefix", quality: "all", nameZh: "钻石 (对恶魔增伤与命中)", nameEn: "Diamond (Jewel)", range: "+25–40% 对恶魔伤害 · +25–50 对恶魔命中", alvl: 26, note: "需求等级 19；单条双属性原生词缀" },
  { slot: "jewel", type: "prefix", quality: "all", nameZh: "珍珠 (对不死增伤与命中)", nameEn: "Pearl (Jewel)", range: "+25–50% 对不死伤害 · +25–50 对不死命中", alvl: 18, note: "需求等级 13；单条双属性原生词缀" },
  { slot: "jewel", type: "suffix", quality: "magic", nameZh: "狂热之 (15% 攻速 IAS · 蓝专属)", nameEn: "of Fervor (Jewel)", range: "+15% 提高攻击速度 (IAS)", alvl: 39, note: "需求等级 31；仅蓝珠宝可出攻速（如 15 IAS/40 ED、15 IAS/15 全抗、15 IAS/30 火抗、15 IAS/15 Max、15 IAS/3 EK）" },
  { slot: "jewel", type: "suffix", quality: "magic", nameZh: "克害之 (+15 最大伤害 · 蓝专属)", nameEn: "of Carnage (Jewel)", range: "+11–15 最大伤害", alvl: 25, note: "需求等级 18" },
  { slot: "jewel", type: "suffix", quality: "all", nameZh: "怒火之 (+9 最大伤害 · 黄珠极限)", nameEn: "of Wrath (Jewel)", range: "+6–9 最大伤害", alvl: 11, note: "需求等级 8" },
  { slot: "jewel", type: "suffix", quality: "all", nameZh: "欣喜之 (+10 最小伤害)", nameEn: "of Bliss (Jewel)", range: "+5–10 最小伤害", alvl: 43, note: "需求等级 37；黄珠宝可同时出猩红 (+8 Min) + 欣喜 (+10 Min) = +18 最小伤害" },
  { slot: "jewel", type: "suffix", quality: "all", nameZh: "真理之 (7% 快速打击恢复 FHR)", nameEn: "of Truth (Jewel)", range: "+7% 快速打击恢复 (FHR)", alvl: 44, note: "需求等级 36；法系黄珠核心后缀" },
  { slot: "jewel", type: "suffix", quality: "all", nameZh: "刚勇之 (+9 力量)", nameEn: "of Virility (Jewel)", range: "+7–9 力量", alvl: 50, note: "需求等级 42；次级 +5–6 力量需 alvl 33" },
  { slot: "jewel", type: "suffix", quality: "all", nameZh: "胆识之 (+9 敏捷)", nameEn: "of Daring (Jewel)", range: "+7–9 敏捷", alvl: 36, note: "需求等级 28；次级 +4–6 敏捷需 alvl 19" },
  { slot: "jewel", type: "suffix", quality: "all", nameZh: "知识之 (+9 精力)", nameEn: "of Knowledge (Jewel)", range: "+7–9 精力", alvl: 41, note: "需求等级 33" },
  { slot: "jewel", type: "suffix", quality: "all", nameZh: "自由之 (需求 -15%)", nameEn: "of Freedom (Jewel)", range: "装备需求 -15%", alvl: 1, note: "需求等级 1；降低统盾/高力甲穿戴门槛" },
  { slot: "jewel", type: "suffix", quality: "magic", nameZh: "希望之 (+20 生命 · 蓝专属)", nameEn: "of Hope (Jewel)", range: "+9–20 生命", alvl: 45, note: "需求等级 37；黄珠宝最高为精神之 of Spirit (+3–8 生命)" },
  { slot: "jewel", type: "suffix", quality: "all", nameZh: "发达之 (10% 寻宝 MF)", nameEn: "of Prosperity (Jewel)", range: "+5–10% 更佳机会取得魔法装备 (MF)", alvl: 26, note: "需求等级 19；搭配翡翠前缀 (+7% MF) 可达 17% MF 蓝珠宝" },
  { slot: "jewel", type: "suffix", quality: "all", nameZh: "贪财之 (30% 额外金币 EG)", nameEn: "of Avarice (Jewel)", range: "+10–30% 额外金币 (EG)", alvl: 1, note: "需求等级 1" },
  { slot: "jewel", type: "suffix", quality: "all", nameZh: "嫉妒之 (1级小号 20 毒伤神器)", nameEn: "of Envy (Jewel)", range: "+20 毒素伤害（持续 2 秒，无等级需求）", alvl: 1, note: "需求等级 1；镶满 6 孔剑/3 孔头/4 孔甲为 1 级小号开荒秒怪神器" },
  { slot: "jewel", type: "suffix", quality: "all", nameZh: "雷霆之 (闪电点伤)", nameEn: "of Thunder (Jewel)", range: "+1 至 61–100 闪电伤害", alvl: 57, note: "需求等级 49" },
  { slot: "jewel", type: "suffix", quality: "all", nameZh: "燃烧之 (火焰点伤)", nameEn: "of Burning (Jewel)", range: "+11–25 至 36–50 火焰伤害", alvl: 57, note: "需求等级 49" }
];

// 暗金珠宝列表（含 D2R 3.4 术士君临新增 6 颗巨型暗金珠宝 cjw + 4 颗经典彩虹刻面）
export const UNIQUE_JEWELS = [
  {
    id: "defenders-fire",
    patch: "3.4",
    code: "cjw",
    nameZh: "防御者之火",
    nameEn: "Defender's Fire",
    reqLvl: 75,
    icon: "/images/items/misc/body_part/fragment_fire.webp",
    lines: [
      "被击中时 1–25% 几率施放 1 级火焰风暴",
      "+5–10% 火焰技能伤害",
      "-5–10% 敌人火焰抗性",
      "+20–60 火焰伤害",
      "+3–5% 获得经验值",
      "+15–35% 更佳机会取得魔法装备 (MF)",
      "+25–50% 额外金币 (EG)"
    ],
    note: "D2R 3.4 术士君临新增巨型暗金珠宝（火焰系）"
  },
  {
    id: "protectors-frost",
    patch: "3.4",
    code: "cjw",
    nameZh: "保卫者之霜",
    nameEn: "Protector's Frost",
    reqLvl: 75,
    icon: "/images/items/misc/body_part/fragment_cold.webp",
    lines: [
      "被击中时 1–25% 几率施放 1 级冰封装甲",
      "+5–10% 冰冷技能伤害",
      "-5–10% 敌人冰冷抗性",
      "+10–30 冰冷伤害",
      "+3–5% 获得经验值",
      "+15–35% 更佳机会取得魔法装备 (MF)",
      "+25–50% 额外金币 (EG)"
    ],
    note: "D2R 3.4 术士君临新增巨型暗金珠宝（冰冷系）"
  },
  {
    id: "guardians-thunder",
    patch: "3.4",
    code: "cjw",
    nameZh: "守护者之雷",
    nameEn: "Guardian's Thunder",
    reqLvl: 75,
    icon: "/images/items/misc/body_part/fragment_lightning.webp",
    lines: [
      "被击中时 1–25% 几率施放 1 级飓风装甲",
      "+5–10% 闪电技能伤害",
      "-5–10% 敌人闪电抗性",
      "+1–75 闪电伤害",
      "+3–5% 获得经验值",
      "+15–35% 更佳机会取得魔法装备 (MF)",
      "+25–50% 额外金币 (EG)"
    ],
    note: "D2R 3.4 术士君临新增巨型暗金珠宝（闪电系）"
  },
  {
    id: "defenders-bile",
    patch: "3.4",
    code: "cjw",
    nameZh: "防御者之怒",
    nameEn: "Defender's Bile",
    reqLvl: 75,
    icon: "/images/items/misc/body_part/fragment_poison.webp",
    lines: [
      "被击中时 1–25% 几率施放 1 级白骨装甲",
      "+5–10% 毒素技能伤害",
      "-5–10% 敌人毒素抗性",
      "+975 毒素伤害（持续 1 秒）",
      "+3–5% 获得经验值",
      "+15–35% 更佳机会取得魔法装备 (MF)",
      "+25–50% 额外金币 (EG)"
    ],
    note: "D2R 3.4 术士君临新增巨型暗金珠宝（毒素系）"
  },
  {
    id: "protectors-stone",
    patch: "3.4",
    code: "cjw",
    nameZh: "保卫者之石",
    nameEn: "Protector's Stone",
    reqLvl: 75,
    icon: "/images/items/misc/body_part/fragment_physical.webp",
    lines: [
      "被击中时 1–15% 几率施放 1 级能量消解",
      "+30–50% 增强伤害 (ED)",
      "+10–30 伤害",
      "-5–10% 敌人物理抗性",
      "+3–5% 获得经验值",
      "+15–35% 更佳机会取得魔法装备 (MF)",
      "+25–50% 额外金币 (EG)"
    ],
    note: "D2R 3.4 术士君临新增巨型暗金珠宝（物理破抗系）"
  },
  {
    id: "guardians-light",
    patch: "3.4",
    code: "cjw",
    nameZh: "守护者之光",
    nameEn: "Guardian's Light",
    reqLvl: 75,
    icon: "/images/items/misc/body_part/fragment_magic.webp",
    lines: [
      "被击中时 1–25% 几率施放 1 级邪咒护盾",
      "+5–10% 魔法技能伤害",
      "-5–10% 敌人魔法抗性",
      "+15–35 魔法伤害",
      "+3–5% 获得经验值",
      "+15–35% 更佳机会取得魔法装备 (MF)",
      "+25–50% 额外金币 (EG)"
    ],
    note: "D2R 3.4 术士君临新增巨型暗金珠宝（魔法系 · 祝福之锤/白骨/混沌术士毕业）"
  },
  {
    id: "facet-lightning",
    patch: "1.10",
    code: "jew",
    nameZh: "彩虹刻面（闪电）",
    nameEn: "Rainbow Facet (Lightning)",
    reqLvl: 49,
    icon: "/images/items/misc/gem/perfect_diamond5.webp",
    lines: [
      "死亡/升级时 100% 几率施放 47 级连锁闪电 / 41 级新星",
      "+1–74 闪电伤害",
      "+3–5% 闪电技能伤害",
      "-3–5% 敌人闪电抗性"
    ],
    note: "经典暗金珠宝（俗称 5/5 电珠）"
  },
  {
    id: "facet-cold",
    patch: "1.10",
    code: "jew",
    nameZh: "彩虹刻面（冰冷）",
    nameEn: "Rainbow Facet (Cold)",
    reqLvl: 49,
    icon: "/images/items/misc/gem/perfect_diamond3.webp",
    lines: [
      "死亡/升级时 100% 几率施放 37 级暴风雪 / 43 级霜之新星",
      "+24–38 冰冷伤害",
      "+3–5% 冰冷技能伤害",
      "-3–5% 敌人冰冷抗性"
    ],
    note: "经典暗金珠宝（俗称 5/5 冰珠）"
  },
  {
    id: "facet-fire",
    patch: "1.10",
    code: "jew",
    nameZh: "彩虹刻面（火焰）",
    nameEn: "Rainbow Facet (Fire)",
    reqLvl: 49,
    icon: "/images/items/misc/gem/perfect_diamond2.webp",
    lines: [
      "死亡/升级时 100% 几率施放 31 级陨石 / 29 级烈焰之径",
      "+17–45 火焰伤害",
      "+3–5% 火焰技能伤害",
      "-3–5% 敌人火焰抗性"
    ],
    note: "经典暗金珠宝（俗称 5/5 火珠）"
  },
  {
    id: "facet-poison",
    patch: "1.10",
    code: "jew",
    nameZh: "彩虹刻面（毒素）",
    nameEn: "Rainbow Facet (Poison)",
    reqLvl: 49,
    icon: "/images/items/misc/gem/perfect_diamond4.webp",
    lines: [
      "死亡/升级时 100% 几率施放 51 级剧毒新星 / 23 级淬毒",
      "+37 毒素伤害（持续 2 秒）",
      "+3–5% 毒素技能伤害",
      "-3–5% 敌人毒素抗性"
    ],
    note: "经典暗金珠宝（俗称 5/5 毒珠）"
  }
];

export const SIMULATOR_BASES = [
  { id: "amulet", slot: "amulet", label: "护身符 / 项链 (Amulet)", icon: "/images/items/misc/amulet/amulet1.webp", qlvl: 1, magicLvl: 0, supportsCraft: true },
  { id: "ring", slot: "ring", label: "戒指 (Ring)", icon: "/images/items/misc/ring/ring1.webp", qlvl: 1, magicLvl: 0, supportsCraft: true },
  { id: "circlet", slot: "circlet", label: "头环 (Circlet · qlvl 24)", icon: "/images/items/armor/circlet/circlet.webp", qlvl: 24, magicLvl: 3, supportsCraft: false },
  { id: "coronet", slot: "circlet", label: "宝冠 (Coronet · qlvl 52)", icon: "/images/items/armor/circlet/coronet.webp", qlvl: 52, magicLvl: 8, supportsCraft: false },
  { id: "tiara", slot: "circlet", label: "三重冠 (Tiara · qlvl 70)", icon: "/images/items/armor/circlet/tiara.webp", qlvl: 70, magicLvl: 13, supportsCraft: false },
  { id: "diadem", slot: "circlet", label: "权冠 (Diadem · qlvl 85)", icon: "/images/items/armor/circlet/diadem.webp", qlvl: 85, magicLvl: 18, supportsCraft: false },
  { id: "gloves", slot: "gloves", label: "手套 (Gloves · qlvl 1–69)", icon: "/images/items/armor/glove/heavy_gloves.webp", qlvl: 47, magicLvl: 0, supportsCraft: true },
  { id: "boots", slot: "boots", label: "鞋子 (Boots · qlvl 1–65)", icon: "/images/items/armor/boot/heavy_boots.webp", qlvl: 49, magicLvl: 0, supportsCraft: true },
  { id: "belt", slot: "belt", label: "腰带 (Belt · qlvl 1–68)", icon: "/images/items/armor/belt/heavy_belt.webp", qlvl: 52, magicLvl: 0, supportsCraft: true },
  { id: "weapon", slot: "weapon", label: "武器 (Weapon)", icon: "/images/items/weapon/sword/crystal_sword.webp", qlvl: 55, magicLvl: 0, supportsCraft: false },
  { id: "armor_shield", slot: "armor_shield", label: "盔甲 / 盾牌", icon: "/images/items/armor/shield/kite_shield.webp", qlvl: 54, magicLvl: 0, supportsCraft: true },
  { id: "charm_sc", slot: "charm_sc", label: "小型咒符 (Small Charm, SC · qlvl 28)", icon: "/images/items/misc/charm/charm_small.webp", qlvl: 28, magicLvl: 0, supportsCraft: false, magicOnly: true },
  { id: "charm_lc", slot: "charm_lc", label: "大型咒符 (Large Charm, LC · qlvl 14)", icon: "/images/items/misc/charm/charm_medium.webp", qlvl: 14, magicLvl: 0, supportsCraft: false, magicOnly: true },
  { id: "charm_gc", slot: "charm_gc", label: "巨型咒符 (Grand Charm, GC · qlvl 1)", icon: "/images/items/misc/charm/charm_large.webp", qlvl: 1, magicLvl: 0, supportsCraft: false, magicOnly: true },
  { id: "jewel", slot: "jewel", label: "珠宝 (Jewel · 含蓝/黄/暗金3.4新珠宝)", icon: "/images/items/misc/gem/perfect_diamond1.webp", qlvl: 1, magicLvl: 0, supportsCraft: false, supportsUnique: true, rareMaxAffixes: 4 }
];

export function calculateItemAlvl(ilvl, qlvl = 1, magicLvl = 0) {
  const clampedIlvl = Math.min(99, Math.max(1, Number(ilvl) || 1));
  const effIlvl = Math.max(clampedIlvl, Number(qlvl) || 1);
  let alvl;
  if (magicLvl > 0) {
    alvl = effIlvl + magicLvl;
  } else if (effIlvl < 99 - Math.floor(qlvl / 2)) {
    alvl = effIlvl - Math.floor(qlvl / 2);
  } else {
    alvl = 2 * effIlvl - 99;
  }
  return Math.min(99, Math.max(1, alvl));
}

export function getAffixesCatalog() {
  return {
    qualityRules: QUALITY_RULES,
    craftRecipes: CRAFT_RECIPES,
    slots: AFFIX_SLOTS,
    simulatorBases: SIMULATOR_BASES,
    uniqueJewels: UNIQUE_JEWELS,
    affixes: AFFIX_RANGES,
    totalAffixes: AFFIX_RANGES.length
  };
}
