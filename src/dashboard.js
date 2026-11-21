import { CN2TW_DST, CN2TW_SRC, EN_PHRASE_PAIRS, TW_PHRASE_PAIRS } from "./i18n-dict.js";

export function renderDashboard() {
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
  <style>
    :root {
      color-scheme: dark;
      --bg: #0c0907;
      --panel: #16110d;
      --panel-2: #1f1812;
      --line: #3b2c1d;
      --line-gold: rgba(213, 167, 72, 0.34);
      --text: #f2e7d5;
      --muted: #a99a85;
      --gold: #d5a748;
      --danger: #da4b38;
      --success: #c6e08b;

      /* D2R Item Quality Tokens */
      --q-unique: #c7b377;
      --q-set: #00e000;
      --q-rare: #ffff66;
      --q-magic: #6969ff;
      --q-craft: #ffa500;

      /* Terror Zone Theme */
      --tz-border: rgba(168, 85, 147, 0.38);
      --tz-accent: #c462bb;
      --tz-glow: rgba(196, 98, 187, 0.22);

      /* DClone Theme */
      --dc-border: rgba(213, 167, 72, 0.38);
      --dc-accent: #d5a748;
      --dc-glow: rgba(213, 167, 72, 0.22);

      /* Runewords Theme */
      --rw-border: rgba(94, 196, 142, 0.38);
      --rw-accent: #5ec48e;
      --rw-glow: rgba(94, 196, 142, 0.22);

      /* Affixes Theme */
      --af-border: rgba(104, 164, 255, 0.38);
      --af-accent: #68a4ff;
      --af-glow: rgba(104, 164, 255, 0.22);

      /* Items Encyclopedia Theme */
      --it-border: rgba(229, 147, 82, 0.38);
      --it-accent: #e59352;
      --it-glow: rgba(229, 147, 82, 0.22);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-width: 320px;
      background:
        radial-gradient(ellipse 75% 36rem at 50% -6%, var(--ambient-top, rgba(140, 42, 96, 0.34)) 0, transparent 70%),
        radial-gradient(circle at 12% 28%, var(--ambient-left, rgba(104, 44, 92, 0.14)) 0, transparent 36rem),
        radial-gradient(circle at 88% 72%, rgba(165, 108, 36, 0.08) 0, transparent 36rem),
        repeating-linear-gradient(45deg, rgba(213, 167, 72, 0.015) 0 1px, transparent 1px 28px),
        repeating-linear-gradient(-45deg, rgba(213, 167, 72, 0.015) 0 1px, transparent 1px 28px),
        linear-gradient(180deg, #110c09 0%, var(--bg) 42%, #070504 100%);
      color: var(--text);
      font: 15px/1.5 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
      transition: background .35s ease;
    }
    body[data-tab="terror"] {
      --ambient-top: rgba(154, 48, 128, 0.32);
      --ambient-left: rgba(124, 38, 108, 0.16);
    }
    body[data-tab="dclone"] {
      --ambient-top: rgba(182, 54, 28, 0.34);
      --ambient-left: rgba(213, 167, 72, 0.14);
    }
    body[data-tab="runewords"] {
      --ambient-top: rgba(34, 122, 82, 0.30);
      --ambient-left: rgba(94, 196, 142, 0.12);
    }
    body[data-tab="affixes"] {
      --ambient-top: rgba(42, 96, 178, 0.32);
      --ambient-left: rgba(104, 164, 255, 0.14);
    }
    body[data-tab="items"] {
      --ambient-top: rgba(176, 108, 36, 0.32);
      --ambient-left: rgba(229, 147, 82, 0.14);
    }
    button { font: inherit; }
    .shell { width: min(1440px, calc(100% - 28px)); margin: 0 auto; padding: 24px 0 64px; }
    
    /* Header & Hero */
    .hero {
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 16px;
      padding: 22px 26px;
      border-radius: 16px;
      border: 1px solid var(--line-gold);
      background:
        radial-gradient(circle at 15% 0%, rgba(213, 167, 72, 0.14), transparent 46%),
        radial-gradient(circle at 88% 100%, rgba(168, 42, 28, 0.16), transparent 50%),
        linear-gradient(180deg, rgba(28, 21, 16, 0.94), rgba(14, 10, 8, 0.98));
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.58), inset 0 1px 0 rgba(255, 224, 150, 0.12);
    }
    .hero-sigil {
      position: absolute;
      right: -18px;
      top: -26px;
      width: 210px;
      height: 210px;
      opacity: 0.065;
      color: var(--gold);
      pointer-events: none;
    }
    .hero::before {
      content: "";
      position: absolute;
      inset: 0 24px auto 24px;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold), #da4b38, var(--gold), transparent);
      opacity: 0.8;
    }
    .hero-right {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    .settings-jump-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 999px;
      border: 1px solid rgba(213, 167, 72, 0.25);
      background: rgba(24, 18, 13, 0.85);
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all .18s ease;
    }
    .settings-jump-btn:hover {
      color: var(--gold);
      border-color: var(--gold);
      background: rgba(38, 28, 19, 0.96);
    }
    .lang-switcher {
      display: inline-flex;
      align-items: center;
      padding: 2px;
      border-radius: 999px;
      border: 1px solid rgba(213, 167, 72, 0.25);
      background: rgba(14, 11, 9, 0.85);
      gap: 2px;
    }
    .lang-btn {
      padding: 4px 10px;
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all .15s ease;
    }
    .lang-btn:hover { color: var(--text); }
    .lang-btn.active {
      background: rgba(213, 167, 72, 0.22);
      color: var(--gold);
    }
    .eyebrow {
      margin: 0 0 6px;
      color: var(--gold);
      font-family: "Cinzel", Georgia, serif;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: .2em;
      text-transform: uppercase;
    }
    h1 {
      margin: 0;
      font-family: "Cinzel", Georgia, "Songti SC", serif;
      font-size: clamp(24px, 3.6vw, 40px);
      letter-spacing: .03em;
      color: #faeed8;
      text-shadow: 0 2px 14px rgba(213, 167, 72, 0.25);
    }
    .subtitle { margin: 6px 0 0; color: var(--muted); font-size: 14px; }
    .status-line {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 9px;
      color: var(--muted);
      text-align: right;
      font-size: 13px;
      padding: 6px 12px;
      border-radius: 999px;
      background: rgba(12, 9, 7, 0.65);
      border: 1px solid rgba(213, 167, 72, 0.2);
      white-space: nowrap;
    }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--muted); flex-shrink: 0; }
    .dot.live { background: var(--success); box-shadow: 0 0 12px #9fbd60; }

    /* Always-visible Sanctuary Telemetry HUD */
    .sanctuary-hud {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 10px;
      margin-bottom: 14px;
    }
    .hud-pill {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 9px 14px;
      border-radius: 11px;
      border: 1px solid rgba(59, 44, 29, 0.85);
      background: rgba(20, 15, 12, 0.88);
      color: var(--text);
      font-size: 13px;
      cursor: pointer;
      transition: all .18s ease;
      text-align: left;
      min-width: 0;
    }
    .hud-pill:hover {
      border-color: var(--gold);
      background: rgba(31, 23, 17, 0.96);
      transform: translateY(-1px);
    }
    .hud-pill.hud-hot {
      border-color: rgba(218, 75, 56, 0.72);
      background: linear-gradient(90deg, rgba(64, 18, 14, 0.75), rgba(24, 15, 12, 0.94));
      box-shadow: 0 0 16px rgba(218, 75, 56, 0.22);
    }
    .hud-left {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    .hud-label {
      color: var(--muted);
      font-size: 12px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .hud-val {
      font-weight: 700;
      color: #f7ebd7;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .hud-badge {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 12px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 999px;
      background: rgba(213, 167, 72, 0.14);
      color: var(--gold);
      border: 1px solid rgba(213, 167, 72, 0.3);
      white-space: nowrap;
      flex-shrink: 0;
    }
    .hud-badge.tz {
      background: rgba(196, 98, 187, 0.16);
      color: #ec9ce4;
      border-color: rgba(196, 98, 187, 0.38);
    }
    .hud-badge.hot {
      background: rgba(218, 75, 56, 0.25);
      color: #ff9a8b;
      border-color: rgba(218, 75, 56, 0.6);
    }
    .hud-shortcuts {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 11px;
      border: 1px solid rgba(59, 44, 29, 0.55);
      background: rgba(15, 12, 9, 0.72);
      color: var(--muted);
      font-size: 12px;
      white-space: nowrap;
    }
    .kbd-mini {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 5px;
      border-radius: 5px;
      border: 1px solid rgba(213, 167, 72, 0.32);
      background: rgba(34, 26, 18, 0.9);
      color: var(--gold);
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 11px;
      font-weight: 700;
    }

    /* Sticky Glassmorphic Command Navigation */
    .main-nav-tabs {
      position: sticky;
      top: 10px;
      z-index: 40;
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 8px;
      margin-bottom: 22px;
      padding: 8px;
      border-radius: 14px;
      border: 1px solid rgba(213, 167, 72, 0.24);
      background: rgba(14, 11, 9, 0.88);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55);
    }
    .main-nav-tab {
      position: relative;
      min-width: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 10px 10px;
      border: 1px solid rgba(59, 44, 29, 0.8);
      border-radius: 10px;
      background: rgba(24, 18, 14, 0.78);
      color: var(--muted);
      cursor: pointer;
      font-size: clamp(12.5px, 1.15vw, 14px);
      font-weight: 700;
      font-family: "Cinzel", Georgia, "Songti SC", serif;
      letter-spacing: .02em;
      transition: all .2s ease;
      user-select: none;
      outline: none;
      white-space: nowrap;
    }
    .tab-kbd {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 10px;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.05);
      color: rgba(169, 154, 133, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .main-nav-tab.active .tab-kbd {
      background: rgba(255, 255, 255, 0.14);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.25);
    }
    .main-nav-tab:hover {
      color: var(--text);
      border-color: #75532d;
      background: rgba(35, 27, 20, 0.94);
    }
    .main-nav-tab:focus-visible {
      box-shadow: 0 0 0 2px var(--gold);
    }
    .main-nav-tab.tab-terror.active {
      color: #fff;
      border-color: var(--tz-accent);
      background: linear-gradient(135deg, rgba(68, 20, 56, 0.9), rgba(28, 16, 26, 0.98));
      box-shadow: 0 0 18px var(--tz-glow);
    }
    .main-nav-tab.tab-dclone.active {
      color: #fff;
      border-color: var(--dc-accent);
      background: linear-gradient(135deg, rgba(78, 42, 16, 0.9), rgba(28, 20, 14, 0.98));
      box-shadow: 0 0 18px var(--dc-glow);
    }
    .main-nav-tab.tab-runewords.active {
      color: #fff;
      border-color: var(--rw-accent);
      background: linear-gradient(135deg, rgba(20, 62, 44, 0.9), rgba(14, 24, 20, 0.98));
      box-shadow: 0 0 18px var(--rw-glow);
    }
    .main-nav-tab.tab-affixes.active {
      color: #fff;
      border-color: var(--af-accent);
      background: linear-gradient(135deg, rgba(22, 44, 82, 0.9), rgba(13, 18, 28, 0.98));
      box-shadow: 0 0 18px var(--af-glow);
    }
    .main-nav-tab.tab-items.active {
      color: #fff;
      border-color: var(--it-accent);
      background: linear-gradient(135deg, rgba(72, 40, 18, 0.9), rgba(24, 16, 12, 0.98));
      box-shadow: 0 0 18px var(--it-glow);
    }
    .main-nav-tab .tab-svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      opacity: 0.82;
      transition: transform .2s ease, opacity .2s ease;
    }
    .main-nav-tab.active .tab-svg {
      opacity: 1;
      transform: scale(1.08);
    }
    .main-nav-tab.tab-terror .tab-svg { color: #e284db; }
    .main-nav-tab.tab-dclone .tab-svg { color: #f0b254; }
    .main-nav-tab.tab-runewords .tab-svg { color: #5ec48e; }
    .main-nav-tab.tab-affixes .tab-svg { color: #75b1ff; }
    .main-nav-tab.tab-items .tab-svg { color: #e59352; }
    .main-nav-tab.active::after {
      content: "";
      position: absolute;
      left: 16px;
      right: 16px;
      bottom: -1px;
      height: 2px;
      border-radius: 2px;
      background: currentColor;
      opacity: 0.85;
    }
    .main-tab-panel {
      display: none;
    }
    .main-tab-panel.active {
      display: block;
      animation: tabFadeIn .22s ease-out;
    }
    @keyframes tabFadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Recessed Filter Consoles & Collapsible Settings Drawer */
    .tz-filter-bar, .rw-controls, .af-controls, .it-controls {
      background: rgba(10, 8, 6, 0.72) !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      border-radius: 12px !important;
      padding: 14px 16px !important;
      margin-bottom: 18px !important;
      box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.45);
    }
    .module-block {
      overflow: hidden;
    }
    .module-block::before {
      content: "";
      position: absolute;
      inset: 0 0 auto 0;
      height: 3px;
      opacity: 0.88;
    }
    .terror-module::before { background: linear-gradient(90deg, transparent, var(--tz-accent), transparent); }
    .dclone-module::before { background: linear-gradient(90deg, transparent, var(--dc-accent), #da4b38, transparent); }
    .runewords-module::before { background: linear-gradient(90deg, transparent, var(--rw-accent), transparent); }
    .affixes-module::before { background: linear-gradient(90deg, transparent, var(--af-accent), transparent); }
    .items-module::before { background: linear-gradient(90deg, transparent, var(--it-accent), transparent); }
    .module-header {
      padding-bottom: 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    }
    .settings-drawer {
      margin-top: 22px;
      border-radius: 14px;
      border: 1px solid rgba(59, 44, 29, 0.75);
      background: rgba(15, 12, 9, 0.84);
      overflow: hidden;
    }
    .settings-drawer-summary {
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 13px 18px;
      cursor: pointer;
      color: var(--muted);
      font-size: 13px;
      font-weight: 700;
      user-select: none;
      transition: color .18s ease, background .18s ease;
    }
    .settings-drawer-summary::-webkit-details-marker { display: none; }
    .settings-drawer-summary:hover {
      color: var(--gold);
      background: rgba(28, 21, 15, 0.85);
    }
    .settings-drawer[open] .settings-drawer-summary {
      color: var(--text);
      border-bottom: 1px solid rgba(59, 44, 29, 0.65);
      background: rgba(24, 18, 13, 0.9);
    }
    .settings-drawer .settings-module {
      margin-bottom: 0;
      border: 0;
      border-radius: 0;
      box-shadow: none;
      background: transparent;
    }

    /* Floating Back-to-Top Medallion */
    .back-to-top-btn {
      position: fixed;
      right: 22px;
      bottom: 22px;
      z-index: 45;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid rgba(213, 167, 72, 0.55);
      background: radial-gradient(circle at 35% 30%, #2c2015, #120d09);
      color: var(--gold);
      font-size: 18px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.65), 0 0 14px rgba(213, 167, 72, 0.18);
      opacity: 0;
      pointer-events: none;
      transform: translateY(10px);
      transition: all .2s ease;
    }
    .back-to-top-btn.visible {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }
    .back-to-top-btn:hover {
      border-color: #f3c868;
      color: #fff;
      transform: translateY(-2px);
    }

    @media (max-width: 1080px) {
      .tab-kbd { display: none; }
      .main-nav-tab { padding: 9px 8px; font-size: 13px; }
    }
    @media (max-width: 960px) {
      .sanctuary-hud { grid-template-columns: 1fr 1fr; }
      .hud-shortcuts { display: none; }
    }
    @media (max-width: 760px) {
      .hero { flex-direction: column; align-items: flex-start; padding: 16px; }
      .hero-right { justify-content: flex-start; }
      .status-line { align-self: flex-start; }
      .sanctuary-hud { grid-template-columns: 1fr; }
      .main-nav-tabs {
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
        justify-content: flex-start;
      }
      .main-nav-tabs::-webkit-scrollbar { display: none; }
      .main-nav-tab { flex: 0 0 auto; padding: 9px 14px; font-size: 13px; }
    }

    /* Module Section Containers */
    .module-block {
      margin-bottom: 30px;
      padding: 22px;
      border-radius: 16px;
      border: 1px solid var(--line);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.35);
      position: relative;
    }
    .module-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 18px;
      flex-wrap: wrap;
    }
    .module-title-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .module-tag {
      display: inline-flex;
      align-items: center;
      padding: 3px 9px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .1em;
      text-transform: uppercase;
    }
    .module-title {
      margin: 0;
      font: 700 clamp(20px, 2.6vw, 25px) Georgia, "Songti SC", serif;
      color: var(--text);
    }
    .module-meta {
      color: var(--muted);
      font-size: 13px;
    }

    /* Terror Zone Specific */
    .terror-module {
      border-color: var(--tz-border);
      background:
        radial-gradient(circle at 95% 0%, rgba(138, 43, 118, 0.16) 0, transparent 400px),
        radial-gradient(circle at 5% 100%, rgba(68, 20, 56, 0.22) 0, transparent 360px),
        rgba(20, 15, 19, 0.95);
    }
    .terror-tag {
      background: rgba(196, 98, 187, 0.2);
      color: #ec9ce4;
      border: 1px solid rgba(196, 98, 187, 0.45);
    }
    .terror-overview {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .terror-card {
      position: relative;
      min-height: 154px;
      padding: 22px;
      overflow: hidden;
      border: 1px solid rgba(196, 98, 187, 0.35);
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(62, 22, 52, 0.94), rgba(24, 16, 22, 0.98));
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 24px rgba(0, 0, 0, 0.28);
    }
    .terror-card.next {
      border-color: rgba(138, 77, 118, 0.28);
      background: linear-gradient(135deg, rgba(42, 22, 38, 0.88), rgba(20, 15, 20, 0.96));
    }
    .terror-card::after {
      content: "";
      position: absolute;
      right: -40px;
      bottom: -60px;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(196, 98, 187, 0.18), transparent 70%);
      pointer-events: none;
    }
    .terror-card.next::after {
      background: radial-gradient(circle, rgba(213, 167, 72, 0.12), transparent 70%);
    }
    .terror-label {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #ec9ce4;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: .12em;
    }
    .terror-card.next .terror-label {
      color: var(--gold);
    }
    .terror-name {
      margin: 8px 0 3px;
      font: 700 clamp(20px, 2.5vw, 28px) Georgia, "Songti SC", serif;
      color: #fff6ee;
    }
    .terror-original {
      color: var(--muted);
      font-size: 12px;
    }
    .terror-details {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 7px;
      min-height: 27px;
      margin-top: 14px;
    }
    .terror-detail-label {
      color: var(--muted);
      font-size: 12px;
      margin-right: 2px;
    }
    .terror-badge {
      display: inline-flex;
      align-items: center;
      min-height: 25px;
      padding: 3px 9px;
      border: 1px solid #5c4630;
      border-radius: 999px;
      background: rgba(16, 13, 10, .75);
      color: #d8ccbb;
      font-size: 12px;
      font-weight: 700;
    }
    .terror-badge.immunity-badge {
      position: relative;
      min-width: 28px;
      height: 26px;
      padding: 0 6px;
      justify-content: center;
      font-size: 13px;
      cursor: pointer;
      user-select: none;
      transition: transform .15s, box-shadow .15s;
    }
    .terror-badge.immunity-badge:hover {
      transform: scale(1.16);
      box-shadow: 0 0 8px rgba(255, 255, 255, 0.25);
      z-index: 25;
    }
    .terror-badge.immunity-badge::after {
      content: attr(data-tip);
      position: absolute;
      bottom: calc(100% + 7px);
      left: 50%;
      transform: translateX(-50%) translateY(4px);
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--gold);
      background: #191410;
      color: #fff6ee;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.75);
      transition: opacity .15s ease, transform .15s ease, visibility .15s;
    }
    .terror-badge.immunity-badge::before {
      content: "";
      position: absolute;
      bottom: calc(100% + 1px);
      left: 50%;
      transform: translateX(-50%) translateY(4px);
      border: 4px solid transparent;
      border-top-color: var(--gold);
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
      transition: opacity .15s ease, transform .15s ease, visibility .15s;
    }
    .terror-badge.immunity-badge:hover::after,
    .terror-badge.immunity-badge:hover::before {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }
    /* Element Specific Badges */
    .terror-badge.immunity-f { color: #ff9179; border-color: rgba(255, 93, 56, 0.55); background: rgba(255, 93, 56, 0.16); }
    .terror-badge.immunity-c { color: #8ee2ff; border-color: rgba(78, 187, 247, 0.55); background: rgba(78, 187, 247, 0.16); }
    .terror-badge.immunity-l { color: #ffea78; border-color: rgba(253, 216, 53, 0.55); background: rgba(253, 216, 53, 0.16); }
    .terror-badge.immunity-p { color: #8af49f; border-color: rgba(87, 219, 112, 0.55); background: rgba(87, 219, 112, 0.16); }
    .terror-badge.immunity-ph { color: #e2d9cd; border-color: rgba(197, 184, 165, 0.55); background: rgba(197, 184, 165, 0.16); }
    .terror-badge.immunity-m { color: #f4abff; border-color: rgba(223, 108, 247, 0.55); background: rgba(223, 108, 247, 0.16); }

    .terror-rating {
      border-color: color-mix(in srgb, var(--gold) 75%, #5c4630);
      color: #f3cf7b;
      background: rgba(213, 167, 72, 0.12);
    }
    .terror-rating.rating-s {
      color: #ffe082;
      border-color: #ffd54f;
      background: rgba(255, 213, 79, 0.22);
      box-shadow: 0 0 10px rgba(255, 213, 79, 0.25);
    }
    .terror-rating.rating-s-a, .terror-rating.rating-a {
      color: #bbf7d0;
      border-color: #86efac;
      background: rgba(134, 239, 172, 0.16);
    }
    .terror-rating.rating-b {
      color: #bfdbfe;
      border-color: #60a5fa;
      background: rgba(96, 165, 250, 0.14);
    }
    .terror-rating.rating-c {
      color: #d6cfc2;
      border-color: rgba(169, 154, 133, 0.55);
      background: rgba(169, 154, 133, 0.12);
    }
    .terror-rating.rating-f {
      color: #fca5a5;
      border-color: #f87171;
      background: rgba(248, 113, 113, 0.14);
    }

    .terror-meta {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-top: 16px;
      color: var(--muted);
      font-size: 12px;
    }
    .terror-countdown {
      color: #fff;
      font-weight: 800;
      text-shadow: 0 0 10px rgba(196, 98, 187, 0.5);
    }

    /* Terror Zone Directory & History Panel */
    .tz-directory-section {
      margin-top: 18px;
      border: 1px solid rgba(168, 85, 147, 0.3);
      border-radius: 12px;
      background: rgba(16, 12, 16, 0.75);
      overflow: hidden;
    }
    .tz-directory-toggle {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 13px 18px;
      border: 0;
      background: rgba(42, 22, 38, 0.45);
      color: #ec9ce4;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      text-align: left;
      transition: background .2s, color .2s;
    }
    .tz-directory-toggle:hover {
      background: rgba(68, 20, 56, 0.6);
      color: #fff;
    }
    .tz-toggle-title { display: flex; align-items: center; gap: 8px; }
    .tz-toggle-arrow { font-size: 12px; color: var(--gold); }
    .tz-directory-body {
      padding: 18px;
      border-top: 1px solid rgba(168, 85, 147, 0.25);
      background: rgba(14, 10, 14, 0.95);
    }
    .tz-tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 16px;
      border-bottom: 1px solid rgba(59, 44, 29, 0.6);
      padding-bottom: 10px;
    }
    .tz-tab {
      padding: 7px 14px;
      border: 1px solid transparent;
      border-radius: 8px;
      background: transparent;
      color: var(--muted);
      cursor: pointer;
      font-size: 13px;
      font-weight: 700;
      transition: all .2s;
    }
    .tz-tab:hover { color: var(--text); background: rgba(255, 255, 255, 0.05); }
    .tz-tab.active {
      color: #171006;
      background: var(--gold);
      border-color: var(--gold);
    }
    .tz-filter-bar {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 18px;
      padding: 14px;
      border: 1px solid rgba(59, 44, 29, 0.6);
      border-radius: 10px;
      background: rgba(21, 16, 19, 0.8);
    }
    .tz-search-wrap { position: relative; width: 100%; }
    .tz-search-input {
      width: 100%;
      height: 38px;
      padding: 6px 36px 6px 14px;
      border: 1px solid rgba(168, 85, 147, 0.4);
      border-radius: 8px;
      background: #110d10;
      color: var(--text);
      font-size: 13px;
      outline: none;
      transition: border-color .2s;
    }
    .tz-search-input:focus { border-color: #ec9ce4; }
    .tz-clear-btn {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      border: 0;
      background: transparent;
      color: var(--muted);
      font-size: 16px;
      cursor: pointer;
      padding: 0 4px;
    }
    .tz-clear-btn:hover { color: var(--text); }
    .tz-filter-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    .tz-filter-label {
      min-width: 48px;
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
    }
    .tz-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .tz-chip {
      padding: 4px 10px;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: #15110d;
      color: var(--muted);
      font-size: 12px;
      cursor: pointer;
      transition: all .2s;
    }
    .tz-chip:hover { color: var(--text); border-color: #75532d; }
    .tz-chip.active {
      color: #ec9ce4;
      border-color: #c462bb;
      background: rgba(196, 98, 187, 0.2);
      font-weight: 800;
    }
    .tz-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
      max-height: 520px;
      overflow-y: auto;
      padding-right: 4px;
    }
    .tz-catalog-card {
      padding: 14px;
      border: 1px solid rgba(168, 85, 147, 0.25);
      border-radius: 10px;
      background: linear-gradient(135deg, rgba(38, 18, 32, 0.7), rgba(20, 14, 18, 0.9));
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 8px;
      transition: border-color .2s, transform .2s;
    }
    .tz-catalog-card:hover {
      border-color: rgba(196, 98, 187, 0.55);
      transform: translateY(-2px);
    }
    .tz-card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .tz-act-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 800;
      background: rgba(196, 98, 187, 0.18);
      color: #ec9ce4;
      border: 1px solid rgba(196, 98, 187, 0.35);
    }
    .tz-card-title {
      font-family: Georgia, "Songti SC", serif;
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      margin: 2px 0 0;
    }
    .tz-card-en {
      color: var(--muted);
      font-size: 11px;
    }
    .tz-card-footer {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 4px;
    }
    .tz-history-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 520px;
      overflow-y: auto;
      padding-right: 4px;
    }
    .tz-history-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 14px;
      border: 1px solid rgba(168, 85, 147, 0.25);
      border-radius: 8px;
      background: rgba(22, 16, 20, 0.85);
      flex-wrap: wrap;
    }
    .tz-history-main {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .tz-history-time {
      color: var(--gold);
      font-size: 12px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      min-width: 120px;
    }
    .tz-history-name {
      font-size: 14px;
      font-weight: 700;
      color: var(--text);
    }
    .tz-history-badges {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .tz-empty {
      padding: 36px 16px;
      text-align: center;
      color: var(--muted);
      font-size: 13px;
      grid-column: 1 / -1;
    }

    /* DClone Specific */
    .dclone-module {
      border-color: var(--dc-border);
      background:
        radial-gradient(circle at 95% 0%, rgba(218, 75, 56, 0.14) 0, transparent 450px),
        radial-gradient(circle at 5% 100%, rgba(78, 42, 16, 0.22) 0, transparent 400px),
        rgba(25, 20, 15, 0.96);
    }
    .dclone-tag {
      background: rgba(213, 167, 72, 0.2);
      color: #f5cf7b;
      border: 1px solid rgba(213, 167, 72, 0.45);
    }

    /* DClone Toolbar */
    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 20px;
      padding: 14px 16px;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: rgba(21, 17, 13, 0.92);
      backdrop-filter: blur(12px);
    }
    .toolbar-left {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 18px;
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
      font-size: 13px;
      transition: all .2s;
    }
    .filter:hover, .refresh:hover { color: var(--text); border-color: #75532d; }
    .filter.active { color: #171006; border-color: var(--gold); background: var(--gold); font-weight: 800; }
    .refresh {
      background: #211913;
      border-color: #543f2c;
      color: #e5d7c3;
    }
    .refresh:hover {
      background: #2b2018;
      border-color: var(--gold);
    }
    .refresh[disabled] { opacity: .55; cursor: wait; }
    .legend { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; color: var(--muted); font-size: 12px; }
    .legend span::before {
      content: "";
      display: inline-block;
      width: 8px;
      height: 8px;
      margin-right: 6px;
      border-radius: 50%;
      background: var(--level);
    }

    /* DLC Card Sections */
    .dlc {
      margin-top: 20px;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: rgba(22, 17, 13, 0.94);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.28);
    }
    .dlc:first-child {
      margin-top: 0;
    }
    .dlc-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 16px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--line);
      background: linear-gradient(90deg, rgba(213, 167, 72, .14), transparent 52%);
    }
    .dlc h2 { margin: 0; font: 700 23px Georgia, "Songti SC", serif; color: var(--text); }
    .dlc-count { color: var(--muted); font-size: 13px; }
    .matrix-wrap { overflow-x: auto; }
    .mobile-matrix { display: none; }
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

    /* Runewords Specific */
    .runewords-module {
      border-color: var(--rw-border);
      background:
        radial-gradient(circle at 95% 0%, rgba(45, 148, 98, 0.14) 0, transparent 420px),
        radial-gradient(circle at 5% 100%, rgba(20, 62, 44, 0.2) 0, transparent 360px),
        rgba(15, 20, 17, 0.96);
    }
    .runewords-tag {
      background: rgba(94, 196, 142, 0.18);
      color: #8ee5b6;
      border: 1px solid rgba(94, 196, 142, 0.45);
    }
    .rw-summary-card {
      padding: 16px 18px;
      border: 1px solid rgba(94, 196, 142, 0.28);
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(20, 44, 33, 0.65), rgba(14, 18, 16, 0.92));
      margin-bottom: 18px;
    }
    .rw-summary-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .rw-stats {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 18px;
    }
    .rw-stat {
      display: flex;
      align-items: baseline;
      gap: 6px;
      font-size: 13px;
      color: var(--muted);
    }
    .rw-stat strong {
      font-size: 18px;
      color: #fff;
      font-variant-numeric: tabular-nums;
    }
    .rw-stat strong.rw-accent { color: #8ee5b6; }
    .rw-stat strong.rw-gold { color: #f5cf7b; }
    .rw-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .rw-btn {
      padding: 6px 12px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #141816;
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all .2s;
    }
    .rw-btn:hover { color: var(--text); border-color: rgba(94, 196, 142, 0.55); }
    .rw-btn.active {
      color: #0e1a13;
      background: var(--rw-accent);
      border-color: var(--rw-accent);
    }
    .rw-btn-danger:hover {
      color: #ffb7aa;
      border-color: rgba(218, 75, 56, 0.6);
      background: rgba(218, 75, 56, 0.14);
    }
    .rw-progress-track {
      height: 8px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
      overflow: hidden;
    }
    .rw-progress-fill {
      height: 100%;
      width: 0%;
      border-radius: 999px;
      background: linear-gradient(90deg, #3da470, #8ee5b6);
      box-shadow: 0 0 12px rgba(94, 196, 142, 0.45);
      transition: width .25s ease;
    }

    .rw-rune-section {
      margin-bottom: 18px;
      padding: 16px;
      border: 1px solid rgba(94, 196, 142, 0.25);
      border-radius: 12px;
      background: rgba(14, 17, 15, 0.82);
    }
    .rw-section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .rw-section-title {
      margin: 0;
      font-size: 14px;
      font-weight: 800;
      color: #8ee5b6;
      letter-spacing: .03em;
    }
    .rw-section-sub {
      color: var(--muted);
      font-size: 12px;
    }
    .rw-rune-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
      gap: 8px;
    }
    .rw-rune-card {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 3px;
      padding: 8px 10px;
      border: 1px solid rgba(59, 44, 29, 0.75);
      border-radius: 9px;
      background: rgba(23, 21, 18, 0.92);
      cursor: pointer;
      text-align: left;
      transition: border-color .15s, transform .15s, background .15s, box-shadow .15s;
    }
    .rw-rune-card:hover {
      border-color: rgba(94, 196, 142, 0.65);
      transform: translateY(-1px);
    }
    .rw-rune-card.done {
      opacity: .55;
    }
    .rw-rune-card.selected {
      opacity: 1;
      border-color: #ffd54f;
      outline: 1.5px solid rgba(255, 213, 79, 0.78);
      background: linear-gradient(135deg, rgba(46, 112, 74, 0.88), rgba(26, 62, 42, 0.95));
      box-shadow: 0 0 16px rgba(94, 196, 142, 0.6), 0 0 6px rgba(255, 213, 79, 0.45), inset 0 0 12px rgba(255, 213, 79, 0.22);
      transform: translateY(-2px);
      z-index: 2;
    }
    .rw-rune-card.selected::after {
      content: "✓";
      position: absolute;
      top: -6px;
      right: -6px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #ffd54f;
      color: #14110c;
      font-size: 11px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.75);
    }
    .rw-rune-card.selected .rw-rune-top,
    .rw-rune-card.selected .rw-rune-name {
      color: #ffe082;
      text-shadow: 0 0 8px rgba(255, 213, 79, 0.4);
    }
    .rw-rune-pill.pill-selected {
      border-color: #ffd54f !important;
      background: rgba(255, 213, 79, 0.25) !important;
      color: #fff3c4 !important;
      box-shadow: 0 0 8px rgba(255, 213, 79, 0.4);
    }
    .rw-rune-card.tier-high { border-left: 3px solid #e09f3e; }
    .rw-rune-card.tier-mid { border-left: 3px solid #6cb4ee; }
    .rw-rune-card.tier-low { border-left: 3px solid #8a8175; }
    .rw-rune-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      font-size: 11px;
      color: var(--muted);
    }
    .rw-rune-num { font-variant-numeric: tabular-nums; font-weight: 700; }
    .rw-rune-name {
      font-size: 13px;
      font-weight: 800;
      color: #f6ede0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .rw-rune-counts {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 4px;
      margin-top: 2px;
      font-size: 12px;
      font-variant-numeric: tabular-nums;
    }
    .rw-rune-rem {
      font-weight: 800;
      color: #8ee5b6;
    }
    .rw-rune-card.done .rw-rune-rem { color: var(--muted); }
    .rw-rune-tot { font-size: 11px; color: var(--muted); }

    .rw-filter-bar {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 16px;
      padding: 14px;
      border: 1px solid rgba(59, 44, 29, 0.6);
      border-radius: 10px;
      background: rgba(16, 19, 17, 0.85);
    }
    .rw-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 10px;
      max-height: 640px;
      overflow-y: auto;
      padding-right: 4px;
    }
    .rw-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 13px 14px;
      border: 1px solid rgba(94, 196, 142, 0.22);
      border-radius: 10px;
      background: linear-gradient(135deg, rgba(20, 28, 24, 0.85), rgba(16, 15, 14, 0.95));
      cursor: pointer;
      transition: border-color .18s, background .18s, opacity .18s;
    }
    .rw-item:hover {
      border-color: rgba(94, 196, 142, 0.55);
    }
    .rw-item.completed {
      border-color: rgba(94, 196, 142, 0.45);
      background: linear-gradient(135deg, rgba(24, 52, 37, 0.55), rgba(15, 20, 17, 0.92));
    }
    .rw-check {
      width: 20px;
      height: 20px;
      margin-top: 2px;
      flex: 0 0 auto;
      accent-color: var(--rw-accent);
      cursor: pointer;
    }
    .rw-item-body {
      flex: 1;
      min-width: 0;
    }
    .rw-item-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    .rw-item-title {
      font-family: Georgia, "Songti SC", serif;
      font-size: 16px;
      font-weight: 700;
      color: #fff;
    }
    .rw-item.completed .rw-item-title {
      color: #a9e9c6;
      text-decoration: line-through;
      text-decoration-color: rgba(142, 229, 182, 0.5);
    }
    .rw-item-en {
      font-size: 12px;
      color: var(--muted);
      margin-left: 6px;
      font-family: ui-sans-serif, system-ui, sans-serif;
      font-weight: 500;
    }
    .rw-item-badges {
      display: flex;
      align-items: center;
      gap: 5px;
      flex-wrap: wrap;
    }
    .rw-badge {
      padding: 2px 7px;
      border-radius: 5px;
      font-size: 11px;
      font-weight: 700;
      border: 1px solid rgba(169, 154, 133, 0.3);
      background: rgba(16, 13, 10, 0.7);
      color: #d8ccbb;
      white-space: nowrap;
    }
    .rw-badge-patch {
      color: #8ee5b6;
      border-color: rgba(94, 196, 142, 0.35);
      background: rgba(94, 196, 142, 0.12);
    }
    .rw-badge-unlocked {
      color: #a6d6ff;
      border-color: rgba(108, 180, 238, 0.4);
      background: rgba(108, 180, 238, 0.12);
    }
    .rw-badge-rotw {
      color: #ec9ce4;
      border-color: rgba(196, 98, 187, 0.45);
      background: rgba(196, 98, 187, 0.14);
    }
    .rw-badge-ladder {
      color: #ffd584;
      border-color: rgba(224, 159, 62, 0.55);
      background: rgba(224, 159, 62, 0.16);
    }
    .rw-item-note {
      margin: 0 0 8px;
      font-size: 11px;
      color: #d5a748;
    }
    .rw-item-bases {
      margin: 4px 0 8px;
      font-size: 12px;
      color: var(--muted);
    }
    .rw-rune-seq {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 5px;
    }
    .rw-rune-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      background: rgba(25, 22, 18, 0.95);
      border: 1px solid rgba(117, 83, 45, 0.5);
      color: #f2e7d5;
    }
    .rw-rune-pill.tier-high {
      border-color: rgba(224, 159, 62, 0.65);
      color: #ffd584;
      background: rgba(224, 159, 62, 0.12);
    }
    .rw-rune-pill.tier-mid {
      border-color: rgba(108, 180, 238, 0.5);
      color: #a6d6ff;
      background: rgba(108, 180, 238, 0.1);
    }
    .rw-rune-pill-num {
      font-size: 10px;
      opacity: .75;
    }
    .rw-detail-btn {
      margin-left: auto;
      padding: 2px 9px;
      border: 1px solid rgba(94, 196, 142, 0.35);
      border-radius: 6px;
      background: rgba(94, 196, 142, 0.1);
      color: #8ee5b6;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      transition: all .15s;
    }
    .rw-detail-btn:hover {
      background: rgba(94, 196, 142, 0.22);
      border-color: var(--rw-accent);
      color: #fff;
    }

    /* Runeword Detail Modal */
    .rw-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(8, 7, 6, 0.78);
      backdrop-filter: blur(6px);
    }
    .rw-modal-backdrop.open {
      display: flex;
      animation: tabFadeIn .16s ease-out;
    }
    .rw-modal {
      width: min(620px, 100%);
      max-height: min(86vh, 780px);
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(213, 167, 72, 0.48);
      border-radius: 16px;
      background:
        radial-gradient(circle at 90% 0%, rgba(94, 196, 142, 0.12) 0, transparent 280px),
        linear-gradient(180deg, #1b1612, #120f0c);
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.75);
      overflow: hidden;
    }
    .rw-modal-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 14px;
      padding: 18px 22px 14px;
      border-bottom: 1px solid rgba(59, 44, 29, 0.75);
    }
    .rw-modal-title {
      margin: 0;
      font: 700 22px Georgia, "Songti SC", serif;
      color: #e3bc6d;
    }
    .rw-modal-en {
      margin-top: 2px;
      font-size: 13px;
      color: var(--muted);
    }
    .rw-modal-close {
      width: 32px;
      height: 32px;
      flex: 0 0 auto;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #171310;
      color: var(--muted);
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
    }
    .rw-modal-close:hover {
      color: #fff;
      border-color: var(--gold);
    }
    .rw-modal-body {
      padding: 18px 22px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .rw-modal-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      font-size: 13px;
      color: #d8ccbb;
    }
    .rw-modal-runes-box {
      padding: 12px 14px;
      border: 1px solid rgba(94, 196, 142, 0.25);
      border-radius: 10px;
      background: rgba(14, 18, 16, 0.78);
    }
    .rw-modal-runes-label {
      margin-bottom: 8px;
      font-size: 12px;
      color: var(--muted);
      font-weight: 700;
    }
    .rw-modal-runes {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
    }
    .rw-modal-arrow {
      color: var(--muted);
      font-size: 12px;
    }
    .rw-modal-stats {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .rw-stat-group {
      padding: 13px 15px;
      border: 1px solid rgba(59, 44, 29, 0.7);
      border-radius: 10px;
      background: rgba(16, 14, 12, 0.85);
    }
    .rw-stat-group-title {
      margin: 0 0 8px;
      font-size: 12px;
      font-weight: 800;
      color: #e3bc6d;
      letter-spacing: .04em;
    }
    .rw-stat-list {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 5px;
      font-size: 13px;
      color: #88b3ff;
      text-align: center;
    }
    .rw-modal-foot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px 22px;
      border-top: 1px solid rgba(59, 44, 29, 0.75);
      background: rgba(15, 12, 10, 0.95);
    }

    /* Affixes Module Specific */
    .affixes-module {
      border-color: var(--af-border);
      background:
        radial-gradient(circle at 95% 0%, rgba(72, 130, 230, 0.14) 0, transparent 420px),
        radial-gradient(circle at 5% 100%, rgba(26, 48, 92, 0.22) 0, transparent 360px),
        rgba(14, 17, 24, 0.96);
    }
    .affixes-tag {
      background: rgba(104, 164, 255, 0.18);
      color: #9dc5ff;
      border: 1px solid rgba(104, 164, 255, 0.45);
    }
    .af-rules-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 18px;
    }
    .af-rule-card {
      padding: 14px 16px;
      border: 1px solid rgba(104, 164, 255, 0.25);
      border-radius: 12px;
      background: rgba(18, 22, 32, 0.85);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .af-rule-card.rule-magic { border-top: 3px solid #68a4ff; }
    .af-rule-card.rule-rare { border-top: 3px solid #f7df74; }
    .af-rule-card.rule-crafted { border-top: 3px solid #ff9b42; }
    .af-rule-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 14px;
      font-weight: 800;
      color: #fff;
    }
    .af-rule-limit {
      font-size: 12px;
      font-weight: 700;
      color: #9dc5ff;
    }
    .af-rule-card.rule-rare .af-rule-limit { color: #f7df74; }
    .af-rule-card.rule-crafted .af-rule-limit { color: #ffb26b; }
    .af-rule-desc {
      margin: 0;
      font-size: 12px;
      color: var(--muted);
      line-height: 1.5;
    }
    .af-craft-toggle {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 16px;
      border: 1px solid rgba(255, 155, 66, 0.35);
      border-radius: 10px;
      background: rgba(54, 30, 14, 0.4);
      color: #ffb26b;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      margin-bottom: 14px;
      transition: background .2s;
    }
    .af-craft-toggle:hover {
      background: rgba(74, 40, 18, 0.55);
      color: #ffd5a8;
    }
    .af-craft-body {
      margin-bottom: 18px;
      padding: 14px;
      border: 1px solid rgba(255, 155, 66, 0.28);
      border-radius: 12px;
      background: rgba(16, 14, 14, 0.9);
    }
    .af-craft-formula-tip {
      margin: 0 0 12px;
      padding: 9px 12px;
      border-radius: 8px;
      background: rgba(255, 155, 66, 0.1);
      border: 1px solid rgba(255, 155, 66, 0.25);
      color: #ffd5a8;
      font-size: 12px;
    }
    .af-craft-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 10px;
    }
    .af-craft-card {
      padding: 12px 14px;
      border: 1px solid rgba(255, 155, 66, 0.22);
      border-radius: 10px;
      background: rgba(24, 19, 17, 0.92);
    }
    .af-craft-title {
      margin: 0 0 8px;
      font-size: 13px;
      font-weight: 800;
      color: #ffb26b;
    }
    .af-craft-rows {
      display: flex;
      flex-direction: column;
      gap: 7px;
      font-size: 12px;
    }
    .af-craft-row {
      padding-top: 6px;
      border-top: 1px solid rgba(59, 44, 29, 0.45);
    }
    .af-craft-row:first-child {
      padding-top: 0;
      border-top: 0;
    }
    .af-craft-row-head {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      color: #f2e7d5;
      font-weight: 700;
    }
    .af-craft-row-meta {
      color: var(--muted);
      font-size: 11px;
      margin-top: 2px;
    }
    .af-filter-bar {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 16px;
      padding: 14px;
      border: 1px solid rgba(104, 164, 255, 0.25);
      border-radius: 10px;
      background: rgba(15, 18, 25, 0.88);
    }
    .af-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 10px;
      max-height: 620px;
      overflow-y: auto;
      padding-right: 4px;
    }
    .af-card {
      padding: 13px 14px;
      border: 1px solid rgba(104, 164, 255, 0.22);
      border-radius: 10px;
      background: linear-gradient(135deg, rgba(18, 24, 36, 0.88), rgba(14, 16, 22, 0.96));
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .af-card-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }
    .af-card-title {
      font-size: 15px;
      font-weight: 700;
      color: #fff;
    }
    .af-card-en {
      font-size: 11px;
      color: var(--muted);
      margin-left: 6px;
    }
    .af-card-range {
      font-size: 15px;
      font-weight: 800;
      color: #88b3ff;
    }
    .af-card-badges {
      display: flex;
      align-items: center;
      gap: 5px;
      flex-wrap: wrap;
    }
    .af-badge-magic {
      color: #8ab8ff;
      border-color: rgba(104, 164, 255, 0.45);
      background: rgba(104, 164, 255, 0.14);
    }
    .af-badge-rare {
      color: #f7df74;
      border-color: rgba(247, 223, 116, 0.45);
      background: rgba(247, 223, 116, 0.12);
    }
    .af-badge-crafted {
      color: #ffb26b;
      border-color: rgba(255, 155, 66, 0.5);
      background: rgba(255, 155, 66, 0.15);
    }
    .af-badge-all {
      color: #c7d4e6;
      border-color: rgba(169, 184, 204, 0.35);
      background: rgba(169, 184, 204, 0.1);
    }
    .af-card-note {
      font-size: 11px;
      color: var(--muted);
      line-height: 1.45;
    }

    /* Item Affix Simulator */
    .af-subtabs {
      display: flex;
      gap: 10px;
      margin-bottom: 18px;
      border-bottom: 1px solid rgba(104, 164, 255, 0.25);
      padding-bottom: 10px;
      flex-wrap: wrap;
    }
    .af-subtab {
      padding: 8px 16px;
      border: 1px solid rgba(104, 164, 255, 0.28);
      border-radius: 9px;
      background: rgba(16, 20, 30, 0.78);
      color: var(--muted);
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all .2s;
    }
    .af-subtab:hover { color: var(--text); border-color: rgba(104, 164, 255, 0.55); }
    .af-subtab.active {
      color: #0b1322;
      background: var(--af-accent);
      border-color: var(--af-accent);
    }
    .sim-controls {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      border: 1px solid rgba(104, 164, 255, 0.28);
      border-radius: 12px;
      background: rgba(15, 19, 28, 0.9);
      margin-bottom: 16px;
    }
    .sim-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
    .sim-field {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--muted);
    }
    .sim-select, .sim-num-input {
      height: 36px;
      padding: 6px 10px;
      border: 1px solid rgba(104, 164, 255, 0.35);
      border-radius: 8px;
      background: #10141d;
      color: var(--text);
      font-size: 13px;
      outline: none;
    }
    .sim-num-input { width: 76px; text-align: center; font-variant-numeric: tabular-nums; }
    .sim-select:focus, .sim-num-input:focus { border-color: var(--af-accent); }
    .sim-status-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 8px;
      background: rgba(104, 164, 255, 0.08);
      border: 1px solid rgba(104, 164, 255, 0.22);
      font-size: 12px;
      color: #cfe0fa;
    }
    .sim-status-metrics {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
    }
    .sim-status-metrics strong { color: #fff; font-size: 13px; }
    .sim-workspace {
      display: grid;
      grid-template-columns: 1.45fr 1fr;
      gap: 16px;
      align-items: start;
    }
    .sim-pools {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .sim-pool {
      padding: 12px;
      border: 1px solid rgba(104, 164, 255, 0.22);
      border-radius: 10px;
      background: rgba(14, 17, 25, 0.88);
    }
    .sim-pool-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 13px;
      font-weight: 800;
      color: #9dc5ff;
    }
    .sim-pool-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-height: 460px;
      overflow-y: auto;
      padding-right: 2px;
    }
    .sim-affix-btn {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid rgba(59, 44, 29, 0.7);
      border-radius: 8px;
      background: rgba(22, 25, 34, 0.92);
      color: var(--text);
      text-align: left;
      cursor: pointer;
      transition: all .15s;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .sim-affix-btn:hover:not(:disabled) {
      border-color: rgba(104, 164, 255, 0.65);
      background: rgba(28, 36, 52, 0.95);
    }
    .sim-affix-btn.selected {
      border-color: #68a4ff;
      background: rgba(40, 74, 130, 0.45);
      box-shadow: 0 0 10px rgba(104, 164, 255, 0.22);
    }
    .sim-affix-btn:disabled {
      opacity: .38;
      cursor: not-allowed;
    }
    .sim-affix-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      font-size: 12px;
      font-weight: 700;
    }
    .sim-affix-range {
      font-size: 12px;
      font-weight: 800;
      color: #88b3ff;
    }
    .sim-affix-req {
      font-size: 11px;
      color: var(--muted);
    }
    .sim-preview-card {
      position: sticky;
      top: 16px;
      padding: 18px;
      border-radius: 12px;
      border: 1px solid rgba(213, 167, 72, 0.45);
      background: rgba(10, 10, 12, 0.96);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55);
      text-align: center;
    }
    .sim-preview-card.q-magic { border-color: rgba(104, 164, 255, 0.55); }
    .sim-preview-card.q-rare { border-color: rgba(247, 223, 116, 0.55); }
    .sim-preview-card.q-crafted { border-color: rgba(255, 155, 66, 0.6); }
    .sim-item-name {
      margin: 0;
      font: 700 18px Georgia, "Songti SC", serif;
    }
    .q-magic .sim-item-name { color: #68a4ff; }
    .q-rare .sim-item-name { color: #f7df74; }
    .q-crafted .sim-item-name { color: #ff9b42; }
    .sim-item-sub {
      margin: 4px 0 12px;
      font-size: 12px;
      color: var(--muted);
    }
    .sim-item-lines {
      margin: 0;
      padding: 12px 0 0;
      list-style: none;
      border-top: 1px solid rgba(59, 44, 29, 0.6);
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 13px;
      color: #88b3ff;
    }
    .sim-item-lines li.fixed-line {
      color: #ffb26b;
    }
    @media (max-width: 900px) {
      .sim-workspace { grid-template-columns: 1fr; }
      .sim-pools { grid-template-columns: 1fr; }
      .sim-preview-card { position: static; }
    }
    @media (max-width: 720px) {
      .af-rules-grid { grid-template-columns: 1fr; }
      .af-list { grid-template-columns: 1fr; }
    }

    /* Items Encyclopedia Module Specific */
    .items-module {
      border-color: var(--it-border);
      background:
        radial-gradient(circle at 95% 0%, rgba(190, 108, 46, 0.14) 0, transparent 420px),
        radial-gradient(circle at 5% 100%, rgba(72, 38, 16, 0.22) 0, transparent 360px),
        rgba(20, 16, 13, 0.96);
    }
    .items-tag {
      background: rgba(229, 147, 82, 0.18);
      color: #f6b984;
      border: 1px solid rgba(229, 147, 82, 0.45);
    }
    .it-subtabs {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 16px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(229, 147, 82, 0.22);
    }
    .it-subtab {
      padding: 7px 14px;
      border: 1px solid rgba(229, 147, 82, 0.28);
      border-radius: 8px;
      background: rgba(24, 18, 14, 0.85);
      color: var(--muted);
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all .2s;
    }
    .it-subtab:hover { color: var(--text); border-color: rgba(229, 147, 82, 0.55); }
    .it-subtab.active {
      color: #1b1006;
      background: var(--it-accent);
      border-color: var(--it-accent);
    }
    .it-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
      gap: 10px;
      max-height: 640px;
      overflow-y: auto;
      padding-right: 4px;
    }
    .it-card {
      padding: 13px 14px;
      border: 1px solid rgba(229, 147, 82, 0.22);
      border-radius: 10px;
      background: linear-gradient(135deg, rgba(28, 21, 16, 0.88), rgba(16, 13, 11, 0.96));
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .it-card.it-set { border-color: rgba(87, 219, 112, 0.3); cursor: pointer; transition: border-color .15s, transform .15s; }
    .it-card.it-set:hover { border-color: rgba(87, 219, 112, 0.68); transform: translateY(-1px); }
    .it-set-pieces-grid { display: flex; flex-direction: column; gap: 10px; }
    .it-set-piece {
      padding: 12px 14px;
      border: 1px solid rgba(87, 219, 112, 0.25);
      border-radius: 10px;
      background: rgba(14, 22, 16, 0.85);
    }
    .it-set-piece-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 6px;
      flex-wrap: wrap;
    }
    .it-set-piece-title { font-size: 14px; font-weight: 800; color: #67e87a; }
    .it-set-piece-sub { font-size: 11px; color: var(--muted); }
    .it-set-piece-stats { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 3px; font-size: 12px; color: #88b3ff; }
    .it-set-piece-bonus { margin: 6px 0 0; padding: 6px 0 0; border-top: 1px dashed rgba(87, 219, 112, 0.22); list-style: none; display: flex; flex-direction: column; gap: 2px; font-size: 12px; color: #67e87a; }
    .it-set-bonus-box {
      padding: 12px 14px;
      border: 1px solid rgba(213, 167, 72, 0.35);
      border-radius: 10px;
      background: rgba(24, 20, 14, 0.9);
    }
    .it-set-bonus-title { margin: 0 0 8px; font-size: 12px; font-weight: 800; color: #e3bc6d; }
    .it-set-bonus-list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: #f5cf7b; }
    .it-card.it-unique { border-color: rgba(213, 167, 72, 0.35); }
    .it-card.it-magic { border-color: rgba(104, 164, 255, 0.32); }
    .it-card.it-rare { border-color: rgba(247, 223, 116, 0.32); }
    .it-card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .it-card-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      min-width: 0;
    }
    .it-card-title-row > div:not(.it-thumb-wrap) {
      flex: 1;
      min-width: 0;
    }
    .it-card-head .af-card-badges {
      flex-shrink: 0;
      justify-content: flex-end;
    }
    .it-thumb-wrap {
      flex: 0 0 auto;
      width: 46px;
      height: 46px;
      padding: 4px;
      border-radius: 9px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background:
        repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 11px),
        repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 11px),
        radial-gradient(circle at 50% 40%, rgba(46, 36, 26, 0.9), rgba(10, 8, 6, 0.98));
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 1px 6px rgba(0, 0, 0, 0.75);
    }
    .it-unique .it-thumb-wrap { border-color: rgba(199, 179, 119, 0.45); box-shadow: inset 0 0 10px rgba(199, 179, 119, 0.14); }
    .it-set .it-thumb-wrap, .it-set-piece .it-thumb-wrap { border-color: rgba(0, 224, 0, 0.4); box-shadow: inset 0 0 10px rgba(0, 224, 0, 0.12); }
    .it-magic .it-thumb-wrap { border-color: rgba(105, 105, 255, 0.45); box-shadow: inset 0 0 10px rgba(105, 105, 255, 0.14); }
    .it-rare .it-thumb-wrap { border-color: rgba(255, 255, 102, 0.45); box-shadow: inset 0 0 10px rgba(255, 255, 102, 0.14); }
    .it-thumb {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.85));
    }
    .rw-rune-thumb {
      width: 24px;
      height: 24px;
      object-fit: contain;
      filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.85));
      flex-shrink: 0;
    }
    .it-card-title { font-size: 15px; font-weight: 700; color: #fff; line-height: 1.3; display: block; }
    .it-set .it-card-title { color: #67e87a; }
    .it-unique .it-card-title { color: #e3bc6d; }
    .it-magic .it-card-title { color: #7cb2ff; }
    .it-rare .it-card-title { color: #f7df74; }
    .it-card-en { font-size: 11px; color: var(--muted); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
    .it-card-stats { font-size: 12px; color: #88b3ff; line-height: 1.5; }
    .it-stat-list {
      margin: 4px 0;
      padding: 7px 10px;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 3px;
      border-radius: 8px;
      background: rgba(8, 6, 5, 0.55);
      border: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 12.5px;
      color: #88b3ff;
      line-height: 1.45;
    }
    .it-stat-list li::before {
      content: "◆ ";
      font-size: 9px;
      opacity: 0.65;
      vertical-align: 1px;
    }
    .it-card-note { font-size: 11px; color: var(--muted); line-height: 1.45; }
    @media (max-width: 720px) {
      .it-grid { grid-template-columns: 1fr; }
    }

    /* Settings Module Specific */
    .settings-module {
      border-color: rgba(90, 75, 60, 0.45);
      background: rgba(18, 14, 11, 0.85);
    }
    .settings-tag {
      background: rgba(169, 154, 133, 0.18);
      color: #cfc1b0;
      border: 1px solid rgba(169, 154, 133, 0.35);
    }
    .settings-panel {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1px;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: var(--line);
    }
    .setting-group { padding: 18px; background: rgba(25, 20, 15, .98); }
    .setting-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .setting-title { margin: 0; font-size: 15px; color: var(--text); }
    .setting-description { margin: 5px 0 13px; color: var(--muted); font-size: 12px; }
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

    .empty, .error {
      padding: 56px 20px;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: var(--panel);
      color: var(--muted);
      text-align: center;
    }
    .error { color: #ffb7aa; }
    footer { margin-top: 28px; color: #776b5d; font-size: 12px; text-align: center; }

    /* Native D2R HD UI & Item Icons */
    .ui-tab-icon {
      width: 20px;
      height: 20px;
      object-fit: contain;
      vertical-align: middle;
      margin-right: 6px;
      filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.75));
      flex-shrink: 0;
    }
    .ui-chip-icon {
      width: 17px;
      height: 17px;
      object-fit: contain;
      vertical-align: middle;
      margin-right: 5px;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.75));
      flex-shrink: 0;
    }
    .ui-imm-icon {
      width: 18px;
      height: 20px;
      object-fit: contain;
      vertical-align: middle;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.85));
      flex-shrink: 0;
    }
    .terror-badge.immunity-badge {
      gap: 4px;
      padding: 0 7px 0 5px;
    }
    .ui-imm-text {
      font-size: 11px;
      line-height: 1;
    }
    .it-subtab, .af-subtab, .tz-tab, .tz-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .sim-preview-head {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 4px;
    }
    .sim-preview-thumb {
      width: 38px;
      height: 38px;
      object-fit: contain;
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(213, 167, 72, 0.35);
      padding: 3px;
      flex-shrink: 0;
    }

    /* Responsive */
    @media (max-width: 720px) {
      .shell { width: min(100% - 20px, 1420px); padding-top: 20px; }
      .hero { align-items: flex-start; flex-direction: column; gap: 14px; }
      .status-line { text-align: left; }
      .main-nav-tabs { flex-wrap: wrap; gap: 8px; margin-bottom: 18px; padding-bottom: 10px; }
      .main-nav-tab { flex: 1 1 auto; justify-content: center; padding: 10px 12px; font-size: 13px; }
      .rw-rune-grid { grid-template-columns: repeat(auto-fill, minmax(94px, 1fr)); }
      .rw-list { grid-template-columns: 1fr; }
      .module-block { padding: 15px; margin-bottom: 20px; border-radius: 14px; }
      .module-header { flex-direction: column; align-items: flex-start; gap: 6px; }
      .terror-overview { grid-template-columns: 1fr; gap: 12px; }
      .terror-card { min-height: 0; padding: 17px; }
      .terror-meta { align-items: flex-start; flex-direction: column; gap: 3px; }
      .toolbar { align-items: stretch; flex-direction: column; padding: 12px; }
      .toolbar-left { flex-direction: column; align-items: flex-start; gap: 10px; }
      .refresh { width: 100%; }
      .settings-panel { grid-template-columns: 1fr; }
      .tz-directory-body { padding: 12px; }
      .tz-grid { grid-template-columns: 1fr; }
      .tz-history-item { flex-direction: column; align-items: flex-start; gap: 8px; }
      .matrix-wrap { display: none; }
      .mobile-matrix { display: block; }
      .mobile-region + .mobile-region { border-top: 1px solid var(--line); }
      .mobile-region-title {
        margin: 0;
        padding: 10px 13px;
        background: #15110d;
        color: var(--text);
        font-size: 14px;
        letter-spacing: .04em;
      }
      .mobile-region-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .mobile-region-grid .cell { min-width: 0; min-height: 142px; padding: 12px; border-bottom: 1px solid var(--line); }
      .mobile-region-grid .cell:nth-child(odd) { border-right: 1px solid var(--line); }
      .mobile-region-grid .cell:nth-last-child(-n + 2) { border-bottom: 0; }
      .mobile-region-grid .mode { font-size: 11px; }
      .mobile-region-grid .message { min-height: 40px; font-size: 13px; }
      .mobile-region-grid .times { font-size: 11px; }
      .dlc-head { padding: 15px 13px; }
      .dlc h2 { font-size: 20px; }
      .dlc-count { font-size: 12px; }
    }
    @media (max-width: 390px) {
      .mobile-region-grid .cell { padding: 10px; }
      .mobile-region-grid .card-top { align-items: flex-start; flex-direction: column; }
      .mobile-region-grid .progress { margin-top: 11px; }
    }
  </style>
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
        <button class="settings-jump-btn" id="jump-settings-btn" type="button" title="展开同步与刷新设置" data-i18n="settingsBtn">⚙ 刷新设置</button>
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
        <span class="kbd-mini">1</span>–<span class="kbd-mini">5</span><span data-i18n="shortcutTabs">切页</span>
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
              <button class="tz-chip" data-rw-type="weapon" type="button"><img class="ui-chip-icon" src="/images/items/weapon/axe/war_axe.webp" alt="">武器</button>
              <button class="tz-chip" data-rw-type="armor" type="button"><img class="ui-chip-icon" src="/images/items/armor/armor/ancient_armor.webp" alt="">盔甲</button>
              <button class="tz-chip" data-rw-type="helm" type="button"><img class="ui-chip-icon" src="/images/items/armor/helmet/crown.webp" alt="">头盔</button>
              <button class="tz-chip" data-rw-type="shield" type="button"><img class="ui-chip-icon" src="/images/items/armor/shield/kite_shield.webp" alt="">盾牌</button>
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
                </div>
              </div>
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

        <div class="it-subtabs" id="it-subtabs" role="tablist" aria-label="物品资讯分类">
          <button class="it-subtab active" data-it-tab="base" type="button"><img class="ui-tab-icon" src="/images/ui/gemsocket.webp" alt=""><span data-i18n="itTabBase">基础底材</span></button>
          <button class="it-subtab" data-it-tab="magicRare" type="button"><img class="ui-tab-icon" src="/images/items/armor/circlet/diadem.webp" alt=""><span data-i18n="itTabMagicRare">蓝/黄极品</span></button>
          <button class="it-subtab" data-it-tab="set" type="button"><img class="ui-tab-icon" src="/images/items/armor/helmet/horazons_countenance.webp" alt=""><span data-i18n="itTabSet">绿色套装</span></button>
          <button class="it-subtab" data-it-tab="unique" type="button"><img class="ui-tab-icon" src="/images/items/misc/quest/mephisto_soul_stone.webp" alt=""><span data-i18n="itTabUnique">暗金装备</span></button>
          <button class="it-subtab" data-it-tab="cube" type="button"><img class="ui-tab-icon" src="/images/items/misc/quest/horadric_cube.webp" alt=""><span data-i18n="itTabCube">方块公式</span></button>
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
          <div class="tz-filter-row" id="it-base-sockets-row">
            <div class="tz-filter-label">孔数：</div>
            <div class="tz-chips" id="it-base-sockets-chips">
              <button type="button" class="tz-chip active" data-it-sock="all">全部孔数</button>
              <button type="button" class="tz-chip" data-it-sock="2">可出 2 孔</button>
              <button type="button" class="tz-chip" data-it-sock="3">可出 3 孔</button>
              <button type="button" class="tz-chip" data-it-sock="4">可出 4 孔</button>
              <button type="button" class="tz-chip" data-it-sock="5">可出 5 孔</button>
              <button type="button" class="tz-chip" data-it-sock="6">可出 6 孔</button>
            </div>
          </div>
        </div>

        <div class="it-grid" id="it-grid">正在加载物品资讯...</div>
      </section>
    </div>

    <!-- 折叠式系统同步与刷新设置抽屉 -->
    <details class="settings-drawer" id="settings-drawer">
      <summary class="settings-drawer-summary">
        <span>⚙ 系统监控、页面自动刷新与 Worker 后台拉取设置</span>
        <span>点击展开 / 收起 ▼</span>
      </summary>
      <section class="module-block settings-module" aria-label="系统与刷新设置">
      <div class="module-header">
        <div class="module-title-wrap">
          <span class="module-tag settings-tag">SETTINGS</span>
          <h2 class="module-title">监控与刷新设置</h2>
        </div>
        <div class="module-meta">
          <span>恐怖区域仍按整点、半点独立同步</span>
        </div>
      </div>

      <div class="settings-panel" aria-label="刷新设置">
        <div class="setting-group">
          <div class="setting-head">
            <h3 class="setting-title">页面数据自动刷新</h3>
            <label class="switch" aria-label="页面数据自动刷新开关">
              <input type="checkbox" id="auto-refresh-toggle">
              <span class="switch-track"></span>
            </label>
          </div>
          <p class="setting-description">按设定间隔重新读取 KV；恐怖区域切换待确认时每 15 秒读取一次，确认后恢复设定间隔。不会直接请求 D2RuneWizard，也不会整页重载。</p>
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
            <h3 class="setting-title">DC 后台接口拉取</h3>
            <span class="mode" id="pull-current">读取中…</span>
          </div>
          <p class="setting-description">控制 Worker 拉取 24 组地表暗黑进度的频率；恐怖区域仍按整点、半点独立同步。修改需要管理令牌。</p>
          <div class="setting-row">
            <input class="setting-input" id="pull-interval" type="number" min="1" max="1440" step="1" aria-label="后台拉取间隔分钟数" placeholder="分钟">
            <input class="setting-input token-input" id="admin-token" type="password" autocomplete="off" aria-label="管理令牌" placeholder="MANUAL_TRIGGER_TOKEN">
            <button class="save-setting" id="save-pull-interval">保存</button>
          </div>
          <div class="setting-status" id="pull-status"></div>
        </div>
      </div>
      </section>
    </details>

    <footer>数据来源 d2runewizard.com · DC 后台每 <span id="footer-pull-interval">5</span> 分钟拉取 · 恐怖区域整点、半点同步 · 页面读取 Cloudflare KV 缓存</footer>
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

    let currentLang = "zhCN";
    try {
      const savedLang = localStorage.getItem("d2r-lang");
      if (savedLang === "zhCN" || savedLang === "zhTW" || savedLang === "enUS") currentLang = savedLang;
    } catch (e) {}

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
        itTabCube: "方块公式"
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
        itTabCube: "方塊公式"
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
        itTabCube: "Cube Recipes"
      }
    };

    const CN2TW_SRC = ${JSON.stringify(CN2TW_SRC)};
    const CN2TW_DST = ${JSON.stringify(CN2TW_DST)};
    const TW_PHRASE_PAIRS = ${JSON.stringify(TW_PHRASE_PAIRS)};
    const EN_PHRASE_PAIRS = ${JSON.stringify(EN_PHRASE_PAIRS)};
    const CN2TW_MAP = new Map();
    for (let i = 0; i < CN2TW_SRC.length; i++) CN2TW_MAP.set(CN2TW_SRC[i], CN2TW_DST[i]);

    function toZhTW(str) {
      if (!str) return "";
      let s = String(str);
      for (let i = 0; i < TW_PHRASE_PAIRS.length; i++) {
        const k = TW_PHRASE_PAIRS[i][0];
        if (s.includes(k)) s = s.split(k).join(TW_PHRASE_PAIRS[i][1]);
      }
      let out = "";
      for (const ch of s) out += CN2TW_MAP.get(ch) || ch;
      return out;
    }

    function toEnUS(str) {
      if (!str) return "";
      let s = String(str);
      if (!/[一-鿿]/.test(s)) return s;
      s = s.replace(/第\\s*([一二三四五1-5])\\s*幕/g, (_, m) => {
        const map = { "一": 1, "二": 2, "三": 3, "四": 4, "五": 5 };
        return "Act " + (map[m] || m);
      });
      s = s.replace(/可出\\s*(\\d+)\\s*孔/g, "Max $1 Sockets");
      s = s.replace(/最大\\s*(\\d+)\\s*孔/g, "Max $1 Sockets");
      s = s.replace(/(\\d+)\\s*孔/g, "$1 Sockets");
      s = s.replace(/(\\d+)\\s*件套/g, "$1-Piece Set");
      s = s.replace(/【(\\d+)\\s*件】/g, "[$1 Pieces]");
      s = s.replace(/(\\d+(?:[–-]\\d+)?)\\s*件：/g, "$1 Pieces: ");
      s = s.replace(/需求等级\\s*(\\d+)/g, "Req Lvl $1");
      s = s.replace(/需求力量\\s*(\\d+)/g, "Req Str $1");
      s = s.replace(/距切换\\s*/g, "Next in ");
      s = s.replace(/需\\s*(\\d+)/g, "Need $1");
      s = s.replace(/总\\s*(\\d+)/g, "Total $1");
      for (let i = 0; i < EN_PHRASE_PAIRS.length; i++) {
        const k = EN_PHRASE_PAIRS[i][0];
        if (s.includes(k)) s = s.split(k).join(" " + EN_PHRASE_PAIRS[i][1] + " ");
      }
      return s.replace(/\\s{2,}/g, " ").trim();
    }

    function tUI(key) {
      return (UI_I18N[currentLang] && UI_I18N[currentLang][key]) || UI_I18N.zhCN[key] || key;
    }

    function pickLangTitle(item) {
      if (!item) return "";
      if (currentLang === "zhTW") return (item.i18n && item.i18n.zhTW) || toZhTW(item.nameZh || item.zhName || "");
      if (currentLang === "enUS") return (item.i18n && item.i18n.enUS) || item.nameEn || item.enName || item.name || "";
      return (item.i18n && item.i18n.zhCN) || item.nameZh || item.zhName || "";
    }

    function pickLangSub(item) {
      if (!item) return "";
      if (currentLang === "enUS") return (item.i18n && item.i18n.zhCN) || item.nameZh || item.zhName || "";
      return (item.i18n && item.i18n.enUS) || item.nameEn || item.enName || item.name || "";
    }

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

      const tz = data?.terrorZone;
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
        return '<div class="tz-catalog-card">' +
          '<div class="tz-card-head">' +
            '<span class="tz-act-badge">' + escapeHtml(actLabel) + '</span>' +
            ratingBadge +
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
    const MAIN_TABS = [
      { id: "terror", tabId: "main-tab-terror", panelId: "main-panel-terror", hash: "#terror-zone" },
      { id: "dclone", tabId: "main-tab-dclone", panelId: "main-panel-dclone", hash: "#dclone" },
      { id: "runewords", tabId: "main-tab-runewords", panelId: "main-panel-runewords", hash: "#runewords" },
      { id: "affixes", tabId: "main-tab-affixes", panelId: "main-panel-affixes", hash: "#affixes" },
      { id: "items", tabId: "main-tab-items", panelId: "main-panel-items", hash: "#items" }
    ];
    let activeMainTab = "terror";

    function resolveMainTabFromHash(hashValue) {
      const hash = (hashValue || "").toLowerCase();
      if (hash === "#terror" || hash === "#terror-zone" || hash === "#tz") return "terror";
      if (hash === "#dclone" || hash === "#dc" || hash === "#diablo-clone") return "dclone";
      if (hash === "#runewords" || hash === "#rw" || hash === "#runeword") return "runewords";
      if (hash === "#affixes" || hash === "#affix" || hash === "#craft") return "affixes";
      if (hash === "#items" || hash === "#item" || hash === "#db") return "items";
      return null;
    }

    function switchMainTab(tabId, updateHash = true) {
      const targetTab = MAIN_TABS.find(item => item.id === tabId) || MAIN_TABS[0];
      activeMainTab = targetTab.id;
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

    /* 符文之语 100% 记事与符文数量统计逻辑 */
    const RW_STORAGE_KEY = "dclone-runewords-completed";
    let rwRunes = [];
    let rwList = [];
    let rwCompleted = new Set();
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
          rwCompleted = new Set(saved);
        }
      } catch (e) {
        rwCompleted = new Set();
      }
    }

    function saveRwCompleted() {
      try {
        localStorage.setItem(RW_STORAGE_KEY, JSON.stringify([...rwCompleted]));
      } catch (e) {}
    }

    async function loadRunewordsCatalog() {
      try {
        const response = await fetch("/api/runewords", { cache: "no-store" });
        const data = await response.json();
        if (data.ok && Array.isArray(data.runewords)) {
          rwRunes = data.runes || [];
          rwList = data.runewords || [];
          renderRunewordsAll();
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

    function renderTerrorZone(terrorZone) {
      const pickTz = (zh, en) => currentLang === "enUS" ? (en || zh) : (currentLang === "zhTW" ? toZhTW(zh || en) : (zh || en));
      const current = pickTz(terrorZone?.currentZh, terrorZone?.current);
      const next = pickTz(terrorZone?.nextZh, terrorZone?.next);
      const isConfirmed = !isAwaitingTerrorConfirmation(terrorZone);
      document.getElementById("terror-current").textContent = current || "等待数据…";
      document.getElementById("terror-current-original").textContent =
        terrorZone?.current && terrorZone.current !== current ? terrorZone.current : "";
      renderTerrorDetails(
        "terror-current-details",
        terrorZone?.currentDetails,
        "暂无资料"
      );
      document.getElementById("terror-updated").textContent =
        terrorZone?.checkedAt
          ? (isConfirmed ? "已确认 · " : "根据上一轮预测即时切换 · ") +
            formatTime(new Date(terrorZone.checkedAt).getTime() / 1000)
          : "";
      document.getElementById("terror-next").textContent = isConfirmed
        ? (next || "等待数据…")
        : "正在获取下一阶段…";
      document.getElementById("terror-next-original").textContent =
        isConfirmed && terrorZone?.next && terrorZone.next !== next
          ? terrorZone.next
          : "";
      renderTerrorDetails(
        "terror-next-details",
        isConfirmed ? terrorZone?.nextDetails : null,
        isConfirmed ? "暂无资料" : "数据同步中"
      );
      updateTerrorCountdown();
      if (terrorCountdownTimer) clearInterval(terrorCountdownTimer);
      terrorCountdownTimer = setInterval(updateTerrorCountdown, 1000);
    }

    function isAwaitingTerrorConfirmation(terrorZone) {
      const checkedAt = new Date(terrorZone?.checkedAt).getTime();
      const halfHour = 30 * 60 * 1000;
      return Number.isFinite(checkedAt) &&
        Math.floor(Date.now() / halfHour) > Math.floor(checkedAt / halfHour);
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
      const halfHour = 30 * 60 * 1000;
      const nextBoundary = (Math.floor(now / halfHour) + 1) * halfHour;
      const remaining = Math.max(0, nextBoundary - now);
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      const countdownText =
        "距切换 " + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
      document.getElementById("terror-countdown").textContent = countdownText;
      const hudTimerEl = document.getElementById("hud-tz-timer");
      if (hudTimerEl) hudTimerEl.textContent = countdownText;
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
        ? "已开启，每 " + autoRefreshMinutes + " 分钟重新读取并更新页面数据"
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
        const configuredDelay = autoRefreshMinutes * 60 * 1000;
        const delay = isAwaitingTerrorConfirmation(window.dashboardData?.terrorZone)
          ? Math.min(configuredDelay, 15 * 1000)
          : configuredDelay;
        autoRefreshTimer = setTimeout(load, delay);
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
        status.textContent = "DC 后台按此间隔请求 24 组地表暗黑状态";
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
    /* 魔法 / 亮金 / 手工物品词缀范围逻辑 */
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

    function renderStatList(str, color, splitPlus) {
      if (!str) return '';
      const re = splitPlus ? /\\s*(?:·|\\||(?:\\s\\+\\s))\\s*/ : /\\s*(?:·|\\|)\\s*/;
      const parts = String(str).split(re).map(x => x.trim()).filter(Boolean);
      const st = color ? ' style="color:' + color + '"' : '';
      return '<ul class="it-stat-list"' + st + '>' + parts.map(p => '<li>' + escapeHtml(p) + '</li>').join('') + '</ul>';
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

    function updateSimStateAndRender() {
      if (!afData) return;
      const base = getSimBase();

      // 如果底材不支持手工且当前选中了手工，自动切回亮金
      const craftBtn = document.querySelector('#sim-quality-chips [data-sim-quality="crafted"]');
      if (craftBtn) {
        craftBtn.disabled = !base.supportsCraft;
        craftBtn.style.opacity = base.supportsCraft ? "1" : ".4";
      }
      if (!base.supportsCraft && simQuality === "crafted") {
        simQuality = "rare";
        document.querySelectorAll("#sim-quality-chips button").forEach(b => {
          b.classList.toggle("active", b.dataset.simQuality === "rare");
        });
      }

      document.getElementById("sim-standard-lvls").style.display = simQuality === "crafted" ? "none" : "flex";
      document.getElementById("sim-craft-opts").style.display = simQuality === "crafted" ? "flex" : "none";

      const outIlvl = getSimOutIlvl();
      const alvl = computeSimAlvl(outIlvl, base.qlvl, base.magicLvl);
      const limits = getSimLimits(outIlvl);

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
      const baseCleanName = base.label.replace(/^[^\u4e00-\u9fa5A-Za-z]+/, "").split(" (")[0];
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

      document.getElementById("sim-roll-btn").addEventListener("click", rollSimulatedItem);
      document.getElementById("sim-clear-btn").addEventListener("click", () => {
        simSelectedPrefixes = [];
        simSelectedSuffixes = [];
        simRolledLines = null;
        updateSimStateAndRender();
      });

      populateSimCraftRecipes();
      updateSimStateAndRender();
    }

    /* 物品资讯百科逻辑（基础 / 蓝黄 / 绿装 / 暗金 / 方块公式） */
    let itData = null;
    let itActiveTab = "base";
    let itSubFilter = "all";
    let itBaseSocketFilter = "all";
    let itSearchQuery = "";

    const IT_SUBFILTERS = {
      base: [
        { id: "all", label: "全部底材", icon: "/images/ui/gemsocket.webp" },
        { id: "armor", label: "盔甲", icon: "/images/items/armor/armor/light_plate.webp" },
        { id: "shield", label: "盾牌", icon: "/images/items/armor/shield/kite_shield.webp" },
        { id: "weapon", label: "武器/长柄", icon: "/images/items/weapon/polearm/scythe.webp" },
        { id: "helm", label: "头盔", icon: "/images/items/armor/helmet/bone_helm.webp" }
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
        { id: "helm", label: "头盔", icon: "/images/items/armor/circlet/tiara.webp" },
        { id: "armor", label: "盔甲", icon: "/images/items/armor/armor/victors_silk.webp" },
        { id: "weapon", label: "武器", icon: "/images/items/weapon/javelin/maiden_javelin.webp" },
        { id: "shield", label: "盾牌", icon: "/images/items/armor/shield/steelclash.webp" },
        { id: "gloves", label: "手套", icon: "/images/items/armor/glove/gaunlets_h.webp" },
        { id: "boots", label: "鞋子", icon: "/images/items/armor/boot/heavy_boots.webp" },
        { id: "belt", label: "腰带", icon: "/images/items/armor/belt/sash_l.webp" },
        { id: "ring", label: "戒指", icon: "/images/items/misc/ring/ring5.webp" },
        { id: "amulet", label: "护身符", icon: "/images/items/misc/amulet/viper_amulet.webp" },
        { id: "charm", label: "咒符", icon: "/images/items/misc/torch/torch.webp" },
        { id: "jewel", label: "珠宝", icon: "/images/items/misc/body_part/fragment_fire.webp" }
      ],
      cube: []
    };

    async function loadItemsCatalog() {
      try {
        const response = await fetch("/api/items", { cache: "no-store" });
        const data = await response.json();
        if (data.ok) {
          itData = data;
          renderItSubfilters();
          renderItemsGrid();
        }
      } catch (err) {
        console.error("加载物品资讯失败", err);
      }
    }

    function renderItSubfilters() {
      const sockRow = document.getElementById("it-base-sockets-row");
      if (sockRow) {
        sockRow.style.display = itActiveTab === "base" ? "flex" : "none";
      }
      const row = document.getElementById("it-subfilter-row");
      const chips = document.getElementById("it-subfilter-chips");
      const options = IT_SUBFILTERS[itActiveTab] || [];
      if (options.length === 0) {
        row.style.display = "none";
        return;
      }
      row.style.display = "flex";
      chips.innerHTML = options.map(opt => {
        const ico = opt.icon
          ? '<img class="ui-chip-icon" src="' + escapeHtml(opt.icon) + '" alt="" />'
          : '';
        return '<button type="button" class="tz-chip' + (itSubFilter === opt.id ? ' active' : '') + '" data-it-filter="' + escapeHtml(opt.id) + '">' + ico + escapeHtml(opt.label) + '</button>';
      }).join("");
      chips.querySelectorAll("[data-it-filter]").forEach(btn => {
        btn.addEventListener("click", () => {
          itSubFilter = btn.dataset.itFilter;
          chips.querySelectorAll("[data-it-filter]").forEach(b => {
            b.classList.toggle("active", b.dataset.itFilter === itSubFilter);
          });
          renderItemsGrid();
        });
      });
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
        const targetSock = itBaseSocketFilter === "all" ? 0 : Number(itBaseSocketFilter);
        const list = (itData.baseItems || []).filter(item => {
          if (itSubFilter !== "all" && item.category !== itSubFilter) return false;
          if (targetSock > 0 && item.maxSockets < targetSock) return false;
          return matchQuery(item.nameZh + " " + item.nameEn + " " + item.stats + " " + item.usage + " " + item.tier, item);
        });
        cardsHtml = list.map(item => {
          const s = Array.isArray(item.sockets) ? item.sockets : [item.maxSockets, item.maxSockets, item.maxSockets];
          const ilvlText = "ilvl 1–25: " + s[0] + "孔 · ilvl 26–40(普通牛): " + s[1] + "孔 · ilvl 41+: " + s[2] + "孔";
          const offText = typeof item.officialStats === "object" && item.officialStats
            ? (item.officialStats[currentLang] || item.officialStats.zhCN)
            : item.officialStats;
          const hasCustomBlock = /格挡\\s*\\d+%/.test(item.stats || "");
          const baseParts = offText
            ? String(offText).split(/\\s*·\\s*/).map(x => x.trim()).filter(p => p && !(hasCustomBlock && /^(?:基础格挡|基礎格擋|Base Block)/.test(p)))
            : ["需求力量 " + item.reqStr].concat(item.reqDex > 0 ? ["需求敏捷 " + item.reqDex] : []);
          baseParts.push("需求等级 " + item.reqLvl);
          const extraParts = String(item.stats || "")
            .split(/\\s*(?:·|\\|)\\s*/)
            .map(x => x.trim())
            .filter(p => {
              if (!p) return false;
              if (offText && /^防\\s*\\d/.test(p)) return false;
              if (offText && /^攻速\\s*\\[/.test(p)) return false;
              if (/^ilvl\\s*\\d+/i.test(p) || /^\\d+[–-]\\d+/.test(p) || /^\\d+\\+\\s*:/.test(p)) return false;
              if (/^(?:任何\\s*ilvl\\s*均)?(?:最多|全系最多|最大)?\\s*\\d+\\s*孔$/.test(p)) return false;
              return true;
            });
          const combinedBaseStats = baseParts.concat(extraParts).join(" · ");
          return '<article class="it-card">' +
            '<div class="it-card-head">' +
              '<div class="it-card-title-row">' + renderItemThumb(item.icon, pickLangTitle(item)) +
              '<div data-no-sweep="1"><span class="it-card-title">' + escapeHtml(pickLangTitle(item)) + '</span><span class="it-card-en">' + escapeHtml(pickLangSub(item)) + '</span></div></div>' +
              '<div class="af-card-badges"><span class="rw-badge">' + escapeHtml(item.tier) + '</span></div>' +
            '</div>' +
            renderStatList(combinedBaseStats, "#9ad8ff", false) +
            renderStatList(ilvlText, "#ffd584", false) +
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
          return matchQuery(item.nameZh + " " + item.nameEn + " " + item.classZh + " " + item.pieceList + " " + item.fullBonus + " " + item.usage, item);
        });
        cardsHtml = list.map(item => {
          return '<article class="it-card it-set" data-it-set="' + escapeHtml(item.id) + '">' +
            '<div class="it-card-head">' +
              '<div class="it-card-title-row">' + renderItemThumb(item.icon, pickLangTitle(item)) +
              '<div data-no-sweep="1"><span class="it-card-title">' + escapeHtml(pickLangTitle(item)) + '</span><span class="it-card-en">' + escapeHtml(pickLangSub(item)) + '</span></div></div>' +
              '<div class="af-card-badges"><span class="rw-badge">' + escapeHtml(item.classZh) + '</span><span class="rw-badge rw-badge-patch">' + item.pieces + ' 件套</span></div>' +
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
        const list = (itData.uniqueItems || []).filter(item =>
          (itSubFilter === "all" || item.slot === itSubFilter) &&
          matchQuery(item.nameZh + " " + item.nameEn + " " + item.stats + " " + item.note + " " + (item.tier || ""), item)
        );
        cardsHtml = list.map(item => {
          const baseStatsStr = item.baseInfo
            ? (currentLang === "zhTW" ? (item.baseInfo.baseStatsZhTW || item.baseInfo.baseStats) : currentLang === "enUS" ? (item.baseInfo.baseStatsEnUS || item.baseInfo.baseStats) : item.baseInfo.baseStats)
            : "";
          const baseNameStr = item.baseInfo
            ? ((currentLang === "enUS" ? "Base: " : "底材：") + (currentLang === "zhTW" ? item.baseInfo.baseZhTW : currentLang === "enUS" ? item.baseInfo.baseEnUS : item.baseInfo.baseZhCN))
            : "";
          const baseLine = item.baseInfo
            ? renderStatList(baseNameStr + (baseStatsStr ? " · " + baseStatsStr : ""), "#c4b6a0", false)
            : '';
          return '<article class="it-card it-unique">' +
            '<div class="it-card-head">' +
              '<div class="it-card-title-row">' + renderItemThumb(item.icon, pickLangTitle(item)) +
              '<div data-no-sweep="1"><span class="it-card-title">' + escapeHtml(pickLangTitle(item)) + '</span><span class="it-card-en">' + escapeHtml(pickLangSub(item)) + '</span></div></div>' +
              '<div class="af-card-badges">' + (item.tier ? '<span class="rw-badge">' + escapeHtml(item.tier) + '</span>' : '') + '</div>' +
            '</div>' +
            baseLine +
            renderStatList(item.stats, "", false) +
            '<div class="it-card-note">说明：' + escapeHtml(item.note) + '</div>' +
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
      }

      grid.innerHTML = cardsHtml || '<div class="tz-empty">未找到匹配的物品资料</div>';

      if (itActiveTab === "set") {
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
        const fbParts = String(setItem.fullBonus || "").split(/\\s*(?:·|\\|)\\s*/).map(x => x.trim()).filter(Boolean);
        document.getElementById("it-set-modal-body").innerHTML =
          '<div class="it-set-bonus-box"><h4 class="it-set-bonus-title">全套加成</h4><ul class="it-set-bonus-list">' + fbParts.map(x => '<li>★ ' + escapeHtml(x) + '</li>').join("") + '</ul></div>';
        if (typeof applyDomTraditionalSweep === "function") applyDomTraditionalSweep();
        modal.classList.add("open");
        return;
      }

      const piecesHtml = (detail.pieces || []).map(p => {
        const pBaseStr = p.baseInfo
          ? (currentLang === "zhTW" ? (p.baseInfo.baseStatsZhTW || p.baseInfo.baseStats) : currentLang === "enUS" ? (p.baseInfo.baseStatsEnUS || p.baseInfo.baseStats) : p.baseInfo.baseStats)
          : "";
        const reqLvlLabel = currentLang === "zhTW" ? ("需求等級 " + p.reqLvl) : currentLang === "enUS" ? ("Req Lvl " + p.reqLvl) : ("需求等级 " + p.reqLvl);
        const rawBaseParts = pBaseStr ? String(pBaseStr).split(/\\s*·\\s*/).filter(Boolean) : [];
        if (p.reqLvl && !rawBaseParts.some(x => /需求等[级級]|Req Lvl/i.test(x))) {
          rawBaseParts.splice(Math.min(2, rawBaseParts.length), 0, reqLvlLabel);
        }
        const pBaseLines = rawBaseParts.map(line => '<li style="color:#c4b6a0" data-no-sweep="1">' + escapeHtml(line) + '</li>').join("");
        const baseLines = pBaseLines + (p.stats || []).flatMap(line => String(line).split(/\\s*·\\s*/)).filter(Boolean).map(line => '<li>' + escapeHtml(line) + '</li>').join("");
        const greenLines = Array.isArray(p.setPieceBonus) && p.setPieceBonus.length > 0
          ? '<ul class="it-set-piece-bonus">' + p.setPieceBonus.flatMap(b => String(b).split(/\\s*·\\s*/)).filter(Boolean).map(b => '<li>+ ' + escapeHtml(b) + '</li>').join("") + '</ul>'
          : "";
        const pieceImg = p.icon
          ? '<div class="it-thumb-wrap" style="width:40px;height:40px"><img class="it-thumb" src="' + escapeHtml(p.icon) + '" alt="' + escapeHtml(p.nameZh) + '" loading="lazy"></div>'
          : '';
        return '<div class="it-set-piece">' +
          '<div class="it-set-piece-head">' +
            '<div class="it-card-title-row">' + pieceImg +
            '<div data-no-sweep="1"><span class="it-set-piece-title">' + escapeHtml(pickLangTitle(p)) + '</span> <span class="it-set-piece-sub">(' + escapeHtml(pickLangSub(p)) + ')</span></div></div>' +
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
              detail.partialBonuses.map(pb => (pb.stats || []).flatMap(st => String(st).split(/\\s*·\\s*/)).filter(Boolean).map(st => '<li><strong>【' + pb.count + ' 件】</strong> ' + escapeHtml(st) + '</li>').join("")).join("") +
            '</ul>' +
          '</div>'
        : "";

      const fullHtml = '<div class="it-set-bonus-box">' +
        '<h4 class="it-set-bonus-title">全套齐备加成（' + setItem.pieces + ' 件套完整激活）</h4>' +
        '<ul class="it-set-bonus-list">' +
          (detail.fullBonuses || []).flatMap(line => String(line).split(/\\s*·\\s*/)).filter(Boolean).map(line => '<li>★ ' + escapeHtml(line) + '</li>').join("") +
        '</ul>' +
      '</div>';

      document.getElementById("it-set-modal-body").innerHTML =
        '<div class="it-set-pieces-grid">' + piecesHtml + '</div>' +
        partialHtml +
        fullHtml;

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
          renderItSubfilters();
          renderItemsGrid();
        });
      });

      document.querySelectorAll("#it-base-sockets-chips [data-it-sock]").forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll("#it-base-sockets-chips [data-it-sock]").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          itBaseSocketFilter = btn.dataset.itSock;
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

      const jumpSettingsBtn = document.getElementById("jump-settings-btn");
      const settingsDrawer = document.getElementById("settings-drawer");
      if (jumpSettingsBtn && settingsDrawer) {
        jumpSettingsBtn.addEventListener("click", () => {
          settingsDrawer.open = true;
          settingsDrawer.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }

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
        const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
        if (tag === "input" || tag === "textarea" || tag === "select") return;
        if (e.key >= "1" && e.key <= "5") {
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

    let _twSweeping = false;
    function applyDomTraditionalSweep() {
      if (_twSweeping) return;
      _twSweeping = true;
      try {
        const roots = [
          document.querySelector("main.shell"),
          document.getElementById("rw-detail-modal"),
          document.getElementById("it-set-modal")
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
      const applyAllLang = () => {
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
        if (typeof renderRunewordsAll === "function") renderRunewordsAll();
        if (typeof renderAffixesRules === "function") renderAffixesRules();
        if (typeof renderAffixesSlotChips === "function") renderAffixesSlotChips();
        if (typeof renderAffixesCraftRecipes === "function") renderAffixesCraftRecipes();
        if (typeof renderAffixesList === "function") renderAffixesList();
        if (typeof renderItemsGrid === "function") renderItemsGrid();
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
          currentLang = btn.dataset.lang;
          try { localStorage.setItem("d2r-lang", currentLang); } catch (e) {}
          applyAllLang();
        });
      });
    }

    setupLangSwitcher();
    updateAutoRefreshControls();
    loadPullSettings();
    setupTzDirectoryEvents();
    setupRunewordsEvents();
    setupAffixesEvents();
    setupItemsEvents();
    initMainTabs();
    load();
  </script>
</body>
</html>`;
}
