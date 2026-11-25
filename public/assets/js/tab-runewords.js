import {
  D2R, RW_STORAGE_KEY, currentLang,
  rwRunes, setRwRunes, rwList, setRwList, rwCompleted, setRwCompleted,
  toZhTW, pickLangTitle, pickLangSub, escapeHtml,
  applyDomTraditionalSweep, scheduleCloudSync
} from "./shared.js?v=09528eb701";

let rwSearchQuery = "";
let rwFilterStatus = "all";
let rwFilterType = "all";
let rwFilterSocket = "all";
let rwFilterMode = "all";
let rwFilterPatch = "all";
let rwSelectedRunes = new Set();
let rwNeededOnly = false;

function loadRwCompleted() {
  try {
    const saved = JSON.parse(localStorage.getItem(RW_STORAGE_KEY) || "[]");
    if (Array.isArray(saved)) {
      setRwCompleted(new Set(saved));
    }
  } catch (e) {
    setRwCompleted(new Set());
  }
}

function saveRwCompleted() {
  try {
    localStorage.setItem(RW_STORAGE_KEY, JSON.stringify([...rwCompleted]));
    if (!window.__cloudApplyingRemote) {
      localStorage.setItem("d2r-builds-local-updated-at", new Date().toISOString());
      if (typeof scheduleCloudSync === "function") scheduleCloudSync();
    }
  } catch (e) {}
}

async function loadRunewordsCatalog() {
  try {
    const response = await fetch("/api/runewords", { cache: "no-store" });
    const data = await response.json();
    if (data.ok && Array.isArray(data.runewords)) {
      setRwRunes(data.runes || []);
      setRwList(data.runewords || []);
      renderRunewordsAll();
      if (D2R.tabs.skills && D2R.tabs.skills.renderPaperdollAll) D2R.tabs.skills.renderPaperdollAll();
    }
  } catch (err) {
    console.error("加载符文之语图鉴失败", err);
  }
}

