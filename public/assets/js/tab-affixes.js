import {
  D2R, currentLang, escapeHtml, renderStatList
} from "./shared.js?v=09528eb701";

let afData = null;
let afSearchQuery = "";
let afFilterSlot = "all";
let afFilterQuality = "all";
let afFilterType = "all";
let afCraftOpen = false;

async function loadAffixesCatalog() {
  try {
    const response = await fetch("/api/affixes", { cache: "no-store" });
    const data = await response.json();
    if (data.ok && Array.isArray(data.affixes)) {
      afData = data;
      renderAffixesRules();
      renderAffixesSlotChips();
      renderAffixesCraftRecipes();
      renderAffixesList();
      initSimulator();
      if (D2R.tabs.skills && D2R.tabs.skills.renderPaperdollAll) D2R.tabs.skills.renderPaperdollAll();
    }
  } catch (err) {
    console.error("加载物品词缀数据失败", err);
  }
}

function renderAffixesRules() {
  const grid = document.getElementById("af-rules-grid");
  if (!afData?.qualityRules) return;
  grid.innerHTML = afData.qualityRules.map(rule => {
    const ico = rule.icon
      ? '<img class="ui-chip-icon" src="' + escapeHtml(rule.icon) + '" alt="" />'
      : '';
    return '<article class="af-rule-card rule-' + escapeHtml(rule.id) + '">' +
      '<div class="af-rule-head"><span>' + escapeHtml(rule.name) + '</span><span style="display:inline-flex;align-items:center">' + ico + escapeHtml(rule.badge) + '</span></div>' +
      '<div class="af-rule-limit">' + escapeHtml(rule.affixLimit) + '</div>' +
      '<p class="af-rule-desc"><strong>特点：</strong>' + escapeHtml(rule.highlight) + '</p>' +
      '<p class="af-rule-desc"><strong>代表极品：</strong>' + escapeHtml(rule.examples) + '</p>' +
    '</article>';
  }).join("");
}

function renderAffixesSlotChips() {
  const wrap = document.getElementById("af-slot-chips");
  if (!afData?.slots) return;
  wrap.innerHTML = '<button class="tz-chip active" data-af-slot="all" type="button">全部部位</button>' +
    afData.slots.map(s => {
      const ico = s.icon
        ? '<img src="' + escapeHtml(s.icon) + '" alt="" style="width:16px;height:16px;object-fit:contain;vertical-align:middle;margin-right:5px">'
        : '';
      return '<button class="tz-chip" data-af-slot="' + escapeHtml(s.id) + '" type="button">' + ico + escapeHtml(s.label) + '</button>';
    }).join("");
  wrap.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      wrap.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      afFilterSlot = btn.dataset.afSlot;
      renderAffixesList();
    });
  });
}

function renderAffixesCraftRecipes() {
  const grid = document.getElementById("af-craft-grid");
  if (!afData?.craftRecipes) return;
  grid.innerHTML = afData.craftRecipes.map(series => {
    const gemImg = series.gemIcon
      ? '<img src="' + escapeHtml(series.gemIcon) + '" alt="' + escapeHtml(series.gem) + '" style="width:20px;height:20px;object-fit:contain;vertical-align:middle;margin:0 4px">'
      : '';
    return '<article class="af-craft-card">' +
      '<h4 class="af-craft-title">' + escapeHtml(series.series) + ' · ' + gemImg + escapeHtml(series.gem) + '</h4>' +
      '<div class="af-craft-rows">' +
        series.items.map(item =>
          '<div class="af-craft-row">' +
            '<div class="af-craft-row-head"><span>' + escapeHtml(item.slot) + '（' + escapeHtml(item.rune) + '）</span></div>' +
            '<div class="af-craft-row-meta">底材：' + escapeHtml(item.base) + '</div>' +
            renderStatList(String(item.fixed || "").replace(/、/g, " · "), "#ffd5a8", false) +
          '</div>'
        ).join("") +
      '</div>' +
    '</article>';
  }).join("");
}

