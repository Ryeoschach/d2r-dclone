const ZONE_NAMES = {
  "Blood Moor and Den of Evil": "鲜血荒地与邪恶洞窟",
  "Cold Plains and The Cave": "冰冷之原与洞窟",
  "Burial Grounds, The Crypt, and The Mausoleum": "埋骨之地、墓穴与大陵寝",
  "Stony Field": "石块旷野",
  "Dark Wood and Underground Passage": "黑暗森林与地底通道",
  "Black Marsh and The Hole": "黑色荒地与地洞",
  "The Forgotten Tower": "遗忘之塔",
  "Jail": "监牢",
  "Cathedral and Catacombs": "大教堂与地下墓穴",
  "The Pit": "地穴",
  "Tristram": "崔斯特瑞姆",
  "Moo Moo Farm": "秘密奶牛关",
  "Sewers": "下水道",
  "Rocky Waste and Stony Tomb": "碎石荒地与石制古墓",
  "Dry Hills and Halls of the Dead": "干燥高地与死亡之殿",
  "Far Oasis": "遥远绿洲",
  "Lost City, Valley of Snakes, and Claw Viper Temple": "遗失城市、群蛇峡谷与利爪蝮蛇神殿",
  "Ancient Tunnels": "古代通道",
  "Arcane Sanctuary": "神秘避难所",
  "Tal Rasha's Tombs": "塔拉夏古墓群",
  "Spider Forest and Spider Cavern": "蜘蛛森林与蜘蛛洞窟",
  "Great Marsh": "庞大湿地",
  "Flayer Jungle and Flayer Dungeon": "剥皮丛林与剥皮地窖",
  "Kurast Bazaar, Ruined Temple, and Disused Fane": "库拉斯特商场、残破神殿与废弃圣堂",
  "Travincal": "崔凡克",
  "Durance of Hate": "憎恨囚牢",
  "Outer Steppes and Plains of Despair": "郊外草原与绝望平原",
  "City of the Damned and River of Flame": "诅咒之城与火焰之河",
  "Chaos Sanctuary": "混沌避难所",
  "Bloody Foothills and Frigid Highlands": "血腥丘陵与冰冻高地",
  "Arreat Plateau and Pit of Acheron": "亚瑞特高原与亚巴顿深坑",
  "Crystalline Passage and Frozen River": "水晶通道与冰河",
  "Glacial Trail and Drifter Cavern": "冰川路径与漂泊者洞窟",
  "Nihlathak's Temple, Halls of Anguish, Halls of Pain, and Halls of Vaught": "尼拉塞克神殿、苦痛之厅、悲痛之厅与沃特之厅",
  "Ancient's Way and Icy Cellar": "远古之路与冰窖",
  "Worldstone Keep, Throne of Destruction, and Worldstone Chamber": "世界之石要塞、毁灭王座与世界之石大殿"
};

export function translateTerrorZone(zone) {
  return ZONE_NAMES[zone] ?? zone ?? "未知区域";
}

export function normalizeTerrorZone(payload, checkedAt = new Date().toISOString()) {
  const current = payload?.currentTerrorZone?.zone ?? payload?.current;
  const next = payload?.nextTerrorZone?.zone ?? payload?.next;
  if (!current || !next) {
    throw new Error("恐怖区域接口返回格式不正确");
  }

  return {
    current,
    currentZh: translateTerrorZone(current),
    next,
    nextZh: translateTerrorZone(next),
    checkedAt
  };
}

export async function fetchTerrorZone(env, fetchImpl = fetch) {
  const response = await fetchImpl(
    env.TERROR_ZONE_API_URL ??
      "https://d2runewizard.com/api/trackers/terror-zone",
    { headers: { accept: "application/json" } }
  );
  if (!response.ok) {
    throw new Error(`恐怖区域接口请求失败：HTTP ${response.status}`);
  }
  return normalizeTerrorZone(await response.json());
}
