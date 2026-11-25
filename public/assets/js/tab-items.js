import {
  D2R, MAIN_TABS, RW_STORAGE_KEY, GRAIL_UNIQUE_KEY, GRAIL_SET_KEY,
  currentLang, activeMainTab,
  itData, setItData, rwRunes, rwCompleted, setRwCompleted,
  grailUniques, setGrailUniques, grailSetPieces, setGrailSetPieces,
  pickLangTitle, pickLangSub, escapeHtml, renderStatList,
  switchMainTab, applyDomTraditionalSweep, scheduleCloudSync
} from "./shared.js?v=09528eb701";

let dcData = null;
let dcMode = "source";
let dcSourceId = "andariel-tz";
let dcMf = 250;
let dcPlayers = 1;
let itActiveTab = "base";
let itSubFilter = "all";
let itBaseSubType = "all";
let itBaseSocketFilter = "all";
let itBaseTierFilter = "all";
let itUniqueTierFilter = "all";
let itGrailFilter = "all";
let itSearchQuery = "";


function loadGrailState() {
  try {
    const rawU = localStorage.getItem(GRAIL_UNIQUE_KEY);
    if (rawU) setGrailUniques(new Set(JSON.parse(rawU)));
    const rawS = localStorage.getItem(GRAIL_SET_KEY);
    if (rawS) setGrailSetPieces(new Set(JSON.parse(rawS)));
  } catch (e) {
    console.warn("读取圣杯存档失败", e);
  }
}

function saveGrailState() {
  try {
    localStorage.setItem(GRAIL_UNIQUE_KEY, JSON.stringify([...grailUniques]));
    localStorage.setItem(GRAIL_SET_KEY, JSON.stringify([...grailSetPieces]));
    if (!window.__cloudApplyingRemote) {
      localStorage.setItem("d2r-builds-local-updated-at", new Date().toISOString());
      if (typeof scheduleCloudSync === "function") scheduleCloudSync();
    }
  } catch (e) {
    console.warn("保存圣杯存档失败", e);
  }
}

function renderGrailSummary() {
  if (!itData) return;
  const uniques = itData.uniqueItems || [];
  const sets = itData.setItems || [];
  const allPieces = sets.flatMap(s => (s.detail && s.detail.pieces) ? s.detail.pieces : []);

  const uTotal = uniques.length;
  const uDone = uniques.filter(u => grailUniques.has(u.nameEn)).length;

  const sTotal = allPieces.length;
  const sDone = allPieces.filter(p => grailSetPieces.has(p.nameEn)).length;

  const fullSetTotal = sets.length;
  const fullSetDone = sets.filter(s => {
    const pcs = (s.detail && s.detail.pieces) ? s.detail.pieces : [];
    return pcs.length > 0 && pcs.every(p => grailSetPieces.has(p.nameEn));
  }).length;

  const tc87Uniques = uniques.filter(u => u.baseInfo && u.baseInfo.tc === 87);
  const tc87Pieces = allPieces.filter(p => p.baseInfo && p.baseInfo.tc === 87);
  const tc87Total = tc87Uniques.length + tc87Pieces.length;
  const tc87Done = tc87Uniques.filter(u => grailUniques.has(u.nameEn)).length +
    tc87Pieces.filter(p => grailSetPieces.has(p.nameEn)).length;

  const totalAll = uTotal + sTotal;
  const totalDone = uDone + sDone;
  const pct = totalAll > 0 ? Math.round((totalDone / totalAll) * 1000) / 10 : 0;

  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val);
  };
  setText("grail-total-done", totalDone);
  setText("grail-total-all", totalAll);
  setText("grail-total-pct", pct + "%");
  setText("grail-unique-done", uDone);
  setText("grail-unique-all", uTotal);
  setText("grail-set-done", sDone);
  setText("grail-set-all", sTotal);
  setText("grail-fullset-done", fullSetDone);
  setText("grail-fullset-all", fullSetTotal);
  setText("grail-tc87-done", tc87Done);
  setText("grail-tc87-all", tc87Total);

  const fillEl = document.getElementById("grail-progress-fill");
  if (fillEl) fillEl.style.width = Math.min(100, pct) + "%";
}

const IT_SUBFILTERS = {
  base: [
    { id: "all", label: "全部底材", icon: "/images/ui/gemsocket.webp" },
    { id: "weapon", label: "武器", icon: "/images/items/weapon/sword/crystal_sword.webp" },
    { id: "shield", label: "盾牌 / 副手", icon: "/images/items/armor/shield/kite_shield.webp" },
    { id: "helm", label: "头盔", icon: "/images/items/armor/helmet/bone_helm.webp" },
    { id: "armor", label: "盔甲", icon: "/images/items/armor/armor/light_plate.webp" },
    { id: "accessory", label: "手套 / 鞋 / 腰带", icon: "/images/items/armor/glove/heavy_gloves.webp" },
    { id: "classOnly", label: "⭐ 职业专用底材", icon: "/images/items/armor/shield/targe.webp" }
  ],
  magicRare: [
    { id: "all", label: "全部蓝/黄", icon: "/images/items/armor/circlet/diadem.webp" },
    { id: "magic", label: "蓝装极品", icon: "/images/items/misc/gem/perfect_saphire.webp" },
    { id: "rare", label: "黄装极品", icon: "/images/items/misc/gem/perfect_topaz.webp" }
  ],
  set: [
    { id: "all", label: "全部套装", icon: "/images/items/armor/helmet/horazons_countenance.webp" },
    { id: "class", label: "七大职业套装", icon: "/images/items/armor/helmet/avenger_guard.webp" },
    { id: "generic", label: "通用/开荒套装", icon: "/images/items/armor/shield/tower_shield.webp" }
  ],
  unique: [
    { id: "all", label: "全部暗金", icon: "/images/items/misc/quest/mephisto_soul_stone.webp" },
    { id: "weapon", label: "武器", icon: "/images/items/weapon/sword/crystal_sword.webp" },
    { id: "shield", label: "盾牌 / 副手", icon: "/images/items/armor/shield/steelclash.webp" },
    { id: "helm", label: "头盔", icon: "/images/items/armor/circlet/tiara.webp" },
    { id: "armor", label: "盔甲", icon: "/images/items/armor/armor/victors_silk.webp" },
    { id: "gloves", label: "手套", icon: "/images/items/armor/glove/gaunlets_h.webp" },
    { id: "boots", label: "鞋子", icon: "/images/items/armor/boot/heavy_boots.webp" },
    { id: "belt", label: "腰带", icon: "/images/items/armor/belt/sash_l.webp" },
    { id: "ring", label: "戒指", icon: "/images/items/misc/ring/ring5.webp" },
    { id: "amulet", label: "护身符", icon: "/images/items/misc/amulet/viper_amulet.webp" },
    { id: "charm", label: "咒符", icon: "/images/items/misc/torch/torch.webp" },
    { id: "jewel", label: "珠宝", icon: "/images/items/misc/body_part/fragment_fire.webp" },
    { id: "classOnly", label: "⭐ 职业专用暗金", icon: "/images/items/armor/shield/targe.webp" }
  ],
  cube: [],
  drops: [
    { id: "all", label: "全部掉落", icon: "/images/items/misc/shard/mote_of_anguish.webp" },
    { id: "unique", label: "暗金装备", icon: "/images/items/misc/quest/mephisto_soul_stone.webp" },
    { id: "set", label: "绿色套装", icon: "/images/items/armor/helmet/horazons_countenance.webp" },
    { id: "rune", label: "符文 (#1-#33)", icon: "/images/items/misc/rune/ber_rune.webp" },
    { id: "special", label: "钥匙 / 精华 / 3.4 雕像", icon: "/images/items/misc/key/mephisto_key.webp" }
  ]
};

function populateDcSourceSelect() {
  const sel = document.getElementById("dc-source-select");
  if (!sel || !dcData || !Array.isArray(dcData.sources)) return;
  sel.innerHTML = dcData.sources.map(src => {
    const nm = currentLang === "zhTW" ? (src.nameTw || src.nameZh) : currentLang === "enUS" ? src.nameEn : src.nameZh;
    return '<option value="' + escapeHtml(src.id) + '"' + (src.id === dcSourceId ? ' selected' : '') + '>' + escapeHtml(nm) + ' (mlvl ' + src.mlvl + ')</option>';
  }).join("");
}

function syncDcSourceToCurrentTz() {
  if (!dcData || !Array.isArray(dcData.sources)) return;
  const curTzEn = (window.dashboardData && window.dashboardData.terrorZone && window.dashboardData.terrorZone.current) || "";
  const matched = dcData.sources.find(s => s.isTz && s.tzZone && s.tzZone !== "*" && curTzEn.toLowerCase().includes(s.tzZone.toLowerCase().split(",")[0]));
  dcSourceId = matched ? matched.id : "tz-unique-96";
  populateDcSourceSelect();
}

function computePickDropProb(noDrop, probSum, players) {
  if (noDrop <= 0) return 1;
  const n = Math.max(1, Math.floor((1 + Number(players || 1)) / 2));
  if (n <= 1) return probSum / (probSum + noDrop);
  const baseNoDropRatio = noDrop / (noDrop + probSum);
  const powRatio = Math.pow(baseNoDropRatio, n);
  const newNoDrop = Math.floor(probSum * (powRatio / (1 - powRatio)));
  if (newNoDrop <= 0) return 1;
  return probSum / (probSum + newNoDrop);
}

function computeQualityChance(baseChance, divisor, minVal, effMf, tcFactor, mlvl, qlvl) {
  let chance = (baseChance - Math.floor((mlvl - qlvl) / divisor)) * 128;
  if (effMf > 0) {
    chance = Math.floor((chance * 100) / (100 + effMf));
  }
  if (chance < minVal) chance = minVal;
  chance = chance - Math.floor((chance * tcFactor) / 1024);
  if (chance <= 128) return 1;
  return 128 / chance;
}