function renderAffixesList() {
  const container = document.getElementById("af-list");
  if (!afData?.affixes) {
    container.innerHTML = '<div class="tz-empty">正在加载词缀范围...</div>';
    return;
  }

  const slotLabelMap = new Map((afData.slots || []).map(s => [s.id, s.label]));
  const filtered = afData.affixes.filter(item => {
    if (afFilterSlot !== "all" && item.slot !== afFilterSlot) return false;
    if (afFilterType !== "all" && item.type !== afFilterType) return false;
    if (afFilterQuality !== "all") {
      if (afFilterQuality === "generic" && item.quality !== "all") return false;
      if (afFilterQuality !== "generic" && item.quality !== afFilterQuality) return false;
    }
    if (afSearchQuery) {
      const q = afSearchQuery.toLowerCase();
      const hay = (item.nameZh + " " + item.nameEn + " " + item.range + " " + (item.note || "") + " " + (slotLabelMap.get(item.slot) || "")).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="tz-empty">未找到匹配的词缀记录</div>';
    return;
  }

  container.innerHTML = filtered.map(item => {
    const typeLabel = currentLang === "enUS"
      ? (item.type === "prefix" ? "Prefix" : item.type === "crafted" ? "Crafted" : "Suffix")
      : (item.type === "prefix" ? "前缀" : item.type === "crafted" ? "手工固定" : "后缀");
    const qualityBadge = item.quality === "magic"
      ? '<span class="rw-badge af-badge-magic">' + (currentLang === "enUS" ? "Magic Cap" : "仅蓝装极限") + '</span>'
      : item.quality === "rare"
        ? '<span class="rw-badge af-badge-rare">' + (currentLang === "enUS" ? "Rare Cap" : "黄/橙极限") + '</span>'
        : item.quality === "crafted"
          ? '<span class="rw-badge af-badge-crafted">' + (currentLang === "enUS" ? "Crafted Fixed" : "橙装固定") + '</span>'
          : '<span class="rw-badge af-badge-all">' + (currentLang === "enUS" ? "All Qualities" : "蓝/黄/橙通用") + '</span>';
    const slotLabel = slotLabelMap.get(item.slot) || item.slot;
    const noteHtml = item.note
      ? '<div class="af-card-note">' + escapeHtml(item.note) + '</div>'
      : "";

    return '<article class="af-card">' +
      '<div class="af-card-head">' +
        '<div><span class="af-card-title">' + escapeHtml(currentLang === "enUS" ? item.nameEn : item.nameZh) + '</span><span class="af-card-en">' + escapeHtml(currentLang === "enUS" ? item.nameZh : item.nameEn) + '</span></div>' +
        '<div class="af-card-badges">' +
          '<span class="rw-badge">' + escapeHtml(slotLabel) + '</span>' +
          '<span class="rw-badge">' + typeLabel + '</span>' +
          qualityBadge +
          '<span class="rw-badge">alvl ' + item.alvl + '</span>' +
        '</div>' +
      '</div>' +
      renderStatList(item.range, "#7fc2ff", false) +
      noteHtml +
    '</article>';
  }).join("");
}

function setupAffixesEvents() {
  const searchInput = document.getElementById("af-search-input");
  const searchClear = document.getElementById("af-search-clear");
  searchInput.addEventListener("input", (e) => {
    afSearchQuery = e.target.value.trim();
    searchClear.style.display = afSearchQuery ? "block" : "none";
    renderAffixesList();
  });
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    afSearchQuery = "";
    searchClear.style.display = "none";
    renderAffixesList();
    searchInput.focus();
  });

  document.querySelectorAll("#af-quality-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#af-quality-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      afFilterQuality = btn.dataset.afQuality;
      renderAffixesList();
    });
  });

  document.querySelectorAll("#af-type-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#af-type-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      afFilterType = btn.dataset.afType;
      renderAffixesList();
    });
  });

  const craftToggle = document.getElementById("af-craft-toggle");
  const craftBody = document.getElementById("af-craft-body");
  const craftArrow = document.getElementById("af-craft-arrow");
  craftToggle.addEventListener("click", () => {
    afCraftOpen = !afCraftOpen;
    craftBody.style.display = afCraftOpen ? "block" : "none";
    craftArrow.textContent = afCraftOpen ? "▲ 收起配方" : "▼ 展开配方";
    craftToggle.setAttribute("aria-expanded", String(afCraftOpen));
  });

  loadAffixesCatalog();
  setupAffixSubtabs();
}

