import {
  D2R, MAIN_TABS, AUTH_CLASS_LABELS,
  RW_STORAGE_KEY, GRAIL_UNIQUE_KEY, GRAIL_SET_KEY, SK_STORAGE_KEY, PD_STORAGE_KEY,
  currentLang, setCurrentLang, activeMainTab, setActiveMainTab,
  authUser, setAuthUser,
  rwCompleted, setRwCompleted, grailUniques, setGrailUniques, grailSetPieces, setGrailSetPieces,
  skActiveClassId, setSkActiveClassId, skBuilds, setSkBuilds, pdSavedByClass, setPdSavedByClass,
  getAssetVersion, ensureI18nDictLoaded, toZhTW, toEnUS, pickLangTitle, pickLangSub,
  escapeHtml, formatTime, cloneJsonSafe
} from "./shared.js?v=09528eb701";

const TAB_MODULE_FILES = {
  runewords: "tab-runewords.js",
  affixes: "tab-affixes.js",
  items: "tab-items.js",
  skills: "tab-skills.js"
};
const tabModulePromises = new Map();

async function ensureTabModule(tabId) {
  const file = TAB_MODULE_FILES[tabId];
  if (!file) return null;
  if (D2R.tabs[tabId]) return D2R.tabs[tabId];
  if (!tabModulePromises.has(tabId)) {
    const v = getAssetVersion(file);
    const url = "./" + file + (v ? ("?v=" + encodeURIComponent(v)) : "");
    const p = import(url).then((mod) => {
      if (mod && typeof mod.init === "function") mod.init();
      return D2R.tabs[tabId] || mod;
    }).catch((err) => {
      tabModulePromises.delete(tabId);
      console.error("Failed to lazy-load tab module:", tabId, err);
      return null;
    });
    tabModulePromises.set(tabId, p);
  }
  return tabModulePromises.get(tabId);
}

const regionNames = { Asia: "亚区", Americas: "美区", Europe: "欧区" };
const progressNames = {
  1: "恐怖凝视着庇护之地",
  2: "恐怖正逼近庇护之地",
  3: "恐怖开始在庇护之地形成",
  4: "恐怖蔓延至庇护之地",
  5: "恐怖即将在庇护之地释放",
  6: "迪亚波罗已入侵庇护之地"
};
const modes = [
  { ladder: false, hardcore: false, label: "非天梯 SC" },
  { ladder: false, hardcore: true, label: "非天梯 HC" },
  { ladder: true, hardcore: false, label: "天梯 SC" },
  { ladder: true, hardcore: true, label: "天梯 HC" }
];
const regions = ["Asia", "Americas", "Europe"];
let minProgress = 1;
let autoRefreshTimer = null;
let terrorCountdownTimer = null;
let lastTerrorRenderBucket = null;
let lastTerrorBoundaryRefreshBucket = null;
let syncAgeTimer = null;
const storedAutoRefresh = localStorage.getItem("dclone-auto-refresh-enabled");
let autoRefreshEnabled = storedAutoRefresh === null || storedAutoRefresh === "true";
let autoRefreshMinutes = Number(localStorage.getItem("dclone-auto-refresh-minutes")) || 1;


const UI_I18N = {
  zhCN: {
    docTitle: "暗黑 2 重置版 · 庇护之地实时战报",
    heroTitle: "暗黑 2 重置版 · 庇护之地",
    heroSubtitle: "实时掌握恐怖地带异动与迪亚波罗克隆入侵进度 · 全 99 符文之语 · 词缀模拟 · 物品百科",
    settingsBtn: "⚙ 刷新设置",
    hudTzLabel: "当前恐怖地带",
    hudDcLabel: "地表暗黑最高进度",
    shortcutPrefix: "快捷:",
    shortcutTabs: "切页",
    shortcutSearch: "搜词条",
    tabTerror: "恐怖地带",
    tabDclone: "地表暗黑",
    tabRunewords: "符文之语/记事",
    tabAffixes: "物品词缀",
    tabItems: "物品资讯",
    tzModuleTitle: "恐怖地带监控",
    tzModuleMeta: "区域每 30 分钟切换 · 常见免疫与掉落速查",
    tzCurrentLabel: "当前恐怖区域",
    tzNextLabel: "下一阶段恐怖区域",
    dcModuleTitle: "地表暗黑进度",
    dcModuleMeta: "覆盖 2 DLC · 24 组服务器进度实时监控",
    dcFilterAll: "全部状态",
    dcFilter4: "4 阶以上",
    dcFilter5: "5 阶以上",
    dcLeg13: "1–3 平稳",
    dcLeg4: "4 警戒",
    dcLeg5: "5 临近",
    dcLeg6: "6 已触发",
    dcRefreshBtn: "刷新页面数据",
    rwModuleTitle: "符文之语 100% 记事与符文统计",
    afModuleTitle: "魔法 / 亮金 / 手工物品词缀范围与模拟",
    afModuleMeta: "蓝装极限 · 黄装多词缀 · 橙装固定配方与词缀模拟器",
    afSubRef: "词缀范围与配方速查",
    afSubSim: "物品词缀模拟器",
    itModuleTitle: "物品资讯百科（基础 / 蓝黄 / 绿装 / 暗金）",
    itModuleMeta: "参考 d2r.world · 适配 D2R 3.4 术士君临版本",
    itTabBase: "基础底材",
    itTabMagicRare: "蓝/黄极品",
    itTabSet: "绿色套装",
    itTabUnique: "暗金装备",
    itTabCube: "方块公式",
    itTabDrops: "掉率计算器",
    tabSkills: "技能模拟",
    skModuleTitle: "八大职业技能树与加点模拟器（含 3.4 新职业「术士 Warlock」）",
    skModuleMeta: "全 8 职业 240 技能 · 协同加成与法力/伤害实时演算 · 一键分享配装加点"
  },
  zhTW: {
    docTitle: "暗黑破壞神 2：獄火重生 · 庇護之地即時戰報",
    heroTitle: "暗黑 2 重製版 · 庇護之地",
    heroSubtitle: "即時掌握恐怖地帶異動與地表暗黑入侵進度 · 全 99 符文之語 · 詞綴模擬 · 物品百科",
    settingsBtn: "⚙ 重新整理設定",
    hudTzLabel: "目前恐怖地帶",
    hudDcLabel: "地表暗黑最高進度",
    shortcutPrefix: "快捷:",
    shortcutTabs: "切頁",
    shortcutSearch: "搜尋",
    tabTerror: "恐怖地帶",
    tabDclone: "地表暗黑",
    tabRunewords: "符文之語/記事",
    tabAffixes: "物品詞綴",
    tabItems: "物品資訊",
    tzModuleTitle: "恐怖地帶監控",
    tzModuleMeta: "區域每 30 分鐘切換 · 常見免疫與掉落速查",
    tzCurrentLabel: "目前恐怖區域",
    tzNextLabel: "下一階段恐怖區域",
    dcModuleTitle: "地表暗黑進度",
    dcModuleMeta: "涵蓋 2 DLC · 24 組伺服器進度即時監控",
    dcFilterAll: "全部狀態",
    dcFilter4: "4 階以上",
    dcFilter5: "5 階以上",
    dcLeg13: "1–3 平穩",
    dcLeg4: "4 警戒",
    dcLeg5: "5 臨近",
    dcLeg6: "6 已觸發",
    dcRefreshBtn: "重新整理頁面資料",
    rwModuleTitle: "符文之語 100% 記事與符文統計",
    afModuleTitle: "魔法 / 亮金 / 手工物品詞綴範圍與模擬",
    afModuleMeta: "藍裝極限 · 黃裝多詞綴 · 橙裝固定配方與詞綴模擬器",
    afSubRef: "詞綴範圍與配方速查",
    afSubSim: "物品詞綴模擬器",
    itModuleTitle: "物品資訊百科（基礎 / 藍黃 / 綠裝 / 暗金）",
    itModuleMeta: "參考 d2r.world · 適配 D2R 3.4 術士君臨版本",
    itTabBase: "基礎底材",
    itTabMagicRare: "藍/黃極品",
    itTabSet: "綠色套裝",
    itTabUnique: "暗金裝備",
    itTabCube: "方塊公式",
    itTabDrops: "掉率計算器",
    tabSkills: "技能模擬",
    skModuleTitle: "八大職業技能樹與配點模擬器（含 3.4 新職業「術士 Warlock」）",
    skModuleMeta: "全 8 職業 240 技能 · 協同加成與法力/傷害即時演算 · 一鍵分享配點"
  },
  enUS: {
    docTitle: "Diablo II: Resurrected · Sanctuary Live",
    heroTitle: "Diablo II: Resurrected · Sanctuary",
    heroSubtitle: "Live Terror Zones & Diablo Clone Tracker · 99 Runewords · Affix Simulator · Items DB",
    settingsBtn: "⚙ Settings",
    hudTzLabel: "Terror Zone",
    hudDcLabel: "Hottest DClone",
    shortcutPrefix: "Keys:",
    shortcutTabs: "Tabs",
    shortcutSearch: "Search",
    tabTerror: "Terror Zones",
    tabDclone: "Diablo Clone",
    tabRunewords: "Runewords",
    tabAffixes: "Item Affixes",
    tabItems: "Items DB",
    tzModuleTitle: "Terror Zone Tracker",
    tzModuleMeta: "Rotates every 30 min · Immunities & Tier Ratings",
    tzCurrentLabel: "Current Terror Zone",
    tzNextLabel: "Next Terror Zone",
    dcModuleTitle: "Diablo Clone Progress",
    dcModuleMeta: "2 Expansions · 24 Live Server Trackers",
    dcFilterAll: "All Stages",
    dcFilter4: "Stage 4+",
    dcFilter5: "Stage 5+",
    dcLeg13: "1–3 Calm",
    dcLeg4: "4 Alert",
    dcLeg5: "5 Imminent",
    dcLeg6: "6 Spawned",
    dcRefreshBtn: "Refresh Data",
    rwModuleTitle: "Runewords 100% Tracker & Rune Counter",
    afModuleTitle: "Magic / Rare / Crafted Affixes & Simulator",
    afModuleMeta: "Magic Caps · Rare Multi-Affix · Crafted Recipes & Simulator",
    afSubRef: "Affix Ranges & Recipes",
    afSubSim: "Affix Simulator",
    itModuleTitle: "Items Encyclopedia (Bases / Magic / Sets / Uniques)",
    itModuleMeta: "D2R 3.4 Reign of the Warlock · Official Stats & Icons",
    itTabBase: "Base Items",
    itTabMagicRare: "Magic & Rare",
    itTabSet: "Set Items",
    itTabUnique: "Uniques",
    itTabCube: "Cube Recipes",
    itTabDrops: "Drop Calc",
    tabSkills: "Skill Planner",
    skModuleTitle: "8-Class Skill Tree & Build Planner (incl. 3.4 Warlock)",
    skModuleMeta: "All 8 Classes & 240 Skills · Live Synergies, Mana & Damage · Shareable Build Links"
  }
};

function tUI(key) {
  return (UI_I18N[currentLang] && UI_I18N[currentLang][key]) || UI_I18N.zhCN[key] || key;
}

function colorFor(progress) {
  if (progress >= 6) return "#da4b38";
  if (progress >= 5) return "#e97832";
  if (progress >= 4) return "#d5a748";
  return "#8e8375";
}

function serverCell(server, mode) {
  if (!server) return '<div class="cell"><div class="message">' + (currentLang === "enUS" ? "No Data" : "暂无数据") + '</div></div>';
  const bars = Array.from({ length: 6 }, (_, index) =>
    '<span class="bar ' + (index < server.progress ? "on" : "") + '"></span>'
  ).join("");
  const filtered = server.progress < minProgress ? " filtered" : "";
  const modeLabel = currentLang === "enUS"
    ? (mode.ladder ? "Ladder " : "Non-Ladder ") + (mode.hardcore ? "HC" : "SC")
    : (currentLang === "zhTW" ? toZhTW(mode.label) : mode.label);
  const progMsg = currentLang === "enUS"
    ? ("Stage " + server.progress + "/6")
    : (currentLang === "zhTW" ? toZhTW(progressNames[server.progress] || "未知状态") : (progressNames[server.progress] || "未知状态"));
  const updLabel = currentLang === "enUS" ? "Updated " : (currentLang === "zhTW" ? "更新 " : "更新 ");
  const walkLabel = currentLang === "enUS" ? "Last Walk " : (currentLang === "zhTW" ? "上次觸發 " : "上次触发 ");
  return '<article class="cell' + filtered + '" style="--accent:' + colorFor(server.progress) + '">' +
    '<div class="card-top"><span class="mode">' + modeLabel + '</span><span class="level">' +
    server.progress + '/6</span></div><div class="progress">' + bars + '</div>' +
    '<div class="message">' + escapeHtml(progMsg) + '</div>' +
    '<div class="times">' + updLabel + formatTime(server.lastUpdate) +
    '<br>' + walkLabel + formatTime(server.lastWalk) + '</div></article>';
}

function renderDlc(servers, rotw, title) {
  const subset = servers.filter(server => server.rotw === rotw);
  const displayTitle = currentLang === "enUS"
    ? (rotw ? "Reign of the Warlock" : "Lord of Destruction")
    : (currentLang === "zhTW" ? toZhTW(title) : title);
  const cornerLabel = currentLang === "enUS" ? "Region" : (currentLang === "zhTW" ? "區域" : "区域");
  let grid = '<div class="corner">' + cornerLabel + '</div>' +
    modes.map(mode => '<div class="col-head">' + (currentLang === "enUS" ? ((mode.ladder ? "Ladder " : "NL ") + (mode.hardcore ? "HC" : "SC")) : (currentLang === "zhTW" ? toZhTW(mode.label) : mode.label)) + '</div>').join("");
  let mobile = "";
  for (const region of regions) {
    const regLabel = currentLang === "enUS" ? region : (currentLang === "zhTW" ? toZhTW(regionNames[region]) : regionNames[region]);
    grid += '<div class="region">' + regLabel + '</div>';
    let mobileCells = "";
    for (const mode of modes) {
      const server = subset.find(item =>
        item.region.replace(/Rotw$/i, "") === region &&
        item.ladder === mode.ladder &&
        item.hardcore === mode.hardcore
      );
      grid += serverCell(server, mode);
      mobileCells += serverCell(server, mode);
    }
    mobile += '<section class="mobile-region"><h3 class="mobile-region-title">' +
      regLabel + '</h3><div class="mobile-region-grid">' +
      mobileCells + '</div></section>';
  }
  const visible = subset.filter(server => server.progress >= minProgress).length;
  return '<section class="dlc"><header class="dlc-head"><h2>' + displayTitle +
    '</h2><span class="dlc-count">' + visible + (currentLang === "enUS" ? ' / 12 visible' : (currentLang === "zhTW" ? ' / 12 項顯示' : ' / 12 项显示')) + '</span></header>' +
    '<div class="matrix-wrap"><div class="matrix">' + grid + '</div></div>' +
    '<div class="mobile-matrix">' + mobile + '</div></section>';
}