function computeEquipQualityOdds(code, src, mf) {
  if (!dcData || !dcData.baseMeta) return { unique: 0, set: 0 };
  const meta = dcData.baseMeta[code];
  if (!meta) return { unique: 0, set: 0 };
  const isCs = meta.cs === 1;
  const uBase = isCs ? 240 : 400;
  const uDiv = isCs ? 3 : 1;
  const sBase = isCs ? 120 : 160;
  const sDiv = isCs ? 3 : 2;
  const effMfU = mf > 0 ? Math.floor((mf * 250) / (mf + 250)) : 0;
  const effMfS = mf > 0 ? Math.floor((mf * 500) / (mf + 500)) : 0;
  const pU = src.uniqueFactor > 0 ? computeQualityChance(uBase, uDiv, 6400, effMfU, src.uniqueFactor, src.mlvl, meta.qlvl) : 0;
  const pS = src.setFactor > 0 ? computeQualityChance(sBase, sDiv, 5600, effMfS, src.setFactor, src.mlvl, meta.qlvl) : 0;
  return { unique: pU, set: (1 - pU) * pS };
}

function computeSingleItemDropChance(src, itemType, code, itemNameEn, mf, players) {
  let leafP = Number((src.leaves && src.leaves[code]) || 0);
  const pDrop = computePickDropProb(src.noDrop, src.probSum, players);
  let perPickP = 0;

  if (itemType === "rune" || itemType === "special") {
    perPickP = pDrop * leafP;
    let mainChance = perPickP > 0 ? (1 - Math.pow(1 - perPickP, src.picks)) : 0;
    if (itemType === "rune" && src.extraRune && src.extraRune.leaves && src.extraRune.leaves[code]) {
      const rDrop = computePickDropProb(src.extraRune.noDrop, src.extraRune.probSum, players);
      const rPerPick = rDrop * Number(src.extraRune.leaves[code]);
      const rChance = 1 - Math.pow(1 - rPerPick, src.extraRune.picks);
      mainChance = 1 - (1 - mainChance) * (1 - rChance);
    }
    return mainChance;
  }

  if (leafP <= 0) return 0;
  const qOdds = computeEquipQualityOdds(code, src, mf);

  if (itemType === "unique") {
    const pool = (dcData.uniquePools && dcData.uniquePools[code]) || [];
    const eligible = pool.filter(u => u.qlvl <= src.mlvl);
    const target = eligible.find(u => u.nameEn === itemNameEn);
    if (!target) return 0;
    const sumRarity = eligible.reduce((a, b) => a + b.rarity, 0);
    perPickP = pDrop * leafP * qOdds.unique * (target.rarity / sumRarity);
  } else if (itemType === "set") {
    const pool = (dcData.setPools && dcData.setPools[code]) || [];
    const eligible = pool.filter(s => s.qlvl <= src.mlvl);
    const target = eligible.find(s => s.nameEn === itemNameEn);
    if (!target) return 0;
    const sumRarity = eligible.reduce((a, b) => a + b.rarity, 0);
    perPickP = pDrop * leafP * qOdds.set * (target.rarity / sumRarity);
  }

  if (perPickP <= 0) return 0;
  return 1 - Math.pow(1 - perPickP, src.picks);
}

let cubeUpTargetName = "Titan's Revenge";
let cubeUpEth = false;
let cubeSunderId = "cold";
let cubeSunderRolled = [];

function initCubeSimulators() {
  if (!itData) return;
  const upSel = document.getElementById("cube-up-select");
  const metaMap = itData.uniqueUpgradeMeta || {};
  const tiersMap = itData.baseUpgradeTiers || {};
  if (upSel) {
    const upItems = (itData.uniqueItems || []).filter(u => metaMap[u.nameEn]);
    upSel.innerHTML = upItems.map(u => {
      const m = metaMap[u.nameEn];
      const b = tiersMap[m.code];
      const tLabel = b && b.tier === 1 ? "普通→扩展→精华" : "扩展→精华";
      return '<option value="' + escapeHtml(u.nameEn) + '"' + (u.nameEn === cubeUpTargetName ? ' selected' : '') + '>' + escapeHtml(pickLangTitle(u)) + ' (' + escapeHtml(u.nameEn) + ' · ' + tLabel + ')</option>';
    }).join("");
    upSel.onchange = (e) => {
      cubeUpTargetName = e.target.value;
      renderCubeUpgrader();
    };
  }
  const ethCb = document.getElementById("cube-up-eth");
  if (ethCb) {
    ethCb.onchange = (e) => {
      cubeUpEth = Boolean(e.target.checked);
      renderCubeUpgrader();
    };
  }

  const sunSel = document.getElementById("cube-sunder-select");
  const sunList = itData.sunderCrafts34 || [];
  if (sunSel && sunList.length) {
    sunSel.innerHTML = sunList.map(s =>
      '<option value="' + escapeHtml(s.id) + '"' + (s.id === cubeSunderId ? ' selected' : '') + '>' + escapeHtml(s.nameZh) + ' (' + escapeHtml(s.nameEn) + ')</option>'
    ).join("");
    sunSel.onchange = (e) => {
      cubeSunderId = e.target.value;
      rollAndRenderSunderSim();
    };
  }
  const rollBtn = document.getElementById("cube-sunder-roll-btn");
  if (rollBtn) {
    rollBtn.onclick = () => rollAndRenderSunderSim();
  }
  renderCubeUpgrader();
  rollAndRenderSunderSim();
}

function renderCubeUpgrader() {
  const box = document.getElementById("cube-up-preview");
  if (!box || !itData || !itData.uniqueUpgradeMeta || !itData.baseUpgradeTiers) return;
  const meta = itData.uniqueUpgradeMeta[cubeUpTargetName];
  const uObj = (itData.uniqueItems || []).find(u => u.nameEn === cubeUpTargetName);
  if (!meta || !uObj) return;
  const tiers = itData.baseUpgradeTiers;
  const origBase = tiers[meta.code];
  if (!origBase) return;

  const codesToPreview = origBase.tier === 1
    ? [origBase.norm, origBase.uber, origBase.ultra]
    : [origBase.uber, origBase.ultra];

  const rowsHtml = codesToPreview.map((code, idx) => {
    const b = tiers[code];
    if (!b) return "";
    const isOrig = code === meta.code;
    const stepPenalty = isOrig ? 0 : (origBase.tier === 1 ? (b.tier === 2 ? 5 : 12) : 7);
    const finalReqLvl = Math.max(b.lvl, meta.reqLvl) + stepPenalty;
    const finalStr = Math.max(0, b.str - (cubeUpEth ? 10 : 0));
    const finalDex = Math.max(0, b.dex - (cubeUpEth ? 10 : 0));

    let statText = "";
    if (b.kind === "armor") {
      const minBase = isOrig && meta.ed[1] > 0 ? (b.def[1] + 1) : b.def[0];
      const maxBase = isOrig && meta.ed[1] > 0 ? (b.def[1] + 1) : b.def[1];
      const eMinB = cubeUpEth ? Math.floor(minBase * 1.5) : minBase;
      const eMaxB = cubeUpEth ? Math.floor(maxBase * 1.5) : maxBase;
      const dMin = Math.floor(eMinB * (100 + meta.ed[0]) / 100) + meta.flatDef[0];
      const dMax = Math.floor(eMaxB * (100 + meta.ed[1]) / 100) + meta.flatDef[1];
      statText = "成品防御：" + (dMin === dMax ? dMin : (dMin + " – " + dMax)) + "（底材基础 " + eMinB + "–" + eMaxB + "）";
    } else {
      const calcDmg = (pair) => {
        if (!pair || pair[1] <= 0) return null;
        const eMin = cubeUpEth ? Math.floor(pair[0] * 1.5) : pair[0];
        const eMax = cubeUpEth ? Math.floor(pair[1] * 1.5) : pair[1];
        const mnMin = Math.floor(eMin * (100 + meta.ed[0]) / 100) + meta.flatDmg[0];
        const mxMax = Math.floor(eMax * (100 + meta.ed[1]) / 100) + meta.flatDmg[1];
        return mnMin + " – " + mxMax;
      };
      const d1 = calcDmg(b.d1);
      const d2 = calcDmg(b.d2);
      const dt = calcDmg(b.dt);
      const dParts = [];
      if (d1) dParts.push("单手伤害 " + d1);
      if (d2) dParts.push("双手伤害 " + d2);
      if (dt) dParts.push("投掷伤害 " + dt);
      statText = dParts.join(" · ");
    }

    const tierLabel = b.tier === 1 ? "【普通级】" : b.tier === 2 ? "【扩展级】" : "【精华级】";
    const recipeText = isOrig
      ? "原始掉落阶级"
      : (b.kind === "armor"
          ? (b.tier === 2 ? "升阶公式：#7 塔尔 (Tal) + #13 沙伊 (Shael) + 完美钻石" : "升阶公式：#18 科 (Ko) + #20 兰姆 (Lem) + 完美钻石")
          : (b.tier === 2 ? "升阶公式：#8 拉尔 (Ral) + #12 索尔 (Sol) + 完美绿宝石" : "升阶公式：#17 卢姆 (Lum) + #21 普尔 (Pul) + 完美绿宝石"));
    const bName = currentLang === "zhTW" ? (b.zhTW || b.zhCN) : currentLang === "enUS" ? b.enUS : b.zhCN;

    return '<div class="it-set-bonus-box" style="margin-top:6px;border-color:' + (isOrig ? 'rgba(255,255,255,0.15)' : 'rgba(87,219,112,0.45)') + '">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px">' +
        '<strong style="color:' + (isOrig ? '#f5cf7b' : '#8af49f') + '">' + tierLabel + " " + escapeHtml(bName) + ' (' + escapeHtml(b.enUS) + ')</strong>' +
        '<span class="rw-badge">' + escapeHtml(recipeText) + '</span>' +
      '</div>' +
      renderStatList(statText + " · 需求等级 " + finalReqLvl + (finalStr > 0 ? (" · 需求力量 " + finalStr) : "") + (finalDex > 0 ? (" · 需求敏捷 " + finalDex) : ""), "#9ad8ff", false) +
    '</div>';
  }).join("");

  box.innerHTML = rowsHtml;
}