/* 物品词缀模拟器逻辑 */
let simBaseId = "ring";
let simQuality = "rare";
let simIlvl = 85;
let simClvl = 93;
let simCraftBaseIlvl = 88;
let simCraftRecipeIdx = 0;
let simUniqueJewelId = "defenders-fire";
let simUniqueRolledLines = null;
let simSelectedPrefixes = [];
let simSelectedSuffixes = [];
let simRolledLines = null;

function setupAffixSubtabs() {
  const refBtn = document.getElementById("af-subtab-ref");
  const simBtn = document.getElementById("af-subtab-sim");
  const refView = document.getElementById("af-view-ref");
  const simView = document.getElementById("af-view-sim");
  const switchSubtab = (name) => {
    const isSim = name === "sim";
    refBtn.classList.toggle("active", !isSim);
    simBtn.classList.toggle("active", isSim);
    refView.style.display = isSim ? "none" : "block";
    simView.style.display = isSim ? "block" : "none";
  };
  refBtn.addEventListener("click", () => switchSubtab("ref"));
  simBtn.addEventListener("click", () => switchSubtab("sim"));
}

function getSimBase() {
  return (afData?.simulatorBases || []).find(b => b.id === simBaseId) || {
    id: "ring", slot: "ring", label: "戒指 (Ring)", icon: "/images/items/misc/ring/ring1.webp", qlvl: 1, magicLvl: 0, supportsCraft: true
  };
}

function computeSimAlvl(ilvl, qlvl, magicLvl) {
  const clampedIlvl = Math.min(99, Math.max(1, Number(ilvl) || 1));
  const effIlvl = Math.max(clampedIlvl, Number(qlvl) || 1);
  let alvl;
  if (magicLvl > 0) {
    alvl = effIlvl + magicLvl;
  } else if (effIlvl < 99 - Math.floor(qlvl / 2)) {
    alvl = effIlvl - Math.floor(qlvl / 2);
  } else {
    alvl = 2 * effIlvl - 99;
  }
  return Math.min(99, Math.max(1, alvl));
}

function getSimOutIlvl() {
  if (simQuality === "crafted") {
    return Math.min(99, Math.max(1, Math.floor(simClvl / 2) + Math.floor(simCraftBaseIlvl / 2)));
  }
  return Math.min(99, Math.max(1, simIlvl));
}

function getSimLimits(outIlvl) {
  const base = getSimBase();
  if (simQuality === "magic") {
    return { maxPrefix: 1, maxSuffix: 1, maxTotal: 2, label: "最多 1 前缀 + 1 后缀" };
  }
  if (simQuality === "crafted") {
    const randMax = outIlvl >= 71 ? 4 : outIlvl >= 51 ? 3 : outIlvl >= 31 ? 2 : 1;
    return {
      maxPrefix: 3,
      maxSuffix: 3,
      maxTotal: randMax,
      label: "固定属性 + " + (outIlvl >= 71 ? "必出 4 条随机" : "最多 " + randMax + " 条随机") + "（前≤3, 后≤3）"
    };
  }
  if (base && base.rareMaxAffixes) {
    return { maxPrefix: 3, maxSuffix: 3, maxTotal: base.rareMaxAffixes, label: "亮金珠宝最多 " + base.rareMaxAffixes + " 条词缀（前≤3, 后≤3）" };
  }
  return { maxPrefix: 3, maxSuffix: 3, maxTotal: 6, label: "最多 3 前缀 + 3 后缀" };
}

function getCraftRecipesForSlot(slot) {
  return (afData?.affixes || []).filter(a => a.slot === slot && a.type === "crafted");
}