function updateSanctuaryHud(data) {
  const tzNameEl = document.getElementById("hud-tz-name");
  const tzTimerEl = document.getElementById("hud-tz-timer");
  const dcHotEl = document.getElementById("hud-dc-hot");
  const dcLevelEl = document.getElementById("hud-dc-level");
  const dcPillEl = document.getElementById("hud-dc-pill");
  if (!tzNameEl || !dcHotEl) return;

  const tz = resolveEffectiveTerrorZone(data?.terrorZone);
  if (tz && (tz.currentZh || tz.current)) {
    tzNameEl.textContent = currentLang === "enUS"
      ? (tz.current || tz.currentZh)
      : (currentLang === "zhTW" ? toZhTW(tz.currentZh || tz.current) : (tz.currentZh || tz.current));
  }
  const mainCountdown = document.getElementById("terror-countdown");
  if (tzTimerEl && mainCountdown && mainCountdown.textContent) {
    tzTimerEl.textContent = mainCountdown.textContent;
  }

  const servers = Array.isArray(data?.servers) ? data.servers : [];
  if (servers.length > 0) {
    const sorted = [...servers].sort((a, b) => (b.progress || 0) - (a.progress || 0));
    const top = sorted[0];
    const prog = Number(top.progress || 0);
    const reg = regionNames[top.region.replace(/Rotw$/i, "")] || top.region;
    const ver = top.rotw ? "术士" : "毁灭";
    const modeText = (top.ladder ? "天梯" : "非天") + (top.hardcore ? "HC" : "SC");
    dcHotEl.textContent = ver + " · " + reg + " " + modeText;
    dcLevelEl.textContent = prog + "/6";
    dcLevelEl.classList.toggle("hot", prog >= 4);
    dcPillEl.classList.toggle("hud-hot", prog >= 4);
  }
}

function render(data) {
  window.dashboardData = data;
  renderTerrorZone(data.terrorZone);
  updateSanctuaryHud(data);
  if (Array.isArray(data.terrorZoneHistory)) {
    tzHistory = data.terrorZoneHistory;
    renderTzHistory();
  }
  document.getElementById("content").innerHTML =
    renderDlc(data.servers, true, "术士君临") +
    renderDlc(data.servers, false, "毁灭之王");
  updateSyncAge();
  if (syncAgeTimer) clearInterval(syncAgeTimer);
  syncAgeTimer = setInterval(updateSyncAge, 1000);
  document.getElementById("live-dot").classList.add("live");
  if (typeof evaluatePersonalAlerts === "function") {
    evaluatePersonalAlerts(data);
  }
}

/* Terror Zone Directory & History Query Logic */
const IMMUNITY_ICON_MAP = {
  f: "/images/ui/immune_fire.webp",
  c: "/images/ui/immune_ice.webp",
  l: "/images/ui/immune_lightning.webp",
  p: "/images/ui/immune_poison.webp",
  ph: "/images/ui/immune_physical.webp",
  m: "/images/ui/immune_magic.webp"
};

const IMMUNITY_NAME_MAP = {
  f: "火焰",
  c: "冰冷",
  l: "闪电",
  p: "毒素",
  ph: "物理",
  m: "魔法"
};

function renderImmunityIconBadge(imm) {
  const code = (typeof imm === "string" ? imm : (imm?.code || "")).toLowerCase();
  const name = (typeof imm === "object" && imm?.name) || IMMUNITY_NAME_MAP[code] || "未知";
  const iconSrc = IMMUNITY_ICON_MAP[code] || ((typeof imm === "object" && typeof imm?.icon === "string" && imm.icon.startsWith("/")) ? imm.icon : "/images/ui/immune_physical.webp");
  const label = escapeHtml(name + "免疫");
  const codeClass = code ? " immunity-" + escapeHtml(code) : "";
  return '<span class="terror-badge immunity-badge' + codeClass +
    '" data-tip="' + label + '" title="' + label + '" aria-label="' + label + '">' +
    '<img class="ui-imm-icon" src="' + escapeHtml(iconSrc) + '" alt="' + label + '" />' +
    '<span class="ui-imm-text">' + escapeHtml(name) + '</span>' +
  '</span>';
}

let tzCatalog = [];
let tzHistory = [];
let tzActiveTab = "catalog";
let tzSearchQuery = "";
let tzFilterAct = "all";
let tzFilterRating = "all";
let tzFilterImmunity = "all";
let tzPanelOpen = localStorage.getItem("dclone-tz-panel-open") === "true";

function updateTzPanelToggle() {
  const body = document.getElementById("tz-directory-body");
  const icon = document.getElementById("tz-toggle-icon");
  const toggle = document.getElementById("tz-toggle-panel");
  if (tzPanelOpen) {
    body.style.display = "block";
    icon.textContent = "▲ 收起查询";
    toggle.setAttribute("aria-expanded", "true");
  } else {
    body.style.display = "none";
    icon.textContent = "▼ 展开查询";
    toggle.setAttribute("aria-expanded", "false");
  }
}

function toggleTzPanel() {
  tzPanelOpen = !tzPanelOpen;
  localStorage.setItem("dclone-tz-panel-open", String(tzPanelOpen));
  updateTzPanelToggle();
}

async function loadTzCatalog() {
  try {
    const response = await fetch("/api/terror-zones", { cache: "no-store" });
    const data = await response.json();
    if (data.ok && Array.isArray(data.terrorZones)) {
      tzCatalog = data.terrorZones;
      document.getElementById("tz-catalog-count").textContent = tzCatalog.length;
      renderTzCatalog();
      if (typeof renderAlertTzZonesGrid === "function") renderAlertTzZonesGrid();
    }
  } catch (err) {
    console.error("加载恐怖地带图鉴失败", err);
  }
}

function renderTzCatalog() {
  const container = document.getElementById("tz-catalog-grid");
  if (!tzCatalog || tzCatalog.length === 0) {
    container.innerHTML = '<div class="tz-empty">正在加载恐怖地带图鉴...</div>';
    return;
  }

  const filtered = tzCatalog.filter(item => {
    if (tzFilterAct !== "all" && String(item.act) !== String(tzFilterAct)) {
      return false;
    }
    if (tzFilterRating !== "all") {
      if (tzFilterRating === "S" && item.rating !== "S" && item.rating !== "S-A") return false;
      if (tzFilterRating === "A" && item.rating !== "A" && item.rating !== "S-A") return false;
      if (tzFilterRating === "B" && item.rating !== "B") return false;
      if (tzFilterRating === "C" && item.rating !== "C") return false;
      if (tzFilterRating === "F" && item.rating !== "F") return false;
    }
    if (tzFilterImmunity !== "all") {
      if (!item.immunities?.some(imm => imm.code === tzFilterImmunity)) {
        return false;
      }
    }
    if (tzSearchQuery) {
      const q = tzSearchQuery.toLowerCase();
      const matchZh = item.zoneZh.toLowerCase().includes(q);
      const matchEn = item.zone.toLowerCase().includes(q);
      if (!matchZh && !matchEn) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="tz-empty">未找到匹配的恐怖地带</div>';
    return;
  }

  container.innerHTML = filtered.map(item => {
    const ratingClass = item.rating
      ? " rating-" + escapeHtml(String(item.rating).toLowerCase().replace(/[^a-z0-9]/g, "-"))
      : "";
    const ratingBadge = item.rating
      ? '<span class="terror-badge terror-rating' + ratingClass + '">' +
        (currentLang === "enUS" ? "Tier " + escapeHtml(item.rating) : "评级 " + escapeHtml(item.rating) + " · " + escapeHtml(item.ratingText)) +
        '</span>'
      : '<span class="terror-badge terror-rating">' + (currentLang === "enUS" ? "Unrated" : "未评级") + '</span>';

    const immunityBadges = item.immunities?.length
      ? item.immunities.map(renderImmunityIconBadge).join("")
      : '<span class="terror-detail-label" style="font-size:11px">' + (currentLang === "enUS" ? "No Immunities" : "无常见免疫") + '</span>';

    const tzTitle = currentLang === "enUS" ? item.zone : item.zoneZh;
    const tzSub = currentLang === "enUS" ? item.zoneZh : item.zone;
    const actLabel = currentLang === "enUS" ? ("Act " + (item.act || 1)) : item.actName;
    const isFav = typeof isTzZoneStarred === "function" && isTzZoneStarred(item.zone);
    return '<div class="tz-catalog-card">' +
      '<div class="tz-card-head">' +
        '<span class="tz-act-badge">' + escapeHtml(actLabel) + '</span>' +
        '<div style="display:inline-flex;align-items:center;gap:5px">' +
          ratingBadge +
          '<button type="button" class="tz-fav-btn' + (isFav ? ' active' : '') + '" data-tz-fav="' + escapeHtml(item.zone) + '" title="订阅/取消该恐怖地带桌面与声音提醒">' + (isFav ? '★ 已关注' : '☆ 提醒') + '</button>' +
        '</div>' +
      '</div>' +
      '<div>' +
        '<h4 class="tz-card-title">' + escapeHtml(tzTitle) + '</h4>' +
        '<div class="tz-card-en">' + escapeHtml(tzSub) + '</div>' +
      '</div>' +
      '<div class="tz-card-footer">' +
        immunityBadges +
      '</div>' +
    '</div>';
  }).join("");
  container.querySelectorAll("[data-tz-fav]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (typeof toggleFavoriteTzZone === "function") toggleFavoriteTzZone(btn.dataset.tzFav);
    });
  });
}

function renderTzHistory() {
  const container = document.getElementById("tz-history-container");
  const countSpan = document.getElementById("tz-history-count");
  countSpan.textContent = tzHistory.length;

  if (!tzHistory || tzHistory.length === 0) {
    container.innerHTML = '<div class="tz-empty">暂无历史轮换记录（Worker 同步后将自动在此记录）</div>';
    return;
  }

  const filtered = tzHistory.filter(item => {
    if (tzFilterAct !== "all" && String(item.act) !== String(tzFilterAct)) {
      return false;
    }
    if (tzFilterRating !== "all") {
      if (tzFilterRating === "S" && item.rating !== "S" && item.rating !== "S-A") return false;
      if (tzFilterRating === "A" && item.rating !== "A" && item.rating !== "S-A") return false;
      if (tzFilterRating === "B" && item.rating !== "B") return false;
      if (tzFilterRating === "C" && item.rating !== "C") return false;
      if (tzFilterRating === "F" && item.rating !== "F") return false;
    }
    if (tzFilterImmunity !== "all") {
      if (!item.immunities?.some(imm => imm.code === tzFilterImmunity)) {
        return false;
      }
    }
    if (tzSearchQuery) {
      const q = tzSearchQuery.toLowerCase();
      const matchZh = (item.zoneZh || "").toLowerCase().includes(q);
      const matchEn = (item.zone || "").toLowerCase().includes(q);
      if (!matchZh && !matchEn) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="tz-empty">未找到匹配的历史记录</div>';
    return;
  }

  container.innerHTML = filtered.map(item => {
    const timeStr = item.time ? formatTime(new Date(item.time).getTime() / 1000) : "未知时间";
    const ratingClass = item.rating
      ? " rating-" + escapeHtml(String(item.rating).toLowerCase().replace(/[^a-z0-9]/g, "-"))
      : "";
    const ratingBadge = item.rating
      ? '<span class="terror-badge terror-rating' + ratingClass + '">' +
        (currentLang === "enUS" ? "Tier " + escapeHtml(item.rating) : "评级 " + escapeHtml(item.rating) + " · " + escapeHtml(item.ratingText)) +
        '</span>'
      : '<span class="terror-badge terror-rating">' + (currentLang === "enUS" ? "Unrated" : "未评级") + '</span>';

    const immunityBadges = item.immunities?.length
      ? item.immunities.map(renderImmunityIconBadge).join("")
      : '';

    const histAct = currentLang === "enUS" ? ("Act " + (item.act || 1)) : (item.actName || ("Act " + (item.act || 1)));
    const histName = currentLang === "enUS" ? (item.zone || item.zoneZh) : (item.zoneZh || item.zone);
    return '<div class="tz-history-item">' +
      '<div class="tz-history-main">' +
        '<span class="tz-history-time">' + escapeHtml(timeStr) + '</span>' +
        '<span class="tz-act-badge">' + escapeHtml(histAct) + '</span>' +
        '<span class="tz-history-name">' + escapeHtml(histName) + '</span>' +
      '</div>' +
      '<div class="tz-history-badges">' +
        ratingBadge +
        immunityBadges +
      '</div>' +
    '</div>';
  }).join("");
}

function switchTzTab(tabName) {
  tzActiveTab = tabName;
  document.getElementById("tab-btn-catalog").classList.toggle("active", tabName === "catalog");
  document.getElementById("tab-btn-history").classList.toggle("active", tabName === "history");
  document.getElementById("tz-catalog-view").style.display = tabName === "catalog" ? "block" : "none";
  document.getElementById("tz-history-view").style.display = tabName === "history" ? "block" : "none";
  if (tabName === "catalog") renderTzCatalog();
  if (tabName === "history") renderTzHistory();
}

function updateTzSearch(query) {
  tzSearchQuery = query.trim();
  const clearBtn = document.getElementById("tz-search-clear");
  clearBtn.style.display = tzSearchQuery ? "block" : "none";
  if (tzActiveTab === "catalog") renderTzCatalog();
  if (tzActiveTab === "history") renderTzHistory();
}

function setupTzDirectoryEvents() {
  document.getElementById("tz-toggle-panel").addEventListener("click", toggleTzPanel);
  
  document.querySelectorAll("[data-tz-tab]").forEach(btn => {
    btn.addEventListener("click", () => switchTzTab(btn.dataset.tzTab));
  });

  const searchInput = document.getElementById("tz-search-input");
  const searchClear = document.getElementById("tz-search-clear");
  searchInput.addEventListener("input", (e) => updateTzSearch(e.target.value));
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    updateTzSearch("");
    searchInput.focus();
  });

  document.querySelectorAll("#tz-act-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#tz-act-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      tzFilterAct = btn.dataset.act;
      if (tzActiveTab === "catalog") renderTzCatalog();
      if (tzActiveTab === "history") renderTzHistory();
    });
  });

  document.querySelectorAll("#tz-rating-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#tz-rating-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      tzFilterRating = btn.dataset.rating;
      if (tzActiveTab === "catalog") renderTzCatalog();
      if (tzActiveTab === "history") renderTzHistory();
    });
  });

  document.querySelectorAll("#tz-immunity-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#tz-immunity-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      tzFilterImmunity = btn.dataset.immunity;
      if (tzActiveTab === "catalog") renderTzCatalog();
      if (tzActiveTab === "history") renderTzHistory();
    });
  });

  updateTzPanelToggle();
  loadTzCatalog();
}