function rollAndRenderSunderSim() {
  const box = document.getElementById("cube-sunder-preview");
  if (!box || !itData || !Array.isArray(itData.sunderCrafts34)) return;
  const sun = itData.sunderCrafts34.find(s => s.id === cubeSunderId) || itData.sunderCrafts34[0];
  const commonPools = itData.sunderCommonPools || [];

  const randInt = (mn, mx) => mn + Math.floor(Math.random() * (mx - mn + 1));
  const pickWeighted = (opts) => {
    const tot = opts.reduce((a, b) => a + (b.weight || 1), 0);
    let r = Math.random() * tot;
    for (const o of opts) {
      r -= (o.weight || 1);
      if (r <= 0) return o;
    }
    return opts[0];
  };

  const rolledLines = [];
  if (Array.isArray(sun.slot1Pool) && sun.slot1Pool.length) {
    const o1 = pickWeighted(sun.slot1Pool);
    const v1 = randInt(o1.min, o1.max);
    rolledLines.push("【词缀 1 · 元素专精】" + o1.label.replace("{v}", String(v1)) + "（范围 " + o1.min + "–" + o1.max + "）");
  }
  for (const pool of commonPools) {
    const opt = pickWeighted(pool.options);
    const val = randInt(opt.min, opt.max);
    rolledLines.push("【" + pool.slotName + "】" + opt.label.replace("{v}", String(val)) + "（范围 " + opt.min + "–" + opt.max + "）");
  }

  box.innerHTML =
    '<div class="it-card-note" style="color:#ffd584;margin-bottom:6px">方块公式：' + escapeHtml(sun.recipeZh) + '</div>' +
    renderStatList(sun.fixedStats.join(" · "), "#f1a7ec", false) +
    renderStatList(rolledLines.join(" · "), "#8af49f", false);
}

async function loadItemsCatalog() {
  try {
    loadGrailState();
    const [response, dropRes] = await Promise.all([
      fetch("/api/items", { cache: "no-store" }),
      fetch("/api/drops", { cache: "no-store" })
    ]);
    const data = await response.json();
    const dropData = await dropRes.json();
    if (dropData && dropData.ok) {
      dcData = dropData;
      populateDcSourceSelect();
    }
    if (data.ok) {
      setItData(data);
      renderGrailSummary();
      initCubeSimulators();
      renderItSubfilters();
      renderItemsGrid();
      if (D2R.tabs.skills && D2R.tabs.skills.renderPaperdollAll) D2R.tabs.skills.renderPaperdollAll();
    }
  } catch (err) {
    console.error("加载物品资讯失败", err);
  }
}

const IT_BASE_SUBTYPES = {
  all: [
    { id: "all", label: "全部细分", icon: "/images/ui/gemsocket.webp" },
    { id: "swor", label: "剑", icon: "/images/items/weapon/sword/crystal_sword.webp" },
    { id: "axe", label: "斧", icon: "/images/items/weapon/axe/axe.webp" },
    { id: "pole", label: "长柄", icon: "/images/items/weapon/polearm/halberd.webp" },
    { id: "spea", label: "长矛", icon: "/images/items/weapon/spear/spear.webp" },
    { id: "mace", label: "钉锤 / 重锤 / 棒", icon: "/images/items/weapon/mace/flail.webp" },
    { id: "scep", label: "权杖", icon: "/images/items/weapon/scepter/war_scepter.webp" },
    { id: "staf", label: "双手法杖", icon: "/images/items/weapon/staff/war_staff.webp" },
    { id: "wand", label: "单手魔杖", icon: "/images/items/weapon/wand/bone_wand.webp" },
    { id: "bow", label: "弓", icon: "/images/items/weapon/bow/long_bow.webp" },
    { id: "xbow", label: "弩", icon: "/images/items/weapon/bow/heavy_crossbow.webp" },
    { id: "knif", label: "匕首", icon: "/images/items/weapon/knife/dagger.webp" },
    { id: "jave", label: "标枪", icon: "/images/items/weapon/javelin/javelin.webp" },
    { id: "throw", label: "飞刀 / 飞斧", icon: "/images/items/weapon/knife/balanced_knife.webp" },
    { id: "shie", label: "通用盾牌", icon: "/images/items/armor/shield/kite_shield.webp" },
    { id: "pal-shd", label: "圣骑士盾", icon: "/images/items/armor/shield/targe.webp" },
    { id: "nec-head", label: "死灵首级", icon: "/images/items/armor/voodoo_head/preserved_head.webp" },
    { id: "war-grim", label: "术士魔典", icon: "/images/items/armor/grimoires/grimoire.webp" },
    { id: "helm", label: "通用头盔", icon: "/images/items/armor/helmet/helm.webp" },
    { id: "circ", label: "头环 / 权冠", icon: "/images/items/armor/circlet/diadem.webp" },
    { id: "bar-helm", label: "野蛮人头盔", icon: "/images/items/armor/helmet/avenger_guard.webp" },
    { id: "dru-pelt", label: "德鲁伊狼头", icon: "/images/items/armor/pelt/wolf_head.webp" },
    { id: "ama-weap", label: "亚马逊武器", icon: "/images/items/weapon/javelin/maiden_javelin.webp" },
    { id: "ass-claw", label: "刺客拳刃/爪", icon: "/images/items/weapon/h2h/katar.webp" },
    { id: "sor-orb", label: "法师法珠", icon: "/images/items/weapon/orb/eagle_orb.webp" }
  ],
  weapon: [
    { id: "all", label: "全部武器", icon: "/images/items/weapon/sword/crystal_sword.webp" },
    { id: "swor", label: "剑", icon: "/images/items/weapon/sword/crystal_sword.webp" },
    { id: "axe", label: "斧", icon: "/images/items/weapon/axe/axe.webp" },
    { id: "pole", label: "长柄", icon: "/images/items/weapon/polearm/halberd.webp" },
    { id: "spea", label: "长矛", icon: "/images/items/weapon/spear/spear.webp" },
    { id: "mace", label: "钉锤 / 重锤 / 棒", icon: "/images/items/weapon/mace/flail.webp" },
    { id: "scep", label: "权杖", icon: "/images/items/weapon/scepter/war_scepter.webp" },
    { id: "staf", label: "双手法杖", icon: "/images/items/weapon/staff/war_staff.webp" },
    { id: "wand", label: "单手魔杖", icon: "/images/items/weapon/wand/bone_wand.webp" },
    { id: "bow", label: "弓", icon: "/images/items/weapon/bow/long_bow.webp" },
    { id: "xbow", label: "弩", icon: "/images/items/weapon/bow/heavy_crossbow.webp" },
    { id: "knif", label: "匕首", icon: "/images/items/weapon/knife/dagger.webp" },
    { id: "jave", label: "标枪", icon: "/images/items/weapon/javelin/javelin.webp" },
    { id: "throw", label: "飞刀 / 飞斧 (投掷)", icon: "/images/items/weapon/knife/balanced_knife.webp" },
    { id: "ama-weap", label: "⭐ 亚马逊专用 (弓/矛/标枪)", icon: "/images/items/weapon/javelin/maiden_javelin.webp" },
    { id: "ass-claw", label: "⭐ 刺客专用 (拳刃/爪)", icon: "/images/items/weapon/h2h/katar.webp" },
    { id: "sor-orb", label: "⭐ 法师专用 (法珠)", icon: "/images/items/weapon/orb/eagle_orb.webp" }
  ],
  shield: [
    { id: "all", label: "全部盾牌 / 副手", icon: "/images/items/armor/shield/kite_shield.webp" },
    { id: "shie", label: "通用盾牌", icon: "/images/items/armor/shield/kite_shield.webp" },
    { id: "pal-shd", label: "⭐ 圣骑士专用盾", icon: "/images/items/armor/shield/targe.webp" },
    { id: "nec-head", label: "⭐ 死灵法师专用首级", icon: "/images/items/armor/voodoo_head/preserved_head.webp" },
    { id: "war-grim", label: "⭐ 术士专用魔典", icon: "/images/items/armor/grimoires/grimoire.webp" }
  ],
  helm: [
    { id: "all", label: "全部头盔", icon: "/images/items/armor/helmet/helm.webp" },
    { id: "helm", label: "通用头盔", icon: "/images/items/armor/helmet/helm.webp" },
    { id: "circ", label: "头环 / 权冠", icon: "/images/items/armor/circlet/diadem.webp" },
    { id: "bar-helm", label: "⭐ 野蛮人专用头盔", icon: "/images/items/armor/helmet/avenger_guard.webp" },
    { id: "dru-pelt", label: "⭐ 德鲁伊专用狼头", icon: "/images/items/armor/pelt/wolf_head.webp" }
  ],
  accessory: [
    { id: "all", label: "全部防具配件", icon: "/images/items/armor/glove/heavy_gloves.webp" },
    { id: "glov", label: "手套", icon: "/images/items/armor/glove/heavy_gloves.webp" },
    { id: "boot", label: "鞋子", icon: "/images/items/armor/boot/heavy_boots.webp" },
    { id: "belt", label: "腰带", icon: "/images/items/armor/belt/heavy_belt.webp" }
  ],
  classOnly: [
    { id: "all", label: "全部职业专用", icon: "/images/items/armor/shield/targe.webp" },
    { id: "ama-weap", label: "亚马逊 (专用弓/矛/标枪)", icon: "/images/items/weapon/javelin/maiden_javelin.webp" },
    { id: "ass-claw", label: "刺客 (拳刃/爪)", icon: "/images/items/weapon/h2h/katar.webp" },
    { id: "sor-orb", label: "法师 (法珠)", icon: "/images/items/weapon/orb/eagle_orb.webp" },
    { id: "pal-shd", label: "圣骑士 (专用盾牌)", icon: "/images/items/armor/shield/targe.webp" },
    { id: "nec-head", label: "死灵法师 (巫毒首级)", icon: "/images/items/armor/voodoo_head/preserved_head.webp" },
    { id: "war-grim", label: "术士 (专用魔典)", icon: "/images/items/armor/grimoires/grimoire.webp" },
    { id: "bar-helm", label: "野蛮人 (专用头盔)", icon: "/images/items/armor/helmet/avenger_guard.webp" },
    { id: "dru-pelt", label: "德鲁伊 (狼头/鹿角)", icon: "/images/items/armor/pelt/wolf_head.webp" }
  ]
};

