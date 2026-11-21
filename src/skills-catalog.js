// Auto-generated from D2R 3.4 extracted data (skills.txt, skilldesc.txt, skills.json)
export const SKILL_CLASSES = [
  {
    "id": "war",
    "nameZh": "术士",
    "nameTw": "術士",
    "nameEn": "Warlock",
    "isNew34": true,
    "icon": "/images/ui/warlockicon.webp",
    "tabs": [
      {
        "page": 1,
        "zhCN": "恶魔技能",
        "zhTW": "惡魔技能",
        "enUS": "Demon Skills"
      },
      {
        "page": 2,
        "zhCN": "邪术技能",
        "zhTW": "邪異技能",
        "enUS": "Eldritch Skills"
      },
      {
        "page": 3,
        "zhCN": "混沌技能",
        "zhTW": "混沌技能",
        "enUS": "Chaos Skills"
      }
    ],
    "skills": [
      {
        "id": 373,
        "key": "Summon Goatman",
        "page": 1,
        "row": 1,
        "col": 3,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "召唤羊头人",
        "nameTw": "召喚羊頭人",
        "nameEn": "Summon Goatman",
        "descZh": "召唤一名羊头人为你而战",
        "descTw": "召喚一個羊頭人，與你共同作戰",
        "descEn": "Summons a Goatman to fight by your side",
        "mana": {
          "base": 30,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0.6,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "死亡印记: 每等级+1%几率粉碎打击",
            "zhTW": "死亡印記：每等級 +1% 機率造成粉碎打擊",
            "enUS": "Death Mark: +1% Chance of Crushing Blow per level"
          }
        ]
      },
      {
        "id": 374,
        "key": "Demonic Mastery",
        "page": 1,
        "row": 1,
        "col": 1,
        "reqLvl": 1,
        "reqs": [
          "Summon Goatman"
        ],
        "passive": true,
        "nameZh": "恶魔精通",
        "nameTw": "惡魔專精",
        "nameEn": "Demonic Mastery",
        "descZh": "被动 - 强化你召唤和束缚的恶魔",
        "descTw": "被動 - 強化你召喚和束縛的惡魔",
        "descEn": "Passive - Enhances your summoned and bound demons",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 375,
        "key": "Death Mark",
        "page": 1,
        "row": 2,
        "col": 2,
        "reqLvl": 6,
        "reqs": [
          "Summon Goatman"
        ],
        "passive": false,
        "nameZh": "死亡印记",
        "nameTw": "死亡印記",
        "nameEn": "Death Mark",
        "descZh": "强制使你的恶魔传送并攻击一名敌人",
        "descTw": "迫使你的惡魔傳送至一個敵人的位置並攻擊",
        "descEn": "Forces your demon to teleport to and attack an enemy",
        "mana": {
          "base": 9,
          "lvl": 1,
          "shift": 6,
          "min": 1
        },
        "cooldown": 0.8,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 376,
        "key": "Summon Tainted",
        "page": 1,
        "row": 3,
        "col": 3,
        "reqLvl": 12,
        "reqs": [
          "Summon Goatman"
        ],
        "passive": false,
        "nameZh": "召唤污染魔",
        "nameTw": "召喚魔汙怪",
        "nameEn": "Summon Tainted",
        "descZh": "召唤一只污染魔为你而战",
        "descTw": "召喚一個魔汙怪，與你共同作戰",
        "descEn": "Summons a Tainted to fight by your side",
        "mana": {
          "base": 50,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0.6,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "红液沸腾: 每等级+0%火焰伤害",
            "zhTW": "沸血術：每等級 +0% 火焰傷害",
            "enUS": "Blood Boil: +0% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 377,
        "key": "Summon Defiler",
        "page": 1,
        "row": 4,
        "col": 3,
        "reqLvl": 18,
        "reqs": [
          "Summon Tainted"
        ],
        "passive": false,
        "nameZh": "召唤污秽者",
        "nameTw": "召喚褻瀆者",
        "nameEn": "Summon Defiler",
        "descZh": "召唤一只污秽者，将敌人灵魂束缚起来 · 使其共同承受伤害",
        "descTw": "召喚褻瀆者，將敵人的靈魂綁定在一起 · 以共享受到的傷害",
        "descEn": "Summons a defiler that binds enemy souls together  ·  to take shared damage",
        "mana": {
          "base": 70,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0.6,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 378,
        "key": "Blood Oath",
        "page": 1,
        "row": 2,
        "col": 1,
        "reqLvl": 6,
        "reqs": [
          "Demonic Mastery"
        ],
        "passive": true,
        "nameZh": "血誓",
        "nameTw": "血誓",
        "nameEn": "Blood Oath",
        "descZh": "被动 - 将恶魔生命力与你绑定 · 以抵御敌人攻击",
        "descTw": "被動 - 與你惡魔的生命力綁定 · 以抵禦敵人的攻擊",
        "descEn": "Passive - Bind the lifeforce of your demon  ·  to protect from enemy attacks",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 379,
        "key": "Engorge",
        "page": 1,
        "row": 5,
        "col": 2,
        "reqLvl": 24,
        "reqs": [
          "Blood Boil"
        ],
        "passive": false,
        "nameZh": "暴食",
        "nameTw": "吞食",
        "nameEn": "Engorge",
        "descZh": "通过喂食残骸治疗并强化你的恶魔",
        "descTw": "餵食屍體給你的惡魔以治療和強化它",
        "descEn": "Heal and empower your demon by feeding it a corpse",
        "mana": {
          "base": 12,
          "lvl": 1,
          "shift": 6,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "血誓: 每等级+0防御值",
            "zhTW": "血誓：每等級 +0 點防禦",
            "enUS": "Blood Oath: +0 Defense per level"
          },
          {
            "zhCN": "血誓: 每等级+0补充生命",
            "zhTW": "血誓：每等級 +0 點回復生命",
            "enUS": "Blood Oath: +0 Replenish life per level"
          }
        ]
      },
      {
        "id": 380,
        "key": "Blood Boil",
        "page": 1,
        "row": 4,
        "col": 2,
        "reqLvl": 18,
        "reqs": [
          "Death Mark"
        ],
        "passive": false,
        "nameZh": "红液沸腾",
        "nameTw": "沸血術",
        "nameEn": "Blood Boil",
        "descZh": "引爆恶魔红液，对附近敌人造成伤害",
        "descTw": "使你的惡魔爆發鮮血，對附近敵人造成傷害",
        "descEn": "Erupt your demon's blood to damage nearby enemies",
        "mana": {
          "base": 15,
          "lvl": 1,
          "shift": 6,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "fire",
          "hitShift": 8,
          "min": [
            10,
            8,
            10,
            12,
            16,
            20
          ],
          "max": [
            20,
            10,
            12,
            18,
            26,
            30
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Blood Oath",
            "pct": 20
          }
        ],
        "synergies": [
          {
            "zhCN": "血誓: 每等级+20%火焰伤害",
            "zhTW": "血誓：每等級 +20% 火焰傷害",
            "enUS": "Blood Oath: +20% Fire Damage per Level"
          },
          {
            "zhCN": "暴食: 每等级+20%伤害",
            "zhTW": "吞食：每等級 +20% 傷害",
            "enUS": "Engorge: +20% Damage per Level"
          }
        ]
      },
      {
        "id": 381,
        "key": "Consume",
        "page": 1,
        "row": 6,
        "col": 1,
        "reqLvl": 30,
        "reqs": [
          "Blood Oath"
        ],
        "passive": false,
        "nameZh": "吞噬",
        "nameTw": "吞噬",
        "nameEn": "Consume",
        "descZh": "牺牲你的恶魔以换取力量",
        "descTw": "犧牲你的惡魔以換取力量",
        "descEn": "Sacrifice your demon in exchange for power",
        "mana": {
          "base": 25,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 382,
        "key": "Bind Demon",
        "page": 1,
        "row": 6,
        "col": 3,
        "reqLvl": 30,
        "reqs": [
          "Engorge",
          "Summon Defiler"
        ],
        "passive": false,
        "nameZh": "束缚恶魔",
        "nameTw": "束縛惡魔",
        "nameEn": "Bind Demon",
        "descZh": "强制一只受伤的恶魔为你效命",
        "descTw": "迫使受傷的惡魔為你效力",
        "descEn": "Force an injured demon to do your bidding",
        "mana": {
          "base": 50,
          "lvl": 1,
          "shift": 2,
          "min": 0
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "死亡印记: 每等级 +1%束缚恶魔几率",
            "zhTW": "死亡印記：每等級 +1% 束縛惡魔機率",
            "enUS": "Death Mark: +1% Chance to Bind Demon per level"
          }
        ]
      },
      {
        "id": 383,
        "key": "Levitate",
        "page": 2,
        "row": 1,
        "col": 1,
        "reqLvl": 1,
        "reqs": [],
        "passive": true,
        "nameZh": "悬浮精通",
        "nameTw": "懸浮精通",
        "nameEn": "Levitation Mastery",
        "descZh": "被动 - 提升你用意念悬浮 · 装备武器的能力",
        "descTw": "被動 - 強化你用意念使裝備的武器懸浮的能力",
        "descEn": "Passive - Improve your ability to levitate your equipped ·  weapon with your mind",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 384,
        "key": "Eldritch Blast",
        "page": 2,
        "row": 5,
        "col": 2,
        "reqLvl": 24,
        "reqs": [
          "Psychic Ward"
        ],
        "passive": false,
        "nameZh": "邪术冲击",
        "nameTw": "邪異轟擊",
        "nameEn": "Eldritch Blast",
        "descZh": "用汲取性魔法伤害冲击被咒术影响的敌人 · 同时刷新咒术持续时间",
        "descTw": "以消耗性的魔法傷害轟擊受邪咒影響的敵人， · 並重置其作用中邪咒的持續時間",
        "descEn": "Blast hexed enemies with draining magical damage  ·  and refresh the duration of their active hex",
        "mana": {
          "base": 11,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "mag",
          "hitShift": 8,
          "min": [
            2,
            3,
            6,
            9,
            15,
            17
          ],
          "max": [
            6,
            3,
            6,
            9,
            15,
            17
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Blade Warp",
            "pct": 50
          },
          {
            "skill": "Hex Purge",
            "pct": 50
          }
        ],
        "synergies": [
          {
            "zhCN": "咒术: 净化: 每等级+50%魔法伤害",
            "zhTW": "邪咒：消滅：每等級 +50% 魔法傷害",
            "enUS": "Hex: Purge: +50% Magic Damage per Level"
          },
          {
            "zhCN": "飞刃传形: 每等级+50%魔法伤害",
            "zhTW": "飛刃躍傳：每等級 +50% 魔法傷害",
            "enUS": "Blade Warp: +50% Magic Damage per Level"
          },
          {
            "zhCN": "会心守御: 每等级+0秒",
            "zhTW": "靈能護盾：每等級 +0 秒",
            "enUS": "Psychic Ward: +0 Seconds per Level"
          }
        ]
      },
      {
        "id": 385,
        "key": "Hex Bane",
        "page": 2,
        "row": 1,
        "col": 3,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "咒术: 灾祸",
        "nameTw": "邪咒：災禍",
        "nameEn": "Hex: Bane",
        "descZh": "对武器施加咒术，削弱敌人并增加魔法伤害",
        "descTw": "為你的武器施加邪咒以削弱敵人並附加魔法傷害",
        "descEn": "Hexes your weapon to impair enemies and add magic damage",
        "mana": {
          "base": 12,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "mag",
          "hitShift": 7,
          "min": [
            9,
            3,
            7,
            11,
            15,
            19
          ],
          "max": [
            16,
            5,
            9,
            13,
            17,
            21
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Consume",
            "pct": 35
          },
          {
            "skill": "Hex Purge",
            "pct": 35
          },
          {
            "skill": "Mirrored Blades",
            "pct": 35
          }
        ],
        "synergies": [
          {
            "zhCN": "镜影锋刃: 每等级+35%魔法伤害",
            "zhTW": "鏡像之刃：每等級 +35% 魔法傷害",
            "enUS": "Mirrored Blades: +35% Magic Damage per Level"
          },
          {
            "zhCN": "咒术: 净化: 每等级+35%魔法伤害",
            "zhTW": "邪咒：消滅：每等級 +35% 魔法傷害",
            "enUS": "Hex: Purge: +35% Magic Damage per Level"
          },
          {
            "zhCN": "吞噬: 每等级+35%魔法伤害",
            "zhTW": "吞噬：每等級 +35% 魔法傷害",
            "enUS": "Consume: +35% Magic Damage per Level"
          },
          {
            "zhCN": "邪术冲击: 每等级 +0.2秒咒术持续时间",
            "zhTW": "邪異轟擊：每等級 +0.2 秒邪咒持續時間",
            "enUS": "Eldritch Blast: Hex Duration +0.2 seconds per level"
          }
        ]
      },
      {
        "id": 386,
        "key": "Hex Siphon",
        "page": 2,
        "row": 5,
        "col": 3,
        "reqLvl": 24,
        "reqs": [
          "Hex Purge"
        ],
        "passive": false,
        "nameZh": "咒术: 吸取",
        "nameTw": "邪咒：虹吸",
        "nameEn": "Hex: Siphon",
        "descZh": "对武器施加咒术，提取被消灭敌人的生命力",
        "descTw": "為你的武器施加邪咒以吸取擊殺敵人的生命力",
        "descEn": "Hexes your weapon to extract the lifeforce of slain enemies",
        "mana": {
          "base": 25,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "暴食: 每等级 +1消灭恢复的生命和法力 ",
            "zhTW": "吞食：每等級 +1 點擊殺生命和法力恢復",
            "enUS": "Engorge: +1 Life and Mana After Kill per level"
          },
          {
            "zhCN": "邪术冲击: 每等级 +0.2秒咒术持续时间",
            "zhTW": "邪異轟擊：每等級 +0.2 秒邪咒持續時間",
            "enUS": "Eldritch Blast: Hex Duration +0.2 seconds per level"
          }
        ]
      },
      {
        "id": 387,
        "key": "Psychic Ward",
        "page": 2,
        "row": 4,
        "col": 2,
        "reqLvl": 18,
        "reqs": [
          "Cleave"
        ],
        "passive": false,
        "nameZh": "会心守御",
        "nameTw": "靈能護盾",
        "nameEn": "Psychic Ward",
        "descZh": "创造一个精神护盾，吸收攻击伤害 · 并能击晕近战攻击者",
        "descTw": "創造一面精神護盾，吸收攻擊傷害且能夠 · 昏迷近戰攻擊者",
        "descEn": "Creates a mental shield that absorbs damage from  ·  attacks and can stun melee attackers",
        "mana": {
          "base": 20,
          "lvl": 2,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "劈斩: 每等级+15点伤害吸收",
            "zhTW": "斬劈：每等級 +15 傷害吸收",
            "enUS": "Cleave: +15 Damage Absorbed per Level"
          },
          {
            "zhCN": "悬浮精通: 每等级+15点伤害吸收",
            "zhTW": "懸浮精通：每等級 +15 傷害吸收",
            "enUS": "Levitation Mastery: +15 Damage Absorbed per Level"
          }
        ]
      },
      {
        "id": 388,
        "key": "Echoing Strike",
        "page": 2,
        "row": 3,
        "col": 1,
        "reqLvl": 12,
        "reqs": [
          "Levitate"
        ],
        "passive": false,
        "nameZh": "回响打击",
        "nameTw": "迴響打擊",
        "nameEn": "Echoing Strike",
        "descZh": "创造出你近战武器的多个回响，并穿透敌人",
        "descTw": "創造你近戰武器的迴響，貫穿敵人",
        "descEn": "Create echoes of your melee weapon that pierce through enemies",
        "mana": {
          "base": 14,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "phys",
          "hitShift": 8,
          "min": [
            8,
            3,
            4,
            6,
            6,
            6
          ],
          "max": [
            12,
            5,
            6,
            9,
            9,
            9
          ]
        },
        "synergies": [
          {
            "zhCN": "镜影锋刃: 每五级创造额外回响数: 1",
            "zhTW": "鏡像之刃：每五級創造的額外迴響：1 次",
            "enUS": "Mirrored Blades: Additional echoes created every fifth level: 1"
          },
          {
            "zhCN": "镜影锋刃: 每等级+5%伤害",
            "zhTW": "鏡像之刃：每等級 +5% 傷害",
            "enUS": "Mirrored Blades: +5% Damage per Level"
          },
          {
            "zhCN": "飞刃传形: 每等级+5%伤害",
            "zhTW": "飛刃躍傳：每等級 +5% 傷害",
            "enUS": "Blade Warp: +5% Damage per Level"
          }
        ]
      },
      {
        "id": 389,
        "key": "Hex Purge",
        "page": 2,
        "row": 3,
        "col": 3,
        "reqLvl": 12,
        "reqs": [
          "Hex Bane"
        ],
        "passive": false,
        "nameZh": "咒术: 净化",
        "nameTw": "邪咒：消滅",
        "nameEn": "Hex: Purge",
        "descZh": "对武器施加咒术，扭曲敌人并有几率 · 让其被击中时爆炸",
        "descTw": "為你的武器施加邪咒以扭曲敵人，使其被擊中時有機率爆炸",
        "descEn": "Hexes your weapon to warp enemies creating a chance ·  they will erupt when hit",
        "mana": {
          "base": 25,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "mag",
          "hitShift": 8,
          "min": [
            10,
            4,
            8,
            10,
            14,
            18
          ],
          "max": [
            15,
            6,
            10,
            12,
            16,
            20
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Hex Bane",
            "pct": 10
          },
          {
            "skill": "Eldritch Blast",
            "pct": 10
          }
        ],
        "synergies": [
          {
            "zhCN": "咒术: 灾祸: 每等级+10%魔法伤害",
            "zhTW": "邪咒：災禍：每等級 +10% 魔法傷害",
            "enUS": "Hex: Bane: +10% Magic Damage per Level"
          },
          {
            "zhCN": "邪术冲击: 每等级+10%魔法伤害",
            "zhTW": "邪異轟擊：每等級 +10% 魔法傷害",
            "enUS": "Eldritch Blast: +10% Magic Damage per Level"
          },
          {
            "zhCN": "符徽: 死亡: 每等级 +0%爆炸几率",
            "zhTW": "咒印：死亡：每等級 +0% 爆發機率",
            "enUS": "Sigil: Death: +0% Chance to Erupt per level"
          },
          {
            "zhCN": "邪术冲击: 每等级 +0.2秒咒术持续时间",
            "zhTW": "邪異轟擊：每等級 +0.2 秒邪咒持續時間",
            "enUS": "Eldritch Blast: Hex Duration +0.2 seconds per level"
          }
        ]
      },
      {
        "id": 390,
        "key": "Blade Warp",
        "page": 2,
        "row": 4,
        "col": 1,
        "reqLvl": 18,
        "reqs": [
          "Echoing Strike"
        ],
        "passive": false,
        "nameZh": "飞刃传形",
        "nameTw": "飛刃躍傳",
        "nameEn": "Blade Warp",
        "descZh": "投掷一把星体武器，将你传送到其撞击位置",
        "descTw": "投出一把星界武器，將你傳送至命中位置",
        "descEn": "Hurl an astral weapon that teleports you to its impact",
        "mana": {
          "base": 15,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0.8,
        "dmg": {
          "type": "mag",
          "hitShift": 8,
          "min": [
            8,
            3,
            5,
            8,
            8,
            8
          ],
          "max": [
            10,
            3,
            5,
            8,
            8,
            8
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Echoing Strike",
            "pct": 24
          },
          {
            "skill": "Mirrored Blades",
            "pct": 24
          }
        ],
        "synergies": [
          {
            "zhCN": "镜影锋刃: 每等级+24%魔法伤害",
            "zhTW": "鏡像之刃：每等級 +24% 魔法傷害",
            "enUS": "Mirrored Blades: +24% Magic Damage per Level"
          },
          {
            "zhCN": "回响打击: 每等级+24%魔法伤害",
            "zhTW": "迴響打擊：每等級 +24% 魔法傷害",
            "enUS": "Echoing Strike: +24% Magic Damage per Level"
          }
        ]
      },
      {
        "id": 391,
        "key": "Cleave",
        "page": 2,
        "row": 2,
        "col": 2,
        "reqLvl": 6,
        "reqs": [
          "Levitate"
        ],
        "passive": false,
        "nameZh": "劈斩",
        "nameTw": "斬劈",
        "nameEn": "Cleave",
        "descZh": "攻击扩散的弧形范围内的所有敌人",
        "descTw": "攻擊一片大範圍弧形中的所有敵人",
        "descEn": "Attack all enemies in an expanding arc",
        "mana": {
          "base": 3,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "镜影锋刃: 每等级+10%伤害",
            "zhTW": "鏡像之刃：每等級 +10% 傷害",
            "enUS": "Mirrored Blades: +10% Damage per Level"
          },
          {
            "zhCN": "咒术: 净化: 每等级+10%伤害",
            "zhTW": "邪咒：消滅：每等級 +10% 傷害",
            "enUS": "Hex: Purge: +10% Damage per Level"
          },
          {
            "zhCN": "邪术冲击: 每等级+10%伤害",
            "zhTW": "邪異轟擊：每等級 +10% 傷害",
            "enUS": "Eldritch Blast: +10% Damage per Level"
          }
        ]
      },
      {
        "id": 392,
        "key": "Mirrored Blades",
        "page": 2,
        "row": 6,
        "col": 2,
        "reqLvl": 30,
        "reqs": [
          "Blade Warp",
          "Eldritch Blast"
        ],
        "passive": false,
        "nameZh": "镜影锋刃",
        "nameTw": "鏡像之刃",
        "nameEn": "Mirrored Blades",
        "descZh": "用武器的镜像复制品发动攻击",
        "descTw": "使用你武器的鏡像複製品進行攻擊",
        "descEn": "Attack with mirror duplicates of your weapon",
        "mana": {
          "base": 10,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 393,
        "key": "Sigil Lethargy",
        "page": 3,
        "row": 2,
        "col": 2,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "符徽: 迟缓",
        "nameTw": "咒印：昏沉",
        "nameEn": "Sigil: Lethargy",
        "descZh": "在地面放置符徽，减缓并削弱敌人",
        "descTw": "在地上放置一個咒印，緩速並削弱敵人",
        "descEn": "Lay a sigil on the ground that slows and weakens enemies",
        "mana": {
          "base": 4,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 394,
        "key": "Ring of Fire",
        "page": 3,
        "row": 2,
        "col": 1,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "火焰之环",
        "nameTw": "火焰之環",
        "nameEn": "Ring of Fire",
        "descZh": "向四面八方释放扩散地狱烈火 · 将敌人击退",
        "descTw": "朝所有方向釋放一道持續擴張的地獄火，將敵人擊退",
        "descEn": "Releases a volley of expanding hellfire in all directions that pushes  ·  enemies away",
        "mana": {
          "base": 16,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "fire",
          "hitShift": 8,
          "min": [
            6,
            6,
            8,
            10,
            11,
            12
          ],
          "max": [
            10,
            7,
            9,
            11,
            13,
            15
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Flame Wave",
            "pct": 10
          },
          {
            "skill": "Apocalypse",
            "pct": 10
          }
        ],
        "synergies": [
          {
            "zhCN": "烈焰波: 每等级+10%火焰伤害",
            "zhTW": "烈焰湧浪：每等級 +10% 火焰傷害",
            "enUS": "Flame Wave: +10% Fire Damage per Level"
          },
          {
            "zhCN": "末日: 每等级+10%火焰伤害",
            "zhTW": "天啟末日：每等級 +10% 火焰傷害",
            "enUS": "Apocalypse: +10% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 395,
        "key": "Miasma Bolt",
        "page": 3,
        "row": 1,
        "col": 3,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "瘴气弹",
        "nameTw": "瘴氣彈",
        "nameEn": "Miasma Bolt",
        "descZh": "发射一枚黑暗弹丸，释放一片熵之云雾",
        "descTw": "發射會釋放出無序能量雲霧的黑暗魔彈",
        "descEn": "Fires a bolt of darkness that releases a cloud of entropy",
        "mana": {
          "base": 4,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "mag",
          "hitShift": 7,
          "min": [
            2,
            2,
            2,
            3,
            3,
            4
          ],
          "max": [
            4,
            2,
            2,
            4,
            4,
            6
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Miasma Chains",
            "pct": 10
          },
          {
            "skill": "Abyss",
            "pct": 10
          }
        ],
        "synergies": [
          {
            "zhCN": "瘴气锁链: 每等级+10%魔法伤害",
            "zhTW": "瘴氣鎖鏈：每等級 +10% 魔法傷害",
            "enUS": "Miasma Chain: +10% Magic Damage per Level"
          },
          {
            "zhCN": "瘴气锁链: 每等级+20%平均每秒魔法伤害 ",
            "zhTW": "瘴氣鎖鏈：每等級 +20% 每秒平均魔法傷害",
            "enUS": "Miasma Chain: +20% Average Magic Damage per Second per Level"
          },
          {
            "zhCN": "深渊: 每等级+10%魔法伤害",
            "zhTW": "深淵裂口：每等級 +10% 魔法傷害",
            "enUS": "Abyss: +10% Magic Damage per Level"
          },
          {
            "zhCN": "深渊: 每等级+20%平均每秒魔法伤害 ",
            "zhTW": "深淵裂口：每等級 +20% 每秒平均魔法傷害",
            "enUS": "Abyss: +20% Average Magic Damage per Second per Level"
          }
        ]
      },
      {
        "id": 396,
        "key": "Sigil Rancor",
        "page": 3,
        "row": 3,
        "col": 2,
        "reqLvl": 12,
        "reqs": [
          "Sigil Lethargy"
        ],
        "passive": false,
        "nameZh": "符徽: 怨恨",
        "nameTw": "咒印：冤仇",
        "nameEn": "Sigil: Rancor",
        "descZh": "在地面放置符徽，使进入者激怒并有几率 · 让敌人互相攻击",
        "descTw": "在地上放置一個咒印，使進入的目標陷入狂怒， · 且敵人有機率互相攻擊",
        "descEn": "Lay a sigil on the ground that enrages those who enter ·  and has a chance for enemies to attack one another",
        "mana": {
          "base": 12,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 397,
        "key": "Enhanced Entropy",
        "page": 3,
        "row": 5,
        "col": 3,
        "reqLvl": 24,
        "reqs": [
          "Miasma Chains"
        ],
        "passive": true,
        "nameZh": "强化之熵",
        "nameTw": "增強混亂",
        "nameEn": "Enhanced Entropy",
        "descZh": "被动 - 提升你对暗影魔法 · 熵力的掌控",
        "descTw": "被動 - 強化你對暗影魔法混亂之力的精通能力",
        "descEn": "Passive - Improve your mastery over the entropic forces  ·  of shadow magic",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 398,
        "key": "Flame Wave",
        "page": 3,
        "row": 4,
        "col": 1,
        "reqLvl": 18,
        "reqs": [
          "Ring of Fire"
        ],
        "passive": false,
        "nameZh": "烈焰波",
        "nameTw": "烈焰湧浪",
        "nameEn": "Flame Wave",
        "descZh": "释放一道滚滚火墙 · 燃烧经过的地面",
        "descTw": "施放一道翻湧的火焰之牆，燃燒其經過的地面",
        "descEn": "Unleashes a rolling wall of fire that burns the ground in ·  its wake",
        "mana": {
          "base": 14,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0.6,
        "dmg": {
          "type": "fire",
          "hitShift": 8,
          "min": [
            13,
            8,
            12,
            17,
            18,
            21
          ],
          "max": [
            17,
            9,
            14,
            18,
            20,
            23
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Ring of Fire",
            "pct": 15
          },
          {
            "skill": "Apocalypse",
            "pct": 15
          }
        ],
        "synergies": [
          {
            "zhCN": "火焰之环: 每等级+15%火焰伤害",
            "zhTW": "火焰之環：每等級 +15% 火焰傷害",
            "enUS": "Ring of Fire: +15% Fire Damage per Level"
          },
          {
            "zhCN": "火焰之环: 每等级+10%平均每秒火焰伤害",
            "zhTW": "火焰之環：每等級 +10% 平均每秒火焰傷害",
            "enUS": "Ring of Fire: +10% Average Fire Damage per Second per Level"
          },
          {
            "zhCN": "末日: 每等级+15%火焰伤害",
            "zhTW": "天啟末日：每等級 +15% 火焰傷害",
            "enUS": "Apocalypse: +15% Fire Damage per Level"
          },
          {
            "zhCN": "末日: 每等级+10%平均每秒火焰伤害",
            "zhTW": "天啟末日：每等級 +10% 平均每秒火焰傷害",
            "enUS": "Apocalypse: +10% Average Fire Damage per Second per Level"
          }
        ]
      },
      {
        "id": 399,
        "key": "Miasma Chains",
        "page": 3,
        "row": 3,
        "col": 3,
        "reqLvl": 12,
        "reqs": [
          "Miasma Bolt"
        ],
        "passive": false,
        "nameZh": "瘴气锁链",
        "nameTw": "瘴氣鎖鏈",
        "nameEn": "Miasma Chain",
        "descZh": "召唤暗影锁链 · 在你与目标间释放窒息瘴气",
        "descTw": "召喚暗影鎖鏈，在你和目標之間散發出窒息瘴氣",
        "descEn": "Summon shadowy chains that emit a suffocating miasma  ·  between you and the target",
        "mana": {
          "base": 9,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "mag",
          "hitShift": 8,
          "min": [
            6,
            2,
            3,
            3,
            4,
            4
          ],
          "max": [
            9,
            2,
            3,
            3,
            4,
            4
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Miasma Bolt",
            "pct": 10
          },
          {
            "skill": "Abyss",
            "pct": 10
          }
        ],
        "synergies": [
          {
            "zhCN": "瘴气弹: 每等级+10%魔法伤害",
            "zhTW": "瘴氣彈：每等級 +10% 魔法傷害",
            "enUS": "Miasma Bolt: +10% Magic Damage per Level"
          },
          {
            "zhCN": "瘴气弹: 每等级+20%平均每秒魔法伤害 ",
            "zhTW": "瘴氣彈：每等級 +20% 每秒平均魔法傷害",
            "enUS": "Miasma Bolt: +20% Average Magic Damage per Second per Level"
          },
          {
            "zhCN": "深渊: 每等级+10%魔法伤害",
            "zhTW": "深淵裂口：每等級 +10% 魔法傷害",
            "enUS": "Abyss: +10% Magic Damage per Level"
          },
          {
            "zhCN": "深渊: 每等级+20%平均每秒魔法伤害 ",
            "zhTW": "深淵裂口：每等級 +20% 每秒平均魔法傷害",
            "enUS": "Abyss: +20% Average Magic Damage per Second per Level"
          }
        ]
      },
      {
        "id": 400,
        "key": "Sigil Death",
        "page": 3,
        "row": 5,
        "col": 2,
        "reqLvl": 24,
        "reqs": [
          "Sigil Rancor"
        ],
        "passive": false,
        "nameZh": "符徽: 死亡",
        "nameTw": "咒印：死亡",
        "nameEn": "Sigil: Death",
        "descZh": "在地面放置符徽 · 使受伤的敌人加速殒灭并引发剧烈爆炸",
        "descTw": "在地上放置一個咒印，使受傷的敵人 · 在猛烈爆炸中加速死亡",
        "descEn": "Lay a sigil on the ground that hastens the death ·  of injured enemies in a violent explosion",
        "mana": {
          "base": 20,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 401,
        "key": "Apocalypse",
        "page": 3,
        "row": 6,
        "col": 1,
        "reqLvl": 30,
        "reqs": [
          "Flame Wave",
          "Sigil Death"
        ],
        "passive": false,
        "nameZh": "末日",
        "nameTw": "天啟末日",
        "nameEn": "Apocalypse",
        "descZh": "创造一个五芒星，将所有敌人吞没在地狱烈火中 · 降低敌人对末日伤害的火焰抗性",
        "descTw": "創造一個五芒星，以地獄火吞噬所有敵人 · 降低敵人對於天啟末日傷害的火焰抗性",
        "descEn": "Create a pentagram that engulfs all enemies in hellfire · Reduces enemy fire resistance for apocalypse’s damage",
        "mana": {
          "base": 32,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 1.8,
        "dmg": {
          "type": "fire",
          "hitShift": 8,
          "min": [
            80,
            23,
            46,
            69,
            75,
            95
          ],
          "max": [
            100,
            25,
            50,
            75,
            95,
            115
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Ring of Fire",
            "pct": 10
          },
          {
            "skill": "Flame Wave",
            "pct": 10
          }
        ],
        "synergies": [
          {
            "zhCN": "火焰之环: 每等级+10%火焰伤害",
            "zhTW": "火焰之環：每等級 +10% 火焰傷害",
            "enUS": "Ring of Fire: +10% Fire Damage per Level"
          },
          {
            "zhCN": "烈焰波: 每等级+10%火焰伤害",
            "zhTW": "烈焰湧浪：每等級 +10% 火焰傷害",
            "enUS": "Flame Wave: +10% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 402,
        "key": "Abyss",
        "page": 3,
        "row": 6,
        "col": 3,
        "reqLvl": 30,
        "reqs": [
          "Enhanced Entropy"
        ],
        "passive": false,
        "nameZh": "深渊",
        "nameTw": "深淵裂口",
        "nameEn": "Abyss",
        "descZh": "在现实结构间撕裂出一道裂口， · 将敌人拉近后猛烈坍塌",
        "descTw": "在現實空間中撕開一道裂口，將敵人拉近後劇烈崩塌",
        "descEn": "Create a tear in the fabric of reality which pulls enemies ·  close before violently collapsing",
        "mana": {
          "base": 23,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 1.2,
        "dmg": {
          "type": "mag",
          "hitShift": 8,
          "min": [
            20,
            3,
            6,
            9,
            12,
            15
          ],
          "max": [
            40,
            4,
            8,
            12,
            16,
            20
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Miasma Bolt",
            "pct": 10
          },
          {
            "skill": "Miasma Chains",
            "pct": 10
          }
        ],
        "synergies": [
          {
            "zhCN": "瘴气弹: 每等级+10%魔法伤害",
            "zhTW": "瘴氣彈：每等級 +10% 魔法傷害",
            "enUS": "Miasma Bolt: +10% Magic Damage per Level"
          },
          {
            "zhCN": "瘴气弹: 每等级+10%平均每秒魔法伤害 ",
            "zhTW": "瘴氣彈：每等級 +10% 每秒平均魔法傷害",
            "enUS": "Miasma Bolt: +10% Average Magic Damage per Second per Level"
          },
          {
            "zhCN": "瘴气锁链: 每等级+10%魔法伤害",
            "zhTW": "瘴氣鎖鏈：每等級 +10% 魔法傷害",
            "enUS": "Miasma Chain: +10% Magic Damage per Level"
          },
          {
            "zhCN": "瘴气锁链: 每等级+10%平均每秒魔法伤害 ",
            "zhTW": "瘴氣鎖鏈：每等級 +10% 每秒平均魔法傷害",
            "enUS": "Miasma Chain: +10% Average Magic Damage per Second per Level"
          }
        ]
      }
    ]
  },
  {
    "id": "sor",
    "nameZh": "魔法使",
    "nameTw": "魔法使",
    "nameEn": "Sorceress",
    "icon": "/images/ui/sorceressicon.webp",
    "tabs": [
      {
        "page": 3,
        "zhCN": "冰系法术",
        "zhTW": "冰寒技能",
        "enUS": "Cold Skills"
      },
      {
        "page": 2,
        "zhCN": "雷系法术",
        "zhTW": "閃電技能",
        "enUS": "Lightning Skills"
      },
      {
        "page": 1,
        "zhCN": "火系法术",
        "zhTW": "火焰技能",
        "enUS": "Fire Skills"
      }
    ],
    "skills": [
      {
        "id": 36,
        "key": "Fire Bolt",
        "page": 1,
        "row": 1,
        "col": 2,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "火焰弹",
        "nameTw": "火焰彈",
        "nameEn": "Fire Bolt",
        "descZh": "创造出燃烧的魔法飞弹",
        "descTw": "射出魔法火焰彈",
        "descEn": "creates a magical flaming missile",
        "mana": {
          "base": 5,
          "lvl": 0,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "fire",
          "hitShift": 7,
          "min": [
            6,
            3,
            4,
            8,
            18,
            54
          ],
          "max": [
            12,
            3,
            6,
            10,
            20,
            56
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Fire Ball",
            "pct": 16
          },
          {
            "skill": "Meteor",
            "pct": 16
          }
        ],
        "synergies": [
          {
            "zhCN": "火球术: 每等级+16%火焰伤害",
            "zhTW": "火球術：每等級 +16% 火焰傷害",
            "enUS": "Fire Ball: +16% Fire Damage per Level"
          },
          {
            "zhCN": "陨石术: 每等级+16%火焰伤害",
            "zhTW": "隕石術：每等級 +16% 火焰傷害",
            "enUS": "Meteor: +16% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 37,
        "key": "Warmth",
        "page": 1,
        "row": 1,
        "col": 3,
        "reqLvl": 1,
        "reqs": [],
        "passive": true,
        "nameZh": "暖身术",
        "nameTw": "暖流",
        "nameEn": "Warmth",
        "descZh": "被动 - 提高法力回复的速度",
        "descTw": "被動 - 提高你的法力回復速度",
        "descEn": "passive - increases the rate at which you recover mana",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 38,
        "key": "Charged Bolt",
        "page": 2,
        "row": 1,
        "col": 2,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "电荷弹",
        "nameTw": "電能彈",
        "nameEn": "Charged Bolt",
        "descZh": "创造出多个电能飞弹 · 向随机方向飞行",
        "descTw": "散射出多個方向不定的電能火花",
        "descEn": "creates multiple, randomly directed · bolts of electrical energy",
        "mana": {
          "base": 24,
          "lvl": 4,
          "shift": 5,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "ltng",
          "hitShift": 7,
          "min": [
            4,
            1,
            1,
            2,
            3,
            4
          ],
          "max": [
            8,
            1,
            1,
            2,
            3,
            4
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Lightning",
            "pct": 6
          }
        ],
        "synergies": [
          {
            "zhCN": "闪电术: 每等级+6%闪电伤害",
            "zhTW": "閃電箭：每等級 +6% 電擊傷害",
            "enUS": "Lightning: +6% Lightning Damage per Level"
          }
        ]
      },
      {
        "id": 39,
        "key": "Ice Bolt",
        "page": 3,
        "row": 1,
        "col": 2,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "冰霜弹",
        "nameTw": "寒冰彈",
        "nameEn": "Ice Bolt",
        "descZh": "创造出魔法冰霜飞弹 · 对敌人造成伤害并减速",
        "descTw": "射出冰冷的魔法彈傷害敵人，並使其緩速",
        "descEn": "creates a magical bolt of ice · that damages and slows your enemies",
        "mana": {
          "base": 3,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "cold",
          "hitShift": 7,
          "min": [
            6,
            2,
            4,
            6,
            8,
            10
          ],
          "max": [
            10,
            3,
            5,
            7,
            9,
            11
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Frost Nova",
            "pct": 15
          },
          {
            "skill": "Ice Blast",
            "pct": 15
          },
          {
            "skill": "Glacial Spike",
            "pct": 15
          },
          {
            "skill": "Blizzard",
            "pct": 15
          },
          {
            "skill": "Frozen Orb",
            "pct": 15
          }
        ],
        "synergies": [
          {
            "zhCN": "冰霜新星: 每等级+15%冰霜伤害",
            "zhTW": "冰霜新星：每等級 +15% 冰寒傷害",
            "enUS": "Frost Nova: +15% Cold Damage per Level"
          },
          {
            "zhCN": "冰球爆: 每等级+15%冰霜伤害",
            "zhTW": "寒冰球：每等級 +15% 冰寒傷害",
            "enUS": "Ice Blast: +15% Cold Damage per Level"
          },
          {
            "zhCN": "冰尖柱: 每等级+15%冰霜伤害",
            "zhTW": "冰川之槍：每等級 +15% 冰寒傷害",
            "enUS": "Glacial Spike: +15% Cold Damage per Level"
          },
          {
            "zhCN": "暴风雪: 每等级+15%冰霜伤害",
            "zhTW": "暴風雪：每等級 +15% 冰寒傷害",
            "enUS": "Blizzard: +15% Cold Damage per Level"
          },
          {
            "zhCN": "冰封球: 每等级+15%冰霜伤害",
            "zhTW": "冰封球：每等級 +15% 冰寒傷害",
            "enUS": "Frozen Orb: +15% Cold Damage per Level"
          }
        ]
      },
      {
        "id": 40,
        "key": "Frozen Armor",
        "page": 3,
        "row": 1,
        "col": 3,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "冰封甲",
        "nameTw": "冰封甲",
        "nameEn": "Frozen Armor",
        "descZh": "提高你的防御值 · 并冻结攻击你的敌人",
        "descTw": "提高你的防禦，並且凍結擊中你的敵人",
        "descEn": "increases your defense · and freezes enemies that hit you",
        "mana": {
          "base": 7,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "碎冰甲: 每等级+5%冻结时间",
            "zhTW": "碎冰甲：每等級 +5% 凍結時效",
            "enUS": "Shiver Armor: +5% Freeze Length per Level"
          },
          {
            "zhCN": "碎冰甲: 每等级+0秒",
            "zhTW": "碎冰甲：每等級 +0 秒",
            "enUS": "Shiver Armor: +0 Seconds per Level"
          },
          {
            "zhCN": "冰棱甲: 每等级+5%冻结时间",
            "zhTW": "寒冰甲：每等級 +5% 凍結時效",
            "enUS": "Chilling Armor: +5% Freeze Length per Level"
          },
          {
            "zhCN": "冰棱甲: 每等级+0秒",
            "zhTW": "寒冰甲：每等級 +0 秒",
            "enUS": "Chilling Armor: +0 Seconds per Level"
          }
        ]
      },
      {
        "id": 41,
        "key": "Inferno",
        "page": 1,
        "row": 2,
        "col": 1,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "地狱火",
        "nameTw": "煉獄之火",
        "nameEn": "Inferno",
        "descZh": "喷射出魔法烈焰 · 灼烧你的敌人",
        "descTw": "噴出一團烈焰灼燒你的敵人",
        "descEn": "creates a continuous jet of flame · to scorch your enemies",
        "mana": {
          "base": 24,
          "lvl": 1,
          "shift": 2,
          "min": 0
        },
        "cooldown": 0,
        "dmg": {
          "type": "fire",
          "hitShift": 3,
          "min": [
            36,
            24,
            30,
            34,
            38,
            42
          ],
          "max": [
            72,
            25,
            31,
            35,
            39,
            43
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Warmth",
            "pct": 16
          }
        ],
        "synergies": [
          {
            "zhCN": "暖身术: 每等级+16%火焰伤害",
            "zhTW": "暖流：每等級 +16% 火焰傷害",
            "enUS": "Warmth: +16% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 42,
        "key": "Static Field",
        "page": 2,
        "row": 2,
        "col": 1,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "静电场",
        "nameTw": "靜電力場",
        "nameEn": "Static Field",
        "descZh": "创造一个电能力场 · 降低附近所有敌人的生命",
        "descTw": "造出一道電能力場，降低附近所有敵人的生命",
        "descEn": "creates an electrical field that reduces life · of all nearby enemies",
        "mana": {
          "base": 9,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 43,
        "key": "Telekinesis",
        "page": 2,
        "row": 2,
        "col": 3,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "心灵传动",
        "nameTw": "心靈傳動",
        "nameEn": "Telekinesis",
        "descZh": "可以用意念的力量 · 拾起或使用物品 · 还能够击退敌人",
        "descTw": "利用你的心靈力量來拾取物品、操作物體，以及擊退敵人",
        "descEn": "uses the power of your mind to · pick up items, use objects, · and knock back enemies",
        "mana": {
          "base": 7,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "ltng",
          "hitShift": 8,
          "min": [
            1,
            1,
            1,
            1,
            1,
            1
          ],
          "max": [
            2,
            1,
            1,
            1,
            1,
            1
          ]
        },
        "synergies": []
      },
      {
        "id": 44,
        "key": "Frost Nova",
        "page": 3,
        "row": 2,
        "col": 1,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "冰霜新星",
        "nameTw": "冰霜新星",
        "nameEn": "Frost Nova",
        "descZh": "创造出不断扩大的冰环, 对附近所有敌人 · 造成伤害并使其减速",
        "descTw": "造出一個向外擴張的寒冰之環，傷害並減慢附近的所有敵人",
        "descEn": "creates an expanding ring of ice that damages · and slows all nearby enemies",
        "mana": {
          "base": 9,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "cold",
          "hitShift": 7,
          "min": [
            4,
            6,
            8,
            10,
            12,
            14
          ],
          "max": [
            8,
            7,
            9,
            11,
            13,
            15
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Blizzard",
            "pct": 10
          },
          {
            "skill": "Frozen Orb",
            "pct": 10
          }
        ],
        "synergies": [
          {
            "zhCN": "暴风雪: 每等级+10%冰霜伤害",
            "zhTW": "暴風雪：每等級 +10% 冰寒傷害",
            "enUS": "Blizzard: +10% Cold Damage per Level"
          },
          {
            "zhCN": "冰封球: 每等级+10%冰霜伤害",
            "zhTW": "冰封球：每等級 +10% 冰寒傷害",
            "enUS": "Frozen Orb: +10% Cold Damage per Level"
          }
        ]
      },
      {
        "id": 45,
        "key": "Ice Blast",
        "page": 3,
        "row": 2,
        "col": 2,
        "reqLvl": 6,
        "reqs": [
          "Ice Bolt"
        ],
        "passive": false,
        "nameZh": "冰球爆",
        "nameTw": "寒冰球",
        "nameEn": "Ice Blast",
        "descZh": "创造出魔法冰球, 对敌人 · 造成伤害并使其冻结",
        "descTw": "射出一團魔法冰球，傷害並凍結你的敵人",
        "descEn": "creates a magical sphere of ice that · damages and freezes your enemy",
        "mana": {
          "base": 12,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "cold",
          "hitShift": 7,
          "min": [
            16,
            14,
            28,
            42,
            56,
            70
          ],
          "max": [
            24,
            15,
            29,
            43,
            57,
            71
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Ice Bolt",
            "pct": 8
          },
          {
            "skill": "Blizzard",
            "pct": 8
          },
          {
            "skill": "Frozen Orb",
            "pct": 8
          }
        ],
        "synergies": [
          {
            "zhCN": "冰霜弹: 每等级+8%冰霜伤害",
            "zhTW": "寒冰彈：每等級 +8% 冰寒傷害",
            "enUS": "Ice Bolt: +8% Cold Damage per Level"
          },
          {
            "zhCN": "冰尖柱: 每等级+10%冻结时间",
            "zhTW": "冰川之槍：每等級 +10% 凍結時效",
            "enUS": "Glacial Spike: +10% Freeze Length per Level"
          },
          {
            "zhCN": "暴风雪: 每等级+8%冰霜伤害",
            "zhTW": "暴風雪：每等級 +8% 冰寒傷害",
            "enUS": "Blizzard: +8% Cold Damage per Level"
          },
          {
            "zhCN": "冰封球: 每等级+8%冰霜伤害",
            "zhTW": "冰封球：每等級 +8% 冰寒傷害",
            "enUS": "Frozen Orb: +8% Cold Damage per Level"
          }
        ]
      },
      {
        "id": 46,
        "key": "Blaze",
        "page": 1,
        "row": 3,
        "col": 1,
        "reqLvl": 12,
        "reqs": [
          "Inferno"
        ],
        "passive": false,
        "nameZh": "足跟火",
        "nameTw": "熾烈之徑",
        "nameEn": "Blaze",
        "descZh": "在你身后创造出一道火墙 · 灼烧你的敌人",
        "descTw": "在你的腳下點燃熊熊烈火，隨你的足跡而形成灼燒敵人的火牆",
        "descEn": "creates a wall of fire · in your wake to scorch your enemies",
        "mana": {
          "base": 22,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "fire",
          "hitShift": 4,
          "min": [
            4,
            3,
            5,
            7,
            9,
            11
          ],
          "max": [
            8,
            3,
            6,
            8,
            10,
            12
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Warmth",
            "pct": 6
          }
        ],
        "synergies": [
          {
            "zhCN": "暖身术: 每等级+6%火焰伤害",
            "zhTW": "暖流：每等級 +6% 火焰傷害",
            "enUS": "Warmth: +6% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 47,
        "key": "Fire Ball",
        "page": 1,
        "row": 3,
        "col": 2,
        "reqLvl": 12,
        "reqs": [
          "Fire Bolt"
        ],
        "passive": false,
        "nameZh": "火球术",
        "nameTw": "火球術",
        "nameEn": "Fire Ball",
        "descZh": "创造出猛烈爆炸的死亡之球 · 吞噬你的敌人",
        "descTw": "發射一團爆炸的致命火球，將敵人吞沒",
        "descEn": "creates an explosive sphere of fiery death · to engulf your enemies",
        "mana": {
          "base": 10,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "fire",
          "hitShift": 7,
          "min": [
            12,
            13,
            23,
            28,
            33,
            38
          ],
          "max": [
            28,
            15,
            25,
            30,
            35,
            40
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Fire Bolt",
            "pct": 14
          },
          {
            "skill": "Meteor",
            "pct": 14
          }
        ],
        "synergies": [
          {
            "zhCN": "火焰弹: 每等级+14%火焰伤害",
            "zhTW": "火焰彈：每等級 +14% 火焰傷害",
            "enUS": "Fire Bolt: +14% Fire Damage per Level"
          },
          {
            "zhCN": "陨石术: 每等级+14%火焰伤害",
            "zhTW": "隕石術：每等級 +14% 火焰傷害",
            "enUS": "Meteor: +14% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 48,
        "key": "Nova",
        "page": 2,
        "row": 3,
        "col": 1,
        "reqLvl": 12,
        "reqs": [
          "Static Field"
        ],
        "passive": false,
        "nameZh": "闪电新星",
        "nameTw": "閃電新星",
        "nameEn": "Nova",
        "descZh": "创造出不断扩大的闪电之环 · 震击附近的敌人",
        "descTw": "造出一個向外擴張的電能之環，電擊附近的所有敵人",
        "descEn": "creates an expanding ring of lightning · to shock nearby enemies",
        "mana": {
          "base": 13,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "ltng",
          "hitShift": 8,
          "min": [
            1,
            6,
            7,
            8,
            9,
            10
          ],
          "max": [
            20,
            8,
            9,
            10,
            11,
            12
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Static Field",
            "pct": 5
          }
        ],
        "synergies": [
          {
            "zhCN": "静电场: 每等级+5%闪电伤害",
            "zhTW": "靜電力場：每等級 +5% 電擊傷害",
            "enUS": "Static Field: +5% Lightning Damage per Level"
          }
        ]
      },
      {
        "id": 49,
        "key": "Lightning",
        "page": 2,
        "row": 3,
        "col": 2,
        "reqLvl": 12,
        "reqs": [
          "Charged Bolt"
        ],
        "passive": false,
        "nameZh": "闪电术",
        "nameTw": "閃電箭",
        "nameEn": "Lightning",
        "descZh": "创造出一道强大的闪电 · 消灭你的敌人",
        "descTw": "發射一道威力強大的閃電重創你的敵人",
        "descEn": "creates a powerful lightning bolt · to lay waste to your enemies",
        "mana": {
          "base": 16,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "ltng",
          "hitShift": 8,
          "min": [
            1,
            0,
            0,
            0,
            0,
            0
          ],
          "max": [
            40,
            8,
            12,
            20,
            28,
            36
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Charged Bolt",
            "pct": 8
          },
          {
            "skill": "Chain Lightning",
            "pct": 8
          },
          {
            "skill": "Nova",
            "pct": 8
          }
        ],
        "synergies": [
          {
            "zhCN": "电荷弹: 每等级+8%闪电伤害",
            "zhTW": "電能彈：每等級 +8% 電擊傷害",
            "enUS": "Charged Bolt: +8% Lightning Damage per Level"
          },
          {
            "zhCN": "闪电新星: 每等级+8%闪电伤害",
            "zhTW": "閃電新星：每等級 +8% 電擊傷害",
            "enUS": "Nova: +8% Lightning Damage per Level"
          },
          {
            "zhCN": "连锁闪电: 每等级+8%闪电伤害",
            "zhTW": "連鎖閃電：每等級 +8% 電擊傷害",
            "enUS": "Chain Lightning: +8% Lightning Damage per Level"
          }
        ]
      },
      {
        "id": 50,
        "key": "Shiver Armor",
        "page": 3,
        "row": 3,
        "col": 3,
        "reqLvl": 12,
        "reqs": [
          "Ice Blast",
          "Frozen Armor"
        ],
        "passive": false,
        "nameZh": "碎冰甲",
        "nameTw": "碎冰甲",
        "nameEn": "Shiver Armor",
        "descZh": "提高防御值, 冻结攻击你的敌人 · 并对其造成伤害",
        "descTw": "提高你的防禦，並且凍結與傷害擊中你的敵人",
        "descEn": "increases your defense · freezes and damages enemies that hit you",
        "mana": {
          "base": 11,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "cold",
          "hitShift": 7,
          "min": [
            12,
            6,
            8,
            10,
            12,
            14
          ],
          "max": [
            16,
            7,
            9,
            11,
            13,
            15
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Frozen Armor",
            "pct": 9
          },
          {
            "skill": "Chilling Armor",
            "pct": 9
          }
        ],
        "synergies": [
          {
            "zhCN": "冰封甲: 每等级+9%冰霜伤害",
            "zhTW": "冰封甲：每等級 +9% 冰寒傷害",
            "enUS": "Frozen Armor: +9% Cold Damage per Level"
          },
          {
            "zhCN": "冰封甲: 每等级+0秒",
            "zhTW": "冰封甲：每等級 +0 秒",
            "enUS": "Frozen Armor: +0 Seconds per Level"
          },
          {
            "zhCN": "冰棱甲: 每等级+9%冰霜伤害",
            "zhTW": "寒冰甲：每等級 +9% 冰寒傷害",
            "enUS": "Chilling Armor: +9% Cold Damage per Level"
          },
          {
            "zhCN": "冰棱甲: 每等级+0秒",
            "zhTW": "寒冰甲：每等級 +0 秒",
            "enUS": "Chilling Armor: +0 Seconds per Level"
          }
        ]
      },
      {
        "id": 51,
        "key": "Fire Wall",
        "page": 1,
        "row": 4,
        "col": 1,
        "reqLvl": 18,
        "reqs": [
          "Blaze"
        ],
        "passive": false,
        "nameZh": "火焰墙",
        "nameTw": "火牆術",
        "nameEn": "Fire Wall",
        "descZh": "创造出烈焰之墙 · 点燃附近的敌人",
        "descTw": "造出一道火焰之牆焚燒附近的敵人",
        "descEn": "creates a wall of flame that · burns nearby enemies",
        "mana": {
          "base": 22,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 1.4,
        "dmg": {
          "type": "fire",
          "hitShift": 4,
          "min": [
            15,
            9,
            14,
            21,
            21,
            21
          ],
          "max": [
            20,
            9,
            14,
            21,
            21,
            21
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Warmth",
            "pct": 4
          },
          {
            "skill": "Inferno",
            "pct": 4
          }
        ],
        "synergies": [
          {
            "zhCN": "暖身术: 每等级+4%火焰伤害",
            "zhTW": "暖流：每等級 +4% 火焰傷害",
            "enUS": "Warmth: +4% Fire Damage per Level"
          },
          {
            "zhCN": "地狱火: 每等级+1%火焰伤害",
            "zhTW": "煉獄之火：每等級 +1% 火焰傷害",
            "enUS": "Inferno: +1% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 52,
        "key": "Enchant",
        "page": 1,
        "row": 4,
        "col": 3,
        "reqLvl": 18,
        "reqs": [
          "Warmth",
          "Fire Ball"
        ],
        "passive": false,
        "nameZh": "附魔火焰",
        "nameTw": "附魔",
        "nameEn": "Enchant",
        "descZh": "强化目标角色或仆从装备的武器 · 为所有武器附加火焰伤害",
        "descTw": "強化指定的角色或是隨從所裝備的武器 · 為所有武器附上火焰傷害",
        "descEn": "enchants equipped weapon of targeted character or minion · adds fire damage to all weapons",
        "mana": {
          "base": 25,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "fire",
          "hitShift": 7,
          "min": [
            16,
            3,
            7,
            11,
            15,
            19
          ],
          "max": [
            20,
            5,
            9,
            13,
            17,
            21
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Warmth",
            "pct": 9
          }
        ],
        "synergies": [
          {
            "zhCN": "暖身术: 每等级+9%火焰伤害",
            "zhTW": "暖流：每等級 +9% 火焰傷害",
            "enUS": "Warmth: +9% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 53,
        "key": "Chain Lightning",
        "page": 2,
        "row": 4,
        "col": 2,
        "reqLvl": 18,
        "reqs": [
          "Lightning"
        ],
        "passive": false,
        "nameZh": "连锁闪电",
        "nameTw": "連鎖閃電",
        "nameEn": "Chain Lightning",
        "descZh": "创造出一道闪电 · 在多个目标之间弹射",
        "descTw": "發射一道會在多個目標之間彈跳的閃電",
        "descEn": "creates a bolt of lightning that · arcs through several targets",
        "mana": {
          "base": 9,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "ltng",
          "hitShift": 8,
          "min": [
            1,
            0,
            0,
            0,
            0,
            0
          ],
          "max": [
            40,
            11,
            13,
            15,
            15,
            15
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Charged Bolt",
            "pct": 4
          },
          {
            "skill": "Lightning",
            "pct": 4
          },
          {
            "skill": "Nova",
            "pct": 4
          }
        ],
        "synergies": [
          {
            "zhCN": "电荷弹: 每等级+4%闪电伤害",
            "zhTW": "電能彈：每等級 +4% 電擊傷害",
            "enUS": "Charged Bolt: +4% Lightning Damage per Level"
          },
          {
            "zhCN": "闪电新星: 每等级+4%闪电伤害",
            "zhTW": "閃電新星：每等級 +4% 電擊傷害",
            "enUS": "Nova: +4% Lightning Damage per Level"
          },
          {
            "zhCN": "闪电术: 每等级+4%闪电伤害",
            "zhTW": "閃電箭：每等級 +4% 電擊傷害",
            "enUS": "Lightning: +4% Lightning Damage per Level"
          }
        ]
      },
      {
        "id": 54,
        "key": "Teleport",
        "page": 2,
        "row": 4,
        "col": 3,
        "reqLvl": 18,
        "reqs": [
          "Telekinesis"
        ],
        "passive": false,
        "nameZh": "传送术",
        "nameTw": "傳送術",
        "nameEn": "Teleport",
        "descZh": "立即移动到视野内的目的地",
        "descTw": "立即移動到你視線所及的指定地點",
        "descEn": "instantly moves to a destination within your line of sight",
        "mana": {
          "base": 24,
          "lvl": -1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 55,
        "key": "Glacial Spike",
        "page": 3,
        "row": 4,
        "col": 2,
        "reqLvl": 18,
        "reqs": [
          "Ice Blast"
        ],
        "passive": false,
        "nameZh": "冰尖柱",
        "nameTw": "冰川之槍",
        "nameEn": "Glacial Spike",
        "descZh": "创造出魔法寒冰的彗星 · 冻结或消灭附近的敌人",
        "descTw": "射出魔法冰槍，凍結與傷害目標週遭的敵人",
        "descEn": "creates a magical ice comet · that freezes or kills nearby enemies",
        "mana": {
          "base": 20,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "cold",
          "hitShift": 7,
          "min": [
            32,
            14,
            26,
            28,
            30,
            32
          ],
          "max": [
            48,
            15,
            27,
            29,
            31,
            33
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Ice Bolt",
            "pct": 5
          },
          {
            "skill": "Ice Blast",
            "pct": 5
          },
          {
            "skill": "Frozen Orb",
            "pct": 5
          }
        ],
        "synergies": [
          {
            "zhCN": "冰霜弹: 每等级+5%冰霜伤害",
            "zhTW": "寒冰彈：每等級 +5% 冰寒傷害",
            "enUS": "Ice Bolt: +5% Cold Damage per Level"
          },
          {
            "zhCN": "冰球爆: 每等级+5%冰霜伤害",
            "zhTW": "寒冰球：每等級 +5% 冰寒傷害",
            "enUS": "Ice Blast: +5% Cold Damage per Level"
          },
          {
            "zhCN": "暴风雪: 每等级+3%冻结时间",
            "zhTW": "暴風雪：每等級 +3% 凍結時效",
            "enUS": "Blizzard: +3% Freeze Length per Level"
          },
          {
            "zhCN": "冰封球: 每等级+5%冰霜伤害",
            "zhTW": "冰封球：每等級 +5% 冰寒傷害",
            "enUS": "Frozen Orb: +5% Cold Damage per Level"
          }
        ]
      },
      {
        "id": 56,
        "key": "Meteor",
        "page": 1,
        "row": 5,
        "col": 2,
        "reqLvl": 24,
        "reqs": [
          "Fire Ball",
          "Fire Wall"
        ],
        "passive": false,
        "nameZh": "陨石术",
        "nameTw": "隕石術",
        "nameEn": "Meteor",
        "descZh": "召唤陨石从天而降 · 砸向敌人并将其点燃",
        "descTw": "召喚一枚隕石從天而降，重擊並焚燒你的敵人",
        "descEn": "summons a meteor from the heavens · to crush and incinerate your enemies",
        "mana": {
          "base": 34,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 1.2,
        "dmg": {
          "type": "fire",
          "hitShift": 8,
          "min": [
            80,
            23,
            39,
            79,
            81,
            83
          ],
          "max": [
            100,
            25,
            41,
            81,
            83,
            85
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Fire Bolt",
            "pct": 5
          },
          {
            "skill": "Fire Ball",
            "pct": 5
          }
        ],
        "synergies": [
          {
            "zhCN": "火焰弹: 每等级+5%火焰伤害",
            "zhTW": "火焰彈：每等級 +5% 火焰傷害",
            "enUS": "Fire Bolt: +5% Fire Damage per Level"
          },
          {
            "zhCN": "火球术: 每等级+5%火焰伤害",
            "zhTW": "火球術：每等級 +5% 火焰傷害",
            "enUS": "Fire Ball: +5% Fire Damage per Level"
          },
          {
            "zhCN": "地狱火: 每等级+3%平均每秒火焰伤害",
            "zhTW": "煉獄之火：每等級 +3% 平均每秒火焰傷害",
            "enUS": "Inferno: +3% Average Fire Damage per Second per Level"
          }
        ]
      },
      {
        "id": 57,
        "key": "Thunder Storm",
        "page": 2,
        "row": 5,
        "col": 1,
        "reqLvl": 24,
        "reqs": [
          "Nova",
          "Chain Lightning"
        ],
        "passive": false,
        "nameZh": "雷暴术",
        "nameTw": "雷電風暴",
        "nameEn": "Thunder Storm",
        "descZh": "召唤出致命的雷云风暴 · 用闪电攻击你的敌人",
        "descTw": "召喚致命的雷電風暴，以閃電連續攻擊你的敵人",
        "descEn": "summons a deadly thunderstorm that strikes · your enemies with bolts of lightning",
        "mana": {
          "base": 19,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "ltng",
          "hitShift": 8,
          "min": [
            1,
            10,
            10,
            11,
            11,
            11
          ],
          "max": [
            100,
            10,
            10,
            11,
            11,
            11
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Static Field",
            "pct": 7
          }
        ],
        "synergies": [
          {
            "zhCN": "静电场: 每等级+7%闪电伤害",
            "zhTW": "靜電力場：每等級 +7% 電擊傷害",
            "enUS": "Static Field: +7% Lightning Damage per Level"
          }
        ]
      },
      {
        "id": 58,
        "key": "Energy Shield",
        "page": 2,
        "row": 5,
        "col": 3,
        "reqLvl": 24,
        "reqs": [
          "Teleport",
          "Chain Lightning"
        ],
        "passive": false,
        "nameZh": "能量盾",
        "nameTw": "能量護盾",
        "nameEn": "Energy Shield",
        "descZh": "创造出魔法护盾, 当你受到伤害时 · 将消耗法力而非生命",
        "descTw": "造出一個魔法護盾，在你受傷時以法力替代耗損的生命",
        "descEn": "creates a magical shield that consumes mana · instead of health when you take damage",
        "mana": {
          "base": 5,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "elem",
          "hitShift": 8,
          "min": [
            20,
            5,
            2,
            1,
            1,
            1
          ],
          "max": [
            0,
            0,
            0,
            0,
            0,
            0
          ]
        },
        "synergies": [
          {
            "zhCN": "心灵传动: 每等级消耗法力 -6.25%",
            "zhTW": "心靈傳動：每等級抵銷傷害的法力消耗 -6.25%",
            "enUS": "Telekinesis: -6.25% Mana consumed per Level"
          }
        ]
      },
      {
        "id": 59,
        "key": "Blizzard",
        "page": 3,
        "row": 5,
        "col": 1,
        "reqLvl": 24,
        "reqs": [
          "Frost Nova",
          "Glacial Spike"
        ],
        "passive": false,
        "nameZh": "暴风雪",
        "nameTw": "暴風雪",
        "nameEn": "Blizzard",
        "descZh": "召唤巨大的冰块摧毁敌人",
        "descTw": "召喚威力強大的暴風雪，降下冰雹消滅敵人",
        "descEn": "summons massive shards of ice to destroy your enemies",
        "mana": {
          "base": 23,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 1.8,
        "dmg": {
          "type": "cold",
          "hitShift": 8,
          "min": [
            45,
            15,
            30,
            45,
            55,
            65
          ],
          "max": [
            75,
            16,
            31,
            46,
            56,
            66
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Ice Bolt",
            "pct": 5
          },
          {
            "skill": "Ice Blast",
            "pct": 5
          },
          {
            "skill": "Glacial Spike",
            "pct": 5
          }
        ],
        "synergies": [
          {
            "zhCN": "冰霜弹: 每等级+5%冰霜伤害",
            "zhTW": "寒冰彈：每等級 +5% 冰寒傷害",
            "enUS": "Ice Bolt: +5% Cold Damage per Level"
          },
          {
            "zhCN": "冰球爆: 每等级+5%冰霜伤害",
            "zhTW": "寒冰球：每等級 +5% 冰寒傷害",
            "enUS": "Ice Blast: +5% Cold Damage per Level"
          },
          {
            "zhCN": "冰尖柱: 每等级+5%冰霜伤害",
            "zhTW": "冰川之槍：每等級 +5% 冰寒傷害",
            "enUS": "Glacial Spike: +5% Cold Damage per Level"
          }
        ]
      },
      {
        "id": 60,
        "key": "Chilling Armor",
        "page": 3,
        "row": 5,
        "col": 3,
        "reqLvl": 24,
        "reqs": [
          "Shiver Armor"
        ],
        "passive": false,
        "nameZh": "冰棱甲",
        "nameTw": "寒冰甲",
        "nameEn": "Chilling Armor",
        "descZh": "提高防御值, 并向远程攻击者 · 反射出一枚冰霜弹",
        "descTw": "提高防禦，並對遠程攻擊者射出反擊的寒冰彈",
        "descEn": "increases defense and discharges an ice bolt in retaliation · against ranged attackers",
        "mana": {
          "base": 17,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "cold",
          "hitShift": 7,
          "min": [
            16,
            8,
            10,
            12,
            14,
            16
          ],
          "max": [
            20,
            9,
            11,
            13,
            15,
            17
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Frozen Armor",
            "pct": 9
          },
          {
            "skill": "Shiver Armor",
            "pct": 9
          }
        ],
        "synergies": [
          {
            "zhCN": "冰封甲: 每等级+9%冰霜伤害",
            "zhTW": "冰封甲：每等級 +9% 冰寒傷害",
            "enUS": "Frozen Armor: +9% Cold Damage per Level"
          },
          {
            "zhCN": "冰封甲: 每等级+0秒",
            "zhTW": "冰封甲：每等級 +0 秒",
            "enUS": "Frozen Armor: +0 Seconds per Level"
          },
          {
            "zhCN": "碎冰甲: 每等级+9%冰霜伤害",
            "zhTW": "碎冰甲：每等級 +9% 冰寒傷害",
            "enUS": "Shiver Armor: +9% Cold Damage per Level"
          },
          {
            "zhCN": "碎冰甲: 每等级+0秒",
            "zhTW": "碎冰甲：每等級 +0 秒",
            "enUS": "Shiver Armor: +0 Seconds per Level"
          }
        ]
      },
      {
        "id": 61,
        "key": "Fire Mastery",
        "page": 1,
        "row": 6,
        "col": 2,
        "reqLvl": 30,
        "reqs": [],
        "passive": true,
        "nameZh": "火系精通",
        "nameTw": "火焰專精",
        "nameEn": "Fire Mastery",
        "descZh": "被动 - 提高你的所有火焰法术 · 造成的伤害",
        "descTw": "被動 - 提高你的火焰法術造成的所有傷害",
        "descEn": "passive - increases all damage caused by your fire spells",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 62,
        "key": "Hydra",
        "page": 1,
        "row": 6,
        "col": 3,
        "reqLvl": 30,
        "reqs": [
          "Enchant"
        ],
        "passive": false,
        "nameZh": "多头蛇",
        "nameTw": "多頭蛇",
        "nameEn": "Hydra",
        "descZh": "召唤出多头的火焰怪兽 · 将敌人烧为灰烬",
        "descTw": "召喚一個多頭的火焰魔獸，將敵人燒成灰燼",
        "descEn": "summons a multi-headed beast of flame · to reduce your enemies to ashes",
        "mana": {
          "base": 40,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "fire",
          "hitShift": 7,
          "min": [
            28,
            11,
            15,
            19,
            23,
            27
          ],
          "max": [
            39,
            13,
            17,
            21,
            25,
            29
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Fire Bolt",
            "pct": 3
          },
          {
            "skill": "Fire Ball",
            "pct": 3
          }
        ],
        "synergies": [
          {
            "zhCN": "火焰弹: 每等级+3%火焰伤害",
            "zhTW": "火焰彈：每等級 +3% 火焰傷害",
            "enUS": "Fire Bolt: +3% Fire Damage per Level"
          },
          {
            "zhCN": "火球术: 每等级+3%火焰伤害",
            "zhTW": "火球術：每等級 +3% 火焰傷害",
            "enUS": "Fire Ball: +3% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 63,
        "key": "Lightning Mastery",
        "page": 2,
        "row": 6,
        "col": 2,
        "reqLvl": 30,
        "reqs": [],
        "passive": true,
        "nameZh": "雷系精通",
        "nameTw": "閃電專精",
        "nameEn": "Lightning Mastery",
        "descZh": "被动 - 提高你的所有闪电法术 · 造成的伤害",
        "descTw": "被動 - 提高你的閃電法術造成的所有傷害",
        "descEn": "passive - increases all damage caused by your lightning spells",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 64,
        "key": "Frozen Orb",
        "page": 3,
        "row": 6,
        "col": 1,
        "reqLvl": 30,
        "reqs": [
          "Blizzard"
        ],
        "passive": false,
        "nameZh": "冰封球",
        "nameTw": "冰封球",
        "nameEn": "Frozen Orb",
        "descZh": "创造出魔法寒冰之球, 不断喷射寒冰弹 · 为敌人带来毁灭",
        "descTw": "造出一個魔法光球，噴出大量的冰彈重創你的敵人",
        "descEn": "creates a magical globe that sprays a torrent of ice bolts · to lay waste to your enemies",
        "mana": {
          "base": 50,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 1,
        "dmg": {
          "type": "cold",
          "hitShift": 7,
          "min": [
            80,
            20,
            24,
            28,
            29,
            30
          ],
          "max": [
            90,
            21,
            25,
            29,
            30,
            31
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Ice Bolt",
            "pct": 2
          }
        ],
        "synergies": [
          {
            "zhCN": "冰霜弹: 每等级+2%冰霜伤害",
            "zhTW": "寒冰彈：每等級 +2% 冰寒傷害",
            "enUS": "Ice Bolt: +2% Cold Damage per Level"
          }
        ]
      },
      {
        "id": 65,
        "key": "Cold Mastery",
        "page": 3,
        "row": 6,
        "col": 2,
        "reqLvl": 30,
        "reqs": [],
        "passive": true,
        "nameZh": "冰系精通",
        "nameTw": "冰寒專精",
        "nameEn": "Cold Mastery",
        "descZh": "被动 - 降低敌人的冰霜抗性 · 来提高你的冰霜法术伤害",
        "descTw": "被動 - 穿透敵人的抗性，提高冰寒法術的傷害",
        "descEn": "passive - increases the damage of your cold spells · by piercing enemies' resistances to cold",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      }
    ]
  },
  {
    "id": "pal",
    "nameZh": "圣骑士",
    "nameTw": "聖騎士",
    "nameEn": "Paladin",
    "icon": "/images/ui/paladinicon.webp",
    "tabs": [
      {
        "page": 3,
        "zhCN": "防御光环",
        "zhTW": "防禦靈氣",
        "enUS": "Defensive Auras"
      },
      {
        "page": 2,
        "zhCN": "攻击光环",
        "zhTW": "攻擊靈氣",
        "enUS": "Offensive Auras"
      },
      {
        "page": 1,
        "zhCN": "战斗技能",
        "zhTW": "戰鬥技能",
        "enUS": "Combat Skills"
      }
    ],
    "skills": [
      {
        "id": 96,
        "key": "Sacrifice",
        "page": 1,
        "row": 1,
        "col": 1,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "牺牲",
        "nameTw": "犧牲打擊",
        "nameEn": "Sacrifice",
        "descZh": "以生命为代价 · 提高攻击的准确度与伤害",
        "descTw": "付出自己的生命值，提高準確性和傷害",
        "descEn": "increased accuracy and damage · at the cost of life",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "救赎: 每等级+15%伤害",
            "zhTW": "救贖：每等級 +15% 傷害",
            "enUS": "Redemption: +15% Damage per Level"
          },
          {
            "zhCN": "狂热: 每等级+5%伤害",
            "zhTW": "狂熱：每等級 +5% 傷害",
            "enUS": "Fanaticism: +5% Damage per Level"
          }
        ]
      },
      {
        "id": 97,
        "key": "Smite",
        "page": 1,
        "row": 1,
        "col": 3,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "盾击",
        "nameTw": "盾牌重擊",
        "nameEn": "Smite",
        "descZh": "用盾牌猛击敌人 · 使其短暂地昏迷",
        "descTw": "用盾牌猛擊敵人，暫時讓對手昏迷",
        "descEn": "temporarily stun your enemy · by bashing it with your shield",
        "mana": {
          "base": 2,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 98,
        "key": "Might",
        "page": 2,
        "row": 1,
        "col": 1,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "力量",
        "nameTw": "力量",
        "nameEn": "Might",
        "descZh": "激活时, 这个光环会提高你和 · 小队成员的伤害",
        "descTw": "啟用時，靈氣會增加你和隊伍成員所造成的傷害",
        "descEn": "when active, aura increases the damage · done by you and your party",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 99,
        "key": "Prayer",
        "page": 3,
        "row": 1,
        "col": 1,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "祈祷",
        "nameTw": "祈禱",
        "nameEn": "Prayer",
        "descZh": "激活时, 这个光环会为你和 · 小队成员缓慢恢复生命值",
        "descTw": "啟用時，靈氣會緩緩恢復你和隊伍成員的生命值",
        "descEn": "when active, aura slowly regenerates · the life of you and your party",
        "mana": {
          "base": 16,
          "lvl": 3,
          "shift": 4,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "elem",
          "hitShift": 8,
          "min": [
            2,
            1,
            1,
            2,
            2,
            3
          ],
          "max": [
            0,
            0,
            0,
            0,
            0,
            0
          ]
        },
        "synergies": []
      },
      {
        "id": 100,
        "key": "Resist Fire",
        "page": 3,
        "row": 1,
        "col": 3,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "抗火",
        "nameTw": "抗火",
        "nameEn": "Resist Fire",
        "descZh": "激活时, 这个光环会降低你和 · 小队成员受到的火焰伤害",
        "descTw": "啟用時，靈氣會降低你和隊伍成員受到的火焰傷害",
        "descEn": "when active, aura decreases fire damage · done to you and your party",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 101,
        "key": "Holy Bolt",
        "page": 1,
        "row": 2,
        "col": 2,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "圣光弹",
        "nameTw": "聖光彈",
        "nameEn": "Holy Bolt",
        "descZh": "释放出一道神圣能量箭 · 对恶魔和亡灵敌人造成伤害 · 也可以治疗盟友",
        "descTw": "射出神聖的能量彈，可對惡魔和不死怪物造成傷害， · 或是治療你的盟友",
        "descEn": "a bolt of divine energy · that damages demons and undead · or heals allies",
        "mana": {
          "base": 32,
          "lvl": 1,
          "shift": 4,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "mag",
          "hitShift": 8,
          "min": [
            8,
            8,
            10,
            13,
            16,
            20
          ],
          "max": [
            16,
            8,
            11,
            15,
            18,
            23
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Fist of the Heavens",
            "pct": 50
          }
        ],
        "synergies": [
          {
            "zhCN": "天堂之拳: 每等级+50%魔法伤害",
            "zhTW": "天堂之拳：每等級 +50% 魔法傷害",
            "enUS": "Fist of the Heavens: +50% Magic Damage per Level"
          },
          {
            "zhCN": "祈祷: 每等级治愈+20%生命",
            "zhTW": "祈禱：每等級 +20% 生命治療",
            "enUS": "Prayer: +20% Life Healed per Level"
          }
        ]
      },
      {
        "id": 102,
        "key": "Holy Fire",
        "page": 2,
        "row": 2,
        "col": 2,
        "reqLvl": 6,
        "reqs": [
          "Might"
        ],
        "passive": false,
        "nameZh": "神圣之火",
        "nameTw": "神聖火焰",
        "nameEn": "Holy Fire",
        "descZh": "激活时, 这个光环会用 · 天堂的火焰攻击附近的敌人 · 在你的攻击中附加火焰伤害",
        "descTw": "啟用時，靈氣會以天堂之火傷害附近的敵人 · 為你的攻擊附加火焰傷害",
        "descEn": "when active, aura damages nearby enemies · with heavenly flames · adds fire damage to your attack",
        "mana": null,
        "cooldown": 0,
        "dmg": {
          "type": "fire",
          "hitShift": 7,
          "min": [
            2,
            1,
            4,
            6,
            7,
            8
          ],
          "max": [
            6,
            2,
            5,
            7,
            8,
            9
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Resist Fire",
            "pct": 21
          },
          {
            "skill": "Salvation",
            "pct": 21
          }
        ],
        "synergies": [
          {
            "zhCN": "抗火: 每等级+21%火焰伤害",
            "zhTW": "抗火：每等級 +21% 火焰傷害",
            "enUS": "Resist Fire: +21% Fire Damage per Level"
          },
          {
            "zhCN": "拯救: 每等级+10%火焰伤害",
            "zhTW": "聖護：每等級 +10% 火焰傷害",
            "enUS": "Salvation: +10% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 103,
        "key": "Thorns",
        "page": 2,
        "row": 2,
        "col": 3,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "荆棘",
        "nameTw": "荊棘",
        "nameEn": "Thorns",
        "descZh": "激活后，光环会将你和队伍受到的近战伤害 · 反弹给敌人",
        "descTw": "啟用時，靈氣會把你和隊伍成員受到的近戰傷害反彈回給敵人",
        "descEn": "when active, aura reflects melee damage taken by you · and your party back at your enemies",
        "mana": null,
        "cooldown": 0,
        "dmg": {
          "type": "elem",
          "hitShift": 8,
          "min": [
            4,
            4,
            8,
            12,
            16,
            20
          ],
          "max": [
            0,
            0,
            0,
            0,
            0,
            0
          ]
        },
        "synergies": []
      },
      {
        "id": 104,
        "key": "Defiance",
        "page": 3,
        "row": 2,
        "col": 2,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "反抗",
        "nameTw": "反抗",
        "nameEn": "Defiance",
        "descZh": "激活时, 这个光环会提高你和 · 小队成员的防御值",
        "descTw": "啟用時，靈氣會提高你和隊伍成員的防禦",
        "descEn": "when active, aura increases the defense · of you and your party",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 105,
        "key": "Resist Cold",
        "page": 3,
        "row": 2,
        "col": 3,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "抗冰",
        "nameTw": "抗寒",
        "nameEn": "Resist Cold",
        "descZh": "激活时, 这个光环会降低你和 · 小队成员受到的冰霜伤害",
        "descTw": "啟用時，靈氣會降低你和隊伍成員受到的冰寒傷害",
        "descEn": "when active, aura decreases cold damage · done to you and your party",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 106,
        "key": "Zeal",
        "page": 1,
        "row": 3,
        "col": 1,
        "reqLvl": 12,
        "reqs": [
          "Sacrifice"
        ],
        "passive": false,
        "nameZh": "热忱",
        "nameTw": "熱忱打擊",
        "nameEn": "Zeal",
        "descZh": "你可以在一次攻击中 · 攻击多个附近的敌人",
        "descTw": "一次攻擊可以連續打擊多名鄰近的敵人",
        "descEn": "allows you to attack multiple adjacent enemies · with a single attack",
        "mana": {
          "base": 2,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "牺牲: 每等级+12%伤害",
            "zhTW": "犧牲打擊：每等級 +12% 傷害",
            "enUS": "Sacrifice: +12% Damage per Level"
          }
        ]
      },
      {
        "id": 107,
        "key": "Charge",
        "page": 1,
        "row": 3,
        "col": 3,
        "reqLvl": 12,
        "reqs": [
          "Smite"
        ],
        "passive": false,
        "nameZh": "冲锋",
        "nameTw": "衝鋒打擊",
        "nameEn": "Charge",
        "descZh": "冲向战场, 攻击一名敌人",
        "descTw": "衝入戰場，攻擊敵人",
        "descEn": "charge into battle and attack an enemy",
        "mana": {
          "base": 9,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "精力: 每等级+20%伤害",
            "zhTW": "活力：每等級 +20% 傷害",
            "enUS": "Vigor: +20% Damage per Level"
          },
          {
            "zhCN": "力量: 每等级+20%伤害",
            "zhTW": "力量：每等級 +20% 傷害",
            "enUS": "Might: +20% Damage per Level"
          }
        ]
      },
      {
        "id": 108,
        "key": "Blessed Aim",
        "page": 2,
        "row": 3,
        "col": 1,
        "reqLvl": 12,
        "reqs": [
          "Might"
        ],
        "passive": false,
        "nameZh": "祝福瞄准",
        "nameTw": "精準祝福",
        "nameEn": "Blessed Aim",
        "descZh": "激活时, 这个光环会提高你和 · 小队成员的命中值",
        "descTw": "啟用時，靈氣會提高你和隊伍成員的準確率 ",
        "descEn": "when active, aura increases the attack rating · for you and your party",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 109,
        "key": "Cleansing",
        "page": 3,
        "row": 3,
        "col": 1,
        "reqLvl": 12,
        "reqs": [
          "Prayer"
        ],
        "passive": false,
        "nameZh": "净化",
        "nameTw": "淨化",
        "nameEn": "Cleansing",
        "descZh": "激活时, 这个光环降低你和 · 小队成员受到的毒素和诅咒 · 效果的持续时间",
        "descTw": "啟用時，靈氣會降低你和隊伍成員受到毒氣和詛咒效果的持續時間",
        "descEn": "when active, aura reduces the length · of time you and your party · will remain poisoned or cursed",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "祈祷",
            "zhTW": "祈禱",
            "enUS": "Prayer"
          }
        ]
      },
      {
        "id": 110,
        "key": "Resist Lightning",
        "page": 3,
        "row": 3,
        "col": 3,
        "reqLvl": 12,
        "reqs": [],
        "passive": false,
        "nameZh": "抗雷",
        "nameTw": "抗電",
        "nameEn": "Resist Lightning",
        "descZh": "激活时, 这个光环会降低你和 · 小队成员受到的闪电伤害",
        "descTw": "啟用時，靈氣會降低你和隊伍成員受到的電擊傷害",
        "descEn": "when active, aura decreases lightning damage · done to you and your party",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 111,
        "key": "Vengeance",
        "page": 1,
        "row": 4,
        "col": 1,
        "reqLvl": 18,
        "reqs": [
          "Zeal"
        ],
        "passive": false,
        "nameZh": "复仇",
        "nameTw": "復仇打擊",
        "nameEn": "Vengeance",
        "descZh": "每次成功的攻击会附加 · 火焰, 闪电和冰霜伤害",
        "descTw": "擊中敵人時攻擊附加火焰、電擊和冰寒傷害",
        "descEn": "fire, lightning and cold damage are added · to each successful attack",
        "mana": {
          "base": 16,
          "lvl": 1,
          "shift": 6,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "抗火: 每等级+10%火焰伤害",
            "zhTW": "抗火：每等級 +10% 火焰傷害",
            "enUS": "Resist Fire: +10% Fire Damage per Level"
          },
          {
            "zhCN": "抗冰: 每等级+10%冰霜伤害",
            "zhTW": "抗寒：每等級 +10% 冰寒傷害",
            "enUS": "Resist Cold: +10% Cold Damage per Level"
          },
          {
            "zhCN": "抗雷: 每等级+10%闪电伤害",
            "zhTW": "抗電：每等級 +10% 電擊傷害",
            "enUS": "Resist Lightning: +10% Lightning Damage per Level"
          },
          {
            "zhCN": "拯救: 每等级+2%元素伤害",
            "zhTW": "聖護：每等級 +2% 元素傷害",
            "enUS": "Salvation: +2% Elemental Damage per Level"
          }
        ]
      },
      {
        "id": 112,
        "key": "Blessed Hammer",
        "page": 1,
        "row": 4,
        "col": 2,
        "reqLvl": 18,
        "reqs": [
          "Holy Bolt"
        ],
        "passive": false,
        "nameZh": "祝福之锤",
        "nameTw": "祝福之鎚",
        "nameEn": "Blessed Hammer",
        "descZh": "召唤出一柄盘旋的灵体飞锤 · 对其击中的敌人造成伤害",
        "descTw": "召喚一把魔法之鎚，朝外旋轉飛出，傷害擊中的敵人",
        "descEn": "summons an ethereal hammer that · spirals outwards damaging enemies it hits",
        "mana": {
          "base": 20,
          "lvl": 1,
          "shift": 6,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "mag",
          "hitShift": 8,
          "min": [
            12,
            8,
            10,
            12,
            13,
            14
          ],
          "max": [
            16,
            8,
            10,
            12,
            13,
            14
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Vigor",
            "pct": 14
          },
          {
            "skill": "Blessed Aim",
            "pct": 14
          }
        ],
        "synergies": [
          {
            "zhCN": "祝福瞄准: 每等级+14%魔法伤害",
            "zhTW": "精準祝福：每等級 +14% 魔法傷害",
            "enUS": "Blessed Aim: +14% Magic Damage per Level"
          },
          {
            "zhCN": "精力: 每等级+14%魔法伤害",
            "zhTW": "活力：每等級 +14% 魔法傷害",
            "enUS": "Vigor: +14% Magic Damage per Level"
          }
        ]
      },
      {
        "id": 113,
        "key": "Concentration",
        "page": 2,
        "row": 4,
        "col": 1,
        "reqLvl": 18,
        "reqs": [
          "Blessed Aim"
        ],
        "passive": false,
        "nameZh": "专注",
        "nameTw": "專注",
        "nameEn": "Concentration",
        "descZh": "激活时, 这个光环会提高你和 · 小队成员的伤害 · 并降低攻击被打断的几率",
        "descTw": "啟用時，靈氣會提高你和隊伍成員造成的傷害，並降低攻擊中斷的機率",
        "descEn": "when active, aura increases the damage and decreases the chance · that the attack will be interrupted for you and your party ",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 114,
        "key": "Holy Freeze",
        "page": 2,
        "row": 4,
        "col": 2,
        "reqLvl": 18,
        "reqs": [
          "Holy Fire"
        ],
        "passive": false,
        "nameZh": "神圣之冰",
        "nameTw": "神聖冰凍",
        "nameEn": "Holy Freeze",
        "descZh": "激活时, 这个光环会冻结怪物 · 你的攻击附加冰霜伤害",
        "descTw": "啟用時，靈氣會凍住附近的怪物 · 為你的攻擊附加冰寒傷害",
        "descEn": "when active, aura freezes nearby monsters · adds cold damage to your attack",
        "mana": null,
        "cooldown": 0,
        "dmg": {
          "type": "cold",
          "hitShift": 8,
          "min": [
            2,
            1,
            2,
            3,
            4,
            5
          ],
          "max": [
            3,
            1,
            2,
            3,
            4,
            5
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Resist Cold",
            "pct": 15
          },
          {
            "skill": "Salvation",
            "pct": 15
          }
        ],
        "synergies": [
          {
            "zhCN": "抗冰: 每等级+15%冰霜伤害",
            "zhTW": "抗寒：每等級 +15% 冰寒傷害",
            "enUS": "Resist Cold: +15% Cold Damage per Level"
          },
          {
            "zhCN": "拯救: 每等级+7%冰霜伤害",
            "zhTW": "聖護：每等級 +7% 冰寒傷害",
            "enUS": "Salvation: +7% Cold Damage per Level"
          }
        ]
      },
      {
        "id": 115,
        "key": "Vigor",
        "page": 3,
        "row": 4,
        "col": 2,
        "reqLvl": 18,
        "reqs": [
          "Cleansing",
          "Defiance"
        ],
        "passive": false,
        "nameZh": "精力",
        "nameTw": "活力",
        "nameEn": "Vigor",
        "descZh": "激活时, 这个光环会提高你和 · 小队成员的耐力上限, 耐力回复速度 · 以及移动的速度 · ",
        "descTw": "啟用時，靈氣會提高你和隊伍成員的精力恢復率，精力上限，以及移動速度",
        "descEn": "when active, aura increases stamina recovery rate, maximum stamina · and movement speed for you and your party",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 116,
        "key": "Conversion",
        "page": 1,
        "row": 5,
        "col": 1,
        "reqLvl": 24,
        "reqs": [
          "Vengeance"
        ],
        "passive": false,
        "nameZh": "圣光转化",
        "nameTw": "招降打擊",
        "nameEn": "Conversion",
        "descZh": "劝化怪物, 让他们与其他邪恶的 · 恶魔与野兽作战",
        "descTw": "招降怪物，使其轉而攻擊其他惡魔和野獸",
        "descEn": "converts monsters to fight against · other foul demons and beasts",
        "mana": {
          "base": 4,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 117,
        "key": "Holy Shield",
        "page": 1,
        "row": 5,
        "col": 3,
        "reqLvl": 24,
        "reqs": [
          "Charge",
          "Blessed Hammer"
        ],
        "passive": false,
        "nameZh": "圣盾术",
        "nameTw": "神聖之盾",
        "nameEn": "Holy Shield",
        "descZh": "用神圣的力量强化你的盾牌",
        "descTw": "以神聖力量強化你的盾牌",
        "descEn": "enhances your shield with divine power",
        "mana": {
          "base": 35,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "phys",
          "hitShift": 8,
          "min": [
            3,
            2,
            3,
            4,
            4,
            4
          ],
          "max": [
            6,
            2,
            3,
            4,
            4,
            4
          ]
        },
        "synergies": [
          {
            "zhCN": "反抗: 每等级+15%防御值",
            "zhTW": "反抗：每等級 +15% 防禦",
            "enUS": "Defiance: +15% Defense per Level"
          }
        ]
      },
      {
        "id": 118,
        "key": "Holy Shock",
        "page": 2,
        "row": 5,
        "col": 2,
        "reqLvl": 24,
        "reqs": [
          "Holy Freeze"
        ],
        "passive": false,
        "nameZh": "神圣之雷",
        "nameTw": "神聖電擊",
        "nameEn": "Holy Shock",
        "descZh": "激活时, 这个光环会发出电流脉冲 · 对附近的敌人造成伤害 · 在你的攻击中附加闪电伤害",
        "descTw": "啟用時，靈氣會引發電流脈衝，對附近的敵人造成電擊傷害 · 為你的攻擊附加電擊傷害",
        "descEn": "when active, aura causes pulses of electricity · to damage nearby enemies · adds lightning damage to your attack",
        "mana": null,
        "cooldown": 0,
        "dmg": {
          "type": "ltng",
          "hitShift": 8,
          "min": [
            1,
            0,
            0,
            0,
            0,
            0
          ],
          "max": [
            10,
            6,
            8,
            10,
            12,
            15
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Resist Lightning",
            "pct": 12
          },
          {
            "skill": "Salvation",
            "pct": 12
          }
        ],
        "synergies": [
          {
            "zhCN": "抗雷: 每等级+12%闪电伤害",
            "zhTW": "抗電：每等級 +12% 電擊傷害",
            "enUS": "Resist Lightning: +12% Lightning Damage per Level"
          },
          {
            "zhCN": "拯救: 每等级+4%闪电伤害",
            "zhTW": "聖護：每等級 +4% 電擊傷害",
            "enUS": "Salvation: +4% Lightning Damage per Level"
          }
        ]
      },
      {
        "id": 119,
        "key": "Sanctuary",
        "page": 2,
        "row": 5,
        "col": 3,
        "reqLvl": 24,
        "reqs": [
          "Thorns",
          "Holy Freeze"
        ],
        "passive": false,
        "nameZh": "庇护之光",
        "nameTw": "庇護",
        "nameEn": "Sanctuary",
        "descZh": "激活时, 这个光环会对亡灵 · 造成伤害并将其击退",
        "descTw": "啟用時，靈氣會傷害不死怪物，並將其擊退",
        "descEn": "when active, aura damages the undead · and knocks them back",
        "mana": {
          "base": 1,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "mag",
          "hitShift": 8,
          "min": [
            8,
            4,
            4,
            5,
            5,
            6
          ],
          "max": [
            16,
            4,
            5,
            6,
            6,
            7
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Cleansing",
            "pct": 7
          }
        ],
        "synergies": [
          {
            "zhCN": "净化: 每等级+7%魔法伤害",
            "zhTW": "淨化：每等級 +7% 魔法傷害",
            "enUS": "Cleansing: +7% Magic Damage per Level"
          }
        ]
      },
      {
        "id": 120,
        "key": "Meditation",
        "page": 3,
        "row": 5,
        "col": 1,
        "reqLvl": 24,
        "reqs": [
          "Cleansing"
        ],
        "passive": false,
        "nameZh": "冥思",
        "nameTw": "冥想",
        "nameEn": "Meditation",
        "descZh": "激活时, 这个光环会提高你和 · 小队成员的法力回复速度",
        "descTw": "啟用時，靈氣會提高你和隊伍成員的法力恢復率",
        "descEn": "when active, aura increases mana recovery · for you and your party",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "祈祷",
            "zhTW": "祈禱",
            "enUS": "Prayer"
          }
        ]
      },
      {
        "id": 121,
        "key": "Fist of the Heavens",
        "page": 1,
        "row": 6,
        "col": 2,
        "reqLvl": 30,
        "reqs": [
          "Blessed Hammer",
          "Conversion"
        ],
        "passive": false,
        "nameZh": "天堂之拳",
        "nameTw": "天堂之拳",
        "nameEn": "Fist of the Heavens",
        "descZh": "召唤闪电击中你的目标 · 并发射圣光弹追寻敌人",
        "descTw": "閃電從天而降，再朝附近的敵人放射聖光彈",
        "descEn": "lightning strikes your target as holy bolts · seek out nearby enemies",
        "mana": {
          "base": 25,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0.4,
        "dmg": {
          "type": "ltng",
          "hitShift": 8,
          "min": [
            150,
            15,
            30,
            45,
            55,
            65
          ],
          "max": [
            200,
            15,
            30,
            45,
            55,
            65
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Holy Shock",
            "pct": 7
          }
        ],
        "synergies": [
          {
            "zhCN": "圣光弹: 每等级+15%圣光弹伤害",
            "zhTW": "聖光彈：每等級 +15% 聖光彈傷害",
            "enUS": "Holy Bolt: +15% Holy Bolt Damage per Level"
          },
          {
            "zhCN": "神圣之雷: 每等级+7%闪电伤害",
            "zhTW": "神聖電擊：每等級 +7% 電擊傷害",
            "enUS": "Holy Shock: +7% Lightning Damage per Level"
          }
        ]
      },
      {
        "id": 122,
        "key": "Fanaticism",
        "page": 2,
        "row": 6,
        "col": 1,
        "reqLvl": 30,
        "reqs": [
          "Concentration"
        ],
        "passive": false,
        "nameZh": "狂热",
        "nameTw": "狂熱",
        "nameEn": "Fanaticism",
        "descZh": "激活时, 这个光环会提高你和 · 小队成员的伤害, 攻击速度和命中值",
        "descTw": "啟用時，靈氣會提高你和隊伍成員的傷害、攻擊速度和準確率",
        "descEn": "when active, aura increases damage, attack speed · and attack rating for you and your party",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 123,
        "key": "Conviction",
        "page": 2,
        "row": 6,
        "col": 3,
        "reqLvl": 30,
        "reqs": [
          "Sanctuary"
        ],
        "passive": false,
        "nameZh": "定罪",
        "nameTw": "信念",
        "nameEn": "Conviction",
        "descZh": "激活时, 这个光环会降低附近 · 敌人的防御值和抗性",
        "descTw": "啟用時，靈氣會降低附近敵人的防禦和抗性",
        "descEn": "when active, aura reduces the defenses · and resistances of nearby enemies",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 124,
        "key": "Redemption",
        "page": 3,
        "row": 6,
        "col": 2,
        "reqLvl": 30,
        "reqs": [
          "Vigor"
        ],
        "passive": false,
        "nameZh": "救赎",
        "nameTw": "救贖",
        "nameEn": "Redemption",
        "descZh": "激活时, 这个光环会尝试 · 救赎已死怪物的灵魂 · 为你恢复生命和法力",
        "descTw": "啟用時，靈氣會試圖救贖死亡敵人的靈魂，恢復你的生命值和法力",
        "descEn": "when active, aura attempts to redeem · the souls of slain enemies to give · you life and mana",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 125,
        "key": "Salvation",
        "page": 3,
        "row": 6,
        "col": 3,
        "reqLvl": 30,
        "reqs": [],
        "passive": false,
        "nameZh": "拯救",
        "nameTw": "聖護",
        "nameEn": "Salvation",
        "descZh": "激活时, 这个光环会降低你和 · 小队成员受到的 · 火焰、冰霜和闪电伤害",
        "descTw": "啟用時，靈氣會降低你和隊伍成員受到的火焰、冰寒和電擊傷害",
        "descEn": "when active, aura decreases fire, cold and lightning damage · done to you and your party",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      }
    ]
  },
  {
    "id": "ama",
    "nameZh": "亚马逊",
    "nameTw": "亞馬遜",
    "nameEn": "Amazon",
    "icon": "/images/ui/amazonicon.webp",
    "tabs": [
      {
        "page": 3,
        "zhCN": "标枪和长矛技能",
        "zhTW": "標槍與長矛技能",
        "enUS": "Javelin and Spear Skills"
      },
      {
        "page": 2,
        "zhCN": "被动和魔法技能",
        "zhTW": "被動與魔法技能",
        "enUS": "Passive and Magic Skills"
      },
      {
        "page": 1,
        "zhCN": "弓和弩技能",
        "zhTW": "弓與弩技能",
        "enUS": "Bow and Crossbow Skills"
      }
    ],
    "skills": [
      {
        "id": 6,
        "key": "Magic Arrow",
        "page": 1,
        "row": 1,
        "col": 2,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "魔法箭",
        "nameTw": "魔法箭",
        "nameEn": "Magic Arrow",
        "descZh": "创造出魔法箭矢或弩矢 · 造成额外的伤害",
        "descTw": "造出魔法箭矢或弩箭，可造成額外的傷害",
        "descEn": "creates a magical arrow or bolt · that does extra damage",
        "mana": {
          "base": 12,
          "lvl": -1,
          "shift": 5,
          "min": 0
        },
        "cooldown": 0,
        "dmg": {
          "type": "phys",
          "hitShift": 8,
          "min": [
            1,
            1,
            1,
            1,
            1,
            1
          ],
          "max": [
            1,
            1,
            1,
            1,
            1,
            1
          ]
        },
        "synergies": []
      },
      {
        "id": 7,
        "key": "Fire Arrow",
        "page": 1,
        "row": 1,
        "col": 3,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "火焰箭",
        "nameTw": "火焰箭",
        "nameEn": "Fire Arrow",
        "descZh": "用火焰魔法强化你的 · 箭矢或弩矢",
        "descTw": "以魔法火焰強化你的箭矢或弩箭",
        "descEn": "magically enhances your arrows · or bolts with fire",
        "mana": {
          "base": 24,
          "lvl": 0,
          "shift": 5,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "fire",
          "hitShift": 8,
          "min": [
            1,
            2,
            3,
            6,
            12,
            24
          ],
          "max": [
            4,
            2,
            3,
            7,
            14,
            27
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Exploding Arrow",
            "pct": 12
          }
        ],
        "synergies": [
          {
            "zhCN": "爆裂箭: 每等级+12%火焰伤害",
            "zhTW": "爆裂箭：每等級 +12% 火焰傷害",
            "enUS": "Exploding Arrow: +12% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 8,
        "key": "Inner Sight",
        "page": 2,
        "row": 1,
        "col": 1,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "心眼",
        "nameTw": "心靈視野",
        "nameEn": "Inner Sight",
        "descZh": "照亮附近的敌人 · 以便你和小队成员 · 更容易地攻击它们",
        "descTw": "顯現附近的敵人，讓你和隊伍成員更容易擊中目標",
        "descEn": "illuminates nearby enemies · making them easier to hit · for you and your party",
        "mana": {
          "base": 10,
          "lvl": 0,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "elem",
          "hitShift": 8,
          "min": [
            40,
            25,
            45,
            60,
            80,
            100
          ],
          "max": [
            0,
            0,
            0,
            0,
            0,
            0
          ]
        },
        "synergies": []
      },
      {
        "id": 9,
        "key": "Critical Strike",
        "page": 2,
        "row": 1,
        "col": 3,
        "reqLvl": 1,
        "reqs": [],
        "passive": true,
        "nameZh": "致命攻击",
        "nameTw": "致命攻勢",
        "nameEn": "Critical Strike",
        "descZh": "被动 - 你的攻击有几率造成双倍伤害",
        "descTw": "被動 - 你的攻擊有一定機率對目標造成兩倍傷害",
        "descEn": "passive - your attacks have a chance to do double damage",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 10,
        "key": "Jab",
        "page": 3,
        "row": 1,
        "col": 1,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "戳刺",
        "nameTw": "戳刺",
        "nameEn": "Jab",
        "descZh": "使用标枪或长矛类型武器 · 迅速地发动一系列猛刺",
        "descTw": "使用標槍或是長矛武器，快速連續刺擊敵人",
        "descEn": "attacks with a series of rapid thrusts · using a javelin or spear class weapon",
        "mana": {
          "base": 8,
          "lvl": 1,
          "shift": 6,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 11,
        "key": "Cold Arrow",
        "page": 1,
        "row": 2,
        "col": 1,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "冰霜箭",
        "nameTw": "冷霜箭",
        "nameEn": "Cold Arrow",
        "descZh": "用魔法强化你的箭矢或弩矢 · 添加冰霜伤害和减速效果 · 冰霜箭只能造成通常一半的伤害",
        "descTw": "以魔法強化你的箭矢或弩箭，附加冰寒傷害與緩速效果 · 冷霜箭只會造成平時一半的傷害",
        "descEn": "magically enhances your arrows or bolts · by adding cold damage and a slowing effect · cold arrows only do half of their regular damage",
        "mana": {
          "base": 28,
          "lvl": 1,
          "shift": 5,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "cold",
          "hitShift": 7,
          "min": [
            6,
            4,
            5,
            8,
            16,
            42
          ],
          "max": [
            8,
            4,
            5,
            9,
            17,
            44
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Ice Arrow",
            "pct": 12
          }
        ],
        "synergies": [
          {
            "zhCN": "急冻箭: 每等级+12%冰霜伤害",
            "zhTW": "寒冰箭：每等級 +12% 冰寒傷害",
            "enUS": "Ice Arrow: +12% Cold Damage per Level"
          }
        ]
      },
      {
        "id": 12,
        "key": "Multiple Shot",
        "page": 1,
        "row": 2,
        "col": 2,
        "reqLvl": 6,
        "reqs": [
          "Magic Arrow"
        ],
        "passive": false,
        "nameZh": "多重箭",
        "nameTw": "多重箭",
        "nameEn": "Multiple Shot",
        "descZh": "将一枚箭矢或弩矢 · 用魔法化作多支",
        "descTw": "以魔法讓箭矢或弩箭一分為多",
        "descEn": "magically splits one arrow · or bolt into many",
        "mana": {
          "base": 4,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "导引箭: 每等级+12%伤害",
            "zhTW": "導引箭：每等級 +12% 傷害",
            "enUS": "Guided Arrow: +12% Damage per Level"
          }
        ]
      },
      {
        "id": 13,
        "key": "Dodge",
        "page": 2,
        "row": 2,
        "col": 2,
        "reqLvl": 6,
        "reqs": [],
        "passive": true,
        "nameZh": "闪避",
        "nameTw": "閃躲",
        "nameEn": "Dodge",
        "descZh": "被动 - 你在攻击或站立不动时 · 有几率闪避敌人的近战攻击",
        "descTw": "被動 - 你在站立不動或攻擊時，有一定機率閃避近戰攻擊",
        "descEn": "passive - you have a chance to dodge · a melee attack when attacking · or standing still",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 14,
        "key": "Power Strike",
        "page": 3,
        "row": 2,
        "col": 2,
        "reqLvl": 6,
        "reqs": [
          "Jab"
        ],
        "passive": false,
        "nameZh": "电荷攻击",
        "nameTw": "充能強擊",
        "nameEn": "Power Strike",
        "descZh": "在使用标枪和长矛类 · 武器时附加闪电伤害",
        "descTw": "使用標槍和長矛武器攻擊時附加電擊傷害",
        "descEn": "adds lightning damage to attacks with · javelin and spear class weapons",
        "mana": {
          "base": 8,
          "lvl": 1,
          "shift": 6,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "ltng",
          "hitShift": 8,
          "min": [
            1,
            0,
            0,
            0,
            0,
            0
          ],
          "max": [
            16,
            18,
            36,
            54,
            72,
            90
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Lightning Strike",
            "pct": 14
          },
          {
            "skill": "Lightning Bolt",
            "pct": 14
          },
          {
            "skill": "Charged Strike",
            "pct": 14
          }
        ],
        "synergies": [
          {
            "zhCN": "闪电球: 每等级+14%闪电伤害",
            "zhTW": "閃電槍：每等級 +14% 電擊傷害",
            "enUS": "Lightning Bolt: +14% Lightning Damage per Level"
          },
          {
            "zhCN": "充能一击: 每等级+14%闪电伤害",
            "zhTW": "聚能強擊：每等級 +14% 電擊傷害",
            "enUS": "Charged Strike: +14% Lightning Damage per Level"
          },
          {
            "zhCN": "闪电攻击: 每等级+14%闪电伤害",
            "zhTW": "閃電強擊：每等級 +14% 電擊傷害",
            "enUS": "Lightning Strike: +14% Lightning Damage per Level"
          }
        ]
      },
      {
        "id": 15,
        "key": "Poison Javelin",
        "page": 3,
        "row": 2,
        "col": 3,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "剧毒标枪",
        "nameTw": "劇毒標槍",
        "nameEn": "Poison Javelin",
        "descZh": "用魔法强化你的标枪 · 飞行时留下毒云",
        "descTw": "以魔法強化你的標槍，射出後留下劇毒雲團",
        "descEn": "magically enhances your javelin · to leave a trail of poison clouds",
        "mana": {
          "base": 16,
          "lvl": 1,
          "shift": 6,
          "min": 1
        },
        "cooldown": 0.6,
        "dmg": {
          "type": "pois",
          "hitShift": 0,
          "min": [
            32,
            16,
            32,
            48,
            64,
            96
          ],
          "max": [
            48,
            16,
            36,
            52,
            68,
            100
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Plague Javelin",
            "pct": 12
          }
        ],
        "synergies": [
          {
            "zhCN": "瘟疫标枪: 每等级+12%毒素伤害",
            "zhTW": "瘟疫標槍：每等級 +12% 毒素傷害",
            "enUS": "Plague Javelin: +12% Poison Damage per Level"
          }
        ]
      },
      {
        "id": 16,
        "key": "Exploding Arrow",
        "page": 1,
        "row": 3,
        "col": 3,
        "reqLvl": 12,
        "reqs": [
          "Fire Arrow",
          "Multiple Shot"
        ],
        "passive": false,
        "nameZh": "爆裂箭",
        "nameTw": "爆裂箭",
        "nameEn": "Exploding Arrow",
        "descZh": "强化你的箭矢或弩矢 · 击中时发生爆炸 · 对附近的敌人造成伤害",
        "descTw": "在箭矢或弩箭上附魔，使其擊中時爆炸，傷害所有附近的敵人",
        "descEn": "enchants an arrow or bolt that explodes on · contact, damaging all nearby enemies",
        "mana": {
          "base": 20,
          "lvl": 1,
          "shift": 6,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "fire",
          "hitShift": 8,
          "min": [
            5,
            6,
            12,
            14,
            16,
            20
          ],
          "max": [
            13,
            7,
            13,
            15,
            18,
            23
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Fire Arrow",
            "pct": 14
          }
        ],
        "synergies": [
          {
            "zhCN": "火焰箭: 每等级+14%火焰伤害",
            "zhTW": "火焰箭：每等級 +14% 火焰傷害",
            "enUS": "Fire Arrow: +14% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 17,
        "key": "Slow Missiles",
        "page": 2,
        "row": 3,
        "col": 1,
        "reqLvl": 12,
        "reqs": [
          "Inner Sight"
        ],
        "passive": false,
        "nameZh": "飞矢减速",
        "nameTw": "緩箭術",
        "nameEn": "Slow Missiles",
        "descZh": "照亮附近的敌人并减慢它们的远程攻击",
        "descTw": "顯現附近的敵人，並減慢他們的遠程攻擊",
        "descEn": "illuminates nearby enemies and slows their ranged attacks",
        "mana": {
          "base": 10,
          "lvl": 0,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 18,
        "key": "Avoid",
        "page": 2,
        "row": 3,
        "col": 2,
        "reqLvl": 12,
        "reqs": [
          "Dodge"
        ],
        "passive": true,
        "nameZh": "躲避",
        "nameTw": "閃身",
        "nameEn": "Avoid",
        "descZh": "被动 - 你在攻击或站立不动时 · 有几率闪避敌人的远程攻击",
        "descTw": "被動 - 你在站立不動或攻擊時，有一定機率閃避遠程攻擊",
        "descEn": "passive - you have a chance to dodge enemy missiles · when attacking or standing still",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 19,
        "key": "Impale",
        "page": 3,
        "row": 3,
        "col": 1,
        "reqLvl": 12,
        "reqs": [
          "Jab"
        ],
        "passive": false,
        "nameZh": "刺爆",
        "nameTw": "穿刺",
        "nameEn": "Impale",
        "descZh": "提高攻击伤害但武器会快速破损",
        "descTw": "提高攻擊傷害，但會使武器耐久度迅速下降",
        "descEn": "increases attack damage but rapidly degrades the weapon",
        "mana": {
          "base": 3,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 20,
        "key": "Lightning Bolt",
        "page": 3,
        "row": 3,
        "col": 3,
        "reqLvl": 12,
        "reqs": [
          "Poison Javelin"
        ],
        "passive": false,
        "nameZh": "闪电球",
        "nameTw": "閃電槍",
        "nameEn": "Lightning Bolt",
        "descZh": "将标枪化为闪电之球",
        "descTw": "以魔法將你的標槍化為一道閃電",
        "descEn": "magically converts your javelin into a bolt of lightning",
        "mana": {
          "base": 24,
          "lvl": 1,
          "shift": 6,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "ltng",
          "hitShift": 8,
          "min": [
            1,
            0,
            0,
            0,
            0,
            0
          ],
          "max": [
            40,
            12,
            18,
            28,
            48,
            88
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Lightning Strike",
            "pct": 3
          },
          {
            "skill": "Power Strike",
            "pct": 3
          },
          {
            "skill": "Charged Strike",
            "pct": 3
          },
          {
            "skill": "Lightning Fury",
            "pct": 3
          }
        ],
        "synergies": [
          {
            "zhCN": "电荷攻击: 每等级+3%闪电伤害",
            "zhTW": "充能強擊：每等級 +3% 電擊傷害",
            "enUS": "Power Strike: +3% Lightning Damage per Level"
          },
          {
            "zhCN": "充能一击: 每等级+3%闪电伤害",
            "zhTW": "聚能強擊：每等級 +3% 電擊傷害",
            "enUS": "Charged Strike: +3% Lightning Damage per Level"
          },
          {
            "zhCN": "闪电攻击: 每等级+3%闪电伤害",
            "zhTW": "閃電強擊：每等級 +3% 電擊傷害",
            "enUS": "Lightning Strike: +3% Lightning Damage per Level"
          },
          {
            "zhCN": "雷霆之怒: 每等级+3%闪电伤害",
            "zhTW": "閃電烈怒：每等級 +3% 電擊傷害",
            "enUS": "Lightning Fury: +3% Lightning Damage per Level"
          }
        ]
      },
      {
        "id": 21,
        "key": "Ice Arrow",
        "page": 1,
        "row": 4,
        "col": 1,
        "reqLvl": 18,
        "reqs": [
          "Cold Arrow"
        ],
        "passive": false,
        "nameZh": "急冻箭",
        "nameTw": "寒冰箭",
        "nameEn": "Ice Arrow",
        "descZh": "用魔法强化你的箭矢或弩矢 · 可以冻结敌人",
        "descTw": "以魔法強化你的箭矢或弩箭，凍結你的敵人",
        "descEn": "magically enhances your arrow or bolt · to freeze your enemies",
        "mana": {
          "base": 16,
          "lvl": 1,
          "shift": 6,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "cold",
          "hitShift": 8,
          "min": [
            6,
            6,
            12,
            18,
            26,
            36
          ],
          "max": [
            10,
            6,
            13,
            19,
            27,
            38
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Cold Arrow",
            "pct": 8
          }
        ],
        "synergies": [
          {
            "zhCN": "冰霜箭: 每等级+8%冰霜伤害",
            "zhTW": "冷霜箭：每等級 +8% 冰寒傷害",
            "enUS": "Cold Arrow: +8% Cold Damage per Level"
          },
          {
            "zhCN": "冻结箭: 每等级+5%冻结时间",
            "zhTW": "冰凍箭：每等級 +5% 凍結時效",
            "enUS": "Freezing Arrow: +5% Freeze Length per Level"
          }
        ]
      },
      {
        "id": 22,
        "key": "Guided Arrow",
        "page": 1,
        "row": 4,
        "col": 2,
        "reqLvl": 18,
        "reqs": [
          "Cold Arrow",
          "Multiple Shot"
        ],
        "passive": false,
        "nameZh": "导引箭",
        "nameTw": "導引箭",
        "nameEn": "Guided Arrow",
        "descZh": "强化你的箭矢和弩矢 · 可以追踪你的目标 · 或自动寻找目标",
        "descTw": "強化你的箭矢或弩箭，使其追蹤你的目標或自行尋找敵人",
        "descEn": "enhances your arrows and bolts · to track your target · or seek one of its own",
        "mana": {
          "base": 32,
          "lvl": -1,
          "shift": 6,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "多重箭: 每等级+12%伤害",
            "zhTW": "多重箭：每等級 +12% 傷害",
            "enUS": "Multiple Shot: +12% Damage per Level"
          }
        ]
      },
      {
        "id": 23,
        "key": "Penetrate",
        "page": 2,
        "row": 4,
        "col": 3,
        "reqLvl": 18,
        "reqs": [
          "Critical Strike"
        ],
        "passive": true,
        "nameZh": "刺穿",
        "nameTw": "精準攻勢",
        "nameEn": "Penetrate",
        "descZh": "被动 - 提高你的命中值",
        "descTw": "被動 - 提高你的準確率",
        "descEn": "passive - increases your attack rating",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 24,
        "key": "Charged Strike",
        "page": 3,
        "row": 4,
        "col": 2,
        "reqLvl": 18,
        "reqs": [
          "Power Strike",
          "Lightning Bolt"
        ],
        "passive": false,
        "nameZh": "充能一击",
        "nameTw": "聚能強擊",
        "nameEn": "Charged Strike",
        "descZh": "为标枪和长矛类武器添加闪电伤害 · 并在击中目标时放出电荷弹",
        "descTw": "在標槍與長矛武器上附加電擊傷害並在擊中時釋放電能彈",
        "descEn": "adds lightning damage to javelin and spear class weapons · and releases charged bolts upon impact",
        "mana": {
          "base": 16,
          "lvl": 1,
          "shift": 6,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "ltng",
          "hitShift": 8,
          "min": [
            1,
            0,
            0,
            0,
            0,
            0
          ],
          "max": [
            30,
            12,
            16,
            20,
            24,
            28
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Lightning Strike",
            "pct": 14
          },
          {
            "skill": "Lightning Bolt",
            "pct": 14
          },
          {
            "skill": "Power Strike",
            "pct": 14
          }
        ],
        "synergies": [
          {
            "zhCN": "电荷攻击: 每等级+14%闪电伤害",
            "zhTW": "充能強擊：每等級 +14% 電擊傷害",
            "enUS": "Power Strike: +14% Lightning Damage per Level"
          },
          {
            "zhCN": "闪电球: 每等级+14%闪电伤害",
            "zhTW": "閃電槍：每等級 +14% 電擊傷害",
            "enUS": "Lightning Bolt: +14% Lightning Damage per Level"
          },
          {
            "zhCN": "闪电攻击: 每等级+14%闪电伤害",
            "zhTW": "閃電強擊：每等級 +14% 電擊傷害",
            "enUS": "Lightning Strike: +14% Lightning Damage per Level"
          }
        ]
      },
      {
        "id": 25,
        "key": "Plague Javelin",
        "page": 3,
        "row": 4,
        "col": 3,
        "reqLvl": 18,
        "reqs": [
          "Lightning Bolt"
        ],
        "passive": false,
        "nameZh": "瘟疫标枪",
        "nameTw": "瘟疫標槍",
        "nameEn": "Plague Javelin",
        "descZh": "用魔法强化你的标枪 · 击中时爆炸成一片毒云",
        "descTw": "以魔法強化你的標槍，擊中時引發擴散的劇毒雲霧",
        "descEn": "magically enhances your javelin to release · expanding clouds of poison upon impact",
        "mana": {
          "base": 14,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 1,
        "dmg": {
          "type": "pois",
          "hitShift": 3,
          "min": [
            12,
            8,
            16,
            26,
            55,
            80
          ],
          "max": [
            18,
            8,
            16,
            26,
            55,
            80
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Poison Javelin",
            "pct": 14
          }
        ],
        "synergies": [
          {
            "zhCN": "剧毒标枪: 每等级+14%毒素伤害",
            "zhTW": "劇毒標槍：每等級 +14% 毒素傷害",
            "enUS": "Poison Javelin: +14% Poison Damage per Level"
          }
        ]
      },
      {
        "id": 26,
        "key": "Strafe",
        "page": 1,
        "row": 5,
        "col": 2,
        "reqLvl": 24,
        "reqs": [
          "Guided Arrow"
        ],
        "passive": false,
        "nameZh": "连珠箭",
        "nameTw": "掃射",
        "nameEn": "Strafe",
        "descZh": "将一枚箭矢或弩矢化作多支 · 攻击附近的多名敌人",
        "descTw": "射出的箭矢會魔法分裂，攻擊附近的多名敵人",
        "descEn": "magically splits one arrow into several · that target multiple nearby enemies",
        "mana": {
          "base": 11,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "多重箭: 每等级+5%伤害",
            "zhTW": "多重箭：每等級 +5% 傷害",
            "enUS": "Multiple Shot: +5% Damage per Level"
          },
          {
            "zhCN": "导引箭: 每等级+10%伤害",
            "zhTW": "導引箭：每等級 +10% 傷害",
            "enUS": "Guided Arrow: +10% Damage per Level"
          }
        ]
      },
      {
        "id": 27,
        "key": "Immolation Arrow",
        "page": 1,
        "row": 5,
        "col": 3,
        "reqLvl": 24,
        "reqs": [
          "Exploding Arrow"
        ],
        "passive": false,
        "nameZh": "献祭箭",
        "nameTw": "熾炎箭",
        "nameEn": "Immolation Arrow",
        "descZh": "强化你的箭矢或弩矢 · 造成大量的火焰伤害 · 命中时制造出一片火海",
        "descTw": "強化你的箭矢或弩箭，造成大量火焰傷害，並在擊中地點燃起烈火",
        "descEn": "enhances arrows or bolts to · cause severe fire damage and · creates a pyre upon impact",
        "mana": {
          "base": 24,
          "lvl": 1,
          "shift": 6,
          "min": 1
        },
        "cooldown": 0.6,
        "dmg": {
          "type": "fire",
          "hitShift": 8,
          "min": [
            12,
            12,
            23,
            34,
            36,
            38
          ],
          "max": [
            23,
            12,
            23,
            34,
            36,
            38
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Exploding Arrow",
            "pct": 10
          }
        ],
        "synergies": [
          {
            "zhCN": "火焰箭: 每等级+5%平均每秒火焰伤害",
            "zhTW": "火焰箭：每等級 +5% 平均每秒火焰傷害",
            "enUS": "Fire Arrow: +5% Average Fire Damage per Second per Level"
          },
          {
            "zhCN": "爆裂箭: 每等级+10%火焰伤害",
            "zhTW": "爆裂箭：每等級 +10% 火焰傷害",
            "enUS": "Exploding Arrow: +10% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 28,
        "key": "Dopplezon",
        "page": 2,
        "row": 5,
        "col": 1,
        "reqLvl": 24,
        "reqs": [
          "Slow Missiles"
        ],
        "passive": false,
        "nameZh": "诱饵",
        "nameTw": "替身",
        "nameEn": "Decoy",
        "descZh": "制造出自己的复制 · 吸引敌人的火力",
        "descTw": "放出一個自己的替身，引開敵人的攻擊",
        "descEn": "creates a duplicate of yourself · that draws fire from enemies",
        "mana": {
          "base": 76,
          "lvl": -3,
          "shift": 6,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 29,
        "key": "Evade",
        "page": 2,
        "row": 5,
        "col": 2,
        "reqLvl": 24,
        "reqs": [
          "Avoid"
        ],
        "passive": true,
        "nameZh": "回避",
        "nameTw": "閃避",
        "nameEn": "Evade",
        "descZh": "被动 - 在行走或奔跑时 · 你有几率躲闪 · 近战或远程攻击",
        "descTw": "被動 - 你在行走或跑步時，有一定機率閃避近戰或遠程攻擊",
        "descEn": "passive - you have a chance to dodge · a melee or missile attack · when walking or running",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 30,
        "key": "Fend",
        "page": 3,
        "row": 5,
        "col": 1,
        "reqLvl": 24,
        "reqs": [
          "Impale"
        ],
        "passive": false,
        "nameZh": "猛刺",
        "nameTw": "疾刺",
        "nameEn": "Fend",
        "descZh": "攻击附近所有敌人",
        "descTw": "攻擊所有鄰近的目標",
        "descEn": "attacks all adjacent targets",
        "mana": {
          "base": 5,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 31,
        "key": "Freezing Arrow",
        "page": 1,
        "row": 6,
        "col": 1,
        "reqLvl": 30,
        "reqs": [
          "Ice Arrow"
        ],
        "passive": false,
        "nameZh": "冻结箭",
        "nameTw": "冰凍箭",
        "nameEn": "Freezing Arrow",
        "descZh": "用魔法强化你的箭矢或弩矢 · 冻结成群的怪物",
        "descTw": "以魔法強化你的箭矢或弩箭，凍結整群的怪物",
        "descEn": "magically enhances an arrow or bolt · to freeze entire groups of monsters",
        "mana": {
          "base": 36,
          "lvl": 1,
          "shift": 6,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "cold",
          "hitShift": 8,
          "min": [
            40,
            10,
            15,
            20,
            22,
            24
          ],
          "max": [
            50,
            10,
            15,
            20,
            22,
            24
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Cold Arrow",
            "pct": 12
          }
        ],
        "synergies": [
          {
            "zhCN": "冰霜箭: 每等级+12%冰霜伤害",
            "zhTW": "冷霜箭：每等級 +12% 冰寒傷害",
            "enUS": "Cold Arrow: +12% Cold Damage per Level"
          },
          {
            "zhCN": "急冻箭: 每等级+5%冻结时间",
            "zhTW": "寒冰箭：每等級 +5% 凍結時效",
            "enUS": "Ice Arrow: +5% Freeze Length per Level"
          }
        ]
      },
      {
        "id": 32,
        "key": "Valkyrie",
        "page": 2,
        "row": 6,
        "col": 1,
        "reqLvl": 30,
        "reqs": [
          "Dopplezon",
          "Evade"
        ],
        "passive": false,
        "nameZh": "女武神",
        "nameTw": "女武神",
        "nameEn": "Valkyrie",
        "descZh": "召唤一位强大的女武神盟友",
        "descTw": "召喚威力強大的女武神同伴",
        "descEn": "summons a powerful Valkyrie ally",
        "mana": {
          "base": 25,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0.6,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "诱饵: 每等级+20%生命",
            "zhTW": "替身：每等級 +20% 生命",
            "enUS": "Decoy: +20% Life per Level"
          },
          {
            "zhCN": "刺穿: 每等级+40%命中值",
            "zhTW": "精準攻勢：每等級 +40% 準確率",
            "enUS": "Penetrate: +40% Attack Rating per Level"
          },
          {
            "zhCN": "致命攻击",
            "zhTW": "致命攻勢",
            "enUS": "Critical Strike"
          },
          {
            "zhCN": "闪避",
            "zhTW": "閃躲",
            "enUS": "Dodge"
          },
          {
            "zhCN": "躲避",
            "zhTW": "閃身",
            "enUS": "Avoid"
          },
          {
            "zhCN": "回避",
            "zhTW": "閃避",
            "enUS": "Evade"
          }
        ]
      },
      {
        "id": 33,
        "key": "Pierce",
        "page": 2,
        "row": 6,
        "col": 3,
        "reqLvl": 30,
        "reqs": [
          "Penetrate"
        ],
        "passive": true,
        "nameZh": "贯穿",
        "nameTw": "貫穿攻勢",
        "nameEn": "Pierce",
        "descZh": "被动 - 你的投射物有几率 · 在击中时穿过敌人",
        "descTw": "被動 - 你的遠程攻擊有一定機率在擊中時穿透敵人",
        "descEn": "passive - your missiles have a chance to · pass through enemies that they hit",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 34,
        "key": "Lightning Strike",
        "page": 3,
        "row": 6,
        "col": 2,
        "reqLvl": 30,
        "reqs": [
          "Charged Strike"
        ],
        "passive": false,
        "nameZh": "闪电攻击",
        "nameTw": "閃電強擊",
        "nameEn": "Lightning Strike",
        "descZh": "为标枪和长矛类武器附加闪电伤害 · 并在击中时释放连锁闪电",
        "descTw": "在標槍與長矛武器上附加電擊傷害並在擊中時釋放連鎖閃電",
        "descEn": "adds lightning damage to javelin and spear class weapons · and releases chain lightning upon impact",
        "mana": {
          "base": 9,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "ltng",
          "hitShift": 8,
          "min": [
            1,
            0,
            0,
            0,
            0,
            0
          ],
          "max": [
            25,
            10,
            15,
            20,
            25,
            30
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Charged Strike",
            "pct": 11
          },
          {
            "skill": "Lightning Bolt",
            "pct": 11
          },
          {
            "skill": "Power Strike",
            "pct": 11
          }
        ],
        "synergies": [
          {
            "zhCN": "电荷攻击: 每等级+11%闪电伤害",
            "zhTW": "充能強擊：每等級 +11% 電擊傷害",
            "enUS": "Power Strike: +11% Lightning Damage per Level"
          },
          {
            "zhCN": "闪电球: 每等级+11%闪电伤害",
            "zhTW": "閃電槍：每等級 +11% 電擊傷害",
            "enUS": "Lightning Bolt: +11% Lightning Damage per Level"
          },
          {
            "zhCN": "充能一击: 每等级+11%闪电伤害",
            "zhTW": "聚能強擊：每等級 +11% 電擊傷害",
            "enUS": "Charged Strike: +11% Lightning Damage per Level"
          }
        ]
      },
      {
        "id": 35,
        "key": "Lightning Fury",
        "page": 3,
        "row": 6,
        "col": 3,
        "reqLvl": 30,
        "reqs": [
          "Plague Javelin"
        ],
        "passive": false,
        "nameZh": "雷霆之怒",
        "nameTw": "閃電烈怒",
        "nameEn": "Lightning Fury",
        "descZh": "将一枚投出的标枪化为强大的闪电球 · 击中目标时分裂",
        "descTw": "投出的標槍會化為強大的閃電，並且在擊中時分裂成多道閃電",
        "descEn": "changes a thrown javelin into a powerful · bolt of lightning that splits on impact",
        "mana": {
          "base": 20,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "ltng",
          "hitShift": 8,
          "min": [
            1,
            0,
            0,
            0,
            0,
            0
          ],
          "max": [
            40,
            20,
            30,
            40,
            50,
            50
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Charged Strike",
            "pct": 1
          },
          {
            "skill": "Lightning Bolt",
            "pct": 1
          },
          {
            "skill": "Power Strike",
            "pct": 1
          },
          {
            "skill": "Lightning Strike",
            "pct": 1
          }
        ],
        "synergies": [
          {
            "zhCN": "电荷攻击: 每等级+1%闪电伤害",
            "zhTW": "充能強擊：每等級 +1% 電擊傷害",
            "enUS": "Power Strike: +1% Lightning Damage per Level"
          },
          {
            "zhCN": "闪电球: 每等级+1%闪电伤害",
            "zhTW": "閃電槍：每等級 +1% 電擊傷害",
            "enUS": "Lightning Bolt: +1% Lightning Damage per Level"
          },
          {
            "zhCN": "充能一击: 每等级+1%闪电伤害",
            "zhTW": "聚能強擊：每等級 +1% 電擊傷害",
            "enUS": "Charged Strike: +1% Lightning Damage per Level"
          },
          {
            "zhCN": "闪电攻击: 每等级+1%闪电伤害",
            "zhTW": "閃電強擊：每等級 +1% 電擊傷害",
            "enUS": "Lightning Strike: +1% Lightning Damage per Level"
          }
        ]
      }
    ]
  },
  {
    "id": "nec",
    "nameZh": "死灵法师",
    "nameTw": "死靈法師",
    "nameEn": "Necromancer",
    "icon": "/images/ui/necromancericon.webp",
    "tabs": [
      {
        "page": 3,
        "zhCN": "召唤术",
        "zhTW": "召喚技能",
        "enUS": "Summoning Skills"
      },
      {
        "page": 2,
        "zhCN": "毒素和白骨术",
        "zhTW": "毒素與骸骨技能",
        "enUS": "Poison and Bone Skills"
      },
      {
        "page": 1,
        "zhCN": "诅咒术",
        "zhTW": "詛咒",
        "enUS": "Curses"
      }
    ],
    "skills": [
      {
        "id": 66,
        "key": "Amplify Damage",
        "page": 1,
        "row": 1,
        "col": 2,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "伤害加深",
        "nameTw": "傷害加深",
        "nameEn": "Amplify Damage",
        "descZh": "诅咒一群敌人 · 提高它们受到的非魔法伤害",
        "descTw": "詛咒一群敵人，使其受到的非魔法傷害提高",
        "descEn": "curses a group of enemies, increasing · the non-magic damage they receive",
        "mana": {
          "base": 4,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 67,
        "key": "Teeth",
        "page": 2,
        "row": 1,
        "col": 2,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "骨牙",
        "nameTw": "剔骨之牙",
        "nameEn": "Teeth",
        "descZh": "发射出一排带有倒刺的骨牙",
        "descTw": "召喚尖銳無比的利牙，連續射向目標",
        "descEn": "fires a barrage of summoned barbed teeth",
        "mana": {
          "base": 6,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "mag",
          "hitShift": 7,
          "min": [
            4,
            2,
            2,
            3,
            4,
            5
          ],
          "max": [
            8,
            2,
            3,
            4,
            5,
            6
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Bone Wall",
            "pct": 15
          },
          {
            "skill": "Bone Prison",
            "pct": 15
          },
          {
            "skill": "Bone Spear",
            "pct": 15
          },
          {
            "skill": "Bone Spirit",
            "pct": 15
          }
        ],
        "synergies": [
          {
            "zhCN": "骨墙: 每等级+15%魔法伤害",
            "zhTW": "骨牆：每等級 +15% 魔法傷害",
            "enUS": "Bone Wall: +15% Magic Damage per Level"
          },
          {
            "zhCN": "骨矛: 每等级+15%魔法伤害",
            "zhTW": "骨矛：每等級 +15% 魔法傷害",
            "enUS": "Bone Spear: +15% Magic Damage per Level"
          },
          {
            "zhCN": "骨牢: 每等级+15%魔法伤害",
            "zhTW": "骨牢：每等級 +15% 魔法傷害",
            "enUS": "Bone Prison: +15% Magic Damage per Level"
          },
          {
            "zhCN": "骨灵: 每等级+15%魔法伤害",
            "zhTW": "骸骨之魂：每等級 +15% 魔法傷害",
            "enUS": "Bone Spirit: +15% Magic Damage per Level"
          }
        ]
      },
      {
        "id": 68,
        "key": "Bone Armor",
        "page": 2,
        "row": 1,
        "col": 3,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "骨甲",
        "nameTw": "骸骨護甲",
        "nameEn": "Bone Armor",
        "descZh": "制造出盘旋的白骨盾牌 · 吸收近战伤害",
        "descTw": "召喚骸骨護盾環繞在身旁，吸收近戰傷害",
        "descEn": "creates an orbiting shield of bone · that absorbs melee damage",
        "mana": {
          "base": 11,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "骨墙: 每等级+15点伤害吸收",
            "zhTW": "骨牆：每等級 +15 傷害吸收",
            "enUS": "Bone Wall: +15 Damage Absorbed per Level"
          },
          {
            "zhCN": "骨牢: 每等级+15点伤害吸收",
            "zhTW": "骨牢：每等級 +15 傷害吸收",
            "enUS": "Bone Prison: +15 Damage Absorbed per Level"
          }
        ]
      },
      {
        "id": 69,
        "key": "Skeleton Mastery",
        "page": 3,
        "row": 1,
        "col": 1,
        "reqLvl": 1,
        "reqs": [
          "Raise Skeleton"
        ],
        "passive": true,
        "nameZh": "骷髅精通",
        "nameTw": "骷髏專精",
        "nameEn": "Skeleton Mastery",
        "descZh": "被动 - 你复活的骷髅和怪物 · 具有更高的生命和伤害",
        "descTw": "被動 - 提高你復生的骷髏和重生的生物的生命值與造成的傷害",
        "descEn": "passive - increases life and damage · of raised skeletons and revived creatures",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 70,
        "key": "Raise Skeleton",
        "page": 3,
        "row": 1,
        "col": 3,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "复生骷髅",
        "nameTw": "復生骷髏",
        "nameEn": "Raise Skeleton",
        "descZh": "对死去怪物的残骸施放 · 复活一个骷髅战士 · 为你而战",
        "descTw": "對怪物的屍體施放，將其復生為骷髏戰士為你而戰",
        "descEn": "cast on the corpse of a slain monster, · this raises a skeleton warrior that · fights for you",
        "mana": {
          "base": 6,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "elem",
          "hitShift": 8,
          "min": [
            0,
            0,
            1,
            2,
            3,
            4
          ],
          "max": [
            0,
            0,
            0,
            0,
            0,
            0
          ]
        },
        "synergies": [
          {
            "zhCN": "骷髅精通",
            "zhTW": "骷髏專精",
            "enUS": "Skeleton Mastery"
          },
          {
            "zhCN": "召唤抗性",
            "zhTW": "召喚物抗性",
            "enUS": "Summon Resist"
          }
        ]
      },
      {
        "id": 71,
        "key": "Dim Vision",
        "page": 1,
        "row": 2,
        "col": 1,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "微暗灵视",
        "nameTw": "昏暗視野",
        "nameEn": "Dim Vision",
        "descZh": "诅咒一群怪物 · 降低它们的视野范围",
        "descTw": "詛咒一群怪物，降低他們的視野範圍",
        "descEn": "curses a group of monsters, · reducing their vision radius",
        "mana": {
          "base": 9,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 72,
        "key": "Weaken",
        "page": 1,
        "row": 2,
        "col": 3,
        "reqLvl": 6,
        "reqs": [
          "Amplify Damage"
        ],
        "passive": false,
        "nameZh": "削弱",
        "nameTw": "削弱",
        "nameEn": "Weaken",
        "descZh": "诅咒一群敌人 · 降低它们造成的伤害",
        "descTw": "詛咒一群敵人，降低他們造成的傷害",
        "descEn": "curses a group of enemies, · reducing the amount of damage they inflict",
        "mana": {
          "base": 4,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 73,
        "key": "Poison Dagger",
        "page": 2,
        "row": 2,
        "col": 1,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "毒匕",
        "nameTw": "淬毒匕首",
        "nameEn": "Poison Dagger",
        "descZh": "使你的匕首攻击附加毒素",
        "descTw": "在你的匕首上施加毒藥，攻擊時讓目標中毒",
        "descEn": "adds poison to your dagger attacks",
        "mana": {
          "base": 12,
          "lvl": 1,
          "shift": 6,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "pois",
          "hitShift": 1,
          "min": [
            18,
            10,
            15,
            20,
            23,
            26
          ],
          "max": [
            40,
            10,
            15,
            20,
            23,
            26
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Poison Explosion",
            "pct": 20
          },
          {
            "skill": "Poison Nova",
            "pct": 20
          }
        ],
        "synergies": [
          {
            "zhCN": "毒爆: 每等级+20%毒素伤害",
            "zhTW": "毒爆：每等級 +20% 毒素傷害",
            "enUS": "Poison Explosion: +20% Poison Damage per Level"
          },
          {
            "zhCN": "剧毒新星: 每等级+20%毒素伤害",
            "zhTW": "劇毒新星：每等級 +20% 毒素傷害",
            "enUS": "Poison Nova: +20% Poison Damage per Level"
          }
        ]
      },
      {
        "id": 74,
        "key": "Corpse Explosion",
        "page": 2,
        "row": 2,
        "col": 2,
        "reqLvl": 6,
        "reqs": [
          "Teeth"
        ],
        "passive": false,
        "nameZh": "邪爆",
        "nameTw": "屍爆",
        "nameEn": "Corpse Explosion",
        "descZh": "对死去怪物的残骸施放 · 使其爆炸, 对周围的敌人造成伤害",
        "descTw": "對怪物的屍體施放，使其爆炸，對附近的敵人造成傷害",
        "descEn": "cast on the corpse of a slain monster, · it explodes, damaging nearby enemies",
        "mana": {
          "base": 15,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 75,
        "key": "Clay Golem",
        "page": 3,
        "row": 2,
        "col": 2,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "黏土傀儡",
        "nameTw": "黏土魔像",
        "nameEn": "Clay Golem",
        "descZh": "用黏土制造一个傀儡 · 和你并肩战斗",
        "descTw": "從大地創造一個魔像，在你身邊為你而戰",
        "descEn": "creates a golem from the earth · to fight by your side",
        "mana": {
          "base": 15,
          "lvl": 3,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "傀儡精通",
            "zhTW": "魔像專精",
            "enUS": "Golem Mastery"
          },
          {
            "zhCN": "召唤抗性",
            "zhTW": "召喚物抗性",
            "enUS": "Summon Resist"
          },
          {
            "zhCN": "精华傀儡: 每等级+5%生命",
            "zhTW": "鮮血魔像：每等級 +5% 生命",
            "enUS": "Blood Golem: +5% Life per Level"
          },
          {
            "zhCN": "钢铁傀儡: 每等级+35防御值",
            "zhTW": "鋼鐵魔像：每等級 +35 防禦",
            "enUS": "Iron Golem: +35 Defense per Level"
          },
          {
            "zhCN": "火焰傀儡: 每等级+6%伤害",
            "zhTW": "火焰魔像：每等級 +6% 傷害",
            "enUS": "Fire Golem: +6% Damage per Level"
          }
        ]
      },
      {
        "id": 76,
        "key": "Iron Maiden",
        "page": 1,
        "row": 3,
        "col": 2,
        "reqLvl": 12,
        "reqs": [
          "Amplify Damage"
        ],
        "passive": false,
        "nameZh": "铁处女",
        "nameTw": "攻擊反噬",
        "nameEn": "Iron Maiden",
        "descZh": "诅咒一群敌人, 使它们 · 在造成伤害的同时也伤害自己",
        "descTw": "詛咒一群敵人，使他們對其他人造成傷害時，也會對自己造成傷害",
        "descEn": "curses a group of enemies, causing them · to damage themselves when damaging others",
        "mana": {
          "base": 5,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 77,
        "key": "Terror",
        "page": 1,
        "row": 3,
        "col": 3,
        "reqLvl": 12,
        "reqs": [
          "Weaken"
        ],
        "passive": false,
        "nameZh": "恐惧",
        "nameTw": "恐懼",
        "nameEn": "Terror",
        "descZh": "诅咒一群怪物 · 使它们在恐惧中逃跑",
        "descTw": "詛咒一群怪物，使其因恐懼落荒而逃",
        "descEn": "curses a group of monsters, · causing them to flee in terror",
        "mana": {
          "base": 7,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 78,
        "key": "Bone Wall",
        "page": 2,
        "row": 3,
        "col": 3,
        "reqLvl": 12,
        "reqs": [
          "Bone Armor"
        ],
        "passive": false,
        "nameZh": "骨墙",
        "nameTw": "骨牆",
        "nameEn": "Bone Wall",
        "descZh": "用白骨和碎片制造 · 一道无法越过的屏障",
        "descTw": "用骸骨和土石造出一道無法穿越的障礙",
        "descEn": "creates an impassable barrier · of bone and debris",
        "mana": {
          "base": 17,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "骨甲: 每等级+10%生命",
            "zhTW": "骸骨護甲：每等級 +10% 生命",
            "enUS": "Bone Armor: +10% Life per Level"
          },
          {
            "zhCN": "骨牢: 每等级+10%生命",
            "zhTW": "骨牢：每等級 +10% 生命",
            "enUS": "Bone Prison: +10% Life per Level"
          }
        ]
      },
      {
        "id": 79,
        "key": "Golem Mastery",
        "page": 3,
        "row": 3,
        "col": 1,
        "reqLvl": 12,
        "reqs": [
          "Clay Golem"
        ],
        "passive": true,
        "nameZh": "傀儡精通",
        "nameTw": "魔像專精",
        "nameEn": "Golem Mastery",
        "descZh": "提高所有傀儡的速度和生命",
        "descTw": "強化你召喚的所有魔像的生命值和速度",
        "descEn": "Enhances Speed and Life of all your Golems",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 80,
        "key": "Raise Skeletal Mage",
        "page": 3,
        "row": 3,
        "col": 3,
        "reqLvl": 12,
        "reqs": [
          "Raise Skeleton"
        ],
        "passive": false,
        "nameZh": "复生骷髅法师",
        "nameTw": "復生骷髏法師",
        "nameEn": "Raise Skeletal Mage",
        "descZh": "对死去怪物的残骸施放 · 复活一个骷髅法师 · 为你而战",
        "descTw": "對怪物的屍體施放，將其復生為骷髏法師為你而戰",
        "descEn": "cast on the corpse of a slain monster, · this raises a skeleton mage that · fights for you",
        "mana": {
          "base": 8,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "骷髅精通",
            "zhTW": "骷髏專精",
            "enUS": "Skeleton Mastery"
          },
          {
            "zhCN": "召唤抗性",
            "zhTW": "召喚物抗性",
            "enUS": "Summon Resist"
          }
        ]
      },
      {
        "id": 81,
        "key": "Confuse",
        "page": 1,
        "row": 4,
        "col": 1,
        "reqLvl": 18,
        "reqs": [
          "Dim Vision"
        ],
        "passive": false,
        "nameZh": "迷乱",
        "nameTw": "混亂",
        "nameEn": "Confuse",
        "descZh": "诅咒一个怪物, 强制它攻击随机目标",
        "descTw": "詛咒一個怪物，使其攻擊隨機目標",
        "descEn": "curses a monster to force it to attack random targets",
        "mana": {
          "base": 13,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 82,
        "key": "Life Tap",
        "page": 1,
        "row": 4,
        "col": 2,
        "reqLvl": 18,
        "reqs": [
          "Iron Maiden"
        ],
        "passive": false,
        "nameZh": "生命吸取",
        "nameTw": "偷取生命",
        "nameEn": "Life Tap",
        "descZh": "诅咒一群怪物 · 对它们造成伤害时为攻击者恢复生命",
        "descTw": "詛咒一群怪物，使對其造成傷害的攻擊者恢復生命值",
        "descEn": "curses a group of monsters so that · damaging them gives the attacker life",
        "mana": {
          "base": 9,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 83,
        "key": "Poison Explosion",
        "page": 2,
        "row": 4,
        "col": 1,
        "reqLvl": 18,
        "reqs": [
          "Poison Dagger",
          "Corpse Explosion"
        ],
        "passive": false,
        "nameZh": "毒爆",
        "nameTw": "毒爆",
        "nameEn": "Poison Explosion",
        "descZh": "对死去怪物的残骸施放 · 释放出剧毒的气体 · 让附近的怪物中毒",
        "descTw": "對怪物的屍體施放，會釋放出毒氣，使附近的怪物中毒",
        "descEn": "cast on the corpse of a slain monster, · toxic gas is released · that poisons nearby monsters",
        "mana": {
          "base": 8,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "pois",
          "hitShift": 4,
          "min": [
            8,
            2,
            4,
            6,
            8,
            10
          ],
          "max": [
            24,
            2,
            4,
            6,
            8,
            10
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Poison Dagger",
            "pct": 15
          },
          {
            "skill": "Poison Nova",
            "pct": 15
          }
        ],
        "synergies": [
          {
            "zhCN": "毒匕: 每等级+15%毒素伤害",
            "zhTW": "淬毒匕首：每等級 +15% 毒素傷害",
            "enUS": "Poison Dagger: +15% Poison Damage per Level"
          },
          {
            "zhCN": "剧毒新星: 每等级+15%毒素伤害",
            "zhTW": "劇毒新星：每等級 +15% 毒素傷害",
            "enUS": "Poison Nova: +15% Poison Damage per Level"
          }
        ]
      },
      {
        "id": 84,
        "key": "Bone Spear",
        "page": 2,
        "row": 4,
        "col": 2,
        "reqLvl": 18,
        "reqs": [
          "Corpse Explosion"
        ],
        "passive": false,
        "nameZh": "骨矛",
        "nameTw": "骨矛",
        "nameEn": "Bone Spear",
        "descZh": "召唤致命的白骨尖刺, 刺穿你的敌人",
        "descTw": "召喚致命的骸骨長矛刺穿你的敵人",
        "descEn": "summons a deadly spike of bone to impale your enemies",
        "mana": {
          "base": 28,
          "lvl": 1,
          "shift": 6,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "mag",
          "hitShift": 8,
          "min": [
            16,
            8,
            9,
            12,
            18,
            24
          ],
          "max": [
            24,
            8,
            9,
            13,
            19,
            25
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Bone Wall",
            "pct": 8
          },
          {
            "skill": "Bone Prison",
            "pct": 8
          },
          {
            "skill": "Teeth",
            "pct": 8
          },
          {
            "skill": "Bone Spirit",
            "pct": 8
          }
        ],
        "synergies": [
          {
            "zhCN": "骨牙: 每等级+8%魔法伤害",
            "zhTW": "剔骨之牙：每等級 +8% 魔法傷害",
            "enUS": "Teeth: +8% Magic Damage per Level"
          },
          {
            "zhCN": "骨墙: 每等级+8%魔法伤害",
            "zhTW": "骨牆：每等級 +8% 魔法傷害",
            "enUS": "Bone Wall: +8% Magic Damage per Level"
          },
          {
            "zhCN": "骨牢: 每等级+8%魔法伤害",
            "zhTW": "骨牢：每等級 +8% 魔法傷害",
            "enUS": "Bone Prison: +8% Magic Damage per Level"
          },
          {
            "zhCN": "骨灵: 每等级+8%魔法伤害",
            "zhTW": "骸骨之魂：每等級 +8% 魔法傷害",
            "enUS": "Bone Spirit: +8% Magic Damage per Level"
          }
        ]
      },
      {
        "id": 85,
        "key": "BloodGolem",
        "page": 3,
        "row": 4,
        "col": 2,
        "reqLvl": 18,
        "reqs": [
          "Clay Golem"
        ],
        "passive": false,
        "nameZh": "精华傀儡",
        "nameTw": "鮮血魔像",
        "nameEn": "Blood Golem",
        "descZh": "制造一个傀儡, 与你分享 · 它所偷取的生命",
        "descTw": "創造出一個會竊取生命值並且分享給你的魔像",
        "descEn": "creates a golem that shares with you the life · it steals",
        "mana": {
          "base": 25,
          "lvl": 3,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "傀儡精通",
            "zhTW": "魔像專精",
            "enUS": "Golem Mastery"
          },
          {
            "zhCN": "召唤抗性",
            "zhTW": "召喚物抗性",
            "enUS": "Summon Resist"
          },
          {
            "zhCN": "黏土傀儡: 每等级+20命中值",
            "zhTW": "黏土魔像：每等級 +20 準確率",
            "enUS": "Clay Golem: +20 Attack Rating per Level"
          },
          {
            "zhCN": "钢铁傀儡: 每等级+35防御值",
            "zhTW": "鋼鐵魔像：每等級 +35 防禦",
            "enUS": "Iron Golem: +35 Defense per Level"
          },
          {
            "zhCN": "火焰傀儡: 每等级+6%伤害",
            "zhTW": "火焰魔像：每等級 +6% 傷害",
            "enUS": "Fire Golem: +6% Damage per Level"
          }
        ]
      },
      {
        "id": 86,
        "key": "Attract",
        "page": 1,
        "row": 5,
        "col": 1,
        "reqLvl": 24,
        "reqs": [
          "Confuse"
        ],
        "passive": false,
        "nameZh": "吸引",
        "nameTw": "致命吸引",
        "nameEn": "Attract",
        "descZh": "诅咒一个怪物，使其成为 · 附近所有怪物的攻击目标 · 此诅咒不会被其它诅咒覆盖",
        "descTw": "詛咒一隻怪物，使其成為周圍其他怪物的攻擊目標。 · 此詛咒不會被其他詛咒覆蓋",
        "descEn": "curses a monster to become the · target of all nearby monsters · this curse may not be overridden by another curse",
        "mana": {
          "base": 17,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 87,
        "key": "Decrepify",
        "page": 1,
        "row": 5,
        "col": 3,
        "reqLvl": 24,
        "reqs": [
          "Terror"
        ],
        "passive": false,
        "nameZh": "衰老",
        "nameTw": "衰老",
        "nameEn": "Decrepify",
        "descZh": "诅咒一群敌人, 让它们变得 · 迟缓, 虚弱, 同时受到更高的伤害",
        "descTw": "詛咒一群敵人，使他們變得緩慢、虛弱，且受到的傷害提高",
        "descEn": "curses a group of enemies to make them · slow, weak and take amplified damage",
        "mana": {
          "base": 11,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 88,
        "key": "Bone Prison",
        "page": 2,
        "row": 5,
        "col": 3,
        "reqLvl": 24,
        "reqs": [
          "Bone Wall",
          "Bone Spear"
        ],
        "passive": false,
        "nameZh": "骨牢",
        "nameTw": "骨牢",
        "nameEn": "Bone Prison",
        "descZh": "在目标周围制造出石化白骨屏障",
        "descTw": "在目標四周造出石化的骸骨屏障將其困住",
        "descEn": "creates a barrier of fossilized bone around your target",
        "mana": {
          "base": 27,
          "lvl": -1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "骨甲: 每等级+8%生命",
            "zhTW": "骸骨護甲：每等級 +8% 生命",
            "enUS": "Bone Armor: +8% Life per Level"
          },
          {
            "zhCN": "骨墙: 每等级+8%生命",
            "zhTW": "骨牆：每等級 +8% 生命",
            "enUS": "Bone Wall: +8% Life per Level"
          }
        ]
      },
      {
        "id": 89,
        "key": "Summon Resist",
        "page": 3,
        "row": 5,
        "col": 1,
        "reqLvl": 24,
        "reqs": [
          "Golem Mastery"
        ],
        "passive": true,
        "nameZh": "召唤抗性",
        "nameTw": "召喚物抗性",
        "nameEn": "Summon Resist",
        "descZh": "被动 - 提高所有召唤 · 生物的抗性",
        "descTw": "被動 - 使你召喚的所有僕從抗性提高",
        "descEn": "passive - increases the resistances · of all summoned creatures",
        "mana": {
          "base": 44,
          "lvl": -3,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 90,
        "key": "IronGolem",
        "page": 3,
        "row": 5,
        "col": 2,
        "reqLvl": 24,
        "reqs": [
          "BloodGolem"
        ],
        "passive": false,
        "nameZh": "钢铁傀儡",
        "nameTw": "鋼鐵魔像",
        "nameEn": "Iron Golem",
        "descZh": "将一个金属物品变为傀儡 · 获得物品上的属性",
        "descTw": "將一個金屬物品轉換成魔像，魔像會獲得該物品的屬性",
        "descEn": "transforms a metallic item into a golem that gains · the properties of the item",
        "mana": {
          "base": 35,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "elem",
          "hitShift": 8,
          "min": [
            15,
            6,
            12,
            18,
            24,
            30
          ],
          "max": [
            0,
            0,
            0,
            0,
            0,
            0
          ]
        },
        "synergies": [
          {
            "zhCN": "傀儡精通",
            "zhTW": "魔像專精",
            "enUS": "Golem Mastery"
          },
          {
            "zhCN": "召唤抗性",
            "zhTW": "召喚物抗性",
            "enUS": "Summon Resist"
          },
          {
            "zhCN": "黏土傀儡: 每等级+20命中值",
            "zhTW": "黏土魔像：每等級 +20 準確率",
            "enUS": "Clay Golem: +20 Attack Rating per Level"
          },
          {
            "zhCN": "精华傀儡: 每等级+5%生命",
            "zhTW": "鮮血魔像：每等級 +5% 生命",
            "enUS": "Blood Golem: +5% Life per Level"
          },
          {
            "zhCN": "火焰傀儡: 每等级+6%伤害",
            "zhTW": "火焰魔像：每等級 +6% 傷害",
            "enUS": "Fire Golem: +6% Damage per Level"
          }
        ]
      },
      {
        "id": 91,
        "key": "Lower Resist",
        "page": 1,
        "row": 6,
        "col": 2,
        "reqLvl": 30,
        "reqs": [
          "Life Tap",
          "Decrepify"
        ],
        "passive": false,
        "nameZh": "降低抗性",
        "nameTw": "降低抗性",
        "nameEn": "Lower Resist",
        "descZh": "诅咒一名敌人, 提高它受到的魔法伤害 · 降低怪物的抗性 · 降低敌对玩家的抗性最大值 · ",
        "descTw": "詛咒一個敵人，使其遭到魔法攻擊時，會受到更高的傷害 · 降低怪物的魔法抗性 · 降低敵對玩家的抗性上限",
        "descEn": "curses an enemy to take more damage from all magical attacks · lowers resistances of monsters · lowers maximum resistances of hostile players",
        "mana": {
          "base": 22,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 92,
        "key": "Poison Nova",
        "page": 2,
        "row": 6,
        "col": 1,
        "reqLvl": 30,
        "reqs": [
          "Poison Explosion"
        ],
        "passive": false,
        "nameZh": "剧毒新星",
        "nameTw": "劇毒新星",
        "nameEn": "Poison Nova",
        "descZh": "喷出一道不断扩大的浓缩毒素之环",
        "descTw": "散射出一圈向外擴張的濃烈劇毒之環",
        "descEn": "emits an expanding ring of concentrated poison",
        "mana": {
          "base": 20,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "pois",
          "hitShift": 4,
          "min": [
            16,
            4,
            6,
            9,
            14,
            16
          ],
          "max": [
            29,
            4,
            6,
            9,
            14,
            16
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Poison Dagger",
            "pct": 10
          },
          {
            "skill": "Poison Explosion",
            "pct": 10
          }
        ],
        "synergies": [
          {
            "zhCN": "毒匕: 每等级+10%毒素伤害",
            "zhTW": "淬毒匕首：每等級 +10% 毒素傷害",
            "enUS": "Poison Dagger: +10% Poison Damage per Level"
          },
          {
            "zhCN": "毒爆: 每等级+10%毒素伤害",
            "zhTW": "毒爆：每等級 +10% 毒素傷害",
            "enUS": "Poison Explosion: +10% Poison Damage per Level"
          }
        ]
      },
      {
        "id": 93,
        "key": "Bone Spirit",
        "page": 2,
        "row": 6,
        "col": 2,
        "reqLvl": 30,
        "reqs": [
          "Bone Spear"
        ],
        "passive": false,
        "nameZh": "骨灵",
        "nameTw": "骸骨之魂",
        "nameEn": "Bone Spirit",
        "descZh": "释放出不知疲惫的亡灵魂魄 · 追踪目标或自动搜寻目标",
        "descTw": "釋放一個無法安息的不死冤魂，追擊你的目標或是自行鎖定目標",
        "descEn": "releases a spirit of the restless undead that · tracks its target or finds one of its own",
        "mana": {
          "base": 24,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "mag",
          "hitShift": 8,
          "min": [
            20,
            16,
            17,
            18,
            19,
            20
          ],
          "max": [
            30,
            17,
            18,
            19,
            20,
            21
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Bone Wall",
            "pct": 8
          },
          {
            "skill": "Bone Prison",
            "pct": 8
          },
          {
            "skill": "Teeth",
            "pct": 8
          },
          {
            "skill": "Bone Spear",
            "pct": 8
          }
        ],
        "synergies": [
          {
            "zhCN": "骨牙: 每等级+8%魔法伤害",
            "zhTW": "剔骨之牙：每等級 +8% 魔法傷害",
            "enUS": "Teeth: +8% Magic Damage per Level"
          },
          {
            "zhCN": "骨墙: 每等级+8%魔法伤害",
            "zhTW": "骨牆：每等級 +8% 魔法傷害",
            "enUS": "Bone Wall: +8% Magic Damage per Level"
          },
          {
            "zhCN": "骨矛: 每等级+8%魔法伤害",
            "zhTW": "骨矛：每等級 +8% 魔法傷害",
            "enUS": "Bone Spear: +8% Magic Damage per Level"
          },
          {
            "zhCN": "骨牢: 每等级+8%魔法伤害",
            "zhTW": "骨牢：每等級 +8% 魔法傷害",
            "enUS": "Bone Prison: +8% Magic Damage per Level"
          }
        ]
      },
      {
        "id": 94,
        "key": "FireGolem",
        "page": 3,
        "row": 6,
        "col": 2,
        "reqLvl": 30,
        "reqs": [
          "IronGolem"
        ],
        "passive": false,
        "nameZh": "火焰傀儡",
        "nameTw": "火焰魔像",
        "nameEn": "Fire Golem",
        "descZh": "制造出傀儡, 将受到的火焰伤害 · 转化为生命",
        "descTw": "創造一個可以吸收火焰傷害並且轉換成生命值的魔像",
        "descEn": "creates a golem that converts the damage · it receives from fire into life",
        "mana": {
          "base": 50,
          "lvl": 8,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "fire",
          "hitShift": 8,
          "min": [
            10,
            9,
            10,
            11,
            12,
            13
          ],
          "max": [
            27,
            10,
            11,
            12,
            13,
            14
          ]
        },
        "synergies": [
          {
            "zhCN": "傀儡精通",
            "zhTW": "魔像專精",
            "enUS": "Golem Mastery"
          },
          {
            "zhCN": "召唤抗性",
            "zhTW": "召喚物抗性",
            "enUS": "Summon Resist"
          },
          {
            "zhCN": "黏土傀儡: 每等级+20命中值",
            "zhTW": "黏土魔像：每等級 +20 準確率",
            "enUS": "Clay Golem: +20 Attack Rating per Level"
          },
          {
            "zhCN": "精华傀儡: 每等级+5%生命",
            "zhTW": "鮮血魔像：每等級 +5% 生命",
            "enUS": "Blood Golem: +5% Life per Level"
          },
          {
            "zhCN": "钢铁傀儡: 每等级+35防御值",
            "zhTW": "鋼鐵魔像：每等級 +35 防禦",
            "enUS": "Iron Golem: +35 Defense per Level"
          }
        ]
      },
      {
        "id": 95,
        "key": "Revive",
        "page": 3,
        "row": 6,
        "col": 3,
        "reqLvl": 30,
        "reqs": [
          "Raise Skeletal Mage",
          "IronGolem"
        ],
        "passive": false,
        "nameZh": "重生",
        "nameTw": "重生",
        "nameEn": "Revive",
        "descZh": "让一个怪物死而复生 · 为你而战",
        "descTw": "讓一個怪物死而復生，為你而戰",
        "descEn": "returns a monster to life · to fight by your side",
        "mana": {
          "base": 45,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "骷髅精通",
            "zhTW": "骷髏專精",
            "enUS": "Skeleton Mastery"
          },
          {
            "zhCN": "召唤抗性",
            "zhTW": "召喚物抗性",
            "enUS": "Summon Resist"
          }
        ]
      }
    ]
  },
  {
    "id": "bar",
    "nameZh": "野蛮人",
    "nameTw": "野蠻人",
    "nameEn": "Barbarian",
    "icon": "/images/ui/barbarianicon.webp",
    "tabs": [
      {
        "page": 3,
        "zhCN": "呐喊技能",
        "zhTW": "戰吼",
        "enUS": "Warcries"
      },
      {
        "page": 2,
        "zhCN": "精通类技能",
        "zhTW": "戰鬥專精",
        "enUS": "Masteries"
      },
      {
        "page": 1,
        "zhCN": "战斗技能",
        "zhTW": "戰鬥技能",
        "enUS": "Combat Skills"
      }
    ],
    "skills": [
      {
        "id": 126,
        "key": "Bash",
        "page": 1,
        "row": 1,
        "col": 2,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "猛击",
        "nameTw": "猛擊",
        "nameEn": "Bash",
        "descZh": "强力的一击, 对怪物造成更高的伤害 · 并将其击退",
        "descTw": "造成大量傷害並將敵人擊退的強力打擊",
        "descEn": "powerful blow that increases the damage done · to enemies and knocks them back",
        "mana": {
          "base": 2,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "击昏: 每等级+5%伤害",
            "zhTW": "擊昏：每等級 +5% 傷害",
            "enUS": "Stun: +5% Damage per Level"
          },
          {
            "zhCN": "专注: 每等级+5%命中值",
            "zhTW": "專注打擊：每等級 +5% 準確率",
            "enUS": "Concentrate: +5% Attack Rating per Level"
          }
        ]
      },
      {
        "id": 127,
        "key": "Blade Mastery",
        "page": 2,
        "row": 1,
        "col": 1,
        "reqLvl": 1,
        "reqs": [],
        "passive": true,
        "nameZh": "刀剑精通",
        "nameTw": "利刃專精",
        "nameEn": "Blade Mastery",
        "descZh": "被动 - 提高使用剑和匕首战斗的技巧",
        "descTw": "被動 - 提高你使用刀劍與匕首的戰鬥技巧",
        "descEn": "passive - improves swords and daggers fighting skill",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 128,
        "key": "Axe Mastery",
        "page": 2,
        "row": 1,
        "col": 2,
        "reqLvl": 1,
        "reqs": [],
        "passive": true,
        "nameZh": "斧类精通",
        "nameTw": "斧術專精",
        "nameEn": "Axe Mastery",
        "descZh": "被动 - 提高使用斧战斗的技巧",
        "descTw": "被動 - 提高你使用斧的戰鬥技巧",
        "descEn": "passive - improves axe fighting skill",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 129,
        "key": "Mace Mastery",
        "page": 2,
        "row": 1,
        "col": 3,
        "reqLvl": 1,
        "reqs": [],
        "passive": true,
        "nameZh": "锤类精通",
        "nameTw": "釘鎚專精",
        "nameEn": "Mace Mastery",
        "descZh": "被动 - 提高使用锤战斗的技巧",
        "descTw": "被動 - 提高你使用釘鎚的戰鬥技巧",
        "descEn": "passive - improves mace fighting skill",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 130,
        "key": "Howl",
        "page": 3,
        "row": 1,
        "col": 1,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "狂嗥",
        "nameTw": "狂嗥",
        "nameEn": "Howl",
        "descZh": "让附近的怪物 · 在恐惧中逃窜",
        "descTw": "發出驚人嗥叫，使附近的怪物恐懼逃竄",
        "descEn": "sends nearby monsters · scrambling away in fear",
        "mana": {
          "base": 4,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 131,
        "key": "Find Potion",
        "page": 3,
        "row": 1,
        "col": 3,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "寻药",
        "nameTw": "尋找藥水",
        "nameEn": "Find Potion",
        "descZh": "对被消灭的怪物残骸使用 · 有几率找到药剂",
        "descTw": "在殺死的怪物屍體上使用，有一定機率找到藥水",
        "descEn": "use on the corpse of a slain monster · for a chance to find a potion",
        "mana": {
          "base": 2,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 132,
        "key": "Leap",
        "page": 1,
        "row": 2,
        "col": 1,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "跳斩",
        "nameTw": "跳躍",
        "nameEn": "Leap",
        "descZh": "跳向空中, 并在落地时 · 击退附近的敌人",
        "descTw": "猛躍到空中，並在著地時擊退附近的敵人",
        "descEn": "Jump into the air and knock back · nearby enemies when you land",
        "mana": {
          "base": 2,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 133,
        "key": "Double Swing",
        "page": 1,
        "row": 2,
        "col": 3,
        "reqLvl": 6,
        "reqs": [
          "Bash"
        ],
        "passive": false,
        "nameZh": "双手挥击",
        "nameTw": "雙手揮擊",
        "nameEn": "Double Swing",
        "descZh": "当装备两把武器时 · 可以同时攻击两个目标 · 或者对一个目标攻击两次",
        "descTw": "裝備兩把武器時，優先攻擊兩名目標，或同一名目標兩次",
        "descEn": "when two weapons are equipped · attacks two targets if possible, · or one target twice",
        "mana": {
          "base": 8,
          "lvl": -1,
          "shift": 5,
          "min": 0
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "猛击: 每等级+10%伤害",
            "zhTW": "猛擊：每等級 +10% 傷害",
            "enUS": "Bash: +10% Damage per Level"
          }
        ]
      },
      {
        "id": 134,
        "key": "Pole Arm Mastery",
        "page": 2,
        "row": 2,
        "col": 1,
        "reqLvl": 6,
        "reqs": [],
        "passive": true,
        "nameZh": "长柄精通",
        "nameTw": "長武專精",
        "nameEn": "Polearm Mastery",
        "descZh": "被动 - 提高使用长柄战斗的技巧",
        "descTw": "被動 - 提高你使用長柄武器的戰鬥技巧",
        "descEn": "passive - improves polearm skill",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 135,
        "key": "Throwing Mastery",
        "page": 2,
        "row": 2,
        "col": 2,
        "reqLvl": 6,
        "reqs": [],
        "passive": true,
        "nameZh": "投掷精通",
        "nameTw": "投擲專精",
        "nameEn": "Throwing Mastery",
        "descZh": "被动 - 提高使用投掷武器的技巧",
        "descTw": "被動 - 提高你投擲武器的戰鬥技巧",
        "descEn": "passive - improves throwing weapon skill",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 136,
        "key": "Spear Mastery",
        "page": 2,
        "row": 2,
        "col": 3,
        "reqLvl": 6,
        "reqs": [],
        "passive": true,
        "nameZh": "长矛精通",
        "nameTw": "長矛專精",
        "nameEn": "Spear Mastery",
        "descZh": "被动 - 提高使用长矛战斗的技巧",
        "descTw": "被動 - 提高你使用長矛的戰鬥技巧",
        "descEn": "passive - improves spear fighting skill",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 137,
        "key": "Taunt",
        "page": 3,
        "row": 2,
        "col": 1,
        "reqLvl": 6,
        "reqs": [
          "Howl"
        ],
        "passive": false,
        "nameZh": "嘲讽",
        "nameTw": "嘲諷",
        "nameEn": "Taunt",
        "descZh": "激怒怪物, 使其开始鲁莽地攻击",
        "descTw": "激怒一頭怪物，使其不顧一切攻擊你",
        "descEn": "enrages a monster into relentlessly attacking",
        "mana": {
          "base": 3,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 138,
        "key": "Shout",
        "page": 3,
        "row": 2,
        "col": 2,
        "reqLvl": 6,
        "reqs": [
          "Howl"
        ],
        "passive": false,
        "nameZh": "大吼",
        "nameTw": "大吼",
        "nameEn": "Shout",
        "descZh": "大声警示队友危险即将到来 · 提高你和小队成员的防御值",
        "descTw": "警告隊伍成員危險逼近，提高你和隊伍成員的防禦",
        "descEn": "warns of impending danger and improves the defense · rating of you and your party",
        "mana": {
          "base": 6,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "战斗号令: 每等级+0秒",
            "zhTW": "戰鬥命令：每等級 +0 秒",
            "enUS": "Battle Orders: +0 Seconds per Level"
          },
          {
            "zhCN": "战斗指挥: 每等级+0秒",
            "zhTW": "戰鬥指揮：每等級 +0 秒",
            "enUS": "Battle Command: +0 Seconds per Level"
          }
        ]
      },
      {
        "id": 139,
        "key": "Stun",
        "page": 1,
        "row": 3,
        "col": 2,
        "reqLvl": 12,
        "reqs": [
          "Bash"
        ],
        "passive": false,
        "nameZh": "击昏",
        "nameTw": "擊昏",
        "nameEn": "Stun",
        "descZh": "击昏目标, 持续一小段时间 · 同时提高命中值",
        "descTw": "擊昏你的目標一小段時間，並提高準確率",
        "descEn": "stuns your target for a short time · and increases your attack rating",
        "mana": {
          "base": 2,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "猛击: 每等级+8%伤害",
            "zhTW": "猛擊：每等級 +8% 傷害",
            "enUS": "Bash: +8% Damage per Level"
          },
          {
            "zhCN": "专注: 每等级+5%命中值",
            "zhTW": "專注打擊：每等級 +5% 準確率",
            "enUS": "Concentrate: +5% Attack Rating per Level"
          },
          {
            "zhCN": "怒嗥: 每等级+5%持续时间",
            "zhTW": "戰爭狂嘯：每等級 +5% 持續時效",
            "enUS": "War Cry: +5% Duration per Level"
          }
        ]
      },
      {
        "id": 140,
        "key": "Double Throw",
        "page": 1,
        "row": 3,
        "col": 3,
        "reqLvl": 12,
        "reqs": [
          "Double Swing"
        ],
        "passive": false,
        "nameZh": "双手投掷",
        "nameTw": "雙手投擲",
        "nameEn": "Double Throw",
        "descZh": "允许你同时投掷 · 两把不同的武器",
        "descTw": "讓你可以同時投出兩個不同的投擲武器",
        "descEn": "allows you to throw two different · throwing weapons at the same time",
        "mana": {
          "base": 1,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "双手挥击: 每等级+8%伤害",
            "zhTW": "雙手揮擊：每等級 +8% 傷害",
            "enUS": "Double Swing: +8% Damage per Level"
          }
        ]
      },
      {
        "id": 141,
        "key": "Increased Stamina",
        "page": 2,
        "row": 3,
        "col": 1,
        "reqLvl": 12,
        "reqs": [],
        "passive": true,
        "nameZh": "增强耐力",
        "nameTw": "提高精力",
        "nameEn": "Increased Stamina",
        "descZh": "被动 - 提高你的耐力",
        "descTw": "被動 - 提高你的精力",
        "descEn": "passive - increases your stamina",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 142,
        "key": "Find Item",
        "page": 3,
        "row": 3,
        "col": 3,
        "reqLvl": 12,
        "reqs": [
          "Find Potion"
        ],
        "passive": false,
        "nameZh": "寻物",
        "nameTw": "尋找物品",
        "nameEn": "Find Item",
        "descZh": "对被消灭的怪物残骸使用 · 有几率找到隐藏的财宝",
        "descTw": "在殺死的怪物屍體上使用，找出隱藏的寶物",
        "descEn": "use on the corpse of a slain monster · to find hidden treasures",
        "mana": {
          "base": 7,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "寻药: 每等级几率 +1%",
            "zhTW": "尋找藥水：每等級 +1% 機率",
            "enUS": "Find Potion: +1% Chance per level"
          }
        ]
      },
      {
        "id": 143,
        "key": "Leap Attack",
        "page": 1,
        "row": 4,
        "col": 1,
        "reqLvl": 18,
        "reqs": [
          "Leap"
        ],
        "passive": false,
        "nameZh": "腾空斩",
        "nameTw": "躍擊",
        "nameEn": "Leap Attack",
        "descZh": "跳跃至目标身边发起攻击 · 对其和附近的敌人造成伤害",
        "descTw": "跳躍攻擊指定的敵人，並對 · 周圍的敵人造成傷害",
        "descEn": "leaps to and attacks target enemy · and damages surrounding enemies",
        "mana": {
          "base": 10,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "phys",
          "hitShift": 8,
          "min": [
            10,
            4,
            8,
            12,
            16,
            20
          ],
          "max": [
            20,
            8,
            16,
            24,
            32,
            40
          ]
        },
        "synergies": [
          {
            "zhCN": "跳斩: 每等级+10%伤害",
            "zhTW": "跳躍：每等級 +10% 傷害",
            "enUS": "Leap: +10% Damage per Level"
          }
        ]
      },
      {
        "id": 144,
        "key": "Concentrate",
        "page": 1,
        "row": 4,
        "col": 2,
        "reqLvl": 18,
        "reqs": [
          "Stun"
        ],
        "passive": false,
        "nameZh": "专注",
        "nameTw": "專注打擊",
        "nameEn": "Concentrate",
        "descZh": "攻击不会被打断 · 同时提高命中值与防御值",
        "descTw": "能提高準確率和防禦，並且不會被中斷的攻擊",
        "descEn": "attack that is not interruptible and · improves attack rating and defense",
        "mana": {
          "base": 2,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "猛击: 每等级+5%伤害",
            "zhTW": "猛擊：每等級 +5% 傷害",
            "enUS": "Bash: +5% Damage per Level"
          },
          {
            "zhCN": "战斗号令: 每等级+10%伤害",
            "zhTW": "戰鬥命令：每等級 +10% 傷害",
            "enUS": "Battle Orders: +10% Damage per Level"
          },
          {
            "zhCN": "狂战士: 每等级+1%魔法伤害",
            "zhTW": "狂暴之擊：每等級 +1% 魔法傷害",
            "enUS": "Berserk: +1% Magic Damage per Level"
          }
        ]
      },
      {
        "id": 145,
        "key": "Iron Skin",
        "page": 2,
        "row": 4,
        "col": 3,
        "reqLvl": 18,
        "reqs": [],
        "passive": true,
        "nameZh": "钢铁之肤",
        "nameTw": "鋼鐵之膚",
        "nameEn": "Iron Skin",
        "descZh": "被动 - 提高防御值",
        "descTw": "被動 - 提高防禦",
        "descEn": "passive - improves defense",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 146,
        "key": "Battle Cry",
        "page": 3,
        "row": 4,
        "col": 1,
        "reqLvl": 18,
        "reqs": [
          "Taunt"
        ],
        "passive": false,
        "nameZh": "战嗥",
        "nameTw": "戰鬥怒吼",
        "nameEn": "Battle Cry",
        "descZh": "可怕的战吼 · 降低敌人的防御和伤害",
        "descTw": "令人恐懼的怒吼，可以降低敵人的防禦和傷害",
        "descEn": "fearsome cry that decreases · enemies' defense and damage",
        "mana": {
          "base": 5,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 147,
        "key": "Frenzy",
        "page": 1,
        "row": 5,
        "col": 3,
        "reqLvl": 24,
        "reqs": [
          "Double Throw"
        ],
        "passive": false,
        "nameZh": "狂乱",
        "nameTw": "狂亂連擊",
        "nameEn": "Frenzy",
        "descZh": "让你可以同时挥舞两把武器 · 每次成功的攻击都会提高整体速度 · 要求装备两把武器",
        "descTw": "同時揮動兩把武器，且成功擊中後會使你的速度提高 · 必須裝備兩把武器",
        "descEn": "allows you to swing two weapons at once · each successful attack increases your overall speed · requires you to equip two weapons",
        "mana": {
          "base": 3,
          "lvl": 0,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "双手挥击: 每等级+8%伤害",
            "zhTW": "雙手揮擊：每等級 +8% 傷害",
            "enUS": "Double Swing: +8% Damage per Level"
          },
          {
            "zhCN": "嘲讽: 每等级+8%伤害",
            "zhTW": "嘲諷：每等級 +8% 傷害",
            "enUS": "Taunt: +8% Damage per Level"
          },
          {
            "zhCN": "增强耐力: 每等级 +0.4 秒",
            "zhTW": "提高精力：每等級 +0.4 秒",
            "enUS": "Increased Stamina: +0.4 Seconds per Level"
          },
          {
            "zhCN": "狂战士: 每等级+1%魔法伤害",
            "zhTW": "狂暴之擊：每等級 +1% 魔法傷害",
            "enUS": "Berserk: +1% Magic Damage per Level"
          }
        ]
      },
      {
        "id": 148,
        "key": "Increased Speed",
        "page": 2,
        "row": 5,
        "col": 1,
        "reqLvl": 24,
        "reqs": [
          "Increased Stamina"
        ],
        "passive": true,
        "nameZh": "增强速度",
        "nameTw": "提高速度",
        "nameEn": "Increased Speed",
        "descZh": "被动 - 提高行走和奔跑的速度",
        "descTw": "被動 - 提高行走和奔跑的速度",
        "descEn": "passive - increases walk and run speed",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 149,
        "key": "Battle Orders",
        "page": 3,
        "row": 5,
        "col": 2,
        "reqLvl": 24,
        "reqs": [
          "Shout"
        ],
        "passive": false,
        "nameZh": "战斗号令",
        "nameTw": "戰鬥命令",
        "nameEn": "Battle Orders",
        "descZh": "提高你和小队成员的 · 最大生命, 法力和耐力",
        "descTw": "提高你和隊伍成員的法力、生命和精力上限",
        "descEn": "improves the maximum mana, life and · stamina of you and your party",
        "mana": {
          "base": 7,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "大吼: 每等级+0秒",
            "zhTW": "大吼：每等級 +0 秒",
            "enUS": "Shout: +0 Seconds per Level"
          },
          {
            "zhCN": "战斗指挥: 每等级+0秒",
            "zhTW": "戰鬥指揮：每等級 +0 秒",
            "enUS": "Battle Command: +0 Seconds per Level"
          }
        ]
      },
      {
        "id": 150,
        "key": "Grim Ward",
        "page": 3,
        "row": 5,
        "col": 3,
        "reqLvl": 24,
        "reqs": [
          "Find Item"
        ],
        "passive": false,
        "nameZh": "骇物阻吓",
        "nameTw": "恐怖圖騰",
        "nameEn": "Grim Ward",
        "descZh": "对被消灭的怪物残骸使用 · 制造一个恐怖的图腾 · 让附近的怪物逃跑",
        "descTw": "在殺死的怪物屍體上使用，造出一個嚇人的圖騰，使附近的怪物恐懼逃竄",
        "descEn": "use on the corpse of a slain monster · to create a frightening totem · that causes nearby monsters to flee",
        "mana": {
          "base": 4,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "寻药: 每等级 +5% 受到伤害",
            "zhTW": "尋找藥水：每等級 +5% 受到的傷害",
            "enUS": "Find Potion: +5% Damage Taken per Level"
          }
        ]
      },
      {
        "id": 151,
        "key": "Whirlwind",
        "page": 1,
        "row": 6,
        "col": 1,
        "reqLvl": 30,
        "reqs": [
          "Leap Attack",
          "Concentrate"
        ],
        "passive": false,
        "nameZh": "旋风斩",
        "nameTw": "旋風斬",
        "nameEn": "Whirlwind",
        "descZh": "盘旋的死亡之舞 · 在敌人的军团中 · 拼出一条生路",
        "descTw": "以旋轉的死亡之舞，在敵陣之中斬出一條血路",
        "descEn": "a whirling dance of death · that cuts a path through the · legions of your enemies",
        "mana": {
          "base": 25,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 152,
        "key": "Berserk",
        "page": 1,
        "row": 6,
        "col": 2,
        "reqLvl": 30,
        "reqs": [
          "Concentrate"
        ],
        "passive": false,
        "nameZh": "狂战士",
        "nameTw": "狂暴之擊",
        "nameEn": "Berserk",
        "descZh": "一次强大而鲁莽的攻击 · 提高伤害和命中值 · 但会降低防御值",
        "descTw": "威力強大但危險的攻擊，使你的傷害和準確率提高，但防禦降低",
        "descEn": "a powerful but reckless attack · that increases damage and attack rating · but decreases defense",
        "mana": {
          "base": 4,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "狂嗥: 每等级+10%魔法伤害",
            "zhTW": "狂嗥：每等級 +10% 魔法傷害",
            "enUS": "Howl: +10% Magic Damage per Level"
          },
          {
            "zhCN": "战斗号令: 每等级+10%魔法伤害",
            "zhTW": "戰鬥命令：每等級 +10% 魔法傷害",
            "enUS": "Battle Orders: +10% Magic Damage per Level"
          }
        ]
      },
      {
        "id": 153,
        "key": "Natural Resistance",
        "page": 2,
        "row": 6,
        "col": 3,
        "reqLvl": 30,
        "reqs": [
          "Iron Skin"
        ],
        "passive": true,
        "nameZh": "自然抗性",
        "nameTw": "自然抵抗",
        "nameEn": "Natural Resistance",
        "descZh": "被动 - 提高对元素和毒素的 · 自然抗性",
        "descTw": "被動 - 提高對毒素和元素傷害的抗性",
        "descEn": "passive - increases natural resistances · to elemental and poison damage",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 154,
        "key": "War Cry",
        "page": 3,
        "row": 6,
        "col": 1,
        "reqLvl": 30,
        "reqs": [
          "Battle Cry",
          "Battle Orders"
        ],
        "passive": false,
        "nameZh": "怒嗥",
        "nameTw": "戰爭狂嘯",
        "nameEn": "War Cry",
        "descZh": "击昏附近的敌人并造成伤害",
        "descTw": "讓附近的所有敵人受傷並昏迷",
        "descEn": "injures and stuns all nearby enemies",
        "mana": {
          "base": 40,
          "lvl": 3,
          "shift": 6,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "phys",
          "hitShift": 8,
          "min": [
            30,
            8,
            9,
            10,
            12,
            14
          ],
          "max": [
            40,
            8,
            9,
            10,
            12,
            14
          ]
        },
        "synergies": [
          {
            "zhCN": "狂嗥: 每等级+6%伤害",
            "zhTW": "狂嗥：每等級 +6% 傷害",
            "enUS": "Howl: +6% Damage per Level"
          },
          {
            "zhCN": "嘲讽: 每等级+6%伤害",
            "zhTW": "嘲諷：每等級 +6% 傷害",
            "enUS": "Taunt: +6% Damage per Level"
          },
          {
            "zhCN": "战嗥: 每等级+6%伤害",
            "zhTW": "戰鬥怒吼：每等級 +6% 傷害",
            "enUS": "Battle Cry: +6% Damage per Level"
          }
        ]
      },
      {
        "id": 155,
        "key": "Battle Command",
        "page": 3,
        "row": 6,
        "col": 2,
        "reqLvl": 30,
        "reqs": [
          "Battle Orders"
        ],
        "passive": false,
        "nameZh": "战斗指挥",
        "nameTw": "戰鬥指揮",
        "nameEn": "Battle Command",
        "descZh": "提高你和小队成员当前所有技能等级",
        "descTw": "提高你和隊伍成員目前的所有技能等級",
        "descEn": "increases all current skill levels for you and your party",
        "mana": {
          "base": 11,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "大吼: 每等级+0秒",
            "zhTW": "大吼：每等級 +0 秒",
            "enUS": "Shout: +0 Seconds per Level"
          },
          {
            "zhCN": "战斗号令: 每等级+0秒",
            "zhTW": "戰鬥命令：每等級 +0 秒",
            "enUS": "Battle Orders: +0 Seconds per Level"
          }
        ]
      }
    ]
  },
  {
    "id": "dru",
    "nameZh": "德鲁伊",
    "nameTw": "德魯伊",
    "nameEn": "Druid",
    "icon": "/images/ui/druidicon.webp",
    "tabs": [
      {
        "page": 1,
        "zhCN": "召唤技能",
        "zhTW": "召喚技能",
        "enUS": "Summoning Skills"
      },
      {
        "page": 2,
        "zhCN": "变形技能",
        "zhTW": "變形技能",
        "enUS": "Shape Shifting Skills"
      },
      {
        "page": 3,
        "zhCN": "元素技能",
        "zhTW": "元素技能",
        "enUS": "Elemental Skills"
      }
    ],
    "skills": [
      {
        "id": 221,
        "key": "Raven",
        "page": 1,
        "row": 1,
        "col": 2,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "渡鸦",
        "nameTw": "掠鴉",
        "nameEn": "Raven",
        "descZh": "召唤渡鸦 · 啄瞎敌人的眼睛",
        "descTw": "召喚掠鴉啄瞎敵人的雙眼",
        "descEn": "summon ravens to peck out · the eyes of your enemies",
        "mana": {
          "base": 6,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "phys",
          "hitShift": 8,
          "min": [
            2,
            1,
            4,
            8,
            14,
            20
          ],
          "max": [
            4,
            2,
            5,
            9,
            15,
            21
          ]
        },
        "synergies": [
          {
            "zhCN": "召唤灵狼: 每等级+12%伤害",
            "zhTW": "召喚幽靈狼：每等級 +12% 傷害",
            "enUS": "Summon Spirit Wolf: +12% Damage per Level"
          },
          {
            "zhCN": "召唤狂狼: 每等级+12%伤害",
            "zhTW": "召喚恐狼：每等級 +12% 傷害",
            "enUS": "Summon Dire Wolf: +12% Damage per Level"
          },
          {
            "zhCN": "召唤灰熊: 每等级+12%伤害",
            "zhTW": "召喚灰熊：每等級 +12% 傷害",
            "enUS": "Summon Grizzly: +12% Damage per Level"
          }
        ]
      },
      {
        "id": 222,
        "key": "Plague Poppy",
        "page": 1,
        "row": 1,
        "col": 3,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "毒花藤",
        "nameTw": "劇毒藤蔓",
        "nameEn": "Poison Creeper",
        "descZh": "召唤藤蔓 · 对敌人散布疾病",
        "descTw": "召喚藤蔓，對所有接觸到的敵人散播疾病",
        "descEn": "summon a vine that spreads · disease to all it contacts",
        "mana": {
          "base": 8,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "pois",
          "hitShift": 1,
          "min": [
            16,
            16,
            16,
            32,
            64,
            80
          ],
          "max": [
            24,
            16,
            18,
            36,
            68,
            84
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Rabies",
            "pct": 10
          }
        ],
        "synergies": [
          {
            "zhCN": "狂犬: 每等级+10%毒素伤害",
            "zhTW": "狂犬撕咬：每等級 +10% 毒素傷害",
            "enUS": "Rabies: +10% Poison Damage per Level"
          }
        ]
      },
      {
        "id": 223,
        "key": "Wearwolf",
        "page": 2,
        "row": 1,
        "col": 1,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "狼人变化",
        "nameTw": "狼人變化",
        "nameEn": "Werewolf",
        "descZh": "变身成为一头狼人",
        "descTw": "變形成狼人",
        "descEn": "transform into a werewolf",
        "mana": {
          "base": 15,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "变形术",
            "zhTW": "變形術",
            "enUS": "Lycanthropy"
          }
        ]
      },
      {
        "id": 224,
        "key": "Shape Shifting",
        "page": 2,
        "row": 1,
        "col": 2,
        "reqLvl": 1,
        "reqs": [
          "Wearwolf"
        ],
        "passive": true,
        "nameZh": "变形术",
        "nameTw": "變形術",
        "nameEn": "Lycanthropy",
        "descZh": "被动 - 提高狼人和熊人 · 形态的持续时间和生命值",
        "descTw": "被動 - 提高變形為狼人或熊人形態的持續時間與生命值",
        "descEn": "passive - improves duration and life · when in werewolf or werebear form",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 225,
        "key": "Firestorm",
        "page": 3,
        "row": 1,
        "col": 1,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "火焰风暴",
        "nameTw": "火焰風暴",
        "nameEn": "Firestorm",
        "descZh": "释放出混乱的烈焰烧焦敌人",
        "descTw": "釋出熾熱的烈火灼燒你的敵人",
        "descEn": "unleash fiery chaos to burn your enemies",
        "mana": {
          "base": 4,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0.6,
        "dmg": {
          "type": "fire",
          "hitShift": 2,
          "min": [
            3,
            3,
            5,
            7,
            14,
            21
          ],
          "max": [
            6,
            3,
            6,
            8,
            15,
            23
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Molten Boulder",
            "pct": 23
          },
          {
            "skill": "Eruption",
            "pct": 23
          }
        ],
        "synergies": [
          {
            "zhCN": "熔岩巨石: 每等级+23%火焰伤害",
            "zhTW": "熔火巨石：每等級 +23% 火焰傷害",
            "enUS": "Molten Boulder: +23% Fire Damage per Level"
          },
          {
            "zhCN": "熔岩裂地: 每等级+23%火焰伤害",
            "zhTW": "裂地之火：每等級 +23% 火焰傷害",
            "enUS": "Fissure: +23% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 226,
        "key": "Oak Sage",
        "page": 1,
        "row": 2,
        "col": 1,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "橡木智灵",
        "nameTw": "橡木智者",
        "nameEn": "Oak Sage",
        "descZh": "召唤一个灵魂宠物 · 提高你和小队成员的生命值",
        "descTw": "召喚一個魂靈夥伴，提高你和隊伍成員的生命值",
        "descEn": "summon a spirit pet that increases · life for you and your party",
        "mana": {
          "base": 15,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 227,
        "key": "Summon Spirit Wolf",
        "page": 1,
        "row": 2,
        "col": 2,
        "reqLvl": 6,
        "reqs": [
          "Raven"
        ],
        "passive": false,
        "nameZh": "召唤灵狼",
        "nameTw": "召喚幽靈狼",
        "nameEn": "Summon Spirit Wolf",
        "descZh": "召唤一只具有传送技能的 · 恶狼和你并肩战斗",
        "descTw": "召喚具有傳送能力的狼來為你作戰",
        "descEn": "summon a wolf with teleporting ability · to fight by your side",
        "mana": {
          "base": 15,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "cold",
          "hitShift": 8,
          "min": [
            2,
            1,
            3,
            4,
            5,
            8
          ],
          "max": [
            6,
            1,
            3,
            4,
            5,
            8
          ]
        },
        "synergies": [
          {
            "zhCN": "召唤狂狼: 每等级+15%生命",
            "zhTW": "召喚恐狼：每等級 +15% 生命",
            "enUS": "Summon Dire Wolf: +15% Life per Level"
          },
          {
            "zhCN": "召唤灰熊: 每等级+10%伤害",
            "zhTW": "召喚灰熊：每等級 +10% 傷害",
            "enUS": "Summon Grizzly: +10% Damage per Level"
          }
        ]
      },
      {
        "id": 228,
        "key": "Wearbear",
        "page": 2,
        "row": 2,
        "col": 3,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "熊人变化",
        "nameTw": "熊人變化",
        "nameEn": "Werebear",
        "descZh": "变形成熊人 · 可以发起不可阻挡的攻击",
        "descTw": "變形成熊人 · 能使出威猛的強力攻擊",
        "descEn": "transform into a werebear · with unstoppable attacks",
        "mana": {
          "base": 15,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "变形术",
            "zhTW": "變形術",
            "enUS": "Lycanthropy"
          }
        ]
      },
      {
        "id": 229,
        "key": "Molten Boulder",
        "page": 3,
        "row": 2,
        "col": 1,
        "reqLvl": 6,
        "reqs": [
          "Firestorm"
        ],
        "passive": false,
        "nameZh": "熔岩巨石",
        "nameTw": "熔火巨石",
        "nameEn": "Molten Boulder",
        "descZh": "投出一块燃烧着的巨岩 · 击退你的敌人",
        "descTw": "召喚出熊熊燃燒的熔火巨石，將敵人擊退",
        "descEn": "launch a boulder of flaming hot magma · that knocks back your enemies",
        "mana": {
          "base": 20,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 1,
        "dmg": {
          "type": "fire",
          "hitShift": 8,
          "min": [
            6,
            4,
            7,
            10,
            13,
            16
          ],
          "max": [
            12,
            5,
            8,
            11,
            14,
            17
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Firestorm",
            "pct": 8
          }
        ],
        "synergies": [
          {
            "zhCN": "火山爆: 每等级+12%伤害",
            "zhTW": "火山噴發：每等級 +12% 傷害",
            "enUS": "Volcano: +12% Damage per Level"
          },
          {
            "zhCN": "火焰风暴: 每等级+8%火焰伤害",
            "zhTW": "火焰風暴：每等級 +8% 火焰傷害",
            "enUS": "Firestorm: +8% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 230,
        "key": "Arctic Blast",
        "page": 3,
        "row": 2,
        "col": 3,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "极地冰暴",
        "nameTw": "極地寒風",
        "nameEn": "Arctic Blast",
        "descZh": "用持续的冰风冲击敌人 · 让敌人在冰霜中灭亡",
        "descTw": "向敵人噴射極地的寒冰氣流",
        "descEn": "blast a continuous jet of ice · to burn your enemies with frost",
        "mana": {
          "base": 24,
          "lvl": 1,
          "shift": 2,
          "min": 0
        },
        "cooldown": 0,
        "dmg": {
          "type": "cold",
          "hitShift": 3,
          "min": [
            32,
            20,
            26,
            28,
            32,
            36
          ],
          "max": [
            64,
            21,
            27,
            29,
            33,
            37
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Cyclone Armor",
            "pct": 15
          }
        ],
        "synergies": [
          {
            "zhCN": "气旋护甲: 每等级+15%冰霜伤害",
            "zhTW": "氣旋護甲：每等級 +15% 冰寒傷害",
            "enUS": "Cyclone Armor: +15% Cold Damage per Level"
          }
        ]
      },
      {
        "id": 231,
        "key": "Cycle of Life",
        "page": 1,
        "row": 3,
        "col": 3,
        "reqLvl": 12,
        "reqs": [
          "Plague Poppy"
        ],
        "passive": false,
        "nameZh": "食腐藤",
        "nameTw": "食屍藤蔓",
        "nameEn": "Carrion Vine",
        "descZh": "召唤藤蔓吞噬残骸 · 为你补充生命",
        "descTw": "召喚藤蔓，吞食附近的屍體並為你恢復生命",
        "descEn": "summon a vine that eats corpses · and replenishes your life",
        "mana": {
          "base": 10,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 232,
        "key": "Feral Rage",
        "page": 2,
        "row": 3,
        "col": 1,
        "reqLvl": 12,
        "reqs": [
          "Wearwolf"
        ],
        "passive": false,
        "nameZh": "野性狂暴",
        "nameTw": "野性狂暴",
        "nameEn": "Feral Rage",
        "descZh": "在狼人形态下 · 进入狂怒状态 · 后续攻击从敌人身上 · 偷取越来越多的生命",
        "descTw": "在狼人形態下，進入狂怒狀態並隨著攻擊命中 · 從敵人身上竊取越來越多的生命值",
        "descEn": "when in werewolf form, · go into a frenzied rage to steal · increasing amounts of life from your enemies · with successive hits",
        "mana": {
          "base": 3,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 233,
        "key": "Maul",
        "page": 2,
        "row": 3,
        "col": 3,
        "reqLvl": 12,
        "reqs": [
          "Wearbear"
        ],
        "passive": false,
        "nameZh": "猛槌",
        "nameTw": "槌擊",
        "nameEn": "Maul",
        "descZh": "在熊人形态下 · 槌击敌人 · 后续攻击造成 · 越来越高的伤害",
        "descTw": "在熊人形態下，猛力重擊你的敵人 · 連續命中會造成越來越高的額外傷害",
        "descEn": "when in werebear form, · maul your enemies · for increasing extra damage · with successive hits",
        "mana": {
          "base": 3,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 234,
        "key": "Eruption",
        "page": 3,
        "row": 3,
        "col": 1,
        "reqLvl": 12,
        "reqs": [
          "Molten Boulder"
        ],
        "passive": false,
        "nameZh": "熔岩裂地",
        "nameTw": "裂地之火",
        "nameEn": "Fissure",
        "descZh": "在敌人脚下打开火山口 · 将它们烧为焦炭",
        "descTw": "使敵人腳下的大地出現熔岩裂隙，將其燒成灰燼",
        "descEn": "open volcanic vents below your enemies, · burning them to a crisp",
        "mana": {
          "base": 15,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 2,
        "dmg": {
          "type": "fire",
          "hitShift": 8,
          "min": [
            15,
            6,
            12,
            16,
            18,
            22
          ],
          "max": [
            25,
            6,
            12,
            16,
            19,
            23
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Firestorm",
            "pct": 12
          },
          {
            "skill": "Volcano",
            "pct": 12
          }
        ],
        "synergies": [
          {
            "zhCN": "火焰风暴: 每等级+12%火焰伤害",
            "zhTW": "火焰風暴：每等級 +12% 火焰傷害",
            "enUS": "Firestorm: +12% Fire Damage per Level"
          },
          {
            "zhCN": "火山爆: 每等级+12%火焰伤害",
            "zhTW": "火山噴發：每等級 +12% 火焰傷害",
            "enUS": "Volcano: +12% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 235,
        "key": "Cyclone Armor",
        "page": 3,
        "row": 3,
        "col": 3,
        "reqLvl": 12,
        "reqs": [
          "Arctic Blast"
        ],
        "passive": false,
        "nameZh": "气旋护甲",
        "nameTw": "氣旋護甲",
        "nameEn": "Cyclone Armor",
        "descZh": "为自己创造护盾 · 减免火焰, 冰霜和闪电伤害",
        "descTw": "召喚出吸收火焰、冰寒和電擊傷害的護盾",
        "descEn": "shield yourself from damage caused by · fire, cold, and lightning",
        "mana": {
          "base": 5,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "小旋风: 每等级+7%伤害",
            "zhTW": "旋風術：每等級 +7% 傷害",
            "enUS": "Twister: +7% Damage per Level"
          },
          {
            "zhCN": "龙卷风: 每等级+7%伤害",
            "zhTW": "龍捲風：每等級 +7% 傷害",
            "enUS": "Tornado: +7% Damage per Level"
          },
          {
            "zhCN": "飓风: 每等级+7%伤害",
            "zhTW": "颶風術：每等級 +7% 傷害",
            "enUS": "Hurricane: +7% Damage per Level"
          }
        ]
      },
      {
        "id": 236,
        "key": "Heart of Wolverine",
        "page": 1,
        "row": 4,
        "col": 1,
        "reqLvl": 18,
        "reqs": [
          "Oak Sage"
        ],
        "passive": false,
        "nameZh": "狼獾之心",
        "nameTw": "狼獾之心",
        "nameEn": "Heart of Wolverine",
        "descZh": "召唤一个灵魂宠物 · 提高你和小队成员的 · 伤害和命中值",
        "descTw": "召喚一個魂靈夥伴，提高你和隊伍成員的傷害和準確率",
        "descEn": "summon a spirit pet that adds · to the damage and attack rating · of you and your party",
        "mana": {
          "base": 20,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 237,
        "key": "Summon Fenris",
        "page": 1,
        "row": 4,
        "col": 2,
        "reqLvl": 18,
        "reqs": [
          "Oak Sage",
          "Summon Spirit Wolf"
        ],
        "passive": false,
        "nameZh": "召唤狂狼",
        "nameTw": "召喚恐狼",
        "nameEn": "Summon Dire Wolf",
        "descZh": "召唤一头狂怒的狼 · 吞噬残骸 · 提高对敌人的伤害",
        "descTw": "召喚狂怒的恐狼，會吞食屍體提高自己對敵人造成的傷害",
        "descEn": "summon a wolf that becomes enraged, · eating corpses to increase damage · it does to enemies",
        "mana": {
          "base": 20,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "phys",
          "hitShift": 8,
          "min": [
            7,
            2,
            4,
            8,
            10,
            12
          ],
          "max": [
            12,
            3,
            5,
            9,
            11,
            13
          ]
        },
        "synergies": [
          {
            "zhCN": "召唤灵狼: 每等级+25%命中值",
            "zhTW": "召喚幽靈狼：每等級 +25% 準確率",
            "enUS": "Summon Spirit Wolf: +25% Attack Rating per Level"
          },
          {
            "zhCN": "召唤灵狼: 每等级+10%防御值",
            "zhTW": "召喚幽靈狼：每等級 +10% 防禦",
            "enUS": "Summon Spirit Wolf: +10% Defense per Level"
          },
          {
            "zhCN": "召唤灰熊: 每等级+10%伤害",
            "zhTW": "召喚灰熊：每等級 +10% 傷害",
            "enUS": "Summon Grizzly: +10% Damage per Level"
          }
        ]
      },
      {
        "id": 238,
        "key": "Rabies",
        "page": 2,
        "row": 4,
        "col": 1,
        "reqLvl": 18,
        "reqs": [
          "Feral Rage"
        ],
        "passive": false,
        "nameZh": "狂犬",
        "nameTw": "狂犬撕咬",
        "nameEn": "Rabies",
        "descZh": "在狼人形态下 · 撕咬敌人 · 使其感染疾病  · 并传染给其他怪物",
        "descTw": "在狼人形態下，撕咬敵人並散播疾病 · 疾病會傳染給其他怪物",
        "descEn": "when in werewolf form, · bite your enemies · to inflict them with disease · that spreads to other monsters",
        "mana": {
          "base": 10,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "pois",
          "hitShift": 3,
          "min": [
            6,
            4,
            5,
            7,
            11,
            16
          ],
          "max": [
            14,
            4,
            5,
            7,
            11,
            16
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Plague Poppy",
            "pct": 20
          }
        ],
        "synergies": [
          {
            "zhCN": "毒花藤: 每等级+20%毒素伤害",
            "zhTW": "劇毒藤蔓：每等級 +20% 毒素傷害",
            "enUS": "Poison Creeper: +20% Poison Damage per Level"
          }
        ]
      },
      {
        "id": 239,
        "key": "Fire Claws",
        "page": 2,
        "row": 4,
        "col": 2,
        "reqLvl": 18,
        "reqs": [
          "Feral Rage",
          "Maul"
        ],
        "passive": false,
        "nameZh": "焰爪",
        "nameTw": "烈焰爪擊",
        "nameEn": "Fire Claws",
        "descZh": "在狼人或熊人形态下 · 用烈焰利爪猛烈地殴打敌人",
        "descTw": "在狼人或熊人形態下，以附加火焰的爪子重擊敵人",
        "descEn": "when in werewolf or werebear · form, maul your enemies · with a fiery claw attack",
        "mana": {
          "base": 4,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "fire",
          "hitShift": 8,
          "min": [
            32,
            16,
            24,
            32,
            40,
            48
          ],
          "max": [
            48,
            17,
            25,
            33,
            41,
            49
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Firestorm",
            "pct": 22
          },
          {
            "skill": "Molten Boulder",
            "pct": 22
          }
        ],
        "synergies": [
          {
            "zhCN": "火焰风暴: 每等级+22%火焰伤害",
            "zhTW": "火焰風暴：每等級 +22% 火焰傷害",
            "enUS": "Firestorm: +22% Fire Damage per Level"
          },
          {
            "zhCN": "熔岩巨石: 每等级+22%火焰伤害",
            "zhTW": "熔火巨石：每等級 +22% 火焰傷害",
            "enUS": "Molten Boulder: +22% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 240,
        "key": "Twister",
        "page": 3,
        "row": 4,
        "col": 2,
        "reqLvl": 18,
        "reqs": [
          "Cyclone Armor"
        ],
        "passive": false,
        "nameZh": "小旋风",
        "nameTw": "旋風術",
        "nameEn": "Twister",
        "descZh": "释放出数道小型旋风 · 在敌人中开辟出道路",
        "descTw": "釋放出數道小型旋風，傷害路徑上的敵人",
        "descEn": "release several small whirlwinds that · cut a path through your enemies",
        "mana": {
          "base": 7,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "phys",
          "hitShift": 7,
          "min": [
            12,
            7,
            11,
            15,
            18,
            21
          ],
          "max": [
            16,
            7,
            11,
            15,
            18,
            21
          ]
        },
        "synergies": [
          {
            "zhCN": "极地冰暴: 每等级+0%持续时间",
            "zhTW": "極地寒風：每等級 +0% 持續時效",
            "enUS": "Arctic Blast: +0% Duration per Level"
          },
          {
            "zhCN": "龙卷风: 每等级+10%伤害",
            "zhTW": "龍捲風：每等級 +10% 傷害",
            "enUS": "Tornado: +10% Damage per Level"
          },
          {
            "zhCN": "飓风: 每等级+10%伤害",
            "zhTW": "颶風術：每等級 +10% 傷害",
            "enUS": "Hurricane: +10% Damage per Level"
          }
        ]
      },
      {
        "id": 241,
        "key": "Vines",
        "page": 1,
        "row": 5,
        "col": 3,
        "reqLvl": 24,
        "reqs": [
          "Cycle of Life"
        ],
        "passive": false,
        "nameZh": "太阳藤",
        "nameTw": "太陽藤蔓",
        "nameEn": "Solar Creeper",
        "descZh": "召唤藤蔓吞噬残骸 · 为你补充法力值",
        "descTw": "召喚藤蔓，吞食附近的屍體並為你恢復法力",
        "descEn": "summon a vine that eats corpses · and replenishes your mana",
        "mana": {
          "base": 14,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 242,
        "key": "Hunger",
        "page": 2,
        "row": 5,
        "col": 2,
        "reqLvl": 24,
        "reqs": [
          "Fire Claws"
        ],
        "passive": false,
        "nameZh": "饥饿",
        "nameTw": "飢餓噬咬",
        "nameEn": "Hunger",
        "descZh": "在狼人或熊人形态下 · 撕咬敌人 · 获得生命和法力",
        "descTw": "在狼人或熊人形態下，撕咬敵人並獲得生命值與法力",
        "descEn": "when in werewolf or werebear · form, bite your enemies · to gain life and mana",
        "mana": {
          "base": 3,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 243,
        "key": "Shock Wave",
        "page": 2,
        "row": 5,
        "col": 3,
        "reqLvl": 24,
        "reqs": [
          "Maul"
        ],
        "passive": false,
        "nameZh": "震波",
        "nameTw": "震波衝擊",
        "nameEn": "Shock Wave",
        "descZh": "在熊人形态下 · 制造出一道震波 · 击昏附近的敌人",
        "descTw": "在熊人形態下，發出震波擊暈附近的敵人",
        "descEn": "when in werebear form, · create a shock wave · that stuns nearby enemies",
        "mana": {
          "base": 7,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "phys",
          "hitShift": 8,
          "min": [
            10,
            3,
            5,
            7,
            7,
            7
          ],
          "max": [
            20,
            3,
            5,
            7,
            7,
            7
          ]
        },
        "synergies": [
          {
            "zhCN": "猛槌: 每等级+10%伤害",
            "zhTW": "槌擊：每等級 +10% 傷害",
            "enUS": "Maul: +10% Damage per Level"
          }
        ]
      },
      {
        "id": 244,
        "key": "Volcano",
        "page": 3,
        "row": 5,
        "col": 1,
        "reqLvl": 24,
        "reqs": [
          "Eruption"
        ],
        "passive": false,
        "nameZh": "火山爆",
        "nameTw": "火山噴發",
        "nameEn": "Volcano",
        "descZh": "召唤一座火山 · 向敌人倾泄火焰与毁灭",
        "descTw": "召喚一座火山，向敵人噴濺死亡與毀滅之火",
        "descEn": "summon forth a volcano to rain death · and destruction over your enemies",
        "mana": {
          "base": 25,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 4,
        "dmg": {
          "type": "fire",
          "hitShift": 8,
          "min": [
            8,
            2,
            4,
            6,
            8,
            11
          ],
          "max": [
            10,
            2,
            4,
            6,
            8,
            13
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Eruption",
            "pct": 12
          },
          {
            "skill": "Armageddon",
            "pct": 12
          }
        ],
        "synergies": [
          {
            "zhCN": "熔岩巨石: 每等级+16%伤害",
            "zhTW": "熔火巨石：每等級 +16% 傷害",
            "enUS": "Molten Boulder: +16% Damage per Level"
          },
          {
            "zhCN": "熔岩裂地: 每等级+12%火焰伤害",
            "zhTW": "裂地之火：每等級 +12% 火焰傷害",
            "enUS": "Fissure: +12% Fire Damage per Level"
          },
          {
            "zhCN": "毁天灭地: 每等级+12%火焰伤害",
            "zhTW": "毀天滅地：每等級 +12% 火焰傷害",
            "enUS": "Armageddon: +12% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 245,
        "key": "Tornado",
        "page": 3,
        "row": 5,
        "col": 2,
        "reqLvl": 24,
        "reqs": [
          "Twister"
        ],
        "passive": false,
        "nameZh": "龙卷风",
        "nameTw": "龍捲風",
        "nameEn": "Tornado",
        "descZh": "创造出裹携着碎石的强风 · 冲击你的敌人",
        "descTw": "召喚強大的龍捲風，沿路捲起土石轟擊敵人",
        "descEn": "create a funnel of wind and debris · to blast your enemies",
        "mana": {
          "base": 10,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "phys",
          "hitShift": 8,
          "min": [
            25,
            8,
            14,
            20,
            24,
            28
          ],
          "max": [
            35,
            8,
            15,
            21,
            25,
            29
          ]
        },
        "synergies": [
          {
            "zhCN": "气旋护甲: 每等级+9%伤害",
            "zhTW": "氣旋護甲：每等級 +9% 傷害",
            "enUS": "Cyclone Armor: +9% Damage per Level"
          },
          {
            "zhCN": "小旋风: 每等级+9%伤害",
            "zhTW": "旋風術：每等級 +9% 傷害",
            "enUS": "Twister: +9% Damage per Level"
          },
          {
            "zhCN": "飓风: 每等级+9%伤害",
            "zhTW": "颶風術：每等級 +9% 傷害",
            "enUS": "Hurricane: +9% Damage per Level"
          }
        ]
      },
      {
        "id": 246,
        "key": "Spirit of Barbs",
        "page": 1,
        "row": 6,
        "col": 1,
        "reqLvl": 30,
        "reqs": [
          "Heart of Wolverine"
        ],
        "passive": false,
        "nameZh": "棘灵",
        "nameTw": "荊棘之靈",
        "nameEn": "Spirit of Barbs",
        "descZh": "召唤灵魂宠物 · 使你和队友受到伤害时 · 会反弹给敌人",
        "descTw": "召喚一個魂靈夥伴，將你和隊伍成員受到的傷害反彈回敵人身上",
        "descEn": "summon spirit pet that reflects damage · taken by you and your party · back at your enemies",
        "mana": {
          "base": 25,
          "lvl": 1,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "phys",
          "hitShift": 8,
          "min": [
            32,
            9,
            18,
            27,
            36,
            45
          ],
          "max": [
            0,
            0,
            0,
            0,
            0,
            0
          ]
        },
        "synergies": []
      },
      {
        "id": 247,
        "key": "Summon Grizzly",
        "page": 1,
        "row": 6,
        "col": 2,
        "reqLvl": 30,
        "reqs": [
          "Summon Fenris"
        ],
        "passive": false,
        "nameZh": "召唤灰熊",
        "nameTw": "召喚灰熊",
        "nameEn": "Summon Grizzly",
        "descZh": "召唤一只狂暴的灰熊",
        "descTw": "召喚一頭凶暴的大灰熊",
        "descEn": "summon a ferocious grizzly bear",
        "mana": {
          "base": 40,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "phys",
          "hitShift": 8,
          "min": [
            30,
            10,
            15,
            20,
            26,
            30
          ],
          "max": [
            60,
            10,
            15,
            20,
            26,
            30
          ]
        },
        "synergies": [
          {
            "zhCN": "召唤灵狼: 每等级+25%命中值",
            "zhTW": "召喚幽靈狼：每等級 +25% 準確率",
            "enUS": "Summon Spirit Wolf: +25% Attack Rating per Level"
          },
          {
            "zhCN": "召唤灵狼: 每等级+10%防御值",
            "zhTW": "召喚幽靈狼：每等級 +10% 防禦",
            "enUS": "Summon Spirit Wolf: +10% Defense per Level"
          },
          {
            "zhCN": "召唤狂狼: 每等级+15%生命",
            "zhTW": "召喚恐狼：每等級 +15% 生命",
            "enUS": "Summon Dire Wolf: +15% Life per Level"
          }
        ]
      },
      {
        "id": 248,
        "key": "Fury",
        "page": 2,
        "row": 6,
        "col": 1,
        "reqLvl": 30,
        "reqs": [
          "Rabies"
        ],
        "passive": false,
        "nameZh": "狼怒",
        "nameTw": "狂怒連擊",
        "nameEn": "Fury",
        "descZh": "在狼人形态下 · 可以同时攻击周围多个敌人 · 或对同一个敌人攻击多次",
        "descTw": "在狼人形態下，攻擊多個鄰近的目標或連續攻擊單一目標",
        "descEn": "when in werewolf form, attack · either multiple adjacent targets · or one target multiple times",
        "mana": {
          "base": 4,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 249,
        "key": "Armageddon",
        "page": 3,
        "row": 6,
        "col": 1,
        "reqLvl": 30,
        "reqs": [
          "Volcano"
        ],
        "passive": false,
        "nameZh": "毁天灭地",
        "nameTw": "毀天滅地",
        "nameEn": "Armageddon",
        "descZh": "创造出猛烈的陨石雨 · 毁灭周围的敌人",
        "descTw": "召喚隕石，在敵人身上降下毀滅的火雨",
        "descEn": "create a meteor shower to rain fiery · destruction on nearby enemies",
        "mana": {
          "base": 35,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "fire",
          "hitShift": 8,
          "min": [
            25,
            15,
            20,
            25,
            31,
            38
          ],
          "max": [
            75,
            16,
            22,
            27,
            34,
            40
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Molten Boulder",
            "pct": 14
          },
          {
            "skill": "Firestorm",
            "pct": 14
          }
        ],
        "synergies": [
          {
            "zhCN": "熔岩裂地: 每等级+2秒",
            "zhTW": "裂地之火：每等級 +2 秒",
            "enUS": "Fissure: +2 Seconds per Level"
          },
          {
            "zhCN": "火焰风暴: 每等级+14%火焰伤害",
            "zhTW": "火焰風暴：每等級 +14% 火焰傷害",
            "enUS": "Firestorm: +14% Fire Damage per Level"
          },
          {
            "zhCN": "熔岩巨石: 每等级+14%火焰伤害",
            "zhTW": "熔火巨石：每等級 +14% 火焰傷害",
            "enUS": "Molten Boulder: +14% Fire Damage per Level"
          },
          {
            "zhCN": "火山爆: 每等级+18%伤害",
            "zhTW": "火山噴發：每等級 +18% 傷害",
            "enUS": "Volcano: +18% Damage per Level"
          }
        ]
      },
      {
        "id": 250,
        "key": "Hurricane",
        "page": 3,
        "row": 6,
        "col": 2,
        "reqLvl": 30,
        "reqs": [
          "Tornado"
        ],
        "passive": false,
        "nameZh": "飓风",
        "nameTw": "颶風術",
        "nameEn": "Hurricane",
        "descZh": "创造出剧烈的风暴 · 将敌人撕成碎片",
        "descTw": "召喚呼嘯的狂風襲捲大地，粉碎你的敵人",
        "descEn": "create a massive storm of wind and · debris to pound your enemies to bits",
        "mana": {
          "base": 30,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "cold",
          "hitShift": 8,
          "min": [
            25,
            7,
            10,
            12,
            14,
            16
          ],
          "max": [
            50,
            7,
            10,
            12,
            14,
            16
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Twister",
            "pct": 9
          },
          {
            "skill": "Tornado",
            "pct": 9
          }
        ],
        "synergies": [
          {
            "zhCN": "气旋护甲: 每等级+2秒",
            "zhTW": "氣旋護甲：每等級 +2 秒",
            "enUS": "Cyclone Armor: +2 Seconds per Level"
          },
          {
            "zhCN": "小旋风: 每等级+9%伤害",
            "zhTW": "旋風術：每等級 +9% 傷害",
            "enUS": "Twister: +9% Damage per Level"
          },
          {
            "zhCN": "龙卷风: 每等级+9%伤害",
            "zhTW": "龍捲風：每等級 +9% 傷害",
            "enUS": "Tornado: +9% Damage per Level"
          }
        ]
      }
    ]
  },
  {
    "id": "ass",
    "nameZh": "刺客",
    "nameTw": "刺客",
    "nameEn": "Assassin",
    "icon": "/images/ui/assassinicon.webp",
    "tabs": [
      {
        "page": 2,
        "zhCN": "影身训练",
        "zhTW": "暗影修行",
        "enUS": "Shadow Disciplines"
      },
      {
        "page": 1,
        "zhCN": "陷阱",
        "zhTW": "陷阱",
        "enUS": "Traps"
      },
      {
        "page": 3,
        "zhCN": "武学技艺",
        "zhTW": "武學技藝",
        "enUS": "Martial Arts"
      }
    ],
    "skills": [
      {
        "id": 251,
        "key": "Fire Trauma",
        "page": 1,
        "row": 1,
        "col": 2,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "投火弹",
        "nameTw": "火焰轟擊",
        "nameEn": "Fire Blast",
        "descZh": "投出火焰炸弹 · 将敌人炸成碎片",
        "descTw": "丟出火焰炸彈，炸碎你的敵人",
        "descEn": "throw a fire bomb · to blast your enemies to bits",
        "mana": {
          "base": 24,
          "lvl": 1,
          "shift": 5,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "fire",
          "hitShift": 7,
          "min": [
            6,
            3,
            8,
            20,
            38,
            58
          ],
          "max": [
            8,
            5,
            11,
            24,
            44,
            66
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Shock Field",
            "pct": 11
          },
          {
            "skill": "Charged Bolt Sentry",
            "pct": 11
          },
          {
            "skill": "Lightning Sentry",
            "pct": 11
          },
          {
            "skill": "Wake of Fire Sentry",
            "pct": 11
          },
          {
            "skill": "Inferno Sentry",
            "pct": 11
          }
        ],
        "synergies": [
          {
            "zhCN": "雷电网: 每等级+11%火焰伤害",
            "zhTW": "雷電網：每等級 +11% 火焰傷害",
            "enUS": "Shock Web: +11% Fire Damage per Level"
          },
          {
            "zhCN": "电能守卫: 每等级+11%火焰伤害",
            "zhTW": "電能衛哨：每等級 +11% 火焰傷害",
            "enUS": "Charged Bolt Sentry: +11% Fire Damage per Level"
          },
          {
            "zhCN": "伏地火: 每等级+11%火焰伤害",
            "zhTW": "焰痕衛哨：每等級 +11% 火焰傷害",
            "enUS": "Wake of Fire: +11% Fire Damage per Level"
          },
          {
            "zhCN": "雷光守卫: 每等级+11%火焰伤害",
            "zhTW": "雷光衛哨：每等級 +11% 火焰傷害",
            "enUS": "Lightning Sentry: +11% Fire Damage per Level"
          },
          {
            "zhCN": "狱火尾焰: 每等级+11%火焰伤害",
            "zhTW": "獄火衛哨：每等級 +11% 火焰傷害",
            "enUS": "Wake of Inferno: +11% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 252,
        "key": "Claw Mastery",
        "page": 2,
        "row": 1,
        "col": 2,
        "reqLvl": 1,
        "reqs": [],
        "passive": true,
        "nameZh": "利爪精通",
        "nameTw": "利爪專精",
        "nameEn": "Claw Mastery",
        "descZh": "被动 - 提高你使用 · 爪类武器的技巧",
        "descTw": "被動 - 提高你使用爪類武器的戰鬥技巧",
        "descEn": "passive - improves your skill · with claw class weapons",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 253,
        "key": "Psychic Hammer",
        "page": 2,
        "row": 1,
        "col": 3,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "心灵重锤",
        "nameTw": "心靈之鎚",
        "nameEn": "Psychic Hammer",
        "descZh": "运用意念的力量 · 创造出心灵震波 · 冲击并击退你的敌人",
        "descTw": "以心靈的力量發出強力震擊，擊退你的敵人",
        "descEn": "use the power of your mind · to create a psychic blast · to crush and knock back your enemies",
        "mana": {
          "base": 16,
          "lvl": 1,
          "shift": 6,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "mag",
          "hitShift": 7,
          "min": [
            2,
            2,
            3,
            4,
            5,
            6
          ],
          "max": [
            6,
            3,
            4,
            5,
            6,
            7
          ]
        },
        "synergies": []
      },
      {
        "id": 254,
        "key": "Tiger Strike",
        "page": 3,
        "row": 1,
        "col": 2,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "猛虎攻击",
        "nameTw": "猛虎擊",
        "nameEn": "Tiger Strike",
        "descZh": "充能技 ·  · 连续命中目标可以 · 提高终结技的伤害加成 · 必须使用龙系终结技 · 或普通攻击来释放充能",
        "descTw": "集氣技能 ·  · 連擊可以累積額外的終結技傷害 · 必須使用龍系終結技或普通攻擊來釋放聚集的力量",
        "descEn": "Charge-up Skill ·  · consecutive hits add damage bonuses · to finishing moves · must use a dragon finishing move or · normal attack to release charges",
        "mana": {
          "base": 1,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 255,
        "key": "Dragon Talon",
        "page": 3,
        "row": 1,
        "col": 3,
        "reqLvl": 1,
        "reqs": [],
        "passive": false,
        "nameZh": "龙爪",
        "nameTw": "龍爪踢",
        "nameEn": "Dragon Talon",
        "descZh": "终结技 ·  · 将你的敌人踢开 · 为脚踢提供充能加成",
        "descTw": "終結技 ·  · 把敵人從你面前踢開 · 踢擊會釋放集氣累積的效果",
        "descEn": "Finishing Move ·  · kick your enemies out of your way · adds charged-up bonuses to the kick",
        "mana": {
          "base": 6,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 256,
        "key": "Shock Field",
        "page": 1,
        "row": 2,
        "col": 1,
        "reqLvl": 6,
        "reqs": [
          "Fire Trauma"
        ],
        "passive": false,
        "nameZh": "雷电网",
        "nameTw": "雷電網",
        "nameEn": "Shock Web",
        "descZh": "投出闪电捕网 · 震击敌人",
        "descTw": "擲出帶電的網子，電擊你的敵人",
        "descEn": "throw a web of lightning · to shock your enemies",
        "mana": {
          "base": 6,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0.6,
        "dmg": {
          "type": "ltng",
          "hitShift": 7,
          "min": [
            2,
            0,
            0,
            0,
            0,
            0
          ],
          "max": [
            20,
            6,
            12,
            20,
            30,
            42
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Charged Bolt Sentry",
            "pct": 17
          },
          {
            "skill": "Lightning Sentry",
            "pct": 17
          }
        ],
        "synergies": [
          {
            "zhCN": "投火弹: 每 3 级 +1 尖刺",
            "zhTW": "%0：每 %2 級數量 %+1",
            "enUS": "Fire Blast: +1 Spike per 3 Levels"
          },
          {
            "zhCN": "电能守卫: 每等级+17%闪电伤害",
            "zhTW": "電能衛哨：每等級 +17% 電擊傷害",
            "enUS": "Charged Bolt Sentry: +17% Lightning Damage per Level"
          },
          {
            "zhCN": "雷光守卫: 每等级+17%闪电伤害",
            "zhTW": "雷光衛哨：每等級 +17% 電擊傷害",
            "enUS": "Lightning Sentry: +17% Lightning Damage per Level"
          }
        ]
      },
      {
        "id": 257,
        "key": "Blade Sentinel",
        "page": 1,
        "row": 2,
        "col": 3,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "刀刃守卫",
        "nameTw": "戒衛旋刃",
        "nameEn": "Blade Sentinel",
        "descZh": "投出飞旋的利刃 · 在你和目标地点之间往返",
        "descTw": "設置旋轉的刀刃在你和目標位置之間穿梭來回",
        "descEn": "set a spinning blade to patrol · between you and target point",
        "mana": {
          "base": 7,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 1,
        "dmg": {
          "type": "phys",
          "hitShift": 8,
          "min": [
            6,
            3,
            4,
            5,
            5,
            5
          ],
          "max": [
            10,
            3,
            4,
            5,
            5,
            5
          ]
        },
        "synergies": [
          {
            "zhCN": "利刃之怒: 每等级+10%伤害",
            "zhTW": "狂怒旋刃：每等級 +10% 傷害",
            "enUS": "Blade Fury: +10% Damage per Level"
          },
          {
            "zhCN": "刀刃之盾: 每等级+10%伤害",
            "zhTW": "利刃之盾：每等級 +10% 傷害",
            "enUS": "Blade Shield: +10% Damage per Level"
          }
        ]
      },
      {
        "id": 258,
        "key": "Quickness",
        "page": 2,
        "row": 2,
        "col": 1,
        "reqLvl": 6,
        "reqs": [
          "Claw Mastery"
        ],
        "passive": false,
        "nameZh": "速度爆发",
        "nameTw": "速度爆發",
        "nameEn": "Burst of Speed",
        "descZh": "在一段时间内 · 提高攻击与移动速度",
        "descTw": "暫時提高你的攻擊和移動速度",
        "descEn": "increases attack and movement speed · for a period of time",
        "mana": {
          "base": 10,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 259,
        "key": "Fists of Fire",
        "page": 3,
        "row": 2,
        "col": 1,
        "reqLvl": 6,
        "reqs": [],
        "passive": false,
        "nameZh": "烈焰拳",
        "nameTw": "烈火拳",
        "nameEn": "Fists of Fire",
        "descZh": "充能技 ·  · 连续命中目标可以 · 为终结技附带火焰伤害 · 需装备爪类武器方可使用 · 必须使用龙系终结技 · 或普通攻击来释放充能",
        "descTw": "集氣技能 ·  · 連擊可以使終結技附加火焰傷害 · 裝備爪類武器才可使用 · 必須使用龍系終結技或普通攻擊來釋放聚集的力量",
        "descEn": "Charge-up Skill ·  · consecutive hits add fire damage · to finishing moves · can only be used with claw class weapons · must use a dragon finishing move or · normal attack to release charges",
        "mana": {
          "base": 2,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "fire",
          "hitShift": 8,
          "min": [
            6,
            5,
            10,
            20,
            30,
            40
          ],
          "max": [
            10,
            5,
            11,
            22,
            33,
            44
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Royal Strike",
            "pct": 12
          }
        ],
        "synergies": [
          {
            "zhCN": "凤凰攻击: 每等级+12%火焰伤害",
            "zhTW": "鳳凰擊：每等級 +12% 火焰傷害",
            "enUS": "Phoenix Strike: +12% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 260,
        "key": "Dragon Claw",
        "page": 3,
        "row": 2,
        "col": 3,
        "reqLvl": 6,
        "reqs": [
          "Dragon Talon"
        ],
        "passive": false,
        "nameZh": "双龙爪",
        "nameTw": "雙龍爪",
        "nameEn": "Dragon Claw",
        "descZh": "终结技 ·  · 使用双爪切割敌人 · 为双爪攻击提供充能加成",
        "descTw": "終結技 ·  · 使用兩手的爪類武器大肆削切敵人 · 雙爪都會釋放集氣的效果",
        "descEn": "Finishing Move ·  · slice and dice your enemies · with your dual claw class weapons · adds charged-up bonuses to both claw attacks",
        "mana": {
          "base": 2,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "利爪精通: 每等级+4%伤害",
            "zhTW": "利爪專精：每等級 +4% 傷害",
            "enUS": "Claw Mastery: +4% Damage per Level"
          }
        ]
      },
      {
        "id": 261,
        "key": "Charged Bolt Sentry",
        "page": 1,
        "row": 3,
        "col": 1,
        "reqLvl": 12,
        "reqs": [
          "Shock Field"
        ],
        "passive": false,
        "nameZh": "电能守卫",
        "nameTw": "電能衛哨",
        "nameEn": "Charged Bolt Sentry",
        "descZh": "设下陷阱, 当敌人靠近时 · 发射出电荷弹",
        "descTw": "佈下可放出電能彈的陷阱，攻擊接近的敵人",
        "descEn": "a trap that emits charged bolts · at enemies that pass near",
        "mana": {
          "base": 13,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "ltng",
          "hitShift": 7,
          "min": [
            2,
            0,
            0,
            0,
            0,
            0
          ],
          "max": [
            14,
            6,
            8,
            12,
            14,
            16
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Fire Trauma",
            "pct": 9
          },
          {
            "skill": "Lightning Sentry",
            "pct": 9
          }
        ],
        "synergies": [
          {
            "zhCN": "雷电网: 每 3 级 +1 枚",
            "zhTW": "%0：每 %2 級電能彈數量 %+1",
            "enUS": "Shock Web: +1 Bolt per 3 Levels"
          },
          {
            "zhCN": "雷光守卫: 每 4 级 +1 发射次数",
            "zhTW": "%0：每 %2 級攻擊次數 %+1",
            "enUS": "Lightning Sentry: +1 Shot per 4 Levels"
          },
          {
            "zhCN": "投火弹: 每等级+9%闪电伤害",
            "zhTW": "火焰轟擊：每等級 +9% 電擊傷害",
            "enUS": "Fire Blast: +9% Lightning Damage per Level"
          },
          {
            "zhCN": "雷光守卫: 每等级+9%闪电伤害",
            "zhTW": "雷光衛哨：每等級 +9% 電擊傷害",
            "enUS": "Lightning Sentry: +9% Lightning Damage per Level"
          }
        ]
      },
      {
        "id": 262,
        "key": "Wake of Fire Sentry",
        "page": 1,
        "row": 3,
        "col": 2,
        "reqLvl": 12,
        "reqs": [
          "Fire Trauma"
        ],
        "passive": false,
        "nameZh": "伏地火",
        "nameTw": "焰痕衛哨",
        "nameEn": "Wake of Fire",
        "descZh": "设下陷阱, 喷出火焰波",
        "descTw": "設置可引燃多道火焰的陷阱",
        "descEn": "a trap that emits waves of fire",
        "mana": {
          "base": 13,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "fire",
          "hitShift": 8,
          "min": [
            5,
            2,
            3,
            5,
            7,
            9
          ],
          "max": [
            10,
            2,
            3,
            6,
            8,
            10
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Fire Trauma",
            "pct": 10
          },
          {
            "skill": "Inferno Sentry",
            "pct": 10
          }
        ],
        "synergies": [
          {
            "zhCN": "投火弹: 每等级+10%火焰伤害",
            "zhTW": "火焰轟擊：每等級 +10% 火焰傷害",
            "enUS": "Fire Blast: +10% Fire Damage per Level"
          },
          {
            "zhCN": "狱火尾焰: 每等级+10%火焰伤害",
            "zhTW": "獄火衛哨：每等級 +10% 火焰傷害",
            "enUS": "Wake of Inferno: +10% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 263,
        "key": "Weapon Block",
        "page": 2,
        "row": 3,
        "col": 2,
        "reqLvl": 12,
        "reqs": [
          "Claw Mastery"
        ],
        "passive": true,
        "nameZh": "武器格挡",
        "nameTw": "武器格擋",
        "nameEn": "Weapon Block",
        "descZh": "被动 - 当你双持爪类武器时 · 有几率格挡敌人的攻击",
        "descTw": "被動 - 雙手裝備兩把爪類武器時有一定機率格擋",
        "descEn": "passive - chance to block when · you are using dual claw class weapons",
        "mana": null,
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 264,
        "key": "Cloak of Shadows",
        "page": 2,
        "row": 3,
        "col": 3,
        "reqLvl": 12,
        "reqs": [
          "Psychic Hammer"
        ],
        "passive": false,
        "nameZh": "暗影斗篷",
        "nameTw": "魔影斗蓬",
        "nameEn": "Cloak of Shadows",
        "descZh": "创造出一片阴影, 遮蔽附近的敌人 · 暂时降低他们的防御值",
        "descTw": "施放一道魔影使附近的敵人陷入目盲，並降低其防禦",
        "descEn": "cast a shadow to blind nearby enemies · lowering their defenses for a period of time",
        "mana": {
          "base": 13,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 265,
        "key": "Cobra Strike",
        "page": 3,
        "row": 3,
        "col": 2,
        "reqLvl": 12,
        "reqs": [
          "Tiger Strike"
        ],
        "passive": false,
        "nameZh": "眼镜蛇攻击",
        "nameTw": "靈蛇擊",
        "nameEn": "Cobra Strike",
        "descZh": "充能技 ·  · 连续命中目标可以 · 为终结技附带生命和法力偷取 · 必须使用龙系终结技或 · 普通攻击来释放充能",
        "descTw": "集氣技能 ·  · 連擊可以使終結技附加生命和法力竊取效果 · 必須使用龍系終結技或普通攻擊來釋放聚集的力量",
        "descEn": "Charge-up Skill ·  · consecutive hits add life and mana stealing · to finishing moves · must use a dragon finishing move or · normal attack to release charges",
        "mana": {
          "base": 2,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 266,
        "key": "Blade Fury",
        "page": 1,
        "row": 4,
        "col": 3,
        "reqLvl": 18,
        "reqs": [
          "Blade Sentinel",
          "Wake of Fire Sentry"
        ],
        "passive": false,
        "nameZh": "利刃之怒",
        "nameTw": "狂怒旋刃",
        "nameEn": "Blade Fury",
        "descZh": "投出飞旋的刀刃 · 切割你的敌人",
        "descTw": "擲出不停旋轉的刀刃攻擊敵人",
        "descEn": "throw spinning blades · to slice up your enemies",
        "mana": {
          "base": 8,
          "lvl": 1,
          "shift": 5,
          "min": 0
        },
        "cooldown": 0,
        "dmg": {
          "type": "phys",
          "hitShift": 8,
          "min": [
            8,
            3,
            5,
            8,
            8,
            8
          ],
          "max": [
            10,
            3,
            5,
            8,
            8,
            8
          ]
        },
        "synergies": [
          {
            "zhCN": "刀刃守卫: 每等级+10%伤害",
            "zhTW": "戒衛旋刃：每等級 +10% 傷害",
            "enUS": "Blade Sentinel: +10% Damage per Level"
          },
          {
            "zhCN": "刀刃之盾: 每等级+10%伤害",
            "zhTW": "利刃之盾：每等級 +10% 傷害",
            "enUS": "Blade Shield: +10% Damage per Level"
          }
        ]
      },
      {
        "id": 267,
        "key": "Fade",
        "page": 2,
        "row": 4,
        "col": 1,
        "reqLvl": 18,
        "reqs": [
          "Quickness"
        ],
        "passive": false,
        "nameZh": "消隐",
        "nameTw": "影散",
        "nameEn": "Fade",
        "descZh": "在一段时间内提高 · 所有抗性及对诅咒的抵抗力",
        "descTw": "暫時提高所有抗性並抵擋詛咒",
        "descEn": "raise all resistances and resist curses · for a period of time",
        "mana": {
          "base": 10,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 268,
        "key": "Shadow Warrior",
        "page": 2,
        "row": 4,
        "col": 2,
        "reqLvl": 18,
        "reqs": [
          "Cloak of Shadows",
          "Weapon Block"
        ],
        "passive": false,
        "nameZh": "影身战士",
        "nameTw": "暗影戰士",
        "nameEn": "Shadow Warrior",
        "descZh": "召唤你自己的影子 · 模仿你的技能, 与你并肩作战",
        "descTw": "召喚出自己的影子，模仿你的技能和你並肩作戰",
        "descEn": "summon a shadow of yourself that mimics · your skills and fights by your side",
        "mana": {
          "base": 54,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0.6,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 269,
        "key": "Claws of Thunder",
        "page": 3,
        "row": 4,
        "col": 1,
        "reqLvl": 18,
        "reqs": [
          "Fists of Fire"
        ],
        "passive": false,
        "nameZh": "雷电爪",
        "nameTw": "雷電爪",
        "nameEn": "Claws of Thunder",
        "descZh": "充能技 ·  · 连续命中目标可以 · 为终结技附带闪电伤害 · 需装备爪类武器方可使用 · 必须使用龙系终结技 · 或普通攻击来释放充能",
        "descTw": "集氣技能 ·  · 連擊可以使終結技附加電擊傷害 · 裝備爪類武器才可使用 · 必須使用龍系終結技或普通攻擊來釋放聚集的力量",
        "descEn": "Charge-up Skill ·  · consecutive hits add lightning damage · to finishing moves · can only be used with claw class weapons · must use a dragon finishing move or · normal attack to release charges",
        "mana": {
          "base": 4,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "ltng",
          "hitShift": 8,
          "min": [
            1,
            0,
            0,
            0,
            0,
            0
          ],
          "max": [
            80,
            20,
            40,
            60,
            80,
            100
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Royal Strike",
            "pct": 8
          }
        ],
        "synergies": [
          {
            "zhCN": "凤凰攻击: 每等级+8%闪电伤害",
            "zhTW": "鳳凰擊：每等級 +8% 電擊傷害",
            "enUS": "Phoenix Strike: +8% Lightning Damage per Level"
          }
        ]
      },
      {
        "id": 270,
        "key": "Dragon Tail",
        "page": 3,
        "row": 4,
        "col": 3,
        "reqLvl": 18,
        "reqs": [
          "Dragon Claw"
        ],
        "passive": false,
        "nameZh": "神龙摆尾",
        "nameTw": "龍擺尾",
        "nameEn": "Dragon Tail",
        "descZh": "终结技 ·  · 使用爆炸踢击退敌人 · 为脚踢提供充能加成",
        "descTw": "終結技 ·  · 以爆發性的威力踢擊敵人，將其擊退 · 踢擊會釋放集氣的效果",
        "descEn": "Finishing Move ·  · knock back your enemies with an explosive kick · adds charged-up bonuses to the kick",
        "mana": {
          "base": 10,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 271,
        "key": "Lightning Sentry",
        "page": 1,
        "row": 5,
        "col": 1,
        "reqLvl": 24,
        "reqs": [
          "Charged Bolt Sentry"
        ],
        "passive": false,
        "nameZh": "雷光守卫",
        "nameTw": "雷光衛哨",
        "nameEn": "Lightning Sentry",
        "descZh": "设下陷阱, 当敌人靠近时 · 发射出灼热的闪电",
        "descTw": "設置會放出閃電的陷阱，轟擊靠近的敵人",
        "descEn": "a trap that shoots lightning · to scorch passing enemies",
        "mana": {
          "base": 20,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "ltng",
          "hitShift": 8,
          "min": [
            1,
            0,
            0,
            0,
            0,
            0
          ],
          "max": [
            20,
            10,
            16,
            24,
            34,
            44
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Shock Field",
            "pct": 18
          },
          {
            "skill": "Charged Bolt Sentry",
            "pct": 18
          }
        ],
        "synergies": [
          {
            "zhCN": "雷电网: 每等级+18%闪电伤害",
            "zhTW": "雷電網：每等級 +18% 電擊傷害",
            "enUS": "Shock Web: +18% Lightning Damage per Level"
          },
          {
            "zhCN": "电能守卫: 每等级+18%闪电伤害",
            "zhTW": "電能衛哨：每等級 +18% 電擊傷害",
            "enUS": "Charged Bolt Sentry: +18% Lightning Damage per Level"
          }
        ]
      },
      {
        "id": 272,
        "key": "Inferno Sentry",
        "page": 1,
        "row": 5,
        "col": 2,
        "reqLvl": 24,
        "reqs": [
          "Wake of Fire Sentry"
        ],
        "passive": false,
        "nameZh": "狱火尾焰",
        "nameTw": "獄火衛哨",
        "nameEn": "Wake of Inferno",
        "descZh": "设下陷阱, 当敌人靠近时喷出烈焰",
        "descTw": "設置可對靠近的敵人噴發烈焰的陷阱",
        "descEn": "trap that sprays fire at passing enemies",
        "mana": {
          "base": 20,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "fire",
          "hitShift": 4,
          "min": [
            20,
            17,
            21,
            26,
            32,
            39
          ],
          "max": [
            50,
            19,
            23,
            28,
            34,
            41
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Fire Trauma",
            "pct": 18
          },
          {
            "skill": "Wake of Fire Sentry",
            "pct": 18
          }
        ],
        "synergies": [
          {
            "zhCN": "伏地火: 每等级+0.5码",
            "zhTW": "焰痕衛哨：每等級 +0.5 碼射程",
            "enUS": "Wake of Fire: +0.5 Yards per Level"
          },
          {
            "zhCN": "投火弹: 每等级+18%火焰伤害",
            "zhTW": "火焰轟擊：每等級 +18% 火焰傷害",
            "enUS": "Fire Blast: +18% Fire Damage per Level"
          },
          {
            "zhCN": "伏地火: 每等级+18%火焰伤害",
            "zhTW": "焰痕衛哨：每等級 +18% 火焰傷害",
            "enUS": "Wake of Fire: +18% Fire Damage per Level"
          }
        ]
      },
      {
        "id": 273,
        "key": "Mind Blast",
        "page": 2,
        "row": 5,
        "col": 3,
        "reqLvl": 24,
        "reqs": [
          "Cloak of Shadows"
        ],
        "passive": false,
        "nameZh": "心灵爆震",
        "nameTw": "心靈震爆",
        "nameEn": "Mind Blast",
        "descZh": "运用意念的力量 · 击昏一群敌人 · 意志脆弱的敌人会为你而战",
        "descTw": "使用靈能的力量擊昏一群敵人，並控制心靈脆弱的敵人",
        "descEn": "using the power of your mind · stun a group of enemies · and convert the feeble-minded",
        "mana": {
          "base": 15,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "phys",
          "hitShift": 8,
          "min": [
            10,
            2,
            5,
            8,
            8,
            8
          ],
          "max": [
            20,
            2,
            5,
            8,
            8,
            8
          ]
        },
        "synergies": []
      },
      {
        "id": 274,
        "key": "Blades of Ice",
        "page": 3,
        "row": 5,
        "col": 1,
        "reqLvl": 24,
        "reqs": [
          "Claws of Thunder"
        ],
        "passive": false,
        "nameZh": "寒冰刃",
        "nameTw": "寒冰刃",
        "nameEn": "Blades of Ice",
        "descZh": "充能技 ·  · 连续命中目标可以 · 为终结技附带冰霜伤害 · 需装备爪类武器方可使用 · 必须使用龙系终结技 · 或普通攻击来释放充能",
        "descTw": "集氣技能 ·  · 連擊可以使終結技附加冰寒傷害 · 裝備爪類武器才可使用 · 必須使用龍系終結技或普通攻擊來釋放聚集的力量",
        "descEn": "Charge-up Skill ·  · consecutive hits add cold damage · to finishing moves · can only be used with claw class weapons · must use a dragon finishing move or · normal attack to release charges",
        "mana": {
          "base": 3,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "cold",
          "hitShift": 8,
          "min": [
            15,
            8,
            10,
            20,
            30,
            40
          ],
          "max": [
            35,
            8,
            10,
            22,
            32,
            42
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Royal Strike",
            "pct": 8
          }
        ],
        "synergies": [
          {
            "zhCN": "凤凰攻击: 每等级+8%冰霜伤害",
            "zhTW": "鳳凰擊：每等級 +8% 冰寒傷害",
            "enUS": "Phoenix Strike: +8% Cold Damage per Level"
          }
        ]
      },
      {
        "id": 275,
        "key": "Dragon Flight",
        "page": 3,
        "row": 5,
        "col": 3,
        "reqLvl": 24,
        "reqs": [
          "Dragon Tail"
        ],
        "passive": false,
        "nameZh": "飞龙在天",
        "nameTw": "翔龍腳",
        "nameEn": "Dragon Flight",
        "descZh": "终结技 ·  · 传送至敌人身边 · 发起毁灭性的猛踢 · 为脚踢提供充能加成",
        "descTw": "終結技 ·  · 瞬移到敵人身邊，並施展毀滅性的踢擊 · 踢擊會釋放集氣的效果",
        "descEn": "Finishing Move ·  · teleport to your enemies · and destroy them with a kick · adds charged-up bonuses to the kick",
        "mana": {
          "base": 15,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 276,
        "key": "Death Sentry",
        "page": 1,
        "row": 6,
        "col": 1,
        "reqLvl": 30,
        "reqs": [
          "Lightning Sentry"
        ],
        "passive": false,
        "nameZh": "死亡守卫",
        "nameTw": "死亡衛哨",
        "nameEn": "Death Sentry",
        "descZh": "设下陷阱, 当敌人靠近时射出闪电 · 或引爆周围的残骸, 消灭更多敌人",
        "descTw": "對敵人射出閃電或使附近屍體爆炸，對敵人造成更大規模毀滅的陷阱",
        "descEn": "trap that shoots lightning at your enemies · or explodes nearby corpses laying waste to more enemies",
        "mana": {
          "base": 20,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "ltng",
          "hitShift": 8,
          "min": [
            1,
            0,
            0,
            0,
            0,
            0
          ],
          "max": [
            50,
            8,
            14,
            22,
            28,
            34
          ]
        },
        "dmgSynergies": [
          {
            "skill": "Lightning Sentry",
            "pct": 12
          }
        ],
        "synergies": [
          {
            "zhCN": "投火弹: 每 3 级 +1 发射次数",
            "zhTW": "%0：每 %2 級攻擊次數 %+1",
            "enUS": "Fire Blast: +1 Shot per 3 Levels"
          },
          {
            "zhCN": "雷光守卫: 每等级+12%闪电伤害",
            "zhTW": "雷光衛哨：每等級 +12% 電擊傷害",
            "enUS": "Lightning Sentry: +12% Lightning Damage per Level"
          }
        ]
      },
      {
        "id": 277,
        "key": "Blade Shield",
        "page": 1,
        "row": 6,
        "col": 3,
        "reqLvl": 30,
        "reqs": [
          "Blade Fury"
        ],
        "passive": false,
        "nameZh": "刀刃之盾",
        "nameTw": "利刃之盾",
        "nameEn": "Blade Shield",
        "descZh": "飞旋的利刃割裂所有 · 胆敢靠近的敌人",
        "descTw": "放出圍繞著你旋轉的刀刃，對靠近的敵人造成傷害",
        "descEn": "spinning blades slice enemies · who stray too close",
        "mana": {
          "base": 27,
          "lvl": 2,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "phys",
          "hitShift": 8,
          "min": [
            1,
            5,
            6,
            7,
            7,
            7
          ],
          "max": [
            30,
            5,
            6,
            7,
            7,
            7
          ]
        },
        "synergies": [
          {
            "zhCN": "刀刃守卫: 每等级+10%伤害",
            "zhTW": "戒衛旋刃：每等級 +10% 傷害",
            "enUS": "Blade Sentinel: +10% Damage per Level"
          },
          {
            "zhCN": "利刃之怒: 每等级+10%伤害",
            "zhTW": "狂怒旋刃：每等級 +10% 傷害",
            "enUS": "Blade Fury: +10% Damage per Level"
          }
        ]
      },
      {
        "id": 278,
        "key": "Venom",
        "page": 2,
        "row": 6,
        "col": 1,
        "reqLvl": 30,
        "reqs": [
          "Fade"
        ],
        "passive": false,
        "nameZh": "涂毒",
        "nameTw": "淬毒",
        "nameEn": "Venom",
        "descZh": "你的武器附加毒素伤害",
        "descTw": "使你的武器附加毒素傷害",
        "descEn": "add poison damage to your weapons",
        "mana": {
          "base": 12,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": {
          "type": "pois",
          "hitShift": 6,
          "min": [
            24,
            6,
            8,
            10,
            12,
            14
          ],
          "max": [
            32,
            6,
            8,
            10,
            12,
            14
          ]
        },
        "synergies": []
      },
      {
        "id": 279,
        "key": "Shadow Master",
        "page": 2,
        "row": 6,
        "col": 2,
        "reqLvl": 30,
        "reqs": [
          "Shadow Warrior"
        ],
        "passive": false,
        "nameZh": "影身大师",
        "nameTw": "暗影宗師",
        "nameEn": "Shadow Master",
        "descZh": "召唤自身强大的影子 · 与你并肩作战",
        "descTw": "召喚自己強大的影子，與你共同作戰",
        "descEn": "summon a powerful shadow of yourself · to fight by your side",
        "mana": {
          "base": 70,
          "lvl": 1,
          "shift": 7,
          "min": 1
        },
        "cooldown": 0.6,
        "dmg": null,
        "synergies": []
      },
      {
        "id": 280,
        "key": "Royal Strike",
        "page": 3,
        "row": 6,
        "col": 2,
        "reqLvl": 30,
        "reqs": [
          "Cobra Strike",
          "Blades of Ice"
        ],
        "passive": false,
        "nameZh": "凤凰攻击",
        "nameTw": "鳳凰擊",
        "nameEn": "Phoenix Strike",
        "descZh": "充能技 ·  · 为终结技附带元素新星效果 · 必须使用龙系终结技 · 或普通攻击来释放充能",
        "descTw": "集氣技能 ·  · 使終結技釋放元素新星 · 必須使用龍系終結技或普通攻擊來釋放聚集的力量",
        "descEn": "Charge-up Skill ·  · adds elemental novas to finishing moves · must use a dragon finishing move or · normal attack to release charges",
        "mana": {
          "base": 4,
          "lvl": 0,
          "shift": 8,
          "min": 1
        },
        "cooldown": 0,
        "dmg": null,
        "synergies": [
          {
            "zhCN": "烈焰拳: 每等级+10%火焰伤害",
            "zhTW": "烈火拳：每等級 +10% 火焰傷害",
            "enUS": "Fists of Fire: +10% Fire Damage per Level"
          },
          {
            "zhCN": "烈焰拳: 每等级+6%平均每秒火焰伤害",
            "zhTW": "烈火拳：每等級 +6% 平均每秒火焰傷害",
            "enUS": "Fists of Fire: +6% Average Fire Damage per Second per Level"
          },
          {
            "zhCN": "雷电爪: 每等级+13%闪电伤害",
            "zhTW": "雷電爪：每等級 +13% 電擊傷害",
            "enUS": "Claws of Thunder: +13% Lightning Damage per Level"
          },
          {
            "zhCN": "寒冰刃: 每等级+10%冰霜伤害",
            "zhTW": "寒冰刃：每等級 +10% 冰寒傷害",
            "enUS": "Blades of Ice: +10% Cold Damage per Level"
          }
        ]
      }
    ]
  }
];

export function getSkillsCatalog() {
  return {
    ok: true,
    totalClasses: SKILL_CLASSES.length,
    totalSkills: SKILL_CLASSES.reduce((acc, c) => acc + c.skills.length, 0),
    classes: SKILL_CLASSES
  };
}
