const IMMUNITY_NAMES = {
  f: "火焰",
  c: "冰冷",
  l: "闪电",
  p: "毒素",
  ph: "物理",
  m: "魔法"
};

const IMMUNITY_ICONS = {
  f: "/images/ui/immune_fire.webp",
  c: "/images/ui/immune_ice.webp",
  l: "/images/ui/immune_lightning.webp",
  p: "/images/ui/immune_poison.webp",
  ph: "/images/ui/immune_physical.webp",
  m: "/images/ui/immune_magic.webp"
};

const RATING_NAMES = {
  S: "极佳",
  A: "优秀",
  B: "良好",
  C: "一般",
  F: "较差",
  "S-A": "极佳至优秀"
};

const ACT_MAP = {
  "Blood Moor and Den of Evil": 1,
  "Cold Plains and The Cave": 1,
  "Burial Grounds, Crypt, and Mausoleum": 1,
  "Stony Field": 1,
  "Tristram": 1,
  "Dark Wood and Underground Passage": 1,
  "Black Marsh and The Hole": 1,
  "The Forgotten Tower": 1,
  "The Pit": 1,
  "Jail and Barracks": 1,
  "Cathedral and Catacombs": 1,
  "Moo Moo Farm": 1,
  "Lut Gholein Sewers": 2,
  "Rocky Waste and Stony Tomb": 2,
  "Dry Hills and Halls of the Dead": 2,
  "Far Oasis": 2,
  "Lost City, Valley of Snakes, and Claw Viper Temple": 2,
  "Ancient Tunnels": 2,
  "Arcane Sanctuary": 2,
  "Tal Rasha's Tombs and Tal Rasha's Chamber": 2,
  "Spider Forest and Spider Cavern": 3,
  "Great Marsh": 3,
  "Flayer Jungle and Flayer Dungeon": 3,
  "Kurast Bazaar, Ruined Temple, and Disused Fane": 3,
  "Travincal": 3,
  "Durance of Hate": 3,
  "Outer Steppes and Plains of Despair": 4,
  "River of Flame and City of the Damned": 4,
  "The Chaos Sanctuary": 4,
  "Bloody Foothills, Frigid Highlands, and Abaddon": 5,
  "Glacial Trail and Drifter Cavern": 5,
  "Crystalline Passage and Frozen River": 5,
  "Arreat Plateau and Pit of Acheron": 5,
  "Frozen Tundra and Infernal Pit": 5,
  "Nihlathak's Temple, Halls of Anguish, Halls of Pain, and Halls of Vaught": 5,
  "Ancient's Way and Icy Cellar": 5,
  "Worldstone Keep, Throne of Destruction, and Worldstone Chamber": 5
};

const ZONE_ZH_NAMES = {
  "Blood Moor and Den of Evil": "鲜血荒地与邪恶洞窟",
  "Cold Plains and The Cave": "冰冷之原与洞窟",
  "Burial Grounds, Crypt, and Mausoleum": "埋骨之地、墓地与大陵墓",
  "Stony Field": "石块旷野",
  "Tristram": "崔斯特瑞姆",
  "Dark Wood and Underground Passage": "黑暗森林与地底通道",
  "Black Marsh and The Hole": "黑色荒地与黑洞",
  "The Forgotten Tower": "遗忘之塔",
  "The Pit": "地穴（泰摩高地）",
  "Jail and Barracks": "监牢与军营",
  "Cathedral and Catacombs": "大教堂与地下墓穴",
  "Moo Moo Farm": "秘密奶牛关",
  "Lut Gholein Sewers": "鲁高因下水道",
  "Rocky Waste and Stony Tomb": "碎石荒地与石墓",
  "Dry Hills and Halls of the Dead": "干燥高地与死亡之殿",
  "Far Oasis": "遥远绿洲",
  "Lost City, Valley of Snakes, and Claw Viper Temple": "失落城市、群蛇峡谷与利爪蝮蛇神殿",
  "Ancient Tunnels": "古代通道",
  "Arcane Sanctuary": "神秘避难所",
  "Tal Rasha's Tombs and Tal Rasha's Chamber": "塔·拉夏的古墓与密室",
  "Spider Forest and Spider Cavern": "蜘蛛森林与蜘蛛洞窟",
  "Great Marsh": "庞大湿地",
  "Flayer Jungle and Flayer Dungeon": "剥皮丛林与剥皮地窖",
  "Kurast Bazaar, Ruined Temple, and Disused Fane": "库拉斯特商场、破败神殿与废弃寺院",
  "Travincal": "崔凡克",
  "Durance of Hate": "憎恨囚牢",
  "Outer Steppes and Plains of Despair": "外围荒原与绝望平原",
  "River of Flame and City of the Damned": "火焰之河与诅咒之城",
  "The Chaos Sanctuary": "混沌避难所",
  "Bloody Foothills, Frigid Highlands, and Abaddon": "血腥丘陵、冰冻高地与亚巴顿",
  "Glacial Trail and Drifter Cavern": "冰川小径与漂泊者洞窟",
  "Crystalline Passage and Frozen River": "水晶通道与冰河",
  "Arreat Plateau and Pit of Acheron": "亚瑞特高原与冥河深坑",
  "Frozen Tundra and Infernal Pit": "冰冻苔原与炼狱深坑",
  "Nihlathak's Temple, Halls of Anguish, Halls of Pain, and Halls of Vaught": "尼拉塞克神殿、痛苦之厅、悲痛之厅与沃特之厅",
  "Ancient's Way and Icy Cellar": "先祖之路与冰窖",
  "Worldstone Keep, Throne of Destruction, and Worldstone Chamber": "世界之石要塞、毁灭王座与世界之石大殿"
};