function renderBaseSubtypeChips() {
  const row = document.getElementById("it-base-subtype-row");
  const chips = document.getElementById("it-base-subtype-chips");
  if (!row || !chips) return;
  if (itActiveTab !== "base" && itActiveTab !== "unique") {
    row.style.display = "none";
    return;
  }
  const options = (itActiveTab === "unique" && itSubFilter === "all")
    ? []
    : (IT_BASE_SUBTYPES[itSubFilter] || []);
  if (options.length === 0) {
    row.style.display = "none";
    return;
  }
  if (!options.some(o => o.id === itBaseSubType)) itBaseSubType = "all";
  const sourceList = itActiveTab === "base"
    ? ((itData && itData.baseItems) || [])
    : ((itData && itData.uniqueItems) || []);
  const fieldKey = itActiveTab === "base" ? "category" : "slot";
  const countFor = (subId) => {
    if (!sourceList.length) return "";
    const n = sourceList.filter(item => {
      if (itSubFilter === "classOnly" && !item.classOnly) return false;
      if (itSubFilter !== "all" && itSubFilter !== "classOnly" && item[fieldKey] !== itSubFilter) return false;
      if (subId !== "all" && item.subCategory !== subId) return false;
      return true;
    }).length;
    return " (" + n + ")";
  };
  row.style.display = "flex";
  chips.innerHTML = options.map(opt => {
    const ico = opt.icon
      ? '<img class="ui-chip-icon" src="' + escapeHtml(opt.icon) + '" alt="" />'
      : '';
    return '<button type="button" class="tz-chip' + (itBaseSubType === opt.id ? ' active' : '') + '" data-it-subtype="' + escapeHtml(opt.id) + '">' + ico + escapeHtml(opt.label + countFor(opt.id)) + '</button>';
  }).join("");
  chips.querySelectorAll("[data-it-subtype]").forEach(btn => {
    btn.addEventListener("click", () => {
      itBaseSubType = btn.dataset.itSubtype;
      chips.querySelectorAll("[data-it-subtype]").forEach(b => {
        b.classList.toggle("active", b.dataset.itSubtype === itBaseSubType);
      });
      renderItemsGrid();
    });
  });
}

function renderItSubfilters() {
  const sockRow = document.getElementById("it-base-sockets-row");
  if (sockRow) {
    sockRow.style.display = itActiveTab === "base" ? "flex" : "none";
  }
  const grailRow = document.getElementById("it-grail-filter-row");
  if (grailRow) {
    grailRow.style.display = (itActiveTab === "unique" || itActiveTab === "set") ? "flex" : "none";
  }
  const uTierLbl = document.getElementById("it-unique-tier-label");
  const uTierChips = document.getElementById("it-unique-tier-chips");
  const uCountEl = document.getElementById("it-unique-count-badge");
  if (uTierLbl) uTierLbl.style.display = itActiveTab === "unique" ? "block" : "none";
  if (uTierChips) uTierChips.style.display = itActiveTab === "unique" ? "flex" : "none";
  if (uCountEl) uCountEl.style.display = itActiveTab === "unique" ? "inline" : "none";

  const dropsConsole = document.getElementById("it-drops-console");
  if (dropsConsole) {
    dropsConsole.style.display = itActiveTab === "drops" ? "flex" : "none";
  }
  const cubeSimConsole = document.getElementById("it-cube-sim-console");
  if (cubeSimConsole) {
    cubeSimConsole.style.display = itActiveTab === "cube" ? "block" : "none";
  }
  const row = document.getElementById("it-subfilter-row");
  const chips = document.getElementById("it-subfilter-chips");
  const options = IT_SUBFILTERS[itActiveTab] || [];
  if (options.length === 0) {
    row.style.display = "none";
    renderBaseSubtypeChips();
    return;
  }
  const countList = (itActiveTab === "base" && itData && itData.baseItems)
    ? itData.baseItems
    : (itActiveTab === "unique" && itData && itData.uniqueItems ? itData.uniqueItems : null);
  const countKey = itActiveTab === "base" ? "category" : "slot";
  const topCount = (id) => {
    if (!countList || !countList.length) return "";
    if (id === "all") return " (" + countList.length + ")";
    if (id === "classOnly") return " (" + countList.filter(x => x.classOnly).length + ")";
    return " (" + countList.filter(x => x[countKey] === id).length + ")";
  };
  row.style.display = "flex";
  chips.innerHTML = options.map(opt => {
    const ico = opt.icon
      ? '<img class="ui-chip-icon" src="' + escapeHtml(opt.icon) + '" alt="" />'
      : '';
    return '<button type="button" class="tz-chip' + (itSubFilter === opt.id ? ' active' : '') + '" data-it-filter="' + escapeHtml(opt.id) + '">' + ico + escapeHtml(opt.label + topCount(opt.id)) + '</button>';
  }).join("");
  chips.querySelectorAll("[data-it-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      itSubFilter = btn.dataset.itFilter;
      if (itActiveTab === "base" || itActiveTab === "unique") itBaseSubType = "all";
      chips.querySelectorAll("[data-it-filter]").forEach(b => {
        b.classList.toggle("active", b.dataset.itFilter === itSubFilter);
      });
      renderBaseSubtypeChips();
      renderItemsGrid();
    });
  });
  renderBaseSubtypeChips();
}