function isAffixAllowedInSim(affix, alvl) {
  if (affix.alvl > alvl) return { ok: false, reason: "需 alvl " + affix.alvl };
  if (simQuality !== "magic" && affix.quality === "magic") {
    return { ok: false, reason: "仅蓝装专属" };
  }
  if (simQuality === "magic" && affix.quality === "rare") {
    return { ok: false, reason: "蓝装有更高上限" };
  }
  return { ok: true, reason: "" };
}

function populateSimCraftRecipes() {
  const base = getSimBase();
  const select = document.getElementById("sim-craft-recipe");
  const recipes = getCraftRecipesForSlot(base.slot);
  if (recipes.length === 0) {
    select.innerHTML = '<option value="0">通用橙装模板</option>';
    simCraftRecipeIdx = 0;
    return;
  }
  select.innerHTML = recipes.map((r, idx) =>
    '<option value="' + idx + '">' + escapeHtml(r.nameZh) + ' · ' + escapeHtml(r.nameEn) + '</option>'
  ).join("");
  if (simCraftRecipeIdx >= recipes.length) simCraftRecipeIdx = 0;
  select.value = String(simCraftRecipeIdx);
}

function getUniqueJewelsList() {
  return Array.isArray(afData?.uniqueJewels) ? afData.uniqueJewels : [];
}

function getActiveUniqueJewel() {
  const list = getUniqueJewelsList();
  return list.find(j => j.id === simUniqueJewelId) || list[0] || null;
}

function populateSimUniqueSelect() {
  const sel = document.getElementById("sim-unique-select");
  if (!sel) return;
  const list = getUniqueJewelsList();
  sel.innerHTML = list.map(j => {
    const tag = j.patch === "3.4" ? "[3.4新增] " : "[经典] ";
    return '<option value="' + escapeHtml(j.id) + '">' + tag + escapeHtml(j.nameZh) + ' · ' + escapeHtml(j.nameEn) + ' (需 Lv.' + j.reqLvl + ')</option>';
  }).join("");
  const active = getActiveUniqueJewel();
  if (active) {
    simUniqueJewelId = active.id;
    sel.value = active.id;
  }
}

function updateSimStateAndRender() {
  if (!afData) return;
  const base = getSimBase();

  const rareBtn = document.querySelector('#sim-quality-chips [data-sim-quality="rare"]');
  const craftBtn = document.querySelector('#sim-quality-chips [data-sim-quality="crafted"]');
  const uniqBtn = document.querySelector('#sim-quality-chips [data-sim-quality="unique"]');
  if (rareBtn) {
    rareBtn.disabled = Boolean(base.magicOnly);
    rareBtn.style.opacity = base.magicOnly ? ".4" : "1";
  }
  if (craftBtn) {
    craftBtn.disabled = !base.supportsCraft;
    craftBtn.style.opacity = base.supportsCraft ? "1" : ".4";
  }
  if (uniqBtn) {
    uniqBtn.style.display = base.supportsUnique ? "" : "none";
    uniqBtn.disabled = !base.supportsUnique;
  }
  if (base.magicOnly && simQuality !== "magic") {
    simQuality = "magic";
    document.querySelectorAll("#sim-quality-chips button").forEach(b => {
      b.classList.toggle("active", b.dataset.simQuality === "magic");
    });
  } else if (!base.supportsCraft && simQuality === "crafted") {
    simQuality = "rare";
    document.querySelectorAll("#sim-quality-chips button").forEach(b => {
      b.classList.toggle("active", b.dataset.simQuality === "rare");
    });
  } else if (!base.supportsUnique && simQuality === "unique") {
    simQuality = "rare";
    document.querySelectorAll("#sim-quality-chips button").forEach(b => {
      b.classList.toggle("active", b.dataset.simQuality === "rare");
    });
  }

  const isUniqueMode = simQuality === "unique" && Boolean(base.supportsUnique);
  document.getElementById("sim-standard-lvls").style.display = (simQuality === "crafted" || isUniqueMode) ? "none" : "flex";
  document.getElementById("sim-craft-opts").style.display = simQuality === "crafted" ? "flex" : "none";
  const uniqOpts = document.getElementById("sim-unique-opts");
  if (uniqOpts) uniqOpts.style.display = isUniqueMode ? "flex" : "none";

  const outIlvl = getSimOutIlvl();
  const alvl = computeSimAlvl(outIlvl, base.qlvl, base.magicLvl);
  const limits = isUniqueMode
    ? { maxPrefix: 0, maxSuffix: 0, maxTotal: 0, label: "暗金固定词缀（点击随机 Roll 生成实际变量）" }
    : getSimLimits(outIlvl);

  if (isUniqueMode) {
    const uj = getActiveUniqueJewel();
    document.getElementById("sim-out-ilvl").textContent = uj ? (uj.patch === "3.4" ? "85+ (TZ/3.4)" : "85") : "85";
    document.getElementById("sim-out-alvl").textContent = uj ? ("需 Lv." + uj.reqLvl) : "—";
    document.getElementById("sim-out-limit").textContent = limits.label;
    renderSimUniquePools();
    renderSimUniquePreview(uj);
    return;
  }

  document.getElementById("sim-out-ilvl").textContent = outIlvl;
  document.getElementById("sim-out-alvl").textContent = alvl;
  document.getElementById("sim-out-limit").textContent = limits.label;

  // 清理已选中但不再满足当前 alvl / 品质的词缀
  const pool = (afData.affixes || []).filter(a => a.slot === base.slot && a.type !== "crafted");
  simSelectedPrefixes = simSelectedPrefixes.filter(idx => {
    const item = pool[idx];
    return item && item.type === "prefix" && isAffixAllowedInSim(item, alvl).ok;
  }).slice(0, limits.maxPrefix);
  simSelectedSuffixes = simSelectedSuffixes.filter(idx => {
    const item = pool[idx];
    return item && item.type === "suffix" && isAffixAllowedInSim(item, alvl).ok;
  }).slice(0, limits.maxSuffix);

  renderSimPools(pool, alvl, limits);
  renderSimPreview(base, pool, outIlvl, alvl, limits);
}

