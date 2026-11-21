import { RUNEWORD_DETAILS } from "./runewords-details.js";
import { ITEM_ICON_MAP } from "./items-icons-map.js";
import { ITEM_I18N_MAP } from "./items-i18n-data.js";

export const RUNES = [
  { number: 1, name: "El", zhName: "艾尔", tier: "low", reqLevel: 11 },
  { number: 2, name: "Eld", zhName: "艾德", tier: "low", reqLevel: 11 },
  { number: 3, name: "Tir", zhName: "提尔", tier: "low", reqLevel: 13 },
  { number: 4, name: "Nef", zhName: "奈夫", tier: "low", reqLevel: 13 },
  { number: 5, name: "Eth", zhName: "艾斯", tier: "low", reqLevel: 15 },
  { number: 6, name: "Ith", zhName: "伊司", tier: "low", reqLevel: 15 },
  { number: 7, name: "Tal", zhName: "塔尔", tier: "low", reqLevel: 17 },
  { number: 8, name: "Ral", zhName: "拉尔", tier: "low", reqLevel: 19 },
  { number: 9, name: "Ort", zhName: "欧特", tier: "low", reqLevel: 21 },
  { number: 10, name: "Thul", zhName: "图尔", tier: "low", reqLevel: 23 },
  { number: 11, name: "Amn", zhName: "安姆", tier: "low", reqLevel: 25 },
  { number: 12, name: "Sol", zhName: "索尔", tier: "mid", reqLevel: 27 },
  { number: 13, name: "Shael", zhName: "沙伊", tier: "mid", reqLevel: 29 },
  { number: 14, name: "Dol", zhName: "多尔", tier: "mid", reqLevel: 31 },
  { number: 15, name: "Hel", zhName: "海尔", tier: "mid", reqLevel: 0 },
  { number: 16, name: "Io", zhName: "艾欧", tier: "mid", reqLevel: 35 },
  { number: 17, name: "Lum", zhName: "卢姆", tier: "mid", reqLevel: 37 },
  { number: 18, name: "Ko", zhName: "科", tier: "mid", reqLevel: 39 },
  { number: 19, name: "Fal", zhName: "法尔", tier: "mid", reqLevel: 41 },
  { number: 20, name: "Lem", zhName: "兰姆", tier: "mid", reqLevel: 43 },
  { number: 21, name: "Pul", zhName: "普尔", tier: "mid", reqLevel: 45 },
  { number: 22, name: "Um", zhName: "乌姆", tier: "high", reqLevel: 47 },
  { number: 23, name: "Mal", zhName: "玛尔", tier: "high", reqLevel: 49 },
  { number: 24, name: "Ist", zhName: "伊司特", tier: "high", reqLevel: 51 },
  { number: 25, name: "Gul", zhName: "古尔", tier: "high", reqLevel: 53 },
  { number: 26, name: "Vex", zhName: "伐克斯", tier: "high", reqLevel: 55 },
  { number: 27, name: "Ohm", zhName: "欧姆", tier: "high", reqLevel: 57 },
  { number: 28, name: "Lo", zhName: "罗", tier: "high", reqLevel: 59 },
  { number: 29, name: "Sur", zhName: "瑟", tier: "high", reqLevel: 61 },
  { number: 30, name: "Ber", zhName: "贝", tier: "high", reqLevel: 63 },
  { number: 31, name: "Jah", zhName: "扎哈", tier: "high", reqLevel: 65 },
  { number: 32, name: "Cham", zhName: "查姆", tier: "high", reqLevel: 67 },
  { number: 33, name: "Zod", zhName: "佐德", tier: "high", reqLevel: 69 }
];

export const RUNES_WITH_ICONS = RUNES.map((rune) => ({
  ...rune,
  icon: ITEM_ICON_MAP["r" + String(rune.number).padStart(2, "0")] || null,
  i18n: ITEM_I18N_MAP[rune.name] || null
}));

const RUNE_BY_NAME = new Map(RUNES.map((rune) => [rune.name, rune]));