const METADATA = {
  // 第 1 幕
  "Blood Moor and Den of Evil": [["f", "c"], "F"],
  "Cold Plains and The Cave": [["f", "c", "l"], "F"],
  "Burial Grounds, Crypt, and Mausoleum": [["l"], "B"],
  "Stony Field": [["f", "c", "l", "p"], "C"],
  Tristram: [["f", "l", "p"], "B"],
  "Dark Wood and Underground Passage": [["f", "c", "l", "p"], "C"],
  "Black Marsh and The Hole": [["f", "c", "l", "p"], "C"],
  "The Forgotten Tower": [["f", "l", "ph"], "B"],
  "The Pit": [["f", "c", "l"], "A"],
  "Jail and Barracks": [["f", "c", "p", "ph"], "C"],
  "Cathedral and Catacombs": [["f", "c", "l", "ph"], "S"],
  "Moo Moo Farm": [[], "S"],

  // 第 2 幕
  "Lut Gholein Sewers": [["f", "c", "p", "m"], "F"],
  "Rocky Waste and Stony Tomb": [["f", "c", "l", "p", "m"], "B"],
  "Dry Hills and Halls of the Dead": [["f", "c", "l", "p"], "B"],
  "Far Oasis": [["l", "p", "ph"], "F"],
  "Lost City, Valley of Snakes, and Claw Viper Temple": [["f", "c", "l", "p", "m"], "C"],
  "Ancient Tunnels": [["f", "l", "p", "m"], "A"],
  "Arcane Sanctuary": [["f", "c", "l", "p", "ph"], "B"],
  "Tal Rasha's Tombs and Tal Rasha's Chamber": [["f", "c", "l", "p", "m"], "S"],

  // 第 3 幕
  "Spider Forest and Spider Cavern": [["f", "c", "l", "p"], "C"],
  "Great Marsh": [["f", "c", "l"], "F"],
  "Flayer Jungle and Flayer Dungeon": [["f", "c", "l", "p", "ph", "m"], "A"],
  "Kurast Bazaar, Ruined Temple, and Disused Fane": [["f", "c", "l", "p"], "C"],
  Travincal: [["f", "c", "l", "p"], "A"],
  "Durance of Hate": [["f", "c", "l", "p"], "B"],

  // 第 4 幕
  "Outer Steppes and Plains of Despair": [["f", "c", "l", "p"], "B"],
  "River of Flame and City of the Damned": [["f", "c", "l", "p"], "A"],
  "The Chaos Sanctuary": [["f", "c", "l"], "S"],

  // 第 5 幕
  "Bloody Foothills, Frigid Highlands, and Abaddon": [["f", "c", "l", "p", "ph", "m"], "B"],
  "Glacial Trail and Drifter Cavern": [["f", "c", "l", "p", "ph"], "B"],
  "Crystalline Passage and Frozen River": [["f", "c", "l", "p"], "A"],
  "Arreat Plateau and Pit of Acheron": [["f", "c", "l", "p"], "C"],
  "Frozen Tundra and Infernal Pit": [["f", "c", "l", "p"], "C"],
  "Nihlathak's Temple, Halls of Anguish, Halls of Pain, and Halls of Vaught": [["f", "c", "l", "p", "ph", "m"], "A"],
  "Ancient's Way and Icy Cellar": [["c", "l", "p", "ph"], "B"],
  "Worldstone Keep, Throne of Destruction, and Worldstone Chamber": [["f", "c", "l", "p", "ph", "m"], "S"]
};

const ALIASES = {
  "Burial Grounds, The Crypt, and The Mausoleum": "Burial Grounds, Crypt, and Mausoleum",
  "Tamoe Highland, Outer Cloister, and The Pit": "The Pit",
  Jail: "Jail and Barracks",
  Sewers: "Lut Gholein Sewers",
  "City of the Damned and River of Flame": "River of Flame and City of the Damned",
  "Chaos Sanctuary": "The Chaos Sanctuary",
  "Bloody Foothills and Frigid Highlands": "Bloody Foothills, Frigid Highlands, and Abaddon",
  "Tal Rasha's Tombs": "Tal Rasha's Tombs and Tal Rasha's Chamber",
  "Nihlathak's Temple and Temple Halls": "Nihlathak's Temple, Halls of Anguish, Halls of Pain, and Halls of Vaught"
};

export function getTerrorZoneMetadata(zone) {
  const canonical = ALIASES[zone] ?? zone;
  const entry = METADATA[canonical];
  const act = ACT_MAP[canonical] ?? 1;
  const actName = `第 ${["一", "二", "三", "四", "五"][act - 1]} 幕`;
  if (!entry) {
    return { act, actName, immunities: [], rating: null, ratingText: "未评级" };
  }

  const [immunities, rating] = entry;
  return {
    act,
    actName,
    immunities: immunities.map((code) => ({
      code,
      name: IMMUNITY_NAMES[code],
      icon: IMMUNITY_ICONS[code] ?? "/images/ui/immune_physical.webp"
    })),
    rating,
    ratingText: RATING_NAMES[rating] ?? "未评级"
  };
}

export function getAllTerrorZones() {
  return Object.keys(METADATA).map((zone) => {
    const meta = getTerrorZoneMetadata(zone);
    return {
      zone,
      zoneZh: ZONE_ZH_NAMES[zone] ?? zone,
      act: meta.act,
      actName: `第 ${["一", "二", "三", "四", "五"][meta.act - 1]} 幕 (Act ${meta.act})`,
      immunities: meta.immunities,
      rating: meta.rating,
      ratingText: meta.ratingText
    };
  }).sort((a, b) => a.act - b.act || a.zoneZh.localeCompare(b.zoneZh, "zh-CN"));
}
