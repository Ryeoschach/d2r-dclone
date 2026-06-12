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

    <div id="content"><div class="empty">正在加载 24 种服务器状态…</div></div>
    <footer>数据来源 d2runewizard.com · 后台每 5 分钟自动同步 · 页面只读取 Cloudflare KV 缓存</footer>
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
      document.getElementById("content").innerHTML =
        renderDlc(data.servers, false, "毁灭之王") +
        renderDlc(data.servers, true, "术士君临");
      const checked = new Date(data.checkedAt);
      document.getElementById("checked-at").textContent =
        "后台同步：" + checked.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai", hour12: false });
      document.getElementById("live-dot").classList.add("live");
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
    load();
  </script>
</body>
</html>`;
}