// 官方全部 99 种符文之语（适配 D2R 3.4 术士君临版本：含 1.09 / 1.10 / 1.11 / 2.4 / 2.6 / 术士君临 RotW）
// 兼容多种底材（如 武器/盾牌、盔甲/盾牌）的符文之语合并为同一栏，符文只统计一次。
// 3.0+ 将原 Hustle 拆分为 Mania（武器）与 Hysteria（盔甲）两个独立符文之语。
export const RUNEWORDS = [
  // Patch 1.09 (24)
  { id: "ancients-pledge", name: "Ancient's Pledge", zhName: "远古契约", patch: "1.09", sockets: 3, types: ["shield"], basesZh: "盾牌", runes: ["Ral", "Ort", "Tal"] },
  { id: "black", name: "Black", zhName: "黑色", patch: "1.09", sockets: 3, types: ["weapon"], basesZh: "棍棒 / 锤 / 钉头锤", runes: ["Thul", "Io", "Nef"] },
  { id: "fury", name: "Fury", zhName: "狂怒", patch: "1.09", sockets: 3, types: ["weapon"], basesZh: "近战武器", runes: ["Jah", "Gul", "Eth"] },
  { id: "holy-thunder", name: "Holy Thunder", zhName: "神圣雷击", patch: "1.09", sockets: 4, types: ["weapon"], basesZh: "权杖", runes: ["Eth", "Ral", "Ort", "Tal"] },
  { id: "honor", name: "Honor", zhName: "荣耀", patch: "1.09", sockets: 5, types: ["weapon"], basesZh: "近战武器", runes: ["Amn", "El", "Ith", "Tir", "Sol"] },
  { id: "kings-grace", name: "King's Grace", zhName: "王者之恩", patch: "1.09", sockets: 3, types: ["weapon"], basesZh: "剑 / 权杖", runes: ["Amn", "Ral", "Thul"] },
  { id: "leaf", name: "Leaf", zhName: "叶子", patch: "1.09", sockets: 2, types: ["weapon"], basesZh: "双手法杖", runes: ["Tir", "Ral"] },
  { id: "lionheart", name: "Lionheart", zhName: "狮心", patch: "1.09", sockets: 3, types: ["armor"], basesZh: "盔甲", runes: ["Hel", "Lum", "Fal"] },
  { id: "lore", name: "Lore", zhName: "知识", patch: "1.09", sockets: 2, types: ["helm"], basesZh: "头盔", runes: ["Ort", "Sol"] },
  { id: "malice", name: "Malice", zhName: "怨恨", patch: "1.09", sockets: 3, types: ["weapon"], basesZh: "近战武器", runes: ["Ith", "El", "Eth"] },
  { id: "melody", name: "Melody", zhName: "旋律", patch: "1.09", sockets: 3, types: ["weapon"], basesZh: "远程武器", runes: ["Shael", "Ko", "Nef"] },
  { id: "memory", name: "Memory", zhName: "回忆", patch: "1.09", sockets: 4, types: ["weapon"], basesZh: "双手法杖", runes: ["Lum", "Io", "Sol", "Eth"] },
  { id: "nadir", name: "Nadir", zhName: "天底", patch: "1.09", sockets: 2, types: ["helm"], basesZh: "头盔", runes: ["Nef", "Tir"] },
  { id: "radiance", name: "Radiance", zhName: "光辉", patch: "1.09", sockets: 3, types: ["helm"], basesZh: "头盔", runes: ["Nef", "Sol", "Ith"] },
  { id: "rhyme", name: "Rhyme", zhName: "韵律", patch: "1.09", sockets: 2, types: ["shield"], basesZh: "盾牌", runes: ["Shael", "Eth"] },
  { id: "silence", name: "Silence", zhName: "沉默", patch: "1.09", sockets: 6, types: ["weapon"], basesZh: "武器", runes: ["Dol", "Eld", "Hel", "Ist", "Tir", "Vex"] },
  { id: "smoke", name: "Smoke", zhName: "烟雾", patch: "1.09", sockets: 2, types: ["armor"], basesZh: "盔甲", runes: ["Nef", "Lum"] },
  { id: "stealth", name: "Stealth", zhName: "隐秘", patch: "1.09", sockets: 2, types: ["armor"], basesZh: "盔甲", runes: ["Tal", "Eth"] },
  { id: "steel", name: "Steel", zhName: "钢铁", patch: "1.09", sockets: 2, types: ["weapon"], basesZh: "剑 / 斧 / 钉头锤", runes: ["Tir", "El"] },
  { id: "strength", name: "Strength", zhName: "力量", patch: "1.09", sockets: 2, types: ["weapon"], basesZh: "近战武器", runes: ["Amn", "Tir"] },
  { id: "venom", name: "Venom", zhName: "毒牙", patch: "1.09", sockets: 3, types: ["weapon"], basesZh: "武器", runes: ["Tal", "Dol", "Mal"] },
  { id: "wealth", name: "Wealth", zhName: "财富", patch: "1.09", sockets: 3, types: ["armor"], basesZh: "盔甲", runes: ["Lem", "Ko", "Tir"] },
  { id: "white", name: "White", zhName: "白色", patch: "1.09", sockets: 2, types: ["weapon"], basesZh: "死灵法杖", runes: ["Dol", "Io"] },
  { id: "zephyr", name: "Zephyr", zhName: "微风", patch: "1.09", sockets: 2, types: ["weapon"], basesZh: "远程武器", runes: ["Ort", "Eth"] },

  // Patch 1.10 (47)
  { id: "beast", name: "Beast", zhName: "野兽", patch: "1.10", sockets: 5, types: ["weapon"], basesZh: "斧 / 权杖 / 锤", runes: ["Ber", "Tir", "Um", "Mal", "Lum"] },
  { id: "bramble", name: "Bramble", zhName: "荆棘", patch: "1.10", sockets: 4, types: ["armor"], basesZh: "盔甲", runes: ["Ral", "Ohm", "Sur", "Eth"] },
  { id: "brand", name: "Brand", zhName: "品牌", patch: "1.10", sockets: 4, types: ["weapon"], basesZh: "远程武器", runes: ["Jah", "Lo", "Mal", "Gul"] },
  { id: "breath-of-the-dying", name: "Breath of the Dying", zhName: "死亡呼吸", patch: "1.10", sockets: 6, types: ["weapon"], basesZh: "武器", runes: ["Vex", "Hel", "El", "Eld", "Zod", "Eth"] },
  { id: "call-to-arms", name: "Call to Arms", zhName: "战争召唤", patch: "1.10", sockets: 5, types: ["weapon"], basesZh: "武器", runes: ["Amn", "Ral", "Mal", "Ist", "Ohm"] },
  { id: "chains-of-honor", name: "Chains of Honor", zhName: "荣耀之链", patch: "1.10", sockets: 4, types: ["armor"], basesZh: "盔甲", runes: ["Dol", "Um", "Ber", "Ist"] },
  { id: "chaos", name: "Chaos", zhName: "混沌", patch: "1.10", sockets: 3, types: ["weapon"], basesZh: "爪", runes: ["Fal", "Ohm", "Um"] },
  { id: "crescent-moon", name: "Crescent Moon", zhName: "新月", patch: "1.10", sockets: 3, types: ["weapon"], basesZh: "斧 / 剑 / 长柄", runes: ["Shael", "Um", "Tir"] },
  { id: "death", name: "Death", zhName: "死神", patch: "1.10", sockets: 5, types: ["weapon"], basesZh: "剑 / 斧", runes: ["Hel", "El", "Vex", "Ort", "Gul"] },
  { id: "delirium", name: "Delirium", zhName: "迪勒瑞姆", patch: "1.10", sockets: 3, types: ["helm"], basesZh: "头盔", runes: ["Lem", "Ist", "Io"] },
  { id: "destruction", name: "Destruction", zhName: "毁灭", patch: "1.10", sockets: 5, types: ["weapon"], basesZh: "长柄 / 剑", runes: ["Vex", "Lo", "Ber", "Jah", "Ko"] },
  { id: "doom", name: "Doom", zhName: "末日", patch: "1.10", sockets: 5, types: ["weapon"], basesZh: "斧 / 长柄 / 锤", runes: ["Hel", "Ohm", "Um", "Lo", "Cham"] },
  { id: "dragon", name: "Dragon", zhName: "飞龙", patch: "1.10", sockets: 3, types: ["armor", "shield"], basesZh: "盔甲 / 盾牌", runes: ["Sur", "Lo", "Sol"] },
  { id: "dream", name: "Dream", zhName: "梦境", patch: "1.10", sockets: 3, types: ["helm", "shield"], basesZh: "头盔 / 盾牌", runes: ["Io", "Jah", "Pul"] },
  { id: "duress", name: "Duress", zhName: "强制", patch: "1.10", sockets: 3, types: ["armor"], basesZh: "盔甲", runes: ["Shael", "Um", "Thul"] },
  { id: "edge", name: "Edge", zhName: "边缘", patch: "1.10", sockets: 3, types: ["weapon"], basesZh: "远程武器", runes: ["Tir", "Tal", "Amn"] },
  { id: "enigma", name: "Enigma", zhName: "谜团", patch: "1.10", sockets: 3, types: ["armor"], basesZh: "盔甲", runes: ["Jah", "Ith", "Ber"] },
  { id: "eternity", name: "Eternity", zhName: "永恒", patch: "1.10", sockets: 5, types: ["weapon"], basesZh: "近战武器 / 弓弩", runes: ["Amn", "Ber", "Ist", "Sol", "Sur"], ladderStatus: "ladder-rework", note: "3.4 赛季/离线重做：新增弓弩底材与强力属性，非赛保留旧版" },
  { id: "exile", name: "Exile", zhName: "流亡", patch: "1.10", sockets: 4, types: ["shield"], basesZh: "圣骑士盾", runes: ["Vex", "Ohm", "Ist", "Dol"] },
  { id: "faith", name: "Faith", zhName: "信心", patch: "1.10", sockets: 4, types: ["weapon"], basesZh: "远程武器", runes: ["Ohm", "Jah", "Lem", "Eld"] },
  { id: "famine", name: "Famine", zhName: "饥荒", patch: "1.10", sockets: 4, types: ["weapon"], basesZh: "斧 / 锤", runes: ["Fal", "Ohm", "Ort", "Jah"] },
  { id: "fortitude", name: "Fortitude", zhName: "刚毅", patch: "1.10", sockets: 4, types: ["weapon", "armor"], basesZh: "武器 / 盔甲", runes: ["El", "Sol", "Dol", "Lo"] },
  { id: "gloom", name: "Gloom", zhName: "幽暗", patch: "1.10", sockets: 3, types: ["armor"], basesZh: "盔甲", runes: ["Fal", "Um", "Pul"] },
  { id: "grief", name: "Grief", zhName: "悔恨", patch: "1.10", sockets: 5, types: ["weapon"], basesZh: "剑 / 斧", runes: ["Eth", "Tir", "Lo", "Mal", "Ral"] },
  { id: "hand-of-justice", name: "Hand of Justice", zhName: "正义之手", patch: "1.10", sockets: 4, types: ["weapon"], basesZh: "武器", runes: ["Sur", "Cham", "Amn", "Lo"] },
  { id: "harmony", name: "Harmony", zhName: "和谐", patch: "1.10", sockets: 4, types: ["weapon"], basesZh: "远程武器", runes: ["Tir", "Ith", "Sol", "Ko"] },
  { id: "heart-of-the-oak", name: "Heart of the Oak", zhName: "橡树之心", patch: "1.10", sockets: 4, types: ["weapon"], basesZh: "双手法杖 / 钉头锤", runes: ["Ko", "Vex", "Pul", "Thul"] },
  { id: "ice", name: "Ice", zhName: "冰冻", patch: "1.10", sockets: 4, types: ["weapon"], basesZh: "远程武器", runes: ["Amn", "Shael", "Jah", "Lo"] },
  { id: "infinity", name: "Infinity", zhName: "无限", patch: "1.10", sockets: 4, types: ["weapon"], basesZh: "长柄 / 矛", runes: ["Ber", "Mal", "Ber", "Ist"] },
  { id: "insight", name: "Insight", zhName: "眼光", patch: "1.10", sockets: 4, types: ["weapon"], basesZh: "长柄 / 双手法杖 / 弓弩", runes: ["Ral", "Tir", "Tal", "Sol"] },
  { id: "kingslayer", name: "Kingslayer", zhName: "弑君者", patch: "1.10", sockets: 4, types: ["weapon"], basesZh: "剑 / 斧", runes: ["Mal", "Um", "Gul", "Fal"] },
  { id: "last-wish", name: "Last Wish", zhName: "最后希望", patch: "1.10", sockets: 6, types: ["weapon"], basesZh: "剑 / 锤 / 斧", runes: ["Jah", "Mal", "Jah", "Sur", "Jah", "Ber"] },
  { id: "lawbringer", name: "Lawbringer", zhName: "执法者", patch: "1.10", sockets: 3, types: ["weapon"], basesZh: "剑 / 锤 / 权杖", runes: ["Amn", "Lem", "Ko"] },
  { id: "oath", name: "Oath", zhName: "誓约", patch: "1.10", sockets: 4, types: ["weapon"], basesZh: "剑 / 斧 / 钉头锤", runes: ["Shael", "Pul", "Mal", "Lum"] },
  { id: "obedience", name: "Obedience", zhName: "遵从", patch: "1.10", sockets: 5, types: ["weapon"], basesZh: "长柄 / 矛", runes: ["Hel", "Ko", "Thul", "Eth", "Fal"] },
  { id: "passion", name: "Passion", zhName: "热情", patch: "1.10", sockets: 4, types: ["weapon"], basesZh: "武器", runes: ["Dol", "Ort", "Eld", "Lem"] },
  { id: "phoenix", name: "Phoenix", zhName: "凤凰", patch: "1.10", sockets: 4, types: ["weapon", "shield"], basesZh: "武器 / 盾牌", runes: ["Vex", "Vex", "Lo", "Jah"] },
  { id: "pride", name: "Pride", zhName: "骄傲", patch: "1.10", sockets: 4, types: ["weapon"], basesZh: "长柄 / 矛", runes: ["Cham", "Sur", "Io", "Lo"] },
  { id: "prudence", name: "Prudence", zhName: "审慎", patch: "1.10", sockets: 2, types: ["armor"], basesZh: "盔甲", runes: ["Mal", "Tir"] },
  { id: "rift", name: "Rift", zhName: "裂缝", patch: "1.10", sockets: 4, types: ["weapon"], basesZh: "长柄 / 权杖", runes: ["Hel", "Ko", "Lem", "Gul"] },
  { id: "sanctuary", name: "Sanctuary", zhName: "圣堂", patch: "1.10", sockets: 3, types: ["shield"], basesZh: "盾牌", runes: ["Ko", "Ko", "Mal"] },
  { id: "spirit", name: "Spirit", zhName: "精神", patch: "1.10", sockets: 4, types: ["weapon", "shield"], basesZh: "剑 / 盾牌", runes: ["Tal", "Thul", "Ort", "Amn"] },
  { id: "splendor", name: "Splendor", zhName: "辉煌", patch: "1.10", sockets: 2, types: ["shield"], basesZh: "盾牌", runes: ["Eth", "Lum"] },
  { id: "stone", name: "Stone", zhName: "石块", patch: "1.10", sockets: 4, types: ["armor"], basesZh: "盔甲", runes: ["Shael", "Um", "Pul", "Lum"] },
  { id: "voice-of-reason", name: "Voice of Reason", zhName: "理性之声", patch: "1.10", sockets: 4, types: ["weapon"], basesZh: "剑 / 钉头锤", runes: ["Lem", "Ko", "El", "Eld"] },
  { id: "wind", name: "Wind", zhName: "风", patch: "1.10", sockets: 2, types: ["weapon"], basesZh: "近战武器", runes: ["Sur", "El"] },
  { id: "wrath", name: "Wrath", zhName: "愤怒", patch: "1.10", sockets: 4, types: ["weapon"], basesZh: "远程武器", runes: ["Pul", "Lum", "Ber", "Mal"] },

  // Patch 1.11 (7)
  { id: "bone", name: "Bone", zhName: "白骨", patch: "1.11", sockets: 3, types: ["armor"], basesZh: "盔甲", runes: ["Sol", "Um", "Um"] },
  { id: "enlightenment", name: "Enlightenment", zhName: "启迪", patch: "1.11", sockets: 3, types: ["armor"], basesZh: "盔甲", runes: ["Pul", "Ral", "Sol"] },
  { id: "myth", name: "Myth", zhName: "神话", patch: "1.11", sockets: 3, types: ["armor"], basesZh: "盔甲", runes: ["Hel", "Amn", "Nef"] },
  { id: "peace", name: "Peace", zhName: "和平", patch: "1.11", sockets: 3, types: ["armor"], basesZh: "盔甲", runes: ["Shael", "Thul", "Amn"] },
  { id: "principle", name: "Principle", zhName: "原则", patch: "1.11", sockets: 3, types: ["armor"], basesZh: "盔甲", runes: ["Ral", "Gul", "Eld"] },
  { id: "rain", name: "Rain", zhName: "雨", patch: "1.11", sockets: 3, types: ["armor"], basesZh: "盔甲", runes: ["Ort", "Mal", "Ith"] },
  { id: "treachery", name: "Treachery", zhName: "背信", patch: "1.11", sockets: 3, types: ["armor"], basesZh: "盔甲", runes: ["Shael", "Thul", "Lem"] },

  // Patch 2.4 (7)
  { id: "flickering-flame", name: "Flickering Flame", zhName: "闪烁火焰", patch: "2.4", sockets: 3, types: ["helm"], basesZh: "头盔", runes: ["Nef", "Pul", "Vex"] },
  { id: "mist", name: "Mist", zhName: "迷雾", patch: "2.4", sockets: 5, types: ["weapon"], basesZh: "远程武器", runes: ["Cham", "Shael", "Gul", "Thul", "Ith"] },
  { id: "obsession", name: "Obsession", zhName: "执念", patch: "2.4", sockets: 6, types: ["weapon"], basesZh: "双手法杖", runes: ["Zod", "Ist", "Lem", "Lum", "Io", "Nef"] },
  { id: "pattern", name: "Pattern", zhName: "花纹", patch: "2.4", sockets: 3, types: ["weapon"], basesZh: "爪", runes: ["Tal", "Ort", "Thul"] },
  { id: "plague", name: "Plague", zhName: "瘟疫", patch: "2.4", sockets: 3, types: ["weapon"], basesZh: "剑 / 爪 / 匕首", runes: ["Cham", "Shael", "Um"] },
  { id: "unbending-will", name: "Unbending Will", zhName: "不屈意志", patch: "2.4", sockets: 6, types: ["weapon"], basesZh: "剑", runes: ["Fal", "Io", "Ith", "Eld", "El", "Hel"] },
  { id: "wisdom", name: "Wisdom", zhName: "智慧", patch: "2.4", sockets: 3, types: ["helm"], basesZh: "头盔", runes: ["Pul", "Ith", "Eld"] },

  // Patch 2.6 -> 3.0+ (9: 原 Hustle 在 3.0 拆分为 Mania 与 Hysteria)
  { id: "bulwark", name: "Bulwark", zhName: "壁垒", patch: "2.6", sockets: 3, types: ["helm"], basesZh: "头盔", runes: ["Shael", "Io", "Sol"], ladderStatus: "unlocked" },
  { id: "cure", name: "Cure", zhName: "治愈", patch: "2.6", sockets: 3, types: ["helm"], basesZh: "头盔", runes: ["Shael", "Io", "Tal"], ladderStatus: "unlocked" },
  { id: "ground", name: "Ground", zhName: "大地", patch: "2.6", sockets: 3, types: ["helm"], basesZh: "头盔", runes: ["Shael", "Io", "Ort"], ladderStatus: "unlocked" },
  { id: "hearth", name: "Hearth", zhName: "炉火", patch: "2.6", sockets: 3, types: ["helm"], basesZh: "头盔", runes: ["Shael", "Io", "Thul"], ladderStatus: "unlocked" },
  { id: "mania", name: "Mania", zhName: "狂热", patch: "2.6", sockets: 3, types: ["weapon"], basesZh: "武器", runes: ["Shael", "Ko", "Eld"], ladderStatus: "unlocked", note: "3.0+ 由原 Hustle（喧嚣）武器版拆分重命名" },
  { id: "hysteria", name: "Hysteria", zhName: "歇斯底里", patch: "2.6", sockets: 3, types: ["armor"], basesZh: "盔甲", runes: ["Shael", "Ko", "Eld"], ladderStatus: "unlocked", note: "3.0+ 由原 Hustle（喧嚣）盔甲版拆分重命名" },
  { id: "metamorphosis", name: "Metamorphosis", zhName: "变形", patch: "2.6", sockets: 3, types: ["helm"], basesZh: "德鲁伊头盔", runes: ["Io", "Cham", "Fal"], ladderStatus: "unlocked" },
  { id: "mosaic", name: "Mosaic", zhName: "马赛克", patch: "2.6", sockets: 3, types: ["weapon"], basesZh: "爪", runes: ["Mal", "Gul", "Amn"], ladderStatus: "unlocked" },
  { id: "temper", name: "Temper", zhName: "淬火", patch: "2.6", sockets: 3, types: ["helm"], basesZh: "头盔", runes: ["Shael", "Io", "Ral"], ladderStatus: "unlocked" },

  // Reign of the Warlock / 术士君临 (5)
  { id: "authority", name: "Authority", zhName: "权威", patch: "RotW", sockets: 3, types: ["armor"], basesZh: "盔甲", runes: ["Hel", "Shael", "Ral"], ladderStatus: "rotw" },
  { id: "coven", name: "Coven", zhName: "女巫团", patch: "RotW", sockets: 3, types: ["helm"], basesZh: "头盔", runes: ["Ist", "Ral", "Io"], ladderStatus: "rotw" },
  { id: "ritual", name: "Ritual", zhName: "仪式", patch: "RotW", sockets: 3, types: ["weapon"], basesZh: "匕首", runes: ["Amn", "Shael", "Ohm"], ladderStatus: "rotw" },
  { id: "vigilance", name: "Vigilance", zhName: "警戒", patch: "RotW", sockets: 2, types: ["shield"], basesZh: "盾牌 / 死灵盾 / 术士魔典", runes: ["Dol", "Gul"], ladderStatus: "rotw" },
  { id: "void", name: "Void", zhName: "虚空", patch: "RotW", sockets: 3, types: ["weapon"], basesZh: "匕首", runes: ["Thul", "Zod", "Ist"], ladderStatus: "rotw" }
];

