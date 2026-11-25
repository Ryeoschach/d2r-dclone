// Shared ES Module state, storage keys, helpers & cross-tab bus for Sanctuary Live Dashboard
export const RW_STORAGE_KEY = "dclone-runewords-completed";
export const GRAIL_UNIQUE_KEY = "d2r-grail-uniques-v1";
export const GRAIL_SET_KEY = "d2r-grail-sets-v1";
export const SK_STORAGE_KEY = "d2r-skill-builds-v1";
export const PD_STORAGE_KEY = "d2r_paperdoll_builds_v1";

export const AUTH_CLASS_LABELS = {
  war: "术士", sor: "法师", pal: "圣骑士", ama: "亚马逊",
  nec: "死灵法师", bar: "野蛮人", dru: "德鲁伊", ass: "刺客"
};

export const MAIN_TABS = [
  { id: "terror", tabId: "main-tab-terror", panelId: "main-panel-terror", hash: "#terror-zone" },
  { id: "dclone", tabId: "main-tab-dclone", panelId: "main-panel-dclone", hash: "#dclone" },
  { id: "runewords", tabId: "main-tab-runewords", panelId: "main-panel-runewords", hash: "#runewords" },
  { id: "affixes", tabId: "main-tab-affixes", panelId: "main-panel-affixes", hash: "#affixes" },
  { id: "items", tabId: "main-tab-items", panelId: "main-panel-items", hash: "#items" },
  { id: "skills", tabId: "main-tab-skills", panelId: "main-panel-skills", hash: "#skills" }
];

// Asset hash manifest injected via <meta name="d2r-assets">
let _assetManifest = null;
export function getAssetVersion(filename) {
  if (!_assetManifest) {
    _assetManifest = {};
    try {
      const meta = typeof document !== "undefined" ? document.querySelector('meta[name="d2r-assets"]') : null;
      if (meta && meta.content) _assetManifest = JSON.parse(meta.content) || {};
    } catch (e) {}
  }
  return _assetManifest[filename] || "";
}

// Live-binding shared reactive state
export let currentLang = "zhCN";
try {
  const savedLang = typeof localStorage !== "undefined" ? localStorage.getItem("d2r-lang") : null;
  if (savedLang === "zhCN" || savedLang === "zhTW" || savedLang === "enUS") currentLang = savedLang;
} catch (e) {}
export function setCurrentLang(v) { currentLang = v; }

export let activeMainTab = "terror";
export function setActiveMainTab(v) { activeMainTab = v; }

export let authUser = null;
export function setAuthUser(v) { authUser = v; }

export let itData = null;
export function setItData(v) { itData = v; }

export let rwRunes = [];
export function setRwRunes(v) { rwRunes = Array.isArray(v) ? v : []; }

export let rwList = [];
export function setRwList(v) { rwList = Array.isArray(v) ? v : []; }

export let rwCompleted = new Set();
export function setRwCompleted(v) { rwCompleted = v instanceof Set ? v : new Set(Array.isArray(v) ? v : []); }

export let grailUniques = new Set();
export function setGrailUniques(v) { grailUniques = v instanceof Set ? v : new Set(Array.isArray(v) ? v : []); }

export let grailSetPieces = new Set();
export function setGrailSetPieces(v) { grailSetPieces = v instanceof Set ? v : new Set(Array.isArray(v) ? v : []); }

export let skClasses = [];
export function setSkClasses(v) { skClasses = Array.isArray(v) ? v : []; }

export let skActiveClassId = "war";
export function setSkActiveClassId(v) { skActiveClassId = v || "war"; }

export let skBuilds = {};
export function setSkBuilds(v) { skBuilds = v && typeof v === "object" ? v : {}; }

export let pdData = null;
export function setPdData(v) { pdData = v; }

export let pdSavedByClass = {};
export function setPdSavedByClass(v) { pdSavedByClass = v && typeof v === "object" ? v : {}; }

export let pdStateLoadedForClass = "";
export function setPdStateLoadedForClass(v) { pdStateLoadedForClass = v || ""; }

// Cross-tab callback bus & lazy i18n dictionary
export const D2R = (typeof globalThis !== "undefined" ? (globalThis.__D2R = globalThis.__D2R || {}) : {});
D2R.tabs = D2R.tabs || { runewords: null, affixes: null, items: null, skills: null };
D2R.core = D2R.core || {};

let _i18nDict = null;
let _i18nDictPromise = null;
export async function ensureI18nDictLoaded() {
  if (_i18nDict) return _i18nDict;
  if (!_i18nDictPromise) {
    const v = getAssetVersion("i18n-dict.js");
    const url = "./i18n-dict.js" + (v ? ("?v=" + encodeURIComponent(v)) : "");
    _i18nDictPromise = import(url).then((mod) => {
      _i18nDict = mod;
      return mod;
    }).catch((err) => {
      _i18nDictPromise = null;
      throw err;
    });
  }
  return _i18nDictPromise;
}

export function toZhTW(str) {
  if (!str) return "";
  let s = String(str);
  if (!_i18nDict) return s;
  const pairs = _i18nDict.TW_PHRASE_PAIRS;
  for (let i = 0; i < pairs.length; i++) {
    const k = pairs[i][0];
    if (s.includes(k)) s = s.split(k).join(pairs[i][1]);
  }
  let out = "";
  const map = _i18nDict.CN2TW_MAP;
  for (const ch of s) out += map.get(ch) || ch;
  return out;
}