/* 主 Tab（恐怖地带 / 地表暗黑 / 符文之语 100% 记事 / 物品词缀范围 / 物品资讯百科）切换逻辑 */

function resolveMainTabFromHash(hashValue) {
  const hash = (hashValue || "").toLowerCase();
  if (hash === "#terror" || hash === "#terror-zone" || hash === "#tz") return "terror";
  if (hash === "#dclone" || hash === "#dc" || hash === "#diablo-clone") return "dclone";
  if (hash === "#runewords" || hash === "#rw" || hash === "#runeword") return "runewords";
  if (hash === "#affixes" || hash === "#affix" || hash === "#craft") return "affixes";
  if (hash === "#items" || hash === "#item" || hash === "#db") return "items";
  if (hash === "#skills" || hash === "#skill" || hash.startsWith("#skills:")) return "skills";
  return null;
}

function switchMainTab(tabId, updateHash = true) {
  const targetTab = MAIN_TABS.find(item => item.id === tabId) || MAIN_TABS[0];
  setActiveMainTab(targetTab.id);
  document.body.setAttribute("data-tab", targetTab.id);
  try {
    localStorage.setItem("dclone-active-tab", targetTab.id);
  } catch (e) {}

  for (const item of MAIN_TABS) {
    const isSelected = item.id === targetTab.id;
    const tabEl = document.getElementById(item.tabId);
    const panelEl = document.getElementById(item.panelId);
    if (tabEl && panelEl) {
      tabEl.classList.toggle("active", isSelected);
      tabEl.setAttribute("aria-selected", String(isSelected));
      panelEl.classList.toggle("active", isSelected);
    }
  }

  if (["runewords", "affixes", "items", "skills"].includes(targetTab.id)) {
    ensureTabModule(targetTab.id).then(mod => { if (mod && typeof mod.onActivate === "function") mod.onActivate(); });
  }

  if (updateHash) {
    if (window.location.hash !== targetTab.hash) {
      try {
        history.replaceState(null, "", targetTab.hash);
      } catch (e) {
        window.location.hash = targetTab.hash;
      }
    }
  }
}

function initMainTabs() {
  let initialTab = "terror";
  try {
    initialTab = localStorage.getItem("dclone-active-tab") || "terror";
  } catch (e) {}

  const hashTab = resolveMainTabFromHash(window.location.hash);
  if (hashTab) {
    initialTab = hashTab;
  }

  switchMainTab(initialTab, false);

  const tabElements = MAIN_TABS.map(item => ({
    id: item.id,
    el: document.getElementById(item.tabId)
  })).filter(item => item.el);

  tabElements.forEach((item, index) => {
    item.el.addEventListener("click", () => switchMainTab(item.id));
    item.el.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const delta = e.key === "ArrowRight" ? 1 : -1;
        const nextIndex = (index + delta + tabElements.length) % tabElements.length;
        tabElements[nextIndex].el.focus();
        switchMainTab(tabElements[nextIndex].id);
      }
    });
  });

  window.addEventListener("hashchange", () => {
    const nextHashTab = resolveMainTabFromHash(window.location.hash);
    if (nextHashTab) {
      switchMainTab(nextHashTab, false);
    }
  });
}


function updateSyncAge() {
  const checkedAt = window.dashboardData?.checkedAt;
  if (!checkedAt) return;
  const checked = new Date(checkedAt);
  const ageSeconds = Math.max(0, Math.floor((Date.now() - checked.getTime()) / 1000));
  const ageText = ageSeconds < 60
    ? ageSeconds + " 秒前"
    : Math.floor(ageSeconds / 60) + " 分钟前";
  document.getElementById("checked-at").textContent =
    "展示数据最近变更：" + checked.toLocaleString("zh-CN", {
      timeZone: "Asia/Shanghai", hour12: false
    }) + "（" + ageText + "）";
}

const TZ_HALF_HOUR_MS = 30 * 60 * 1000;
const TZ_PRE_SWITCH_ALERT_MS = 5 * 60 * 1000;

function resolveEffectiveTerrorZone(terrorZone, now = Date.now()) {
  if (!terrorZone) return null;
  const checkedAt = new Date(terrorZone.checkedAt).getTime();
  const deltaBuckets = Number.isFinite(checkedAt)
    ? Math.floor(now / TZ_HALF_HOUR_MS) - Math.floor(checkedAt / TZ_HALF_HOUR_MS)
    : 0;

  if (deltaBuckets <= 0 && !terrorZone.awaitingNext) {
    return {
      ...terrorZone,
      isRolledOver: false,
      awaitingNext: false,
      isStale: false
    };
  }
  if (terrorZone.isRolledOver && deltaBuckets <= 1) {
    return {
      ...terrorZone,
      next: null,
      nextZh: null,
      nextDetails: null,
      isRolledOver: true,
      awaitingNext: true,
      isStale: false
    };
  }
  if (deltaBuckets === 1 && terrorZone.next) {
    return {
      ...terrorZone,
      current: terrorZone.next,
      currentZh: terrorZone.nextZh || terrorZone.next,
      currentDetails: terrorZone.nextDetails || null,
      next: null,
      nextZh: null,
      nextDetails: null,
      isRolledOver: true,
      awaitingNext: true,
      isStale: false
    };
  }
  return {
    ...terrorZone,
    next: null,
    nextZh: null,
    nextDetails: null,
    isRolledOver: false,
    awaitingNext: true,
    isStale: deltaBuckets >= 2
  };
}

function renderTerrorZone(terrorZone) {
  const now = Date.now();
  lastTerrorRenderBucket = Math.floor(now / TZ_HALF_HOUR_MS);
  const eff = resolveEffectiveTerrorZone(terrorZone, now);
  const pickTz = (zh, en) => currentLang === "enUS" ? (en || zh) : (currentLang === "zhTW" ? toZhTW(zh || en) : (zh || en));
  const current = pickTz(eff?.currentZh, eff?.current);
  const next = pickTz(eff?.nextZh, eff?.next);
  const isConfirmed = Boolean(eff && !eff.awaitingNext);
  const nextPendingTitle = currentLang === "enUS"
    ? "Fetching next zone…"
    : (currentLang === "zhTW" ? "正在獲取下一階段…" : "正在获取下一阶段…");
  const nextPendingSub = currentLang === "enUS"
    ? "Waiting for upstream announcement"
    : (currentLang === "zhTW" ? "等待上游介面公布最新預告（約 1–2 分鐘）" : "等待上游接口公布最新预告（约 1–2 分钟）");
  const nextPendingDetail = currentLang === "enUS"
    ? "Syncing next period data…"
    : (currentLang === "zhTW" ? "正在獲取下一階段數據…" : "正在获取下一阶段数据…");

  document.getElementById("terror-current").textContent = current || "等待数据…";
  document.getElementById("terror-current-original").textContent =
    eff?.current && eff.current !== current ? eff.current : "";
  renderTerrorDetails(
    "terror-current-details",
    eff?.currentDetails,
    "暂无资料"
  );
  document.getElementById("terror-updated").textContent =
    eff?.checkedAt
      ? (isConfirmed
          ? "已确认 · " + formatTime(new Date(eff.checkedAt).getTime() / 1000)
          : (eff.isRolledOver
              ? "根据上一轮预测即时切换 · 等待下一阶段同步"
              : "数据同步中 · 上次确认 " + formatTime(new Date(eff.checkedAt).getTime() / 1000)))
      : "";
  document.getElementById("terror-next").textContent = isConfirmed
    ? (next || "等待数据…")
    : nextPendingTitle;
  document.getElementById("terror-next-original").textContent = isConfirmed
    ? (eff?.next && eff.next !== next ? eff.next : "")
    : nextPendingSub;
  renderTerrorDetails(
    "terror-next-details",
    isConfirmed ? eff?.nextDetails : null,
    isConfirmed ? "暂无资料" : nextPendingDetail
  );
  updateTerrorCountdown();
  if (terrorCountdownTimer) clearInterval(terrorCountdownTimer);
  terrorCountdownTimer = setInterval(updateTerrorCountdown, 1000);
}

function isAwaitingTerrorConfirmation(terrorZone, now = Date.now()) {
  if (!terrorZone) return false;
  if (terrorZone.awaitingNext) return true;
  const checkedAt = new Date(terrorZone.checkedAt).getTime();
  return Number.isFinite(checkedAt) &&
    Math.floor(now / TZ_HALF_HOUR_MS) > Math.floor(checkedAt / TZ_HALF_HOUR_MS);
}

function renderTerrorDetails(elementId, details, fallback = "暂无资料") {
  const element = document.getElementById(elementId);
  if (!details) {
    element.innerHTML = '<span class="terror-detail-label">' + fallback + '</span>';
    return;
  }

  const immunityBadges = details.immunities?.length
    ? details.immunities.map(renderImmunityIconBadge).join("")
    : '<span class="terror-detail-label">未标注常见免疫</span>';
  
  const ratingClass = details.rating
    ? " rating-" + escapeHtml(String(details.rating).toLowerCase().replace(/[^a-z0-9]/g, "-"))
    : "";
  const rating = details.rating
    ? '<span class="terror-badge terror-rating' + ratingClass + '">评级 ' +
      escapeHtml(details.rating) + ' · ' + escapeHtml(details.ratingText) + '</span>'
    : '<span class="terror-badge terror-rating">未评级</span>';
  element.innerHTML =
    '<span class="terror-detail-label">常见免疫</span>' + immunityBadges + rating;
}

function updateTerrorCountdown() {
  const now = Date.now();
  const currentBucket = Math.floor(now / TZ_HALF_HOUR_MS);
  const nextBoundary = (currentBucket + 1) * TZ_HALF_HOUR_MS;
  const remaining = Math.max(0, nextBoundary - now);
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const countdownText =
    "距切换 " + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  const countdownEl = document.getElementById("terror-countdown");
  if (countdownEl) countdownEl.textContent = countdownText;
  const hudTimerEl = document.getElementById("hud-tz-timer");
  if (hudTimerEl) hudTimerEl.textContent = countdownText;

  // 整点 / 半点一到，前端零延迟立刻切换「目前恐怖区域」并将下一阶段置为「正在获取」
  if (window.dashboardData?.terrorZone && lastTerrorRenderBucket !== null && currentBucket !== lastTerrorRenderBucket) {
    renderTerrorZone(window.dashboardData.terrorZone);
    updateSanctuaryHud(window.dashboardData);
    if (typeof evaluatePersonalAlerts === "function") {
      evaluatePersonalAlerts(window.dashboardData);
    }
    if (lastTerrorBoundaryRefreshBucket !== currentBucket) {
      lastTerrorBoundaryRefreshBucket = currentBucket;
      if (autoRefreshTimer) clearTimeout(autoRefreshTimer);
      autoRefreshTimer = setTimeout(load, 4000);
    }
    return;
  }

  // 距离切换不足 5 分钟时，触发第二阶段提醒（若下一阶段命中关注列表）
  if (
    window.dashboardData?.terrorZone &&
    remaining > 0 &&
    remaining <= TZ_PRE_SWITCH_ALERT_MS &&
    typeof evaluatePersonalAlerts === "function"
  ) {
    evaluatePersonalAlerts(window.dashboardData);
  }
}

async function load() {
  const button = document.getElementById("refresh");
  button.disabled = true;
  try {
    const response = await fetch("/api/status", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "状态读取失败");
    render(data);
  } catch (error) {
    document.getElementById("content").innerHTML =
      '<div class="error">暂时无法读取状态：' + escapeHtml(error.message) + '</div>';
    document.getElementById("checked-at").textContent = "状态不可用";
  } finally {
    button.disabled = false;
    scheduleAutoRefresh();
  }
}

function scheduleAutoRefresh() {
  if (autoRefreshTimer) clearTimeout(autoRefreshTimer);
  if (autoRefreshEnabled) {
    const configuredDelay = autoRefreshMinutes * 60 * 1000;
    const delay = isAwaitingTerrorConfirmation(window.dashboardData?.terrorZone)
      ? Math.min(configuredDelay, 10 * 1000)
      : configuredDelay;
    autoRefreshTimer = setTimeout(load, delay);
  }
}

async function loadSystemConfig() {
  try {
    const response = await fetch("/api/system-config", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.ok) return;
    const footerPull = document.getElementById("footer-pull-interval");
    if (footerPull && data.pullIntervalMinutes) {
      footerPull.textContent = String(data.pullIntervalMinutes);
    }
    if (typeof data.pageAutoRefreshEnabled === "boolean") {
      autoRefreshEnabled = data.pageAutoRefreshEnabled;
    }
    if (Number.isInteger(Number(data.pageAutoRefreshMinutes)) && Number(data.pageAutoRefreshMinutes) >= 1) {
      autoRefreshMinutes = Number(data.pageAutoRefreshMinutes);
    }
    scheduleAutoRefresh();
  } catch (error) {
    console.error("读取系统配置失败", error);
  }
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    minProgress = Number(button.dataset.min);
    if (window.dashboardData) render(window.dashboardData);
  });
});
document.getElementById("refresh").addEventListener("click", load);
/* 魔法 / 亮金 / 手工物品词缀范围逻辑 */

let _twSweeping = false;
function applyDomTraditionalSweep() {
  if (_twSweeping) return;
  _twSweeping = true;
  try {
    const roots = [
      document.querySelector("main.shell"),
      document.getElementById("rw-detail-modal"),
      document.getElementById("it-set-modal"),
      document.getElementById("pd-hover-tooltip"),
      document.getElementById("auth-dialog")
    ].filter(Boolean);
    for (const root of roots) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const pEl = node.parentElement;
        if (!pEl) continue;
        const tag = pEl.tagName;
        if (tag === "SCRIPT" || tag === "STYLE") continue;
        if (pEl.closest && pEl.closest("[data-no-sweep],[data-i18n]")) continue;
        if (node._origZh === undefined) {
          node._origZh = node.nodeValue;
        }
        if (!node._origZh || !node._origZh.trim()) continue;
        let conv = node._origZh;
        if (currentLang === "zhTW") {
          conv = toZhTW(node._origZh);
        } else if (currentLang === "enUS") {
          conv = toEnUS(node._origZh);
        }
        if (node.nodeValue !== conv) node.nodeValue = conv;
      }
      root.querySelectorAll("input[placeholder]").forEach(inp => {
        if (inp._origPh === undefined) inp._origPh = inp.placeholder;
        let conv = inp._origPh;
        if (currentLang === "zhTW") conv = toZhTW(inp._origPh);
        else if (currentLang === "enUS") conv = toEnUS(inp._origPh);
        if (inp.placeholder !== conv) inp.placeholder = conv;
      });
    }
  } finally {
    _twSweeping = false;
  }
}