function renderRunewordsSummary() {
  const totalCounts = {};
  const remainingCounts = {};
  for (const r of rwRunes) {
    totalCounts[r.name] = 0;
    remainingCounts[r.name] = 0;
  }

  let totalRunes = 0;
  let remainingRunes = 0;
  let completedCount = 0;

  for (const rw of rwList) {
    const done = rwCompleted.has(rw.id);
    if (done) completedCount += 1;
    for (const rName of rw.runes) {
      totalCounts[rName] = (totalCounts[rName] || 0) + 1;
      totalRunes += 1;
      if (!done) {
        remainingCounts[rName] = (remainingCounts[rName] || 0) + 1;
        remainingRunes += 1;
      }
    }
  }

  const totalCount = rwList.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  document.getElementById("rw-completed-count").textContent = completedCount;
  document.getElementById("rw-total-count").textContent = totalCount;
  document.getElementById("rw-progress-pct").textContent = pct + "%";
  document.getElementById("rw-total-runes").textContent = totalRunes;
  document.getElementById("rw-remaining-runes").textContent = remainingRunes;
  document.getElementById("rw-progress-fill").style.width = pct + "%";

  const grid = document.getElementById("rw-rune-grid");
  const runesToDisplay = rwNeededOnly
    ? rwRunes.filter(r => (remainingCounts[r.name] || 0) > 0)
    : rwRunes;

  if (grid.querySelectorAll("[data-rune-filter]").length !== rwRunes.length) {
    grid.innerHTML = rwRunes.map(rune => {
      const runeImg = rune.icon
        ? '<img class="rw-rune-thumb" src="' + escapeHtml(rune.icon) + '" alt="' + escapeHtml(rune.name) + '">'
        : '';
      return '<button type="button" class="rw-rune-card tier-' + escapeHtml(rune.tier) +
        '" data-rune-filter="' + escapeHtml(rune.name) + '">' +
        '<div class="rw-rune-top" data-no-sweep="1"><span class="rw-rune-num">#' + rune.number + '</span>' + runeImg + '<span class="rw-rune-title-text">' + escapeHtml(pickLangTitle(rune)) + '</span></div>' +
        '<div class="rw-rune-name" data-no-sweep="1">' + escapeHtml(pickLangSub(rune)) + '</div>' +
        '<div class="rw-rune-counts">' +
          '<span class="rw-rune-rem"></span>' +
          '<span class="rw-rune-tot"></span>' +
        '</div>' +
      '</button>';
    }).join("") + '<div class="tz-empty" id="rw-rune-empty" style="display:none">🎉 所有符文需求均已清零！</div>';

    grid.querySelectorAll("[data-rune-filter]").forEach(btn => {
      btn.addEventListener("click", () => {
        const rName = btn.dataset.runeFilter;
        if (rwSelectedRunes.has(rName)) {
          rwSelectedRunes.delete(rName);
        } else {
          rwSelectedRunes.add(rName);
        }
        renderRunewordsSummary();
        renderRunewordsList();
      });
    });
  }

  const emptyEl = document.getElementById("rw-rune-empty");
  if (emptyEl) emptyEl.style.display = runesToDisplay.length === 0 ? "" : "none";

  const clearBtn = document.getElementById("rw-clear-runes-btn");
  if (clearBtn) {
    clearBtn.style.display = rwSelectedRunes.size > 0 ? "" : "none";
    if (!clearBtn.dataset.bound) {
      clearBtn.dataset.bound = "1";
      clearBtn.addEventListener("click", () => {
        rwSelectedRunes.clear();
        renderRunewordsSummary();
        renderRunewordsList();
      });
    }
  }

  const runeMap = new Map(rwRunes.map(r => [r.name, r]));
  grid.querySelectorAll("[data-rune-filter]").forEach(btn => {
    const rName = btn.dataset.runeFilter;
    const rune = runeMap.get(rName);
    if (!rune) return;
    const total = totalCounts[rName] || 0;
    const remaining = remainingCounts[rName] || 0;
    const isSelected = rwSelectedRunes.has(rName);
    const isDone = remaining === 0;
    btn.classList.toggle("selected", isSelected);
    btn.classList.toggle("done", isDone);
    btn.style.display = (rwNeededOnly && isDone) ? "none" : "";
    const titleEl = btn.querySelector(".rw-rune-title-text");
    if (titleEl) titleEl.textContent = pickLangTitle(rune);
    const subEl = btn.querySelector(".rw-rune-name");
    if (subEl) subEl.textContent = pickLangSub(rune);
    const remEl = btn.querySelector(".rw-rune-rem");
    if (remEl) remEl.textContent = isDone ? "✓ 0" : "需 " + remaining;
    const totEl = btn.querySelector(".rw-rune-tot");
    if (totEl) totEl.textContent = "总 " + total;
  });
}