export function toEnUS(str) {
  if (!str) return "";
  let s = String(str);
  if (!/[一-鿿]/.test(s)) return s;
  s = s.replace(/第\s*([一二三四五1-5])\s*幕/g, (_, m) => {
    const map = { "一": 1, "二": 2, "三": 3, "四": 4, "五": 5 };
    return "Act " + (map[m] || m);
  });
  s = s.replace(/可出\s*(\d+)\s*孔/g, "Max $1 Sockets");
  s = s.replace(/最大\s*(\d+)\s*孔/g, "Max $1 Sockets");
  s = s.replace(/(\d+)\s*孔/g, "$1 Sockets");
  s = s.replace(/(\d+)\s*件套/g, "$1-Piece Set");
  s = s.replace(/【(\d+)\s*件】/g, "[$1 Pieces]");
  s = s.replace(/(\d+(?:[–-]\d+)?)\s*件：/g, "$1 Pieces: ");
  s = s.replace(/需求等级\s*(\d+)/g, "Req Lvl $1");
  s = s.replace(/需求力量\s*(\d+)/g, "Req Str $1");
  s = s.replace(/距切换\s*/g, "Next in ");
  s = s.replace(/需\s*(\d+)/g, "Need $1");
  s = s.replace(/总\s*(\d+)/g, "Total $1");
  if (_i18nDict) {
    const pairs = _i18nDict.EN_PHRASE_PAIRS;
    for (let i = 0; i < pairs.length; i++) {
      const k = pairs[i][0];
      if (s.includes(k)) s = s.split(k).join(" " + pairs[i][1] + " ");
    }
  }
  return s.replace(/\s{2,}/g, " ").trim();
}

export function pickLangTitle(item) {
  if (!item) return "";
  if (currentLang === "zhTW") return (item.i18n && item.i18n.zhTW) || toZhTW(item.nameZh || item.zhName || "");
  if (currentLang === "enUS") return (item.i18n && item.i18n.enUS) || item.nameEn || item.enName || item.name || "";
  return (item.i18n && item.i18n.zhCN) || item.nameZh || item.zhName || "";
}

export function pickLangSub(item) {
  if (!item) return "";
  if (currentLang === "enUS") return (item.i18n && item.i18n.zhCN) || item.nameZh || item.zhName || "";
  return (item.i18n && item.i18n.enUS) || item.nameEn || item.enName || item.name || "";
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

export function formatTime(seconds) {
  if (!seconds) return "暂无记录";
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
    hour12: false
  }).format(new Date(seconds * 1000));
}

export function cloneJsonSafe(value, fallback) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (e) {
    return fallback;
  }
}

export function renderStatList(str, color, splitPlus, extraClass) {
  if (!str) return "";
  const raw = String(str).trim();
  if (!raw) return "";
  let parts = raw.split(/\s*[·•\n]\s*/).filter(Boolean);
  if (splitPlus && parts.length === 1 && /\s+\+/.test(raw)) {
    parts = raw.split(/\s+(?=\+)/).filter(Boolean);
  }
  const style = color ? (' style="color:' + color + '"') : "";
  const cls = extraClass ? ('stat-list ' + extraClass) : 'stat-list';
  return '<ul class="' + cls + '"' + style + '>' +
    parts.map(p => '<li>' + escapeHtml(p.trim()) + '</li>').join("") +
    '</ul>';
}

// Shared catalog loaders (deduplicated so Paperdoll & Items/Runewords tabs never duplicate fetches)
let _itemsFetchPromise = null;
export async function ensureItemsCatalogData() {
  if (itData) return itData;
  if (!_itemsFetchPromise) {
    _itemsFetchPromise = fetch("/api/items", { cache: "no-store" })
      .then(r => r.json())
      .then(data => {
        if (data && data.ok) {
          setItData(data);
          return data;
        }
        return null;
      })
      .finally(() => { _itemsFetchPromise = null; });
  }
  return _itemsFetchPromise;
}

let _rwFetchPromise = null;
export async function ensureRunewordsCatalogData() {
  if (rwList.length) return { runes: rwRunes, runewords: rwList };
  if (!_rwFetchPromise) {
    _rwFetchPromise = fetch("/api/runewords", { cache: "no-store" })
      .then(r => r.json())
      .then(data => {
        if (data && data.ok) {
          setRwRunes(data.runes || []);
          setRwList(data.runewords || []);
          return { runes: rwRunes, runewords: rwList };
        }
        return null;
      })
      .finally(() => { _rwFetchPromise = null; });
  }
  return _rwFetchPromise;
}

// Core action proxies invoked by lazy tab modules
export function applyDomTraditionalSweep() {
  if (typeof D2R.core.applyDomTraditionalSweep === "function") D2R.core.applyDomTraditionalSweep();
}
export function scheduleCloudSync() {
  if (typeof D2R.core.scheduleCloudSync === "function") D2R.core.scheduleCloudSync();
}
export function showAuthToast(msg, isError) {
  if (typeof D2R.core.showAuthToast === "function") D2R.core.showAuthToast(msg, isError);
}
export function switchMainTab(tabId, updateHash = true) {
  if (typeof D2R.core.switchMainTab === "function") return D2R.core.switchMainTab(tabId, updateHash);
}
export function loadUserSharedBuilds() {
  if (typeof D2R.core.loadUserSharedBuilds === "function") return D2R.core.loadUserSharedBuilds();
}
export function ensureTabModule(tabId) {
  if (typeof D2R.core.ensureTabModule === "function") return D2R.core.ensureTabModule(tabId);
  return Promise.resolve(null);
}
export function openAuthDialog(defaultTab) {
  if (typeof D2R.core.openAuthDialog === "function") return D2R.core.openAuthDialog(defaultTab);
}
export function renderImmunityIconBadge(imm) {
  if (typeof D2R.core.renderImmunityIconBadge === "function") return D2R.core.renderImmunityIconBadge(imm);
  return "";
}