function renderItemsGrid() {
  const grid = document.getElementById("it-grid");
  if (!itData) {
    grid.innerHTML = '<div class="tz-empty">正在加载物品资讯...</div>';
    return;
  }

  const q = itSearchQuery.toLowerCase();
  const matchQuery = (text, itemObj) => {
    if (!q) return true;
    let hay = String(text);
    if (itemObj && itemObj.i18n) {
      hay += " " + (itemObj.i18n.zhCN || "") + " " + (itemObj.i18n.zhTW || "") + " " + (itemObj.i18n.enUS || "");
    }
    return hay.toLowerCase().includes(q);
  };
  let cardsHtml = "";

  const renderItemThumb = (icon, alt) => icon
    ? '<div class="it-thumb-wrap"><img class="it-thumb" src="' + escapeHtml(icon) + '" alt="' + escapeHtml(alt) + '" loading="lazy"></div>'
    : '';

  if (itActiveTab === "base") {
    const isZeroSock = itBaseSocketFilter === "0";
    const targetSock = (itBaseSocketFilter === "all" || isZeroSock) ? 0 : Number(itBaseSocketFilter);
    const list = (itData.baseItems || []).filter(item => {
      if (itSubFilter === "classOnly") {
        if (!item.classOnly) return false;
      } else if (itSubFilter !== "all" && item.category !== itSubFilter) {
        return false;
      }
      if (itBaseSubType !== "all" && item.subCategory !== itBaseSubType) return false;
      if (itBaseTierFilter !== "all" && item.tier !== itBaseTierFilter) return false;
      if (isZeroSock && item.maxSockets > 0) return false;
      if (targetSock > 0 && item.maxSockets < targetSock) return false;
      return matchQuery(
        item.nameZh + " " + item.nameEn + " " + item.stats + " " + item.usage + " " + item.tier +
        " " + (item.subCategoryZh || "") + " " + (item.classOnlyZh || ""),
        item
      );
    });
    const countEl = document.getElementById("it-base-count-badge");
    if (countEl) countEl.textContent = "共匹配 " + list.length + " / " + (itData.baseItems || []).length + " 件底材";
    cardsHtml = list.map(item => {
      const s = Array.isArray(item.sockets) ? item.sockets : [item.maxSockets, item.maxSockets, item.maxSockets];
      const ilvlText = s[2] > 0
        ? ("ilvl 1–25: " + s[0] + "孔 · ilvl 26–40(普通牛): " + s[1] + "孔 · ilvl 41+: " + s[2] + "孔")
        : "不可打孔（0 孔 · 蓝/黄/手工/暗金底材）";
      const offText = typeof item.officialStats === "object" && item.officialStats
        ? (item.officialStats[currentLang] || item.officialStats.zhCN)
        : item.officialStats;
      const hasCustomBlock = /格挡\s*\d+%/.test(item.stats || "");
      const baseParts = offText
        ? String(offText).split(/\s*·\s*/).map(x => x.trim()).filter(p => p && !(hasCustomBlock && /^(?:基础格挡|基礎格擋|Base Block)/.test(p)))
        : (item.reqStr > 0 ? ["需求力量 " + item.reqStr] : []).concat(item.reqDex > 0 ? ["需求敏捷 " + item.reqDex] : []);
      if (item.reqLvl > 0) baseParts.push("需求等级 " + item.reqLvl);
      const extraParts = String(item.stats || "")
        .split(/\s*(?:·|\|)\s*/)
        .map(x => x.trim())
        .filter(p => {
          if (!p) return false;
          if (offText && /^(?:基础)?防\s*\d/.test(p)) return false;
          if (offText && /^(?:基础)?防御\s*\d/.test(p)) return false;
          if (offText && /^(?:基础)?攻速\s*(?:WSM\s*)?\[/.test(p)) return false;
          if (offText && /^(?:单手|双手|投掷)伤害\s*\d/.test(p)) return false;
          if (/^ilvl\s*\d+/i.test(p) || /^\d+[–-]\d+/.test(p) || /^\d+\+\s*:/.test(p)) return false;
          if (/^(?:任何\s*ilvl\s*均)?(?:最多|全系最多|最大)?\s*\d+\s*孔$/.test(p)) return false;
          return true;
        });
      const combinedBaseStats = baseParts.concat(extraParts).join(" · ") || ("需求力量 " + item.reqStr);
      const cleanSubLabel = (item.classOnlyZh && item.subCategoryZh)
        ? item.subCategoryZh.replace(/^(?:亚马逊|刺客|法师|圣骑士|死灵法师|死灵|术士|野蛮人|德鲁伊)专用/, "").trim() || item.subCategoryZh
        : (item.subCategoryZh || "");
      const subBadge = cleanSubLabel ? ('<span class="rw-badge">' + escapeHtml(cleanSubLabel) + '</span>') : '';
      const clsBadge = item.classOnlyZh ? ('<span class="rw-badge rw-badge-class">' + escapeHtml(item.classOnlyZh) + '</span>') : '';
      return '<article class="it-card">' +
        '<div class="it-card-head">' +
          '<div class="it-card-title-row">' + renderItemThumb(item.icon, pickLangTitle(item)) +
          '<div data-no-sweep="1"><span class="it-card-title">' + escapeHtml(pickLangTitle(item)) + '</span><span class="it-card-en">' + escapeHtml(pickLangSub(item)) + '</span></div></div>' +
          '<div class="af-card-badges">' + clsBadge + subBadge + '<span class="rw-badge">' + escapeHtml(item.tier) + '</span></div>' +
        '</div>' +
        renderStatList(combinedBaseStats, "", false, "it-base-prop-stats") +
        renderStatList(ilvlText, "", false, "it-base-socket-stats") +
        '<div class="it-card-note">用途：' + escapeHtml(item.usage) + '</div>' +
      '</article>';
    }).join("");
  } else if (itActiveTab === "magicRare") {
    const list = (itData.magicRareGems || []).filter(item =>
      (itSubFilter === "all" || item.quality === itSubFilter) &&
      matchQuery(item.nameZh + " " + item.nameEn + " " + item.stats + " " + item.value + " " + item.slot, item)
    );
    cardsHtml = list.map(item =>
      '<article class="it-card it-' + escapeHtml(item.quality) + '">' +
        '<div class="it-card-head">' +
          '<div class="it-card-title-row">' + renderItemThumb(item.icon, pickLangTitle(item)) +
          '<div data-no-sweep="1"><span class="it-card-title">' + escapeHtml(pickLangTitle(item)) + '</span><span class="it-card-en">' + escapeHtml(pickLangSub(item)) + '</span></div></div>' +
          '<div class="af-card-badges"><span class="rw-badge">' + escapeHtml(item.slot) + '</span><span class="rw-badge ' + (item.quality === 'magic' ? 'af-badge-magic' : 'af-badge-rare') + '">' + (item.quality === 'magic' ? '魔法蓝装' : '亮金黄装') + '</span></div>' +
        '</div>' +
        renderStatList(item.stats, "", true) +
        '<div class="it-card-note"><img class="ui-chip-icon" src="/images/ui/coins_icon.webp" alt="">价值：' + escapeHtml(item.value) + '</div>' +
      '</article>'
    ).join("");
  } else if (itActiveTab === "set") {
    const list = (itData.setItems || []).filter(item => {
      const isGeneric = item.classZh.includes("通用");
      if (itSubFilter === "class" && isGeneric) return false;
      if (itSubFilter === "generic" && !isGeneric) return false;
      const pcs = (item.detail && item.detail.pieces) ? item.detail.pieces : [];
      const doneCount = pcs.filter(p => grailSetPieces.has(p.nameEn)).length;
      const isAllDone = pcs.length > 0 && doneCount === pcs.length;
      const hasTc87 = pcs.some(p => p.baseInfo && p.baseInfo.tc === 87);
      if (itGrailFilter === "todo" && isAllDone) return false;
      if (itGrailFilter === "done" && !isAllDone) return false;
      if (itGrailFilter === "tc87" && !hasTc87) return false;
      return matchQuery(item.nameZh + " " + item.nameEn + " " + item.classZh + " " + item.pieceList + " " + item.fullBonus + " " + item.usage, item);
    });
    cardsHtml = list.map(item => {
      const pcs = (item.detail && item.detail.pieces) ? item.detail.pieces : [];
      const doneCount = pcs.filter(p => grailSetPieces.has(p.nameEn)).length;
      const isAllDone = pcs.length > 0 && doneCount === pcs.length;
      return '<article class="it-card it-set' + (isAllDone ? ' grail-done' : '') + '" data-it-set="' + escapeHtml(item.id) + '">' +
        '<div class="it-card-head">' +
          '<div class="it-card-title-row">' +
            '<input type="checkbox" class="rw-check grail-set-check" data-grail-set="' + escapeHtml(item.id) + '" title="圣杯收集：勾选/取消整套" ' + (isAllDone ? 'checked' : '') + ' />' +
            renderItemThumb(item.icon, pickLangTitle(item)) +
            '<div data-no-sweep="1"><span class="it-card-title">' + escapeHtml(pickLangTitle(item)) + '</span><span class="it-card-en">' + escapeHtml(pickLangSub(item)) + '</span></div>' +
          '</div>' +
          '<div class="af-card-badges"><span class="rw-badge">' + escapeHtml(item.classZh) + '</span><span class="rw-badge ' + (isAllDone ? 'rw-badge-patch' : '') + '" data-grail-set-badge="' + escapeHtml(item.id) + '">' + doneCount + ' / ' + item.pieces + ' 件</span></div>' +
        '</div>' +
        '<div class="it-card-note">部件：' + escapeHtml(item.pieceList) + '</div>' +
        renderStatList(item.fullBonus, "#8af49f", true) +
        '<div class="it-card-note" style="display:flex;align-items:center;justify-content:space-between;gap:8px">' +
          '<span>定位：' + escapeHtml(item.usage) + '</span>' +
          '<button type="button" class="rw-detail-btn" style="flex:0 0 auto">查看部件详情</button>' +
        '</div>' +
      '</article>';
    }).join("");
  } else if (itActiveTab === "unique") {
    const list = (itData.uniqueItems || []).filter(item => {
      if (itSubFilter === "classOnly") {
        if (!item.classOnly) return false;
      } else if (itSubFilter !== "all" && item.slot !== itSubFilter) {
        return false;
      }
      if (itBaseSubType !== "all" && item.subCategory !== itBaseSubType) return false;
      if (itUniqueTierFilter !== "all" && (item.tierNorm || item.tier) !== itUniqueTierFilter) return false;
      const isDone = grailUniques.has(item.nameEn);
      if (itGrailFilter === "todo" && isDone) return false;
      if (itGrailFilter === "done" && !isDone) return false;
      if (itGrailFilter === "tc87" && !(item.baseInfo && item.baseInfo.tc === 87)) return false;
      return matchQuery(
        item.nameZh + " " + item.nameEn + " " + item.stats + " " + item.note + " " +
        (item.tier || "") + " " + (item.tierNorm || "") + " " + (item.subCategoryZh || "") + " " + (item.classOnlyZh || "") +
        " " + (item.baseInfo ? ((item.baseInfo.baseZhCN || "") + " " + (item.baseInfo.baseEnUS || "")) : ""),
        item
      );
    });
    const uCountEl = document.getElementById("it-unique-count-badge");
    if (uCountEl) uCountEl.textContent = "共匹配 " + list.length + " / " + (itData.uniqueItems || []).length + " 件暗金";
    cardsHtml = list.map(item => {
      const isDone = grailUniques.has(item.nameEn);
      const baseStatsStr = item.baseInfo
        ? (currentLang === "zhTW" ? (item.baseInfo.baseStatsZhTW || item.baseInfo.baseStats) : currentLang === "enUS" ? (item.baseInfo.baseStatsEnUS || item.baseInfo.baseStats) : item.baseInfo.baseStats)
        : "";
      const baseNameStr = item.baseInfo
        ? ((currentLang === "enUS" ? "Base: " : "底材：") + (currentLang === "zhTW" ? item.baseInfo.baseZhTW : currentLang === "enUS" ? item.baseInfo.baseEnUS : item.baseInfo.baseZhCN))
        : "";
      const baseLine = item.baseInfo
        ? renderStatList(baseNameStr + (baseStatsStr ? " · " + baseStatsStr : ""), "", false, "it-unique-base-stats")
        : '';
      const cleanSubLabel = (item.classOnlyZh && item.subCategoryZh)
        ? item.subCategoryZh.replace(/^(?:亚马逊|刺客|法师|圣骑士|死灵法师|死灵|术士|野蛮人|德鲁伊)专用/, "").trim() || item.subCategoryZh
        : (item.subCategoryZh || "");
      const clsBadge = item.classOnlyZh ? ('<span class="rw-badge rw-badge-class">' + escapeHtml(item.classOnlyZh) + '</span>') : '';
      const subBadge = cleanSubLabel ? ('<span class="rw-badge">' + escapeHtml(cleanSubLabel) + '</span>') : '';
      const tierBadgeTxt = item.tierNorm || item.tier || "";
      return '<article class="it-card it-unique' + (isDone ? ' grail-done' : '') + '">' +
        '<div class="it-card-head">' +
          '<div class="it-card-title-row">' +
            '<input type="checkbox" class="rw-check grail-unique-check" data-grail-unique="' + escapeHtml(item.nameEn) + '" title="圣杯收集：标记已收集" ' + (isDone ? 'checked' : '') + ' />' +
            renderItemThumb(item.icon, pickLangTitle(item)) +
            '<div data-no-sweep="1"><span class="it-card-title">' + escapeHtml(pickLangTitle(item)) + '</span><span class="it-card-en">' + escapeHtml(pickLangSub(item)) + '</span></div>' +
          '</div>' +
          '<div class="af-card-badges">' + clsBadge + subBadge + (tierBadgeTxt ? '<span class="rw-badge">' + escapeHtml(tierBadgeTxt) + '</span>' : '') + '</div>' +
        '</div>' +
        baseLine +
        renderStatList(item.stats, "", false, "it-unique-magic-stats") +
        '<div class="it-card-note" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">' +
          '<span>说明：' + escapeHtml(item.note) + '</span>' +
          '<span style="display:inline-flex;gap:6px;flex:0 0 auto">' +
            ((itData.uniqueUpgradeMeta && itData.uniqueUpgradeMeta[item.nameEn]) ? '<button type="button" class="rw-detail-btn" data-jump-upgrade="' + escapeHtml(item.nameEn) + '">升阶预览</button>' : '') +
            '<button type="button" class="rw-detail-btn" data-jump-drop="' + escapeHtml(item.nameEn) + '">查掉率</button>' +
          '</span>' +
        '</div>' +
      '</article>';
    }).join("");
  } else if (itActiveTab === "cube") {
    const list = (itData.cubeRecipes || []).filter(item =>
      matchQuery(item.title + " " + item.formula + " " + item.detail)
    );
    cardsHtml = list.map(item =>
      '<article class="it-card">' +
        '<div class="it-card-head"><span class="it-card-title" style="color:#88b3ff">' + escapeHtml(item.title) + '</span></div>' +
        '<div class="it-card-stats" style="color:#f5cf7b">' + escapeHtml(item.formula) + '</div>' +
        renderStatList(item.detail, "#d8cab5", false) +
      '</article>'
    ).join("");
  } else if (itActiveTab === "drops") {
    if (!dcData || !Array.isArray(dcData.sources)) {
      grid.innerHTML = '<div class="tz-empty">正在加载掉率计算器数据...</div>';
      return;
    }
    const uCodeMap = new Map();
    for (const code in (dcData.uniquePools || {})) {
      for (const u of dcData.uniquePools[code]) uCodeMap.set(u.nameEn, code);
    }
    const sCodeMap = new Map();
    for (const code in (dcData.setPools || {})) {
      for (const s of dcData.setPools[code]) sCodeMap.set(s.nameEn, code);
    }

    const allDropItems = [];
    if (itSubFilter === "all" || itSubFilter === "unique") {
      for (const u of (itData.uniqueItems || [])) {
        const c = uCodeMap.get(u.nameEn);
        if (c) allDropItems.push({ type: "unique", code: c, nameEn: u.nameEn, itemObj: u, icon: u.icon, badge: "暗金", color: "#e3bc6d" });
      }
    }
    if (itSubFilter === "all" || itSubFilter === "set") {
      for (const s of (itData.setItems || [])) {
        for (const p of ((s.detail && s.detail.pieces) || [])) {
          const c = sCodeMap.get(p.nameEn);
          if (c) allDropItems.push({ type: "set", code: c, nameEn: p.nameEn, itemObj: p, icon: p.icon || s.icon, badge: s.nameZh, color: "#67e87a" });
        }
      }
    }
    if (itSubFilter === "all" || itSubFilter === "rune") {
      for (const r of (rwRunes || [])) {
        const rCode = "r" + String(r.number).padStart(2, "0");
        allDropItems.push({ type: "rune", code: rCode, nameEn: r.name, itemObj: r, icon: r.icon, badge: "#" + r.number + " 符文", color: "#ff9b42" });
      }
    }
    if (itSubFilter === "all" || itSubFilter === "special") {
      for (const sp of (dcData.specialDrops || [])) {
        allDropItems.push({ type: "special", code: sp.code, nameEn: sp.nameEn, itemObj: sp, icon: sp.icon, badge: "首领专属", color: "#e284db" });
      }
    }

    const filteredItems = allDropItems.filter(entry =>
      matchQuery((entry.itemObj.nameZh || entry.itemObj.zhName || "") + " " + entry.nameEn + " " + entry.badge, entry.itemObj)
    );

    const formatOdds = (p) => {
      if (p <= 0) return null;
      const oneIn = Math.max(1, Math.round(1 / p));
      const pct = (p * 100) >= 1 ? (p * 100).toFixed(2) + "%" : (p * 100).toFixed(4) + "%";
      return { oneIn, pct };
    };

    if (dcMode === "source") {
      const src = dcData.sources.find(s => s.id === dcSourceId) || dcData.sources[0];
      const srcName = currentLang === "zhTW" ? (src.nameTw || src.nameZh) : currentLang === "enUS" ? src.nameEn : src.nameZh;
      const ranked = [];
      for (const entry of filteredItems) {
        const prob = computeSingleItemDropChance(src, entry.type, entry.code, entry.nameEn, dcMf, dcPlayers);
        if (prob > 0) ranked.push({ entry, prob });
      }
      ranked.sort((a, b) => b.prob - a.prob);
      cardsHtml = ranked.slice(0, 120).map(({ entry, prob }) => {
        const odds = formatOdds(prob);
        return '<article class="it-card it-' + escapeHtml(entry.type) + '">' +
          '<div class="it-card-head">' +
            '<div class="it-card-title-row">' +
              renderItemThumb(entry.icon, pickLangTitle(entry.itemObj)) +
              '<div data-no-sweep="1"><span class="it-card-title" style="color:' + entry.color + '">' + escapeHtml(pickLangTitle(entry.itemObj)) + '</span><span class="it-card-en">' + escapeHtml(pickLangSub(entry.itemObj)) + '</span></div>' +
            '</div>' +
            '<div class="af-card-badges"><span class="rw-badge">' + escapeHtml(entry.badge) + '</span></div>' +
          '</div>' +
          renderStatList("目标首领：" + srcName + " (mlvl " + src.mlvl + ") · 单次击杀掉率：1 / " + odds.oneIn.toLocaleString() + " (" + odds.pct + ")", "#9ad8ff", false) +
          '<div class="it-card-note" style="display:flex;align-items:center;justify-content:space-between;gap:8px">' +
            '<span>当前参数：MF ' + dcMf + '% · /players ' + dcPlayers + '</span>' +
            '<button type="button" class="rw-detail-btn" data-jump-drop="' + escapeHtml(entry.nameEn) + '">对比全部首领</button>' +
          '</div>' +
        '</article>';
      }).join("");
    } else {
      const targetList = filteredItems.slice(0, 24);
      cardsHtml = targetList.map(entry => {
        const srcRanks = [];
        for (const src of dcData.sources) {
          const prob = computeSingleItemDropChance(src, entry.type, entry.code, entry.nameEn, dcMf, dcPlayers);
          if (prob > 0) srcRanks.push({ src, prob });
        }
        srcRanks.sort((a, b) => b.prob - a.prob);
        const topLines = srcRanks.slice(0, 6).map((r, idx) => {
          const nm = currentLang === "zhTW" ? (r.src.nameTw || r.src.nameZh) : currentLang === "enUS" ? r.src.nameEn : r.src.nameZh;
          const odds = formatOdds(r.prob);
          return "#" + (idx + 1) + " " + nm + "：1 / " + odds.oneIn.toLocaleString() + " (" + odds.pct + ")";
        }).join(" · ");
        return '<article class="it-card it-' + escapeHtml(entry.type) + '">' +
          '<div class="it-card-head">' +
            '<div class="it-card-title-row">' +
              renderItemThumb(entry.icon, pickLangTitle(entry.itemObj)) +
              '<div data-no-sweep="1"><span class="it-card-title" style="color:' + entry.color + '">' + escapeHtml(pickLangTitle(entry.itemObj)) + '</span><span class="it-card-en">' + escapeHtml(pickLangSub(entry.itemObj)) + '</span></div>' +
            '</div>' +
            '<div class="af-card-badges"><span class="rw-badge">' + escapeHtml(entry.badge) + '</span></div>' +
          '</div>' +
          renderStatList(topLines || "当前难度无直接掉落", "#8af49f", false) +
          '<div class="it-card-note">最佳刷取排行（MF ' + dcMf + '% · /players ' + dcPlayers + '，共 ' + srcRanks.length + ' 个来源可掉落）</div>' +
        '</article>';
      }).join("");
    }
  }

  grid.innerHTML = cardsHtml || '<div class="tz-empty">未找到匹配的物品资料</div>';

  grid.querySelectorAll("[data-jump-drop]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const targetName = btn.dataset.jumpDrop;
      itActiveTab = "drops";
      itSubFilter = "all";
      dcMode = "item";
      itSearchQuery = targetName;
      const inp = document.getElementById("it-search-input");
      const clr = document.getElementById("it-search-clear");
      if (inp) inp.value = targetName;
      if (clr) clr.style.display = "block";
      document.querySelectorAll("#it-subtabs [data-it-tab]").forEach(b => b.classList.toggle("active", b.dataset.itTab === "drops"));
      document.querySelectorAll("#dc-mode-chips [data-dc-mode]").forEach(b => b.classList.toggle("active", b.dataset.dcMode === "item"));
      const srcRow = document.getElementById("dc-source-row");
      if (srcRow) srcRow.style.display = "none";
      renderItSubfilters();
      renderItemsGrid();
    });
  });

  grid.querySelectorAll("[data-jump-upgrade]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      cubeUpTargetName = btn.dataset.jumpUpgrade;
      itActiveTab = "cube";
      itSubFilter = "all";
      document.querySelectorAll("#it-subtabs [data-it-tab]").forEach(b => b.classList.toggle("active", b.dataset.itTab === "cube"));
      const upSel = document.getElementById("cube-up-select");
      if (upSel) upSel.value = cubeUpTargetName;
      renderCubeUpgrader();
      renderItSubfilters();
      renderItemsGrid();
    });
  });

  if (itActiveTab === "unique") {
    grid.querySelectorAll("[data-grail-unique]").forEach(cb => {
      cb.addEventListener("change", (e) => {
        const key = e.target.dataset.grailUnique;
        const checked = e.target.checked;
        if (checked) grailUniques.add(key);
        else grailUniques.delete(key);
        saveGrailState();
        renderGrailSummary();
        if (itGrailFilter === "todo" || itGrailFilter === "done") {
          renderItemsGrid();
        } else {
          const card = e.target.closest(".it-card");
          if (card) card.classList.toggle("grail-done", checked);
        }
      });
    });
  }

  if (itActiveTab === "set") {
    grid.querySelectorAll("[data-grail-set]").forEach(cb => {
      cb.addEventListener("click", (e) => e.stopPropagation());
      cb.addEventListener("change", (e) => {
        const setId = e.target.dataset.grailSet;
        const checked = e.target.checked;
        const setItem = (itData.setItems || []).find(s => s.id === setId);
        const pcs = (setItem && setItem.detail && setItem.detail.pieces) ? setItem.detail.pieces : [];
        pcs.forEach(p => {
          if (checked) grailSetPieces.add(p.nameEn);
          else grailSetPieces.delete(p.nameEn);
        });
        saveGrailState();
        renderGrailSummary();
        if (itGrailFilter === "todo" || itGrailFilter === "done") {
          renderItemsGrid();
        } else {
          const card = e.target.closest(".it-card");
          if (card) card.classList.toggle("grail-done", checked);
          const badge = grid.querySelector('[data-grail-set-badge="' + setId + '"]');
          if (badge && setItem) {
            badge.textContent = (checked ? pcs.length : 0) + " / " + setItem.pieces + " 件";
            badge.classList.toggle("rw-badge-patch", checked);
          }
        }
      });
    });
    grid.querySelectorAll("[data-it-set]").forEach(card => {
      card.addEventListener("click", () => openSetDetail(card.dataset.itSet));
    });
  }
}