function renderRunewordsList() {
  const container = document.getElementById("rw-list");
  if (!rwList || rwList.length === 0) {
    container.innerHTML = '<div class="tz-empty">正在加载符文之语清单...</div>';
    return;
  }

  const runeMap = new Map(rwRunes.map(r => [r.name, r]));
  const filtered = rwList.filter(rw => {
    const done = rwCompleted.has(rw.id);
    if (rwFilterStatus === "todo" && done) return false;
    if (rwFilterStatus === "done" && !done) return false;
    if (rwFilterType !== "all" && !rw.types.includes(rwFilterType)) return false;
    if (rwFilterSocket !== "all" && String(rw.sockets) !== String(rwFilterSocket)) return false;
    if (rwFilterMode !== "all" && (rw.ladderStatus || "universal") !== rwFilterMode) return false;
    if (rwFilterPatch !== "all") {
      if (rwFilterPatch === "classic" && !["1.09", "1.10", "1.11"].includes(rw.patch)) return false;
      if (rwFilterPatch !== "classic" && rw.patch !== rwFilterPatch) return false;
    }
    if (rwSelectedRunes.size > 0) {
      for (const selRune of rwSelectedRunes) {
        if (!rw.runes.includes(selRune)) return false;
      }
    }
    if (rwSearchQuery) {
      const q = rwSearchQuery.toLowerCase();
      const matchZh = rw.zhName.toLowerCase().includes(q) || (rw.i18n && ((rw.i18n.zhTW || "").toLowerCase().includes(q) || (rw.i18n.zhCN || "").toLowerCase().includes(q)));
      const matchEn = rw.name.toLowerCase().includes(q);
      const matchBase = rw.basesZh.toLowerCase().includes(q);
      const matchRune = rw.runes.some(r => {
        const info = runeMap.get(r);
        return r.toLowerCase().includes(q) || (info && info.zhName.includes(q));
      });
      if (!matchZh && !matchEn && !matchBase && !matchRune) return false;
    }
    return true;
  });

  const hint = document.getElementById("rw-selected-rune-hint");
  if (hint) {
    if (rwSelectedRunes.size > 0) {
      hint.textContent = "匹配到 " + filtered.length + " 个符文之语（已选 " + rwSelectedRunes.size + " 颗符文）";
    } else {
      hint.textContent = "匹配到 " + filtered.length + " 个符文之语";
    }
    if (typeof applyDomTraditionalSweep === "function") applyDomTraditionalSweep();
  }

  if (filtered.length === 0) {
    container.innerHTML = '<div class="tz-empty">未找到匹配的符文之语</div>';
    return;
  }

  container.innerHTML = filtered.map(rw => {
    const done = rwCompleted.has(rw.id);
    const patchLabel = rw.patch === "RotW" ? "术士君临" : rw.patch;
    const modeClass = rw.ladderStatus === "ladder-rework"
      ? " rw-badge-ladder"
      : rw.ladderStatus === "rotw"
        ? " rw-badge-rotw"
        : rw.ladderStatus === "unlocked"
          ? " rw-badge-unlocked"
          : "";
    const modeBadge = rw.ladderStatus && rw.ladderStatus !== "universal"
      ? '<span class="rw-badge' + modeClass + '">' + escapeHtml(rw.ladderLabel || "") + '</span>'
      : '<span class="rw-badge">' + escapeHtml(rw.ladderLabel || "非赛/赛季通用") + '</span>';
    const noteHtml = rw.note
      ? '<div class="rw-item-note">📌 ' + escapeHtml(rw.note) + '</div>'
      : "";
    const runePills = rw.runes.map(rName => {
      const info = runeMap.get(rName);
      const tier = info?.tier || "low";
      const num = info?.number || "";
      const label = info ? pickLangTitle(info) : rName;
      const selCls = rwSelectedRunes.has(rName) ? " pill-selected" : "";
      return '<span class="rw-rune-pill tier-' + escapeHtml(tier) + selCls + '" data-no-sweep="1" title="#' + num + ' ' + escapeHtml(rName) + '">' +
        '<span class="rw-rune-pill-num">#' + num + '</span>' +
        escapeHtml(label) +
      '</span>';
    }).join("");

    return '<div class="rw-item' + (done ? " completed" : "") + '" data-rw-card="' + escapeHtml(rw.id) + '">' +
      '<input type="checkbox" class="rw-check" data-rw-id="' + escapeHtml(rw.id) + '"' + (done ? " checked" : "") + '>' +
      '<div class="rw-item-body">' +
        '<div class="rw-item-head">' +
          '<span class="rw-item-title" data-no-sweep="1">' + escapeHtml(pickLangTitle(rw)) + '<span class="rw-item-en">' + escapeHtml(pickLangSub(rw)) + '</span></span>' +
          '<span class="rw-item-badges">' +
            modeBadge +
            '<span class="rw-badge">' + rw.sockets + (currentLang === "enUS" ? ' Sockets' : ' 孔') + '</span>' +
            '<span class="rw-badge rw-badge-patch">' + escapeHtml(patchLabel) + '</span>' +
          '</span>' +
        '</div>' +
        '<div class="rw-item-bases">' + (currentLang === "enUS" ? 'Bases: ' + escapeHtml(rw.basesZh) + ' · Req Lvl ' + rw.reqLevel : '底材：' + escapeHtml(rw.basesZh) + ' · 需求等级 ' + rw.reqLevel) + '</div>' +
        noteHtml +
        '<div class="rw-rune-seq">' + runePills + '<button type="button" class="rw-detail-btn" data-rw-detail="' + escapeHtml(rw.id) + '">查看详情</button></div>' +
      '</div>' +
    '</div>';
  }).join("");

  container.querySelectorAll("[data-rw-id]").forEach(checkbox => {
    checkbox.addEventListener("change", (e) => {
      const id = e.target.dataset.rwId;
      if (e.target.checked) {
        rwCompleted.add(id);
      } else {
        rwCompleted.delete(id);
      }
      saveRwCompleted();
      renderRunewordsAll();
    });
  });

  container.querySelectorAll("[data-rw-card]").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".rw-check")) return;
      openRunewordDetail(card.dataset.rwCard);
    });
  });
}

