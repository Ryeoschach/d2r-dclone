/**
 * D2R 3.4 热门流派预设库（8 职业 × 2 套开荒 / 毕业 / 专项预设）
 * 所有技能 key、暗金/套装 nameEn、符文之语 id、底材 code 与镶嵌物/咒符 id 均与站点元数据严格对齐。
 */

const u = (id, sockets = [], eth = false) => ({ cat: "unique", id, eth, sockets, rolls: {} });
const s = (id, sockets = [], eth = false) => ({ cat: "set", id, eth, sockets, rolls: {} });
const rw = (id, baseCode, { eth = false, palModType, palRes } = {}) => {
  const item = { cat: "rw", id, baseCode, eth, sockets: [], rolls: {} };
  if (palModType) item.palModType = palModType;
  if (palRes) item.palRes = palRes;
  return item;
};
const bag = (items) => items.map((x, idx) => ({
  uid: `pre-${idx + 1}`,
  charmId: typeof x === "string" ? x : x.charmId,
  tabPage: typeof x === "string" ? 0 : (x.tabPage || 0),
  rolls: {}
}));

const CTA_SPIRIT_SWAP = {
  weapon: rw("call-to-arms", "crs"),
  offhand: rw("spirit", "uit")
};

const MERC_INF_A2 = {
  head: u("Andariel's Visage", ["r08"], true),
  torso: rw("fortitude", "uar", { eth: true }),
  weapon: rw("infinity", "7wc", { eth: true }),
  offhand: null
};

const MERC_INS_A2 = {
  head: u("Andariel's Visage", ["r08"], true),
  torso: rw("fortitude", "uar", { eth: true }),
  weapon: rw("insight", "7wc", { eth: true }),
  offhand: null
};