function renderSimUniquePools() {
  const prefixContainer = document.getElementById("sim-prefix-list");
  const suffixContainer = document.getElementById("sim-suffix-list");
  const list = getUniqueJewelsList();
  const col34 = list.filter(j => j.patch === "3.4");
  const colClassic = list.filter(j => j.patch !== "3.4");
  document.getElementById("sim-prefix-count").textContent = "3.4 新增 " + col34.length + " 颗";
  document.getElementById("sim-suffix-count").textContent = "经典刻面 " + colClassic.length + " 颗";

  const renderJewelCards = (items) => items.map(j => {
    const isSel = j.id === simUniqueJewelId;
    return '<button type="button" class="sim-affix-btn' + (isSel ? " selected" : "") + '" data-sim-uniq-id="' + escapeHtml(j.id) + '">' +
      '<div class="sim-affix-top">' +
        '<span style="display:inline-flex;align-items:center;gap:6px"><img src="' + escapeHtml(j.icon) + '" alt="" style="width:18px;height:18px;object-fit:contain">' + escapeHtml(j.nameZh) + '</span>' +
        '<span class="sim-affix-req">需 Lv.' + j.reqLvl + '</span>' +
      '</div>' +
      '<div class="sim-affix-range">' + escapeHtml(j.nameEn) + ' · ' + escapeHtml(j.lines[1] || j.lines[0] || "") + '</div>' +
    '</button>';
  }).join("");

  prefixContainer.innerHTML = renderJewelCards(col34);
  suffixContainer.innerHTML = renderJewelCards(colClassic);

  const bind = (container) => {
    container.querySelectorAll("[data-sim-uniq-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        simUniqueJewelId = btn.dataset.simUniqId;
        simUniqueRolledLines = null;
        const sel = document.getElementById("sim-unique-select");
        if (sel) sel.value = simUniqueJewelId;
        updateSimStateAndRender();
      });
    });
  };
  bind(prefixContainer);
  bind(suffixContainer);
}