let rwModalCurrentId = null;

function openRunewordDetail(id) {
  const rw = rwList.find(item => item.id === id);
  if (!rw) return;
  rwModalCurrentId = id;
  const runeMap = new Map(rwRunes.map(r => [r.name, r]));
  const modal = document.getElementById("rw-detail-modal");
  document.getElementById("rw-modal-title").textContent = pickLangTitle(rw);
  document.getElementById("rw-modal-en").textContent = rw.name;

  const patchLabel = rw.patch === "RotW" ? "术士君临" : rw.patch;
  const modeClass = rw.ladderStatus === "ladder-rework"
    ? " rw-badge-ladder"
    : rw.ladderStatus === "rotw"
      ? " rw-badge-rotw"
      : rw.ladderStatus === "unlocked"
        ? " rw-badge-unlocked"
        : "";

  const runesSeqHtml = rw.runes.map((rName, idx) => {
    const info = runeMap.get(rName);
    const tier = info?.tier || "low";
    const num = info?.number || "";
    const label = info ? pickLangTitle(info) : rName;
    const pill = '<span class="rw-rune-pill tier-' + escapeHtml(tier) + '" data-no-sweep="1">' +
      '<span class="rw-rune-pill-num">#' + num + '</span>' +
      escapeHtml(label) +
    '</span>';
    return idx > 0 ? '<span class="rw-modal-arrow">→</span>' + pill : pill;
  }).join("");

  const groups = Array.isArray(rw.statGroups) && rw.statGroups.length > 0
    ? rw.statGroups
    : [{ label: "符文之语属性", items: rw.stats || ["暂无属性资料"] }];

  const statsHtml = groups.map(group => {
    const ico = group.icon
      ? '<img class="ui-chip-icon" src="' + escapeHtml(group.icon) + '" alt="" />'
      : '';
    return '<div class="rw-stat-group">' +
      '<h4 class="rw-stat-group-title">' + ico + escapeHtml(group.label) + '</h4>' +
      '<ul class="rw-stat-list">' +
        group.items.map(line => '<li>' + escapeHtml(line) + '</li>').join("") +
      '</ul>' +
    '</div>';
  }).join("");

  const noteBlock = rw.note
    ? '<div class="rw-item-note" style="margin:0">📌 ' + escapeHtml(rw.note) + '</div>'
    : "";

  document.getElementById("rw-modal-body").innerHTML =
    '<div class="rw-modal-meta">' +
      '<span class="rw-badge' + modeClass + '">' + escapeHtml(rw.ladderLabel || "非赛/赛季通用") + '</span>' +
      '<span class="rw-badge">' + rw.sockets + ' 孔底材：' + escapeHtml(rw.basesZh) + '</span>' +
      '<span class="rw-badge rw-badge-patch">版本 ' + escapeHtml(patchLabel) + '</span>' +
      '<span class="rw-badge">需求等级 ' + rw.reqLevel + '</span>' +
    '</div>' +
    noteBlock +
    '<div class="rw-modal-runes-box">' +
      '<div class="rw-modal-runes-label">镶嵌顺序（严格从左到右放入白色/灰色底材）：</div>' +
      '<div class="rw-modal-runes">' + runesSeqHtml + '</div>' +
    '</div>' +
    '<div class="rw-modal-stats">' + statsHtml + '</div>';

  updateRwModalFooter();
  modal.classList.add("open");
}