function openSetDetail(setId) {
  const setItem = (itData?.setItems || []).find(s => s.id === setId);
  if (!setItem) return;
  const modal = document.getElementById("it-set-modal");
  document.getElementById("it-set-modal-title").textContent = pickLangTitle(setItem);
  document.getElementById("it-set-modal-en").textContent = pickLangSub(setItem) + " · " + setItem.classZh + "（共 " + setItem.pieces + " 件）";
  document.getElementById("it-set-modal-meta").textContent = setItem.usage;

  const detail = setItem.detail;
  if (!detail) {
    const fbParts = String(setItem.fullBonus || "").split(/\s*(?:·|\|)\s*/).map(x => x.trim()).filter(Boolean);
    document.getElementById("it-set-modal-body").innerHTML =
      '<div class="it-set-bonus-box"><h4 class="it-set-bonus-title">全套加成</h4><ul class="it-set-bonus-list">' + fbParts.map(x => '<li>★ ' + escapeHtml(x) + '</li>').join("") + '</ul></div>';
    if (typeof applyDomTraditionalSweep === "function") applyDomTraditionalSweep();
    modal.classList.add("open");
    return;
  }

  const piecesHtml = (detail.pieces || []).map(p => {
    const isPieceDone = grailSetPieces.has(p.nameEn);
    const pBaseStr = p.baseInfo
      ? (currentLang === "zhTW" ? (p.baseInfo.baseStatsZhTW || p.baseInfo.baseStats) : currentLang === "enUS" ? (p.baseInfo.baseStatsEnUS || p.baseInfo.baseStats) : p.baseInfo.baseStats)
      : "";
    const reqLvlLabel = currentLang === "zhTW" ? ("需求等級 " + p.reqLvl) : currentLang === "enUS" ? ("Req Lvl " + p.reqLvl) : ("需求等级 " + p.reqLvl);
    const rawBaseParts = pBaseStr ? String(pBaseStr).split(/\s*·\s*/).filter(Boolean) : [];
    if (p.reqLvl && !rawBaseParts.some(x => /需求等[级級]|Req Lvl/i.test(x))) {
      rawBaseParts.splice(Math.min(2, rawBaseParts.length), 0, reqLvlLabel);
    }
    const pBaseLines = rawBaseParts.map(line => '<li class="it-piece-base-line" data-no-sweep="1">' + escapeHtml(line) + '</li>').join("");
    const baseLines = pBaseLines + (p.stats || []).flatMap(line => String(line).split(/\s*·\s*/)).filter(Boolean).map(line => '<li>' + escapeHtml(line) + '</li>').join("");
    const greenLines = Array.isArray(p.setPieceBonus) && p.setPieceBonus.length > 0
      ? '<ul class="it-set-piece-bonus">' + p.setPieceBonus.flatMap(b => String(b).split(/\s*·\s*/)).filter(Boolean).map(b => '<li>+ ' + escapeHtml(b) + '</li>').join("") + '</ul>'
      : "";
    const pieceImg = p.icon
      ? '<div class="it-thumb-wrap" style="width:40px;height:40px"><img class="it-thumb" src="' + escapeHtml(p.icon) + '" alt="' + escapeHtml(p.nameZh) + '" loading="lazy"></div>'
      : '';
    return '<div class="it-set-piece' + (isPieceDone ? ' grail-done' : '') + '">' +
      '<div class="it-set-piece-head">' +
        '<div class="it-card-title-row">' +
          '<input type="checkbox" class="rw-check grail-piece-check" data-grail-piece="' + escapeHtml(p.nameEn) + '" title="圣杯收集：标记该部件已收集" ' + (isPieceDone ? 'checked' : '') + ' />' +
          pieceImg +
          '<div data-no-sweep="1"><span class="it-set-piece-title">' + escapeHtml(pickLangTitle(p)) + '</span> <span class="it-set-piece-sub">(' + escapeHtml(pickLangSub(p)) + ')</span></div>' +
        '</div>' +
        '<span class="rw-badge">' + escapeHtml(p.slotZh) + '</span>' +
      '</div>' +
      '<ul class="it-set-piece-stats">' + baseLines + '</ul>' +
      greenLines +
    '</div>';
  }).join("");

  const partialHtml = Array.isArray(detail.partialBonuses) && detail.partialBonuses.length > 0
    ? '<div class="it-set-bonus-box" style="border-color:rgba(87,219,112,0.3)">' +
        '<h4 class="it-set-bonus-title" style="color:#67e87a">部分套装凑齐加成（绿色通用效果）</h4>' +
        '<ul class="it-set-bonus-list" style="color:#8af49f">' +
          detail.partialBonuses.map(pb => (pb.stats || []).flatMap(st => String(st).split(/\s*·\s*/)).filter(Boolean).map(st => '<li><strong>【' + pb.count + ' 件】</strong> ' + escapeHtml(st) + '</li>').join("")).join("") +
        '</ul>' +
      '</div>'
    : "";

  const fullHtml = '<div class="it-set-bonus-box">' +
    '<h4 class="it-set-bonus-title">全套齐备加成（' + setItem.pieces + ' 件套完整激活）</h4>' +
    '<ul class="it-set-bonus-list">' +
      (detail.fullBonuses || []).flatMap(line => String(line).split(/\s*·\s*/)).filter(Boolean).map(line => '<li>★ ' + escapeHtml(line) + '</li>').join("") +
    '</ul>' +
  '</div>';

  const modalBody = document.getElementById("it-set-modal-body");
  modalBody.innerHTML =
    '<div class="it-set-pieces-grid">' + piecesHtml + '</div>' +
    partialHtml +
    fullHtml;

  modalBody.querySelectorAll("[data-grail-piece]").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const pieceKey = e.target.dataset.grailPiece;
      const checked = e.target.checked;
      if (checked) grailSetPieces.add(pieceKey);
      else grailSetPieces.delete(pieceKey);
      saveGrailState();
      renderGrailSummary();
      const pieceCard = e.target.closest(".it-set-piece");
      if (pieceCard) pieceCard.classList.toggle("grail-done", checked);

      const pcs = detail.pieces || [];
      const doneCount = pcs.filter(p => grailSetPieces.has(p.nameEn)).length;
      const isAllDone = pcs.length > 0 && doneCount === pcs.length;
      const outerCard = document.querySelector('[data-it-set="' + setId + '"]');
      if (outerCard) {
        outerCard.classList.toggle("grail-done", isAllDone);
        const outerCb = outerCard.querySelector("[data-grail-set]");
        if (outerCb) outerCb.checked = isAllDone;
        const outerBadge = outerCard.querySelector("[data-grail-set-badge]");
        if (outerBadge) {
          outerBadge.textContent = doneCount + " / " + setItem.pieces + " 件";
          outerBadge.classList.toggle("rw-badge-patch", isAllDone);
        }
      }
    });
  });

  if (typeof applyDomTraditionalSweep === "function") applyDomTraditionalSweep();
  modal.classList.add("open");
}