function setupLangSwitcher() {
  const container = document.getElementById("lang-switcher");
  if (!container) return;
  const syncActive = () => {
    container.querySelectorAll(".lang-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === currentLang);
    });
  };
  const applyAllLang = async () => {
    if (currentLang !== "zhCN") { try { await ensureI18nDictLoaded(); } catch (e) {} }
    syncActive();
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (key) {
        const val = tUI(key);
        el.textContent = val;
        if (el.firstChild && el.firstChild.nodeType === 3) el.firstChild._origZh = val;
      }
    });
    document.title = tUI("docTitle");
    document.documentElement.lang = currentLang === "zhTW" ? "zh-TW" : currentLang === "enUS" ? "en" : "zh-CN";
    if (window.dashboardData) render(window.dashboardData);
    if (typeof renderTzCatalog === "function") renderTzCatalog();
    if (typeof renderTzHistory === "function") renderTzHistory();
    if (D2R.tabs.runewords && D2R.tabs.runewords.onLangChange) D2R.tabs.runewords.onLangChange();
    if (D2R.tabs.affixes && D2R.tabs.affixes.onLangChange) D2R.tabs.affixes.onLangChange();
    if (D2R.tabs.items && D2R.tabs.items.onLangChange) D2R.tabs.items.onLangChange();
    if (D2R.tabs.skills && D2R.tabs.skills.onLangChange) D2R.tabs.skills.onLangChange();
    applyDomTraditionalSweep();
  };
  applyAllLang();
  let _twRaf = null;
  if (typeof MutationObserver !== "undefined") {
    const obs = new MutationObserver(() => {
      if (currentLang === "zhCN" || _twSweeping) return;
      if (_twRaf) cancelAnimationFrame(_twRaf);
      _twRaf = requestAnimationFrame(() => {
        _twRaf = null;
        applyDomTraditionalSweep();
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }
  container.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setCurrentLang(btn.dataset.lang);
      try { localStorage.setItem("d2r-lang", currentLang); } catch (e) {}
      applyAllLang();
    });
  });
}

/* 用户账号登录（账号密码 / Google OAuth）与云端技能/装备同步 */
let authGoogleEnabled = false;
let authAdminInitialized = true;
let cloudPresets = [];
let cloudUpdatedAt = null;
let cloudSyncState = "idle";
let cloudSyncTimer = null;
let cloudLastSyncedDigest = "";
let authToastTimer = null;
window.__cloudApplyingRemote = false;


const AUTH_OAUTH_ERROR_MESSAGES = {
  google_not_configured: "服务端尚未配置 Google OAuth 密钥，请先配置 GOOGLE_CLIENT_ID 与 GOOGLE_CLIENT_SECRET",
  google_denied: "已取消 Google 账号授权登录",
  google_state_invalid: "Google 登录状态校验失败，请重试",
  google_state_expired: "Google 登录请求已过期，请重新点击登录",
  google_token_failed: "无法从 Google 获取访问令牌，请稍后重试",
  google_token_missing: "Google 未返回有效访问令牌，请稍后重试",
  google_profile_failed: "读取 Google 账号信息失败，请稍后重试",
  google_profile_invalid: "Google 账号信息无效，请稍后重试",
  google_exchange_error: "Google 登录通信异常，请稍后重试",
  account_disabled: "该账号已被管理员禁用，请联系站长"
};

function showAuthToast(msg, isError) {
  const el = document.getElementById("auth-toast");
  if (!el) return;
  el.textContent = String(msg || "");
  el.classList.toggle("err", Boolean(isError));
  el.classList.add("show");
  if (authToastTimer) clearTimeout(authToastTimer);
  authToastTimer = setTimeout(() => {
    el.classList.remove("show");
  }, isError ? 4200 : 2800);
}

function setAuthDialogError(msg) {
  const el = document.getElementById("auth-error-msg");
  if (!el) return;
  if (msg) {
    el.textContent = String(msg);
    el.classList.add("show");
  } else {
    el.textContent = "";
    el.classList.remove("show");
  }
}

function formatCloudShortTime(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("zh-CN", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch (e) {
    return "";
  }
}

function formatCloudDateTime(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("zh-CN", { hour12: false, month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  } catch (e) {
    return "";
  }
}

function createAvatarNode(user, clsImg, clsFallback) {
  if (user && user.avatarUrl && user.avatarUrl.indexOf("https://") === 0) {
    const img = document.createElement("img");
    img.className = clsImg;
    img.src = user.avatarUrl;
    img.alt = "";
    img.referrerPolicy = "no-referrer";
    return img;
  }
  const span = document.createElement("span");
  span.className = clsFallback;
  const base = (user && (user.displayName || user.username || user.email)) || "D";
  span.textContent = base.trim().slice(0, 1).toUpperCase();
  span.setAttribute("aria-hidden", "true");
  return span;
}

function renderCloudPresetsUi() {
  const sel = document.getElementById("cloud-preset-select");
  const list = document.getElementById("auth-presets-list");
  const cnt = document.getElementById("auth-presets-count");
  if (cnt) cnt.textContent = String(cloudPresets.length);

  if (sel) {
    const prevVal = sel.value;
    sel.textContent = "";
    if (!cloudPresets.length) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "暂无云端方案";
      sel.appendChild(opt);
    } else {
      cloudPresets.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        const clsLabel = AUTH_CLASS_LABELS[p.classId] || p.classId;
        opt.textContent = "[" + clsLabel + "] " + p.name;
        sel.appendChild(opt);
      });
      if (prevVal && cloudPresets.some(p => p.id === prevVal)) {
        sel.value = prevVal;
      }
    }
  }

  if (list) {
    list.textContent = "";
    if (!cloudPresets.length) {
      const empty = document.createElement("div");
      empty.style.fontSize = "12px";
      empty.style.color = "var(--muted)";
      empty.style.padding = "10px 6px";
      empty.textContent = "尚未保存命名方案。你可以在「技能模拟」页签顶部输入方案名并点击「保存当前职业方案」。";
      list.appendChild(empty);
    } else {
      cloudPresets.forEach(p => {
        const row = document.createElement("div");
        row.className = "auth-preset-item";

        const info = document.createElement("div");
        info.className = "auth-preset-info";
        const title = document.createElement("div");
        title.className = "auth-preset-title";
        title.setAttribute("data-no-sweep", "");
        title.textContent = p.name;
        const sub = document.createElement("div");
        sub.className = "auth-preset-sub";
        const clsLabel = AUTH_CLASS_LABELS[p.classId] || p.classId;
        const skPts = Object.values(p.skills || {}).reduce((s, v) => s + (Number(v) || 0), 0);
        sub.textContent = clsLabel + " · 技能 " + skPts + " 点 · " + (p.paperdoll ? "含装备" : "仅技能") + (p.updatedAt ? (" · " + formatCloudDateTime(p.updatedAt)) : "");
        info.appendChild(title);
        info.appendChild(sub);

        const acts = document.createElement("div");
        acts.style.display = "inline-flex";
        acts.style.gap = "6px";
        acts.style.flexShrink = "0";

        const loadBtn = document.createElement("button");
        loadBtn.type = "button";
        loadBtn.className = "rw-btn";
        loadBtn.textContent = "载入";
        loadBtn.addEventListener("click", () => {
          loadCloudPresetById(p.id);
          if (typeof switchMainTab === "function") switchMainTab("skills");
          const dlg = document.getElementById("auth-dialog");
          if (dlg && dlg.open) dlg.close();
        });

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "rw-btn rw-btn-danger";
        delBtn.textContent = "删除";
        delBtn.addEventListener("click", () => deleteCloudPresetById(p.id));

        acts.appendChild(loadBtn);
        acts.appendChild(delBtn);
        row.appendChild(info);
        row.appendChild(acts);
        list.appendChild(row);
      });
    }
  }
}

function renderAuthUi() {
  const openBtn = document.getElementById("auth-open-btn");
  const pillIcon = document.getElementById("auth-pill-icon");
  const pillLabel = document.getElementById("auth-pill-label");
  const syncStatusEl = document.getElementById("cloud-sync-status");
  const loginCta = document.getElementById("cloud-login-cta");
  const syncNowBtn = document.getElementById("cloud-sync-now-btn");
  const presetCtrls = document.getElementById("cloud-preset-controls");
  const guestView = document.getElementById("auth-guest-view");
  const accountView = document.getElementById("auth-account-view");
  const dlgTitle = document.getElementById("auth-dialog-title");
  const googleBtn = document.getElementById("auth-google-btn");
  const googleHint = document.getElementById("auth-google-hint");
  const adminEntryLink = document.getElementById("admin-entry-link");
  const adminConsoleLink = document.getElementById("auth-admin-console-link");
  const adminInitLink = document.getElementById("auth-admin-init-link");
  const isAdmin = Boolean(authUser && authUser.isAdmin);
  if (adminEntryLink) {
    if (isAdmin) {
      adminEntryLink.style.display = "inline-flex";
      adminEntryLink.textContent = "🛡 管理后台";
    } else if (!authAdminInitialized) {
      adminEntryLink.style.display = "inline-flex";
      adminEntryLink.textContent = "🛡 初始化后台";
    } else {
      adminEntryLink.style.display = "none";
    }
  }
  if (adminConsoleLink) adminConsoleLink.style.display = isAdmin ? "block" : "none";
  if (adminInitLink) adminInitLink.style.display = !authAdminInitialized ? "block" : "none";

  if (googleBtn && googleHint) {
    googleBtn.disabled = !authGoogleEnabled;
    if (authGoogleEnabled) {
      googleHint.style.display = "none";
      googleHint.textContent = "";
    } else {
      googleHint.style.display = "block";
      googleHint.textContent = "管理员配置 Cloudflare Worker Secret（GOOGLE_CLIENT_ID 与 GOOGLE_CLIENT_SECRET）并在 Google Cloud Console 配置回调地址 " + window.location.origin + "/api/auth/google/callback 后即可一键启用 Google 登录。";
    }
  }

  if (authUser) {
    if (openBtn) openBtn.classList.add("logged-in");
    if (pillIcon) {
      pillIcon.textContent = "";
      pillIcon.appendChild(createAvatarNode(authUser, "auth-avatar", "auth-avatar-fallback"));
    }
    if (pillLabel) pillLabel.textContent = authUser.displayName || authUser.username || authUser.email;

    const existingDot = openBtn ? openBtn.querySelector(".auth-sync-dot") : null;
    if (openBtn) {
      const dot = existingDot || document.createElement("span");
      dot.className = "auth-sync-dot" + (cloudSyncState === "syncing" ? " syncing" : (cloudSyncState === "error" ? " error" : ""));
      dot.setAttribute("aria-hidden", "true");
      if (!existingDot) openBtn.appendChild(dot);
    }

    if (syncStatusEl) {
      const tStr = formatCloudShortTime(cloudUpdatedAt);
      if (cloudSyncState === "syncing") {
        syncStatusEl.textContent = "☁ 正在同步技能与装备至云端…";
      } else if (cloudSyncState === "error") {
        syncStatusEl.textContent = "⚠ 云端同步失败，可点击右侧重试";
      } else if (tStr) {
        syncStatusEl.textContent = "☁ 已云端同步（" + (authUser.displayName || "已登录") + " · " + tStr + "）";
      } else {
        syncStatusEl.textContent = "☁ 已登录云端同步（" + (authUser.displayName || "已登录") + "）";
      }
    }
    if (loginCta) loginCta.style.display = "none";
    if (syncNowBtn) syncNowBtn.style.display = "inline-flex";
    if (presetCtrls) presetCtrls.style.display = "flex";
    if (guestView) guestView.style.display = "none";
    if (accountView) accountView.style.display = "flex";
    if (dlgTitle) dlgTitle.textContent = "账号与云端配装存档";

    const avatarWrap = document.getElementById("auth-profile-avatar-wrap");
    if (avatarWrap) {
      avatarWrap.textContent = "";
      avatarWrap.appendChild(createAvatarNode(authUser, "auth-profile-avatar", "auth-profile-avatar-fb"));
    }
    const pName = document.getElementById("auth-profile-name");
    if (pName) pName.textContent = authUser.displayName || authUser.username || authUser.email;
    const nameEditInp = document.getElementById("auth-display-name-input");
    if (nameEditInp && document.activeElement !== nameEditInp) {
      nameEditInp.value = authUser.displayName || authUser.username || "";
    }
    const pSub = document.getElementById("auth-profile-sub");
    if (pSub) {
      const idLine = [authUser.email, authUser.username].filter(Boolean).join(" · ");
      pSub.textContent = idLine || ("账号 ID: " + authUser.id.slice(0, 8));
    }
    const badges = document.getElementById("auth-provider-badges");
    if (badges) {
      badges.textContent = "";
      if (authUser.isAdmin) {
        const ab = document.createElement("span");
        ab.className = "auth-prov-badge";
        ab.style.borderColor = "rgba(103, 232, 122, 0.55)";
        ab.style.color = "#b7f5c0";
        ab.textContent = "系统管理员";
        badges.appendChild(ab);
      }
      const provs = Array.isArray(authUser.providers) ? authUser.providers : [];
      if (provs.includes("password")) {
        const b = document.createElement("span");
        b.className = "auth-prov-badge";
        b.textContent = "账号密码";
        badges.appendChild(b);
      }
      if (provs.includes("google")) {
        const b = document.createElement("span");
        b.className = "auth-prov-badge";
        b.textContent = "Google 账号";
        badges.appendChild(b);
      }
    }
    const summary = document.getElementById("auth-sync-summary");
    if (summary) {
      summary.textContent = cloudUpdatedAt
        ? ("☁ 最近云端保存时间：" + formatCloudDateTime(cloudUpdatedAt) + " · 所有 8 职业技能加点、纸娃娃配装、圣杯收集与符文之语记事会自动保存。")
        : "☁ 登录后，所有 8 职业技能加点、纸娃娃配装、圣杯收集与符文之语记事会自动同步至云端。";
    }
    const rwSyncBtn = document.getElementById("rw-cloud-sync-btn");
    if (rwSyncBtn) {
      rwSyncBtn.classList.add("active");
      rwSyncBtn.textContent = cloudSyncState === "syncing" ? "☁ 符文同步中…" : (cloudSyncState === "error" ? "⚠ 符文同步失败" : "☁ 符文已云端同步");
    }
    const grailSyncBtn = document.getElementById("grail-cloud-sync-btn");
    if (grailSyncBtn) {
      grailSyncBtn.classList.add("active");
      grailSyncBtn.textContent = cloudSyncState === "syncing" ? "☁ 圣杯同步中…" : (cloudSyncState === "error" ? "⚠ 圣杯同步失败" : "☁ 圣杯已云端同步");
    }
    const remCodes = Number(authUser.recoveryCodesRemaining || 0);
    const remBadge = document.getElementById("auth-sec-remain-badge");
    if (remBadge) remBadge.textContent = "剩余恢复码 " + remCodes + "/5";
    const noCurPw = Boolean(authUser.canSetPasswordWithoutCurrent);
    const curPwWrap = document.getElementById("auth-cur-pw-wrap");
    const curPwInp = document.getElementById("auth-cur-password");
    const googlePwHint = document.getElementById("auth-google-pw-hint");
    const newPwLbl = document.getElementById("auth-new-pw-label");
    const changePwBtn = document.getElementById("auth-change-pw-submit");
    if (curPwWrap) curPwWrap.style.display = noCurPw ? "none" : "flex";
    if (curPwInp) curPwInp.required = !noCurPw;
    if (googlePwHint) googlePwHint.style.display = noCurPw ? "block" : "none";
    if (newPwLbl) newPwLbl.textContent = authUser.hasPassword ? "新密码（至少 8 位）" : "为账号设置登录密码（至少 8 位）";
    if (changePwBtn) changePwBtn.textContent = authUser.hasPassword ? "更新登录密码" : "设置登录密码";
    renderCloudPresetsUi();
  } else {
    if (openBtn) {
      openBtn.classList.remove("logged-in");
      const oldDot = openBtn.querySelector(".auth-sync-dot");
      if (oldDot) oldDot.remove();
    }
    if (pillIcon) pillIcon.textContent = "👤";
    if (pillLabel) pillLabel.textContent = "登录 / 云端存档";
    if (syncStatusEl) syncStatusEl.textContent = "☁ 未登录（当前技能与装备仅保存在本机浏览器）";
    if (loginCta) loginCta.style.display = "inline-flex";
    if (syncNowBtn) syncNowBtn.style.display = "none";
    if (presetCtrls) presetCtrls.style.display = "none";
    if (guestView) guestView.style.display = "flex";
    if (accountView) accountView.style.display = "none";
    if (dlgTitle) dlgTitle.textContent = "账号登录 · 云端存档";
    const rwSyncBtn = document.getElementById("rw-cloud-sync-btn");
    if (rwSyncBtn) { rwSyncBtn.classList.remove("active"); rwSyncBtn.textContent = "☁ 登录云端同步"; }
    const grailSyncBtn = document.getElementById("grail-cloud-sync-btn");
    if (grailSyncBtn) { grailSyncBtn.classList.remove("active"); grailSyncBtn.textContent = "☁ 登录云端同步"; }
  }
}