function renderSimUniquePreview(uj) {
  const card = document.getElementById("sim-preview-card");
  card.className = "sim-preview-card q-unique";
  if (!uj) return;
  document.getElementById("sim-preview-title").textContent = uj.nameZh + " · " + uj.nameEn;
  const iconEl = document.getElementById("sim-preview-icon");
  if (iconEl) iconEl.src = uj.icon;
  document.getElementById("sim-preview-sub").textContent =
    (uj.patch === "3.4" ? "D2R 3.4 巨型暗金珠宝 (cjw)" : "经典暗金珠宝 (jew)") +
    " · 需求等级 " + uj.reqLvl + (simUniqueRolledLines ? " · 已随机 Roll 变量" : " · 变量范围预览");
  const lines = (simUniqueRolledLines || uj.lines).map(l => '<li>' + escapeHtml(l) + '</li>');
  if (uj.note) {
    lines.push('<li style="opacity:.75;font-size:11.5px">' + escapeHtml(uj.note) + '</li>');
  }
  document.getElementById("sim-preview-lines").innerHTML = lines.join("");
}

function renderSimPools(pool, alvl, limits) {
  const prefixContainer = document.getElementById("sim-prefix-list");
  const suffixContainer = document.getElementById("sim-suffix-list");
  document.getElementById("sim-prefix-count").textContent = simSelectedPrefixes.length + " / " + limits.maxPrefix;
  document.getElementById("sim-suffix-count").textContent = simSelectedSuffixes.length + " / " + limits.maxSuffix;

  const renderList = (type, selectedArr) => {
    const items = pool
      .map((item, idx) => ({ item, idx }))
      .filter(entry => entry.item.type === type);

    if (items.length === 0) {
      return '<div class="tz-empty">该部位暂无此类型词缀</div>';
    }

    return items.map(({ item, idx }) => {
      const check = isAffixAllowedInSim(item, alvl);
      const isSelected = selectedArr.includes(idx);
      return '<button type="button" class="sim-affix-btn' + (isSelected ? " selected" : "") + '"' +
        ' data-sim-affix="' + idx + '" data-sim-type="' + type + '"' +
        (!check.ok ? " disabled" : "") + '>' +
        '<div class="sim-affix-top">' +
          '<span>' + escapeHtml(item.nameZh) + '</span>' +
          '<span class="sim-affix-req">' + (check.ok ? "alvl " + item.alvl : escapeHtml(check.reason)) + '</span>' +
        '</div>' +
        '<div class="sim-affix-range">' + escapeHtml(item.range) + '</div>' +
      '</button>';
    }).join("");
  };

  prefixContainer.innerHTML = renderList("prefix", simSelectedPrefixes);
  suffixContainer.innerHTML = renderList("suffix", simSelectedSuffixes);

  const bindClicks = (container) => {
    container.querySelectorAll("[data-sim-affix]").forEach(btn => {
      btn.addEventListener("click", () => {
        simRolledLines = null;
        const idx = Number(btn.dataset.simAffix);
        const type = btn.dataset.simType;
        const outIlvl = getSimOutIlvl();
        const limitsNow = getSimLimits(outIlvl);

        if (type === "prefix") {
          if (simSelectedPrefixes.includes(idx)) {
            simSelectedPrefixes = simSelectedPrefixes.filter(i => i !== idx);
          } else {
            const totalNow = simSelectedPrefixes.length + simSelectedSuffixes.length;
            if (simSelectedPrefixes.length < limitsNow.maxPrefix && totalNow < limitsNow.maxTotal) {
              simSelectedPrefixes.push(idx);
            }
          }
        } else {
          if (simSelectedSuffixes.includes(idx)) {
            simSelectedSuffixes = simSelectedSuffixes.filter(i => i !== idx);
          } else {
            const totalNow = simSelectedPrefixes.length + simSelectedSuffixes.length;
            if (simSelectedSuffixes.length < limitsNow.maxSuffix && totalNow < limitsNow.maxTotal) {
              simSelectedSuffixes.push(idx);
            }
          }
        }
        updateSimStateAndRender();
      });
    });
  };

  bindClicks(prefixContainer);
  bindClicks(suffixContainer);
}

function rollNumberInRangeText(text) {
  return String(text).replace(/(\d+)\s*[–-]\s*(\d+)/g, (_, a, b) => {
    const min = Number(a);
    const max = Number(b);
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
  });
}