export const PRESET_BUILDS = [
  // ==================== 术士 Warlock (D2R 3.4) ====================
  {
    id: "war-abyss-chaos",
    classId: "war",
    tier: "毕业",
    name: "深渊混沌术士（3.4 虚无魔典）",
    summary: "主修深渊 + 末日启示录 + 瘴气锁链，配合 3.4 新符文之语「虚无」与大魔典全屏清图",
    charLvl: 93,
    selectedSkillKey: "Abyss",
    skills: {
      "Miasma Bolt": 1,
      "Miasma Chains": 20,
      "Ring of Fire": 1,
      "Flame Wave": 1,
      "Enhanced Entropy": 20,
      "Sigil Lethargy": 1,
      "Sigil Rancor": 1,
      "Sigil Death": 20,
      Apocalypse: 20,
      Abyss: 20,
      "Summon Goatman": 1,
      "Demonic Mastery": 1,
      "Bind Demon": 1
    },
    paperdoll: {
      charLoadout: {
        head: u("Harlequin Crest (Shako)", ["r24"]),
        amulet: u("Mara's Kaleidoscope"),
        weapon: rw("void", "7kr"),
        torso: rw("enigma", "xtp"),
        offhand: u("Ars Al'Diabolos", ["jw-55-fire"]),
        gloves: u("Magefist"),
        ring1: u("The Stone of Jordan"),
        belt: u("Arachnid Mesh"),
        ring2: u("The Stone of Jordan"),
        boots: u("Wraithstep")
      },
      swapLoadout: CTA_SPIRIT_SWAP,
      activeWeaponSet: 1,
      mercVariant: "a2-might",
      mercLvl: 93,
      mercEnabled: true,
      mercAuraOn: true,
      mercLoadout: MERC_INF_A2,
      charBag: bag(["torch", "anni", "sunder-mag", "gheed", { charmId: "gc-sk-life", tabPage: 3 }, { charmId: "gc-sk-life", tabPage: 3 }, { charmId: "gc-sk-life", tabPage: 3 }, "sc-20-5", "sc-20-5"]),
      statAlloc: { str: 65, dex: 25, vit: 375, enr: 0 },
      ctaOn: true,
      charAura: "none",
      demonAura: "conv",
      demonMlvl: 96,
      warlockHex: "none",
      enemyDebuff: "none"
    }
  },
  {
    id: "war-echo-eldritch",
    classId: "war",
    tier: "毕业",
    name: "回响邪术术士（悬浮悔恨双持）",
    summary: "悬浮精通 + 回响打击 + 镜影刀刃配合邪咒消灭高速投射武器，兼顾物理爆发与高机动",
    charLvl: 93,
    selectedSkillKey: "Echoing Strike",
    skills: {
      Levitate: 20,
      "Eldritch Blast": 1,
      "Hex Bane": 1,
      "Hex Siphon": 1,
      "Hex Purge": 20,
      "Psychic Ward": 1,
      "Echoing Strike": 20,
      "Blade Warp": 1,
      Cleave: 20,
      "Mirrored Blades": 20,
      "Summon Goatman": 1,
      "Demonic Mastery": 1
    },
    paperdoll: {
      charLoadout: {
        head: u("Griffon's Eye", ["jw-40-15"]),
        amulet: u("Highlord's Wrath"),
        weapon: rw("grief", "7cr"),
        torso: rw("enigma", "xtp"),
        offhand: u("Ars Tor'Baalos"),
        gloves: s("Laying of Hands"),
        ring1: u("Raven Frost"),
        belt: u("Arachnid Mesh"),
        ring2: u("Bul-Kathos' Wedding Band"),
        boots: u("Gore Rider")
      },
      swapLoadout: CTA_SPIRIT_SWAP,
      activeWeaponSet: 1,
      mercVariant: "a2-might",
      mercLvl: 93,
      mercEnabled: true,
      mercAuraOn: true,
      mercLoadout: MERC_INF_A2,
      charBag: bag(["torch", "anni", "sunder-phys", { charmId: "gc-sk-life", tabPage: 2 }, { charmId: "gc-sk-life", tabPage: 2 }, "sc-3-20-20", "sc-3-20-20"]),
      statAlloc: { str: 90, dex: 115, vit: 260, enr: 0 },
      ctaOn: true,
      charAura: "none",
      demonAura: "fana",
      demonMlvl: 96,
      warlockHex: "Hex Purge",
      enemyDebuff: "decrep"
    }
  },

  // ==================== 法师 Sorceress ====================
  {
    id: "sor-blizzard-starter",
    classId: "sor",
    tier: "开荒",
    name: "暴风雪冰法（赛季开荒 MF）",
    summary: "极低造价成型，双精神 + 海蛇皮 + 军帽轻松通刷古代通道、墨菲斯托与恐怖地带",
    charLvl: 88,
    selectedSkillKey: "Blizzard",
    skills: {
      "Ice Bolt": 20,
      "Ice Blast": 20,
      "Glacial Spike": 20,
      Blizzard: 20,
      "Cold Mastery": 15,
      "Frozen Armor": 1,
      "Static Field": 1,
      Telekinesis: 1,
      Teleport: 1,
      Warmth: 1
    },
    paperdoll: {
      charLoadout: {
        head: u("Harlequin Crest (Shako)", ["gpy"]),
        amulet: s("Tal Rasha's Adjudication"),
        weapon: rw("spirit", "crs"),
        torso: u("Skin of the Vipermagi", ["gpy"]),
        offhand: rw("spirit", "uit"),
        gloves: u("Magefist"),
        ring1: u("Nagelring"),
        belt: u("Snowclash"),
        ring2: u("Raven Frost"),
        boots: u("War Traveler")
      },
      swapLoadout: { weapon: u("The Oculus"), offhand: rw("rhyme", "uit") },
      activeWeaponSet: 1,
      mercVariant: "a2-prayer",
      mercLvl: 88,
      mercEnabled: true,
      mercAuraOn: true,
      mercLoadout: MERC_INS_A2,
      charBag: bag(["torch", "anni", "sunder-cold", "gheed", { charmId: "gc-sk-life", tabPage: 1 }, { charmId: "gc-sk-life", tabPage: 1 }, "sc-7mf-11lr", "sc-7mf-11fr"]),
      statAlloc: { str: 140, dex: 0, vit: 300, enr: 0 },
      ctaOn: false,
      charAura: "none",
      enemyDebuff: "none"
    }
  },
  {
    id: "sor-nova-es",
    classId: "sor",
    tier: "毕业",
    name: "自持无限新星顶球电法（105 FCR）",
    summary: "主手自持锐利之斧无限吃满 -55% 敌电抗，能量护盾全蓝加点，8PP 混沌/TZ 效率之王",
    charLvl: 95,
    selectedSkillKey: "Nova",
    skills: {
      "Charged Bolt": 1,
      "Static Field": 20,
      Telekinesis: 20,
      Nova: 20,
      Lightning: 1,
      "Chain Lightning": 1,
      Teleport: 1,
      "Thunder Storm": 1,
      "Energy Shield": 15,
      "Lightning Mastery": 20,
      Warmth: 1,
      "Frozen Armor": 1
    },
    paperdoll: {
      charLoadout: {
        head: u("Griffon's Eye", ["jw-55-ltng"]),
        amulet: u("Mara's Kaleidoscope"),
        weapon: rw("infinity", "7s8"),
        torso: u("Skin of the Vipermagi", ["jw-55-ltng"]),
        offhand: null,
        gloves: u("Magefist"),
        ring1: u("The Stone of Jordan"),
        belt: u("Arachnid Mesh"),
        ring2: u("The Stone of Jordan"),
        boots: u("Sandstorm Trek")
      },
      swapLoadout: CTA_SPIRIT_SWAP,
      activeWeaponSet: 1,
      mercVariant: "a2-prayer",
      mercLvl: 95,
      mercEnabled: true,
      mercAuraOn: true,
      mercLoadout: MERC_INS_A2,
      charBag: bag(["torch", "anni", "sunder-ltng", { charmId: "gc-sk-life", tabPage: 2 }, { charmId: "gc-sk-life", tabPage: 2 }, { charmId: "gc-sk-life", tabPage: 2 }, { charmId: "gc-sk-life", tabPage: 2 }, "sc-20-17", "sc-20-17"]),
      statAlloc: { str: 60, dex: 25, vit: 20, enr: 370 },
      ctaOn: true,
      charAura: "none",
      enemyDebuff: "none"
    }
  },

  // ==================== 圣骑士 Paladin ====================
  {
    id: "pal-hammerdin",
    classId: "pal",
    tier: "毕业",
    name: "祝福之锤圣骑（125 FCR 铁桶）",
    summary: "橡树 + 45抗神圣小盾精神 + 谜团达成 125 FCR 9帧施法与 75% 格挡，全场景稳健通刷",
    charLvl: 93,
    selectedSkillKey: "Blessed Hammer",
    skills: {
      "Holy Bolt": 1,
      Smite: 1,
      Charge: 1,
      "Blessed Hammer": 20,
      "Holy Shield": 15,
      Might: 1,
      "Blessed Aim": 20,
      Concentration: 20,
      Prayer: 1,
      Defiance: 1,
      Cleansing: 1,
      Vigor: 20,
      Redemption: 1
    },
    paperdoll: {
      charLoadout: {
        head: u("Harlequin Crest (Shako)", ["r24"]),
        amulet: u("Mara's Kaleidoscope"),
        weapon: rw("heart-of-the-oak", "fla"),
        torso: rw("enigma", "xtp"),
        offhand: rw("spirit", "pab", { palModType: "res", palRes: 45 }),
        gloves: u("Magefist"),
        ring1: u("The Stone of Jordan"),
        belt: u("Arachnid Mesh"),
        ring2: u("The Stone of Jordan"),
        boots: u("War Traveler")
      },
      swapLoadout: {
        weapon: rw("call-to-arms", "crs"),
        offhand: rw("spirit", "pab", { palModType: "res", palRes: 45 })
      },
      activeWeaponSet: 1,
      mercVariant: "a2-hf",
      mercLvl: 93,
      mercEnabled: true,
      mercAuraOn: true,
      mercLoadout: MERC_INS_A2,
      charBag: bag(["torch", "anni", "gheed", { charmId: "gc-sk-life", tabPage: 3 }, { charmId: "gc-sk-life", tabPage: 3 }, { charmId: "gc-sk-life", tabPage: 3 }, "sc-20-5", "sc-20-5"]),
      statAlloc: { str: 30, dex: 120, vit: 315, enr: 0 },
      ctaOn: true,
      charAura: "conc-20",
      enemyDebuff: "none"
    }
  },
  {
    id: "pal-smiter-uber",
    classId: "pal",
    tier: "专项",
    name: "狂热悔恨盾击（6BOSS / 地表暗黑）",
    summary: "幻化悔恨 + 刚毅 + 卓古拉偷血 + 吉永头高 CB，无视防御必中盾击稳定速杀三魔神",
    charLvl: 91,
    selectedSkillKey: "Smite",
    skills: {
      Sacrifice: 20,
      Smite: 20,
      "Holy Bolt": 1,
      Zeal: 20,
      Charge: 1,
      "Blessed Hammer": 1,
      "Holy Shield": 20,
      Might: 1,
      "Blessed Aim": 1,
      Concentration: 1,
      Fanaticism: 20,
      Salvation: 1
    },
    paperdoll: {
      charLoadout: {
        head: s("Guillaume's Face", ["r22"]),
        amulet: u("Highlord's Wrath"),
        weapon: rw("grief", "7cr"),
        torso: rw("fortitude", "utp"),
        offhand: u("Herald of Zakarum", ["r22"]),
        gloves: u("Dracul's Grasp"),
        ring1: u("Raven Frost"),
        belt: u("String of Ears"),
        ring2: u("Bul-Kathos' Wedding Band"),
        boots: u("Gore Rider")
      },
      swapLoadout: {
        weapon: rw("call-to-arms", "crs"),
        offhand: rw("spirit", "pab", { palModType: "res", palRes: 45 })
      },
      activeWeaponSet: 1,
      mercVariant: "a2-might",
      mercLvl: 91,
      mercEnabled: true,
      mercAuraOn: true,
      mercLoadout: MERC_INF_A2,
      charBag: bag(["torch", "anni", "sc-20-5", "sc-20-5", "sc-20-11lr", "sc-20-11lr"]),
      statAlloc: { str: 105, dex: 130, vit: 220, enr: 0 },
      ctaOn: true,
      charAura: "fana-20",
      enemyDebuff: "none"
    }
  },

  // ==================== 亚马逊 Amazon ====================
  {
    id: "ama-javazon",
    classId: "ama",
    tier: "毕业",
    name: "闪电之怒标马（奶牛 / 8PP TZ 核弹）",
    summary: "无形泰坦 + 格里芬 + 穿刺腰带满 100% 穿透，充能一击秒杀 Boss、闪电之怒清屏",
    charLvl: 94,
    selectedSkillKey: "Lightning Fury",
    skills: {
      Jab: 1,
      "Power Strike": 20,
      "Poison Javelin": 1,
      "Lightning Bolt": 20,
      "Charged Strike": 20,
      "Plague Javelin": 1,
      "Lightning Strike": 20,
      "Lightning Fury": 20,
      "Critical Strike": 1,
      Penetrate: 1,
      Pierce: 1,
      Dodge: 1,
      Avoid: 1,
      Evade: 1
    },
    paperdoll: {
      charLoadout: {
        head: u("Griffon's Eye", ["jw-55-ltng"]),
        amulet: u("Highlord's Wrath"),
        weapon: u("Titan's Revenge", [], true),
        torso: rw("enigma", "xtp"),
        offhand: rw("spirit", "uit"),
        gloves: s("Laying of Hands"),
        ring1: u("Raven Frost"),
        belt: u("Razortail"),
        ring2: u("The Stone of Jordan"),
        boots: u("War Traveler")
      },
      swapLoadout: CTA_SPIRIT_SWAP,
      activeWeaponSet: 1,
      mercVariant: "a2-might",
      mercLvl: 94,
      mercEnabled: true,
      mercAuraOn: true,
      mercLoadout: MERC_INF_A2,
      charBag: bag(["torch", "anni", "sunder-ltng", { charmId: "gc-sk-life", tabPage: 1 }, { charmId: "gc-sk-life", tabPage: 1 }, { charmId: "gc-sk-life", tabPage: 1 }, "sc-20-5", "sc-20-5"]),
      statAlloc: { str: 100, dex: 95, vit: 275, enr: 0 },
      ctaOn: true,
      charAura: "none",
      enemyDebuff: "none"
    }
  },
  {
    id: "ama-frostmaiden",
    classId: "ama",
    tier: "毕业",
    name: "冰冻箭女族长弓马（极致冰控）",
    summary: "女族长之弓「冰冻」+ 夜翼面纱 + 穿刺腰带，群体冰冻控场与高额元素范围爆发",
    charLvl: 92,
    selectedSkillKey: "Freezing Arrow",
    skills: {
      "Cold Arrow": 20,
      "Ice Arrow": 20,
      "Freezing Arrow": 20,
      "Magic Arrow": 1,
      "Multiple Shot": 1,
      "Guided Arrow": 1,
      Strafe: 5,
      "Critical Strike": 5,
      Penetrate: 10,
      Pierce: 5,
      "Inner Sight": 1,
      "Slow Missiles": 1,
      Dopplezon: 1,
      Dodge: 1,
      Avoid: 1,
      Evade: 1,
      Valkyrie: 10
    },
    paperdoll: {
      charLoadout: {
        head: u("Nightwing's Veil", ["jw-55-cold"]),
        amulet: u("Highlord's Wrath"),
        weapon: rw("ice", "amb"),
        torso: rw("chains-of-honor", "utp"),
        offhand: null,
        gloves: s("Laying of Hands"),
        ring1: u("Raven Frost"),
        belt: u("Razortail"),
        ring2: u("The Stone of Jordan"),
        boots: u("War Traveler")
      },
      swapLoadout: CTA_SPIRIT_SWAP,
      activeWeaponSet: 1,
      mercVariant: "a2-prayer",
      mercLvl: 92,
      mercEnabled: true,
      mercAuraOn: true,
      mercLoadout: MERC_INS_A2,
      charBag: bag(["torch", "anni", "sunder-cold", { charmId: "gc-sk-life", tabPage: 3 }, { charmId: "gc-sk-life", tabPage: 3 }, { charmId: "gc-sk-life", tabPage: 3 }, "sc-20-5"]),
      statAlloc: { str: 90, dex: 165, vit: 205, enr: 0 },
      ctaOn: true,
      charAura: "none",
      enemyDebuff: "none"
    }
  },

  // ==================== 死灵法师 Necromancer ====================
  {
    id: "nec-summon-ce",
    classId: "nec",
    tier: "开荒",
    name: "纯招尸爆死灵（零门槛全图安逸）",
    summary: "满骷髅大军 + 满级尸体爆炸，配合米山无限与伤害加深，安全稳定通刷全地狱场景",
    charLvl: 92,
    selectedSkillKey: "Corpse Explosion",
    skills: {
      "Raise Skeleton": 20,
      "Skeleton Mastery": 20,
      "Clay Golem": 1,
      "Golem Mastery": 1,
      "Summon Resist": 1,
      "Raise Skeletal Mage": 1,
      BloodGolem: 1,
      IronGolem: 1,
      Revive: 5,
      Teeth: 1,
      "Bone Armor": 1,
      "Corpse Explosion": 20,
      "Amplify Damage": 10,
      Weaken: 1,
      Terror: 1,
      Decrepify: 1
    },
    paperdoll: {
      charLoadout: {
        head: u("Harlequin Crest (Shako)", ["r24"]),
        amulet: u("Mara's Kaleidoscope"),
        weapon: rw("heart-of-the-oak", "fla"),
        torso: rw("enigma", "xtp"),
        offhand: u("Homunculus", ["r22"]),
        gloves: s("Trang-Oul's Claws"),
        ring1: u("The Stone of Jordan"),
        belt: u("Arachnid Mesh"),
        ring2: u("The Stone of Jordan"),
        boots: u("War Traveler")
      },
      swapLoadout: CTA_SPIRIT_SWAP,
      activeWeaponSet: 1,
      mercVariant: "a2-might",
      mercLvl: 92,
      mercEnabled: true,
      mercAuraOn: true,
      mercLoadout: MERC_INF_A2,
      charBag: bag(["torch", "anni", "gheed", { charmId: "gc-sk-life", tabPage: 1 }, { charmId: "gc-sk-life", tabPage: 1 }, { charmId: "gc-sk-life", tabPage: 1 }, "sc-20-5"]),
      statAlloc: { str: 55, dex: 25, vit: 380, enr: 0 },
      ctaOn: true,
      charAura: "none",
      enemyDebuff: "amp"
    }
  },
  {
    id: "nec-poison-nova",
    classId: "nec",
    tier: "毕业",
    name: "死网剧毒新星死灵（极限减毒抗）",
    summary: "死亡之网 + 塔格奥三件套 + 双 5/5 毒珠，配合降低抵抗与尸爆在奶牛/地穴清屏如割草",
    charLvl: 94,
    selectedSkillKey: "Poison Nova",
    skills: {
      "Poison Dagger": 20,
      "Poison Explosion": 20,
      "Poison Nova": 20,
      Teeth: 1,
      "Corpse Explosion": 20,
      "Bone Armor": 1,
      "Amplify Damage": 1,
      Weaken: 1,
      Terror: 1,
      Decrepify: 1,
      "Iron Maiden": 1,
      "Life Tap": 1,
      "Lower Resist": 10,
      "Clay Golem": 1,
      "Golem Mastery": 1,
      "Summon Resist": 1
    },
    paperdoll: {
      charLoadout: {
        head: u("Harlequin Crest (Shako)", ["jw-55-pois"]),
        amulet: u("Mara's Kaleidoscope"),
        weapon: u("Death's Web", ["jw-55-pois"]),
        torso: rw("enigma", "xtp"),
        offhand: s("Trang-Oul's Wing", ["jw-55-pois"]),
        gloves: s("Trang-Oul's Claws"),
        ring1: u("The Stone of Jordan"),
        belt: s("Trang-Oul's Girth"),
        ring2: u("The Stone of Jordan"),
        boots: u("War Traveler")
      },
      swapLoadout: CTA_SPIRIT_SWAP,
      activeWeaponSet: 1,
      mercVariant: "a2-might",
      mercLvl: 94,
      mercEnabled: true,
      mercAuraOn: true,
      mercLoadout: MERC_INF_A2,
      charBag: bag(["torch", "anni", "sunder-pois", { charmId: "gc-sk-life", tabPage: 2 }, { charmId: "gc-sk-life", tabPage: 2 }, { charmId: "gc-sk-life", tabPage: 2 }, "sc-20-5"]),
      statAlloc: { str: 65, dex: 25, vit: 380, enr: 0 },
      ctaOn: true,
      charAura: "none",
      enemyDebuff: "lr-10"
    }
  },

  // ==================== 野蛮人 Barbarian ====================
  {
    id: "bar-ww-hork",
    classId: "bar",
    tier: "毕业",
    name: "双悔恨旋风刨尸蛮（崔凡克刷金/符文）",
    summary: "双持幻化悔恨 + 亚瑞特之面 + 寻物/找药满协同，崔凡克议会成员高爆率速刷之王",
    charLvl: 93,
    selectedSkillKey: "Whirlwind",
    skills: {
      Bash: 1,
      Leap: 1,
      Stun: 1,
      "Leap Attack": 1,
      Concentrate: 1,
      Whirlwind: 20,
      Berserk: 1,
      "Blade Mastery": 20,
      "Increased Stamina": 1,
      "Increased Speed": 1,
      "Iron Skin": 1,
      "Natural Resistance": 5,
      Howl: 1,
      "Find Potion": 20,
      "Find Item": 12,
      Shout: 1,
      "Battle Orders": 20,
      "Battle Command": 1
    },
    paperdoll: {
      charLoadout: {
        head: u("Arreat's Face", ["jw-40-15"]),
        amulet: u("Highlord's Wrath"),
        weapon: rw("grief", "7cr"),
        torso: rw("enigma", "xtp"),
        offhand: rw("grief", "7cr"),
        gloves: s("Laying of Hands"),
        ring1: u("Raven Frost"),
        belt: u("String of Ears"),
        ring2: u("Bul-Kathos' Wedding Band"),
        boots: u("Gore Rider")
      },
      swapLoadout: { weapon: rw("heart-of-the-oak", "fla"), offhand: rw("heart-of-the-oak", "fla") },
      activeWeaponSet: 1,
      mercVariant: "a2-might",
      mercLvl: 93,
      mercEnabled: true,
      mercAuraOn: true,
      mercLoadout: MERC_INS_A2,
      charBag: bag(["torch", "anni", "gheed", "gc-10-76-45", "gc-10-76-45", "sc-3-20-20", "sc-3-20-20", "sc-7mf-11fr"]),
      statAlloc: { str: 95, dex: 115, vit: 255, enr: 0 },
      ctaOn: false,
      charAura: "none",
      enemyDebuff: "decrep"
    }
  },
  {
    id: "bar-berserk-pit",
    classId: "bar",
    tier: "专项",
    name: "狂战士狙击 MF 蛮（圣杯暗金收割机）",
    summary: "嚎叫驱散小怪、狂战士纯魔法单点精英 + 高级刨尸，圣杯 85 场景与 TZ 暗金效率天花板",
    charLvl: 94,
    selectedSkillKey: "Berserk",
    skills: {
      Bash: 1,
      Stun: 1,
      Concentrate: 1,
      Berserk: 20,
      "Blade Mastery": 20,
      "Increased Stamina": 1,
      "Increased Speed": 1,
      "Iron Skin": 1,
      "Natural Resistance": 5,
      Howl: 20,
      "Find Potion": 20,
      "Find Item": 6,
      Shout: 1,
      "Battle Orders": 6,
      "Battle Command": 1
    },
    paperdoll: {
      charLoadout: {
        head: u("Harlequin Crest (Shako)", ["r24"]),
        amulet: u("Highlord's Wrath"),
        weapon: rw("grief", "7cr"),
        torso: rw("enigma", "xtp"),
        offhand: rw("rhyme", "uit"),
        gloves: u("Chance Guards"),
        ring1: u("Nagelring"),
        belt: u("Goldwrap"),
        ring2: u("Raven Frost"),
        boots: u("War Traveler")
      },
      swapLoadout: { weapon: rw("heart-of-the-oak", "fla"), offhand: rw("heart-of-the-oak", "fla") },
      activeWeaponSet: 1,
      mercVariant: "a2-might",
      mercLvl: 94,
      mercEnabled: true,
      mercAuraOn: true,
      mercLoadout: MERC_INS_A2,
      charBag: bag(["torch", "anni", "gheed", "sc-7mf-11lr", "sc-7mf-11fr", "sc-7mf-5ar", "sc-7mf-5ar"]),
      statAlloc: { str: 100, dex: 115, vit: 255, enr: 0 },
      ctaOn: false,
      charAura: "none",
      enemyDebuff: "none"
    }
  },

  // ==================== 德鲁伊 Druid ====================
  {
    id: "dru-wind",
    classId: "dru",
    tier: "毕业",
    name: "风德（龙卷风 + 暴风 · 99 FCR）",
    summary: "物理 + 冰双系输出兼备旋风护甲与橡木智者高血量，攻防一体通刷全场景",
    charLvl: 93,
    selectedSkillKey: "Tornado",
    skills: {
      "Arctic Blast": 1,
      "Cyclone Armor": 20,
      Twister: 20,
      Tornado: 20,
      Hurricane: 20,
      Raven: 1,
      "Oak Sage": 20,
      "Summon Spirit Wolf": 1,
      "Summon Fenris": 1,
      "Summon Grizzly": 1
    },
    paperdoll: {
      charLoadout: {
        head: u("Jalal's Mane", ["r22"]),
        amulet: u("Mara's Kaleidoscope"),
        weapon: rw("heart-of-the-oak", "fla"),
        torso: rw("enigma", "xtp"),
        offhand: rw("spirit", "uit"),
        gloves: u("Magefist"),
        ring1: u("The Stone of Jordan"),
        belt: u("Arachnid Mesh"),
        ring2: u("The Stone of Jordan"),
        boots: u("Sandstorm Trek")
      },
      swapLoadout: CTA_SPIRIT_SWAP,
      activeWeaponSet: 1,
      mercVariant: "a2-might",
      mercLvl: 93,
      mercEnabled: true,
      mercAuraOn: true,
      mercLoadout: MERC_INF_A2,
      charBag: bag(["torch", "anni", "gheed", { charmId: "gc-sk-life", tabPage: 3 }, { charmId: "gc-sk-life", tabPage: 3 }, { charmId: "gc-sk-life", tabPage: 3 }, "sc-20-5"]),
      statAlloc: { str: 95, dex: 25, vit: 345, enr: 0 },
      ctaOn: true,
      charAura: "oak-20",
      enemyDebuff: "decrep"
    }
  },
  {
    id: "dru-fire-ele",
    classId: "dru",
    tier: "毕业",
    name: "毁天灭地火德（凤凰破火核爆）",
    summary: "渡鸦之识 + 凤凰盾高额 -敌火抗 + 破火板，陨石雨 + 火山 + 裂地火物理双伤清图爽快",
    charLvl: 93,
    selectedSkillKey: "Armageddon",
    skills: {
      Firestorm: 20,
      "Molten Boulder": 20,
      Eruption: 20,
      Volcano: 20,
      Armageddon: 20,
      "Arctic Blast": 1,
      "Cyclone Armor": 1,
      Twister: 1,
      Tornado: 1,
      Hurricane: 1,
      "Oak Sage": 1
    },
    paperdoll: {
      charLoadout: {
        head: u("Ravenlore", ["jw-55-fire"]),
        amulet: u("Mara's Kaleidoscope"),
        weapon: rw("heart-of-the-oak", "fla"),
        torso: rw("enigma", "xtp"),
        offhand: rw("phoenix", "uit"),
        gloves: u("Magefist"),
        ring1: u("The Stone of Jordan"),
        belt: u("Arachnid Mesh"),
        ring2: u("The Stone of Jordan"),
        boots: u("War Traveler")
      },
      swapLoadout: CTA_SPIRIT_SWAP,
      activeWeaponSet: 1,
      mercVariant: "a2-hf",
      mercLvl: 93,
      mercEnabled: true,
      mercAuraOn: true,
      mercLoadout: MERC_INF_A2,
      charBag: bag(["torch", "anni", "sunder-fire", { charmId: "gc-sk-life", tabPage: 3 }, { charmId: "gc-sk-life", tabPage: 3 }, { charmId: "gc-sk-life", tabPage: 3 }, "sc-20-5"]),
      statAlloc: { str: 95, dex: 25, vit: 345, enr: 0 },
      ctaOn: true,
      charAura: "oak-20",
      enemyDebuff: "none"
    }
  },

  // ==================== 刺客 Assassin ====================
  {
    id: "ass-mosaic",
    classId: "ass",
    tier: "毕业",
    name: "双马赛克凤凰武学刺客（版本答案）",
    summary: "双持符文爪「马赛克」100% 不消耗聚气，凤凰/雷电/寒冰/虎击/眼镜蛇全满聚气秒杀 8PP 一切目标",
    charLvl: 94,
    selectedSkillKey: "Royal Strike",
    skills: {
      "Tiger Strike": 1,
      "Dragon Talon": 1,
      "Fists of Fire": 20,
      "Cobra Strike": 1,
      "Claws of Thunder": 20,
      "Blades of Ice": 20,
      "Royal Strike": 20,
      "Dragon Flight": 1,
      "Claw Mastery": 1,
      Quickness: 1,
      "Weapon Block": 5,
      Fade: 10,
      "Psychic Hammer": 1,
      "Cloak of Shadows": 1,
      "Mind Blast": 1
    },
    paperdoll: {
      charLoadout: {
        head: u("Griffon's Eye", ["jw-55-ltng"]),
        amulet: u("Mara's Kaleidoscope"),
        weapon: rw("mosaic", "7tw"),
        torso: rw("enigma", "xtp"),
        offhand: rw("mosaic", "7tw"),
        gloves: u("Magefist"),
        ring1: u("Raven Frost"),
        belt: u("Arachnid Mesh"),
        ring2: u("Bul-Kathos' Wedding Band"),
        boots: u("Gore Rider")
      },
      swapLoadout: CTA_SPIRIT_SWAP,
      activeWeaponSet: 1,
      mercVariant: "a2-might",
      mercLvl: 94,
      mercEnabled: true,
      mercAuraOn: true,
      mercLoadout: MERC_INF_A2,
      charBag: bag(["torch", "anni", "sunder-ltng", { charmId: "gc-sk-life", tabPage: 1 }, { charmId: "gc-sk-life", tabPage: 1 }, { charmId: "gc-sk-life", tabPage: 1 }, "sc-20-5"]),
      statAlloc: { str: 85, dex: 95, vit: 290, enr: 0 },
      ctaOn: true,
      charAura: "none",
      enemyDebuff: "none"
    }
  },
  {
    id: "ass-trapsin",
    classId: "ass",
    tier: "开荒",
    name: "电系陷阱刺客（雷光守卫 + 亡者守卫）",
    summary: "高安全距离自动炮台 + 亡者守卫自动尸爆，速度爆发/影散灵活切换，开荒毕业皆宜",
    charLvl: 91,
    selectedSkillKey: "Lightning Sentry",
    skills: {
      "Fire Trauma": 10,
      "Shock Field": 20,
      "Charged Bolt Sentry": 20,
      "Lightning Sentry": 20,
      "Death Sentry": 20,
      "Claw Mastery": 1,
      Quickness: 1,
      "Weapon Block": 1,
      Fade: 5,
      "Psychic Hammer": 1,
      "Cloak of Shadows": 1,
      "Mind Blast": 1,
      "Shadow Warrior": 1,
      "Shadow Master": 1
    },
    paperdoll: {
      charLoadout: {
        head: u("Griffon's Eye", ["jw-55-ltng"]),
        amulet: u("Mara's Kaleidoscope"),
        weapon: rw("heart-of-the-oak", "fla"),
        torso: rw("enigma", "xtp"),
        offhand: rw("spirit", "uit"),
        gloves: u("Magefist"),
        ring1: u("The Stone of Jordan"),
        belt: u("Arachnid Mesh"),
        ring2: u("The Stone of Jordan"),
        boots: u("War Traveler")
      },
      swapLoadout: CTA_SPIRIT_SWAP,
      activeWeaponSet: 1,
      mercVariant: "a2-might",
      mercLvl: 91,
      mercEnabled: true,
      mercAuraOn: true,
      mercLoadout: MERC_INF_A2,
      charBag: bag(["torch", "anni", "sunder-ltng", { charmId: "gc-sk-life", tabPage: 3 }, { charmId: "gc-sk-life", tabPage: 3 }, { charmId: "gc-sk-life", tabPage: 3 }, "sc-20-5"]),
      statAlloc: { str: 95, dex: 25, vit: 335, enr: 0 },
      ctaOn: true,
      charAura: "none",
      enemyDebuff: "none"
    }
  }
];

export function getPresetBuildsCatalog() {
  return {
    version: "3.4",
    total: PRESET_BUILDS.length,
    presets: PRESET_BUILDS
  };
}