function captureLocalCloudPayload() {
  if (D2R.tabs.skills && D2R.tabs.skills.flushCurrentPaperdollToSaved) {
    window.__cloudApplyingRemote = true;
    try { D2R.tabs.skills.flushCurrentPaperdollToSaved(); } finally { window.__cloudApplyingRemote = false; }
  }
  const readJsonLS = (key, fb) => {
    try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) || fb) : fb; } catch (e) { return fb; }
  };
  const skills = D2R.tabs.skills ? cloneJsonSafe(skBuilds || {}, {}) : readJsonLS(SK_STORAGE_KEY, {});
  const paperdoll = D2R.tabs.skills ? cloneJsonSafe(pdSavedByClass || {}, {}) : readJsonLS(PD_STORAGE_KEY, {});
  const gUniques = D2R.tabs.items ? [...grailUniques].sort() : [...new Set(readJsonLS(GRAIL_UNIQUE_KEY, []))].sort();
  const gSets = D2R.tabs.items ? [...grailSetPieces].sort() : [...new Set(readJsonLS(GRAIL_SET_KEY, []))].sort();
  const rDone = D2R.tabs.runewords ? [...rwCompleted].sort() : [...new Set(readJsonLS(RW_STORAGE_KEY, []))].sort();
  return {
    activeClassId: skActiveClassId || "war",
    skills,
    paperdoll,
    grail: { uniques: gUniques, setPieces: gSets },
    runewords: rDone
  };
}

function hasAnyBuildContent(payload) {
  if (!payload) return false;
  const sk = payload.skills || {};
  for (const cid in sk) {
    const cls = sk[cid] || {};
    for (const k in cls) {
      if (Number(cls[k] || 0) > 0) return true;
    }
  }
  const pd = payload.paperdoll || {};
  if (Object.keys(pd).length > 0) return true;
  const g = payload.grail || {};
  if ((Array.isArray(g.uniques) && g.uniques.length > 0) || (Array.isArray(g.setPieces) && g.setPieces.length > 0)) {
    return true;
  }
  if (Array.isArray(payload.runewords) && payload.runewords.length > 0) return true;
  return false;
}

function applyCloudPayloadToLocal(cloudData, opts) {
  const options = opts || {};
  if (!cloudData || typeof cloudData !== "object") return false;
  const localBefore = captureLocalCloudPayload();
  const nextSkills = cloneJsonSafe(cloudData.skills || {}, {});
  const nextPaperdoll = cloneJsonSafe(cloudData.paperdoll || {}, {});
  const cloudGrail = cloudData.grail && typeof cloudData.grail === "object" ? cloudData.grail : { uniques: [], setPieces: [] };
  const nextGrailUniques = new Set(Array.isArray(cloudGrail.uniques) ? cloudGrail.uniques : []);
  const nextGrailSets = new Set(Array.isArray(cloudGrail.setPieces) ? cloudGrail.setPieces : []);
  const nextRunewords = new Set(Array.isArray(cloudData.runewords) ? cloudData.runewords : []);
  let mergedExtraLocal = false;

  if (options.mergeLocalMissing) {
    for (const cid in localBefore.skills) {
      const hasLocalPts = Object.values(localBefore.skills[cid] || {}).some(v => Number(v || 0) > 0);
      const hasCloudPts = Object.values(nextSkills[cid] || {}).some(v => Number(v || 0) > 0);
      if (hasLocalPts && !hasCloudPts) {
        nextSkills[cid] = cloneJsonSafe(localBefore.skills[cid], {});
        mergedExtraLocal = true;
      }
    }
    for (const cid in localBefore.paperdoll) {
      if (localBefore.paperdoll[cid] && !nextPaperdoll[cid]) {
        nextPaperdoll[cid] = cloneJsonSafe(localBefore.paperdoll[cid], {});
        mergedExtraLocal = true;
      }
    }
    (localBefore.grail?.uniques || []).forEach(u => {
      if (!nextGrailUniques.has(u)) { nextGrailUniques.add(u); mergedExtraLocal = true; }
    });
    (localBefore.grail?.setPieces || []).forEach(s => {
      if (!nextGrailSets.has(s)) { nextGrailSets.add(s); mergedExtraLocal = true; }
    });
    (localBefore.runewords || []).forEach(r => {
      if (!nextRunewords.has(r)) { nextRunewords.add(r); mergedExtraLocal = true; }
    });
  }

  window.__cloudApplyingRemote = true;
  try {
    setSkBuilds(nextSkills);
    setPdSavedByClass(nextPaperdoll);
    setGrailUniques(nextGrailUniques);
    setGrailSetPieces(nextGrailSets);
    setRwCompleted(nextRunewords);
    try {
      localStorage.setItem(SK_STORAGE_KEY, JSON.stringify(skBuilds));
      localStorage.setItem(PD_STORAGE_KEY, JSON.stringify(pdSavedByClass));
      if (typeof GRAIL_UNIQUE_KEY !== "undefined") localStorage.setItem(GRAIL_UNIQUE_KEY, JSON.stringify([...nextGrailUniques]));
      if (typeof GRAIL_SET_KEY !== "undefined") localStorage.setItem(GRAIL_SET_KEY, JSON.stringify([...nextGrailSets]));
      if (typeof RW_STORAGE_KEY !== "undefined") localStorage.setItem(RW_STORAGE_KEY, JSON.stringify([...nextRunewords]));
    } catch (e) {}

    if (options.switchClass && cloudData.activeClassId && AUTH_CLASS_LABELS[cloudData.activeClassId]) {
      setSkActiveClassId(cloudData.activeClassId);
    }
    if (D2R.tabs.skills && D2R.tabs.skills.onCloudSync) D2R.tabs.skills.onCloudSync();
    if (D2R.tabs.runewords && D2R.tabs.runewords.onCloudSync) D2R.tabs.runewords.onCloudSync();
    if (D2R.tabs.items && D2R.tabs.items.onCloudSync) D2R.tabs.items.onCloudSync();
    cloudLastSyncedDigest = JSON.stringify({
      activeClassId: skActiveClassId || "war",
      skills: skBuilds,
      paperdoll: pdSavedByClass,
      grail: { uniques: [...nextGrailUniques].sort(), setPieces: [...nextGrailSets].sort() },
      runewords: [...nextRunewords].sort()
    });
  } finally {
    window.__cloudApplyingRemote = false;
  }
  return mergedExtraLocal;
}

async function pushCloudBuildsNow(silent, keepalive) {
  if (!authUser) return false;
  const payload = captureLocalCloudPayload();
  const digest = JSON.stringify(payload);
  if (silent && digest === cloudLastSyncedDigest) return true;

  cloudSyncState = "syncing";
  renderAuthUi();
  try {
    const res = await fetch("/api/user/builds", {
      method: "PUT",
      credentials: "same-origin",
      keepalive: Boolean(keepalive),
      headers: { "content-type": "application/json" },
      body: digest
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      if (res.status === 401) {
        setAuthUser(null);
        cloudSyncState = "idle";
        renderAuthUi();
        return false;
      }
      throw new Error(data.error || "云端保存失败");
    }
    cloudUpdatedAt = data.updatedAt || new Date().toISOString();
    cloudLastSyncedDigest = digest;
    cloudSyncState = "synced";
    renderAuthUi();
    if (!silent) showAuthToast("已将技能、配装、圣杯与符文之语同步至云端");
    return true;
  } catch (err) {
    cloudSyncState = "error";
    renderAuthUi();
    if (!silent) showAuthToast(err.message || "云端同步失败，请稍后重试", true);
    return false;
  }
}

function scheduleCloudSync() {
  if (!authUser || window.__cloudApplyingRemote) return;
  if (cloudSyncTimer) clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(() => {
    cloudSyncTimer = null;
    pushCloudBuildsNow(true, false);
  }, 1400);
}

async function pullCloudBuildsAndSync(opts) {
  if (!authUser) return;
  const options = opts || {};
  cloudSyncState = "syncing";
  renderAuthUi();
  try {
    const res = await fetch("/api/user/builds", {
      credentials: "same-origin",
      cache: "no-store"
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      if (res.status === 401) {
        setAuthUser(null);
        cloudSyncState = "idle";
        renderAuthUi();
        return;
      }
      throw new Error(json.error || "读取云端存档失败");
    }
    const cloud = json.data;
    cloudPresets = (cloud && Array.isArray(cloud.presets)) ? cloud.presets : [];
    cloudUpdatedAt = (cloud && cloud.updatedAt) || null;
    const localPayload = captureLocalCloudPayload();

    if (!cloud || !hasAnyBuildContent(cloud)) {
      if (hasAnyBuildContent(localPayload)) {
        await pushCloudBuildsNow(true, false);
        if (options.showToast) showAuthToast("已将本地技能与装备自动备份至云端");
      } else {
        cloudLastSyncedDigest = JSON.stringify(localPayload);
        cloudSyncState = "synced";
        renderAuthUi();
      }
      return;
    }

    const mergedExtra = applyCloudPayloadToLocal(cloud, {
      mergeLocalMissing: Boolean(options.mergeLocalMissing),
      switchClass: Boolean(options.switchClass)
    });
    if (mergedExtra) {
      await pushCloudBuildsNow(true, false);
    } else {
      cloudSyncState = "synced";
      renderAuthUi();
    }
    if (options.showToast) {
      showAuthToast("已从云端同步您的技能与装备存档");
    }
  } catch (err) {
    cloudSyncState = "error";
    renderAuthUi();
    if (options.showToast) showAuthToast(err.message || "读取云端存档失败", true);
  }
}

async function saveCurrentClassAsPreset() {
  if (!authUser) {
    openAuthDialog("login");
    return;
  }
  const nameInput = document.getElementById("cloud-preset-name");
  const rawName = nameInput ? nameInput.value.trim() : "";
  const cid = skActiveClassId || "war";
  const clsLabel = AUTH_CLASS_LABELS[cid] || cid;
  const nowTime = formatCloudShortTime(new Date().toISOString()).slice(0, 5);
  const name = rawName || (clsLabel + " 方案 " + nowTime);
  const payload = captureLocalCloudPayload();

  try {
    const res = await fetch("/api/user/presets", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        classId: cid,
        skills: payload.skills[cid] || {},
        paperdoll: payload.paperdoll[cid] || null
      })
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.error || "保存方案失败");
    }
    cloudPresets = Array.isArray(data.presets) ? data.presets : cloudPresets;
    cloudUpdatedAt = data.updatedAt || new Date().toISOString();
    if (nameInput) nameInput.value = "";
    renderAuthUi();
    if (data.preset && document.getElementById("cloud-preset-select")) {
      document.getElementById("cloud-preset-select").value = data.preset.id;
    }
    showAuthToast("已保存云端方案：" + name);
  } catch (err) {
    showAuthToast(err.message || "保存云端方案失败", true);
  }
}

async function loadCloudPresetById(presetId) {
  const preset = cloudPresets.find(p => p.id === presetId);
  if (!preset) {
    showAuthToast("请先选择一个云端方案", true);
    return;
  }
  const mod = await ensureTabModule("skills");
  window.__cloudApplyingRemote = true;
  try {
    if (mod && mod.applyCloudPreset) await mod.applyCloudPreset(preset);
  } finally {
    window.__cloudApplyingRemote = false;
  }
  scheduleCloudSync();
  showAuthToast("已载入云端方案：" + preset.name);
}

async function deleteCloudPresetById(presetId) {
  if (!authUser || !presetId) return;
  try {
    const res = await fetch("/api/user/presets/" + encodeURIComponent(presetId), {
      method: "DELETE",
      credentials: "same-origin"
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.error || "删除方案失败");
    }
    cloudPresets = Array.isArray(data.presets) ? data.presets : [];
    cloudUpdatedAt = data.updatedAt || cloudUpdatedAt;
    renderAuthUi();
    showAuthToast("已删除该云端方案");
  } catch (err) {
    showAuthToast(err.message || "删除方案失败", true);
  }
}

let latestRecoveryCodes = [];

function showRecoveryCodesBanner(codes, titleText) {
  const box = document.getElementById("auth-recovery-box");
  const grid = document.getElementById("auth-recovery-grid");
  const title = document.getElementById("auth-recovery-title");
  if (!box || !grid) return;
  latestRecoveryCodes = Array.isArray(codes) ? codes.slice() : [];
  if (!latestRecoveryCodes.length) {
    box.classList.remove("show");
    grid.textContent = "";
    return;
  }
  if (title && titleText) title.textContent = titleText;
  grid.textContent = "";
  latestRecoveryCodes.forEach(code => {
    const el = document.createElement("div");
    el.className = "auth-recovery-code";
    el.textContent = code;
    grid.appendChild(el);
  });
  box.classList.add("show");
}