function rollSimulatedItem() {
  if (!afData) return;
  const base = getSimBase();
  if (simQuality === "unique" && base.supportsUnique) {
    const uj = getActiveUniqueJewel();
    if (uj) {
      simUniqueRolledLines = uj.lines.map(l => rollNumberInRangeText(l));
      updateSimStateAndRender();
    }
    return;
  }
  const outIlvl = getSimOutIlvl();
  const alvl = computeSimAlvl(outIlvl, base.qlvl, base.magicLvl);
  const limits = getSimLimits(outIlvl);
  const pool = (afData.affixes || []).filter(a => a.slot === base.slot && a.type !== "crafted");

  const validPrefixes = pool.map((item, idx) => ({ item, idx })).filter(e => e.item.type === "prefix" && isAffixAllowedInSim(e.item, alvl).ok);
  const validSuffixes = pool.map((item, idx) => ({ item, idx })).filter(e => e.item.type === "suffix" && isAffixAllowedInSim(e.item, alvl).ok);

  const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5);
  const pPool = shuffle(validPrefixes);
  const sPool = shuffle(validSuffixes);

  simSelectedPrefixes = [];
  simSelectedSuffixes = [];

  if (simQuality === "magic") {
    const hasP = pPool.length > 0 && Math.random() < 0.75;
    const hasS = sPool.length > 0 && (Math.random() < 0.75 || !hasP);
    if (hasP) simSelectedPrefixes.push(pPool[0].idx);
    if (hasS) simSelectedSuffixes.push(sPool[0].idx);
  } else {
    const targetCount = simQuality === "crafted"
      ? limits.maxTotal
      : Math.min(limits.maxTotal, 4 + Math.floor(Math.random() * 3));
    let pIdx = 0;
    let sIdx = 0;
    for (let i = 0; i < targetCount; i++) {
      const canP = pIdx < pPool.length && simSelectedPrefixes.length < limits.maxPrefix;
      const canS = sIdx < sPool.length && simSelectedSuffixes.length < limits.maxSuffix;
      if (!canP && !canS) break;
      if (canP && (!canS || Math.random() < 0.5)) {
        simSelectedPrefixes.push(pPool[pIdx++].idx);
      } else {
        simSelectedSuffixes.push(sPool[sIdx++].idx);
      }
    }
  }

  simRolledLines = {};
  for (const idx of [...simSelectedPrefixes, ...simSelectedSuffixes]) {
    simRolledLines[idx] = rollNumberInRangeText(pool[idx].range);
  }
  updateSimStateAndRender();
}

function renderSimPreview(base, pool, outIlvl, alvl, limits) {
  const card = document.getElementById("sim-preview-card");
  card.className = "sim-preview-card q-" + simQuality;
  const qualityName = simQuality === "magic" ? "魔法" : simQuality === "crafted" ? "手工" : "亮金";
  const baseCleanName = base.label.replace(/^[^一-龥A-Za-z]+/, "").split(" (")[0];
  document.getElementById("sim-preview-title").textContent = qualityName + baseCleanName;
  const iconEl = document.getElementById("sim-preview-icon");
  if (iconEl) iconEl.src = base.icon || "/images/items/misc/ring/ring1.webp";

  const totalSelected = simSelectedPrefixes.length + simSelectedSuffixes.length;
  document.getElementById("sim-preview-sub").textContent =
    "ilvl " + outIlvl + " · alvl " + alvl + " · 随机词缀 " + totalSelected + " / " + limits.maxTotal;

  const lines = [];
  if (simQuality === "crafted") {
    const recipes = getCraftRecipesForSlot(base.slot);
    const recipe = recipes[simCraftRecipeIdx];
    if (recipe) {
      lines.push('<li class="fixed-line">【固定】' + escapeHtml(simRolledLines ? rollNumberInRangeText(recipe.range) : recipe.range) + '</li>');
    }
  }

  for (const idx of [...simSelectedPrefixes, ...simSelectedSuffixes]) {
    const item = pool[idx];
    if (!item) continue;
    const valText = simRolledLines?.[idx] || item.range;
    lines.push('<li>' + escapeHtml(valText) + ' <span style="opacity:.65;font-size:11px">(' + escapeHtml(item.nameZh) + ')</span></li>');
  }

  if (lines.length === 0) {
    lines.push('<li style="color:var(--muted)">请从左侧点选前缀/后缀，或点击「随机 Roll 一次」</li>');
  }
  document.getElementById("sim-preview-lines").innerHTML = lines.join("");
}