export function calculateRuneCounts(runewords = RUNEWORDS, completedIds = new Set()) {
  const totalCounts = Object.fromEntries(RUNES.map((rune) => [rune.name, 0]));
  const remainingCounts = Object.fromEntries(RUNES.map((rune) => [rune.name, 0]));
  let totalRunesNeeded = 0;
  let remainingRunesNeeded = 0;
  let completedRunewords = 0;

  for (const rw of runewords) {
    const isCompleted = completedIds.has(rw.id);
    if (isCompleted) {
      completedRunewords += 1;
    }
    for (const runeName of rw.runes) {
      if (!(runeName in totalCounts)) {
        throw new Error(`未知符文名称: ${runeName}`);
      }
      totalCounts[runeName] += 1;
      totalRunesNeeded += 1;
      if (!isCompleted) {
        remainingCounts[runeName] += 1;
        remainingRunesNeeded += 1;
      }
    }
  }

  return {
    totalRunewords: runewords.length,
    completedRunewords,
    totalRunesNeeded,
    remainingRunesNeeded,
    runes: RUNES.map((rune) => ({
      ...rune,
      total: totalCounts[rune.name],
      remaining: remainingCounts[rune.name],
      completed: totalCounts[rune.name] - remainingCounts[rune.name]
    }))
  };
}