function clearRecoveryCodesBanner() {
  latestRecoveryCodes = [];
  const box = document.getElementById("auth-recovery-box");
  const grid = document.getElementById("auth-recovery-grid");
  if (box) box.classList.remove("show");
  if (grid) grid.textContent = "";
}

function switchAuthTab(tabName) {
  const mode = tabName === "register" ? "register" : (tabName === "reset" ? "reset" : "login");
  const loginTab = document.getElementById("auth-tab-login");
  const regTab = document.getElementById("auth-tab-register");
  const loginForm = document.getElementById("auth-login-form");
  const regForm = document.getElementById("auth-register-form");
  const resetForm = document.getElementById("auth-reset-form");
  if (loginTab) {
    loginTab.classList.toggle("active", mode === "login");
    loginTab.setAttribute("aria-selected", String(mode === "login"));
  }
  if (regTab) {
    regTab.classList.toggle("active", mode === "register");
    regTab.setAttribute("aria-selected", String(mode === "register"));
  }
  if (loginForm) loginForm.style.display = mode === "login" ? "flex" : "none";
  if (regForm) regForm.style.display = mode === "register" ? "flex" : "none";
  if (resetForm) resetForm.style.display = mode === "reset" ? "flex" : "none";
  setAuthDialogError("");
  const firstId = mode === "register" ? "auth-reg-account" : (mode === "reset" ? "auth-reset-account" : "auth-login-account");
  const firstInput = document.getElementById(firstId);
  if (firstInput && document.getElementById("auth-dialog")?.open) {
    firstInput.focus();
  }
}

let authUserShares = [];
let authUserSharesLoading = false;

function renderUserSharedBuildsUi() {
  const list = document.getElementById("auth-shares-list");
  const cnt = document.getElementById("auth-shares-count");
  if (cnt) cnt.textContent = String(authUserShares.length);
  if (!list) return;
  list.textContent = "";
  if (authUserSharesLoading && !authUserShares.length) {
    const loading = document.createElement("div");
    loading.style.fontSize = "12px";
    loading.style.color = "var(--muted)";
    loading.style.padding = "10px 6px";
    loading.textContent = "正在加载我分享的 BD 短链…";
    list.appendChild(loading);
    return;
  }
  if (!authUserShares.length) {
    const empty = document.createElement("div");
    empty.style.fontSize = "12px";
    empty.style.color = "var(--muted)";
    empty.style.padding = "10px 6px";
    empty.textContent = "暂无已分享的公开短链。你可以在「技能/配装模拟」中点击「分享完整 BD」生成永久短链。";
    list.appendChild(empty);
    return;
  }
  authUserShares.forEach(item => {
    const row = document.createElement("div");
    row.className = "auth-preset-item";

    const info = document.createElement("div");
    info.className = "auth-preset-info";
    const title = document.createElement("div");
    title.className = "auth-preset-title";
    title.setAttribute("data-no-sweep", "");
    title.textContent = item.title || "未命名 BD";
    const sub = document.createElement("div");
    sub.className = "auth-preset-sub";
    const clsLabel = item.className || AUTH_CLASS_LABELS[item.classId] || item.classId || "";
    sub.textContent = clsLabel + " · Lv." + (item.charLvl || 90) + " · /build/" + item.id + (item.createdAt ? (" · " + formatCloudDateTime(item.createdAt)) : "");
    info.appendChild(title);
    info.appendChild(sub);

    const acts = document.createElement("div");
    acts.style.display = "inline-flex";
    acts.style.gap = "5px";
    acts.style.flexShrink = "0";
    acts.style.flexWrap = "wrap";

    const fullUrl = item.shareUrl || (window.location.origin + "/build/" + item.id);

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "rw-btn";
    copyBtn.textContent = "复制";
    copyBtn.addEventListener("click", () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullUrl).then(() => {
          showAuthToast("✓ 已复制短链：" + fullUrl);
        }).catch(() => {});
      }
    });

    const openLink = document.createElement("a");
    openLink.className = "rw-btn";
    openLink.href = "/build/" + encodeURIComponent(item.id);
    openLink.target = "_blank";
    openLink.rel = "noopener";
    openLink.style.textDecoration = "none";
    openLink.textContent = "查看";

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "rw-btn rw-btn-danger";
    delBtn.textContent = "撤销";
    delBtn.addEventListener("click", () => deleteUserSharedBuildById(item.id, item.title));

    acts.appendChild(copyBtn);
    acts.appendChild(openLink);
    acts.appendChild(delBtn);
    row.appendChild(info);
    row.appendChild(acts);
    list.appendChild(row);
  });
}

async function loadUserSharedBuilds() {
  if (!authUser) {
    authUserShares = [];
    renderUserSharedBuildsUi();
    return;
  }
  authUserSharesLoading = true;
  renderUserSharedBuildsUi();
  try {
    const res = await fetch("/api/user/shares", {
      credentials: "same-origin",
      cache: "no-store"
    });
    const data = await res.json();
    if (res.ok && data && data.ok && Array.isArray(data.shares)) {
      authUserShares = data.shares;
    }
  } catch {
    // ignore transient network errors
  } finally {
    authUserSharesLoading = false;
    renderUserSharedBuildsUi();
  }
}

async function deleteUserSharedBuildById(shareId, title) {
  if (!authUser || !shareId) return;
  if (!window.confirm("确定撤销公开分享短链「" + (title || shareId) + "」(/build/" + shareId + ") 吗？撤销后任何人都无法再访问此链接。")) {
    return;
  }
  try {
    const res = await fetch("/api/builds/share/" + encodeURIComponent(shareId), {
      method: "DELETE",
      credentials: "same-origin"
    });
    const data = await res.json();
    if (!res.ok || !data || !data.ok) {
      setAuthDialogError((data && data.error) || "撤销分享短链失败");
      return;
    }
    authUserShares = authUserShares.filter(s => s.id !== shareId);
    renderUserSharedBuildsUi();
    showAuthToast("✓ 已撤销分享短链 /build/" + shareId);
  } catch {
    setAuthDialogError("网络异常，撤销分享短链失败");
  }
}

function openAuthDialog(defaultTab) {
  const dlg = document.getElementById("auth-dialog");
  if (!dlg) return;
  setAuthDialogError("");
  renderAuthUi();
  if (!authUser) {
    switchAuthTab(defaultTab === "register" ? "register" : "login");
  } else {
    loadUserSharedBuilds();
  }
  if (!dlg.open) {
    dlg.showModal();
  }
}

async function fetchAuthSession(opts) {
  const options = opts || {};
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "same-origin",
      cache: "no-store"
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      authGoogleEnabled = Boolean(data.googleEnabled);
      authAdminInitialized = data.adminInitialized !== false;
      setAuthUser(data.authenticated ? data.user : null);
      renderAuthUi();
      if (authUser) {
        await pullCloudBuildsAndSync({
          mergeLocalMissing: Boolean(options.mergeLocalMissing),
          switchClass: Boolean(options.switchClass),
          showToast: Boolean(options.showToast)
        });
      }
    }
  } catch (err) {
    console.error("检查登录状态失败", err);
  }
}

