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
  { id: "amulet", label: "项链", icon: "/images/items/misc/amulet/amulet.webp" },
  { id: "ring", label: "戒指", icon: "/images/items/misc/ring/ring.webp" },
  { id: "circlet", label: "头环/权冠", icon: "/images/items/armor/circlet/diadem.webp" },
  { id: "gloves", label: "手套", icon: "/images/items/armor/glove/heavy_gloves.webp" },
  { id: "boots", label: "鞋子", icon: "/images/items/armor/boot/chain_boots.webp" },
  { id: "belt", label: "腰带", icon: "/images/items/armor/belt/light_belt.webp" },
  { id: "weapon", label: "武器", icon: "/images/items/weapon/axe/war_axe.webp" },
  { id: "armor_shield", label: "盔甲/盾牌", icon: "/images/items/armor/shield/kite_shield.webp" },
  { id: "charm_jewel", label: "护身符/珠宝", icon: "/images/items/misc/charm/charm_small.webp" }
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
  { slot: "amulet", type: "prefix", quality: "all", nameZh: "单抗", nameEn: "Ruby / Sapphire / Amber / Emerald", range: "+31–40% 单项抗性", alvl: 25, note: "黄/橙装可与全抗前缀共存（最多 3 前缀）" },
  { slot: "amulet", type: "suffix", quality: "all", nameZh: "力量（阿特拉斯）", nameEn: "of the Atlas", range: "+21–30 力量", alvl: 71, note: "蓝/黄/橙均可出到 30 力量" },
  { slot: "amulet", type: "suffix", quality: "all", nameZh: "敏捷（完美）", nameEn: "of Perfection", range: "+16–20 敏捷", alvl: 59, note: "" },
  { slot: "amulet", type: "suffix", quality: "all", nameZh: "精力（巫师）", nameEn: "of the Magi / Sorcerer", range: "+16–20 精力", alvl: 31, note: "ES 顶球法师高法力池实用属性" },
  { slot: "amulet", type: "suffix", quality: "magic", nameZh: "生命（巨鲸·蓝极限）", nameEn: "of the Whale", range: "+81–100 生命", alvl: 50, note: "蓝装专属上限；黄/橙装生命后缀最高 +41–60（巨像 of the Colossus）" },
  { slot: "amulet", type: "suffix", quality: "rare", nameZh: "生命（巨像·黄/橙极限）", nameEn: "of the Colossus", range: "+41–60 生命", alvl: 30, note: "黄/橙项链单条生命最高 60（吸血橙链叠加固定 +20 可达 80 生命）" },
  { slot: "amulet", type: "prefix", quality: "magic", nameZh: "法力（巴哈姆特·蓝极限）", nameEn: "Bahamut's", range: "+91–120 法力", alvl: 45, note: "黄/橙装最高为 Great Wyrm's (+61–90 法力，alvl 37)" },
  { slot: "amulet", type: "prefix", quality: "rare", nameZh: "法力（巨龙·黄/橙极限）", nameEn: "Great Wyrm's", range: "+61–90 法力", alvl: 37, note: "施法橙链叠加固定 +20 法力最高可达 110 法力" },
  { slot: "amulet", type: "suffix", quality: "all", nameZh: "生命恢复", nameEn: "of Regeneration", range: "+6–10 生命恢复", alvl: 41, note: "" },
  { slot: "amulet", type: "suffix", quality: "all", nameZh: "生命 / 法力偷取", nameEn: "of the Leech / Bat", range: "1–6% LL · 1–8% ML", alvl: 78, note: "双吸物理项链核心后缀" },
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
  { slot: "ring", type: "prefix", quality: "all", nameZh: "单抗", nameEn: "Garnet / Cobalt / Coral / Jade", range: "+21–30% 单项抗性", alvl: 18, note: "双抗/三抗戒指的核心前缀" },
  { slot: "ring", type: "suffix", quality: "rare", nameZh: "生命偷取", nameEn: "of the Vampire", range: "+7–8% LL", alvl: 77, note: "蓝装最高 9% LL；吸血橙戒叠加固定 1–3% LL 最高可达 11% LL" },
  { slot: "ring", type: "suffix", quality: "all", nameZh: "法力偷取", nameEn: "of the Wraith", range: "+5–6% ML", alvl: 86, note: "双吸戒指高价值词缀" },
  { slot: "ring", type: "prefix", quality: "all", nameZh: "命中率 AR", nameEn: "Platinum", range: "+101–120 命中率", alvl: 22, note: "" },
  { slot: "ring", type: "suffix", quality: "all", nameZh: "最小 / 最大伤害", nameEn: "of Performance / Maiming", range: "+6–9 最小伤害 · +3–4 最大伤害", alvl: 51, note: "物理戒指极品增伤词缀" },
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
  { slot: "circlet", type: "prefix", quality: "all", nameZh: "单抗", nameEn: "Ruby / Sapphire / Amber / Emerald", range: "+31–40% 单项抗性", alvl: 25, note: "" },
  { slot: "circlet", type: "prefix", quality: "all", nameZh: "强力视觉 (Visionary)", nameEn: "Visionary", range: "+(1% * 等级) 加成命中率", alvl: 25, note: "PVP 物理头环核心前缀" },
  { slot: "circlet", type: "suffix", quality: "all", nameZh: "双吸（生命/法力偷取）", nameEn: "of the Lamprey / Wraith", range: "+6–8% LL · +6–8% ML", alvl: 78, note: "" },

  // 🧤 手套
  { slot: "gloves", type: "crafted", quality: "crafted", nameZh: "吸血手套（#4 奈夫 + 完美红）", nameEn: "Blood Gloves (#4 Nef + Perfect Ruby)", range: "5–10% 压碎性打击 (CB) · 1–3% LL · +10–20 生命", alvl: 1, note: "与随机 2 技能 / 20 IAS 叠加，即为极品 2/20/10CB 吸血橙手" },
  { slot: "gloves", type: "crafted", quality: "crafted", nameZh: "击打手套（#9 欧特 + 完美蓝）", nameEn: "Hit Power Gloves (#9 Ort + Perfect Sapphire)", range: "击退 · 被击中 5% 霜之新星 · 反伤 3–7", alvl: 1, note: "弓马 PVP/PVE 极品 2/20 击退手套核心" },
  { slot: "gloves", type: "suffix", quality: "all", nameZh: "提高攻击速度", nameEn: "of Alacrity", range: "+20% IAS", alvl: 43, note: "物理/标马/武学刺客手套必备" },
  { slot: "gloves", type: "prefix", quality: "magic", nameZh: "单系技能（蓝专属）", nameEn: "Lancer's / Archer's / Martial", range: "+3 标枪 / 弓 / 被动 / 武学", alvl: 60, note: "+3 标枪 / 20 IAS 蓝手套为亚马逊毕业手套之一" },
  { slot: "gloves", type: "prefix", quality: "rare", nameZh: "单系技能（黄/橙极限）", nameEn: "Spearmaiden's / Fletcher's", range: "+2 标枪 / 弓 / 被动 / 武学", alvl: 40, note: "黄/橙手套最高 +2 技能" },
  { slot: "gloves", type: "suffix", quality: "all", nameZh: "力量（巨人）", nameEn: "of the Giant", range: "+10–15 力量", alvl: 59, note: "" },
  { slot: "gloves", type: "suffix", quality: "all", nameZh: "敏捷（精准）", nameEn: "of Precision", range: "+10–15 敏捷", alvl: 56, note: "" },
  { slot: "gloves", type: "suffix", quality: "all", nameZh: "生命 / 法力偷取", nameEn: "of the Leech / Bat", range: "1–3% LL · 1–3% ML", alvl: 34, note: "吸血橙手可再与固定 1–3% LL 叠加至 6% LL" },
  { slot: "gloves", type: "prefix", quality: "all", nameZh: "单抗", nameEn: "Garnet / Cobalt / Coral / Jade", range: "+21–30% 单项抗性", alvl: 18, note: "" },
  { slot: "gloves", type: "suffix", quality: "all", nameZh: "寻宝率 MF", nameEn: "of Fortune", range: "+16–25% MF", alvl: 16, note: "" },

  // 🥾 鞋子
  { slot: "boots", type: "crafted", quality: "crafted", nameZh: "施法者鞋子（#10 图尔 + 完美紫）", nameEn: "Caster Boots (#10 Thul + Perfect Amethyst)", range: "法力上限 +2–5% · +10–20 法力 · 4–10% 法力恢复", alvl: 1, note: "ES 顶球法师可再配三抗 + 30 FRW + 10 FHR" },
  { slot: "boots", type: "suffix", quality: "all", nameZh: "更快速跑步/步行", nameEn: "of Speed", range: "+30% FRW", alvl: 37, note: "" },
  { slot: "boots", type: "suffix", quality: "all", nameZh: "更快速打击回复", nameEn: "of Balance", range: "+10% FHR", alvl: 5, note: "" },
  { slot: "boots", type: "prefix", quality: "all", nameZh: "单抗", nameEn: "Ruby / Sapphire / Amber / Emerald", range: "+31–40% 单项抗性", alvl: 25, note: "三抗鞋理论极限为火/冰/电各 +40%（总抗性 120%）" },
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
  { slot: "belt", type: "prefix", quality: "all", nameZh: "单抗", nameEn: "Garnet / Cobalt / Coral / Jade", range: "+21–30% 单项抗性", alvl: 18, note: "" },
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
  { slot: "armor_shield", type: "suffix", quality: "all", nameZh: "更快速打击回复", nameEn: "of Stability / Equilibrium", range: "+24% FHR（甲）/ +17% FHR（盾）", alvl: 18, note: "" },
  { slot: "armor_shield", type: "prefix", quality: "magic", nameZh: "彩色全抗（蓝盾专属）", nameEn: "Chromatic", range: "+21–30% 所有抗性", alvl: 55, note: "黄盾牌全抗最高 Prismatic (+16–20%)" },
  { slot: "armor_shield", type: "crafted", quality: "crafted", nameZh: "安全盾牌（#5 艾斯 + 完美绿）", nameEn: "Safety Shield (#5 Eth + Perfect Emerald)", range: "+5–10% 提高格挡几率 · 魔伤减少 1–2 · +10–30% 强化防御", alvl: 1, note: "" },

  // 💎 护身符 / 珠宝
  { slot: "charm_jewel", type: "prefix", quality: "magic", nameZh: "GC +1 单系技能板", nameEn: "Skiller (Grand Charm)", range: "+1 单系技能树", alvl: 50, note: "45 级以上噩梦/地狱掉落即有几率出技能板" },
  { slot: "charm_jewel", type: "suffix", quality: "magic", nameZh: "GC 45 生命（维塔）", nameEn: "of Vita (Grand Charm)", range: "+41–45 生命", alvl: 91, note: "仅 91+ 级暗黑/尼拉塞克/巴尔或 89+ 恐怖地带掉落的 GC 可洗出" },
  { slot: "charm_jewel", type: "prefix", quality: "magic", nameZh: "GC 锐利最大伤/命中", nameEn: "Sharp (Grand Charm)", range: "+7–10 Max · +49–76 AR", alvl: 29, note: "物理职业极品 10/76/45 肉搏大板" },
  { slot: "charm_jewel", type: "suffix", quality: "magic", nameZh: "SC 20 生命（维塔）", nameEn: "of Vita (Small Charm)", range: "+16–20 生命", alvl: 47, note: "小护身符生命上限" },
  { slot: "charm_jewel", type: "prefix", quality: "magic", nameZh: "SC 精细最大伤/命中", nameEn: "Fine (Small Charm)", range: "+1–3 Max · +10–20 AR", alvl: 28, note: "搭配 20 生命即为 3/20/20 极品物理 SC" },
  { slot: "charm_jewel", type: "prefix", quality: "magic", nameZh: "SC 5 全抗 / 11 单抗", nameEn: "Shimmering / Ruby / Amber", range: "+3–5% 全抗 / +10–11% 单抗", alvl: 33, note: "5 全抗 20 血 SC 为全职业毕业护身符" },
  { slot: "charm_jewel", type: "suffix", quality: "magic", nameZh: "SC 7% MF 寻宝", nameEn: "of Good Luck (Small Charm)", range: "+6–7% MF", alvl: 47, note: "" },
  { slot: "charm_jewel", type: "prefix", quality: "magic", nameZh: "SC 17 法力（巨蛇）", nameEn: "Serpent's (Small Charm)", range: "+13–17 法力", alvl: 48, note: "法系极品 20 血 / 17 法力 SC" },
  { slot: "charm_jewel", type: "prefix", quality: "magic", nameZh: "蓝珠宝 40% 增强伤害", nameEn: "Ruby (Jewel)", range: "+31–40% ED", alvl: 66, note: "仅蓝珠宝可达 40% ED；黄珠宝上限为 +30% ED" },
  { slot: "charm_jewel", type: "suffix", quality: "magic", nameZh: "蓝珠宝 15% 攻速", nameEn: "of Fervor (Jewel)", range: "+15% IAS", alvl: 39, note: "仅蓝珠宝可出 15% IAS（40 ED / 15 IAS 红白猪）" },
  { slot: "charm_jewel", type: "prefix", quality: "magic", nameZh: "蓝珠宝 15% 全抗", nameEn: "Scintillating (Jewel)", range: "+11–15% 所有抗性", alvl: 34, note: "黄珠宝全抗上限为 +10%" },
  { slot: "charm_jewel", type: "suffix", quality: "all", nameZh: "珠宝 需求 -15%", nameEn: "of Freedom", range: "需求 -15%", alvl: 1, note: "可搭配 15 全抗或黄珠宝 30 ED/9 力/9 敏" },
  { slot: "charm_jewel", type: "suffix", quality: "all", nameZh: "珠宝 +9 力量 / +9 敏捷", nameEn: "of Virility / Daring", range: "+7–9 力量 · +7–9 敏捷", alvl: 36, note: "黄珠宝四词缀极品：30 ED + 9 力 + 9 敏 + 10 全抗/7 FHR" },
  { slot: "charm_jewel", type: "suffix", quality: "all", nameZh: "珠宝 +7% FHR", nameEn: "of Truth", range: "+7% FHR", alvl: 44, note: "" }
];

export const SIMULATOR_BASES = [
  { id: "amulet", slot: "amulet", label: "项链 (Amulet)", icon: "/images/items/misc/amulet/amulet1.webp", qlvl: 1, magicLvl: 0, supportsCraft: true },
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
  { id: "charm_jewel", slot: "charm_jewel", label: "护身符 / 珠宝", icon: "/images/items/misc/charm/charm_large.webp", qlvl: 1, magicLvl: 0, supportsCraft: false }
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
    affixes: AFFIX_RANGES,
    totalAffixes: AFFIX_RANGES.length
  };
}
