import {
  D2R, SK_STORAGE_KEY, PD_STORAGE_KEY, AUTH_CLASS_LABELS,
  currentLang, activeMainTab, authUser,
  itData, rwList,
  skClasses, setSkClasses, skActiveClassId, setSkActiveClassId, skBuilds, setSkBuilds,
  pdData, setPdData, pdSavedByClass, setPdSavedByClass, pdStateLoadedForClass, setPdStateLoadedForClass,
  pickLangTitle, escapeHtml, renderStatList, cloneJsonSafe,
  ensureItemsCatalogData, ensureRunewordsCatalogData,
  applyDomTraditionalSweep, scheduleCloudSync, showAuthToast, switchMainTab, loadUserSharedBuilds
} from "./shared.js?v=09528eb701";

const SK_MAX_POINTS = 110;
let skSelectedSkillKey = null;
let skBonusAll = 0;
let skBonusByTab = { 1: 0, 2: 0, 3: 0 };
let skBonusBySkill = {};
let skBonusFire = 0;
let skBonusClassId = "";

function getSkillTreeBonusForSkill(sk) {
  if (!sk) return skBonusAll;
  const sameClass = !skBonusClassId || skBonusClassId === skActiveClassId;
  let extra = sameClass ? ((skBonusByTab[sk.page] || 0) + (skBonusBySkill[sk.key] || 0)) : 0;
  if (sameClass && skBonusFire > 0 && sk.dmg && sk.dmg.type === "fire" && !(skActiveClassId === "sor" && sk.page === 1)) {
    extra += skBonusFire;
  }
  return skBonusAll + extra;
}

function renderSkSyncedExtraBadge() {
  const el = document.getElementById("sk-synced-extra-badge");
  if (!el) return;
  const clsObj = getActiveClassObj();
  if (!clsObj || (skBonusClassId && skBonusClassId !== skActiveClassId)) {
    el.style.display = "none";
    return;
  }
  const parts = [];
  (clsObj.tabs || []).forEach(t => {
    const v = skBonusByTab[t.page] || 0;
    if (v > 0) parts.push(t.zhCN + " +" + v);
  });
  if (skBonusFire > 0) parts.push("火焰技能 +" + skBonusFire);
  Object.entries(skBonusBySkill || {}).forEach(([k, v]) => {
    if (v > 0) {
      const s = clsObj.skills.find(x => x.key === k);
      parts.push((s ? s.nameZh : k) + " +" + v);
    }
  });
  if (parts.length) {
    el.style.display = "inline-block";
    el.textContent = "已同步分系/单技能：" + parts.join(" · ");
  } else {
    el.style.display = "none";
  }
}

function loadSkBuilds() {
  try {
    const raw = localStorage.getItem(SK_STORAGE_KEY);
    if (raw) setSkBuilds(JSON.parse(raw) || {});
  } catch (e) {
    setSkBuilds({});
  }
}

function saveSkBuilds() {
  try {
    localStorage.setItem(SK_STORAGE_KEY, JSON.stringify(skBuilds));
    if (!window.__cloudApplyingRemote) {
      localStorage.setItem("d2r-builds-local-updated-at", new Date().toISOString());
      if (typeof scheduleCloudSync === "function") scheduleCloudSync();
    }
  } catch (e) {}
}

function getClassBuild(classId) {
  if (!skBuilds[classId]) skBuilds[classId] = {};
  return skBuilds[classId];
}

function getActiveClassObj() {
  return skClasses.find(c => c.id === skActiveClassId) || skClasses[0] || null;
}

function getClassTotalPoints(classId) {
  const b = skBuilds[classId] || {};
  let sum = 0;
  for (const k in b) sum += Number(b[k] || 0);
  return sum;
}

function computeScaledValue(arr, hitShift, lvl) {
  if (!Array.isArray(arr) || lvl <= 0) return 0;
  let val = Number(arr[0] || 0);
  const l1 = Math.max(0, Math.min(lvl - 1, 7));
  const l2 = Math.max(0, Math.min(lvl - 8, 8));
  const l3 = Math.max(0, Math.min(lvl - 16, 6));
  const l4 = Math.max(0, Math.min(lvl - 22, 6));
  const l5 = Math.max(0, lvl - 28);
  val += l1 * Number(arr[1] || 0) + l2 * Number(arr[2] || 0) + l3 * Number(arr[3] || 0) + l4 * Number(arr[4] || 0) + l5 * Number(arr[5] || 0);
  const shift = typeof hitShift === "number" ? hitShift : 8;
  return Math.round((val * Math.pow(2, shift)) / 256 * 10) / 10;
}

function computeSkillMana(sk, lvl) {
  if (!sk || !sk.mana || lvl <= 0) return 0;
  const raw = (sk.mana.base + (lvl - 1) * sk.mana.lvl) * Math.pow(2, sk.mana.shift) / 256;
  return Math.max(sk.mana.min || 0, Math.round(raw * 10) / 10);
}

function computeSkillDamage(sk, clsObj, build, lvl) {
  if (!sk || !sk.dmg || lvl <= 0) return null;
  const baseMin = computeScaledValue(sk.dmg.min, sk.dmg.hitShift, lvl);
  const baseMax = computeScaledValue(sk.dmg.max, sk.dmg.hitShift, lvl);
  let synPct = 0;
  if (Array.isArray(sk.dmgSynergies)) {
    for (const syn of sk.dmgSynergies) {
      const pts = Number(build[syn.skill] || 0);
      synPct += pts * Number(syn.pct || 0);
    }
  }
  const mult = 1 + synPct / 100;
  return {
    type: sk.dmg.type,
    min: Math.round(baseMin * mult),
    max: Math.round(baseMax * mult),
    synPct
  };
}

function ensureSkillPrereqs(clsObj, build, sk, budgetRem) {
  let needed = 0;
  const toActivate = [];
  const visited = new Set();
  function walk(s) {
    if (!s || visited.has(s.key)) return;
    visited.add(s.key);
    for (const reqKey of (s.reqs || [])) {
      const reqSk = clsObj.skills.find(x => x.key === reqKey);
      if (reqSk) {
        walk(reqSk);
        if (!build[reqSk.key]) {
          needed += 1;
          toActivate.push(reqSk.key);
        }
      }
    }
  }
  walk(sk);
  if (needed > budgetRem) return -1;
  for (const k of toActivate) build[k] = 1;
  return needed;
}

function canRemoveSkillPoint(clsObj, build, sk) {
  const cur = Number(build[sk.key] || 0);
  if (cur <= 0) return false;
  if (cur > 1) return true;
  for (const other of clsObj.skills) {
    if (Number(build[other.key] || 0) > 0 && (other.reqs || []).includes(sk.key)) {
      return false;
    }
  }
  return true;
}

function modifySkillPoint(skillKey, delta) {
  const clsObj = getActiveClassObj();
  if (!clsObj) return;
  const sk = clsObj.skills.find(s => s.key === skillKey);
  if (!sk) return;
  const build = getClassBuild(clsObj.id);

  if (delta > 0) {
    let used = getClassTotalPoints(clsObj.id);
    let rem = SK_MAX_POINTS - used;
    if (rem <= 0) return;
    const cur = Number(build[sk.key] || 0);
    if (cur >= 20) return;
    const preSpent = ensureSkillPrereqs(clsObj, build, sk, rem - 1);
    if (preSpent < 0) return;
    rem -= preSpent;
    const add = Math.min(delta, 20 - cur, rem);
    if (add > 0) {
      build[sk.key] = cur + add;
    }
  } else if (delta < 0) {
    let steps = Math.abs(delta);
    while (steps > 0 && canRemoveSkillPoint(clsObj, build, sk)) {
      build[sk.key] = Number(build[sk.key] || 0) - 1;
      if (build[sk.key] <= 0) delete build[sk.key];
      steps -= 1;
    }
  }

  saveSkBuilds();
  renderSkillsAll();
}

function pickSkLang(obj, zhKey, twKey, enKey) {
  if (!obj) return "";
  if (currentLang === "zhTW") return obj[twKey] || obj[zhKey] || "";
  if (currentLang === "enUS") return obj[enKey] || obj[zhKey] || "";
  return obj[zhKey] || "";
}

function renderSkillsClassTabs() {
  const wrap = document.getElementById("sk-class-tabs");
  if (!wrap || !skClasses.length) return;

  if (wrap.querySelectorAll("[data-sk-class]").length !== skClasses.length) {
    wrap.innerHTML = skClasses.map(cls => {
      const badge34 = cls.isNew34 ? ' <span class="rw-badge rw-badge-patch" style="font-size:10px;padding:1px 4px">3.4</span>' : '';
      return '<button type="button" class="sk-class-btn" data-sk-class="' + escapeHtml(cls.id) + '">' +
        '<img class="sk-class-avatar" src="' + escapeHtml(cls.icon) + '" alt="" />' +
        '<div class="sk-class-meta" data-no-sweep="1">' +
          '<div class="sk-class-name"><span class="sk-cls-title"></span>' + badge34 + '</div>' +
          '<div class="sk-class-pts">0 / 110</div>' +
        '</div>' +
      '</button>';
    }).join("");

    wrap.querySelectorAll("[data-sk-class]").forEach(btn => {
      btn.addEventListener("click", () => {
        const nextCid = btn.dataset.skClass;
        if (nextCid !== skActiveClassId) {
          if (typeof savePaperdollState === "function") savePaperdollState(skActiveClassId);
          setSkActiveClassId(nextCid);
          bpManualOverride = false;
          if (typeof loadPaperdollStateForClass === "function") loadPaperdollStateForClass(skActiveClassId);
        }
        const clsObj = getActiveClassObj();
        skSelectedSkillKey = null;
        skHoveredSkillKey = null;
        renderSkillsAll();
      });
    });
  }

  wrap.querySelectorAll("[data-sk-class]").forEach(btn => {
    const cid = btn.dataset.skClass;
    const cls = skClasses.find(c => c.id === cid);
    btn.classList.toggle("active", cid === skActiveClassId);
    const titleEl = btn.querySelector(".sk-cls-title");
    if (titleEl && cls) titleEl.textContent = pickSkLang(cls, "nameZh", "nameTw", "nameEn");
    const ptsEl = btn.querySelector(".sk-class-pts");
    if (ptsEl) ptsEl.textContent = getClassTotalPoints(cid) + " / " + SK_MAX_POINTS;
  });
}

const SK_NATIVE_UI_ICONS = {
  "Summon Goatman": "/images/ui/khazra.webp",
  "Summon Tainted": "/images/ui/tainted.webp",
  "Summon Defiler": "/images/ui/defiler.webp",
  "Bind Demon": "/images/ui/binddemon.webp",
  "Valkyrie": "/images/ui/valkarieicon.webp",
  "Raise Skeleton": "/images/ui/skeletonicon.webp",
  "Skeleton Mastery": "/images/ui/skeletonicon.webp",
  "Raise Skeletal Mage": "/images/ui/skeletonmageicon.webp",
  "Clay Golem": "/images/ui/golemicon.webp",
  "Golem Mastery": "/images/ui/earthgolumicon.webp",
  "BloodGolem": "/images/ui/bloodgolumicon.webp",
  "IronGolem": "/images/ui/metalgolumicon.webp",
  "FireGolem": "/images/ui/f_elementicon.webp",
  "Revive": "/images/ui/revivedicon.webp",
  "Raven": "/images/ui/raven.webp",
  "Summon Spirit Wolf": "/images/ui/wolf.webp",
  "Summon Fenris": "/images/ui/wolf.webp",
  "Wearwolf": "/images/ui/wolf.webp",
  "Summon Grizzly": "/images/ui/bear.webp",
  "Wearbear": "/images/ui/bear.webp",
  "Oak Sage": "/images/ui/oaksage.webp",
  "Heart of Wolverine": "/images/ui/heartofwolverine.webp",
  "Spirit of Barbs": "/images/ui/spiritofbarbs.webp",
  "Plague Poppy": "/images/ui/plaguepoppy.webp",
  "Cycle of Life": "/images/ui/cycleoflife.webp",
  "Vines": "/images/ui/vines.webp",
  "Shadow Warrior": "/images/ui/shadowassassin.webp",
  "Shadow Master": "/images/ui/shadowassassin.webp"
};

const SK_ELEM_ICONS = {
  fire: { src: "/images/ui/f_elementicon.webp", cls: "elem-fire" },
  cold: { src: "/images/ui/i_elementicon.webp", cls: "elem-cold" },
  ltng: { src: "/images/ui/l_elementicon.webp", cls: "elem-ltng" },
  pois: { src: "/images/ui/p_elementicon.webp", cls: "elem-pois" }
};

let skHoveredSkillKey = null;
let skTreeResizeObserver = null;
let skTreeDrawRaf = 0;

function getSkillNodeIconHtml(clsId, sk) {
  if (sk && sk.icon) {
    return '<span class="sk-icon-frame is-hd"><img class="sk-node-icon-img" src="' + escapeHtml(sk.icon) + '" alt="" loading="lazy" /></span>';
  }
  const nativeSrc = SK_NATIVE_UI_ICONS[sk.key];
  if (nativeSrc) {
    return '<span class="sk-icon-frame is-native"><img class="sk-node-icon-img" src="' + nativeSrc + '" alt="" loading="lazy" /></span>';
  }
  const elemType = sk.dmg && sk.dmg.type ? String(sk.dmg.type).toLowerCase() : "";
  if (SK_ELEM_ICONS[elemType]) {
    const info = SK_ELEM_ICONS[elemType];
    return '<span class="sk-icon-frame is-elem ' + info.cls + '"><img class="sk-node-icon-img is-elem-img" src="' + info.src + '" alt="" loading="lazy" /></span>';
  }
  // Minimal semantic D2R category emblem (magic / aura / curse / passive / combat)
  let glyphClass = "cat-combat";
  let svgPath = '<path d="M14.5 3.5l2 2-7.8 7.8 1.5 1.5-1.2 1.2-2.2-2.2-2.3 2.3-1.2-1.2 2.3-2.3-2.2-2.2 1.2-1.2 1.5 1.5z"/>';
  if (elemType === "mag" || (clsId === "war" && sk.page === 3)) {
    glyphClass = "cat-magic";
    svgPath = '<path d="M10 2.5l2.1 5.4 5.4 2.1-5.4 2.1L10 17.5l-2.1-5.4L2.5 10l5.4-2.1z"/>';
  } else if (sk.passive) {
    glyphClass = "cat-passive";
    svgPath = '<path d="M10 2.8l6 2.6v4.4c0 3.8-2.5 6.8-6 8.2-3.5-1.4-6-4.4-6-8.2V5.4l6-2.6zm0 3.2L6.8 7.4v2.4c0 2.4 1.5 4.3 3.2 5.2 1.7-.9 3.2-2.8 3.2-5.2V7.4L10 6z"/>';
  } else if (clsId === "pal" && (sk.page === 1 || sk.page === 2)) {
    glyphClass = "cat-aura";
    svgPath = '<circle cx="10" cy="10" r="3.2"/><path d="M10 2v2.4M10 15.6V18M2 10h2.4M15.6 10H18M4.3 4.3l1.7 1.7M14 14l1.7 1.7M15.7 4.3L14 6M6 14l-1.7 1.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/>';
  } else if ((clsId === "nec" && sk.page === 1) || (clsId === "war" && sk.page === 2)) {
    glyphClass = "cat-curse";
    svgPath = '<path d="M10 3C6.1 3 3 6.1 3 10s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 2.2c1.8 0 3.3 1 4.1 2.4-1.3-.5-2.7-.5-4.1-.5s-2.8 0-4.1.5C6.7 6.2 8.2 5.2 10 5.2zm0 9.6c-2.3 0-4.2-1.6-4.7-3.8 1.5.5 3.1.8 4.7.8s3.2-.3 4.7-.8c-.5 2.2-2.4 3.8-4.7 3.8z"/>';
  } else if (clsId === "bar" && sk.page === 3) {
    glyphClass = "cat-warcry";
    svgPath = '<path d="M4 8.5v3h2.8l4.2 3.2V5.3L6.8 8.5H4zm9.6-.9a4 4 0 0 1 0 4.8l-1.2-1a2.4 2.4 0 0 0 0-2.8l1.2-1zm2.2-2a6.8 6.8 0 0 1 0 8.8l-1.2-1a5.2 5.2 0 0 0 0-6.8l1.2-1z"/>';
  } else if (clsId === "sor" || clsId === "ass") {
    glyphClass = "cat-arcane";
    svgPath = '<path d="M11.2 2.2L5.5 11h4.1l-1 6.8L14.5 9h-4.1l.8-6.8z"/>';
  }
  return '<span class="sk-icon-frame is-glyph ' + glyphClass + '"><svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor" aria-hidden="true">' + svgPath + '</svg></span>';
}

function getSkillRelations(clsObj, targetKey) {
  const empty = { ancestors: new Set(), directReqs: new Set(), descendants: new Set(), synergies: new Set(), prereqEdges: new Set(), unlockEdges: new Set() };
  if (!clsObj || !targetKey) return empty;
  const byKey = new Map();
  const childrenMap = new Map();
  clsObj.skills.forEach(s => {
    byKey.set(s.key, s);
    childrenMap.set(s.key, []);
  });
  clsObj.skills.forEach(s => {
    (s.reqs || []).forEach(rk => {
      if (childrenMap.has(rk)) childrenMap.get(rk).push(s.key);
    });
  });

  const target = byKey.get(targetKey);
  if (!target) return empty;

  const ancestors = new Set();
  const directReqs = new Set(target.reqs || []);
  const prereqEdges = new Set();
  const walkUp = (k) => {
    const s = byKey.get(k);
    if (!s) return;
    (s.reqs || []).forEach(rk => {
      prereqEdges.add(rk + "->" + k);
      if (!ancestors.has(rk)) {
        ancestors.add(rk);
        walkUp(rk);
      }
    });
  };
  walkUp(targetKey);

  const descendants = new Set();
  const unlockEdges = new Set();
  const walkDown = (k) => {
    (childrenMap.get(k) || []).forEach(ck => {
      unlockEdges.add(k + "->" + ck);
      if (!descendants.has(ck)) {
        descendants.add(ck);
        walkDown(ck);
      }
    });
  };
  walkDown(targetKey);

  // Bidirectional synergy matching by skill name in synergies descriptions
  const synergies = new Set();
  const matchMention = (synList, skCandidate) => {
    if (!Array.isArray(synList) || !synList.length || !skCandidate) return false;
    const en = (skCandidate.nameEn || skCandidate.key || "").toLowerCase();
    const zh = skCandidate.nameZh || "";
    return synList.some(item => {
      const sEn = (item.enUS || "").toLowerCase();
      const sZh = item.zhCN || "";
      return (en && (sEn.startsWith(en + ":") || sEn.includes(" " + en + ":"))) ||
        (zh && (sZh.startsWith(zh + ":") || sZh.startsWith(zh + "：")));
    });
  };
  clsObj.skills.forEach(other => {
    if (other.key === targetKey) return;
    if (matchMention(target.synergies, other) || matchMention(other.synergies, target)) {
      synergies.add(other.key);
    }
  });

  return { ancestors, directReqs, descendants, synergies, prereqEdges, unlockEdges };
}

function buildSkillEdgePath(src, dst, sRect, dRect, stageWidth, colGap, rowGap, incomingOffset, outgoingOffset) {
  const dr = dst.row - src.row;
  const dc = dst.col - src.col;
  const rad = 5;

  // Case 1: Same-row horizontal (e.g. Summon Goatman -> Demonic Mastery, Raise Skeleton -> Skeleton Mastery, Wearwolf -> Shape Shifting)
  if (dr === 0 && dc !== 0) {
    const y = Math.round(sRect.cy);
    if (dc < 0) {
      return "M " + sRect.left.toFixed(1) + " " + y + " L " + (dRect.right + 4).toFixed(1) + " " + y;
    }
    return "M " + sRect.right.toFixed(1) + " " + y + " L " + (dRect.left - 4).toFixed(1) + " " + y;
  }

  // Case 2: Same-column vertical (straight down)
  if (dc === 0 && dr > 0) {
    const x = dRect.cx + incomingOffset;
    const y1 = sRect.bottom;
    const y2 = dRect.top - 4;
    return "M " + x.toFixed(1) + " " + y1.toFixed(1) + " L " + x.toFixed(1) + " " + y2.toFixed(1);
  }

  // Case 3: Adjacent-row diagonal (rounded orthogonal elbow through row gap)
  if (dr === 1 && dc !== 0) {
    const x1 = sRect.cx + outgoingOffset;
    const y1 = sRect.bottom;
    const x2 = dRect.cx + incomingOffset;
    const y2 = dRect.top - 4;
    const midY = (sRect.bottom + dRect.top) / 2;
    const dirX = x2 > x1 ? 1 : -1;
    const r = Math.min(rad, Math.abs(x2 - x1) / 2, Math.abs(midY - y1), Math.abs(y2 - midY));
    return "M " + x1.toFixed(1) + " " + y1.toFixed(1) +
      " L " + x1.toFixed(1) + " " + (midY - r).toFixed(1) +
      " Q " + x1.toFixed(1) + " " + midY.toFixed(1) + " " + (x1 + dirX * r).toFixed(1) + " " + midY.toFixed(1) +
      " L " + (x2 - dirX * r).toFixed(1) + " " + midY.toFixed(1) +
      " Q " + x2.toFixed(1) + " " + midY.toFixed(1) + " " + x2.toFixed(1) + " " + (midY + r).toFixed(1) +
      " L " + x2.toFixed(1) + " " + y2.toFixed(1);
  }

  // Case 4: Multi-row diagonal (route cleanly through the vertical column gutter, zero card overlap)
  if (dr > 1 && dc !== 0) {
    const goRight = dc > 0;
    const x1 = goRight ? sRect.right : sRect.left;
    const y1 = sRect.cy + 6;
    const gutterX = goRight
      ? (sRect.right + colGap / 2)
      : (sRect.left - colGap / 2);
    const x2 = dRect.cx + incomingOffset;
    const y2 = dRect.top - 4;
    const midY = dRect.top - Math.max(8, rowGap / 2);
    const dirX = x2 > gutterX ? 1 : -1;
    const r1 = Math.min(rad, Math.abs(gutterX - x1));
    const r2 = Math.min(rad, Math.abs(x2 - gutterX) / 2, Math.abs(y2 - midY));
    return "M " + x1.toFixed(1) + " " + y1.toFixed(1) +
      " L " + (gutterX - (goRight ? r1 : -r1)).toFixed(1) + " " + y1.toFixed(1) +
      " Q " + gutterX.toFixed(1) + " " + y1.toFixed(1) + " " + gutterX.toFixed(1) + " " + (y1 + r1).toFixed(1) +
      " L " + gutterX.toFixed(1) + " " + (midY - r2).toFixed(1) +
      " Q " + gutterX.toFixed(1) + " " + midY.toFixed(1) + " " + (gutterX + dirX * r2).toFixed(1) + " " + midY.toFixed(1) +
      " L " + (x2 - dirX * r2).toFixed(1) + " " + midY.toFixed(1) +
      " Q " + x2.toFixed(1) + " " + midY.toFixed(1) + " " + x2.toFixed(1) + " " + (midY + r2).toFixed(1) +
      " L " + x2.toFixed(1) + " " + y2.toFixed(1);
  }

  return "";
}

function drawSkillTreeLinks() {
  const wrap = document.getElementById("sk-trees-wrap");
  const clsObj = getActiveClassObj();
  if (!wrap || !clsObj) return;
  const build = getClassBuild(clsObj.id);
  const byKey = new Map(clsObj.skills.map(s => [s.key, s]));
  const focusKey = skHoveredSkillKey || skSelectedSkillKey || null;
  const rel = getSkillRelations(clsObj, focusKey);

  wrap.querySelectorAll(".sk-matrix-stage").forEach(stage => {
    const svg = stage.querySelector(".sk-links-svg");
    const matrix = stage.querySelector(".sk-matrix");
    if (!svg || !matrix) return;
    if (typeof stage.getBoundingClientRect !== "function") return;
    const stageRect = stage.getBoundingClientRect();
    if (!stageRect || stageRect.width <= 0 || stageRect.height <= 0) return;

    const pageNum = Number(stage.dataset.skPage);
    const pageSkills = clsObj.skills.filter(s => s.page === pageNum);
    const rects = new Map();
    stage.querySelectorAll("[data-sk-node]").forEach(el => {
      const r = el.getBoundingClientRect();
      rects.set(el.dataset.skNode, {
        left: r.left - stageRect.left,
        right: r.right - stageRect.left,
        top: r.top - stageRect.top,
        bottom: r.bottom - stageRect.top,
        w: r.width,
        h: r.height,
        cx: r.left - stageRect.left + r.width / 2,
        cy: r.top - stageRect.top + r.height / 2
      });
    });

    const cs = typeof window !== "undefined" && typeof window.getComputedStyle === "function"
      ? window.getComputedStyle(matrix) : null;
    const colGap = cs ? (parseFloat(cs.columnGap) || 14) : 14;
    const rowGap = cs ? (parseFloat(cs.rowGap) || 20) : 20;

    // Count outgoing edges per source to slightly fan adjacent branches
    const outBySrc = new Map();
    pageSkills.forEach(dst => {
      (dst.reqs || []).forEach(rk => {
        if (!outBySrc.has(rk)) outBySrc.set(rk, []);
        outBySrc.get(rk).push(dst);
      });
    });

    const uid = "skm-" + clsObj.id + "-" + pageNum;
    const defs =
      '<defs>' +
        '<marker id="' + uid + '-idle" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1.5L8.5 5L1 8.5z" fill="rgba(212,188,148,0.52)"/></marker>' +
        '<marker id="' + uid + '-ready" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1.5L8.5 5L1 8.5z" fill="#78e38d"/></marker>' +
        '<marker id="' + uid + '-active" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M1 1.5L8.5 5L1 8.5z" fill="#f5cf7b"/></marker>' +
        '<marker id="' + uid + '-prereq" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1.5L8.5 5L1 8.5z" fill="#ffbe4f"/></marker>' +
        '<marker id="' + uid + '-unlock" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1.5L8.5 5L1 8.5z" fill="#56d4ff"/></marker>' +
      '</defs>';

    const paths = [];
    pageSkills.forEach(dst => {
      const reqList = (dst.reqs || []).map(rk => byKey.get(rk)).filter(r => r && r.page === pageNum);
      if (!reqList.length) return;
      const dRect = rects.get(dst.key);
      if (!dRect) return;

      reqList.forEach(src => {
        const sRect = rects.get(src.key);
        if (!sRect) return;

        // Avoid arrowhead collision when a skill has 2+ incoming prerequisites
        let incomingOffset = 0;
        if (reqList.length > 1) {
          if (src.col < dst.col) incomingOffset = -12;
          else if (src.col > dst.col) incomingOffset = 12;
        }
        // Avoid exit overlap when a parent fans out to both straight-down and diagonal children
        let outgoingOffset = 0;
        const outs = outBySrc.get(src.key) || [];
        if (outs.length > 1 && dst.col !== src.col) {
          outgoingOffset = dst.col > src.col ? 10 : -10;
        }

        const d = buildSkillEdgePath(src, dst, sRect, dRect, stageRect.width, colGap, rowGap, incomingOffset, outgoingOffset);
        if (!d) return;

        const edgeKey = src.key + "->" + dst.key;
        const srcPts = Number(build[src.key] || 0);
        const dstPts = Number(build[dst.key] || 0);
        let state = "idle";
        if (srcPts > 0 && dstPts > 0) state = "active";
        else if (srcPts > 0) state = "ready";

        let focusCls = "";
        let markerState = state;
        if (focusKey) {
          if (rel.prereqEdges.has(edgeKey)) {
            focusCls = " is-focus-prereq";
            markerState = "prereq";
          } else if (rel.unlockEdges.has(edgeKey)) {
            focusCls = " is-focus-unlock";
            markerState = "unlock";
          } else {
            focusCls = " is-focus-dim";
          }
        }

        paths.push({
          priority: focusCls && focusCls !== " is-focus-dim" ? 2 : (state === "active" ? 1 : 0),
          html: '<path class="sk-link-path is-' + state + focusCls + '" data-edge="' + escapeHtml(edgeKey) + '" d="' + d + '" marker-end="url(#' + uid + '-' + markerState + ')" />'
        });
      });
    });

    // Paint highlighted/active arrows last so they sit cleanly on top of muted ones
    paths.sort((a, b) => a.priority - b.priority);
    svg.setAttribute("viewBox", "0 0 " + stageRect.width.toFixed(1) + " " + stageRect.height.toFixed(1));
    svg.setAttribute("width", String(Math.round(stageRect.width)));
    svg.setAttribute("height", String(Math.round(stageRect.height)));
    svg.innerHTML = defs + paths.map(p => p.html).join("");
  });
}

function scheduleDrawSkillTreeLinks() {
  if (typeof requestAnimationFrame === "function") {
    if (skTreeDrawRaf) cancelAnimationFrame(skTreeDrawRaf);
    skTreeDrawRaf = requestAnimationFrame(() => {
      skTreeDrawRaf = 0;
      drawSkillTreeLinks();
    });
  } else {
    drawSkillTreeLinks();
  }
}

function ensureSkillTreeResizeObserver() {
  if (skTreeResizeObserver || typeof ResizeObserver === "undefined") return;
  const wrap = document.getElementById("sk-trees-wrap");
  if (!wrap) return;
  skTreeResizeObserver = new ResizeObserver(() => {
    scheduleDrawSkillTreeLinks();
  });
  skTreeResizeObserver.observe(wrap);
}

function applySkillRelationHighlight(overrideFocusKey) {
  const wrap = document.getElementById("sk-trees-wrap");
  const clsObj = getActiveClassObj();
  if (!wrap || !clsObj) return;
  const focusKey = overrideFocusKey !== undefined
    ? overrideFocusKey
    : (skHoveredSkillKey || skSelectedSkillKey || null);
  const rel = getSkillRelations(clsObj, focusKey);

  wrap.querySelectorAll("[data-sk-node]").forEach(node => {
    const k = node.dataset.skNode;
    const isFocus = Boolean(focusKey && k === focusKey);
    const isPrereq = Boolean(focusKey && rel.ancestors.has(k));
    const isUnlock = Boolean(focusKey && rel.descendants.has(k));
    const isSynergy = Boolean(focusKey && !isPrereq && !isUnlock && rel.synergies.has(k));
    const isDim = Boolean(focusKey && !isFocus && !isPrereq && !isUnlock && !isSynergy);

    node.classList.toggle("rel-prereq", isPrereq);
    node.classList.toggle("rel-unlock", isUnlock);
    node.classList.toggle("rel-synergy", isSynergy);
    node.classList.toggle("rel-dim", isDim);

    const tag = node.querySelector(".sk-rel-tag");
    if (tag) {
      if (isPrereq) {
        tag.textContent = rel.directReqs.has(k) ? "前置" : "上级";
        tag.className = "sk-rel-tag show is-prereq";
      } else if (isUnlock) {
        tag.textContent = "后续";
        tag.className = "sk-rel-tag show is-unlock";
      } else if (isSynergy) {
        tag.textContent = "协同";
        tag.className = "sk-rel-tag show is-synergy";
      } else {
        tag.textContent = "";
        tag.className = "sk-rel-tag";
      }
    }
  });

  drawSkillTreeLinks();
}

function renderSkillsTrees() {
  const wrap = document.getElementById("sk-trees-wrap");
  const clsObj = getActiveClassObj();
  if (!wrap || !clsObj) return;

  const build = getClassBuild(clsObj.id);
  const totalUsed = getClassTotalPoints(clsObj.id);
  let maxReqLvl = 1;
  for (const sk of clsObj.skills) {
    const pts = Number(build[sk.key] || 0);
    if (pts > 0) {
      const reqForRank = sk.reqLvl + pts - 1;
      if (reqForRank > maxReqLvl) maxReqLvl = reqForRank;
    }
  }
  const reqClvl = totalUsed > 0 ? Math.min(99, Math.max(maxReqLvl, totalUsed - 12 + 1, 1)) : 1;

  const usedEl = document.getElementById("sk-points-used");
  const remEl = document.getElementById("sk-points-rem");
  const clvlEl = document.getElementById("sk-req-clvl");
  if (usedEl) usedEl.textContent = String(totalUsed);
  if (remEl) remEl.textContent = String(Math.max(0, SK_MAX_POINTS - totalUsed));
  if (clvlEl) clvlEl.textContent = String(reqClvl);

  wrap.innerHTML = (clsObj.tabs || []).map(tab => {
    const pageSkills = clsObj.skills.filter(s => s.page === tab.page);
    let tabPoints = 0;
    pageSkills.forEach(s => { tabPoints += Number(build[s.key] || 0); });

    let cellsHtml = "";
    for (let r = 1; r <= 6; r++) {
      for (let c = 1; c <= 3; c++) {
        const sk = pageSkills.find(s => s.row === r && s.col === c);
        if (!sk) {
          cellsHtml += '<div class="sk-cell-empty" aria-hidden="true"></div>';
          continue;
        }
        const basePts = Number(build[sk.key] || 0);
        const totalBonus = getSkillTreeBonusForSkill(sk);
        const effPts = basePts > 0 ? basePts + totalBonus : 0;
        const isSel = skSelectedSkillKey === sk.key;
        const reqsMet = (sk.reqs || []).every(rk => Number(build[rk] || 0) > 0);
        const clsList = ["sk-node"];
        if (basePts > 0) clsList.push("allocated");
        else if (reqsMet && (sk.reqs || []).length > 0) clsList.push("unlocked");
        if (basePts >= 20) clsList.push("maxed");
        if (isSel) clsList.push("selected");

        const rankText = basePts > 0 && totalBonus > 0
          ? (basePts + " (" + effPts + ")/20")
          : (basePts + " / 20");
        const tagText = sk.passive
          ? (currentLang === "enUS" ? "Passive" : "被动")
          : ("Lv." + sk.reqLvl);
        const skTitle = pickSkLang(sk, "nameZh", "nameTw", "nameEn");
        const iconHtml = getSkillNodeIconHtml(clsObj.id, sk);

        cellsHtml += '<div class="' + clsList.join(" ") + '" data-sk-node="' + escapeHtml(sk.key) + '">' +
          '<span class="sk-rel-tag" aria-hidden="true"></span>' +
          '<div class="sk-node-top">' +
            '<span class="sk-node-lvlreq">' + escapeHtml(tagText) + '</span>' +
            '<div class="sk-node-step-btns">' +
              '<button type="button" class="sk-step-btn" data-sk-step="-1" data-sk-key="' + escapeHtml(sk.key) + '" aria-label="减少 ' + escapeHtml(skTitle) + ' 技能点" title="减 1 点（Shift -5）">-</button>' +
              '<button type="button" class="sk-step-btn" data-sk-step="1" data-sk-key="' + escapeHtml(sk.key) + '" aria-label="增加 ' + escapeHtml(skTitle) + ' 技能点" title="加 1 点（Shift +5）">+</button>' +
            '</div>' +
          '</div>' +
          '<button type="button" class="sk-node-pick" data-sk-pick="' + escapeHtml(sk.key) + '" aria-pressed="' + (isSel ? "true" : "false") + '">' +
            iconHtml +
            '<span class="sk-node-title" data-no-sweep="1">' + escapeHtml(skTitle) + '</span>' +
            '<span class="sk-node-foot">' +
              '<span class="sk-node-rank">' + escapeHtml(rankText) + '</span>' +
            '</span>' +
          '</button>' +
        '</div>';
      }
    }

    const tabTitle = pickSkLang(tab, "zhCN", "zhTW", "enUS");
    const tabExtra = (!skBonusClassId || skBonusClassId === skActiveClassId) ? (skBonusByTab[tab.page] || 0) : 0;
    return '<div class="sk-tree-col">' +
      '<div class="sk-tree-head">' +
        '<span class="sk-tree-title" data-no-sweep="1">' + escapeHtml(tabTitle) + (tabExtra > 0 ? (' <span style="color:#9ad8ff;font-size:11px">(+' + tabExtra + ')</span>') : '') + '</span>' +
        '<span class="sk-tree-pts">' + tabPoints + ' 点</span>' +
      '</div>' +
      '<div class="sk-matrix-stage" data-sk-page="' + tab.page + '">' +
        '<svg class="sk-links-svg" aria-hidden="true"></svg>' +
        '<div class="sk-matrix">' + cellsHtml + '</div>' +
      '</div>' +
    '</div>';
  }).join("");
  renderSkSyncedExtraBadge();
  ensureSkillTreeResizeObserver();

  wrap.querySelectorAll("[data-sk-step]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const k = btn.dataset.skKey;
      const step = Number(btn.dataset.skStep) * (e.shiftKey ? 5 : 1);
      modifySkillPoint(k, step);
    });
  });

  const toggleSelectSkillNode = (k) => {
    skSelectedSkillKey = (skSelectedSkillKey === k) ? null : k;
    wrap.querySelectorAll("[data-sk-node]").forEach(n => {
      const isCur = n.dataset.skNode === skSelectedSkillKey;
      n.classList.toggle("selected", isCur);
      const pickBtn = n.querySelector("[data-sk-pick]");
      if (pickBtn) pickBtn.setAttribute("aria-pressed", isCur ? "true" : "false");
    });
    applySkillRelationHighlight();
    renderSkillInspector();
  };

  wrap.querySelectorAll("[data-sk-node]").forEach(node => {
    const k = node.dataset.skNode;
    node.addEventListener("click", (e) => {
      if (e.target && e.target.closest && e.target.closest("[data-sk-step]")) return;
      toggleSelectSkillNode(k);
    });
    node.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      modifySkillPoint(k, e.shiftKey ? -5 : -1);
    });
    node.addEventListener("mouseenter", () => {
      skHoveredSkillKey = k;
      applySkillRelationHighlight(k);
    });
    node.addEventListener("mouseleave", () => {
      if (skHoveredSkillKey === k) skHoveredSkillKey = null;
      applySkillRelationHighlight();
    });
  });

  applySkillRelationHighlight();
  scheduleDrawSkillTreeLinks();
}

function evalDiminishing(lvl, minVal, maxVal) {
  if (lvl <= 0) return 0;
  return minVal + Math.floor(((maxVal - minVal) * Math.floor((110 * lvl) / (lvl + 6))) / 100);
}

function computeWeaponSkillMetaStats(skKey, effLvl, build, maxMode) {
  const meta = (pdData && pdData.skillCombatMeta && pdData.skillCombatMeta[skKey]) || null;
  if (!meta) return null;
  const lvl = Math.max(1, Number(effLvl) || 1);
  const getSynPts = (skillName) => maxMode ? 20 : Number((build && build[skillName]) || 0);

  let baseEd = 0;
  if (meta.dmEdMin !== undefined && meta.dmEdMax !== undefined) {
    baseEd = evalDiminishing(lvl, meta.dmEdMin, meta.dmEdMax);
  } else if (meta.edStartLvl) {
    baseEd = lvl < meta.edStartLvl ? 0 : meta.edBase + (lvl - meta.edStartLvl + 1) * meta.edLvl;
  } else {
    baseEd = meta.edBase + Math.max(0, lvl - 1) * meta.edLvl;
  }

  let synEd = 0;
  const edSynNotes = [];
  if (Array.isArray(meta.edSynergies)) {
    meta.edSynergies.forEach(s => {
      const pts = getSynPts(s.skill);
      if (pts > 0) {
        const add = pts * Number(s.pct || 0);
        synEd += add;
        edSynNotes.push(s.skill + " +" + add + "%");
      }
    });
  }

  const baseAr = (meta.toHitBase || 0) + Math.max(0, lvl - 1) * (meta.toHitLvl || 0);
  let synAr = 0;
  if (Array.isArray(meta.arSynergies)) {
    meta.arSynergies.forEach(s => {
      synAr += getSynPts(s.skill) * Number(s.pct || 0);
    });
  }

  let physFlatSynPct = 0;
  if (Array.isArray(meta.physFlatSynergies)) {
    meta.physFlatSynergies.forEach(s => {
      physFlatSynPct += getSynPts(s.skill) * Number(s.pct || 0);
    });
  }

  let echoCount = 1;
  if (meta.echoSkill) {
    const ep = getSynPts(meta.echoSkill);
    echoCount = ep > 0 ? (1 + Math.floor(ep / 5)) : 1;
  } else if (meta.isBladeCopy) {
    echoCount = Math.min(5, 2 + Math.floor(lvl / 5));
  }

  return {
    meta,
    baseEd,
    synEd,
    totalEd: baseEd + synEd,
    edSynNotes,
    baseAr,
    synAr,
    totalAr: baseAr + synAr,
    physFlatSynPct,
    echoCount
  };
}

// Official D2R 3.4 skilldesc.txt formula for Echoing Strike:
// calc5 = echoCount, calc6 = floor((100 / calc5) / 2), ddam calc1 = calc6 * calc5 * 2,
// desccalca4/b4 = pnma * ((calc6 * calc5 * 2) - 1) / 100 (99% at 1/2/5 echoes, 95% at 3/4 echoes)
function computeEchoingStrikeDisplayScale(echoCount) {
  const c5 = Math.max(1, Math.floor(Number(echoCount) || 1));
  const c6 = Math.floor(Math.floor(100 / c5) / 2);
  const ddamPct = c6 * c5 * 2;
  const tipPct = Math.max(1, ddamPct - 1);
  return { c5, c6, ddamPct, tipPct };
}

function renderSkillInspector() {
  const clsObj = getActiveClassObj();
  if (!clsObj) return;
  const titleEl = document.getElementById("sk-insp-title");
  const subEl = document.getElementById("sk-insp-sub");
  const bodyEl = document.getElementById("sk-insp-body");
  if (!titleEl || !subEl || !bodyEl) return;

  const sk = skSelectedSkillKey ? clsObj.skills.find(s => s.key === skSelectedSkillKey) : null;
  if (!sk) {
    titleEl.textContent = "点击左侧任意技能查看详情";
    subEl.textContent = "单击技能卡标记为已选中并锁定说明（再点一次或点其他技能取消/切换）；右上角「+ / -」（Shift ±5）或右键调整点数";
    bodyEl.innerHTML = '<div class="it-card-note" style="color:var(--muted);font-size:12.5px">点击任意技能卡即可在此锁定查看该技能的完整说明、公式与协同加成；锁定状态下调整其他协同技能的点数，此处伤害数值也会实时更新。</div>';
    return;
  }

  const build = getClassBuild(clsObj.id);
  const basePts = Number(build[sk.key] || 0);
  const totalBonus = getSkillTreeBonusForSkill(sk);
  const effLvl = basePts > 0 ? basePts + totalBonus : 1;

  const skName = pickSkLang(sk, "nameZh", "nameTw", "nameEn");
  titleEl.innerHTML = sk.icon
    ? '<span style="display:inline-flex;align-items:center;gap:10px"><img src="' + escapeHtml(sk.icon) + '" alt="" style="width:36px;height:36px;border-radius:5px;border:1px solid rgba(226,180,92,0.65);flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,0.65)" /><span>' + escapeHtml(skName) + '</span></span>'
    : escapeHtml(skName);
  const secName = currentLang === "enUS" ? sk.nameZh : sk.nameEn;
  subEl.textContent = secName + " · 需求等级 " + sk.reqLvl + (sk.passive ? " · 被动技能" : "") +
    " · 当前投入 " + basePts + " 点" + (basePts > 0 && totalBonus > 0 ? ("（含装备/分系共 +" + totalBonus + " → " + effLvl + " 级）") : "") +
    " · 已选中（再次点击该技能取消）";

  const lines = [];
  const descText = pickSkLang(sk, "descZh", "descTw", "descEn");
  if (descText) {
    lines.push('<div class="it-card-note" style="color:#f2e7d5;font-size:13px">' + escapeHtml(descText) + '</div>');
  }

  const statParts = [];
  if (sk.mana) {
    const mCur = computeSkillMana(sk, effLvl);
    const m1 = computeSkillMana(sk, 1);
    const m20 = computeSkillMana(sk, 20);
    statParts.push("法力消耗：当前 " + mCur + "（1级: " + m1 + " · 20级: " + m20 + "）");
  }
  if (sk.cooldown > 0) {
    statParts.push("技能冷却：" + sk.cooldown + " 秒");
  }

  const wsMeta = computeWeaponSkillMetaStats(sk.key, effLvl, build, false);
  if (wsMeta) {
    const m = wsMeta.meta;
    if (m.isBladeCopy) {
      statParts.push("镜影武器伤害（" + effLvl + "级）：" + wsMeta.baseEd + "% · 召唤刀刃总数 " + wsMeta.echoCount + " 把");
    } else if (wsMeta.totalEd !== 0 || (Array.isArray(m.edSynergies) && m.edSynergies.length)) {
      const sign = wsMeta.totalEd >= 0 ? "+" : "";
      const synDetail = wsMeta.synEd > 0 ? ("（技能基础 +" + wsMeta.baseEd + "% + 协同 +" + wsMeta.synEd + "%）") : "";
      statParts.push("武器伤害加成（" + effLvl + "级）：" + sign + wsMeta.totalEd + "%" + synDetail);
    }
    if (m.eleConvEachBase) {
      const baseConv = m.eleConvEachBase + Math.max(0, effLvl - 1) * m.eleConvEachLvl;
      const salPts = Number(build["Salvation"] || 0);
      const fConv = baseConv + Number(build["Resist Fire"] || 0) * 10 + salPts * 2;
      const cConv = baseConv + Number(build["Resist Cold"] || 0) * 10 + salPts * 2;
      const lConv = baseConv + Number(build["Resist Lightning"] || 0) * 10 + salPts * 2;
      statParts.push("元素武器伤害转化（" + effLvl + "级）：火 +" + fConv + "% · 冰 +" + cConv + "% · 电 +" + lConv + "%");
    }
    if (wsMeta.totalAr > 0) {
      statParts.push("技能命中率加成（" + effLvl + "级）：+" + wsMeta.totalAr + "% AR");
    }
    if (m.srcDam > 0 && m.srcDam < 128) {
      statParts.push("武器基础伤害占比：" + Math.floor((m.srcDam * 100) / 128) + "%（精确 " + m.srcDam + "/128）");
    }
    if (m.echoSkill) {
      statParts.push("单次投射回响武器数：" + wsMeta.echoCount + " 把（按施法速度 FCR 施放）");
    }
  }

  if (sk.dmg) {
    const dCur = computeSkillDamage(sk, clsObj, build, effLvl);
    const d1 = computeSkillDamage(sk, clsObj, build, 1);
    const d20 = computeSkillDamage(sk, clsObj, build, 20);
    if (dCur) {
      const physSyn = wsMeta && wsMeta.physFlatSynPct > 0 ? wsMeta.physFlatSynPct : 0;
      const adjMin = physSyn > 0 ? Math.floor((dCur.min * (100 + physSyn)) / 100) : dCur.min;
      const adjMax = physSyn > 0 ? Math.floor((dCur.max * (100 + physSyn)) / 100) : dCur.max;
      const totSyn = dCur.synPct + physSyn;
      if (wsMeta && wsMeta.meta && wsMeta.meta.echoSkill) {
        const esScale = computeEchoingStrikeDisplayScale(wsMeta.echoCount);
        const tipMin = Math.floor((adjMin * esScale.tipPct) / 100);
        const tipMax = Math.floor((adjMax * esScale.tipPct) / 100);
        statParts.push(
          "技能附加物理伤害（" + effLvl + "级，与游戏技能提示一致）：" + tipMin + " – " + tipMax +
          (totSyn > 0
            ? ("（含 +" + totSyn + "% 协同，基础 " + dCur.min + "–" + dCur.max + "；官方 skilldesc 系数 " + esScale.tipPct + "%，未折减原值 " + adjMin + "–" + adjMax + "）")
            : ("（官方 skilldesc 系数 " + esScale.tipPct + "%，未折减原值 " + adjMin + "–" + adjMax + "）"))
        );
        const t1Min = Math.floor((d1.min * 99) / 100), t1Max = Math.floor((d1.max * 99) / 100);
        const t20Min = Math.floor((d20.min * 99) / 100), t20Max = Math.floor((d20.max * 99) / 100);
        statParts.push("基础成长对照（0协同提示值）：1级 " + t1Min + "–" + t1Max + " · 20级 " + t20Min + "–" + t20Max);
      } else {
        const lbl = wsMeta ? "技能附加物理伤害" : (sk.key === "Hex Bane" ? "武器附加魔法伤害" : (sk.key === "Hex Purge" ? "击中触发魔法爆炸伤害" : "技能伤害"));
        statParts.push(lbl + "（" + effLvl + "级）：" + adjMin + " – " + adjMax + (totSyn > 0 ? ("（含 +" + totSyn + "% 协同，基础 " + dCur.min + "–" + dCur.max + "）") : ""));
        statParts.push("基础成长对照：1级 " + d1.min + "–" + d1.max + " · 20级 " + d20.min + "–" + d20.max);
      }
    }
  }

  // Passive masteries & Warlock Hex Buffs live formulas in Skill Inspector
  if (sk.key === "Levitate") {
    const ed = 25 + (effLvl - 1) * 4;
    const ar = 40 + (effLvl - 1) * 5;
    const cs = evalDiminishing(effLvl, 0, 35);
    const reqRed = Math.min(50, 2 + (effLvl - 1) * 2);
    statParts.push("悬浮精通（" + effLvl + "级）：近战武器伤害 +" + ed + "% · 命中率 +" + ar + "% · 致命一击 " + cs + "% · 武器需求 -" + reqRed + "%");
  } else if (sk.key === "Hex Bane") {
    const hexAr = 20 + (effLvl - 1) * 9;
    const defRed = Math.min(50, 30 + (effLvl - 1));
    statParts.push("邪咒：灾祸 Buff（" + effLvl + "级）：武器攻击 +" + hexAr + "% 命中率 · 降低目标防御 -" + defRed + "% · 降低目标命中 -25%（可在配装页开启联动）");
  } else if (sk.key === "Hex Purge") {
    const eias = Math.min(30, 10 + (effLvl - 1));
    const hexAr = 20 + (effLvl - 1) * 9;
    const maxExp = Math.min(3, 1 + Math.floor(effLvl / 10));
    statParts.push("邪咒：消灭 Buff（" + effLvl + "级）：攻击速度 +" + eias + "% EIAS · 命中率 +" + hexAr + "% · 击中引爆上限 " + maxExp + " 次（可在配装页开启联动）");
  } else if (sk.key === "Hex Siphon") {
    const hexAr = 20 + (effLvl - 1) * 9;
    const engPts = Number(build["Engorge"] || 0);
    const lk = effLvl + engPts;
    statParts.push("邪咒：吸取 Buff（" + effLvl + "级）：命中率 +" + hexAr + "% · 每杀恢复生命 +" + lk + " / 法力 +" + lk + " · 降低目标物理伤害 -33%");
  } else if (["Blade Mastery", "Axe Mastery", "Mace Mastery", "Pole Arm Mastery", "Spear Mastery", "Throwing Mastery"].includes(sk.key)) {
    const arBase = ["Pole Arm Mastery", "Spear Mastery", "Throwing Mastery"].includes(sk.key) ? 44 : 40;
    statParts.push("武器专精（" + effLvl + "级）：武器伤害 +" + (28 + (effLvl - 1) * 5) + "% · 命中率 +" + (arBase + (effLvl - 1) * 8) + "% · 致命一击 " + evalDiminishing(effLvl, 0, 35) + "%");
  } else if (sk.key === "Claw Mastery") {
    statParts.push("利爪精通（" + effLvl + "级）：爪类伤害 +" + (35 + (effLvl - 1) * 4) + "% · 命中率 +" + (30 + (effLvl - 1) * 10) + "% · 致命一击 " + evalDiminishing(effLvl, 0, 25) + "%");
  } else if (sk.key === "Critical Strike") {
    statParts.push("致命攻击（" + effLvl + "级）：" + evalDiminishing(effLvl, 5, 80) + "% 几率造成双倍物理伤害");
  } else if (sk.key === "Penetrate") {
    statParts.push("刺穿（" + effLvl + "级）：攻击准确率 +" + (35 + (effLvl - 1) * 10) + "% AR");
  }

  if (statParts.length > 0) {
    lines.push(renderStatList(statParts.join(" · "), "#9ad8ff", false));
  }

  if (Array.isArray(sk.reqs) && sk.reqs.length > 0) {
    const reqPills = sk.reqs.map(rk => {
      const rSk = clsObj.skills.find(x => x.key === rk);
      const pts = Number(build[rk] || 0);
      const hasIt = pts > 0;
      const nm = rSk ? pickSkLang(rSk, "nameZh", "nameTw", "nameEn") : rk;
      const ico = rSk && rSk.icon ? '<img class="sk-jump-ico" src="' + escapeHtml(rSk.icon) + '" alt="" />' : "";
      return '<button type="button" class="sk-jump-pill is-req ' + (hasIt ? "is-met" : "") + '" data-sk-jump="' + escapeHtml(rk) + '" title="点击跳转到前置技能并查看详情">' +
        ico + '<span>' + (hasIt ? "✓ " : "○ ") + escapeHtml(nm) + '</span>' +
        '<span class="sk-jump-pts">' + pts + '/20</span></button>';
    });
    lines.push('<div class="sk-jump-section"><div class="sk-jump-label">前置技能（点击直接跳转；加点时自动补齐前置）：</div><div class="sk-jump-pills">' + reqPills.join('<span class="sk-jump-arrow">→</span>') + '</div></div>');
  }

  if (Array.isArray(sk.synergies) && sk.synergies.length > 0) {
    const resolveSynSkill = (synObj) => {
      const sEn = (synObj.enUS || "").toLowerCase();
      const sZh = synObj.zhCN || "";
      return clsObj.skills.find(cand => {
        if (!cand || cand.key === sk.key) return false;
        const en = (cand.nameEn || cand.key || "").toLowerCase();
        const zh = cand.nameZh || "";
        return (en && (sEn.startsWith(en + ":") || sEn.includes(" " + en + ":"))) ||
          (zh && (sZh.startsWith(zh + ":") || sZh.startsWith(zh + "：")));
      }) || null;
    };
    const synRows = sk.synergies.map(s => {
      const txt = pickSkLang(s, "zhCN", "zhTW", "enUS");
      const target = resolveSynSkill(s);
      if (!target) {
        return '<div class="sk-syn-static">' + escapeHtml(txt) + '</div>';
      }
      const pts = Number(build[target.key] || 0);
      const ico = target.icon ? '<img class="sk-jump-ico" src="' + escapeHtml(target.icon) + '" alt="" />' : "";
      return '<button type="button" class="sk-jump-pill is-syn ' + (pts > 0 ? "is-met" : "") + '" data-sk-jump="' + escapeHtml(target.key) + '" title="点击跳转到协同技能「' + escapeHtml(pickSkLang(target, "nameZh", "nameTw", "nameEn")) + '」">' +
        ico + '<span class="sk-jump-txt">' + escapeHtml(txt) + '</span>' +
        '<span class="sk-jump-pts">' + pts + '/20</span></button>';
    });
    lines.push('<div class="it-set-bonus-box" style="margin-top:4px"><h4 class="it-set-bonus-title" style="color:#67e87a">协同技能加成（仅基础投入点数生效 · 点击跳转到对应技能）</h4><div class="sk-jump-pills is-col">' +
      synRows.join("") + '</div></div>');
  }

  bodyEl.innerHTML = lines.join("");
  if (!bodyEl.dataset.jumpBound) {
    bodyEl.dataset.jumpBound = "1";
    bodyEl.addEventListener("click", (e) => {
      const btn = e.target && e.target.closest ? e.target.closest("[data-sk-jump]") : null;
      if (!btn) return;
      e.preventDefault();
      jumpToSkillNode(btn.getAttribute("data-sk-jump"));
    });
  }
}

function jumpToSkillNode(targetKey) {
  const clsObj = getActiveClassObj();
  if (!clsObj || !targetKey) return;
  const target = clsObj.skills.find(s => s.key === targetKey);
  if (!target) return;
  skSelectedSkillKey = target.key;
  skHoverSkillKey = null;
  renderSkillsTrees();
  renderSkillInspector();
  const node = document.querySelector('#sk-trees-wrap .sk-node[data-skill-key="' + CSS.escape(target.key) + '"]');
  if (node) {
    if (typeof node.scrollIntoView === "function") {
      node.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
    node.classList.remove("sk-node-pulse");
    void node.offsetWidth;
    node.classList.add("sk-node-pulse");
    setTimeout(() => node.classList.remove("sk-node-pulse"), 950);
  }
}

const CLASS_BREAKPOINTS = {
  war: {
    blockFactor: 25,
    iasBaseFrames: 15,
    fcr: [
      { label: "常规施法 (邪术/混沌/恶魔)", frames: [[15,0],[14,9],[13,18],[12,30],[11,48],[10,75],[9,125]] }
    ],
    fhr: [
      { label: "常规武器 / 法杖 / 魔典", frames: [[13,0],[12,5],[11,10],[10,16],[9,26],[8,39],[7,56],[6,86],[5,152],[4,377]] }
    ],
    fbr: [
      { label: "常规格挡 (会心守御可额外加速)", frames: [[7,0],[6,13],[5,32],[4,86],[3,600]] }
    ]
  },
  sor: {
    blockFactor: 20,
    iasBaseFrames: 16,
    fcr: [
      { label: "常规法术 (冰/火/传送/新星)", frames: [[13,0],[12,9],[11,20],[10,37],[9,63],[8,105],[7,200]] },
      { label: "闪电 / 连锁闪电 (L/CL)", frames: [[19,0],[18,7],[17,15],[16,23],[15,35],[14,52],[13,78],[12,117],[11,194]] }
    ],
    fhr: [
      { label: "全部武器", frames: [[15,0],[14,5],[13,9],[12,14],[11,20],[10,30],[9,42],[8,60],[7,86],[6,142],[5,280]] }
    ],
    fbr: [
      { label: "常规格挡", frames: [[9,0],[8,7],[7,15],[6,27],[5,48],[4,86],[3,200]] }
    ]
  },
  pal: {
    blockFactor: 30,
    iasBaseFrames: 15,
    fcr: [
      { label: "全部法术 (祝福之锤/天拳/传送)", frames: [[15,0],[14,9],[13,18],[12,30],[11,48],[10,75],[9,125]] }
    ],
    fhr: [
      { label: "常规武器 (单手/双手剑斧锤)", frames: [[9,0],[8,7],[7,15],[6,27],[5,48],[4,86],[3,200]] },
      { label: "长矛 / 长柄武器 / 法杖", frames: [[13,0],[12,3],[11,7],[10,13],[9,20],[8,32],[7,48],[6,75],[5,129],[4,280]] }
    ],
    fbr: [
      { label: "开启神圣之盾 (Holy Shield)", frames: [[2,0],[1,86]] },
      { label: "未开神圣之盾", frames: [[5,0],[4,13],[3,32],[2,86],[1,600]] }
    ]
  },
  ama: {
    blockFactor: 25,
    iasBaseFrames: 14,
    fcr: [
      { label: "全部法术 (传送/女武神/诱饵)", frames: [[19,0],[18,7],[17,14],[16,22],[15,32],[14,48],[13,68],[12,99],[11,152]] }
    ],
    fhr: [
      { label: "全部武器", frames: [[11,0],[10,6],[9,13],[8,20],[7,32],[6,52],[5,86],[4,174],[3,600]] }
    ],
    fbr: [
      { label: "单手挥砍武器 (剑/斧/锤)", frames: [[17,0],[16,4],[15,6],[14,11],[13,15],[12,23],[11,29],[10,40],[9,56],[8,80],[7,120],[6,200]] },
      { label: "标枪 / 匕首 (穿刺武器)", frames: [[5,0],[4,13],[3,32],[2,86],[1,600]] }
    ]
  },
  nec: {
    blockFactor: 20,
    iasBaseFrames: 16,
    fcr: [
      { label: "人类形态 (骨矛/尸爆/传送)", frames: [[15,0],[14,9],[13,18],[12,30],[11,48],[10,75],[9,125]] },
      { label: "塔格奥吸血鬼形态", frames: [[23,0],[22,6],[21,11],[20,18],[19,24],[18,35],[17,48],[16,65],[15,86],[14,120],[13,180]] }
    ],
    fhr: [
      { label: "常规武器", frames: [[13,0],[12,5],[11,10],[10,16],[9,26],[8,39],[7,56],[6,86],[5,152],[4,377]] }
    ],
    fbr: [
      { label: "常规格挡", frames: [[11,0],[10,6],[9,13],[8,20],[7,32],[6,52],[5,86],[4,174],[3,600]] }
    ]
  },
  bar: {
    blockFactor: 25,
    iasBaseFrames: 14,
    fcr: [
      { label: "全部法术 (战吼/寻宝/传送)", frames: [[13,0],[12,9],[11,20],[10,37],[9,63],[8,105],[7,200]] }
    ],
    fhr: [
      { label: "常规武器", frames: [[9,0],[8,7],[7,15],[6,27],[5,48],[4,86],[3,200]] }
    ],
    fbr: [
      { label: "常规格挡", frames: [[7,0],[6,9],[5,20],[4,42],[3,86],[2,280]] }
    ]
  },
  dru: {
    blockFactor: 20,
    iasBaseFrames: 16,
    fcr: [
      { label: "人类形态 (龙卷风/火山/传送)", frames: [[18,0],[17,4],[16,10],[15,19],[14,30],[13,46],[12,68],[11,99],[10,163]] },
      { label: "狼人变化形态", frames: [[16,0],[15,6],[14,14],[13,26],[12,40],[11,60],[10,95],[9,157]] },
      { label: "熊人变化形态", frames: [[16,0],[15,7],[14,15],[13,26],[12,40],[11,63],[10,99],[9,163]] }
    ],
    fhr: [
      { label: "人类形态 (单手挥砍)", frames: [[14,0],[13,3],[12,7],[11,13],[10,19],[9,29],[8,42],[7,63],[6,99],[5,174],[4,456]] },
      { label: "人类形态 (双手/法杖/长柄)", frames: [[13,0],[12,5],[11,10],[10,16],[9,26],[8,39],[7,56],[6,86],[5,152],[4,377]] },
      { label: "狼人变化形态", frames: [[7,0],[6,9],[5,20],[4,42],[3,86],[2,280]] },
      { label: "熊人变化形态", frames: [[13,0],[12,5],[11,10],[10,16],[9,24],[8,37],[7,54],[6,86],[5,152],[4,360]] }
    ],
    fbr: [
      { label: "人类形态", frames: [[11,0],[10,6],[9,13],[8,20],[7,32],[6,52],[5,86],[4,174],[3,600]] },
      { label: "熊人变化形态", frames: [[12,0],[11,5],[10,10],[9,16],[8,27],[7,40],[6,65],[5,109],[4,223]] },
      { label: "狼人变化形态", frames: [[9,0],[8,7],[7,15],[6,27],[5,48],[4,86],[3,200]] }
    ]
  },
  ass: {
    blockFactor: 25,
    iasBaseFrames: 14,
    fcr: [
      { label: "全部法术 (心灵震爆/传送)", frames: [[16,0],[15,8],[14,16],[13,27],[12,42],[11,65],[10,102],[9,174]] }
    ],
    fhr: [
      { label: "全部武器", frames: [[9,0],[8,7],[7,15],[6,27],[5,48],[4,86],[3,200]] }
    ],
    fbr: [
      { label: "盾牌格挡", frames: [[5,0],[4,13],[3,32],[2,86],[1,600]] }
    ]
  }
};

let bpFcrVariantIdx = 0;
let bpFhrVariantIdx = 0;
let pdLastBreakpointSnapshot = null;
let pdLastShareSummary = null;
let bpAutoSyncEnabled = true;
let bpManualOverride = false;
let bpSyncedExtraEias = 0;
let bpSyncedExtraEiasLabel = "";
let bpSyncingFromPd = false;

function evalIasBreakpoints(baseFrames, curIas, wsm, skillEias) {
  const safeBase = Number(baseFrames) || 15;
  const safeIas = Math.max(0, Number(curIas) || 0);
  const safeWsm = Number(wsm) || 0;
  const safeSkillEias = Number(skillEias) || 0;
  const calcFramesForIas = (iasVal) => {
    const gearEias = Math.floor((120 * iasVal) / (120 + iasVal));
    const eias = Math.min(75, Math.max(-75, gearEias + safeSkillEias - safeWsm));
    return Math.max(7, Math.ceil((256 * safeBase) / Math.floor((256 * (100 + eias)) / 100)) - 1);
  };
  const pairs = [];
  let prevF = 999;
  for (let testIas = 0; testIas <= 250; testIas++) {
    const f = calcFramesForIas(testIas);
    if (f < prevF) {
      pairs.push([f, testIas]);
      prevF = f;
    }
  }
  let activeIdx = 0;
  for (let i = 0; i < pairs.length; i++) {
    if (safeIas >= pairs[i][1]) activeIdx = i;
  }
  const curFrame = pairs[activeIdx] ? pairs[activeIdx][0] : calcFramesForIas(safeIas);
  const curReq = pairs[activeIdx] ? pairs[activeIdx][1] : 0;
  const nextEntry = pairs[activeIdx + 1] || null;
  return {
    curFrame,
    curReq,
    nextNeed: nextEntry ? { frame: nextEntry[0], need: nextEntry[1] - safeIas, bp: nextEntry[1] } : null,
    pairs
  };
}

function renderBpSyncBadge() {
  const badge = document.getElementById("bp-sync-source-badge");
  if (!badge) return;
  if (!bpAutoSyncEnabled) {
    badge.classList.add("is-manual");
    badge.textContent = "⏸️ 已关闭自动跟随（手动试算模式）";
    return;
  }
  if (bpManualOverride) {
    badge.classList.add("is-manual");
    badge.textContent = "✏️ 手动试算模式（点「立即同步纸娃娃」恢复配装值）";
    return;
  }
  const snap = pdLastBreakpointSnapshot;
  if (!snap || snap.classId !== skActiveClassId) {
    badge.classList.add("is-manual");
    badge.textContent = "⏳ 正在读取当前职业纸娃娃配装…";
    return;
  }
  badge.classList.remove("is-manual");
  const parts = [
    snap.className + " Lv." + snap.charLvl,
    "武器 " + snap.weaponName + " [WSM " + snap.mainWsm + "]"
  ];
  if (snap.hasShield) {
    parts.push("盾牌 " + snap.shieldName + " (面板" + snap.shieldPanelBlock + "%" + (snap.holyShieldBlockPct > 0 ? ("+圣盾" + snap.holyShieldBlockPct + "%") : "") + ")");
  } else {
    parts.push("未持盾");
  }
  if (snap.fanaLvl > 0) parts.push("狂热 Lv." + snap.fanaLvl);
  if (snap.hexEias > 0) parts.push("邪咒 +" + snap.hexEias + "% EIAS");
  badge.textContent = "✓ 已直连纸娃娃：" + parts.join(" · ");
}

function syncPaperdollToBreakpoints(silent) {
  if (!pdLastBreakpointSnapshot || pdLastBreakpointSnapshot.classId !== skActiveClassId) {
    if (!bpSyncingFromPd && typeof renderPaperdollLiveStats === "function" && itData && pdData) {
      bpSyncingFromPd = true;
      try { renderPaperdollLiveStats(); } finally { bpSyncingFromPd = false; }
    }
  }
  const snap = pdLastBreakpointSnapshot;
  if (!snap || snap.classId !== skActiveClassId) {
    renderBpSyncBadge();
    return false;
  }
  bpSyncingFromPd = true;
  try {
    const setVal = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.value = String(v);
    };
    setVal("bp-fcr-input", snap.fcr);
    setVal("bp-fhr-input", snap.fhr);
    setVal("bp-ias-input", snap.ias);
    setVal("bp-ias-fana", snap.fanaLvl);
    setVal("bp-ias-bos", snap.bosLvl || 0);
    setVal("bp-fbr-input", snap.fbr);
    setVal("bp-blk-clvl", snap.charLvl);
    setVal("bp-blk-skill", snap.holyShieldBlockPct || 0);

    bpSyncedExtraEias = snap.hexEias || 0;
    bpSyncedExtraEiasLabel = snap.hexEias > 0 ? ("邪咒：消灭 +" + snap.hexEias + "% EIAS") : "";

    const wsmSel = document.getElementById("bp-ias-wsm");
    if (wsmSel && typeof wsmSel.insertBefore === "function") {
      let pdWsmOpt = document.getElementById("bp-ias-wsm-pd");
      if (!pdWsmOpt) {
        pdWsmOpt = document.createElement("option");
        pdWsmOpt.id = "bp-ias-wsm-pd";
        wsmSel.insertBefore(pdWsmOpt, wsmSel.firstChild);
      }
      pdWsmOpt.value = String(snap.mainWsm);
      pdWsmOpt.textContent = "[纸娃娃 WSM " + snap.mainWsm + "] " + snap.weaponName;
      pdWsmOpt.selected = true;
      wsmSel.value = pdWsmOpt.value;
    }

    const shieldSel = document.getElementById("bp-blk-shield");
    if (shieldSel && typeof shieldSel.insertBefore === "function") {
      let pdShieldOpt = document.getElementById("bp-blk-shield-pd");
      if (snap.hasShield && snap.shieldPanelBlock > 0) {
        if (!pdShieldOpt) {
          pdShieldOpt = document.createElement("option");
          pdShieldOpt.id = "bp-blk-shield-pd";
          pdShieldOpt.dataset.includesClassBlock = "1";
          shieldSel.insertBefore(pdShieldOpt, shieldSel.firstChild);
        }
        pdShieldOpt.value = String(snap.shieldPanelBlock);
        pdShieldOpt.textContent = "[纸娃娃] " + snap.shieldName + "（" + snap.shieldPanelBlock + "% 面板格挡）";
        pdShieldOpt.selected = true;
        shieldSel.value = pdShieldOpt.value;
      } else if (pdShieldOpt) {
        if (typeof pdShieldOpt.remove === "function") pdShieldOpt.remove();
        else if (pdShieldOpt.parentNode && typeof pdShieldOpt.parentNode.removeChild === "function") pdShieldOpt.parentNode.removeChild(pdShieldOpt);
      }
    }
  } finally {
    bpSyncingFromPd = false;
  }
  renderBreakpointsAll();
  return true;
}

function renderBpTable(framesArr, curValue, unitLabel) {
  let activeIdx = 0;
  for (let i = 0; i < framesArr.length; i++) {
    if (curValue >= framesArr[i][1]) activeIdx = i;
  }
  const curFrame = framesArr[activeIdx][0];
  const curReq = framesArr[activeIdx][1];
  const nextEntry = framesArr[activeIdx + 1];
  const perSec = (25 / curFrame).toFixed(2);
  const statusHtml = "当前档位：<strong>" + curFrame + " 帧</strong>（每秒 " + perSec + " 次，需 ≥" + curReq + "% " + unitLabel + "）" +
    (nextEntry ? (" · 距离下一档 <strong>" + nextEntry[0] + " 帧</strong>（" + nextEntry[1] + "%）还差 <strong>+" + (nextEntry[1] - curValue) + "%</strong>") : " · 已达最高极限档位！");

  const rowsHtml = framesArr.map((pair, idx) => {
    const f = pair[0];
    const req = pair[1];
    const cps = (25 / f).toFixed(2);
    return '<tr class="' + (idx === activeIdx ? 'bp-active' : '') + '">' +
      '<td>' + f + ' 帧</td>' +
      '<td>' + req + '%</td>' +
      '<td>' + cps + ' 次/秒</td>' +
      '<td>' + (idx === activeIdx ? '★ 当前档位' : (curValue >= req ? '✓ 已达成' : '差 +' + (req - curValue) + '%')) + '</td>' +
    '</tr>';
  }).join("");

  const tableHtml = '<table class="bp-table"><thead><tr><th>动作帧数</th><th>所需 ' + unitLabel + '</th><th>动作频率</th><th>状态</th></tr></thead><tbody>' + rowsHtml + '</tbody></table>';
  return { statusHtml, tableHtml };
}

function renderBreakpointsAll() {
  const bp = CLASS_BREAKPOINTS[skActiveClassId] || CLASS_BREAKPOINTS.war;
  const fcrVarSel = document.getElementById("bp-fcr-variant");
  const fhrVarSel = document.getElementById("bp-fhr-variant");
  if (!fcrVarSel || !fhrVarSel) return;

  renderBpSyncBadge();

  if (bpFcrVariantIdx >= bp.fcr.length) bpFcrVariantIdx = 0;
  if (bpFhrVariantIdx >= bp.fhr.length) bpFhrVariantIdx = 0;

  fcrVarSel.innerHTML = bp.fcr.map((v, i) => '<option value="' + i + '"' + (i === bpFcrVariantIdx ? ' selected' : '') + '>' + escapeHtml(v.label) + '</option>').join("");
  fhrVarSel.innerHTML = bp.fhr.map((v, i) => '<option value="' + i + '"' + (i === bpFhrVariantIdx ? ' selected' : '') + '>' + escapeHtml(v.label) + '</option>').join("");

  const curFcr = Math.max(0, Number(document.getElementById("bp-fcr-input")?.value || 0));
  const fcrRes = renderBpTable(bp.fcr[bpFcrVariantIdx].frames, curFcr, "FCR");
  document.getElementById("bp-fcr-status").innerHTML = fcrRes.statusHtml;
  document.getElementById("bp-fcr-table-wrap").innerHTML = fcrRes.tableHtml;

  const curFhr = Math.max(0, Number(document.getElementById("bp-fhr-input")?.value || 0));
  const fhrRes = renderBpTable(bp.fhr[bpFhrVariantIdx].frames, curFhr, "FHR");
  document.getElementById("bp-fhr-status").innerHTML = fhrRes.statusHtml;
  document.getElementById("bp-fhr-table-wrap").innerHTML = fhrRes.tableHtml;

  // Weapon IAS Breakpoint calculation (shared formula with Paperdoll)
  const wsm = Number(document.getElementById("bp-ias-wsm")?.value || 0);
  const curIas = Math.max(0, Number(document.getElementById("bp-ias-input")?.value || 0));
  const fanaLvl = Math.max(0, Number(document.getElementById("bp-ias-fana")?.value || 0));
  const bosLvl = Math.max(0, Number(document.getElementById("bp-ias-bos")?.value || 0));
  const fanaEias = evalDiminishing(fanaLvl, 10, 40);
  const bosEias = evalDiminishing(bosLvl, 15, 60);
  const isLivePdSynced = Boolean(bpAutoSyncEnabled && !bpManualOverride && pdLastBreakpointSnapshot && pdLastBreakpointSnapshot.classId === skActiveClassId);
  const extraEias = isLivePdSynced ? bpSyncedExtraEias : 0;
  const skillEias = fanaEias + bosEias + extraEias;

  const iasEval = evalIasBreakpoints(bp.iasBaseFrames || 15, curIas, wsm, skillEias);
  const iasRes = renderBpTable(iasEval.pairs, curIas, "IAS");
  const extraIasNote = extraEias > 0 && bpSyncedExtraEiasLabel
    ? (' · 已计入纸娃娃 <strong>' + escapeHtml(bpSyncedExtraEiasLabel) + '</strong>')
    : '';
  document.getElementById("bp-ias-status").innerHTML = iasRes.statusHtml + extraIasNote;
  document.getElementById("bp-ias-table-wrap").innerHTML = iasRes.tableHtml;

  // FBR + 75% Max Block Dexterity calculator
  const curFbr = Math.max(0, Number(document.getElementById("bp-fbr-input")?.value || 0));
  const shieldSel = document.getElementById("bp-blk-shield");
  const selectedShieldOpt = shieldSel && shieldSel.selectedOptions && shieldSel.selectedOptions[0];
  const includesClassBlock = Boolean(selectedShieldOpt && selectedShieldOpt.dataset && selectedShieldOpt.dataset.includesClassBlock === "1");
  const shieldBase = Number(shieldSel?.value || 42);
  const clvl = Math.min(99, Math.max(1, Number(document.getElementById("bp-blk-clvl")?.value || 90)));
  const skillBlk = Math.max(0, Number(document.getElementById("bp-blk-skill")?.value || 0));
  const fbrIdx = (skActiveClassId === "pal" && skillBlk <= 0 && bp.fbr.length > 1) ? 1 : 0;
  const fbrRes = renderBpTable(bp.fbr[fbrIdx].frames, curFbr, "FBR");
  const totalShieldBlock = includesClassBlock ? (shieldBase + skillBlk) : (shieldBase + (bp.blockFactor - 20) + skillBlk);
  const reqDex75 = Math.ceil((75 * 2 * clvl) / Math.max(1, totalShieldBlock)) + 15;
  let pdDexComparison = "";
  if (isLivePdSynced && pdLastBreakpointSnapshot) {
    if (pdLastBreakpointSnapshot.hasShield) {
      const pdDex = pdLastBreakpointSnapshot.totalDex;
      if (pdDex >= reqDex75) {
        pdDexComparison = " · 纸娃娃当前敏捷 <strong>" + pdDex + "</strong>（实际格挡 <strong>75%</strong> ✓ 已满格挡" + (pdDex > reqDex75 ? ("，盈余 +" + (pdDex - reqDex75)) : "") + "）";
      } else {
        pdDexComparison = " · 纸娃娃当前敏捷 <strong>" + pdDex + "</strong>（实际格挡 <strong>" + pdLastBreakpointSnapshot.charBlockChance + "%</strong>，距 75% 还差 <strong>+" + (reqDex75 - pdDex) + " 敏</strong>）";
      }
    } else {
      pdDexComparison = ' · <span style="color:var(--muted)">纸娃娃当前未持盾（按所选盾牌试算）</span>';
    }
  }
  document.getElementById("bp-blk-status").innerHTML =
    "<strong>75% 满格挡所需敏捷：" + reqDex75 + " 点</strong>（" + clvl + " 级 · 有效盾牌格挡率 " + totalShieldBlock + "%）" + pdDexComparison + "<br>" + fbrRes.statusHtml;
  document.getElementById("bp-fbr-table-wrap").innerHTML = fbrRes.tableHtml;
}

const MERC_VARIANTS = [
  { id: "a2-might", act: 2, name: "第二幕 · 沙漠米山（进攻 · 力量灵气 Might）", baseLvl: 75, hp: 1430, hpLvl: 40, str: 173, str8: 14, dex: 139, dex8: 12, def: 1027, defLvl: 28, res: 142, res4: 4, baseFrames: 16, skills: [{ name: "戳刺 Jab", base: 23, per32: 0 }, { name: "力量灵气 Might", base: 15, per32: 8, auraDesc: (l) => "全队物理伤害 +" + (30 + l * 10) + "%" }] },
  { id: "a2-hf", act: 2, name: "第二幕 · 沙漠米山（防御 · 神圣冰冻 Holy Freeze）", baseLvl: 75, hp: 1430, hpLvl: 40, str: 173, str8: 14, dex: 139, dex8: 12, def: 1027, defLvl: 28, res: 142, res4: 4, baseFrames: 16, skills: [{ name: "戳刺 Jab", base: 23, per32: 0 }, { name: "神圣冰冻 Holy Freeze", base: 16, per32: 0, auraDesc: (l) => "大范围冰冷控场减速 " + Math.min(58, 25 + l * 2) + "%" }] },
  { id: "a2-prayer", act: 2, name: "第二幕 · 沙漠米山（战斗 · 祈祷灵气 Prayer）", baseLvl: 75, hp: 1430, hpLvl: 40, str: 173, str8: 14, dex: 139, dex8: 12, def: 1027, defLvl: 28, res: 142, res4: 4, baseFrames: 16, skills: [{ name: "戳刺 Jab", base: 24, per32: 10 }, { name: "祈祷灵气 Prayer", base: 18, per32: 0, auraDesc: (l) => "单层每秒回血 +" + (l * 2 - 5) + "（配眼光+治愈头享 3 倍回血协同）" }] },
  { id: "a2-defiance", act: 2, name: "第二幕 · 沙漠米山（防御 · 反抗灵气 Defiance）", baseLvl: 75, hp: 1430, hpLvl: 40, str: 173, str8: 14, dex: 139, dex8: 12, def: 1027, defLvl: 28, res: 142, res4: 4, baseFrames: 16, skills: [{ name: "戳刺 Jab", base: 24, per32: 0 }, { name: "反抗灵气 Defiance", base: 18, per32: 0, auraDesc: (l) => "全队防御 +" + (60 + l * 10) + "%" }] },
  { id: "a2-ba", act: 2, name: "第二幕 · 沙漠米山（进攻 · 祝福瞄准 Blessed Aim）", baseLvl: 75, hp: 1430, hpLvl: 40, str: 173, str8: 14, dex: 139, dex8: 12, def: 1027, defLvl: 28, res: 142, res4: 4, baseFrames: 16, skills: [{ name: "戳刺 Jab", base: 24, per32: 0 }, { name: "祝福瞄准 Blessed Aim", base: 18, per32: 0, auraDesc: (l) => "全队命中率 +" + (60 + l * 15) + "%" }] },
  { id: "a1-cold", act: 1, name: "第一幕 · 萝格斥候（冰冷箭 + 冻结箭 + 内视）", baseLvl: 67, hp: 900, hpLvl: 30, str: 116, str8: 10, dex: 173, dex8: 16, def: 744, defLvl: 23, res: 121, res4: 5, baseFrames: 15, skills: [{ name: "内视 Inner Sight", base: 22, per32: 10, auraDesc: (l) => "降低周围敌人基础防御 -" + (40 + l * 45) }, { name: "冰冷箭 Cold Arrow", base: 22, per32: 10 }, { name: "冻结箭 Freezing Arrow", base: 7, per32: 3 }] },
  { id: "a1-fire", act: 1, name: "第一幕 · 萝格斥候（火焰箭 + 爆裂箭 + 内视）", baseLvl: 67, hp: 900, hpLvl: 30, str: 116, str8: 10, dex: 173, dex8: 16, def: 744, defLvl: 23, res: 121, res4: 5, baseFrames: 15, skills: [{ name: "内视 Inner Sight", base: 22, per32: 10 }, { name: "火焰箭 Fire Arrow", base: 22, per32: 10 }, { name: "爆裂箭 Exploding Arrow", base: 12, per32: 5 }] },
  { id: "a3-fire", act: 3, name: "第三幕 · 东方铁狼法师（火焰 · 强化 Enchant + 火球）", baseLvl: 79, hp: 1224, hpLvl: 34, str: 130, str8: 10, dex: 104, dex8: 8, def: 907, defLvl: 25, res: 155, res4: 5, baseFrames: 16, skills: [{ name: "火焰强化 Enchant", base: 26, per32: 20, auraDesc: (l) => "为主角、召唤物与全队附加高额火焰伤害与 +" + (20 + l * 9) + "% 命中率" }, { name: "火球术 Fire Ball", base: 25, per32: 10 }, { name: "火焰弹 Fire Bolt", base: 27, per32: 10 }] },
  { id: "a3-ltng", act: 3, name: "第三幕 · 东方铁狼法师（闪电 · 静电力场 Static Field + 闪电）", baseLvl: 79, hp: 1224, hpLvl: 34, str: 130, str8: 10, dex: 104, dex8: 8, def: 907, defLvl: 25, res: 155, res4: 5, baseFrames: 16, skills: [{ name: "静电力场 Static Field", base: 18, per32: 8, auraDesc: (l) => "群体削减怪物 25% 当前生命（半径 " + (3.3 + l * 0.66).toFixed(1) + " 码）" }, { name: "闪电 Lightning", base: 24, per32: 10 }, { name: "充能弹 Charged Bolt", base: 25, per32: 10 }] },
  { id: "a3-cold", act: 3, name: "第三幕 · 东方铁狼法师（冰冷 · 冰尖柱 + 寒冰装甲）", baseLvl: 79, hp: 1224, hpLvl: 34, str: 130, str8: 10, dex: 104, dex8: 8, def: 907, defLvl: 25, res: 155, res4: 5, baseFrames: 16, skills: [{ name: "冰尖柱 Glacial Spike", base: 22, per32: 10, auraDesc: () => "群体冻结控场" }, { name: "寒冰装甲 Chilling Armor", base: 27, per32: 15 }, { name: "冰风暴 Ice Blast", base: 27, per32: 10 }] },
  { id: "a5-frenzy", act: 5, name: "第五幕 · 哈洛加斯野蛮人（双持狂乱 Frenzy + 嘲讽 + 铁皮）", baseLvl: 80, hp: 1680, hpLvl: 45, str: 200, str8: 15, dex: 129, dex8: 10, def: 1332, defLvl: 35, res: 148, res4: 4, baseFrames: 14, skills: [{ name: "狂乱 Frenzy", base: 13, per32: 7, auraDesc: (l) => "攻速与移速极速叠加 (Lv." + l + ")" }, { name: "钢铁皮肤 Iron Skin", base: 12, per32: 6 }, { name: "嘲讽 Taunt", base: 17, per32: 6 }] },
  { id: "a5-bash", act: 5, name: "第五幕 · 哈洛加斯野蛮人（双手重剑 · 战吼 Battle Cry + 击晕）", baseLvl: 80, hp: 1680, hpLvl: 45, str: 200, str8: 15, dex: 129, dex8: 10, def: 1332, defLvl: 35, res: 148, res4: 4, baseFrames: 15, skills: [{ name: "战吼 Battle Cry", base: 19, per32: 8, auraDesc: (l) => "降低周围怪物防御 -" + (48 + l * 2) + "% 与伤害 -" + (24 + l) + "%" }, { name: "猛击 Bash", base: 25, per32: 10 }, { name: "击晕 Stun", base: 20, per32: 8 }] }
];

let pdActiveTarget = "char"; // "char" | "merc" | "bag"
let pdActiveSlot = "weapon";
let pdActiveBagUid = null;
let pdBagNextUid = 1;
let pdCharBag = [];
let pdActiveCat = "rw"; // "unique" | "set" | "rw" | "craft" | "magic" | "rare" | "base"
let pdItemCombo = null;
let pdRwBaseCombo = null;
let pdAffixFilter = "";
let pdSelectedRwBaseCode = "";
let pdLastCharSkillBonus = 0;
let pdLastSyncPayload = { all: 0, byTab: { 1: 0, 2: 0, 3: 0 }, bySkill: {}, fire: 0 };
const PD_AUTO_SYNC_KEY = "d2r-pd-auto-sync-skills";
let pdAutoSyncSkills = (() => {
  try {
    const v = localStorage.getItem(PD_AUTO_SYNC_KEY);
    return v === null ? true : v === "1";
  } catch (e) {
    return true;
  }
})();
let pdLastSyncedSkillSig = "";

function applyPaperdollSkillsToTree(silent) {
  const sig = skActiveClassId + "|" + JSON.stringify(pdLastSyncPayload);
  if (silent && sig === pdLastSyncedSkillSig) return false;
  pdLastSyncedSkillSig = sig;
  skBonusAll = Math.min(35, Math.max(0, pdLastSyncPayload.all || 0));
  skBonusByTab = Object.assign({ 1: 0, 2: 0, 3: 0 }, pdLastSyncPayload.byTab || {});
  skBonusBySkill = Object.assign({}, pdLastSyncPayload.bySkill || {});
  skBonusFire = pdLastSyncPayload.fire || 0;
  skBonusClassId = skActiveClassId;
  const bonusInp = document.getElementById("sk-bonus-all");
  if (bonusInp && document.activeElement !== bonusInp) bonusInp.value = String(skBonusAll);
  if (typeof renderSkillsTrees === "function") renderSkillsTrees();
  if (typeof renderSkillInspector === "function") renderSkillInspector();
  return true;
}
let pdActiveOskills = {};
let pdSelectedSkillKey = "";
let pdSkillNotesOpen = false;
let pdStatAlloc = { str: 0, dex: 0, vit: 0, enr: 0 };

function getStatBudget(lvl) {
  return Math.max(0, (Math.min(99, Math.max(1, Number(lvl) || 1)) - 1) * 5 + 15);
}

function clampStatAlloc(lvl) {
  const budget = getStatBudget(lvl);
  ["str", "dex", "vit", "enr"].forEach(k => {
    pdStatAlloc[k] = Math.max(0, Math.floor(Number(pdStatAlloc[k]) || 0));
  });
  let excess = (pdStatAlloc.str + pdStatAlloc.dex + pdStatAlloc.vit + pdStatAlloc.enr) - budget;
  if (excess > 0) {
    for (const k of ["enr", "vit", "dex", "str"]) {
      const cut = Math.min(pdStatAlloc[k], excess);
      pdStatAlloc[k] -= cut;
      excess -= cut;
      if (excess <= 0) break;
    }
  }
  const spent = pdStatAlloc.str + pdStatAlloc.dex + pdStatAlloc.vit + pdStatAlloc.enr;
  return { budget, spent, rem: Math.max(0, budget - spent) };
}

function getCraftedItemDef(id) {
  return (pdData && Array.isArray(pdData.craftedItems) ? pdData.craftedItems : []).find(c => c.id === id) || null;
}

const PD_BASE_TYPE_LABELS = {
  abow: "亚马逊专用弓 弓",
  aspe: "亚马逊专用矛 长矛",
  ajav: "亚马逊专用标枪 标枪",
  bow: "弓",
  xbow: "弩 十字弓",
  pole: "长柄武器 长柄",
  spea: "长矛 矛",
  jave: "标枪",
  swor: "剑",
  axe: "斧 斧头",
  mace: "钉头锤 钉锤 连枷",
  hamm: "锤 重锤",
  club: "木棒 棍棒",
  scep: "权杖 圣骑权杖",
  staf: "双手法杖 法杖",
  wand: "死灵法杖 魔杖",
  orb: "法师法珠 法珠",
  knif: "匕首",
  tkni: "飞刀 投掷",
  taxe: "飞斧 投掷",
  h2h: "刺客爪 拳刃",
  h2h2: "刺客爪 拳刃",
  tors: "盔甲 衣服",
  helm: "头盔",
  circ: "头环 宝冠 三重冠 权冠",
  phlm: "野蛮人专用头盔 野蛮人头",
  pelt: "德鲁伊专用头盔 狼头",
  shie: "盾牌",
  ashd: "圣骑士专用盾 圣骑士盾 圣骑盾",
  head: "死灵专用盾 死灵首级",
  grim: "术士专用魔典 魔典",
  glov: "手套",
  boot: "鞋子 战靴",
  belt: "腰带"
};
const PD_CLASS_LABELS_ZH = {
  ama: "亚马逊",
  sor: "法师",
  nec: "死灵法师 死灵",
  pal: "圣骑士",
  bar: "野蛮人",
  dru: "德鲁伊",
  ass: "刺客",
  war: "术士"
};

function getBaseTierMeta(b) {
  if (!b) return { rank: 1, label: "普通" };
  const tMap = itData && itData.baseUpgradeTiers;
  const ti = tMap && tMap[b.code];
  if (ti) {
    if (ti.tier === 3) return { rank: 3, label: "精华" };
    if (ti.tier === 2) return { rank: 2, label: "扩展" };
    return { rank: 1, label: "普通" };
  }
  const itItem = itData && Array.isArray(itData.baseItems) ? itData.baseItems.find(x => x.code === b.code) : null;
  if (itItem && itItem.tierNum) {
    return { rank: itItem.tierNum, label: itItem.tier || (itItem.tierNum === 3 ? "精华" : itItem.tierNum === 2 ? "扩展" : "普通") };
  }
  const reqLvl = Number(b.reqLvl || 0);
  if (reqLvl >= 42 || /^7|^6|^u|^wa[b-f]|^am[b-f]|^ob[b-f]|^pa[b-f]|^ne[b-f]|^ba[b-f]|^dr[b-f]/.test(b.code || "")) {
    return { rank: 3, label: "精华" };
  }
  if (reqLvl >= 20 || /^9|^8|^x|^wa[6-a]|^am[6-a]|^ob[6-a]|^pa[6-a]|^ne[6-a]|^ba[6-a]|^dr[6-a]/.test(b.code || "")) {
    return { rank: 2, label: "扩展" };
  }
  return { rank: 1, label: "普通" };
}

function getBaseAutomodSpec(bRule) {
  if (!bRule) return null;
  const t = bRule.type;
  if (t === "abow") {
    return { mode: "tab", legend: "🏹 亚马逊弓底材原生属性（可叠加超强 ED / AR 与符文之语）", tabLabel: "弓与弩技能 +", tabStatName: "弓与弩技能", max: 3, classId: "ama" };
  }
  if (t === "aspe" || t === "ajav") {
    return { mode: "tab", legend: "🔱 亚马逊矛/标枪底材原生属性（可叠加超强 ED / AR）", tabLabel: "标枪与长矛技能 +", tabStatName: "标枪与长矛技能", max: 3, classId: "ama" };
  }
  const staffmodMap = {
    orb: { classId: "sor", legend: "🔮 法师法珠底材原生自带技能（Staffmods · 最多 3 条，各 +1–3 级）" },
    staf: { classId: "sor", legend: "🪄 双手法杖底材原生自带技能（Staffmods · 最多 3 条，各 +1–3 级）" },
    wand: { classId: "nec", legend: "🦴 死灵魔杖底材原生自带技能（Staffmods · 最多 3 条，各 +1–3 级）" },
    head: { classId: "nec", legend: "💀 死灵首级底材原生自带技能（Staffmods · 最多 3 条，各 +1–3 级）" },
    scep: { classId: "pal", legend: "⚜️ 圣骑权杖底材原生自带技能（Staffmods · 最多 3 条，各 +1–3 级）" },
    phlm: { classId: "bar", legend: "🪖 野蛮人头盔底材原生自带技能（Staffmods · 最多 3 条，各 +1–3 级）" },
    pelt: { classId: "dru", legend: "🐺 德鲁伊狼头底材原生自带技能（Staffmods · 最多 3 条，各 +1–3 级）" },
    h2h: { classId: "ass", legend: "🗡️ 刺客拳刃底材原生自带技能（Staffmods · 最多 3 条，各 +1–3 级）" },
    h2h2: { classId: "ass", legend: "🗡️ 刺客拳刃底材原生自带技能（Staffmods · 最多 3 条，各 +1–3 级）" },
    grim: { classId: "war", legend: "📖 术士魔典底材原生自带技能（Staffmods · 最多 3 条，各 +1–3 级）" }
  };
  if (staffmodMap[t]) {
    return { mode: "staffmod", classId: staffmodMap[t].classId, legend: staffmodMap[t].legend };
  }
  return null;
}

function getBaseSearchText(b) {
  if (!b) return "";
  const tm = getBaseTierMeta(b);
  const typeLbl = PD_BASE_TYPE_LABELS[b.type] || "";
  const clsLbl = b.classOnly ? (PD_CLASS_LABELS_ZH[b.classOnly] || b.classOnly) : "";
  const extraAlias = b.code === "amc" ? "大院长之弓 仕女长之弓 主母之弓 GMB 精华弓 亚马逊精华弓" : (b.code === "amb" ? "女族长之弓 女族长弓 MB 精华弓 亚马逊精华弓" : "");
  return (b.nameZh || "") + " " + (b.aliasZh || "") + " " + extraAlias + " " + (b.nameEn || "") + " " + (b.code || "") + " " + tm.label + " " + typeLbl + " " + clsLbl;
}

function getDefaultCraftSkill(cDef, clsObj) {
  if (!cDef || !cDef.skillCapable) return null;
  const lvl = cDef.defaultSkillLvl || 2;
  if (cDef.defaultSkillMode === "none") return { mode: "none", tabPage: 1, lvl };
  if (cDef.defaultSkillMode === "tab") {
    const tabs = (clsObj && Array.isArray(clsObj.tabs)) ? clsObj.tabs : [];
    const matched = (cDef.defaultSkillTabHint && tabs.find(t => t.zhCN.includes(cDef.defaultSkillTabHint))) || tabs[0];
    return { mode: "tab", tabPage: matched ? matched.page : 1, lvl };
  }
  return { mode: "class", tabPage: 1, lvl };
}

function getCraftSkillLine(eq, cDef, clsObj) {
  if (!cDef || !cDef.skillCapable) return "";
  const cs = (eq && eq.craftSkill) || getDefaultCraftSkill(cDef, clsObj);
  if (!cs || cs.mode === "none" || !(cs.lvl > 0)) return "";
  if (cs.mode === "class") return "+" + cs.lvl + " 本职业技能";
  if (cs.mode === "tab") {
    const tabs = (clsObj && Array.isArray(clsObj.tabs)) ? clsObj.tabs : [];
    const tab = tabs.find(t => t.page === Number(cs.tabPage)) || tabs[0];
    return tab ? ("+" + cs.lvl + " " + tab.zhCN) : ("+" + cs.lvl + " 本系技能");
  }
  return "";
}

function getAffixSlotForEquip(slotId, bRule) {
  if (slotId === "amulet") return "amul";
  if (slotId === "ring1" || slotId === "ring2") return "ring";
  if (bRule && bRule.type) return bRule.type;
  if (slotId === "head") return "circ";
  if (slotId === "gloves") return "glov";
  if (slotId === "boots") return "boot";
  if (slotId === "belt") return "belt";
  if (slotId === "torso") return "tors";
  if (slotId === "offhand") return "shie";
  return "swor";
}

function resolveOfficialAffixItemType(affixSlotOrType, bRule) {
  if (pdData && pdData.typeAffixMap && pdData.typeAffixMap[affixSlotOrType]) return affixSlotOrType;
  const legacyMap = {
    amulet: "amul",
    ring: "ring",
    circlet: "circ",
    gloves: "glov",
    boots: "boot",
    belt: "belt",
    weapon: (bRule && bRule.type) || "swor",
    armor_shield: (bRule && bRule.type) || "shie",
    charm_sc: "scha",
    charm_lc: "mcha",
    charm_gc: "lcha"
  };
  return legacyMap[affixSlotOrType] || (bRule && bRule.type) || "ring";
}

function getMagicRareAffixPool(affixSlotOrType, quality, clsObj, bRule) {
  const prefixes = [];
  const suffixes = [];
  if (!pdData || !Array.isArray(pdData.affixCatalog) || !pdData.typeAffixMap) {
    return { prefixes, suffixes };
  }
  const itemType = resolveOfficialAffixItemType(affixSlotOrType, bRule);
  const entry = pdData.typeAffixMap[itemType];
  if (!entry) return { prefixes, suffixes };

  const idxs = quality === "rare" ? (entry.r || []) : (entry.m || []);
  const activeCid = clsObj ? clsObj.id : skActiveClassId;
  const isMercTarget = pdActiveTarget === "merc";
  const mercObj = isMercTarget ? getCurrentMercVariant() : null;
  const maxBaseSocks = bRule ? Number(bRule.maxSockets || 0) : 0;

  for (const idx of idxs) {
    const tuple = pdData.affixCatalog[idx];
    if (!tuple) continue;
    const [side, groupNum, clsOnly, rangeText] = tuple;
    if (clsOnly) {
      if (isMercTarget) {
        if (!(mercObj && mercObj.act === 5 && clsOnly === "bar")) continue;
      } else if (clsOnly !== activeCid) {
        continue;
      }
    }
    // Hide socket prefixes exceeding this specific base item's maxSockets
    if (groupNum === 122 && bRule) {
      if (/^4\s*孔/.test(rangeText) && maxBaseSocks < 4) continue;
      if (/^3\s*孔/.test(rangeText) && maxBaseSocks < 3) continue;
      if (/孔/.test(rangeText) && maxBaseSocks < 1) continue;
    }
    const item = {
      id: "ofc:" + idx,
      type: side === "p" ? "prefix" : "suffix",
      g: Number(groupNum || 0),
      nameZh: rangeText,
      range: rangeText
    };
    if (side === "p") prefixes.push(item);
    else suffixes.push(item);
  }
  return { prefixes, suffixes };
}

function buildCraftedRawStatsText(itemObj, clsObj) {
  const c = getCraftedItemDef(itemObj && itemObj.id);
  if (!c) return "";
  const parts = [];
  // Backwards compatibility only for legacy saved craft items without prefixes/suffixes arrays
  if (itemObj && !Array.isArray(itemObj.prefixes) && !Array.isArray(itemObj.suffixes) && itemObj.craftSkill) {
    const skLine = getCraftSkillLine(itemObj, c, clsObj);
    if (skLine) parts.push(skLine);
  }
  if (c.stats) parts.push(c.stats);
  const afTxt = buildMagicRareStatsText(itemObj);
  if (afTxt) parts.push(afTxt);
  return parts.join(" · ");
}

function preserveRollsAcrossAffixEdit(itemObj, mutateFn) {
  if (!itemObj) return;
  const getRaw = () => itemObj.cat === "craft"
    ? buildCraftedRawStatsText(itemObj, typeof getActiveClassObj === "function" ? getActiveClassObj() : null)
    : buildMagicRareStatsText(itemObj);
  const prevRaw = getRaw();
  const prevVars = extractVariableRanges(prevRaw).vars;
  const savedBySig = new Map();
  const seenPrev = new Map();
  prevVars.forEach(v => {
    const cnt = (seenPrev.get(v.rawLine) || 0) + 1;
    seenPrev.set(v.rawLine, cnt);
    if (itemObj.rolls && itemObj.rolls[v.key] !== undefined) {
      savedBySig.set(v.rawLine + "#" + cnt, itemObj.rolls[v.key]);
    }
  });
  mutateFn();
  const nextRaw = getRaw();
  const nextVars = extractVariableRanges(nextRaw).vars;
  const nextRolls = {};
  const seenNext = new Map();
  nextVars.forEach(v => {
    const cnt = (seenNext.get(v.rawLine) || 0) + 1;
    seenNext.set(v.rawLine, cnt);
    const sig = v.rawLine + "#" + cnt;
    if (savedBySig.has(sig)) {
      nextRolls[v.key] = savedBySig.get(sig);
    }
  });
  itemObj.rolls = nextRolls;
}

function buildMagicRareStatsText(itemObj) {
  if (!itemObj) return "";
  const list = [];
  if (Array.isArray(itemObj.prefixes)) itemObj.prefixes.forEach(p => { if (p && p.range) list.push(p.range); });
  if (Array.isArray(itemObj.suffixes)) itemObj.suffixes.forEach(s => { if (s && s.range) list.push(s.range); });
  return list.join(" · ");
}

function computeMagicRareMaxSockets(eq, bRule) {
  if (!eq || !bRule || !(bRule.maxSockets > 0)) return 0;
  if (["jave", "ajav", "tkni", "taxe", "tpot"].includes(bRule.type)) return 0;
  const raw = buildMagicRareStatsText(eq);
  const rolled = raw ? formatItemLinesWithRolls(raw, eq.rolls) : [];
  for (const line of rolled) {
    const clean = line.replace(/\[[^\]]+\]/g, "").trim();
    const sm = clean.match(/^(\d+)\s*孔$/);
    if (sm) return Math.min(bRule.maxSockets, Math.max(1, Number(sm[1])));
  }
  // Larzuk quest sockets when no socket prefix is chosen (2os max on Magic, 1os on Rare/Crafted)
  return eq.cat === "magic" ? Math.min(bRule.maxSockets, 2) : 1;
}

function getBagItemRawStats(bagItem, def) {
  if (!def) return "";
  if (def.isBlankMagic) return buildMagicRareStatsText(bagItem);
  return def.stats || "";
}

function getMagicCharmShortTag(bagItem, def) {
  if (!def) return "";
  const raw = getBagItemRawStats(bagItem, def);
  if (!raw) return (def.shortZh || def.size) + "(空)";
  const rolled = formatItemLinesWithRolls(raw, bagItem.rolls);
  const parts = [];
  for (const l of rolled) {
    const clean = l.replace(/\[[^\]]+\]/g, "").trim();
    let m;
    if ((m = clean.match(/\+(\d+)\s*([^\d%+\s·]+技能|[^\d%+\s·]+法术|[^\d%+\s·]+灵气|[^\d%+\s·]+技艺|[^\d%+\s·]+训练)/))) { parts.push("+" + m[1] + m[2].slice(0, 2)); }
    else if ((m = clean.match(/\+(\d+)\s*(?:命中值|AR)/i))) { parts.push(m[1] + "AR"); }
    else if ((m = clean.match(/\+(\d+)%\s*(?:快速打击恢复|FHR)/i))) { parts.push(m[1] + "FHR"); }
    else if ((m = clean.match(/\+(\d+)%\s*(?:高速跑步|FRW)/i))) { parts.push(m[1] + "FRW"); }
    else if ((m = clean.match(/\+(\d+)\s*生命/))) { parts.push(m[1] + "命"); }
    else if ((m = clean.match(/\+(\d+)\s*法力/))) { parts.push(m[1] + "蓝"); }
    else if ((m = clean.match(/\+(\d+)%\s*所有抗性/))) { parts.push(m[1] + "全"); }
    else if ((m = clean.match(/(火|冰|电|毒)[^\d+]*\+(\d+)%/))) { parts.push(m[2] + m[1]); }
    else if ((m = clean.match(/\+(\d+)%\s*.*MF/i))) { parts.push(m[1] + "MF"); }
    else if ((m = clean.match(/\+(\d+)\s*最大伤害/))) { parts.push(m[1] + "M"); }
  }
  return parts.length ? parts.slice(0, 2).join("/") : (def.shortZh + "(已选)");
}

const PD_CHAR_SLOTS = [
  { id: "weapon", area: "weapon", label: "主手武器", bg: "/images/ui/inventory_paperdoll_weapon.webp", tall: true },
  { id: "head", area: "head", label: "头盔", bg: "/images/ui/inventory_paperdoll_headarmor.webp" },
  { id: "offhand", area: "offhand", label: "副手/盾/魔典", bg: "/images/ui/inventory_paperdoll_shield.webp", tall: true },
  { id: "torso", area: "torso", label: "盔甲", bg: "/images/ui/inventory_paperdoll_chestarmor.webp", tall: true },
  { id: "gloves", area: "gloves", label: "手套", bg: "/images/ui/inventory_paperdoll_glove.webp" },
  { id: "belt", area: "belt", label: "腰带", bg: "/images/ui/inventory_paperdoll_belt.webp", mini: true },
  { id: "boots", area: "boots", label: "鞋子", bg: "/images/ui/inventory_paperdoll_boots.webp" },
  { id: "ring1", area: "ring1", label: "左戒指", bg: "/images/ui/inventory_paperdoll_ring.webp", mini: true },
  { id: "amulet", area: "amulet", label: "护身符(项链)", bg: "/images/ui/inventory_paperdoll_amulet.webp", mini: true },
  { id: "ring2", area: "ring2", label: "右戒指", bg: "/images/ui/inventory_paperdoll_ring.webp", mini: true }
];

const PD_MERC_SLOTS = [
  { id: "weapon", label: "主手武器", bg: "/images/ui/inventory_paperdoll_weapon.webp", tall: true },
  { id: "head", label: "佣兵头盔", bg: "/images/ui/inventory_paperdoll_headarmor.webp" },
  { id: "offhand", label: "佣兵副手", bg: "/images/ui/inventory_paperdoll_shield.webp", tall: true },
  { id: "torso", label: "佣兵盔甲", bg: "/images/ui/inventory_paperdoll_chestarmor.webp", gridSpan: 3 }
];


function makeSetEq(nameEn) {
  return { cat: "set", id: nameEn, eth: false, sockets: [], rolls: {} };
}

function getDefaultClassSetLoadout(classId) {
  const empty = {
    head: null, amulet: null, weapon: null, torso: null, offhand: null,
    gloves: null, ring1: null, belt: null, ring2: null, boots: null
  };
  if (classId === "war") {
    return Object.assign(empty, {
      head: makeSetEq("Horazon's Countenance"),
      torso: makeSetEq("Horazon's Dominion"),
      gloves: makeSetEq("Horazon's Hold"),
      boots: makeSetEq("Horazon's Legacy"),
      offhand: makeSetEq("Horazon's Secrets")
    });
  }
  if (classId === "sor") {
    return Object.assign(empty, {
      head: makeSetEq("Tal Rasha's Horadric Crest"),
      amulet: makeSetEq("Tal Rasha's Adjudication"),
      torso: makeSetEq("Tal Rasha's Guardianship"),
      weapon: makeSetEq("Tal Rasha's Lidless Eye"),
      belt: makeSetEq("Tal Rasha's Fine-Spun Cloth")
    });
  }
  if (classId === "bar") {
    return Object.assign(empty, {
      head: makeSetEq("Immortal King's Will"),
      torso: makeSetEq("Immortal King's Soul Cage"),
      weapon: makeSetEq("Immortal King's Stone Crusher"),
      gloves: makeSetEq("Immortal King's Forge"),
      belt: makeSetEq("Immortal King's Detail"),
      boots: makeSetEq("Immortal King's Pillar")
    });
  }
  if (classId === "nec") {
    return Object.assign(empty, {
      head: makeSetEq("Trang-Oul's Guise"),
      torso: makeSetEq("Trang-Oul's Scales"),
      offhand: makeSetEq("Trang-Oul's Wing"),
      gloves: makeSetEq("Trang-Oul's Claws"),
      belt: makeSetEq("Trang-Oul's Girth")
    });
  }
  if (classId === "pal") {
    return Object.assign(empty, {
      head: makeSetEq("Griswold's Valor"),
      torso: makeSetEq("Griswold's Heart"),
      weapon: makeSetEq("Griswold's Redemption"),
      offhand: makeSetEq("Griswold's Honor")
    });
  }
  if (classId === "dru") {
    return Object.assign(empty, {
      head: makeSetEq("Aldur's Stony Gaze"),
      torso: makeSetEq("Aldur's Deception"),
      weapon: makeSetEq("Aldur's Rhythm"),
      boots: makeSetEq("Aldur's Advance")
    });
  }
  if (classId === "ama") {
    return Object.assign(empty, {
      head: makeSetEq("M'avina's True Sight"),
      torso: makeSetEq("M'avina's Embrace"),
      weapon: makeSetEq("M'avina's Caster"),
      gloves: makeSetEq("M'avina's Icy Clutch"),
      belt: makeSetEq("M'avina's Tenet")
    });
  }
  if (classId === "ass") {
    return Object.assign(empty, {
      head: makeSetEq("Natalya's Totem"),
      torso: makeSetEq("Natalya's Shadow"),
      weapon: makeSetEq("Natalya's Mark"),
      boots: makeSetEq("Natalya's Soul")
    });
  }
  return empty;
}

function getDefaultMercLoadout() {
  return {
    head: { cat: "unique", id: "Andariel's Visage", eth: true, sockets: ["r08"], rolls: {} },
    torso: { cat: "rw", id: "fortitude", baseCode: "uar", eth: true, sockets: [], rolls: {} },
    weapon: { cat: "rw", id: "infinity", baseCode: "7wc", eth: true, sockets: [], rolls: {} },
    offhand: null
  };
}

let pdCharLoadout = getDefaultClassSetLoadout("war");
let pdMercLoadout = getDefaultMercLoadout();
let pdActiveWeaponSet = 1;
let pdCharSwapLoadout = { weapon: null, offhand: null };


function loadAllSavedPaperdollBuilds() {
  try {
    const raw = localStorage.getItem(PD_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") setPdSavedByClass(parsed);
    }
  } catch (e) {
    setPdSavedByClass({});
  }
}

function savePaperdollState(classId) {
  const cid = classId || skActiveClassId;
  if (!cid || pdStateLoadedForClass !== cid) return;
  try {
    const vSel = document.getElementById("merc-variant-select");
    const mLvl = document.getElementById("merc-lvl-input");
    const cLvl = document.getElementById("pd-char-lvl");
    const ctaEl = document.getElementById("pd-cta-bo");
    const cAuraEl = document.getElementById("pd-char-aura");
    const dAuraEl = document.getElementById("pd-warlock-demon-aura");
    const dMlvlEl = document.getElementById("pd-warlock-demon-mlvl");
    const hexEl = document.getElementById("pd-warlock-hex-buff");
    const debuffEl = document.getElementById("pd-enemy-debuff");
    const maxEl = document.getElementById("pd-skill-max-mode");
    const mEnabledEl = document.getElementById("pd-merc-enabled");
    const mAuraEl = document.getElementById("pd-merc-aura-on");
    const palHsEl = document.getElementById("pd-pal-hs-on");

    pdSavedByClass[cid] = {
      charLoadout: cloneJsonSafe(pdCharLoadout, getDefaultClassSetLoadout(cid)),
      swapLoadout: cloneJsonSafe(pdCharSwapLoadout, { weapon: null, offhand: null }),
      activeWeaponSet: pdActiveWeaponSet === 2 ? 2 : 1,
      mercLoadout: cloneJsonSafe(pdMercLoadout, getDefaultMercLoadout()),
      charBag: cloneJsonSafe(pdCharBag, []),
      bagNextUid: pdBagNextUid,
      statAlloc: cloneJsonSafe(pdStatAlloc, { str: 0, dex: 0, vit: 0, enr: 0 }),
      charLvl: cLvl ? Number(cLvl.value || 90) : 90,
      mercVariant: vSel && vSel.value ? vSel.value : "a2-might",
      mercLvl: mLvl ? Number(mLvl.value || 90) : 90,
      mercEnabled: mEnabledEl ? Boolean(mEnabledEl.checked) : true,
      mercAuraOn: mAuraEl ? Boolean(mAuraEl.checked) : true,
      ctaOn: ctaEl ? Boolean(ctaEl.checked) : true,
      holyShieldOn: palHsEl ? Boolean(palHsEl.checked) : true,
      charAura: cAuraEl ? cAuraEl.value : "none",
      demonAura: normalizeDemonAuraId(dAuraEl ? dAuraEl.value : "none"),
      demonMlvl: dMlvlEl ? Math.min(99, Math.max(1, Number(dMlvlEl.value || 96))) : 96,
      warlockHex: hexEl ? hexEl.value : "none",
      enemyDebuff: debuffEl ? debuffEl.value : "none",
      selectedSkillKey: pdSelectedSkillKey || "",
      maxMode: maxEl ? Boolean(maxEl.checked) : false
    };
    localStorage.setItem(PD_STORAGE_KEY, JSON.stringify(pdSavedByClass));
    if (!window.__cloudApplyingRemote) {
      localStorage.setItem("d2r-builds-local-updated-at", new Date().toISOString());
      if (typeof scheduleCloudSync === "function") scheduleCloudSync();
    }
  } catch (e) {}
}

function loadPaperdollStateForClass(classId) {
  const cid = classId || skActiveClassId;
  if (!cid) return;
  const saved = pdSavedByClass && pdSavedByClass[cid];
  if (saved && saved.charLoadout) {
    pdCharLoadout = Object.assign(
      { head: null, amulet: null, weapon: null, torso: null, offhand: null, gloves: null, ring1: null, belt: null, ring2: null, boots: null },
      cloneJsonSafe(saved.charLoadout, {})
    );
    pdCharSwapLoadout = Object.assign(
      { weapon: null, offhand: null },
      cloneJsonSafe(saved.swapLoadout, {})
    );
    pdActiveWeaponSet = saved.activeWeaponSet === 2 ? 2 : 1;
    pdMercLoadout = Object.assign(
      { head: null, torso: null, weapon: null, offhand: null },
      cloneJsonSafe(saved.mercLoadout, getDefaultMercLoadout())
    );
    pdCharBag = Array.isArray(saved.charBag) ? cloneJsonSafe(saved.charBag, []) : [];
    pdBagNextUid = Math.max(Number(saved.bagNextUid || 1), pdCharBag.length + 1);
    pdStatAlloc = Object.assign({ str: 0, dex: 0, vit: 0, enr: 0 }, cloneJsonSafe(saved.statAlloc, {}));
    pdSelectedSkillKey = saved.selectedSkillKey || "";

    const setVal = (id, v) => { const el = document.getElementById(id); if (el && v !== undefined) el.value = String(v); };
    const setChk = (id, v) => { const el = document.getElementById(id); if (el && v !== undefined) el.checked = Boolean(v); };
    setVal("pd-char-lvl", saved.charLvl || 90);
    if (saved.mercVariant) setVal("merc-variant-select", saved.mercVariant);
    setVal("merc-lvl-input", saved.mercLvl || 90);
    setChk("pd-merc-enabled", saved.mercEnabled !== undefined ? saved.mercEnabled : true);
    setChk("pd-merc-aura-on", saved.mercAuraOn !== undefined ? saved.mercAuraOn : true);
    setChk("pd-cta-bo", saved.ctaOn !== undefined ? saved.ctaOn : true);
    setChk("pd-pal-hs-on", saved.holyShieldOn !== undefined ? saved.holyShieldOn : true);
    setVal("pd-char-aura", saved.charAura || "none");
    setVal("pd-warlock-demon-aura", normalizeDemonAuraId(saved.demonAura || "none"));
    setVal("pd-warlock-demon-mlvl", saved.demonMlvl || 96);
    setVal("pd-warlock-hex-buff", saved.warlockHex || "none");
    setVal("pd-enemy-debuff", saved.enemyDebuff || "none");
    setChk("pd-skill-max-mode", Boolean(saved.maxMode));
  } else {
    pdCharLoadout = getDefaultClassSetLoadout(cid);
    pdCharSwapLoadout = { weapon: null, offhand: null };
    pdActiveWeaponSet = 1;
    pdMercLoadout = getDefaultMercLoadout();
    pdCharBag = [];
    pdBagNextUid = 1;
    pdStatAlloc = { str: 0, dex: 0, vit: 0, enr: 0 };
    pdSelectedSkillKey = "";
    const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = String(v); };
    const setChk = (id, v) => { const el = document.getElementById(id); if (el) el.checked = Boolean(v); };
    setChk("pd-merc-enabled", true);
    setChk("pd-merc-aura-on", true);
    setChk("pd-pal-hs-on", true);
    setVal("pd-char-aura", "none");
    setVal("pd-warlock-demon-aura", "none");
    setVal("pd-warlock-demon-mlvl", 96);
    setVal("pd-warlock-hex-buff", "none");
    setVal("pd-enemy-debuff", "none");
  }
  pdActiveTarget = "char";
  pdActiveBagUid = null;
  pdActiveSlot = pdCharLoadout.weapon ? "weapon" : "head";
  setPdStateLoadedForClass(cid);
}

function switchPaperdollWeaponSet(targetSet) {
  const nextSet = targetSet === 2 ? 2 : 1;
  if (nextSet === pdActiveWeaponSet) return false;
  const prevWeap = pdCharLoadout.weapon || null;
  const prevOff = pdCharLoadout.offhand || null;
  pdCharLoadout.weapon = pdCharSwapLoadout.weapon || null;
  pdCharLoadout.offhand = pdCharSwapLoadout.offhand || null;
  pdCharSwapLoadout = { weapon: prevWeap, offhand: prevOff };
  pdActiveWeaponSet = nextSet;
  if (itData && pdData) {
    renderPaperdollAll();
  } else {
    renderWeaponSwapBar();
  }
  return true;
}

function togglePaperdollWeaponSet() {
  return switchPaperdollWeaponSet(pdActiveWeaponSet === 1 ? 2 : 1);
}

function applyPaperdollSwapPreset(presetKey) {
  let nextPair = { weapon: null, offhand: null };
  if (presetKey === "cta") {
    const shieldEq = skActiveClassId === "pal"
      ? { cat: "rw", id: "spirit", baseCode: "pab", eth: false, palModType: "res", palRes: 45, sockets: [], rolls: {} }
      : { cat: "rw", id: "spirit", baseCode: "uit", eth: false, sockets: [], rolls: {} };
    nextPair = {
      weapon: { cat: "rw", id: "call-to-arms", baseCode: "crs", eth: false, sockets: [], rolls: {} },
      offhand: shieldEq
    };
  } else if (presetKey === "mf") {
    nextPair = {
      weapon: { cat: "unique", id: "Blade of Ali Baba", eth: false, sockets: ["r24", "r24"], rolls: {} },
      offhand: { cat: "rw", id: "rhyme", baseCode: "xsh", eth: false, sockets: [], rolls: {} }
    };
  }
  if (pdActiveWeaponSet === 2) {
    pdCharLoadout.weapon = nextPair.weapon;
    pdCharLoadout.offhand = nextPair.offhand;
  } else {
    pdCharSwapLoadout = nextPair;
  }
  if (itData && pdData) {
    renderPaperdollAll();
  } else {
    renderWeaponSwapBar();
  }
}

function renderWeaponSwapBar() {
  const btn1 = document.getElementById("pd-wset-1");
  const btn2 = document.getElementById("pd-wset-2");
  const grid = document.getElementById("pd-char-grid");
  const prevEl = document.getElementById("pd-swap-preview");
  const isSet2 = pdActiveWeaponSet === 2;
  if (btn1) {
    btn1.classList.toggle("active", !isSet2);
    btn1.setAttribute("aria-pressed", String(!isSet2));
  }
  if (btn2) {
    btn2.classList.toggle("active", isSet2);
    btn2.setAttribute("aria-pressed", String(isSet2));
  }
  if (grid) {
    grid.classList.toggle("is-swap-active", isSet2);
  }
  if (prevEl) {
    const otherLabel = isSet2 ? "主手组 I" : "副手组 II";
    const wInfo = pdCharSwapLoadout.weapon ? resolveEquippedItemInfo(pdCharSwapLoadout.weapon, { isChar: true }) : null;
    const oInfo = pdCharSwapLoadout.offhand ? resolveEquippedItemInfo(pdCharSwapLoadout.offhand, { isChar: true }) : null;
    const names = [wInfo ? wInfo.titleZh : "", oInfo ? oInfo.titleZh : ""].filter(Boolean);
    prevEl.textContent = otherLabel + "：" + (names.length ? names.join(" + ") : "未装备");
    prevEl.title = prevEl.textContent;
  }
}

function computeRealCtaBoStats(charLvl, maxMode, clsObj) {
  const isCta = (eq) => Boolean(eq && eq.cat === "rw" && eq.id === "call-to-arms");
  const activeCta = isCta(pdCharLoadout.weapon) ? pdCharLoadout.weapon : (isCta(pdCharLoadout.offhand) ? pdCharLoadout.offhand : null);
  const swapCta = !activeCta
    ? (isCta(pdCharSwapLoadout.weapon) ? pdCharSwapLoadout.weapon : (isCta(pdCharSwapLoadout.offhand) ? pdCharSwapLoadout.offhand : null))
    : null;
  const ctaEq = activeCta || swapCta;
  if (!ctaEq || !itData || !pdData) {
    return { real: false, setNum: 0, isSwap: false, bcLvl: 0, boLvl: 11, boPct: 65, boDurSec: 130 };
  }
  const ctaOnActive = Boolean(activeCta);
  const setNum = ctaOnActive ? pdActiveWeaponSet : (pdActiveWeaponSet === 1 ? 2 : 1);
  const ctaLoadout = ctaOnActive
    ? pdCharLoadout
    : Object.assign({}, pdCharLoadout, { weapon: pdCharSwapLoadout.weapon || null, offhand: pdCharSwapLoadout.offhand || null });
  const ctaTot = aggregateLoadoutStats(ctaLoadout, true, charLvl, pdCharBag, { ctaSkillBonus: 0, maxMode });
  const info = resolveEquippedItemInfo(ctaEq, { actorLvl: charLvl, isChar: true });
  let baseBo = 6;
  let baseBc = 6;
  if (info && Array.isArray(info.rolledLines)) {
    for (const line of info.rolledLines) {
      const mBo = String(line).match(/\+(\d+)\s*战斗体制/);
      if (mBo) baseBo = Math.max(1, Number(mBo[1]));
      const mBc = String(line).match(/\+(\d+)\s*战斗指挥/);
      if (mBc) baseBc = Math.max(1, Number(mBc[1]));
    }
  }
  let bcLvl = baseBc + ctaTot.skills;
  let boLvl = baseBo + ctaTot.skills + 1;
  if (skActiveClassId === "bar" && clsObj) {
    const bBuild = getClassBuild("bar");
    const hardBo = Number((bBuild && bBuild["Battle Orders"]) || 0);
    const hardBc = Number((bBuild && bBuild["Battle Command"]) || 0);
    const boSk = (clsObj.skills || []).find(s => s.key === "Battle Orders");
    const bcSk = (clsObj.skills || []).find(s => s.key === "Battle Command");
    const boTab = boSk ? (ctaTot.tabSkills[boSk.page] || 0) : 0;
    const bcTab = bcSk ? (ctaTot.tabSkills[bcSk.page] || 0) : 0;
    bcLvl = hardBc + Math.min(3, baseBc) + ctaTot.skills + (ctaTot.classSkills || 0) + bcTab;
    boLvl = hardBo + Math.min(3, baseBo) + ctaTot.skills + (ctaTot.classSkills || 0) + boTab + 1;
  }
  const boPct = 32 + boLvl * 3;
  const boDurSec = 20 + boLvl * 10;
  return { real: true, setNum, isSwap: !ctaOnActive, bcLvl, boLvl, boPct, boDurSec, allSkillsOnCtaSet: ctaTot.skills };
}

function getBaseRule(code) {
  return (pdData && pdData.baseRules && pdData.baseRules[code]) || null;
}

const VALID_WARLOCK_DEMON_AURAS = new Set(["vigor", "fana", "conc", "hf", "thorns"]);

function normalizeDemonAuraId(v) {
  const s = String(v || "none").trim().replace(/-\d+$/, "");
  if (!s || s === "none") return "none";
  return VALID_WARLOCK_DEMON_AURAS.has(s) ? s : "none";
}

function computeBoundDemonAura(rawAuraId, rawMlvl) {
  const id = normalizeDemonAuraId(rawAuraId);
  if (id === "none") return null;
  const mlvl = Math.min(99, Math.max(1, Math.floor(Number(rawMlvl) || 96)));
  const dm12 = (L, a, b) => a + Math.floor(((b - a) * Math.floor((110 * L) / (L + 6))) / 100);
  if (id === "vigor") {
    const lvl = Math.max(1, Math.floor(mlvl / 7));
    const frw = Math.min(50, dm12(lvl, 7, 50));
    const stamPct = 50 + (lvl - 1) * 25;
    return { id, name: "活力", lvl, divisor: 7, mlvl, frw, detail: "全队 +" + frw + "% 高跑 FRW · +" + stamPct + "% 耐力上限与恢复 (mlvl " + mlvl + "/7)" };
  }
  if (id === "fana") {
    const lvl = Math.max(1, Math.floor(mlvl / 8));
    const eias = dm12(lvl, 10, 40);
    const physEdPct = Math.floor((50 + (lvl - 1) * 17) / 2);
    const arPct = 40 + (lvl - 1) * 5;
    return { id, name: "狂热", lvl, divisor: 8, mlvl, eias, physEdPct, arPct, detail: "全队 +" + eias + "% EIAS 攻速 · +" + physEdPct + "% 物理伤 · +" + arPct + "% AR (mlvl " + mlvl + "/8)" };
  }
  if (id === "conc") {
    const lvl = Math.max(1, Math.floor(mlvl / 6));
    const physEdPct = 60 + (lvl - 1) * 15;
    const hammerEdPct = Math.floor(physEdPct / 2);
    return { id, name: "专注", lvl, divisor: 6, mlvl, physEdPct, hammerEdPct, detail: "全队 +" + physEdPct + "% 物理增伤 (祝福之锤 +" + hammerEdPct + "% · mlvl " + mlvl + "/6，由原力量光环映射)" };
  }
  if (id === "hf") {
    const lvl = Math.max(1, Math.floor(mlvl / 7));
    const slowPct = Math.min(60, dm12(lvl, 25, 60));
    return { id, name: "圣冰", lvl, divisor: 7, mlvl, slowPct, detail: "大范围冰冷减速 -" + slowPct + "% 控场 (mlvl " + mlvl + "/7)" };
  }
  if (id === "thorns") {
    const lvl = Math.max(1, Math.floor(mlvl / 7));
    const retPct = 250 + (lvl - 1) * 40;
    const flatRet = computeScaledValue([4, 4, 8, 12, 16, 20], 8, lvl);
    return { id, name: "荆棘", lvl, divisor: 7, mlvl, detail: "近战受击反伤 +" + retPct + "% + 固定 " + flatRet + " 物理伤 (mlvl " + mlvl + "/7)" };
  }
  if (id === "might") {
    const lvl = Math.max(1, Math.floor(mlvl / 6));
    const physEdPct = 30 + lvl * 10;
    return { id, name: "力量", lvl, divisor: 6, mlvl, physEdPct, detail: "全队 +" + physEdPct + "% 物理伤害 (mlvl " + mlvl + "/6)" };
  }
  if (id === "conv") {
    const lvl = Math.max(1, Math.floor(mlvl / 8));
    const convRes = Math.min(150, 25 + lvl * 5);
    const convDef = Math.min(97, dm12(lvl, 40, 100));
    return { id, name: "信念", lvl, divisor: 8, mlvl, convRes, convDef, detail: "-" + convRes + "% 敌火/冰/电抗 · -" + convDef + "% 敌防 (mlvl " + mlvl + "/8)" };
  }
  if (id === "ba") {
    const lvl = Math.max(1, Math.floor(mlvl / 5));
    const arPct = 60 + lvl * 15;
    return { id, name: "祝福瞄准", lvl, divisor: 5, mlvl, arPct, detail: "全队 +" + arPct + "% 攻击准确率 AR (mlvl " + mlvl + "/5)" };
  }
  return null;
}

function isMercEnabled() {
  const el = document.getElementById("pd-merc-enabled");
  return el ? Boolean(el.checked) : true;
}

function syncMercEnabledUi(enabled) {
  const card = document.getElementById("pd-merc-card");
  if (card) card.classList.toggle("merc-disabled", !enabled);
  ["pd-merc-aura-on", "merc-lvl-input", "merc-variant-select"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = !enabled;
  });
}

function getCurrentMercVariant() {
  const vSel = document.getElementById("merc-variant-select");
  const vid = vSel ? vSel.value : "a2-might";
  return MERC_VARIANTS.find(v => v.id === vid) || MERC_VARIANTS[0];
}

function getSlotRuleDescription(target, slotId) {
  if (target === "char") {
    const cid = skActiveClassId;
    if (slotId === "offhand") {
      const wEq = pdCharLoadout.weapon;
      const wRule = wEq ? getEquippedBaseRule(wEq) : null;
      if (cid === "war") {
        return "术士专属（悬浮精通）：即使主手握持双手武器，副手依然可装备术士专属魔典 (Grimoire) 或常规盾牌";
      }
      if (cid === "bar") {
        return "野蛮人专属：副手可装备盾牌，或双持任意单手近战武器 / 双手剑 (1or2handed)";
      }
      if (cid === "ass") {
        return "刺客专属：主手装备刺客爪时，副手可双持第二把刺客爪，或装备常规盾牌";
      }
      if (wRule && wRule.twoHanded) {
        return "⚠️ 当前主手已装备双手武器（" + wRule.nameZh + "），副手槽位已被占用锁定";
      }
      return "角色副手：可装备盾牌及本职业专属副手（圣骑盾/死灵盾/术士魔典）";
    }
    return "仅显示符合当前部位且满足本职业（" + cid.toUpperCase() + "）专属限制的装备";
  } else {
    const merc = getCurrentMercVariant();
    if (slotId === "weapon") {
      if (merc.act === 1) return "Act 1 萝格斥候武器限制：仅限装备【弓 / 亚马逊专用弓】（不可用十字弓）";
      if (merc.act === 2) return "Act 2 沙漠米山武器限制：仅限装备【长柄武器 (Polearm) / 长矛 (Spear) / 标枪 (Javelin)】";
      if (merc.act === 3) return "Act 3 东方铁狼武器限制：仅限装备【单手剑 (1H Sword)】";
      if (merc.id === "a5-frenzy") return "Act 5 双持狂乱野蛮人武器限制：主手仅限【单手剑 或 可单手握持的双手剑】";
      return "Act 5 战吼野蛮人武器限制：仅限装备【单手剑 或 双手剑】";
    }
    if (slotId === "offhand") {
      if (merc.act === 1 || merc.act === 2 || merc.id === "a5-bash") {
        return "⚠️ 该流派佣兵无法使用副手槽位（仅 Act 3 铁狼可拿盾牌、Act 5 狂乱可副手拿单手剑）";
      }
      if (merc.act === 3) return "Act 3 东方铁狼副手限制：仅限装备【常规盾牌】（不可用职业专属盾）";
      if (merc.id === "a5-frenzy") return "Act 5 双持狂乱野蛮人副手限制：仅限装备第二把【单手剑】";
    }
    if (slotId === "head" && merc.act === 5) return "Act 5 野蛮人佣兵头盔：可装备常规头盔/头环，也可装备【野蛮人专属头盔】";
    return "佣兵防具槽：可装备任意非职业专属头盔/盔甲";
  }
}

function getEquippedBaseRule(eq) {
  if (!eq || !pdData) return null;
  if (eq.cat === "unique") {
    const m = pdData.uniqueMeta && pdData.uniqueMeta[eq.id];
    return m ? getBaseRule(m.code) : null;
  }
  if (eq.cat === "set") {
    const m = pdData.setMeta && pdData.setMeta[eq.id];
    return m ? getBaseRule(m.code) : null;
  }
  if (eq.cat === "craft") {
    const c = getCraftedItemDef(eq.id);
    return c && c.code ? getBaseRule(c.code) : null;
  }
  if (eq.cat === "rw" || eq.cat === "base" || eq.cat === "magic" || eq.cat === "rare") {
    return eq.baseCode ? getBaseRule(eq.baseCode) : null;
  }
  return null;
}

function isOffhandSlotLocked(target) {
  if (target === "merc") {
    const merc = getCurrentMercVariant();
    return !(merc.act === 3 || merc.id === "a5-frenzy");
  }
  const wEq = pdCharLoadout.weapon;
  const wRule = getEquippedBaseRule(wEq);
  if (!wRule || !wRule.twoHanded) return false;
  if (skActiveClassId === "war") return false; // Warlock Levitation Mastery allows Grimoire with 2H weapon
  if (skActiveClassId === "bar" && wRule.oneOrTwoHanded) return false; // Barbarian 1or2handed sword
  return true;
}

function isBaseRuleLegalForTargetSlot(target, slotId, bRule) {
  if (!bRule) return false;
  if (target === "char") {
    const cid = skActiveClassId;
    if (bRule.classOnly && bRule.classOnly !== cid) return false;
    if (slotId === "head") return bRule.slot === "head";
    if (slotId === "torso") return bRule.slot === "torso";
    if (slotId === "gloves") return bRule.slot === "gloves";
    if (slotId === "boots") return bRule.slot === "boots";
    if (slotId === "belt") return bRule.slot === "belt";
    if (slotId === "weapon") return bRule.slot === "weapon";
    if (slotId === "offhand") {
      const wRule = getEquippedBaseRule(pdCharLoadout.weapon);
      if (wRule && wRule.twoHanded) {
        if (cid === "war") return bRule.type === "grim";
        if (cid === "bar" && wRule.oneOrTwoHanded) {
          return bRule.slot === "offhand" || (bRule.slot === "weapon" && (!bRule.twoHanded || bRule.oneOrTwoHanded));
        }
        return false;
      }
      if (bRule.slot === "offhand") return true;
      if (cid === "bar" && bRule.slot === "weapon") {
        return (!bRule.twoHanded || bRule.oneOrTwoHanded) && !["bow", "xbow", "pole", "spea", "staf", "wand"].includes(bRule.type);
      }
      if (cid === "ass" && (bRule.type === "h2h" || bRule.type === "h2h2")) {
        return !wRule || wRule.type === "h2h" || wRule.type === "h2h2";
      }
      return false;
    }
    return false;
  } else {
    const merc = getCurrentMercVariant();
    if (slotId === "head") {
      if (bRule.slot !== "head") return false;
      if (bRule.classOnly) return merc.act === 5 && bRule.classOnly === "bar";
      return true;
    }
    if (slotId === "torso") return bRule.slot === "torso" && !bRule.classOnly;
    if (slotId === "weapon") {
      if (bRule.slot !== "weapon") return false;
      if (merc.act === 1) return bRule.type === "bow" || bRule.type === "abow";
      if (merc.act === 2) return ["pole", "spea", "jave"].includes(bRule.type) && !bRule.classOnly;
      if (merc.act === 3) return bRule.type === "swor" && !bRule.twoHanded;
      if (merc.id === "a5-frenzy") return bRule.type === "swor" && (!bRule.twoHanded || bRule.oneOrTwoHanded);
      if (merc.id === "a5-bash") return bRule.type === "swor";
      return false;
    }
    if (slotId === "offhand") {
      if (merc.act === 3) return bRule.type === "shie";
      if (merc.id === "a5-frenzy") return bRule.type === "swor" && (!bRule.twoHanded || bRule.oneOrTwoHanded);
      return false;
    }
    return false;
  }
}

function doesRwTypeMatchBase(rw, bRule) {
  if (!bRule || !rw) return false;
  const t = bRule.type;
  const tokens = String(rw.basesZh || "").split(/\s*\/\s*/).map(s => s.trim()).filter(Boolean);
  if (!tokens.length) return false;
  return tokens.some(rt => {
    if (rt === "头盔") return bRule.slot === "head";
    if (rt === "德鲁伊头盔") return t === "pelt";
    if (rt === "盔甲") return bRule.slot === "torso";
    if (rt === "盾牌") return ["shie", "head", "ashd", "grim"].includes(t);
    if (rt === "圣骑士盾" || rt === "圣骑士盾牌") return t === "ashd";
    if (rt === "死灵盾") return t === "head";
    if (rt === "术士魔典" || rt === "魔典") return t === "grim";
    if (rt === "剑") return t === "swor";
    if (rt === "斧" || rt === "斧头") return t === "axe";
    if (rt === "锤" || rt === "锤子") return t === "hamm" || t === "mace";
    if (rt === "钉头锤" || rt === "钉锤") return t === "mace";
    if (rt === "棍棒" || rt === "木棒") return t === "club";
    if (rt === "权杖") return t === "scep";
    if (rt === "双手法杖" || rt === "法杖" || rt === "双手杖") return t === "staf";
    if (rt === "死灵法杖" || rt === "手杖" || rt === "魔杖") return t === "wand";
    if (rt === "长柄" || rt === "长柄武器") return t === "pole";
    if (rt === "矛" || rt === "长矛") return t === "spea" || t === "aspe";
    if (rt === "弓弩" || rt === "远程武器" || rt === "弓") return ["bow", "abow", "xbow"].includes(t);
    if (rt === "匕首") return t === "knif";
    if (rt === "爪" || rt === "拳剑" || rt === "刺客爪") return t === "h2h" || t === "h2h2";
    if (rt === "近战武器") return bRule.slot === "weapon" && !["bow", "abow", "xbow", "orb", "wand"].includes(t);
    if (rt === "武器") return bRule.slot === "weapon";
    return false;
  });
}

function getRunewordStatLines(rw, bRule) {
  if (!rw) return [];
  if (Array.isArray(rw.stats)) return rw.stats.slice();
  if (Array.isArray(rw.statGroups)) {
    const slot = bRule ? bRule.slot : "weapon";
    const out = [];
    for (const g of rw.statGroups) {
      const lbl = String(g.label || "");
      const items = Array.isArray(g.items) ? g.items : [];
      if (lbl.includes("通用") || lbl.includes("3.4 赛季")) {
        out.push(...items);
      } else if (slot === "weapon" && (lbl.includes("武器") || lbl.includes("剑"))) {
        out.push(...items);
      } else if (slot === "offhand" && lbl.includes("盾牌")) {
        out.push(...items);
      } else if (slot === "torso" && lbl.includes("盔甲")) {
        out.push(...items);
      } else if (slot === "head" && lbl.includes("头盔")) {
        out.push(...items);
      }
    }
    return out;
  }
  if (typeof rw.stats === "string") return rw.stats.split(/\s*(?:·|\||\n)\s*/).filter(Boolean);
  return [];
}

function expandCompositeStatLines(statsText) {
  const rawParts = Array.isArray(statsText)
    ? statsText.flatMap(x => String(x || "").split(/\s*(?:·|\||\n)\s*/))
    : String(statsText || "").split(/\s*(?:·|\||\n)\s*/);
  const out = [];
  for (const raw of rawParts) {
    const line = String(raw || "").trim();
    if (!line) continue;
    // 1) Split independent stats joined by " / " (e.g. "+10–15 力量 / +10–15 敏捷", "+2–6 战斗指挥 / +1–6 战斗体制 / +1–4 战嚎")
    const normSlash = line.replace(/）\//g, "） / ");
    const subParts = normSlash.split(/\s+\/\s+(?=[+-]?\d|需求|伤害)/).map(x => x.trim()).filter(Boolean);
    for (const p of subParts) {
      let m;
      // 2) Expand shorthand multi-element / multi-stat roll lines into independently adjustable lines
      if ((m = p.match(/^冰\/电\/火抗性\s*(.+)$/))) {
        out.push("冰冷抗性 " + m[1], "闪电抗性 " + m[1], "火焰抗性 " + m[1]);
      } else if ((m = p.match(/^([+-]?\d+(?:[–-]\d+)?%)\s*火\/电抗$/))) {
        out.push("火焰抗性 " + m[1], "闪电抗性 " + m[1]);
      } else if ((m = p.match(/^([+-]?\d+(?:[–-]\d+)?%)\s*冰\/火\/电伤$/))) {
        out.push(m[1] + " 冰冷技能伤害", m[1] + " 火焰技能伤害", m[1] + " 闪电技能伤害");
      } else if ((m = p.match(/^([+-]?\d+(?:[–-]\d+)?%)\s*电\/火伤$/))) {
        out.push(m[1] + " 闪电技能伤害", m[1] + " 火焰技能伤害");
      } else if ((m = p.match(/^([+-]?\d+(?:[–-]\d+)?%)\s*冰冷\s*\/\s*闪电\s*\/\s*火焰技能伤害$/))) {
        out.push(m[1] + " 冰冷技能伤害", m[1] + " 闪电技能伤害", m[1] + " 火焰技能伤害");
      } else if ((m = p.match(/^伤害\/魔伤减少\s*(.+)$/))) {
        out.push("物理伤害减少 " + m[1] + " (PDR)", "魔法伤害减少 " + m[1] + " (MDR)");
      } else if ((m = p.match(/^(\d+(?:[–-]\d+)?)\s*EK\/LK$/i))) {
        out.push("+" + m[1] + " 每杀一个敌人恢复法力 (MAEK)", "+" + m[1] + " 每杀一个敌人恢复生命 (LAEK)");
      } else if ((m = p.match(/^(\+\d+(?:[–-]\d+)?)\s*击杀生命\/法力$/))) {
        out.push(m[1] + " 每杀一个敌人恢复生命 (LAEK)", m[1] + " 每杀一个敌人恢复法力 (MAEK)");
      } else if ((m = p.match(/^(\+\d+(?:[–-]\d+)?)\s*召唤\/毒素与白骨\/诅咒技能$/))) {
        out.push(m[1] + " 召唤技能", m[1] + " 毒素与白骨技能", m[1] + " 诅咒技能");
      } else if ((m = p.match(/^(\+\d+(?:[–-]\d+)?)\s*冰\/火\/电支配(?:（.*?）)?$/))) {
        out.push(m[1] + " 冰冷支配", m[1] + " 火焰支配", m[1] + " 闪电支配");
      } else if ((m = p.match(/^(\+\d+(?:[–-]\d+)?)\s*火焰波\s*\/\s*火焰之环$/))) {
        out.push(m[1] + " 火焰波", m[1] + " 火焰之环");
      } else if ((m = p.match(/^(\+\d+(?:[–-]\d+)?)\s*血沸\/吞噬\/恶魔精通$/))) {
        out.push(m[1] + " 血沸", m[1] + " 吞噬", m[1] + " 恶魔精通");
      } else {
        out.push(p);
      }
    }
  }
  return out;
}

function extractVariableRanges(statsText) {
  const lines = expandCompositeStatLines(statsText);
  const vars = [];
  lines.forEach((line, idx) => {
    if (/^[+-]?\d+\s*[–-]\s*\d+\s*(?:火焰|冰冷|闪电|毒素|魔法)?伤害/i.test(line)) return;
    if (/附加\s*\d+\s*[–-]\s*\d+/i.test(line)) return;
    const m = line.match(/([+-]?)(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)(%?)/);
    if (m) {
      const a = Number(m[2]);
      const b = Number(m[3]);
      if (b > a) {
        const hasDec = m[2].includes(".") || m[3].includes(".");
        const invertBest = /自身\s*-|自身物理承受伤害/.test(line);
        vars.push({
          key: "L" + idx,
          lineIdx: idx,
          rawLine: line,
          prefix: m[1] || "",
          min: a,
          max: b,
          best: invertBest ? a : b,
          invertBest,
          step: hasDec ? 0.125 : 1,
          unit: m[4] || ""
        });
      }
    }
  });
  return { lines, vars };
}

function computePerLevelDisplayValue(line, actorLvl) {
  const lvl = Math.max(1, Math.min(99, Math.floor(Number(actorLvl) || 90)));
  const str = String(line || "");
  let m;
  if ((m = str.match(/([+-]?)\(\s*(\d+(?:\.\d+)?)(%?)\s*\*\s*等级\s*\)(%?)/))) {
    const rate = Number(m[2]);
    const pct = m[3] || m[4] || "";
    if (Number.isFinite(rate) && rate > 0) {
      const sign = m[1] === "-" ? "-" : (m[1] === "+" || !/攻击者受到/.test(str) ? "+" : "");
      return sign + Math.floor(rate * lvl) + pct;
    }
  }
  if ((m = str.match(/([+-]?)(\d+(?:\.\d+)?)(%?)\s*\/\s*级/))) {
    const rate = Number(m[2]);
    const pct = m[3] || "";
    if (Number.isFinite(rate) && rate > 0) {
      return (m[1] || "+") + Math.floor(rate * lvl) + pct;
    }
  }
  if ((m = str.match(/(\d+(?:\.\d+)?)(%)\s*（随等级提升）/))) {
    const rate = Number(m[1]);
    if (Number.isFinite(rate) && rate > 0) {
      return "+" + Math.floor(rate * lvl) + m[2];
    }
  }
  return "";
}

function renderStatLineWithLvlCalcHtml(line, actorLvl) {
  const calc = computePerLevelDisplayValue(line, actorLvl);
  if (!calc) return escapeHtml(line);
  const lvl = Math.max(1, Math.min(99, Math.floor(Number(actorLvl) || 90)));
  return '<span class="lvl-calc-badge" title="按当前 Lv.' + lvl + ' 实时折算">' + escapeHtml(calc) + '</span>' + escapeHtml(line);
}

function formatItemLinesWithRolls(statsText, rollsObj) {
  const { lines, vars } = extractVariableRanges(statsText);
  const varByIdx = new Map(vars.map(v => [v.lineIdx, v]));
  return lines.map((line, idx) => {
    const v = varByIdx.get(idx);
    if (!v) return line;
    const curVal = (rollsObj && rollsObj[v.key] !== undefined) ? Number(rollsObj[v.key]) : v.best;
    return line.replace(/([+-]?)\d+(?:\.\d+)?\s*[–-]\s*\d+(?:\.\d+)?/, "$1" + curVal) + " [" + v.min + "–" + v.max + "]";
  });
}

function getBaseRuleIcon(bRule) {
  if (!bRule) return "/images/ui/gemsocket.webp";
  if (pdData && pdData.baseIcons && pdData.baseIcons[bRule.code]) {
    return pdData.baseIcons[bRule.code];
  }
  const baseMatch = (itData && itData.baseItems || []).find(bi => bi.nameEn.toLowerCase() === bRule.nameEn.toLowerCase());
  if (baseMatch && baseMatch.icon) return baseMatch.icon;
  const typeFallback = {
    swor: "/images/items/weapon/sword/crystal_sword.webp", mace: "/images/items/weapon/mace/flail.webp",
    scep: "/images/items/weapon/scepter/war_scepter.webp", axe: "/images/items/weapon/axe/war_axe.webp",
    taxe: "/images/items/weapon/axe/throwing_axe.webp", club: "/images/items/weapon/club/club.webp",
    hamm: "/images/items/weapon/hammer/war_hammer.webp", knif: "/images/items/weapon/knife/dagger.webp",
    tkni: "/images/items/weapon/knife/throwing_knife.webp", jave: "/images/items/weapon/javelin/javelin.webp",
    ajav: "/images/items/weapon/javelin/maiden_javelin.webp", spea: "/images/items/weapon/spear/spear.webp",
    aspe: "/images/items/weapon/spear/maiden_spear.webp", pole: "/images/items/weapon/polearm/scythe.webp",
    staf: "/images/items/weapon/staff/war_staff.webp", wand: "/images/items/weapon/wand/bone_wand.webp",
    orb: "/images/items/weapon/orb/eagle_orb.webp", bow: "/images/items/weapon/bow/long_bow.webp",
    abow: "/images/items/weapon/bow/stag_bow.webp", xbow: "/images/items/weapon/bow/crossbow.webp",
    h2h: "/images/items/weapon/h2h/claws.webp", h2h2: "/images/items/weapon/h2h/claws.webp",
    ashd: "/images/items/armor/shield/targe.webp", shie: "/images/items/armor/shield/kite_shield.webp",
    grim: "/images/items/armor/grimoires/grimoire.webp", head: "/images/items/armor/voodoo_head/preserved_head.webp",
    tors: "/images/items/armor/armor/light_plate.webp", helm: "/images/items/armor/helmet/helm.webp",
    phlm: "/images/items/armor/helmet/avenger_guard.webp", pelt: "/images/items/armor/pelt/wolf_head.webp",
    circ: "/images/items/armor/circlet/diadem.webp", glov: "/images/items/armor/glove/heavy_gloves.webp",
    boot: "/images/items/armor/boot/chain_boots.webp", belt: "/images/items/armor/belt/light_belt.webp"
  };
  return typeFallback[bRule.type] || "/images/items/weapon/sword/crystal_sword.webp";
}

function computeArmorPieceDefense(bRule, eq, itemOwnDefEd, totalDefEd, flatDef) {
  if (!bRule || !(bRule.maxDef > 0)) return 0;
  const isRwOrBase = Boolean(eq && (eq.cat === "rw" || eq.cat === "base"));
  const supDef = isRwOrBase ? Math.min(15, Math.max(0, Math.floor(Number(eq.supDef || 0)))) : 0;
  const hasSpawnDefEd = isRwOrBase ? (supDef > 0) : (itemOwnDefEd > 0);
  const rawBase = bRule.maxDef + (hasSpawnDefEd ? 1 : 0);
  const ethBase = (eq && eq.eth) ? Math.floor((rawBase * 3) / 2) : rawBase;
  return Math.floor((ethBase * (100 + totalDefEd)) / 100) + flatDef;
}

function isCustomJewelSocket(entry) {
  return Boolean(entry && typeof entry === "object" && (entry.customJewel === "magic" || entry.customJewel === "rare"));
}

function getJewelAffixDef(kind, id) {
  const ja = pdData && pdData.jewelAffixes;
  if (!ja) return null;
  const arr = kind === "pre" ? (ja.prefixes || []) : (ja.suffixes || []);
  return arr.find(x => x.id === id) || null;
}

function clampJewelAffixVal(def, val, isRare) {
  if (!def) return 0;
  const hi = isRare ? (def.rareMax || def.max) : def.max;
  const n = Number(val);
  if (!Number.isFinite(n)) return hi;
  return Math.min(hi, Math.max(def.min, Math.floor(n)));
}

function resolveCustomJewelInfo(entry) {
  if (!isCustomJewelSocket(entry)) return null;
  const isRare = entry.customJewel === "rare";
  const parts = [];
  (Array.isArray(entry.pre) ? entry.pre : []).slice(0, isRare ? 3 : 1).forEach(item => {
    if (!item || !item.id) return;
    const def = getJewelAffixDef("pre", item.id);
    if (!def) return;
    parts.push(def.fmt.replace("{v}", String(clampJewelAffixVal(def, item.val, isRare))));
  });
  (Array.isArray(entry.suf) ? entry.suf : []).slice(0, isRare ? 3 : 1).forEach(item => {
    if (!item || !item.id) return;
    const def = getJewelAffixDef("suf", item.id);
    if (!def || (isRare && def.magicOnly)) return;
    parts.push(def.fmt.replace("{v}", String(clampJewelAffixVal(def, item.val, isRare))));
  });
  return {
    nameZh: isRare ? "自定义黄珠宝" : "自定义蓝珠宝",
    icon: isRare ? "/images/items/misc/gem/perfect_diamond5.webp" : "/images/items/misc/gem/perfect_diamond1.webp",
    bonusText: parts.join(" · ")
  };
}

function getSocketableBonusText(sockEntry, bRule) {
  if (isCustomJewelSocket(sockEntry)) {
    const jInfo = resolveCustomJewelInfo(sockEntry);
    return jInfo ? jInfo.bonusText : "";
  }
  if (!pdData || !Array.isArray(pdData.socketables)) return "";
  const s = pdData.socketables.find(x => x.id === sockEntry);
  if (!s) return "";
  const applyMode = bRule ? bRule.gemApplyType : 0;
  if (applyMode === 2) return s.shield;
  if (applyMode === 1) return s.helm;
  return s.weapon;
}

function isEquippedItemLegal(target, slotId, eq) {
  if (!eq || !pdData) return true;
  if (["amulet", "ring1", "ring2"].includes(slotId)) return true;
  const bRule = getEquippedBaseRule(eq);
  if (!bRule) return false;
  return isBaseRuleLegalForTargetSlot(target, slotId, bRule);
}

let pdLastLevitateReq = { lvl: 0, pct: 0 };
let pdLastHoverCtx = { charStr: 0, charDex: 0, mercStr: 0, mercDex: 0, charSetCounts: new Map(), mercSetCounts: new Map() };

function resolveEquippedItemInfo(eq, opts) {
  if (!eq || !itData || !pdData) return null;
  const bRule = getEquippedBaseRule(eq);
  const clsObj = getActiveClassObj();
  let titleZh = "", titleEn = "", icon = "", rawStats = "", maxSocks = 0, qualityClass = "q-unique", setObj = null, pieceObj = null;

  if (eq.cat === "unique") {
    const u = (itData.uniqueItems || []).find(x => x.nameEn === eq.id);
    if (!u) return null;
    titleZh = pickLangTitle(u);
    titleEn = u.nameEn;
    icon = u.icon || "";
    rawStats = u.stats || "";
    const m = pdData.uniqueMeta && pdData.uniqueMeta[u.nameEn];
    maxSocks = m ? m.maxSockets : 0;
    qualityClass = "q-unique";
  } else if (eq.cat === "set") {
    let foundPiece = null;
    for (const s of (itData.setItems || [])) {
      const p = ((s.detail && s.detail.pieces) || []).find(x => x.nameEn === eq.id);
      if (p) { foundPiece = p; setObj = s; break; }
    }
    if (!foundPiece) return null;
    pieceObj = foundPiece;
    titleZh = pickLangTitle(foundPiece);
    titleEn = foundPiece.nameEn;
    icon = foundPiece.icon || (setObj && setObj.icon) || "";
    rawStats = (foundPiece.stats || []).join(" · ");
    const m = pdData.setMeta && pdData.setMeta[foundPiece.nameEn];
    maxSocks = m ? m.maxSockets : 0;
    qualityClass = "q-set";
  } else if (eq.cat === "rw") {
    const rw = (rwList || []).find(x => x.id === eq.id);
    if (!rw) return null;
    titleZh = pickLangTitle(rw) + (bRule ? (" [" + bRule.nameZh + "]") : "");
    titleEn = rw.name;
    icon = getBaseRuleIcon(bRule);
    rawStats = getRunewordStatLines(rw, bRule).join(" · ");
    maxSocks = 0;
    qualityClass = "q-rw";
  } else if (eq.cat === "craft") {
    const c = getCraftedItemDef(eq.id);
    if (!c) return null;
    titleZh = "[手工] " + c.nameZh.replace(/\s*\([^)]*\)$/, "");
    titleEn = c.nameEn;
    icon = c.icon || "/images/items/misc/amulet/amulet1.webp";
    rawStats = buildCraftedRawStatsText(eq, clsObj);
    maxSocks = (c.maxSockets > 0 && bRule) ? computeMagicRareMaxSockets(eq, bRule) : (c.maxSockets || 0);
    qualityClass = "q-craft";
  } else if (eq.cat === "magic" || eq.cat === "rare") {
    const isMagic = eq.cat === "magic";
    const tag = isMagic ? "[蓝装] " : "[黄装] ";
    if (bRule) {
      titleZh = tag + (eq.eth ? "无形" : "") + bRule.nameZh;
      titleEn = (isMagic ? "Magic " : "Rare ") + bRule.nameEn;
      icon = getBaseRuleIcon(bRule);
    } else if (String(eq.id || "").includes("amulet")) {
      titleZh = tag + "护身符(项链)";
      titleEn = isMagic ? "Magic Amulet" : "Rare Amulet";
      icon = "/images/items/misc/amulet/amulet2.webp";
    } else if (String(eq.id || "").includes("ring")) {
      titleZh = tag + "戒指";
      titleEn = isMagic ? "Magic Ring" : "Rare Ring";
      icon = "/images/items/misc/ring/ring2.webp";
    } else {
      return null;
    }
    rawStats = buildMagicRareStatsText(eq);
    maxSocks = computeMagicRareMaxSockets(eq, bRule);
    qualityClass = isMagic ? "q-magic" : "q-rare";
  } else if (eq.cat === "base") {
    if (!bRule) return null;
    titleZh = (eq.eth ? "无形" : "") + bRule.nameZh + " (打孔底材)";
    titleEn = bRule.nameEn;
    icon = getBaseRuleIcon(bRule);
    rawStats = "基础底材（可自由镶嵌最多 " + bRule.maxSockets + " 颗符文/宝石/珠宝）";
    maxSocks = bRule.maxSockets || 0;
    qualityClass = "q-magic";
  }

  const rolledLines = rawStats ? formatItemLinesWithRolls(rawStats, eq.rolls) : [];
  if (bRule && (eq.cat === "rw" || eq.cat === "base")) {
    const supEd = bRule.slot === "weapon" ? Math.min(15, Math.max(0, Math.floor(Number(eq.supEd || 0)))) : 0;
    const supAr = bRule.slot === "weapon" ? Math.min(3, Math.max(0, Math.floor(Number(eq.supAr || 0)))) : 0;
    const supDef = (bRule.slot !== "weapon" && bRule.maxDef > 0) ? Math.min(15, Math.max(0, Math.floor(Number(eq.supDef || 0)))) : 0;
    if (supEd > 0) rolledLines.push("+" + supEd + "% 强化伤害（超强底材）");
    if (supAr > 0) rolledLines.push("+" + supAr + " 攻击准确率（超强底材）");
    if (supDef > 0) rolledLines.push("+" + supDef + "% 强化防御（超强底材）");
  }
  if (bRule && bRule.type === "ashd" && ["rw", "base", "magic", "rare", "craft"].includes(eq.cat)) {
    const palModType = eq.palModType === "dmg" ? "dmg" : "res";
    if (palModType === "dmg") {
      const palEd = Math.min(65, Math.max(0, Math.floor(Number(eq.palEd || 0))));
      const palAr = Math.min(121, Math.max(0, Math.floor(Number(eq.palAr || 0))));
      if (palEd > 0) rolledLines.push("+" + palEd + "% 强化伤害（圣骑士盾底材）");
      if (palAr > 0) rolledLines.push("+" + palAr + " 攻击准确率（圣骑士盾底材）");
    } else {
      const palRes = Math.min(45, Math.max(0, Math.floor(Number(eq.palRes || 0))));
      if (palRes > 0) rolledLines.push("+" + palRes + "% 所有抗性（圣骑士盾底材）");
    }
  }
  if (bRule && ["rw", "base", "magic", "rare", "craft"].includes(eq.cat)) {
    const autoSpec = getBaseAutomodSpec(bRule);
    if (autoSpec && autoSpec.mode === "tab") {
      const lv = Math.min(autoSpec.max || 3, Math.max(0, Math.floor(Number(eq.autoTabLvl || 0))));
      if (lv > 0) rolledLines.push("+" + lv + " " + autoSpec.tabStatName + "（底材自带）");
    } else if (autoSpec && autoSpec.mode === "staffmod" && Array.isArray(eq.baseStaffmods)) {
      const clsForMod = (skClasses || []).find(c => c.id === autoSpec.classId);
      eq.baseStaffmods.slice(0, 3).forEach(sm => {
        if (!sm || !sm.key) return;
        const lv = Math.min(3, Math.max(0, Math.floor(Number(sm.lvl || 0))));
        if (lv <= 0) return;
        const skObj = clsForMod && Array.isArray(clsForMod.skills) ? clsForMod.skills.find(s => s.key === sm.key) : null;
        if (skObj) rolledLines.push("+" + lv + " " + skObj.nameZh + "（底材自带）");
      });
    }
  }
  const sockLines = [];
  let reqReducePct = 0;
  if (maxSocks > 0 && Array.isArray(eq.sockets)) {
    eq.sockets.slice(0, maxSocks).forEach((sid, idx) => {
      if (!sid) return;
      if (isCustomJewelSocket(sid)) {
        const jInfo = resolveCustomJewelInfo(sid);
        if (jInfo && jInfo.bonusText) {
          sockLines.push("【孔 " + (idx + 1) + " · " + jInfo.nameZh + "】" + jInfo.bonusText);
          const rm = jInfo.bonusText.match(/需求\s*-(\d+)%/);
          if (rm) reqReducePct += Number(rm[1]);
        }
        return;
      }
      const sObj = (pdData.socketables || []).find(x => x.id === sid);
      const bTxt = getSocketableBonusText(sid, bRule);
      if (sObj && bTxt) {
        sockLines.push("【孔 " + (idx + 1) + " · " + sObj.nameZh + "】" + bTxt);
        const rm = bTxt.match(/需求\s*-(\d+)%/);
        if (rm) reqReducePct += Number(rm[1]);
      }
    });
  }
  rolledLines.forEach(l => {
    const rm = l.match(/需求\s*-(\d+)%/);
    if (rm) reqReducePct += Number(rm[1]);
  });

  const extraReqReducePct = (opts && Number(opts.extraReqReducePct)) || 0;
  const extraReqReason = (opts && opts.extraReqReason) || "";
  const totalReqReducePct = reqReducePct + extraReqReducePct;
  const reqMult = Math.max(0, (100 - totalReqReducePct) / 100);
  const baseReqStr = bRule ? Math.max(0, bRule.reqStr - (eq.eth ? 10 : 0)) : 0;
  const baseReqDex = bRule ? Math.max(0, bRule.reqDex - (eq.eth ? 10 : 0)) : 0;
  const reqStr = bRule ? Math.max(0, Math.floor(baseReqStr * reqMult)) : 0;
  const reqDex = bRule ? Math.max(0, Math.floor(baseReqDex * reqMult)) : 0;
  const wsm = bRule ? bRule.wsm : 0;

  // Compute individual item weapon damage / armor defense / shield block for preview & hover tooltip (includes local +Min/+Max/+X-Y/+Max per level!)
  let itemWeapMin = 0, itemWeapMax = 0, itemDef = 0, itemDisplayBlock = 0;
  if (bRule) {
    const tmpAcc = { weapEd: 0, flatMin: 0, flatMax: 0, defEd: 0, flatDef: 0, blockBonus: 0 };
    const isWeapSlot = bRule.slot === "weapon";
    const actorLvl = (opts && Number(opts.actorLvl)) || Math.min(99, Math.max(1, Number(document.getElementById("pd-char-lvl")?.value || 90)));
    const parseLocalMod = (rawLine, stripSockPrefix) => {
      let txt = String(rawLine || "");
      if (stripSockPrefix) txt = txt.replace(/^【[^】]+】/, "");
      txt = txt.replace(/\[[^\]]+\]/g, "").replace(/([+-]?\d+(?:\.\d+)?)\s*\/\s*级/g, "+($1 * 等级)").replace(/([+-]?\d+)%\s*FBR\s*\/\s*格挡/gi, "$1% FBR / $1% 提高格挡几率").trim();
      txt.split(/\s*[\/·]\s*/).forEach(part => {
        const clean = part.trim();
        if (!clean) return;
        let rm;
        if ((rm = clean.match(/\+?\(\s*(\d+(?:\.\d+)?)(%?)\s*\*\s*等级\s*\)(%?)\s*(.*)/))) {
          const val = Math.floor(Number(rm[1]) * actorLvl);
          const hasPct = Boolean(rm[2] || rm[3]);
          const tail = rm[4] || "";
          if (isWeapSlot && hasPct && !tail.includes("对恶魔") && !tail.includes("对不死") && /强化伤害|增强伤害|ED/i.test(tail)) tmpAcc.weapEd += val;
          if (isWeapSlot && tail.includes("最大伤害")) tmpAcc.flatMax += val;
          if (!isWeapSlot && tail.includes("防御")) tmpAcc.flatDef += val;
          return;
        }
        if (isWeapSlot) {
          if (!clean.includes("对恶魔") && !clean.includes("对不死") && (rm = clean.match(/\+(\d+)%\s*(?:强化伤害|增强伤害|ED)(?!%)/i))) {
            tmpAcc.weapEd += Number(rm[1]);
          }
          if (!/火焰|冰冷|闪电|毒素|魔法|对恶魔|对不死|技能/.test(clean) && (rm = clean.match(/\+(\d+)\s*[–-]\s*(\d+)\s*伤害(?!加深|减少|转化)/))) {
            tmpAcc.flatMin += Number(rm[1]);
            tmpAcc.flatMax += Number(rm[2]);
          }
          if ((rm = clean.match(/\+(\d+)\s*最小伤害/))) tmpAcc.flatMin += Number(rm[1]);
          if ((rm = clean.match(/\+(\d+)\s*最大伤害/))) tmpAcc.flatMax += Number(rm[1]);
        } else {
          if ((rm = clean.match(/\+(\d+)%\s*强化防御/))) tmpAcc.defEd += Number(rm[1]);
          else if (!clean.includes("远程") && !clean.includes("目标") && (rm = clean.match(/\+(\d+)\s*防御(?!值?对)/))) tmpAcc.flatDef += Number(rm[1]);
          if ((rm = clean.match(/([+-]?\d+)%\s*(?:提高格挡几率|格挡几率|格挡率|格挡(?!速))/))) tmpAcc.blockBonus += Number(rm[1]);
        }
      });
    };
    rolledLines.forEach(l => parseLocalMod(l, false));
    const itemOwnDefEd = tmpAcc.defEd;
    sockLines.forEach(l => parseLocalMod(l, true));
    const ethMult = eq.eth ? 1.5 : 1;
    if (isWeapSlot) {
      const use2h = bRule.twoHanded && !(skActiveClassId === "bar" && bRule.oneOrTwoHanded && pdCharLoadout && pdCharLoadout.offhand);
      const rawMin = Math.floor((use2h ? (bRule.twoHandMin || bRule.minDmg || 0) : (bRule.minDmg || bRule.twoHandMin || 0)) * ethMult);
      const rawMax = Math.floor((use2h ? (bRule.twoHandMax || bRule.maxDmg || 0) : (bRule.maxDmg || bRule.twoHandMax || 0)) * ethMult);
      itemWeapMin = Math.floor((rawMin * (100 + tmpAcc.weapEd)) / 100) + tmpAcc.flatMin;
      itemWeapMax = Math.floor((rawMax * (100 + tmpAcc.weapEd)) / 100) + tmpAcc.flatMax;
      if (itemWeapMin >= itemWeapMax && itemWeapMax > 0) itemWeapMax = itemWeapMin + 1;
    } else if (bRule.maxDef > 0) {
      itemDef = computeArmorPieceDefense(bRule, eq, itemOwnDefEd, tmpAcc.defEd, tmpAcc.flatDef);
    }
    if (bRule.block > 0) {
      const cBaseForBlock = pdData && pdData.charBaseStats && pdData.charBaseStats[skActiveClassId];
      const clsBlockBonus = cBaseForBlock ? cBaseForBlock.blockFactor : 25;
      itemDisplayBlock = bRule.block + clsBlockBonus + tmpAcc.blockBonus;
    }
  }

  return {
    eq, bRule, titleZh, titleEn, icon, rawStats, rolledLines, sockLines, maxSocks, qualityClass,
    reqStr, reqDex, baseReqStr, baseReqDex, reqReducePct, extraReqReducePct, extraReqReason,
    itemWeapMin, itemWeapMax, itemDef, itemDisplayBlock, wsm, setObj, pieceObj
  };
}

function describeGearAura(name, lvl) {
  const n = String(name || "");
  const l = Math.max(1, Number(lvl) || 1);
  if (n.includes("信念")) {
    const res = Math.min(150, 25 + l * 5);
    const def = Math.min(95, 45 + l * 3);
    return { name: "信念", lvl: l, desc: "-" + res + "% 敌火/冰/电抗 · -" + def + "% 敌防", convRes: res, convDef: def };
  }
  if (n.includes("冥想") || n.includes("冥思")) {
    const regen = 275 + l * 25;
    return { name: "冥想", lvl: l, desc: "+" + regen + "% 法力恢复 (与祈祷协同回血)" };
  }
  if (n.includes("狂热")) {
    const eiasTable = [0, 14, 18, 20, 23, 25, 26, 27, 28, 29, 30, 31, 31, 32, 33, 33, 34, 34, 35, 35, 35];
    const eias = eiasTable[Math.min(20, l)] || 35;
    const partyEd = Math.floor((50 + (l - 1) * 17) / 2);
    const arPct = 40 + (l - 1) * 5;
    return { name: "狂热", lvl: l, desc: "团队 +" + eias + "% EIAS · +" + partyEd + "% 增伤 · +" + arPct + "% AR", eias, edPct: partyEd, arPct };
  }
  if (n.includes("专注")) {
    const ed = 60 + (l - 1) * 15;
    return { name: "专注", lvl: l, desc: "团队 +" + ed + "% 物理/天锤增伤", edPct: ed, hammerEdPct: Math.floor(ed / 2) };
  }
  if (n.includes("净化")) {
    return { name: "净化", lvl: l, desc: "大幅缩短诅咒/中毒时间 (与祈祷协同回血)" };
  }
  if (n.includes("反抗")) {
    const defPct = 60 + l * 10;
    return { name: "反抗", lvl: l, desc: "团队 +" + defPct + "% 防御", defPct };
  }
  if (n.includes("力量")) {
    const ed = 30 + l * 10;
    return { name: "力量", lvl: l, desc: "团队 +" + ed + "% 物理增伤", edPct: ed };
  }
  if (n.includes("庇护所")) {
    return { name: "庇护所", lvl: l, desc: "击退不死生物并无视不死物理免疫" };
  }
  if (n.includes("神圣火焰") || n.includes("神圣冲击") || n.includes("神圣冰冻")) {
    return { name: n, lvl: l, desc: "范围元素脉冲伤害与攻击附伤" };
  }
  if (n.includes("荆棘")) {
    return { name: "荆棘", lvl: l, desc: "反弹怪物近战物理伤害" };
  }
  if (n.includes("活力")) {
    return { name: "活力", lvl: l, desc: "全队大幅提升跑速 FRW 与耐力恢复" };
  }
  return { name: n, lvl: l, desc: "装备赋予光环，角色与佣兵双向共享" };
}

function accumulateStatsFromLine(line, tot, actorLvl, itemSeen, ctx) {
  let cleanRaw = String(line).replace(/^【[^】]+】/, "").replace(/\[\d+(?:\.\d+)?[–-]\d+(?:\.\d+)?\]/g, "");
  // Expand multi-element resistance shorthands like "冰/电/火抗性 +25%" before splitting on "/"
  cleanRaw = cleanRaw.replace(/((?:火|冰|电|毒)(?:\s*\/\s*(?:火|冰|电|毒))+)抗性?\s*([+-]?\d+)%?/g, (_, els, v) => {
    const map = { "火": "火焰抗性", "冰": "冰冷抗性", "电": "闪电抗性", "毒": "毒素抗性" };
    return els.split(/\s*\/\s*/).map(e => (map[e] || e) + " " + v + "%").join(" / ");
  });
  cleanRaw = cleanRaw.replace(/([+-]?\d+)%\s*((?:火|冰|电|毒)(?:\s*\/\s*(?:火|冰|电|毒))+)抗性?/g, (_, v, els) => {
    const map = { "火": "火焰抗性", "冰": "冰冷抗性", "电": "闪电抗性", "毒": "毒素抗性" };
    return els.split(/\s*\/\s*/).map(e => (map[e] || e) + " " + v + "%").join(" / ");
  });
  // Expand multi-stat shorthands like "+30% FBR/格挡", "+20 力/体", "+20 力/敏", "+20 力/精" before splitting on "/"
  cleanRaw = cleanRaw
    .replace(/([+-]?\d+)%\s*FBR\s*\/\s*格挡/gi, "$1% FBR / $1% 提高格挡几率")
    .replace(/([+-]?\d+)\s*力\s*\/\s*体/g, "$1 力量 / $1 体力")
    .replace(/([+-]?\d+)\s*力\s*\/\s*敏/g, "$1 力量 / $1 敏捷")
    .replace(/([+-]?\d+)\s*力\s*\/\s*精/g, "$1 力量 / $1 精力");
  // Normalize short per-level notation "+1.5/级" before splitting on "/"
  cleanRaw = cleanRaw.replace(/\+?(\d+(?:\.\d+)?)\s*\/\s*级/g, "+($1 * 等级)");
  const subParts = cleanRaw.split(/\s*[\/·]\s*/);
  const isWeapon = Boolean(ctx && ctx.isWeapon);
  const itemAcc = ctx && ctx.itemAcc;
  for (const part of subParts) {
    const clean = part.trim();
    if (!clean) continue;
    let m;
    if ((m = clean.match(/\+?\(\s*(\d+(?:\.\d+)?)(%?)\s*\*\s*等级\s*\)(%?)\s*(.*)/))) {
      const val = Math.floor(Number(m[1]) * (actorLvl || 90));
      const hasPct = Boolean(m[2] || m[3]);
      const tail = m[4] || "";
      if (tail.includes("力量")) tot.str += val;
      if (tail.includes("敏捷")) tot.dex += val;
      if (tail.includes("活力") || tail.includes("体力")) tot.vit += val;
      if (tail.includes("魔法物品") || tail.includes("魔法装备") || tail.includes("MF")) tot.mf += val;
      if (tail.includes("致命") || tail.includes("双倍")) tot.ds += val;
      if (tail.includes("生命")) {
        if (tot.nonBoHp !== undefined) tot.nonBoHp += val;
        else tot.flatHp += val;
      }
      if (tail.includes("法力")) {
        if (tot.nonBoMana !== undefined) tot.nonBoMana += val;
        else tot.flatMana += val;
      }
      if (tail.includes("防御")) { tot.flatDef += val; if (itemAcc) itemAcc.flatDef += val; }
      if (tail.includes("命中") || tail.includes("准确")) {
        if (hasPct) tot.arPct += val;
        else tot.flatAr += val;
      }
      if (tail.includes("金币")) tot.eg += val;
      if (tail.includes("最大伤害")) tot.flatMaxDmg += val;
      if (hasPct && !tail.includes("对恶魔") && !tail.includes("对不死") && /强化伤害|增强伤害|ED/i.test(tail)) {
        if (isWeapon && itemAcc) itemAcc.weapEd += val;
        else if (!isWeapon) tot.offWeaponEdPct += val;
      }
      continue;
    }
    if (/\+生命\(按等级\)/.test(clean)) {
      const val = Math.floor(1 * (actorLvl || 90));
      if (tot.nonBoHp !== undefined) tot.nonBoHp += val;
      else tot.flatHp += val;
      continue;
    }
    const cid = (ctx && ctx.classId) || skActiveClassId;
    const isCharActor = ctx ? ctx.isChar !== false : true;

    // Oskills (non-class-restricted granted skills from Sets, Runewords, Uniques — e.g. Horazon +30 Enchant, Trang-Oul Fire Ball/Wall/Meteor, Chaos WW, Passion Zeal/Berserk, Enigma Teleport)
    if (isCharActor && tot.oskills && !clean.includes("限定") && !clean.includes("施放") && !clean.includes("几率")) {
      const oskillDefs = [
        { key: "Enchant", re: /\+(\d+)\s*(?:火焰强化|附魔火焰|附魔)/, charge: false },
        { key: "Enchant", re: /(?:等级\s*(\d+)|(\d+)\s*级)\s*(?:火焰强化|强化|附魔)/, charge: true },
        { key: "Fire Ball", re: /\+(\d+)\s*火球/, charge: false },
        { key: "Fire Wall", re: /\+(\d+)\s*(?:火墙|火焰之墙)/, charge: false },
        { key: "Meteor", re: /\+(\d+)\s*陨石/, charge: false },
        { key: "Whirlwind", re: /\+(\d+)\s*(?:旋风斩|旋风)/, charge: false },
        { key: "Zeal", re: /\+(\d+)\s*(?:热忱|白热)/, charge: false },
        { key: "Berserk", re: /\+(\d+)\s*(?:狂战士|狂暴)/, charge: false },
        { key: "Vengeance", re: /\+(\d+)\s*复仇/, charge: false },
        { key: "Teleport", re: /\+(\d+)\s*(?:传送术|传送)/, charge: false },
        { key: "Battle Command", re: /\+(\d+)\s*战斗指挥/, charge: false },
        { key: "Battle Orders", re: /\+(\d+)\s*战斗体制/, charge: false },
        { key: "Battle Cry", re: /\+(\d+)\s*战嚎/, charge: false },
        { key: "Werebear", re: /\+(\d+)\s*变熊/, charge: false },
        { key: "Werewolf", re: /\+(\d+)\s*狼人变化/, charge: false },
        { key: "Lycanthropy", re: /\+(\d+)\s*变形术/, charge: false },
        { key: "Feral Rage", re: /\+(\d+)\s*野性狂暴/, charge: false },
        { key: "Valkyrie", re: /\+(\d+)\s*女武神/, charge: false }
      ];
      let matchedOskill = false;
      for (const od of oskillDefs) {
        const om = clean.match(od.re);
        if (om) {
          const lvl = Number(om[1] || om[2] || 0);
          if (lvl > 0) {
            const prev = tot.oskills[od.key];
            if (!prev || (!od.charge && (prev.isCharge || lvl > prev.baseLvl)) || (od.charge && prev.isCharge && lvl > prev.baseLvl)) {
              tot.oskills[od.key] = { key: od.key, baseLvl: lvl, isCharge: od.charge };
            }
            matchedOskill = true;
            break;
          }
        }
      }
      if (matchedOskill) continue;
    }

    if ((m = clean.match(/\+(\d+)\s*(?:所有技能|全部技能|全技能|All Skills)/i))) {
      tot.skills += Number(m[1]);
    } else if (isCharActor && (m = clean.match(/\+(\d+)\s*(?:随机职业技能|本职业全部技能|本职业技能)/))) {
      tot.classSkills += Number(m[1]);
    } else if ((m = clean.match(/\+(\d+)\s*本系技能/))) {
      const p = (ctx && ctx.tabPage) || 1;
      tot.tabSkills[p] = (tot.tabSkills[p] || 0) + Number(m[1]);
    } else if (isCharActor && (m = clean.match(/\+(\d+)\s*(?:随机)?(亚马逊|法师|死灵法师|死灵|圣骑士|野蛮人|德鲁伊|刺客|术士)技能/))) {
      const clsMap = { "亚马逊": "ama", "法师": "sor", "死灵法师": "nec", "死灵": "nec", "圣骑士": "pal", "野蛮人": "bar", "德鲁伊": "dru", "刺客": "ass", "术士": "war" };
      if (clsMap[m[2]] === cid) tot.classSkills += Number(m[1]);
    } else if (isCharActor && (m = clean.match(/\+(\d+)\s*(火焰技能|火系技能)/))) {
      const v = Number(m[1]);
      if (cid === "sor") tot.tabSkills[1] = (tot.tabSkills[1] || 0) + v;
      else tot.fireSkills += v;
    } else if (isCharActor && (m = clean.match(/\+(\d+)\s*([^\d%+\s·|]+)/))) {
      const v = Number(m[1]);
      const lbl = clean.slice(clean.indexOf(m[2]));
      // Tree / Tab skill bonuses (all 24 skill trees across 8 classes)
      const tabRules = [
        { c: "war", p: 1, re: /恶魔技能/ },
        { c: "war", p: 2, re: /邪术技能|秘法技能/ },
        { c: "war", p: 3, re: /混沌技能/ },
        { c: "sor", p: 1, re: /火系法术/ },
        { c: "sor", p: 2, re: /雷系法术|闪电技能(?!伤)/ },
        { c: "sor", p: 3, re: /冰系法术|冰冷技能(?!伤)/ },
        { c: "pal", p: 1, re: /战斗技能(?!.*野蛮人)/ },
        { c: "pal", p: 2, re: /攻击灵气/ },
        { c: "pal", p: 3, re: /防御灵气/ },
        { c: "ama", p: 1, re: /弓与弩|弓和十字弓|弓弩技能/ },
        { c: "ama", p: 2, re: /被动与魔法|被动和魔法/ },
        { c: "ama", p: 3, re: /标枪与长矛|标枪和长矛|^标枪$/ },
        { c: "nec", p: 1, re: /诅咒技能|^诅咒$/ },
        { c: "nec", p: 2, re: /毒素与白骨|毒素和白骨/ },
        { c: "nec", p: 3, re: /召唤技能(?!.*德鲁伊)|^召唤$/ },
        { c: "bar", p: 1, re: /战斗技能(?!.*圣骑士)/ },
        { c: "bar", p: 2, re: /战斗专精|精通类技能/ },
        { c: "bar", p: 3, re: /呐喊技能|战嚎技能|战吼技能/ },
        { c: "dru", p: 1, re: /召唤技能(?!.*死灵)|^召唤$/ },
        { c: "dru", p: 2, re: /变形技能|^变形$/ },
        { c: "dru", p: 3, re: /元素技能|^元素$/ },
        { c: "ass", p: 1, re: /陷阱技能|^陷阱$/ },
        { c: "ass", p: 2, re: /影子训练|影身训练/ },
        { c: "ass", p: 3, re: /武学技艺|武学艺术|武学技能/ }
      ];
      let matchedTab = false;
      for (const tr of tabRules) {
        if (tr.c === cid && tr.re.test(lbl)) {
          tot.tabSkills[tr.p] = (tot.tabSkills[tr.p] || 0) + v;
          matchedTab = true;
          break;
        }
      }
      // Specific single-skill bonuses (e.g. +1-3 深渊, +3 骷髅支配, +1-3 旋风斩, +3 传送术)
      if (!matchedTab && !/力量|敏捷|体力|活力|精力|生命|法力|防御|伤害|命中|准确|抗性|所有属性|全属性|照亮|每杀|每次|持续|冰冻目标|击中/.test(lbl)) {
        const clsObj = typeof getActiveClassObj === "function" ? getActiveClassObj() : null;
        if (clsObj && Array.isArray(clsObj.skills)) {
          const skNameClean = lbl.replace(/[（(].*[）)]/, "").trim();
          const aliasMap = { "旋风斩": "Whirlwind", "旋风": "Whirlwind", "传送术": "Teleport", "传送": "Teleport", "变形术": "Lycanthropy", "野性狂暴": "Fury", "骷髅支配": "Skeleton Mastery", "深渊": "Abyss" };
          const skMatch = (aliasMap[skNameClean] && clsObj.skills.find(s => s.key === aliasMap[skNameClean]))
            || clsObj.skills.find(s => s.nameZh === skNameClean);
          if (skMatch) {
            tot.singleSkills[skMatch.key] = (tot.singleSkills[skMatch.key] || 0) + v;
          }
        }
      }
    }
    if ((m = clean.match(/([+-]?\d+)%\s*(?:快速施法|更快速施法|FCR)/i))) tot.fcr += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)%\s*(?:快速打击恢复|更快速打击回复|FHR)/i))) tot.fhr += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)%\s*(?:提高攻击速度|攻击速度|攻速|IAS)/i))) tot.ias += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)%\s*(?:高速跑步|更快速跑步|高跑|FRW)/i))) tot.frw += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)%\s*(?:更快速格挡率|快速格挡速度|FBR)/i))) tot.fbr += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)%\s*(?:(?:FBR\/)?(?:提高格挡几率|格挡几率|格挡率|格挡(?!速)))/i))) tot.blockPct += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)\s*(?:力量|力(?![量度]))/))) tot.str += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)\s*敏捷/))) tot.dex += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)\s*(?:体力|活力)/))) tot.vit += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)\s*精力/))) tot.enr += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)\s*(?:所有属性|全属性)/))) {
      const v = Number(m[1]);
      tot.str += v; tot.dex += v; tot.vit += v; tot.enr += v;
    }
    // Flat Life & Mana & % Life/Mana
    if (!clean.includes("偷取") && !clean.includes("恢复") && !clean.includes("上限") && !clean.includes("消灭") && !clean.includes("转化")) {
      if ((m = clean.match(/([+-]\d+)\s*生命(?!上限|偷取|恢复)/))) tot.flatHp += Number(m[1]);
      if ((m = clean.match(/([+-]\d+)\s*法力(?!上限|偷取|恢复)/))) tot.flatMana += Number(m[1]);
    }
    if ((m = clean.match(/生命上限提高\s*(\d+)%|\+(\d+)%\s*生命上限/))) tot.hpPct += Number(m[1] || m[2]);
    if ((m = clean.match(/法力上限提高\s*(\d+)%|\+(\d+)%\s*法力上限/))) tot.manaPct += Number(m[1] || m[2]);

    // Attack Rating (Flat AR & % AR) & ITD & -Target Def
    if (!clean.includes("对恶魔") && !clean.includes("对不死")) {
      if ((m = clean.match(/\+(\d+)\s*(?:命中值|攻击准确率|命中率|命中(?!加成)|AR)(?!%)/i))) tot.flatAr += Number(m[1]);
      if ((m = clean.match(/(\d+)%\s*(?:加成命中率|命中率加成|命中加成|额外攻击准确率|攻击准确率加成|命中(?!率)|AR)/i))) tot.arPct += Number(m[1]);
    }
    if (/无视目标防御|ITD/i.test(clean)) tot.itd = true;
    if ((m = clean.match(/-(\d+)%\s*目标防御/))) tot.targetDefPct += Number(m[1]);

    // Weapon/Off-Weapon ED%, Flat Damage, Min/Max Damage & Flat Elemental Attack Damage
    if (!clean.includes("对恶魔") && !clean.includes("对不死")) {
      if ((m = clean.match(/\+(\d+)%\s*(?:强化伤害|增强伤害|ED)(?!%)/i))) {
        const ed = Number(m[1]);
        if (isWeapon) {
          if (itemAcc) itemAcc.weapEd += ed;
        } else {
          tot.offWeaponEdPct += ed;
        }
      }
    }
    if ((m = clean.match(/^伤害\s*\+(\d+)/))) {
      tot.flatDmg += Number(m[1]);
    } else if (!/火焰|冰冷|闪电|毒素|魔法|对恶魔|对不死|技能/.test(clean) && (m = clean.match(/\+(\d+)\s*[–-]\s*(\d+)\s*伤害(?!加深|减少|转化)/))) {
      tot.flatMinDmg += Number(m[1]);
      tot.flatMaxDmg += Number(m[2]);
    }
    if ((m = clean.match(/\+(\d+)\s*最小伤害/))) tot.flatMinDmg += Number(m[1]);
    if ((m = clean.match(/\+(\d+)\s*最大伤害/))) tot.flatMaxDmg += Number(m[1]);
    if (tot.flatEleMin && (m = clean.match(/\+(\d+)\s*[–-]\s*(\d+)\s*(火焰|冰冷|闪电|毒素|魔法)伤害/))) {
      const ek = m[3] === "火焰" ? "fire" : m[3] === "冰冷" ? "cold" : m[3] === "闪电" ? "ltng" : m[3] === "毒素" ? "pois" : "mag";
      tot.flatEleMin[ek] = (tot.flatEleMin[ek] || 0) + Number(m[1]);
      tot.flatEleMax[ek] = (tot.flatEleMax[ek] || 0) + Number(m[2]);
    } else if (tot.flatEleMin && (m = clean.match(/\+(\d+)\s*(火焰|冰冷|闪电|毒素|魔法)伤害/))) {
      const ek = m[2] === "火焰" ? "fire" : m[2] === "冰冷" ? "cold" : m[2] === "闪电" ? "ltng" : m[2] === "毒素" ? "pois" : "mag";
      const ev = Number(m[1]);
      tot.flatEleMin[ek] = (tot.flatEleMin[ek] || 0) + ev;
      tot.flatEleMax[ek] = (tot.flatEleMax[ek] || 0) + ev;
    }

    // Armor Defense ED% & Flat Defense
    if ((m = clean.match(/\+(\d+)%\s*强化防御/))) {
      if (itemAcc) itemAcc.defEd += Number(m[1]);
    } else if (!clean.includes("远程") && !clean.includes("目标") && (m = clean.match(/\+(\d+)\s*防御(?!值?对)/))) {
      const dVal = Number(m[1]);
      tot.flatDef += dVal;
      if (itemAcc) itemAcc.flatDef += dVal;
      else if (tot.extraFlatDef !== undefined) tot.extraFlatDef += dVal;
    }

    // Resistances & Max Resistances
    if (clean.includes("上限") || clean.includes("最大")) {
      if ((m = clean.match(/\+(\d+)%\s*(?:最大)?(?:所有抗性|全抗)(?:上限)?/))) {
        const mv = Number(m[1]);
        tot.maxFRes += mv; tot.maxCRes += mv; tot.maxLRes += mv; tot.maxPRes += mv;
      }
      if ((m = clean.match(/\+(\d+)%\s*(?:最大)?火焰抗性/))) tot.maxFRes += Number(m[1]);
      if ((m = clean.match(/\+(\d+)%\s*(?:最大)?冰冷抗性/))) tot.maxCRes += Number(m[1]);
      if ((m = clean.match(/\+(\d+)%\s*(?:最大)?闪电抗性/))) tot.maxLRes += Number(m[1]);
      if ((m = clean.match(/\+(\d+)%\s*(?:最大)?毒素抗性/))) tot.maxPRes += Number(m[1]);
    } else {
      if ((m = clean.match(/(?:所有抗性|全抗)\s*([+-]?\d+)%?|([+-]?\d+)%?\s*(?:所有抗性|全抗)/))) {
        const v = Number(m[1] || m[2]);
        tot.fRes += v; tot.cRes += v; tot.lRes += v; tot.pRes += v;
      }
      if ((m = clean.match(/火焰抗性\s*([+-]?\d+)%|([+-]?\d+)%\s*火(?:焰)?抗/))) {
        const v = Number(m[1] || m[2]);
        const sig = "fRes:" + v;
        if (!itemSeen || !itemSeen.has(sig)) { tot.fRes += v; if (itemSeen) itemSeen.add(sig); }
      }
      if ((m = clean.match(/冰冷抗性\s*([+-]?\d+)%|([+-]?\d+)%\s*冰(?:冷)?抗/))) {
        const v = Number(m[1] || m[2]);
        const sig = "cRes:" + v;
        if (!itemSeen || !itemSeen.has(sig)) { tot.cRes += v; if (itemSeen) itemSeen.add(sig); }
      }
      if ((m = clean.match(/闪电抗性\s*([+-]?\d+)%|([+-]?\d+)%\s*(?:闪电|电)抗/))) {
        const v = Number(m[1] || m[2]);
        const sig = "lRes:" + v;
        if (!itemSeen || !itemSeen.has(sig)) { tot.lRes += v; if (itemSeen) itemSeen.add(sig); }
      }
      if ((m = clean.match(/毒素抗性\s*([+-]?\d+)%|([+-]?\d+)%\s*毒(?:素)?抗/))) {
        const v = Number(m[1] || m[2]);
        const sig = "pRes:" + v;
        if (!itemSeen || !itemSeen.has(sig)) { tot.pRes += v; if (itemSeen) itemSeen.add(sig); }
      }
    }

    // Sunder Charms
    if (clean.includes("破除怪物")) {
      if (clean.includes("闪电")) tot.sunders.add("ltng");
      if (clean.includes("火焰")) tot.sunders.add("fire");
      if (clean.includes("冰冷")) tot.sunders.add("cold");
      if (clean.includes("毒素")) tot.sunders.add("pois");
      if (clean.includes("物理")) tot.sunders.add("phys");
      if (clean.includes("魔法")) tot.sunders.add("mag");
    }
    if ((m = clean.match(/自身物理承受伤害\s*\+(\d+)%/))) {
      tot.drPct -= Number(m[1]);
    }

    // Element Skill Damage & Enemy Pierce
    if ((m = clean.match(/\+(\d+)%\s*(火焰|冰冷|闪电|毒素|魔法|火|冰|电|毒)(?:技能)?伤/))) {
      const v = Number(m[1]);
      const k = m[2].startsWith("火") ? "fire" : m[2].startsWith("冰") ? "cold" : m[2].startsWith("电") || m[2].startsWith("闪") ? "ltng" : m[2].startsWith("毒") ? "pois" : "mag";
      tot.eleDmg[k] = (tot.eleDmg[k] || 0) + v;
    }
    if ((m = clean.match(/-(\d+)%\s*敌人(火焰|冰冷|闪电|毒素|物理|魔法|火|冰|电|毒)抗/))) {
      const v = Number(m[1]);
      const k = m[2].startsWith("火") ? "fire" : m[2].startsWith("冰") ? "cold" : m[2].startsWith("电") || m[2].startsWith("闪") ? "ltng" : m[2].startsWith("毒") ? "pois" : m[2].startsWith("物") ? "phys" : "mag";
      tot.elePierce[k] = (tot.elePierce[k] || 0) + v;
      tot.pierce.push(m[2] + " -" + v + "%");
    }

    // Leech, MAEK/LAEK, CB/DS/OW, DR/PDR/MDR, CBF, MF/EG/Exp
    if ((m = clean.match(/([+-]?\d+)%\s*(?:更佳机会取得魔法装备|额外几率获得魔法物品|寻宝|MF)/i))) tot.mf += Number(m[1]);
    if ((m = clean.match(/([+-]?\d+)%\s*(?:额外金币|EG)/i))) tot.eg += Number(m[1]);
    if ((m = clean.match(/\+(\d+)%\s*经验获取/))) tot.expPct += Number(m[1]);
    if ((m = clean.match(/(\d+)%\s*(?:几率造成)?(?:压碎性打击|压碎打击|粉碎打击|CB)/i))) tot.cb += Number(m[1]);
    if ((m = clean.match(/(\d+)%\s*(?:几率造成)?(?:致命一击|致命打击|双倍打击|DS)/i))) tot.ds += Number(m[1]);
    if ((m = clean.match(/(\d+)%\s*(?:几率造成)?(?:撕裂伤口|撕开伤口|OW)/i))) tot.ow += Number(m[1]);
    if ((m = clean.match(/(\d+)%\s*(?:击中偷取生命|生命偷取|LL)/i))) tot.ll += Number(m[1]);
    if ((m = clean.match(/(\d+)%\s*(?:击中偷取法力|法力偷取|ML)/i))) tot.ml += Number(m[1]);
    if ((m = clean.match(/\+(\d+)\s*(?:每杀一个敌人恢复法力|每次消灭恢复法力|MAEK)/i))) tot.maek += Number(m[1]);
    if ((m = clean.match(/\+(\d+)\s*(?:每杀一个敌人恢复生命|每次消灭恢复生命|LAEK)/i))) tot.laek += Number(m[1]);
    if ((m = clean.match(/(?:物理伤害减[少免]|伤害减少)\s*(\d+)%|(\d+)%\s*物理伤害减[少免]/))) tot.drPct += Number(m[1] || m[2]);
    else if ((m = clean.match(/(?:物理伤害减[少免]|伤害减少)\s*(\d+)(?!%)/))) tot.pdr += Number(m[1]);
    if ((m = clean.match(/(?:法术伤害减少|魔法伤害减[少免])\s*(\d+)(?!%)/))) tot.mdr += Number(m[1]);
    if (/无法冰冻|CBF/i.test(clean)) tot.cbf = true;

    if ((m = clean.match(/(?:装备后?赋予|赋予)\s*(\d+)\s*级\s*([^\s（(·]+?)(?:灵气)?(?:\s|$|（|\()/))) {
      const aLvl = Number(m[1]);
      const aName = m[2];
      tot.auras.push(describeGearAura(aName, aLvl));
    }
  }
}

function getBagCharmDef(charmId) {
  return (pdData && Array.isArray(pdData.inventoryCharms) ? pdData.inventoryCharms : []).find(c => c.id === charmId) || null;
}

function layoutInventoryBag(bagItems) {
  const W = 10, H = 4;
  const occ = Array.from({ length: H }, () => Array(W).fill(false));
  const placed = [];
  const overflow = [];
  let usedCells = 0;

  // Place taller items first for authentic column-packed D2R bag look
  const sorted = bagItems.map((it, origIdx) => ({ it, def: getBagCharmDef(it.charmId), origIdx }))
    .filter(x => x.def)
    .sort((a, b) => (b.def.h * 10 + b.def.w) - (a.def.h * 10 + a.def.w) || a.origIdx - b.origIdx);

  for (const entry of sorted) {
    const { it, def } = entry;
    let found = null;
    for (let x = 0; x <= W - def.w && !found; x++) {
      for (let y = 0; y <= H - def.h && !found; y++) {
        let fits = true;
        for (let dx = 0; dx < def.w && fits; dx++) {
          for (let dy = 0; dy < def.h && fits; dy++) {
            if (occ[y + dy][x + dx]) fits = false;
          }
        }
        if (fits) found = { x, y };
      }
    }
    if (found) {
      for (let dx = 0; dx < def.w; dx++) {
        for (let dy = 0; dy < def.h; dy++) occ[found.y + dy][found.x + dx] = true;
      }
      usedCells += def.w * def.h;
      placed.push({ item: it, def, x: found.x, y: found.y, w: def.w, h: def.h });
    } else {
      overflow.push(entry);
    }
  }
  return { placed, overflow, usedCells, freeCells: W * H - usedCells };
}

function showBagMessage(msg) {
  const el = document.getElementById("pd-bag-msg");
  if (!el) return;
  if (!msg) { el.style.display = "none"; el.textContent = ""; return; }
  el.style.display = "block";
  el.textContent = msg;
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.display = "none"; }, 2600);
}

function addItemToBag(charmId, tabPageOverride, copyFromItem) {
  const def = getBagCharmDef(charmId);
  if (!def) return false;
  if (def.unique && pdCharBag.some(x => x.charmId === charmId)) {
    showBagMessage("⚠️ 「" + def.nameZh + "」为唯一物品，背包中最多只能携带 1 个");
    return false;
  }
  const clsObj = getActiveClassObj();
  const defaultTab = tabPageOverride || (clsObj && clsObj.tabs && clsObj.tabs[0] ? clsObj.tabs[0].page : 1);
  const candidate = {
    uid: "b" + (pdBagNextUid++),
    charmId,
    tabPage: def.isSkiller ? Number(defaultTab) : 0,
    prefixes: copyFromItem && Array.isArray(copyFromItem.prefixes) ? copyFromItem.prefixes.map(x => Object.assign({}, x)) : [],
    suffixes: copyFromItem && Array.isArray(copyFromItem.suffixes) ? copyFromItem.suffixes.map(x => Object.assign({}, x)) : [],
    rolls: copyFromItem && copyFromItem.rolls ? Object.assign({}, copyFromItem.rolls) : {}
  };
  const testLayout = layoutInventoryBag([...pdCharBag, candidate]);
  if (testLayout.overflow.length > 0) {
    showBagMessage("⚠️ 背包空间不足（剩余空位无法容纳 " + def.w + "×" + def.h + " 的「" + def.nameZh + "」），请先移出部分咒符");
    return false;
  }
  pdCharBag.push(candidate);
  pdActiveTarget = "bag";
  pdActiveBagUid = candidate.uid;
  showBagMessage("");
  renderPaperdollAll();
  return true;
}

function getPassiveHardPoints(classId, skillKey, maxMode, defaultWhenEmpty) {
  const b = getClassBuild(classId);
  const spent = Number((b && b[skillKey]) || 0);
  if (spent > 0) return { pts: spent, isDefault: false };
  if (getClassTotalPoints(classId) > 0) return { pts: 0, isDefault: false };
  if (maxMode && defaultWhenEmpty > 0) return { pts: defaultWhenEmpty, isDefault: true };
  return { pts: 0, isDefault: false };
}

function aggregateLoadoutStats(loadout, isChar, actorLvl, bagItems, extraOpts) {
  const target = isChar ? "char" : "merc";
  const tot = {
    skills: 0, classSkills: 0, fireSkills: 0, tabSkills: { 1: 0, 2: 0, 3: 0 }, singleSkills: {}, oskills: {},
    fcr: 0, fhr: 0, ias: 0, frw: 0, fbr: 0, blockPct: 0,
    str: 0, dex: 0, vit: 0, enr: 0,
    flatHp: 0, nonBoHp: 0, hpPct: 0, flatMana: 0, nonBoMana: 0, manaPct: 0,
    flatAr: 0, arPct: 0, itd: false, targetDefPct: 0,
    offWeaponEdPct: 0, flatMinDmg: 0, flatMaxDmg: 0, flatDmg: 0,
    flatEleMin: { fire: 0, cold: 0, ltng: 0, pois: 0, mag: 0 },
    flatEleMax: { fire: 0, cold: 0, ltng: 0, pois: 0, mag: 0 },
    totalArmorDef: 0, flatDef: 0, extraFlatDef: 0, shieldBlock: 0,
    mainWeapMin: 1, mainWeapMax: 4, mainWeapStrBonus: 100, mainWeapDexBonus: 0, mainWeapEd: 0, mainWeapType: "",
    shieldSmiteMin: 0, shieldSmiteMax: 0, bootKickMin: 3, bootKickMax: 8,
    fRes: 0, cRes: 0, lRes: 0, pRes: 0,
    maxFRes: 75, maxCRes: 75, maxLRes: 75, maxPRes: 75,
    mf: 0, eg: 0, expPct: 0, cb: 0, ds: 0, ow: 0, ll: 0, ml: 0, maek: 0, laek: 0,
    drPct: 0, pdr: 0, mdr: 0, cbf: false,
    maxReqStr: 0, maxReqDex: 0, mainWsm: 0,
    levitateLvl: 0, levitateReqRedPct: 0,
    eleDmg: { fire: 0, cold: 0, ltng: 0, pois: 0, mag: 0 },
    elePierce: { fire: 0, cold: 0, ltng: 0, pois: 0, mag: 0, phys: 0 },
    sunders: new Set(),
    setCounts: new Map(),
    pierce: [], auras: [], activeSets: [], incompatibleSlots: []
  };
  const offLocked = isOffhandSlotLocked(target);
  const setCounts = tot.setCounts;
  const equippedSetPieces = [];
  let nonWeaponMaxReqStr = 0, nonWeaponMaxReqDex = 0;
  let weaponReqMeta = null;

  for (const slotId in loadout) {
    if (slotId === "offhand" && offLocked) continue;
    const eq = loadout[slotId];
    if (!eq) continue;
    if (!isEquippedItemLegal(target, slotId, eq)) {
      tot.incompatibleSlots.push(slotId);
      continue;
    }
    const info = resolveEquippedItemInfo(eq);
    if (!info) continue;
    const isWeapon = slotId === "weapon";
    if (isWeapon) {
      tot.mainWsm = info.wsm || 0;
      weaponReqMeta = { baseReqStr: info.baseReqStr, baseReqDex: info.baseReqDex, reqReducePct: info.reqReducePct };
    } else {
      if (info.reqStr > nonWeaponMaxReqStr) nonWeaponMaxReqStr = info.reqStr;
      if (info.reqDex > nonWeaponMaxReqDex) nonWeaponMaxReqDex = info.reqDex;
    }
    if (info.reqStr > tot.maxReqStr) tot.maxReqStr = info.reqStr;
    if (info.reqDex > tot.maxReqDex) tot.maxReqDex = info.reqDex;

    const itemAcc = { weapEd: 0, defEd: 0, flatDef: 0 };
    const itemSeen = eq.cat === "craft" ? null : new Set();
    info.rolledLines.forEach(l => accumulateStatsFromLine(l, tot, actorLvl, itemSeen, { isWeapon, itemAcc, isChar }));
    const itemOwnDefEd = itemAcc.defEd;
    info.sockLines.forEach(l => accumulateStatsFromLine(l, tot, actorLvl, null, { isWeapon, itemAcc, isChar }));

    if (info.bRule) {
      const b = info.bRule;
      const ethMult = eq.eth ? 1.5 : 1;
      if (isWeapon) {
        const use2h = b.twoHanded && !(isChar && skActiveClassId === "bar" && b.oneOrTwoHanded && loadout.offhand);
        const rawMin = Math.floor((use2h ? (b.twoHandMin || b.minDmg || 1) : (b.minDmg || 1)) * ethMult);
        const rawMax = Math.floor((use2h ? (b.twoHandMax || b.maxDmg || 4) : (b.maxDmg || 4)) * ethMult);
        tot.mainWeapEd = itemAcc.weapEd;
        tot.mainWeapMin = Math.floor((rawMin * (100 + itemAcc.weapEd)) / 100);
        tot.mainWeapMax = Math.floor((rawMax * (100 + itemAcc.weapEd)) / 100);
        tot.mainWeapStrBonus = b.strBonus || 100;
        tot.mainWeapDexBonus = b.dexBonus || 0;
        tot.mainWeapType = b.type || "";
      } else {
        if (b.maxDef > 0) {
          tot.totalArmorDef += computeArmorPieceDefense(b, eq, itemOwnDefEd, itemAcc.defEd, itemAcc.flatDef);
        }
        if (itemAcc.defEd > 0) {
          tot.itemDefEd = (tot.itemDefEd || 0) + itemAcc.defEd;
        }
        if (slotId === "offhand" && b.block > 0) {
          tot.shieldBlock = b.block;
          tot.shieldSmiteMin = b.minDmg || 0;
          tot.shieldSmiteMax = b.maxDmg || 0;
        }
        if (slotId === "boots" && b.maxDmg > 0) {
          tot.bootKickMin = b.minDmg || 3;
          tot.bootKickMax = b.maxDmg || 8;
        }
      }
    }
    if (itemAcc.flatDef > 0 && (isWeapon || !(info.bRule && info.bRule.maxDef > 0))) {
      tot.extraFlatDef += itemAcc.flatDef;
    }

    if (eq.cat === "set" && info.setObj) {
      setCounts.set(info.setObj.id, (setCounts.get(info.setObj.id) || 0) + 1);
      if (info.pieceObj) equippedSetPieces.push({ sid: info.setObj.id, pieceObj: info.pieceObj });
    }
  }

  // Per-piece Set green bonuses (e.g. Horazon's Secrets 3pc -25% enemy fire res, Countenance 2pc +5% life)
  const seenSetPartialBySid = new Map();
  const markSetPartial = (sid, reqCount, txt) => {
    if (!seenSetPartialBySid.has(sid)) seenSetPartialBySid.set(sid, new Set());
    const key = reqCount + ":" + String(txt || "").trim();
    const set = seenSetPartialBySid.get(sid);
    if (set.has(key)) return false;
    set.add(key);
    return true;
  };
  for (const ep of equippedSetPieces) {
    const count = setCounts.get(ep.sid) || 0;
    if (count >= 2 && Array.isArray(ep.pieceObj.setPieceBonus)) {
      ep.pieceObj.setPieceBonus.forEach(pb => {
        const pm = String(pb).match(/(\d+)\s*件/);
        const reqCount = pm ? Number(pm[1]) : 2;
        if (count >= reqCount) {
          const body = String(pb).replace(/^[^:：]*[:：]\s*/, "");
          expandCompositeStatLines(body).forEach(l => {
            if (markSetPartial(ep.sid, reqCount, l)) {
              accumulateStatsFromLine(l, tot, actorLvl, null, { isChar });
            }
          });
        }
      });
    }
  }

  // Set partial & full bonuses (properly supporting { count, stats } objects + detail.fullBonuses, deduplicating piece-level repeats!)
  for (const [sid, count] of setCounts.entries()) {
    const sObj = (itData.setItems || []).find(s => s.id === sid);
    if (sObj && count >= 2) {
      tot.activeSets.push(sObj.nameZh + " (" + count + "/" + sObj.pieces + "件)");
      if (sObj.detail && Array.isArray(sObj.detail.partialBonuses)) {
        sObj.detail.partialBonuses.forEach(pb => {
          if (pb && typeof pb === "object" && Array.isArray(pb.stats)) {
            const reqCount = Number(pb.count) || 2;
            if (count >= reqCount) {
              pb.stats.forEach(st => {
                expandCompositeStatLines(st).forEach(l => {
                  if (markSetPartial(sid, reqCount, l)) {
                    accumulateStatsFromLine(l, tot, actorLvl, null, { isChar });
                  }
                });
              });
            }
          } else {
            const pm = String(pb).match(/(\d+)\s*件/);
            const reqCount = pm ? Number(pm[1]) : 2;
            if (count >= reqCount) {
              const body = String(pb).replace(/^[^:：]*[:：]\s*/, "");
              expandCompositeStatLines(body).forEach(l => {
                if (markSetPartial(sid, reqCount, l)) {
                  accumulateStatsFromLine(l, tot, actorLvl, null, { isChar });
                }
              });
            }
          }
        });
      }
      if (count >= sObj.pieces) {
        if (sObj.detail && Array.isArray(sObj.detail.fullBonuses) && sObj.detail.fullBonuses.length) {
          sObj.detail.fullBonuses.forEach(st => {
            expandCompositeStatLines(st).forEach(l => accumulateStatsFromLine(l, tot, actorLvl, null, { isChar }));
          });
        } else if (sObj.fullBonus) {
          expandCompositeStatLines(sObj.fullBonus).forEach(l => accumulateStatsFromLine(l, tot, actorLvl, null, { isChar }));
        }
      }
    }
  }

  // Accumulate Character Inventory Bag Charms (10x4 bag — including custom blank Magic SC/LC/GC!)
  if (isChar && Array.isArray(bagItems)) {
    const { placed } = layoutInventoryBag(bagItems);
    for (const p of placed) {
      if (p.def.cat === "util") continue;
      const rawStats = getBagItemRawStats(p.item, p.def);
      if (!rawStats) continue;
      const rolledLines = formatItemLinesWithRolls(rawStats, p.item.rolls);
      const itemSeen = new Set();
      rolledLines.forEach(l => accumulateStatsFromLine(l, tot, actorLvl, itemSeen, { isWeapon: false, isChar: true, tabPage: p.item.tabPage || 1 }));
    }
  }

  // Apply Warlock Levitate Mastery (-2% ~ -50% weapon Str/Dex requirements) after all gear/bag/CTA +skills are known
  if (isChar && skActiveClassId === "war") {
    const maxMode = Boolean(extraOpts && extraOpts.maxMode);
    const ctaBonus = Number((extraOpts && extraOpts.ctaSkillBonus) || 0);
    const levInfo = getPassiveHardPoints("war", "Levitate", maxMode, 1);
    const levBase = levInfo.pts;
    tot.levitateIsDefault = levInfo.isDefault;
    if (levBase > 0) {
      const clsObj = getActiveClassObj();
      const levSk = clsObj && Array.isArray(clsObj.skills) ? clsObj.skills.find(s => s.key === "Levitate") : null;
      const levPage = levSk ? levSk.page : 2;
      const levLvl = levBase + tot.skills + (tot.classSkills || 0) + ctaBonus + (tot.tabSkills[levPage] || 0) + ((tot.singleSkills && tot.singleSkills["Levitate"]) || 0);
      const levPct = Math.min(50, 2 + Math.max(0, levLvl - 1) * 2);
      tot.levitateLvl = levLvl;
      tot.levitateReqRedPct = levPct;
      if (weaponReqMeta) {
        const effMult = Math.max(0, (100 - (weaponReqMeta.reqReducePct + levPct)) / 100);
        const effWeapStr = Math.max(0, Math.floor(weaponReqMeta.baseReqStr * effMult));
        const effWeapDex = Math.max(0, Math.floor(weaponReqMeta.baseReqDex * effMult));
        tot.maxReqStr = Math.max(nonWeaponMaxReqStr, effWeapStr);
        tot.maxReqDex = Math.max(nonWeaponMaxReqDex, effWeapDex);
      }
    }
  }
  return tot;
}

function getSlotResolveOpts(target, slotId) {
  const actorLvl = target === "merc"
    ? Math.min(98, Math.max(67, Number(document.getElementById("merc-lvl-input")?.value || 90)))
    : Math.min(99, Math.max(1, Number(document.getElementById("pd-char-lvl")?.value || 90)));
  if (target === "char" && slotId === "weapon" && skActiveClassId === "war" && pdLastLevitateReq && pdLastLevitateReq.pct > 0) {
    return {
      actorLvl,
      extraReqReducePct: pdLastLevitateReq.pct,
      extraReqReason: "悬浮精通 Lv." + pdLastLevitateReq.lvl
    };
  }
  return { actorLvl };
}

function hidePdTooltip() {
  const tt = document.getElementById("pd-hover-tooltip");
  if (tt) {
    tt.style.display = "none";
    tt.setAttribute("aria-hidden", "true");
  }
}

function positionPdTooltip(tt, evt) {
  if (!tt || !evt) return;
  const vw = window.innerWidth || 1280;
  const vh = window.innerHeight || 800;
  const rect = tt.getBoundingClientRect ? tt.getBoundingClientRect() : { width: 320, height: 220 };
  const pad = 14;
  let left = (evt.clientX || 0) + 16;
  let top = (evt.clientY || 0) + 14;
  if (left + rect.width + pad > vw) left = Math.max(pad, (evt.clientX || 0) - rect.width - 16);
  if (top + rect.height + pad > vh) top = Math.max(pad, vh - rect.height - pad);
  tt.style.left = Math.round(left) + "px";
  tt.style.top = Math.round(top) + "px";
}

function showPdTooltip(html, qualityClass, evt) {
  const tt = document.getElementById("pd-hover-tooltip");
  if (!tt) return;
  if (!html) { hidePdTooltip(); return; }
  tt.className = "pd-hover-tooltip" + (qualityClass ? (" " + qualityClass) : "");
  tt.innerHTML = html;
  tt.style.display = "block";
  tt.setAttribute("aria-hidden", "false");
  if (currentLang !== "zhCN") applyDomTraditionalSweep();
  positionPdTooltip(tt, evt);
}

function buildPaperdollHoverTooltipHtml(target, slotOrUid) {
  if (!pdData || !itData) return { html: "", qualityClass: "" };

  if (target === "bag") {
    const bagItem = pdCharBag.find(x => x.uid === slotOrUid);
    const def = bagItem ? getBagCharmDef(bagItem.charmId) : null;
    if (!bagItem || !def) return { html: "", qualityClass: "" };
    const clsObj = getActiveClassObj();
    let tabNote = "";
    if (def.isSkiller && clsObj && clsObj.tabs) {
      const t = clsObj.tabs.find(x => x.page === bagItem.tabPage) || clsObj.tabs[0];
      if (t) tabNote = " · 专精：" + t.zhCN;
    }
    const rawStats = getBagItemRawStats(bagItem, def);
    const rolled = rawStats ? formatItemLinesWithRolls(rawStats, bagItem.rolls) : [];
    const qCls = def.cat === "unique" ? "q-unique" : def.cat === "util" ? "q-rare" : "q-magic";
    const tCol = def.cat === "unique" ? "#ffd573" : def.cat === "util" ? "#f8e97a" : "#7cb6ff";
    const statsHtml = rolled.length
      ? '<ul class="pd-tt-stats">' + rolled.map(l => '<li>' + escapeHtml(l) + '</li>').join("") + '</ul>'
      : '<div style="color:#7cb6ff;font-size:11.5px">空白蓝装咒符（0 属性）· 点击右侧自选 1 前缀 + 1 后缀</div>';
    return {
      qualityClass: qCls,
      html:
        '<div class="pd-tt-head">' +
          '<img class="pd-tt-ico" src="' + escapeHtml(getBagCharmIcon(bagItem, def)) + '" alt="" />' +
          '<div><div class="pd-tt-title" style="color:' + tCol + '">' + escapeHtml(def.nameZh) + '</div>' +
          '<div class="pd-tt-sub">' + escapeHtml(def.nameEn) + ' · 占格 ' + def.w + '×' + def.h + escapeHtml(tabNote) + '</div></div>' +
        '</div>' +
        statsHtml +
        '<div class="pd-tt-foot">点击可在右侧微调变量 / 自选词缀 / 复制或移出' + (canCycleBagCharmSkin(def) ? ' · 左上角 ↻ 可换图案' : '') + '</div>'
    };
  }

  const loadout = target === "char" ? pdCharLoadout : pdMercLoadout;
  const offLocked = slotOrUid === "offhand" && isOffhandSlotLocked(target);
  if (offLocked) {
    return {
      qualityClass: "",
      html: '<div style="color:#ff9b8f;font-weight:700">⚠️ 副手槽位已锁定</div><div style="font-size:11.5px;color:#c9d6ec;margin-top:4px">' + escapeHtml(getSlotRuleDescription(target, slotOrUid)) + '</div>'
    };
  }
  const eq = loadout[slotOrUid];
  if (!eq) return { html: "", qualityClass: "" };
  const info = resolveEquippedItemInfo(eq, getSlotResolveOpts(target, slotOrUid));
  if (!info) return { html: "", qualityClass: "" };
  const isIllegal = !isEquippedItemLegal(target, slotOrUid, eq);
  const tCol = eq.cat === "magic" ? "#7cb6ff" : eq.cat === "rare" ? "#f8e97a" : eq.cat === "craft" ? "#ffaa4d" : eq.cat === "set" ? "#67e87a" : "#ffd573";
  const curStr = target === "char" ? pdLastHoverCtx.charStr : pdLastHoverCtx.mercStr;
  const curDex = target === "char" ? pdLastHoverCtx.charDex : pdLastHoverCtx.mercDex;

  const metaLines = [];
  if (info.bRule) {
    const b = info.bRule;
    metaLines.push("底材：" + b.nameZh + " (" + b.nameEn + ")" + (eq.eth ? " · 无形 Ethereal" : ""));
    if (b.slot === "weapon" && info.itemWeapMax > 0) {
      metaLines.push("武器面板伤害：" + info.itemWeapMin + " – " + info.itemWeapMax + "（WSM [" + (b.wsm || 0) + "]）");
    } else if (info.itemDef > 0) {
      const blkTxt = b.block > 0 ? (" · 格挡几率 " + (info.itemDisplayBlock || b.block) + "%") : "";
      const smiteTxt = (b.block > 0 && b.maxDmg > 0) ? (" · 盾击伤害 " + (b.minDmg || 0) + "–" + b.maxDmg) : "";
      metaLines.push("防御值：" + info.itemDef + blkTxt + smiteTxt);
    }
  }
  const reqStrTxt = info.reqStr > 0
    ? ('<span style="color:' + (curStr > 0 && curStr < info.reqStr ? '#ff8a75;font-weight:700' : '#a8e6b4') + '">力量需求 ' + info.reqStr + '</span>' +
      (info.reqStr < info.baseReqStr ? (' <span style="color:#9ad8ff;font-size:10.5px">(原 ' + info.baseReqStr + (info.extraReqReason ? ('，' + info.extraReqReason + ' -' + info.extraReqReducePct + '%') : '') + (info.reqReducePct ? ('，装备 -' + info.reqReducePct + '%') : '') + ')</span>') : ''))
    : "";
  const reqDexTxt = info.reqDex > 0
    ? ('<span style="color:' + (curDex > 0 && curDex < info.reqDex ? '#ff8a75;font-weight:700' : '#a8e6b4') + '">敏捷需求 ' + info.reqDex + '</span>' +
      (info.reqDex < info.baseReqDex ? (' <span style="color:#9ad8ff;font-size:10.5px">(原 ' + info.baseReqDex + ')</span>') : ''))
    : "";
  if (reqStrTxt || reqDexTxt) {
    metaLines.push([reqStrTxt, reqDexTxt].filter(Boolean).join(" · "));
  }

  const actorLvlForTt = target === "merc"
    ? Number(document.getElementById("pd-merc-lvl")?.value || 90)
    : Number(document.getElementById("pd-char-lvl")?.value || 90);
  const statsHtml = info.rolledLines.length
    ? '<ul class="pd-tt-stats">' + info.rolledLines.map(l => '<li>' + renderStatLineWithLvlCalcHtml(l, actorLvlForTt) + '</li>').join("") + '</ul>'
    : '<div style="color:' + tCol + ';font-size:11.5px">空白装备（0 属性）· 点击在右侧自选词缀</div>';

  const socksHtml = info.sockLines.length
    ? '<div class="pd-tt-socks">' + info.sockLines.map(l => '<div>' + escapeHtml(l) + '</div>').join("") + '</div>'
    : (info.maxSocks > 0 ? '<div class="pd-tt-socks" style="color:#9ba7be">空孔：0 / ' + info.maxSocks + '（点击右侧可镶嵌符文/宝石/珠宝）</div>' : '');

  let setHtml = "";
  if (eq.cat === "set" && info.setObj) {
    const sCounts = target === "char" ? pdLastHoverCtx.charSetCounts : pdLastHoverCtx.mercSetCounts;
    const cnt = (sCounts && sCounts.get(info.setObj.id)) || 1;
    const setLines = [];
    if (info.pieceObj && Array.isArray(info.pieceObj.setPieceBonus)) {
      info.pieceObj.setPieceBonus.forEach(pb => {
        const pm = String(pb).match(/(\d+)\s*件/);
        const req = pm ? Number(pm[1]) : 2;
        const active = cnt >= req;
        setLines.push('<div style="color:' + (active ? '#67e87a' : '#6f7c91') + '">' + (active ? '✓ ' : '○ ') + renderStatLineWithLvlCalcHtml(pb, actorLvlForTt) + '</div>');
      });
    }
    setLines.push('<div style="margin-top:4px;font-weight:700;color:#ffe08c">' + escapeHtml(info.setObj.nameZh) + '（已穿戴 ' + cnt + '/' + info.setObj.pieces + ' 件）</div>');
    if (info.setObj.detail && Array.isArray(info.setObj.detail.partialBonuses)) {
      info.setObj.detail.partialBonuses.forEach(pb => {
        const req = (pb && typeof pb === "object") ? (Number(pb.count) || 2) : ((String(pb).match(/(\d+)\s*件/) || [])[1] || 2);
        const active = cnt >= Number(req);
        const txt = (pb && typeof pb === "object" && Array.isArray(pb.stats)) ? (req + "件：" + pb.stats.join(" · ")) : String(pb);
        setLines.push('<div style="color:' + (active ? '#67e87a' : '#6f7c91') + '">' + (active ? '✓ ' : '○ ') + escapeHtml(txt) + '</div>');
      });
    }
    if (info.setObj.detail && Array.isArray(info.setObj.detail.fullBonuses) && info.setObj.detail.fullBonuses.length) {
      const activeFull = cnt >= info.setObj.pieces;
      setLines.push('<div style="color:' + (activeFull ? '#ffd573' : '#6f7c91') + '">' + (activeFull ? '★ 全套生效：' : '○ 全套加成：') + escapeHtml(info.setObj.detail.fullBonuses.join(" · ")) + '</div>');
    }
    setHtml = '<div class="pd-tt-set">' + setLines.join("") + '</div>';
  }

  return {
    qualityClass: info.qualityClass,
    html:
      (isIllegal ? '<div style="color:#ff8a75;font-weight:700;margin-bottom:5px">⚠️ 职业/部位不符（未计入面板属性）</div>' : '') +
      '<div class="pd-tt-head">' +
        (info.icon ? '<img class="pd-tt-ico" src="' + escapeHtml(info.icon) + '" alt="" />' : '') +
        '<div><div class="pd-tt-title" style="color:' + tCol + '">' + escapeHtml((eq.eth ? "[无形] " : "") + info.titleZh) + '</div>' +
        '<div class="pd-tt-sub">' + escapeHtml(info.titleEn) + '</div></div>' +
      '</div>' +
      (metaLines.length ? '<div class="pd-tt-meta">' + metaLines.map(l => '<div>' + l + '</div>').join("") + '</div>' : '') +
      statsHtml +
      socksHtml +
      setHtml +
      '<div class="pd-tt-foot">点击该部位可在右侧修改变量 / 镶嵌 / 词缀 / 更换</div>'
  };
}

function renderPaperdollSlotGrid(containerId, target, slotsDef, loadout) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  const offLocked = isOffhandSlotLocked(target);
  grid.innerHTML = slotsDef.map(s => {
    const isLocked = s.id === "offhand" && offLocked;
    const eq = isLocked ? null : loadout[s.id];
    const info = eq ? resolveEquippedItemInfo(eq, getSlotResolveOpts(target, s.id)) : null;
    const isIllegal = Boolean(eq && !isEquippedItemLegal(target, s.id, eq));
    const isActive = pdActiveTarget === target && pdActiveSlot === s.id;
    const classes = ["pd-slot"];
    if (s.tall) classes.push("tall");
    if (s.mini) classes.push("mini");
    if (isActive) classes.push("active-slot");
    if (isLocked || isIllegal) classes.push("locked-slot");
    if (info && !isIllegal) classes.push("equipped", info.qualityClass);

    const sockUsed = (eq && Array.isArray(eq.sockets)) ? eq.sockets.filter(Boolean).length : 0;
    const afCnt = eq ? ((Array.isArray(eq.prefixes) ? eq.prefixes.length : 0) + (Array.isArray(eq.suffixes) ? eq.suffixes.length : 0)) : 0;
    let sockBadge = "";
    if (isIllegal) {
      sockBadge = '<span class="rw-badge" style="font-size:9.5px;padding:0 4px;border-color:#ff6b57;color:#ff9b8f">职业不符</span>';
    } else if (eq && (eq.cat === "magic" || eq.cat === "rare")) {
      const isM = eq.cat === "magic";
      const cap = isM ? 2 : 6;
      const sockTxt = (info && info.maxSocks > 0 && sockUsed > 0) ? ("·" + sockUsed + "/" + info.maxSocks + "孔") : "";
      sockBadge = '<span class="rw-badge" style="font-size:9.5px;padding:0 4px;border-color:' + (isM ? '#69a9ff' : '#f8e97a') + ';color:' + (isM ? '#7cb6ff' : '#f8e97a') + '">' + (isM ? '蓝 ' : '黄 ') + afCnt + '/' + cap + sockTxt + '</span>';
    } else if (eq && eq.cat === "craft") {
      const sockTxt = (info && info.maxSocks > 0 && sockUsed > 0) ? ("·" + sockUsed + "/" + info.maxSocks + "孔") : "";
      sockBadge = '<span class="rw-badge" style="font-size:9.5px;padding:0 4px;border-color:#ff9b38;color:#ffaa4d">手工 ' + afCnt + '/4' + sockTxt + '</span>';
    } else if (info && info.maxSocks > 0) {
      sockBadge = '<span class="rw-badge" style="font-size:9.5px;padding:0 4px">' + sockUsed + '/' + info.maxSocks + '孔</span>';
    } else if (eq && eq.cat === "rw") {
      sockBadge = '<span class="rw-badge rw-badge-patch" style="font-size:9.5px;padding:0 4px">符语</span>';
    }
    const areaStyle = s.area ? ("grid-area:" + s.area + ";") : (s.gridSpan ? ("grid-column:span " + s.gridSpan + ";") : "");

    const unequipBtnHtml = (eq && !isLocked)
      ? '<button type="button" class="pd-slot-unequip-btn" data-pd-unequip-target="' + target + '" data-pd-unequip-slot="' + s.id + '" title="直接卸下该装备（也可右键单击）" aria-label="卸下 ' + escapeHtml(s.label) + '">×</button>'
      : '';

    return '<div class="' + classes.join(" ") + '" data-pd-target="' + target + '" data-pd-slot="' + s.id + '" style="' + areaStyle + 'background-image:url(' + s.bg + ')">' +
      unequipBtnHtml +
      '<div class="pd-slot-label"><span>' + escapeHtml(s.label) + '</span>' + sockBadge + '</div>' +
      (info && info.icon ? '<img class="pd-slot-img" src="' + escapeHtml(info.icon) + '" alt="" />' : '<div style="height:34px"></div>') +
      '<div class="pd-slot-name">' + escapeHtml(isLocked ? "副手已锁定" : (info ? ((eq.eth ? "[无形] " : "") + info.titleZh) : "点击配装")) + '</div>' +
    '</div>';
  }).join("");

  const unequipSlotDirect = (t, sid) => {
    if (t === "merc" && !isMercEnabled()) return;
    const ld = t === "char" ? pdCharLoadout : pdMercLoadout;
    if (!ld || !ld[sid]) return;
    hidePdTooltip();
    delete ld[sid];
    renderPaperdollAll();
  };

  grid.querySelectorAll("[data-pd-unequip-slot]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      unequipSlotDirect(btn.dataset.pdUnequipTarget, btn.dataset.pdUnequipSlot);
    });
  });

  grid.querySelectorAll("[data-pd-slot]").forEach(el => {
    el.addEventListener("mouseenter", (e) => {
      if (el.dataset.pdTarget === "merc" && !isMercEnabled()) return;
      const built = buildPaperdollHoverTooltipHtml(el.dataset.pdTarget, el.dataset.pdSlot);
      showPdTooltip(built.html, built.qualityClass, e);
    });
    el.addEventListener("mousemove", (e) => {
      const tt = document.getElementById("pd-hover-tooltip");
      if (tt && tt.style.display === "block") positionPdTooltip(tt, e);
    });
    el.addEventListener("mouseleave", hidePdTooltip);
    el.addEventListener("contextmenu", (e) => {
      const ld = el.dataset.pdTarget === "char" ? pdCharLoadout : pdMercLoadout;
      if (ld && ld[el.dataset.pdSlot]) {
        e.preventDefault();
        unequipSlotDirect(el.dataset.pdTarget, el.dataset.pdSlot);
      }
    });
    el.addEventListener("click", () => {
      if (el.dataset.pdTarget === "merc" && !isMercEnabled()) return;
      hidePdTooltip();
      pdActiveTarget = el.dataset.pdTarget;
      pdActiveSlot = el.dataset.pdSlot;
      pdActiveBagUid = null;
      pdSelectedRwBaseCode = "";
      pdAffixFilter = "";
      if (pdRwBaseCombo) pdRwBaseCombo.close(false);
      if (pdItemCombo) pdItemCombo.close(false);
      const afFilterInp = document.getElementById("pd-affix-filter");
      if (afFilterInp) afFilterInp.value = "";
      const curEq = (pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout)[pdActiveSlot];
      if (curEq && curEq.cat) pdActiveCat = curEq.cat;
      else if (["amulet", "ring1", "ring2", "gloves", "boots", "belt"].includes(pdActiveSlot)) {
        if (pdActiveCat === "rw" || pdActiveCat === "base") pdActiveCat = "unique";
      }
      renderPaperdollAll();
    });
  });
}

function canCycleBagCharmSkin(def) {
  if (!def) return false;
  if (def.cat === "util" || def.id === "anni" || def.id === "torch") return false;
  return def.size === "SC" || def.size === "LC" || def.size === "GC";
}

function getBagCharmSkinIndex(item, def) {
  if (item && Number(item.skin) >= 1 && Number(item.skin) <= 3) return Number(item.skin);
  const ico = String((def && def.icon) || "");
  const m = ico.match(/charm_(?:small|medium|large)([1-3])\.webp$/);
  return m ? Number(m[1]) : 1;
}

function getBagCharmIcon(item, def) {
  if (!def) return "";
  if (!canCycleBagCharmSkin(def)) return def.icon || "";
  const skin = getBagCharmSkinIndex(item, def);
  const sizeKey = def.size === "SC" ? "small" : def.size === "LC" ? "medium" : "large";
  return "/images/items/misc/charm/charm_" + sizeKey + skin + ".webp";
}

function cycleBagCharmSkinByUid(uid) {
  if (!uid) return false;
  const target = pdCharBag.find(x => x.uid === uid);
  if (!target) return false;
  const def = getBagCharmDef(target.charmId);
  if (!canCycleBagCharmSkin(def)) return false;
  const cur = getBagCharmSkinIndex(target, def);
  target.skin = (cur % 3) + 1;
  renderInventoryBag();
  renderActiveItemPreview();
  if (pdStateLoadedForClass === skActiveClassId) savePaperdollState(skActiveClassId);
  return true;
}

function removeBagItemByUid(uid, opts) {
  if (!uid) return false;
  const target = pdCharBag.find(x => x.uid === uid);
  if (!target) return false;
  const def = getBagCharmDef(target.charmId);
  pdCharBag = pdCharBag.filter(x => x.uid !== uid);
  if (pdActiveTarget === "bag" && pdActiveBagUid === uid) {
    pdActiveBagUid = pdCharBag[0] ? pdCharBag[0].uid : null;
    if (!pdActiveBagUid) pdActiveTarget = "char";
  }
  if (!opts || opts.silent !== true) {
    showBagMessage("已从背包移出：" + (def ? def.nameZh : target.charmId));
  }
  renderPaperdollAll();
  return true;
}

function renderInventoryBag() {
  const grid = document.getElementById("pd-inv-grid");
  const usageEl = document.getElementById("pd-bag-usage");
  const inlineBar = document.getElementById("pd-bag-inline-bar");
  if (!grid || !pdData) return;

  const clsObj = getActiveClassObj();
  const { placed, usedCells, freeCells } = layoutInventoryBag(pdCharBag);
  if (usageEl) usageEl.textContent = "已用 " + usedCells + " / 40 格 · 剩余 " + freeCells + " 格";

  let html = "";
  for (let r = 1; r <= 4; r++) {
    for (let c = 1; c <= 10; c++) {
      html += '<div class="pd-inv-cell" style="grid-column:' + c + ';grid-row:' + r + '"></div>';
    }
  }
  for (const p of placed) {
    const isActive = pdActiveTarget === "bag" && pdActiveBagUid === p.item.uid;
    const cls = ["pd-inv-item"];
    if (p.def.cat === "unique") cls.push("is-unique");
    if (p.def.cat === "util") cls.push("is-util");
    if (p.def.isBlankMagic) cls.push("is-magic-blank");
    if (isActive) cls.push("active-bag");
    let tag = p.def.shortZh || p.def.size;
    if (p.def.isBlankMagic) {
      tag = getMagicCharmShortTag(p.item, p.def);
    } else if (p.def.isSkiller && clsObj && Array.isArray(clsObj.tabs)) {
      const tab = clsObj.tabs.find(t => t.page === p.item.tabPage) || clsObj.tabs[0];
      if (tab) tag = "+" + tab.zhCN.slice(0, 2);
    }
    const skinBtnHtml = canCycleBagCharmSkin(p.def)
      ? '<button type="button" class="pd-inv-skin-btn" data-bag-skin-uid="' + escapeHtml(p.item.uid) + '" title="切换咒符图案（样式 ' + getBagCharmSkinIndex(p.item, p.def) + '/3）" aria-label="切换 ' + escapeHtml(p.def.nameZh || tag) + ' 图案">↻</button>'
      : '';
    html += '<div class="' + cls.join(" ") + '" data-bag-uid="' + escapeHtml(p.item.uid) + '" style="grid-column:' + (p.x + 1) + ' / span ' + p.w + ';grid-row:' + (p.y + 1) + ' / span ' + p.h + '">' +
      skinBtnHtml +
      '<button type="button" class="pd-inv-remove-btn" data-bag-remove-uid="' + escapeHtml(p.item.uid) + '" title="移出背包（也可直接右键单击）" aria-label="移出 ' + escapeHtml(p.def.nameZh || tag) + '">×</button>' +
      '<img src="' + escapeHtml(getBagCharmIcon(p.item, p.def)) + '" alt="" />' +
      '<span class="pd-inv-item-tag">' + escapeHtml(tag) + '</span>' +
    '</div>';
  }
  grid.innerHTML = html;

  grid.querySelectorAll("[data-bag-skin-uid]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      hidePdTooltip();
      cycleBagCharmSkinByUid(btn.dataset.bagSkinUid);
    });
  });

  grid.querySelectorAll("[data-bag-remove-uid]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      hidePdTooltip();
      removeBagItemByUid(btn.dataset.bagRemoveUid);
    });
  });

  grid.querySelectorAll("[data-bag-uid]").forEach(el => {
    el.addEventListener("mouseenter", (e) => {
      const built = buildPaperdollHoverTooltipHtml("bag", el.dataset.bagUid);
      showPdTooltip(built.html, built.qualityClass, e);
    });
    el.addEventListener("mousemove", (e) => {
      const tt = document.getElementById("pd-hover-tooltip");
      if (tt && tt.style.display === "block") positionPdTooltip(tt, e);
    });
    el.addEventListener("mouseleave", hidePdTooltip);
    el.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      hidePdTooltip();
      removeBagItemByUid(el.dataset.bagUid);
    });
    el.addEventListener("click", () => {
      hidePdTooltip();
      pdActiveTarget = "bag";
      pdActiveBagUid = el.dataset.bagUid;
      pdAffixFilter = "";
      const afFilterInp = document.getElementById("pd-affix-filter");
      if (afFilterInp) afFilterInp.value = "";
      renderPaperdollAll();
    });
  });

  if (inlineBar) {
    const activeItem = pdActiveTarget === "bag" && pdActiveBagUid
      ? pdCharBag.find(x => x.uid === pdActiveBagUid)
      : null;
    if (activeItem) {
      const def = getBagCharmDef(activeItem.charmId);
      let label = def ? def.nameZh : activeItem.charmId;
      if (def && def.isSkiller && clsObj && Array.isArray(clsObj.tabs)) {
        const tab = clsObj.tabs.find(t => t.page === activeItem.tabPage) || clsObj.tabs[0];
        if (tab) label += " (" + tab.zhCN + ")";
      }
      inlineBar.style.display = "flex";
      inlineBar.innerHTML =
        '<span class="pd-bag-inline-name">已选：' + escapeHtml(label) + '</span>' +
        '<span class="pd-bag-inline-actions">' +
          (def && !def.unique ? '<button type="button" class="rw-detail-btn" id="pd-bag-inline-dup" style="padding:2px 7px;font-size:11px">📋 复制</button>' : '') +
          '<button type="button" class="rw-btn rw-btn-danger" id="pd-bag-inline-remove" style="padding:2px 8px;font-size:11px">× 移出背包</button>' +
        '</span>';
      const rmBtn = document.getElementById("pd-bag-inline-remove");
      if (rmBtn) rmBtn.addEventListener("click", () => removeBagItemByUid(activeItem.uid));
      const dupBtn = document.getElementById("pd-bag-inline-dup");
      if (dupBtn) dupBtn.addEventListener("click", () => addItemToBag(activeItem.charmId, activeItem.tabPage, activeItem));
    } else {
      inlineBar.style.display = "none";
      inlineBar.innerHTML = "";
    }
  }
}

function populateBagAddSelect() {
  const sel = document.getElementById("pd-bag-add-select");
  const tabSel = document.getElementById("pd-bag-skiller-tab");
  if (!sel || !pdData) return;

  const clsObj = getActiveClassObj();
  if (tabSel && clsObj && Array.isArray(clsObj.tabs)) {
    const prevTab = tabSel.value;
    tabSel.innerHTML = clsObj.tabs.map(t =>
      '<option value="' + t.page + '"' + (String(t.page) === prevTab ? ' selected' : '') + '>+1 ' + escapeHtml(t.zhCN) + '</option>'
    ).join("");
  }

  if (!sel.options.length) {
    const groups = [
      { label: "🔵 蓝装空白咒符（放入背包后点击自选前后缀 · 1前+1后）", cat: "magic-blank" },
      { label: "★ 暗金咒符（限 1 块）", cat: "unique" },
      { label: "✦ 本职业专精技能大板 (GC 1×3)", cat: "skiller" },
      { label: "◆ 常用预设蓝咒符 (GC 1×3 / LC 1×2 / SC 1×1)", cat: "magic" },
      { label: "▣ 实战占格工具（方块 / 双书）", cat: "util" }
    ];
    sel.innerHTML = groups.map(g => {
      const items = (pdData.inventoryCharms || []).filter(c => c.cat === g.cat);
      if (!items.length) return "";
      return '<optgroup label="' + escapeHtml(g.label) + '">' +
        items.map(c => '<option value="' + escapeHtml(c.id) + '">' + escapeHtml(c.nameZh) + ' [' + c.w + '×' + c.h + ']</option>').join("") +
      '</optgroup>';
    }).join("");
  }

  const chosenDef = getBagCharmDef(sel.value);
  if (tabSel) tabSel.style.display = (chosenDef && chosenDef.isSkiller) ? "inline-block" : "none";
}

function findAnyClassSkill(skKey) {
  for (const c of (skClasses || [])) {
    const sk = (c.skills || []).find(s => s.key === skKey);
    if (sk) return { cls: c, sk };
  }
  return null;
}

function populatePdSkillSelect() {
  const sel = document.getElementById("pd-skill-select");
  const clsObj = getActiveClassObj();
  if (!sel || !clsObj) return;

  const DEFAULT_SIGNATURES = {
    war: "Apocalypse",
    sor: "Lightning",
    pal: "Blessed Hammer",
    ama: "Lightning Fury",
    nec: "Bone Spear",
    bar: "Whirlwind",
    dru: "Tornado",
    ass: "Lightning Sentry"
  };
  const oskillEntries = Object.values(pdActiveOskills || {}).filter(os => {
    const found = findAnyClassSkill(os.key);
    return Boolean(found && (found.sk.dmg || (pdData && pdData.skillCombatMeta && pdData.skillCombatMeta[os.key]) || os.key === "Enchant"));
  });
  const oskillOptionVals = oskillEntries.map(os => "__oskill__:" + os.key);

  const allKeys = new Set(["__normal__", ...clsObj.skills.map(s => s.key), ...oskillOptionVals]);
  if (!pdSelectedSkillKey || (!allKeys.has(pdSelectedSkillKey) && !(String(pdSelectedSkillKey).startsWith("__oskill__:") && Object.keys(pdActiveOskills || {}).length === 0))) {
    pdSelectedSkillKey = DEFAULT_SIGNATURES[clsObj.id] || (clsObj.skills[0] && clsObj.skills[0].key) || "__normal__";
  }

  const tabs = clsObj.tabs || [];
  let html = '<option value="__normal__"' + (pdSelectedSkillKey === "__normal__" ? ' selected' : '') + '>普通物理攻击 (Normal Attack)</option>';
  if (oskillEntries.length) {
    html += '<optgroup label="✨ 套装 / 装备自带技能 (Oskills)">' +
      oskillEntries.map(os => {
        const found = findAnyClassSkill(os.key);
        const val = "__oskill__:" + os.key;
        const title = found ? (pickLangTitle(found.sk) + " (" + found.sk.nameEn + ")") : os.key;
        return '<option value="' + escapeHtml(val) + '"' + (val === pdSelectedSkillKey ? ' selected' : '') + '>' +
          '✨ ' + escapeHtml(title) + ' [基础 +' + os.baseLvl + (os.isCharge ? ' 聚气' : ' 全职业') + ']' +
        '</option>';
      }).join("") +
    '</optgroup>';
  }
  for (const tab of tabs) {
    const list = clsObj.skills.filter(s => s.page === tab.page && !s.passive);
    if (!list.length) continue;
    html += '<optgroup label="' + escapeHtml(tab.zhCN) + '">' +
      list.map(s => {
        const hasDmg = Boolean(s.dmg || (pdData && pdData.skillCombatMeta && pdData.skillCombatMeta[s.key]));
        return '<option value="' + escapeHtml(s.key) + '"' + (s.key === pdSelectedSkillKey ? ' selected' : '') + '>' +
          escapeHtml(pickLangTitle(s)) + ' (' + escapeHtml(s.nameEn) + ')' + (hasDmg ? '' : ' [辅助/光环]') +
        '</option>';
      }).join("") +
    '</optgroup>';
  }
  sel.innerHTML = html;
}

function renderActiveItemPreview() {
  const prevEl = document.getElementById("pd-item-preview");
  if (!prevEl) return;

  if (pdActiveTarget === "bag") {
    const bagItem = pdCharBag.find(x => x.uid === pdActiveBagUid);
    const def = bagItem ? getBagCharmDef(bagItem.charmId) : null;
    if (!bagItem || !def) {
      prevEl.innerHTML = '<div class="tz-empty" style="padding:12px">请点击左侧 10×4 背包中的任意咒符进行查看或调节变量</div>';
      return;
    }
    const clsObj = getActiveClassObj();
    let tabNote = "";
    if (def.isSkiller && clsObj && clsObj.tabs) {
      const t = clsObj.tabs.find(x => x.page === bagItem.tabPage) || clsObj.tabs[0];
      if (t) tabNote = " · 专精系别：" + t.zhCN;
    }
    const rawStats = getBagItemRawStats(bagItem, def);
    const rolled = rawStats ? formatItemLinesWithRolls(rawStats, bagItem.rolls) : [];
    const statHtml = rolled.length
      ? renderStatList(rolled.join(" · "), "#9ad8ff", false)
      : '<div style="font-size:11.5px;color:#7cb6ff">空白蓝装咒符（0 属性）— 请在上方蓝装前后缀构造器中手动选择最多 1 前缀 + 1 后缀</div>';
    prevEl.innerHTML =
      '<div class="it-set-bonus-box" style="margin-top:4px">' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">' +
          '<img src="' + escapeHtml(getBagCharmIcon(bagItem, def)) + '" alt="" style="width:30px;height:30px;object-fit:contain">' +
          '<div><strong style="color:' + (def.cat === "unique" ? "#ffd573" : "#7cb6ff") + '">' + escapeHtml(def.nameZh) + '</strong>' +
          '<div style="font-size:11px;color:var(--muted)">' + escapeHtml(def.nameEn) + ' · 占格 ' + def.w + '×' + def.h + escapeHtml(tabNote) + '</div></div>' +
        '</div>' +
        statHtml +
      '</div>';
    return;
  }

  const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
  const curEq = loadout[pdActiveSlot] || null;
  const info = curEq ? resolveEquippedItemInfo(curEq, getSlotResolveOpts(pdActiveTarget, pdActiveSlot)) : null;
  if (!info) {
    prevEl.innerHTML = '<div class="tz-empty" style="padding:12px">当前槽位未穿戴装备，请从上方下拉框选择放入</div>';
    return;
  }
  const isIllegal = !isEquippedItemLegal(pdActiveTarget, pdActiveSlot, curEq);
  const reqParts = [];
  if (info.reqStr > 0) {
    const redNote = info.reqStr < info.baseReqStr
      ? (" (原 " + info.baseReqStr + (info.extraReqReason ? ("，" + info.extraReqReason + " -" + info.extraReqReducePct + "%") : "") + (info.reqReducePct ? ("，装备 -" + info.reqReducePct + "%") : "") + ")")
      : "";
    reqParts.push("需力量 " + info.reqStr + redNote);
  }
  if (info.reqDex > 0) {
    const redNote = info.reqDex < info.baseReqDex ? (" (原 " + info.baseReqDex + ")") : "";
    reqParts.push("需敏捷 " + info.reqDex + redNote);
  }
  if (info.bRule && info.bRule.slot === "weapon" && (info.itemWeapMax > 0 || info.bRule.maxDmg > 0 || info.bRule.twoHandMax > 0)) {
    const dMin = info.itemWeapMax > 0 ? info.itemWeapMin : (info.bRule.minDmg || info.bRule.twoHandMin || 0);
    const dMax = info.itemWeapMax > 0 ? info.itemWeapMax : (info.bRule.maxDmg || info.bRule.twoHandMax || 0);
    reqParts.push("武器伤害 " + dMin + "–" + dMax);
  } else if (info.bRule && (info.itemDef > 0 || info.bRule.maxDef > 0)) {
    reqParts.push("防御 " + (info.itemDef > 0 ? info.itemDef : info.bRule.maxDef));
    if (info.bRule.block > 0) {
      reqParts.push("格挡 " + (info.itemDisplayBlock || info.bRule.block) + "%");
      if (info.bRule.maxDmg > 0) reqParts.push("盾击 " + (info.bRule.minDmg || 0) + "–" + info.bRule.maxDmg);
    }
  }
  const titleColor = curEq.cat === "magic" ? "#7cb6ff" : curEq.cat === "rare" ? "#f8e97a" : curEq.cat === "craft" ? "#ffaa4d" : curEq.cat === "set" ? "#67e87a" : "#ffd573";
  const actorLvlForPrev = pdActiveTarget === "merc"
    ? Number(document.getElementById("pd-merc-lvl")?.value || 90)
    : Number(document.getElementById("pd-char-lvl")?.value || 90);
  const allLines = info.rolledLines.concat(info.sockLines);
  const bodyHtml = allLines.length
    ? '<ul class="it-stat-list" style="color:#9ad8ff;margin:4px 0 0">' + allLines.map(l => '<li>' + renderStatLineWithLvlCalcHtml(l, actorLvlForPrev) + '</li>').join("") + '</ul>'
    : '<div style="font-size:11.5px;color:' + titleColor + '">当前为空白底材（0 属性），请在上方前后缀构造器中手动选择词缀</div>';
  prevEl.innerHTML =
    '<div class="it-set-bonus-box" style="margin-top:4px">' +
      (isIllegal ? '<div style="color:#ff9b8f;font-size:11.5px;margin-bottom:6px;font-weight:700">⚠️ 该装备不符合当前职业/主副手穿戴规则，未计入属性统计（可重新选择或卸下）</div>' : '') +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">' +
        (info.icon ? '<img src="' + escapeHtml(info.icon) + '" alt="" style="width:32px;height:32px;object-fit:contain">' : '') +
        '<div><strong style="color:' + titleColor + '">' + escapeHtml((curEq.eth ? "[无形] " : "") + info.titleZh) + '</strong>' +
        '<div style="font-size:11px;color:var(--muted)">' + escapeHtml(info.titleEn) + (reqParts.length ? (' · ' + reqParts.join(' · ')) : '') + '</div></div>' +
      '</div>' +
      bodyHtml +
    '</div>';
}

function renderAffixBuilder(itemObj, affixSlot, quality, clsObj, bRule) {
  const box = document.getElementById("pd-affix-builder");
  const titleEl = document.getElementById("pd-affix-builder-title");
  const lockEl = document.getElementById("pd-affix-lock-status");
  const preSel = document.getElementById("pd-affix-pre-select");
  const preBtn = document.getElementById("pd-affix-pre-add");
  const sufSel = document.getElementById("pd-affix-suf-select");
  const sufBtn = document.getElementById("pd-affix-suf-add");
  const listEl = document.getElementById("pd-affix-chosen-list");
  if (!box || !preSel || !sufSel || !listEl) return;

  if (!itemObj || !affixSlot || (quality !== "magic" && quality !== "rare" && quality !== "craft")) {
    box.style.display = "none";
    box._pdAffixCtx = null;
    return;
  }

  if (!Array.isArray(itemObj.prefixes)) itemObj.prefixes = [];
  if (!Array.isArray(itemObj.suffixes)) itemObj.suffixes = [];

  const isCraft = quality === "craft";
  const isRare = quality === "rare";
  const maxPre = (isRare || isCraft) ? 3 : 1;
  const maxSuf = (isRare || isCraft) ? 3 : 1;
  const maxTotal = isCraft ? 4 : (isRare ? 6 : 2);
  const totalChosen = itemObj.prefixes.length + itemObj.suffixes.length;
  const totalFull = totalChosen >= maxTotal;
  const preFull = itemObj.prefixes.length >= maxPre || totalFull;
  const sufFull = itemObj.suffixes.length >= maxSuf || totalFull;

  box.style.display = "flex";
  box.classList.toggle("is-rare", isRare);
  box.classList.toggle("is-craft", isCraft);
  if (titleEl) {
    titleEl.style.color = isCraft ? "#ffaa4d" : (isRare ? "#f8e97a" : "#7cb6ff");
    titleEl.textContent = isCraft
      ? "🟠 手工橙装随机词缀（固定配方 + 最多 4 条官方亮金词缀，前≤3 / 后≤3）"
      : (isRare
        ? "🟡 黄装前后缀自选（最多 3 前 + 3 后，共 6 条）"
        : "🔵 蓝装前后缀自选（最多 1 前 + 1 后，共 2 条）");
  }
  if (lockEl) {
    lockEl.textContent = isCraft
      ? ("随机词缀 " + totalChosen + "/4" + (totalFull ? " 🔒已满" : "") + "（前 " + itemObj.prefixes.length + "/3 · 后 " + itemObj.suffixes.length + "/3）")
      : ("前缀 " + itemObj.prefixes.length + "/" + maxPre + (preFull ? " 🔒已锁" : "") +
        " · 后缀 " + itemObj.suffixes.length + "/" + maxSuf + (sufFull ? " 🔒已锁" : ""));
  }
  const slotHintEl = document.getElementById("pd-affix-slot-hint");
  if (slotHintEl) {
    if (affixSlot === "helm") {
      slotHintEl.style.display = "block";
      slotHintEl.textContent = isCraft
        ? "💡 按 D2R 原版规则，手工头盔配方底材为普通头盔，不可出 +全职业技能 与 FCR；如需 2/20 头部，请切至「黄装/蓝装」并选择头环类底材（权冠 / 三重冠 / 宝冠 / 头环）。"
        : "💡 当前底材为普通头盔（按 D2R 原版规则不可出 +全职业技能 与 FCR）；如需 +2 技能 / +20% FCR / +30% FRW，请在上方底材中选择置顶的「权冠 / 三重冠 / 宝冠 / 头环」。";
    } else {
      slotHintEl.style.display = "none";
      slotHintEl.textContent = "";
    }
  }

  const pool = getMagicRareAffixPool(affixSlot, isCraft ? "rare" : quality, clsObj, bRule);
  const chosenPreIds = new Set(itemObj.prefixes.map(x => x.id));
  const chosenSufIds = new Set(itemObj.suffixes.map(x => x.id));
  const usedPreGroups = new Set(itemObj.prefixes.map(x => Number(x.g || 0)).filter(g => g > 0));
  const usedSufGroups = new Set(itemObj.suffixes.map(x => Number(x.g || 0)).filter(g => g > 0));
  const fq = pdAffixFilter.toLowerCase();
  const matchAf = (a) => !fq || String(a.nameZh || "").toLowerCase().includes(fq);

  const availPres = pool.prefixes.filter(a => !chosenPreIds.has(a.id) && !(a.g > 0 && usedPreGroups.has(a.g)) && matchAf(a));
  const availSufs = pool.suffixes.filter(a => !chosenSufIds.has(a.id) && !(a.g > 0 && usedSufGroups.has(a.g)) && matchAf(a));

  preSel.disabled = preFull;
  if (preBtn) preBtn.disabled = preFull || !availPres.length;
  preSel.innerHTML = preFull
    ? ('<option value="">🔒 ' + (totalFull && isCraft ? '手工随机词缀已满 (4/4) 已自动锁定' : ('前缀已满 (' + maxPre + '/' + maxPre + ') 已自动锁定')) + '</option>')
    : ('<option value="">-- 选择前缀 (' + availPres.length + ' 条官方词缀可选) --</option>' +
      availPres.map(a => '<option value="' + escapeHtml(a.id) + '">' + escapeHtml(a.nameZh) + '</option>').join(""));

  sufSel.disabled = sufFull;
  if (sufBtn) sufBtn.disabled = sufFull || !availSufs.length;
  sufSel.innerHTML = sufFull
    ? ('<option value="">🔒 ' + (totalFull && isCraft ? '手工随机词缀已满 (4/4) 已自动锁定' : ('后缀已满 (' + maxSuf + '/' + maxSuf + ') 已自动锁定')) + '</option>')
    : ('<option value="">-- 选择后缀 (' + availSufs.length + ' 条官方词缀可选) --</option>' +
      availSufs.map(a => '<option value="' + escapeHtml(a.id) + '">' + escapeHtml(a.nameZh) + '</option>').join(""));

  const chips = [];
  itemObj.prefixes.forEach((p, idx) => {
    chips.push('<div class="pd-affix-chip"><span><strong>[前缀 ' + (idx + 1) + ']</strong> ' + escapeHtml(p.nameZh) + '</span><button type="button" class="pd-affix-chip-del" data-del-type="prefix" data-del-idx="' + idx + '" title="移除此前缀">× 移除</button></div>');
  });
  itemObj.suffixes.forEach((s, idx) => {
    chips.push('<div class="pd-affix-chip is-suffix"><span><strong>[后缀 ' + (idx + 1) + ']</strong> ' + escapeHtml(s.nameZh) + '</span><button type="button" class="pd-affix-chip-del" data-del-type="suffix" data-del-idx="' + idx + '" title="移除此后缀">× 移除</button></div>');
  });
  listEl.innerHTML = chips.length
    ? chips.join("")
    : ('<div style="font-size:11px;color:var(--muted)">' + (isCraft
      ? '当前仅含手工固定配方词条，可从上方添加最多 4 条官方随机亮金前后缀（如 +2 本职业/单系技能、+10% FCR、伤害降低 PDR、全抗/单抗、生命/力量/MF 等）'
      : '尚未选择任何词缀，请从上方手动添加官方完整范围前缀/后缀（添加后可在下方滑动或直接输入精确数值）') + '</div>');

  listEl.querySelectorAll("[data-del-type]").forEach(btn => {
    btn.addEventListener("click", () => {
      const t = btn.dataset.delType;
      const idx = Number(btn.dataset.delIdx);
      preserveRollsAcrossAffixEdit(itemObj, () => {
        if (t === "prefix") itemObj.prefixes.splice(idx, 1);
        else itemObj.suffixes.splice(idx, 1);
      });
      renderPaperdollAll();
    });
  });

  box._pdAffixCtx = { itemObj, maxPre, maxSuf, maxTotal, pool };
}

function equipActiveSlot(cat, val, rwBaseCodeOverride) {
  const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
  if (!val) {
    loadout[pdActiveSlot] = null;
  } else if (cat === "rw") {
    const bCode = rwBaseCodeOverride || pdSelectedRwBaseCode || "uit";
    loadout[pdActiveSlot] = { cat: "rw", id: val, baseCode: bCode, eth: Boolean(document.getElementById("pd-item-eth")?.checked), sockets: [], rolls: {} };
  } else if (cat === "craft") {
    loadout[pdActiveSlot] = { cat: "craft", id: val, eth: false, prefixes: [], suffixes: [], sockets: [], rolls: {} };
  } else if (cat === "magic" || cat === "rare") {
    const isAcc = ["amulet", "ring1", "ring2"].includes(pdActiveSlot);
    loadout[pdActiveSlot] = { cat, id: val, baseCode: isAcc ? "" : val, eth: isAcc ? false : Boolean(document.getElementById("pd-item-eth")?.checked), prefixes: [], suffixes: [], sockets: [], rolls: {} };
  } else if (cat === "base") {
    loadout[pdActiveSlot] = { cat: "base", id: val, baseCode: val, eth: Boolean(document.getElementById("pd-item-eth")?.checked), sockets: [], rolls: {} };
  } else {
    loadout[pdActiveSlot] = { cat, id: val, eth: Boolean(document.getElementById("pd-item-eth")?.checked), sockets: [], rolls: {} };
  }
  renderPaperdollAll();
}

function renderSlidersForTarget(rawStats, rollsTarget) {
  const sliderSec = document.getElementById("pd-sliders-section");
  const sliderList = document.getElementById("pd-sliders-list");
  if (!sliderSec || !sliderList) return;
  const { vars } = extractVariableRanges(rawStats);
  if (vars.length > 0) {
    sliderSec.style.display = "block";
    sliderList.innerHTML = vars.map(v => {
      const curVal = (rollsTarget.rolls && rollsTarget.rolls[v.key] !== undefined) ? Number(rollsTarget.rolls[v.key]) : v.best;
      const displayLine = v.rawLine.replace(/([+-]?)\d+(?:\.\d+)?\s*[–-]\s*\d+(?:\.\d+)?/, "$1" + curVal);
      return '<div class="pd-slider-row">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px">' +
          '<span data-pd-roll-lbl="' + v.key + '" style="color:#cfe0fa;font-weight:700">' + escapeHtml(displayLine) + '</span>' +
          '<span style="color:#ffd584;font-size:11px">范围 [' + v.min + '–' + v.max + v.unit + ']' + (v.invertBest ? ' (越低越极品)' : '') + '</span>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px">' +
          '<input type="range" min="' + v.min + '" max="' + v.max + '" step="' + v.step + '" value="' + curVal + '" data-pd-roll-key="' + v.key + '" style="flex:1;accent-color:#f5cf7b" />' +
          '<input type="number" class="pd-alloc-input" min="' + v.min + '" max="' + v.max + '" step="' + v.step + '" value="' + curVal + '" data-pd-roll-num="' + v.key + '" title="可直接输入精确数值" style="width:58px" />' +
          (v.unit ? ('<span style="font-size:11px;color:#ffe08c;font-weight:700">' + v.unit + '</span>') : '') +
        '</div>' +
      '</div>';
    }).join("");
    const varMap = new Map(vars.map(v => [v.key, v]));
    const applyRollUpdate = (k, rawNum, fromNumInput) => {
      const v = varMap.get(k);
      if (!v) return;
      const clamped = Math.min(v.max, Math.max(v.min, Number(rawNum)));
      if (Number.isNaN(clamped)) return;
      if (!rollsTarget.rolls) rollsTarget.rolls = {};
      rollsTarget.rolls[k] = clamped;
      const lblEl = sliderList.querySelector('[data-pd-roll-lbl="' + k + '"]');
      const rngEl = sliderList.querySelector('[data-pd-roll-key="' + k + '"]');
      const numEl = sliderList.querySelector('[data-pd-roll-num="' + k + '"]');
      if (lblEl) lblEl.textContent = v.rawLine.replace(/([+-]?)\d+(?:\.\d+)?\s*[–-]\s*\d+(?:\.\d+)?/, "$1" + clamped);
      if (rngEl && fromNumInput) rngEl.value = String(clamped);
      if (numEl && !fromNumInput) numEl.value = String(clamped);
      if (/孔/.test(v.rawLine)) {
        renderPaperdollAll();
        return;
      }
      if (pdActiveTarget === "bag") renderInventoryBag();
      renderPaperdollLiveStats();
    };
    sliderList.querySelectorAll("[data-pd-roll-key]").forEach(rng => {
      rng.addEventListener("input", (e) => applyRollUpdate(e.target.dataset.pdRollKey, e.target.value, false));
    });
    sliderList.querySelectorAll("[data-pd-roll-num]").forEach(num => {
      num.addEventListener("change", (e) => applyRollUpdate(e.target.dataset.pdRollNum, e.target.value, true));
    });
  } else {
    sliderSec.style.display = "none";
  }
}

function createSearchableCombo(cfg) {
  const root = document.getElementById(cfg.rootId);
  const input = document.getElementById(cfg.inputId);
  const clearBtn = document.getElementById(cfg.clearId);
  const toggleBtn = document.getElementById(cfg.toggleId);
  const menu = document.getElementById(cfg.menuId);
  if (!root || !input || !menu) return null;

  const state = {
    items: [],
    selectedValue: "",
    selectedLabel: "",
    placeholder: "",
    isOpen: false,
    isFiltering: false,
    query: "",
    activeIdx: -1,
    renderedItems: [],
    onSelect: cfg.onSelect,
    extraItemsBuilder: null,
    emptyBuilder: null
  };

  const syncClearBtn = () => {
    if (!clearBtn) return;
    clearBtn.style.display = (state.isOpen && input.value.length > 0) ? "inline-flex" : "none";
  };

  const matchQuery = (searchText, q) => {
    if (!q) return true;
    const hay = String(searchText || "").toLowerCase();
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    return tokens.every(t => hay.includes(t));
  };

  const getFilteredItems = () => {
    const q = state.isFiltering ? state.query.trim() : "";
    let list = q ? state.items.filter(it => matchQuery(it.searchText, q)) : state.items.slice();
    if (q && typeof state.extraItemsBuilder === "function") {
      const extras = state.extraItemsBuilder(q) || [];
      if (extras.length) list = list.concat(extras);
    }
    return list;
  };

  const updateActiveHighlight = (shouldScroll) => {
    const opts = menu.querySelectorAll("[data-combo-idx]");
    opts.forEach(el => {
      const idx = Number(el.dataset.comboIdx);
      const isAct = idx === state.activeIdx;
      el.classList.toggle("is-active", isAct);
      if (isAct) {
        input.setAttribute("aria-activedescendant", el.id || "");
        if (shouldScroll && typeof el.scrollIntoView === "function") {
          el.scrollIntoView({ block: "nearest" });
        }
      }
    });
    if (state.activeIdx < 0) input.removeAttribute("aria-activedescendant");
  };

  const renderMenu = (scrollSelectedIntoView) => {
    const q = state.isFiltering ? state.query.trim() : "";
    const list = getFilteredItems();
    state.renderedItems = list;

    if (list.length === 0) {
      state.activeIdx = -1;
      input.removeAttribute("aria-activedescendant");
      if (typeof state.emptyBuilder === "function") {
        menu.innerHTML = state.emptyBuilder(q, api);
        menu.querySelectorAll("[data-jump-cat]").forEach(btn => {
          btn.addEventListener("mousedown", (e) => e.preventDefault());
          btn.addEventListener("click", () => {
            if (typeof cfg.onJump === "function") cfg.onJump(btn.dataset.jumpCat, btn.dataset.jumpBase, api);
          });
        });
      } else {
        menu.innerHTML = '<div class="pd-combo-empty">无匹配项，可点击右侧 × 清空重新浏览全部选项</div>';
      }
      return;
    }

    if (scrollSelectedIntoView && !q && state.selectedValue) {
      const selIdx = list.findIndex(it => it.value === state.selectedValue && !it.kind);
      state.activeIdx = selIdx >= 0 ? selIdx : 0;
    } else if (state.activeIdx < 0 || state.activeIdx >= list.length) {
      state.activeIdx = 0;
    }

    const metaText = q
      ? ('匹配 ' + list.length + ' / ' + state.items.length + ' 项')
      : ('共 ' + state.items.length + ' 项 · 直接输入筛选或滚轮浏览');
    const optPrefix = cfg.menuId + "-opt-";
    menu.innerHTML =
      '<div class="pd-combo-meta-bar"><span>' + escapeHtml(metaText) + '</span><span>↑↓ · Enter</span></div>' +
      list.map((it, idx) => {
        const isSel = !it.kind && state.selectedValue && it.value === state.selectedValue;
        const isAct = idx === state.activeIdx;
        const cls = "pd-combo-opt" + (isSel ? " is-selected" : "") + (isAct ? " is-active" : "") + (it.kind === "rw-base" ? " is-base-jump" : "");
        const tagHtml = isSel
          ? '<span class="pd-combo-opt-tag">✓ 已选</span>'
          : (it.tag ? ('<span class="pd-combo-opt-tag">' + escapeHtml(it.tag) + '</span>') : '');
        return '<button type="button" class="' + cls + '" id="' + optPrefix + idx + '" role="option" aria-selected="' + (isSel ? 'true' : 'false') + '" data-combo-idx="' + idx + '">' +
          '<span class="pd-combo-opt-main">' +
            '<span class="pd-combo-opt-title">' + escapeHtml(it.title) + '</span>' +
            (it.sub ? ('<span class="pd-combo-opt-sub">' + escapeHtml(it.sub) + '</span>') : '') +
          '</span>' +
          tagHtml +
        '</button>';
      }).join("");

    menu.querySelectorAll("[data-combo-idx]").forEach(btn => {
      btn.addEventListener("mousedown", (e) => e.preventDefault());
      btn.addEventListener("mouseenter", () => {
        state.activeIdx = Number(btn.dataset.comboIdx);
        updateActiveHighlight(false);
      });
      btn.addEventListener("click", () => {
        const picked = state.renderedItems[Number(btn.dataset.comboIdx)];
        if (picked) selectItem(picked);
      });
    });

    if (scrollSelectedIntoView) updateActiveHighlight(true);
  };

  const positionMenu = () => {
    const field = root.querySelector(".pd-combo-field") || input;
    const rect = field && typeof field.getBoundingClientRect === "function" ? field.getBoundingClientRect() : null;
    if (rect && typeof window !== "undefined" && window.innerHeight) {
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      menu.classList.toggle("open-up", spaceBelow < 220 && spaceAbove > spaceBelow);
    } else {
      menu.classList.remove("open-up");
    }
  };

  const open = (filtering) => {
    state.isOpen = true;
    state.isFiltering = Boolean(filtering);
    if (!state.isFiltering) state.query = "";
    root.classList.add("is-open");
    input.setAttribute("aria-expanded", "true");
    menu.hidden = false;
    menu.style.display = "block";
    positionMenu();
    renderMenu(!state.isFiltering);
    syncClearBtn();
  };

  const close = (restoreLabel) => {
    state.isOpen = false;
    state.isFiltering = false;
    state.query = "";
    state.activeIdx = -1;
    root.classList.remove("is-open");
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    menu.hidden = true;
    menu.style.display = "none";
    if (restoreLabel !== false) {
      input.value = state.selectedLabel || "";
    }
    syncClearBtn();
  };

  const selectItem = (item) => {
    close(false);
    if (!item.kind) {
      state.selectedValue = item.value;
      state.selectedLabel = item.displayLabel || item.title;
      input.value = state.selectedLabel;
    }
    if (typeof state.onSelect === "function") state.onSelect(item, api);
  };

  input.addEventListener("focus", () => {
    if (!state.isOpen) {
      open(false);
      if (input.value && typeof input.select === "function") {
        try { input.select(); } catch (e) {}
      }
    }
  });

  input.addEventListener("click", () => {
    if (!state.isOpen) open(false);
  });

  input.addEventListener("input", () => {
    state.query = input.value.trim();
    state.isFiltering = state.query.length > 0;
    state.activeIdx = 0;
    if (!state.isOpen) open(state.isFiltering);
    else {
      renderMenu(false);
      syncClearBtn();
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!state.isOpen) { open(false); return; }
      if (state.renderedItems.length) {
        state.activeIdx = (state.activeIdx + 1) % state.renderedItems.length;
        updateActiveHighlight(true);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!state.isOpen) { open(false); return; }
      if (state.renderedItems.length) {
        state.activeIdx = (state.activeIdx - 1 + state.renderedItems.length) % state.renderedItems.length;
        updateActiveHighlight(true);
      }
    } else if (e.key === "Enter") {
      if (!state.isOpen) return;
      e.preventDefault();
      const target = state.renderedItems[state.activeIdx] || state.renderedItems[0];
      if (target) selectItem(target);
    } else if (e.key === "Escape") {
      if (state.isOpen) {
        e.preventDefault();
        close(true);
      }
    }
  });

  input.addEventListener("blur", (e) => {
    if (e && e.relatedTarget && typeof root.contains === "function" && root.contains(e.relatedTarget)) return;
    close(true);
  });

  if (toggleBtn) {
    toggleBtn.addEventListener("mousedown", (e) => e.preventDefault());
    toggleBtn.addEventListener("click", () => {
      if (state.isOpen) {
        close(true);
      } else {
        if (typeof input.focus === "function") input.focus();
        open(false);
        if (input.value && typeof input.select === "function") {
          try { input.select(); } catch (e) {}
        }
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("mousedown", (e) => e.preventDefault());
    clearBtn.addEventListener("click", () => {
      input.value = "";
      state.query = "";
      state.isFiltering = false;
      state.activeIdx = 0;
      if (typeof input.focus === "function") input.focus();
      open(false);
    });
  }

  document.addEventListener("mousedown", (e) => {
    if (!state.isOpen) return;
    if (e && e.target && typeof root.contains === "function" && root.contains(e.target)) return;
    close(true);
  });

  const api = {
    setData(data) {
      state.items = Array.isArray(data.items) ? data.items : [];
      state.selectedValue = data.selectedValue || "";
      state.selectedLabel = data.selectedLabel || "";
      state.placeholder = data.placeholder || "";
      state.extraItemsBuilder = data.extraItemsBuilder || null;
      state.emptyBuilder = data.emptyBuilder || null;
      input.placeholder = state.placeholder;
      if (!state.isOpen) {
        input.value = state.selectedLabel || "";
        syncClearBtn();
      } else {
        renderMenu(false);
      }
    },
    open,
    close,
    selectItem,
    getState: () => state
  };
  return api;
}

function applyRwBaseSelection(bCode) {
  pdSelectedRwBaseCode = bCode;
  const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
  const cur = loadout[pdActiveSlot];
  if (cur && cur.cat === "rw") {
    const nextBase = getBaseRule(pdSelectedRwBaseCode);
    const rwObj = (rwList || []).find(x => x.id === cur.id);
    if (nextBase && rwObj && rwObj.sockets <= nextBase.maxSockets && doesRwTypeMatchBase(rwObj, nextBase)) {
      cur.baseCode = pdSelectedRwBaseCode;
    }
  }
  renderPaperdollAll();
}

function ensureSlotCombos() {
  if (!pdRwBaseCombo) {
    pdRwBaseCombo = createSearchableCombo({
      rootId: "pd-rw-base-combo",
      inputId: "pd-rw-base-input",
      clearId: "pd-rw-base-clear",
      toggleId: "pd-rw-base-toggle",
      menuId: "pd-rw-base-listbox",
      onSelect(item) {
        if (item && item.value) applyRwBaseSelection(item.value);
      }
    });
  }
  if (!pdItemCombo) {
    pdItemCombo = createSearchableCombo({
      rootId: "pd-item-combo",
      inputId: "pd-item-input",
      clearId: "pd-item-clear",
      toggleId: "pd-item-toggle",
      menuId: "pd-item-listbox",
      onSelect(item) {
        if (!item) return;
        if (item.kind === "rw-base") {
          applyRwBaseSelection(item.value);
        } else {
          equipActiveSlot(item.cat || pdActiveCat, item.value);
        }
      },
      onJump(targetCat, bCode, comboApi) {
        comboApi.close(false);
        pdActiveCat = targetCat;
        if (targetCat === "rw") {
          pdSelectedRwBaseCode = bCode;
          renderSlotEditor();
          comboApi.open(false);
        } else {
          equipActiveSlot(targetCat, bCode);
        }
      }
    });
  }
}

function renderCustomJewelInlineHtml(sockIdx, entry) {
  const ja = (pdData && pdData.jewelAffixes) || { prefixes: [], suffixes: [] };
  const isRare = entry.customJewel === "rare";
  if (!Array.isArray(entry.pre)) entry.pre = [];
  if (!Array.isArray(entry.suf)) entry.suf = [];
  if (!isRare) {
    const preItem = entry.pre[0] || null;
    const sufItem = entry.suf[0] || null;
    const preDef = preItem ? getJewelAffixDef("pre", preItem.id) : null;
    const sufDef = sufItem ? getJewelAffixDef("suf", sufItem.id) : null;
    const preVal = preDef ? clampJewelAffixVal(preDef, preItem.val, false) : 0;
    const sufVal = sufDef ? clampJewelAffixVal(sufDef, sufItem.val, false) : 0;
    return '<div class="pd-jewel-builder" data-jw-box="' + sockIdx + '">' +
      '<div class="pd-jewel-head"><strong style="color:#7cb6ff">💎 自定义蓝珠宝（自选 1 前缀 + 1 后缀 · 可填实际数值）</strong></div>' +
      '<div class="pd-jewel-row">' +
        '<label for="pd-jw-pre-' + sockIdx + '">前缀：</label>' +
        '<select id="pd-jw-pre-' + sockIdx + '" class="sim-select" data-jw-m-sel="pre" data-jw-sock="' + sockIdx + '" style="flex:1;min-width:140px;height:26px;font-size:11.5px">' +
          '<option value="">-- 无前缀 --</option>' +
          ja.prefixes.map(p => '<option value="' + escapeHtml(p.id) + '"' + (preItem && preItem.id === p.id ? ' selected' : '') + '>' + escapeHtml(p.nameZh + ' (' + p.min + (p.max > p.min ? ('–' + p.max) : '') + p.unit + ')') + '</option>').join("") +
        '</select>' +
        (preDef && preDef.max > preDef.min
          ? '<input type="number" inputmode="numeric" class="pd-jewel-val-inp" data-jw-m-val="pre" data-jw-sock="' + sockIdx + '" min="' + preDef.min + '" max="' + preDef.max + '" value="' + preVal + '" aria-label="前缀数值" /><span>' + escapeHtml(preDef.unit) + '</span>'
          : '') +
      '</div>' +
      '<div class="pd-jewel-row">' +
        '<label for="pd-jw-suf-' + sockIdx + '">后缀：</label>' +
        '<select id="pd-jw-suf-' + sockIdx + '" class="sim-select" data-jw-m-sel="suf" data-jw-sock="' + sockIdx + '" style="flex:1;min-width:140px;height:26px;font-size:11.5px">' +
          '<option value="">-- 无后缀 --</option>' +
          ja.suffixes.map(s => '<option value="' + escapeHtml(s.id) + '"' + (sufItem && sufItem.id === s.id ? ' selected' : '') + '>' + escapeHtml(s.nameZh + ' (' + s.min + (s.max > s.min ? ('–' + s.max) : '') + s.unit + ')') + '</option>').join("") +
        '</select>' +
        (sufDef && sufDef.max > sufDef.min
          ? '<input type="number" inputmode="numeric" class="pd-jewel-val-inp" data-jw-m-val="suf" data-jw-sock="' + sockIdx + '" min="' + sufDef.min + '" max="' + sufDef.max + '" value="' + sufVal + '" aria-label="后缀数值" /><span>' + escapeHtml(sufDef.unit) + '</span>'
          : '') +
      '</div>' +
    '</div>';
  }
  const total = entry.pre.length + entry.suf.length;
  const usedPreGroups = new Set(entry.pre.map(x => getJewelAffixDef("pre", x.id)?.group).filter(Boolean));
  const usedSufGroups = new Set(entry.suf.map(x => getJewelAffixDef("suf", x.id)?.group).filter(Boolean));
  const availPre = ja.prefixes.filter(p => !usedPreGroups.has(p.group));
  const availSuf = ja.suffixes.filter(s => !s.magicOnly && !usedSufGroups.has(s.group));
  const renderChips = (kind, arr) => arr.map((it, aIdx) => {
    const def = getJewelAffixDef(kind, it.id);
    if (!def) return "";
    const hi = def.rareMax || def.max;
    const v = clampJewelAffixVal(def, it.val, true);
    return '<div class="pd-jewel-chip">' +
      '<span><strong style="color:' + (kind === "pre" ? "#7cb6ff" : "#ffe08c") + '">' + (kind === "pre" ? "[前] " : "[后] ") + '</strong>' + escapeHtml(def.nameZh) + '</span>' +
      '<span style="display:inline-flex;align-items:center;gap:4px">' +
        (hi > def.min
          ? '<input type="number" inputmode="numeric" class="pd-jewel-val-inp" data-jw-r-val="' + kind + '" data-jw-sock="' + sockIdx + '" data-jw-idx="' + aIdx + '" min="' + def.min + '" max="' + hi + '" value="' + v + '" aria-label="' + escapeHtml(def.nameZh) + '数值" /><span>' + escapeHtml(def.unit) + '</span>'
          : '<span style="color:#ffd573;font-weight:700">' + v + escapeHtml(def.unit) + '</span>') +
        '<button type="button" class="rw-btn" data-jw-r-del="' + kind + '" data-jw-sock="' + sockIdx + '" data-jw-idx="' + aIdx + '" style="padding:1px 6px;font-size:11px" aria-label="移除' + escapeHtml(def.nameZh) + '">×</button>' +
      '</span>' +
    '</div>';
  }).join("");
  return '<div class="pd-jewel-builder is-rare" data-jw-box="' + sockIdx + '">' +
    '<div class="pd-jewel-head">' +
      '<strong style="color:#f8e97a">✨ 自定义黄珠宝（总 ' + total + '/4 · 前 ' + entry.pre.length + '/3 · 后 ' + entry.suf.length + '/3）</strong>' +
      '<span style="color:var(--muted)">遵循黄珠官方上限</span>' +
    '</div>' +
    ((entry.pre.length || entry.suf.length) ? '<div class="pd-jewel-chip-list">' + renderChips("pre", entry.pre) + renderChips("suf", entry.suf) + '</div>' : '') +
    (total < 4 && entry.pre.length < 3 && availPre.length
      ? '<div class="pd-jewel-row">' +
          '<label for="pd-jw-rpre-' + sockIdx + '">加前缀：</label>' +
          '<select id="pd-jw-rpre-' + sockIdx + '" class="sim-select" data-jw-r-add-sel="pre" data-jw-sock="' + sockIdx + '" style="flex:1;min-width:130px;height:26px;font-size:11.5px">' +
            availPre.map(p => '<option value="' + escapeHtml(p.id) + '">' + escapeHtml(p.nameZh + ' (' + p.min + ((p.rareMax || p.max) > p.min ? ('–' + (p.rareMax || p.max)) : '') + p.unit + ')') + '</option>').join("") +
          '</select>' +
          '<button type="button" class="rw-btn" data-jw-r-add-btn="pre" data-jw-sock="' + sockIdx + '" style="padding:2px 8px;font-size:11px">+ 前缀</button>' +
        '</div>'
      : '') +
    (total < 4 && entry.suf.length < 3 && availSuf.length
      ? '<div class="pd-jewel-row">' +
          '<label for="pd-jw-rsuf-' + sockIdx + '">加后缀：</label>' +
          '<select id="pd-jw-rsuf-' + sockIdx + '" class="sim-select" data-jw-r-add-sel="suf" data-jw-sock="' + sockIdx + '" style="flex:1;min-width:130px;height:26px;font-size:11.5px">' +
            availSuf.map(s => '<option value="' + escapeHtml(s.id) + '">' + escapeHtml(s.nameZh + ' (' + s.min + ((s.rareMax || s.max) > s.min ? ('–' + (s.rareMax || s.max)) : '') + s.unit + ')') + '</option>').join("") +
          '</select>' +
          '<button type="button" class="rw-btn" data-jw-r-add-btn="suf" data-jw-sock="' + sockIdx + '" style="padding:2px 8px;font-size:11px">+ 后缀</button>' +
        '</div>'
      : '') +
  '</div>';
}

function renderSlotEditor() {
  const titleEl = document.getElementById("pd-editor-title");
  const tipEl = document.getElementById("pd-editor-rule-tip");
  const unequipBtn = document.getElementById("pd-unequip-btn");
  const equipCtrl = document.getElementById("pd-equip-editor-controls");
  const bagCtrl = document.getElementById("pd-bag-editor-controls");
  const itemComboLabel = document.getElementById("pd-item-combo-label");
  const rwBaseRow = document.getElementById("pd-rw-base-row");
  const craftSkillRow = document.getElementById("pd-craft-skill-row");
  const ethCb = document.getElementById("pd-item-eth");
  const sockSec = document.getElementById("pd-sockets-section");
  const sockList = document.getElementById("pd-sockets-list");
  const sliderSec = document.getElementById("pd-sliders-section");
  if (!titleEl || !itData || !pdData) return;
  ensureSlotCombos();

  const clsObj = getActiveClassObj();

  // Bag Charm Editor Mode
  if (pdActiveTarget === "bag") {
    if (pdRwBaseCombo) pdRwBaseCombo.close(false);
    if (pdItemCombo) pdItemCombo.close(false);
    if (equipCtrl) equipCtrl.style.display = "none";
    if (bagCtrl) bagCtrl.style.display = "flex";
    if (sockSec) sockSec.style.display = "none";
    if (craftSkillRow) craftSkillRow.style.display = "none";
    if (unequipBtn) unequipBtn.textContent = "移出背包";

    const bagItem = pdCharBag.find(x => x.uid === pdActiveBagUid);
    const def = bagItem ? getBagCharmDef(bagItem.charmId) : null;
    if (!bagItem || !def) {
      titleEl.textContent = "角色背包咒符编辑器";
      tipEl.textContent = "请点击左侧 10×4 背包中的任意咒符，或点击装备槽位返回配装";
      if (sliderSec) sliderSec.style.display = "none";
      if (bagCtrl) bagCtrl.style.display = "none";
      renderAffixBuilder(null, "", "", clsObj, null);
      renderActiveItemPreview();
      return;
    }
    titleEl.textContent = "正在编辑背包：" + def.nameZh;
    tipEl.textContent = "占格尺寸：" + def.w + "×" + def.h + "（" + (def.isBlankMagic ? "蓝装空白咒符 · 手动选 1 前缀 + 1 后缀自动锁定" : (def.unique ? "唯一暗金/工具，限带 1 个" : "可多块叠加，受 40 格背包容量限制")) + "）";

    const skRow = document.getElementById("pd-bag-edit-skiller-row");
    const skSel = document.getElementById("pd-bag-edit-skiller-select");
    if (skRow && skSel) {
      if (def.isSkiller && clsObj && clsObj.tabs) {
        skRow.style.display = "flex";
        skSel.innerHTML = clsObj.tabs.map(t =>
          '<option value="' + t.page + '"' + (t.page === bagItem.tabPage ? ' selected' : '') + '>+1 ' + escapeHtml(t.zhCN) + '</option>'
        ).join("");
      } else {
        skRow.style.display = "none";
      }
    }
    const dupBtn = document.getElementById("pd-bag-dup-btn");
    if (dupBtn) {
      dupBtn.style.display = def.unique ? "none" : "inline-block";
    }
    const sizeTip = document.getElementById("pd-bag-item-size-tip");
    if (sizeTip) sizeTip.textContent = def.isBlankMagic ? "选择前后缀后，下方自动生成精确变量滑块" : "背包位置实时生效于人物属性与技能面板";

    if (def.isBlankMagic) {
      renderAffixBuilder(bagItem, def.affixSlot, "magic", clsObj, null);
    } else {
      renderAffixBuilder(null, "", "", clsObj, null);
    }
    renderSlidersForTarget(getBagItemRawStats(bagItem, def), bagItem);
    renderActiveItemPreview();
    return;
  }

  // Equipment Slot Editor Mode
  if (equipCtrl) equipCtrl.style.display = "flex";
  if (bagCtrl) bagCtrl.style.display = "none";
  if (unequipBtn) unequipBtn.textContent = "卸下该槽位";

  const merc = getCurrentMercVariant();
  const slotDefs = pdActiveTarget === "char" ? PD_CHAR_SLOTS : PD_MERC_SLOTS;
  const slotObj = slotDefs.find(s => s.id === pdActiveSlot) || slotDefs[0];
  const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
  const actorLabel = pdActiveTarget === "char"
    ? ("角色（" + (clsObj ? clsObj.nameZh : "术士") + "）")
    : ("佣兵（Act " + merc.act + "）");
  titleEl.textContent = "正在编辑：" + actorLabel + " · " + slotObj.label;
  tipEl.textContent = getSlotRuleDescription(pdActiveTarget, pdActiveSlot);

  const isNoSocketSlot = ["amulet", "ring1", "ring2", "gloves", "boots", "belt"].includes(pdActiveSlot);
  if (isNoSocketSlot && (pdActiveCat === "rw" || pdActiveCat === "base")) {
    pdActiveCat = "unique";
  }
  document.querySelectorAll("#pd-cat-chips [data-pd-cat]").forEach(btn => {
    const c = btn.dataset.pdCat;
    btn.disabled = isNoSocketSlot && (c === "rw" || c === "base");
    btn.style.opacity = btn.disabled ? ".38" : "1";
    btn.classList.toggle("active", c === pdActiveCat);
  });

  const curEq = loadout[pdActiveSlot] || null;
  if (ethCb) ethCb.checked = Boolean(curEq && curEq.eth);

  const allLegalBases = Object.values(pdData.baseRules || {})
    .filter(b => isBaseRuleLegalForTargetSlot(pdActiveTarget, pdActiveSlot, b))
    .sort((a, b) => {
      const ta = getBaseTierMeta(a).rank;
      const tb = getBaseTierMeta(b).rank;
      if (tb !== ta) return tb - ta;
      const ca = a.classOnly ? 1 : 0;
      const cb = b.classOnly ? 1 : 0;
      if (cb !== ca) return cb - ca;
      return (Number(b.reqLvl || 0) - Number(a.reqLvl || 0)) || String(a.nameZh || "").localeCompare(String(b.nameZh || ""));
    });
  const legalSocketBases = allLegalBases.filter(b => b.maxSockets > 0);
  const matchTokens = (text, q) => {
    const hay = String(text || "").toLowerCase();
    return String(q || "").toLowerCase().split(/\s+/).filter(Boolean).every(t => hay.includes(t));
  };
  const buildCrossBaseEmptyHtml = (q) => {
    const crossBases = q ? allLegalBases.filter(b => matchTokens(getBaseSearchText(b), q)) : [];
    if (crossBases.length && !isNoSocketSlot) {
      return '<div class="pd-combo-empty">' +
        '<span>当前分类无匹配，但命中 ' + crossBases.length + ' 种底材：</span>' +
        '<div class="pd-combo-jump-row">' +
          '<button type="button" class="pd-search-hit is-base-hit" data-jump-cat="rw" data-jump-base="' + escapeHtml(crossBases[0].code) + '">切到符文之语选用「' + escapeHtml(crossBases[0].nameZh) + '」</button>' +
          '<button type="button" class="pd-search-hit" data-jump-cat="rare" data-jump-base="' + escapeHtml(crossBases[0].code) + '">以此底材建黄装</button>' +
          '<button type="button" class="pd-search-hit" data-jump-cat="magic" data-jump-base="' + escapeHtml(crossBases[0].code) + '">以此底材建蓝装</button>' +
        '</div>' +
      '</div>';
    }
    return '<div class="pd-combo-empty">当前槽位与分类下无匹配项，可点击 × 清空或切换上方品质标签</div>';
  };

  const catLabels = {
    rw: "符文之语：",
    unique: "暗金装备：",
    set: "绿色套装：",
    craft: "手工橙装：",
    magic: ["amulet", "ring1", "ring2"].includes(pdActiveSlot) ? "蓝装首饰：" : "蓝装底材：",
    rare: ["amulet", "ring1", "ring2"].includes(pdActiveSlot) ? "黄装首饰：" : "黄装底材：",
    base: "打孔底材："
  };
  if (itemComboLabel) itemComboLabel.textContent = catLabels[pdActiveCat] || "选择装备：";

  let comboItems = [];
  let selectedVal = "";
  let selectedLabel = "";
  let comboPlaceholder = "输入关键词筛选，或直接点击下拉浏览...";
  let extraItemsBuilder = null;
  let emptyBuilder = buildCrossBaseEmptyHtml;

  if (pdActiveCat === "rw") {
    if (rwBaseRow) rwBaseRow.style.display = "flex";
    let curBaseCode = "";
    if (pdSelectedRwBaseCode && legalSocketBases.some(b => b.code === pdSelectedRwBaseCode)) {
      curBaseCode = pdSelectedRwBaseCode;
    } else if (curEq && curEq.baseCode && legalSocketBases.some(b => b.code === curEq.baseCode)) {
      curBaseCode = curEq.baseCode;
    } else {
      curBaseCode = legalSocketBases[legalSocketBases.length - 1]?.code || "";
    }
    pdSelectedRwBaseCode = curBaseCode;
    const activeBase = getBaseRule(curBaseCode) || legalSocketBases[0];
    if (pdRwBaseCombo) {
      const clsBlkFactor = (pdData && pdData.charBaseStats && pdData.charBaseStats[skActiveClassId] && pdData.charBaseStats[skActiveClassId].blockFactor) || 25;
      const baseItems = legalSocketBases.map(b => {
        const blkInfo = b.block > 0 ? (" · 格挡 " + (b.block + clsBlkFactor) + "%") : "";
        const tm = getBaseTierMeta(b);
        const shortType = (PD_BASE_TYPE_LABELS[b.type] || "").split(" ")[0] || "";
        return {
          value: b.code,
          title: b.nameZh,
          displayLabel: "[" + tm.label + "] " + b.nameZh + " (" + b.maxSockets + "孔 · 需力" + b.reqStr + blkInfo + ")",
          sub: tm.label + (shortType ? (" · " + shortType) : "") + " · " + b.nameEn + " · 最多 " + b.maxSockets + "孔 · 需力 " + b.reqStr + blkInfo,
          tag: tm.label + "·" + b.maxSockets + "孔",
          searchText: getBaseSearchText(b) + " " + b.maxSockets + "孔 " + b.reqStr
        };
      });
      const activeBaseItem = baseItems.find(x => x.value === curBaseCode);
      pdRwBaseCombo.setData({
        items: baseItems,
        selectedValue: curBaseCode,
        selectedLabel: activeBaseItem ? activeBaseItem.displayLabel : "",
        placeholder: "输入搜底材/别名（巨神长柄斧、连枷、统盾...），或点击下拉 (" + baseItems.length + " 种)"
      });
    }
    const validRws = (rwList || []).filter(rw => {
      if (!activeBase || rw.sockets > activeBase.maxSockets) return false;
      return doesRwTypeMatchBase(rw, activeBase);
    });
    comboItems = validRws.map(rw => {
      const title = pickLangTitle(rw);
      const rwStatTxt = getRunewordStatLines(rw, activeBase).join(" ");
      return {
        value: rw.id,
        cat: "rw",
        title: title,
        displayLabel: title + " (" + rw.name + " · " + rw.sockets + "孔)",
        sub: rw.name + " · " + rw.sockets + "孔" + (rw.basesZh ? (" · " + rw.basesZh) : ""),
        tag: rw.sockets + "孔",
        searchText: rw.zhName + " " + rw.name + " " + (rw.basesZh || "") + " " + rw.sockets + "孔 " + rwStatTxt
      };
    });
    if (curEq && curEq.cat === "rw") {
      selectedVal = curEq.id;
      const hit = comboItems.find(x => x.value === curEq.id);
      selectedLabel = hit ? hit.displayLabel : "";
    }
    comboPlaceholder = "输入搜符文之语或直接下拉选择 (" + comboItems.length + " 个可用)...";
    extraItemsBuilder = (q) => legalSocketBases
      .filter(b => matchTokens(getBaseSearchText(b), q))
      .slice(0, 6)
      .map(b => ({
        kind: "rw-base",
        value: b.code,
        title: "🎯 切换底材：" + b.nameZh,
        sub: b.nameEn + " · 最多 " + b.maxSockets + "孔 · 需力 " + b.reqStr,
        tag: "切底材"
      }));
  } else {
    if (rwBaseRow) rwBaseRow.style.display = "none";
    if (pdRwBaseCombo) pdRwBaseCombo.close(false);

    if (pdActiveCat === "unique") {
      const validUniques = (itData.uniqueItems || []).filter(u => {
        if (pdActiveSlot === "amulet") return u.slot === "amulet";
        if (pdActiveSlot === "ring1" || pdActiveSlot === "ring2") return u.slot === "ring";
        const m = pdData.uniqueMeta && pdData.uniqueMeta[u.nameEn];
        const b = m ? getBaseRule(m.code) : null;
        return isBaseRuleLegalForTargetSlot(pdActiveTarget, pdActiveSlot, b);
      });
      comboItems = validUniques.map(u => {
        const m = pdData.uniqueMeta && pdData.uniqueMeta[u.nameEn];
        const b = m ? getBaseRule(m.code) : null;
        const title = pickLangTitle(u);
        return {
          value: u.nameEn,
          cat: "unique",
          title: title,
          displayLabel: title + " (" + u.nameEn + ")",
          sub: u.nameEn + (b ? (" · " + b.nameZh) : ""),
          searchText: u.nameZh + " " + u.nameEn + " " + u.stats + " " + getBaseSearchText(b)
        };
      });
      if (curEq && curEq.cat === "unique") {
        selectedVal = curEq.id;
        const hit = comboItems.find(x => x.value === curEq.id);
        selectedLabel = hit ? hit.displayLabel : "";
      }
      comboPlaceholder = "输入搜暗金装备/属性，或点击下拉选择 (" + comboItems.length + " 件可用)...";
    } else if (pdActiveCat === "set") {
      const allSetPieces = [];
      for (const s of (itData.setItems || [])) {
        for (const p of ((s.detail && s.detail.pieces) || [])) {
          allSetPieces.push({ p, s });
        }
      }
      const validPieces = allSetPieces.filter(({ p }) => {
        if (pdActiveSlot === "amulet") return p.slotZh.includes("项链") || p.slotZh.includes("护身符");
        if (pdActiveSlot === "ring1" || pdActiveSlot === "ring2") return p.slotZh.includes("戒指");
        const m = pdData.setMeta && pdData.setMeta[p.nameEn];
        const b = m ? getBaseRule(m.code) : null;
        return isBaseRuleLegalForTargetSlot(pdActiveTarget, pdActiveSlot, b);
      });
      comboItems = validPieces.map(({ p, s }) => {
        const m = pdData.setMeta && pdData.setMeta[p.nameEn];
        const b = m ? getBaseRule(m.code) : null;
        const title = pickLangTitle(p);
        return {
          value: p.nameEn,
          cat: "set",
          title: title,
          displayLabel: title + " [" + s.nameZh + "]",
          sub: s.nameZh + " · " + p.nameEn + (b ? (" · " + b.nameZh) : ""),
          searchText: p.nameZh + " " + p.nameEn + " " + s.nameZh + " " + (p.stats || []).join(" ") + " " + getBaseSearchText(b)
        };
      });
      if (curEq && curEq.cat === "set") {
        selectedVal = curEq.id;
        const hit = comboItems.find(x => x.value === curEq.id);
        selectedLabel = hit ? hit.displayLabel : "";
      }
      comboPlaceholder = "输入搜绿色套装/部位，或点击下拉选择 (" + comboItems.length + " 件可用)...";
    } else if (pdActiveCat === "craft") {
      const validCrafts = (pdData.craftedItems || []).filter(c => {
        if (pdActiveSlot === "amulet") return c.slot === "amulet";
        if (pdActiveSlot === "ring1" || pdActiveSlot === "ring2") return c.slot === "ring";
        const b = c.code ? getBaseRule(c.code) : null;
        return isBaseRuleLegalForTargetSlot(pdActiveTarget, pdActiveSlot, b);
      });
      comboItems = validCrafts.map(c => ({
        value: c.id,
        cat: "craft",
        title: "[" + c.recipe + "] " + c.nameZh,
        displayLabel: "[" + c.recipe + "] " + c.nameZh,
        sub: c.nameEn + " · " + c.stats,
        searchText: c.nameZh + " " + c.nameEn + " " + c.recipe + " " + c.stats
      }));
      if (curEq && curEq.cat === "craft") {
        selectedVal = curEq.id;
        const hit = comboItems.find(x => x.value === curEq.id);
        selectedLabel = hit ? hit.displayLabel : "";
      }
      comboPlaceholder = "输入搜手工橙装配方，或点击下拉选择 (" + comboItems.length + " 件可用)...";
    } else if (pdActiveCat === "magic" || pdActiveCat === "rare") {
      const isM = pdActiveCat === "magic";
      const qLabel = isM ? "蓝装" : "黄装";
      if (pdActiveSlot === "amulet") {
        const accId = isM ? "__magic_amulet__" : "__rare_amulet__";
        comboItems = [{
          value: accId,
          cat: pdActiveCat,
          title: "空白" + qLabel + "护身符(项链)",
          displayLabel: "空白" + qLabel + "护身符(项链)",
          sub: "0 初始属性 · 放入后在下方自选官方前后缀",
          searchText: "项链 护身符 amulet " + qLabel
        }];
        if (curEq && curEq.cat === pdActiveCat && curEq.id === accId) {
          selectedVal = accId;
          selectedLabel = comboItems[0].displayLabel;
        }
        comboPlaceholder = "点击放入空白" + qLabel + "项链（放入后自选词缀）";
      } else if (pdActiveSlot === "ring1" || pdActiveSlot === "ring2") {
        const accId = isM ? "__magic_ring__" : "__rare_ring__";
        comboItems = [{
          value: accId,
          cat: pdActiveCat,
          title: "空白" + qLabel + "戒指",
          displayLabel: "空白" + qLabel + "戒指",
          sub: "0 初始属性 · 放入后在下方自选官方前后缀",
          searchText: "戒指 ring " + qLabel
        }];
        if (curEq && curEq.cat === pdActiveCat && curEq.id === accId) {
          selectedVal = accId;
          selectedLabel = comboItems[0].displayLabel;
        }
        comboPlaceholder = "点击放入空白" + qLabel + "戒指（放入后自选词缀）";
      } else {
        const orderedBases = (pdActiveSlot === "head")
          ? allLegalBases.slice().sort((a, b) => {
              const aCirc = a.type === "circ" ? 1 : 0;
              const bCirc = b.type === "circ" ? 1 : 0;
              if (bCirc !== aCirc) return bCirc - aCirc;
              if (aCirc && bCirc) return (Number(b.reqLvl || 0) - Number(a.reqLvl || 0));
              return 0;
            })
          : allLegalBases;
        comboItems = orderedBases.map(b => {
          const tm = getBaseTierMeta(b);
          const shortType = (PD_BASE_TYPE_LABELS[b.type] || "").split(" ")[0] || "";
          const isCirc = b.type === "circ";
          const circNote = isCirc ? " · 可出+2技能/20FCR" : "";
          return {
            value: b.code,
            cat: pdActiveCat,
            title: b.nameZh + (isCirc ? " ★可出+2技能/20FCR" : ""),
            displayLabel: "[" + tm.label + "] " + b.nameZh + " (" + b.nameEn + (b.maxSockets > 0 ? (" · 最多" + b.maxSockets + "孔") : "") + ")",
            sub: tm.label + (shortType ? (" · " + shortType) : "") + circNote + " · " + b.nameEn + (b.maxSockets > 0 ? (" · 最多 " + b.maxSockets + "孔") : "") + " · 需力 " + b.reqStr,
            tag: isCirc ? ("头环·" + b.maxSockets + "孔") : (tm.label + (b.maxSockets > 0 ? ("·" + b.maxSockets + "孔") : "")),
            searchText: getBaseSearchText(b) + " " + b.reqStr + (isCirc ? " 技能 FCR 2/20 220 头环" : "")
          };
        });
        if (curEq && curEq.cat === pdActiveCat) {
          selectedVal = curEq.baseCode || curEq.id;
          const hit = comboItems.find(x => x.value === selectedVal);
          selectedLabel = hit ? hit.displayLabel : "";
        }
        comboPlaceholder = "输入搜" + qLabel + "底材（支持搜 精华/弓/亚马逊/大院长...），或下拉浏览 (" + comboItems.length + " 种)...";
      }
    } else if (pdActiveCat === "base") {
      comboItems = legalSocketBases.map(b => {
        const tm = getBaseTierMeta(b);
        const shortType = (PD_BASE_TYPE_LABELS[b.type] || "").split(" ")[0] || "";
        return {
          value: b.code,
          cat: "base",
          title: b.nameZh,
          displayLabel: "[" + tm.label + "] " + b.nameZh + " (" + b.nameEn + " · 最大 " + b.maxSockets + "孔)",
          sub: tm.label + (shortType ? (" · " + shortType) : "") + " · " + b.nameEn + " · 最大 " + b.maxSockets + "孔 · 需力 " + b.reqStr,
          tag: tm.label + "·" + b.maxSockets + "孔",
          searchText: getBaseSearchText(b) + " " + b.maxSockets + "孔 " + b.reqStr
        };
      });
      if (curEq && curEq.cat === "base") {
        selectedVal = curEq.baseCode || curEq.id;
        const hit = comboItems.find(x => x.value === selectedVal);
        selectedLabel = hit ? hit.displayLabel : "";
      }
      comboPlaceholder = "输入搜打孔底材/别名，或点击下拉选择 (" + comboItems.length + " 种)...";
    }
  }

  if (pdItemCombo) {
    pdItemCombo.setData({
      items: comboItems,
      selectedValue: selectedVal,
      selectedLabel: selectedLabel,
      placeholder: comboPlaceholder,
      extraItemsBuilder: extraItemsBuilder,
      emptyBuilder: emptyBuilder
    });
  }

  // Crafted items now use the full Official Rare Affix Builder (up to 4 random affixes including +1~2 Class/Tab skills!), so hide the legacy standalone craft-skill dropdown
  if (craftSkillRow) {
    craftSkillRow.style.display = "none";
  }

  const info = curEq ? resolveEquippedItemInfo(curEq, getSlotResolveOpts(pdActiveTarget, pdActiveSlot)) : null;
  const supRow = document.getElementById("pd-superior-row");
  if (supRow) {
    const canSup = Boolean(curEq && info && info.bRule && (curEq.cat === "rw" || curEq.cat === "base") && (info.bRule.slot === "weapon" || info.bRule.maxDef > 0));
    supRow.style.display = canSup ? "flex" : "none";
    if (canSup) {
      const isWeap = info.bRule.slot === "weapon";
      const supTitle = document.getElementById("pd-sup-title");
      if (supTitle) {
        const isBow = info.bRule.type === "bow" || info.bRule.type === "abow" || info.bRule.type === "xbow";
        supTitle.textContent = isBow
          ? "✨ 超强弓弩底材 (Superior · 强化伤害/准确率)："
          : isWeap
            ? "✨ 超强武器底材 (Superior · 强化伤害/准确率)："
            : "✨ 超强防具/盾牌底材 (Superior · 强化防御)：";
      }
      const edWrap = document.getElementById("pd-sup-ed-wrap");
      const arWrap = document.getElementById("pd-sup-ar-wrap");
      const defWrap = document.getElementById("pd-sup-def-wrap");
      if (edWrap) edWrap.style.display = isWeap ? "inline-flex" : "none";
      if (arWrap) arWrap.style.display = isWeap ? "inline-flex" : "none";
      if (defWrap) defWrap.style.display = isWeap ? "none" : "inline-flex";
      const edInp = document.getElementById("pd-sup-ed");
      const arInp = document.getElementById("pd-sup-ar");
      const defInp = document.getElementById("pd-sup-def");
      if (edInp && document.activeElement !== edInp) edInp.value = String(Math.min(15, Math.max(0, Math.floor(Number(curEq.supEd || 0)))));
      if (arInp && document.activeElement !== arInp) arInp.value = String(Math.min(3, Math.max(0, Math.floor(Number(curEq.supAr || 0)))));
      if (defInp && document.activeElement !== defInp) defInp.value = String(Math.min(15, Math.max(0, Math.floor(Number(curEq.supDef || 0)))));
    }
  }
  const palRow = document.getElementById("pd-pal-shield-row");
  if (palRow) {
    const canPalMod = Boolean(curEq && info && info.bRule && info.bRule.type === "ashd" && ["rw", "base", "magic", "rare", "craft"].includes(curEq.cat));
    palRow.style.display = canPalMod ? "flex" : "none";
    if (canPalMod) {
      const mode = curEq.palModType === "dmg" ? "dmg" : "res";
      const rRes = document.getElementById("pd-pal-mod-res");
      const rDmg = document.getElementById("pd-pal-mod-dmg");
      if (rRes) rRes.checked = mode === "res";
      if (rDmg) rDmg.checked = mode === "dmg";
      const resWrap = document.getElementById("pd-pal-res-wrap");
      const dmgWrap = document.getElementById("pd-pal-dmg-wrap");
      if (resWrap) resWrap.style.display = mode === "res" ? "inline-flex" : "none";
      if (dmgWrap) dmgWrap.style.display = mode === "dmg" ? "inline-flex" : "none";
      const resInp = document.getElementById("pd-pal-res");
      const edInp = document.getElementById("pd-pal-ed");
      const arInp = document.getElementById("pd-pal-ar");
      if (resInp && document.activeElement !== resInp) resInp.value = String(Math.min(45, Math.max(0, Math.floor(Number(curEq.palRes || 0)))));
      if (edInp && document.activeElement !== edInp) edInp.value = String(Math.min(65, Math.max(0, Math.floor(Number(curEq.palEd || 0)))));
      if (arInp && document.activeElement !== arInp) arInp.value = String(Math.min(121, Math.max(0, Math.floor(Number(curEq.palAr || 0)))));
      const blkHint = document.getElementById("pd-pal-block-hint");
      if (blkHint) blkHint.textContent = "底材格挡 " + (info.itemDisplayBlock || (info.bRule.block + 30)) + "% · 盾击 " + (info.bRule.minDmg || 0) + "–" + (info.bRule.maxDmg || 0);
    }
  }
  const autoRow = document.getElementById("pd-base-automod-row");
  if (autoRow) {
    const autoSpec = (curEq && info && info.bRule && ["rw", "base", "magic", "rare", "craft"].includes(curEq.cat))
      ? getBaseAutomodSpec(info.bRule)
      : null;
    autoRow.style.display = autoSpec ? "flex" : "none";
    if (autoSpec) {
      const legEl = document.getElementById("pd-base-automod-legend");
      if (legEl) legEl.textContent = autoSpec.legend;
      const tabWrap = document.getElementById("pd-base-automod-tab-wrap");
      const smWrap = document.getElementById("pd-base-staffmod-wrap");
      if (autoSpec.mode === "tab") {
        if (tabWrap) tabWrap.style.display = "flex";
        if (smWrap) smWrap.style.display = "none";
        const lblEl = document.getElementById("pd-base-auto-tab-label");
        if (lblEl) lblEl.textContent = autoSpec.tabLabel;
        const inpEl = document.getElementById("pd-base-auto-tab-lvl");
        if (inpEl && document.activeElement !== inpEl) {
          inpEl.value = String(Math.min(autoSpec.max || 3, Math.max(0, Math.floor(Number(curEq.autoTabLvl || 0)))));
        }
      } else if (autoSpec.mode === "staffmod") {
        if (tabWrap) tabWrap.style.display = "none";
        if (smWrap) {
          smWrap.style.display = "flex";
          const clsForMod = (skClasses || []).find(c => c.id === autoSpec.classId);
          const skillsList = (clsForMod && Array.isArray(clsForMod.skills)) ? clsForMod.skills : [];
          const curMods = Array.isArray(curEq.baseStaffmods) ? curEq.baseStaffmods : [];
          let smHtml = "";
          for (let i = 0; i < 3; i++) {
            const entry = curMods[i] || { key: "", lvl: 3 };
            const optsHtml = '<option value="">-- 原生技能位 #' + (i + 1) + '（空）--</option>' +
              skillsList.map(sk => '<option value="' + escapeHtml(sk.key) + '"' + (sk.key === entry.key ? ' selected' : '') + '>' + escapeHtml(sk.nameZh) + ' (' + escapeHtml(sk.key) + ')</option>').join("");
            smHtml += '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">' +
              '<select class="sim-select" data-pd-sm-key="' + i + '" style="flex:1;min-width:150px;height:26px;font-size:11.5px">' + optsHtml + '</select>' +
              '<select class="sim-select" data-pd-sm-lvl="' + i + '" style="width:66px;height:26px;font-size:11.5px">' +
                '<option value="3"' + (Number(entry.lvl || 3) === 3 ? ' selected' : '') + '>+3 级</option>' +
                '<option value="2"' + (Number(entry.lvl) === 2 ? ' selected' : '') + '>+2 级</option>' +
                '<option value="1"' + (Number(entry.lvl) === 1 ? ' selected' : '') + '>+1 级</option>' +
              '</select>' +
            '</div>';
          }
          smWrap.innerHTML = smHtml;
          const commitSm = () => {
            const next = [];
            for (let i = 0; i < 3; i++) {
              const kEl = smWrap.querySelector('[data-pd-sm-key="' + i + '"]');
              const lEl = smWrap.querySelector('[data-pd-sm-lvl="' + i + '"]');
              if (kEl && kEl.value) {
                next.push({ key: kEl.value, lvl: Math.min(3, Math.max(1, Number((lEl && lEl.value) || 3))) });
              }
            }
            curEq.baseStaffmods = next;
            renderPaperdollAll();
          };
          smWrap.querySelectorAll("select").forEach(sel => sel.addEventListener("change", commitSm));
        }
      }
    }
  }
  if (!info) {
    renderAffixBuilder(null, "", "", clsObj, null);
    sockSec.style.display = "none";
    sliderSec.style.display = "none";
    renderActiveItemPreview();
    return;
  }

  // Render Magic / Rare / Crafted Affix Builder for equipped Magic, Rare, or Crafted gear
  if (curEq.cat === "magic" || curEq.cat === "rare" || curEq.cat === "craft") {
    const afSlot = getAffixSlotForEquip(pdActiveSlot, info.bRule);
    renderAffixBuilder(curEq, afSlot, curEq.cat, clsObj, info.bRule);
  } else {
    renderAffixBuilder(null, "", "", clsObj, null);
  }

  // Render dynamic sockets (supports Runes, Perfect Gems, Preset Jewels, and Custom Magic/Rare Jewel Prefix+Suffix Builder)
  if (info.maxSocks > 0) {
    sockSec.style.display = "block";
    document.getElementById("pd-max-sock-num").textContent = String(info.maxSocks);
    const applyType = info.bRule ? info.bRule.gemApplyType : 0;
    const applyLabel = applyType === 2 ? "盾牌/魔典镶嵌属性" : applyType === 1 ? "头盔/盔甲镶嵌属性" : "武器镶嵌属性";
    document.getElementById("pd-sock-mode-tip").textContent = "生效部位：" + applyLabel;

    const allSocks = pdData.socketables || [];
    const jewelPresets = allSocks.filter(x => x.kind === "jewel");
    const runeSocks = allSocks.filter(x => x.kind === "rune");
    const gemSocks = allSocks.filter(x => x.kind === "gem");
    const renderOptList = (arr, selVal) => arr.map(sk => {
      const eff = applyType === 2 ? sk.shield : applyType === 1 ? sk.helm : sk.weapon;
      return '<option value="' + escapeHtml(sk.id) + '"' + (sk.id === selVal ? ' selected' : '') + '>' +
        escapeHtml(sk.nameZh) + ' — ' + escapeHtml(eff) +
      '</option>';
    }).join("");

    let sockRowsHtml = "";
    for (let i = 0; i < info.maxSocks; i++) {
      const curEntry = (curEq.sockets && curEq.sockets[i]) || "";
      const isCust = isCustomJewelSocket(curEntry);
      const curSelVal = isCust ? (curEntry.customJewel === "rare" ? "__jw_rare__" : "__jw_magic__") : curEntry;
      const jInfo = isCust ? resolveCustomJewelInfo(curEntry) : null;
      const sObj = !isCust ? allSocks.find(x => x.id === curEntry) : null;
      const ico = (jInfo && jInfo.icon) || (sObj && sObj.icon) || "/images/ui/gemsocket.webp";
      sockRowsHtml += '<div class="pd-sock-slot-box">' +
        '<div class="pd-sock-item">' +
          '<img class="pd-sock-ico" src="' + escapeHtml(ico) + '" alt="" />' +
          '<select class="sim-select" data-pd-sock-idx="' + i + '" aria-label="孔位 #' + (i + 1) + ' 镶嵌物" style="flex:1;height:30px;font-size:12px">' +
            '<option value="">-- 孔位 #' + (i + 1) + '：空孔 (未镶嵌) --</option>' +
            '<optgroup label="💎 自定义珠宝（自由拆选前后缀与数值）">' +
              '<option value="__jw_magic__"' + (curSelVal === "__jw_magic__" ? ' selected' : '') + '>💎 自定义蓝珠宝（自选 1 前缀 + 1 后缀 · 含 15% IAS）</option>' +
              '<option value="__jw_rare__"' + (curSelVal === "__jw_rare__" ? ' selected' : '') + '>✨ 自定义黄珠宝（自选最多 4 条词缀 · 前/后各上限 3）</option>' +
            '</optgroup>' +
            '<optgroup label="🌈 彩虹刻面 & 常用快捷预设珠宝">' + renderOptList(jewelPresets, curSelVal) + '</optgroup>' +
            '<optgroup label="🪨 符文 (1#–33#)">' + renderOptList(runeSocks, curSelVal) + '</optgroup>' +
            '<optgroup label="💠 完美宝石">' + renderOptList(gemSocks, curSelVal) + '</optgroup>' +
          '</select>' +
        '</div>' +
        (isCust ? renderCustomJewelInlineHtml(i, curEntry) : '') +
      '</div>';
    }
    sockList.innerHTML = sockRowsHtml;

    const syncJewelValLive = () => {
      renderPaperdollSlots();
      renderActiveItemPreview();
      renderPaperdollLiveStats();
      savePaperdollState();
    };

    sockList.querySelectorAll("[data-pd-sock-idx]").forEach(sel => {
      sel.addEventListener("change", (e) => {
        const idx = Number(e.target.dataset.pdSockIdx);
        if (!Array.isArray(curEq.sockets)) curEq.sockets = [];
        const v = e.target.value;
        if (v === "__jw_magic__") {
          curEq.sockets[idx] = { customJewel: "magic", pre: [], suf: [] };
        } else if (v === "__jw_rare__") {
          curEq.sockets[idx] = { customJewel: "rare", pre: [], suf: [] };
        } else {
          curEq.sockets[idx] = v;
        }
        renderPaperdollAll();
      });
    });

    sockList.querySelectorAll("[data-jw-m-sel]").forEach(sel => {
      sel.addEventListener("change", () => {
        const idx = Number(sel.dataset.jwSock);
        const kind = sel.dataset.jwMSel;
        const entry = curEq.sockets && curEq.sockets[idx];
        if (!isCustomJewelSocket(entry)) return;
        const aid = sel.value;
        if (!aid) {
          entry[kind] = [];
        } else {
          const def = getJewelAffixDef(kind, aid);
          entry[kind] = def ? [{ id: def.id, val: def.max }] : [];
        }
        renderPaperdollAll();
      });
    });

    sockList.querySelectorAll("[data-jw-m-val]").forEach(inp => {
      const onChange = () => {
        const idx = Number(inp.dataset.jwSock);
        const kind = inp.dataset.jwMVal;
        const entry = curEq.sockets && curEq.sockets[idx];
        if (!isCustomJewelSocket(entry) || !entry[kind] || !entry[kind][0]) return;
        const def = getJewelAffixDef(kind, entry[kind][0].id);
        entry[kind][0].val = clampJewelAffixVal(def, inp.value, false);
        syncJewelValLive();
      };
      inp.addEventListener("input", onChange);
      inp.addEventListener("change", onChange);
    });

    sockList.querySelectorAll("[data-jw-r-add-btn]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.jwSock);
        const kind = btn.dataset.jwRAddBtn;
        const entry = curEq.sockets && curEq.sockets[idx];
        if (!isCustomJewelSocket(entry)) return;
        const sel = sockList.querySelector('[data-jw-r-add-sel="' + kind + '"][data-jw-sock="' + idx + '"]');
        if (!sel || !sel.value) return;
        const def = getJewelAffixDef(kind, sel.value);
        if (!def) return;
        if (!Array.isArray(entry[kind])) entry[kind] = [];
        const total = (entry.pre?.length || 0) + (entry.suf?.length || 0);
        if (total >= 4 || entry[kind].length >= 3) return;
        entry[kind].push({ id: def.id, val: def.rareMax || def.max });
        renderPaperdollAll();
      });
    });

    sockList.querySelectorAll("[data-jw-r-del]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.jwSock);
        const kind = btn.dataset.jwRDel;
        const aIdx = Number(btn.dataset.jwIdx);
        const entry = curEq.sockets && curEq.sockets[idx];
        if (!isCustomJewelSocket(entry) || !Array.isArray(entry[kind])) return;
        entry[kind].splice(aIdx, 1);
        renderPaperdollAll();
      });
    });

    sockList.querySelectorAll("[data-jw-r-val]").forEach(inp => {
      const onChange = () => {
        const idx = Number(inp.dataset.jwSock);
        const kind = inp.dataset.jwRVal;
        const aIdx = Number(inp.dataset.jwIdx);
        const entry = curEq.sockets && curEq.sockets[idx];
        if (!isCustomJewelSocket(entry) || !entry[kind] || !entry[kind][aIdx]) return;
        const def = getJewelAffixDef(kind, entry[kind][aIdx].id);
        entry[kind][aIdx].val = clampJewelAffixVal(def, inp.value, true);
        syncJewelValLive();
      };
      inp.addEventListener("input", onChange);
      inp.addEventListener("change", onChange);
    });
  } else {
    sockSec.style.display = "none";
  }

  renderSlidersForTarget(info.rawStats, curEq);
  renderActiveItemPreview();
}

function computePassiveMasteryBonuses(clsObj, build, charTot, allSkillBonus, maxMode) {
  const res = { ed: 0, ar: 0, cs: 0, reqRed: 0, notes: [] };
  if (!clsObj) return res;
  const getLvl = (skillKey, defaultEmpty) => {
    const skObj = clsObj.skills.find(s => s.key === skillKey);
    if (!skObj) return 0;
    const hp = getPassiveHardPoints(clsObj.id, skillKey, maxMode, defaultEmpty !== undefined ? defaultEmpty : 20);
    if (hp.pts <= 0) return 0;
    return hp.pts + allSkillBonus + (charTot.tabSkills[skObj.page] || 0) + ((charTot.singleSkills && charTot.singleSkills[skillKey]) || 0);
  };

  if (clsObj.id === "war") {
    const lvl = getLvl("Levitate", 1);
    if (lvl > 0) {
      const ed = 25 + (lvl - 1) * 4;
      const ar = 40 + (lvl - 1) * 5;
      const cs = evalDiminishing(lvl, 0, 35);
      const reqRed = Math.min(50, 2 + (lvl - 1) * 2);
      res.ed += ed; res.ar += ar; res.cs = cs; res.reqRed = reqRed;
      res.notes.push("悬浮精通 Lv." + lvl + "：武器伤害 +" + ed + "% · 命中率 +" + ar + "% · 致命 " + cs + "% · 需求 -" + reqRed + "%");
    }
  } else if (clsObj.id === "bar") {
    const wt = charTot.mainWeapType || "";
    let mKey = "", mZh = "", arBase = 40;
    if (wt === "swor" || wt === "knif") { mKey = "Blade Mastery"; mZh = "刀剑精通"; }
    else if (wt === "axe") { mKey = "Axe Mastery"; mZh = "斧类精通"; }
    else if (["mace", "club", "hamm", "scep", "wand", "staf"].includes(wt)) { mKey = "Mace Mastery"; mZh = "锤类精通"; }
    else if (wt === "pole") { mKey = "Pole Arm Mastery"; mZh = "长柄精通"; arBase = 44; }
    else if (wt === "spea") { mKey = "Spear Mastery"; mZh = "长矛精通"; arBase = 44; }
    else if (["tkni", "taxe", "jave"].includes(wt)) { mKey = "Throwing Mastery"; mZh = "投掷精通"; arBase = 44; }
    if (mKey) {
      const lvl = getLvl(mKey, 20);
      if (lvl > 0) {
        const ed = 28 + (lvl - 1) * 5;
        const ar = arBase + (lvl - 1) * 8;
        const cs = evalDiminishing(lvl, 0, 35);
        res.ed += ed; res.ar += ar; res.cs = cs;
        res.notes.push(mZh + " Lv." + lvl + "：武器伤害 +" + ed + "% · 命中率 +" + ar + "% · 致命 " + cs + "%");
      }
    }
  } else if (clsObj.id === "pal") {
    const baBase = getPassiveHardPoints("pal", "Blessed Aim", maxMode, 0).pts;
    if (baBase > 0) {
      const baAr = baBase * 5;
      res.ar += baAr;
      res.notes.push("祝福瞄准隐藏被动 (" + baBase + "硬点)：+" + baAr + "% 攻击准确率 AR");
    }
  } else if (clsObj.id === "ama") {
    const csLvl = getLvl("Critical Strike", 1);
    if (csLvl > 0) {
      const cs = evalDiminishing(csLvl, 5, 80);
      res.cs = cs;
      res.notes.push("致命攻击 Lv." + csLvl + "：" + cs + "% 双倍物理伤害");
    }
    const penLvl = getLvl("Penetrate", 1);
    if (penLvl > 0) {
      const ar = 35 + (penLvl - 1) * 10;
      res.ar += ar;
      res.notes.push("刺穿 Lv." + penLvl + "：+" + ar + "% AR");
    }
  } else if (clsObj.id === "ass") {
    const wt = charTot.mainWeapType || "";
    if (wt === "h2h" || wt === "h2h2") {
      const lvl = getLvl("Claw Mastery", 20);
      if (lvl > 0) {
        const ed = 35 + (lvl - 1) * 4;
        const ar = 30 + (lvl - 1) * 10;
        const cs = evalDiminishing(lvl, 0, 25);
        res.ed += ed; res.ar += ar; res.cs = cs;
        res.notes.push("利爪精通 Lv." + lvl + "：爪伤 +" + ed + "% · 命中率 +" + ar + "% · 致命 " + cs + "%");
      }
    }
  }
  return res;
}

function computeSelectedSkillCombat(params) {
  const { clsObj, charTot, charLvl, totalStr, totalDex, ctaSkillBonus, teamBuffs, charFcrFrame, charAtkFrame, maxMode } = params;
  const base = (pdData && pdData.charBaseStats && pdData.charBaseStats[skActiveClassId]) || { toHitFactor: 0 };
  const build = getClassBuild(skActiveClassId);
  const allSkillBonus = charTot.skills + (charTot.classSkills || 0) + ctaSkillBonus;
  const mastery = computePassiveMasteryBonuses(clsObj, build, charTot, allSkillBonus, maxMode);

  // Base Attack Rating (AR)
  const baseAr = Math.max(0, totalDex * 5 - 35 + (base.toHitFactor || 0) + charTot.flatAr);
  const calcHitChance = (totalAr, alwaysHit) => {
    if (alwaysHit) return 95;
    if (charTot.itd) return 95;
    const monLvl = 85;
    const totalDefRed = Math.min(95, (teamBuffs.convDef || 0) + (teamBuffs.hexDefReduce || 0) + (charTot.targetDefPct || 0));
    const monDef = Math.max(0, Math.floor((1600 - teamBuffs.innerSightDef) * (1 - totalDefRed / 100)));
    const pct = Math.floor(100 * (totalAr / Math.max(1, totalAr + monDef)) * ((2 * charLvl) / (charLvl + monLvl)));
    return Math.min(95, Math.max(5, pct));
  };

  const dsChance = Math.min(100, charTot.ds);
  const csChance = Math.min(100, mastery.cs || 0);
  // Authentic D2R multiplicative CS + DS double-damage probability: 1 - (1 - DS)*(1 - CS)
  const effDoublePct = Math.round((1 - (1 - dsChance / 100) * (1 - csChance / 100)) * 1000) / 10;
  const dsMult = 1 + effDoublePct / 100;
  const atkPerSec = 25 / Math.max(1, charAtkFrame);
  const castPerSec = 25 / Math.max(1, charFcrFrame);

  // Helper for weapon physical damage (extraBaseMin/Max = skill flat phys added BEFORE off-weapon ED, e.g. Echoing Strike / Blade Fury)
  const calcWeaponHit = (skillEd, srcDamRatio, isSmite, isKick, includeMastery, extraBaseMin, extraBaseMax) => {
    let baseMin = charTot.mainWeapMin + charTot.flatDmg + charTot.flatMinDmg;
    let baseMax = charTot.mainWeapMax + charTot.flatDmg + charTot.flatMaxDmg;
    let statEd = Math.floor((totalStr * (charTot.mainWeapStrBonus || 100) + totalDex * (charTot.mainWeapDexBonus || 0)) / 100);
    if (isSmite) {
      baseMin = (charTot.shieldSmiteMin || 1) + charTot.flatDmg + (teamBuffs.holyShieldSmiteMin || 0);
      baseMax = (charTot.shieldSmiteMax || 4) + charTot.flatDmg + (teamBuffs.holyShieldSmiteMax || 0);
      statEd = totalStr;
    } else if (isKick) {
      baseMin = charTot.bootKickMin + Math.floor((totalStr + totalDex - 20) / 4);
      baseMax = charTot.bootKickMax + Math.floor((totalStr + totalDex - 20) / 3);
      statEd = Math.floor(totalStr * 1.2);
    }
    const mEd = includeMastery && !isSmite && !isKick ? mastery.ed : 0;
    const totalOffEd = statEd + skillEd + mEd + charTot.offWeaponEdPct + teamBuffs.physEdPct;
    const effBaseMin = Math.floor(baseMin * srcDamRatio) + (extraBaseMin || 0);
    const effBaseMax = Math.floor(baseMax * srcDamRatio) + (extraBaseMax || 0);
    const min = Math.max(1, Math.floor(effBaseMin * (1 + totalOffEd / 100)));
    const max = Math.max(min, Math.floor(effBaseMax * (1 + totalOffEd / 100)));
    return { min, max, baseMin, baseMax, totalOffEd, mEd };
  };

  const appendPhysDebuffNotes = (minVal, maxVal, notesArr) => {
    const gearPhysP = charTot.elePierce.phys || 0;
    const debuffP = teamBuffs.debuffPhysRes || 0;
    const resVs50 = Math.max(-100, 50 - gearPhysP - debuffP);
    const mult50 = (100 - resVs50) / 100;
    notesArr.push("对常规地狱怪 (50%物抗 → 实抗 " + resVs50 + "%)：单次物理 " + Math.round(minVal * mult50).toLocaleString() + "–" + Math.round(maxVal * mult50).toLocaleString());
    if (charTot.sunders.has("phys") || debuffP >= 100) {
      const baseImm = charTot.sunders.has("phys") ? 95 : 100;
      const effDebuff = Math.floor(debuffP / 5);
      const resImm = Math.max(-100, baseImm - gearPhysP - effDebuff);
      const multImm = Math.max(0, (100 - resImm) / 100);
      notesArr.push("对物免怪 (" + baseImm + "% → 实抗 " + resImm + "%)：破免有效物理伤害 " + Math.round(minVal * multImm).toLocaleString() + "–" + Math.round(maxVal * multImm).toLocaleString());
    }
  };

  const normalAr = Math.floor(baseAr * (1 + (charTot.arPct + teamBuffs.arPct + mastery.ar) / 100));
  const normalHitPct = calcHitChance(normalAr, false);
  const normalPhys = calcWeaponHit(0, 1, false, false, true);

  // Bonus weapon elemental/magic attack damage (Enchant Oskill / A3 Fire Merc + Warlock Hex: Bane + gear flat elemental/magic damage)
  const gearEleFireMin = Math.round(((charTot.flatEleMin && charTot.flatEleMin.fire) || 0) * (1 + (charTot.eleDmg.fire || 0) / 100));
  const gearEleFireMax = Math.round(((charTot.flatEleMax && charTot.flatEleMax.fire) || 0) * (1 + (charTot.eleDmg.fire || 0) / 100));
  const gearEleOtherMin = Math.round(((charTot.flatEleMin && charTot.flatEleMin.cold) || 0) * (1 + (charTot.eleDmg.cold || 0) / 100))
    + Math.round(((charTot.flatEleMin && charTot.flatEleMin.ltng) || 0) * (1 + (charTot.eleDmg.ltng || 0) / 100))
    + Math.round(((charTot.flatEleMin && charTot.flatEleMin.pois) || 0) * (1 + (charTot.eleDmg.pois || 0) / 100))
    + Math.round(((charTot.flatEleMin && charTot.flatEleMin.mag) || 0) * (1 + (charTot.eleDmg.mag || 0) / 100));
  const gearEleOtherMax = Math.round(((charTot.flatEleMax && charTot.flatEleMax.cold) || 0) * (1 + (charTot.eleDmg.cold || 0) / 100))
    + Math.round(((charTot.flatEleMax && charTot.flatEleMax.ltng) || 0) * (1 + (charTot.eleDmg.ltng || 0) / 100))
    + Math.round(((charTot.flatEleMax && charTot.flatEleMax.pois) || 0) * (1 + (charTot.eleDmg.pois || 0) / 100))
    + Math.round(((charTot.flatEleMax && charTot.flatEleMax.mag) || 0) * (1 + (charTot.eleDmg.mag || 0) / 100));
  const hexMagMin = teamBuffs.hexMagicMin || 0;
  const hexMagMax = teamBuffs.hexMagicMax || 0;
  const weaponBonusEleMin = (teamBuffs.enchantFireMin || 0) + hexMagMin + gearEleFireMin + gearEleOtherMin;
  const weaponBonusEleMax = (teamBuffs.enchantFireMax || 0) + hexMagMax + gearEleFireMax + gearEleOtherMax;
  const normalTotalMin = normalPhys.min + weaponBonusEleMin;
  const normalTotalMax = normalPhys.max + weaponBonusEleMax;

  const appendWeaponBuffNotes = (notesArr) => {
    if (mastery.notes.length) mastery.notes.forEach(n => notesArr.push("⚔️ 被动精通：" + n));
    if (teamBuffs.enchantFireMax > 0) {
      notesArr.push("🔥 火焰强化(附魔) Lv." + teamBuffs.enchantLvl + "：+" + teamBuffs.enchantArPct + "% AR · 武器附加 " + teamBuffs.enchantFireMin.toLocaleString() + "–" + teamBuffs.enchantFireMax.toLocaleString() + " 火焰伤害");
    }
    if (hexMagMax > 0) {
      notesArr.push("🔮 邪咒：灾祸 Lv." + teamBuffs.hexLvl + "：武器附加 " + hexMagMin.toLocaleString() + "–" + hexMagMax.toLocaleString() + " 魔法伤害 · +" + teamBuffs.hexArPct + "% AR · -" + teamBuffs.hexDefReduce + "% 敌防");
    } else if (teamBuffs.hexKey === "Hex Purge" && teamBuffs.hexPurgeMax > 0) {
      notesArr.push("🔮 邪咒：消灭 Lv." + teamBuffs.hexLvl + "：+" + teamBuffs.hexEias + "% EIAS 攻速 · +" + teamBuffs.hexArPct + "% AR · 击中引爆范围魔法伤害 " + teamBuffs.hexPurgeMin.toLocaleString() + "–" + teamBuffs.hexPurgeMax.toLocaleString() + " (最多连爆 " + teamBuffs.hexPurgeMaxExp + " 次)");
    } else if (teamBuffs.hexKey === "Hex Siphon") {
      notesArr.push("🔮 邪咒：虹吸 Lv." + teamBuffs.hexLvl + "：+" + teamBuffs.hexArPct + "% AR · 每杀回血/回蓝 +" + teamBuffs.hexLaek + " · -33% 敌物伤");
    }
    if (gearEleFireMax + gearEleOtherMax > 0) {
      notesArr.push("装备附加元素/魔法伤害：" + (gearEleFireMin + gearEleOtherMin).toLocaleString() + "–" + (gearEleFireMax + gearEleOtherMax).toLocaleString());
    }
  };

  if (pdSelectedSkillKey === "__normal__" || !clsObj) {
    const avgPhys = (normalPhys.min + normalPhys.max) / 2 * dsMult;
    const avgEle = (weaponBonusEleMin + weaponBonusEleMax) / 2;
    const avg = (avgPhys + avgEle) * (normalHitPct / 100);
    const arOffset = (base.toHitFactor || 0) - 35;
    const normalArPctSum = charTot.arPct + teamBuffs.arPct + mastery.ar;
    const normalNotes = [
      "物理部分：" + normalPhys.min.toLocaleString() + "–" + normalPhys.max.toLocaleString() + "（非武器总 ED +" + normalPhys.totalOffEd + "%）",
      "AR 构成：基础 " + baseAr.toLocaleString() + "（敏捷 " + totalDex + "×5" + (arOffset >= 0 ? "+" : "") + arOffset + " + 装备固定 AR " + charTot.flatAr + "）× (1 + " + normalArPctSum + "%) = " + normalAr.toLocaleString(),
      "攻击速度：" + charAtkFrame + " 帧 (" + atkPerSec.toFixed(2) + " 次/秒) · 双倍暴击(CS/DS)期望 " + effDoublePct + "% (×" + dsMult.toFixed(2) + ")"
    ];
    appendWeaponBuffNotes(normalNotes);
    appendPhysDebuffNotes(normalPhys.min, normalPhys.max, normalNotes);
    return {
      title: "普通物理攻击 (Normal Attack)",
      effLvl: 1,
      manaCost: 0,
      dmgType: "phys",
      dmgMin: normalTotalMin,
      dmgMax: normalTotalMax,
      dps: Math.round(avg * atkPerSec),
      skillAr: normalAr,
      hitPct: normalHitPct,
      normalAr,
      normalHitPct,
      normalMin: normalTotalMin,
      normalMax: normalTotalMax,
      extraNotes: normalNotes
    };
  }

  // Handle Set / Gear Granted Oskills (e.g. Horazon +30 Enchant, Trang-Oul Fire Ball/Wall/Meteor, Chaos WW, Passion Zeal/Berserk)
  const isOskillSel = String(pdSelectedSkillKey || "").startsWith("__oskill__:");
  let sk = null, skOwnerCls = clsObj, effLvl = 0, basePts = 0, tabBonus = 0, singleBonus = 0, fireBonus = 0, oskillObj = null;

  if (isOskillSel) {
    const osKey = pdSelectedSkillKey.slice("__oskill__:".length);
    oskillObj = (charTot.oskills && charTot.oskills[osKey]) || null;
    const found = findAnyClassSkill(osKey);
    if (!oskillObj || !found) {
      return { title: "未激活该装备技能", effLvl: 0, manaCost: 0, dmgType: "phys", dmgMin: 0, dmgMax: 0, dps: 0, skillAr: normalAr, hitPct: normalHitPct, normalAr, normalHitPct, normalMin: normalTotalMin, normalMax: normalTotalMax, extraNotes: [] };
    }
    sk = found.sk;
    skOwnerCls = found.cls;
    const isNative = skOwnerCls.id === skActiveClassId;
    const isFireSk = Boolean((sk.dmg && sk.dmg.type === "fire") || sk.key === "Enchant");
    if (oskillObj.isCharge) {
      basePts = oskillObj.baseLvl;
      effLvl = oskillObj.baseLvl;
    } else if (isNative) {
      const treePts = Number(build[sk.key] || 0);
      basePts = (maxMode ? 20 : treePts) + Math.min(3, oskillObj.baseLvl);
      tabBonus = charTot.tabSkills[sk.page] || 0;
      singleBonus = (charTot.singleSkills && charTot.singleSkills[sk.key]) || 0;
      effLvl = basePts + allSkillBonus + tabBonus + singleBonus;
    } else {
      basePts = oskillObj.baseLvl;
      fireBonus = isFireSk ? (charTot.fireSkills || 0) : 0;
      effLvl = basePts + charTot.skills + ctaSkillBonus + fireBonus;
    }
  } else {
    sk = clsObj.skills.find(s => s.key === pdSelectedSkillKey);
    if (!sk) {
      return { title: "未选择技能", effLvl: 0, manaCost: 0, dmgType: "phys", dmgMin: 0, dmgMax: 0, dps: 0, skillAr: normalAr, hitPct: normalHitPct, normalAr, normalHitPct, normalMin: normalTotalMin, normalMax: normalTotalMax, extraNotes: [] };
    }
    const treePts = Number(build[sk.key] || 0);
    basePts = maxMode ? 20 : Math.max(1, treePts);
    tabBonus = charTot.tabSkills[sk.page] || 0;
    singleBonus = (charTot.singleSkills && charTot.singleSkills[sk.key]) || 0;
    fireBonus = (charTot.fireSkills > 0 && sk.dmg && sk.dmg.type === "fire" && !(skActiveClassId === "sor" && sk.page === 1)) ? charTot.fireSkills : 0;
    effLvl = basePts + allSkillBonus + tabBonus + singleBonus + fireBonus;
  }

  const manaCost = computeSkillMana(sk, effLvl);
  const wsMeta = computeWeaponSkillMetaStats(sk.key, effLvl, skOwnerCls.id === skActiveClassId ? build : {}, skOwnerCls.id === skActiveClassId ? maxMode : false);
  const meta = wsMeta ? wsMeta.meta : null;

  // Build effective synergy map (cross-class Oskills have 0 synergies from another class)
  const synBuild = {};
  if (Array.isArray(sk.dmgSynergies) && skOwnerCls.id === skActiveClassId) {
    sk.dmgSynergies.forEach(s => {
      synBuild[s.skill] = maxMode ? 20 : Number(build[s.skill] || 0);
    });
  }

  const spellDmg = computeSkillDamage(sk, skOwnerCls, synBuild, effLvl);
  const isWeaponSkill = Boolean(meta && (meta.srcDam > 0 || meta.isSmite || meta.isKick));
  const skillArPct = wsMeta ? wsMeta.totalAr : 0;
  const effMasteryAr = isWeaponSkill && meta && !meta.isSmite && !meta.isKick ? mastery.ar : 0;
  const skillAr = Math.floor(baseAr * (1 + (charTot.arPct + teamBuffs.arPct + effMasteryAr + skillArPct) / 100));
  const hitPct = calcHitChance(skillAr, Boolean(meta && meta.alwaysHit));

  let dmgMin = 0, dmgMax = 0, lcsMin = 0, lcsMax = 0, dmgType = "phys", dps = 0;
  const extraNotes = [];
  if (isOskillSel && oskillObj) {
    extraNotes.push("✨ 套装/装备赋予技能 (Oskill)：基础 +" + oskillObj.baseLvl + (oskillObj.isCharge ? " (聚气固定等级)" : (skOwnerCls.id === skActiveClassId ? " (本职业上限+3)" : (" + 全技能" + (charTot.skills + ctaSkillBonus) + (fireBonus ? (" + 火焰技能" + fireBonus) : "")))));
  }

  if (sk.key === "Enchant" && spellDmg) {
    dmgType = "fire";
    let fireBoost = charTot.eleDmg.fire || 0;
    if (skActiveClassId === "sor") {
      const mBase = maxMode ? 20 : Number(build["Fire Mastery"] || 0);
      if (mBase > 0) {
        const mLvl = mBase + allSkillBonus + (charTot.tabSkills[1] || 0);
        const mPct = 30 + (mLvl - 1) * 7;
        fireBoost += mPct;
        extraNotes.push("火焰支配 Lv." + mLvl + "：+" + mPct + "% 火焰伤害（近战双倍生效）");
      }
    }
    dmgMin = Math.round(spellDmg.min * (1 + fireBoost / 100));
    dmgMax = Math.round(spellDmg.max * (1 + fireBoost / 100));
    const enchAr = 20 + Math.max(0, effLvl - 1) * 9;
    const avg = (dmgMin + dmgMax) / 2;
    dps = Math.round(avg * atkPerSec * (normalHitPct / 100));
    extraNotes.push("🔥 附魔增益：为角色与佣兵提供 +" + enchAr + "% 攻击准确率 AR，并为每次武器攻击附加此火焰伤害（已自动计入普攻/近战技能）");
    const gearFireP = charTot.elePierce.fire || 0;
    const resVs50 = Math.max(-100, 50 - gearFireP - teamBuffs.convRes - (teamBuffs.debuffEleRes || 0));
    const mult50 = (100 - resVs50) / 100;
    extraNotes.push("附魔火伤对常规地狱怪 (50%火抗 → 实抗 " + resVs50 + "%)：每次附加 " + Math.round(dmgMin * mult50).toLocaleString() + "–" + Math.round(dmgMax * mult50).toLocaleString());
    if (charTot.sunders.has("fire")) {
      const resImm = Math.max(-100, 95 - gearFireP - Math.floor(teamBuffs.convRes / 5) - Math.floor((teamBuffs.debuffEleRes || 0) / 5));
      const multImm = (100 - resImm) / 100;
      extraNotes.push("✓ 破火板对火免怪 (95% → 实抗 " + resImm + "%)：每次附加 " + Math.round(dmgMin * multImm).toLocaleString() + "–" + Math.round(dmgMax * multImm).toLocaleString());
    }
  } else if (isWeaponSkill) {
    const skillEd = meta.isBladeCopy ? 0 : wsMeta.totalEd;
    const baseSrcRatio = (meta.srcDam || 128) / 128;
    const effSrcRatio = meta.isBladeCopy ? (baseSrcRatio * (wsMeta.baseEd / 100)) : baseSrcRatio;
    let preEdFlatMin = 0, preEdFlatMax = 0, preEdFlatSyn = 0;
    const scaleFlatPhysWithEd = Boolean(spellDmg && spellDmg.type === "phys" && sk.key !== "Leap Attack");
    if (scaleFlatPhysWithEd) {
      preEdFlatSyn = wsMeta.physFlatSynPct || 0;
      preEdFlatMin = Math.floor(spellDmg.min * (1 + preEdFlatSyn / 100));
      preEdFlatMax = Math.floor(spellDmg.max * (1 + preEdFlatSyn / 100));
    }
    const wHit = calcWeaponHit(skillEd, effSrcRatio, meta.isSmite, meta.isKick, true, preEdFlatMin, preEdFlatMax);
    let physPartMin = wHit.min;
    let physPartMax = wHit.max;
    dmgType = meta.isMagicConv ? "mag" : "phys";
    let eleAddedMin = 0, eleAddedMax = 0;

    // Vengeance tri-elemental weapon damage conversion
    if (meta.eleConvEachBase) {
      const baseConv = meta.eleConvEachBase + Math.max(0, effLvl - 1) * meta.eleConvEachLvl;
      const getSyn = (k) => (skOwnerCls.id === skActiveClassId ? (maxMode ? 20 : Number(build[k] || 0)) : 0);
      const salPts = getSyn("Salvation");
      const fPct = baseConv + getSyn("Resist Fire") * 10 + salPts * 2;
      const cPct = baseConv + getSyn("Resist Cold") * 10 + salPts * 2;
      const lPct = baseConv + getSyn("Resist Lightning") * 10 + salPts * 2;
      const vMin = Math.round(wHit.baseMin * ((fPct * (1 + (charTot.eleDmg.fire || 0) / 100) + cPct * (1 + (charTot.eleDmg.cold || 0) / 100) + lPct * (1 + (charTot.eleDmg.ltng || 0) / 100)) / 100));
      const vMax = Math.round(wHit.baseMax * ((fPct * (1 + (charTot.eleDmg.fire || 0) / 100) + cPct * (1 + (charTot.eleDmg.cold || 0) / 100) + lPct * (1 + (charTot.eleDmg.ltng || 0) / 100)) / 100));
      eleAddedMin += vMin;
      eleAddedMax += vMax;
      extraNotes.push("复仇三元素附加：火+" + fPct + "% / 冰+" + cPct + "% / 电+" + lPct + "% → +" + vMin.toLocaleString() + "–" + vMax.toLocaleString() + " 元素伤害");
    }

    if (spellDmg) {
      const eType = spellDmg.type;
      if (eType === "phys") {
        if (scaleFlatPhysWithEd) {
          extraNotes.push("技能基底物理伤：" + preEdFlatMin.toLocaleString() + "–" + preEdFlatMax.toLocaleString() + (preEdFlatSyn > 0 ? ("（基础 " + spellDmg.min + "–" + spellDmg.max + "，含协同 +" + preEdFlatSyn + "%，并入武器基底同享非武器总 ED +" + wHit.totalOffEd + "%）") : "（并入武器基底同享非武器总 ED）"));
        } else {
          const flatSyn = wsMeta.physFlatSynPct || 0;
          const pMin = Math.floor(spellDmg.min * (1 + flatSyn / 100));
          const pMax = Math.floor(spellDmg.max * (1 + flatSyn / 100));
          physPartMin += pMin;
          physPartMax += pMax;
          extraNotes.push("技能附加范围物理伤害：" + pMin.toLocaleString() + "–" + pMax.toLocaleString() + (flatSyn > 0 ? ("（基础 " + spellDmg.min + "–" + spellDmg.max + "，含协同 +" + flatSyn + "%）") : ""));
        }
      } else {
        const eleBoost = 1 + ((charTot.eleDmg[eType] || 0) / 100);
        const eMin = Math.round(spellDmg.min * eleBoost);
        const eMax = Math.round(spellDmg.max * eleBoost);
        eleAddedMin += eMin;
        eleAddedMax += eMax;
        extraNotes.push("附带技能元素/魔法伤害：" + eMin.toLocaleString() + "–" + eMax.toLocaleString() + " (" + eType.toUpperCase() + ")");
      }
    }
    if (!meta.isSmite && weaponBonusEleMax > 0) {
      eleAddedMin += weaponBonusEleMin;
      eleAddedMax += weaponBonusEleMax;
    }
    dmgMin = physPartMin + eleAddedMin;
    dmgMax = physPartMax + eleAddedMax;
    const ratePerSec = meta.usesFcr ? castPerSec : atkPerSec;
    const avg = (((physPartMin + physPartMax) / 2) * (meta.isSmite ? 1 : dsMult) + (eleAddedMin + eleAddedMax) / 2) * (hitPct / 100);
    dps = Math.round(avg * ratePerSec);

    if (meta.isBladeCopy) {
      extraNotes.push("镜影锋刃伤害比例：" + wsMeta.baseEd + "% · 召唤刀刃总数 " + wsMeta.echoCount + " 把 · 非武器总 ED +" + wHit.totalOffEd + "% · 技能 AR +" + skillArPct + "%");
    } else {
      const synTag = wsMeta.synEd > 0 ? ("（基础 +" + wsMeta.baseEd + "% + 协同 +" + wsMeta.synEd + "%）") : "";
      extraNotes.push("技能武器 ED +" + skillEd + "%" + synTag + " · 非武器总 ED +" + wHit.totalOffEd + "% · 技能 AR 加成 +" + skillArPct + "%");
    }
    const arOffsetSk = (base.toHitFactor || 0) - 35;
    const totalSkArPct = charTot.arPct + teamBuffs.arPct + effMasteryAr + skillArPct;
    extraNotes.push("AR 构成：基础 " + baseAr.toLocaleString() + "（敏捷 " + totalDex + "×5" + (arOffsetSk >= 0 ? "+" : "") + arOffsetSk + " + 装备固定 AR " + charTot.flatAr + "）× (1 + " + totalSkArPct + "%) = " + skillAr.toLocaleString());
    if (meta.echoSkill) {
      const esScale = computeEchoingStrikeDisplayScale(wsMeta.echoCount);
      const lcsHit = calcWeaponHit(0, effSrcRatio, false, false, true, preEdFlatMin, preEdFlatMax);
      lcsMin = Math.floor((lcsHit.min * esScale.ddamPct) / 100) + eleAddedMin;
      lcsMax = Math.floor((lcsHit.max * esScale.ddamPct) / 100) + eleAddedMax;
      const tipMin = Math.floor((preEdFlatMin * esScale.tipPct) / 100);
      const tipMax = Math.floor((preEdFlatMax * esScale.tipPct) / 100);
      const weapScaledMin = Math.floor(lcsHit.baseMin * effSrcRatio);
      const weapScaledMax = Math.floor(lcsHit.baseMax * effSrcRatio);
      extraNotes.push("C 键面板构成：基底 " + (weapScaledMin + preEdFlatMin) + "–" + (weapScaledMax + preEdFlatMax) + "（武器折算 " + weapScaledMin + "–" + weapScaledMax + " + 技能 " + preEdFlatMin + "–" + preEdFlatMax + "）× (1 + " + lcsHit.totalOffEd + "% 非武器ED) + 元素附伤 " + eleAddedMin + "–" + eleAddedMax + " = " + lcsMin.toLocaleString() + "–" + lcsMax.toLocaleString());
      extraNotes.push("实战真实单次伤害 ≈ " + dmgMin.toLocaleString() + "–" + dmgMax.toLocaleString() + "（D2R 3.4 游戏 C 键面板漏算回响自身 +" + skillEd + "% 技能 ED，且技能提示按 skilldesc " + esScale.tipPct + "% 显示为 " + tipMin + "–" + tipMax + "）");
      extraNotes.push("回响打击机制：武器伤占比 " + Math.floor((meta.srcDam * 100) / 128) + "%（" + meta.srcDam + "/128）· 单次投射 " + wsMeta.echoCount + " 把回响 · 施法速度 " + charFcrFrame + " 帧 (" + castPerSec.toFixed(2) + " 次/秒) · 双倍暴击(CS/DS) " + effDoublePct + "%");
    } else {
      extraNotes.push("攻速 " + charAtkFrame + " 帧 (" + atkPerSec.toFixed(2) + " 次/秒) · 双倍暴击(CS/DS) " + effDoublePct + "% · 对 Lv.85 地狱怪命中率 " + hitPct + "%" + (meta.alwaysHit ? " (必中技能)" : (charTot.itd ? " (ITD 无视小怪防御)" : "")));
    }
    if (!meta.isSmite) appendWeaponBuffNotes(extraNotes);
    if (dmgType === "phys") {
      appendPhysDebuffNotes(physPartMin, physPartMax, extraNotes);
    } else if (meta.isMagicConv) {
      extraNotes.push("狂战士将 100% 物理伤害转化为魔法伤害（无视物理免疫，无法吸血/吸蓝）");
    }
  } else if (spellDmg) {
    dmgType = spellDmg.type;
    let masteryPct = charTot.eleDmg[dmgType] || 0;
    let coldMasteryPierce = 0;
    if (skActiveClassId === "sor") {
      if (dmgType === "ltng") {
        const mBase = maxMode ? 20 : Number(build["Lightning Mastery"] || 0);
        if (mBase > 0) {
          const mLvl = mBase + allSkillBonus + (charTot.tabSkills[2] || 0);
          const mPct = 50 + (mLvl - 1) * 12;
          masteryPct += mPct;
          extraNotes.push("闪电支配 Lv." + mLvl + "：+" + mPct + "% 闪电伤害");
        }
      } else if (dmgType === "fire") {
        const mBase = maxMode ? 20 : Number(build["Fire Mastery"] || 0);
        if (mBase > 0) {
          const mLvl = mBase + allSkillBonus + (charTot.tabSkills[1] || 0);
          const mPct = 30 + (mLvl - 1) * 7;
          masteryPct += mPct;
          extraNotes.push("火焰支配 Lv." + mLvl + "：+" + mPct + "% 火焰伤害");
        }
      } else if (dmgType === "cold") {
        const mBase = maxMode ? 20 : Number(build["Cold Mastery"] || 0);
        if (mBase > 0) {
          const mLvl = mBase + allSkillBonus + (charTot.tabSkills[3] || 0);
          coldMasteryPierce = 20 + (mLvl - 1) * 5;
          extraNotes.push("冰冷支配 Lv." + mLvl + "：-" + coldMasteryPierce + "% 敌冰抗 (破免后按 1/5 = -" + Math.floor(coldMasteryPierce / 5) + "%)");
        }
      }
    }
    if (sk.key === "Blessed Hammer" && teamBuffs.hammerEdPct > 0) {
      masteryPct += teamBuffs.hammerEdPct;
      extraNotes.push("专注灵气祝福之锤增伤：+" + teamBuffs.hammerEdPct + "%");
    }
    dmgMin = Math.round(spellDmg.min * (1 + masteryPct / 100));
    dmgMax = Math.round(spellDmg.max * (1 + masteryPct / 100));
    const avg = (dmgMin + dmgMax) / 2;
    const rate = sk.cooldown > 0 ? (1 / sk.cooldown) : castPerSec;
    dps = Math.round(avg * rate);

    // Effective damage against Hell 50% res & Sundered 95% immune monsters (including Conviction + Lower Resist + Cold Mastery + Gear Pierce)
    const isEleConv = ["fire", "cold", "ltng"].includes(dmgType);
    const isEleLR = ["fire", "cold", "ltng", "pois"].includes(dmgType);
    const gearPierce = charTot.elePierce[dmgType] || 0;
    const convPierceFull = isEleConv ? teamBuffs.convRes : 0;
    const lrPierceFull = isEleLR ? (teamBuffs.debuffEleRes || 0) : 0;
    const physDebuffSpell = dmgType === "phys" ? (teamBuffs.debuffPhysRes || 0) : 0;
    const resVs50 = Math.max(-100, 50 - gearPierce - convPierceFull - lrPierceFull - coldMasteryPierce - physDebuffSpell);
    const effMult50 = (100 - resVs50) / 100;
    extraNotes.push("对常规地狱怪 (50%抗 → 实抗 " + resVs50 + "%)：单次 " + Math.round(dmgMin * effMult50).toLocaleString() + "–" + Math.round(dmgMax * effMult50).toLocaleString());

    if (charTot.sunders.has(dmgType)) {
      const convVsImmune = Math.floor(convPierceFull / 5);
      const lrVsImmune = Math.floor(lrPierceFull / 5);
      const cmVsImmune = Math.floor(coldMasteryPierce / 5);
      const physVsImmune = Math.floor(physDebuffSpell / 5);
      const resVsImm = Math.max(-100, 95 - gearPierce - convVsImmune - lrVsImmune - cmVsImmune - physVsImmune);
      const effMultImm = (100 - resVsImm) / 100;
      extraNotes.push("✓ 已带对应破免板 (95% → 实抗 " + resVsImm + "%)：破免有效伤害 " + Math.round(dmgMin * effMultImm).toLocaleString() + "–" + Math.round(dmgMax * effMultImm).toLocaleString());
    } else {
      extraNotes.push("协同增伤 +" + spellDmg.synPct + "% · 元素增伤 +" + (charTot.eleDmg[dmgType] || 0) + "% · 装备降抗 -" + gearPierce + "%" + (lrPierceFull ? (" · 降抗诅咒 -" + lrPierceFull + "%") : ""));
    }
  } else {
    extraNotes.push("该技能为增益 / 召唤 / 光环类技能，无直接单次面板攻击数值");
  }

  return {
    title: pickLangTitle(sk) + " (" + sk.nameEn + ")",
    effLvl,
    basePts,
    tabBonus: tabBonus + singleBonus + fireBonus,
    manaCost,
    dmgType,
    dmgMin,
    dmgMax,
    lcsMin,
    lcsMax,
    dps,
    isWeaponSkill,
    skillAr: isWeaponSkill ? skillAr : normalAr,
    hitPct: isWeaponSkill ? hitPct : normalHitPct,
    normalAr,
    normalHitPct,
    normalMin: normalTotalMin,
    normalMax: normalTotalMax,
    extraNotes
  };
}

function renderStatAllocator(cBase, charTot, charLvl, effShieldBlock) {
  const box = document.getElementById("pd-stat-alloc-box");
  if (!box) return;
  const { budget, spent, rem } = clampStatAlloc(charLvl);
  const rows = [
    { k: "str", label: "力量 Str", base: cBase.str, gear: charTot.str, req: charTot.maxReqStr },
    { k: "dex", label: "敏捷 Dex", base: cBase.dex, gear: charTot.dex, req: charTot.maxReqDex },
    { k: "vit", label: "体力 Vit", base: cBase.vit, gear: charTot.vit, req: 0 },
    { k: "enr", label: "精力 Enr", base: cBase.enr, gear: charTot.enr, req: 0 }
  ];

  box.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">' +
      '<strong style="font-size:12px;color:#9ad8ff">📊 角色四维手动配点 (Lv.' + charLvl + ' 总点 ' + budget + ' · 剩余 <span style="color:' + (rem > 0 ? '#ffd573' : '#67e87a') + '">' + rem + '</span> 点)</strong>' +
      '<div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap">' +
        '<button type="button" class="rw-detail-btn" id="pd-stat-auto-vit">够穿+全加体</button>' +
        '<button type="button" class="rw-detail-btn" id="pd-stat-auto-blk">满格挡75%+全加体</button>' +
        '<button type="button" class="rw-btn rw-btn-danger" id="pd-stat-reset" style="padding:2px 7px;font-size:10.5px">重置洗点</button>' +
      '</div>' +
    '</div>' +
    rows.map(r => {
      const alloc = pdStatAlloc[r.k] || 0;
      const naked = r.base + alloc;
      const tot = naked + r.gear;
      const reqBadge = r.req > 0
        ? (tot >= r.req
          ? '<span style="color:#67e87a;font-size:10.5px">✓ 需' + r.req + '</span>'
          : '<span style="color:#ff8a75;font-size:10.5px;font-weight:800">⚠️ 缺' + (r.req - tot) + '</span>')
        : '';
      return '<div class="pd-alloc-row">' +
        '<div><strong style="color:#e6effc">' + r.label + '</strong><div style="font-size:10px;color:var(--muted)">固有 ' + r.base + ' · 已投 ' + alloc + '</div></div>' +
        '<div class="pd-alloc-ctrl">' +
          '<button type="button" class="pd-alloc-btn" data-stat-k="' + r.k + '" data-stat-d="-5">-5</button>' +
          '<button type="button" class="pd-alloc-btn" data-stat-k="' + r.k + '" data-stat-d="-1">-1</button>' +
          '<input type="number" class="pd-alloc-input" min="' + r.base + '" max="' + (r.base + budget) + '" value="' + naked + '" data-stat-inp="' + r.k + '" title="直接输入游戏内裸装基础白字（已含职业固有 ' + r.base + ' 点）" />' +
          '<button type="button" class="pd-alloc-btn" data-stat-k="' + r.k + '" data-stat-d="1">+1</button>' +
          '<button type="button" class="pd-alloc-btn" data-stat-k="' + r.k + '" data-stat-d="5">+5</button>' +
          '<button type="button" class="pd-alloc-btn" data-stat-k="' + r.k + '" data-stat-d="all" title="剩余点数全部投入">全投</button>' +
        '</div>' +
        '<div style="text-align:right;min-width:86px">' +
          '<strong style="color:#ffe08c;font-size:12.5px">' + tot + '</strong>' +
          '<div style="font-size:10px;color:var(--muted)">装+' + r.gear + ' ' + reqBadge + '</div>' +
        '</div>' +
      '</div>';
    }).join("");

  box.querySelectorAll("[data-stat-k]").forEach(btn => {
    btn.addEventListener("click", () => {
      const k = btn.dataset.statK;
      const d = btn.dataset.statD;
      const cur = clampStatAlloc(charLvl);
      if (d === "all") {
        pdStatAlloc[k] = (pdStatAlloc[k] || 0) + cur.rem;
      } else {
        const delta = Number(d);
        if (delta > 0) pdStatAlloc[k] = (pdStatAlloc[k] || 0) + Math.min(delta, cur.rem);
        else pdStatAlloc[k] = Math.max(0, (pdStatAlloc[k] || 0) + delta);
      }
      renderPaperdollLiveStats();
    });
  });

  box.querySelectorAll("[data-stat-inp]").forEach(inp => {
    inp.addEventListener("change", () => {
      const k = inp.dataset.statInp;
      const baseVal = Number(cBase[k] || 0);
      const otherSpent = ["str", "dex", "vit", "enr"].filter(x => x !== k).reduce((s, x) => s + (pdStatAlloc[x] || 0), 0);
      const maxForThis = Math.max(0, getStatBudget(charLvl) - otherSpent);
      const wantAlloc = Math.floor(Number(inp.value) || baseVal) - baseVal;
      pdStatAlloc[k] = Math.min(maxForThis, Math.max(0, wantAlloc));
      renderPaperdollLiveStats();
    });
  });

  const autoVitBtn = document.getElementById("pd-stat-auto-vit");
  if (autoVitBtn) {
    autoVitBtn.addEventListener("click", () => {
      const b = getStatBudget(charLvl);
      const needStr = Math.min(b, Math.max(0, charTot.maxReqStr - (cBase.str + charTot.str)));
      const needDex = Math.min(b - needStr, Math.max(0, charTot.maxReqDex - (cBase.dex + charTot.dex)));
      pdStatAlloc = { str: needStr, dex: needDex, vit: Math.max(0, b - needStr - needDex), enr: 0 };
      renderPaperdollLiveStats();
    });
  }
  const autoBlkBtn = document.getElementById("pd-stat-auto-blk");
  if (autoBlkBtn) {
    autoBlkBtn.addEventListener("click", () => {
      const b = getStatBudget(charLvl);
      const needStr = Math.min(b, Math.max(0, charTot.maxReqStr - (cBase.str + charTot.str)));
      const dexFor75 = effShieldBlock > 0 ? Math.ceil((75 * charLvl * 2) / effShieldBlock) + 15 : charTot.maxReqDex;
      const targetDex = Math.max(charTot.maxReqDex, dexFor75);
      const needDex = Math.min(b - needStr, Math.max(0, targetDex - (cBase.dex + charTot.dex)));
      pdStatAlloc = { str: needStr, dex: needDex, vit: Math.max(0, b - needStr - needDex), enr: 0 };
      renderPaperdollLiveStats();
    });
  }
  const resetBtn = document.getElementById("pd-stat-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      pdStatAlloc = { str: 0, dex: 0, vit: 0, enr: 0 };
      renderPaperdollLiveStats();
    });
  }
}

function computeCharPassiveSheetBonuses(clsObj, build, charTot, allSkillBonus, maxMode, loadout, opts) {
  const out = {
    allRes: 0, maxFRes: 0, maxCRes: 0, maxLRes: 0, defPct: 0, frw: 0, blockPct: 0, weaponBlock: 0,
    smiteMin: 0, smiteMax: 0,
    holyShieldActive: false, holyShieldLvl: 0, holyShieldDefPct: 0, holyShieldDefiancePts: 0, holyShieldNoSkillPts: false,
    notes: []
  };
  if (!clsObj) return out;
  const holyShieldOn = !(opts && opts.holyShieldOn === false);
  const getInfo = (k, defEmpty) => {
    const hp = getPassiveHardPoints(clsObj.id, k, maxMode, defEmpty);
    if (hp.pts <= 0) return { base: 0, lvl: 0, isDefault: false };
    const skObj = clsObj.skills.find(s => s.key === k);
    if (!skObj) return { base: hp.pts, lvl: 0, isDefault: hp.isDefault };
    const lvl = hp.pts + allSkillBonus + (charTot.tabSkills[skObj.page] || 0) + ((charTot.singleSkills && charTot.singleSkills[k]) || 0);
    return { base: hp.pts, lvl, isDefault: hp.isDefault };
  };

  if (clsObj.id === "war") {
    if (charTot.levitateReqRedPct > 0) {
      out.notes.push("悬浮精通 Lv." + charTot.levitateLvl + (charTot.levitateIsDefault ? "(默认1硬点)" : "") + "（武器力/敏需求 -" + charTot.levitateReqRedPct + "%）");
    } else {
      out.notes.push("悬浮精通 Lv.0（前往技能树投入 1+ 点后生效武器减需求 -2%～-50%）");
    }
  } else if (clsObj.id === "bar") {
    const nr = getInfo("Natural Resistance", 1);
    if (nr.lvl > 0) {
      out.allRes = evalDiminishing(nr.lvl, 0, 80);
      out.notes.push("自然抵抗 Lv." + nr.lvl + (nr.isDefault ? "(默认1点)" : "") + "（全抗 +" + out.allRes + "%）");
    }
    const is = getInfo("Iron Skin", 1);
    if (is.lvl > 0) {
      out.defPct = 30 + (is.lvl - 1) * 10;
      out.notes.push("钢铁皮肤 Lv." + is.lvl + (is.isDefault ? "(默认1点)" : "") + "（防御 +" + out.defPct + "%）");
    }
    const spd = getInfo("Increased Speed", 1);
    if (spd.lvl > 0) {
      out.frw = evalDiminishing(spd.lvl, 7, 50);
      out.notes.push("加速 Lv." + spd.lvl + (spd.isDefault ? "(默认1点)" : "") + "（高跑 +" + out.frw + "%）");
    }
  } else if (clsObj.id === "pal") {
    const rfBase = getInfo("Resist Fire", 0).base;
    const rcBase = getInfo("Resist Cold", 0).base;
    const rlBase = getInfo("Resist Lightning", 0).base;
    const baBase = getInfo("Blessed Aim", 0).base;
    out.maxFRes = Math.floor(rfBase / 2);
    out.maxCRes = Math.floor(rcBase / 2);
    out.maxLRes = Math.floor(rlBase / 2);
    const pParts = [];
    if (out.maxFRes > 0) pParts.push("抗火上限+" + out.maxFRes + "%");
    if (out.maxCRes > 0) pParts.push("抗冰上限+" + out.maxCRes + "%");
    if (out.maxLRes > 0) pParts.push("抗电上限+" + out.maxLRes + "%");
    if (baBase > 0) pParts.push("祝福瞄准隐藏 +" + (baBase * 5) + "% AR");
    if (pParts.length) out.notes.push("光环硬点被动（" + pParts.join(" · ") + "）");
    const oRule = loadout && loadout.offhand ? getEquippedBaseRule(loadout.offhand) : null;
    if (oRule && oRule.block > 0) {
      const hsSk = clsObj.skills.find(s => s.key === "Holy Shield");
      const hsSpent = Number((build && build["Holy Shield"]) || 0);
      const palTotalPts = getClassTotalPoints("pal");
      const hsBase = hsSpent > 0 ? hsSpent : (palTotalPts === 0 ? 1 : 0);
      const hsIsDefault = hsSpent === 0 && hsBase > 0;
      const hsLvl = (hsBase > 0 && hsSk)
        ? (hsBase + allSkillBonus + (charTot.tabSkills[hsSk.page] || 0) + ((charTot.singleSkills && charTot.singleSkills["Holy Shield"]) || 0))
        : 0;
      if (hsLvl <= 0) {
        out.holyShieldNoSkillPts = true;
      } else if (holyShieldOn) {
        const defBase = Number((build && build["Defiance"]) || 0);
        out.blockPct = evalDiminishing(hsLvl, 10, 40);
        const hsDef = 25 + (hsLvl - 1) * 15 + defBase * 15;
        out.defPct += hsDef;
        out.holyShieldActive = true;
        out.holyShieldLvl = hsLvl;
        out.holyShieldDefPct = hsDef;
        out.holyShieldDefiancePts = defBase;
        if (hsSk && hsSk.dmg) {
          out.smiteMin = computeScaledValue(hsSk.dmg.min, hsSk.dmg.hitShift || 8, hsLvl);
          out.smiteMax = computeScaledValue(hsSk.dmg.max, hsSk.dmg.hitShift || 8, hsLvl);
        }
        out.notes.push(
          "圣盾术 Lv." + hsLvl + (hsIsDefault ? "(默认1硬点)" : "") +
          "（防御 +" + hsDef + "%" + (defBase > 0 ? (" [含反抗协同+" + (defBase * 15) + "%]") : "") +
          " · 格挡 +" + out.blockPct + "% · 2帧FBR" +
          (out.smiteMax > 0 ? (" · 盾击 +" + out.smiteMin + "–" + out.smiteMax) : "") + "）"
        );
      }
    }
  } else if (clsObj.id === "ass") {
    const wRule = loadout && loadout.weapon ? getEquippedBaseRule(loadout.weapon) : null;
    const oRule = loadout && loadout.offhand ? getEquippedBaseRule(loadout.offhand) : null;
    const isDualClaw = Boolean(wRule && oRule && (wRule.type === "h2h" || wRule.type === "h2h2") && (oRule.type === "h2h" || oRule.type === "h2h2"));
    const wb = isDualClaw ? getInfo("Weapon Block", 1) : { lvl: 0, isDefault: false };
    if (wb.lvl > 0) {
      out.weaponBlock = evalDiminishing(wb.lvl, 20, 65);
      out.notes.push("双爪武器格挡 Lv." + wb.lvl + (wb.isDefault ? "(默认1点)" : "") + "（格挡率 " + out.weaponBlock + "%）");
    }
  } else if (clsObj.id === "ama") {
    const d = getInfo("Dodge", 0);
    const a = getInfo("Avoid", 0);
    const e = getInfo("Evade", 0);
    const p = getInfo("Pierce", 0);
    if (d.lvl > 0) out.notes.push("闪避 Lv." + d.lvl + " (" + evalDiminishing(d.lvl, 10, 65) + "%)");
    if (a.lvl > 0) out.notes.push("躲避 Lv." + a.lvl + " (" + evalDiminishing(a.lvl, 15, 75) + "%)");
    if (e.lvl > 0) out.notes.push("回避 Lv." + e.lvl + " (" + evalDiminishing(e.lvl, 10, 65) + "%)");
    if (p.lvl > 0) out.notes.push("穿刺 Lv." + p.lvl + " (" + evalDiminishing(p.lvl, 10, 100) + "%)");
  } else if (clsObj.id === "sor") {
    const w = getInfo("Warmth", 1);
    if (w.lvl > 0) {
      const regen = 30 + (w.lvl - 1) * 12;
      out.notes.push("温暖 Lv." + w.lvl + (w.isDefault ? "(默认1点)" : "") + "（法力恢复 +" + regen + "%）");
    }
  }
  return out;
}

let pdCompareBaseline = null;
let pdLatestCompareMetrics = null;

function capturePaperdollCompareBaseline() {
  if (!pdLatestCompareMetrics || pdLatestCompareMetrics.classId !== skActiveClassId) return false;
  const clone = (v) => { try { return JSON.parse(JSON.stringify(v)); } catch (e) { return null; } };
  const labelParts = [
    pdLatestCompareMetrics.weaponName || "空手",
    pdLatestCompareMetrics.shieldName || ""
  ].filter(Boolean);
  pdCompareBaseline = {
    classId: skActiveClassId,
    label: labelParts.join(" + ") + " · Lv." + pdLatestCompareMetrics.charLvl,
    metrics: { ...pdLatestCompareMetrics },
    snapshot: {
      charLoadout: clone(pdCharLoadout),
      swapLoadout: clone(pdCharSwapLoadout),
      activeWeaponSet: pdActiveWeaponSet,
      mercLoadout: clone(pdMercLoadout),
      charBag: clone(pdCharBag),
      statAlloc: clone(pdStatAlloc),
      charLvl: pdLatestCompareMetrics.charLvl,
      selectedSkillKey: pdSelectedSkillKey
    }
  };
  renderPaperdollLiveStats();
  if (typeof showAuthToast === "function") showAuthToast("📌 已锁定基准 A：" + pdCompareBaseline.label);
  return true;
}

function clearPaperdollCompareBaseline() {
  pdCompareBaseline = null;
  renderPaperdollLiveStats();
}

function restorePaperdollCompareBaseline() {
  if (!pdCompareBaseline || pdCompareBaseline.classId !== skActiveClassId || !pdCompareBaseline.snapshot) return false;
  const s = pdCompareBaseline.snapshot;
  const clone = (v, fb) => { try { return JSON.parse(JSON.stringify(v)); } catch (e) { return fb; } };
  if (s.charLoadout) pdCharLoadout = clone(s.charLoadout, pdCharLoadout);
  if (s.swapLoadout) pdCharSwapLoadout = clone(s.swapLoadout, pdCharSwapLoadout);
  pdActiveWeaponSet = s.activeWeaponSet === 2 ? 2 : 1;
  if (s.mercLoadout) pdMercLoadout = clone(s.mercLoadout, pdMercLoadout);
  if (Array.isArray(s.charBag)) pdCharBag = clone(s.charBag, pdCharBag);
  if (s.statAlloc) pdStatAlloc = clone(s.statAlloc, pdStatAlloc);
  const lvlInp = document.getElementById("pd-char-lvl");
  if (lvlInp && s.charLvl) lvlInp.value = String(s.charLvl);
  if (s.selectedSkillKey) pdSelectedSkillKey = s.selectedSkillKey;
  if (typeof savePaperdollState === "function") savePaperdollState(skActiveClassId);
  renderPaperdollAll();
  if (typeof showAuthToast === "function") showAuthToast("↩ 已还原至基准 A 配装");
  return true;
}

function fmtCompareDelta(cur, base, opts) {
  if (!pdCompareBaseline || pdCompareBaseline.classId !== skActiveClassId) return "";
  const c = Number(cur);
  const b = Number(base);
  if (!Number.isFinite(c) || !Number.isFinite(b)) return "";
  const diff = c - b;
  if (Math.abs(diff) < 0.0001) return "";
  const invert = Boolean(opts && opts.invert);
  const unit = (opts && opts.unit) || "";
  const showPct = Boolean(opts && opts.showPct && b > 0);
  const isGood = invert ? (diff < 0) : (diff > 0);
  const sign = diff > 0 ? "+" : "";
  const numTxt = Number.isInteger(diff) ? diff.toLocaleString() : diff.toFixed(1);
  const pctTxt = showPct ? (" (" + (diff > 0 ? "+" : "") + ((diff / b) * 100).toFixed(1) + "%)") : "";
  return '<span class="pd-delta ' + (isGood ? "is-up" : "is-down") + '">' + sign + numTxt + unit + pctTxt + '</span>';
}

function fmtCompareFrameDelta(curFrame, baseFrame) {
  if (!pdCompareBaseline || pdCompareBaseline.classId !== skActiveClassId) return "";
  const c = Number(curFrame);
  const b = Number(baseFrame);
  if (!Number.isFinite(c) || !Number.isFinite(b) || c <= 0 || b <= 0 || c === b) return "";
  const isFaster = c < b;
  return '<span class="pd-delta ' + (isFaster ? "is-up" : "is-down") + '">(' + b + '帧→' + c + '帧)</span>';
}

function renderPaperdollCompareBar(cur) {
  const bar = document.getElementById("pd-compare-bar");
  const stEl = document.getElementById("pd-cmp-status");
  const pinBtn = document.getElementById("pd-cmp-pin-btn");
  const restoreBtn = document.getElementById("pd-cmp-restore-btn");
  const clearBtn = document.getElementById("pd-cmp-clear-btn");
  const sumEl = document.getElementById("pd-cmp-summary");
  if (!bar || !stEl) return;

  if (pdCompareBaseline && pdCompareBaseline.classId !== skActiveClassId) {
    pdCompareBaseline = null;
  }
  const active = Boolean(pdCompareBaseline && pdCompareBaseline.classId === skActiveClassId);
  bar.classList.toggle("is-active", active);
  if (restoreBtn) restoreBtn.style.display = active ? "inline-flex" : "none";
  if (clearBtn) clearBtn.style.display = active ? "inline-flex" : "none";
  if (pinBtn) pinBtn.textContent = active ? "🔄 更新基准 A" : "📌 设为基准 A";

  if (!active) {
    stEl.textContent = "📌 锁定当前配置为基准 A，任意换装/调变量/改护符即可实时查看各项属性绿红差值 Δ";
    if (sumEl) { sumEl.style.display = "none"; sumEl.innerHTML = ""; }
    return;
  }

  const b = pdCompareBaseline.metrics;
  stEl.textContent = "📌 对比中 · 基准 A：" + pdCompareBaseline.label + "（绿色=提升，红色=下降）";
  if (!sumEl) return;
  const chips = [];
  const pushDiff = (label, cVal, bVal, unit, invert, showPct) => {
    const d = Number(cVal) - Number(bVal);
    if (!Number.isFinite(d) || d === 0) return;
    const good = invert ? d < 0 : d > 0;
    const sign = d > 0 ? "+" : "";
    const pct = (showPct && bVal > 0) ? (" (" + sign + ((d / bVal) * 100).toFixed(1) + "%)") : "";
    chips.push('<span class="pd-cmp-chip ' + (good ? "is-up" : "is-down") + '">' + escapeHtml(label) + ' ' + sign + d.toLocaleString() + (unit || "") + pct + '</span>');
  };
  const pushFrame = (label, cF, bF) => {
    if (!cF || !bF || cF === bF) return;
    const good = cF < bF;
    chips.push('<span class="pd-cmp-chip ' + (good ? "is-up" : "is-down") + '">' + escapeHtml(label) + ' ' + bF + '帧→' + cF + '帧</span>');
  };
  pushDiff("DPS", cur.dps, b.dps, "/秒", false, true);
  pushDiff("技能均值", cur.dmgAvg, b.dmgAvg, "", false, true);
  pushDiff("生命", cur.hp, b.hp, "", false, false);
  pushDiff("法力", cur.mana, b.mana, "", false, false);
  pushDiff("防御", cur.def, b.def, "", false, false);
  pushDiff("全技能", cur.allSkillBonus, b.allSkillBonus, "", false, false);
  pushFrame("FCR", cur.fcrFrame, b.fcrFrame);
  pushFrame("IAS", cur.iasFrame, b.iasFrame);
  pushFrame("FHR", cur.fhrFrame, b.fhrFrame);
  pushDiff("火抗", cur.resF, b.resF, "%", false, false);
  pushDiff("冰抗", cur.resC, b.resC, "%", false, false);
  pushDiff("电抗", cur.resL, b.resL, "%", false, false);
  pushDiff("毒抗", cur.resP, b.resP, "%", false, false);
  pushDiff("物免DR", cur.dr, b.dr, "%", false, false);
  pushDiff("MF", cur.mf, b.mf, "%", false, false);

  sumEl.style.display = "flex";
  sumEl.innerHTML = chips.length
    ? chips.join("")
    : '<span class="pd-cmp-chip is-same">当前各项核心属性与基准 A 一致（换装/调变量后将实时显示 Δ）</span>';
}

function renderPaperdollLiveStats() {
  if (!itData || !pdData) return;

  const clsObj = getActiveClassObj();
  const merc = getCurrentMercVariant();
  const mercLvl = Math.min(98, Math.max(merc.baseLvl, Number(document.getElementById("merc-lvl-input")?.value || 90)));
  const charLvl = Math.min(99, Math.max(1, Number(document.getElementById("pd-char-lvl")?.value || 90)));
  const ctaOn = Boolean(document.getElementById("pd-cta-bo")?.checked);
  const ctaSkillBonus = ctaOn ? 1 : 0;
  const maxMode = Boolean(document.getElementById("pd-skill-max-mode")?.checked);
  const charTot = aggregateLoadoutStats(pdCharLoadout, true, charLvl, pdCharBag, { ctaSkillBonus, maxMode });
  const mercTot = aggregateLoadoutStats(pdMercLoadout, false, mercLvl, null);
  pdLastLevitateReq = { lvl: charTot.levitateLvl || 0, pct: charTot.levitateReqRedPct || 0 };
  const charAuraVal = document.getElementById("pd-char-aura")?.value || "none";
  const demonWrap = document.getElementById("pd-warlock-demon-wrap");
  if (demonWrap) demonWrap.style.display = skActiveClassId === "war" ? "inline-flex" : "none";
  const demonAuraVal = skActiveClassId === "war" ? normalizeDemonAuraId(document.getElementById("pd-warlock-demon-aura")?.value || "none") : "none";
  const demonMlvl = Math.min(99, Math.max(1, Number(document.getElementById("pd-warlock-demon-mlvl")?.value || 96)));
  const demonAuraInfo = skActiveClassId === "war" ? computeBoundDemonAura(demonAuraVal, demonMlvl) : null;
  const demonMlvlWrap = document.getElementById("pd-warlock-demon-mlvl-wrap");
  if (demonMlvlWrap) demonMlvlWrap.style.display = demonAuraInfo ? "inline-flex" : "none";
  const demonLvlBadge = document.getElementById("pd-warlock-demon-lvl-badge");
  if (demonLvlBadge) demonLvlBadge.textContent = demonAuraInfo ? ("→ Lv." + demonAuraInfo.lvl) : "";
  const hexWrap = document.getElementById("pd-warlock-hex-wrap");
  if (hexWrap) hexWrap.style.display = skActiveClassId === "war" ? "inline-flex" : "none";
  const warlockHexVal = skActiveClassId === "war" ? (document.getElementById("pd-warlock-hex-buff")?.value || "none") : "none";
  const enemyDebuffVal = document.getElementById("pd-enemy-debuff")?.value || "none";

  // Collect bi-directional team auras & combat buffs (Character + Mercenary + Warlock Bound Demon + Warlock Hex + Set/Gear Oskills + Enemy Debuffs)
  const teamAuras = [];
  const teamBuffs = {
    fanaEias: 0, hexEias: 0, salvRes: 0, hpPct: 0, manaPct: 0, frw: 0,
    physEdPct: 0, mercPhysEdPct: 0, hammerEdPct: 0, arPct: 0, defPct: 0,
    convRes: 0, convDef: 0, hexDefReduce: 0, innerSightDef: 0,
    debuffPhysRes: 0, debuffEleRes: 0,
    holyShieldSmiteMin: 0, holyShieldSmiteMax: 0,
    enchantLvl: 0, enchantArPct: 0, enchantFireMin: 0, enchantFireMax: 0,
    hexKey: "", hexLvl: 0, hexArPct: 0, hexMagicMin: 0, hexMagicMax: 0,
    hexPurgeMin: 0, hexPurgeMax: 0, hexPurgeMaxExp: 0, hexLaek: 0, hexMaek: 0
  };

  // Sync Set / Gear Oskills into #pd-skill-select whenever granted Oskills change
  const nextOsSig = Object.values(charTot.oskills || {}).map(o => o.key + ":" + o.baseLvl).sort().join("|");
  const prevOsSig = Object.values(pdActiveOskills || {}).map(o => o.key + ":" + o.baseLvl).sort().join("|");
  pdActiveOskills = charTot.oskills || {};
  if (nextOsSig !== prevOsSig) {
    populatePdSkillSelect();
  }

  // Authentic D2R same-name aura deduplication: highest level wins per aura name across Char / Bound Demon / Merc / Gear
  const auraPools = new Map();
  const registerTeamAura = (auraKey, lvl, stats, badgeObj) => {
    const idx = teamAuras.push(badgeObj) - 1;
    const prev = auraPools.get(auraKey);
    if (!prev || lvl > prev.lvl || (lvl === prev.lvl && (stats.physEdPct || 0) > (prev.physEdPct || 0))) {
      if (prev && teamAuras[prev.badgeIdx]) {
        teamAuras[prev.badgeIdx].tag += " (同源低级被覆盖)";
        teamAuras[prev.badgeIdx].color = "#9ba7be";
      }
      auraPools.set(auraKey, Object.assign({ lvl, badgeIdx: idx }, stats));
    } else {
      teamAuras[idx].tag += " (同源低级被覆盖)";
      teamAuras[idx].color = "#9ba7be";
    }
  };

  if (ctaOn) {
    const realCta = computeRealCtaBoStats(charLvl, maxMode, clsObj);
    teamBuffs.hpPct += realCta.boPct;
    teamBuffs.manaPct += realCta.boPct;
    if (realCta.real) {
      const setTag = realCta.setNum === 2 ? "副手组 II" : "主手组 I";
      teamAuras.push({
        tag: "战斗体制 Lv." + realCta.boLvl + " + 战斗指挥 Lv." + realCta.bcLvl + " (" + setTag + " 真实 CTA)",
        detail: "全队 +1 所有技能 · +" + realCta.boPct + "% 生命/法力上限 · 持续 " + realCta.boDurSec + " 秒（已计入切手栏全技能 +" + realCta.allSkillsOnCtaSet + "）",
        color: "#ffd573"
      });
    } else {
      teamAuras.push({ tag: "战斗体制 + 战斗命令 (CTA)", detail: "全队 +1 所有技能 · +65% 生命/法力上限（模拟值；在副手组 II 装入 CTA 可自动按真实等级演算）", color: "#ffd573" });
    }
  }

  // Character active aura definitions — auto-resolve level from allocated Skill Tree points + gear/CTA bonuses for the owner class!
  const charAuraDefs = {
    "fana-20": {
      owner: "pal", skillKey: "Fanaticism", auraKey: "狂热", label: "狂热灵气", color: "#ff9b42",
      compute(l, isOwner) {
        const eias = evalDiminishing(l, 10, 40);
        const selfEd = 50 + (l - 1) * 17;
        const partyEd = Math.floor(selfEd / 2);
        const arPct = 40 + (l - 1) * 5;
        return {
          stats: { eias, physEdPct: isOwner ? selfEd : partyEd, mercPhysEdPct: partyEd, arPct },
          detail: (isOwner ? ("自身 +" + selfEd + "% / 佣兵 +" + partyEd + "%") : ("友军 +" + partyEd + "%")) + " 物理伤 · +" + eias + "% EIAS · +" + arPct + "% AR"
        };
      }
    },
    "conc-20": {
      owner: "pal", skillKey: "Concentration", auraKey: "专注", label: "专注灵气", color: "#ff9b42",
      compute(l) {
        const ed = 60 + (l - 1) * 15;
        const hEd = Math.floor(ed / 2);
        return { stats: { physEdPct: ed, mercPhysEdPct: ed, hammerEdPct: hEd }, detail: "全队 +" + ed + "% 物理增伤 (+" + hEd + "% 祝福之锤)" };
      }
    },
    "conv-20": {
      owner: "pal", skillKey: "Conviction", auraKey: "信念", label: "信念灵气", color: "#67e87a",
      compute(l) {
        const convRes = Math.min(150, 25 + l * 5);
        const convDef = Math.min(95, evalDiminishing(l, 38, 100));
        return { stats: { convRes, convDef }, detail: "-" + convRes + "% 敌火/冰/电抗 · -" + convDef + "% 敌防" };
      }
    },
    "might": {
      owner: "pal", skillKey: "Might", auraKey: "力量", label: "力量灵气", color: "#ff9b42",
      compute(l) {
        const ed = 30 + l * 10;
        return { stats: { physEdPct: ed, mercPhysEdPct: ed }, detail: "全队 +" + ed + "% 物理增伤" };
      }
    },
    "ba": {
      owner: "pal", skillKey: "Blessed Aim", auraKey: "祝福瞄准", label: "祝福瞄准", color: "#ffd573",
      compute(l) {
        const arPct = 60 + l * 15;
        return { stats: { arPct }, detail: "全队 +" + arPct + "% AR" };
      }
    },
    "salv-20": {
      owner: "pal", skillKey: "Salvation", auraKey: "救助", label: "救助灵气", color: "#9ad8ff",
      compute(l) {
        const salvRes = evalDiminishing(l, 50, 120);
        return { stats: { salvRes }, detail: "全队火/冰/电抗性 +" + salvRes + "%" };
      }
    },
    "defiance": {
      owner: "pal", skillKey: "Defiance", auraKey: "反抗", label: "反抗灵气", color: "#9ad8ff",
      compute(l) {
        const defPct = 60 + l * 10;
        return { stats: { defPct }, detail: "全队防御 +" + defPct + "%" };
      }
    },
    "vigor": {
      owner: "pal", skillKey: "Vigor", auraKey: "活力", label: "活力灵气", color: "#8af49f",
      compute(l) {
        const frw = evalDiminishing(l, 7, 50);
        return { stats: { frw }, detail: "全队跑速 +" + frw + "% FRW" };
      }
    },
    "oak-20": {
      owner: "dru", skillKey: "Oak Sage", auraKey: null, label: "橡木智者", color: "#8af49f",
      compute(l) {
        const hpPct = 30 + (l - 1) * 5;
        return { hpPct, detail: "全队生命上限 +" + hpPct + "%" };
      }
    },
    "how": {
      owner: "dru", skillKey: "Heart of Wolverine", auraKey: null, label: "狼獾之心", color: "#ff9b42",
      compute(l) {
        const ed = 20 + (l - 1) * 7;
        const arPct = 25 + (l - 1) * 7;
        return { directPhysEd: ed, directArPct: arPct, detail: "全队 +" + ed + "% 物理增伤 · +" + arPct + "% AR" };
      }
    }
  };

  const resolveCharAuraMeta = (def) => {
    if (skActiveClassId === def.owner && clsObj) {
      const skObj = clsObj.skills.find(s => s.key === def.skillKey);
      const cBuild = getClassBuild(skActiveClassId);
      const hardPts = Number((cBuild && cBuild[def.skillKey]) || 0);
      const bonus = charTot.skills + (charTot.classSkills || 0) + ctaSkillBonus
        + (skObj ? (charTot.tabSkills[skObj.page] || 0) : 0)
        + ((charTot.singleSkills && charTot.singleSkills[def.skillKey]) || 0);
      if (hardPts > 0) {
        return { lvl: hardPts + bonus, basePts: hardPts, bonus, isOwner: true, srcTag: "技能树 " + hardPts + "点 + 加成 " + bonus };
      }
      if (maxMode && getClassTotalPoints(skActiveClassId) === 0) {
        return { lvl: 20 + bonus, basePts: 20, bonus, isOwner: true, srcTag: "默认 20点 + 加成 " + bonus };
      }
      return { lvl: 0, basePts: 0, bonus, isOwner: true, srcTag: "技能树未加点" };
    }
    return { lvl: 20, basePts: 20, bonus: 0, isOwner: false, srcTag: "队友模拟 Lv.20" };
  };

  const charAuraSelEl = document.getElementById("pd-char-aura");
  if (charAuraSelEl && charAuraSelEl.options) {
    Array.from(charAuraSelEl.options).forEach(opt => {
      const def = charAuraDefs[opt.value];
      if (!def) return;
      const m = resolveCharAuraMeta(def);
      if (m.lvl > 0) {
        const eff = def.compute(m.lvl, m.isOwner);
        opt.textContent = def.label + " Lv." + m.lvl + " (" + m.srcTag + " · " + eff.detail + ")";
      } else {
        opt.textContent = def.label + " Lv.0（技能树未加点，请先分配点数）";
      }
    });
  }

  const activeCharAuraDef = charAuraDefs[charAuraVal];
  if (activeCharAuraDef) {
    const m = resolveCharAuraMeta(activeCharAuraDef);
    if (m.lvl <= 0) {
      teamAuras.push({
        tag: "⚠️ 角色灵气：" + activeCharAuraDef.label + " Lv.0",
        detail: "当前技能树未给「" + activeCharAuraDef.label + "」分配点数，暂不生效",
        color: "#9ba7be"
      });
    } else {
      const eff = activeCharAuraDef.compute(m.lvl, m.isOwner);
      const tagPrefix = activeCharAuraDef.auraKey ? (m.isOwner ? "角色灵气：" : "队友灵气：") : (m.isOwner ? "角色召唤：" : "队友召唤：");
      const badgeObj = {
        tag: tagPrefix + activeCharAuraDef.label + " Lv." + m.lvl + (m.isOwner ? (" (" + m.srcTag + ")") : ""),
        detail: eff.detail,
        color: activeCharAuraDef.color
      };
      if (activeCharAuraDef.auraKey && eff.stats) {
        registerTeamAura(activeCharAuraDef.auraKey, m.lvl, eff.stats, badgeObj);
      } else {
        if (eff.hpPct) teamBuffs.hpPct += eff.hpPct;
        if (eff.directPhysEd) { teamBuffs.physEdPct += eff.directPhysEd; teamBuffs.mercPhysEdPct += eff.directPhysEd; }
        if (eff.directArPct) teamBuffs.arPct += eff.directArPct;
        teamAuras.push(badgeObj);
      }
    }
  }

  // Warlock Bound Demon Elite Auras (mlvl-scaled via floor(mlvl / divisor); applies to Warlock & Mercenary)
  if (demonAuraInfo) {
    const dBadge = {
      tag: "🔥 束缚恶魔光环：" + demonAuraInfo.name + " Lv." + demonAuraInfo.lvl,
      detail: demonAuraInfo.detail,
      color: "#f0a3ec"
    };
    if (["狂热", "专注", "力量", "信念", "祝福瞄准", "活力"].includes(demonAuraInfo.name)) {
      registerTeamAura(demonAuraInfo.name, demonAuraInfo.lvl, {
        eias: demonAuraInfo.eias || 0,
        physEdPct: demonAuraInfo.physEdPct || 0,
        hammerEdPct: demonAuraInfo.hammerEdPct || 0,
        arPct: demonAuraInfo.arPct || 0,
        convRes: demonAuraInfo.convRes || 0,
        convDef: demonAuraInfo.convDef || 0,
        frw: demonAuraInfo.frw || 0
      }, dBadge);
    } else {
      teamAuras.push(dBadge);
    }
  }

  // Warlock Eldritch Hex Self-Buffs (Hex: Bane / Hex: Purge / Hex: Siphon — 1 active at a time)
  if (skActiveClassId === "war" && warlockHexVal !== "none" && clsObj) {
    const hexSk = clsObj.skills.find(s => s.key === warlockHexVal);
    if (hexSk) {
      const wBuild = getClassBuild("war");
      const hTreePts = Number(wBuild[warlockHexVal] || 0);
      const hBasePts = hTreePts > 0 ? hTreePts : 1;
      const hLvl = hBasePts + charTot.skills + (charTot.classSkills || 0) + ctaSkillBonus + (charTot.tabSkills[hexSk.page] || 0) + ((charTot.singleSkills && charTot.singleSkills[warlockHexVal]) || 0);
      const hArPct = 20 + Math.max(0, hLvl - 1) * 9;
      teamBuffs.arPct += hArPct;
      teamBuffs.hexKey = warlockHexVal;
      teamBuffs.hexLvl = hLvl;
      teamBuffs.hexArPct = hArPct;

      const hSynBuild = {};
      if (Array.isArray(hexSk.dmgSynergies)) {
        hexSk.dmgSynergies.forEach(s => {
          hSynBuild[s.skill] = maxMode ? 20 : Number(wBuild[s.skill] || 0);
        });
      }

      if (warlockHexVal === "Hex Bane") {
        const hDmg = computeSkillDamage(hexSk, clsObj, hSynBuild, hLvl);
        const magMult = 1 + (charTot.eleDmg.mag || 0) / 100;
        teamBuffs.hexMagicMin = hDmg ? Math.round(hDmg.min * magMult) : 0;
        teamBuffs.hexMagicMax = hDmg ? Math.round(hDmg.max * magMult) : 0;
        teamBuffs.hexDefReduce = Math.min(50, 30 + Math.max(0, hLvl - 1));
        teamAuras.push({
          tag: "🔮 邪咒：灾祸 (Hex: Bane) Lv." + hLvl,
          detail: "武器附加 " + teamBuffs.hexMagicMin.toLocaleString() + "–" + teamBuffs.hexMagicMax.toLocaleString() + " 魔法伤害 · +" + hArPct + "% AR · -" + teamBuffs.hexDefReduce + "% 敌防 · -25% 敌命中",
          color: "#9ad8ff"
        });
      } else if (warlockHexVal === "Hex Purge") {
        teamBuffs.hexEias = Math.min(30, 10 + Math.max(0, hLvl - 1));
        const hDmg = computeSkillDamage(hexSk, clsObj, hSynBuild, hLvl);
        const magMult = 1 + (charTot.eleDmg.mag || 0) / 100;
        teamBuffs.hexPurgeMin = hDmg ? Math.round(hDmg.min * magMult) : 0;
        teamBuffs.hexPurgeMax = hDmg ? Math.round(hDmg.max * magMult) : 0;
        teamBuffs.hexPurgeMaxExp = Math.min(3, 1 + Math.floor(hLvl / 10));
        teamAuras.push({
          tag: "🔮 邪咒：消灭 (Hex: Purge) Lv." + hLvl,
          detail: "+" + teamBuffs.hexEias + "% EIAS 攻速 · +" + hArPct + "% AR · 击中引爆 " + teamBuffs.hexPurgeMin.toLocaleString() + "–" + teamBuffs.hexPurgeMax.toLocaleString() + " 范围魔法伤害",
          color: "#9ad8ff"
        });
      } else if (warlockHexVal === "Hex Siphon") {
        const engPts = maxMode ? 20 : Number(wBuild["Engorge"] || 0);
        teamBuffs.hexLaek = hLvl + engPts;
        teamBuffs.hexMaek = hLvl + engPts;
        teamAuras.push({
          tag: "🔮 邪咒：虹吸 (Hex: Siphon) Lv." + hLvl,
          detail: "+" + hArPct + "% AR · 杀回血 +" + teamBuffs.hexLaek + " / 杀回蓝 +" + teamBuffs.hexMaek + " · -33% 敌物伤",
          color: "#9ad8ff"
        });
      }
    }
  }

  // Enemy Curses / Bound Demon "Cursed" Debuffs
  if (enemyDebuffVal === "amp") {
    teamBuffs.debuffPhysRes = 100;
    teamAuras.push({ tag: "💀 对敌减益：伤害加深 (被诅咒)", detail: "-100% 敌人物理抗性 (破物免按 1/5 = -20%)", color: "#ff7a70" });
  } else if (enemyDebuffVal === "decrep") {
    teamBuffs.debuffPhysRes = 50;
    teamAuras.push({ tag: "💀 对敌减益：衰老 Decrepify", detail: "-50% 敌物抗 · -50% 敌攻速/移速与伤害", color: "#ff7a70" });
  } else if (enemyDebuffVal === "lr-10") {
    teamBuffs.debuffEleRes = 55;
    teamAuras.push({ tag: "💀 对敌减益：降低抵抗 Lv.10", detail: "-55% 敌火/冰/电/毒抗 (破免按 1/5 = -11%)", color: "#ff7a70" });
  } else if (enemyDebuffVal === "lr-16") {
    teamBuffs.debuffEleRes = 61;
    teamAuras.push({ tag: "💀 对敌减益：降低抵抗 Lv.16", detail: "-61% 敌火/冰/电/毒抗 (破免按 1/5 = -12%)", color: "#ff7a70" });
  }

  // Mercenary innate aura/buff (only active when Mercenary is enabled; innate aura requires combat outside town, gear auras are always active when merc is present)
  const dLvl = Math.max(0, mercLvl - merc.baseLvl);
  const mercEffBonusSkills = mercTot.skills + ctaSkillBonus;
  const mercEnabled = isMercEnabled();
  syncMercEnabledUi(mercEnabled);
  const mercAuraEl = document.getElementById("pd-merc-aura-on");
  const mercInnateAuraOn = mercEnabled && (mercAuraEl ? Boolean(mercAuraEl.checked) : true);
  let bestEnchantLvl = 0, bestEnchantSource = "";
  if (charAuraVal === "enchant-23") {
    bestEnchantLvl = 23;
    bestEnchantSource = "恶魔肢体聚气";
  }
  const mercSkillSummaries = [];
  if (!mercEnabled) {
    teamAuras.push({ tag: "佣兵：未携带", detail: "已取消勾选「携带佣兵」，佣兵自带与装备灵气均不生效", color: "#9ba7be" });
  }
  merc.skills.forEach(sk => {
    const effL = sk.base + Math.floor((dLvl * sk.per32) / 32) + mercEffBonusSkills;
    if (sk.auraDesc) {
      const statusSuffix = !mercEnabled ? " · 未携带" : (mercInnateAuraOn ? "" : " · 城镇未激活");
      mercSkillSummaries.push(sk.name + " Lv." + effL + "（" + sk.auraDesc(effL) + statusSuffix + "）");
      if (!mercEnabled) return;
      if (mercInnateAuraOn) {
        const mBadge = { tag: "佣兵光环：" + sk.name + " Lv." + effL, detail: sk.auraDesc(effL), color: "#8af49f" };
        if (sk.name.includes("力量灵气")) {
          registerTeamAura("力量", effL, { physEdPct: 30 + effL * 10 }, mBadge);
        } else if (sk.name.includes("反抗灵气")) {
          registerTeamAura("反抗", effL, { defPct: 60 + effL * 10 }, mBadge);
        } else if (sk.name.includes("祝福瞄准")) {
          registerTeamAura("祝福瞄准", effL, { arPct: 60 + effL * 15 }, mBadge);
        } else {
          teamAuras.push(mBadge);
          if (sk.name.includes("火焰强化")) {
            if (effL > bestEnchantLvl) { bestEnchantLvl = effL; bestEnchantSource = "佣兵铁狼"; }
          }
          if (sk.name.includes("内视")) teamBuffs.innerSightDef = Math.max(teamBuffs.innerSightDef, 40 + effL * 45);
        }
      } else {
        teamAuras.push({ tag: "佣兵光环：" + sk.name + " Lv." + effL + " (城镇未激活)", detail: "新房城镇未进战斗时不生效 · 勾选「自带光环生效(野外)」后计入面板", color: "#9ba7be" });
      }
    } else {
      mercSkillSummaries.push(sk.name + " Lv." + effL);
    }
  });

  // Set / Gear Granted Oskills (e.g. Horazon 5pc +30 火焰强化 Enchant, Trang-Oul Fire Ball/Wall/Meteor, Chaos WW, Passion Zeal/Berserk, Enigma Teleport)
  const activeOskillBadges = [];
  for (const os of Object.values(charTot.oskills || {})) {
    const found = findAnyClassSkill(os.key);
    const isNative = Boolean(found && found.cls.id === skActiveClassId);
    const isFireSk = Boolean((found && found.sk.dmg && found.sk.dmg.type === "fire") || os.key === "Enchant");
    const effL = os.isCharge
      ? os.baseLvl
      : (isNative
        ? (Math.min(3, os.baseLvl) + charTot.skills + (charTot.classSkills || 0) + ctaSkillBonus + (found ? (charTot.tabSkills[found.sk.page] || 0) : 0))
        : (os.baseLvl + charTot.skills + ctaSkillBonus + (isFireSk ? (charTot.fireSkills || 0) : 0)));
    const skZh = found ? found.sk.nameZh : os.key;
    if (os.key === "Enchant") {
      if (effL > bestEnchantLvl) { bestEnchantLvl = effL; bestEnchantSource = "套装/装备附魔"; }
      activeOskillBadges.push("火焰强化(附魔) Lv." + effL);
    } else {
      const isCombat = Boolean(found && (found.sk.dmg || (pdData && pdData.skillCombatMeta && pdData.skillCombatMeta[os.key])));
      activeOskillBadges.push(skZh + " Lv." + effL);
      teamAuras.push({
        tag: "✨ 自带技能：" + skZh + " Lv." + effL,
        detail: isCombat ? "全职业可用 · 已加入左侧「技能攻击力模拟」下拉列表" : "全职业可用 (套装/装备赋予)",
        color: "#ffd573"
      });
    }
  }

  if (bestEnchantLvl > 0) {
    const enchArPct = 20 + Math.max(0, bestEnchantLvl - 1) * 9;
    teamBuffs.arPct += enchArPct;
    teamBuffs.enchantLvl = bestEnchantLvl;
    teamBuffs.enchantArPct = enchArPct;
    const enchFound = findAnyClassSkill("Enchant");
    if (enchFound && enchFound.sk && enchFound.sk.dmg) {
      const rawMin = computeScaledValue(enchFound.sk.dmg.min, enchFound.sk.dmg.hitShift, bestEnchantLvl);
      const rawMax = computeScaledValue(enchFound.sk.dmg.max, enchFound.sk.dmg.hitShift, bestEnchantLvl);
      const fireMult = 1 + ((bestEnchantSource === "套装/装备附魔" ? (charTot.eleDmg.fire || 0) : 0) / 100);
      teamBuffs.enchantFireMin = Math.round(rawMin * fireMult);
      teamBuffs.enchantFireMax = Math.round(rawMax * fireMult);
    }
    teamAuras.push({
      tag: "🔥 " + bestEnchantSource + "：火焰强化 Lv." + bestEnchantLvl,
      detail: "全队 +" + enchArPct + "% AR · 武器附加 " + teamBuffs.enchantFireMin.toLocaleString() + "–" + teamBuffs.enchantFireMax.toLocaleString() + " 火焰伤害",
      color: "#ff8552"
    });
  }

  const mergedGearAuras = new Map();
  [...charTot.auras, ...(mercEnabled ? mercTot.auras : [])].forEach(a => {
    const prev = mergedGearAuras.get(a.name);
    if (!prev || a.lvl > prev.lvl) mergedGearAuras.set(a.name, a);
  });
  for (const a of mergedGearAuras.values()) {
    const gBadge = { tag: "装备灵气：" + a.name + " Lv." + a.lvl, detail: a.desc || "角色与佣兵双向共享", color: "#e284db" };
    if (["狂热", "专注", "力量", "信念", "反抗", "祝福瞄准", "活力", "救助"].includes(a.name)) {
      registerTeamAura(a.name, a.lvl, {
        eias: a.eias || 0,
        physEdPct: a.edPct || 0,
        hammerEdPct: a.hammerEdPct || 0,
        arPct: a.arPct || 0,
        defPct: a.defPct || 0,
        convRes: a.convRes || 0,
        convDef: a.convDef || 0
      }, gBadge);
    } else {
      teamAuras.push(gBadge);
    }
  }

  for (const a of auraPools.values()) {
    if (a.eias) teamBuffs.fanaEias = Math.max(teamBuffs.fanaEias, a.eias);
    if (a.physEdPct) teamBuffs.physEdPct += a.physEdPct;
    const mEd = a.mercPhysEdPct !== undefined ? a.mercPhysEdPct : (a.physEdPct || 0);
    if (mEd) teamBuffs.mercPhysEdPct += mEd;
    if (a.hammerEdPct) teamBuffs.hammerEdPct = Math.max(teamBuffs.hammerEdPct, a.hammerEdPct);
    if (a.arPct) teamBuffs.arPct += a.arPct;
    if (a.defPct) teamBuffs.defPct += a.defPct;
    if (a.convRes) teamBuffs.convRes = Math.max(teamBuffs.convRes, a.convRes);
    if (a.convDef) teamBuffs.convDef = Math.max(teamBuffs.convDef, a.convDef);
    if (a.frw) teamBuffs.frw += a.frw;
    if (a.salvRes) teamBuffs.salvRes = Math.max(teamBuffs.salvRes, a.salvRes);
  }
  const activeFanaPool = auraPools.get("狂热");
  teamBuffs.fanaLvl = activeFanaPool ? activeFanaPool.lvl : 0;

  const hasMeditation = mergedGearAuras.has("冥想");
  const hasCleansing = mergedGearAuras.has("净化");
  if (mercEnabled && merc.id === "a2-prayer" && mercInnateAuraOn && hasMeditation && hasCleansing) {
    const pLvl = 18 + mercEffBonusSkills;
    const heal = (pLvl * 2 - 5) * 3;
    teamAuras.push({ tag: "★ 祈祷+眼光+治愈三重回血联动", detail: "角色与佣兵每秒恢复 +" + heal + " 生命", color: "#5ec48e" });
  }

  const auraListEl = document.getElementById("pd-active-auras-list");
  if (auraListEl) {
    auraListEl.innerHTML = teamAuras.map(a =>
      '<span class="rw-badge" style="border-color:' + a.color + ';color:' + a.color + ';background:rgba(0,0,0,0.45)" title="' + escapeHtml(a.detail) + '">' +
        escapeHtml(a.tag + " (" + a.detail + ")") +
      '</span>'
    ).join("");
  }

  // Authentic Character Base Stats (Locked) + Manual Stat Point Allocation
  const cBase = (pdData.charBaseStats && pdData.charBaseStats[skActiveClassId]) || {
    str: 15, dex: 20, vit: 25, enr: 20, hpAdd: 30, toHitFactor: 5, lifePerLvl: 2, manaPerLvl: 1.5, lifePerVit: 3, manaPerEnr: 2, blockFactor: 25
  };
  const allocState = clampStatAlloc(charLvl);
  const allocStr = pdStatAlloc.str;
  const allocDex = pdStatAlloc.dex;
  const allocVit = pdStatAlloc.vit;
  const allocEnr = pdStatAlloc.enr;
  const totalStr = cBase.str + allocStr + charTot.str;
  const totalDex = cBase.dex + allocDex + charTot.dex;
  const totalVit = cBase.vit + allocVit + charTot.vit;
  const totalEnr = cBase.enr + allocEnr + charTot.enr;

  // Apply Class Passive Character-Sheet Bonuses (Warlock Levitate Req, Barb Natural Res/Iron Skin/Speed, Pal Max Res & Holy Shield, Ass Weapon Block)
  const palHsWrap = document.getElementById("pd-pal-hs-wrap");
  if (palHsWrap) palHsWrap.style.display = skActiveClassId === "pal" ? "inline-flex" : "none";
  const palHsEl = document.getElementById("pd-pal-hs-on");
  const palHolyShieldOn = skActiveClassId === "pal" ? (palHsEl ? Boolean(palHsEl.checked) : true) : false;
  const totalAllPlusClass = charTot.skills + (charTot.classSkills || 0) + ctaSkillBonus;
  const passiveSheet = computeCharPassiveSheetBonuses(clsObj, getClassBuild(skActiveClassId), charTot, totalAllPlusClass, maxMode, pdCharLoadout, { holyShieldOn: palHolyShieldOn });
  const palHsBadge = document.getElementById("pd-pal-hs-badge");
  if (palHsBadge && skActiveClassId === "pal") {
    if (charTot.shieldBlock <= 0) {
      palHsBadge.textContent = "(未持盾)";
    } else if (!palHolyShieldOn) {
      palHsBadge.textContent = "(已关闭)";
    } else if (passiveSheet.holyShieldActive) {
      palHsBadge.textContent = "Lv." + passiveSheet.holyShieldLvl + " · 防+" + passiveSheet.holyShieldDefPct + "% · 格挡+" + passiveSheet.blockPct + "%";
    } else if (passiveSheet.holyShieldNoSkillPts) {
      palHsBadge.textContent = "(技能树未投点)";
    } else {
      palHsBadge.textContent = "";
    }
  }
  teamBuffs.holyShieldSmiteMin = passiveSheet.smiteMin || 0;
  teamBuffs.holyShieldSmiteMax = passiveSheet.smiteMax || 0;

  const effShieldBlock = charTot.shieldBlock > 0 ? (charTot.shieldBlock + charTot.blockPct + cBase.blockFactor + (passiveSheet.blockPct || 0)) : 0;
  renderStatAllocator(cBase, charTot, charLvl, effShieldBlock);

  // Exact D2R Life & Mana (Gear +Vit/+Enr and +Life/Mana per level are NOT multiplied by BO; D2R truncates with floor!)
  const boableLife = (cBase.hpAdd + cBase.vit) + 60 + (charLvl - 1) * cBase.lifePerLvl + allocVit * cBase.lifePerVit + charTot.flatHp;
  const nonBoLife = charTot.vit * cBase.lifePerVit + (charTot.nonBoHp || 0);
  const charTotalHp = Math.floor(boableLife * (1 + (teamBuffs.hpPct + charTot.hpPct) / 100) + nonBoLife);

  const boableMana = cBase.enr + (charLvl - 1) * cBase.manaPerLvl + allocEnr * cBase.manaPerEnr + charTot.flatMana;
  const nonBoMana = charTot.enr * cBase.manaPerEnr + (charTot.nonBoMana || 0);
  const charTotalMana = Math.floor(boableMana * (1 + (teamBuffs.manaPct + charTot.manaPct) / 100) + nonBoMana);

  // Total Defense & Real Block Chance & FBR (includes set/weapon/ring/charm extraFlatDef e.g. Horazon 4pc +300 Def; passiveSheet.defPct is self-only!)
  const rawDef = charTot.totalArmorDef + (charTot.extraFlatDef || 0) + Math.floor(totalDex / 4);
  const charTotalDef = Math.round(rawDef * (1 + (teamBuffs.defPct + (passiveSheet.defPct || 0)) / 100));
  const charBlockChance = effShieldBlock > 0
    ? Math.min(75, Math.max(0, Math.floor((effShieldBlock * Math.max(0, totalDex - 15)) / (charLvl * 2))))
    : passiveSheet.weaponBlock;

  // Breakpoints (FCR, FHR, FBR, IAS) + next breakpoint gap
  const bp = CLASS_BREAKPOINTS[skActiveClassId] || CLASS_BREAKPOINTS.war;
  const evalBp = (framesArr, val) => {
    let curFrame = framesArr[0][0], nextNeed = null;
    for (const pair of framesArr) {
      if (val >= pair[1]) curFrame = pair[0];
      else if (nextNeed === null) nextNeed = { frame: pair[0], need: pair[1] - val, bp: pair[1] };
    }
    return { curFrame, nextNeed };
  };
  const fcrInfo = evalBp(bp.fcr[0].frames, charTot.fcr);
  const fhrInfo = evalBp(bp.fhr[0].frames, charTot.fhr);
  const fbrTableIdx = (skActiveClassId === "pal" && !passiveSheet.holyShieldActive && bp.fbr && bp.fbr.length > 1) ? 1 : 0;
  const fbrInfo = bp.fbr && bp.fbr[fbrTableIdx] ? evalBp(bp.fbr[fbrTableIdx].frames, charTot.fbr) : { curFrame: "-", nextNeed: null };
  const iasInfo = evalIasBreakpoints(bp.iasBaseFrames || 15, charTot.ias, charTot.mainWsm, teamBuffs.fanaEias + (teamBuffs.hexEias || 0));
  const charAtkFrame = iasInfo.curFrame;

  const weapInfo = pdCharLoadout.weapon ? resolveEquippedItemInfo(pdCharLoadout.weapon, { actorLvl: charLvl, isChar: true }) : null;
  const offInfo = pdCharLoadout.offhand ? resolveEquippedItemInfo(pdCharLoadout.offhand, { actorLvl: charLvl, isChar: true }) : null;
  const weapBaseName = weapInfo && weapInfo.bRule ? weapInfo.bRule.nameZh : "";
  const weaponLabel = weapInfo
    ? (weapInfo.titleZh + (weapBaseName && !weapInfo.titleZh.includes(weapBaseName) ? (" (" + weapBaseName + ")") : ""))
    : "徒手";
  const shieldLabel = (charTot.shieldBlock > 0 && offInfo) ? offInfo.titleZh : "";
  const shieldPanelBlock = charTot.shieldBlock > 0 ? (charTot.shieldBlock + charTot.blockPct + cBase.blockFactor) : 0;

  pdLastBreakpointSnapshot = {
    classId: skActiveClassId,
    className: clsObj ? clsObj.nameZh : skActiveClassId,
    charLvl,
    fcr: charTot.fcr,
    fhr: charTot.fhr,
    fbr: charTot.fbr,
    ias: charTot.ias,
    mainWsm: charTot.mainWsm,
    weaponName: weaponLabel,
    fanaLvl: teamBuffs.fanaLvl || 0,
    fanaEias: teamBuffs.fanaEias || 0,
    hexEias: teamBuffs.hexEias || 0,
    bosLvl: 0,
    hasShield: charTot.shieldBlock > 0,
    shieldName: shieldLabel,
    shieldPanelBlock,
    holyShieldBlockPct: passiveSheet.blockPct || 0,
    effShieldBlock,
    totalDex,
    charBlockChance
  };

  // Hell Resistances with Max Res caps, Barbarian Natural Resistance & Paladin Max Res Passives
  const rawFRes = -70 + charTot.fRes + teamBuffs.salvRes + passiveSheet.allRes;
  const rawCRes = -70 + charTot.cRes + teamBuffs.salvRes + passiveSheet.allRes;
  const rawLRes = -70 + charTot.lRes + teamBuffs.salvRes + passiveSheet.allRes;
  const rawPRes = -70 + charTot.pRes + passiveSheet.allRes;
  const maxF = Math.min(95, charTot.maxFRes + passiveSheet.maxFRes);
  const maxC = Math.min(95, charTot.maxCRes + passiveSheet.maxCRes);
  const maxL = Math.min(95, charTot.maxLRes + passiveSheet.maxLRes);
  const maxP = Math.min(95, charTot.maxPRes);
  const fmtRes = (raw, cap) => {
    const eff = Math.min(cap, raw);
    const over = raw > cap ? (" (溢出+" + (raw - cap) + ")") : "";
    const color = eff >= cap ? "#67e87a" : eff >= 50 ? "#ffd573" : "#ff8a75";
    return '<span style="color:' + color + '">' + eff + '%</span><span style="color:var(--muted);font-size:10.5px">/' + cap + '%' + over + '</span>';
  };

  // Build complete Skill Sync Payload (All + Class + Tabs + Fire + Single skills!)
  pdLastCharSkillBonus = totalAllPlusClass;
  pdLastSyncPayload = {
    all: totalAllPlusClass,
    byTab: { 1: charTot.tabSkills[1] || 0, 2: charTot.tabSkills[2] || 0, 3: charTot.tabSkills[3] || 0 },
    bySkill: Object.assign({}, charTot.singleSkills || {}),
    fire: charTot.fireSkills || 0
  };
  const extraSkillParts = [];
  if (clsObj && clsObj.tabs) {
    clsObj.tabs.forEach(t => {
      if (pdLastSyncPayload.byTab[t.page] > 0) extraSkillParts.push(t.zhCN.slice(0, 2) + "+" + pdLastSyncPayload.byTab[t.page]);
    });
  }
  if (pdLastSyncPayload.fire > 0) extraSkillParts.push("火系+" + pdLastSyncPayload.fire);
  Object.entries(pdLastSyncPayload.bySkill).forEach(([k, v]) => {
    if (v > 0) {
      const sObj = clsObj && clsObj.skills.find(x => x.key === k);
      extraSkillParts.push((sObj ? sObj.nameZh : k) + "+" + v);
    }
  });
  const syncBtn = document.getElementById("pd-sync-skills-btn");
  if (syncBtn) {
    syncBtn.textContent = (pdAutoSyncSkills ? "✓ 自动已同步 (全+" : "手动同步 +技能 (全+") + totalAllPlusClass + (extraSkillParts.length ? (" · " + extraSkillParts.join("/")) : "") + ")";
  }
  if (pdAutoSyncSkills) {
    applyPaperdollSkillsToTree(true);
  }

  // Render Selected Skill Attack Power Card
  const combat = computeSelectedSkillCombat({
    clsObj, charTot, charLvl, totalStr, totalDex, ctaSkillBonus, teamBuffs,
    charFcrFrame: fcrInfo.curFrame, charAtkFrame, maxMode
  });
  const activeShareSk = clsObj && Array.isArray(clsObj.skills) ? clsObj.skills.find(s => s.key === pdSelectedSkillKey) : null;
  const shareSkillDmg = combat.dmgMax > 0
    ? (combat.dmgMin.toLocaleString() + "–" + combat.dmgMax.toLocaleString())
    : "";
  pdLastShareSummary = {
    classId: skActiveClassId,
    hp: charTotalHp,
    mana: charTotalMana,
    def: charTotalDef,
    blockChance: charBlockChance,
    fcr: charTot.fcr,
    fcrFrame: fcrInfo.curFrame,
    fhr: charTot.fhr,
    fhrFrame: fhrInfo.curFrame,
    ias: charTot.ias,
    iasFrame: iasInfo.curFrame,
    fbr: charTot.fbr,
    fbrFrame: typeof fbrInfo.curFrame === "number" ? fbrInfo.curFrame : 0,
    mf: charTot.mf,
    dr: Math.min(50, charTot.drPct),
    resF: Math.min(maxF, rawFRes),
    resC: Math.min(maxC, rawCRes),
    resL: Math.min(maxL, rawLRes),
    resP: Math.min(maxP, rawPRes),
    allSkillBonus: totalAllPlusClass,
    skillBonuses: {
      all: totalAllPlusClass,
      gearAll: charTot.skills + (charTot.classSkills || 0),
      cta: ctaSkillBonus,
      byTab: { 1: charTot.tabSkills[1] || 0, 2: charTot.tabSkills[2] || 0, 3: charTot.tabSkills[3] || 0 },
      bySkill: Object.assign({}, charTot.singleSkills || {}),
      fire: charTot.fireSkills || 0
    },
    totalStr,
    totalDex,
    totalVit,
    totalEnr,
    skillName: activeShareSk ? activeShareSk.nameZh : "",
    skillLvl: combat.effLvl || 0,
    skillDmg: shareSkillDmg,
    dps: combat.dps || 0,
    weaponName: weaponLabel,
    shieldName: shieldLabel
  };
  const dmgAvgCur = combat.dmgMax > 0 ? Math.round((combat.dmgMin + combat.dmgMax) / 2) : 0;
  pdLatestCompareMetrics = {
    classId: skActiveClassId,
    charLvl,
    hp: charTotalHp,
    mana: charTotalMana,
    def: charTotalDef,
    blockChance: charBlockChance,
    fcr: charTot.fcr,
    fcrFrame: fcrInfo.curFrame,
    fhr: charTot.fhr,
    fhrFrame: fhrInfo.curFrame,
    ias: charTot.ias,
    iasFrame: iasInfo.curFrame,
    fbr: charTot.fbr,
    fbrFrame: typeof fbrInfo.curFrame === "number" ? fbrInfo.curFrame : 0,
    frw: charTot.frw + passiveSheet.frw + (teamBuffs.frw || 0),
    mf: charTot.mf,
    dr: Math.min(50, charTot.drPct),
    resF: Math.min(maxF, rawFRes),
    resC: Math.min(maxC, rawCRes),
    resL: Math.min(maxL, rawLRes),
    resP: Math.min(maxP, rawPRes),
    allSkillBonus: totalAllPlusClass,
    skillLvl: combat.effLvl || 0,
    dmgAvg: dmgAvgCur,
    dps: combat.dps || 0,
    skillAr: combat.skillAr || 0,
    hitPct: combat.hitPct || 0,
    weaponName: weaponLabel,
    shieldName: shieldLabel
  };
  renderPaperdollCompareBar(pdLatestCompareMetrics);
  const cmpBase = (pdCompareBaseline && pdCompareBaseline.classId === skActiveClassId) ? pdCompareBaseline.metrics : null;

  const atkResultEl = document.getElementById("pd-skill-atk-result");
  if (atkResultEl) {
    const typeColors = { phys: "#f5cf7b", fire: "#ff7a59", cold: "#64b5f6", ltng: "#ffe066", pois: "#67e87a", mag: "#c792ea" };
    const typeNames = { phys: "物理", fire: "火焰", cold: "冰冷", ltng: "闪电", pois: "毒素", mag: "魔法" };
    const tc = typeColors[combat.dmgType] || "#ffd573";
    const tn = typeNames[combat.dmgType] || "伤害";
    const dSkillLvl = cmpBase ? fmtCompareDelta(combat.effLvl, cmpBase.skillLvl) : "";
    const dDmgAvg = cmpBase && combat.dmgMax > 0 ? fmtCompareDelta(dmgAvgCur, cmpBase.dmgAvg, { showPct: true }) : "";
    const dDps = cmpBase && combat.dps > 0 ? fmtCompareDelta(combat.dps, cmpBase.dps, { unit: "/秒", showPct: true }) : "";
    const dAr = cmpBase ? fmtCompareDelta(combat.skillAr, cmpBase.skillAr) : "";
    const dHit = cmpBase ? fmtCompareDelta(combat.hitPct, cmpBase.hitPct, { unit: "%" }) : "";
    atkResultEl.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px">' +
        '<div class="pd-sheet-card" style="border-color:rgba(255,138,117,0.35)">' +
          '<div style="font-size:10.5px;color:var(--muted)">选定技能有效等级</div>' +
          '<div style="font-size:15px;font-weight:900;color:#ffe08c">Lv.' + combat.effLvl + dSkillLvl + '</div>' +
          '<div style="font-size:10.5px;color:var(--muted)">耗蓝 ' + combat.manaCost + (combat.tabBonus ? (' · 含分系/单技+' + combat.tabBonus) : '') + '</div>' +
        '</div>' +
        '<div class="pd-sheet-card" style="border-color:rgba(245,207,123,0.4)">' +
          '<div style="font-size:10.5px;color:var(--muted)">' + (combat.lcsMax > 0 ? ('游戏 C 键面板攻击力 (' + tn + ')') : ('面板技能攻击力 (' + tn + ')')) + '</div>' +
          '<div style="font-size:15px;font-weight:900;color:' + tc + '">' + (combat.lcsMax > 0 ? (combat.lcsMin.toLocaleString() + ' – ' + combat.lcsMax.toLocaleString()) : (combat.dmgMax > 0 ? (combat.dmgMin.toLocaleString() + ' – ' + combat.dmgMax.toLocaleString()) : '辅助技能')) + (combat.lcsMax > 0 ? '' : dDmgAvg) + '</div>' +
          (combat.lcsMax > 0 ? ('<div style="font-size:10.5px;color:#8af49f">实战真实单次 ≈ ' + combat.dmgMin.toLocaleString() + ' – ' + combat.dmgMax.toLocaleString() + dDmgAvg + '</div>') : '') +
          '<div style="font-size:10.5px;color:var(--muted)">' + (combat.dps > 0 ? ('理论 DPS ≈ ' + combat.dps.toLocaleString() + '/秒' + (combat.lcsMax > 0 ? ' (按真实伤)' : '') + dDps) : '无直接单次伤害') + '</div>' +
        '</div>' +
        '<div class="pd-sheet-card" style="border-color:rgba(104,164,255,0.4)">' +
          '<div style="font-size:10.5px;color:var(--muted)">攻击准确率 AR (对 Lv.85)</div>' +
          '<div style="font-size:15px;font-weight:900;color:#9ad8ff">' + combat.skillAr.toLocaleString() + dAr + '</div>' +
          '<div style="font-size:10.5px;color:#8af49f">实战命中率 ' + combat.hitPct + '%' + dHit + '</div>' +
        '</div>' +
      '</div>' +
      (combat.extraNotes.length
        ? ('<details class="pd-skill-notes-details" id="pd-skill-notes-details"' + (pdSkillNotesOpen ? ' open' : '') + '>' +
            '<summary class="pd-skill-notes-summary"><span>查看伤害构成与增益明细（' + combat.extraNotes.length + ' 项）</span></summary>' +
            '<div class="pd-skill-notes-body">' + renderStatList(combat.extraNotes.join(" · "), "#cfe0fa", false) + '</div>' +
          '</details>')
        : '');
  }

  // Render Comprehensive D2R Character Sheet
  const effDr = Math.min(50, charTot.drPct);
  const sunderLabels = { ltng: "破电", fire: "破火", cold: "破冰", pois: "破毒", phys: "破物", mag: "破魔" };
  const activeSunders = [...charTot.sunders].map(k => sunderLabels[k] || k);
  const eleDmgParts = [];
  if (charTot.eleDmg.fire) eleDmgParts.push("火+" + charTot.eleDmg.fire + "%");
  if (charTot.eleDmg.cold) eleDmgParts.push("冰+" + charTot.eleDmg.cold + "%");
  if (charTot.eleDmg.ltng) eleDmgParts.push("电+" + charTot.eleDmg.ltng + "%");
  if (charTot.eleDmg.pois) eleDmgParts.push("毒+" + charTot.eleDmg.pois + "%");
  if (charTot.eleDmg.mag) eleDmgParts.push("魔+" + charTot.eleDmg.mag + "%");

  const fmtBpGap = (info) => info.nextNeed
    ? (' <span style="color:var(--muted);font-size:10px">(距' + info.nextNeed.frame + '帧差+' + info.nextNeed.need + '%)</span>')
    : ' <span style="color:#67e87a;font-size:10px">(✓满档)</span>';
  const iasBuffTags = [];
  if (teamBuffs.fanaLvl > 0) iasBuffTags.push("狂热Lv." + teamBuffs.fanaLvl);
  if (teamBuffs.hexEias > 0) iasBuffTags.push("邪咒+" + teamBuffs.hexEias + "%EIAS");
  const iasMetaTag = ' <span style="color:var(--muted);font-size:10px">[WSM ' + charTot.mainWsm + (iasBuffTags.length ? (" · " + iasBuffTags.join("·")) : "") + ']</span>';

  const kv = (k, v) => '<div class="pd-sheet-kv"><span class="pd-sheet-k">' + k + '</span><span class="pd-sheet-v">' + v + '</span></div>';
  const totalDefPct = (teamBuffs.defPct || 0) + (passiveSheet.defPct || 0);
  const dexFor75Block = effShieldBlock > 0 ? Math.ceil((75 * charLvl * 2) / effShieldBlock) + 15 : 0;
  const charStatsEl = document.getElementById("pd-char-stats");
  if (charStatsEl) {
    const bagLayout = layoutInventoryBag(pdCharBag);
    const gearWarn = (totalStr < charTot.maxReqStr || totalDex < charTot.maxReqDex)
      ? '<span style="color:#ff8a75">⚠️ 力/敏未达穿戴需求</span>'
      : '<span style="color:#67e87a">✓ 穿戴需求达标</span>';
    const defBonusTag = totalDefPct > 0
      ? (' <span style="color:#8af49f">(+' + totalDefPct + '%' + (passiveSheet.holyShieldActive ? ' 含圣盾' : '') + ')</span>')
      : '';
    const blockDetailTag = charTot.shieldBlock > 0
      ? (' <span style="color:var(--muted);font-size:10px">(盾' + shieldPanelBlock + '%' + (passiveSheet.blockPct > 0 ? ('+圣盾' + passiveSheet.blockPct + '%') : '') + '=' + effShieldBlock + '% · 满75%需' + dexFor75Block + '敏)</span>')
      : '';
    charStatsEl.innerHTML =
      '<div class="pd-sheet-grid">' +
        '<div class="pd-sheet-card">' +
          '<div class="pd-sheet-title">四维汇总与技能加成 (剩余 ' + allocState.rem + ' 点)</div>' +
          kv("装备穿戴校验", gearWarn) +
          kv("全技能 / 职业技能", '<span style="color:#ffd573">+' + totalAllPlusClass + '</span>' + (cmpBase ? fmtCompareDelta(totalAllPlusClass, cmpBase.allSkillBonus) : '') + ' <span style="color:var(--muted);font-size:10.5px">(全+' + (charTot.skills + ctaSkillBonus) + ' · 职业+' + (charTot.classSkills || 0) + ')</span>') +
          kv("分系 / 单技能加成", extraSkillParts.length ? ('<span style="color:#9ad8ff">' + extraSkillParts.join(" · ") + '</span>') : "无") +
          kv("体力 / 精力总值", totalVit + ' / ' + totalEnr) +
          (passiveSheet.notes.length ? kv("职业被动联动", '<span style="color:#8af49f;font-size:11px">' + escapeHtml(passiveSheet.notes.join(" · ")) + '</span>') : '') +
        '</div>' +
        '<div class="pd-sheet-card">' +
          '<div class="pd-sheet-title">生存、防御与格挡</div>' +
          kv("总生命值 Life", '<span style="color:#ff8a75">' + charTotalHp.toLocaleString() + '</span>' + (cmpBase ? fmtCompareDelta(charTotalHp, cmpBase.hp) : '')) +
          kv("总法力值 Mana", '<span style="color:#78b7ff">' + charTotalMana.toLocaleString() + '</span>' + (cmpBase ? fmtCompareDelta(charTotalMana, cmpBase.mana) : '')) +
          kv("总防御值 Defense", charTotalDef.toLocaleString() + defBonusTag + (cmpBase ? fmtCompareDelta(charTotalDef, cmpBase.def) : '')) +
          kv("实际格挡率 Block", (charTot.shieldBlock > 0 ? ('<strong>' + charBlockChance + '%</strong>' + (cmpBase ? fmtCompareDelta(charBlockChance, cmpBase.blockChance, { unit: "%" }) : '') + blockDetailTag + ' · FBR ' + charTot.fbr + '% → <strong>' + fbrInfo.curFrame + '帧</strong>' + fmtBpGap(fbrInfo)) : (passiveSheet.weaponBlock > 0 ? ('<span style="color:#8af49f">' + passiveSheet.weaponBlock + '% (双爪武器格挡)</span>') : '未持盾 (0%)'))) +
          kv("无法冰冻 CBF", charTot.cbf ? '<span style="color:#67e87a">✓ 已具备</span>' : '<span style="color:#ff9b8f">✗ 未具备</span>') +
        '</div>' +
        '<div class="pd-sheet-card">' +
          '<div class="pd-sheet-title" style="display:flex;align-items:center;justify-content:space-between;gap:6px"><span>攻击、准确 AR 与速度档位</span><button type="button" class="pd-jump-bp-btn" id="pd-jump-bp-btn">📊 完整档位表 →</button></div>' +
          kv("准确值 / 普攻面板", '<span style="color:#9ad8ff">' + combat.normalAr.toLocaleString() + '</span> <span style="color:var(--muted);font-size:10px">(命中' + combat.normalHitPct + '%)</span> · ' + combat.normalMin.toLocaleString() + '–' + combat.normalMax.toLocaleString()) +
          kv("快速施法 FCR", charTot.fcr + '% → <strong>' + fcrInfo.curFrame + ' 帧</strong>' + (cmpBase ? (fmtCompareDelta(charTot.fcr, cmpBase.fcr, { unit: "%" }) + fmtCompareFrameDelta(fcrInfo.curFrame, cmpBase.fcrFrame)) : '') + fmtBpGap(fcrInfo)) +
          kv("打击恢复 FHR", charTot.fhr + '% → <strong>' + fhrInfo.curFrame + ' 帧</strong>' + (cmpBase ? (fmtCompareDelta(charTot.fhr, cmpBase.fhr, { unit: "%" }) + fmtCompareFrameDelta(fhrInfo.curFrame, cmpBase.fhrFrame)) : '') + fmtBpGap(fhrInfo)) +
          kv("攻击速度 IAS", charTot.ias + '%' + iasMetaTag + ' → <strong>' + iasInfo.curFrame + ' 帧</strong>' + (cmpBase ? (fmtCompareDelta(charTot.ias, cmpBase.ias, { unit: "%" }) + fmtCompareFrameDelta(iasInfo.curFrame, cmpBase.iasFrame)) : '') + fmtBpGap(iasInfo)) +
          kv("高速跑步 FRW", '+' + (charTot.frw + passiveSheet.frw + (teamBuffs.frw || 0)) + '%' + (cmpBase ? fmtCompareDelta(charTot.frw + passiveSheet.frw + (teamBuffs.frw || 0), cmpBase.frw, { unit: "%" }) : '') + ((passiveSheet.frw || teamBuffs.frw) ? (' <span style="color:var(--muted);font-size:10px">(' + [passiveSheet.frw ? '含加速' : '', teamBuffs.frw ? ('含活力+' + teamBuffs.frw + '%') : ''].filter(Boolean).join('·') + ')</span>') : '')) +
        '</div>' +
        '<div class="pd-sheet-card">' +
          '<div class="pd-sheet-title">地狱四抗 (含安亚+30) 与减伤</div>' +
          kv("火焰抗性 Fire", fmtRes(rawFRes, maxF) + (cmpBase ? fmtCompareDelta(Math.min(maxF, rawFRes), cmpBase.resF, { unit: "%" }) : '')) +
          kv("冰冷抗性 Cold", fmtRes(rawCRes, maxC) + (cmpBase ? fmtCompareDelta(Math.min(maxC, rawCRes), cmpBase.resC, { unit: "%" }) : '')) +
          kv("闪电抗性 Ltng", fmtRes(rawLRes, maxL) + (cmpBase ? fmtCompareDelta(Math.min(maxL, rawLRes), cmpBase.resL, { unit: "%" }) : '')) +
          kv("毒素抗性 Pois", fmtRes(rawPRes, maxP) + (cmpBase ? fmtCompareDelta(Math.min(maxP, rawPRes), cmpBase.resP, { unit: "%" }) : '')) +
          kv("物理减伤 / PDR / MDR", 'DR ' + effDr + '%' + (cmpBase ? fmtCompareDelta(effDr, cmpBase.dr, { unit: "%" }) : '') + ' (上限50%) · PDR ' + charTot.pdr + ' · MDR ' + charTot.mdr) +
        '</div>' +
        '<div class="pd-sheet-card">' +
          '<div class="pd-sheet-title">战斗特效与元素穿透</div>' +
          kv("压碎 CB / 致命 DS / 撕裂 OW", charTot.cb + '% / ' + charTot.ds + '% / ' + charTot.ow + '%') +
          kv("吸血 LL / 吸蓝 ML", charTot.ll + '% / ' + charTot.ml + '%') +
          kv("杀回蓝 MAEK / 杀回血 LAEK", '+' + (charTot.maek + (teamBuffs.hexMaek || 0)) + ' / +' + (charTot.laek + (teamBuffs.hexLaek || 0)) + (teamBuffs.hexLaek ? ' <span style="color:#9ad8ff;font-size:10px">(含虹吸)</span>' : '')) +
          kv("元素增伤 / 降抗", (eleDmgParts.length ? eleDmgParts.join(" ") : "无") + (charTot.pierce.length ? (" · " + charTot.pierce.join("/")) : "")) +
          kv("破免板状态", activeSunders.length ? ('<span style="color:#ffd573">' + activeSunders.join(" · ") + '</span>') : '未携带破免板') +
        '</div>' +
        '<div class="pd-sheet-card">' +
          '<div class="pd-sheet-title">收益、套装与背包占格</div>' +
          kv("寻宝率 MF", '<span style="color:#ffd573">+' + charTot.mf + '%</span>' + (cmpBase ? fmtCompareDelta(charTot.mf, cmpBase.mf, { unit: "%" }) : '')) +
          kv("额外金币 EG / 经验 Exp", '+' + charTot.eg + '% / +' + charTot.expPct + '%') +
          kv("背包咒符空间", '已用 ' + bagLayout.usedCells + '/40 格 (' + bagLayout.placed.length + ' 件)') +
          kv("已激活套装", charTot.activeSets.length ? charTot.activeSets.join(", ") : "无") +
          (activeOskillBadges.length ? kv("套装/装备自带技能", '<span style="color:#ffaa4d">' + escapeHtml(activeOskillBadges.join(" · ")) + '</span>') : "") +
        '</div>' +
      '</div>';
  }

  // Render Mercenary total stats & breakpoints (hireling.txt: Str/Dex in 1/8, Resist in 1/4, Poison cap 75% unless +MaxPRes)
  const mBaseStr = merc.str + Math.floor((dLvl * merc.str8) / 8);
  const mBaseDex = merc.dex + Math.floor((dLvl * merc.dex8) / 8);
  const mBaseHp = merc.hp + dLvl * merc.hpLvl + mercTot.flatHp;
  const mBaseDef = merc.def + dLvl * merc.defLvl + mercTot.totalArmorDef + (mercTot.extraFlatDef || 0);
  const mTotalDef = Math.round(mBaseDef * (1 + teamBuffs.defPct / 100));
  const mBaseResHell = merc.res + Math.floor((dLvl * merc.res4) / 4) - 100;

  const mTotalStr = mBaseStr + mercTot.str;
  const mTotalDex = mBaseDex + mercTot.dex;
  const mHpMult = 1 + (teamBuffs.hpPct + mercTot.hpPct) / 100;
  const mTotalHp = Math.floor(mBaseHp * mHpMult) + (mercTot.nonBoHp || 0);
  const mFRes = Math.min(mercTot.maxFRes, mBaseResHell + mercTot.fRes + teamBuffs.salvRes);
  const mCRes = Math.min(mercTot.maxCRes, mBaseResHell + mercTot.cRes + teamBuffs.salvRes);
  const mLRes = Math.min(mercTot.maxLRes, mBaseResHell + mercTot.lRes + teamBuffs.salvRes);
  const mPRes = Math.min(mercTot.maxPRes, mBaseResHell + mercTot.pRes);

  const mGearEias = Math.floor((120 * mercTot.ias) / (120 + mercTot.ias));
  const mEias = Math.min(75, Math.max(-75, mGearEias + teamBuffs.fanaEias - mercTot.mainWsm));
  const mAtkFrame = Math.max(8, Math.ceil((256 * merc.baseFrames) / Math.floor((256 * (100 + mEias)) / 100)) - 1);
  const mAps = (25 / mAtkFrame).toFixed(2);
  const mWeapMin = Math.floor((mercTot.mainWeapMin + mercTot.flatDmg + mercTot.flatMinDmg) * (1 + (mTotalStr + mercTot.offWeaponEdPct + teamBuffs.mercPhysEdPct) / 100)) + (teamBuffs.enchantFireMin || 0);
  const mWeapMax = Math.floor((mercTot.mainWeapMax + mercTot.flatDmg + mercTot.flatMaxDmg) * (1 + (mTotalStr + mercTot.offWeaponEdPct + teamBuffs.mercPhysEdPct) / 100)) + (teamBuffs.enchantFireMax || 0);
  const mAr = Math.floor((mTotalDex * 5 + mercLvl * 18 + mercTot.flatAr) * (1 + (mercTot.arPct + teamBuffs.arPct) / 100));

  const checkEl = document.getElementById("merc-equip-check");
  if (checkEl) {
    if (!mercEnabled) {
      checkEl.innerHTML = "⏸️ <strong>当前未携带佣兵</strong>（已置灰锁定不可修改 · 勾选左上角「携带佣兵」即可恢复配装与灵气加成）";
    } else {
      const canStr = mTotalStr >= mercTot.maxReqStr;
      const canDex = mTotalDex >= mercTot.maxReqDex;
      checkEl.innerHTML = (canStr && canDex)
        ? ("✓ <strong>佣兵属性达标可穿戴全部装备</strong>（总力量 <strong>" + mTotalStr + "</strong>/需 " + mercTot.maxReqStr + " · 总敏捷 <strong>" + mTotalDex + "</strong>/需 " + mercTot.maxReqDex + "）")
        : ("⚠️ <strong>佣兵穿戴属性不足！</strong>当前力量 " + mTotalStr + " (需 " + mercTot.maxReqStr + ") · 敏捷 " + mTotalDex + " (需 " + mercTot.maxReqDex + ")，请镶嵌 #19 法尔/完美紫或调整等级");
    }
  }

  const hpNote = mHpMult > 1 ? (" (含全队增益 x" + mHpMult.toFixed(2) + ")") : "";
  const mercGearAuraTxt = mercTot.auras.length
    ? mercTot.auras.map(a => a.name + " Lv." + a.lvl).join(" / ")
    : "无";
  const mLines = [
    "自带技能与光环：" + mercSkillSummaries.join(" · "),
    "装备赋予光环：" + mercGearAuraTxt + (mercEnabled ? "（装备光环在城里常驻生效）" : "（未携带佣兵 · 未生效）"),
    "生命值：" + mTotalHp.toLocaleString() + hpNote + " · 总防御：" + mTotalDef.toLocaleString(),
    "面板伤害：" + mWeapMin.toLocaleString() + "–" + mWeapMax.toLocaleString() + " · 准确率 AR：" + mAr.toLocaleString(),
    "力量：" + mTotalStr + " (裸 " + mBaseStr + ") · 敏捷：" + mTotalDex + " (裸 " + mBaseDex + ") · 全技能 +" + mercEffBonusSkills,
    "地狱四抗：火 " + mFRes + "% · 冰 " + mCRes + "% · 电 " + mLRes + "% · 毒 " + mPRes + "% (裸抗 " + mBaseResHell + "%)",
    "攻击速度：总 IAS " + mercTot.ias + "%" + (teamBuffs.fanaEias > 0 ? (" (+狂热 EIAS " + teamBuffs.fanaEias + "%)") : "") + " (WSM [" + mercTot.mainWsm + "]) → " + mAtkFrame + " 帧 (" + mAps + " 次/秒)",
    "战斗特效：吸血 LL " + mercTot.ll + "% · 压碎 CB " + mercTot.cb + "% · 致命 DS " + mercTot.ds + "% · 物免 DR " + Math.min(50, mercTot.drPct) + "% · CBF " + (mercTot.cbf ? "✓" : "✗")
  ];
  const mBodyEl = document.getElementById("merc-stats-body");
  if (mBodyEl) mBodyEl.innerHTML = renderStatList(mLines.join(" · "), "#8af49f", false);

  if (pdLastShareSummary) {
    pdLastShareSummary.merc = {
      enabled: mercEnabled,
      innateAuraOn: mercInnateAuraOn,
      variant: merc.id,
      lvl: mercLvl,
      hp: mTotalHp,
      hpMult: Number(mHpMult.toFixed(2)),
      def: mTotalDef,
      dmgMin: mWeapMin,
      dmgMax: mWeapMax,
      ar: mAr,
      str: mTotalStr,
      baseStr: mBaseStr,
      dex: mTotalDex,
      baseDex: mBaseDex,
      reqStr: mercTot.maxReqStr,
      reqDex: mercTot.maxReqDex,
      reqOk: Boolean(mTotalStr >= mercTot.maxReqStr && mTotalDex >= mercTot.maxReqDex),
      allSkills: mercEffBonusSkills,
      resF: mFRes,
      resC: mCRes,
      resL: mLRes,
      resP: mPRes,
      baseResHell: mBaseResHell,
      ias: mercTot.ias,
      wsm: mercTot.mainWsm,
      fanaEias: teamBuffs.fanaEias || 0,
      atkFrame: mAtkFrame,
      aps: Number(mAps),
      ll: mercTot.ll,
      cb: mercTot.cb,
      ds: mercTot.ds,
      dr: Math.min(50, mercTot.drPct),
      cbf: Boolean(mercTot.cbf),
      skills: mercSkillSummaries.join(" · "),
      gearAuras: mercGearAuraTxt
    };
  }

  pdLastHoverCtx = {
    charStr: totalStr,
    charDex: totalDex,
    mercStr: mTotalStr,
    mercDex: mTotalDex,
    charSetCounts: charTot.setCounts,
    mercSetCounts: mercTot.setCounts
  };
  renderActiveItemPreview();

  // Auto-persist current class paperdoll, bag, stat allocation, auras, Hex buff & mercenary to localStorage
  if (pdStateLoadedForClass === skActiveClassId) {
    savePaperdollState(skActiveClassId);
  }

  // Auto-sync live Paperdoll stats into Breakpoints calculator when enabled
  if (bpAutoSyncEnabled && !bpManualOverride && !bpSyncingFromPd) {
    syncPaperdollToBreakpoints(true);
  } else {
    renderBpSyncBadge();
  }
}

function renderPaperdollAll() {
  if (!itData || !pdData) return;
  if (!isMercEnabled() && pdActiveTarget === "merc") {
    pdActiveTarget = "char";
    pdActiveSlot = pdCharLoadout.weapon ? "weapon" : "head";
    pdActiveBagUid = null;
  }
  const clsObj = getActiveClassObj();
  const charTitleEl = document.getElementById("pd-char-title");
  if (charTitleEl && clsObj) {
    charTitleEl.innerHTML = '<img class="ui-chip-icon" src="' + escapeHtml(clsObj.icon) + '" alt="">' + escapeHtml(clsObj.nameZh) + ' (' + escapeHtml(clsObj.nameEn) + ') 10 部位配装纸娃娃';
  }

  populateBagAddSelect();
  populatePdSkillSelect();
  renderWeaponSwapBar();
  renderPaperdollSlotGrid("pd-char-grid", "char", PD_CHAR_SLOTS, pdCharLoadout);
  renderPaperdollSlotGrid("pd-merc-grid", "merc", PD_MERC_SLOTS, pdMercLoadout);
  renderInventoryBag();
  renderSlotEditor();
  renderPaperdollLiveStats();
}

async function initMercenarySimulator() {
  await Promise.all([ensureItemsCatalogData(), ensureRunewordsCatalogData()]);
  let pdJustLoaded = false;
  if (!pdData) {
    try {
      const res = await fetch("/api/paperdoll", { cache: "no-store" });
      const d = await res.json();
      if (d && d.ok) {
        setPdData(d);
        pdJustLoaded = true;
      }
    } catch (e) {
      console.error("加载纸娃娃配装数据失败", e);
    }
  }
  const vSel = document.getElementById("merc-variant-select");
  if (!vSel) return;

  if (!vSel.options.length) {
    vSel.innerHTML = MERC_VARIANTS.map(v => '<option value="' + escapeHtml(v.id) + '">' + escapeHtml(v.name) + '</option>').join("");
    loadAllSavedPaperdollBuilds();
    loadPaperdollStateForClass(skActiveClassId);

    vSel.addEventListener("change", () => {
      if (!isMercEnabled()) return;
      const merc = getCurrentMercVariant();
      if (merc.act === 1) {
        pdMercLoadout.weapon = { cat: "rw", id: "faith", baseCode: "amc", eth: false, sockets: [], rolls: {} };
        pdMercLoadout.offhand = null;
      } else if (merc.act === 2) {
        pdMercLoadout.weapon = { cat: "rw", id: "infinity", baseCode: "7wc", eth: true, sockets: [], rolls: {} };
        pdMercLoadout.offhand = null;
      } else if (merc.act === 3) {
        pdMercLoadout.weapon = { cat: "rw", id: "spirit", baseCode: "crs", eth: false, sockets: [], rolls: {} };
        pdMercLoadout.offhand = { cat: "rw", id: "spirit", baseCode: "uit", eth: false, sockets: [], rolls: {} };
      } else if (merc.id === "a5-frenzy") {
        pdMercLoadout.weapon = { cat: "rw", id: "plague", baseCode: "7cr", eth: false, sockets: [], rolls: {} };
        pdMercLoadout.offhand = { cat: "rw", id: "lawbringer", baseCode: "7cr", eth: false, sockets: [], rolls: {} };
      } else {
        pdMercLoadout.weapon = { cat: "rw", id: "last-wish", baseCode: "7fb", eth: true, sockets: [], rolls: {} };
        pdMercLoadout.offhand = null;
      }
      renderPaperdollAll();
    });

    const mercEnabledEl = document.getElementById("pd-merc-enabled");
    if (mercEnabledEl) {
      mercEnabledEl.addEventListener("change", () => {
        if (!mercEnabledEl.checked && pdActiveTarget === "merc") {
          pdActiveTarget = "char";
          pdActiveSlot = pdCharLoadout.weapon ? "weapon" : "head";
          pdActiveBagUid = null;
        }
        renderPaperdollAll();
      });
    }

    ["merc-lvl-input", "pd-merc-aura-on", "pd-char-lvl", "pd-char-aura", "pd-warlock-demon-aura", "pd-warlock-demon-mlvl", "pd-warlock-hex-buff", "pd-enemy-debuff", "pd-pal-hs-on", "pd-cta-bo", "pd-skill-max-mode"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", renderPaperdollLiveStats);
        el.addEventListener("change", renderPaperdollLiveStats);
      }
    });

    const pdSkillSel = document.getElementById("pd-skill-select");
    if (pdSkillSel) {
      pdSkillSel.addEventListener("change", () => {
        pdSelectedSkillKey = pdSkillSel.value;
        renderPaperdollLiveStats();
      });
    }
    // Keep collapsible skill breakdown state across live re-renders (toggle does not bubble, hence capture)
    document.addEventListener("toggle", (e) => {
      if (e.target && e.target.id === "pd-skill-notes-details") {
        pdSkillNotesOpen = Boolean(e.target.open);
      }
    }, { capture: true });

    // Inventory Bag Events
    const bagAddSel = document.getElementById("pd-bag-add-select");
    if (bagAddSel) {
      bagAddSel.addEventListener("change", populateBagAddSelect);
    }
    const bagAddBtn = document.getElementById("pd-bag-add-btn");
    if (bagAddBtn) {
      bagAddBtn.addEventListener("click", () => {
        const cid = document.getElementById("pd-bag-add-select")?.value;
        const tPage = Number(document.getElementById("pd-bag-skiller-tab")?.value || 1);
        if (cid) addItemToBag(cid, tPage);
      });
    }
    document.querySelectorAll("#pd-bag-quick-btns [data-quick-charm]").forEach(btn => {
      btn.addEventListener("click", () => {
        const cid = btn.dataset.quickCharm;
        const clsObj = getActiveClassObj();
        const firstPage = (clsObj && clsObj.tabs && clsObj.tabs[0]) ? clsObj.tabs[0].page : 1;
        addItemToBag(cid, firstPage);
      });
    });
    const bagClearBtn = document.getElementById("pd-bag-clear-btn");
    if (bagClearBtn) {
      bagClearBtn.addEventListener("click", () => {
        pdCharBag = [];
        if (pdActiveTarget === "bag") {
          pdActiveTarget = "char";
          pdActiveBagUid = null;
        }
        showBagMessage("");
        renderPaperdollAll();
      });
    }
    const bagPresetBtn = document.getElementById("pd-bag-preset-btn");
    if (bagPresetBtn) {
      bagPresetBtn.addEventListener("click", () => {
        const clsObj = getActiveClassObj();
        const mainTab = (clsObj && clsObj.tabs && clsObj.tabs[clsObj.tabs.length - 1]) ? clsObj.tabs[clsObj.tabs.length - 1].page : 1;
        const sunderByClass = { war: "sunder-fire", sor: "sunder-ltng", pal: "sunder-mag", ama: "sunder-ltng", nec: "sunder-mag", bar: "sunder-phys", dru: "sunder-phys", ass: "sunder-ltng" };
        const presetIds = [
          "torch", "anni", "gheed", sunderByClass[skActiveClassId] || "sunder-ltng",
          "gc-sk-life", "gc-sk-life", "gc-sk-life", "gc-sk-life", "gc-sk-life",
          "sc-20-5", "sc-20-5", "sc-20-5", "sc-7mf-5ar", "sc-7mf-5ar",
          "util-cube", "util-id", "util-tp"
        ];
        pdCharBag = presetIds.map(cid => ({
          uid: "b" + (pdBagNextUid++),
          charmId: cid,
          tabPage: cid.startsWith("gc-sk") ? mainTab : 0,
          rolls: {}
        }));
        pdActiveTarget = "bag";
        pdActiveBagUid = pdCharBag[0].uid;
        showBagMessage("");
        renderPaperdollAll();
      });
    }
    const bagEditSkSel = document.getElementById("pd-bag-edit-skiller-select");
    if (bagEditSkSel) {
      bagEditSkSel.addEventListener("change", () => {
        const item = pdCharBag.find(x => x.uid === pdActiveBagUid);
        if (item) {
          item.tabPage = Number(bagEditSkSel.value || 1);
          renderPaperdollAll();
        }
      });
    }
    const bagDupBtn = document.getElementById("pd-bag-dup-btn");
    if (bagDupBtn) {
      bagDupBtn.addEventListener("click", () => {
        const item = pdCharBag.find(x => x.uid === pdActiveBagUid);
        if (item) addItemToBag(item.charmId, item.tabPage, item);
      });
    }

    ensureSlotCombos();
    document.querySelectorAll("#pd-cat-chips [data-pd-cat]").forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        pdActiveCat = btn.dataset.pdCat;
        if (pdRwBaseCombo) pdRwBaseCombo.close(false);
        if (pdItemCombo) pdItemCombo.close(false);
        renderSlotEditor();
      });
    });

    // Crafted Item Skill Picker (+0 / +1~2 Class Skills / +1~2 Single Skill Tree)
    const onCraftSkillChange = () => {
      const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
      const cur = loadout[pdActiveSlot];
      if (!cur || cur.cat !== "craft") return;
      const tVal = document.getElementById("pd-craft-skill-target")?.value || "none";
      const lVal = Math.min(2, Math.max(1, Number(document.getElementById("pd-craft-skill-lvl")?.value || 2)));
      if (tVal === "none") {
        cur.craftSkill = { mode: "none", tabPage: 1, lvl: lVal };
      } else if (tVal === "class") {
        cur.craftSkill = { mode: "class", tabPage: 1, lvl: lVal };
      } else if (tVal.startsWith("tab:")) {
        cur.craftSkill = { mode: "tab", tabPage: Number(tVal.slice(4) || 1), lvl: lVal };
      }
      renderPaperdollAll();
    };
    const craftSkTarget = document.getElementById("pd-craft-skill-target");
    const craftSkLvl = document.getElementById("pd-craft-skill-lvl");
    if (craftSkTarget) craftSkTarget.addEventListener("change", onCraftSkillChange);
    if (craftSkLvl) craftSkLvl.addEventListener("change", onCraftSkillChange);

    // Magic / Rare / Bag Magic Charm Affix Builder (+Prefix / +Suffix with Auto-Lock & Group Exclusion!)
    const afFilterInp = document.getElementById("pd-affix-filter");
    if (afFilterInp) {
      afFilterInp.addEventListener("input", (e) => {
        pdAffixFilter = e.target.value.trim();
        renderSlotEditor();
      });
    }
    const addAffixFromBuilder = (type) => {
      const box = document.getElementById("pd-affix-builder");
      const ctx = box && box._pdAffixCtx;
      if (!ctx || !ctx.itemObj) return;
      const sel = document.getElementById(type === "prefix" ? "pd-affix-pre-select" : "pd-affix-suf-select");
      if (!sel || !sel.value) return;
      const arr = type === "prefix" ? ctx.itemObj.prefixes : ctx.itemObj.suffixes;
      const cap = type === "prefix" ? ctx.maxPre : ctx.maxSuf;
      const curTotal = (ctx.itemObj.prefixes ? ctx.itemObj.prefixes.length : 0) + (ctx.itemObj.suffixes ? ctx.itemObj.suffixes.length : 0);
      if (arr.length >= cap || curTotal >= (ctx.maxTotal || 99)) return;
      const list = type === "prefix" ? ctx.pool.prefixes : ctx.pool.suffixes;
      const found = list.find(x => x.id === sel.value);
      if (!found) return;
      preserveRollsAcrossAffixEdit(ctx.itemObj, () => {
        arr.push({ id: found.id, g: found.g || 0, nameZh: found.nameZh, range: found.range });
      });
      renderPaperdollAll();
    };
    window.addEventListener("scroll", hidePdTooltip, { passive: true });
    const afPreAddBtn = document.getElementById("pd-affix-pre-add");
    const afSufAddBtn = document.getElementById("pd-affix-suf-add");
    if (afPreAddBtn) afPreAddBtn.addEventListener("click", () => addAffixFromBuilder("prefix"));
    if (afSufAddBtn) afSufAddBtn.addEventListener("click", () => addAffixFromBuilder("suffix"));

    const ethCb = document.getElementById("pd-item-eth");
    if (ethCb) {
      ethCb.addEventListener("change", () => {
        const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
        if (loadout[pdActiveSlot]) {
          loadout[pdActiveSlot].eth = Boolean(ethCb.checked);
          renderPaperdollAll();
        }
      });
    }
    [
      { id: "pd-sup-ed", prop: "supEd", max: 15 },
      { id: "pd-sup-ar", prop: "supAr", max: 3 },
      { id: "pd-sup-def", prop: "supDef", max: 15 }
    ].forEach(cfg => {
      const el = document.getElementById(cfg.id);
      if (!el) return;
      const syncSup = () => {
        const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
        const cur = loadout[pdActiveSlot];
        if (!cur || (cur.cat !== "rw" && cur.cat !== "base")) return;
        const v = Math.min(cfg.max, Math.max(0, Math.floor(Number(el.value || 0))));
        cur[cfg.prop] = v;
        renderPaperdollAll();
      };
      el.addEventListener("input", syncSup);
      el.addEventListener("change", syncSup);
    });
    ["pd-pal-mod-res", "pd-pal-mod-dmg"].forEach(rid => {
      const rEl = document.getElementById(rid);
      if (!rEl) return;
      rEl.addEventListener("change", () => {
        if (!rEl.checked) return;
        const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
        const cur = loadout[pdActiveSlot];
        if (!cur) return;
        cur.palModType = rEl.value === "dmg" ? "dmg" : "res";
        renderPaperdollAll();
      });
    });
    [
      { id: "pd-pal-res", prop: "palRes", max: 45 },
      { id: "pd-pal-ed", prop: "palEd", max: 65 },
      { id: "pd-pal-ar", prop: "palAr", max: 121 }
    ].forEach(cfg => {
      const el = document.getElementById(cfg.id);
      if (!el) return;
      const syncPal = () => {
        const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
        const cur = loadout[pdActiveSlot];
        if (!cur) return;
        cur[cfg.prop] = Math.min(cfg.max, Math.max(0, Math.floor(Number(el.value || 0))));
        renderPaperdollAll();
      };
      el.addEventListener("input", syncPal);
      el.addEventListener("change", syncPal);
    });
    const autoTabInp = document.getElementById("pd-base-auto-tab-lvl");
    if (autoTabInp) {
      const syncAutoTab = () => {
        const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
        const cur = loadout[pdActiveSlot];
        if (!cur) return;
        cur.autoTabLvl = Math.min(3, Math.max(0, Math.floor(Number(autoTabInp.value || 0))));
        renderPaperdollAll();
      };
      autoTabInp.addEventListener("input", syncAutoTab);
      autoTabInp.addEventListener("change", syncAutoTab);
    }

    const unequipBtn = document.getElementById("pd-unequip-btn");
    if (unequipBtn) {
      unequipBtn.addEventListener("click", () => {
        if (pdActiveTarget === "bag") {
          removeBagItemByUid(pdActiveBagUid);
          return;
        }
        const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
        loadout[pdActiveSlot] = null;
        renderPaperdollAll();
      });
    }

    const maxRollsBtn = document.getElementById("pd-max-rolls-btn");
    if (maxRollsBtn) {
      maxRollsBtn.addEventListener("click", () => {
        if (pdActiveTarget === "bag") {
          const bItem = pdCharBag.find(x => x.uid === pdActiveBagUid);
          if (bItem) {
            bItem.rolls = {};
            renderPaperdollAll();
          }
          return;
        }
        const loadout = pdActiveTarget === "char" ? pdCharLoadout : pdMercLoadout;
        if (loadout[pdActiveSlot]) {
          loadout[pdActiveSlot].rolls = {};
          renderPaperdollAll();
        }
      });
    }

    const autoSyncCb = document.getElementById("pd-auto-sync-skills");
    if (autoSyncCb) {
      autoSyncCb.checked = pdAutoSyncSkills;
      autoSyncCb.addEventListener("change", () => {
        pdAutoSyncSkills = Boolean(autoSyncCb.checked);
        try { localStorage.setItem(PD_AUTO_SYNC_KEY, pdAutoSyncSkills ? "1" : "0"); } catch (e) {}
        if (pdAutoSyncSkills) {
          applyPaperdollSkillsToTree(true);
        }
        renderPaperdollLiveStats();
      });
    }

    const syncSkillsBtn = document.getElementById("pd-sync-skills-btn");
    if (syncSkillsBtn) {
      syncSkillsBtn.addEventListener("click", () => {
        applyPaperdollSkillsToTree(false);
        const orig = syncSkillsBtn.textContent;
        syncSkillsBtn.textContent = "✓ 已同步全/分系/单技能至技能树";
        setTimeout(() => { syncSkillsBtn.textContent = orig; }, 1800);
      });
    }

    const saveBuildBtn = document.getElementById("pd-save-build-btn");
    if (saveBuildBtn) {
      saveBuildBtn.addEventListener("click", () => {
        setPdStateLoadedForClass(skActiveClassId);
        savePaperdollState(skActiveClassId);
        const orig = saveBuildBtn.textContent;
        saveBuildBtn.textContent = "✓ 配装已保存至本地";
        setTimeout(() => { saveBuildBtn.textContent = orig; }, 1800);
      });
    }

    const cmpPinBtn = document.getElementById("pd-cmp-pin-btn");
    const cmpRestoreBtn = document.getElementById("pd-cmp-restore-btn");
    const cmpClearBtn = document.getElementById("pd-cmp-clear-btn");
    if (cmpPinBtn) cmpPinBtn.addEventListener("click", () => capturePaperdollCompareBaseline());
    if (cmpRestoreBtn) cmpRestoreBtn.addEventListener("click", () => restorePaperdollCompareBaseline());
    if (cmpClearBtn) cmpClearBtn.addEventListener("click", () => clearPaperdollCompareBaseline());

    const wset1Btn = document.getElementById("pd-wset-1");
    const wset2Btn = document.getElementById("pd-wset-2");
    const wsetToggleBtn = document.getElementById("pd-wset-toggle-btn");
    const swapCtaBtn = document.getElementById("pd-swap-preset-cta");
    const swapMfBtn = document.getElementById("pd-swap-preset-mf");
    if (wset1Btn) wset1Btn.addEventListener("click", () => switchPaperdollWeaponSet(1));
    if (wset2Btn) wset2Btn.addEventListener("click", () => switchPaperdollWeaponSet(2));
    if (wsetToggleBtn) wsetToggleBtn.addEventListener("click", () => togglePaperdollWeaponSet());
    if (swapCtaBtn) {
      swapCtaBtn.addEventListener("click", () => {
        applyPaperdollSwapPreset("cta");
        if (typeof showAuthToast === "function") {
          showAuthToast("✓ 已在副手组 II 装入战争召唤 CTA + 精神盾（按 W 键切手）");
        }
      });
    }
    if (swapMfBtn) {
      swapMfBtn.addEventListener("click", () => {
        applyPaperdollSwapPreset("mf");
        if (typeof showAuthToast === "function") {
          showAuthToast("✓ 已在副手组 II 装入双 24# 阿里巴巴 + 韵律盾（按 W 键切手）");
        }
      });
    }

    document.addEventListener("keydown", (e) => {
      if (!e || (e.key !== "w" && e.key !== "W") || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName))) return;
      if (document.querySelector("dialog[open]")) return;
      if (activeMainTab !== "skills") return;
      const mEl = document.getElementById("sk-view-mercenary");
      const bEl = document.getElementById("sk-view-breakpoints");
      const visible = (mEl && mEl.style.display !== "none") || (bEl && bEl.style.display !== "none");
      if (!visible) return;
      e.preventDefault();
      togglePaperdollWeaponSet();
    });

    const resetClassSetBtn = document.getElementById("pd-reset-class-set-btn");
    if (resetClassSetBtn) {
      resetClassSetBtn.addEventListener("click", () => {
        pdCharLoadout = getDefaultClassSetLoadout(skActiveClassId);
        pdActiveTarget = "char";
        pdActiveSlot = pdCharLoadout.weapon ? "weapon" : "head";
        setPdStateLoadedForClass(skActiveClassId);
        savePaperdollState(skActiveClassId);
        renderPaperdollAll();
      });
    }

    let pdPresetMode = "caster";
    const charPresetBtn = document.getElementById("pd-char-preset-btn");
    if (charPresetBtn) {
      charPresetBtn.addEventListener("click", () => {
        if (pdPresetMode === "caster") {
          pdPresetMode = "melee";
          charPresetBtn.textContent = "切回法系毕业暗金/符文预设";
          if (skActiveClassId === "war") {
            pdCharLoadout.head = { cat: "unique", id: "Griffon's Eye", eth: false, sockets: ["jw-55-ltng"], rolls: {} };
            pdCharLoadout.amulet = { cat: "unique", id: "Mara's Kaleidoscope", eth: false, sockets: [], rolls: {} };
            pdCharLoadout.torso = { cat: "rw", id: "enigma", baseCode: "xtp", eth: false, sockets: [], rolls: {} };
            pdCharLoadout.weapon = { cat: "rw", id: "infinity", baseCode: "7wc", eth: false, sockets: [], rolls: {} };
            pdCharLoadout.offhand = { cat: "unique", id: "Ars Al'Diabolos", eth: false, sockets: ["jw-55-fire"], rolls: {} };
          } else {
            pdCharLoadout.head = { cat: "set", id: "Guillaume's Face", eth: false, sockets: ["jw-40-15"], rolls: {} };
            pdCharLoadout.amulet = { cat: "unique", id: "Highlord's Wrath", eth: false, sockets: [], rolls: {} };
            pdCharLoadout.torso = { cat: "rw", id: "fortitude", baseCode: "utp", eth: false, sockets: [], rolls: {} };
            pdCharLoadout.weapon = { cat: "rw", id: "grief", baseCode: "7cr", eth: false, sockets: [], rolls: {} };
            pdCharLoadout.offhand = { cat: "unique", id: "Stormshield", eth: false, sockets: ["r22"], rolls: {} };
            pdCharLoadout.gloves = { cat: "set", id: "Laying of Hands", eth: false, sockets: [], rolls: {} };
            pdCharLoadout.ring1 = { cat: "unique", id: "Raven Frost", eth: false, sockets: [], rolls: {} };
            pdCharLoadout.belt = { cat: "unique", id: "String of Ears", eth: false, sockets: [], rolls: {} };
            pdCharLoadout.boots = { cat: "unique", id: "Gore Rider", eth: false, sockets: [], rolls: {} };
          }
        } else {
          pdPresetMode = "caster";
          charPresetBtn.textContent = "切换毕业暗金/符文预设";
          pdCharLoadout.head = { cat: "unique", id: "Harlequin Crest (Shako)", eth: false, sockets: ["r24"], rolls: {} };
          pdCharLoadout.amulet = { cat: "unique", id: "Mara's Kaleidoscope", eth: false, sockets: [], rolls: {} };
          pdCharLoadout.torso = { cat: "rw", id: "enigma", baseCode: "xtp", eth: false, sockets: [], rolls: {} };
          pdCharLoadout.weapon = { cat: "rw", id: "heart-of-the-oak", baseCode: "fla", eth: false, sockets: [], rolls: {} };
          pdCharLoadout.offhand = { cat: "rw", id: "spirit", baseCode: "uit", eth: false, sockets: [], rolls: {} };
          pdCharLoadout.gloves = { cat: "unique", id: "Magefist", eth: false, sockets: [], rolls: {} };
          pdCharLoadout.ring1 = { cat: "unique", id: "The Stone of Jordan", eth: false, sockets: [], rolls: {} };
          pdCharLoadout.ring2 = { cat: "unique", id: "Bul-Kathos' Wedding Band", eth: false, sockets: [], rolls: {} };
          pdCharLoadout.belt = { cat: "unique", id: "Arachnid Mesh", eth: false, sockets: [], rolls: {} };
          pdCharLoadout.boots = { cat: "unique", id: "War Traveler", eth: false, sockets: [], rolls: {} };
        }
        renderPaperdollAll();
      });
    }
  }
  if (pdStateLoadedForClass !== skActiveClassId) {
    loadPaperdollStateForClass(skActiveClassId);
  }
  if (pdJustLoaded) {
    renderSkillInspector();
  }
  renderPaperdollAll();
}

function renderSkillsAll() {
  if (!skClasses.length) return;
  renderSkillsClassTabs();
  renderSkillsTrees();
  renderSkillInspector();
  renderBreakpointsAll();
  initMercenarySimulator();
  if (typeof syncMetaPresetSelectionForClass === "function") {
    syncMetaPresetSelectionForClass(skActiveClassId);
  }
}

function parseSkillsHashBuild(hashValue) {
  if (!hashValue || !hashValue.startsWith("#skills:")) return;
  const parts = hashValue.slice(8).split(":");
  const cid = parts[0];
  const code = parts[1] || "";
  const clsObj = skClasses.find(c => c.id === cid);
  if (!clsObj) return;
  setSkActiveClassId(cid);
  if (code) {
    const b = {};
    code.split(",").forEach(pair => {
      const kv = pair.split("-");
      const skId = Number(kv[0]);
      const pts = Math.min(20, Math.max(0, Number(kv[1]) || 0));
      const sk = clsObj.skills.find(s => s.id === skId);
      if (sk && pts > 0) b[sk.key] = pts;
    });
    skBuilds[cid] = b;
    saveSkBuilds();
  }
}

async function loadSkillsCatalog() {
  try {
    loadSkBuilds();
    const response = await fetch("/api/skills", { cache: "no-store" });
    const data = await response.json();
    if (data.ok && Array.isArray(data.classes)) {
      setSkClasses(data.classes);
      parseSkillsHashBuild(window.location.hash);
      renderSkillsAll();
    }
  } catch (err) {
    console.error("加载职业技能树失败", err);
  }
}

function activateSkillsSubtab(view) {
  document.querySelectorAll("#sk-view-subtabs [data-sk-view]").forEach(b => {
    b.classList.toggle("active", b.dataset.skView === view);
  });
  const pEl = document.getElementById("sk-view-planner");
  const bEl = document.getElementById("sk-view-breakpoints");
  const mEl = document.getElementById("sk-view-mercenary");
  if (pEl) pEl.style.display = view === "planner" ? "block" : "none";
  if (bEl) bEl.style.display = view === "breakpoints" ? "block" : "none";
  if (mEl) mEl.style.display = view === "mercenary" ? "block" : "none";
  if (view === "planner" && typeof scheduleDrawSkillTreeLinks === "function") {
    scheduleDrawSkillTreeLinks();
  }
  if (view === "breakpoints" && bpAutoSyncEnabled && !bpManualOverride && pdLastBreakpointSnapshot && pdLastBreakpointSnapshot.classId === skActiveClassId) {
    syncPaperdollToBreakpoints(true);
  } else {
    renderBreakpointsAll();
  }
  initMercenarySimulator();
}

function setupSkillsEvents() {
  document.querySelectorAll("#sk-view-subtabs [data-sk-view]").forEach(btn => {
    btn.addEventListener("click", () => {
      activateSkillsSubtab(btn.dataset.skView);
    });
  });

  const fcrVarSel = document.getElementById("bp-fcr-variant");
  if (fcrVarSel) fcrVarSel.addEventListener("change", (e) => { bpFcrVariantIdx = Number(e.target.value) || 0; renderBreakpointsAll(); });
  const fhrVarSel = document.getElementById("bp-fhr-variant");
  if (fhrVarSel) fhrVarSel.addEventListener("change", (e) => { bpFhrVariantIdx = Number(e.target.value) || 0; renderBreakpointsAll(); });

  const onManualBpInput = () => {
    if (!bpSyncingFromPd) {
      bpManualOverride = true;
      bpSyncedExtraEias = 0;
      bpSyncedExtraEiasLabel = "";
    }
    renderBreakpointsAll();
  };
  ["bp-fcr-input", "bp-fhr-input", "bp-ias-wsm", "bp-ias-input", "bp-ias-fana", "bp-ias-bos", "bp-fbr-input", "bp-blk-shield", "bp-blk-clvl", "bp-blk-skill"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", onManualBpInput);
      el.addEventListener("change", onManualBpInput);
    }
  });

  const bpAutoToggle = document.getElementById("bp-auto-sync-toggle");
  if (bpAutoToggle) {
    bpAutoToggle.checked = bpAutoSyncEnabled;
    bpAutoToggle.addEventListener("change", () => {
      bpAutoSyncEnabled = Boolean(bpAutoToggle.checked);
      if (bpAutoSyncEnabled) {
        bpManualOverride = false;
        if (itData && pdData) {
          renderPaperdollLiveStats();
        } else {
          initMercenarySimulator();
        }
      } else {
        bpSyncedExtraEias = 0;
        bpSyncedExtraEiasLabel = "";
        renderBreakpointsAll();
      }
    });
  }

  const bpSyncNowBtn = document.getElementById("bp-sync-now-btn");
  if (bpSyncNowBtn) {
    bpSyncNowBtn.addEventListener("click", () => {
      bpAutoSyncEnabled = true;
      bpManualOverride = false;
      if (bpAutoToggle) bpAutoToggle.checked = true;
      if (itData && pdData) {
        renderPaperdollLiveStats();
        syncPaperdollToBreakpoints(false);
      } else {
        initMercenarySimulator();
      }
      const orig = bpSyncNowBtn.textContent;
      bpSyncNowBtn.textContent = "✓ 已同步纸娃娃配装";
      setTimeout(() => { bpSyncNowBtn.textContent = orig; }, 1400);
    });
  }

  const bpBackPdBtn = document.getElementById("bp-back-pd-btn");
  if (bpBackPdBtn) {
    bpBackPdBtn.addEventListener("click", () => {
      activateSkillsSubtab("mercenary");
      const mEl = document.getElementById("sk-view-mercenary");
      if (mEl && typeof mEl.scrollIntoView === "function") {
        mEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  const pdCharStatsEl = document.getElementById("pd-char-stats");
  if (pdCharStatsEl) {
    pdCharStatsEl.addEventListener("click", (e) => {
      const jumpBtn = e.target && e.target.closest ? e.target.closest("#pd-jump-bp-btn") : null;
      if (!jumpBtn) return;
      bpAutoSyncEnabled = true;
      bpManualOverride = false;
      if (bpAutoToggle) bpAutoToggle.checked = true;
      syncPaperdollToBreakpoints(false);
      activateSkillsSubtab("breakpoints");
      const bEl = document.getElementById("sk-view-breakpoints");
      if (bEl && typeof bEl.scrollIntoView === "function") {
        bEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  const bonusInput = document.getElementById("sk-bonus-all");
  if (bonusInput) {
    bonusInput.addEventListener("input", () => {
      skBonusAll = Math.min(35, Math.max(0, Number(bonusInput.value) || 0));
      renderSkillsAll();
    });
  }

  const resetBtn = document.getElementById("sk-reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const clsObj = getActiveClassObj();
      if (!clsObj) return;
      if (getClassTotalPoints(clsObj.id) === 0) return;
      skBuilds[clsObj.id] = {};
      saveSkBuilds();
      renderSkillsAll();
    });
  }

  const shareBtn = document.getElementById("sk-share-btn");
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      const clsObj = getActiveClassObj();
      if (!clsObj) return;
      const build = getClassBuild(clsObj.id);
      const pairs = clsObj.skills
        .filter(s => Number(build[s.key] || 0) > 0)
        .map(s => s.id + "-" + build[s.key]);
      const hash = "#skills:" + clsObj.id + (pairs.length ? (":" + pairs.join(",")) : "");
      try {
        history.replaceState(null, "", hash);
      } catch (e) {
        window.location.hash = hash;
      }
      const fullUrl = window.location.origin + window.location.pathname + hash;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullUrl).then(() => {
          const old = shareBtn.textContent;
          shareBtn.textContent = "✓ 已复制分享链接";
          setTimeout(() => { shareBtn.textContent = old; }, 1800);
        });
      }
    });
  }

  loadSkillsCatalog();
}


function captureCurrentClassSharePayload() {
  const cid = skActiveClassId || "war";
  if (pdStateLoadedForClass === cid && typeof savePaperdollState === "function") {
    savePaperdollState(cid);
  }
  const clsObj = typeof getActiveClassObj === "function" ? getActiveClassObj() : null;
  const className = clsObj ? clsObj.nameZh : (AUTH_CLASS_LABELS[cid] || cid);
  const skills = cloneJsonSafe(getClassBuild(cid), {});
  const pdEntry = pdSavedByClass && pdSavedByClass[cid] ? cloneJsonSafe(pdSavedByClass[cid], null) : null;
  const summary = pdLastShareSummary && pdLastShareSummary.classId === cid ? cloneJsonSafe(pdLastShareSummary, null) : null;
  const skillPts = Object.values(skills).reduce((acc, v) => acc + (Number(v) || 0), 0);
  const gearCount = pdEntry && pdEntry.charLoadout
    ? Object.values(pdEntry.charLoadout).filter(Boolean).length
    : 0;
  const bagCount = pdEntry && Array.isArray(pdEntry.charBag) ? pdEntry.charBag.length : 0;
  const lvl = (pdEntry && pdEntry.charLvl) || 90;
  const weaponShort = summary && summary.weaponName && summary.weaponName !== "徒手"
    ? (" · " + summary.weaponName.replace(/\s*\([^)]*\)$/, ""))
    : "";
  const defaultTitle = (className + " Lv." + lvl + weaponShort + " 完整 BD").slice(0, 60);
  return { cid, className, lvl, skills, pdEntry, summary, skillPts, gearCount, bagCount, defaultTitle };
}

function openBdShareDialog() {
  const dlg = document.getElementById("bd-share-dialog");
  if (!dlg) return;
  const info = captureCurrentClassSharePayload();
  const previewEl = document.getElementById("bd-share-preview-box");
  const nameInput = document.getElementById("bd-share-name-input");
  const notesInput = document.getElementById("bd-share-notes-input");
  const errEl = document.getElementById("bd-share-error");
  const resBox = document.getElementById("bd-share-result-box");
  if (previewEl) {
    previewEl.textContent = "打包内容：" + info.className + " Lv." + info.lvl +
      " · 技能点 " + info.skillPts + "/110" +
      " · 角色装备 " + info.gearCount + "/10" +
      " · 背包咒符 " + info.bagCount + " 件" +
      (info.pdEntry && info.pdEntry.mercEnabled === false ? " · 未携带佣兵" : " · 含佣兵配装");
  }
  if (nameInput) nameInput.value = info.defaultTitle;
  if (notesInput) notesInput.value = "";
  if (errEl) { errEl.textContent = ""; errEl.classList.remove("show"); }
  if (resBox) resBox.style.display = "none";
  if (!dlg.open) dlg.showModal();
}

async function importSharedBuildById(shareId) {
  if (!shareId) return false;
  try {
    const res = await fetch("/api/builds/share/" + encodeURIComponent(shareId), { cache: "no-store" });
    const data = await res.json();
    if (!res.ok || !data.ok || !data.build) {
      showAuthToast((data && data.error) || "未找到该分享 BD 或链接已失效", true);
      return false;
    }
    const build = data.build;
    const cid = build.classId;
    if (!cid) return false;

    skBuilds[cid] = cloneJsonSafe(build.skills || {}, {});
    saveSkBuilds();
    if (build.paperdoll && typeof build.paperdoll === "object") {
      pdSavedByClass[cid] = cloneJsonSafe(build.paperdoll, null);
      try {
        localStorage.setItem(PD_STORAGE_KEY, JSON.stringify(pdSavedByClass));
        localStorage.setItem("d2r-builds-local-updated-at", new Date().toISOString());
      } catch (e) {}
    }

    setSkActiveClassId(cid);
    bpManualOverride = false;
    setPdStateLoadedForClass('');
    if (typeof switchMainTab === "function") switchMainTab("skills");
    if (typeof activateSkillsSubtab === "function") {
      activateSkillsSubtab(build.paperdoll ? "mercenary" : "planner");
    }
    if (typeof loadPaperdollStateForClass === "function") loadPaperdollStateForClass(cid);
    if (typeof renderSkillsAll === "function") renderSkillsAll();
    if (typeof scheduleCloudSync === "function") scheduleCloudSync();

    try {
      const cleanParams = new URLSearchParams(window.location.search);
      cleanParams.delete("import_build");
      const cleanUrl = window.location.pathname + (cleanParams.toString() ? ("?" + cleanParams.toString()) : "") + "#skills";
      history.replaceState(null, "", cleanUrl);
    } catch (e) {}

    showAuthToast("✓ 已导入分享 BD「" + (build.title || cid) + "」（技能 + 纸娃娃 + 佣兵）");
    return true;
  } catch (err) {
    showAuthToast("导入分享 BD 失败，请稍后重试", true);
    return false;
  }
}

function setupSharedBuildUi() {
  const dlg = document.getElementById("bd-share-dialog");
  const closeBtn = document.getElementById("bd-share-close-btn");
  const form = document.getElementById("bd-share-form");
  const copyBtn = document.getElementById("bd-share-copy-btn");

  ["pd-share-bd-btn", "sk-share-full-bd-btn"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", openBdShareDialog);
  });

  if (closeBtn && dlg) {
    closeBtn.addEventListener("click", () => dlg.close());
  }
  if (dlg) {
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) dlg.close();
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errEl = document.getElementById("bd-share-error");
      const createBtn = document.getElementById("bd-share-create-btn");
      const resBox = document.getElementById("bd-share-result-box");
      const urlOut = document.getElementById("bd-share-url-output");
      const openLink = document.getElementById("bd-share-open-link");
      if (errEl) { errEl.textContent = ""; errEl.classList.remove("show"); }
      if (createBtn) createBtn.disabled = true;

      try {
        const info = captureCurrentClassSharePayload();
        const title = (document.getElementById("bd-share-name-input")?.value || "").trim() || info.defaultTitle;
        const notes = (document.getElementById("bd-share-notes-input")?.value || "").trim();
        const res = await fetch("/api/builds/share", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            classId: info.cid,
            title,
            notes,
            skills: info.skills,
            paperdoll: info.pdEntry,
            summary: info.summary
          })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          if (errEl) {
            errEl.textContent = (data && data.error) || "生成分享短链失败，请重试";
            errEl.classList.add("show");
          }
          return;
        }
        const shareUrl = data.shareUrl || (window.location.origin + data.sharePath);
        if (urlOut) urlOut.value = shareUrl;
        if (openLink) openLink.href = shareUrl;
        if (resBox) resBox.style.display = "flex";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareUrl).catch(() => {});
        }
        if (authUser && typeof loadUserSharedBuilds === "function") {
          loadUserSharedBuilds();
        }
        showAuthToast("✓ 已生成公开分享短链并复制到剪贴板");
      } catch (err) {
        if (errEl) {
          errEl.textContent = "网络异常，生成分享短链失败";
          errEl.classList.add("show");
        }
      } finally {
        if (createBtn) createBtn.disabled = false;
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const urlOut = document.getElementById("bd-share-url-output");
      const val = urlOut ? urlOut.value : "";
      if (!val) return;
      if (urlOut) urlOut.select();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val).then(() => {
          const old = copyBtn.textContent;
          copyBtn.textContent = "✓ 已复制";
          setTimeout(() => { copyBtn.textContent = old; }, 1400);
        }).catch(() => {});
      }
    });
  }
}

/* 个人恐怖地带 (TZ) 与地表暗黑 (DClone) 桌面通知 / 声音提醒引擎 */

let d2sLastMappedResult = null;

function getD2sCatalogBundle() {
  const setPieces = [];
  if (itData && Array.isArray(itData.sets)) {
    itData.sets.forEach(s => {
      (s.pieces || []).forEach(p => setPieces.push(p));
    });
  }
  return {
    classes: skClasses || [],
    charBaseStats: (pdData && pdData.charBaseStats) || {},
    baseRules: (pdData && pdData.baseRules) || {},
    rwList: rwList || [],
    uniqueItems: (itData && itData.uniqueItems) || [],
    setPieces
  };
}

function applyMappedD2sImport(mapped, opts) {
  if (!mapped || !mapped.classId) return false;
  const cid = mapped.classId;
  const doSkills = opts ? Boolean(opts.skills) : true;
  const doStats = opts ? Boolean(opts.stats) : true;
  const doGear = opts ? Boolean(opts.gear) : false;

  if (doSkills) {
    skBuilds[cid] = cloneJsonSafe(mapped.skills || {}, {});
    saveSkBuilds();
  }

  if (doStats || doGear) {
    loadAllSavedPaperdollBuilds();
    const existing = (pdSavedByClass && pdSavedByClass[cid])
      ? cloneJsonSafe(pdSavedByClass[cid], {})
      : {
          charLoadout: getDefaultClassSetLoadout(cid),
          swapLoadout: { weapon: null, offhand: null },
          activeWeaponSet: 1,
          mercLoadout: getDefaultMercLoadout(),
          charBag: [],
          bagNextUid: 1,
          statAlloc: { str: 0, dex: 0, vit: 0, enr: 0 },
          charLvl: 90,
          mercVariant: "a2-might",
          mercLvl: 90,
          mercEnabled: true,
          mercAuraOn: true,
          ctaOn: true,
          charAura: "none",
          demonAura: "none",
          demonMlvl: 96,
          warlockHex: "none",
          enemyDebuff: "none",
          selectedSkillKey: "",
          maxMode: false
        };

    if (doStats) {
      existing.charLvl = mapped.level || 90;
      existing.statAlloc = cloneJsonSafe(mapped.statAlloc, { str: 0, dex: 0, vit: 0, enr: 0 });
      existing.mercEnabled = Boolean(mapped.mercEnabled);
      existing.mercVariant = mapped.mercVariant || "a2-might";
      existing.mercLvl = mapped.mercLvl || existing.charLvl;
      existing.activeWeaponSet = mapped.activeWeaponSet === 2 ? 2 : 1;
    }
    if (doGear) {
      existing.charLoadout = cloneJsonSafe(mapped.charLoadout, existing.charLoadout);
      existing.swapLoadout = cloneJsonSafe(mapped.swapLoadout, { weapon: null, offhand: null });
      existing.charBag = cloneJsonSafe(mapped.charBag || [], []);
      existing.bagNextUid = mapped.bagNextUid || (existing.charBag.length + 1);
      if (mapped.mappedMercCount > 0) {
        existing.mercLoadout = cloneJsonSafe(mapped.mercLoadout, existing.mercLoadout);
      }
    }
    pdSavedByClass[cid] = existing;
    try {
      localStorage.setItem(PD_STORAGE_KEY, JSON.stringify(pdSavedByClass));
      localStorage.setItem("d2r-builds-local-updated-at", new Date().toISOString());
    } catch (e) {}
  }

  setSkActiveClassId(cid);
  bpManualOverride = false;
  setPdStateLoadedForClass('');
  if (typeof loadPaperdollStateForClass === "function") loadPaperdollStateForClass(cid);
  if (typeof renderSkillsAll === "function") renderSkillsAll();
  if (typeof scheduleCloudSync === "function") scheduleCloudSync();
  return true;
}

function setupD2sImportUi() {
  const dlg = document.getElementById("d2s-import-dialog");
  const closeBtn = document.getElementById("d2s-import-close-btn");
  const pickBtn = document.getElementById("d2s-pick-file-btn");
  const fileInp = document.getElementById("d2s-file-input");
  const dropzone = document.getElementById("d2s-dropzone");
  const errEl = document.getElementById("d2s-import-error");
  const previewPanel = document.getElementById("d2s-preview-panel");
  const previewSum = document.getElementById("d2s-preview-summary");
  const optSkills = document.getElementById("d2s-opt-skills");
  const optStats = document.getElementById("d2s-opt-stats");
  const optGear = document.getElementById("d2s-opt-gear");
  const confirmBtn = document.getElementById("d2s-confirm-import-btn");

  const openDlg = () => {
    if (!dlg) return;
    d2sLastMappedResult = null;
    if (errEl) { errEl.textContent = ""; errEl.classList.remove("show"); }
    if (previewPanel) previewPanel.style.display = "none";
    if (fileInp) fileInp.value = "";
    if (!dlg.open) dlg.showModal();
  };

const OSKILL_NAME_TO_ID = {
  Teleport: 54,
  "Battle Cry": 146,
  "Battle Orders": 149,
  "Battle Command": 155,
  Lycanthropy: 224,
  Werebear: 228
};

function convertTotToD2sStats(tot, classCode, isWeapon, mod) {
  if (!tot) return [];
  const out = [];
  const push = (id, val, param) => {
    const v = Math.round(Number(val) || 0);
    if (v === 0) return;
    out.push(param !== undefined ? { id, param, val: v } : { id, val: v });
  };
  const oskillMap = (mod && mod.D2S_OSKILL_IDS) || OSKILL_NAME_TO_ID;
  const auraMap = (mod && mod.D2S_AURA_SKILL_IDS) || {};

  if (tot.skills > 0) push(127, Math.min(7, tot.skills));
  if (tot.classSkills > 0) push(83, Math.min(7, tot.classSkills), classCode);
  if (tot.fireSkills > 0) push(126, Math.min(7, tot.fireSkills), 1);
  if (tot.tabSkills) {
    for (const tabIdx of [1, 2, 3]) {
      const pts = Number(tot.tabSkills[tabIdx] || 0);
      if (pts > 0) push(188, Math.min(7, pts), ((classCode & 7) << 3) | ((tabIdx - 1) & 7));
    }
  }
  if (tot.oskills) {
    for (const [skName, skVal] of Object.entries(tot.oskills)) {
      const skLvl = (skVal && typeof skVal === "object")
        ? (skVal.isCharge ? 0 : Number(skVal.baseLvl || 0))
        : Number(skVal || 0);
      const skId = oskillMap[skName] || OSKILL_NAME_TO_ID[skName];
      if (skId && skLvl > 0) push(97, Math.min(63, skLvl), skId);
    }
  }
  if (Array.isArray(tot.auras)) {
    for (const a of tot.auras) {
      if (!a || !a.name || !(a.lvl > 0)) continue;
      const aId = auraMap[a.name];
      if (aId !== undefined) push(151, Math.min(31, a.lvl), aId);
    }
  }
  push(105, tot.fcr);
  push(93, tot.ias);
  push(99, tot.fhr);
  push(102, tot.fbr);
  push(96, tot.frw);
  push(20, tot.blockPct);
  push(0, tot.str);
  push(1, tot.enr);
  push(2, tot.dex);
  push(3, tot.vit);
  push(7, (tot.flatHp || 0) + (tot.nonBoHp || 0));
  push(76, tot.hpPct);
  push(9, (tot.flatMana || 0) + (tot.nonBoMana || 0));
  push(77, tot.manaPct);
  push(39, tot.fRes);
  push(41, tot.lRes);
  push(43, tot.cRes);
  push(45, tot.pRes);
  if ((tot.maxFRes || 75) > 75) push(40, tot.maxFRes - 75);
  if ((tot.maxLRes || 75) > 75) push(42, tot.maxLRes - 75);
  if ((tot.maxCRes || 75) > 75) push(44, tot.maxCRes - 75);
  if ((tot.maxPRes || 75) > 75) push(46, tot.maxPRes - 75);
  push(80, tot.mf);
  push(79, tot.eg);
  push(85, tot.expPct);
  push(36, tot.drPct);
  push(34, tot.pdr);
  push(35, tot.mdr);
  if (tot.cbf) push(153, 1);
  if (tot.itd) push(115, 1);
  push(116, tot.targetDefPct);
  push(19, tot.flatAr);
  push(119, tot.arPct);
  push(136, tot.cb);
  push(141, tot.ds);
  push(135, tot.ow);
  push(60, tot.ll);
  push(62, tot.ml);
  push(86, tot.laek);
  push(138, tot.maek);
  if (isWeapon && tot.mainWeapEd > 0) push(17, tot.mainWeapEd);
  if (!isWeapon && tot.itemDefEd > 0) push(16, tot.itemDefEd);
  if (isWeapon && tot.flatDmg > 0) push(111, tot.flatDmg);
  push(21, tot.flatMinDmg);
  push(22, tot.flatMaxDmg);
  push(31, (tot.flatDef || 0) + (tot.extraFlatDef || 0));
  if (tot.sunders && tot.sunders.size > 0) {
    if (tot.sunders.has("cold")) push(187, 300);
    if (tot.sunders.has("fire")) push(189, 300);
    if (tot.sunders.has("ltng")) push(190, 300);
    if (tot.sunders.has("pois")) push(191, 300);
    if (tot.sunders.has("phys")) push(192, 300);
    if (tot.sunders.has("mag")) {
      push(193, 300);
      push(37, -45);
    }
  }
  if (tot.eleDmg) {
    push(329, tot.eleDmg.fire);
    push(330, tot.eleDmg.ltng);
    push(331, tot.eleDmg.cold);
    push(332, tot.eleDmg.pois);
    push(357, tot.eleDmg.mag);
  }
  if (tot.elePierce) {
    push(333, tot.elePierce.fire);
    push(334, tot.elePierce.ltng);
    push(335, tot.elePierce.cold);
    push(336, tot.elePierce.pois);
    push(358, tot.elePierce.mag);
  }
  return out;
}

const D2S_JEWEL_SOCKET_SPECS = {
  "jw-55-ltng": { code: "jew", simple: false, quality: 7, uniqueId: 392, ilvl: 85, stats: [{ id: 330, val: 5 }, { id: 334, val: 5 }] },
  "jw-55-cold": { code: "jew", simple: false, quality: 7, uniqueId: 393, ilvl: 85, stats: [{ id: 331, val: 5 }, { id: 335, val: 5 }] },
  "jw-55-fire": { code: "jew", simple: false, quality: 7, uniqueId: 394, ilvl: 85, stats: [{ id: 329, val: 5 }, { id: 333, val: 5 }] },
  "jw-55-pois": { code: "jew", simple: false, quality: 7, uniqueId: 395, ilvl: 85, stats: [{ id: 332, val: 5 }, { id: 336, val: 5 }] },
  "jw-34-pois": { code: "cjw", simple: false, quality: 7, uniqueId: 420, ilvl: 85, stats: [{ id: 332, val: 10 }, { id: 336, val: 10 }, { id: 85, val: 5 }, { id: 80, val: 35 }, { id: 79, val: 50 }] },
  "jw-34-ltng": { code: "cjw", simple: false, quality: 7, uniqueId: 421, ilvl: 85, stats: [{ id: 330, val: 10 }, { id: 334, val: 10 }, { id: 85, val: 5 }, { id: 80, val: 35 }, { id: 79, val: 50 }] },
  "jw-34-cold": { code: "cjw", simple: false, quality: 7, uniqueId: 422, ilvl: 85, stats: [{ id: 331, val: 10 }, { id: 335, val: 10 }, { id: 85, val: 5 }, { id: 80, val: 35 }, { id: 79, val: 50 }] },
  "jw-34-fire": { code: "cjw", simple: false, quality: 7, uniqueId: 423, ilvl: 85, stats: [{ id: 329, val: 10 }, { id: 333, val: 10 }, { id: 85, val: 5 }, { id: 80, val: 35 }, { id: 79, val: 50 }] },
  "jw-34-phys": { code: "cjw", simple: false, quality: 7, uniqueId: 424, ilvl: 85, stats: [{ id: 17, val: 50 }, { id: 85, val: 5 }, { id: 80, val: 35 }, { id: 79, val: 50 }] },
  "jw-34-mag": { code: "cjw", simple: false, quality: 7, uniqueId: 425, ilvl: 85, stats: [{ id: 85, val: 5 }, { id: 80, val: 35 }, { id: 79, val: 50 }] },
  "jw-40-15": { code: "jew", simple: false, quality: 4, ilvl: 85, stats: [{ id: 17, val: 40 }, { id: 93, val: 15 }] },
  "jw-15-30fr": { code: "jew", simple: false, quality: 4, ilvl: 85, stats: [{ id: 39, val: 30 }, { id: 93, val: 15 }] },
  "jw-15-15ar": { code: "jew", simple: false, quality: 4, ilvl: 85, stats: [{ id: 39, val: 15 }, { id: 41, val: 15 }, { id: 43, val: 15 }, { id: 45, val: 15 }, { id: 93, val: 15 }] },
  "jw-15-3ek": { code: "jew", simple: false, quality: 4, ilvl: 85, stats: [{ id: 93, val: 15 }, { id: 138, val: 3 }] },
  "jw-7fhr-rare": { code: "jew", simple: false, quality: 4, ilvl: 85, stats: [{ id: 0, val: 9 }, { id: 2, val: 9 }, { id: 39, val: 10 }, { id: 41, val: 10 }, { id: 43, val: 10 }, { id: 45, val: 10 }, { id: 99, val: 7 }] }
};

function buildSocketItemsFromIds(sockIds) {
  if (!Array.isArray(sockIds) || sockIds.length === 0) return [];
  const out = [];
  for (const rawId of sockIds) {
    const sid = String(rawId || "").trim().toLowerCase();
    if (!sid) continue;
    if (D2S_JEWEL_SOCKET_SPECS[sid]) {
      const spec = D2S_JEWEL_SOCKET_SPECS[sid];
      out.push({ ...spec, stats: spec.stats.map(s => ({ ...s })) });
    } else if (/^(?:r\d\d|g[cfglps][vybgrw]|sk[cfulz])$/.test(sid)) {
      out.push({ code: sid, simple: true });
    }
  }
  return out.slice(0, 6);
}

function encodePaperdollSlotToD2sItem(mod, slotId, eq, equipKey, actorLvl, isChar, classCode) {
  if (!eq) return null;
  const info = resolveEquippedItemInfo(eq, { actorLvl, isChar });
  if (!info) return null;
  const bRule = info.bRule || null;
  const code = (bRule && bRule.code) || (slotId === "amulet" ? "amu" : (slotId === "ring1" || slotId === "ring2") ? "rin" : "");
  if (!code || code.length < 3) return null;

  const isWeapon = Boolean(bRule && bRule.slot === "weapon");
  const isArmor = Boolean(bRule && bRule.slot !== "weapon");
  const stackable = Boolean(bRule && ["jave", "ajav", "tkni", "taxe", "tpot"].includes(bRule.type));
  const noDur = Boolean(bRule && (["bow", "xbow", "abow"].includes(bRule.type) || code === "7cr"));
  const maxDur = (isWeapon || isArmor) ? (noDur ? 0 : 40) : 0;
  const defense = isArmor ? Math.max(10, Number(bRule.maxDef || bRule.minDef || 50)) : 0;

  // For non-runeword socketed gear (Uniques, Sets, Rares, etc.), encode child runes/gems/jewels separately
  // and exclude socket lines from the parent item's own stat list so D2R does not double-count socketed bonuses.
  const socketItems = eq.cat !== "rw" ? buildSocketItemsFromIds(eq.sockets) : [];
  const socketCount = eq.cat !== "rw" && socketItems.length > 0
    ? Math.min(6, Math.max(socketItems.length, Array.isArray(eq.sockets) ? eq.sockets.filter(Boolean).length : 0))
    : 0;
  const eqForParentStats = socketItems.length > 0 ? { ...eq, sockets: [] } : eq;

  const singleTot = aggregateLoadoutStats({ [slotId]: eqForParentStats }, isChar, actorLvl, []);
  const stats = convertTotToD2sStats(singleTot, classCode, isWeapon, mod);
  const equippedId = mod.SLOT_TO_EQUIPPED_ID[equipKey] || 0;
  if (!equippedId) return null;

  if (eq.cat === "rw") {
    const rwObj = (typeof rwList !== "undefined" && Array.isArray(rwList)) ? rwList.find(x => x.id === eq.id) : null;
    const rwId = typeof mod.lookupRunewordId === "function" ? mod.lookupRunewordId(eq.id) : mod.KNOWN_RUNEWORD_IDS[eq.id];
    const runeCodes = ((rwObj && rwObj.runes) || []).map(r => mod.RUNE_NAME_TO_CODE[r]).filter(Boolean);
    if (rwId !== undefined && runeCodes.length > 0) {
      return {
        code,
        location: 1,
        equippedId,
        ethereal: Boolean(eq.eth),
        quality: 2,
        runewordId: rwId,
        socketRuneCodes: runeCodes,
        isArmor,
        isWeapon,
        stackable,
        defense,
        maxDur,
        ilvl: 85,
        runewordStats: stats
      };
    }
  }

  if (eq.cat === "unique") {
    const uId = typeof mod.lookupUniqueId === "function" ? mod.lookupUniqueId(eq.id) : mod.KNOWN_UNIQUE_IDS[eq.id];
    if (uId !== undefined) {
      return {
        code,
        location: 1,
        equippedId,
        ethereal: Boolean(eq.eth),
        quality: 7,
        uniqueId: uId,
        isArmor,
        isWeapon,
        stackable,
        defense,
        maxDur,
        ilvl: 85,
        socketItems,
        socketCount,
        stats
      };
    }
  }

  if (eq.cat === "set") {
    const sId = typeof mod.lookupSetId === "function" ? mod.lookupSetId(eq.id) : (mod.KNOWN_SET_IDS && mod.KNOWN_SET_IDS[eq.id]);
    if (sId !== undefined) {
      return {
        code,
        location: 1,
        equippedId,
        ethereal: Boolean(eq.eth),
        quality: 5,
        setId: sId,
        isArmor,
        isWeapon,
        stackable,
        defense,
        maxDur,
        ilvl: 85,
        socketItems,
        socketCount,
        stats
      };
    }
  }

  return {
    code,
    location: 1,
    equippedId,
    ethereal: Boolean(eq.eth),
    quality: 4,
    isArmor,
    isWeapon,
    stackable,
    defense,
    maxDur,
    ilvl: 85,
    socketItems,
    socketCount,
    stats
  };
}

function buildD2sExportItems(mod, cid, charLvl) {
  const items = [];
  const classCode = mod.CLASS_ID_TO_CODE[cid] !== undefined ? mod.CLASS_ID_TO_CODE[cid] : 1;
  const slotPairs = [
    ["head", pdCharLoadout && pdCharLoadout.head, "head"],
    ["amulet", pdCharLoadout && pdCharLoadout.amulet, "amulet"],
    ["torso", pdCharLoadout && pdCharLoadout.torso, "torso"],
    ["weapon", pdCharLoadout && pdCharLoadout.weapon, "weapon"],
    ["offhand", pdCharLoadout && pdCharLoadout.offhand, "offhand"],
    ["ring1", pdCharLoadout && pdCharLoadout.ring1, "ring1"],
    ["ring2", pdCharLoadout && pdCharLoadout.ring2, "ring2"],
    ["belt", pdCharLoadout && pdCharLoadout.belt, "belt"],
    ["boots", pdCharLoadout && pdCharLoadout.boots, "boots"],
    ["gloves", pdCharLoadout && pdCharLoadout.gloves, "gloves"],
    ["weapon", pdCharSwapLoadout && pdCharSwapLoadout.weapon, "swapWeapon"],
    ["offhand", pdCharSwapLoadout && pdCharSwapLoadout.offhand, "swapOffhand"]
  ];

  for (const [slotId, eq, equipKey] of slotPairs) {
    const encoded = encodePaperdollSlotToD2sItem(mod, slotId, eq, equipKey, charLvl, true, classCode);
    if (encoded) items.push(encoded);
  }

  // Inventory charms & Horadric Cube (10x4 grid, storePage = 1)
  if (Array.isArray(pdCharBag) && pdCharBag.length > 0 && typeof layoutInventoryBag === "function") {
    const layout = layoutInventoryBag(pdCharBag);
    const charmUniqueMap = (mod && mod.D2S_CHARM_UNIQUE_IDS) || { anni: 381, torch: 400, gheed: 359 };
    for (const p of layout.placed || []) {
      const bItem = p.item;
      if (!bItem) continue;
      if (bItem.charmId === "util-cube") {
        items.push({
          code: "box",
          location: 0,
          storePage: 1,
          x: p.x,
          y: p.y,
          quality: 2,
          ilvl: 85,
          stats: []
        });
        continue;
      }
      const charmCode = p.h === 1 ? "cm1" : (p.h === 2 ? "cm2" : "cm3");
      const bagTot = aggregateLoadoutStats({}, true, charLvl, [bItem]);
      const stats = convertTotToD2sStats(bagTot, classCode, false, mod);
      const uCharmId = charmUniqueMap[bItem.charmId];
      const quality = uCharmId !== undefined ? 7 : 4;
      const uniqueId = uCharmId !== undefined ? uCharmId : null;
      items.push({
        code: charmCode,
        location: 0,
        storePage: 1,
        x: p.x,
        y: p.y,
        quality,
        uniqueId,
        ilvl: 85,
        stats
      });
    }
  }
  return items;
}

function buildD2sExportMercItems(mod, mercLvl) {
  const items = [];
  const mercPairs = [
    ["head", pdMercLoadout && pdMercLoadout.head, "head"],
    ["torso", pdMercLoadout && pdMercLoadout.torso, "torso"],
    ["weapon", pdMercLoadout && pdMercLoadout.weapon, "weapon"],
    ["offhand", pdMercLoadout && pdMercLoadout.offhand, "offhand"]
  ];
  for (const [slotId, eq, equipKey] of mercPairs) {
    const encoded = encodePaperdollSlotToD2sItem(mod, slotId, eq, equipKey, mercLvl, false, 0);
    if (encoded) items.push(encoded);
  }
  return items;
}

async function exportCurrentBuildAsD2s() {
  try {
    if (!pdData && typeof initMercenarySimulator === "function") {
      await initMercenarySimulator();
    }
    const mod = await import("/assets/d2s-exporter.js?v=7276ddeb64");
    const cid = skActiveClassId || "sor";
    const clsObj = typeof getActiveClassObj === "function" ? getActiveClassObj() : null;
    const lvlInp = document.getElementById("pd-char-lvl");
    const charLvl = Math.min(99, Math.max(1, Number(lvlInp ? lvlInp.value : 90) || 90));
    const baseStats = (pdData && pdData.charBaseStats && pdData.charBaseStats[cid]) || {
      str: 20, dex: 20, vit: 20, enr: 20, hp: 50, mana: 25, hpPerLvl: 2, manaPerLvl: 1.5, hpPerVit: 2, manaPerEnr: 2
    };
    let exportStatAlloc = {
      str: Math.max(0, Math.round(Number(pdStatAlloc && pdStatAlloc.str) || 0)),
      dex: Math.max(0, Math.round(Number(pdStatAlloc && pdStatAlloc.dex) || 0)),
      vit: Math.max(0, Math.round(Number(pdStatAlloc && pdStatAlloc.vit) || 0)),
      enr: Math.max(0, Math.round(Number(pdStatAlloc && pdStatAlloc.enr) || 0))
    };
    const spentPts = exportStatAlloc.str + exportStatAlloc.dex + exportStatAlloc.vit + exportStatAlloc.enr;
    if (spentPts === 0 && charLvl > 1) {
      const budget = (charLvl - 1) * 5 + 15;
      const autoStr = Math.min(budget, Math.max(0, 156 - (Number(baseStats.str) || 20)));
      const autoVit = Math.max(0, budget - autoStr);
      exportStatAlloc = { str: autoStr, dex: 0, vit: autoVit, enr: 0 };
    }
    const mercSel = document.getElementById("merc-variant-select");
    const mercEnCb = document.getElementById("pd-merc-enabled");
    const dAuraEl = document.getElementById("pd-warlock-demon-aura");
    const demonAuraVal = cid === "war" ? normalizeDemonAuraId(dAuraEl ? dAuraEl.value : "none") : "none";
    const defaultName = "Sanctuary" + cid.charAt(0).toUpperCase() + cid.slice(1);
    const validD2sNameRe = /^[A-Za-z](?:[A-Za-z]*[-_]?[A-Za-z]+)$/;
    let chosenName = "";
    let promptInput = defaultName;
    let promptMsg = "请输入要导出的单机存档角色名（2–15 位纯英文字母，中间最多 1 个 - 或 _，暗黑2不支持中文/数字；请勿在导出后手工重命名 .d2s 文件）：";
    while (true) {
      const rawName = window.prompt(promptMsg, promptInput);
      if (rawName === null) return;
      const trimmed = String(rawName).trim();
      if (trimmed.length >= 2 && trimmed.length <= 15 && validD2sNameRe.test(trimmed)) {
        chosenName = trimmed;
        break;
      }
      promptInput = trimmed || defaultName;
      promptMsg = "⚠️ 「" + (trimmed || "(空)") + "」不符合暗黑 2 角色名规则！\n仅支持 2–15 位纯英文字母（中间最多 1 个 - 或 _），不支持中文、数字或空格，请重新输入：";
    }

    const exportItems = buildD2sExportItems(mod, cid, charLvl);
    const mercLvlInp = document.getElementById("merc-lvl-input");
    const mercLvl = Math.min(98, Math.max(1, Number(mercLvlInp ? mercLvlInp.value : charLvl) || charLvl));
    const mercEnabled = mercEnCb ? mercEnCb.checked : true;
    const exportMercItems = mercEnabled ? buildD2sExportMercItems(mod, mercLvl) : [];
    let exportStashItems = [];
    if (Array.isArray(pdCustomStashItems) && pdCustomStashItems.length > 0) {
      const d2iMod = await import("/assets/d2i-stash.js?v=bde4bdf9fe");
      exportStashItems = buildD2sExportStashItems(mod, d2iMod, cid, charLvl).placed;
    }
    const result = mod.buildD2sBuffer({
      name: chosenName,
      classId: cid,
      level: charLvl,
      activeWeaponSet: pdActiveWeaponSet || 1,
      statAlloc: exportStatAlloc,
      charBaseStats: baseStats,
      skills: getClassBuild(cid),
      classSkills: clsObj ? clsObj.skills : [],
      mercEnabled,
      mercVariant: mercSel ? mercSel.value : "a2-might",
      mercLevel: mercLvl,
      demonAura: demonAuraVal,
      items: exportItems,
      stashItems: exportStashItems,
      mercItems: exportMercItems
    });

    const blob = new Blob([result.bytes], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    const demonTag = result.meta.demonAura && result.meta.demonAura !== "none"
      ? (" · 束缚恶魔(" + result.meta.demonAura + ")")
      : "";
    const itemTag = result.meta.itemCount > 0 ? (" · 角色装备与背包 " + (result.meta.itemCount - (result.meta.stashItemCount || 0)) + " 件") : "";
    const stashTag = result.meta.stashItemCount > 0 ? (" · 个人仓库 " + result.meta.stashItemCount + " 件") : "";
    const mercTag = result.meta.mercItemCount > 0 ? (" · 佣兵装备 " + result.meta.mercItemCount + " 件") : "";
    showAuthToast("💾 已导出单机存档 " + result.filename + "（Lv." + result.meta.level + " · 技能 " + result.meta.usedSkillPts + " 点" + itemTag + stashTag + mercTag + demonTag + " · 校验和已签名）");
  } catch (err) {
    showAuthToast("导出 .d2s 存档失败：" + (err && err.message ? err.message : "未知错误"), true);
  }
}

  ["sk-import-d2s-btn", "pd-import-d2s-btn"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", openDlg);
  });
  ["sk-export-d2s-btn", "pd-export-d2s-btn"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", () => exportCurrentBuildAsD2s());
  });
  if (closeBtn && dlg) closeBtn.addEventListener("click", () => dlg.close());
  if (dlg) {
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  }
  if (pickBtn && fileInp) {
    pickBtn.addEventListener("click", () => fileInp.click());
  }

  const handleD2sFile = async (file) => {
    if (!file) return;
    if (errEl) { errEl.textContent = ""; errEl.classList.remove("show"); }
    if (previewPanel) previewPanel.style.display = "none";
    if (file.size > 2 * 1024 * 1024) {
      if (errEl) { errEl.textContent = "文件过大（超过 2 MB），请确认是有效的 .d2s 单机存档"; errEl.classList.add("show"); }
      return;
    }
    try {
      if (!pdData && typeof initMercenarySimulator === "function") {
        await initMercenarySimulator();
      }
      const mod = await import("/assets/d2s-parser.js");
      const buf = await file.arrayBuffer();
      const parsed = mod.parseD2sBuffer(buf, file.name);
      const mapped = mod.mapParsedD2sToPaperdoll(parsed, getD2sCatalogBundle());
      d2sLastMappedResult = mapped;

      const clsObj = (skClasses || []).find(c => c.id === mapped.classId);
      const clsLabel = clsObj ? clsObj.nameZh : (AUTH_CLASS_LABELS[mapped.classId] || mapped.classId);
      const topSkills = Object.entries(mapped.skills || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([k, v]) => {
          const sObj = clsObj && clsObj.skills ? clsObj.skills.find(x => x.key === k) : null;
          return (sObj ? sObj.nameZh : k) + " " + v;
        });
      const statusTags = [];
      if (mapped.status && mapped.status.hardcore) statusTags.push("专家 HC");
      if (mapped.status && mapped.status.ladder) statusTags.push("天梯");
      statusTags.push("存档 v" + mapped.version);

      const hasGear = mapped.mappedGearCount > 0 || mapped.charBag.length > 0;
      if (optSkills) optSkills.checked = true;
      if (optStats) optStats.checked = true;
      if (optGear) {
        optGear.checked = hasGear;
        optGear.disabled = !hasGear;
      }

      if (previewSum) {
        previewSum.innerHTML =
          '<div class="alert-section-title"><span>🧙 ' + escapeHtml(mapped.name) + ' · ' + escapeHtml(clsLabel) + ' Lv.' + mapped.level + '</span><span style="font-size:11px;color:#9ad8ff">' + escapeHtml(statusTags.join(" · ")) + '</span></div>' +
          '<div style="font-size:12px;color:#dfd6ca">裸属性已分配：力量 +' + mapped.statAlloc.str + ' · 敏捷 +' + mapped.statAlloc.dex + ' · 体力 +' + mapped.statAlloc.vit + ' · 精力 +' + mapped.statAlloc.enr + '</div>' +
          '<div style="font-size:12px;color:#8af49f">技能树硬点：共 ' + mapped.totalSkillPts + '/110 点' + (topSkills.length ? ('（' + escapeHtml(topSkills.join(" · ")) + '）') : '（未分配技能点）') + '</div>' +
          '<div style="font-size:12px;color:#b8afa3">佣兵：' + (mapped.mercEnabled ? escapeHtml(mapped.mercVariant) : '未携带') + ' · 装备解析：' + (hasGear ? ('已匹配 ' + mapped.mappedGearCount + ' 件装备 + ' + mapped.charBag.length + ' 件背包物') : '未覆盖装备（D2R 压缩位流将保留当前纸娃娃配装）') + '</div>';
      }
      if (previewPanel) previewPanel.style.display = "flex";
    } catch (err) {
      if (errEl) {
        errEl.textContent = (err && err.message) || "解析 .d2s 存档失败，请确认文件格式正确";
        errEl.classList.add("show");
      }
    }
  };

  if (fileInp) {
    fileInp.addEventListener("change", () => {
      const f = fileInp.files && fileInp.files[0];
      if (f) handleD2sFile(f);
    });
  }
  if (dropzone) {
    dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.style.borderColor = "#ffd573"; });
    dropzone.addEventListener("dragleave", () => { dropzone.style.borderColor = ""; });
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.style.borderColor = "";
      const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) handleD2sFile(f);
    });
  }
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      if (!d2sLastMappedResult) return;
      applyMappedD2sImport(d2sLastMappedResult, {
        skills: optSkills ? optSkills.checked : true,
        stats: optStats ? optStats.checked : true,
        gear: optGear ? (optGear.checked && !optGear.disabled) : false
      });
      if (dlg) dlg.close();
      if (typeof showAuthToast === "function") {
        showAuthToast("✓ 已导入单机存档「" + d2sLastMappedResult.name + "」（Lv." + d2sLastMappedResult.level + "）");
      }
    });
  }
}

let metaPresetsList = [];
let metaPresetsLoaded = false;

function renderMetaPresetSelect() {
  const sel = document.getElementById("sk-meta-preset-select");
  const desc = document.getElementById("sk-meta-preset-desc");
  if (!sel) return;
  sel.textContent = "";
  if (!metaPresetsList.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "暂无流派预设";
    sel.appendChild(opt);
    return;
  }
  const byClass = new Map();
  metaPresetsList.forEach(p => {
    if (!byClass.has(p.classId)) byClass.set(p.classId, []);
    byClass.get(p.classId).push(p);
  });
  const orderedClasses = [skActiveClassId, ...Array.from(byClass.keys()).filter(c => c !== skActiveClassId)];
  orderedClasses.forEach(cid => {
    const arr = byClass.get(cid);
    if (!arr || !arr.length) return;
    const grp = document.createElement("optgroup");
    grp.label = (AUTH_CLASS_LABELS[cid] || cid) + (cid === skActiveClassId ? "（当前职业）" : "");
    arr.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = "[" + (p.tier || "预设") + "] " + p.name;
      grp.appendChild(opt);
    });
    sel.appendChild(grp);
  });
  const firstForCls = metaPresetsList.find(p => p.classId === skActiveClassId) || metaPresetsList[0];
  if (firstForCls) {
    sel.value = firstForCls.id;
    if (desc) desc.textContent = firstForCls.summary || "";
  }
}

function syncMetaPresetSelectionForClass(classId) {
  const sel = document.getElementById("sk-meta-preset-select");
  const desc = document.getElementById("sk-meta-preset-desc");
  if (!sel || !metaPresetsList.length) return;
  const cur = metaPresetsList.find(p => p.id === sel.value);
  if (cur && cur.classId === classId) return;
  renderMetaPresetSelect();
  const target = metaPresetsList.find(p => p.classId === classId);
  if (target) {
    sel.value = target.id;
    if (desc) desc.textContent = target.summary || "";
  }
}

function applyMetaPresetById(presetId) {
  const preset = metaPresetsList.find(p => p.id === presetId);
  if (!preset) return false;
  const cid = preset.classId;
  skBuilds[cid] = cloneJsonSafe(preset.skills || {}, {});
  saveSkBuilds();
  const pdEntry = cloneJsonSafe(preset.paperdoll || {}, {});
  pdEntry.charLvl = Number(preset.charLvl) || 90;
  pdEntry.selectedSkillKey = preset.selectedSkillKey || "";
  pdSavedByClass[cid] = pdEntry;
  try {
    localStorage.setItem(PD_STORAGE_KEY, JSON.stringify(pdSavedByClass));
    localStorage.setItem("d2r-builds-local-updated-at", new Date().toISOString());
  } catch (e) {}

  setSkActiveClassId(cid);
  bpManualOverride = false;
  setPdStateLoadedForClass('');
  if (typeof loadPaperdollStateForClass === "function") loadPaperdollStateForClass(cid);
  if (typeof renderSkillsAll === "function") renderSkillsAll();
  if (typeof scheduleCloudSync === "function") scheduleCloudSync();
  if (typeof showAuthToast === "function") {
    showAuthToast("⚡ 已载入 D2R 3.4 流派预设「" + preset.name + "」（技能 + 配装 + 副手 + 佣兵 + 咒符）");
  }
  return true;
}

async function setupMetaPresetsUi() {
  const sel = document.getElementById("sk-meta-preset-select");
  const btn = document.getElementById("sk-meta-preset-apply-btn");
  const desc = document.getElementById("sk-meta-preset-desc");
  if (!sel) return;

  sel.addEventListener("change", () => {
    const p = metaPresetsList.find(x => x.id === sel.value);
    if (desc && p) desc.textContent = p.summary || "";
  });
  if (btn) {
    btn.addEventListener("click", () => {
      if (!sel.value) return;
      applyMetaPresetById(sel.value);
    });
  }

  if (metaPresetsLoaded) {
    renderMetaPresetSelect();
    return;
  }
  try {
    const res = await fetch("/api/presets", { cache: "force-cache" });
    const data = await res.json();
    if (res.ok && data && data.ok && Array.isArray(data.presets)) {
      metaPresetsList = data.presets;
      metaPresetsLoaded = true;
      renderMetaPresetSelect();
    }
  } catch (e) {
    // ignore offline fetch failure
  }
}


const PD_CUSTOM_STASH_STORAGE_KEY = "d2r-custom-stash-v1";
let pdCustomStashItems = (() => {
  try {
    const raw = localStorage.getItem(PD_CUSTOM_STASH_STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
})();

function saveCustomStashItems() {
  try {
    localStorage.setItem(PD_CUSTOM_STASH_STORAGE_KEY, JSON.stringify(pdCustomStashItems));
  } catch {}
}

function resolveStashSlotFromCode(code, cat, id) {
  if (code === "amu") return "amulet";
  if (code === "rin") return "ring1";
  const bRule = pdData && pdData.baseRules && code ? pdData.baseRules[code] : null;
  if (bRule && bRule.slot) return bRule.slot;
  if (cat === "unique" && itData && Array.isArray(itData.uniqueItems)) {
    const u = itData.uniqueItems.find(x => x.nameEn === id);
    if (u && u.baseCode && pdData && pdData.baseRules && pdData.baseRules[u.baseCode]) {
      return pdData.baseRules[u.baseCode].slot || "head";
    }
    if (u && /ring|戒指/i.test(String(u.slot || u.type || ""))) return "ring1";
    if (u && /amulet|项链/i.test(String(u.slot || u.type || ""))) return "amulet";
  }
  return "head";
}

function encodeCustomStashEntryToD2sItem(mod, entry, charLvl, classCode) {
  if (!entry) return null;
  if (entry.cat === "stack") {
    const clean = String(entry.code || entry.id || "").trim().toLowerCase();
    const meta = mod && mod.D2S_ADV_STACKABLE_META && mod.D2S_ADV_STACKABLE_META[clean];
    if (!meta) return null;
    if (!meta.complex) {
      return { code: clean, simple: true, location: 0, equippedId: 0, storePage: 5 };
    }
    return { code: clean, simple: false, quality: 2, ilvl: 85, stats: [], location: 0, equippedId: 0, storePage: 5 };
  }
  if (entry.cat === "base") {
    const code = String(entry.code || entry.baseCode || "").trim().toLowerCase();
    const bRule = pdData && pdData.baseRules ? pdData.baseRules[code] : null;
    if (!bRule) return null;
    const isWeapon = bRule.slot === "weapon";
    const isArmor = !isWeapon;
    const stackable = ["jave", "ajav", "tkni", "taxe", "tpot"].includes(bRule.type);
    const noDur = ["bow", "xbow", "abow"].includes(bRule.type) || code === "7cr";
    return {
      code,
      location: 0,
      equippedId: 0,
      storePage: 5,
      ethereal: Boolean(entry.eth),
      quality: 2,
      isArmor,
      isWeapon,
      stackable,
      defense: isArmor ? Math.max(10, Number(bRule.maxDef || bRule.minDef || 50)) : 0,
      maxDur: noDur ? 0 : 40,
      socketCount: Math.min(6, Math.max(0, Number(bRule.maxSockets) || 0)),
      ilvl: 85,
      stats: []
    };
  }
  const slotId = resolveStashSlotFromCode(entry.baseCode || entry.code, entry.cat, entry.id);
  const eq = {
    cat: entry.cat,
    id: entry.id,
    baseCode: entry.baseCode || entry.code || "",
    eth: Boolean(entry.eth),
    rolls: entry.rolls || {},
    sockets: entry.sockets || []
  };
  const encoded = encodePaperdollSlotToD2sItem(mod, slotId, eq, "head", charLvl, true, classCode);
  if (!encoded) return null;
  return { ...encoded, location: 0, equippedId: 0, storePage: 5 };
}

function buildD2sExportStashItems(mod, d2iMod, cid, charLvl) {
  const classCode = mod.CLASS_ID_TO_CODE[cid] !== undefined ? mod.CLASS_ID_TO_CODE[cid] : 1;
  const rawSpecs = [];
  for (const entry of pdCustomStashItems || []) {
    const spec = encodeCustomStashEntryToD2sItem(mod, entry, charLvl, classCode);
    if (spec) rawSpecs.push(spec);
  }
  return d2iMod.packItemsInto10x10(rawSpecs);
}

function setupStashExportUi() {
  const dlg = document.getElementById("pd-stash-dialog");
  if (!dlg) return;
  const closeBtn = document.getElementById("pd-stash-close-btn");
  const tabBtns = Array.from(dlg.querySelectorAll("[data-stash-tab]"));
  const panePersonal = document.getElementById("stash-pane-personal");
  const paneShared = document.getElementById("stash-pane-shared");

  const catSel = document.getElementById("stash-add-cat");
  const searchInp = document.getElementById("stash-add-search");
  const itemSel = document.getElementById("stash-add-item");
  const baseSel = document.getElementById("stash-add-base");
  const ethWrap = document.getElementById("stash-add-eth-wrap");
  const ethCb = document.getElementById("stash-add-eth");
  const addBtn = document.getElementById("stash-add-btn");
  const quickCharBtn = document.getElementById("stash-quick-char-btn");
  const quickMercBtn = document.getElementById("stash-quick-merc-btn");
  const clearPersonalBtn = document.getElementById("stash-clear-personal-btn");
  const personalListEl = document.getElementById("stash-personal-list");
  const personalUsageEl = document.getElementById("stash-personal-usage");
  const exportD2sNowBtn = document.getElementById("stash-export-d2s-now-btn");

  const baseFileInp = document.getElementById("d2i-base-input");
  const pickBaseBtn = document.getElementById("d2i-pick-base-btn");
  const clearBaseBtn = document.getElementById("d2i-clear-base-btn");
  const baseStatusEl = document.getElementById("d2i-base-status");
  const d2iErrEl = document.getElementById("d2i-error-msg");
  const stackSummaryEl = document.getElementById("d2i-stack-summary");
  const catPillsEl = document.getElementById("d2i-cat-pills");
  const stackSearchInp = document.getElementById("d2i-stack-search");
  const stackGridEl = document.getElementById("d2i-stack-grid");
  const includeGearCb = document.getElementById("d2i-include-gear");
  const gearCountEl = document.getElementById("d2i-gear-count");
  const targetTabSel = document.getElementById("d2i-target-tab");
  const modeSel = document.getElementById("d2i-mode-select");
  const d2iExportBtn = document.getElementById("d2i-export-btn");

  let d2sMod = null;
  let d2iMod = null;
  let d2iBaseBytes = null;
  let d2iBaseMeta = null;
  let d2iStackMap = {};
  let d2iActiveCat = "all";

  const PERFECT_GEM_CODES = new Set(["gpv", "gpy", "gpb", "gpg", "gpr", "gpw", "skz"]);

  const ensureModules = async () => {
    if (!pdData && typeof initMercenarySimulator === "function") {
      await initMercenarySimulator();
    }
    if (!d2sMod) d2sMod = await import("/assets/d2s-exporter.js?v=7276ddeb64");
    if (!d2iMod) d2iMod = await import("/assets/d2i-stash.js?v=bde4bdf9fe");
  };

  const switchTab = (tabName) => {
    const isPersonal = tabName === "personal";
    tabBtns.forEach(b => {
      const on = b.dataset.stashTab === tabName;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    if (panePersonal) panePersonal.style.display = isPersonal ? "flex" : "none";
    if (paneShared) paneShared.style.display = isPersonal ? "none" : "flex";
    if (!isPersonal) renderD2iStackGrid();
  };

  const getCompatibleBasesForRw = (rwId) => {
    const rwObj = (typeof rwList !== "undefined" && Array.isArray(rwList)) ? rwList.find(x => x.id === rwId) : null;
    const allBases = Object.entries((pdData && pdData.baseRules) || {}).map(([code, r]) => ({ code, ...r }));
    if (!rwObj) return allBases.slice(0, 40);
    const reqSock = (rwObj.runes || []).length;
    const matched = allBases.filter(b => {
      if ((b.maxSockets || 0) < reqSock) return false;
      if (typeof isBaseEligibleForRuneword === "function") return isBaseEligibleForRuneword(b, rwObj);
      return true;
    });
    return (matched.length ? matched : allBases).sort((a, b) => (b.tier === "elite" ? 1 : 0) - (a.tier === "elite" ? 1 : 0) || (a.nameZh || a.code).localeCompare(b.nameZh || b.code));
  };

  const populateBaseSelectForRw = () => {
    if (!baseSel || !catSel || !itemSel) return;
    if (catSel.value !== "rw") {
      baseSel.style.display = "none";
      return;
    }
    baseSel.style.display = "";
    const rwId = itemSel.value;
    const bases = getCompatibleBasesForRw(rwId);
    baseSel.innerHTML = bases.map(b =>
      '<option value="' + escapeHtml(b.code) + '">' + escapeHtml((b.nameZh || b.nameEn || b.code) + " (" + b.code + ")") + "</option>"
    ).join("");
  };

  const populateItemSelect = () => {
    if (!catSel || !itemSel) return;
    const cat = catSel.value;
    const q = String(searchInp ? searchInp.value : "").trim().toLowerCase();
    let rows = [];
    if (cat === "unique") {
      rows = ((itData && itData.uniqueItems) || []).map(u => ({
        val: u.nameEn,
        code: u.baseCode || "",
        label: (u.nameZh || u.nameEn) + " · " + u.nameEn
      }));
    } else if (cat === "rw") {
      rows = ((typeof rwList !== "undefined" && Array.isArray(rwList)) ? rwList : []).map(r => ({
        val: r.id,
        code: "",
        label: (r.nameZh || r.name) + " · " + r.name + " (" + (r.runes || []).join("+") + ")"
      }));
    } else if (cat === "set") {
      const bundle = getD2sCatalogBundle();
      rows = (bundle.setPieces || []).map(p => ({
        val: p.nameEn,
        code: p.baseCode || "",
        label: (p.nameZh || p.nameEn) + " · " + p.nameEn
      }));
    } else if (cat === "base") {
      rows = Object.entries((pdData && pdData.baseRules) || {}).map(([code, b]) => ({
        val: code,
        code,
        label: (b.nameZh || b.nameEn || code) + " · " + (b.nameEn || code) + " [" + (b.maxSockets || 0) + "孔]"
      }));
    } else if (cat === "stack" && d2sMod && d2sMod.D2S_ADV_STACKABLE_META) {
      rows = Object.entries(d2sMod.D2S_ADV_STACKABLE_META).map(([code, m]) => ({
        val: code,
        code,
        label: m.nameZh + " · " + m.nameEn
      }));
    }
    if (q) {
      rows = rows.filter(r => r.label.toLowerCase().includes(q) || r.val.toLowerCase().includes(q));
    }
    itemSel.innerHTML = rows.slice(0, 1000).map(r =>
      '<option value="' + escapeHtml(r.val) + '" data-code="' + escapeHtml(r.code) + '">' + escapeHtml(r.label) + "</option>"
    ).join("") || '<option value="">无匹配物品</option>';
    if (ethWrap) ethWrap.style.display = cat === "stack" ? "none" : "inline-flex";
    populateBaseSelectForRw();
  };

  const renderPersonalList = () => {
    if (!personalListEl || !d2iMod) return;
    const packed = d2iMod.packItemsInto10x10(pdCustomStashItems.map(x => ({ ...x, code: x.code || x.baseCode || "amu" })));
    if (personalUsageEl) {
      const ov = packed.overflow.length > 0 ? (" · ⚠️ 超出 " + packed.overflow.length + " 件") : "";
      personalUsageEl.textContent = pdCustomStashItems.length + " 件 · 占 " + packed.usedCells + "/100 格" + ov;
    }
    if (gearCountEl) gearCountEl.textContent = String(pdCustomStashItems.length);
    if (!pdCustomStashItems.length) {
      personalListEl.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:18px;color:var(--muted);font-size:12px">仓库列表为空 — 可在上方挑选任意暗金/符文之语/套装/底材/材料，或一键导入当前角色装备</div>';
      return;
    }
    const catNames = { unique: "暗金", rw: "符文之语", set: "套装", base: "底材", stack: "材料/符文/宝石" };
    personalListEl.innerHTML = pdCustomStashItems.map((it, idx) => {
      const [w, h] = d2iMod.getItemGridSize(it.code || it.baseCode || "amu");
      const sub = [catNames[it.cat] || it.cat, it.eth ? "无形" : "", (it.code || it.baseCode || ""), w + "×" + h].filter(Boolean).join(" · ");
      return '<div class="stash-item-card">' +
        '<div class="stash-item-info">' +
          '<div class="stash-item-name cat-' + escapeHtml(it.cat) + '">' + escapeHtml(it.labelZh || it.id) + "</div>" +
          '<div class="stash-item-sub">' + escapeHtml(sub) + "</div>" +
        "</div>" +
        '<button type="button" class="stash-item-del" data-stash-del="' + idx + '" title="移出仓库">×</button>' +
      "</div>";
    }).join("");
  };

  const updateStackSummary = () => {
    const entries = Object.entries(d2iStackMap).filter(([, v]) => v > 0);
    const totalUnits = entries.reduce((s, [, v]) => s + v, 0);
    if (stackSummaryEl) {
      stackSummaryEl.textContent = "已配置 " + entries.length + " 种 · 共 " + totalUnits + " 个";
    }
  };

  const renderD2iStackGrid = () => {
    if (!stackGridEl || !d2sMod || !d2sMod.D2S_ADV_STACKABLE_META) return;
    updateStackSummary();
    const q = String(stackSearchInp ? stackSearchInp.value : "").trim().toLowerCase();
    const entries = Object.entries(d2sMod.D2S_ADV_STACKABLE_META).filter(([code, m]) => {
      const qty = Number(d2iStackMap[code] || 0);
      if (d2iActiveCat === "rune" && m.cat !== "rune") return false;
      if (d2iActiveCat === "pgem" && !PERFECT_GEM_CODES.has(code)) return false;
      if (d2iActiveCat === "gem" && m.cat !== "gem") return false;
      if (d2iActiveCat === "mat" && m.cat !== "mat") return false;
      if (d2iActiveCat === "pot" && m.cat !== "pot") return false;
      if (d2iActiveCat === "selected" && qty <= 0) return false;
      if (q && !m.nameZh.toLowerCase().includes(q) && !m.nameEn.toLowerCase().includes(q) && !code.includes(q)) return false;
      return true;
    });
    if (!entries.length) {
      stackGridEl.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:18px;color:var(--muted);font-size:12px">当前筛选下无匹配项</div>';
      return;
    }
    stackGridEl.innerHTML = entries.map(([code, m]) => {
      const qty = Math.max(0, Math.min(99, Math.round(Number(d2iStackMap[code] || 0))));
      return '<div class="d2i-stack-row' + (qty > 0 ? " has-qty" : "") + '" data-stack-code="' + escapeHtml(code) + '">' +
        '<div class="d2i-stack-label">' +
          '<span class="d2i-stack-name" title="' + escapeHtml(m.nameEn) + '">' + escapeHtml(m.nameZh) + "</span>" +
          '<span class="d2i-stack-code">' + escapeHtml(m.nameEn + " · " + code) + "</span>" +
        "</div>" +
        '<div class="d2i-qty-ctrl">' +
          '<button type="button" data-qty-act="dec" aria-label="减1">-</button>' +
          '<input type="number" min="0" max="99" value="' + qty + '" data-qty-inp="' + escapeHtml(code) + '" />' +
          '<button type="button" data-qty-act="inc" aria-label="加1">+</button>' +
          '<button type="button" data-qty-act="max" title="拉满 99">99</button>' +
        "</div>" +
      "</div>";
    }).join("");
  };

  const openStashDialog = async () => {
    try {
      await ensureModules();
      populateItemSelect();
      renderPersonalList();
      renderD2iStackGrid();
      if (!dlg.open) dlg.showModal();
    } catch (err) {
      showAuthToast("打开仓库配置失败：" + (err && err.message ? err.message : "未知错误"), true);
    }
  };

  ["sk-stash-export-btn", "pd-stash-export-btn"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", openStashDialog);
  });
  if (closeBtn) closeBtn.addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  tabBtns.forEach(b => b.addEventListener("click", () => switchTab(b.dataset.stashTab)));

  if (catSel) catSel.addEventListener("change", () => { if (searchInp) searchInp.value = ""; populateItemSelect(); });
  if (searchInp) searchInp.addEventListener("input", populateItemSelect);
  if (itemSel) itemSel.addEventListener("change", populateBaseSelectForRw);

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      if (!catSel || !itemSel || !itemSel.value) return;
      const cat = catSel.value;
      const val = itemSel.value;
      const opt = itemSel.options[itemSel.selectedIndex];
      const baseCode = cat === "rw"
        ? (baseSel && baseSel.value ? baseSel.value : "")
        : (cat === "base" || cat === "stack" ? val : (opt ? opt.dataset.code || "" : ""));
      let code = baseCode;
      if (!code && cat === "unique" && itData && Array.isArray(itData.uniqueItems)) {
        const u = itData.uniqueItems.find(x => x.nameEn === val);
        if (u) code = u.baseCode || (/ring|戒指/i.test(String(u.slot || u.type || "")) ? "rin" : (/amulet|项链/i.test(String(u.slot || u.type || "")) ? "amu" : ""));
      }
      const labelZh = (opt ? opt.textContent : val).split(" · ")[0].trim();
      pdCustomStashItems.push({
        uid: "st" + Date.now() + "_" + Math.floor(Math.random() * 1000),
        cat,
        id: val,
        baseCode: code,
        code: code || "amu",
        eth: Boolean(ethCb && ethCb.checked && cat !== "stack"),
        labelZh
      });
      saveCustomStashItems();
      renderPersonalList();
    });
  }

  const importLoadoutToStash = (loadoutObj, label) => {
    if (!loadoutObj) return;
    let added = 0;
    for (const [slotId, eq] of Object.entries(loadoutObj)) {
      if (!eq || !eq.cat || !eq.id) continue;
      if (!["unique", "rw", "set"].includes(eq.cat)) continue;
      const info = resolveEquippedItemInfo(eq, { actorLvl: 90, isChar: true });
      const code = (info && info.bRule && info.bRule.code) || eq.baseCode || (slotId === "amulet" ? "amu" : (slotId === "ring1" || slotId === "ring2" ? "rin" : ""));
      if (!code) continue;
      pdCustomStashItems.push({
        uid: "st" + Date.now() + "_" + added + "_" + Math.floor(Math.random() * 1000),
        cat: eq.cat,
        id: eq.id,
        baseCode: code,
        code,
        eth: Boolean(eq.eth),
        rolls: eq.rolls ? cloneJsonSafe(eq.rolls, {}) : {},
        sockets: Array.isArray(eq.sockets) ? eq.sockets.slice() : [],
        labelZh: (info && info.titleZh) || eq.id
      });
      added += 1;
    }
    saveCustomStashItems();
    renderPersonalList();
    showAuthToast("✓ 已将" + label + " " + added + " 件装备加入仓库列表");
  };

  if (quickCharBtn) quickCharBtn.addEventListener("click", () => importLoadoutToStash(pdCharLoadout, "当前角色全身"));
  if (quickMercBtn) quickMercBtn.addEventListener("click", () => importLoadoutToStash(pdMercLoadout, "当前佣兵"));
  if (clearPersonalBtn) {
    clearPersonalBtn.addEventListener("click", () => {
      pdCustomStashItems = [];
      saveCustomStashItems();
      renderPersonalList();
    });
  }
  if (personalListEl) {
    personalListEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-stash-del]");
      if (!btn) return;
      const idx = Number(btn.dataset.stashDel);
      if (Number.isInteger(idx) && idx >= 0 && idx < pdCustomStashItems.length) {
        pdCustomStashItems.splice(idx, 1);
        saveCustomStashItems();
        renderPersonalList();
      }
    });
  }
  if (exportD2sNowBtn) {
    exportD2sNowBtn.addEventListener("click", () => {
      dlg.close();
      exportCurrentBuildAsD2s();
    });
  }

  // Tab 2: .d2i base file import & presets
  if (pickBaseBtn && baseFileInp) pickBaseBtn.addEventListener("click", () => baseFileInp.click());
  if (baseFileInp) {
    baseFileInp.addEventListener("change", async () => {
      const f = baseFileInp.files && baseFileInp.files[0];
      if (!f) return;
      if (d2iErrEl) { d2iErrEl.textContent = ""; d2iErrEl.classList.remove("show"); }
      try {
        await ensureModules();
        const bytes = new Uint8Array(await f.arrayBuffer());
        const parsed = d2iMod.parseD2iBuffer(bytes);
        d2iBaseBytes = bytes;
        d2iBaseMeta = parsed;
        d2iStackMap = { ...parsed.stackables };
        if (modeSel && /hardcore/i.test(f.name)) modeSel.value = "hc";
        else if (modeSel && /softcore/i.test(f.name)) modeSel.value = "sc";
        if (baseStatusEl) {
          baseStatusEl.textContent = "✓ 已载入 " + f.name + "（5页装备 " + parsed.totalNormalItems + " 件 · 原堆叠 " + parsed.totalStackTypes + " 种 · 编年史保留）";
          baseStatusEl.style.color = "#8af49f";
        }
        if (clearBaseBtn) clearBaseBtn.style.display = "";
        renderD2iStackGrid();
      } catch (err) {
        if (d2iErrEl) {
          d2iErrEl.textContent = (err && err.message) || "解析 .d2i 共享仓库失败，请确认是 D2R 3.4 的 ModernSharedStash*.d2i 文件";
          d2iErrEl.classList.add("show");
        }
      }
    });
  }
  if (clearBaseBtn) {
    clearBaseBtn.addEventListener("click", () => {
      d2iBaseBytes = null;
      d2iBaseMeta = null;
      if (baseFileInp) baseFileInp.value = "";
      if (baseStatusEl) {
        baseStatusEl.textContent = "当前：生成全新共享仓库";
        baseStatusEl.style.color = "";
      }
      clearBaseBtn.style.display = "none";
    });
  }

  dlg.querySelectorAll("[data-d2i-preset]").forEach(btn => {
    btn.addEventListener("click", async () => {
      await ensureModules();
      const preset = btn.dataset.d2iPreset;
      const meta = d2sMod.D2S_ADV_STACKABLE_META || {};
      if (preset === "clear") {
        d2iStackMap = {};
      } else if (preset === "runes-all") {
        for (const [code, m] of Object.entries(meta)) if (m.cat === "rune") d2iStackMap[code] = 99;
      } else if (preset === "runes-hr") {
        for (let n = 20; n <= 33; n += 1) {
          const c = "r" + String(n).padStart(2, "0");
          if (meta[c]) d2iStackMap[c] = 99;
        }
      } else if (preset === "gems-perfect") {
        for (const c of PERFECT_GEM_CODES) if (meta[c]) d2iStackMap[c] = 99;
      } else if (preset === "mats-all") {
        for (const [code, m] of Object.entries(meta)) if (m.cat === "mat" || code === "rvl") d2iStackMap[code] = 99;
      } else if (preset === "all-99") {
        for (const code of Object.keys(meta)) d2iStackMap[code] = 99;
      }
      renderD2iStackGrid();
    });
  });

  if (catPillsEl) {
    catPillsEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-d2i-cat]");
      if (!btn) return;
      d2iActiveCat = btn.dataset.d2iCat || "all";
      catPillsEl.querySelectorAll("[data-d2i-cat]").forEach(b => b.classList.toggle("active", b === btn));
      renderD2iStackGrid();
    });
  }
  if (stackSearchInp) stackSearchInp.addEventListener("input", renderD2iStackGrid);

  if (stackGridEl) {
    stackGridEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-qty-act]");
      if (!btn) return;
      const row = btn.closest("[data-stack-code]");
      if (!row) return;
      const code = row.dataset.stackCode;
      const cur = Math.max(0, Math.min(99, Math.round(Number(d2iStackMap[code] || 0))));
      const act = btn.dataset.qtyAct;
      const next = act === "max" ? 99 : act === "inc" ? Math.min(99, cur + 1) : Math.max(0, cur - 1);
      if (next <= 0) delete d2iStackMap[code];
      else d2iStackMap[code] = next;
      const inp = row.querySelector("input");
      if (inp) inp.value = String(next);
      row.classList.toggle("has-qty", next > 0);
      updateStackSummary();
    });
    stackGridEl.addEventListener("input", (e) => {
      const inp = e.target.closest("[data-qty-inp]");
      if (!inp) return;
      const code = inp.dataset.qtyInp;
      const next = Math.max(0, Math.min(99, Math.round(Number(inp.value) || 0)));
      if (next <= 0) delete d2iStackMap[code];
      else d2iStackMap[code] = next;
      const row = inp.closest(".d2i-stack-row");
      if (row) row.classList.toggle("has-qty", next > 0);
      updateStackSummary();
    });
  }

  if (d2iExportBtn) {
    d2iExportBtn.addEventListener("click", async () => {
      try {
        await ensureModules();
        const cid = skActiveClassId || "sor";
        const lvlInp = document.getElementById("pd-char-lvl");
        const charLvl = Math.min(99, Math.max(1, Number(lvlInp ? lvlInp.value : 90) || 90));
        const classCode = d2sMod.CLASS_ID_TO_CODE[cid] !== undefined ? d2sMod.CLASS_ID_TO_CODE[cid] : 1;
        const normalTabItems = [[], [], [], [], []];
        if (includeGearCb && includeGearCb.checked && pdCustomStashItems.length > 0) {
          const tabIdx = Math.max(0, Math.min(4, Number(targetTabSel ? targetTabSel.value : 0) || 0));
          for (const entry of pdCustomStashItems) {
            const spec = encodeCustomStashEntryToD2sItem(d2sMod, entry, charLvl, classCode);
            if (spec) normalTabItems[tabIdx].push(spec);
          }
        }
        const res = d2iMod.buildD2iBuffer({
          baseD2iBytes: d2iBaseBytes,
          normalTabItems,
          stackables: d2iStackMap,
          hardcore: Boolean(modeSel && modeSel.value === "hc"),
          replaceStackables: Boolean(d2iBaseBytes)
        });
        const blob = new Blob([res.bytes], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = res.filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        const modeTag = res.meta.mergedFromExisting ? "增量合并" : "全新生成";
        const gearTag = res.meta.addedGearCount > 0 ? (" · 注入装备 " + res.meta.addedGearCount + " 件") : "";
        const ovTag = res.meta.overflowGearCount > 0 ? ("（" + res.meta.overflowGearCount + " 件超出空格未放入）") : "";
        showAuthToast("💾 已导出 " + res.filename + "（" + modeTag + " · 专页堆叠 " + res.meta.stackTypeCount + " 种 / 共 " + res.meta.totalStackUnits + " 个" + gearTag + ovTag + "）");
      } catch (err) {
        showAuthToast("导出 .d2i 共享仓库失败：" + (err && err.message ? err.message : "未知错误"), true);
      }
    });
  }
}

let _skInited = false;
export function init() {
  if (_skInited) return;
  _skInited = true;
  setupSkillsEvents();
  setupSharedBuildUi();
  setupD2sImportUi();
  setupStashExportUi();
  setupMetaPresetsUi();
}
export async function onActivate() {
  init();
  if (!skClasses.length) await loadSkillsCatalog();
  scheduleDrawSkillTreeLinks();
}
export function onLangChange() {
  if (skClasses.length) renderSkillsAll();
}
export function onCloudSync() {
  loadSkBuilds();
  loadAllSavedPaperdollBuilds();
  if (window.location.hash && window.location.hash.startsWith("#skills:") && skClasses.length) {
    parseSkillsHashBuild(window.location.hash);
  }
  if (skClasses.length) renderSkillsAll();
  if (pdData) {
    loadPaperdollStateForClass(skActiveClassId);
    renderPaperdollAll();
  }
}
export function flushCurrentPaperdollToSaved() {
  if (pdStateLoadedForClass === skActiveClassId) {
    savePaperdollState(skActiveClassId);
  }
}
export async function applyCloudPreset(preset) {
  init();
  if (!skClasses.length) await loadSkillsCatalog();
  const cid = preset.classId;
  setSkActiveClassId(cid);
  skBuilds[cid] = cloneJsonSafe(preset.skills || {}, {});
  if (preset.paperdoll) {
    pdSavedByClass[cid] = cloneJsonSafe(preset.paperdoll, {});
  }
  try {
    localStorage.setItem(SK_STORAGE_KEY, JSON.stringify(skBuilds));
    localStorage.setItem(PD_STORAGE_KEY, JSON.stringify(pdSavedByClass));
  } catch (e) {}
  if (skClasses.length) renderSkillsAll();
  if (pdData) {
    loadPaperdollStateForClass(cid);
    renderPaperdollAll();
  }
}
export {
  loadSkillsCatalog, renderSkillsAll, renderPaperdollAll, scheduleDrawSkillTreeLinks,
  importSharedBuildById, openBdShareDialog, activateSkillsSubtab, loadSkBuilds, loadAllSavedPaperdollBuilds
};
D2R.tabs.skills = {
  init, onActivate, onLangChange, onCloudSync, flushCurrentPaperdollToSaved, applyCloudPreset,
  loadSkillsCatalog, renderSkillsAll, renderPaperdollAll, scheduleDrawSkillTreeLinks,
  importSharedBuildById, openBdShareDialog, activateSkillsSubtab
};
