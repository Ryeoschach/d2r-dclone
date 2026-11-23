// 全部 34 套绿色套装的详细部件属性、单件套装加成与多件/全套效果（D2R 3.4）

export const SET_DETAILS = {
  "tal-rasha": {
    "pieces": [
      {
        "nameZh": "塔·拉夏的赫拉迪克纹章",
        "nameEn": "Tal Rasha's Horadric Crest",
        "slotZh": "头盔（死亡面具）",
        "reqLvl": 66,
        "stats": [
          "10% 击中偷取生命",
          "10% 击中偷取法力",
          "所有抗性 +15",
          "+45 防御",
          "+60 生命",
          "+30 法力"
        ]
      },
      {
        "nameZh": "塔·拉夏的判决",
        "nameEn": "Tal Rasha's Adjudication",
        "slotZh": "项链",
        "reqLvl": 67,
        "stats": [
          "+2 法师技能等级",
          "闪电抗性 +33%",
          "+3–32 闪电伤害",
          "+50 生命",
          "+42 法力"
        ],
        "setPieceBonus": [
          "4 件：+10% 更快速施法"
        ]
      },
      {
        "nameZh": "塔·拉夏的守护",
        "nameEn": "Tal Rasha's Guardianship",
        "slotZh": "盔甲（漆甲）",
        "reqLvl": 71,
        "stats": [
          "+400 防御",
          "需求 -60%",
          "冰冷抗性 +40% / 闪电抗性 +40% / 火焰抗性 +40%",
          "魔法伤害减少 15",
          "+88% MF"
        ],
        "setPieceBonus": [
          "2 件：+10% 更快速施法"
        ]
      },
      {
        "nameZh": "塔·拉夏的警惕之眼",
        "nameEn": "Tal Rasha's Lidless Eye",
        "slotZh": "法珠（涡流水晶）",
        "reqLvl": 65,
        "stats": [
          "+20% 更快速施法",
          "+1–2 冰/火/电支配（法师限定）",
          "+10 精力",
          "+57 生命",
          "+77 法力"
        ],
        "setPieceBonus": [
          "2 件：+1 法师技能等级",
          "3 件：-15% 敌人火焰抗性",
          "4 件：-15% 敌人闪电抗性",
          "5 件：+15% 冰冷技能伤害"
        ]
      },
      {
        "nameZh": "塔·拉夏的精织细带",
        "nameEn": "Tal Rasha's Fine-Spun Cloth",
        "slotZh": "腰带（织网腰带）",
        "reqLvl": 53,
        "stats": [
          "需求 -20%",
          "37% 伤害转化为法力",
          "+30 法力",
          "+20 敏捷",
          "+10–15% MF"
        ],
        "setPieceBonus": [
          "2 件：+60 防御",
          "3 件：+10% 更快速施法"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "生命恢复 +10"
        ]
      },
      {
        "count": 3,
        "stats": [
          "+65% 额外几率获得魔法物品（MF）"
        ]
      },
      {
        "count": 4,
        "stats": [
          "+25% 更快速打击回复（FHR）"
        ]
      }
    ],
    "fullBonuses": [
      "+3 法师技能等级",
      "生命恢复 +10",
      "+65% MF",
      "+25% FHR",
      "+150 生命",
      "所有抗性 +50",
      "+50 对远程攻击防御 / +150 防御",
      "角色全身发光特效"
    ]
  },
  "immortal-king": {
    "pieces": [
      {
        "nameZh": "不朽之王的意志",
        "nameEn": "Immortal King's Will",
        "slotZh": "头盔（复仇之魂盔）",
        "reqLvl": 47,
        "stats": [
          "+2 战嚎技能（野蛮人限定）",
          "+4 照亮范围",
          "+125 防御",
          "37% 额外金币",
          "25–40% MF",
          "2 孔"
        ]
      },
      {
        "nameZh": "不朽之王的灵魂牢笼",
        "nameEn": "Immortal King's Soul Cage",
        "slotZh": "盔甲（神圣铠甲）",
        "reqLvl": 76,
        "stats": [
          "被击中 5% 施放 5 级强化",
          "+2 战斗技能（野蛮人限定）",
          "+400 防御",
          "毒素抗性 +50%"
        ],
        "setPieceBonus": [
          "2 件：+25% FHR",
          "3 件：冰抗 +40%",
          "4 件：火抗 +40%",
          "5 件：电抗 +40%",
          "6 件：+50% 强化防御"
        ]
      },
      {
        "nameZh": "不朽之王的碎魂者",
        "nameEn": "Immortal King's Stone Crusher",
        "slotZh": "武器（食人魔之锤）",
        "reqLvl": 76,
        "stats": [
          "不可摧毁",
          "+200% 强化伤害",
          "+200% 对恶魔/不死伤害",
          "+40% IAS",
          "35–40% 压碎性打击",
          "2 孔"
        ],
        "setPieceBonus": [
          "2 件：+211–397 火焰伤害",
          "3 件：+7–477 闪电伤害",
          "4 件：+127–364 冰冷伤害",
          "5 件：+204 毒素伤害",
          "6 件：+250–361 魔法伤害"
        ]
      },
      {
        "nameZh": "不朽之王的熔炉",
        "nameEn": "Immortal King's Forge",
        "slotZh": "手套（巨战手套）",
        "reqLvl": 30,
        "stats": [
          "被击中 12% 施放 4 级充能弹",
          "+20 力量",
          "+20 敏捷",
          "+65 防御"
        ],
        "setPieceBonus": [
          "2 件：+25% IAS",
          "3 件：+120 防御",
          "4 件：10% 生命偷取",
          "5 件：10% 法力偷取",
          "6 件：冰冻目标 +2"
        ]
      },
      {
        "nameZh": "不朽之王的细节",
        "nameEn": "Immortal King's Detail",
        "slotZh": "腰带（巨战腰带）",
        "reqLvl": 29,
        "stats": [
          "+25 力量",
          "闪电抗性 +31%",
          "火焰抗性 +28%",
          "+36 防御"
        ],
        "setPieceBonus": [
          "2 件：+105 防御",
          "3 件：+25% FHR",
          "4 件：+100% 强化防御",
          "5 件：物理伤害减少 20%",
          "6 件：+2 战斗支配"
        ]
      },
      {
        "nameZh": "不朽之王的柱",
        "nameEn": "Immortal King's Pillar",
        "slotZh": "鞋子（巨战之靴）",
        "reqLvl": 31,
        "stats": [
          "+40% 更快速跑步/步行",
          "+110 命中率",
          "+44 生命",
          "+75 防御"
        ],
        "setPieceBonus": [
          "2 件：+25% MF",
          "3 件：+2 战斗技能",
          "4 件：+160 防御",
          "5 件：半数冰冻时间"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+50 命中率"
        ]
      },
      {
        "count": 3,
        "stats": [
          "+75 命中率（累计 +125）"
        ]
      },
      {
        "count": 4,
        "stats": [
          "+125 命中率（累计 +250）"
        ]
      },
      {
        "count": 5,
        "stats": [
          "+200 命中率（累计 +450）"
        ]
      }
    ],
    "fullBonuses": [
      "+3 野蛮人技能等级",
      "+450 命中率",
      "+150 生命",
      "所有抗性 +50",
      "魔法伤害减少 10",
      "角色全身发光特效"
    ]
  },
  "trang-oul": {
    "pieces": [
      {
        "nameZh": "塔格奥的伪装",
        "nameEn": "Trang-Oul's Guise",
        "slotZh": "头盔（骸骨面罩）",
        "reqLvl": 65,
        "stats": [
          "+25% FHR",
          "生命恢复 +5",
          "+150 法力",
          "+80–100 防御",
          "攻击者受到伤害 20"
        ]
      },
      {
        "nameZh": "塔格奥的鳞甲",
        "nameEn": "Trang-Oul's Scales",
        "slotZh": "盔甲（混沌战甲）",
        "reqLvl": 49,
        "stats": [
          "+2 召唤技能（死灵限定）",
          "+40% 更快速跑步/步行",
          "+150% 强化防御",
          "毒素抗性 +40%",
          "需求 -40%"
        ],
        "setPieceBonus": [
          "3 件：闪电抗性 +50%",
          "5 件：物理伤害减少 25%"
        ]
      },
      {
        "nameZh": "塔格奥的魔翼",
        "nameEn": "Trang-Oul's Wing",
        "slotZh": "副手（领主之首）",
        "reqLvl": 54,
        "stats": [
          "+2 毒素与白骨技能",
          "+30% 提高格挡几率",
          "+25 力量 / +15 敏捷",
          "火焰抗性 +38–45%",
          "毒素抗性 +40%"
        ],
        "setPieceBonus": [
          "3 件：-25% 敌人毒素抗性",
          "4 件：生命恢复 +15"
        ]
      },
      {
        "nameZh": "塔格奥的爪",
        "nameEn": "Trang-Oul's Claws",
        "slotZh": "手套（重型手镯）",
        "reqLvl": 45,
        "stats": [
          "+2 诅咒技能",
          "+20% 更快速施法",
          "+25% 毒素技能伤害",
          "冰冷抗性 +30%",
          "+30 防御"
        ],
        "setPieceBonus": [
          "套装加成：+25% 毒素技能伤害"
        ]
      },
      {
        "nameZh": "塔格奥的束带",
        "nameEn": "Trang-Oul's Girth",
        "slotZh": "腰带（洞穴巨魔腰带）",
        "reqLvl": 62,
        "stats": [
          "无法冰冻",
          "生命恢复 +5",
          "+66 生命",
          "+25–50 法力",
          "需求 -40%"
        ],
        "setPieceBonus": [
          "3 件：冰冷抗性 +40%"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+18 火球（全职业可用）",
          "法力恢复速度提高 15%"
        ]
      },
      {
        "count": 3,
        "stats": [
          "+13 火墙（全职业可用）",
          "法力恢复速度提高 30%"
        ]
      },
      {
        "count": 4,
        "stats": [
          "+10 陨石（全职业可用）",
          "法力恢复速度提高 45%"
        ]
      }
    ],
    "fullBonuses": [
      "+3 死灵法师技能等级",
      "变身为吸血鬼",
      "20% 击中偷取生命",
      "+3 火焰支配",
      "+200 法力",
      "所有抗性 +50",
      "法力恢复速度提高 60%"
    ]
  },
  "griswold": {
    "pieces": [
      {
        "nameZh": "格里斯瓦尔德的勇气",
        "nameEn": "Griswold's Valor",
        "slotZh": "头盔（头冠）",
        "reqLvl": 69,
        "stats": [
          "+50–75% 强化防御",
          "所有抗性 +5",
          "20–30% MF",
          "冰冷吸收 0.25/级",
          "需求 -40%",
          "2 孔"
        ],
        "setPieceBonus": [
          "2 件：+2 攻击灵气（圣骑士限定）"
        ]
      },
      {
        "nameZh": "格里斯瓦尔德之心",
        "nameEn": "Griswold's Heart",
        "slotZh": "盔甲（华丽战甲）",
        "reqLvl": 45,
        "stats": [
          "+2 防御灵气",
          "+500 防御",
          "+20 力量",
          "需求 -40%",
          "3 孔"
        ]
      },
      {
        "nameZh": "格里斯瓦尔德的救赎",
        "nameEn": "Griswold's Redemption",
        "slotZh": "武器（神使之杖）",
        "reqLvl": 66,
        "stats": [
          "+40% IAS",
          "+200–240% ED",
          "+200% 对不死伤",
          "需求 -20%",
          "3–4 孔"
        ],
        "setPieceBonus": [
          "2 件：+2 战斗技能",
          "3 件：+10–20 伤害",
          "4 件：+10–20 伤害"
        ]
      },
      {
        "nameZh": "格里斯瓦尔德的荣耀",
        "nameEn": "Griswold's Honor",
        "slotZh": "盾牌（旋风盾）",
        "reqLvl": 68,
        "stats": [
          "+65% 更快速格挡率",
          "+20% 提高格挡几率",
          "+108 防御",
          "所有抗性 +45",
          "3 孔"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+20 力量"
        ]
      },
      {
        "count": 3,
        "stats": [
          "+30 敏捷"
        ]
      }
    ],
    "fullBonuses": [
      "+3 圣骑士技能等级",
      "+30% 更快速打击回复",
      "+200 命中率",
      "+150 生命",
      "所有抗性 +50",
      "角色发光特效"
    ]
  },
  "aldur": {
    "pieces": [
      {
        "nameZh": "艾尔多的冷酷凝视",
        "nameEn": "Aldur's Stony Gaze",
        "slotZh": "头盔（猎手伪装）",
        "reqLvl": 36,
        "stats": [
          "+25% FHR",
          "法力恢复 +17%",
          "冰冷抗性 +40–50%",
          "+90 防御",
          "2 孔"
        ],
        "setPieceBonus": [
          "2–4 件：每件 +15 精力"
        ]
      },
      {
        "nameZh": "艾尔多的欺瞒",
        "nameEn": "Aldur's Deception",
        "slotZh": "盔甲（阴影铠甲）",
        "reqLvl": 76,
        "stats": [
          "+1 元素 / +1 变形技能",
          "+20 力量",
          "+15 敏捷",
          "+300 防御",
          "闪电抗性 +40–50%",
          "需求 -50%"
        ],
        "setPieceBonus": [
          "2–4 件：每件 +15 体力"
        ]
      },
      {
        "nameZh": "艾尔多的韵律",
        "nameEn": "Aldur's Rhythm",
        "slotZh": "武器（锯齿流星锤）",
        "reqLvl": 42,
        "stats": [
          "+30% IAS",
          "10% LL / 5% ML",
          "+40–62 伤害",
          "+50–75 闪电伤害",
          "+200% 对恶魔伤",
          "2–3 孔"
        ],
        "setPieceBonus": [
          "2–4 件：每件 +15 力量"
        ]
      },
      {
        "nameZh": "艾尔多的成长",
        "nameEn": "Aldur's Advance",
        "slotZh": "鞋子（战场之靴）",
        "reqLvl": 45,
        "stats": [
          "+40% 更快速跑步/步行",
          "+50 生命",
          "+180 耐力",
          "火焰抗性 +40–50%",
          "10% 伤害转化为法力",
          "不可摧毁"
        ],
        "setPieceBonus": [
          "2–4 件：每件 +15 敏捷"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+150% 命中率加成"
        ]
      },
      {
        "count": 3,
        "stats": [
          "+50% MF"
        ]
      }
    ],
    "fullBonuses": [
      "+3 德鲁伊技能等级",
      "+350% 强化伤害",
      "10% 击中偷取法力",
      "+150 法力",
      "所有抗性 +50",
      "+150 防御",
      "角色发光特效"
    ]
  },
  "mavina": {
    "pieces": [
      {
        "nameZh": "马维娜的真实之眼",
        "nameEn": "M'avina's True Sight",
        "slotZh": "头环（权冠）",
        "reqLvl": 64,
        "stats": [
          "+30% IAS",
          "+25 法力",
          "生命恢复 +10",
          "+150 防御"
        ],
        "setPieceBonus": [
          "2 件：+1 所有技能",
          "3 件：+50% 命中率加成",
          "4 件：所有抗性 +25"
        ]
      },
      {
        "nameZh": "马维娜的拥抱",
        "nameEn": "M'avina's Embrace",
        "slotZh": "盔甲（海妖壳甲）",
        "reqLvl": 70,
        "stats": [
          "+2 被动与魔法技能",
          "+350 防御",
          "+(4*等级) 防御",
          "魔法伤害减少 5–12",
          "需求 -30%"
        ],
        "setPieceBonus": [
          "3 件：+30% FHR"
        ]
      },
      {
        "nameZh": "马维娜的施展",
        "nameEn": "M'avina's Caster",
        "slotZh": "武器（大院长之弓）",
        "reqLvl": 70,
        "stats": [
          "+40% IAS",
          "+188% 强化伤害",
          "+50 命中率",
          "射出魔法箭"
        ],
        "setPieceBonus": [
          "2 件：+114–377 魔法伤害",
          "3 件：+10% 几率施放 15 级新星",
          "4 件：+2 弓和十字弓技能"
        ]
      },
      {
        "nameZh": "马维娜的冰握",
        "nameEn": "M'avina's Icy Clutch",
        "slotZh": "手套（战场手套）",
        "reqLvl": 32,
        "stats": [
          "+10 力量 / +15 敏捷",
          "+6–18 冰冷伤害",
          "半数冰冻时间",
          "+45–50 防御",
          "+56% EG"
        ],
        "setPieceBonus": [
          "4 件：+131–252 冰冷伤害",
          "5 件：+20% 冰冷技能伤害"
        ]
      },
      {
        "nameZh": "马维娜的教义",
        "nameEn": "M'avina's Tenet",
        "slotZh": "腰带（鲨鱼皮腰带）",
        "reqLvl": 45,
        "stats": [
          "+20% 更快速跑步/步行",
          "5% ML",
          "+50 防御",
          "+5 照亮范围"
        ],
        "setPieceBonus": [
          "4 件：所有抗性 +25"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+20 力量"
        ]
      },
      {
        "count": 3,
        "stats": [
          "+30 敏捷"
        ]
      }
    ],
    "fullBonuses": [
      "+3 亚马逊技能等级",
      "+100 命中率",
      "+100 防御",
      "所有抗性 +50",
      "+100% MF",
      "角色发光特效"
    ]
  },
  "natalya": {
    "pieces": [
      {
        "nameZh": "娜塔亚的图腾",
        "nameEn": "Natalya's Totem",
        "slotZh": "头盔（残酷头盔）",
        "reqLvl": 59,
        "stats": [
          "+10–20 力量",
          "+20–30 敏捷",
          "所有抗性 +10–20",
          "+135–175 防御",
          "魔法伤害减少 3"
        ]
      },
      {
        "nameZh": "娜塔亚的阴影",
        "nameEn": "Natalya's Shadow",
        "slotZh": "盔甲（甲壳铠甲）",
        "reqLvl": 73,
        "stats": [
          "+2 影子训练技能",
          "+1/级 生命",
          "毒素抗性 +25%",
          "毒素持续时间缩短 75%",
          "+150–225 防御",
          "1–3 孔"
        ]
      },
      {
        "nameZh": "娜塔亚的印记",
        "nameEn": "Natalya's Mark",
        "slotZh": "武器（近身剪）",
        "reqLvl": 79,
        "stats": [
          "+40% IAS",
          "+200% ED",
          "无视目标防御",
          "+200% 对恶魔/不死伤害",
          "+12–17 火焰伤害",
          "+50 冰冷伤害"
        ]
      },
      {
        "nameZh": "娜塔亚的灵魂",
        "nameEn": "Natalya's Soul",
        "slotZh": "鞋子（织网之靴）",
        "reqLvl": 25,
        "stats": [
          "+40% FRW",
          "冰冷抗性 +15–25%",
          "闪电抗性 +15–25%",
          "+75–125 防御"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "魔法伤害减少 15"
        ]
      },
      {
        "count": 3,
        "stats": [
          "+200 防御"
        ]
      }
    ],
    "fullBonuses": [
      "+3 刺客技能等级",
      "物理伤害减少 30%",
      "14% 击中偷取生命 / 法力",
      "所有抗性 +50",
      "+350 防御",
      "半透明暗影特效"
    ]
  },
  "bul-kathos": {
    "pieces": [
      {
        "nameZh": "布尔凯索的神圣代价",
        "nameEn": "Bul-Kathos' Sacred Charge",
        "slotZh": "武器（巨神之刃）",
        "reqLvl": 63,
        "stats": [
          "+20% IAS",
          "+200% ED",
          "35% 压碎性打击",
          "所有抗性 +20",
          "击退"
        ]
      },
      {
        "nameZh": "布尔凯索的部族守护",
        "nameEn": "Bul-Kathos' Tribal Guardian",
        "slotZh": "武器（秘仪之剑）",
        "reqLvl": 66,
        "stats": [
          "+20% IAS",
          "+200% ED",
          "+50 毒素伤害",
          "火焰抗性 +50%",
          "+20 力量"
        ]
      }
    ],
    "partialBonuses": [],
    "fullBonuses": [
      "+200% 对恶魔伤害",
      "+200% 对不死生物伤害",
      "+20 火焰伤害",
      "+25 防御"
    ]
  },
  "horazons-splendor": {
    "pieces": [
      {
        "nameZh": "赫拉森的面容",
        "nameEn": "Horazon's Countenance",
        "slotZh": "头盔（恶魔头盖骨面具）",
        "reqLvl": 62,
        "stats": [
          "+1 术士技能等级",
          "+(1% * 等级) 加成命中率",
          "+10–20 力量",
          "魔法伤害减少 7–10"
        ],
        "setPieceBonus": [
          "2 件：生命上限提高 5%",
          "4 件：+15 力量"
        ]
      },
      {
        "nameZh": "赫拉森的统治",
        "nameEn": "Horazon's Dominion",
        "slotZh": "盔甲（铁锈战甲）",
        "reqLvl": 55,
        "stats": [
          "+2 恶魔技能（术士限定）",
          "+75–100% 强化防御",
          "+75–100 法力",
          "冰/电/火抗性 +15–25%"
        ],
        "setPieceBonus": [
          "2 件：毒素抗性 +25%",
          "4 件：+15 体力",
          "5 件：物理伤害减少 15%"
        ]
      },
      {
        "nameZh": "赫拉森的掌控",
        "nameEn": "Horazon's Hold",
        "slotZh": "手套（魔皮手套）",
        "reqLvl": 48,
        "stats": [
          "10% 几率造成压碎性打击",
          "+95–150 命中率",
          "+10–15 敏捷",
          "+140–270 火焰伤害",
          "+30–40 生命"
        ],
        "setPieceBonus": [
          "2 件：+30% 提高攻击速度",
          "3 件：7% 击中偷取法力",
          "4 件：7% 击中偷取生命"
        ]
      },
      {
        "nameZh": "赫拉森的传承",
        "nameEn": "Horazon's Legacy",
        "slotZh": "鞋子（镜化靴）",
        "reqLvl": 67,
        "stats": [
          "+30% 更快速跑步/步行",
          "+10–15 力量 / +10–15 敏捷",
          "魔法抗性 +20–30%",
          "无法冰冻",
          "需求 -30%"
        ],
        "setPieceBonus": [
          "2 件：+10% 更快速跑步/步行 (FRW)"
        ]
      },
      {
        "nameZh": "赫拉森的秘辛",
        "nameEn": "Horazon's Secrets",
        "slotZh": "副手（神秘魔典）",
        "reqLvl": 57,
        "stats": [
          "+2 秘法技能（术士限定）",
          "+30% 更快速打击回复",
          "+20% 提高格挡几率",
          "+20–30 体力 / +30–50 生命"
        ],
        "setPieceBonus": [
          "2 件：毒素时间缩短 75%",
          "3 件：-25% 敌人火焰抗性",
          "4 件：+15 精力"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+20 敏捷"
        ]
      },
      {
        "count": 3,
        "stats": [
          "+30 精力"
        ]
      },
      {
        "count": 4,
        "stats": [
          "+300 防御"
        ]
      }
    ],
    "fullBonuses": [
      "+3 术士技能等级",
      "+350% 强化伤害",
      "+30 火焰强化（全职业可用）",
      "所有抗性 +50",
      "+100% MF"
    ]
  },
  "banes-garments": {
    "pieces": [
      {
        "nameZh": "贝恩的誓约之刃",
        "nameEn": "Bane's Oathmaker",
        "slotZh": "匕首（波形刀）",
        "reqLvl": 8,
        "stats": [
          "+20% 更快速跑步/步行",
          "+(1 * 等级) 最大伤害"
        ],
        "setPieceBonus": [
          "2 件：+3 每次消灭恢复法力"
        ]
      },
      {
        "nameZh": "贝恩的鬼灵皮",
        "nameEn": "Bane's Wraithskin",
        "slotZh": "盔甲（硬皮甲）",
        "reqLvl": 8,
        "stats": [
          "+50 防御",
          "魔法抗性 +30%"
        ],
        "setPieceBonus": [
          "2 件：+25% 更快速打击回复",
          "3 件：+(8 * 等级) 命中率"
        ]
      },
      {
        "nameZh": "贝恩的权威",
        "nameEn": "Bane's Authority",
        "slotZh": "腰带（轻扣带）",
        "reqLvl": 8,
        "stats": [
          "+15 精力"
        ],
        "setPieceBonus": [
          "2 件：+10% 更快速施法",
          "2 件：+20 生命"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+3 每次消灭恢复法力"
        ]
      },
      {
        "count": 3,
        "stats": [
          "+30% 致命一击"
        ]
      }
    ],
    "fullBonuses": [
      "+1 所有技能",
      "+25% 更快速施法",
      "+80% 强化伤害",
      "+15 敏捷",
      "+40% MF"
    ]
  },
  "orphans-call": {
    "pieces": [
      {
        "nameZh": "吉永之脸",
        "nameEn": "Guillaume's Face",
        "slotZh": "头盔（翼盔）",
        "reqLvl": 34,
        "stats": [
          "+30% FHR",
          "35% 压碎性打击 (CB)",
          "15% 双倍打击 (DS)",
          "+15 力量",
          "+120% 强化防御"
        ]
      },
      {
        "nameZh": "惠斯坦的警戒",
        "nameEn": "Whistan's Guard",
        "slotZh": "盾牌（圆盾）",
        "reqLvl": 29,
        "stats": [
          "+40% 更快速格挡率",
          "+55% 提高格挡几率",
          "半数冰冻时间",
          "+175% 强化防御"
        ]
      },
      {
        "nameZh": "马格纳斯之皮",
        "nameEn": "Magnus' Skin",
        "slotZh": "手套（鲨鱼皮手套）",
        "reqLvl": 37,
        "stats": [
          "+20% IAS",
          "+100 命中率",
          "火焰抗性 +15%",
          "+50% 强化防御"
        ]
      },
      {
        "nameZh": "威廉的自尊",
        "nameEn": "Wilhelm's Pride",
        "slotZh": "腰带（战场腰带）",
        "reqLvl": 42,
        "stats": [
          "5% 击中偷取生命",
          "5% 击中偷取法力",
          "冰冷抗性 +10%",
          "+75% 强化防御"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+35 生命"
        ]
      },
      {
        "count": 3,
        "stats": [
          "攻击者受到伤害 5"
        ]
      }
    ],
    "fullBonuses": [
      "+85 生命",
      "所有抗性 +15",
      "+100 防御",
      "+20 力量",
      "+10 敏捷",
      "+80% MF"
    ]
  },
  "the-disciple": {
    "pieces": [
      {
        "nameZh": "述说之珠",
        "nameEn": "Telling of Beads",
        "slotZh": "项链",
        "reqLvl": 30,
        "stats": [
          "+1 所有技能",
          "冰冷抗性 +18%",
          "毒素抗性 +35–50%",
          "攻击者受到伤害 8–10"
        ]
      },
      {
        "nameZh": "安置",
        "nameEn": "Laying of Hands",
        "slotZh": "手套（荆棘连指手套）",
        "reqLvl": 63,
        "stats": [
          "+20% IAS",
          "+350% 对恶魔伤害",
          "火焰抗性 +50%",
          "+25 防御"
        ]
      },
      {
        "nameZh": "黑暗信徒",
        "nameEn": "Dark Adherent",
        "slotZh": "盔甲（幽暗寿衣）",
        "reqLvl": 49,
        "stats": [
          "被击中 25% 施放 3 级新星",
          "火焰抗性 +24%",
          "+305–415 防御"
        ]
      },
      {
        "nameZh": "信条",
        "nameEn": "Credendum",
        "slotZh": "腰带（秘银腰带）",
        "reqLvl": 65,
        "stats": [
          "+10 力量",
          "+10 敏捷",
          "所有抗性 +15",
          "+50 防御"
        ]
      },
      {
        "nameZh": "炼狱之步",
        "nameEn": "Rite of Passage",
        "slotZh": "鞋子（魔皮靴）",
        "reqLvl": 29,
        "stats": [
          "+30% FRW",
          "半数冰冻时间",
          "+15–25 耐力",
          "+25 防御"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+150 防御"
        ]
      },
      {
        "count": 3,
        "stats": [
          "+22 毒素伤害"
        ]
      },
      {
        "count": 4,
        "stats": [
          "+10 力量"
        ]
      }
    ],
    "fullBonuses": [
      "+2 所有技能",
      "+100 法力",
      "+150 防御",
      "所有抗性 +50",
      "+10 力量",
      "+22 毒素伤害"
    ]
  },
  "heavens-brethren": {
    "pieces": [
      {
        "nameZh": "昂达尔之灵",
        "nameEn": "Ondal's Almighty",
        "slotZh": "头盔（螺旋头盔）",
        "reqLvl": 69,
        "stats": [
          "+24% FHR",
          "+10 力量",
          "+15 敏捷",
          "需求 -40%"
        ]
      },
      {
        "nameZh": "黑摩苏的坚毅",
        "nameEn": "Haemosu's Adamant",
        "slotZh": "盔甲（护胸甲）",
        "reqLvl": 44,
        "stats": [
          "+500 防御",
          "+75 生命",
          "需求 -20%"
        ]
      },
      {
        "nameZh": "丹弓的教导",
        "nameEn": "Dangoon's Teaching",
        "slotZh": "武器（强化钉头锤）",
        "reqLvl": 68,
        "stats": [
          "+40% IAS",
          "+(1.5*等级) Max",
          "+20–130 火焰伤害"
        ]
      },
      {
        "nameZh": "泰邦克之荣耀",
        "nameEn": "Taebaek's Glory",
        "slotZh": "盾牌（庇护盾）",
        "reqLvl": 81,
        "stats": [
          "+30% FBR",
          "+25% 格挡",
          "闪电抗性 +30%",
          "+100 法力",
          "不可摧毁"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "生命恢复 +20"
        ]
      },
      {
        "count": 3,
        "stats": [
          "无法冰冻"
        ]
      }
    ],
    "fullBonuses": [
      "+2 所有技能",
      "所有抗性 +50",
      "无法冰冻",
      "生命恢复 +20",
      "+5 照亮范围"
    ]
  },
  "hwanin": {
    "pieces": [
      {
        "nameZh": "华宁的光辉",
        "nameEn": "Hwanin's Splendor",
        "slotZh": "头盔（皇冠）",
        "reqLvl": 45,
        "stats": [
          "+100% 强化防御",
          "生命恢复 +20",
          "魔法伤害减少 10"
        ]
      },
      {
        "nameZh": "华宁的庇护",
        "nameEn": "Hwanin's Refuge",
        "slotZh": "盔甲（斩铁甲）",
        "reqLvl": 30,
        "stats": [
          "被击中 10% 施放 3 级静电力场",
          "+200 防御",
          "+100 生命",
          "毒素抗性 +27%"
        ]
      },
      {
        "nameZh": "华宁的正义",
        "nameEn": "Hwanin's Justice",
        "slotZh": "武器（长勾叉）",
        "reqLvl": 28,
        "stats": [
          "+40% IAS",
          "+200% 强化伤害",
          "不可摧毁",
          "+330 命中率"
        ]
      },
      {
        "nameZh": "华宁的祝福",
        "nameEn": "Hwanin's Blessing",
        "slotZh": "腰带（织网腰带）",
        "reqLvl": 35,
        "stats": [
          "12% 伤害转化为法力",
          "防止怪物治疗",
          "+3–33 闪电伤害"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+100 防御"
        ]
      },
      {
        "count": 3,
        "stats": [
          "+200 防御（累计 +300）"
        ]
      }
    ],
    "fullBonuses": [
      "+2 所有技能",
      "+30% 更快速跑步/步行",
      "20% 击中偷取生命",
      "所有抗性 +30",
      "+300 防御"
    ]
  },
  "naj": {
    "pieces": [
      {
        "nameZh": "娜吉的头饰",
        "nameEn": "Naj's Circlet",
        "slotZh": "头环",
        "reqLvl": 28,
        "stats": [
          "被击中 12% 施放 5 级连锁闪电",
          "+75 防御",
          "+15 力量",
          "+25–35 火焰伤害"
        ]
      },
      {
        "nameZh": "娜吉的轻铠",
        "nameEn": "Naj's Light Plate",
        "slotZh": "盔甲（地狱锻甲）",
        "reqLvl": 71,
        "stats": [
          "+1 所有技能",
          "所有抗性 +25",
          "+65 生命",
          "45% 伤害转化为法力",
          "需求 -60%"
        ]
      },
      {
        "nameZh": "娜吉的解谜者",
        "nameEn": "Naj's Puzzler",
        "slotZh": "双手法杖（长老之杖）",
        "reqLvl": 78,
        "stats": [
          "+1 所有技能",
          "+30% 更快速施法",
          "+150% ED",
          "+70 法力",
          "+35 精力",
          "11 级传送（69 次充能）"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+175 防御"
        ]
      }
    ],
    "fullBonuses": [
      "+1 所有技能",
      "生命恢复 +10",
      "+100 法力",
      "所有抗性 +50",
      "+20 力量",
      "+15 敏捷"
    ]
  },
  "sazabi": {
    "pieces": [
      {
        "nameZh": "沙撒壁的精神之鞘",
        "nameEn": "Sazabi's Mental Sheath",
        "slotZh": "头盔（轻钢盔）",
        "reqLvl": 43,
        "stats": [
          "+1 所有技能",
          "闪电抗性 +15–20%",
          "火焰抗性 +15–20%",
          "+100 防御"
        ]
      },
      {
        "nameZh": "沙撒壁的鬼魂释放者",
        "nameEn": "Sazabi's Ghost Liberator",
        "slotZh": "盔甲（炎魔皮板甲）",
        "reqLvl": 67,
        "stats": [
          "+30% FHR",
          "+400 防御",
          "+300 对恶魔命中",
          "+25 力量",
          "+50–75 生命"
        ]
      },
      {
        "nameZh": "沙撒壁的钴蓝救赎者",
        "nameEn": "Sazabi's Cobalt Redeemer",
        "slotZh": "武器（秘仪之剑）",
        "reqLvl": 73,
        "stats": [
          "+40% IAS",
          "+150% ED",
          "+318% 对恶魔伤",
          "+15 敏捷",
          "不可摧毁"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+40% 更快速跑步/步行"
        ]
      }
    ],
    "fullBonuses": [
      "+40% FRW",
      "15% 击中偷取生命",
      "生命上限提高 27%",
      "所有抗性 +30"
    ]
  },
  "sanders": {
    "pieces": [
      {
        "nameZh": "山德的模范",
        "nameEn": "Sander's Paragon",
        "slotZh": "头盔（帽子）",
        "reqLvl": 25,
        "stats": [
          "+1/级 防御",
          "+35% MF",
          "攻击者受到伤害 8"
        ]
      },
      {
        "nameZh": "山德的迷信",
        "nameEn": "Sander's Superstition",
        "slotZh": "骨杖",
        "reqLvl": 25,
        "stats": [
          "+20% FCR",
          "+75% ED",
          "8% ML",
          "+25 法力"
        ]
      },
      {
        "nameZh": "山德的禁忌",
        "nameEn": "Sander's Taboo",
        "slotZh": "手套（重手套）",
        "reqLvl": 28,
        "stats": [
          "+20% IAS",
          "+40 生命",
          "+9–11 毒素伤害",
          "+20–25 防御"
        ]
      },
      {
        "nameZh": "山德的碎步",
        "nameEn": "Sander's Riprap",
        "slotZh": "鞋子（重靴）",
        "reqLvl": 20,
        "stats": [
          "+40% 更快速跑步/步行",
          "+100 命中率",
          "+5 力量 / +10 敏捷"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+50 防御"
        ]
      },
      {
        "count": 3,
        "stats": [
          "+75 命中率"
        ]
      }
    ],
    "fullBonuses": [
      "+1 所有技能",
      "+50 生命",
      "4% 击中偷取法力",
      "+50% MF",
      "+50 防御",
      "+75 命中率"
    ]
  },
  "cow-king": {
    "pieces": [
      {
        "nameZh": "牛魔王的牛角",
        "nameEn": "Cow King's Horns",
        "slotZh": "头盔（战帽）",
        "reqLvl": 25,
        "stats": [
          "半数冰冻时间",
          "35% 伤害转化为法力",
          "+75 防御"
        ]
      },
      {
        "nameZh": "牛魔王的皮甲",
        "nameEn": "Cow King's Hide",
        "slotZh": "盔甲（镶嵌皮甲）",
        "reqLvl": 18,
        "stats": [
          "被击中 18% 施放 5 级连锁闪电",
          "所有抗性 +18",
          "+30 生命"
        ]
      },
      {
        "nameZh": "牛魔王的蹄铁",
        "nameEn": "Cow King's Hooves",
        "slotZh": "鞋子（重靴）",
        "reqLvl": 13,
        "stats": [
          "+30% FRW",
          "+25% MF",
          "+20 敏捷",
          "+25–35 火焰伤害"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "毒素抗性 +30%"
        ]
      }
    ],
    "fullBonuses": [
      "被击中 25% 施放 5 级静态力场",
      "+30% IAS",
      "+100% 额外金币",
      "+100% MF",
      "+20 力量"
    ]
  },
  "sigon": {
    "pieces": [
      {
        "nameZh": "西刚的面甲",
        "nameEn": "Sigon's Visor",
        "slotZh": "头盔（巨盔）",
        "reqLvl": 6,
        "stats": [
          "+25 防御",
          "+30 法力"
        ],
        "setPieceBonus": [
          "2 件：+(8*等级) 命中率"
        ]
      },
      {
        "nameZh": "西刚的护身甲",
        "nameEn": "Sigon's Shelter",
        "slotZh": "盔甲（哥特战甲）",
        "reqLvl": 6,
        "stats": [
          "+25% 强化防御",
          "闪电抗性 +30%"
        ],
        "setPieceBonus": [
          "2 件：攻击者受到伤害 20"
        ]
      },
      {
        "nameZh": "西刚的守护",
        "nameEn": "Sigon's Guard",
        "slotZh": "盾牌（塔盾）",
        "reqLvl": 6,
        "stats": [
          "+1 所有技能",
          "+20% 提高格挡几率"
        ]
      },
      {
        "nameZh": "西刚的手甲",
        "nameEn": "Sigon's Gage",
        "slotZh": "手套（护手）",
        "reqLvl": 6,
        "stats": [
          "+10 力量",
          "+20 命中率"
        ],
        "setPieceBonus": [
          "2 件：+30% 提高攻击速度"
        ]
      },
      {
        "nameZh": "西刚的裹腰",
        "nameEn": "Sigon's Wrap",
        "slotZh": "腰带（重扣带）",
        "reqLvl": 6,
        "stats": [
          "火焰抗性 +20%",
          "+20 生命"
        ],
        "setPieceBonus": [
          "2 件：+(2*等级) 防御"
        ]
      },
      {
        "nameZh": "西刚的木屐",
        "nameEn": "Sigon's Sabot",
        "slotZh": "鞋子（护胫）",
        "reqLvl": 6,
        "stats": [
          "+20% FRW",
          "冰冷抗性 +40%"
        ],
        "setPieceBonus": [
          "2 件：+50 命中率",
          "3 件：+50% MF"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "10% 击中偷取生命"
        ]
      },
      {
        "count": 3,
        "stats": [
          "+100 防御"
        ]
      }
    ],
    "fullBonuses": [
      "10% 击中偷取生命",
      "+100 防御",
      "+20 法力",
      "火焰抗性 +12%",
      "+24 最大伤害",
      "伤害减少 7"
    ]
  },
  "angelic": {
    "pieces": [
      {
        "nameZh": "天使的镰刀",
        "nameEn": "Angelic Sickle",
        "slotZh": "军刀",
        "reqLvl": 12,
        "stats": [
          "+75% 对不死伤害",
          "+250 对不死命中"
        ],
        "setPieceBonus": [
          "2 件：+75% ED",
          "3 件：+30% IAS"
        ]
      },
      {
        "nameZh": "天使的斗篷",
        "nameEn": "Angelic Mantle",
        "slotZh": "环甲",
        "reqLvl": 12,
        "stats": [
          "伤害减少 3",
          "+40% 强化防御"
        ],
        "setPieceBonus": [
          "2 件：+150 防御",
          "3 件：火焰抗性 +50%"
        ]
      },
      {
        "nameZh": "天使之光",
        "nameEn": "Angelic Halo",
        "slotZh": "戒指",
        "reqLvl": 12,
        "stats": [
          "生命恢复 +6",
          "+20 生命"
        ],
        "setPieceBonus": [
          "2 件：+(12*等级) 命中率",
          "3 件：+50% MF"
        ]
      },
      {
        "nameZh": "天使的翅膀",
        "nameEn": "Angelic Wings",
        "slotZh": "项链",
        "reqLvl": 12,
        "stats": [
          "20% 伤害转法力",
          "+3 照亮范围"
        ],
        "setPieceBonus": [
          "2 件：+75 生命",
          "3 件：+1 所有技能"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+10 敏捷"
        ]
      },
      {
        "count": 3,
        "stats": [
          "+50 法力"
        ]
      }
    ],
    "fullBonuses": [
      "+10 敏捷",
      "+50 法力",
      "所有抗性 +25",
      "半数冰冻时间",
      "法力恢复 +8%"
    ]
  },
  "isenhart": {
    "pieces": [
      {
        "nameZh": "依森哈特的光之鸣剑",
        "nameEn": "Isenhart's Lightbrand",
        "slotZh": "阔剑",
        "reqLvl": 8,
        "stats": [
          "+20% IAS",
          "+10 最小伤",
          "3.4 强化伤害与命中"
        ],
        "setPieceBonus": [
          "2 件：+(5*等级) 命中率"
        ]
      },
      {
        "nameZh": "依森哈特的框",
        "nameEn": "Isenhart's Case",
        "slotZh": "胸甲",
        "reqLvl": 8,
        "stats": [
          "+40 防御",
          "魔法伤害减少 2"
        ],
        "setPieceBonus": [
          "2 件：+(2*等级) 防御"
        ]
      },
      {
        "nameZh": "依森哈特的号角",
        "nameEn": "Isenhart's Horns",
        "slotZh": "全盔",
        "reqLvl": 8,
        "stats": [
          "+6 敏捷",
          "伤害减少 2"
        ],
        "setPieceBonus": [
          "2 件：所有抗性 +8"
        ]
      },
      {
        "nameZh": "依森哈特的招架",
        "nameEn": "Isenhart's Parry",
        "slotZh": "哥特盾",
        "reqLvl": 8,
        "stats": [
          "+40 防御",
          "攻击者受到伤害 4"
        ],
        "setPieceBonus": [
          "2 件：所有抗性 +8"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+10 力量"
        ]
      },
      {
        "count": 3,
        "stats": [
          "+10 敏捷"
        ]
      }
    ],
    "fullBonuses": [
      "3.4 全面强化低级开荒属性 · +35% 命中加成 · 5% 击中偷取生命 · +30% 格挡 · 所有抗性 +10"
    ]
  },
  "arctic": {
    "pieces": [
      {
        "nameZh": "北极的号角",
        "nameEn": "Arctic Horn",
        "slotZh": "短战弓",
        "reqLvl": 2,
        "stats": [
          "+50% ED",
          "20% 命中加成"
        ],
        "setPieceBonus": [
          "2 件：+(8*等级) 命中",
          "3 件：+20–30 冰冷伤害"
        ]
      },
      {
        "nameZh": "北极的毛皮",
        "nameEn": "Arctic Furs",
        "slotZh": "布甲",
        "reqLvl": 2,
        "stats": [
          "+275–325% ED",
          "所有抗性 +10"
        ],
        "setPieceBonus": [
          "2 件：+(3*等级) 防御",
          "3 件：冰抗 +15%"
        ]
      },
      {
        "nameZh": "北极的绑手",
        "nameEn": "Arctic Mitts",
        "slotZh": "轻护手",
        "reqLvl": 2,
        "stats": [
          "+10% IAS",
          "+20 生命"
        ],
        "setPieceBonus": [
          "2 件：+50 攻击准确率",
          "3 件：+10 敏捷"
        ]
      },
      {
        "nameZh": "北极的束缚",
        "nameEn": "Arctic Binding",
        "slotZh": "轻扣带",
        "reqLvl": 2,
        "stats": [
          "冰冷抗性 +40%",
          "+30 防御"
        ],
        "setPieceBonus": [
          "2 件：+40% MF",
          "3 件：+10 冰冷抗性上限"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+5 力量"
        ]
      },
      {
        "count": 3,
        "stats": [
          "+50 生命"
        ]
      }
    ],
    "fullBonuses": [
      "无法冰冻",
      "+6–14 冰冷伤害",
      "+5 力量",
      "+50 生命"
    ]
  },
  "berserker": {
    "pieces": [
      {
        "nameZh": "狂战士的头饰",
        "nameEn": "Berserker's Headgear",
        "slotZh": "头盔",
        "reqLvl": 3,
        "stats": [
          "+15 防御",
          "火焰抗性 +25%"
        ],
        "setPieceBonus": [
          "2 件：+(8*等级) 命中"
        ]
      },
      {
        "nameZh": "狂战士的锁子甲",
        "nameEn": "Berserker's Hauberk",
        "slotZh": "板甲",
        "reqLvl": 3,
        "stats": [
          "+1 野蛮人技能",
          "魔法伤害减少 2"
        ],
        "setPieceBonus": [
          "2 件：+(3*等级) 防御"
        ]
      },
      {
        "nameZh": "狂战士的手斧",
        "nameEn": "Berserker's Hatchet",
        "slotZh": "双刃斧",
        "reqLvl": 3,
        "stats": [
          "30% 命中加成",
          "5% 击中偷取法力"
        ],
        "setPieceBonus": [
          "2 件：+50% ED"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+50 生命"
        ]
      }
    ],
    "fullBonuses": [
      "+50 生命",
      "毒素持续时间缩短 75%",
      "+5–9 毒素伤害",
      "+75 防御"
    ]
  },
  "cathan": {
    "pieces": [
      {
        "nameZh": "卡珊的面容",
        "nameEn": "Cathan's Visage",
        "slotZh": "面具",
        "reqLvl": 11,
        "stats": [
          "+20 法力",
          "冰冷抗性 +25%"
        ],
        "setPieceBonus": [
          "2 件：+(2*等级) 防御"
        ]
      },
      {
        "nameZh": "卡珊的网",
        "nameEn": "Cathan's Mesh",
        "slotZh": "锁子甲",
        "reqLvl": 11,
        "stats": [
          "+15 防御",
          "需求 -50%"
        ],
        "setPieceBonus": [
          "2 件：攻击者受到伤害 5",
          "3 件：火焰抗性 +30%"
        ]
      },
      {
        "nameZh": "卡珊的统治",
        "nameEn": "Cathan's Rule",
        "slotZh": "战杖",
        "reqLvl": 11,
        "stats": [
          "+1 火焰技能",
          "+10 最大火伤"
        ],
        "setPieceBonus": [
          "2 件：+50 法力",
          "3 件：所有抗性 +10"
        ]
      },
      {
        "nameZh": "卡珊的印记",
        "nameEn": "Cathan's Sigil",
        "slotZh": "项链",
        "reqLvl": 11,
        "stats": [
          "+10% FHR",
          "受击者受电伤 5"
        ],
        "setPieceBonus": [
          "2 件：+50 攻击准确率",
          "3 件：+25% 更佳机会取得魔法装备 (MF)"
        ]
      },
      {
        "nameZh": "卡珊的封印",
        "nameEn": "Cathan's Seal",
        "slotZh": "戒指",
        "reqLvl": 11,
        "stats": [
          "6% 击中偷取生命",
          "伤害减少 2"
        ],
        "setPieceBonus": [
          "2 件：+10 力量"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+15–20 火焰伤害"
        ]
      },
      {
        "count": 3,
        "stats": [
          "闪电抗性 +25%"
        ]
      }
    ],
    "fullBonuses": [
      "+10% FCR",
      "魔法伤害减少 3",
      "所有抗性 +25",
      "+60 命中率",
      "+20 法力"
    ]
  },
  "civerb": {
    "pieces": [
      {
        "nameZh": "克维伯的短棍",
        "nameEn": "Civerb's Cudgel",
        "slotZh": "巨权杖",
        "reqLvl": 9,
        "stats": [
          "+17–23 最大伤",
          "+75 命中率"
        ],
        "setPieceBonus": [
          "2 件：+(1*等级) Max"
        ]
      },
      {
        "nameZh": "克维伯的符号",
        "nameEn": "Civerb's Icon",
        "slotZh": "项链",
        "reqLvl": 9,
        "stats": [
          "生命恢复 +4",
          "法力恢复 +40%"
        ],
        "setPieceBonus": [
          "2 件：冰冷抗性 +25%",
          "3 件：+25 防御"
        ]
      },
      {
        "nameZh": "克维伯的庇护",
        "nameEn": "Civerb's Ward",
        "slotZh": "大型盾",
        "reqLvl": 9,
        "stats": [
          "+15% 格挡",
          "+15 防御"
        ],
        "setPieceBonus": [
          "套装加成：+21–22 法力",
          "套装加成：毒素抗性 +25–26%"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "火焰抗性 +15%"
        ]
      }
    ],
    "fullBonuses": [
      "+200% 对不死生物伤害",
      "+15 力量",
      "闪电抗性 +25%"
    ]
  },
  "cleglaw": {
    "pieces": [
      {
        "nameZh": "克雷德劳之牙",
        "nameEn": "Cleglaw's Tooth",
        "slotZh": "长剑",
        "reqLvl": 4,
        "stats": [
          "50% 致命一击",
          "30% 命中加成"
        ],
        "setPieceBonus": [
          "2 件：+(1.25*等级) Max"
        ]
      },
      {
        "nameZh": "克雷德劳的钳子",
        "nameEn": "Cleglaw's Pincers",
        "slotZh": "锁链手套",
        "reqLvl": 4,
        "stats": [
          "减慢目标 25%",
          "击退"
        ],
        "setPieceBonus": [
          "2 件：+(10*等级) 攻击准确率"
        ]
      },
      {
        "nameZh": "克雷德劳的爪子",
        "nameEn": "Cleglaw's Claw",
        "slotZh": "小盾",
        "reqLvl": 4,
        "stats": [
          "毒素持续时间缩短 75%",
          "+17 防御"
        ],
        "setPieceBonus": [
          "2 件：所有抗性 +15"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+50 防御"
        ]
      }
    ],
    "fullBonuses": [
      "35% 压碎性打击",
      "+20% IAS",
      "6% 击中偷取法力",
      "+100 防御"
    ]
  },
  "death": {
    "pieces": [
      {
        "nameZh": "死亡之触",
        "nameEn": "Death's Touch",
        "slotZh": "战剑",
        "reqLvl": 6,
        "stats": [
          "+25% ED",
          "4% LL"
        ],
        "setPieceBonus": [
          "2 件：+25–75 冰冷伤害"
        ]
      },
      {
        "nameZh": "死亡之手",
        "nameEn": "Death's Hand",
        "slotZh": "皮手套",
        "reqLvl": 6,
        "stats": [
          "毒素抗性 +50%",
          "毒素时间缩短 75%"
        ],
        "setPieceBonus": [
          "2 件：+30% IAS"
        ]
      },
      {
        "nameZh": "死亡之护",
        "nameEn": "Death's Guard",
        "slotZh": "饰带",
        "reqLvl": 6,
        "stats": [
          "无法冰冻",
          "+20 防御"
        ],
        "setPieceBonus": [
          "2 件：所有抗性 +15"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "8% 击中偷取生命"
        ]
      }
    ],
    "fullBonuses": [
      "8% 击中偷取生命",
      "40% 命中率加成",
      "+10 最小伤",
      "+25–75 冰伤"
    ]
  },
  "hsarus": {
    "pieces": [
      {
        "nameZh": "沙萨的铁拳",
        "nameEn": "Hsarus' Iron Fist",
        "slotZh": "小圆盾",
        "reqLvl": 3,
        "stats": [
          "+10 力量",
          "伤害减少 2"
        ],
        "setPieceBonus": [
          "2 件：+(2.5*等级) 防御"
        ]
      },
      {
        "nameZh": "沙萨的铁链",
        "nameEn": "Hsarus' Iron Stay",
        "slotZh": "腰带",
        "reqLvl": 3,
        "stats": [
          "冰冷抗性 +20%",
          "+20 生命"
        ],
        "setPieceBonus": [
          "2 件：+(2.5*等级) 防御"
        ]
      },
      {
        "nameZh": "沙萨的铁踵",
        "nameEn": "Hsarus' Iron Heel",
        "slotZh": "锁链靴",
        "reqLvl": 3,
        "stats": [
          "+20% FRW",
          "火焰抗性 +25%"
        ],
        "setPieceBonus": [
          "2 件：+(10*等级) 命中率"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "攻击者受到伤害 5"
        ]
      }
    ],
    "fullBonuses": [
      "无法冰冻",
      "+5 最大伤害",
      "闪电抗性 +25%"
    ]
  },
  "infernal": {
    "pieces": [
      {
        "nameZh": "炼狱的火炬",
        "nameEn": "Infernal Torch",
        "slotZh": "冷酷手杖",
        "reqLvl": 5,
        "stats": [
          "+1 死灵技能",
          "+8 最小伤"
        ],
        "setPieceBonus": [
          "2 件：+(10*等级) 命中"
        ]
      },
      {
        "nameZh": "炼狱的头骨",
        "nameEn": "Infernal Cranium",
        "slotZh": "帽子",
        "reqLvl": 5,
        "stats": [
          "所有抗性 +10",
          "20% 伤转法力"
        ],
        "setPieceBonus": [
          "2 件：+(2*等级) 防御"
        ]
      },
      {
        "nameZh": "炼狱的印记",
        "nameEn": "Infernal Sign",
        "slotZh": "重扣带",
        "reqLvl": 5,
        "stats": [
          "+20 生命",
          "+25 防御"
        ],
        "setPieceBonus": [
          "2 件：毒素抗性 +25%",
          "3 件：冰冻时间减半"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+10 精力"
        ]
      }
    ],
    "fullBonuses": [
      "+1 死灵法师技能",
      "+20% 毒素伤害",
      "20% 撕裂伤口",
      "+10 精力"
    ]
  },
  "iratha": {
    "pieces": [
      {
        "nameZh": "依雷撒的线圈",
        "nameEn": "Iratha's Coil",
        "slotZh": "皇冠",
        "reqLvl": 15,
        "stats": [
          "火焰抗性 +30%",
          "闪电抗性 +30%"
        ],
        "setPieceBonus": [
          "2 件：+(2*等级) 防御"
        ]
      },
      {
        "nameZh": "依雷撒的项圈",
        "nameEn": "Iratha's Collar",
        "slotZh": "项链",
        "reqLvl": 15,
        "stats": [
          "毒素抗性 +30%",
          "毒素时间缩短 75%"
        ],
        "setPieceBonus": [
          "2 件：所有抗性 +15"
        ]
      },
      {
        "nameZh": "依雷撒的袖口",
        "nameEn": "Iratha's Cuff",
        "slotZh": "轻护手",
        "reqLvl": 15,
        "stats": [
          "冰冷抗性 +30%",
          "半数冰冻时间"
        ],
        "setPieceBonus": [
          "2 件：+20% IAS"
        ]
      },
      {
        "nameZh": "依雷撒的绳索",
        "nameEn": "Iratha's Cord",
        "slotZh": "重扣带",
        "reqLvl": 15,
        "stats": [
          "+5 最小伤",
          "+25 防御"
        ],
        "setPieceBonus": [
          "2 件：+10 敏捷"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+50 防御"
        ]
      },
      {
        "count": 3,
        "stats": [
          "+20% FRW"
        ]
      }
    ],
    "fullBonuses": [
      "所有抗性 +20（全套共约 +65 全抗）",
      "+10% 所有抗性上限（85%）",
      "+15 敏捷",
      "+20% FRW"
    ]
  },
  "milabrega": {
    "pieces": [
      {
        "nameZh": "米拉伯佳的宝冠",
        "nameEn": "Milabrega's Diadem",
        "slotZh": "皇冠",
        "reqLvl": 17,
        "stats": [
          "+15 法力",
          "+15 生命"
        ],
        "setPieceBonus": [
          "2 件：冰冷抗性 +40%"
        ]
      },
      {
        "nameZh": "米拉伯佳的战袍",
        "nameEn": "Milabrega's Robe",
        "slotZh": "古代装甲",
        "reqLvl": 17,
        "stats": [
          "伤害减少 2",
          "受击者受伤 3"
        ],
        "setPieceBonus": [
          "2 件：+100% 强化防御"
        ]
      },
      {
        "nameZh": "米拉伯佳的权杖",
        "nameEn": "Milabrega's Rod",
        "slotZh": "战权杖",
        "reqLvl": 17,
        "stats": [
          "+1 圣骑士技能",
          "+50% ED"
        ]
      },
      {
        "nameZh": "米拉伯佳的宝珠",
        "nameEn": "Milabrega's Orb",
        "slotZh": "鸢盾",
        "reqLvl": 17,
        "stats": [
          "+20% MF",
          "+25 防御"
        ],
        "setPieceBonus": [
          "2 件：+50 生命",
          "3 件：+50% 强化防御"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+75 命中率"
        ]
      },
      {
        "count": 3,
        "stats": [
          "+125 命中率"
        ]
      }
    ],
    "fullBonuses": [
      "+2 圣骑士技能",
      "+15 所有抗性",
      "8% 生命偷取",
      "10% 法力偷取"
    ]
  },
  "tancred": {
    "pieces": [
      {
        "nameZh": "坦克雷的骷髅",
        "nameEn": "Tancred's Skull",
        "slotZh": "白骨头盔",
        "reqLvl": 20,
        "stats": [
          "+10% ED",
          "+40 命中率"
        ],
        "setPieceBonus": [
          "2 件：所有抗性 +10"
        ]
      },
      {
        "nameZh": "坦克雷的脊柱",
        "nameEn": "Tancred's Spine",
        "slotZh": "高级战甲",
        "reqLvl": 20,
        "stats": [
          "+40 生命",
          "+15 力量"
        ],
        "setPieceBonus": [
          "2 件：+(2*等级) 防御"
        ]
      },
      {
        "nameZh": "坦克雷的乌鸦嘴",
        "nameEn": "Tancred's Crowbill",
        "slotZh": "军镐",
        "reqLvl": 20,
        "stats": [
          "+80% ED",
          "+75 命中率"
        ],
        "setPieceBonus": [
          "2 件：+20 法力",
          "3 件：+20% 提高攻击速度 (IAS)"
        ]
      },
      {
        "nameZh": "坦克雷的怪诞",
        "nameEn": "Tancred's Weird",
        "slotZh": "项链",
        "reqLvl": 20,
        "stats": [
          "伤害减少 2",
          "魔法伤害减少 1"
        ],
        "setPieceBonus": [
          "2 件：+78% MF",
          "3 件：+60 命中率"
        ]
      },
      {
        "nameZh": "坦克雷的步履",
        "nameEn": "Tancred's Hobnails",
        "slotZh": "长靴",
        "reqLvl": 20,
        "stats": [
          "+10 敏捷",
          "恢复生命 +10"
        ],
        "setPieceBonus": [
          "2 件：+30% FRW"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+15 闪电伤害"
        ]
      },
      {
        "count": 3,
        "stats": [
          "5% 击中偷取法力"
        ]
      }
    ],
    "fullBonuses": [
      "+10 所有抗性",
      "5% 击中偷取生命",
      "+75% 额外金币",
      "减慢目标 35%"
    ]
  },
  "vidala": {
    "pieces": [
      {
        "nameZh": "维达拉的倒刺",
        "nameEn": "Vidala's Barb",
        "slotZh": "长战弓",
        "reqLvl": 14,
        "stats": [
          "+1–20 闪电伤害"
        ],
        "setPieceBonus": [
          "2 件：+(8*等级) 命中"
        ]
      },
      {
        "nameZh": "维达拉的埋伏",
        "nameEn": "Vidala's Ambush",
        "slotZh": "皮甲",
        "reqLvl": 14,
        "stats": [
          "+50 防御",
          "+11 敏捷"
        ],
        "setPieceBonus": [
          "2 件：火焰抗性 +24%",
          "3 件：+(2.5*等级) 防御"
        ]
      },
      {
        "nameZh": "维达拉的圈套",
        "nameEn": "Vidala's Snare",
        "slotZh": "项链",
        "reqLvl": 14,
        "stats": [
          "+15 生命",
          "冰冷抗性 +20%"
        ],
        "setPieceBonus": [
          "2 件：+50% MF"
        ]
      },
      {
        "nameZh": "维达拉的脚镣",
        "nameEn": "Vidala's Fetlock",
        "slotZh": "轻型金属靴",
        "reqLvl": 14,
        "stats": [
          "+30% FRW",
          "+150 耐力"
        ],
        "setPieceBonus": [
          "2 件：所有抗性 +8"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+75 命中率"
        ]
      },
      {
        "count": 3,
        "stats": [
          "+15 敏捷"
        ]
      }
    ],
    "fullBonuses": [
      "冰冻目标",
      "50% 穿刺攻击",
      "+10 力量",
      "+15–20 冰冷伤害"
    ]
  },
  "arcanna": {
    "pieces": [
      {
        "nameZh": "阿卡娜的头",
        "nameEn": "Arcanna's Head",
        "slotZh": "骷髅帽",
        "reqLvl": 15,
        "stats": [
          "生命恢复 +4",
          "受击者受伤 2"
        ],
        "setPieceBonus": [
          "2 件：+(3*等级) 防御",
          "3 件：闪电抗性 +15%"
        ]
      },
      {
        "nameZh": "阿卡娜的血肉",
        "nameEn": "Arcanna's Flesh",
        "slotZh": "轻型装甲",
        "reqLvl": 15,
        "stats": [
          "+2 照亮范围",
          "伤害减少 3"
        ],
        "setPieceBonus": [
          "2 件：+100 防御",
          "3 件：+10 精力"
        ]
      },
      {
        "nameZh": "阿卡娜的死亡手杖",
        "nameEn": "Arcanna's Deathwand",
        "slotZh": "战杖",
        "reqLvl": 15,
        "stats": [
          "+1 法师技能",
          "25% 致命一击"
        ],
        "setPieceBonus": [
          "2 件：+50 法力",
          "3 件：法力恢复速度提高 5%"
        ]
      },
      {
        "nameZh": "阿卡娜的符号",
        "nameEn": "Arcanna's Sign",
        "slotZh": "项链",
        "reqLvl": 15,
        "stats": [
          "+15 法力",
          "法力恢复 +20%"
        ],
        "setPieceBonus": [
          "2 件：+50% MF"
        ]
      }
    ],
    "partialBonuses": [
      {
        "count": 2,
        "stats": [
          "+25 法力"
        ]
      },
      {
        "count": 3,
        "stats": [
          "+50 生命"
        ]
      }
    ],
    "fullBonuses": [
      "+1 所有技能",
      "+20% 更快速施法",
      "5% 击中偷取法力",
      "+50 法力"
    ]
  }
};