function closeSetDetail() {
  document.getElementById("it-set-modal").classList.remove("open");
}

function setupItemsEvents() {
  document.querySelectorAll("#it-subtabs [data-it-tab]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#it-subtabs [data-it-tab]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      itActiveTab = btn.dataset.itTab;
      itSubFilter = "all";
      itBaseSubType = "all";
      renderItSubfilters();
      renderItemsGrid();
    });
  });

  document.querySelectorAll("#it-grail-chips [data-grail-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#it-grail-chips [data-grail-filter]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      itGrailFilter = btn.dataset.grailFilter;
      renderItemsGrid();
    });
  });

  document.querySelectorAll("#it-unique-tier-chips [data-it-utier]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#it-unique-tier-chips [data-it-utier]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      itUniqueTierFilter = btn.dataset.itUtier;
      renderItemsGrid();
    });
  });

  const exportBtn = document.getElementById("grail-export-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const payload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        uniques: [...grailUniques],
        setPieces: [...grailSetPieces],
        runewords: [...rwCompleted]
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "d2r-holy-grail-" + new Date().toISOString().slice(0, 10) + ".json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  const importBtn = document.getElementById("grail-import-btn");
  const importFile = document.getElementById("grail-import-file");
  if (importBtn && importFile) {
    importBtn.addEventListener("click", () => importFile.click());
    importFile.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(String(reader.result || "{}"));
          if (Array.isArray(data.uniques)) setGrailUniques(new Set(data.uniques));
          if (Array.isArray(data.setPieces)) setGrailSetPieces(new Set(data.setPieces));
          saveGrailState();
          renderGrailSummary();
          renderItemsGrid();
          if (Array.isArray(data.runewords)) {
            setRwCompleted(new Set(data.runewords));
            try { localStorage.setItem(RW_STORAGE_KEY, JSON.stringify([...rwCompleted])); } catch (e) {} if (D2R.tabs.runewords && D2R.tabs.runewords.saveRwCompleted) D2R.tabs.runewords.saveRwCompleted();
            if (D2R.tabs.runewords && D2R.tabs.runewords.renderRunewordsAll) D2R.tabs.runewords.renderRunewordsAll();
          }
        } catch (err) {
          alert("导入圣杯存档失败：JSON 格式无效");
        }
        importFile.value = "";
      };
      reader.readAsText(file);
    });
  }

  const resetBtn = document.getElementById("grail-reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (grailUniques.size === 0 && grailSetPieces.size === 0) return;
      if (!confirm("确定要清空所有暗金与绿色套装的圣杯收集进度吗？")) return;
      grailUniques.clear();
      grailSetPieces.clear();
      saveGrailState();
      renderGrailSummary();
      renderItemsGrid();
    });
  }

  document.querySelectorAll("#it-base-sockets-chips [data-it-sock]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#it-base-sockets-chips [data-it-sock]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      itBaseSocketFilter = btn.dataset.itSock;
      renderItemsGrid();
    });
  });

  document.querySelectorAll("#it-base-tier-chips [data-it-tier]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#it-base-tier-chips [data-it-tier]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      itBaseTierFilter = btn.dataset.itTier;
      renderItemsGrid();
    });
  });

  document.querySelectorAll("#dc-mode-chips [data-dc-mode]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#dc-mode-chips [data-dc-mode]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      dcMode = btn.dataset.dcMode;
      const srcRow = document.getElementById("dc-source-row");
      if (srcRow) srcRow.style.display = dcMode === "source" ? "flex" : "none";
      renderItemsGrid();
    });
  });

  const dcSrcSelect = document.getElementById("dc-source-select");
  if (dcSrcSelect) {
    dcSrcSelect.addEventListener("change", (e) => {
      dcSourceId = e.target.value;
      renderItemsGrid();
    });
  }

  const dcSyncTzBtn = document.getElementById("dc-sync-tz-btn");
  if (dcSyncTzBtn) {
    dcSyncTzBtn.addEventListener("click", () => {
      dcMode = "source";
      document.querySelectorAll("#dc-mode-chips [data-dc-mode]").forEach(b => b.classList.toggle("active", b.dataset.dcMode === "source"));
      const srcRow = document.getElementById("dc-source-row");
      if (srcRow) srcRow.style.display = "flex";
      syncDcSourceToCurrentTz();
      renderItemsGrid();
    });
  }

  // #tz-jump-drops-btn is bound in core.js and invokes jumpToCurrentTzDrops() after lazy-loading this module

  const dcMfInput = document.getElementById("dc-mf-input");
  if (dcMfInput) {
    dcMfInput.addEventListener("input", () => {
      dcMf = Math.min(1200, Math.max(0, Number(dcMfInput.value) || 0));
      document.querySelectorAll("#dc-mf-presets [data-dc-mf]").forEach(b => b.classList.toggle("active", Number(b.dataset.dcMf) === dcMf));
      renderItemsGrid();
    });
  }

  document.querySelectorAll("#dc-mf-presets [data-dc-mf]").forEach(btn => {
    btn.addEventListener("click", () => {
      dcMf = Number(btn.dataset.dcMf);
      if (dcMfInput) dcMfInput.value = String(dcMf);
      document.querySelectorAll("#dc-mf-presets [data-dc-mf]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderItemsGrid();
    });
  });

  document.querySelectorAll("#dc-players-chips [data-dc-players]").forEach(btn => {
    btn.addEventListener("click", () => {
      dcPlayers = Number(btn.dataset.dcPlayers);
      document.querySelectorAll("#dc-players-chips [data-dc-players]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderItemsGrid();
    });
  });

  const searchInput = document.getElementById("it-search-input");
  const searchClear = document.getElementById("it-search-clear");
  searchInput.addEventListener("input", (e) => {
    itSearchQuery = e.target.value.trim();
    searchClear.style.display = itSearchQuery ? "block" : "none";
    renderItemsGrid();
  });
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    itSearchQuery = "";
    searchClear.style.display = "none";
    renderItemsGrid();
    searchInput.focus();
  });

  loadItemsCatalog();

  const setModal = document.getElementById("it-set-modal");
  document.getElementById("it-set-modal-close").addEventListener("click", closeSetDetail);
  document.getElementById("it-set-modal-close-btn").addEventListener("click", closeSetDetail);
  setModal.addEventListener("click", (e) => {
    if (e.target === setModal) closeSetDetail();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && setModal.classList.contains("open")) {
      closeSetDetail();
    }
  });
  const hudTzPill = document.getElementById("hud-tz-pill");
  const hudDcPill = document.getElementById("hud-dc-pill");
  if (hudTzPill) hudTzPill.addEventListener("click", () => switchMainTab("terror"));
  if (hudDcPill) hudDcPill.addEventListener("click", () => switchMainTab("dclone"));

  const backToTopBtn = document.getElementById("back-to-top-btn");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      backToTopBtn.classList.toggle("visible", window.scrollY > 360);
    }, { passive: true });
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const authDlg = document.getElementById("auth-dialog");
    if (authDlg && authDlg.open) return;
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if (e.key >= "1" && e.key <= "6") {
      const idx = Number(e.key) - 1;
      if (MAIN_TABS[idx]) {
        e.preventDefault();
        switchMainTab(MAIN_TABS[idx].id);
      }
      return;
    }
    if (e.key === "/") {
      e.preventDefault();
      const searchMap = {
        terror: "tz-search-input",
        runewords: "rw-search",
        affixes: "af-search",
        items: "it-search"
      };
      if (activeMainTab === "terror") {
        const tzBody = document.getElementById("tz-directory-body");
        const tzToggle = document.getElementById("tz-toggle-panel");
        if (tzBody && tzBody.style.display === "none" && tzToggle) {
          tzToggle.click();
        }
      }
      const targetId = searchMap[activeMainTab];
      const el = targetId ? document.getElementById(targetId) : null;
      if (el) {
        el.focus();
        el.select();
      }
    }
  });
}