function initSimulator() {
  const baseSelect = document.getElementById("sim-base-select");
  const bases = afData?.simulatorBases || [];
  baseSelect.innerHTML = bases.map(b =>
    '<option value="' + escapeHtml(b.id) + '">' + escapeHtml(b.label) + '</option>'
  ).join("");
  baseSelect.value = simBaseId;

  baseSelect.addEventListener("change", () => {
    simBaseId = baseSelect.value;
    simSelectedPrefixes = [];
    simSelectedSuffixes = [];
    simRolledLines = null;
    populateSimCraftRecipes();
    updateSimStateAndRender();
  });

  document.querySelectorAll("#sim-quality-chips button").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      document.querySelectorAll("#sim-quality-chips button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      simQuality = btn.dataset.simQuality;
      simRolledLines = null;
      populateSimCraftRecipes();
      updateSimStateAndRender();
    });
  });

  const ilvlInput = document.getElementById("sim-ilvl-input");
  ilvlInput.addEventListener("input", () => {
    simIlvl = Math.min(99, Math.max(1, Number(ilvlInput.value) || 1));
    simRolledLines = null;
    document.querySelectorAll("#sim-ilvl-presets button").forEach(b => {
      b.classList.toggle("active", Number(b.dataset.simIlvl) === simIlvl);
    });
    updateSimStateAndRender();
  });

  document.querySelectorAll("#sim-ilvl-presets button").forEach(btn => {
    btn.addEventListener("click", () => {
      simIlvl = Number(btn.dataset.simIlvl);
      ilvlInput.value = simIlvl;
      simRolledLines = null;
      document.querySelectorAll("#sim-ilvl-presets button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      updateSimStateAndRender();
    });
  });

  document.getElementById("sim-craft-recipe").addEventListener("change", (e) => {
    simCraftRecipeIdx = Number(e.target.value) || 0;
    updateSimStateAndRender();
  });
  document.getElementById("sim-clvl-input").addEventListener("input", (e) => {
    simClvl = Math.min(99, Math.max(1, Number(e.target.value) || 1));
    updateSimStateAndRender();
  });
  document.getElementById("sim-craft-ilvl-input").addEventListener("input", (e) => {
    simCraftBaseIlvl = Math.min(99, Math.max(1, Number(e.target.value) || 1));
    updateSimStateAndRender();
  });

  const uniqSelect = document.getElementById("sim-unique-select");
  if (uniqSelect) {
    uniqSelect.addEventListener("change", () => {
      simUniqueJewelId = uniqSelect.value;
      simUniqueRolledLines = null;
      updateSimStateAndRender();
    });
  }

  document.getElementById("sim-roll-btn").addEventListener("click", rollSimulatedItem);
  document.getElementById("sim-clear-btn").addEventListener("click", () => {
    simSelectedPrefixes = [];
    simSelectedSuffixes = [];
    simRolledLines = null;
    simUniqueRolledLines = null;
    updateSimStateAndRender();
  });

  populateSimCraftRecipes();
  populateSimUniqueSelect();
  updateSimStateAndRender();
}

/* 物品资讯百科逻辑（基础 / 蓝黄 / 绿装 / 暗金 / 方块公式） + 圣杯 100% 收集追踪 */

let _afInited = false;
export function init() {
  if (_afInited) return;
  _afInited = true;
  setupAffixesEvents();
}
export function onActivate() {
  init();
  if (!afData) loadAffixesCatalog();
}
export function onLangChange() {
  if (!afData) return;
  renderAffixesRules();
  renderAffixesSlotChips();
  renderAffixesCraftRecipes();
  renderAffixesList();
}
D2R.tabs.affixes = { init, onActivate, onLangChange };
