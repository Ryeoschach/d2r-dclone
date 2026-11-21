import { getTerrorZoneMetadata } from "./terror-zone-metadata.js";

const ZONE_NAMES = {
  "Blood Moor and Den of Evil": "鲜血荒地与邪恶洞窟",
  "Cold Plains and The Cave": "冰冷之原与洞窟",
  "Burial Grounds, The Crypt, and The Mausoleum": "埋骨之地、墓地与大陵墓",
  "Burial Grounds, Crypt, and Mausoleum": "埋骨之地、墓地与大陵墓",
  "Stony Field": "石块旷野",
  "Dark Wood and Underground Passage": "黑暗森林与地底通道",
  "Black Marsh and The Hole": "黑色荒地与黑洞",
  "The Forgotten Tower": "遗忘之塔",
  "Jail": "监牢",
  "Jail and Barracks": "监牢与军营",
  "Cathedral and Catacombs": "大教堂与地下墓穴",
  "The Pit": "地穴",
  "Tamoe Highland, Outer Cloister, and The Pit": "泰摩高地、外侧回廊与地穴",
  "Tristram": "崔斯特瑞姆",
  "Moo Moo Farm": "秘密奶牛关",
  "Sewers": "下水道",
  "Lut Gholein Sewers": "鲁高因下水道",
  "Rocky Waste and Stony Tomb": "碎石荒地与石墓",
  "Dry Hills and Halls of the Dead": "干燥高地与死亡之殿",
  "Far Oasis": "遥远绿洲",
  "Lost City, Valley of Snakes, and Claw Viper Temple": "失落城市、群蛇峡谷与利爪蝮蛇神殿",
  "Ancient Tunnels": "古代通道",
  "Arcane Sanctuary": "神秘避难所",
  "Tal Rasha's Tombs": "塔·拉夏的古墓",
  "Tal Rasha's Tombs and Tal Rasha's Chamber": "塔·拉夏的古墓与密室",
  "Spider Forest and Spider Cavern": "蜘蛛森林与蜘蛛洞窟",
  "Great Marsh": "庞大湿地",
  "Flayer Jungle and Flayer Dungeon": "剥皮丛林与剥皮地窖",
  "Kurast Bazaar, Ruined Temple, and Disused Fane": "库拉斯特商场、破败神殿与废弃寺院",
  "Travincal": "崔凡克",
  "Durance of Hate": "憎恨囚牢",
  "Outer Steppes and Plains of Despair": "外围荒原与绝望平原",
  "City of the Damned and River of Flame": "诅咒之城与火焰之河",
  "River of Flame and City of the Damned": "火焰之河与诅咒之城",
  "Chaos Sanctuary": "混沌避难所",
  "The Chaos Sanctuary": "混沌避难所",
  "Bloody Foothills and Frigid Highlands": "血腥丘陵与冰冻高地",
  "Bloody Foothills, Frigid Highlands, and Abaddon": "血腥丘陵、冰冻高地与亚巴顿",
  "Arreat Plateau and Pit of Acheron": "亚瑞特高原与冥河深坑",
  "Frozen Tundra and Infernal Pit": "冰冻苔原与炼狱深坑",
  "Crystalline Passage and Frozen River": "水晶通道与冰河",
  "Glacial Trail and Drifter Cavern": "冰川小径与漂泊者洞窟",
  "Nihlathak's Temple, Halls of Anguish, Halls of Pain, and Halls of Vaught": "尼拉塞克神殿、痛苦之厅、悲痛之厅与沃特之厅",
  "Nihlathak's Temple and Temple Halls": "尼拉塞克神殿与神殿大厅",
  "Ancient's Way and Icy Cellar": "先祖之路与冰窖",
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
    schemaVersion: 3,
    current,
    currentZh: translateTerrorZone(current),
    currentDetails: getTerrorZoneMetadata(current),
    next,
    nextZh: translateTerrorZone(next),
    nextDetails: getTerrorZoneMetadata(next),
    checkedAt
  };
}

export function enrichTerrorZone(terrorZone) {
  if (!terrorZone) {
    return terrorZone;
  }
  const migrated = terrorZone.schemaVersion === 2
    ? {
        ...terrorZone,
        schemaVersion: 3,
        current: terrorZone.previous ?? terrorZone.current,
        next: terrorZone.current
      }
    : { ...terrorZone, schemaVersion: 3 };
  return {
    ...migrated,
    currentZh: translateTerrorZone(migrated.current),
    currentDetails: getTerrorZoneMetadata(migrated.current),
    nextZh: translateTerrorZone(migrated.next),
    nextDetails: getTerrorZoneMetadata(migrated.next)
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

export function halfHourBucket(timestamp) {
  return Math.floor(timestamp / (30 * 60 * 1000));
}

export function isTerrorZonePeriodStale(terrorZone, now = Date.now()) {
  const checkedAt = Date.parse(terrorZone?.checkedAt);
  return Number.isFinite(checkedAt) &&
    halfHourBucket(now) > halfHourBucket(checkedAt);
}

export function isTerrorZonePullDue(terrorZone, now = Date.now()) {
  if (!terrorZone?.checkedAt) {
    return true;
  }

  // The upstream can remain stale for several minutes after the boundary.
  // Unchanged responses do not consume a KV put.
  return new Date(now).getUTCMinutes() % 30 < 10;
}

export function appendTerrorZoneHistory(history = [], terrorZone, checkedAt = new Date().toISOString()) {
  if (!terrorZone?.current) {
    return Array.isArray(history) ? history : [];
  }

  const list = Array.isArray(history) ? [...history] : [];
  const checkedTime = new Date(checkedAt).getTime();
  const currentBucket = halfHourBucket(checkedTime);

  const existingIndex = list.findIndex((item) => {
    const itemTime = new Date(item.checkedAt ?? item.time).getTime();
    return halfHourBucket(itemTime) === currentBucket;
  });

  const record = {
    zone: terrorZone.current,
    zoneZh: terrorZone.currentZh ?? translateTerrorZone(terrorZone.current),
    time: checkedAt,
    checkedAt,
    act: terrorZone.currentDetails?.act ?? 1,
    actName: terrorZone.currentDetails?.actName ?? "第 一 幕",
    immunities: terrorZone.currentDetails?.immunities ?? [],
    rating: terrorZone.currentDetails?.rating ?? null,
    ratingText: terrorZone.currentDetails?.ratingText ?? "未评级"
  };

  if (existingIndex >= 0) {
    list[existingIndex] = record;
  } else {
    list.unshift(record);
  }

  return list.slice(0, 100);
}