function updateRwModalFooter() {
  if (!rwModalCurrentId) return;
  const done = rwCompleted.has(rwModalCurrentId);
  const statusText = document.getElementById("rw-modal-status-text");
  const toggleBtn = document.getElementById("rw-modal-toggle-done");
  statusText.textContent = done ? "✅ 已计入 100% 记事完成" : "⬜ 尚未完成";
  toggleBtn.textContent = done ? "取消完成" : "标记为已完成";
  toggleBtn.classList.toggle("active", done);
}

function closeRunewordDetail() {
  rwModalCurrentId = null;
  document.getElementById("rw-detail-modal").classList.remove("open");
}

function renderRunewordsAll() {
  renderRunewordsSummary();
  renderRunewordsList();
}

function setupRunewordsEvents() {
  loadRwCompleted();

  const searchInput = document.getElementById("rw-search-input");
  const searchClear = document.getElementById("rw-search-clear");
  searchInput.addEventListener("input", (e) => {
    rwSearchQuery = e.target.value.trim();
    searchClear.style.display = rwSearchQuery ? "block" : "none";
    renderRunewordsList();
  });
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    rwSearchQuery = "";
    searchClear.style.display = "none";
    renderRunewordsList();
    searchInput.focus();
  });

  document.querySelectorAll("#rw-status-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#rw-status-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      rwFilterStatus = btn.dataset.rwStatus;
      renderRunewordsList();
    });
  });

  document.querySelectorAll("#rw-type-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#rw-type-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      rwFilterType = btn.dataset.rwType;
      renderRunewordsList();
    });
  });

  document.querySelectorAll("#rw-socket-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#rw-socket-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      rwFilterSocket = btn.dataset.rwSocket;
      renderRunewordsList();
    });
  });

  document.querySelectorAll("#rw-mode-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#rw-mode-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      rwFilterMode = btn.dataset.rwMode;
      renderRunewordsList();
    });
  });

  document.querySelectorAll("#rw-patch-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#rw-patch-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      rwFilterPatch = btn.dataset.rwPatch;
      renderRunewordsList();
    });
  });

  const neededBtn = document.getElementById("rw-toggle-needed-only");
  neededBtn.addEventListener("click", () => {
    rwNeededOnly = !rwNeededOnly;
    neededBtn.classList.toggle("active", rwNeededOnly);
    renderRunewordsSummary();
  });

  document.getElementById("rw-reset-progress").addEventListener("click", () => {
    if (rwCompleted.size === 0) return;
    if (confirm("确定要清空所有已勾选的符文之语 100% 进度吗？")) {
      rwCompleted.clear();
      saveRwCompleted();
      renderRunewordsAll();
    }
  });

  const modal = document.getElementById("rw-detail-modal");
  document.getElementById("rw-modal-close").addEventListener("click", closeRunewordDetail);
  document.getElementById("rw-modal-close-btn").addEventListener("click", closeRunewordDetail);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeRunewordDetail();
  });
  document.getElementById("rw-modal-toggle-done").addEventListener("click", () => {
    if (!rwModalCurrentId) return;
    if (rwCompleted.has(rwModalCurrentId)) {
      rwCompleted.delete(rwModalCurrentId);
    } else {
      rwCompleted.add(rwModalCurrentId);
    }
    saveRwCompleted();
    renderRunewordsAll();
    updateRwModalFooter();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeRunewordDetail();
    }
  });

  loadRunewordsCatalog();
}


let _rwInited = false;
export function init() {
  if (_rwInited) return;
  _rwInited = true;
  setupRunewordsEvents();
}
export function onActivate() {
  init();
  if (!rwList.length) loadRunewordsCatalog();
  else renderRunewordsAll();
}
export function onLangChange() {
  if (rwList.length) renderRunewordsAll();
}
export function onCloudSync() {
  loadRwCompleted();
  if (rwList.length) renderRunewordsAll();
}
export { loadRwCompleted, saveRwCompleted, renderRunewordsAll, loadRunewordsCatalog };
D2R.tabs.runewords = { init, onActivate, onLangChange, onCloudSync, loadRwCompleted, saveRwCompleted, renderRunewordsAll, loadRunewordsCatalog };
