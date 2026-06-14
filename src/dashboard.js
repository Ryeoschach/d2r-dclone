export function renderDashboard() {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#100d0a">
  <meta name="robots" content="noindex">
  <title>暗黑破坏神 Clone 状态</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #100d0a;
      --panel: #19140f;
      --panel-2: #211a13;
      --line: #3b2c1d;
      --text: #f2e7d5;
      --muted: #a99a85;
      --gold: #d5a748;
      --danger: #da4b38;
      --success: #c6e08b;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-width: 320px;
      background:
        radial-gradient(circle at 50% -10%, #4a2717 0, transparent 38rem),
        linear-gradient(180deg, #120e0b, var(--bg));
      color: var(--text);
      font: 15px/1.5 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
    }
    button { font: inherit; }
    .shell { width: min(1420px, calc(100% - 32px)); margin: 0 auto; padding: 36px 0 54px; }
    .hero {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 24px;
      margin-bottom: 24px;
    }
    .eyebrow {
      margin: 0 0 4px;
      color: var(--gold);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: .18em;
      text-transform: uppercase;
    }
    h1 { margin: 0; font-family: Georgia, "Songti SC", serif; font-size: clamp(28px, 4vw, 46px); }
    .subtitle { margin: 7px 0 0; color: var(--muted); }
    .status-line {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 9px;
      color: var(--muted);
      text-align: right;
    }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--muted); }
    .dot.live { background: var(--success); box-shadow: 0 0 12px #9fbd60; }
    .terror-overview {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 18px;
    }
    .terror-card {
      position: relative;
      min-height: 148px;
      padding: 20px;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(63, 28, 18, .92), rgba(25, 20, 15, .96));
    }
    .terror-card.next { background: linear-gradient(135deg, rgba(47, 37, 22, .9), rgba(25, 20, 15, .96)); }
    .terror-card::after {
      content: "";
      position: absolute;
      right: -40px;
      bottom: -60px;
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(218, 75, 56, .18), transparent 68%);
      pointer-events: none;
    }
    .terror-label { color: var(--gold); font-size: 12px; font-weight: 900; letter-spacing: .12em; }
    .terror-name { margin: 8px 0 2px; font: 700 clamp(20px, 2.5vw, 29px) Georgia, "Songti SC", serif; }
    .terror-original { color: var(--muted); font-size: 12px; }
    .terror-meta { display: flex; justify-content: space-between; gap: 12px; margin-top: 16px; color: var(--muted); font-size: 12px; }
    .terror-countdown { color: var(--text); font-weight: 800; }
    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 18px;
      padding: 12px;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: rgba(25, 20, 15, .86);
      backdrop-filter: blur(12px);
    }
    .filters { display: flex; flex-wrap: wrap; gap: 8px; }
    .filter, .refresh {
      min-height: 36px;
      padding: 7px 13px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #15110d;
      color: var(--muted);
      cursor: pointer;
    }
    .filter:hover, .refresh:hover { color: var(--text); border-color: #75532d; }
    .filter.active { color: #171006; border-color: var(--gold); background: var(--gold); font-weight: 800; }
    .refresh[disabled] { opacity: .55; cursor: wait; }
    .settings-panel {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1px;
      margin-bottom: 18px;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: var(--line);
    }
    .setting-group { padding: 16px; background: rgba(25, 20, 15, .96); }
    .setting-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .setting-title { margin: 0; font-size: 15px; }
    .setting-description { margin: 4px 0 13px; color: var(--muted); font-size: 12px; }
    .setting-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
    .interval-button, .save-setting {
      min-width: 38px;
      height: 34px;
      padding: 5px 10px;
      border: 1px solid var(--line);
      border-radius: 7px;
      background: #15110d;
      color: var(--muted);
      cursor: pointer;
    }
    .interval-button.active { border-color: var(--gold); color: var(--gold); }
    .save-setting { color: #171006; border-color: var(--gold); background: var(--gold); font-weight: 800; }
    .setting-input {
      width: 90px;
      height: 34px;
      padding: 5px 9px;
      border: 1px solid var(--line);
      border-radius: 7px;
      outline: none;
      background: #100d0a;
      color: var(--text);
    }
    .setting-input:focus { border-color: var(--gold); }
    .token-input { width: min(240px, 100%); }
    .switch { position: relative; width: 44px; height: 24px; flex: 0 0 auto; }
    .switch input { position: absolute; opacity: 0; pointer-events: none; }
    .switch-track {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 99px;
      background: #4a4035;
      cursor: pointer;
      transition: background .2s;
    }
    .switch-track::after {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #d8ccbb;
      transition: transform .2s;
    }
    .switch input:checked + .switch-track { background: var(--gold); }
    .switch input:checked + .switch-track::after { transform: translateX(20px); background: #171006; }
    .setting-status { min-height: 18px; margin-top: 9px; color: var(--muted); font-size: 12px; }
    .setting-status.success { color: var(--success); }
    .setting-status.failure { color: #ff9f8e; }
    .legend { display: flex; flex-wrap: wrap; gap: 12px; color: var(--muted); font-size: 13px; }
    .legend span::before {
      content: "";
      display: inline-block;
      width: 8px;
      height: 8px;
      margin-right: 6px;
      border-radius: 50%;
      background: var(--level);
    }
    .dlc {
      margin-top: 18px;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: rgba(25, 20, 15, .92);
      box-shadow: 0 20px 60px rgba(0, 0, 0, .24);
    }
    .dlc-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 16px;
      padding: 18px 20px;
      border-bottom: 1px solid var(--line);
      background: linear-gradient(90deg, rgba(213, 167, 72, .12), transparent 48%);
    }
    .dlc h2 { margin: 0; font: 700 24px Georgia, "Songti SC", serif; }
    .dlc-count { color: var(--muted); }
    .matrix-wrap { overflow-x: auto; }
    .matrix {
      display: grid;
      grid-template-columns: 92px repeat(4, minmax(230px, 1fr));
      min-width: 1050px;
    }
    .matrix > * { border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); }
    .matrix > :nth-child(5n) { border-right: 0; }
    .matrix > :nth-last-child(-n + 5) { border-bottom: 0; }
    .corner, .col-head, .region {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 52px;
      padding: 10px;
      background: #15110d;
      color: var(--muted);
      font-size: 13px;
      font-weight: 800;
      letter-spacing: .04em;
    }
    .region { color: var(--text); font-size: 15px; }
    .cell { min-height: 150px; padding: 14px; background: var(--panel); transition: opacity .2s; }
    .cell.filtered { opacity: .18; }
    .card-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .mode { color: var(--muted); font-size: 12px; }
    .level {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 54px;
      height: 27px;
      border: 1px solid color-mix(in srgb, var(--accent) 65%, #fff 10%);
      border-radius: 999px;
      background: color-mix(in srgb, var(--accent) 18%, transparent);
      color: color-mix(in srgb, var(--accent) 75%, #fff 25%);
      font-weight: 900;
    }
    .progress { display: flex; gap: 5px; margin: 14px 0 12px; }
    .bar { height: 5px; flex: 1; border-radius: 99px; background: #3c3228; }
    .bar.on { background: var(--accent); box-shadow: 0 0 9px color-mix(in srgb, var(--accent) 45%, transparent); }
    .message { min-height: 44px; font-weight: 700; }
    .times { margin-top: 8px; color: var(--muted); font-size: 12px; }
    .empty, .error {
      padding: 56px 20px;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: var(--panel);
      color: var(--muted);
      text-align: center;
    }
    .error { color: #ffb7aa; }
    footer { margin-top: 22px; color: #776b5d; font-size: 12px; text-align: center; }
    @media (max-width: 720px) {
      .shell { width: min(100% - 20px, 1420px); padding-top: 24px; }
      .hero { align-items: flex-start; flex-direction: column; }
      .status-line { text-align: left; }
      .toolbar { align-items: stretch; flex-direction: column; }
      .refresh { width: 100%; }
      .settings-panel { grid-template-columns: 1fr; }
      .terror-overview { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <main class="shell">
    <header class="hero">
      <div>
        <p class="eyebrow">Diablo Clone Tracker</p>
        <h1>暗黑破坏神 Clone 状态</h1>
        <p class="subtitle">只包含国际服毁灭之王DLC与术士君临DLC，状态变更会发送飞书通知</p>
      </div>
      <div class="status-line"><span class="dot" id="live-dot"></span><span id="checked-at">正在读取状态…</span></div>
    </header>

    <section class="terror-overview" aria-label="恐怖区域">
      <article class="terror-card">
        <div class="terror-label">当前恐怖区域</div>
        <div class="terror-name" id="terror-current">正在读取…</div>
        <div class="terror-original" id="terror-current-original"></div>
        <div class="terror-meta"><span id="terror-updated"></span><span class="terror-countdown" id="terror-countdown"></span></div>
      </article>
      <article class="terror-card next">
        <div class="terror-label">下一阶段恐怖区域</div>
        <div class="terror-name" id="terror-next">正在读取…</div>
        <div class="terror-original" id="terror-next-original"></div>
        <div class="terror-meta"><span>整点、半点同步数据</span><span>区域每 30 分钟切换</span></div>
      </article>
    </section>

    <section class="toolbar" aria-label="状态筛选">
      <div>
        <div class="filters">
          <button class="filter active" data-min="1">全部状态</button>
          <button class="filter" data-min="4">4 阶以上</button>
          <button class="filter" data-min="5">5 阶以上</button>
        </div>
        <div class="legend" style="margin-top: 10px">
          <span style="--level:#777">1–3 平稳</span>
          <span style="--level:#d5a748">4 警戒</span>
          <span style="--level:#e97832">5 临近</span>
          <span style="--level:#da4b38">6 已触发</span>
        </div>
      </div>
      <button class="refresh" id="refresh">刷新页面数据</button>
    </section>

    <section class="settings-panel" aria-label="刷新设置">
      <div class="setting-group">
        <div class="setting-head">
          <h2 class="setting-title">页面自动刷新</h2>
          <label class="switch" aria-label="页面自动刷新开关">
            <input type="checkbox" id="auto-refresh-toggle">
            <span class="switch-track"></span>
          </label>
        </div>
        <p class="setting-description">只刷新当前网页显示，不会额外请求上游接口。</p>
        <div class="setting-row" id="auto-quick-buttons">
          <button class="interval-button" data-auto-minutes="1">1 分</button>
          <button class="interval-button" data-auto-minutes="2">2 分</button>
          <button class="interval-button" data-auto-minutes="3">3 分</button>
          <button class="interval-button" data-auto-minutes="4">4 分</button>
          <button class="interval-button" data-auto-minutes="5">5 分</button>
          <input class="setting-input" id="auto-custom" type="number" min="1" max="1440" step="1" aria-label="自定义页面刷新分钟数" placeholder="分钟">
          <button class="interval-button" id="apply-auto-custom">应用</button>
        </div>
        <div class="setting-status" id="auto-status">自动刷新已关闭</div>
      </div>

      <div class="setting-group">
        <div class="setting-head">
          <h2 class="setting-title">后台接口拉取</h2>
          <span class="mode" id="pull-current">读取中…</span>
        </div>
        <p class="setting-description">Cloudflare 最快每 1 分钟检查一次；修改需要管理令牌。</p>
        <div class="setting-row">
          <input class="setting-input" id="pull-interval" type="number" min="1" max="1440" step="1" aria-label="后台拉取间隔分钟数" placeholder="分钟">
          <input class="setting-input token-input" id="admin-token" type="password" autocomplete="off" aria-label="管理令牌" placeholder="MANUAL_TRIGGER_TOKEN">
          <button class="save-setting" id="save-pull-interval">保存</button>
        </div>
        <div class="setting-status" id="pull-status"></div>
      </div>
    </section>

    <div id="content"><div class="empty">正在加载 24 种服务器状态…</div></div>
    <footer>数据来源 d2runewizard.com · 后台每 <span id="footer-pull-interval">5</span> 分钟同步 · 页面只读取 Cloudflare KV 缓存</footer>
  </main>

  <script>
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
    let syncAgeTimer = null;
    const storedAutoRefresh = localStorage.getItem("dclone-auto-refresh-enabled");
    let autoRefreshEnabled = storedAutoRefresh === null || storedAutoRefresh === "true";
    let autoRefreshMinutes = Number(localStorage.getItem("dclone-auto-refresh-minutes")) || 1;

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
      })[char]);
    }

    function colorFor(progress) {
      if (progress >= 6) return "#da4b38";
      if (progress >= 5) return "#e97832";
      if (progress >= 4) return "#d5a748";
      return "#8e8375";
    }

    function formatTime(seconds) {
      if (!seconds) return "暂无记录";
      return new Intl.DateTimeFormat("zh-CN", {
        timeZone: "Asia/Shanghai",
        month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
        hour12: false
      }).format(new Date(seconds * 1000));
    }

    function serverCell(server, mode) {
      if (!server) return '<div class="cell"><div class="message">暂无数据</div></div>';
      const bars = Array.from({ length: 6 }, (_, index) =>
        '<span class="bar ' + (index < server.progress ? "on" : "") + '"></span>'
      ).join("");
      const filtered = server.progress < minProgress ? " filtered" : "";
      return '<article class="cell' + filtered + '" style="--accent:' + colorFor(server.progress) + '">' +
        '<div class="card-top"><span class="mode">' + mode.label + '</span><span class="level">' +
        server.progress + '/6</span></div><div class="progress">' + bars + '</div>' +
        '<div class="message">' + escapeHtml(progressNames[server.progress] || "未知状态") + '</div>' +
        '<div class="times">更新 ' + formatTime(server.lastUpdate) +
        '<br>上次触发 ' + formatTime(server.lastWalk) + '</div></article>';
    }

    function renderDlc(servers, rotw, title) {
      const subset = servers.filter(server => server.rotw === rotw);
      let grid = '<div class="corner">区域</div>' +
        modes.map(mode => '<div class="col-head">' + mode.label + '</div>').join("");
      for (const region of regions) {
        grid += '<div class="region">' + regionNames[region] + '</div>';
        for (const mode of modes) {
          const server = subset.find(item =>
            item.region.replace(/Rotw$/i, "") === region &&
            item.ladder === mode.ladder &&
            item.hardcore === mode.hardcore
          );
          grid += serverCell(server, mode);
        }
      }
      const visible = subset.filter(server => server.progress >= minProgress).length;
      return '<section class="dlc"><header class="dlc-head"><h2>' + title +
        '</h2><span class="dlc-count">' + visible + ' / 12 项显示</span></header>' +
        '<div class="matrix-wrap"><div class="matrix">' + grid + '</div></div></section>';
    }

    function render(data) {
      window.dashboardData = data;
      renderTerrorZone(data.terrorZone);
      document.getElementById("content").innerHTML =
        renderDlc(data.servers, false, "毁灭之王") +
        renderDlc(data.servers, true, "术士君临");
      updateSyncAge();
      if (syncAgeTimer) clearInterval(syncAgeTimer);
      syncAgeTimer = setInterval(updateSyncAge, 1000);
      document.getElementById("live-dot").classList.add("live");
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
        "状态数据更新：" + checked.toLocaleString("zh-CN", {
          timeZone: "Asia/Shanghai", hour12: false
        }) + "（" + ageText + "）";
    }

    function renderTerrorZone(terrorZone) {
      const current = document.getElementById("terror-current");
      const next = document.getElementById("terror-next");
      if (!terrorZone) {
        current.textContent = "暂无数据";
        next.textContent = "暂无数据";
        document.getElementById("terror-current-original").textContent = "等待后台完成下一次同步";
        document.getElementById("terror-next-original").textContent = "";
        return;
      }

      const checkedAt = new Date(terrorZone.checkedAt).getTime();
      const halfHour = 30 * 60 * 1000;
      const awaitingConfirmation =
        Math.floor(Date.now() / halfHour) > Math.floor(checkedAt / halfHour);
      if (awaitingConfirmation) {
        current.textContent = terrorZone.nextZh || terrorZone.next;
        next.textContent = "正在获取下一阶段…";
        document.getElementById("terror-current-original").textContent =
          terrorZone.next + " · 根据上一轮预测即时切换";
        document.getElementById("terror-next-original").textContent =
          "等待 D2RuneWizard 确认新一轮数据";
      } else {
        current.textContent = terrorZone.currentZh || terrorZone.current;
        next.textContent = terrorZone.nextZh || terrorZone.next;
        document.getElementById("terror-current-original").textContent = terrorZone.current;
        document.getElementById("terror-next-original").textContent = terrorZone.next;
      }
      document.getElementById("terror-updated").textContent = "同步 " +
        new Date(terrorZone.checkedAt).toLocaleTimeString("zh-CN", {
          timeZone: "Asia/Shanghai", hour: "2-digit", minute: "2-digit", hour12: false
        });
      updateTerrorCountdown();
      if (terrorCountdownTimer) clearInterval(terrorCountdownTimer);
      terrorCountdownTimer = setInterval(updateTerrorCountdown, 1000);
    }

    function updateTerrorCountdown() {
      const now = Date.now();
      const halfHour = 30 * 60 * 1000;
      const nextBoundary = (Math.floor(now / halfHour) + 1) * halfHour;
      const remaining = Math.max(0, nextBoundary - now);
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      document.getElementById("terror-countdown").textContent =
        "距切换 " + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
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

    function updateAutoRefreshControls() {
      document.getElementById("auto-refresh-toggle").checked = autoRefreshEnabled;
      document.querySelectorAll("[data-auto-minutes]").forEach(button => {
        button.classList.toggle("active", Number(button.dataset.autoMinutes) === autoRefreshMinutes);
      });
      const status = document.getElementById("auto-status");
      status.textContent = autoRefreshEnabled
        ? "已开启，每 " + autoRefreshMinutes + " 分钟刷新页面"
        : "自动刷新已关闭";
    }

    function saveAutoRefreshSettings(enabled, minutes) {
      if (!Number.isInteger(minutes) || minutes < 1 || minutes > 1440) {
        document.getElementById("auto-status").textContent = "请输入 1 至 1440 的整数分钟";
        return;
      }
      autoRefreshEnabled = enabled;
      autoRefreshMinutes = minutes;
      localStorage.setItem("dclone-auto-refresh-enabled", String(enabled));
      localStorage.setItem("dclone-auto-refresh-minutes", String(minutes));
      updateAutoRefreshControls();
      scheduleAutoRefresh();
    }

    function scheduleAutoRefresh() {
      if (autoRefreshTimer) clearTimeout(autoRefreshTimer);
      if (autoRefreshEnabled) {
        autoRefreshTimer = setTimeout(load, autoRefreshMinutes * 60 * 1000);
      }
    }

    async function loadPullSettings() {
      const status = document.getElementById("pull-status");
      try {
        const response = await fetch("/api/settings", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "设置读取失败");
        document.getElementById("pull-interval").value = data.pullIntervalMinutes;
        document.getElementById("pull-current").textContent = "当前 " + data.pullIntervalMinutes + " 分钟";
        document.getElementById("footer-pull-interval").textContent = data.pullIntervalMinutes;
        status.textContent = "后台按此间隔请求状态接口";
      } catch (error) {
        status.textContent = error.message;
        status.className = "setting-status failure";
      }
    }

    async function savePullSettings() {
      const button = document.getElementById("save-pull-interval");
      const status = document.getElementById("pull-status");
      const minutes = Number(document.getElementById("pull-interval").value);
      const token = document.getElementById("admin-token").value;
      status.className = "setting-status";
      if (!Number.isInteger(minutes) || minutes < 1 || minutes > 1440) {
        status.textContent = "请输入 1 至 1440 的整数分钟";
        status.classList.add("failure");
        return;
      }
      if (!token) {
        status.textContent = "请输入 MANUAL_TRIGGER_TOKEN";
        status.classList.add("failure");
        return;
      }

      button.disabled = true;
      try {
        const response = await fetch("/api/settings", {
          method: "POST",
          headers: {
            "authorization": "Bearer " + token,
            "content-type": "application/json"
          },
          body: JSON.stringify({ pullIntervalMinutes: minutes })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "保存失败");
        document.getElementById("admin-token").value = "";
        document.getElementById("pull-current").textContent = "当前 " + data.pullIntervalMinutes + " 分钟";
        document.getElementById("footer-pull-interval").textContent = data.pullIntervalMinutes;
        status.textContent = "已保存，下一次分钟级 Cron 开始生效";
        status.classList.add("success");
      } catch (error) {
        status.textContent = error.message;
        status.classList.add("failure");
      } finally {
        button.disabled = false;
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
    document.getElementById("auto-refresh-toggle").addEventListener("change", event => {
      saveAutoRefreshSettings(event.target.checked, autoRefreshMinutes);
    });
    document.querySelectorAll("[data-auto-minutes]").forEach(button => {
      button.addEventListener("click", () => {
        saveAutoRefreshSettings(true, Number(button.dataset.autoMinutes));
      });
    });
    document.getElementById("apply-auto-custom").addEventListener("click", () => {
      saveAutoRefreshSettings(true, Number(document.getElementById("auto-custom").value));
    });
    document.getElementById("save-pull-interval").addEventListener("click", savePullSettings);
    updateAutoRefreshControls();
    loadPullSettings();
    load();
  </script>
</body>
</html>`;
}