/* 八大职业技能树与加点模拟器（含 3.4 新职业术士 Warlock） */

let _itInited = false;
export function init() {
  if (_itInited) return;
  _itInited = true;
  setupItemsEvents();
}
export function onActivate() {
  init();
  if (!itData) loadItemsCatalog();
  else {
    renderGrailSummary();
    renderItemsGrid();
  }
}
export function onLangChange() {
  if (itData) {
    renderGrailSummary();
    renderItemsGrid();
  }
}
export function onCloudSync() {
  loadGrailState();
  if (itData) {
    renderGrailSummary();
    renderItemsGrid();
  }
}
export async function jumpToCurrentTzDrops() {
  init();
  if (!itData) await loadItemsCatalog();
  itActiveTab = "drops";
  itSubFilter = "all";
  dcMode = "source";
  document.querySelectorAll("#it-subtabs [data-it-tab]").forEach(b => b.classList.toggle("active", b.dataset.itTab === "drops"));
  document.querySelectorAll("#dc-mode-chips [data-dc-mode]").forEach(b => b.classList.toggle("active", b.dataset.dcMode === "source"));
  const srcRow = document.getElementById("dc-source-row");
  if (srcRow) srcRow.style.display = "flex";
  syncDcSourceToCurrentTz();
  renderItSubfilters();
  renderItemsGrid();
}
export { loadItemsCatalog, renderGrailSummary, renderItemsGrid };
D2R.tabs.items = { init, onActivate, onLangChange, onCloudSync, jumpToCurrentTzDrops, loadItemsCatalog, renderGrailSummary, renderItemsGrid };
