function escapeAdmHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function serializeSafeAdmJson(val) {
  return JSON.stringify(val ?? null)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function renderAdminDashboard(options = {}) {
  const initAuth = options && options.initialAuth ? options.initialAuth : null;
  const activePage = options && options.activePage === "users" ? "users" : "settings";

  const ssrView = !initAuth
    ? "loading"
    : !initAuth.adminInitialized
      ? "bootstrap"
      : !initAuth.authenticated
        ? "login"
        : !initAuth.isAdmin
          ? "forbidden"
          : "console";

  const ssrUser = initAuth && initAuth.authenticated && initAuth.user ? initAuth.user : null;
  const ssrUserLabel = ssrUser
    ? `${initAuth.isAdmin ? "🛡 管理员：" : "👤 用户："}${escapeAdmHtml(ssrUser.displayName || ssrUser.username || ssrUser.email)}`
    : "";
  const ssrBootstrapJson = serializeSafeAdmJson({ initialAuth: initAuth, activePage });
  const isUsersPage = activePage === "users";
  const pageTitle = isUsersPage
    ? "用户管理与详情 · 暗黑 2 重置版管理后台"
    : "系统设置与概览 · 暗黑 2 重置版管理后台";

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${pageTitle}</title>
  <style>
    :root {
      --bg: #0f0c09;
      --panel: #19140f;
      --line: rgba(213, 167, 72, 0.28);
      --gold: #e7bc64;
      --gold-bright: #ffe3a3;
      --text: #f3ead8;
      --muted: #b7a992;
      --ok: #67e87a;
      --danger: #f06d5b;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
      background: radial-gradient(circle at 20% 0%, #24190f 0%, var(--bg) 52%);
      color: var(--text);
      min-height: 100vh;
    }
    .adm-shell {
      width: min(100% - 28px, 1220px);
      margin: 0 auto;
      padding: 22px 0 48px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .adm-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 14px;
      padding: 16px 20px;
      border-radius: 14px;
      border: 1px solid var(--line);
      background: linear-gradient(135deg, rgba(44, 31, 16, 0.92), rgba(21, 16, 12, 0.95));
    }
    .adm-eyebrow { margin: 0 0 4px; font-size: 11px; letter-spacing: 0.14em; color: var(--gold); text-transform: uppercase; }
    .adm-title { margin: 0; font-size: 21px; color: var(--gold-bright); }
    .adm-head-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 9px; }
    .adm-nav {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 6px;
      border-bottom: 1px solid rgba(213, 167, 72, 0.24);
      overflow-x: auto;
    }
    .adm-nav-link {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 10px 16px;
      color: var(--muted);
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      white-space: nowrap;
      flex: none;
    }
    .adm-nav-link:hover { color: var(--text); }
    .adm-nav-link[aria-current="page"] {
      color: var(--gold-bright);
    }
    .adm-nav-link[aria-current="page"]::after {
      content: "";
      position: absolute;
      inset: auto 0 0;
      border-block-end: 3px solid var(--gold);
    }
    .adm-btn, .adm-link-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      height: 34px;
      padding: 0 13px;
      border-radius: 8px;
      border: 1px solid rgba(213, 167, 72, 0.42);
      background: rgba(255, 255, 255, 0.05);
      color: #f3e4c3;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      white-space: nowrap;
    }
    .adm-btn:hover:not(:disabled), .adm-link-btn:hover { background: rgba(213, 167, 72, 0.16); border-color: rgba(240, 198, 116, 0.78); }
    .adm-btn:disabled { opacity: 0.55; cursor: not-allowed; }
    .adm-btn-primary {
      border-color: rgba(244, 198, 102, 0.72);
      background: linear-gradient(180deg, #b8842a, #7d5416);
      color: #fff6e0;
    }
    .adm-btn-danger { border-color: rgba(240, 109, 91, 0.52); color: #ffb9af; background: rgba(240, 109, 91, 0.12); }
    .adm-btn-sm { height: 28px; padding: 0 9px; font-size: 12px; }
    .adm-card {
      padding: 18px 20px;
      border-radius: 14px;
      border: 1px solid var(--line);
      background: linear-gradient(180deg, rgba(31, 24, 17, 0.94), rgba(18, 14, 10, 0.96));
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .adm-card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(213, 167, 72, 0.18);
    }
    .adm-card-title { margin: 0; font-size: 16.5px; color: var(--gold-bright); }
    .adm-card-sub { font-size: 12.5px; color: var(--muted); margin: 0; line-height: 1.55; }
    .adm-narrow { width: min(100%, 490px); margin: 16px auto; }
    .adm-form { display: flex; flex-direction: column; gap: 12px; }
    .adm-field { display: flex; flex-direction: column; gap: 5px; }
    .adm-field label { font-size: 12.5px; color: #dfd1b8; font-weight: 600; }
    .adm-input, .adm-select {
      width: 100%;
      height: 36px;
      padding: 0 11px;
      border-radius: 8px;
      border: 1px solid rgba(213, 167, 72, 0.36);
      background: rgba(8, 6, 5, 0.85);
      color: var(--text);
      font-size: 13.5px;
    }
    .adm-input:focus-visible, .adm-select:focus-visible { outline: 2px solid var(--gold); outline-offset: 1px; }
    .adm-pw-wrap { display: flex; gap: 6px; }
    .adm-pw-wrap .adm-input { flex: 1; }
    .adm-grid-kpi { display: grid; grid-template-columns: repeat(auto-fit, minmax(175px, 1fr)); gap: 12px; }
    .adm-kpi {
      padding: 13px 14px;
      border-radius: 10px;
      border: 1px solid rgba(213, 167, 72, 0.22);
      background: rgba(0, 0, 0, 0.28);
    }
    .adm-kpi-label { font-size: 12px; color: var(--muted); }
    .adm-kpi-val { font-size: 20px; font-weight: 700; color: var(--gold-bright); margin-top: 4px; word-break: break-word; }
    .adm-kpi-meta { font-size: 11.5px; color: #9fc5ec; margin-top: 3px; }
    .adm-settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px; }
    .adm-setting-box {
      padding: 15px;
      border-radius: 11px;
      border: 1px solid rgba(213, 167, 72, 0.24);
      background: rgba(0, 0, 0, 0.26);
      display: flex;
      flex-direction: column;
      gap: 11px;
    }
    .adm-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
    .adm-chip {
      height: 30px;
      padding: 0 11px;
      border-radius: 7px;
      border: 1px solid rgba(213, 167, 72, 0.34);
      background: rgba(255, 255, 255, 0.04);
      color: #e4d4b7;
      font-size: 12.5px;
      cursor: pointer;
    }
    .adm-chip.active { background: rgba(213, 167, 72, 0.26); border-color: var(--gold); color: var(--gold-bright); font-weight: 700; }
    .adm-switch { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: var(--text); }
    .adm-alert {
      padding: 10px 12px;
      border-radius: 9px;
      border: 1px solid rgba(240, 109, 91, 0.45);
      background: rgba(240, 109, 91, 0.14);
      color: #ffc2b8;
      font-size: 13px;
      display: none;
    }
    .adm-alert.show { display: block; }
    .adm-alert.ok { border-color: rgba(103, 232, 122, 0.45); background: rgba(103, 232, 122, 0.12); color: #ccf7d2; }
    .adm-recovery-box {
      padding: 14px;
      border-radius: 10px;
      border: 1px solid rgba(244, 198, 102, 0.65);
      background: rgba(66, 46, 16, 0.48);
      display: none;
      flex-direction: column;
      gap: 10px;
    }
    .adm-recovery-box.show { display: flex; }
    .adm-codes-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(195px, 1fr)); gap: 7px; }
    .adm-code-pill {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      padding: 7px 10px;
      border-radius: 7px;
      background: rgba(0, 0, 0, 0.55);
      border: 1px solid rgba(213, 167, 72, 0.35);
      color: #ffe8ad;
      text-align: center;
      user-select: all;
    }
    .adm-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 11.5px;
      font-weight: 600;
      border: 1px solid rgba(213, 167, 72, 0.38);
      background: rgba(213, 167, 72, 0.14);
      color: #f6dc9b;
    }
    .adm-badge.ok { border-color: rgba(103, 232, 122, 0.45); background: rgba(103, 232, 122, 0.14); color: #b7f5c0; }
    .adm-badge.danger { border-color: rgba(240, 109, 91, 0.55); background: rgba(240, 109, 91, 0.16); color: #ffbdb4; }
    .adm-badge.muted { border-color: rgba(255, 255, 255, 0.18); background: rgba(255, 255, 255, 0.06); color: var(--muted); }

    /* Native Modal Dialogs */
    dialog.adm-dialog {
      width: min(92vw, 660px);
      max-height: 88vh;
      margin: auto;
      padding: 0;
      border: 1px solid rgba(213, 167, 72, 0.52);
      border-radius: 16px;
      background:
        radial-gradient(circle at 85% 0%, rgba(213, 167, 72, 0.1) 0, transparent 280px),
        linear-gradient(180deg, #1d1610, #120d0a);
      color: var(--text);
      box-shadow: 0 28px 72px rgba(0, 0, 0, 0.88), inset 0 1px 0 rgba(255, 224, 150, 0.14);
      overflow: hidden;
    }
    dialog.adm-dialog[open] { display: flex; flex-direction: column; }
    dialog.adm-dialog:modal { overscroll-behavior: contain; }
    dialog.adm-dialog::backdrop {
      background: rgba(4, 3, 2, 0.76);
      backdrop-filter: blur(6px);
      overflow: hidden;
      overscroll-behavior: contain;
    }
    .adm-dlg-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 18px 24px 15px;
      border-bottom: 1px solid rgba(213, 167, 72, 0.22);
      background: linear-gradient(180deg, rgba(213, 167, 72, 0.09), rgba(213, 167, 72, 0.02));
      flex-shrink: 0;
    }
    .adm-dlg-head .adm-btn-sm {
      width: 32px;
      height: 32px;
      padding: 0;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      line-height: 1;
      border-radius: 9px;
    }
    .adm-dlg-body { padding: 20px 24px 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
    .adm-detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; }
    .adm-detail-box {
      padding: 10px 12px;
      border-radius: 9px;
      border: 1px solid rgba(213, 167, 72, 0.22);
      background: rgba(0, 0, 0, 0.3);
      font-size: 12.5px;
      line-height: 1.55;
    }

    /* Responsive Table (sticky headers + @container stacked cards) */
    .table-wrapper {
      overflow: auto;
      max-inline-size: 100%;
      max-block-size: min(560px, 75vh);
      container-type: inline-size;
      border-radius: 10px;
      border: 1px solid rgba(213, 167, 72, 0.24);
      background: rgba(0, 0, 0, 0.25);
    }
    .table-wrapper:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
    .adm-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 13px;
      --label-2: "角色与状态";
      --label-3: "登录方式";
      --label-4: "恢复码";
      --label-5: "云端存档";
      --label-6: "注册时间";
      --label-7: "管理操作";
    }
    .adm-table caption {
      text-align: left;
      padding: 10px 12px;
      font-size: 12.5px;
      color: var(--muted);
      border-bottom: 1px solid rgba(213, 167, 72, 0.18);
    }
    .adm-table thead { position: sticky; inset-block-start: 0; z-index: 1; }
    .adm-table thead th {
      background: #231b13;
      color: var(--gold-bright);
      text-align: left;
      padding: 10px 12px;
      font-weight: 700;
      border-bottom: 1px solid rgba(213, 167, 72, 0.3);
      white-space: nowrap;
    }
    .adm-table tbody th, .adm-table tbody td {
      padding: 10px 12px;
      border-bottom: 1px solid rgba(213, 167, 72, 0.14);
      vertical-align: middle;
      text-align: left;
    }
    .adm-table tbody th {
      position: sticky;
      inset-inline-start: 0;
      background: #17120d;
      font-weight: 600;
      color: #f6e7c6;
    }
    @container (width < 760px) {
      .adm-table, .adm-table thead, .adm-table tbody, .adm-table tr, .adm-table th, .adm-table td { display: block; }
      .adm-table thead { display: none; }
      .adm-table tr {
        margin: 10px;
        border: 1px solid rgba(213, 167, 72, 0.28);
        border-radius: 10px;
        overflow: hidden;
        background: rgba(18, 14, 10, 0.9);
      }
      .adm-table tbody th {
        position: sticky;
        inset-block-start: 0;
        z-index: 2;
        background: #251c14;
        border-bottom: 1px solid rgba(213, 167, 72, 0.24);
      }
      .adm-table tbody td { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
      .adm-table tbody td:nth-child(2)::before { content: var(--label-2) ": "; color: var(--muted); font-size: 12px; }
      .adm-table tbody td:nth-child(3)::before { content: var(--label-3) ": "; color: var(--muted); font-size: 12px; }
      .adm-table tbody td:nth-child(4)::before { content: var(--label-4) ": "; color: var(--muted); font-size: 12px; }
      .adm-table tbody td:nth-child(5)::before { content: var(--label-5) ": "; color: var(--muted); font-size: 12px; }
      .adm-table tbody td:nth-child(6)::before { content: var(--label-6) ": "; color: var(--muted); font-size: 12px; }
      .adm-table tbody td:nth-child(7)::before { content: var(--label-7) ": "; color: var(--muted); font-size: 12px; }
    }
  </style>
</head>
<body>
  <main class="adm-shell">
    <header class="adm-header">
      <div>
        <p class="adm-eyebrow">Diablo II: Resurrected · Sanctuary Admin Console</p>
        <h1 class="adm-title">🛡 庇护之地管理后台</h1>
      </div>
      <div class="adm-head-actions">
        <span class="adm-badge" id="adm-user-badge" style="display:${ssrUser ? "inline-flex" : "none"}">${ssrUserLabel}</span>
        <a class="adm-link-btn" href="/">← 返回主仪表盘</a>
        <button class="adm-btn adm-btn-danger" id="adm-logout-btn" type="button" style="display:${ssrUser ? "inline-flex" : "none"}">退出登录</button>
      </div>
    </header>

    <div class="adm-alert" id="adm-global-alert" role="alert" aria-live="polite"></div>

    <!-- 视图 0：加载中（仅在无 SSR 上下文时展示） -->
    <section class="adm-card adm-narrow" id="adm-loading-view" style="display:${ssrView === "loading" ? "flex" : "none"}">
      <p class="adm-card-sub" style="text-align:center">正在校验管理员状态与系统配置…</p>
    </section>

    <!-- 视图 1：首次初始化管理员账号 -->
    <section class="adm-card adm-narrow" id="adm-bootstrap-view" style="display:${ssrView === "bootstrap" ? "flex" : "none"}">
      <div class="adm-card-head">
        <h2 class="adm-card-title">🚀 初始化首个管理员账号</h2>
        <span class="adm-badge">一次性引导</span>
      </div>
      <p class="adm-card-sub">当前系统尚未初始化任何管理员。创建后该初始化入口将自动永久关闭，并签发 5 个一次性恢复码。</p>
      <div id="adm-promote-box" style="display:${ssrUser && !initAuth?.isAdmin ? "block" : "none"};padding:10px 12px;border-radius:9px;border:1px solid rgba(103,232,122,0.35);background:rgba(103,232,122,0.08)">
        <p class="adm-card-sub" id="adm-promote-desc" style="color:#d6f5df;margin-bottom:8px"></p>
        <button class="adm-btn adm-btn-primary" id="adm-promote-btn" type="button" style="width:100%">直接将当前登录账号升级为管理员</button>
      </div>
      <form class="adm-form" id="adm-bootstrap-form" method="post" action="/api/admin/bootstrap">
        <div class="adm-field" id="adm-boot-token-wrap" style="display:${initAuth?.requiresTokenForBootstrap ? "flex" : "none"}">
          <label for="adm-boot-token">服务端管理令牌（MANUAL_TRIGGER_TOKEN）</label>
          <input class="adm-input" type="password" id="adm-boot-token" name="bootstrapToken" autocomplete="off" placeholder="验证站点所有权后方可初始化" ${initAuth?.requiresTokenForBootstrap ? "required" : ""} />
        </div>
        <div class="adm-field">
          <label for="adm-boot-account">管理员账号或邮箱</label>
          <input class="adm-input" type="text" id="adm-boot-account" name="username" value="admin" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="next" required />
        </div>
        <div class="adm-field">
          <label for="adm-boot-name">管理员昵称</label>
          <input class="adm-input" type="text" id="adm-boot-name" name="name" value="庇护之地管理员" autocomplete="name" maxlength="40" enterkeyhint="next" />
        </div>
        <div class="adm-field">
          <label for="adm-boot-password">设置管理员密码（至少 8 位）</label>
          <div class="adm-pw-wrap">
            <input class="adm-input" type="password" id="adm-boot-password" name="new-password" autocomplete="new-password" minlength="8" maxlength="128" enterkeyhint="done" placeholder="请输入强密码" required />
            <button class="adm-btn" type="button" data-pw-target="adm-boot-password" aria-pressed="false">显示</button>
          </div>
        </div>
        <button class="adm-btn adm-btn-primary" id="adm-boot-submit" type="submit" style="height:40px">初始化管理员账号并进入后台</button>
      </form>
    </section>

    <!-- 视图 2：管理员登录 -->
    <section class="adm-card adm-narrow" id="adm-login-view" style="display:${ssrView === "login" ? "flex" : "none"}">
      <div class="adm-card-head"><h2 class="adm-card-title">🔐 管理员登录</h2></div>
      <p class="adm-card-sub">请使用管理员账号密码登录以管理系统设置、DC 后台拉取频率与用户数据。</p>
      <form class="adm-form" id="adm-login-form" method="post" action="/api/auth/login">
        <div class="adm-field">
          <label for="adm-login-account">管理员账号或邮箱</label>
          <input class="adm-input" type="text" id="adm-login-account" name="username" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="next" required />
        </div>
        <div class="adm-field">
          <label for="adm-login-password">密码</label>
          <div class="adm-pw-wrap">
            <input class="adm-input" type="password" id="adm-login-password" name="password" autocomplete="current-password" enterkeyhint="done" required />
            <button class="adm-btn" type="button" data-pw-target="adm-login-password" aria-pressed="false">显示</button>
          </div>
        </div>
        <button class="adm-btn adm-btn-primary" id="adm-login-submit" type="submit" style="height:40px">登录管理后台</button>
      </form>
      <button class="adm-btn" id="adm-google-login-btn" type="button" style="display:${initAuth?.googleEnabled ? "inline-flex" : "none"};width:100%;height:38px">使用已绑定的 Google 管理员账号登录</button>
    </section>

    <!-- 视图 3：非管理员无权限提示 -->
    <section class="adm-card adm-narrow" id="adm-forbidden-view" style="display:${ssrView === "forbidden" ? "flex" : "none"}">
      <div class="adm-card-head"><h2 class="adm-card-title">⛔ 需要管理员权限</h2></div>
      <p class="adm-card-sub" id="adm-forbidden-desc">当前登录账号为普通用户，无法访问系统设置与用户管理后台。</p>
      <div class="adm-row">
        <button class="adm-btn adm-btn-danger" id="adm-switch-account-btn" type="button">退出并切换管理员账号</button>
        <a class="adm-link-btn" href="/">返回主仪表盘</a>
      </div>
    </section>

    <!-- 视图 4：完整管理后台控制台 -->
    <div id="adm-console-view" style="display:${ssrView === "console" ? "flex" : "none"};flex-direction:column;gap:16px">
      <!-- 真实页面导航栏（非 ARIA tablist，遵循语义导航规范） -->
      <nav class="adm-nav" aria-label="管理后台导航">
        <a class="adm-nav-link" href="/admin" ${!isUsersPage ? 'aria-current="page"' : ""}>⚙ 系统设置与运行概览</a>
        <a class="adm-nav-link" href="/admin/users" ${isUsersPage ? 'aria-current="page"' : ""}>👥 用户管理与详情查看</a>
      </nav>

      <!-- 一次性恢复码提示区 -->
      <section class="adm-recovery-box" id="adm-recovery-box" role="region" aria-label="一次性恢复码">
        <strong style="color:#ffe29a;font-size:14px" id="adm-recovery-title">🛡 请立即保存以下 5 个一次性恢复码（关闭后不再明文显示）：</strong>
        <div class="adm-codes-grid" id="adm-recovery-grid"></div>
        <div class="adm-row">
          <button class="adm-btn adm-btn-primary adm-btn-sm" id="adm-copy-codes-btn" type="button">📋 一键复制全部恢复码</button>
          <button class="adm-btn adm-btn-sm" id="adm-dismiss-codes-btn" type="button">我已妥善保存，收起</button>
        </div>
      </section>

      <!-- 子页面 A：/admin 系统设置与概览 -->
      <div id="adm-page-settings" style="display:${isUsersPage ? "none" : "flex"};flex-direction:column;gap:16px">
        <section class="adm-card" aria-label="系统运行状态">
          <div class="adm-card-head">
            <h2 class="adm-card-title">📊 系统运行状态与集成诊断</h2>
            <div class="adm-row">
              <a class="adm-link-btn adm-btn-sm" href="/admin/users">👥 前往用户管理</a>
              <button class="adm-btn adm-btn-primary adm-btn-sm" id="adm-sync-now-btn" type="button">⚡ 立即同步 DC 与恐怖地带</button>
              <button class="adm-btn adm-btn-sm" id="adm-refresh-all-btn" type="button">🔄 刷新状态</button>
            </div>
          </div>
          <div class="adm-grid-kpi">
            <div class="adm-kpi"><div class="adm-kpi-label">注册用户总数</div><div class="adm-kpi-val" id="kpi-users">-</div><div class="adm-kpi-meta" id="kpi-admins">管理员 - 位</div></div>
            <div class="adm-kpi"><div class="adm-kpi-label">云端存档活跃用户</div><div class="adm-kpi-val" id="kpi-builds">-</div><div class="adm-kpi-meta">含技能加点或纸娃娃配装</div></div>
            <div class="adm-kpi"><div class="adm-kpi-label">当前恐怖地带</div><div class="adm-kpi-val" id="kpi-tz" style="font-size:16px">-</div><div class="adm-kpi-meta" id="kpi-checked">最近同步：-</div></div>
            <div class="adm-kpi"><div class="adm-kpi-label">集成与密钥状态</div><div class="adm-row" id="kpi-integrations" style="margin-top:6px"></div></div>
          </div>
          <div class="adm-row" style="justify-content:space-between;padding-top:4px;border-top:1px solid rgba(213,167,72,0.14)">
            <span class="adm-card-sub" id="adm-oauth-uri-hint"></span>
            <button class="adm-btn adm-btn-sm" id="adm-copy-oauth-uri-btn" type="button">复制 Google 回调地址</button>
          </div>
        </section>

        <section class="adm-card settings-module" aria-label="系统设置">
          <div class="adm-card-head">
            <h2 class="adm-card-title">⚙ 系统同步与刷新设置</h2>
            <span class="adm-badge ok">管理员会话直连 · 无需手填管理令牌</span>
          </div>
          <div class="adm-settings-grid">
            <div class="adm-setting-box">
              <div class="adm-row" style="justify-content:space-between">
                <strong style="color:#f5d58c;font-size:14.5px">页面数据自动刷新（全局默认）</strong>
                <label class="adm-switch">
                  <input type="checkbox" id="adm-auto-refresh-toggle" />
                  <span>开启自动刷新</span>
                </label>
              </div>
              <p class="adm-card-sub">控制前台页面按设定间隔重新读取 KV；恐怖区域切换待确认时每 15 秒读取一次，确认后恢复设定间隔。不会直接请求 D2RuneWizard，也不会整页重载。</p>
              <div class="adm-row" id="adm-auto-chips">
                <button class="adm-chip" type="button" data-auto-min="1">1 分</button>
                <button class="adm-chip" type="button" data-auto-min="2">2 分</button>
                <button class="adm-chip" type="button" data-auto-min="3">3 分</button>
                <button class="adm-chip" type="button" data-auto-min="4">4 分</button>
                <button class="adm-chip" type="button" data-auto-min="5">5 分</button>
                <input class="adm-input" id="adm-auto-minutes" type="number" min="1" max="1440" step="1" inputmode="numeric" aria-label="页面自动刷新分钟数" style="width:92px;height:30px" />
                <span class="adm-card-sub">分钟</span>
              </div>
            </div>

            <div class="adm-setting-box">
              <div class="adm-row" style="justify-content:space-between">
                <strong style="color:#f5d58c;font-size:14.5px">DC 后台接口拉取间隔</strong>
                <span class="adm-badge" id="adm-pull-current-badge">当前 - 分钟</span>
              </div>
              <p class="adm-card-sub">控制 Worker Cron 拉取 24 组地表暗黑进度的频率（1–1440 分钟）；恐怖区域仍按整点、半点独立同步。</p>
              <div class="adm-row">
                <label for="adm-pull-interval" class="adm-card-sub">拉取间隔：</label>
                <input class="adm-input" id="adm-pull-interval" type="number" min="1" max="1440" step="1" inputmode="numeric" style="width:110px;height:34px" />
                <span class="adm-card-sub">分钟</span>
              </div>
            </div>
          </div>
          <div class="adm-row" style="justify-content:space-between">
            <span class="adm-card-sub" id="adm-settings-status">修改后点击保存即可全站生效。</span>
            <button class="adm-btn adm-btn-primary" id="adm-save-settings-btn" type="button">💾 保存系统设置</button>
          </div>
        </section>

        <section class="adm-card" id="adm-audit-section" aria-label="管理后台操作审计日志">
          <div class="adm-card-head">
            <h2 class="adm-card-title">📋 管理操作审计日志（最近 100 条）</h2>
            <button class="adm-btn adm-btn-sm" id="adm-audit-refresh-btn" type="button">🔄 刷新日志</button>
          </div>
          <div tabindex="0" role="region" aria-labelledby="adm-audit-caption" class="table-wrapper">
            <table class="adm-table" style="--label-2:'操作人';--label-3:'动作';--label-4:'目标';--label-5:'详情';--label-6:'来源 IP'">
              <caption id="adm-audit-caption">记录管理员设置变更、手动同步与用户账号敏感操作</caption>
              <thead>
                <tr>
                  <th scope="col">操作时间</th>
                  <th scope="col">操作人</th>
                  <th scope="col">动作类型</th>
                  <th scope="col">目标对象</th>
                  <th scope="col">操作明细</th>
                  <th scope="col">来源 IP</th>
                </tr>
              </thead>
              <tbody id="adm-audit-tbody">
                <tr><td colspan="6" style="color:var(--muted);text-align:center">正在加载审计日志…</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- 子页面 B：/admin/users 专属用户管理与详情页面 -->
      <div id="adm-page-users" style="display:${isUsersPage ? "flex" : "none"};flex-direction:column;gap:16px">
        <div class="adm-grid-kpi">
          <div class="adm-kpi"><div class="adm-kpi-label">总注册用户</div><div class="adm-kpi-val" id="ukpi-total">-</div></div>
          <div class="adm-kpi"><div class="adm-kpi-label">管理员账号</div><div class="adm-kpi-val" id="ukpi-admins">-</div></div>
          <div class="adm-kpi"><div class="adm-kpi-label">正常可用账号</div><div class="adm-kpi-val" id="ukpi-active">-</div></div>
          <div class="adm-kpi"><div class="adm-kpi-label">已禁用账号</div><div class="adm-kpi-val" id="ukpi-disabled">-</div></div>
          <div class="adm-kpi"><div class="adm-kpi-label">含云端存档</div><div class="adm-kpi-val" id="ukpi-builds">-</div></div>
        </div>

        <section class="adm-card" aria-label="用户管理与详情列表">
          <div class="adm-card-head">
            <h2 class="adm-card-title">👥 用户管理与云端存档查看</h2>
            <div class="adm-row">
              <button class="adm-btn adm-btn-primary adm-btn-sm" id="adm-open-create-user-btn" type="button">➕ 新建用户账号</button>
              <button class="adm-btn adm-btn-sm" id="adm-reload-users-btn" type="button">🔄 刷新列表</button>
            </div>
          </div>

          <search>
            <div class="adm-row" style="justify-content:space-between">
              <div class="adm-row" style="flex:1;min-width:240px">
                <input class="adm-input" id="adm-user-search" type="search" placeholder="🔍 搜索账号、邮箱、昵称或用户 ID…" aria-label="搜索用户" style="max-width:320px;height:34px" />
                <select class="adm-select" id="adm-user-role-filter" aria-label="按角色筛选" style="width:128px;height:34px">
                  <option value="all">全部角色</option>
                  <option value="admin">仅管理员</option>
                  <option value="user">仅普通用户</option>
                </select>
                <select class="adm-select" id="adm-user-status-filter" aria-label="按状态筛选" style="width:138px;height:34px">
                  <option value="all">全部状态</option>
                  <option value="active">仅正常账号</option>
                  <option value="disabled">仅已禁用</option>
                  <option value="has-builds">含云端存档</option>
                </select>
              </div>
              <span class="adm-card-sub" id="adm-users-filter-count"></span>
            </div>
          </search>

          <div class="adm-row">
            <label for="adm-quick-reset-account" class="adm-card-sub">快捷签发 15 分钟应急重置码：</label>
            <input class="adm-input" id="adm-quick-reset-account" type="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="输入用户名或邮箱" style="width:220px;height:32px" />
            <button class="adm-btn adm-btn-sm" id="adm-quick-reset-btn" type="button">🔑 生成重置码</button>
            <button class="adm-btn adm-btn-sm" id="adm-copy-reset-btn" type="button" style="display:none">复制重置码</button>
          </div>
          <div class="adm-alert" id="adm-reset-result-box" role="status" aria-live="polite"></div>

          <div tabindex="0" role="region" aria-labelledby="adm-users-caption" class="table-wrapper">
            <table class="adm-table">
              <caption id="adm-users-caption">已注册用户目录、权限状态与云端技能/装备存档统计</caption>
              <thead>
                <tr>
                  <th scope="col">用户账号 / 昵称</th>
                  <th scope="col">角色与状态</th>
                  <th scope="col">登录方式</th>
                  <th scope="col">恢复码</th>
                  <th scope="col">云端存档</th>
                  <th scope="col">注册时间</th>
                  <th scope="col">管理操作</th>
                </tr>
              </thead>
              <tbody id="adm-users-tbody">
                <tr><td colspan="7" style="color:var(--muted);text-align:center">正在加载用户列表…</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </main>

  <!-- 原生弹窗 1：用户详情与云端技能/装备查看 -->
  <dialog class="adm-dialog" id="adm-user-detail-dialog" closedby="any" aria-labelledby="adm-detail-title">
    <div class="adm-dlg-head">
      <h2 class="adm-card-title" id="adm-detail-title">用户详情</h2>
      <button class="adm-btn adm-btn-sm" id="adm-detail-close-btn" type="button" aria-label="关闭详情">×</button>
    </div>
    <div class="adm-dlg-body" id="adm-detail-body">正在读取用户详情…</div>
  </dialog>

  <!-- 原生弹窗 2：管理员新建用户 -->
  <dialog class="adm-dialog" id="adm-create-user-dialog" closedby="any" aria-labelledby="adm-create-title" style="width:min(94vw,460px)">
    <div class="adm-dlg-head">
      <h2 class="adm-card-title" id="adm-create-title">➕ 新建用户账号</h2>
      <button class="adm-btn adm-btn-sm" id="adm-create-close-btn" type="button" aria-label="关闭弹窗">×</button>
    </div>
    <div class="adm-dlg-body">
      <div class="adm-alert" id="adm-create-err" role="alert" aria-live="polite"></div>
      <form class="adm-form" id="adm-create-user-form" method="post" action="/api/admin/users">
        <div class="adm-field">
          <label for="adm-cu-account">登录账号或邮箱</label>
          <input class="adm-input" type="text" id="adm-cu-account" name="username" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" required autofocus />
        </div>
        <div class="adm-field">
          <label for="adm-cu-name">显示昵称（可选）</label>
          <input class="adm-input" type="text" id="adm-cu-name" name="name" autocomplete="name" maxlength="40" />
        </div>
        <div class="adm-field">
          <label for="adm-cu-role">账号角色</label>
          <select class="adm-select" id="adm-cu-role" name="role">
            <option value="user">普通用户（可保存云端技能与装备）</option>
            <option value="admin">系统管理员（可访问 /admin 管理后台）</option>
          </select>
        </div>
        <div class="adm-field">
          <label for="adm-cu-password">初始密码（至少 8 位）</label>
          <div class="adm-pw-wrap">
            <input class="adm-input" type="password" id="adm-cu-password" name="new-password" autocomplete="new-password" minlength="8" maxlength="128" required />
            <button class="adm-btn" type="button" data-pw-target="adm-cu-password" aria-pressed="false">显示</button>
          </div>
        </div>
        <button class="adm-btn adm-btn-primary" id="adm-cu-submit" type="submit" style="height:38px">创建账号并生成 5 个恢复码</button>
      </form>
    </div>
  </dialog>

  <!-- 原生弹窗 3：删除用户二次确认（安全操作 Cancel 置 autofocus） -->
  <dialog class="adm-dialog" id="adm-delete-dialog" aria-labelledby="adm-del-title" style="width:min(94vw,430px)">
    <div class="adm-dlg-head">
      <h2 class="adm-card-title" id="adm-del-title" style="color:#ffb9af">⚠ 确认删除用户账号</h2>
      <button class="adm-btn adm-btn-sm" id="adm-del-close-btn" type="button" aria-label="关闭确认">×</button>
    </div>
    <div class="adm-dlg-body">
      <p class="adm-card-sub" id="adm-del-desc" style="color:#f3ead8"></p>
      <p class="adm-card-sub">删除后将同时清除该用户的账号索引与所有云端技能/装备存档及方案，此操作不可撤销。</p>
      <div class="adm-row" style="justify-content:flex-end">
        <button class="adm-btn" id="adm-del-cancel-btn" type="button" autofocus>取消</button>
        <button class="adm-btn adm-btn-danger" id="adm-del-confirm-btn" type="button">确认永久删除</button>
      </div>
    </div>
  </dialog>

  <script id="d2r-admin-ssr" type="application/json">${ssrBootstrapJson}</script>
  <script>
    const CLASS_LABELS = {
      ama: "亚马逊", ass: "刺客", nec: "死灵法师", bar: "野蛮人",
      pal: "圣骑士", sor: "法师", dru: "德鲁伊", war: "术士"
    };

    let admStatus = null;
    let admActivePage = "settings";
    let admAllUsers = [];
    let admLatestRecoveryCodes = [];
    let admLatestResetCode = "";
    let admPendingDeleteUser = null;

    function showAlert(msg, isOk) {
      const el = document.getElementById("adm-global-alert");
      if (!el) return;
      if (!msg) { el.textContent = ""; el.className = "adm-alert"; return; }
      el.textContent = String(msg);
      el.className = "adm-alert show" + (isOk ? " ok" : "");
    }

    function showResetBanner(msg, code, isOk) {
      const el = document.getElementById("adm-reset-result-box");
      const copyBtn = document.getElementById("adm-copy-reset-btn");
      admLatestResetCode = code || "";
      if (copyBtn) copyBtn.style.display = admLatestResetCode ? "inline-flex" : "none";
      if (!el) return;
      if (!msg) { el.textContent = ""; el.className = "adm-alert"; return; }
      el.textContent = String(msg);
      el.className = "adm-alert show" + (isOk ? " ok" : "");
    }

    function showRecoveryCodes(codes, titleText) {
      const box = document.getElementById("adm-recovery-box");
      const grid = document.getElementById("adm-recovery-grid");
      const title = document.getElementById("adm-recovery-title");
      admLatestRecoveryCodes = Array.isArray(codes) ? codes.slice() : [];
      if (!box || !grid) return;
      if (!admLatestRecoveryCodes.length) {
        box.classList.remove("show");
        grid.textContent = "";
        return;
      }
      if (title && titleText) title.textContent = titleText;
      grid.textContent = "";
      admLatestRecoveryCodes.forEach(c => {
        const div = document.createElement("div");
        div.className = "adm-code-pill";
        div.textContent = c;
        grid.appendChild(div);
      });
      box.classList.add("show");
    }

    function setActiveView(viewName) {
      ["adm-loading-view", "adm-bootstrap-view", "adm-login-view", "adm-forbidden-view", "adm-console-view"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = id === ("adm-" + viewName + "-view") ? "flex" : "none";
      });
    }

    function syncAutoChips(minutes) {
      document.querySelectorAll("#adm-auto-chips [data-auto-min]").forEach(btn => {
        btn.classList.toggle("active", Number(btn.getAttribute("data-auto-min")) === Number(minutes));
      });
    }

    function fmtTime(iso) {
      if (!iso) return "暂无记录";
      try {
        const d = new Date(iso);
        return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleString("zh-CN", { hour12: false });
      } catch (e) {
        return String(iso);
      }
    }

    function addStatusBadge(parent, label, ok) {
      const span = document.createElement("span");
      span.className = "adm-badge " + (ok ? "ok" : "muted");
      span.textContent = (ok ? "✓ " : "○ ") + label;
      parent.appendChild(span);
    }

    function updateUserKpis(users) {
      const total = users.length;
      const admins = users.filter(u => u.role === "admin").length;
      const disabled = users.filter(u => u.disabled).length;
      const active = total - disabled;
      const withBuilds = users.filter(u => u.skillClassCount > 0 || u.equipClassCount > 0 || u.presetCount > 0 || u.grailCount > 0 || u.runewordsCount > 0).length;
      const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = String(v); };
      setTxt("ukpi-total", total);
      setTxt("ukpi-admins", admins);
      setTxt("ukpi-active", active);
      setTxt("ukpi-disabled", disabled);
      setTxt("ukpi-builds", withBuilds);
    }

    function getFilteredUsers() {
      const q = (document.getElementById("adm-user-search")?.value || "").trim().toLowerCase();
      const roleF = document.getElementById("adm-user-role-filter")?.value || "all";
      const statusF = document.getElementById("adm-user-status-filter")?.value || "all";
      return admAllUsers.filter(u => {
        if (roleF !== "all" && u.role !== roleF) return false;
        if (statusF === "active" && u.disabled) return false;
        if (statusF === "disabled" && !u.disabled) return false;
        if (statusF === "has-builds" && !(u.skillClassCount > 0 || u.equipClassCount > 0 || u.presetCount > 0 || u.grailCount > 0 || u.runewordsCount > 0)) return false;
        if (q) {
          const hay = [u.displayName, u.username, u.email, u.id].filter(Boolean).join(" ").toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
    }

    function renderUsersTable() {
      const tbody = document.getElementById("adm-users-tbody");
      const countEl = document.getElementById("adm-users-filter-count");
      if (!tbody) return;
      const rows = getFilteredUsers();
      if (countEl) countEl.textContent = "显示 " + rows.length + " / " + admAllUsers.length + " 位用户";
      tbody.textContent = "";

      if (!rows.length) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 7;
        td.style.color = "var(--muted)";
        td.style.textAlign = "center";
        td.textContent = admAllUsers.length ? "没有匹配当前筛选条件的用户" : "暂无注册用户";
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
      }

      const selfId = admStatus?.user?.id || "";
      rows.forEach(u => {
        const tr = document.createElement("tr");
        const isSelf = u.id === selfId;

        const th = document.createElement("th");
        th.setAttribute("scope", "row");
        const nameDiv = document.createElement("div");
        nameDiv.textContent = (u.displayName || u.username || u.email || u.id) + (isSelf ? "（当前账号）" : "");
        const subDiv = document.createElement("div");
        subDiv.style.fontSize = "11.5px";
        subDiv.style.color = "var(--muted)";
        subDiv.textContent = [u.username, u.email].filter(Boolean).join(" · ") || u.id.slice(0, 8);
        th.appendChild(nameDiv);
        th.appendChild(subDiv);
        tr.appendChild(th);

        const tdRole = document.createElement("td");
        const badgeRow = document.createElement("div");
        badgeRow.className = "adm-row";
        const rb = document.createElement("span");
        rb.className = "adm-badge " + (u.role === "admin" ? "ok" : "muted");
        rb.textContent = u.role === "admin" ? "管理员" : "普通用户";
        badgeRow.appendChild(rb);
        if (u.disabled) {
          const db = document.createElement("span");
          db.className = "adm-badge danger";
          db.textContent = "已禁用";
          badgeRow.appendChild(db);
        }
        tdRole.appendChild(badgeRow);
        tr.appendChild(tdRole);

        const tdProv = document.createElement("td");
        const provs = [];
        if (u.providers && u.providers.includes("password")) provs.push("密码");
        if (u.providers && u.providers.includes("google")) provs.push("Google");
        tdProv.textContent = provs.join(" + ") || "未知";
        tr.appendChild(tdProv);

        const tdCodes = document.createElement("td");
        tdCodes.textContent = String(u.recoveryCodesRemaining || 0) + " / 5";
        tr.appendChild(tdCodes);

        const tdBuilds = document.createElement("td");
        tdBuilds.textContent = "技能 " + (u.skillClassCount || 0) + " · 装备 " + (u.equipClassCount || 0) + " · " + (u.presetCount || 0) + " 方案 · 圣杯 " + (u.grailCount || 0) + " · 符文 " + (u.runewordsCount || 0);
        tr.appendChild(tdBuilds);

        const tdCreated = document.createElement("td");
        tdCreated.style.fontSize = "12px";
        tdCreated.style.color = "var(--muted)";
        tdCreated.textContent = fmtTime(u.createdAt);
        tr.appendChild(tdCreated);

        const tdAct = document.createElement("td");
        const actWrap = document.createElement("div");
        actWrap.className = "adm-row";

        const viewBtn = document.createElement("button");
        viewBtn.type = "button";
        viewBtn.className = "adm-btn adm-btn-sm adm-btn-primary";
        viewBtn.textContent = "👁 详情";
        viewBtn.addEventListener("click", () => openUserDetailModal(u.id));
        actWrap.appendChild(viewBtn);

        const resetBtn = document.createElement("button");
        resetBtn.type = "button";
        resetBtn.className = "adm-btn adm-btn-sm";
        resetBtn.textContent = "🔑 重置码";
        resetBtn.addEventListener("click", () => issueResetForUserId(u.id, u.displayName || u.username || u.email));
        actWrap.appendChild(resetBtn);

        if (!isSelf) {
          const statusBtn = document.createElement("button");
          statusBtn.type = "button";
          statusBtn.className = "adm-btn adm-btn-sm";
          statusBtn.textContent = u.disabled ? "启用" : "禁用";
          statusBtn.addEventListener("click", () => toggleUserDisabled(u.id, !u.disabled));
          actWrap.appendChild(statusBtn);

          const delBtn = document.createElement("button");
          delBtn.type = "button";
          delBtn.className = "adm-btn adm-btn-sm adm-btn-danger";
          delBtn.textContent = "删除";
          delBtn.addEventListener("click", () => openDeleteConfirm(u));
          actWrap.appendChild(delBtn);
        }

        tdAct.appendChild(actWrap);
        tr.appendChild(tdAct);
        tbody.appendChild(tr);
      });
    }

    async function loadSettingsOverviewData() {
      const res = await fetch("/api/admin/overview", { credentials: "same-origin", cache: "no-store" });
      const ov = await res.json();
      if (!res.ok || !ov.ok) throw new Error(ov.error || "加载系统概览失败");
      document.getElementById("kpi-users").textContent = String(ov.stats.totalUsers);
      document.getElementById("kpi-admins").textContent = "管理员 " + ov.stats.adminCount + " 位";
      document.getElementById("kpi-builds").textContent = String(ov.stats.usersWithBuilds);
      document.getElementById("kpi-tz").textContent = ov.runtime.currentTerrorZone || "暂无数据";
      document.getElementById("kpi-checked").textContent = "最近同步：" + fmtTime(ov.runtime.lastCheckedAt);

      const intBox = document.getElementById("kpi-integrations");
      intBox.textContent = "";
      addStatusBadge(intBox, "Google 登录", ov.runtime.googleOAuthConfigured);
      addStatusBadge(intBox, "飞书通知", ov.runtime.feishuWebhookConfigured);
      addStatusBadge(intBox, "管理令牌", ov.runtime.manualTokenConfigured);
      if (ov.runtime.storageBackend && ov.runtime.storageBackend.label) {
        addStatusBadge(intBox, "存储: " + ov.runtime.storageBackend.label, ov.runtime.storageBackend.backend !== "none");
      }

      document.getElementById("adm-oauth-uri-hint").textContent =
        "Google OAuth 回调地址：" + window.location.origin + "/api/auth/google/callback";
      document.getElementById("adm-auto-refresh-toggle").checked = Boolean(ov.settings.pageAutoRefreshEnabled);
      document.getElementById("adm-auto-minutes").value = String(ov.settings.pageAutoRefreshMinutes);
      syncAutoChips(ov.settings.pageAutoRefreshMinutes);
      document.getElementById("adm-pull-interval").value = String(ov.settings.pullIntervalMinutes);
      document.getElementById("adm-pull-current-badge").textContent = "当前 " + ov.settings.pullIntervalMinutes + " 分钟";
      await loadAdminAuditLogs();
    }

    const AUDIT_ACTION_LABELS = {
      "admin.bootstrap": "初始化管理员",
      "settings.update": "修改系统设置",
      "sync.manual": "手动全服同步",
      "user.create": "新建用户",
      "user.role": "变更角色",
      "user.status": "启用/禁用账号",
      "user.reset_code": "签发重置码",
      "user.revoke_sessions": "吊销会话",
      "user.delete": "删除账号"
    };

    async function loadAdminAuditLogs() {
      const tbody = document.getElementById("adm-audit-tbody");
      if (!tbody) return;
      try {
        const res = await fetch("/api/admin/audit-logs", { credentials: "same-origin", cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "加载审计日志失败");
        const logs = Array.isArray(data.logs) ? data.logs : [];
        tbody.textContent = "";
        if (!logs.length) {
          const tr = document.createElement("tr");
          const td = document.createElement("td");
          td.colSpan = 6;
          td.style.color = "var(--muted)";
          td.style.textAlign = "center";
          td.textContent = "暂无审计记录";
          tr.appendChild(td);
          tbody.appendChild(tr);
          return;
        }
        logs.forEach(item => {
          const tr = document.createElement("tr");
          const th = document.createElement("th");
          th.setAttribute("scope", "row");
          th.textContent = fmtTime(item.time);
          tr.appendChild(th);

          const cols = [
            item.actor || "-",
            AUDIT_ACTION_LABELS[item.action] || item.action || "-",
            item.target || "-",
            item.summary || "-",
            item.ip || "-"
          ];
          cols.forEach((val, idx) => {
            const td = document.createElement("td");
            if (idx === 1) {
              const b = document.createElement("span");
              b.className = "adm-badge " + (item.action === "user.delete" ? "err" : "ok");
              b.textContent = val;
              td.appendChild(b);
            } else {
              td.textContent = val;
            }
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
      } catch (err) {
        tbody.textContent = "";
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 6;
        td.style.color = "#ff9b8f";
        td.textContent = err.message || "读取审计日志失败";
        tr.appendChild(td);
        tbody.appendChild(tr);
      }
    }

    async function loadUsersPageData() {
      const res = await fetch("/api/admin/users", { credentials: "same-origin", cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "读取用户列表失败");
      admAllUsers = Array.isArray(data.users) ? data.users : [];
      updateUserKpis(admAllUsers);
      renderUsersTable();
    }

    async function loadCurrentPageData() {
      if (admActivePage === "users") {
        await loadUsersPageData();
      } else {
        await loadSettingsOverviewData();
      }
    }

    function attachDialogLightDismiss(dlg) {
      if (!dlg || typeof HTMLDialogElement === "undefined" || ("closedBy" in HTMLDialogElement.prototype)) return;
      if (dlg.getAttribute("closedby") !== "any") return;
      const isOutside = (e) => {
        const r = dlg.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      let downOut = false;
      dlg.addEventListener("pointerdown", (e) => { downOut = isOutside(e); });
      dlg.addEventListener("pointerup", (e) => {
        if (downOut && isOutside(e)) dlg.close();
        downOut = false;
      });
    }

    async function issueResetForUserId(userId, label) {
      showResetBanner("正在为「" + label + "」生成 15 分钟应急重置码…", "", false);
      try {
        const res = await fetch("/api/admin/users/" + encodeURIComponent(userId) + "/reset-token", {
          method: "POST",
          credentials: "same-origin"
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "生成失败");
        showResetBanner(
          "已为「" + data.account + "」生成 15 分钟一次性重置码：" + data.resetCode + "（发给用户在首页登录窗「忘记密码」中使用）",
          data.resetCode,
          true
        );
      } catch (err) {
        showResetBanner(err.message || "生成应急重置码失败", "", false);
      }
    }

    async function toggleUserRole(userId, nextRole) {
      showAlert("", false);
      try {
        const res = await fetch("/api/admin/users/" + encodeURIComponent(userId) + "/role", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ role: nextRole })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "修改角色失败");
        showAlert("已更新用户角色为：" + (nextRole === "admin" ? "管理员" : "普通用户"), true);
        await loadUsersPageData();
      } catch (err) {
        showAlert(err.message || "修改角色失败", false);
      }
    }

    async function toggleUserDisabled(userId, disabled) {
      showAlert("", false);
      try {
        const res = await fetch("/api/admin/users/" + encodeURIComponent(userId) + "/status", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ disabled: Boolean(disabled) })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "更新账号状态失败");
        showAlert(disabled ? "已禁用该账号并强制下线其所有会话" : "已重新启用该账号", true);
        await loadUsersPageData();
      } catch (err) {
        showAlert(err.message || "更新账号状态失败", false);
      }
    }

    async function revokeUserSessions(userId) {
      showAlert("", false);
      try {
        const res = await fetch("/api/admin/users/" + encodeURIComponent(userId) + "/revoke-sessions", {
          method: "POST",
          credentials: "same-origin"
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "强制下线失败");
        showAlert("已吊销该用户在所有设备上的登录会话", true);
      } catch (err) {
        showAlert(err.message || "强制下线失败", false);
      }
    }

    function openDeleteConfirm(user) {
      admPendingDeleteUser = user;
      const dlg = document.getElementById("adm-delete-dialog");
      const desc = document.getElementById("adm-del-desc");
      if (desc) {
        const label = user.displayName || user.username || user.email || user.id;
        desc.textContent = "确定要永久删除账号「" + label + "」（" + (user.username || user.email || user.id.slice(0, 8)) + "）吗？";
      }
      if (dlg && !dlg.open) dlg.showModal();
    }

    async function openUserDetailModal(userId) {
      const dlg = document.getElementById("adm-user-detail-dialog");
      const title = document.getElementById("adm-detail-title");
      const body = document.getElementById("adm-detail-body");
      if (!dlg || !body) return;
      if (title) title.textContent = "用户详情";
      body.textContent = "正在读取用户资料与云端存档明细…";
      if (!dlg.open) dlg.showModal();

      try {
        const res = await fetch("/api/admin/users/" + encodeURIComponent(userId), {
          credentials: "same-origin",
          cache: "no-store"
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "读取用户详情失败");
        const u = data.user;
        const b = data.builds || { classes: [], presets: [] };
        const isSelf = u.id === (admStatus?.user?.id || "");
        if (title) title.textContent = "👤 用户详情 · " + (u.displayName || u.username || u.email || u.id.slice(0, 8));
        body.textContent = "";

        const metaGrid = document.createElement("div");
        metaGrid.className = "adm-detail-grid";
        const addMetaBox = (heading, lines) => {
          const box = document.createElement("div");
          box.className = "adm-detail-box";
          const h = document.createElement("strong");
          h.style.color = "var(--gold-bright)";
          h.textContent = heading;
          box.appendChild(h);
          lines.forEach(t => {
            const p = document.createElement("div");
            p.textContent = t;
            box.appendChild(p);
          });
          metaGrid.appendChild(box);
        };
        addMetaBox("基础身份信息", [
          "用户 ID：" + u.id,
          "用户名：" + (u.username || "未设置"),
          "邮箱：" + (u.email || "未绑定"),
          "昵称：" + (u.displayName || "-")
        ]);
        addMetaBox("权限与安全状态", [
          "角色：" + (u.role === "admin" ? "系统管理员" : "普通用户") + (isSelf ? "（当前账号）" : ""),
          "状态：" + (u.disabled ? "已禁用" : "正常可用"),
          "登录方式：" + ((u.providers || []).join(" + ") || "未知"),
          "剩余恢复码：" + (u.recoveryCodesRemaining || 0) + " / 5 · 会话版本 v" + (u.sessionVersion || 1),
          "注册时间：" + fmtTime(u.createdAt)
        ]);
        body.appendChild(metaGrid);

        // Quick management action bar
        const actRow = document.createElement("div");
        actRow.className = "adm-row";
        const mkBtn = (label, cls, fn) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "adm-btn adm-btn-sm " + (cls || "");
          btn.textContent = label;
          btn.addEventListener("click", fn);
          actRow.appendChild(btn);
        };
        mkBtn("🔑 签发 15 分钟重置码", "adm-btn-primary", () => {
          issueResetForUserId(u.id, u.displayName || u.username || u.email);
          dlg.close();
        });
        mkBtn("🚪 强制踢下线", "", () => revokeUserSessions(u.id));
        if (!isSelf) {
          mkBtn(u.role === "admin" ? "降为普通用户" : "设为管理员", "", async () => {
            await toggleUserRole(u.id, u.role === "admin" ? "user" : "admin");
            await openUserDetailModal(u.id);
          });
          mkBtn(u.disabled ? "启用账号" : "禁用账号", "", async () => {
            await toggleUserDisabled(u.id, !u.disabled);
            await openUserDetailModal(u.id);
          });
          mkBtn("🗑 删除账号", "adm-btn-danger", () => {
            dlg.close();
            openDeleteConfirm(u);
          });
        }
        body.appendChild(actRow);

        // Cloud builds breakdown
        const clsTitle = document.createElement("strong");
        clsTitle.style.color = "#f5d58c";
        clsTitle.textContent = "☁ 云端职业技能与装备存档（最近同步：" + fmtTime(b.updatedAt) + "）";
        body.appendChild(clsTitle);

        if (!b.classes || !b.classes.length) {
          const empty = document.createElement("p");
          empty.className = "adm-card-sub";
          empty.textContent = "该用户尚未上传任何职业技能或装备数据。";
          body.appendChild(empty);
        } else {
          const clsGrid = document.createElement("div");
          clsGrid.className = "adm-detail-grid";
          b.classes.forEach(c => {
            const box = document.createElement("div");
            box.className = "adm-detail-box";
            const h = document.createElement("strong");
            h.style.color = "#9ad8ff";
            h.textContent = (CLASS_LABELS[c.classId] || c.classId) + (c.charLvl ? (" · Lv." + c.charLvl) : "");
            box.appendChild(h);
            const skLine = document.createElement("div");
            skLine.textContent = "技能点：" + c.skillPoints + " 点" + (c.topSkills.length ? ("（" + c.topSkills.slice(0, 4).map(s => s.key + " " + s.pts).join(" / ") + "）") : "");
            box.appendChild(skLine);
            const eqLine = document.createElement("div");
            eqLine.textContent = c.hasPaperdoll
              ? ("装备槽位：" + c.equippedSlotsCount + " 件 · 背包护符 " + c.charmCount + " 件" + (c.mercVariant ? (" · 佣兵 " + c.mercVariant) : ""))
              : "暂无纸娃娃装备数据";
            box.appendChild(eqLine);
            clsGrid.appendChild(box);
          });
          body.appendChild(clsGrid);
        }

        // Grail & Runewords summary
        const colTitle = document.createElement("strong");
        colTitle.style.color = "#f5d58c";
        colTitle.textContent = "🏆 圣杯收集与符文之语记事";
        body.appendChild(colTitle);
        const colBox = document.createElement("div");
        colBox.className = "adm-detail-box";
        const gU = b.grail ? (b.grail.uniquesCount || 0) : 0;
        const gS = b.grail ? (b.grail.setPiecesCount || 0) : 0;
        const rwC = b.runewordsCount || 0;
        colBox.textContent = "圣杯暗金 " + gU + " 件 · 圣杯套装部件 " + gS + " 件（合计 " + (gU + gS) + " 件） · 符文之语已完成 " + rwC + " / 99 个";
        body.appendChild(colBox);

        // Saved presets
        const preTitle = document.createElement("strong");
        preTitle.style.color = "#f5d58c";
        preTitle.textContent = "📁 命名方案库（" + (b.presets ? b.presets.length : 0) + " 套）";
        body.appendChild(preTitle);

        if (!b.presets || !b.presets.length) {
          const emptyP = document.createElement("p");
          emptyP.className = "adm-card-sub";
          emptyP.textContent = "该用户尚未保存命名配装方案。";
          body.appendChild(emptyP);
        } else {
          b.presets.forEach(p => {
            const row = document.createElement("div");
            row.className = "adm-detail-box";
            row.textContent = "[" + (CLASS_LABELS[p.classId] || p.classId) + "] " + p.name + " · 技能 " + p.skillPoints + " 点 · " + (p.hasPaperdoll ? "含装备" : "仅技能") + " · " + fmtTime(p.updatedAt);
            body.appendChild(row);
          });
        }
      } catch (err) {
        body.textContent = err.message || "加载用户详情失败";
      }
    }

    async function applyAdminStatus(data, extraRecoveryCodes) {
      admStatus = data;
      const userBadge = document.getElementById("adm-user-badge");
      const logoutBtn = document.getElementById("adm-logout-btn");
      if (data.authenticated && data.user) {
        userBadge.style.display = "inline-flex";
        userBadge.textContent = (data.isAdmin ? "🛡 管理员：" : "👤 用户：") + (data.user.displayName || data.user.username || data.user.email);
        logoutBtn.style.display = "inline-flex";
      } else {
        userBadge.style.display = "none";
        logoutBtn.style.display = "none";
      }

      if (!data.adminInitialized) {
        setActiveView("bootstrap");
        const tokWrap = document.getElementById("adm-boot-token-wrap");
        const tokInp = document.getElementById("adm-boot-token");
        if (tokWrap) tokWrap.style.display = data.requiresTokenForBootstrap ? "flex" : "none";
        if (tokInp) tokInp.required = Boolean(data.requiresTokenForBootstrap);
        const promBox = document.getElementById("adm-promote-box");
        const promDesc = document.getElementById("adm-promote-desc");
        if (promBox && promDesc && data.authenticated && data.user) {
          promBox.style.display = "block";
          promDesc.textContent = "你当前已登录账号「" + (data.user.displayName || data.user.username || data.user.email) + "」，可直接将其升级为首个管理员：";
        } else if (promBox) {
          promBox.style.display = "none";
        }
        return;
      }

      if (!data.authenticated) {
        setActiveView("login");
        const gBtn = document.getElementById("adm-google-login-btn");
        if (gBtn) gBtn.style.display = data.googleEnabled ? "inline-flex" : "none";
        return;
      }

      if (!data.isAdmin) {
        setActiveView("forbidden");
        const desc = document.getElementById("adm-forbidden-desc");
        if (desc) {
          desc.textContent = "当前账号「" + (data.user.displayName || data.user.username || data.user.email) + "」为普通用户，无权访问系统设置与用户管理后台。";
        }
        return;
      }

      setActiveView("console");
      if (Array.isArray(extraRecoveryCodes) && extraRecoveryCodes.length) {
        showRecoveryCodes(extraRecoveryCodes, "🛡 管理员账号已初始化！请立即保存以下 5 个一次性恢复码：");
      }
      await loadCurrentPageData();
    }

    async function loadAdminStatus(extraRecoveryCodes) {
      showAlert("", false);
      try {
        const res = await fetch("/api/admin/status", { credentials: "same-origin", cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "读取后台状态失败");
        await applyAdminStatus(data, extraRecoveryCodes);
      } catch (err) {
        showAlert(err.message || "初始化管理后台失败", false);
      }
    }

    // Wire native dialogs
    const detailDlg = document.getElementById("adm-user-detail-dialog");
    const createDlg = document.getElementById("adm-create-user-dialog");
    const delDlg = document.getElementById("adm-delete-dialog");
    [detailDlg, createDlg].forEach(attachDialogLightDismiss);
    [detailDlg, createDlg, delDlg].forEach(dlg => {
      if (dlg) dlg.addEventListener("close", () => { dlg.returnValue = ""; });
    });
    document.getElementById("adm-detail-close-btn")?.addEventListener("click", () => detailDlg?.close());
    document.getElementById("adm-create-close-btn")?.addEventListener("click", () => createDlg?.close());
    document.getElementById("adm-del-close-btn")?.addEventListener("click", () => delDlg?.close());
    document.getElementById("adm-del-cancel-btn")?.addEventListener("click", () => delDlg?.close());

    document.getElementById("adm-del-confirm-btn")?.addEventListener("click", async () => {
      if (!admPendingDeleteUser) return;
      const target = admPendingDeleteUser;
      const btn = document.getElementById("adm-del-confirm-btn");
      btn.disabled = true;
      try {
        const res = await fetch("/api/admin/users/" + encodeURIComponent(target.id), {
          method: "DELETE",
          credentials: "same-origin"
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "删除用户失败");
        delDlg?.close();
        admPendingDeleteUser = null;
        showAlert("已永久删除账号「" + (target.displayName || target.username || target.email) + "」及其云端存档", true);
        await loadUsersPageData();
      } catch (err) {
        delDlg?.close();
        showAlert(err.message || "删除用户失败", false);
      } finally {
        btn.disabled = false;
      }
    });

    document.getElementById("adm-open-create-user-btn")?.addEventListener("click", () => {
      const errEl = document.getElementById("adm-create-err");
      if (errEl) { errEl.textContent = ""; errEl.className = "adm-alert"; }
      document.getElementById("adm-create-user-form")?.reset();
      if (createDlg && !createDlg.open) createDlg.showModal();
    });

    document.getElementById("adm-create-user-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errEl = document.getElementById("adm-create-err");
      const btn = document.getElementById("adm-cu-submit");
      if (errEl) { errEl.textContent = ""; errEl.className = "adm-alert"; }
      btn.disabled = true;
      try {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            account: (document.getElementById("adm-cu-account")?.value || "").trim(),
            displayName: (document.getElementById("adm-cu-name")?.value || "").trim(),
            role: document.getElementById("adm-cu-role")?.value || "user",
            password: document.getElementById("adm-cu-password")?.value || ""
          })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          if (errEl) { errEl.textContent = data.error || "创建失败"; errEl.className = "adm-alert show"; }
          return;
        }
        createDlg?.close();
        showAlert("已成功创建账号「" + (data.user.displayName || data.user.username || data.user.email) + "」", true);
        if (Array.isArray(data.recoveryCodes) && data.recoveryCodes.length) {
          showRecoveryCodes(data.recoveryCodes, "🛡 新建账号「" + (data.user.username || data.user.email) + "」的 5 个一次性恢复码（请转交给该用户保存）：");
        }
        await loadUsersPageData();
      } catch (err) {
        if (errEl) { errEl.textContent = "网络异常，请重试"; errEl.className = "adm-alert show"; }
      } finally {
        btn.disabled = false;
      }
    });

    document.querySelectorAll("[data-pw-target]").forEach(btn => {
      btn.addEventListener("click", () => {
        const inp = document.getElementById(btn.getAttribute("data-pw-target"));
        if (!inp) return;
        const showing = inp.type === "text";
        inp.type = showing ? "password" : "text";
        btn.textContent = showing ? "显示" : "隐藏";
        btn.setAttribute("aria-pressed", String(!showing));
      });
    });

    document.getElementById("adm-bootstrap-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      showAlert("", false);
      const btn = document.getElementById("adm-boot-submit");
      btn.disabled = true;
      try {
        const res = await fetch("/api/admin/bootstrap", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            bootstrapToken: (document.getElementById("adm-boot-token")?.value || "").trim(),
            account: (document.getElementById("adm-boot-account")?.value || "").trim(),
            displayName: (document.getElementById("adm-boot-name")?.value || "").trim(),
            password: document.getElementById("adm-boot-password")?.value || ""
          })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "初始化管理员失败");
        e.target.reset();
        showAlert("管理员账号初始化成功！请妥善保存下方 5 个一次性恢复码。", true);
        await loadAdminStatus(data.recoveryCodes || []);
      } catch (err) {
        showAlert(err.message || "初始化失败", false);
      } finally {
        btn.disabled = false;
      }
    });

    document.getElementById("adm-promote-btn")?.addEventListener("click", async () => {
      showAlert("", false);
      try {
        const res = await fetch("/api/admin/bootstrap", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            promoteCurrent: true,
            bootstrapToken: (document.getElementById("adm-boot-token")?.value || "").trim()
          })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "升级管理员失败");
        showAlert("已成功升级为系统管理员！", true);
        await loadAdminStatus([]);
      } catch (err) {
        showAlert(err.message || "升级失败", false);
      }
    });

    document.getElementById("adm-login-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      showAlert("", false);
      const btn = document.getElementById("adm-login-submit");
      btn.disabled = true;
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            account: (document.getElementById("adm-login-account")?.value || "").trim(),
            password: document.getElementById("adm-login-password")?.value || ""
          })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "登录失败");
        e.target.reset();
        await loadAdminStatus([]);
      } catch (err) {
        showAlert(err.message || "登录失败", false);
      } finally {
        btn.disabled = false;
      }
    });

    document.getElementById("adm-google-login-btn")?.addEventListener("click", () => {
      window.location.href = "/api/auth/google/start?returnTo=" + encodeURIComponent(window.location.pathname || "/admin");
    });

    async function doAdminLogout() {
      showRecoveryCodes([]);
      try { await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }); } catch (e) {}
      await loadAdminStatus([]);
    }
    document.getElementById("adm-logout-btn")?.addEventListener("click", doAdminLogout);
    document.getElementById("adm-switch-account-btn")?.addEventListener("click", doAdminLogout);

    document.getElementById("adm-copy-codes-btn")?.addEventListener("click", async () => {
      if (!admLatestRecoveryCodes.length) return;
      try {
        await navigator.clipboard.writeText("D2R 庇护之地账号一次性恢复码：\\n" + admLatestRecoveryCodes.join("\\n"));
        showAlert("已复制全部 " + admLatestRecoveryCodes.length + " 个恢复码", true);
      } catch (e) { showAlert("复制失败，请手动选中复制", false); }
    });
    document.getElementById("adm-dismiss-codes-btn")?.addEventListener("click", () => showRecoveryCodes([]));
    document.getElementById("adm-copy-oauth-uri-btn")?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.origin + "/api/auth/google/callback");
        showAlert("已复制 Google OAuth 回调地址", true);
      } catch (e) { showAlert("复制失败，请手动复制", false); }
    });

    document.querySelectorAll("#adm-auto-chips [data-auto-min]").forEach(btn => {
      btn.addEventListener("click", () => {
        const mins = Number(btn.getAttribute("data-auto-min"));
        document.getElementById("adm-auto-minutes").value = String(mins);
        document.getElementById("adm-auto-refresh-toggle").checked = true;
        syncAutoChips(mins);
      });
    });
    document.getElementById("adm-auto-minutes")?.addEventListener("input", (e) => syncAutoChips(Number(e.target.value)));

    document.getElementById("adm-save-settings-btn")?.addEventListener("click", async () => {
      const btn = document.getElementById("adm-save-settings-btn");
      const st = document.getElementById("adm-settings-status");
      btn.disabled = true;
      st.textContent = "正在保存系统设置…";
      try {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            pullIntervalMinutes: Number(document.getElementById("adm-pull-interval").value),
            pageAutoRefreshEnabled: Boolean(document.getElementById("adm-auto-refresh-toggle").checked),
            pageAutoRefreshMinutes: Number(document.getElementById("adm-auto-minutes").value)
          })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "保存失败");
        document.getElementById("adm-pull-current-badge").textContent = "当前 " + data.settings.pullIntervalMinutes + " 分钟";
        st.textContent = "✓ 系统设置已保存：DC 后台每 " + data.settings.pullIntervalMinutes + " 分钟拉取 · 前台自动刷新" + (data.settings.pageAutoRefreshEnabled ? ("开启（每 " + data.settings.pageAutoRefreshMinutes + " 分钟）") : "已关闭");
        showAlert("系统设置已保存并全站生效", true);
        loadAdminAuditLogs().catch(() => {});
      } catch (err) {
        st.textContent = "保存失败：" + (err.message || "请检查输入");
        showAlert(err.message || "保存设置失败", false);
      } finally { btn.disabled = false; }
    });

    document.getElementById("adm-sync-now-btn")?.addEventListener("click", async () => {
      const btn = document.getElementById("adm-sync-now-btn");
      btn.disabled = true;
      showAlert("正在同步最新 DC 进度与恐怖地带…", true);
      try {
        const res = await fetch("/api/admin/sync", { method: "POST", credentials: "same-origin" });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "同步失败");
        showAlert("同步完成！检测到 " + (data.changeCount || 0) + " 项 DC 变更" + (data.terrorZone?.currentZh ? (" · 当前恐怖地带：" + data.terrorZone.currentZh) : ""), true);
        await loadSettingsOverviewData();
      } catch (err) {
        showAlert("手动同步失败：" + (err.message || "请检查 FEISHU_WEBHOOK 等配置"), false);
      } finally { btn.disabled = false; }
    });

    document.getElementById("adm-refresh-all-btn")?.addEventListener("click", () => loadCurrentPageData().catch(e => showAlert(e.message, false)));
    document.getElementById("adm-audit-refresh-btn")?.addEventListener("click", () => loadAdminAuditLogs().catch(e => showAlert(e.message, false)));
    document.getElementById("adm-reload-users-btn")?.addEventListener("click", () => loadUsersPageData().catch(e => showAlert(e.message, false)));
    document.getElementById("adm-user-search")?.addEventListener("input", renderUsersTable);
    document.getElementById("adm-user-role-filter")?.addEventListener("change", renderUsersTable);
    document.getElementById("adm-user-status-filter")?.addEventListener("change", renderUsersTable);

    document.getElementById("adm-quick-reset-btn")?.addEventListener("click", async () => {
      const acc = (document.getElementById("adm-quick-reset-account")?.value || "").trim();
      if (!acc) { showResetBanner("请输入需要重置密码的用户名或邮箱", "", false); return; }
      showResetBanner("正在生成 15 分钟应急重置码…", "", false);
      try {
        const res = await fetch("/api/auth/admin/reset-token", {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ account: acc })
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "生成失败");
        showResetBanner("已为「" + data.account + "」生成 15 分钟一次性重置码：" + data.resetCode, data.resetCode, true);
      } catch (err) { showResetBanner(err.message || "生成失败", "", false); }
    });
    document.getElementById("adm-copy-reset-btn")?.addEventListener("click", async () => {
      if (!admLatestResetCode) return;
      try { await navigator.clipboard.writeText(admLatestResetCode); showAlert("已复制 15 分钟应急重置码", true); }
      catch (e) { showAlert("复制失败，请手动选中复制", false); }
    });

    // Zero-flash SSR hydration
    (async function bootAdmin() {
      let ssr = null;
      try {
        const el = document.getElementById("d2r-admin-ssr");
        if (el && el.textContent) ssr = JSON.parse(el.textContent);
      } catch (e) {}
      if (ssr && ssr.activePage) admActivePage = ssr.activePage;
      if (ssr && ssr.initialAuth) {
        try {
          await applyAdminStatus(ssr.initialAuth, []);
        } catch (err) {
          showAlert(err.message || "加载数据失败", false);
        }
      } else {
        await loadAdminStatus([]);
      }
    })();
  </script>
</body>
</html>`;
}