function setupAuthAndCloudSync() {
  const authDlg = document.getElementById("auth-dialog");
  if (!authDlg) return;

  // Fallback for browsers without native <dialog closedby="any"> support (e.g. Safari)
  if (typeof HTMLDialogElement !== "undefined" && !("closedBy" in HTMLDialogElement.prototype)) {
    const isOutside = (e, dlg) => {
      const r = dlg.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    let pressedOutside = false;
    authDlg.addEventListener("pointerdown", (e) => {
      pressedOutside = isOutside(e, authDlg);
    });
    authDlg.addEventListener("pointerup", (e) => {
      if (pressedOutside && isOutside(e, authDlg)) authDlg.close();
      pressedOutside = false;
    });
  }
  authDlg.addEventListener("close", () => {
    authDlg.returnValue = "";
    setAuthDialogError("");
    clearRecoveryCodesBanner();
  });

  const closeBtn = document.getElementById("auth-dialog-close");
  if (closeBtn) closeBtn.addEventListener("click", () => authDlg.close());

  const openBtn = document.getElementById("auth-open-btn");
  if (openBtn) openBtn.addEventListener("click", () => openAuthDialog("login"));

  const loginCta = document.getElementById("cloud-login-cta");
  if (loginCta) loginCta.addEventListener("click", () => openAuthDialog("login"));

  const manageBtn = document.getElementById("cloud-preset-manage-btn");
  if (manageBtn) manageBtn.addEventListener("click", () => openAuthDialog("login"));

  const tabLogin = document.getElementById("auth-tab-login");
  const tabReg = document.getElementById("auth-tab-register");
  if (tabLogin) tabLogin.addEventListener("click", () => switchAuthTab("login"));
  if (tabReg) tabReg.addEventListener("click", () => switchAuthTab("register"));

  authDlg.querySelectorAll(".auth-pw-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-pw-target");
      const inp = targetId ? document.getElementById(targetId) : null;
      if (!inp) return;
      const showing = inp.type === "text";
      inp.type = showing ? "password" : "text";
      btn.textContent = showing ? "显示" : "隐藏";
      btn.setAttribute("aria-pressed", String(!showing));
    });
  });

  const loginForm = document.getElementById("auth-login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      setAuthDialogError("");
      const submitBtn = document.getElementById("auth-login-submit");
      const account = (document.getElementById("auth-login-account")?.value || "").trim();
      const password = document.getElementById("auth-login-password")?.value || "";
      if (submitBtn) submitBtn.disabled = true;
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ account, password })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setAuthDialogError(data.error || "登录失败，请检查账号密码");
          return;
        }
        setAuthUser(data.user);
        authGoogleEnabled = Boolean(data.googleEnabled);
        loginForm.reset();
        authDlg.close();
        renderAuthUi();
        showAuthToast("登录成功，欢迎回来 " + (authUser.displayName || ""));
        await pullCloudBuildsAndSync({ mergeLocalMissing: true, switchClass: false, showToast: true });
      } catch (err) {
        setAuthDialogError("网络异常，请稍后重试");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  const regForm = document.getElementById("auth-register-form");
  if (regForm) {
    regForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      setAuthDialogError("");
      const submitBtn = document.getElementById("auth-register-submit");
      const account = (document.getElementById("auth-reg-account")?.value || "").trim();
      const displayName = (document.getElementById("auth-reg-name")?.value || "").trim();
      const password = document.getElementById("auth-reg-password")?.value || "";
      if (submitBtn) submitBtn.disabled = true;
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ account, displayName, password })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setAuthDialogError(data.error || "注册失败，请检查输入");
          return;
        }
        setAuthUser(data.user);
        authGoogleEnabled = Boolean(data.googleEnabled);
        regForm.reset();
        renderAuthUi();
        if (Array.isArray(data.recoveryCodes) && data.recoveryCodes.length) {
          showRecoveryCodesBanner(data.recoveryCodes, "🛡 注册成功！请保存这 5 个一次性恢复码（忘记密码唯一自助凭据）");
          if (!authDlg.open) authDlg.showModal();
          showAuthToast("注册成功！请复制保存 5 个恢复码，正在同步本地数据…");
        } else {
          authDlg.close();
          showAuthToast("注册成功！正在同步本地技能与装备…");
        }
        await pullCloudBuildsAndSync({ mergeLocalMissing: true, switchClass: false, showToast: true });
      } catch (err) {
        setAuthDialogError("网络异常，请稍后重试");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  const forgotBtn = document.getElementById("auth-forgot-btn");
  if (forgotBtn) {
    forgotBtn.addEventListener("click", () => {
      const loginAcc = document.getElementById("auth-login-account");
      const resetAcc = document.getElementById("auth-reset-account");
      if (loginAcc && resetAcc && loginAcc.value.trim() && !resetAcc.value.trim()) {
        resetAcc.value = loginAcc.value.trim();
      }
      switchAuthTab("reset");
    });
  }
  const backLoginBtn = document.getElementById("auth-back-login-btn");
  if (backLoginBtn) backLoginBtn.addEventListener("click", () => switchAuthTab("login"));

  const copyRecBtn = document.getElementById("auth-copy-recovery-btn");
  if (copyRecBtn) {
    copyRecBtn.addEventListener("click", async () => {
      if (!latestRecoveryCodes.length) return;
      const text = "D2R 庇护之地账号一次性恢复码：\n" + latestRecoveryCodes.join("\n");
      try {
        await navigator.clipboard.writeText(text);
        showAuthToast("已复制全部 " + latestRecoveryCodes.length + " 个恢复码");
      } catch (e) {
        showAuthToast("复制失败，请手动选中上方恢复码复制", true);
      }
    });
  }
  const dismissRecBtn = document.getElementById("auth-dismiss-recovery-btn");
  if (dismissRecBtn) dismissRecBtn.addEventListener("click", clearRecoveryCodesBanner);

  const resetForm = document.getElementById("auth-reset-form");
  if (resetForm) {
    resetForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      setAuthDialogError("");
      const submitBtn = document.getElementById("auth-reset-submit");
      const account = (document.getElementById("auth-reset-account")?.value || "").trim();
      const code = (document.getElementById("auth-reset-code")?.value || "").trim();
      const newPassword = document.getElementById("auth-reset-password")?.value || "";
      if (submitBtn) submitBtn.disabled = true;
      try {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ account, code, newPassword })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setAuthDialogError(data.error || "重设密码失败，请核对账号与恢复码");
          return;
        }
        setAuthUser(data.user);
        authGoogleEnabled = Boolean(data.googleEnabled);
        resetForm.reset();
        renderAuthUi();
        if (Array.isArray(data.recoveryCodes) && data.recoveryCodes.length) {
          const titleText = data.usedAdminCode
            ? "🛡 应急重设成功！已自动为您签发全新 5 个恢复码，请妥善保存"
            : "🛡 密码已重设！原恢复码已用尽，系统已自动补发全新 5 个恢复码";
          showRecoveryCodesBanner(data.recoveryCodes, titleText);
          showAuthToast("密码已重设并自动登录，请保存新补发的恢复码");
        } else {
          authDlg.close();
          showAuthToast("密码重设成功！已自动登录（剩余恢复码 " + (authUser.recoveryCodesRemaining || 0) + "/5）");
        }
        await pullCloudBuildsAndSync({ mergeLocalMissing: true, switchClass: false, showToast: false });
      } catch (err) {
        setAuthDialogError("网络异常，请稍后重试");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  const profileEditForm = document.getElementById("auth-profile-edit-form");
  if (profileEditForm) {
    profileEditForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      setAuthDialogError("");
      const nameInp = document.getElementById("auth-display-name-input");
      const saveBtn = document.getElementById("auth-display-name-save-btn");
      const displayName = (nameInp ? nameInp.value : "").trim();
      if (!displayName) {
        setAuthDialogError("昵称不能为空");
        return;
      }
      if (saveBtn) saveBtn.disabled = true;
      try {
        const res = await fetch("/api/user/profile", {
          method: "PATCH",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ displayName })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setAuthDialogError((data && data.error) || "修改昵称失败");
          return;
        }
        setAuthUser(data.user);
        renderAuthUi();
        showAuthToast("✓ 昵称已更新为「" + (authUser.displayName || displayName) + "」");
      } catch (err) {
        setAuthDialogError("网络异常，修改昵称失败");
      } finally {
        if (saveBtn) saveBtn.disabled = false;
      }
    });
  }

  const changePwForm = document.getElementById("auth-change-pw-form");
  if (changePwForm) {
    changePwForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      setAuthDialogError("");
      const submitBtn = document.getElementById("auth-change-pw-submit");
      const currentPassword = document.getElementById("auth-cur-password")?.value || "";
      const newPassword = document.getElementById("auth-new-password")?.value || "";
      if (submitBtn) submitBtn.disabled = true;
      try {
        const res = await fetch("/api/auth/change-password", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ currentPassword, newPassword })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setAuthDialogError(data.error || "更新密码失败");
          return;
        }
        setAuthUser(data.user);
        changePwForm.reset();
        renderAuthUi();
        if (Array.isArray(data.recoveryCodes) && data.recoveryCodes.length) {
          showRecoveryCodesBanner(data.recoveryCodes, "🛡 已设置登录密码，并自动生成 5 个一次性恢复码");
        }
        showAuthToast("登录密码已更新（其他旧设备会话已自动失效）");
      } catch (err) {
        setAuthDialogError("网络异常，请稍后重试");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  const regenBtn = document.getElementById("auth-regen-codes-btn");
  if (regenBtn) {
    regenBtn.addEventListener("click", async () => {
      setAuthDialogError("");
      regenBtn.disabled = true;
      try {
        const res = await fetch("/api/auth/recovery-codes/regenerate", {
          method: "POST",
          credentials: "same-origin"
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setAuthDialogError(data.error || "生成新恢复码失败");
          return;
        }
        setAuthUser(data.user);
        renderAuthUi();
        showRecoveryCodesBanner(data.recoveryCodes, "🛡 已生成全新 5 个恢复码（原有旧恢复码已全部作废）");
        showAuthToast("已重新生成 5 个新恢复码，请复制保存");
      } catch (err) {
        setAuthDialogError("网络异常，请稍后重试");
      } finally {
        regenBtn.disabled = false;
      }
    });
  }

  const googleBtn = document.getElementById("auth-google-btn");
  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      if (!authGoogleEnabled) return;
      captureLocalCloudPayload();
      const ret = window.location.pathname + (window.location.hash || "");
      window.location.href = "/api/auth/google/start?returnTo=" + encodeURIComponent(ret || "/");
    });
  }

  const syncNowBtn = document.getElementById("cloud-sync-now-btn");
  if (syncNowBtn) syncNowBtn.addEventListener("click", () => pushCloudBuildsNow(false, false));

  const rwCloudSyncBtn = document.getElementById("rw-cloud-sync-btn");
  if (rwCloudSyncBtn) {
    rwCloudSyncBtn.addEventListener("click", () => {
      if (authUser) pushCloudBuildsNow(false, false);
      else openAuthDialog("login");
    });
  }

  const grailCloudSyncBtn = document.getElementById("grail-cloud-sync-btn");
  if (grailCloudSyncBtn) {
    grailCloudSyncBtn.addEventListener("click", () => {
      if (authUser) pushCloudBuildsNow(false, false);
      else openAuthDialog("login");
    });
  }

  const uploadNowBtn = document.getElementById("auth-upload-now-btn");
  if (uploadNowBtn) uploadNowBtn.addEventListener("click", () => pushCloudBuildsNow(false, false));

  const downloadNowBtn = document.getElementById("auth-download-now-btn");
  if (downloadNowBtn) {
    downloadNowBtn.addEventListener("click", () =>
      pullCloudBuildsAndSync({ mergeLocalMissing: false, switchClass: true, showToast: true })
    );
  }

  const savePresetBtn = document.getElementById("cloud-preset-save-btn");
  if (savePresetBtn) savePresetBtn.addEventListener("click", saveCurrentClassAsPreset);

  const loadPresetBtn = document.getElementById("cloud-preset-load-btn");
  if (loadPresetBtn) {
    loadPresetBtn.addEventListener("click", () => {
      const sel = document.getElementById("cloud-preset-select");
      if (sel && sel.value) loadCloudPresetById(sel.value);
      else showAuthToast("请先选择一个云端方案", true);
    });
  }

  const sharesRefreshBtn = document.getElementById("auth-shares-refresh-btn");
  if (sharesRefreshBtn) {
    sharesRefreshBtn.addEventListener("click", () => {
      loadUserSharedBuilds();
    });
  }

  const logoutBtn = document.getElementById("auth-logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      if (cloudSyncTimer) {
        clearTimeout(cloudSyncTimer);
        cloudSyncTimer = null;
      }
      try {
        await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
      } catch (e) {}
      setAuthUser(null);
      cloudPresets = [];
      authUserShares = [];
      renderUserSharedBuildsUi();
      cloudUpdatedAt = null;
      cloudSyncState = "idle";
      cloudLastSyncedDigest = "";
      clearRecoveryCodesBanner();
      renderAuthUi();
      authDlg.close();
      showAuthToast("已退出登录（本地数据仍保存在本机）");
    });
  }

  window.addEventListener("pagehide", () => {
    if (authUser && cloudSyncTimer) {
      clearTimeout(cloudSyncTimer);
      cloudSyncTimer = null;
      pushCloudBuildsNow(true, true);
    }
  });

  let fromGoogleOk = false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "google_ok") {
      fromGoogleOk = true;
      params.delete("auth");
      const clean = window.location.pathname + (params.toString() ? ("?" + params.toString()) : "") + window.location.hash;
      history.replaceState(null, "", clean);
    } else if (params.get("auth_error")) {
      const code = params.get("auth_error");
      const msg = AUTH_OAUTH_ERROR_MESSAGES[code] || "Google 登录失败，请重试";
      params.delete("auth_error");
      const clean = window.location.pathname + (params.toString() ? ("?" + params.toString()) : "") + window.location.hash;
      history.replaceState(null, "", clean);
      showAuthToast(msg, true);
    }
  } catch (e) {}

  let hydrated = null;
  try {
    const initEl = document.getElementById("d2r-initial-auth");
    if (initEl && initEl.textContent) {
      hydrated = JSON.parse(initEl.textContent);
    }
  } catch (e) {}

  let pendingImportBuildId = "";
  try {
    const importParams = new URLSearchParams(window.location.search);
    const rawImportId = (importParams.get("import_build") || "").trim().toLowerCase();
    if (/^[a-z0-9]{6,16}$/.test(rawImportId)) {
      pendingImportBuildId = rawImportId;
    }
  } catch (e) {}

  const runPendingImport = () => {
    if (pendingImportBuildId) {
      const idToImport = pendingImportBuildId;
      pendingImportBuildId = "";
      ensureTabModule("skills").then(mod => {
        if (mod && typeof mod.importSharedBuildById === "function") mod.importSharedBuildById(idToImport);
      });
    }
  };

  if (hydrated && typeof hydrated === "object") {
    authGoogleEnabled = Boolean(hydrated.googleEnabled);
    authAdminInitialized = hydrated.adminInitialized !== false;
    setAuthUser(hydrated.authenticated ? hydrated.user : null);
    renderAuthUi();
    if (authUser) {
      pullCloudBuildsAndSync({
        mergeLocalMissing: fromGoogleOk,
        switchClass: false,
        showToast: fromGoogleOk
      }).finally(runPendingImport);
    } else {
      runPendingImport();
    }
  } else {
    fetchAuthSession({
      mergeLocalMissing: fromGoogleOk,
      switchClass: false,
      showToast: fromGoogleOk
    }).finally(runPendingImport);
  }
}


const ALERT_STORAGE_KEY = "d2r_personal_alerts_v1";
let alertPrefs = {
  desktop: false,
  sound: true,
  tzTierS: false,
  tzNotifyNext: true,
  tzZones: [],
  dcMinProgress: 5,
  dcDlc: "all",
  dcRegion: "all",
  dcMode: "all"
};
let alertBaselineSeeded = false;
const alertSeenKeys = new Set();
let alertLogEntries = [];

function loadAlertPrefs() {
  try {
    const raw = localStorage.getItem(ALERT_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return;
    alertPrefs = {
      desktop: Boolean(parsed.desktop),
      sound: parsed.sound !== undefined ? Boolean(parsed.sound) : true,
      tzTierS: Boolean(parsed.tzTierS),
      tzNotifyNext: parsed.tzNotifyNext !== undefined ? Boolean(parsed.tzNotifyNext) : true,
      tzZones: Array.isArray(parsed.tzZones) ? parsed.tzZones.filter(z => typeof z === "string" && z).slice(0, 50) : [],
      dcMinProgress: [0, 4, 5, 6].includes(Number(parsed.dcMinProgress)) ? Number(parsed.dcMinProgress) : 5,
      dcDlc: ["all", "rotw", "lod"].includes(parsed.dcDlc) ? parsed.dcDlc : "all",
      dcRegion: ["all", "Asia", "Americas", "Europe"].includes(parsed.dcRegion) ? parsed.dcRegion : "all",
      dcMode: ["all", "ladder-sc", "nl-sc", "ladder-hc", "nl-hc"].includes(parsed.dcMode) ? parsed.dcMode : "all"
    };
  } catch (e) {}
}

function saveAlertPrefs() {
  try {
    localStorage.setItem(ALERT_STORAGE_KEY, JSON.stringify(alertPrefs));
  } catch (e) {}
  renderAlertUi();
}

function isTzZoneStarred(zoneEn) {
  return Boolean(zoneEn && alertPrefs.tzZones.includes(zoneEn));
}

function toggleFavoriteTzZone(zoneEn) {
  if (!zoneEn) return;
  const idx = alertPrefs.tzZones.indexOf(zoneEn);
  if (idx >= 0) alertPrefs.tzZones.splice(idx, 1);
  else alertPrefs.tzZones.push(zoneEn);
  saveAlertPrefs();
  renderAlertTzZonesGrid();
  renderTzCatalog();
}

function playAlertChime(kind) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const notes = kind === "dclone"
      ? [{ f: 220, t: 0, d: 0.42, g: 0.14 }, { f: 587.33, t: 0.08, d: 0.3, g: 0.11 }, { f: 880, t: 0.24, d: 0.45, g: 0.12 }]
      : [{ f: 440, t: 0, d: 0.28, g: 0.1 }, { f: 659.25, t: 0.12, d: 0.3, g: 0.1 }, { f: 880, t: 0.24, d: 0.42, g: 0.1 }];
    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = kind === "dclone" ? "triangle" : "sine";
      osc.frequency.setValueAtTime(n.f, now + n.t);
      gain.gain.setValueAtTime(0.0001, now + n.t);
      gain.gain.exponentialRampToValueAtTime(n.g, now + n.t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d + 0.02);
    });
    setTimeout(() => { try { ctx.close(); } catch (e) {} }, 1200);
    return true;
  } catch (e) {
    return false;
  }
}

function renderAlertHistoryLog() {
  const box = document.getElementById("alert-history-list");
  if (!box) return;
  if (!alertLogEntries.length) {
    box.innerHTML = '<div style="color:var(--muted)">暂无触发记录（开启通道后，轮换命中将自动记录在此）</div>';
    return;
  }
  box.innerHTML = alertLogEntries.map(item =>
    '<div class="alert-log-item" style="border-left-color:' + (item.kind === "dclone" ? "#ef6b5b" : "#e284db") + '">' +
      '<div style="display:flex;justify-content:space-between;gap:8px"><strong>' + escapeHtml(item.title) + '</strong><span style="color:var(--muted);font-size:10.5px">' + escapeHtml(item.time) + '</span></div>' +
      '<div style="color:#b8afa3">' + escapeHtml(item.body) + '</div>' +
    '</div>'
  ).join("");
}

function firePersonalAlert(kind, title, body, tabTarget) {
  const nowStr = new Date().toLocaleTimeString("zh-CN", { hour12: false });
  alertLogEntries.unshift({ kind, title, body, time: nowStr });
  if (alertLogEntries.length > 10) alertLogEntries.length = 10;
  renderAlertHistoryLog();

  if (alertPrefs.sound) {
    playAlertChime(kind);
  }
  if (alertPrefs.desktop && typeof Notification !== "undefined" && Notification.permission === "granted") {
    try {
      const n = new Notification(title, {
        body,
        icon: kind === "dclone" ? "/images/items/misc/charm/annihilus.webp" : "/images/ui/joingame_desecratedindicator.webp",
        tag: "d2r-" + kind + "-" + Date.now()
      });
      n.onclick = () => {
        try { window.focus(); } catch (e) {}
        if (tabTarget && typeof switchMainTab === "function") switchMainTab(tabTarget);
      };
    } catch (e) {}
  }
  if (typeof showAuthToast === "function") {
    showAuthToast(title + " · " + body);
  }
}

function isAlertTzHit(zoneEn, details) {
  if (!zoneEn) return false;
  if (alertPrefs.tzZones.includes(zoneEn)) return true;
  if (alertPrefs.tzTierS) {
    const rating = (details && details.rating) || ((tzCatalog.find(z => z.zone === zoneEn) || {}).rating) || "";
    if (rating === "S" || rating === "S-A") return true;
  }
  return false;
}

function isAlertDcloneHit(server) {
  if (!server || alertPrefs.dcMinProgress <= 0) return false;
  if (Number(server.progress || 0) < alertPrefs.dcMinProgress) return false;
  if (alertPrefs.dcDlc === "rotw" && !server.rotw) return false;
  if (alertPrefs.dcDlc === "lod" && server.rotw) return false;
  const baseReg = String(server.region || "").replace(/Rotw$/i, "");
  if (alertPrefs.dcRegion !== "all" && baseReg !== alertPrefs.dcRegion) return false;
  const modeCode = (server.ladder ? "ladder-" : "nl-") + (server.hardcore ? "hc" : "sc");
  if (alertPrefs.dcMode !== "all" && modeCode !== alertPrefs.dcMode) return false;
  return true;
}