const LADDER_STATUS_LABELS = {
  universal: "非赛/赛季通用",
  unlocked: "非赛已解锁 (原赛季)",
  rotw: "术士君临 DLC (非赛/赛季)",
  "ladder-rework": "3.4 赛季/离线重做"
};

export function getRunewordsCatalog() {
  const summary = calculateRuneCounts(RUNEWORDS);
  return {
    version: "3.4",
    runes: summary.runes.map((rune) => ({
      ...rune,
      icon: ITEM_ICON_MAP["r" + String(rune.number).padStart(2, "0")] || null,
      i18n: ITEM_I18N_MAP[rune.name] || null
    })),
    runewords: RUNEWORDS.map((rw) => {
      const ladderStatus = rw.ladderStatus || "universal";
      const detail = RUNEWORD_DETAILS[rw.id] || {};
      return {
        ...rw,
        i18n: ITEM_I18N_MAP[rw.name] || null,
        ladderStatus,
        ladderLabel: LADDER_STATUS_LABELS[ladderStatus] || LADDER_STATUS_LABELS.universal,
        reqLevel: Math.max(...rw.runes.map((r) => RUNE_BY_NAME.get(r)?.reqLevel || 0)),
        stats: detail.stats || null,
        statGroups: detail.statGroups || null
      };
    }),
    totalRunewords: summary.totalRunewords,
    totalRunesNeeded: summary.totalRunesNeeded
  };
}
