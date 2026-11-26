import { APP_VERSION, APP_BUILD_TIME, APP_COMMIT } from "./build-info.js";

export const DASHBOARD_CSS_VERSION = "92154866f7";
export const DASHBOARD_JS_VERSION = "49850e8e55";
export const DASHBOARD_THEME_VERSION = "f096babd8b";
export const DASHBOARD_ASSET_VERSIONS = {
  "shared.js": "09528eb701",
  "i18n-dict.js": "f3ee8aa070",
  "core.js": "49850e8e55",
  "tab-runewords.js": "41b17b7067",
  "tab-affixes.js": "b44f2408f1",
  "tab-items.js": "7f0acfb51c",
  "tab-skills.js": "ac59827790"
};

function escapeSsrHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function serializeSafeJsonScript(val) {
  return JSON.stringify(val ?? null)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function renderDashboard(options = {}) {
  const initAuth = options && options.initialAuth ? options.initialAuth : null;
  const ssrUser = initAuth && initAuth.authenticated && initAuth.user ? initAuth.user : null;
  const ssrDisplayName = ssrUser
    ? (ssrUser.displayName || ssrUser.username || ssrUser.email || "已登录")
    : "";
  const ssrAvatarHtml = ssrUser
    ? (ssrUser.avatarUrl && ssrUser.avatarUrl.startsWith("https://")
      ? `<img class="auth-avatar" src="${escapeSsrHtml(ssrUser.avatarUrl)}" alt="" referrerpolicy="no-referrer">`
      : `<span class="auth-avatar-fallback" aria-hidden="true">${escapeSsrHtml(ssrDisplayName.trim().slice(0, 1).toUpperCase() || "D")}</span>`)
    : "👤";
  const ssrAuthBtnClass = ssrUser ? "auth-pill-btn logged-in" : "auth-pill-btn";
  const ssrAuthLabel = ssrUser ? escapeSsrHtml(ssrDisplayName) : "登录 / 云端存档";
  const ssrAuthDotHtml = ssrUser ? `<span class="auth-sync-dot" aria-hidden="true"></span>` : "";
  const ssrAdminVisible = Boolean((ssrUser && ssrUser.isAdmin) || (initAuth && initAuth.adminInitialized === false));
  const ssrAdminText = ssrUser && ssrUser.isAdmin ? "🛡 管理后台" : "🛡 初始化后台";
  const ssrCloudStatusText = ssrUser
    ? `☁ 已登录云端同步（${escapeSsrHtml(ssrDisplayName)}）`
    : "☁ 未登录（当前技能与装备仅保存在本机浏览器）";
  const ssrInitialAuthJson = serializeSafeJsonScript(initAuth);

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#100d0a">
  <meta name="robots" content="noindex">
  <title>暗黑 2 重置版 · 庇护之地实时战报</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <script src="/assets/theme-init.js?v=${DASHBOARD_THEME_VERSION}"></script>
  <link rel="stylesheet" href="/assets/dashboard.css?v=${DASHBOARD_CSS_VERSION}">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="icon" type="image/svg+xml" href="/images/ui/pwa-icon.svg">
  <meta name="theme-color" content="#090809">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="d2r-assets" content="${escapeSsrHtml(JSON.stringify(DASHBOARD_ASSET_VERSIONS))}">
  <meta name="app-version" content="${escapeSsrHtml(APP_VERSION)}">
</head>
<body>
  <main class="shell">
    <header class="hero">
      <svg class="hero-sigil" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <circle cx="50" cy="50" r="44"/>
        <circle cx="50" cy="50" r="34" stroke-dasharray="4 3"/>
        <polygon points="50,8 88,74 12,74"/>
        <polygon points="50,92 12,26 88,26"/>
        <circle cx="50" cy="50" r="10"/>
      </svg>
      <div>
        <p class="eyebrow">Diablo II: Resurrected · Sanctuary Live</p>
        <h1 data-i18n="heroTitle">暗黑 2 重置版 · 庇护之地</h1>
        <p class="subtitle" data-i18n="heroSubtitle">实时掌握恐怖地带异动与迪亚波罗克隆入侵进度 · 全 99 符文之语 · 词缀模拟 · 物品百科</p>
      </div>
      <div class="hero-right">
        <div class="status-line"><span class="dot" id="live-dot"></span><span id="checked-at">正在读取状态…</span></div>
        <div class="lang-switcher" id="lang-switcher" role="group" aria-label="语言切换">
          <button class="lang-btn active" data-lang="zhCN" type="button">简</button>
          <button class="lang-btn" data-lang="zhTW" type="button">繁</button>
          <button class="lang-btn" data-lang="enUS" type="button">EN</button>
        </div>
        <div class="theme-switcher" id="theme-switcher" role="group" aria-label="深浅外观切换">
          <button class="theme-btn active" type="button" data-theme-mode="auto" aria-pressed="true" title="跟随操作系统亮/暗外观自动切换"><span aria-hidden="true">🌓</span><span>跟随</span></button>
          <button class="theme-btn" type="button" data-theme-mode="dark" aria-pressed="false" title="深色模式（经典庇护所暗金）"><span aria-hidden="true">🌙</span><span>深色</span></button>
          <button class="theme-btn" type="button" data-theme-mode="light" aria-pressed="false" title="浅色模式（暖色羊皮纸高对比）"><span aria-hidden="true">☀</span><span>浅色</span></button>
        </div>
        <button class="settings-jump-btn alert-open-btn" id="alert-open-btn" type="button" title="设置个人恐怖地带与地表暗黑桌面通知 / 声音提醒">
          <span aria-hidden="true">🔔</span>
          <span id="alert-btn-label">个人提醒</span>
          <span class="alert-active-dot" id="alert-active-dot" style="display:none" aria-hidden="true"></span>
        </button>
        <button class="${ssrAuthBtnClass}" id="auth-open-btn" type="button" title="登录账号以在云端保存技能加点与装备配装">
          <span id="auth-pill-icon" aria-hidden="true">${ssrAvatarHtml}</span>
          <span class="auth-pill-name" id="auth-pill-label" data-no-sweep>${ssrAuthLabel}</span>${ssrAuthDotHtml}
        </button>
        <a class="settings-jump-btn" id="admin-entry-link" href="/admin" style="display:${ssrAdminVisible ? "inline-flex" : "none"};text-decoration:none" title="进入庇护之地管理后台（系统设置与用户管理）">${ssrAdminText}</a>
      </div>
    </header>

    <!-- 庇护之地常驻实时捷报栏 -->
    <section class="sanctuary-hud" id="sanctuary-hud" aria-label="实时战况速览">
      <button class="hud-pill" id="hud-tz-pill" type="button" title="点击切换到恐怖地带监控">
        <span class="hud-left">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e284db" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3c3 4 3 14 0 18M3 12c4-3 14-3 18 0"/><circle cx="12" cy="12" r="2.2" fill="#e284db"/></svg>
          <span class="hud-label" data-i18n="hudTzLabel">当前恐怖地带</span>
          <span class="hud-val" id="hud-tz-name">读取中…</span>
        </span>
        <span class="hud-badge tz" id="hud-tz-timer">--:--</span>
      </button>
      <button class="hud-pill" id="hud-dc-pill" type="button" title="点击切换到地表暗黑进度">
        <span class="hud-left">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f0b254" stroke-width="2" aria-hidden="true"><path d="M5 4c0 4 2 6 4 7l3-2 3 2c2-1 4-3 4-7"/><path d="M7 11v4l5 6 5-6v-4"/><circle cx="12" cy="14" r="1.5" fill="#da4b38" stroke="none"/></svg>
          <span class="hud-label" data-i18n="hudDcLabel">地表暗黑最高进度</span>
          <span class="hud-val" id="hud-dc-hot">读取中…</span>
        </span>
        <span class="hud-badge" id="hud-dc-level">-/6</span>
      </button>
      <div class="hud-shortcuts" aria-hidden="true">
        <span data-i18n="shortcutPrefix">快捷:</span>
        <span class="kbd-mini">1</span>–<span class="kbd-mini">6</span><span data-i18n="shortcutTabs">切页</span>
        <span class="kbd-mini">/</span><span data-i18n="shortcutSearch">搜词条</span>
      </div>
    </section>

    <!-- 顶级 Tab 导航栏 -->
    <nav class="main-nav-tabs" role="tablist" aria-label="核心战报导航">
      <button class="main-nav-tab tab-terror active" id="main-tab-terror" role="tab" aria-selected="true" aria-controls="main-panel-terror" type="button">
        <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18M3 12a9 9 0 0 1 18 0"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/></svg>
        <span data-i18n="tabTerror">恐怖地带</span>
        <span class="tab-kbd">1</span>
      </button>
      <button class="main-nav-tab tab-dclone" id="main-tab-dclone" role="tab" aria-selected="false" aria-controls="main-panel-dclone" type="button">
        <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 4c0 4 2 6 4 7l3-2 3 2c2-1 4-3 4-7"/><path d="M7 11v4l5 6 5-6v-4"/><circle cx="12" cy="14" r="1.6" fill="currentColor" stroke="none"/></svg>
        <span data-i18n="tabDclone">地表暗黑</span>
        <span class="tab-kbd">2</span>
      </button>
      <button class="main-nav-tab tab-runewords" id="main-tab-runewords" role="tab" aria-selected="false" aria-controls="main-panel-runewords" type="button">
        <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 3h10l4 4v14H6z"/><path d="M16 3v4h4"/><path d="M10 11l4 4m0-4l-4 4m2-5v6"/></svg>
        <span data-i18n="tabRunewords">符文之语/记事</span>
        <span class="tab-kbd">3</span>
      </button>
      <button class="main-nav-tab tab-affixes" id="main-tab-affixes" role="tab" aria-selected="false" aria-controls="main-panel-affixes" type="button">
        <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="12,2 21,9 12,22 3,9"/><path d="M3 9h18M12 2v20"/></svg>
        <span data-i18n="tabAffixes">物品词缀</span>
        <span class="tab-kbd">4</span>
      </button>
      <button class="main-nav-tab tab-items" id="main-tab-items" role="tab" aria-selected="false" aria-controls="main-panel-items" type="button">
        <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M12 7v10M8 11h8"/></svg>
        <span data-i18n="tabItems">物品资讯</span>
        <span class="tab-kbd">5</span>
      </button>
      <button class="main-nav-tab tab-skills" id="main-tab-skills" role="tab" aria-selected="false" aria-controls="main-panel-skills" type="button">
        <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3l3 6 6 1-4.5 4.2 1.1 6.3L12 17.5 6.4 20.5l1.1-6.3L3 10l6-1z"/></svg>
        <span data-i18n="tabSkills">技能模拟</span>
        <span class="tab-kbd">6</span>
      </button>
    </nav>

    <!-- Tab 面板 1：恐怖地带 (Terror Zone) -->
    <div class="main-tab-panel active" id="main-panel-terror" role="tabpanel" aria-labelledby="main-tab-terror">
      <section class="module-block terror-module" aria-label="恐怖地带">
        <div class="module-header">
          <div class="module-title-wrap">
            <span class="module-tag terror-tag">TERROR ZONE</span>
            <h2 class="module-title" data-i18n="tzModuleTitle">恐怖地带监控</h2>
          </div>
          <div class="module-meta">
            <span data-i18n="tzModuleMeta">区域每 30 分钟切换 · 常见免疫与掉落速查</span>
          </div>
        </div>
        <div class="terror-overview" aria-label="恐怖区域">
          <article class="terror-card">
            <div class="terror-label"><img class="ui-chip-icon" src="/images/ui/joingame_desecratedindicator.webp" alt=""><span data-i18n="tzCurrentLabel">当前恐怖区域</span></div>
            <div class="terror-name" id="terror-current">正在读取…</div>
            <div class="terror-original" id="terror-current-original"></div>
            <div class="terror-details" id="terror-current-details"></div>
            <div class="terror-meta"><span id="terror-updated"></span><span class="terror-countdown" id="terror-countdown"></span></div>
            <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
              <button type="button" class="rw-btn" id="tz-jump-drops-btn"><img class="ui-chip-icon" src="/images/items/misc/shard/mote_of_anguish.webp" alt="">当前 TZ 首领 / 金怪掉率速查</button>
              <button type="button" class="rw-btn" id="tz-alert-shortcut-btn" style="border-color:rgba(245,207,123,0.45);color:#ffe08c">🔔 设置 TZ / 地表暗黑个人提醒</button>
            </div>
          </article>
          <article class="terror-card next">
            <div class="terror-label"><img class="ui-chip-icon" src="/images/ui/icon_desecrated.webp" alt=""><span data-i18n="tzNextLabel">下一阶段恐怖区域</span></div>
            <div class="terror-name" id="terror-next">正在读取…</div>
            <div class="terror-original" id="terror-next-original"></div>
            <div class="terror-details" id="terror-next-details"></div>
            <div class="terror-meta"><span>整点、半点同步数据</span><span>区域每 30 分钟切换</span></div>
          </article>
        </div>

        <!-- 恐怖地带全图鉴与历史记录查询面板 -->
        <div class="tz-directory-section">
          <button class="tz-directory-toggle" id="tz-toggle-panel" type="button" aria-expanded="false">
            <span class="tz-toggle-title"><img class="ui-chip-icon" src="/images/items/misc/quest/book_of_skill.webp" alt="">恐怖地带全图鉴与历史记录查询</span>
            <span class="tz-toggle-arrow" id="tz-toggle-icon">▼ 展开查询</span>
          </button>
          <div class="tz-directory-body" id="tz-directory-body" style="display:none">
            <div class="tz-tabs">
              <button class="tz-tab active" id="tab-btn-catalog" data-tz-tab="catalog" type="button"><img class="ui-chip-icon" src="/images/items/misc/quest/scroll_of_horadric_quest_info.webp" alt="">全部区域图鉴 (<span id="tz-catalog-count">37</span>)</button>
              <button class="tz-tab" id="tab-btn-history" data-tz-tab="history" type="button"><img class="ui-chip-icon" src="/images/ui/icon_desecrated.webp" alt="">轮换历史记录 (<span id="tz-history-count">0</span>)</button>
            </div>

            <div class="tz-filter-bar">
              <div class="tz-search-wrap">
                <input type="text" id="tz-search-input" class="tz-search-input" placeholder="🔍 搜索区域名称 / 英文 / 关键字..." />
                <button id="tz-search-clear" class="tz-clear-btn" style="display:none" type="button">×</button>
              </div>
              <div class="tz-filter-row">
                <div class="tz-filter-label">幕数：</div>
                <div class="tz-chips" id="tz-act-chips">
                  <button class="tz-chip active" data-act="all" type="button">全部幕</button>
                  <button class="tz-chip" data-act="1" type="button">第 1 幕</button>
                  <button class="tz-chip" data-act="2" type="button">第 2 幕</button>
                  <button class="tz-chip" data-act="3" type="button">第 3 幕</button>
                  <button class="tz-chip" data-act="4" type="button">第 4 幕</button>
                  <button class="tz-chip" data-act="5" type="button">第 5 幕</button>
                </div>
              </div>
              <div class="tz-filter-row">
                <div class="tz-filter-label">评级：</div>
                <div class="tz-chips" id="tz-rating-chips">
                  <button class="tz-chip active" data-rating="all" type="button">全部评级</button>
                  <button class="tz-chip" data-rating="S" type="button">S 极佳</button>
                  <button class="tz-chip" data-rating="A" type="button">A 优秀</button>
                  <button class="tz-chip" data-rating="B" type="button">B 良好</button>
                  <button class="tz-chip" data-rating="C" type="button">C 一般</button>
                  <button class="tz-chip" data-rating="F" type="button">F 较差</button>
                </div>
              </div>
              <div class="tz-filter-row">
                <div class="tz-filter-label">免疫：</div>
                <div class="tz-chips" id="tz-immunity-chips">
                  <button class="tz-chip active" data-immunity="all" type="button">全部</button>
                  <button class="tz-chip" data-immunity="f" type="button"><img class="ui-chip-icon" src="/images/ui/immune_fire.webp" alt="">火焰</button>
                  <button class="tz-chip" data-immunity="c" type="button"><img class="ui-chip-icon" src="/images/ui/immune_ice.webp" alt="">冰冷</button>
                  <button class="tz-chip" data-immunity="l" type="button"><img class="ui-chip-icon" src="/images/ui/immune_lightning.webp" alt="">闪电</button>
                  <button class="tz-chip" data-immunity="p" type="button"><img class="ui-chip-icon" src="/images/ui/immune_poison.webp" alt="">毒素</button>
                  <button class="tz-chip" data-immunity="ph" type="button"><img class="ui-chip-icon" src="/images/ui/immune_physical.webp" alt="">物理</button>
                  <button class="tz-chip" data-immunity="m" type="button"><img class="ui-chip-icon" src="/images/ui/immune_magic.webp" alt="">魔法</button>
                </div>
              </div>
            </div>

            <div id="tz-catalog-view" class="tz-tab-view">
              <div class="tz-grid" id="tz-catalog-grid">正在加载恐怖地带图鉴...</div>
            </div>
            <div id="tz-history-view" class="tz-tab-view" style="display:none">
              <div class="tz-history-list" id="tz-history-container">暂无历史轮换记录</div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Tab 面板 2：地表暗黑 (Diablo Clone) -->
    <div class="main-tab-panel" id="main-panel-dclone" role="tabpanel" aria-labelledby="main-tab-dclone">
      <section class="module-block dclone-module" aria-label="地表暗黑">
        <div class="module-header">
          <div class="module-title-wrap">
            <span class="module-tag dclone-tag">DIABLO CLONE</span>
            <h2 class="module-title" data-i18n="dcModuleTitle">地表暗黑进度</h2>
          </div>
          <div class="module-meta">
            <span data-i18n="dcModuleMeta">覆盖 2 DLC · 24 组服务器进度实时监控</span>
          </div>
        </div>

        <div class="toolbar" aria-label="状态筛选">
          <div class="toolbar-left">
            <div class="filters">
              <button class="filter active" data-min="1" data-i18n="dcFilterAll">全部状态</button>
              <button class="filter" data-min="4" data-i18n="dcFilter4">4 阶以上</button>
              <button class="filter" data-min="5" data-i18n="dcFilter5">5 阶以上</button>
            </div>
            <div class="legend">
              <span style="--level:#777" data-i18n="dcLeg13">1–3 平稳</span>
              <span style="--level:#d5a748" data-i18n="dcLeg4">4 警戒</span>
              <span style="--level:#e97832" data-i18n="dcLeg5">5 临近</span>
              <span style="--level:#da4b38" data-i18n="dcLeg6">6 已触发</span>
            </div>
          </div>
          <button class="refresh" id="refresh" data-i18n="dcRefreshBtn">刷新页面数据</button>
        </div>

        <div id="content"><div class="empty">正在加载 24 种服务器状态…</div></div>
      </section>
    </div>

    <!-- Tab 面板 3：符文之语 100% 记事 (Runewords 100%) -->
    <div class="main-tab-panel" id="main-panel-runewords" role="tabpanel" aria-labelledby="main-tab-runewords">
      <section class="module-block runewords-module" aria-label="符文之语 100% 记事">
        <div class="module-header">
          <div class="module-title-wrap">
            <span class="module-tag runewords-tag">RUNEWORDS 100%</span>
            <h2 class="module-title" data-i18n="rwModuleTitle">符文之语 100% 记事与符文统计</h2>
          </div>
          <div class="module-meta">
            <span>D2R 3.4 术士君临全 99 种符文之语 · 区分非赛/赛季模式 · 跨底材去重统计</span>
          </div>
        </div>

        <div class="rw-summary-card">
          <div class="rw-summary-top">
            <div class="rw-stats">
              <span class="rw-stat">完成进度 <strong class="rw-accent" id="rw-completed-count">0</strong> / <span id="rw-total-count">99</span> (<span id="rw-progress-pct">0%</span>)</span>
              <span class="rw-stat">100% 总需符文 <strong id="rw-total-runes">0</strong> 颗</span>
              <span class="rw-stat">剩余还需符文 <strong class="rw-gold" id="rw-remaining-runes">0</strong> 颗</span>
            </div>
            <div class="rw-actions">
              <button class="rw-btn" id="rw-cloud-sync-btn" type="button" title="符文之语打卡进度随账号自动云端同步">${ssrUser ? "☁ 符文已云端同步" : "☁ 登录云端同步"}</button>
              <button class="rw-btn" id="rw-toggle-needed-only" type="button">仅看有剩余需求的符文</button>
              <button class="rw-btn rw-btn-danger" id="rw-reset-progress" type="button">重置已勾选</button>
            </div>
          </div>
          <div class="rw-progress-track" aria-label="符文之语完成进度条">
            <div class="rw-progress-fill" id="rw-progress-fill"></div>
          </div>
        </div>

        <div class="rw-rune-section">
          <div class="rw-section-head">
            <h3 class="rw-section-title">33 颗符文需求统计（点击符文可多选筛选对应符文之语）</h3>
            <div style="display:flex;align-items:center;gap:8px">
              <span class="rw-section-sub" id="rw-selected-rune-hint">当前匹配 99 个符文之语</span>
              <button class="rw-btn" id="rw-clear-runes-btn" type="button" style="display:none;padding:3px 9px;font-size:11px">清空已选符文</button>
            </div>
          </div>
          <div class="rw-rune-grid" id="rw-rune-grid">正在加载符文统计…</div>
        </div>

        <div class="rw-filter-bar">
          <div class="tz-search-wrap">
            <input type="text" id="rw-search-input" class="tz-search-input" placeholder="🔍 搜索符文之语中文 / 英文 / 符文名称（如 谜团、Enigma、Ber）..." />
            <button id="rw-search-clear" class="tz-clear-btn" style="display:none" type="button">×</button>
          </div>
          <div class="tz-filter-row">
            <div class="tz-filter-label">状态：</div>
            <div class="tz-chips" id="rw-status-chips">
              <button class="tz-chip active" data-rw-status="all" type="button">全部</button>
              <button class="tz-chip" data-rw-status="todo" type="button">未完成</button>
              <button class="tz-chip" data-rw-status="done" type="button">已完成</button>
            </div>
          </div>
          <div class="tz-filter-row">
            <div class="tz-filter-label">底材：</div>
            <div class="tz-chips" id="rw-type-chips">
              <button class="tz-chip active" data-rw-type="all" type="button">全部类型</button>
              <button class="tz-chip" data-rw-type="weapon" type="button"><img class="ui-chip-icon" src="/images/items/weapon/axe/war_axe.webp" alt="">全部武器</button>
              <button class="tz-chip" data-rw-type="armor" type="button"><img class="ui-chip-icon" src="/images/items/armor/armor/ancient_armor.webp" alt="">盔甲</button>
              <button class="tz-chip" data-rw-type="helm" type="button"><img class="ui-chip-icon" src="/images/items/armor/helmet/crown.webp" alt="">头盔</button>
              <button class="tz-chip" data-rw-type="shield" type="button"><img class="ui-chip-icon" src="/images/items/armor/shield/kite_shield.webp" alt="">盾牌</button>
              <button class="tz-chip" data-rw-type="sword" type="button"><img class="ui-chip-icon" src="/images/items/weapon/sword/crystal_sword.webp" alt="">剑</button>
              <button class="tz-chip" data-rw-type="axe" type="button"><img class="ui-chip-icon" src="/images/items/weapon/axe/war_axe.webp" alt="">斧</button>
              <button class="tz-chip" data-rw-type="polearm" type="button"><img class="ui-chip-icon" src="/images/items/weapon/polearm/halberd.webp" alt="">长柄</button>
              <button class="tz-chip" data-rw-type="spear" type="button"><img class="ui-chip-icon" src="/images/items/weapon/spear/pike.webp" alt="">矛</button>
              <button class="tz-chip" data-rw-type="mace_hammer" type="button"><img class="ui-chip-icon" src="/images/items/weapon/mace/flail.webp" alt="">锤/钉锤/权杖</button>
              <button class="tz-chip" data-rw-type="bow_xbow" type="button"><img class="ui-chip-icon" src="/images/items/weapon/bow/reflex_bow.webp" alt="">弓/弩</button>
              <button class="tz-chip" data-rw-type="staff" type="button"><img class="ui-chip-icon" src="/images/items/weapon/staff/war_staff.webp" alt="">双手法杖</button>
              <button class="tz-chip" data-rw-type="wand" type="button"><img class="ui-chip-icon" src="/images/items/weapon/wand/bone_wand.webp" alt="">死灵法杖</button>
              <button class="tz-chip" data-rw-type="claw" type="button"><img class="ui-chip-icon" src="/images/items/weapon/h2h/claws.webp" alt="">刺客爪</button>
              <button class="tz-chip" data-rw-type="dagger" type="button"><img class="ui-chip-icon" src="/images/items/weapon/knife/kriss.webp" alt="">匕首</button>
              <button class="tz-chip" data-rw-type="pal_shield" type="button"><img class="ui-chip-icon" src="/images/items/armor/shield/heraldic_shield.webp" alt="">圣骑士盾</button>
              <button class="tz-chip" data-rw-type="nec_shield" type="button"><img class="ui-chip-icon" src="/images/items/armor/voodoo_head/preserved_head.webp" alt="">死灵盾</button>
              <button class="tz-chip" data-rw-type="grimoire" type="button"><img class="ui-chip-icon" src="/images/items/misc/book/identify_book.webp" alt="">术士魔典</button>
              <button class="tz-chip" data-rw-type="druid_helm" type="button"><img class="ui-chip-icon" src="/images/items/armor/pelt/wolf_head.webp" alt="">德鲁伊头</button>
            </div>
          </div>
          <div class="tz-filter-row">
            <div class="tz-filter-label">孔数：</div>
            <div class="tz-chips" id="rw-socket-chips">
              <button class="tz-chip active" data-rw-socket="all" type="button">全部孔数</button>
              <button class="tz-chip" data-rw-socket="2" type="button">2 孔</button>
              <button class="tz-chip" data-rw-socket="3" type="button">3 孔</button>
              <button class="tz-chip" data-rw-socket="4" type="button">4 孔</button>
              <button class="tz-chip" data-rw-socket="5" type="button">5 孔</button>
              <button class="tz-chip" data-rw-socket="6" type="button">6 孔</button>
            </div>
          </div>
          <div class="tz-filter-row">
            <div class="tz-filter-label">模式：</div>
            <div class="tz-chips" id="rw-mode-chips">
              <button class="tz-chip active" data-rw-mode="all" type="button">全部模式</button>
              <button class="tz-chip" data-rw-mode="universal" type="button">非赛/赛季通用</button>
              <button class="tz-chip" data-rw-mode="unlocked" type="button">非赛已解锁 (原2.6赛季)</button>
              <button class="tz-chip" data-rw-mode="ladder-rework" type="button">3.4 赛季/离线重做</button>
              <button class="tz-chip" data-rw-mode="rotw" type="button">术士君临 DLC</button>
            </div>
          </div>
          <div class="tz-filter-row">
            <div class="tz-filter-label">版本：</div>
            <div class="tz-chips" id="rw-patch-chips">
              <button class="tz-chip active" data-rw-patch="all" type="button">全部版本</button>
              <button class="tz-chip" data-rw-patch="classic" type="button">经典 1.09–1.11</button>
              <button class="tz-chip" data-rw-patch="2.4" type="button">2.4</button>
              <button class="tz-chip" data-rw-patch="2.6" type="button">2.6</button>
              <button class="tz-chip" data-rw-patch="RotW" type="button">术士君临</button>
            </div>
          </div>
        </div>

        <div class="rw-list" id="rw-list">正在加载符文之语清单…</div>
      </section>
    </div>

    <!-- Tab 面板 4：蓝/黄/橙物品词缀范围 (Affixes) -->
    <div class="main-tab-panel" id="main-panel-affixes" role="tabpanel" aria-labelledby="main-tab-affixes">
      <section class="module-block affixes-module" aria-label="魔法亮金手工物品词缀范围">
        <div class="module-header">
          <div class="module-title-wrap">
            <span class="module-tag affixes-tag">ITEM AFFIXES</span>
            <h2 class="module-title" data-i18n="afModuleTitle">魔法 / 亮金 / 手工物品词缀范围与模拟</h2>
          </div>
          <div class="module-meta">
            <span data-i18n="afModuleMeta">蓝装极限 · 黄装多词缀 · 橙装固定配方与词缀模拟器</span>
          </div>
        </div>

        <div class="af-subtabs" role="tablist" aria-label="词缀功能切换">
          <button class="af-subtab active" id="af-subtab-ref" data-af-subtab="ref" type="button"><img class="ui-tab-icon" src="/images/items/misc/quest/lam_esens_tome.webp" alt=""><span data-i18n="afSubRef">词缀范围与配方速查</span></button>
          <button class="af-subtab" id="af-subtab-sim" data-af-subtab="sim" type="button"><img class="ui-tab-icon" src="/images/items/misc/quest/horadric_cube.webp" alt=""><span data-i18n="afSubSim">物品词缀模拟器</span></button>
        </div>

        <div id="af-view-ref">
          <div class="af-rules-grid" id="af-rules-grid">正在加载词缀规则…</div>

        <button class="af-craft-toggle" id="af-craft-toggle" type="button" aria-expanded="false">
          <span><img class="ui-chip-icon" src="/images/items/misc/quest/horadric_cube.webp" alt="">手工物品（橙装）核心配方与固定属性速查</span>
          <span id="af-craft-arrow">▼ 展开配方</span>
        </button>
        <div class="af-craft-body" id="af-craft-body" style="display:none">
          <p class="af-craft-formula-tip">💡 通用合成公式：<strong>蓝色底材 + 任意珠宝 + 指定符文 + 指定完美宝石</strong>。输出物品等级 <code>ilvl = floor(角色等级/2) + floor(底材ilvl/2)</code>；洗 2 技能橙色项链建议 <strong>≥93 级</strong> 赌博蓝项链直接洗（确保 ilvl ≥ 90）。</p>
          <div class="af-craft-grid" id="af-craft-grid"></div>
        </div>

        <div class="af-filter-bar">
          <div class="tz-search-wrap">
            <input type="text" id="af-search-input" class="tz-search-input" placeholder="🔍 搜索词缀名称 / 英文 / 属性（如 FCR、全抗、30、愚人、45 生命、40/15）..." />
            <button id="af-search-clear" class="tz-clear-btn" style="display:none" type="button">×</button>
          </div>
          <div class="tz-filter-row">
            <div class="tz-filter-label">部位：</div>
            <div class="tz-chips" id="af-slot-chips">
              <button class="tz-chip active" data-af-slot="all" type="button">全部部位</button>
            </div>
          </div>
          <div class="tz-filter-row">
            <div class="tz-filter-label">品质：</div>
            <div class="tz-chips" id="af-quality-chips">
              <button class="tz-chip active" data-af-quality="all" type="button">全部品质</button>
              <button class="tz-chip" data-af-quality="magic" type="button"><img class="ui-chip-icon" src="/images/items/misc/gem/perfect_saphire.webp" alt="">仅蓝装专属/极限</button>
              <button class="tz-chip" data-af-quality="rare" type="button"><img class="ui-chip-icon" src="/images/items/misc/gem/perfect_topaz.webp" alt="">黄/橙极限</button>
              <button class="tz-chip" data-af-quality="crafted" type="button"><img class="ui-chip-icon" src="/images/items/misc/gem/perfect_amethyst.webp" alt="">橙装固定词缀</button>
              <button class="tz-chip" data-af-quality="generic" type="button">蓝/黄/橙通用</button>
            </div>
          </div>
          <div class="tz-filter-row">
            <div class="tz-filter-label">类型：</div>
            <div class="tz-chips" id="af-type-chips">
              <button class="tz-chip active" data-af-type="all" type="button">全部词缀</button>
              <button class="tz-chip" data-af-type="prefix" type="button">前缀 (Prefix)</button>
              <button class="tz-chip" data-af-type="suffix" type="button">后缀 (Suffix)</button>
              <button class="tz-chip" data-af-type="crafted" type="button">手工固定 (Crafted)</button>
            </div>
          </div>
        </div>

        <div class="af-list" id="af-list">正在加载词缀范围…</div>
        </div>

        <!-- 物品词缀模拟器视图 -->
        <div id="af-view-sim" style="display:none">
          <div class="sim-controls">
            <div class="sim-row">
              <label class="sim-field">
                <span>装备底材</span>
                <select class="sim-select" id="sim-base-select"></select>
              </label>
              <div class="sim-field">
                <span>品质</span>
                <div class="tz-chips" id="sim-quality-chips">
                  <button class="tz-chip" data-sim-quality="magic" type="button"><img class="ui-chip-icon" src="/images/items/misc/gem/perfect_saphire.webp" alt="">魔法 (蓝)</button>
                  <button class="tz-chip active" data-sim-quality="rare" type="button"><img class="ui-chip-icon" src="/images/items/misc/gem/perfect_topaz.webp" alt="">亮金 (黄)</button>
                  <button class="tz-chip" data-sim-quality="crafted" type="button"><img class="ui-chip-icon" src="/images/items/misc/gem/perfect_amethyst.webp" alt="">手工 (橙)</button>
                  <button class="tz-chip" data-sim-quality="unique" type="button" style="display:none"><img class="ui-chip-icon" src="/images/items/misc/body_part/fragment_fire.webp" alt="">暗金 (含3.4新珠宝)</button>
                </div>
              </div>
            </div>

            <div class="sim-row" id="sim-unique-opts" style="display:none">
              <label class="sim-field" style="flex:1">
                <span>暗金珠宝模板（含 D2R 3.4 术士君临新增 6 颗巨型暗金珠宝 + 彩虹刻面）</span>
                <select class="sim-select" id="sim-unique-select"></select>
              </label>
            </div>

            <div class="sim-row" id="sim-standard-lvls">
              <label class="sim-field">
                <span>物品等级 (ilvl)</span>
                <input type="number" class="sim-num-input" id="sim-ilvl-input" min="1" max="99" value="85">
              </label>
              <div class="tz-chips" id="sim-ilvl-presets">
                <button class="tz-chip" data-sim-ilvl="45" type="button">45 噩梦</button>
                <button class="tz-chip" data-sim-ilvl="71" type="button">71 满4词缀</button>
                <button class="tz-chip active" data-sim-ilvl="85" type="button">85 场景</button>
                <button class="tz-chip" data-sim-ilvl="90" type="button">90 赌博/技能</button>
                <button class="tz-chip" data-sim-ilvl="99" type="button">99 巴尔/TZ</button>
              </div>
            </div>

            <div class="sim-row" id="sim-craft-opts" style="display:none">
              <label class="sim-field">
                <span>手工配方</span>
                <select class="sim-select" id="sim-craft-recipe"></select>
              </label>
              <label class="sim-field">
                <span>人物等级 (clvl)</span>
                <input type="number" class="sim-num-input" id="sim-clvl-input" min="1" max="99" value="93">
              </label>
              <label class="sim-field">
                <span>底材 ilvl</span>
                <input type="number" class="sim-num-input" id="sim-craft-ilvl-input" min="1" max="99" value="88">
              </label>
            </div>

            <div class="sim-status-bar">
              <div class="sim-status-metrics">
                <span>成品 ilvl：<strong id="sim-out-ilvl">85</strong></span>
                <span>可用词缀等级 alvl：<strong id="sim-out-alvl">85</strong></span>
                <span>词缀上限：<strong id="sim-out-limit">最多 3 前缀 + 3 后缀</strong></span>
              </div>
              <div class="rw-actions">
                <button class="rw-btn active" id="sim-roll-btn" type="button"><img class="ui-chip-icon" src="/images/items/misc/quest/horadric_cube.webp" alt="">随机 Roll 一次</button>
                <button class="rw-btn" id="sim-clear-btn" type="button">清空已选</button>
              </div>
            </div>
          </div>

          <div class="sim-workspace">
            <div class="sim-pools">
              <div class="sim-pool">
                <div class="sim-pool-head">
                  <span>可选前缀 (Prefixes)</span>
                  <span id="sim-prefix-count">0 / 3</span>
                </div>
                <div class="sim-pool-list" id="sim-prefix-list"></div>
              </div>
              <div class="sim-pool">
                <div class="sim-pool-head">
                  <span>可选后缀 (Suffixes)</span>
                  <span id="sim-suffix-count">0 / 3</span>
                </div>
                <div class="sim-pool-list" id="sim-suffix-list"></div>
              </div>
            </div>

            <aside class="sim-preview-card q-rare" id="sim-preview-card" aria-label="模拟物品预览">
              <div class="sim-preview-head">
                <img class="sim-preview-thumb" id="sim-preview-icon" src="/images/items/misc/ring/ring1.webp" alt="" />
                <div>
                  <h3 class="sim-item-name" id="sim-preview-title" style="margin:0">亮金戒指</h3>
                  <div class="sim-item-sub" id="sim-preview-sub" style="margin:2px 0 0">ilvl 85 · alvl 85 · 已选 0 条随机词缀</div>
                </div>
              </div>
              <ul class="sim-item-lines" id="sim-preview-lines">
                <li style="color:var(--muted)">请从左侧点选前缀/后缀，或点击「随机 Roll 一次」</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </div>

    <!-- Tab 面板 5：物品资讯百科 (Base / Magic / Rare / Set / Unique) -->
    <div class="main-tab-panel" id="main-panel-items" role="tabpanel" aria-labelledby="main-tab-items">
      <section class="module-block items-module" aria-label="物品资讯百科">
        <div class="module-header">
          <div class="module-title-wrap">
            <span class="module-tag items-tag">ITEM DATABASE</span>
            <h2 class="module-title" data-i18n="itModuleTitle">物品资讯百科（基础 / 蓝黄 / 绿装 / 暗金）</h2>
          </div>
          <div class="module-meta">
            <span data-i18n="itModuleMeta">参考 d2r.world · 适配 D2R 3.4 术士君临版本</span>
          </div>
        </div>

        <div class="grail-summary-card" id="it-grail-summary">
          <div class="rw-summary-top">
            <div class="rw-stats">
              <span class="rw-stat-item"><img class="ui-chip-icon" src="/images/items/misc/quest/mephisto_soul_stone.webp" alt="">圣杯总进度 <strong class="rw-accent" id="grail-total-done">0</strong> / <span id="grail-total-all">534</span> (<span id="grail-total-pct">0%</span>)</span>
              <span class="rw-stat-sep">|</span>
              <span class="rw-stat-item">暗金装备 <strong class="rw-gold" id="grail-unique-done">0</strong> / <span id="grail-unique-all">399</span></span>
              <span class="rw-stat-sep">|</span>
              <span class="rw-stat-item">套装部件 <strong style="color:#67e87a" id="grail-set-done">0</strong> / <span id="grail-set-all">135</span>（整套 <strong style="color:#67e87a" id="grail-fullset-done">0</strong> / <span id="grail-fullset-all">34</span>）</span>
              <span class="rw-stat-sep">|</span>
              <span class="rw-stat-item">TC87 毕业稀有 <strong style="color:#a7d8ff" id="grail-tc87-done">0</strong> / <span id="grail-tc87-all">0</span></span>
            </div>
            <div class="rw-actions">
              <button class="rw-btn" id="grail-cloud-sync-btn" type="button" title="圣杯收集进度随账号自动云端同步">${ssrUser ? "☁ 圣杯已云端同步" : "☁ 登录云端同步"}</button>
              <button class="rw-btn" id="grail-export-btn" type="button">导出圣杯存档</button>
              <button class="rw-btn" id="grail-import-btn" type="button">导入圣杯存档</button>
              <input type="file" id="grail-import-file" accept=".json,application/json" style="display:none" />
              <button class="rw-btn rw-btn-danger" id="grail-reset-btn" type="button">重置圣杯</button>
            </div>
          </div>
          <div class="rw-progress-track">
            <div class="rw-progress-fill" id="grail-progress-fill" style="width: 0%"></div>
          </div>
        </div>

        <div class="it-subtabs" id="it-subtabs" role="tablist" aria-label="物品资讯分类">
          <button class="it-subtab active" data-it-tab="base" type="button"><img class="ui-tab-icon" src="/images/ui/gemsocket.webp" alt=""><span data-i18n="itTabBase">基础底材</span></button>
          <button class="it-subtab" data-it-tab="magicRare" type="button"><img class="ui-tab-icon" src="/images/items/armor/circlet/diadem.webp" alt=""><span data-i18n="itTabMagicRare">蓝/黄极品</span></button>
          <button class="it-subtab" data-it-tab="set" type="button"><img class="ui-tab-icon" src="/images/items/armor/helmet/horazons_countenance.webp" alt=""><span data-i18n="itTabSet">绿色套装</span></button>
          <button class="it-subtab" data-it-tab="unique" type="button"><img class="ui-tab-icon" src="/images/items/misc/quest/mephisto_soul_stone.webp" alt=""><span data-i18n="itTabUnique">暗金装备</span></button>
          <button class="it-subtab" data-it-tab="cube" type="button"><img class="ui-tab-icon" src="/images/items/misc/quest/horadric_cube.webp" alt=""><span data-i18n="itTabCube">方块公式</span></button>
          <button class="it-subtab" data-it-tab="drops" type="button"><img class="ui-tab-icon" src="/images/items/misc/shard/mote_of_anguish.webp" alt=""><span data-i18n="itTabDrops">掉率计算器</span></button>
        </div>

        <div class="rw-filter-bar" style="margin-bottom:14px">
          <div class="tz-search-wrap">
            <input type="text" id="it-search-input" class="tz-search-input" placeholder="🔍 搜索物品中文 / 英文 / 属性 / 用途（如 统盾、军帽、塔拉夏、3.4）..." />
            <button id="it-search-clear" class="tz-clear-btn" style="display:none" type="button">×</button>
          </div>
          <div class="tz-filter-row" id="it-subfilter-row">
            <div class="tz-filter-label">筛选：</div>
            <div class="tz-chips" id="it-subfilter-chips"></div>
          </div>
          <div class="tz-filter-row" id="it-base-subtype-row">
            <div class="tz-filter-label">细分：</div>
            <div class="tz-chips" id="it-base-subtype-chips"></div>
          </div>
          <div class="tz-filter-row" id="it-grail-filter-row" style="display:none;flex-wrap:wrap;gap:8px 14px">
            <div class="tz-filter-label">圣杯：</div>
            <div class="tz-chips" id="it-grail-chips">
              <button type="button" class="tz-chip active" data-grail-filter="all">全部状态</button>
              <button type="button" class="tz-chip" data-grail-filter="todo">未收集</button>
              <button type="button" class="tz-chip" data-grail-filter="done">已收集</button>
              <button type="button" class="tz-chip" data-grail-filter="tc87">仅看 TC87 毕业稀有</button>
            </div>
            <div class="tz-filter-label" id="it-unique-tier-label" style="display:none;margin-left:4px">阶梯：</div>
            <div class="tz-chips" id="it-unique-tier-chips" style="display:none">
              <button type="button" class="tz-chip active" data-it-utier="all">全部</button>
              <button type="button" class="tz-chip" data-it-utier="普通">普通</button>
              <button type="button" class="tz-chip" data-it-utier="扩展">扩展</button>
              <button type="button" class="tz-chip" data-it-utier="精华">精华</button>
              <button type="button" class="tz-chip" data-it-utier="独特">独特(戒指/链/符/珠)</button>
            </div>
            <span id="it-unique-count-badge" style="display:none;font-size:11.5px;color:var(--muted);margin-left:auto"></span>
          </div>
          <div class="tz-filter-row" id="it-base-sockets-row" style="flex-wrap:wrap;gap:8px 14px">
            <div class="tz-filter-label">孔数：</div>
            <div class="tz-chips" id="it-base-sockets-chips">
              <button type="button" class="tz-chip active" data-it-sock="all">全部孔数</button>
              <button type="button" class="tz-chip" data-it-sock="2">可出 2 孔</button>
              <button type="button" class="tz-chip" data-it-sock="3">可出 3 孔</button>
              <button type="button" class="tz-chip" data-it-sock="4">可出 4 孔</button>
              <button type="button" class="tz-chip" data-it-sock="5">可出 5 孔</button>
              <button type="button" class="tz-chip" data-it-sock="6">可出 6 孔</button>
              <button type="button" class="tz-chip" data-it-sock="0">不可打孔</button>
            </div>
            <div class="tz-filter-label" style="margin-left:4px">阶梯：</div>
            <div class="tz-chips" id="it-base-tier-chips">
              <button type="button" class="tz-chip active" data-it-tier="all">全部</button>
              <button type="button" class="tz-chip" data-it-tier="普通">普通</button>
              <button type="button" class="tz-chip" data-it-tier="扩展">扩展</button>
              <button type="button" class="tz-chip" data-it-tier="精华">精华</button>
            </div>
            <span id="it-base-count-badge" style="font-size:11.5px;color:var(--muted);margin-left:auto"></span>
          </div>
          <div id="it-drops-console" style="display:none;flex-direction:column;gap:10px">
            <div class="tz-filter-row" style="flex-wrap:wrap;gap:10px">
              <div class="tz-filter-label">模式：</div>
              <div class="tz-chips" id="dc-mode-chips">
                <button type="button" class="tz-chip active" data-dc-mode="source">按首领 / 恐怖地带查掉落榜</button>
                <button type="button" class="tz-chip" data-dc-mode="item">按指定物品查最佳首领排行</button>
              </div>
              <button type="button" class="rw-btn" id="dc-sync-tz-btn"><img class="ui-chip-icon" src="/images/ui/joingame_desecratedindicator.webp" alt="">联动当前恐怖地带</button>
            </div>
            <div class="tz-filter-row" id="dc-source-row" style="flex-wrap:wrap;gap:10px">
              <div class="tz-filter-label">目标：</div>
              <select class="sim-select" id="dc-source-select" style="min-width:260px"></select>
            </div>
            <div class="tz-filter-row" style="flex-wrap:wrap;gap:12px">
              <div class="tz-filter-label">参数：</div>
              <label class="sim-field">
                <span>寻魔率 MF (%)</span>
                <input type="number" class="sim-num-input" id="dc-mf-input" min="0" max="1200" value="250" />
              </label>
              <div class="tz-chips" id="dc-mf-presets">
                <button type="button" class="tz-chip" data-dc-mf="0">0%</button>
                <button type="button" class="tz-chip" data-dc-mf="100">100%</button>
                <button type="button" class="tz-chip active" data-dc-mf="250">250%</button>
                <button type="button" class="tz-chip" data-dc-mf="350">350%</button>
                <button type="button" class="tz-chip" data-dc-mf="500">500%</button>
              </div>
              <div class="tz-chips" id="dc-players-chips">
                <button type="button" class="tz-chip active" data-dc-players="1">/players 1</button>
                <button type="button" class="tz-chip" data-dc-players="3">/players 3</button>
                <button type="button" class="tz-chip" data-dc-players="5">/players 5</button>
                <button type="button" class="tz-chip" data-dc-players="7">/players 7</button>
              </div>
            </div>
          </div>
          <div id="it-cube-sim-console" style="display:none;margin-top:8px">
            <div class="bp-grid">
              <!-- 左卡：暗金装备赫拉迪克方块升阶预览器 -->
              <article class="bp-card" style="border-color:rgba(213,167,72,0.35)">
                <div class="bp-card-head">
                  <h3 class="bp-card-title" style="color:#f5cf7b"><img class="ui-chip-icon" src="/images/items/misc/quest/horadric_cube.webp" alt="">暗金装备方块升阶预览器（普通 → 扩展 → 精华）</h3>
                  <label class="sk-bonus-ctrl" style="cursor:pointer">
                    <input type="checkbox" class="rw-check" id="cube-up-eth" />
                    <span>无形 Ethereal (+50% 基础防/伤)</span>
                  </label>
                </div>
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                  <span style="font-size:12px;color:var(--muted)">选择暗金装备：</span>
                  <select class="sim-select" id="cube-up-select" style="flex:1;min-width:220px"></select>
                </div>
                <div id="cube-up-preview"></div>
              </article>

              <!-- 右卡：D2R 3.4 焕新破免板合成与随机词缀模拟器 -->
              <article class="bp-card" style="border-color:rgba(226,132,219,0.38)">
                <div class="bp-card-head">
                  <h3 class="bp-card-title" style="color:#f1a7ec"><img class="ui-chip-icon" src="/images/items/misc/shard/mote_of_destruction.webp" alt="">3.4 焕新破免板（Renewed Sunder）合成与随机 Roll 模拟器</h3>
                  <button type="button" class="rw-btn active" id="cube-sunder-roll-btn">随机 Roll 一次</button>
                </div>
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                  <span style="font-size:12px;color:var(--muted)">选择破免板：</span>
                  <select class="sim-select" id="cube-sunder-select" style="flex:1;min-width:220px"></select>
                </div>
                <div id="cube-sunder-preview"></div>
              </article>
            </div>
          </div>
        </div>

        <div class="it-grid" id="it-grid">正在加载物品资讯...</div>
      </section>
    </div>

    <!-- Tab 面板 6：八大职业技能树与加点模拟器 (含 3.4 新职业术士 Warlock) -->
    <div class="main-tab-panel" id="main-panel-skills" role="tabpanel" aria-labelledby="main-tab-skills">
      <section class="module-block skills-module" aria-label="职业技能树与加点模拟器">
        <div class="module-header">
          <div class="module-title-wrap">
            <span class="module-tag skills-tag">SKILL PLANNER 3.4</span>
            <h2 class="module-title" data-i18n="skModuleTitle">八大职业技能树与加点模拟器（含 3.4 新职业「术士 Warlock」）</h2>
          </div>
          <div class="module-meta">
            <span data-i18n="skModuleMeta">全 8 职业 240 技能 · 协同加成与法力/伤害实时演算 · 一键分享配装加点</span>
          </div>
        </div>

        <div class="sk-class-tabs" id="sk-class-tabs" role="tablist" aria-label="选择职业"></div>

        <div class="af-subtabs" id="sk-view-subtabs" role="tablist" aria-label="技能与档位视图切换" style="border-bottom-color:rgba(239,107,91,0.25)">
          <button class="af-subtab active" data-sk-view="planner" type="button"><img class="ui-tab-icon" src="/images/ui/skilltree.webp" alt=""><span>技能树与加点模拟器</span></button>
          <button class="af-subtab" data-sk-view="mercenary" type="button"><img class="ui-tab-icon" src="/images/ui/desertmercenaryicon.webp" alt=""><span>角色 & 四幕佣兵真实纸娃娃自由配装 / 打孔镶嵌 / 变量与光环联动</span></button>
          <button class="af-subtab" data-sk-view="breakpoints" type="button"><img class="ui-tab-icon" src="/images/ui/sprint.webp" alt=""><span>全职业档位速查 & 攻速/施法/格挡计算器 (FCR / FHR / FBR / IAS)</span></button>
        </div>

        <section class="cloud-sync-bar" id="cloud-sync-bar" aria-label="云端技能与装备存档">
          <div class="cloud-sync-left">
            <span class="cloud-sync-status" id="cloud-sync-status">${ssrCloudStatusText}</span>
            <button class="rw-btn" id="cloud-login-cta" type="button" style="display:${ssrUser ? "none" : "inline-flex"}">登录 / 注册云端保存</button>
            <button class="rw-btn" id="cloud-sync-now-btn" type="button" style="display:${ssrUser ? "inline-flex" : "none"}">☁ 立即同步云端</button>
          </div>
          <div class="cloud-sync-right" id="cloud-preset-controls" style="display:${ssrUser ? "flex" : "none"}">
            <input type="text" class="cloud-preset-input" id="cloud-preset-name" maxlength="48" placeholder="方案名（如：双梦圣骑）" aria-label="云端配装与技能方案名称" />
            <button class="rw-btn active" id="cloud-preset-save-btn" type="button">保存当前职业方案</button>
            <select class="sim-select" id="cloud-preset-select" style="height:29px;padding:2px 8px;font-size:12px;max-width:210px" aria-label="选择已保存的云端方案">
              <option value="">暂无云端方案</option>
            </select>
            <button class="rw-btn" id="cloud-preset-load-btn" type="button">载入</button>
            <button class="rw-btn" id="cloud-preset-manage-btn" type="button">管理全部</button>
          </div>
        </section>

        <section class="meta-preset-bar" id="sk-meta-preset-bar" aria-label="D2R 3.4 热门流派预设库">
          <div class="meta-preset-row">
            <span class="meta-preset-badge">🔥 3.4 热门流派预设库</span>
            <select class="sim-select meta-preset-select" id="sk-meta-preset-select" aria-label="选择 D2R 3.4 热门流派预设">
              <option value="">正在加载 8 职业预设库…</option>
            </select>
            <button class="rw-btn active" id="sk-meta-preset-apply-btn" type="button">⚡ 一键载入（技能+配装）</button>
            <span class="meta-preset-desc" id="sk-meta-preset-desc">涵盖 8 大职业开荒/毕业/专项共 16 套完整构筑，一键试玩或作为基准 A 对比换装</span>
          </div>
        </section>

        <div id="sk-view-planner">
        <div class="sk-planner-bar">
          <div class="sk-metrics">
            <span>已分配技能点：<strong class="rw-gold" id="sk-points-used">0</strong> / <span>110</span>（剩余 <strong class="rw-accent" id="sk-points-rem">110</strong>）</span>
            <span class="rw-stat-sep">|</span>
            <span>需求角色等级：<strong style="color:#a7d8ff" id="sk-req-clvl">1</strong> 级</span>
            <span class="rw-stat-sep">|</span>
            <label class="sk-bonus-ctrl">
              <span>装备全技能 +</span>
              <input type="number" class="sk-bonus-input" id="sk-bonus-all" min="0" max="35" value="0" />
            </label>
            <span id="sk-synced-extra-badge" style="display:none;font-size:11.5px;color:#9ad8ff;background:rgba(104,164,255,0.14);border:1px solid rgba(104,164,255,0.38);padding:2px 8px;border-radius:999px"></span>
          </div>
          <div class="rw-actions">
            <button class="rw-btn" id="sk-import-d2s-btn" type="button" style="border-color:rgba(154,216,255,0.5);color:#9ad8ff">📂 导入 .d2s 存档</button>
            <button class="rw-btn" id="sk-export-d2s-btn" type="button" style="border-color:rgba(112,226,140,0.5);color:#9bf4ae" title="离线导出当前职业等级、四维、30项技能、地狱全通与全小站的单机 .d2s 测试存档">💾 导出 .d2s 存档</button>
          <button class="rw-btn" id="sk-stash-export-btn" type="button" style="border-color:rgba(240,185,90,0.55);color:#ffd573" title="配置角色个人仓库物品，或导出/合并 D2R 3.4 共享仓库 .d2i（支持 1–99 堆叠符文/宝石/材料）">📦 仓库 / 堆叠 .d2i</button>
            <button class="rw-btn active" id="sk-share-full-bd-btn" type="button">🔗 分享完整 BD 短链</button>
            <button class="rw-btn" id="sk-share-btn" type="button">复制加点分享链接</button>
            <button class="rw-btn rw-btn-danger" id="sk-reset-btn" type="button">重置当前职业加点</button>
          </div>
        </div>

        <div class="sk-tree-legend" id="sk-tree-legend" aria-label="技能树连线与关系图例">
          <span class="sk-legend-item"><i class="sk-leg-line is-idle"></i>前置连线</span>
          <span class="sk-legend-item"><i class="sk-leg-line is-active"></i>已点亮链路</span>
          <span class="sk-legend-item"><i class="sk-leg-line is-prereq"></i>前置依赖（悬停/选中高亮）</span>
          <span class="sk-legend-item"><i class="sk-leg-line is-unlock"></i>后续解锁</span>
          <span class="sk-legend-item"><i class="sk-leg-dot is-synergy"></i>协同加成技能</span>
        </div>

        <div class="sk-workspace">
          <div class="sk-trees-wrap" id="sk-trees-wrap">正在加载八大职业技能树…</div>
          <aside class="sk-inspector" id="sk-inspector" aria-label="技能详情与协同加成">
            <h3 class="sk-insp-title" id="sk-insp-title">点击左侧任意技能查看详情</h3>
            <div class="sk-insp-sub" id="sk-insp-sub">单击技能卡标记为已选中并锁定说明（再次点击或点其他技能取消/切换）；点击右上角「+ / -」按钮（Shift ±5）或右键调整技能点</div>
            <div id="sk-insp-body"></div>
          </aside>
        </div>
        </div>

        <!-- 全职业档位速查与攻速/施法/格挡计算器视图 -->
        <div id="sk-view-breakpoints" style="display:none">
          <section class="bp-sync-bar" id="bp-paperdoll-sync-bar" aria-label="纸娃娃配装自动联动栏">
            <div class="bp-sync-left">
              <label class="bp-sync-toggle" for="bp-auto-sync-toggle">
                <input type="checkbox" id="bp-auto-sync-toggle" checked />
                <span>🔗 自动跟随纸娃娃配装（实时同步）</span>
              </label>
              <span class="bp-sync-badge is-manual" id="bp-sync-source-badge" aria-live="polite">⏳ 正在读取当前职业纸娃娃配装…</span>
            </div>
            <div class="bp-sync-actions">
              <button type="button" class="btn btn-secondary" id="bp-sync-now-btn" style="padding:5px 10px;font-size:12px">🔄 立即同步纸娃娃</button>
              <button type="button" class="btn btn-secondary" id="bp-back-pd-btn" style="padding:5px 10px;font-size:12px">← 返回纸娃娃换装</button>
            </div>
          </section>
          <div class="bp-grid">
            <!-- 1. FCR 快速施法档位 -->
            <article class="bp-card">
              <div class="bp-card-head">
                <h3 class="bp-card-title">⚡ 快速施法速度 (FCR) 档位表</h3>
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                  <select class="sim-select" id="bp-fcr-variant" style="height:30px;padding:2px 8px;font-size:12px"></select>
                  <label class="sk-bonus-ctrl">
                    <span>当前 FCR (%)</span>
                    <input type="number" class="sk-bonus-input" id="bp-fcr-input" min="0" max="300" value="105" />
                  </label>
                </div>
              </div>
              <div class="bp-status-pill" id="bp-fcr-status"></div>
              <div id="bp-fcr-table-wrap"></div>
            </article>

            <!-- 2. FHR 快速打击恢复档位 -->
            <article class="bp-card">
              <div class="bp-card-head">
                <h3 class="bp-card-title">🛡️ 快速打击恢复 (FHR) 档位表</h3>
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                  <select class="sim-select" id="bp-fhr-variant" style="height:30px;padding:2px 8px;font-size:12px"></select>
                  <label class="sk-bonus-ctrl">
                    <span>当前 FHR (%)</span>
                    <input type="number" class="sk-bonus-input" id="bp-fhr-input" min="0" max="300" value="86" />
                  </label>
                </div>
              </div>
              <div class="bp-status-pill" id="bp-fhr-status"></div>
              <div id="bp-fhr-table-wrap"></div>
            </article>

            <!-- 3. 武器攻速 IAS 档位计算器 -->
            <article class="bp-card">
              <div class="bp-card-head">
                <h3 class="bp-card-title">⚔️ 武器攻击速度 (IAS) 帧数与档位计算器</h3>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">
                <label class="sk-bonus-ctrl">
                  <span>底材攻速 WSM</span>
                  <select class="sim-select" id="bp-ias-wsm" style="height:30px;padding:2px 8px;font-size:12px">
                    <option value="-30">[-30] 幻化之刃 / 巨鹰爪 / 符纹爪 / 楚库弩</option>
                    <option value="-20">[-20] 宝剑 / 骨刃 / 恶魔十字弓</option>
                    <option value="-10" selected>[-10] 巨长斧 / 鲛尾巨斧 / 女族长之标枪 / 狂战士手斧</option>
                    <option value="0">[0] 狂战士斧 / 执政官之杖 / 水晶剑 / 君主盾击</option>
                    <option value="5">[5] 巨神之刃 / 锐利之斧</option>
                    <option value="10">[10] 大院长之弓 / 神秘之斧 / 巨神长柄斧 / 雷锤</option>
                    <option value="20">[20] 战枪 / 传说之锤 / 巨战十字弓</option>
                  </select>
                </label>
                <label class="sk-bonus-ctrl">
                  <span>装备总 IAS (%)</span>
                  <input type="number" class="sk-bonus-input" id="bp-ias-input" min="0" max="250" value="60" />
                </label>
                <label class="sk-bonus-ctrl">
                  <span>狂热灵气等级</span>
                  <input type="number" class="sk-bonus-input" id="bp-ias-fana" min="0" max="35" value="0" />
                </label>
                <label class="sk-bonus-ctrl">
                  <span>速度爆发/狂乱等级</span>
                  <input type="number" class="sk-bonus-input" id="bp-ias-bos" min="0" max="35" value="0" />
                </label>
              </div>
              <div class="bp-status-pill" id="bp-ias-status"></div>
              <div id="bp-ias-table-wrap"></div>
            </article>

            <!-- 4. FBR 快速格挡档位 & 75% 满格挡敏捷计算器 -->
            <article class="bp-card">
              <div class="bp-card-head">
                <h3 class="bp-card-title">🔰 快速格挡 (FBR) & 75% 满格挡敏捷计算器</h3>
                <label class="sk-bonus-ctrl">
                  <span>当前 FBR (%)</span>
                  <input type="number" class="sk-bonus-input" id="bp-fbr-input" min="0" max="250" value="35" />
                </label>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">
                <label class="sk-bonus-ctrl">
                  <span>常用盾牌</span>
                  <select class="sim-select" id="bp-blk-shield" style="height:30px;padding:2px 8px;font-size:12px">
                    <option value="42">统治者大盾（精神 42% 基础）</option>
                    <option value="67">暴风之盾 / 物免盾（67% 面板）</option>
                    <option value="60">神圣小盾（60% 圣骑底材）</option>
                    <option value="82">撒卡兰姆使者 HoZ（82% 面板）</option>
                    <option value="72">侏儒 Homunculus（72% 死灵盾）</option>
                    <option value="65">摩西祝福之环（65% 双钻盾）</option>
                  </select>
                </label>
                <label class="sk-bonus-ctrl">
                  <span>角色等级</span>
                  <input type="number" class="sk-bonus-input" id="bp-blk-clvl" min="1" max="99" value="90" />
                </label>
                <label class="sk-bonus-ctrl">
                  <span>神圣之盾/会心守御 +%</span>
                  <input type="number" class="sk-bonus-input" id="bp-blk-skill" min="0" max="50" value="0" />
                </label>
              </div>
              <div class="bp-status-pill" id="bp-blk-status"></div>
              <div id="bp-fbr-table-wrap"></div>
            </article>
          </div>
        </div>

        <!-- 角色 & 四幕佣兵真实纸娃娃自由配装、打孔镶嵌、变量微调与光环联动视图 -->
        <div id="sk-view-mercenary" style="display:none">
          <!-- 顶部：角色 ↔ 佣兵双向光环与战吼联动栏 -->
          <div class="pd-aura-bar">
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                <strong style="color:#ffd573;font-size:13.5px">🌟 角色 ↔ 佣兵双向光环与团队增益联动：</strong>
                <div id="pd-active-auras-list" style="display:inline-flex;flex-wrap:wrap;gap:6px"></div>
              </div>
              <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
                <label class="sk-bonus-ctrl">
                  <span>角色自身开启灵气：</span>
                  <select class="sim-select" id="pd-char-aura" style="height:28px;padding:2px 8px;font-size:12px">
                    <option value="none">无主动光环</option>
                    <option value="fana-20">狂热灵气 Fanaticism（圣骑士自动按技能树+装备定级）</option>
                    <option value="conc-20">专注灵气 Concentration（圣骑士自动按技能树+装备定级）</option>
                    <option value="conv-20">信念灵气 Conviction（圣骑士自动按技能树+装备定级）</option>
                    <option value="might">力量灵气 Might（圣骑士自动按技能树+装备定级）</option>
                    <option value="ba">祝福瞄准 Blessed Aim（圣骑士自动按技能树+装备定级）</option>
                    <option value="salv-20">救助灵气 Salvation（圣骑士自动按技能树+装备定级）</option>
                    <option value="defiance">反抗灵气 Defiance（圣骑士自动按技能树+装备定级）</option>
                    <option value="vigor">活力灵气 Vigor（圣骑士自动按技能树+装备定级）</option>
                    <option value="oak-20">橡木智者 Oak Sage（德鲁伊自动按技能树+装备定级）</option>
                    <option value="how">狼獾之心 Heart of Wolverine（德鲁伊自动按技能树+装备定级）</option>
                    <option value="enchant-23">恶魔肢体附魔 Lv.23 (+218% AR · +87–111 火伤)</option>
                  </select>
                </label>
                <div class="sk-bonus-ctrl" id="pd-warlock-demon-wrap" style="border:1px solid rgba(226,132,219,0.45);border-radius:6px;padding:2px 7px;background:rgba(46,18,48,0.5);display:inline-flex;align-items:center;gap:5px;flex-wrap:wrap">
                  <label for="pd-warlock-demon-aura" style="color:#f0a3ec;white-space:nowrap">🔥 术士束缚恶魔光环：</label>
                  <select class="sim-select" id="pd-warlock-demon-aura" style="height:26px;padding:1px 6px;font-size:11.5px">
                    <option value="none">未束缚光环恶魔</option>
                    <option value="vigor">活力 Vigor (+高跑 FRW · +耐力与恢复)</option>
                    <option value="fana">狂热 Fanaticism (+攻速 EIAS · +物理伤 · +AR)</option>
                    <option value="conc">专注 Concentration (+物理/天锤伤)</option>
                    <option value="hf">神圣冰冻 Holy Freeze (群体减速控场)</option>
                    <option value="thorns">荆棘 Thorns (近战反伤)</option>
                  </select>
                  <span id="pd-warlock-demon-mlvl-wrap" style="display:none;align-items:center;gap:4px;font-size:11px;color:#e8c7f0" title="被束缚恶魔的怪物等级 mlvl（普通地狱85区精英约88级，96+级恐怖地带 TZ 可达96~99级）；按官方公式 floor(mlvl / 除数) 自动换算灵气等级">
                    <label for="pd-warlock-demon-mlvl" style="white-space:nowrap">恶魔 mlvl</label>
                    <input type="number" class="sk-bonus-input" id="pd-warlock-demon-mlvl" min="1" max="99" value="96" style="width:48px;height:24px;font-size:11.5px" />
                    <span id="pd-warlock-demon-lvl-badge" style="color:#ffd573;font-weight:700;white-space:nowrap"></span>
                  </span>
                </div>
                <label class="sk-bonus-ctrl" id="pd-warlock-hex-wrap" style="border:1px solid rgba(154,216,255,0.45);border-radius:6px;padding:2px 7px;background:rgba(16,30,52,0.58)">
                  <span style="color:#9ad8ff">🔮 术士邪咒 Buff：</span>
                  <select class="sim-select" id="pd-warlock-hex-buff" style="height:26px;padding:1px 6px;font-size:11.5px">
                    <option value="none">未激活邪咒</option>
                    <option value="Hex Bane">咒术: 灾祸 / 邪咒：灾祸 (武器附加高额魔法伤 + AR% + 降敌防)</option>
                    <option value="Hex Purge">咒术: 净化 / 邪咒：消灭 (+10~30% EIAS 攻速 + AR% + 击中魔法爆发)</option>
                    <option value="Hex Siphon">咒术: 吸取 / 邪咒：虹吸 (+AR% + 杀回血/回蓝 + 降敌伤 -33%)</option>
                  </select>
                </label>
                <label class="sk-bonus-ctrl">
                  <span style="color:#ff9b8f">对敌减益/恶魔诅咒：</span>
                  <select class="sim-select" id="pd-enemy-debuff" style="height:28px;padding:2px 8px;font-size:12px">
                    <option value="none">无对敌 Debuff</option>
                    <option value="amp">伤害加深 / 恶魔「被诅咒」词缀 (-100% 敌物抗)</option>
                    <option value="decrep">衰老 Decrepify / 死神的丧钟 (-50% 敌物抗 & 减速)</option>
                    <option value="lr-10">降低抵抗 Lower Resist Lv.10 (-55% 敌火/冰/电/毒抗)</option>
                    <option value="lr-16">降低抵抗 Lower Resist Lv.16 (-61% 敌火/冰/电/毒抗)</option>
                  </select>
                </label>
                <label class="sk-bonus-ctrl" id="pd-pal-hs-wrap" style="display:none;cursor:pointer;border:1px solid rgba(245,207,123,0.45);border-radius:6px;padding:2px 8px;background:rgba(48,34,12,0.48)">
                  <input type="checkbox" class="rw-check" id="pd-pal-hs-on" checked />
                  <span style="color:#ffd573">🛡️ 开启神圣之盾 Holy Shield</span>
                  <span id="pd-pal-hs-badge" style="font-size:11px;color:#8af49f;font-weight:700"></span>
                </label>
                <label class="sk-bonus-ctrl" style="cursor:pointer">
                  <input type="checkbox" class="rw-check" id="pd-cta-bo" checked />
                  <span>战争召唤 CTA 战吼 (+1 全技能 · +65% 生命/法力)</span>
                </label>
              </div>
            </div>
          </div>

          <div class="pd-workspace">
            <!-- 1. 左侧：角色真实纸娃娃配装盘 (纯 10 部位) + 10x4 游戏背包 + 技能攻击力与完整人物面板 -->
            <article class="bp-card pd-col-char" style="border-color:rgba(213,167,72,0.45)">
              <div class="bp-card-head">
                <h3 class="bp-card-title" style="color:#f5cf7b" id="pd-char-title">角色真实配装纸娃娃</h3>
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                  <label class="sk-bonus-ctrl">
                    <span>等级</span>
                    <input type="number" class="sk-bonus-input" id="pd-char-lvl" min="1" max="99" value="90" style="width:50px;height:26px" />
                  </label>
                  <button type="button" class="rw-btn" id="pd-save-build-btn" style="padding:3px 8px;font-size:11px;border-color:rgba(103,232,122,0.55);color:#8af49f">💾 保存配装</button>
                  <button type="button" class="rw-btn" id="pd-import-d2s-btn" style="padding:3px 8px;font-size:11px;border-color:rgba(154,216,255,0.55);color:#9ad8ff">📂 导入 .d2s</button>
                  <button type="button" class="rw-btn" id="pd-export-d2s-btn" style="padding:3px 8px;font-size:11px;border-color:rgba(112,226,140,0.55);color:#9bf4ae" title="导出单机 .d2s 测试存档">💾 导出 .d2s</button>
                  <button type="button" class="rw-btn" id="pd-stash-export-btn" style="padding:3px 8px;font-size:11px;border-color:rgba(240,185,90,0.55);color:#ffd573" title="配置角色个人仓库物品或导出/合并共享仓库 .d2i（1–99 堆叠符文/宝石/材料）">📦 仓库/.d2i</button>
                  <button type="button" class="rw-btn" id="pd-share-bd-btn" style="padding:3px 8px;font-size:11px;border-color:rgba(245,207,123,0.65);color:#ffe08c">🔗 分享完整 BD</button>
                  <button type="button" class="rw-btn" id="pd-reset-class-set-btn" style="padding:3px 8px;font-size:11px;border-color:rgba(103,232,122,0.35);color:#b9f6ca">🔄 恢复本职业套装</button>
                  <button type="button" class="rw-btn" id="pd-char-preset-btn" style="padding:3px 8px;font-size:11px">切换毕业暗金/符文预设</button>
                  <label class="sk-bonus-ctrl pd-autosync-toggle" title="开启后每次调整装备/咒符/底材技能时自动同步 +技能至技能树；关闭则点击右侧按钮手动同步" style="font-size:11px;padding:2px 7px;gap:4px;cursor:pointer">
                    <input type="checkbox" id="pd-auto-sync-skills" checked />
                    <span>自动同步技能</span>
                  </label>
                  <button type="button" class="rw-btn" id="pd-sync-skills-btn" style="padding:3px 8px;font-size:11px;border-color:rgba(154,216,255,0.45);color:#9ad8ff">手动同步 +技能</button>
                </div>
              </div>
              <div class="pd-swap-bar" id="pd-swap-bar" role="region" aria-label="主/副手武器栏切换">
                <div class="pd-swap-tabs" role="group" aria-label="武器组 I / II">
                  <button type="button" class="pd-swap-tab active" id="pd-wset-1" data-pd-wset="1" aria-pressed="true">I 主武器组</button>
                  <button type="button" class="pd-swap-tab" id="pd-wset-2" data-pd-wset="2" aria-pressed="false">II 副武器组</button>
                  <button type="button" class="pd-swap-kbd-btn" id="pd-wset-toggle-btn" title="按键盘 W 键快捷切换主/副手武器组">⇄ 切手 <kbd>W</kbd></button>
                </div>
                <div class="pd-swap-meta">
                  <span class="pd-swap-preview" id="pd-swap-preview">副手组 II：未装备</span>
                  <div class="pd-swap-presets">
                    <button type="button" class="rw-detail-btn" id="pd-swap-preset-cta" title="向副手组 II 一键装入战争召唤 CTA + 精神盾">⚔️ 副手CTA+精神</button>
                    <button type="button" class="rw-detail-btn" id="pd-swap-preset-mf" title="向副手组 II 一键装入双24#阿里巴巴 + 韵律盾">🍀 副手MF打宝</button>
                  </div>
                </div>
              </div>
              <div class="pd-doll-grid" id="pd-char-grid"></div>

              <!-- 真实 10×4 游戏角色背包 (40 格手动放入火炬/毁灭/破免/技能板/小符/方块) -->
              <div class="pd-inv-wrap" id="pd-inv-wrap">
                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">
                  <strong style="font-size:12.5px;color:#ffd584">🎒 游戏角色背包（10×4 共 40 格 · <span id="pd-bag-usage">已用 0 / 40 格</span>）</strong>
                  <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap">
                    <button type="button" class="rw-detail-btn" id="pd-bag-preset-btn">一键标准毕业背包</button>
                    <button type="button" class="rw-btn rw-btn-danger" id="pd-bag-clear-btn" style="padding:2px 7px;font-size:11px">清空背包</button>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                  <select class="sim-select" id="pd-bag-add-select" style="flex:1;min-width:170px;height:30px;font-size:12px"></select>
                  <select class="sim-select" id="pd-bag-skiller-tab" style="display:none;height:30px;font-size:11.5px;max-width:135px"></select>
                  <button type="button" class="rw-btn" id="pd-bag-add-btn" style="padding:4px 10px;font-size:11.5px;border-color:rgba(245,207,123,0.6);color:#ffe08c">+ 放入背包</button>
                </div>
                <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap" id="pd-bag-quick-btns">
                  <button type="button" class="rw-detail-btn" data-quick-charm="torch">+ 地狱火炬</button>
                  <button type="button" class="rw-detail-btn" data-quick-charm="anni">+ 毁灭小符</button>
                  <button type="button" class="rw-detail-btn" data-quick-charm="magic-sc" style="border-color:rgba(105,169,255,0.6);color:#7cb6ff">+ 蓝装SC(自选)</button>
                  <button type="button" class="rw-detail-btn" data-quick-charm="magic-gc" style="border-color:rgba(105,169,255,0.6);color:#7cb6ff">+ 蓝装GC(自选)</button>
                  <button type="button" class="rw-detail-btn" data-quick-charm="gc-sk-life">+ 技能生命板</button>
                  <button type="button" class="rw-detail-btn" data-quick-charm="sc-20-5">+ 20/5小符</button>
                  <button type="button" class="rw-detail-btn" data-quick-charm="util-cube">+ 方块</button>
                </div>
                <div id="pd-bag-msg" style="font-size:11px;color:#ffb3a7;display:none"></div>
                <div class="pd-inv-grid" id="pd-inv-grid" aria-label="角色 10x4 背包网格"></div>
                <div class="pd-bag-inline-bar" id="pd-bag-inline-bar" style="display:none"></div>
                <div style="font-size:11px;color:var(--muted)">提示：悬停点击物品右上角 <strong>×</strong>、<strong>右键单击</strong>，或选中后点击下方「移出」均可就近卸载；左键点击可在右侧微调变量与词缀。</div>
              </div>

              <!-- 技能攻击力模拟器（手动选择当前职业任意技能） -->
              <div class="pd-skill-atk-box" id="pd-skill-atk-box">
                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">
                  <strong style="font-size:12.5px;color:#ffb3a7">⚔️ 技能攻击力与准确模拟（手动选择技能）</strong>
                  <label class="sk-bonus-ctrl" style="cursor:pointer;font-size:11px">
                    <input type="checkbox" class="rw-check" id="pd-skill-max-mode" checked />
                    <span>按满级满协同(Lv.20)模拟</span>
                  </label>
                </div>
                <select class="sim-select" id="pd-skill-select" style="height:32px;font-size:12.5px"></select>
                <div id="pd-skill-atk-result"></div>
              </div>

              <!-- 四维属性自由加点模拟器（锁定职业固有初始点数，自由分配等级点数） -->
              <div class="pd-alloc-box" id="pd-stat-alloc-box"></div>

              <!-- 配装 A/B 实时差值对比工具条 -->
              <div class="pd-compare-bar" id="pd-compare-bar" aria-label="配装 A/B 实时差值对比">
                <div class="pd-compare-head">
                  <div class="pd-compare-info" id="pd-cmp-status">📌 锁定当前配置为基准 A，任意换装/调变量/改护符即可实时查看各项属性绿红差值 Δ</div>
                  <div class="pd-compare-actions">
                    <button type="button" class="rw-detail-btn" id="pd-cmp-pin-btn">📌 设为基准 A</button>
                    <button type="button" class="rw-detail-btn" id="pd-cmp-restore-btn" style="display:none">↩ 还原基准 A</button>
                    <button type="button" class="rw-detail-btn" id="pd-cmp-clear-btn" style="display:none">✕ 结束对比</button>
                  </div>
                </div>
                <div class="pd-compare-summary" id="pd-cmp-summary" style="display:none"></div>
              </div>

              <!-- 完整人物属性面板 (D2R Character Sheet + 高级属性) -->
              <div id="pd-char-stats"></div>
            </article>

            <!-- 2. 中间：四幕佣兵真实纸娃娃配装盘 (4 部位 + 流派成长) -->
            <article class="bp-card pd-col-merc" id="pd-merc-card" style="border-color:rgba(87,219,112,0.42)">
              <div class="bp-card-head">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                  <label class="sk-bonus-ctrl" style="cursor:pointer;font-size:12px;font-weight:700;color:#8af49f" title="默认勾选表示携带佣兵；取消勾选后佣兵面板置灰锁定不可修改，且所有佣兵自带与装备灵气均不计入角色面板">
                    <input type="checkbox" class="rw-check" id="pd-merc-enabled" checked />
                    <span>携带佣兵</span>
                  </label>
                  <h3 class="bp-card-title" style="color:#8af49f"><img class="ui-chip-icon" src="/images/ui/desertmercenaryicon.webp" alt="">四幕佣兵真实配装纸娃娃</h3>
                </div>
                <div class="pd-merc-ctrl-group" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                  <label class="sk-bonus-ctrl" style="cursor:pointer;font-size:11px" title="新开房在城镇中佣兵自带灵气尚未触发，需出城战斗后激活；装备赋予的光环(如眼光/治愈/无限)在城里始终生效">
                    <input type="checkbox" class="rw-check" id="pd-merc-aura-on" checked />
                    <span>自带光环生效(野外)</span>
                  </label>
                  <label class="sk-bonus-ctrl">
                    <span>等级</span>
                    <input type="number" class="sk-bonus-input" id="merc-lvl-input" min="67" max="98" value="90" style="width:50px;height:26px" />
                  </label>
                </div>
              </div>
              <div id="pd-merc-content" class="pd-merc-content">
                <div style="display:flex;flex-direction:column;gap:6px">
                  <select class="sim-select" id="merc-variant-select" style="height:32px;font-size:12px"></select>
                  <div style="display:none">
                    <select id="merc-weapon-select"></select>
                    <select id="merc-helm-select"></select>
                    <select id="merc-armor-select"></select>
                  </div>
                </div>
                <div class="pd-merc-grid" id="pd-merc-grid"></div>
                <div class="bp-status-pill" id="merc-equip-check"></div>
                <div id="merc-stats-body"></div>
              </div>
            </article>

            <!-- 3. 右侧：当前选中装备部位 / 背包咒符 自由编辑、打孔镶嵌 & 变量属性滑块编辑器 -->
            <article class="bp-card pd-col-editor" style="border-color:rgba(255,138,117,0.5)">
              <div class="bp-card-head">
                <div>
                  <h3 class="bp-card-title" style="color:#ffb3a7" id="pd-editor-title">部位自由配装 & 打孔/变量编辑器</h3>
                  <div style="font-size:11.5px;color:var(--muted);margin-top:2px" id="pd-editor-rule-tip">点击左侧角色装备、背包咒符或佣兵槽位进行自由配装</div>
                </div>
                <button type="button" class="rw-btn rw-btn-danger" id="pd-unequip-btn" style="padding:4px 9px;font-size:11.5px">卸下该槽位</button>
              </div>

              <!-- 装备槽位编辑控件区 -->
              <div id="pd-equip-editor-controls" style="display:flex;flex-direction:column;gap:8px">
                <div class="tz-chips" id="pd-cat-chips">
                  <button type="button" class="tz-chip active" data-pd-cat="unique">暗金装备</button>
                  <button type="button" class="tz-chip" data-pd-cat="set">绿色套装</button>
                  <button type="button" class="tz-chip" data-pd-cat="rw">符文之语</button>
                  <button type="button" class="tz-chip" data-pd-cat="craft" style="color:#ffaa4d">手工橙装</button>
                  <button type="button" class="tz-chip" data-pd-cat="magic" style="color:#7cb6ff">蓝装 (自选词缀)</button>
                  <button type="button" class="tz-chip" data-pd-cat="rare" style="color:#f8e97a">黄装 (自选词缀)</button>
                  <button type="button" class="tz-chip" data-pd-cat="base">打孔底材自由镶嵌</button>
                </div>

                <div style="display:flex;flex-direction:column;gap:8px">
                  <div id="pd-rw-base-row" style="display:none;align-items:center;gap:8px">
                    <label for="pd-rw-base-input" style="font-size:12px;color:var(--muted);white-space:nowrap">选择底材：</label>
                    <div class="pd-combo" id="pd-rw-base-combo">
                      <div class="pd-combo-field">
                        <input type="text" class="pd-combo-input" id="pd-rw-base-input" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="pd-rw-base-listbox" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" placeholder="输入搜底材/别名（巨神长柄斧、连枷、统盾...），或直接点击下拉选择" />
                        <button type="button" class="pd-combo-clear" id="pd-rw-base-clear" aria-label="清空底材筛选" title="清空输入并查看全部" style="display:none">×</button>
                        <button type="button" class="pd-combo-toggle" id="pd-rw-base-toggle" aria-label="展开或收起底材下拉" title="展开/收起列表" tabindex="-1">▾</button>
                      </div>
                      <div class="pd-combo-menu" id="pd-rw-base-listbox" role="listbox" tabindex="-1" hidden></div>
                    </div>
                  </div>
                  <div style="display:flex;align-items:center;gap:8px">
                    <label for="pd-item-input" id="pd-item-combo-label" style="font-size:12px;color:var(--muted);white-space:nowrap">暗金装备：</label>
                    <div class="pd-combo" id="pd-item-combo">
                      <div class="pd-combo-field">
                        <input type="text" class="pd-combo-input" id="pd-item-input" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="pd-item-listbox" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" placeholder="输入搜索装备/符文之语/底材，或直接点击下拉选择..." style="height:34px" />
                        <button type="button" class="pd-combo-clear" id="pd-item-clear" aria-label="清空装备筛选" title="清空输入并查看全部" style="display:none">×</button>
                        <button type="button" class="pd-combo-toggle" id="pd-item-toggle" aria-label="展开或收起装备下拉" title="展开/收起列表" tabindex="-1">▾</button>
                      </div>
                      <div class="pd-combo-menu" id="pd-item-listbox" role="listbox" tabindex="-1" hidden></div>
                    </div>
                    <label class="sk-bonus-ctrl" style="cursor:pointer;white-space:nowrap">
                      <input type="checkbox" class="rw-check" id="pd-item-eth" />
                      <span>无形 Eth</span>
                    </label>
                  </div>
                  <div id="pd-craft-skill-row" style="display:none;align-items:center;gap:6px;flex-wrap:wrap;padding:7px 9px;border-radius:8px;border:1px solid rgba(255,170,77,0.45);background:rgba(42,24,10,0.75)">
                    <span style="font-size:11.5px;color:#ffbe70;font-weight:700;white-space:nowrap">🧡 手工技能词缀：</span>
                    <select class="sim-select" id="pd-craft-skill-target" style="flex:1;min-width:150px;height:30px;font-size:12px"></select>
                    <select class="sim-select" id="pd-craft-skill-lvl" style="width:74px;height:30px;font-size:12px">
                      <option value="2">+2 级</option>
                      <option value="1">+1 级</option>
                    </select>
                  </div>
                  <div id="pd-superior-row" style="display:none;align-items:center;gap:8px;flex-wrap:wrap;padding:6px 9px;border-radius:8px;border:1px solid rgba(154,216,255,0.35);background:rgba(16,30,48,0.62);font-size:11.5px;color:#cfe7ff">
                    <span id="pd-sup-title" style="color:#9ad8ff;font-weight:700;white-space:nowrap" title="D2R 超强底材 (Superior) 原生词缀：武器/弓可带 +5–15% 强化伤害 与 +1–3 攻击准确率，防具/盾牌可带 +5–15% 强化防御（若符文之语 ED 滑块已填合并后的总 ED，此处超强 ED 保持 0 即可避免重复计算）">✨ 超强底材 (Superior)：</span>
                    <label id="pd-sup-ed-wrap" style="display:inline-flex;align-items:center;gap:4px">
                      <span>强化伤害 ED +</span>
                      <input type="number" class="sk-bonus-input" id="pd-sup-ed" min="0" max="15" value="0" style="width:46px;height:24px;font-size:11.5px" />
                      <span>%</span>
                    </label>
                    <label id="pd-sup-ar-wrap" style="display:inline-flex;align-items:center;gap:4px">
                      <span>准确率 AR +</span>
                      <input type="number" class="sk-bonus-input" id="pd-sup-ar" min="0" max="3" value="0" style="width:44px;height:24px;font-size:11.5px" />
                    </label>
                    <label id="pd-sup-def-wrap" style="display:none;align-items:center;gap:4px">
                      <span>强化防御 +</span>
                      <input type="number" class="sk-bonus-input" id="pd-sup-def" min="0" max="15" value="0" inputmode="numeric" style="width:46px;height:24px;font-size:11.5px" />
                      <span>%</span>
                    </label>
                  </div>
                  <fieldset class="pd-pal-shield-fs" id="pd-pal-shield-row">
                    <legend>🛡️ 圣骑士专属盾牌底材原生属性（自动词缀 · 可叠加无形与超强防御）</legend>
                    <div class="pd-pal-mod-radios">
                      <label class="pd-pal-radio-lbl" for="pd-pal-mod-res">
                        <input type="radio" name="pd-pal-mod-type" id="pd-pal-mod-res" value="res" checked />
                        <span>抗性底材 (+5–45% 全抗)</span>
                      </label>
                      <label class="pd-pal-radio-lbl" for="pd-pal-mod-dmg">
                        <input type="radio" name="pd-pal-mod-type" id="pd-pal-mod-dmg" value="dmg" />
                        <span>骑士盾底材 (+5–65% ED / +15–121 AR)</span>
                      </label>
                    </div>
                    <div class="pd-pal-mod-inputs">
                      <span id="pd-pal-res-wrap" style="display:inline-flex;align-items:center;gap:4px">
                        <label for="pd-pal-res">所有抗性 +</label>
                        <input type="number" class="sk-bonus-input" id="pd-pal-res" min="0" max="45" value="0" inputmode="numeric" style="width:50px;height:24px;font-size:11.5px" />
                        <span>%</span>
                      </span>
                      <span id="pd-pal-dmg-wrap" style="display:none;align-items:center;gap:8px;flex-wrap:wrap">
                        <span style="display:inline-flex;align-items:center;gap:4px">
                          <label for="pd-pal-ed">伤害强化 +</label>
                          <input type="number" class="sk-bonus-input" id="pd-pal-ed" min="0" max="65" value="0" inputmode="numeric" style="width:50px;height:24px;font-size:11.5px" />
                          <span>%</span>
                        </span>
                        <span style="display:inline-flex;align-items:center;gap:4px">
                          <label for="pd-pal-ar">准确率 +</label>
                          <input type="number" class="sk-bonus-input" id="pd-pal-ar" min="0" max="121" value="0" inputmode="numeric" style="width:54px;height:24px;font-size:11.5px" />
                        </span>
                      </span>
                      <span id="pd-pal-block-hint" style="font-size:11px;color:#9ad8ff"></span>
                    </div>
                  </fieldset>
                  <fieldset class="pd-pal-shield-fs" id="pd-base-automod-row" style="display:none">
                    <legend id="pd-base-automod-legend">✨ 底材原生技能属性</legend>
                    <div id="pd-base-automod-tab-wrap" style="display:none;align-items:center;gap:8px;flex-wrap:wrap">
                      <label for="pd-base-auto-tab-lvl" id="pd-base-auto-tab-label" style="font-size:12px">原生单系技能 +</label>
                      <input type="number" class="sk-bonus-input" id="pd-base-auto-tab-lvl" min="0" max="3" value="0" inputmode="numeric" style="width:48px;height:24px;font-size:11.5px" />
                      <span style="font-size:11px;color:var(--muted)">（原生 0–3 级，可与符文之语 / 蓝黄词缀及超强 ED 叠加）</span>
                    </div>
                    <div id="pd-base-staffmod-wrap" style="display:none;flex-direction:column;gap:5px"></div>
                  </fieldset>
                </div>
              </div>

              <!-- 背包咒符编辑控件区 -->
              <div id="pd-bag-editor-controls" style="display:none;flex-direction:column;gap:8px">
                <div id="pd-bag-edit-skiller-row" style="display:none;align-items:center;gap:8px">
                  <span style="font-size:12px;color:var(--muted);white-space:nowrap">技能大板专精系别：</span>
                  <select class="sim-select" id="pd-bag-edit-skiller-select" style="flex:1;height:32px;font-size:12px"></select>
                </div>
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                  <button type="button" class="rw-btn" id="pd-bag-dup-btn" style="padding:4px 10px;font-size:11.5px">+ 复制一份放入背包</button>
                  <span style="font-size:11.5px;color:var(--muted)" id="pd-bag-item-size-tip"></span>
                </div>
              </div>

              <!-- 蓝装 / 黄装 / 蓝咒符 前后缀自由词缀构造器（自动锁定词缀上限） -->
              <div class="pd-affix-builder" id="pd-affix-builder">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;flex-wrap:wrap">
                  <strong style="font-size:12.5px;color:#7cb6ff" id="pd-affix-builder-title">🔵 蓝装前后缀自选</strong>
                  <span style="font-size:11px;color:#ffd584;font-weight:700" id="pd-affix-lock-status">前缀 0/1 · 后缀 0/1</span>
                </div>
                <div id="pd-affix-slot-hint" style="display:none;font-size:11px;line-height:1.45;padding:5px 8px;border-radius:6px;background:rgba(245,207,123,0.1);border:1px solid rgba(245,207,123,0.34);color:var(--gold)"></div>
                <input type="text" class="tz-search-input" id="pd-affix-filter" placeholder="🔍 筛选官方全词缀（如 命中、抗性、生命、法力、魔法伤害、FCR、力量...）" style="height:28px;font-size:11.5px" />
                <div class="pd-affix-row">
                  <select class="sim-select" id="pd-affix-pre-select" style="flex:1;min-width:150px;height:30px;font-size:12px"></select>
                  <button type="button" class="rw-btn" id="pd-affix-pre-add" style="padding:4px 9px;font-size:11.5px;border-color:rgba(105,169,255,0.6);color:#7cb6ff">+ 加前缀</button>
                </div>
                <div class="pd-affix-row">
                  <select class="sim-select" id="pd-affix-suf-select" style="flex:1;min-width:150px;height:30px;font-size:12px"></select>
                  <button type="button" class="rw-btn" id="pd-affix-suf-add" style="padding:4px 9px;font-size:11.5px;border-color:rgba(245,207,123,0.6);color:#ffe08c">+ 加后缀</button>
                </div>
                <div class="pd-affix-chips" id="pd-affix-chosen-list"></div>
              </div>

              <!-- 动态打孔与自由镶嵌区 -->
              <div id="pd-sockets-section" style="display:none">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
                  <strong style="font-size:12.5px;color:#ffd584"><img class="ui-chip-icon" src="/images/ui/gemsocket.webp" alt="">自由打孔与镶嵌（最大 <span id="pd-max-sock-num">0</span> 孔）</strong>
                  <span style="font-size:11px;color:var(--muted)" id="pd-sock-mode-tip">自动按武器/头甲/盾牌部位生效属性</span>
                </div>
                <div class="pd-sock-row" id="pd-sockets-list"></div>
              </div>

              <!-- 变量属性范围手动调节滑块区 -->
              <div id="pd-sliders-section" style="display:none">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
                  <strong style="font-size:12.5px;color:#9ad8ff">🎛️ 装备/咒符变量属性范围手动调节（实时同步面板）</strong>
                  <button type="button" class="rw-detail-btn" id="pd-max-rolls-btn">一键满变 (Perfect)</button>
                </div>
                <div style="display:flex;flex-direction:column;gap:6px;max-height:220px;overflow-y:auto;padding-right:2px" id="pd-sliders-list"></div>
              </div>

              <!-- 当前槽位最终生效属性预览 -->
              <div id="pd-item-preview"></div>
            </article>
          </div>
        </div>
      </section>
    </div>

    <footer>数据来源 d2runewizard.com · DC 后台每 <span id="footer-pull-interval">5</span> 分钟拉取 · 恐怖区域整点、半点同步 · 页面读取 Cloudflare KV 缓存 · <span class="app-version" title="版本 ${escapeSsrHtml(APP_VERSION)} · 构建时间 ${escapeSsrHtml(APP_BUILD_TIME)} · Commit ${escapeSsrHtml(APP_COMMIT)}">${escapeSsrHtml(APP_VERSION)}</span></footer>
    <button class="back-to-top-btn" id="back-to-top-btn" type="button" title="回到顶部" aria-label="回到顶部">↑</button>
  </main>

  <!-- 符文之语详情弹窗 -->
  <div class="rw-modal-backdrop" id="rw-detail-modal" role="dialog" aria-modal="true" aria-labelledby="rw-modal-title">
    <div class="rw-modal">
      <div class="rw-modal-head">
        <div>
          <h3 class="rw-modal-title" id="rw-modal-title">符文之语详情</h3>
          <div class="rw-modal-en" id="rw-modal-en"></div>
        </div>
        <button class="rw-modal-close" id="rw-modal-close" type="button" aria-label="关闭详情">×</button>
      </div>
      <div class="rw-modal-body" id="rw-modal-body"></div>
      <div class="rw-modal-foot">
        <span class="rw-section-sub" id="rw-modal-status-text"></span>
        <div class="rw-actions">
          <button class="rw-btn" id="rw-modal-toggle-done" type="button">标记为已完成</button>
          <button class="rw-btn" id="rw-modal-close-btn" type="button">关闭</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 绿色套装详情弹窗 -->
  <div class="rw-modal-backdrop" id="it-set-modal" role="dialog" aria-modal="true" aria-labelledby="it-set-modal-title">
    <div class="rw-modal" style="border-color:rgba(87,219,112,0.5)">
      <div class="rw-modal-head">
        <div>
          <h3 class="rw-modal-title" id="it-set-modal-title" style="color:#67e87a">套装详情</h3>
          <div class="rw-modal-en" id="it-set-modal-en"></div>
        </div>
        <button class="rw-modal-close" id="it-set-modal-close" type="button" aria-label="关闭套装详情">×</button>
      </div>
      <div class="rw-modal-body" id="it-set-modal-body"></div>
      <div class="rw-modal-foot">
        <span class="rw-section-sub" id="it-set-modal-meta"></span>
        <button class="rw-btn" id="it-set-modal-close-btn" type="button">关闭</button>
      </div>
    </div>
  </div>

  <div id="pd-hover-tooltip" class="pd-hover-tooltip" role="tooltip" aria-hidden="true"></div>

  <!-- 原生账号登录与云端存档弹窗（遵循原生 dialog 规范：不添加 role="dialog"/aria-modal） -->
  <dialog class="auth-dialog" id="auth-dialog" closedby="any" aria-labelledby="auth-dialog-title">
    <div class="auth-dlg-head">
      <div class="auth-dlg-head-text">
        <h2 class="auth-dlg-title" id="auth-dialog-title">账号登录 · 云端存档</h2>
      </div>
      <button class="auth-close-btn" id="auth-dialog-close" type="button" aria-label="关闭弹窗">×</button>
    </div>
    <div class="auth-dlg-body">
      <p class="auth-err-msg" id="auth-error-msg" role="alert" aria-live="polite"></p>

      <!-- 未登录视图：账号密码登录 / 注册 + Google 登录 -->
      <div id="auth-guest-view" style="display:flex;flex-direction:column;gap:14px">
        <div class="auth-tabs" role="tablist" aria-label="登录或注册切换">
          <button class="auth-tab-btn active" id="auth-tab-login" type="button" role="tab" aria-selected="true" aria-controls="auth-login-form">账号登录</button>
          <button class="auth-tab-btn" id="auth-tab-register" type="button" role="tab" aria-selected="false" aria-controls="auth-register-form">注册新账号</button>
        </div>

        <form class="auth-form" id="auth-login-form" method="post" action="/api/auth/login">
          <div class="auth-field">
            <label for="auth-login-account">账号或邮箱</label>
            <input class="auth-input" type="text" id="auth-login-account" name="username" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="next" placeholder="输入用户名或邮箱地址" required autofocus />
          </div>
          <div class="auth-field">
            <div class="auth-field-row">
              <label for="auth-login-password">密码</label>
              <button class="auth-link-btn" id="auth-forgot-btn" type="button">忘记密码？用恢复码重置</button>
            </div>
            <div class="auth-pw-wrap">
              <input class="auth-input" type="password" id="auth-login-password" name="password" autocomplete="current-password" enterkeyhint="done" placeholder="输入登录密码" required />
              <button class="auth-pw-toggle" type="button" data-pw-target="auth-login-password" aria-pressed="false">显示</button>
            </div>
          </div>
          <button class="auth-submit-btn" id="auth-login-submit" type="submit">登录账号</button>
        </form>

        <form class="auth-form" id="auth-reset-form" method="post" action="/api/auth/reset-password" style="display:none">
          <div class="auth-hint-box">使用注册时保存的<strong>一次性恢复码（D2R-...）</strong>或站长生成的<strong>15 分钟应急重置码（ADM-...）</strong>重设密码；用光最后 1 个恢复码或使用应急码后，系统会自动补发全新 5 个恢复码。</div>
          <div class="auth-field">
            <label for="auth-reset-account">账号或邮箱</label>
            <input class="auth-input" type="text" id="auth-reset-account" name="username" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="next" placeholder="输入需要重置的用户名或邮箱" required />
          </div>
          <div class="auth-field">
            <label for="auth-reset-code">一次性恢复码 / 管理员应急重置码</label>
            <input class="auth-input" type="text" id="auth-reset-code" name="recovery-code" autocomplete="one-time-code" autocapitalize="characters" autocorrect="off" spellcheck="false" enterkeyhint="next" placeholder="例如：D2R-XXXX-XXXX-XXXX 或 ADM-..." required />
          </div>
          <div class="auth-field">
            <label for="auth-reset-password">设置新密码（至少 8 位）</label>
            <div class="auth-pw-wrap">
              <input class="auth-input" type="password" id="auth-reset-password" name="new-password" autocomplete="new-password" minlength="8" maxlength="128" enterkeyhint="done" placeholder="输入新的登录密码" required />
              <button class="auth-pw-toggle" type="button" data-pw-target="auth-reset-password" aria-pressed="false">显示</button>
            </div>
          </div>
          <button class="auth-submit-btn" id="auth-reset-submit" type="submit">验证恢复码并重设密码</button>
          <button class="rw-btn" id="auth-back-login-btn" type="button">返回账号密码登录</button>
        </form>

        <form class="auth-form" id="auth-register-form" method="post" action="/api/auth/register" style="display:none">
          <div class="auth-field">
            <label for="auth-reg-account">账号或邮箱</label>
            <input class="auth-input" type="text" id="auth-reg-account" name="username" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="next" placeholder="3–32 位账号名，或邮箱地址" required />
          </div>
          <div class="auth-field">
            <label for="auth-reg-name">显示昵称（可选）</label>
            <input class="auth-input" type="text" id="auth-reg-name" name="name" autocomplete="name" maxlength="40" enterkeyhint="next" placeholder="留空则默认使用账号名" />
          </div>
          <div class="auth-field">
            <label for="auth-reg-password">设置密码（至少 8 位）</label>
            <div class="auth-pw-wrap">
              <input class="auth-input" type="password" id="auth-reg-password" name="new-password" autocomplete="new-password" minlength="8" maxlength="128" enterkeyhint="done" placeholder="至少 8 位字符，支持浏览器密码管理器" required />
              <button class="auth-pw-toggle" type="button" data-pw-target="auth-reg-password" aria-pressed="false">显示</button>
            </div>
          </div>
          <button class="auth-submit-btn" id="auth-register-submit" type="submit">创建账号并同步</button>
        </form>

        <div class="auth-divider"><span>或使用第三方账号</span></div>

        <button class="auth-google-btn" id="auth-google-btn" type="button">
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          <span>使用 Google 账号登录</span>
        </button>
        <div class="auth-hint-box" id="auth-google-hint" style="display:none"></div>
        <a class="rw-btn" id="auth-admin-init-link" href="/admin" style="display:none;text-align:center;text-decoration:none">🚀 尚未初始化管理员？前往管理后台完成初始化</a>
      </div>

      <!-- 已登录视图：个人信息、云端双向同步与方案管理 -->
      <div id="auth-account-view" style="display:none;flex-direction:column;gap:14px">
        <div class="auth-profile-card">
          <div id="auth-profile-avatar-wrap"></div>
          <div class="auth-profile-meta">
            <div class="auth-profile-name" id="auth-profile-name" data-no-sweep></div>
            <div class="auth-profile-sub" id="auth-profile-sub" data-no-sweep></div>
            <div class="auth-provider-badges" id="auth-provider-badges"></div>
          </div>
        </div>

        <form id="auth-profile-edit-form" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap" aria-label="修改显示昵称">
          <label for="auth-display-name-input" style="font-size:12px;color:var(--muted);white-space:nowrap">显示昵称</label>
          <input class="auth-input" type="text" id="auth-display-name-input" maxlength="32" placeholder="输入新的昵称（最多 32 字）" style="flex:1;min-width:150px;height:32px;font-size:12.5px" required />
          <button class="rw-btn" id="auth-display-name-save-btn" type="submit" style="height:32px;padding:0 12px;font-size:12px">✏️ 保存昵称</button>
        </form>

        <a class="rw-btn active" id="auth-admin-console-link" href="/admin" style="display:none;text-align:center;text-decoration:none">🛡 进入系统管理后台（全局刷新 / 拉取频率 / 用户管理）</a>

        <div class="auth-recovery-box" id="auth-recovery-box" role="region" aria-label="一次性恢复码">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
            <strong style="font-size:13px;color:#ffe29a" id="auth-recovery-title">🛡 请立即保存你的 5 个一次性恢复码</strong>
          </div>
          <div style="font-size:11.5px;color:#e5d2a7;line-height:1.5" id="auth-recovery-note">忘记密码时可凭任意 1 条重置密码（关闭后不再明文显示）。每个恢复码用完即作废，用光最后一个时系统会自动补发新一批；平时也可在下方「账号安全」中随时重新生成。</div>
          <div class="auth-recovery-grid" id="auth-recovery-grid" data-no-sweep></div>
          <div class="auth-action-row">
            <button class="rw-btn active" id="auth-copy-recovery-btn" type="button">📋 一键复制全部恢复码</button>
            <button class="rw-btn" id="auth-dismiss-recovery-btn" type="button">我已保存，收起</button>
          </div>
        </div>

        <div class="auth-hint-box" id="auth-sync-summary">☁ 登录后，所有 8 职业技能加点、装备配装、背包护符与佣兵配置会自动同步至云端。</div>

        <div class="auth-action-row">
          <button class="rw-btn active" id="auth-upload-now-btn" type="button">☁ 上传本地覆盖云端</button>
          <button class="rw-btn" id="auth-download-now-btn" type="button">⬇ 从云端拉取恢复</button>
        </div>

        <div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <strong style="font-size:13px;color:#f5d58c">云端已保存方案库 (<span id="auth-presets-count">0</span>/30)</strong>
            <span style="font-size:11.5px;color:var(--muted)">同职业可保存多套技能+配装</span>
          </div>
          <div class="auth-presets-list" id="auth-presets-list"></div>
        </div>

        <div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;gap:8px">
            <strong style="font-size:13px;color:#f5d58c">我分享的 BD 短链 (<span id="auth-shares-count">0</span>)</strong>
            <button class="rw-btn" id="auth-shares-refresh-btn" type="button" style="height:24px;padding:0 9px;font-size:11px">🔄 刷新列表</button>
          </div>
          <div class="auth-presets-list" id="auth-shares-list"></div>
        </div>

        <details class="auth-sec-details" id="auth-sec-details">
          <summary>
            <span>🔐 账号安全 · 修改密码与恢复码管理</span>
            <span style="font-size:11.5px;color:#9ad8ff" id="auth-sec-remain-badge">剩余恢复码 0/5</span>
          </summary>
          <div class="auth-sec-body">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
              <span style="font-size:12px;color:var(--muted)" id="auth-sec-codes-desc">忘记密码时可使用恢复码自助重置；重新生成会使旧恢复码立即失效。</span>
              <button class="rw-btn" id="auth-regen-codes-btn" type="button">🔄 重新生成 5 个新恢复码</button>
            </div>
            <form class="auth-form" id="auth-change-pw-form" method="post" action="/api/auth/change-password">
              <div class="auth-hint-box" id="auth-google-pw-hint" style="display:none">当前通过 Google 身份验证登录，无需旧密码即可直接设置或重设登录密码。</div>
              <div class="auth-field" id="auth-cur-pw-wrap">
                <label for="auth-cur-password">当前登录密码</label>
                <div class="auth-pw-wrap">
                  <input class="auth-input" type="password" id="auth-cur-password" name="current-password" autocomplete="current-password" enterkeyhint="next" placeholder="输入当前密码" />
                  <button class="auth-pw-toggle" type="button" data-pw-target="auth-cur-password" aria-pressed="false">显示</button>
                </div>
              </div>
              <div class="auth-field">
                <label for="auth-new-password" id="auth-new-pw-label">新密码（至少 8 位）</label>
                <div class="auth-pw-wrap">
                  <input class="auth-input" type="password" id="auth-new-password" name="new-password" autocomplete="new-password" minlength="8" maxlength="128" enterkeyhint="done" placeholder="输入新的登录密码" required />
                  <button class="auth-pw-toggle" type="button" data-pw-target="auth-new-password" aria-pressed="false">显示</button>
                </div>
              </div>
              <button class="rw-btn active" id="auth-change-pw-submit" type="submit" style="height:34px;font-weight:600">更新登录密码</button>
            </form>
          </div>
        </details>

        <div style="display:flex;justify-content:flex-end;padding-top:6px;border-top:1px solid rgba(213,167,72,0.18)">
          <button class="rw-btn rw-btn-danger" id="auth-logout-btn" type="button">退出当前账号</button>
        </div>
      </div>
    </div>
  </dialog>

  <!-- 完整 BD 公开只读分享短链生成弹窗 -->
  <dialog class="auth-dialog auth-dialog-md" id="bd-share-dialog" closedby="any" aria-labelledby="bd-share-title">
    <div class="auth-dlg-head">
      <div class="auth-dlg-head-text">
        <h3 class="auth-dlg-title" id="bd-share-title">🔗 分享完整 BD（只读公开短链）</h3>
        <div class="auth-dlg-sub">将当前职业的技能加点、10 部位配装、40 格背包与佣兵配置打包生成独立短链，访客可只读查看或一键导入</div>
      </div>
      <button class="auth-close-btn" id="bd-share-close-btn" type="button" aria-label="关闭弹窗">×</button>
    </div>
    <div class="auth-dlg-body">
      <div class="auth-hint-box" id="bd-share-preview-box">正在汇总当前职业技能与配装…</div>
      <div class="auth-err-msg" id="bd-share-error" role="alert"></div>
      <form class="auth-form" id="bd-share-form">
        <div class="auth-field">
          <label for="bd-share-name-input">BD 标题</label>
          <input class="auth-input" type="text" id="bd-share-name-input" maxlength="60" placeholder="例如：圣骑士 Lv.90 悔恨+精神 狂热盾击" required />
        </div>
        <div class="auth-field">
          <label for="bd-share-notes-input">玩法心得 / 备注（选填，最多 400 字）</label>
          <textarea class="auth-input" id="bd-share-notes-input" maxlength="400" rows="3" style="height:auto;padding:10px 12px;resize:vertical" placeholder="可填写加点思路、档位要点、刷图场景等…"></textarea>
        </div>
        <button class="rw-btn active" id="bd-share-create-btn" type="submit" style="height:40px;font-weight:700">✨ 生成公开分享短链</button>
      </form>
      <div id="bd-share-result-box" style="display:none;flex-direction:column;gap:10px;padding:14px 16px;border-radius:12px;border:1px solid rgba(103,232,122,0.45);background:rgba(20,56,30,0.35)">
        <div style="font-size:12.5px;font-weight:700;color:#8af49f">✓ 公开只读短链已生成（永久有效）：</div>
        <input class="auth-input" type="text" id="bd-share-url-output" readonly style="font-family:monospace;font-size:12.5px" />
        <div class="auth-action-row">
          <button class="rw-btn active" id="bd-share-copy-btn" type="button">📋 复制分享短链</button>
          <a class="rw-btn" id="bd-share-open-link" href="#" target="_blank" rel="noopener" style="text-decoration:none">↗ 新标签打开只读展示页</a>
        </div>
      </div>
    </div>
  </dialog>

  <!-- 个人恐怖地带 (TZ) 与地表暗黑 (DClone) 桌面通知 / 声音提醒设置弹窗 -->
  <dialog class="auth-dialog auth-dialog-wide" id="alert-dialog" closedby="any" aria-labelledby="alert-dialog-title">
    <div class="auth-dlg-head">
      <div class="auth-dlg-head-text">
        <h3 class="auth-dlg-title" id="alert-dialog-title">🔔 个人 TZ 与地表暗黑提醒</h3>
        <div class="auth-dlg-sub">页面后台保持打开即可自动检测轮换与进度跃升，支持浏览器桌面弹窗与合成提示音（零依赖、仅保存在本机）</div>
      </div>
      <button class="auth-close-btn" id="alert-close-btn" type="button" aria-label="关闭弹窗">×</button>
    </div>
    <div class="auth-dlg-body">
      <div class="alert-section">
        <div class="alert-section-title">
          <span>📢 提醒通道</span>
          <span id="alert-perm-status" style="font-size:11.5px;color:#9ad8ff">检测通知权限…</span>
        </div>
        <div class="alert-toggle-row">
          <label for="alert-desktop-toggle">
            <input type="checkbox" id="alert-desktop-toggle" />
            <span>开启浏览器桌面通知（Notification API）</span>
          </label>
          <button type="button" class="rw-detail-btn" id="alert-request-perm-btn">请求浏览器通知权限</button>
        </div>
        <div class="alert-toggle-row">
          <label for="alert-sound-toggle">
            <input type="checkbox" id="alert-sound-toggle" checked />
            <span>开启提示音（Web Audio 钟声）</span>
          </label>
          <button type="button" class="rw-btn" id="alert-test-btn" style="padding:3px 10px;font-size:11.5px">🎵 测试提醒</button>
        </div>
      </div>

      <div class="alert-section">
        <div class="alert-section-title">
          <span>🌀 恐怖地带 (TZ) 关注列表 (<span id="alert-tz-count">0</span>)</span>
          <div style="display:flex;gap:5px">
            <button type="button" class="rw-detail-btn" id="alert-tz-pick-s-btn">一键选热门 S 级</button>
            <button type="button" class="rw-detail-btn" id="alert-tz-clear-btn">清空</button>
          </div>
        </div>
        <div class="alert-toggle-row">
          <label for="alert-tz-tier-s">
            <input type="checkbox" id="alert-tz-tier-s" />
            <span>所有 S 级极佳恐怖地带自动提醒</span>
          </label>
          <label for="alert-tz-next-toggle">
            <input type="checkbox" id="alert-tz-next-toggle" checked />
            <span>下阶段预告双提醒（抓取到时 + 切换前 5 分钟各提醒一次）</span>
          </label>
        </div>
        <div class="alert-zones-grid" id="alert-tz-zones-grid">正在加载 37 个恐怖地带…</div>
      </div>

      <div class="alert-section">
        <div class="alert-section-title">
          <span>🔥 地表暗黑 (DClone) 告警条件</span>
        </div>
        <div class="alert-select-grid">
          <label class="auth-field" style="gap:4px">
            <span style="font-size:11.5px;color:var(--muted)">触发阈值</span>
            <select class="sim-select" id="alert-dc-min-progress" style="height:32px;font-size:12px">
              <option value="0">关闭地表暗黑提醒</option>
              <option value="4">达到 4/6 警戒阶段</option>
              <option value="5" selected>达到 5/6 临近入侵（推荐）</option>
              <option value="6">仅 6/6 已入侵触发</option>
            </select>
          </label>
          <label class="auth-field" style="gap:4px">
            <span style="font-size:11.5px;color:var(--muted)">资料片版本</span>
            <select class="sim-select" id="alert-dc-dlc" style="height:32px;font-size:12px">
              <option value="all">全部版本 (术士 + 毁灭)</option>
              <option value="rotw">仅术士君临 (RotW)</option>
              <option value="lod">仅毁灭之王 (LoD)</option>
            </select>
          </label>
          <label class="auth-field" style="gap:4px">
            <span style="font-size:11.5px;color:var(--muted)">监控大区</span>
            <select class="sim-select" id="alert-dc-region" style="height:32px;font-size:12px">
              <option value="all">全部大区 (亚/美/欧)</option>
              <option value="Asia">仅亚区 Asia</option>
              <option value="Americas">仅美区 Americas</option>
              <option value="Europe">仅欧区 Europe</option>
            </select>
          </label>
          <label class="auth-field" style="gap:4px">
            <span style="font-size:11.5px;color:var(--muted)">游戏模式</span>
            <select class="sim-select" id="alert-dc-mode" style="height:32px;font-size:12px">
              <option value="all">全部模式</option>
              <option value="ladder-sc">天梯 SC</option>
              <option value="nl-sc">非天梯 SC</option>
              <option value="ladder-hc">天梯 HC</option>
              <option value="nl-hc">非天梯 HC</option>
            </select>
          </label>
        </div>
      </div>

      <div class="alert-section">
        <div class="alert-section-title">
          <span>📜 本次会话提醒记录</span>
        </div>
        <div class="alert-log-list" id="alert-history-list">
          <div style="color:var(--muted)">暂无触发记录（开启通道后，轮换命中将自动记录在此）</div>
        </div>
      </div>
    </div>
  </dialog>

  <!-- 本地离线 .d2s 角色存档解析导入弹窗 -->
  <dialog class="auth-dialog auth-dialog-md" id="d2s-import-dialog" closedby="any" aria-labelledby="d2s-import-title">
    <div class="auth-dlg-head">
      <div class="auth-dlg-head-text">
        <h3 class="auth-dlg-title" id="d2s-import-title">📂 导入本地 .d2s 单机角色存档</h3>
        <div class="auth-dlg-sub">🔒 100% 浏览器本地离线解析（不上传任何文件），支持 D2 LoD / D2R 2.6 / D2R 3.4 术士存档</div>
      </div>
      <button class="auth-close-btn" id="d2s-import-close-btn" type="button" aria-label="关闭弹窗">×</button>
    </div>
    <div class="auth-dlg-body">
      <div class="alert-section" id="d2s-dropzone" style="border-style:dashed;text-align:center;padding:22px 18px">
        <div style="font-size:13.5px;color:#ffe08c;font-weight:700">选择或拖拽单机角色 <code>.d2s</code> 存档文件</div>
        <div style="font-size:12px;color:var(--muted)">通常位于 <code>Saved Games\\Diablo II Resurrected\\角色名.d2s</code></div>
        <div style="margin-top:8px">
          <input type="file" id="d2s-file-input" accept=".d2s" style="display:none" />
          <button type="button" class="rw-btn active" id="d2s-pick-file-btn">选择 .d2s 文件</button>
        </div>
      </div>
      <div class="auth-err-msg" id="d2s-import-error" role="alert"></div>
      <div id="d2s-preview-panel" style="display:none;flex-direction:column;gap:12px">
        <div class="alert-section" id="d2s-preview-summary"></div>
        <div class="alert-section">
          <div class="alert-section-title"><span>导入选项</span></div>
          <div class="alert-toggle-row">
            <label for="d2s-opt-skills"><input type="checkbox" id="d2s-opt-skills" checked /><span>导入全部 30 项技能加点至技能树</span></label>
          </div>
          <div class="alert-toggle-row">
            <label for="d2s-opt-stats"><input type="checkbox" id="d2s-opt-stats" checked /><span>导入角色等级、裸四维分配与佣兵类型</span></label>
          </div>
          <div class="alert-toggle-row">
            <label for="d2s-opt-gear"><input type="checkbox" id="d2s-opt-gear" /><span>覆盖导入已解析的装备、副手与背包</span></label>
          </div>
        </div>
        <button type="button" class="rw-btn active" id="d2s-confirm-import-btn" style="height:40px;font-weight:700">✓ 确认导入至模拟器</button>
      </div>
    </div>
  </dialog>

  <!-- 角色个人仓库 (.d2s) 与 共享仓库堆叠专页 (.d2i) 配置弹窗 -->
  <dialog class="auth-dialog auth-dialog-lg" id="pd-stash-dialog" closedby="any" aria-labelledby="pd-stash-title">
    <div class="auth-dlg-head">
      <div class="auth-dlg-head-text">
        <h3 class="auth-dlg-title" id="pd-stash-title">📦 仓库物品配置 &amp; D2R 3.4 共享仓库 (.d2i) 堆叠导出</h3>
        <div class="auth-dlg-sub">🔒 100% 浏览器本地离线生成：个人仓库随 <code>.d2s</code> 导出，1–99 堆叠符文/宝石/材料写入共享仓库 <code>.d2i</code> 专页</div>
      </div>
      <button class="auth-close-btn" id="pd-stash-close-btn" type="button" aria-label="关闭弹窗">×</button>
    </div>
    <div class="auth-dlg-body" style="gap:12px">
      <div class="stash-mode-tabs" role="tablist">
        <button type="button" class="rw-btn active" id="stash-tab-personal" data-stash-tab="personal" role="tab" aria-selected="true">🎒 指定仓库物品（10×10，随 .d2s / .d2i 导出）</button>
        <button type="button" class="rw-btn" id="stash-tab-shared" data-stash-tab="shared" role="tab" aria-selected="false">💎 共享仓库 .d2i（原生 1–99 堆叠符文/宝石/材料）</button>
      </div>

      <!-- Tab 1: 指定仓库物品（用于 .d2s 个人仓库 & 可选注入 .d2i 共享页） -->
      <div id="stash-pane-personal" class="stash-pane">
        <div class="alert-section" style="gap:10px">
          <div class="alert-section-title">
            <span>➕ 添加指定装备到仓库列表</span>
            <span id="stash-personal-usage" style="font-size:11.5px;color:#ffd573">0 件 · 占 0/100 格</span>
          </div>
          <div class="stash-picker-row">
            <select id="stash-add-cat" class="rw-select" aria-label="物品类别">
              <option value="unique">暗金装备 (Unique)</option>
              <option value="rw">符文之语 (Runeword)</option>
              <option value="set">绿色套装 (Set)</option>
              <option value="base">精选无形/带孔底材</option>
              <option value="stack">单件符文/宝石/材料</option>
            </select>
            <input type="search" id="stash-add-search" class="rw-input" placeholder="搜索物品中文或英文名..." autocomplete="off" />
          </div>
          <div class="stash-picker-row">
            <select id="stash-add-item" class="rw-select" style="flex:2" aria-label="选择物品"></select>
            <select id="stash-add-base" class="rw-select" style="flex:1;display:none" aria-label="选择底材"></select>
            <label id="stash-add-eth-wrap" class="stash-inline-check"><input type="checkbox" id="stash-add-eth" /><span>无形</span></label>
            <button type="button" class="rw-btn active" id="stash-add-btn">+ 放入仓库</button>
          </div>
          <div class="stash-quick-row">
            <button type="button" class="rw-btn" id="stash-quick-char-btn">⚡ 导入当前角色全身装备</button>
            <button type="button" class="rw-btn" id="stash-quick-merc-btn">⚔️ 导入当前佣兵装备</button>
            <button type="button" class="rw-btn" id="stash-clear-personal-btn">🧹 清空列表</button>
          </div>
        </div>
        <div id="stash-personal-list" class="stash-item-list"></div>
        <div class="stash-foot-bar">
          <span style="font-size:11.5px;color:var(--muted)">💡 列表中的物品会自动随「导出 .d2s」装入角色个人仓库（10×10 格自动排版不重叠），也可在右侧标签页一键注入共享仓库 .d2i。</span>
          <button type="button" class="rw-btn active" id="stash-export-d2s-now-btn" style="white-space:nowrap">💾 立即导出含仓库的 .d2s</button>
        </div>
      </div>

      <!-- Tab 2: 共享仓库 .d2i 堆叠导出（支持增量合并现有 .d2i） -->
      <div id="stash-pane-shared" class="stash-pane" style="display:none">
        <div class="alert-section" style="gap:8px">
          <div class="alert-section-title">
            <span>📂 增量合并你现有的 .d2i（推荐，不覆盖原仓库）</span>
            <span id="d2i-base-status" style="font-size:11.5px;color:var(--muted)">当前：生成全新共享仓库</span>
          </div>
          <div class="stash-quick-row" style="align-items:center">
            <input type="file" id="d2i-base-input" accept=".d2i" style="display:none" />
            <button type="button" class="rw-btn" id="d2i-pick-base-btn">📂 载入现有 ModernSharedStash*.d2i</button>
            <button type="button" class="rw-btn" id="d2i-clear-base-btn" style="display:none">× 清除基准文件</button>
            <span style="font-size:11.5px;color:var(--muted)">保留原有 5 页装备、堆叠库存与编年史进度，仅叠加下方修改</span>
          </div>
          <div class="auth-err-msg" id="d2i-error-msg" role="alert"></div>
        </div>

        <div class="alert-section" style="gap:8px">
          <div class="alert-section-title">
            <span>⚡ 一键堆叠套餐（D2R 3.4 专页原生 1–99 堆叠）</span>
            <span id="d2i-stack-summary" style="font-size:11.5px;color:#9bf4ae">已配置 0 种 · 共 0 个</span>
          </div>
          <div class="stash-quick-row">
            <button type="button" class="rw-btn" data-d2i-preset="runes-all">🪙 全 33 符文 ×99</button>
            <button type="button" class="rw-btn" data-d2i-preset="runes-hr">🪙 高号 20#–33# ×99</button>
            <button type="button" class="rw-btn" data-d2i-preset="gems-perfect">💎 7系完美宝石+骷髅 ×99</button>
            <button type="button" class="rw-btn" data-d2i-preset="mats-all">🔑 3.4全材料(钥匙/器官/精华/洗点/碎片/雕像/大紫) ×99</button>
            <button type="button" class="rw-btn" data-d2i-preset="all-99">✨ 全部 91 种 ×99</button>
            <button type="button" class="rw-btn" data-d2i-preset="clear">🧹 清空堆叠</button>
          </div>
          <div class="stash-picker-row">
            <div class="stash-cat-pills" id="d2i-cat-pills">
              <button type="button" class="rw-btn active" data-d2i-cat="all">全部</button>
              <button type="button" class="rw-btn" data-d2i-cat="rune">符文(33)</button>
              <button type="button" class="rw-btn" data-d2i-cat="pgem">完美宝石(7)</button>
              <button type="button" class="rw-btn" data-d2i-cat="gem">全部宝石(35)</button>
              <button type="button" class="rw-btn" data-d2i-cat="mat">3.4材料/钥匙(21)</button>
              <button type="button" class="rw-btn" data-d2i-cat="pot">紫药(2)</button>
              <button type="button" class="rw-btn" data-d2i-cat="selected">已选</button>
            </div>
            <input type="search" id="d2i-stack-search" class="rw-input" placeholder="搜索符文/宝石/材料..." autocomplete="off" style="max-width:200px" />
          </div>
          <div id="d2i-stack-grid" class="d2i-stack-grid"></div>
        </div>

        <div class="alert-section" style="gap:8px">
          <div class="stash-picker-row" style="align-items:center;flex-wrap:wrap">
            <label class="stash-inline-check">
              <input type="checkbox" id="d2i-include-gear" checked />
              <span>同时将「指定仓库物品」(<span id="d2i-gear-count">0</span> 件) 注入共享仓库第</span>
            </label>
            <select id="d2i-target-tab" class="rw-select" style="width:auto;min-width:72px">
              <option value="0">1 页</option>
              <option value="1">2 页</option>
              <option value="2">3 页</option>
              <option value="3">4 页</option>
              <option value="4">5 页</option>
            </select>
            <label class="stash-inline-check" style="margin-left:auto">
              <span>模式：</span>
              <select id="d2i-mode-select" class="rw-select" style="width:auto">
                <option value="sc">普通 (ModernSharedStashSoftCoreV2.d2i)</option>
                <option value="hc">专家 (ModernSharedStashHardCoreV2.d2i)</option>
              </select>
            </label>
          </div>
        </div>

        <div class="stash-foot-bar">
          <span style="font-size:11.5px;color:var(--muted)">⚠️ 覆盖游戏目录 <code>Saved Games\\Diablo II Resurrected\\ModernSharedStashSoftCoreV2.d2i</code> 前建议先备份原文件。</span>
          <button type="button" class="rw-btn active" id="d2i-export-btn" style="white-space:nowrap;font-weight:700">💾 导出共享仓库 .d2i</button>
        </div>
      </div>
    </div>
  </dialog>

  <div class="auth-toast" id="auth-toast" role="status" aria-live="polite"></div>

  <script id="d2r-initial-auth" type="application/json">${ssrInitialAuthJson}</script>
  <script type="module" src="/assets/js/core.js?v=${DASHBOARD_JS_VERSION}"></script>
</body>
</html>`;
}