function evaluatePersonalAlerts(data, opts) {
  const triggered = [];
  if (!data) return triggered;
  const forceCheck = Boolean(opts && opts.forceCheck);
  const now = Number(opts && opts.now) || Date.now();
  const isChannelOn = Boolean(alertPrefs.sound || alertPrefs.desktop);

  const currentKeys = [];
  const candidates = [];

  const bucket = Math.floor(now / TZ_HALF_HOUR_MS);
  const nextBoundary = (bucket + 1) * TZ_HALF_HOUR_MS;
  const remainingMs = Math.max(0, nextBoundary - now);
  const nextBoundaryLabel = new Date(nextBoundary).toLocaleTimeString("zh-CN", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  const tz = resolveEffectiveTerrorZone(data.terrorZone, now);

  if (tz && tz.current) {
    const curKey = "tz:cur:" + bucket + ":" + tz.current;
    currentKeys.push(curKey);
    const alreadyAnnouncedPrev =
      alertPrefs.tzNotifyNext &&
      (alertSeenKeys.has("tz:next:" + (bucket - 1) + ":" + tz.current) ||
        alertSeenKeys.has("tz:next5m:" + (bucket - 1) + ":" + tz.current));
    if (!alreadyAnnouncedPrev && isAlertTzHit(tz.current, tz.currentDetails)) {
      candidates.push({
        key: curKey,
        kind: "tz",
        tab: "terror",
        title: "🌀 恐怖地带生效：" + (tz.currentZh || tz.current),
        body: "当前已轮换至你关注的恐怖地带（" + tz.current + "）"
      });
    }
  }
  if (tz && !tz.awaitingNext && tz.next) {
    const nextFetchKey = "tz:next:" + bucket + ":" + tz.next;
    const next5mKey = "tz:next5m:" + bucket + ":" + tz.next;
    currentKeys.push(nextFetchKey);
    const inPreSwitchWindow = remainingMs > 0 && remainingMs <= TZ_PRE_SWITCH_ALERT_MS;
    if (inPreSwitchWindow) {
      currentKeys.push(next5mKey);
    }
    if (alertPrefs.tzNotifyNext && isAlertTzHit(tz.next, tz.nextDetails)) {
      // 第 1 次提醒：抓取到下一阶段恐怖地带时
      candidates.push({
        key: nextFetchKey,
        kind: "tz",
        tab: "terror",
        title: "⏳ 下阶段恐怖地带预告：" + (tz.nextZh || tz.next),
        body: "已抓取到下阶段预告（" + tz.next + "），将于 " + nextBoundaryLabel + " 切换，切换前 5 分钟将再次提醒"
      });
      // 第 2 次提醒：距离切换剩余 ≤ 5 分钟时
      if (inPreSwitchWindow) {
        const remMin = Math.max(1, Math.ceil(remainingMs / 60000));
        candidates.push({
          key: next5mKey,
          kind: "tz",
          tab: "terror",
          title: "⏰ 即将切换恐怖地带：" + (tz.nextZh || tz.next),
          body: "距离切换仅剩约 " + remMin + " 分钟（" + nextBoundaryLabel + " 生效 · " + tz.next + "），请提前做好准备"
        });
      }
    }
  }

  const servers = Array.isArray(data.servers) ? data.servers : [];
  for (const s of servers) {
    const prog = Number(s.progress || 0);
    const sKey = "dc:" + (s.rotw ? "rotw" : "lod") + ":" + s.region + ":" + (s.ladder ? "L" : "NL") + ":" + (s.hardcore ? "HC" : "SC") + ":" + prog + ":" + (s.lastWalk || 0);
    if (prog >= 4) currentKeys.push(sKey);
    if (isAlertDcloneHit(s)) {
      const baseReg = String(s.region || "").replace(/Rotw$/i, "");
      const regZh = regionNames[baseReg] || baseReg;
      const verZh = s.rotw ? "术士君临" : "毁灭之王";
      const modeZh = (s.ladder ? "天梯" : "非天梯") + " " + (s.hardcore ? "HC" : "SC");
      candidates.push({
        key: sKey,
        kind: "dclone",
        tab: "dclone",
        title: "🔥 地表暗黑 " + prog + "/6：" + verZh + " · " + regZh + " " + modeZh,
        body: progressNames[prog] || ("当前进度已达 " + prog + "/6，请尽快进入对应地狱房间等待入侵")
      });
    }
  }

  if (!alertBaselineSeeded && !forceCheck) {
    currentKeys.forEach(k => alertSeenKeys.add(k));
    alertBaselineSeeded = true;
    return triggered;
  }

  for (const c of candidates) {
    if (alertSeenKeys.has(c.key)) continue;
    alertSeenKeys.add(c.key);
    if (isChannelOn) {
      firePersonalAlert(c.kind, c.title, c.body, c.tab);
      triggered.push(c);
    }
  }
  if (alertSeenKeys.size > 120) {
    const recent = [...alertSeenKeys].slice(-80);
    alertSeenKeys.clear();
    recent.forEach(k => alertSeenKeys.add(k));
  }
  return triggered;
}

function renderAlertTzZonesGrid() {
  const grid = document.getElementById("alert-tz-zones-grid");
  const cntEl = document.getElementById("alert-tz-count");
  if (cntEl) cntEl.textContent = String(alertPrefs.tzZones.length);
  if (!grid) return;
  if (!tzCatalog || !tzCatalog.length) {
    grid.innerHTML = '<div style="font-size:12px;color:var(--muted)">正在加载 37 个恐怖地带…</div>';
    return;
  }
  const sorted = [...tzCatalog].sort((a, b) => {
    const score = (r) => (r === "S" ? 0 : r === "S-A" ? 1 : r === "A" ? 2 : r === "B" ? 3 : 4);
    return (score(a.rating) - score(b.rating)) || ((a.act || 1) - (b.act || 1));
  });
  grid.innerHTML = sorted.map(z => {
    const active = alertPrefs.tzZones.includes(z.zone);
    const tierTag = z.rating ? (" [" + z.rating + "]") : "";
    return '<button type="button" class="alert-zone-chip' + (active ? ' active' : '') + '" data-alert-zone="' + escapeHtml(z.zone) + '">' +
      (active ? '★ ' : '') + escapeHtml(z.zoneZh + tierTag) +
    '</button>';
  }).join("");
  grid.querySelectorAll("[data-alert-zone]").forEach(btn => {
    btn.addEventListener("click", () => toggleFavoriteTzZone(btn.dataset.alertZone));
  });
}

function renderAlertUi() {
  const dot = document.getElementById("alert-active-dot");
  const btnLabel = document.getElementById("alert-btn-label");
  const permEl = document.getElementById("alert-perm-status");
  const reqBtn = document.getElementById("alert-request-perm-btn");

  const hasRules = alertPrefs.tzTierS || alertPrefs.tzZones.length > 0 || alertPrefs.dcMinProgress > 0;
  const hasChannel = alertPrefs.sound || alertPrefs.desktop;
  const isActive = hasRules && hasChannel;
  if (dot) dot.style.display = isActive ? "inline-block" : "none";
  if (btnLabel) {
    btnLabel.textContent = isActive
      ? ("提醒开启" + (alertPrefs.tzZones.length ? ("(" + alertPrefs.tzZones.length + ")") : ""))
      : "个人提醒";
  }

  if (permEl) {
    if (typeof Notification === "undefined") {
      permEl.textContent = "当前浏览器不支持桌面通知";
      permEl.style.color = "#ff9b8f";
      if (reqBtn) reqBtn.style.display = "none";
    } else if (Notification.permission === "granted") {
      permEl.textContent = "✓ 桌面通知已授权";
      permEl.style.color = "#67e87a";
      if (reqBtn) reqBtn.style.display = "none";
    } else if (Notification.permission === "denied") {
      permEl.textContent = "✗ 已被浏览器拦截（请在地址栏左侧解锁）";
      permEl.style.color = "#ff9b8f";
      if (reqBtn) reqBtn.style.display = "none";
    } else {
      permEl.textContent = "待授权桌面通知";
      permEl.style.color = "#ffd573";
      if (reqBtn) reqBtn.style.display = "inline-flex";
    }
  }

  const setChk = (id, v) => { const el = document.getElementById(id); if (el) el.checked = Boolean(v); };
  const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = String(v); };
  setChk("alert-desktop-toggle", alertPrefs.desktop);
  setChk("alert-sound-toggle", alertPrefs.sound);
  setChk("alert-tz-tier-s", alertPrefs.tzTierS);
  setChk("alert-tz-next-toggle", alertPrefs.tzNotifyNext);
  setVal("alert-dc-min-progress", alertPrefs.dcMinProgress);
  setVal("alert-dc-dlc", alertPrefs.dcDlc);
  setVal("alert-dc-region", alertPrefs.dcRegion);
  setVal("alert-dc-mode", alertPrefs.dcMode);
  const cntEl = document.getElementById("alert-tz-count");
  if (cntEl) cntEl.textContent = String(alertPrefs.tzZones.length);
}

function openAlertDialog() {
  const dlg = document.getElementById("alert-dialog");
  if (!dlg) return;
  renderAlertUi();
  renderAlertTzZonesGrid();
  renderAlertHistoryLog();
  if (!dlg.open) dlg.showModal();
}

function setupPersonalAlerts() {
  loadAlertPrefs();
  renderAlertUi();

  const dlg = document.getElementById("alert-dialog");
  ["alert-open-btn", "tz-alert-shortcut-btn"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", openAlertDialog);
  });
  const closeBtn = document.getElementById("alert-close-btn");
  if (closeBtn && dlg) closeBtn.addEventListener("click", () => dlg.close());
  if (dlg) {
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) dlg.close();
    });
  }

  const reqPerm = async () => {
    if (typeof Notification === "undefined" || typeof Notification.requestPermission !== "function") {
      renderAlertUi();
      return "denied";
    }
    try {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        alertPrefs.desktop = true;
        saveAlertPrefs();
        showAuthToast("✓ 已开启浏览器桌面通知权限");
      } else {
        alertPrefs.desktop = false;
        saveAlertPrefs();
        showAuthToast("浏览器未授予桌面通知权限，已保留网页提示音", true);
      }
      return perm;
    } catch (e) {
      return "denied";
    }
  };

  const reqBtn = document.getElementById("alert-request-perm-btn");
  if (reqBtn) reqBtn.addEventListener("click", reqPerm);

  const deskToggle = document.getElementById("alert-desktop-toggle");
  if (deskToggle) {
    deskToggle.addEventListener("change", async () => {
      if (deskToggle.checked) {
        if (typeof Notification !== "undefined" && Notification.permission === "default") {
          await reqPerm();
          return;
        }
        if (typeof Notification === "undefined" || Notification.permission !== "granted") {
          deskToggle.checked = false;
          alertPrefs.desktop = false;
          saveAlertPrefs();
          showAuthToast("请先在浏览器设置中允许本站桌面通知", true);
          return;
        }
      }
      alertPrefs.desktop = Boolean(deskToggle.checked);
      saveAlertPrefs();
    });
  }

  const bindChk = (id, key) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", () => { alertPrefs[key] = Boolean(el.checked); saveAlertPrefs(); });
  };
  bindChk("alert-sound-toggle", "sound");
  bindChk("alert-tz-tier-s", "tzTierS");
  bindChk("alert-tz-next-toggle", "tzNotifyNext");

  const bindSel = (id, key, isNum) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", () => { alertPrefs[key] = isNum ? Number(el.value || 0) : el.value; saveAlertPrefs(); });
  };
  bindSel("alert-dc-min-progress", "dcMinProgress", true);
  bindSel("alert-dc-dlc", "dcDlc", false);
  bindSel("alert-dc-region", "dcRegion", false);
  bindSel("alert-dc-mode", "dcMode", false);

  const pickSBtn = document.getElementById("alert-tz-pick-s-btn");
  if (pickSBtn) {
    pickSBtn.addEventListener("click", () => {
      const sZones = (tzCatalog || []).filter(z => z.rating === "S" || z.rating === "S-A").map(z => z.zone);
      const merged = new Set([...alertPrefs.tzZones, ...sZones]);
      alertPrefs.tzZones = [...merged];
      saveAlertPrefs();
      renderAlertTzZonesGrid();
      renderTzCatalog();
    });
  }
  const clearTzBtn = document.getElementById("alert-tz-clear-btn");
  if (clearTzBtn) {
    clearTzBtn.addEventListener("click", () => {
      alertPrefs.tzZones = [];
      saveAlertPrefs();
      renderAlertTzZonesGrid();
      renderTzCatalog();
    });
  }

  const testBtn = document.getElementById("alert-test-btn");
  if (testBtn) {
    testBtn.addEventListener("click", () => {
      firePersonalAlert("dclone", "🔔 庇护之地测试提醒", "声音与桌面提醒通道工作正常（恐怖地带 / 地表暗黑就绪）", "terror");
    });
  }
}


// Register core callbacks on shared bus for lazy tab modules
D2R.core.applyDomTraditionalSweep = applyDomTraditionalSweep;
D2R.core.scheduleCloudSync = scheduleCloudSync;
D2R.core.showAuthToast = showAuthToast;
D2R.core.switchMainTab = switchMainTab;
D2R.core.loadUserSharedBuilds = loadUserSharedBuilds;
D2R.core.ensureTabModule = ensureTabModule;
D2R.core.openAuthDialog = openAuthDialog;
D2R.core.renderImmunityIconBadge = renderImmunityIconBadge;

// Boot core immediately (heavy tabs lazy-load on first visit via native ES Module import())
const tzJumpDropsBtn = document.getElementById("tz-jump-drops-btn");
if (tzJumpDropsBtn) {
  tzJumpDropsBtn.addEventListener("click", () => {
    switchMainTab("items");
    ensureTabModule("items").then((mod) => {
      if (mod && typeof mod.jumpToCurrentTzDrops === "function") mod.jumpToCurrentTzDrops();
    });
  });
}

function setupThemeSwitcher() {
  const buttons = document.querySelectorAll("[data-theme-mode]");
  if (!buttons.length) return;
  const resolveLocal = (mode) => {
    if (mode === "light" || mode === "dark") return mode;
    return (typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: light)").matches) ? "light" : "dark";
  };
  const sync = (mode) => {
    buttons.forEach((btn) => {
      const on = btn.getAttribute("data-theme-mode") === mode;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  };
  sync(document.documentElement.getAttribute("data-theme-mode") || "auto");
  if (!window.__d2rThemeClickBound) {
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.getAttribute("data-theme-mode") || "auto";
        if (typeof window.__d2rSetThemeMode === "function") {
          window.__d2rSetThemeMode(next);
        } else {
          const resolved = resolveLocal(next);
          document.documentElement.setAttribute("data-theme-mode", next);
          document.documentElement.setAttribute("data-theme", resolved);
          try { localStorage.setItem("d2r-ui-theme-mode", next); } catch (e) {}
          sync(next);
        }
      });
    });
  }
}

function setupGlobalHudAndShortcuts() {
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
    if (document.querySelector("dialog[open]")) return;
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
    if (tag === "input" || tag === "textarea" || tag === "select" || (e.target && e.target.isContentEditable)) return;
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

setupThemeSwitcher();
setupLangSwitcher();
loadSystemConfig();
setupTzDirectoryEvents();
initMainTabs();
setupGlobalHudAndShortcuts();
setupPersonalAlerts();
setupAuthAndCloudSync();
load();

if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
