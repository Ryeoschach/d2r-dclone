const IMMUNITY_NAMES = {
  f: "火焰",
  c: "冰冷",
  l: "闪电",
  p: "毒素",
  ph: "物理",
  m: "魔法"
};

const RATING_NAMES = {
  S: "极佳",
  A: "优秀",
  F: "较差",
  "S-A": "极佳至优秀"
};

const METADATA = {
  "Blood Moor and Den of Evil": [["f", "c"], "F"],
  "Cold Plains and The Cave": [["f", "c", "l"], "F"],
  "Burial Grounds, Crypt, and Mausoleum": [["l"], "F"],
  "Stony Field": [["f", "c", "l", "p"], "F"],
  Tristram: [["f", "l", "p"], "F"],
  "Dark Wood and Underground Passage": [["f", "c", "l", "p"], null],
  "Black Marsh and The Hole": [["f", "c", "l", "p"], null],
  "The Forgotten Tower": [["f", "l", "ph"], "A"],
  "The Pit": [["f", "c", "l"], "S-A"],
  "Jail and Barracks": [["f", "c", "p", "ph"], null],
  "Cathedral and Catacombs": [["f", "c", "l", "ph"], "S"],
  "Moo Moo Farm": [[], "S"],
  "Lut Gholein Sewers": [["f", "c", "p", "m"], "F"],
  "Rocky Waste and Stony Tomb": [["f", "c", "l", "p", "m"], "F"],
  "Dry Hills and Halls of the Dead": [["f", "c", "l", "p"], "F"],
  "Far Oasis": [["l", "p", "ph"], "F"],
  "Spider Forest and Spider Cavern": [["f", "c", "l", "p"], "F"],
  "Great Marsh": [["f", "c", "l"], "F"],
  "Flayer Jungle and Flayer Dungeon": [["f", "c", "l", "p", "ph", "m"], "F"],
  "Kurast Bazaar, Ruined Temple, and Disused Fane": [["f", "c", "l", "p"], "F"],
  "Outer Steppes and Plains of Despair": [["f", "c", "l", "p"], "F"],
  "River of Flame and City of the Damned": [["f", "c", "l", "p"], "F"],
  "The Chaos Sanctuary": [["f", "c", "l"], "F"],
  "Bloody Foothills, Frigid Highlands, and Abaddon": [["f", "c", "l", "p", "ph", "m"], "F"],
  "Glacial Trail and Drifter Cavern": [["f", "c", "l", "p", "ph"], "F"],
  "Crystalline Passage and Frozen River": [["f", "c", "l", "p"], "F"],
  "Lost City, Valley of Snakes, and Claw Viper Temple": [["f", "c", "l", "p", "m"], null],
  "Ancient Tunnels": [["f", "l", "p", "m"], null],
  "Arcane Sanctuary": [["f", "c", "l", "p", "ph"], null],
  "Tal Rasha's Tombs and Tal Rasha's Chamber": [["f", "c", "l", "p", "m"], "S"],
  Travincal: [["f", "c", "l", "p"], "S-A"],
  "Durance of Hate": [["f", "c", "l", "p"], "A"],
  "Arreat Plateau and Pit of Acheron": [["f", "c", "l", "p"], null],
  "Nihlathak's Temple, Halls of Anguish, Halls of Pain, and Halls of Vaught": [["f", "c", "l", "p", "ph", "m"], "A"],
  "Ancient's Way and Icy Cellar": [["c", "l", "p", "ph"], "F"],
  "Worldstone Keep, Throne of Destruction, and Worldstone Chamber": [["f", "c", "l", "p", "ph", "m"], "S"]
};

const ALIASES = {
  "Burial Grounds, The Crypt, and The Mausoleum": "Burial Grounds, Crypt, and Mausoleum",
  Jail: "Jail and Barracks",
  Sewers: "Lut Gholein Sewers",
  "City of the Damned and River of Flame": "River of Flame and City of the Damned",
  "Chaos Sanctuary": "The Chaos Sanctuary",
  "Bloody Foothills and Frigid Highlands": "Bloody Foothills, Frigid Highlands, and Abaddon",
  "Tal Rasha's Tombs": "Tal Rasha's Tombs and Tal Rasha's Chamber"
};

export function getTerrorZoneMetadata(zone) {
  const canonical = ALIASES[zone] ?? zone;
  const entry = METADATA[canonical];
  if (!entry) {
    return { immunities: [], rating: null, ratingText: "未评级" };
  }

  const [immunities, rating] = entry;
  return {
    immunities: immunities.map((code) => ({
      code,
      name: IMMUNITY_NAMES[code]
    })),
    rating,
    ratingText: RATING_NAMES[rating] ?? "未评级"
  };
}
