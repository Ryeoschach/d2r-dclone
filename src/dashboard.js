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
      grid-template-columns: repeat(6, minmax(0, 1fr));
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
    .main-nav-tab.tab-skills.active {
      color: #fff;
      border-color: #ef6b5b;
      background: linear-gradient(135deg, rgba(84, 24, 24, 0.92), rgba(28, 13, 16, 0.98));
      box-shadow: 0 0 18px rgba(239, 107, 91, 0.28);
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
    .main-nav-tab.tab-skills .tab-svg { color: #ff7f6e; }
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
    .skills-module::before { background: linear-gradient(90deg, transparent, #ef6b5b, #b653e8, transparent); }
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
    .it-card.it-unique.grail-done {
      border-color: rgba(87, 219, 112, 0.65);
      background: linear-gradient(135deg, rgba(16, 40, 24, 0.85), rgba(14, 18, 14, 0.96));
      box-shadow: inset 0 0 12px rgba(87, 219, 112, 0.12);
    }
    .it-card.it-set.grail-done {
      border-color: rgba(87, 219, 112, 0.82);
      background: linear-gradient(135deg, rgba(14, 46, 24, 0.9), rgba(12, 18, 14, 0.96));
      box-shadow: 0 0 14px rgba(87, 219, 112, 0.18), inset 0 0 12px rgba(87, 219, 112, 0.14);
    }
    .it-set-piece.grail-done {
      border-color: rgba(87, 219, 112, 0.72);
      background: linear-gradient(135deg, rgba(16, 38, 22, 0.92), rgba(12, 20, 14, 0.96));
      box-shadow: inset 0 0 10px rgba(87, 219, 112, 0.14);
    }
    .grail-summary-card {
      margin-bottom: 16px;
      padding: 13px 16px;
      border: 1px solid rgba(229, 147, 82, 0.32);
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(30, 22, 15, 0.92), rgba(18, 14, 11, 0.96));
    }
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

    /* Skill Planner Module Specific */
    .skills-module {
      border-color: rgba(239, 107, 91, 0.45);
      background:
        radial-gradient(circle at 95% 0%, rgba(190, 58, 72, 0.14) 0, transparent 420px),
        radial-gradient(circle at 5% 100%, rgba(92, 28, 78, 0.18) 0, transparent 360px),
        rgba(18, 13, 15, 0.96);
    }
    .skills-tag {
      background: rgba(239, 107, 91, 0.18);
      color: #ff9c8f;
      border: 1px solid rgba(239, 107, 91, 0.45);
    }
    .sk-class-tabs {
      display: grid;
      grid-template-columns: repeat(8, minmax(0, 1fr));
      gap: 8px;
      margin-bottom: 16px;
    }
    .sk-class-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 10px;
      border: 1px solid rgba(239, 107, 91, 0.25);
      background: rgba(24, 16, 18, 0.85);
      color: var(--muted);
      cursor: pointer;
      transition: all .18s ease;
      text-align: left;
      min-width: 0;
    }
    .sk-class-btn:hover {
      color: var(--text);
      border-color: rgba(239, 107, 91, 0.55);
      background: rgba(36, 22, 24, 0.92);
    }
    .sk-class-btn.active {
      color: #fff;
      border-color: #ff7f6e;
      background: linear-gradient(135deg, rgba(88, 26, 26, 0.94), rgba(32, 16, 22, 0.98));
      box-shadow: 0 0 14px rgba(239, 107, 91, 0.28);
    }
    .sk-class-avatar {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      object-fit: contain;
      background: rgba(10, 8, 8, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.12);
      flex-shrink: 0;
    }
    .sk-class-meta {
      min-width: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .sk-class-name {
      font-size: 13px;
      font-weight: 800;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sk-class-pts {
      font-size: 11px;
      color: #f5cf7b;
      font-variant-numeric: tabular-nums;
    }
    .sk-planner-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      padding: 12px 16px;
      margin-bottom: 16px;
      border-radius: 12px;
      border: 1px solid rgba(239, 107, 91, 0.28);
      background: rgba(12, 10, 12, 0.86);
    }
    .sk-metrics {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 14px;
      font-size: 13px;
    }
    .sk-bonus-ctrl {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--muted);
    }
    .sk-bonus-input {
      width: 58px;
      height: 30px;
      padding: 2px 6px;
      border-radius: 6px;
      border: 1px solid rgba(239, 107, 91, 0.4);
      background: #120e10;
      color: #ffd584;
      font-weight: 800;
      text-align: center;
    }
    .sk-workspace {
      display: grid;
      grid-template-columns: 2.35fr 1fr;
      gap: 16px;
      align-items: start;
    }
    .sk-trees-wrap {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }
    .sk-tree-col {
      padding: 12px;
      border-radius: 12px;
      border: 1px solid rgba(239, 107, 91, 0.24);
      background: linear-gradient(180deg, rgba(24, 17, 19, 0.92), rgba(14, 11, 13, 0.96));
    }
    .sk-tree-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(239, 107, 91, 0.2);
    }
    .sk-tree-title {
      font-size: 14px;
      font-weight: 800;
      color: #ffb3a7;
    }
    .sk-tree-pts {
      font-size: 12px;
      font-weight: 800;
      color: #f5cf7b;
      padding: 2px 7px;
      border-radius: 999px;
      background: rgba(245, 207, 123, 0.14);
      border: 1px solid rgba(245, 207, 123, 0.35);
    }
    .sk-matrix {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      grid-template-rows: repeat(6, auto);
      gap: 8px;
    }
    .sk-cell-empty {
      min-height: 76px;
      border-radius: 8px;
      border: 1px dashed rgba(255, 255, 255, 0.04);
      background: rgba(0, 0, 0, 0.14);
    }
    .sk-node {
      position: relative;
      min-height: 76px;
      padding: 7px 8px;
      border-radius: 9px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: linear-gradient(145deg, rgba(28, 22, 24, 0.94), rgba(16, 13, 15, 0.98));
      color: var(--text);
      cursor: pointer;
      user-select: none;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 4px;
      transition: all .14s ease;
    }
    .sk-node:hover {
      border-color: rgba(245, 207, 123, 0.65);
      transform: translateY(-1px);
    }
    .sk-node.allocated {
      border-color: rgba(87, 219, 112, 0.72);
      background: linear-gradient(145deg, rgba(16, 44, 26, 0.92), rgba(12, 20, 15, 0.98));
      box-shadow: inset 0 0 12px rgba(87, 219, 112, 0.14);
    }
    .sk-node.maxed {
      border-color: #f3c868;
      background: linear-gradient(145deg, rgba(58, 40, 14, 0.94), rgba(22, 16, 10, 0.98));
      box-shadow: 0 0 12px rgba(243, 200, 104, 0.25), inset 0 0 12px rgba(243, 200, 104, 0.16);
    }
    .sk-node.selected {
      outline: 2px solid #ff8a75;
      outline-offset: 1px;
    }
    .sk-node-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      font-size: 10px;
      color: var(--muted);
    }
    .sk-node-lvlreq {
      padding: 1px 4px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.06);
      font-weight: 700;
    }
    .sk-node-title {
      font-size: 12.5px;
      font-weight: 800;
      color: #fff;
      line-height: 1.25;
      word-break: break-word;
    }
    .sk-node.allocated .sk-node-title { color: #8af49f; }
    .sk-node.maxed .sk-node-title { color: #ffe08c; }
    .sk-node-foot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      margin-top: 2px;
    }
    .sk-node-rank {
      font-size: 11px;
      font-weight: 800;
      color: var(--muted);
      font-variant-numeric: tabular-nums;
    }
    .sk-node.allocated .sk-node-rank { color: #67e87a; }
    .sk-node.maxed .sk-node-rank { color: #ffd573; }
    .sk-node-step-btns {
      display: inline-flex;
      gap: 3px;
    }
    .sk-step-btn {
      width: 18px;
      height: 18px;
      padding: 0;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      background: rgba(0, 0, 0, 0.45);
      color: #e6d7c3;
      font-size: 12px;
      font-weight: 800;
      line-height: 1;
      cursor: pointer;
    }
    .sk-step-btn:hover {
      border-color: #f5cf7b;
      color: #fff;
      background: rgba(213, 167, 72, 0.28);
    }
    .sk-inspector {
      position: sticky;
      top: 72px;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid rgba(239, 107, 91, 0.4);
      background: rgba(14, 11, 13, 0.96);
      box-shadow: 0 14px 36px rgba(0, 0, 0, 0.55);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .sk-insp-title {
      margin: 0;
      font-size: 18px;
      font-weight: 800;
      color: #ffd573;
    }
    .sk-insp-sub {
      font-size: 12px;
      color: var(--muted);
    }
    .bp-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }
    .bp-card {
      padding: 14px 16px;
      border-radius: 12px;
      border: 1px solid rgba(239, 107, 91, 0.28);
      background: rgba(16, 13, 15, 0.94);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .bp-card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(239, 107, 91, 0.2);
    }
    .bp-card-title {
      margin: 0;
      font-size: 15px;
      font-weight: 800;
      color: #ffb3a7;
    }
    .bp-status-pill {
      padding: 8px 12px;
      border-radius: 8px;
      background: rgba(87, 219, 112, 0.12);
      border: 1px solid rgba(87, 219, 112, 0.35);
      color: #8af49f;
      font-size: 12.5px;
      line-height: 1.45;
    }
    .bp-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
      font-variant-numeric: tabular-nums;
    }
    .bp-table th, .bp-table td {
      padding: 6px 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      text-align: center;
    }
    .bp-table th {
      color: var(--muted);
      font-weight: 700;
      background: rgba(0, 0, 0, 0.25);
    }
    .bp-table tr.bp-active {
      background: linear-gradient(90deg, rgba(24, 72, 42, 0.65), rgba(48, 36, 14, 0.65));
      color: #ffe08c;
      font-weight: 800;
    }
    .bp-table tr.bp-active td {
      border-bottom-color: rgba(87, 219, 112, 0.5);
    }
    @media (max-width: 1160px) {
      .sk-class-tabs { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .sk-workspace { grid-template-columns: 1fr; }
      .sk-inspector { position: static; }
      .bp-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 860px) {
      .sk-trees-wrap { grid-template-columns: 1fr; }
    }
    @media (max-width: 560px) {
      .sk-class-tabs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
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
          <div class="tz-filter-row" id="it-grail-filter-row" style="display:none">
            <div class="tz-filter-label">圣杯：</div>
            <div class="tz-chips" id="it-grail-chips">
              <button type="button" class="tz-chip active" data-grail-filter="all">全部状态</button>
              <button type="button" class="tz-chip" data-grail-filter="todo">未收集</button>
              <button type="button" class="tz-chip" data-grail-filter="done">已收集</button>
              <button type="button" class="tz-chip" data-grail-filter="tc87">仅看 TC87 毕业稀有</button>
            </div>
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
          <button class="af-subtab" data-sk-view="breakpoints" type="button"><img class="ui-tab-icon" src="/images/ui/sprint.webp" alt=""><span>全职业档位速查 & 攻速/施法/格挡计算器 (FCR / FHR / FBR / IAS)</span></button>
          <button class="af-subtab" data-sk-view="mercenary" type="button"><img class="ui-tab-icon" src="/images/ui/desertmercenaryicon.webp" alt=""><span>四幕佣兵成长 & 毕业配装模拟 (Act 1 / 2 / 3 / 5)</span></button>
        </div>

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
          </div>
          <div class="rw-actions">
            <button class="rw-btn" id="sk-share-btn" type="button">复制加点分享链接</button>
            <button class="rw-btn rw-btn-danger" id="sk-reset-btn" type="button">重置当前职业加点</button>
          </div>
        </div>

        <div class="sk-workspace">
          <div class="sk-trees-wrap" id="sk-trees-wrap">正在加载八大职业技能树…</div>
          <aside class="sk-inspector" id="sk-inspector" aria-label="技能详情与协同加成">
            <h3 class="sk-insp-title" id="sk-insp-title">点击任意技能节点</h3>
            <div class="sk-insp-sub" id="sk-insp-sub">左键点击技能 +1（自动补齐前置），Shift+左键 +5，右键或点击「-」减 1 点</div>
            <div id="sk-insp-body"></div>
          </aside>
        </div>
        </div>

        <!-- 全职业档位速查与攻速/施法/格挡计算器视图 -->
        <div id="sk-view-breakpoints" style="display:none">
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

        <!-- 四幕佣兵成长与毕业配装模拟视图 -->
        <div id="sk-view-mercenary" style="display:none">
          <div class="bp-grid">
            <article class="bp-card" style="border-color:rgba(213,167,72,0.4)">
              <div class="bp-card-head">
                <h3 class="bp-card-title" style="color:#f5cf7b"><img class="ui-chip-icon" src="/images/ui/desertmercenaryicon.webp" alt="">四幕佣兵类型与毕业配装选择</h3>
                <label class="sk-bonus-ctrl">
                  <span>佣兵等级</span>
                  <input type="number" class="sk-bonus-input" id="merc-lvl-input" min="67" max="98" value="90" />
                </label>
              </div>
              <div style="display:flex;flex-direction:column;gap:10px">
                <label class="sim-field" style="justify-content:space-between">
                  <span>佣兵流派 (Act 1 / 2 / 3 / 5)</span>
                  <select class="sim-select" id="merc-variant-select" style="flex:1;max-width:360px"></select>
                </label>
                <label class="sim-field" style="justify-content:space-between">
                  <span>武器配装</span>
                  <select class="sim-select" id="merc-weapon-select" style="flex:1;max-width:360px"></select>
                </label>
                <label class="sim-field" style="justify-content:space-between">
                  <span>头盔配装</span>
                  <select class="sim-select" id="merc-helm-select" style="flex:1;max-width:360px"></select>
                </label>
                <label class="sim-field" style="justify-content:space-between">
                  <span>盔甲配装</span>
                  <select class="sim-select" id="merc-armor-select" style="flex:1;max-width:360px"></select>
                </label>
              </div>
              <div class="bp-status-pill" id="merc-equip-check"></div>
            </article>

            <article class="bp-card" style="border-color:rgba(87,219,112,0.4)">
              <div class="bp-card-head">
                <h3 class="bp-card-title" style="color:#8af49f" id="merc-summary-title">佣兵实时成长面板与灵气/攻速档位</h3>
                <span class="rw-badge rw-badge-patch" id="merc-act-badge">ACT 2</span>
              </div>
              <div id="merc-stats-body"></div>
            </article>
          </div>
        </div>
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
      { id: "items", tabId: "main-tab-items", panelId: "main-panel-items", hash: "#items" },
      { id: "skills", tabId: "main-tab-skills", panelId: "main-panel-skills", hash: "#skills" }
    ];
    let activeMainTab = "terror";

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

    function updateSimStateAndRender() {
      if (!afData) return;
      const base = getSimBase();

      const rareBtn = document.querySelector('#sim-quality-chips [data-sim-quality="rare"]');
      const craftBtn = document.querySelector('#sim-quality-chips [data-sim-quality="crafted"]');
      if (rareBtn) {
        rareBtn.disabled = Boolean(base.magicOnly);
        rareBtn.style.opacity = base.magicOnly ? ".4" : "1";
      }
      if (craftBtn) {
        craftBtn.disabled = !base.supportsCraft;
        craftBtn.style.opacity = base.supportsCraft ? "1" : ".4";
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

    /* 物品资讯百科逻辑（基础 / 蓝黄 / 绿装 / 暗金 / 方块公式） + 圣杯 100% 收集追踪 */
    let itData = null;
    let dcData = null;
    let dcMode = "source";
    let dcSourceId = "andariel-tz";
    let dcMf = 250;
    let dcPlayers = 1;
    let itActiveTab = "base";
    let itSubFilter = "all";
    let itBaseSocketFilter = "all";
    let itGrailFilter = "all";
    let itSearchQuery = "";

    const GRAIL_UNIQUE_KEY = "d2r-grail-uniques-v1";
    const GRAIL_SET_KEY = "d2r-grail-sets-v1";
    let grailUniques = new Set();
    let grailSetPieces = new Set();

    function loadGrailState() {
      try {
        const rawU = localStorage.getItem(GRAIL_UNIQUE_KEY);
        if (rawU) grailUniques = new Set(JSON.parse(rawU));
        const rawS = localStorage.getItem(GRAIL_SET_KEY);
        if (rawS) grailSetPieces = new Set(JSON.parse(rawS));
      } catch (e) {
        console.warn("读取圣杯存档失败", e);
      }
    }

    function saveGrailState() {
      try {
        localStorage.setItem(GRAIL_UNIQUE_KEY, JSON.stringify([...grailUniques]));
        localStorage.setItem(GRAIL_SET_KEY, JSON.stringify([...grailSetPieces]));
      } catch (e) {
        console.warn("保存圣杯存档失败", e);
      }
    }

    function renderGrailSummary() {
      if (!itData) return;
      const uniques = itData.uniqueItems || [];
      const sets = itData.setItems || [];
      const allPieces = sets.flatMap(s => (s.detail && s.detail.pieces) ? s.detail.pieces : []);

      const uTotal = uniques.length;
      const uDone = uniques.filter(u => grailUniques.has(u.nameEn)).length;

      const sTotal = allPieces.length;
      const sDone = allPieces.filter(p => grailSetPieces.has(p.nameEn)).length;

      const fullSetTotal = sets.length;
      const fullSetDone = sets.filter(s => {
        const pcs = (s.detail && s.detail.pieces) ? s.detail.pieces : [];
        return pcs.length > 0 && pcs.every(p => grailSetPieces.has(p.nameEn));
      }).length;

      const tc87Uniques = uniques.filter(u => u.baseInfo && u.baseInfo.tc === 87);
      const tc87Pieces = allPieces.filter(p => p.baseInfo && p.baseInfo.tc === 87);
      const tc87Total = tc87Uniques.length + tc87Pieces.length;
      const tc87Done = tc87Uniques.filter(u => grailUniques.has(u.nameEn)).length +
        tc87Pieces.filter(p => grailSetPieces.has(p.nameEn)).length;

      const totalAll = uTotal + sTotal;
      const totalDone = uDone + sDone;
      const pct = totalAll > 0 ? Math.round((totalDone / totalAll) * 1000) / 10 : 0;

      const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(val);
      };
      setText("grail-total-done", totalDone);
      setText("grail-total-all", totalAll);
      setText("grail-total-pct", pct + "%");
      setText("grail-unique-done", uDone);
      setText("grail-unique-all", uTotal);
      setText("grail-set-done", sDone);
      setText("grail-set-all", sTotal);
      setText("grail-fullset-done", fullSetDone);
      setText("grail-fullset-all", fullSetTotal);
      setText("grail-tc87-done", tc87Done);
      setText("grail-tc87-all", tc87Total);

      const fillEl = document.getElementById("grail-progress-fill");
      if (fillEl) fillEl.style.width = Math.min(100, pct) + "%";
    }

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
      cube: [],
      drops: [
        { id: "all", label: "全部掉落", icon: "/images/items/misc/shard/mote_of_anguish.webp" },
        { id: "unique", label: "暗金装备", icon: "/images/items/misc/quest/mephisto_soul_stone.webp" },
        { id: "set", label: "绿色套装", icon: "/images/items/armor/helmet/horazons_countenance.webp" },
        { id: "rune", label: "符文 (#1-#33)", icon: "/images/items/misc/rune/ber_rune.webp" },
        { id: "special", label: "钥匙 / 精华 / 3.4 雕像", icon: "/images/items/misc/key/mephisto_key.webp" }
      ]
    };

    function populateDcSourceSelect() {
      const sel = document.getElementById("dc-source-select");
      if (!sel || !dcData || !Array.isArray(dcData.sources)) return;
      sel.innerHTML = dcData.sources.map(src => {
        const nm = currentLang === "zhTW" ? (src.nameTw || src.nameZh) : currentLang === "enUS" ? src.nameEn : src.nameZh;
        return '<option value="' + escapeHtml(src.id) + '"' + (src.id === dcSourceId ? ' selected' : '') + '>' + escapeHtml(nm) + ' (mlvl ' + src.mlvl + ')</option>';
      }).join("");
    }

    function syncDcSourceToCurrentTz() {
      if (!dcData || !Array.isArray(dcData.sources)) return;
      const curTzEn = (window.dashboardData && window.dashboardData.terrorZone && window.dashboardData.terrorZone.current) || "";
      const matched = dcData.sources.find(s => s.isTz && s.tzZone && s.tzZone !== "*" && curTzEn.toLowerCase().includes(s.tzZone.toLowerCase().split(",")[0]));
      dcSourceId = matched ? matched.id : "tz-unique-96";
      populateDcSourceSelect();
    }

    function computePickDropProb(noDrop, probSum, players) {
      if (noDrop <= 0) return 1;
      const n = Math.max(1, Math.floor((1 + Number(players || 1)) / 2));
      if (n <= 1) return probSum / (probSum + noDrop);
      const baseNoDropRatio = noDrop / (noDrop + probSum);
      const powRatio = Math.pow(baseNoDropRatio, n);
      const newNoDrop = Math.floor(probSum * (powRatio / (1 - powRatio)));
      if (newNoDrop <= 0) return 1;
      return probSum / (probSum + newNoDrop);
    }

    function computeQualityChance(baseChance, divisor, minVal, effMf, tcFactor, mlvl, qlvl) {
      let chance = (baseChance - Math.floor((mlvl - qlvl) / divisor)) * 128;
      if (effMf > 0) {
        chance = Math.floor((chance * 100) / (100 + effMf));
      }
      if (chance < minVal) chance = minVal;
      chance = chance - Math.floor((chance * tcFactor) / 1024);
      if (chance <= 128) return 1;
      return 128 / chance;
    }

    function computeEquipQualityOdds(code, src, mf) {
      if (!dcData || !dcData.baseMeta) return { unique: 0, set: 0 };
      const meta = dcData.baseMeta[code];
      if (!meta) return { unique: 0, set: 0 };
      const isCs = meta.cs === 1;
      const uBase = isCs ? 240 : 400;
      const uDiv = isCs ? 3 : 1;
      const sBase = isCs ? 120 : 160;
      const sDiv = isCs ? 3 : 2;
      const effMfU = mf > 0 ? Math.floor((mf * 250) / (mf + 250)) : 0;
      const effMfS = mf > 0 ? Math.floor((mf * 500) / (mf + 500)) : 0;
      const pU = src.uniqueFactor > 0 ? computeQualityChance(uBase, uDiv, 6400, effMfU, src.uniqueFactor, src.mlvl, meta.qlvl) : 0;
      const pS = src.setFactor > 0 ? computeQualityChance(sBase, sDiv, 5600, effMfS, src.setFactor, src.mlvl, meta.qlvl) : 0;
      return { unique: pU, set: (1 - pU) * pS };
    }

    function computeSingleItemDropChance(src, itemType, code, itemNameEn, mf, players) {
      let leafP = Number((src.leaves && src.leaves[code]) || 0);
      const pDrop = computePickDropProb(src.noDrop, src.probSum, players);
      let perPickP = 0;

      if (itemType === "rune" || itemType === "special") {
        perPickP = pDrop * leafP;
        let mainChance = perPickP > 0 ? (1 - Math.pow(1 - perPickP, src.picks)) : 0;
        if (itemType === "rune" && src.extraRune && src.extraRune.leaves && src.extraRune.leaves[code]) {
          const rDrop = computePickDropProb(src.extraRune.noDrop, src.extraRune.probSum, players);
          const rPerPick = rDrop * Number(src.extraRune.leaves[code]);
          const rChance = 1 - Math.pow(1 - rPerPick, src.extraRune.picks);
          mainChance = 1 - (1 - mainChance) * (1 - rChance);
        }
        return mainChance;
      }

      if (leafP <= 0) return 0;
      const qOdds = computeEquipQualityOdds(code, src, mf);

      if (itemType === "unique") {
        const pool = (dcData.uniquePools && dcData.uniquePools[code]) || [];
        const eligible = pool.filter(u => u.qlvl <= src.mlvl);
        const target = eligible.find(u => u.nameEn === itemNameEn);
        if (!target) return 0;
        const sumRarity = eligible.reduce((a, b) => a + b.rarity, 0);
        perPickP = pDrop * leafP * qOdds.unique * (target.rarity / sumRarity);
      } else if (itemType === "set") {
        const pool = (dcData.setPools && dcData.setPools[code]) || [];
        const eligible = pool.filter(s => s.qlvl <= src.mlvl);
        const target = eligible.find(s => s.nameEn === itemNameEn);
        if (!target) return 0;
        const sumRarity = eligible.reduce((a, b) => a + b.rarity, 0);
        perPickP = pDrop * leafP * qOdds.set * (target.rarity / sumRarity);
      }

      if (perPickP <= 0) return 0;
      return 1 - Math.pow(1 - perPickP, src.picks);
    }

    let cubeUpTargetName = "Titan's Revenge";
    let cubeUpEth = false;
    let cubeSunderId = "cold";
    let cubeSunderRolled = [];

    function initCubeSimulators() {
      if (!itData) return;
      const upSel = document.getElementById("cube-up-select");
      const metaMap = itData.uniqueUpgradeMeta || {};
      const tiersMap = itData.baseUpgradeTiers || {};
      if (upSel) {
        const upItems = (itData.uniqueItems || []).filter(u => metaMap[u.nameEn]);
        upSel.innerHTML = upItems.map(u => {
          const m = metaMap[u.nameEn];
          const b = tiersMap[m.code];
          const tLabel = b && b.tier === 1 ? "普通→扩展→精华" : "扩展→精华";
          return '<option value="' + escapeHtml(u.nameEn) + '"' + (u.nameEn === cubeUpTargetName ? ' selected' : '') + '>' + escapeHtml(pickLangTitle(u)) + ' (' + escapeHtml(u.nameEn) + ' · ' + tLabel + ')</option>';
        }).join("");
        upSel.onchange = (e) => {
          cubeUpTargetName = e.target.value;
          renderCubeUpgrader();
        };
      }
      const ethCb = document.getElementById("cube-up-eth");
      if (ethCb) {
        ethCb.onchange = (e) => {
          cubeUpEth = Boolean(e.target.checked);
          renderCubeUpgrader();
        };
      }

      const sunSel = document.getElementById("cube-sunder-select");
      const sunList = itData.sunderCrafts34 || [];
      if (sunSel && sunList.length) {
        sunSel.innerHTML = sunList.map(s =>
          '<option value="' + escapeHtml(s.id) + '"' + (s.id === cubeSunderId ? ' selected' : '') + '>' + escapeHtml(s.nameZh) + ' (' + escapeHtml(s.nameEn) + ')</option>'
        ).join("");
        sunSel.onchange = (e) => {
          cubeSunderId = e.target.value;
          rollAndRenderSunderSim();
        };
      }
      const rollBtn = document.getElementById("cube-sunder-roll-btn");
      if (rollBtn) {
        rollBtn.onclick = () => rollAndRenderSunderSim();
      }
      renderCubeUpgrader();
      rollAndRenderSunderSim();
    }

    function renderCubeUpgrader() {
      const box = document.getElementById("cube-up-preview");
      if (!box || !itData || !itData.uniqueUpgradeMeta || !itData.baseUpgradeTiers) return;
      const meta = itData.uniqueUpgradeMeta[cubeUpTargetName];
      const uObj = (itData.uniqueItems || []).find(u => u.nameEn === cubeUpTargetName);
      if (!meta || !uObj) return;
      const tiers = itData.baseUpgradeTiers;
      const origBase = tiers[meta.code];
      if (!origBase) return;

      const codesToPreview = origBase.tier === 1
        ? [origBase.norm, origBase.uber, origBase.ultra]
        : [origBase.uber, origBase.ultra];

      const rowsHtml = codesToPreview.map((code, idx) => {
        const b = tiers[code];
        if (!b) return "";
        const isOrig = code === meta.code;
        const stepPenalty = isOrig ? 0 : (origBase.tier === 1 ? (b.tier === 2 ? 5 : 12) : 7);
        const finalReqLvl = Math.max(b.lvl, meta.reqLvl) + stepPenalty;
        const finalStr = Math.max(0, b.str - (cubeUpEth ? 10 : 0));
        const finalDex = Math.max(0, b.dex - (cubeUpEth ? 10 : 0));

        let statText = "";
        if (b.kind === "armor") {
          const minBase = isOrig && meta.ed[1] > 0 ? (b.def[1] + 1) : b.def[0];
          const maxBase = isOrig && meta.ed[1] > 0 ? (b.def[1] + 1) : b.def[1];
          const eMinB = cubeUpEth ? Math.floor(minBase * 1.5) : minBase;
          const eMaxB = cubeUpEth ? Math.floor(maxBase * 1.5) : maxBase;
          const dMin = Math.floor(eMinB * (100 + meta.ed[0]) / 100) + meta.flatDef[0];
          const dMax = Math.floor(eMaxB * (100 + meta.ed[1]) / 100) + meta.flatDef[1];
          statText = "成品防御：" + (dMin === dMax ? dMin : (dMin + " – " + dMax)) + "（底材基础 " + eMinB + "–" + eMaxB + "）";
        } else {
          const calcDmg = (pair) => {
            if (!pair || pair[1] <= 0) return null;
            const eMin = cubeUpEth ? Math.floor(pair[0] * 1.5) : pair[0];
            const eMax = cubeUpEth ? Math.floor(pair[1] * 1.5) : pair[1];
            const mnMin = Math.floor(eMin * (100 + meta.ed[0]) / 100) + meta.flatDmg[0];
            const mxMax = Math.floor(eMax * (100 + meta.ed[1]) / 100) + meta.flatDmg[1];
            return mnMin + " – " + mxMax;
          };
          const d1 = calcDmg(b.d1);
          const d2 = calcDmg(b.d2);
          const dt = calcDmg(b.dt);
          const dParts = [];
          if (d1) dParts.push("单手伤害 " + d1);
          if (d2) dParts.push("双手伤害 " + d2);
          if (dt) dParts.push("投掷伤害 " + dt);
          statText = dParts.join(" · ");
        }

        const tierLabel = b.tier === 1 ? "【普通级】" : b.tier === 2 ? "【扩展级】" : "【精华级】";
        const recipeText = isOrig
          ? "原始掉落阶级"
          : (b.kind === "armor"
              ? (b.tier === 2 ? "升阶公式：#7 塔尔 (Tal) + #13 沙伊 (Shael) + 完美钻石" : "升阶公式：#18 科 (Ko) + #20 兰姆 (Lem) + 完美钻石")
              : (b.tier === 2 ? "升阶公式：#8 拉尔 (Ral) + #12 索尔 (Sol) + 完美绿宝石" : "升阶公式：#17 卢姆 (Lum) + #21 普尔 (Pul) + 完美绿宝石"));
        const bName = currentLang === "zhTW" ? (b.zhTW || b.zhCN) : currentLang === "enUS" ? b.enUS : b.zhCN;

        return '<div class="it-set-bonus-box" style="margin-top:6px;border-color:' + (isOrig ? 'rgba(255,255,255,0.15)' : 'rgba(87,219,112,0.45)') + '">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px">' +
            '<strong style="color:' + (isOrig ? '#f5cf7b' : '#8af49f') + '">' + tierLabel + " " + escapeHtml(bName) + ' (' + escapeHtml(b.enUS) + ')</strong>' +
            '<span class="rw-badge">' + escapeHtml(recipeText) + '</span>' +
          '</div>' +
          renderStatList(statText + " · 需求等级 " + finalReqLvl + (finalStr > 0 ? (" · 需求力量 " + finalStr) : "") + (finalDex > 0 ? (" · 需求敏捷 " + finalDex) : ""), "#9ad8ff", false) +
        '</div>';
      }).join("");

      box.innerHTML = rowsHtml;
    }

    function rollAndRenderSunderSim() {
      const box = document.getElementById("cube-sunder-preview");
      if (!box || !itData || !Array.isArray(itData.sunderCrafts34)) return;
      const sun = itData.sunderCrafts34.find(s => s.id === cubeSunderId) || itData.sunderCrafts34[0];
      const commonPools = itData.sunderCommonPools || [];

      const randInt = (mn, mx) => mn + Math.floor(Math.random() * (mx - mn + 1));
      const pickWeighted = (opts) => {
        const tot = opts.reduce((a, b) => a + (b.weight || 1), 0);
        let r = Math.random() * tot;
        for (const o of opts) {
          r -= (o.weight || 1);
          if (r <= 0) return o;
        }
        return opts[0];
      };

      const rolledLines = [];
      if (Array.isArray(sun.slot1Pool) && sun.slot1Pool.length) {
        const o1 = pickWeighted(sun.slot1Pool);
        const v1 = randInt(o1.min, o1.max);
        rolledLines.push("【词缀 1 · 元素专精】" + o1.label.replace("{v}", String(v1)) + "（范围 " + o1.min + "–" + o1.max + "）");
      }
      for (const pool of commonPools) {
        const opt = pickWeighted(pool.options);
        const val = randInt(opt.min, opt.max);
        rolledLines.push("【" + pool.slotName + "】" + opt.label.replace("{v}", String(val)) + "（范围 " + opt.min + "–" + opt.max + "）");
      }

      box.innerHTML =
        '<div class="it-card-note" style="color:#ffd584;margin-bottom:6px">方块公式：' + escapeHtml(sun.recipeZh) + '</div>' +
        renderStatList(sun.fixedStats.join(" · "), "#f1a7ec", false) +
        renderStatList(rolledLines.join(" · "), "#8af49f", false);
    }

    async function loadItemsCatalog() {
      try {
        loadGrailState();
        const [response, dropRes] = await Promise.all([
          fetch("/api/items", { cache: "no-store" }),
          fetch("/api/drops", { cache: "no-store" })
        ]);
        const data = await response.json();
        const dropData = await dropRes.json();
        if (dropData && dropData.ok) {
          dcData = dropData;
          populateDcSourceSelect();
        }
        if (data.ok) {
          itData = data;
          renderGrailSummary();
          initCubeSimulators();
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
      const grailRow = document.getElementById("it-grail-filter-row");
      if (grailRow) {
        grailRow.style.display = (itActiveTab === "unique" || itActiveTab === "set") ? "flex" : "none";
      }
      const dropsConsole = document.getElementById("it-drops-console");
      if (dropsConsole) {
        dropsConsole.style.display = itActiveTab === "drops" ? "flex" : "none";
      }
      const cubeSimConsole = document.getElementById("it-cube-sim-console");
      if (cubeSimConsole) {
        cubeSimConsole.style.display = itActiveTab === "cube" ? "block" : "none";
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
          const pcs = (item.detail && item.detail.pieces) ? item.detail.pieces : [];
          const doneCount = pcs.filter(p => grailSetPieces.has(p.nameEn)).length;
          const isAllDone = pcs.length > 0 && doneCount === pcs.length;
          const hasTc87 = pcs.some(p => p.baseInfo && p.baseInfo.tc === 87);
          if (itGrailFilter === "todo" && isAllDone) return false;
          if (itGrailFilter === "done" && !isAllDone) return false;
          if (itGrailFilter === "tc87" && !hasTc87) return false;
          return matchQuery(item.nameZh + " " + item.nameEn + " " + item.classZh + " " + item.pieceList + " " + item.fullBonus + " " + item.usage, item);
        });
        cardsHtml = list.map(item => {
          const pcs = (item.detail && item.detail.pieces) ? item.detail.pieces : [];
          const doneCount = pcs.filter(p => grailSetPieces.has(p.nameEn)).length;
          const isAllDone = pcs.length > 0 && doneCount === pcs.length;
          return '<article class="it-card it-set' + (isAllDone ? ' grail-done' : '') + '" data-it-set="' + escapeHtml(item.id) + '">' +
            '<div class="it-card-head">' +
              '<div class="it-card-title-row">' +
                '<input type="checkbox" class="rw-check grail-set-check" data-grail-set="' + escapeHtml(item.id) + '" title="圣杯收集：勾选/取消整套" ' + (isAllDone ? 'checked' : '') + ' />' +
                renderItemThumb(item.icon, pickLangTitle(item)) +
                '<div data-no-sweep="1"><span class="it-card-title">' + escapeHtml(pickLangTitle(item)) + '</span><span class="it-card-en">' + escapeHtml(pickLangSub(item)) + '</span></div>' +
              '</div>' +
              '<div class="af-card-badges"><span class="rw-badge">' + escapeHtml(item.classZh) + '</span><span class="rw-badge ' + (isAllDone ? 'rw-badge-patch' : '') + '" data-grail-set-badge="' + escapeHtml(item.id) + '">' + doneCount + ' / ' + item.pieces + ' 件</span></div>' +
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
        const list = (itData.uniqueItems || []).filter(item => {
          if (itSubFilter !== "all" && item.slot !== itSubFilter) return false;
          const isDone = grailUniques.has(item.nameEn);
          if (itGrailFilter === "todo" && isDone) return false;
          if (itGrailFilter === "done" && !isDone) return false;
          if (itGrailFilter === "tc87" && !(item.baseInfo && item.baseInfo.tc === 87)) return false;
          return matchQuery(item.nameZh + " " + item.nameEn + " " + item.stats + " " + item.note + " " + (item.tier || ""), item);
        });
        cardsHtml = list.map(item => {
          const isDone = grailUniques.has(item.nameEn);
          const baseStatsStr = item.baseInfo
            ? (currentLang === "zhTW" ? (item.baseInfo.baseStatsZhTW || item.baseInfo.baseStats) : currentLang === "enUS" ? (item.baseInfo.baseStatsEnUS || item.baseInfo.baseStats) : item.baseInfo.baseStats)
            : "";
          const baseNameStr = item.baseInfo
            ? ((currentLang === "enUS" ? "Base: " : "底材：") + (currentLang === "zhTW" ? item.baseInfo.baseZhTW : currentLang === "enUS" ? item.baseInfo.baseEnUS : item.baseInfo.baseZhCN))
            : "";
          const baseLine = item.baseInfo
            ? renderStatList(baseNameStr + (baseStatsStr ? " · " + baseStatsStr : ""), "#c4b6a0", false)
            : '';
          return '<article class="it-card it-unique' + (isDone ? ' grail-done' : '') + '">' +
            '<div class="it-card-head">' +
              '<div class="it-card-title-row">' +
                '<input type="checkbox" class="rw-check grail-unique-check" data-grail-unique="' + escapeHtml(item.nameEn) + '" title="圣杯收集：标记已收集" ' + (isDone ? 'checked' : '') + ' />' +
                renderItemThumb(item.icon, pickLangTitle(item)) +
                '<div data-no-sweep="1"><span class="it-card-title">' + escapeHtml(pickLangTitle(item)) + '</span><span class="it-card-en">' + escapeHtml(pickLangSub(item)) + '</span></div>' +
              '</div>' +
              '<div class="af-card-badges">' + (item.tier ? '<span class="rw-badge">' + escapeHtml(item.tier) + '</span>' : '') + '</div>' +
            '</div>' +
            baseLine +
            renderStatList(item.stats, "", false) +
            '<div class="it-card-note" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">' +
              '<span>说明：' + escapeHtml(item.note) + '</span>' +
              '<span style="display:inline-flex;gap:6px;flex:0 0 auto">' +
                ((itData.uniqueUpgradeMeta && itData.uniqueUpgradeMeta[item.nameEn]) ? '<button type="button" class="rw-detail-btn" data-jump-upgrade="' + escapeHtml(item.nameEn) + '">升阶预览</button>' : '') +
                '<button type="button" class="rw-detail-btn" data-jump-drop="' + escapeHtml(item.nameEn) + '">查掉率</button>' +
              '</span>' +
            '</div>' +
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
      } else if (itActiveTab === "drops") {
        if (!dcData || !Array.isArray(dcData.sources)) {
          grid.innerHTML = '<div class="tz-empty">正在加载掉率计算器数据...</div>';
          return;
        }
        const uCodeMap = new Map();
        for (const code in (dcData.uniquePools || {})) {
          for (const u of dcData.uniquePools[code]) uCodeMap.set(u.nameEn, code);
        }
        const sCodeMap = new Map();
        for (const code in (dcData.setPools || {})) {
          for (const s of dcData.setPools[code]) sCodeMap.set(s.nameEn, code);
        }

        const allDropItems = [];
        if (itSubFilter === "all" || itSubFilter === "unique") {
          for (const u of (itData.uniqueItems || [])) {
            const c = uCodeMap.get(u.nameEn);
            if (c) allDropItems.push({ type: "unique", code: c, nameEn: u.nameEn, itemObj: u, icon: u.icon, badge: "暗金", color: "#e3bc6d" });
          }
        }
        if (itSubFilter === "all" || itSubFilter === "set") {
          for (const s of (itData.setItems || [])) {
            for (const p of ((s.detail && s.detail.pieces) || [])) {
              const c = sCodeMap.get(p.nameEn);
              if (c) allDropItems.push({ type: "set", code: c, nameEn: p.nameEn, itemObj: p, icon: p.icon || s.icon, badge: s.nameZh, color: "#67e87a" });
            }
          }
        }
        if (itSubFilter === "all" || itSubFilter === "rune") {
          for (const r of (rwRunes || [])) {
            const rCode = "r" + String(r.number).padStart(2, "0");
            allDropItems.push({ type: "rune", code: rCode, nameEn: r.name, itemObj: r, icon: r.icon, badge: "#" + r.number + " 符文", color: "#ff9b42" });
          }
        }
        if (itSubFilter === "all" || itSubFilter === "special") {
          for (const sp of (dcData.specialDrops || [])) {
            allDropItems.push({ type: "special", code: sp.code, nameEn: sp.nameEn, itemObj: sp, icon: sp.icon, badge: "首领专属", color: "#e284db" });
          }
        }

        const filteredItems = allDropItems.filter(entry =>
          matchQuery((entry.itemObj.nameZh || entry.itemObj.zhName || "") + " " + entry.nameEn + " " + entry.badge, entry.itemObj)
        );

        const formatOdds = (p) => {
          if (p <= 0) return null;
          const oneIn = Math.max(1, Math.round(1 / p));
          const pct = (p * 100) >= 1 ? (p * 100).toFixed(2) + "%" : (p * 100).toFixed(4) + "%";
          return { oneIn, pct };
        };

        if (dcMode === "source") {
          const src = dcData.sources.find(s => s.id === dcSourceId) || dcData.sources[0];
          const srcName = currentLang === "zhTW" ? (src.nameTw || src.nameZh) : currentLang === "enUS" ? src.nameEn : src.nameZh;
          const ranked = [];
          for (const entry of filteredItems) {
            const prob = computeSingleItemDropChance(src, entry.type, entry.code, entry.nameEn, dcMf, dcPlayers);
            if (prob > 0) ranked.push({ entry, prob });
          }
          ranked.sort((a, b) => b.prob - a.prob);
          cardsHtml = ranked.slice(0, 120).map(({ entry, prob }) => {
            const odds = formatOdds(prob);
            return '<article class="it-card it-' + escapeHtml(entry.type) + '">' +
              '<div class="it-card-head">' +
                '<div class="it-card-title-row">' +
                  renderItemThumb(entry.icon, pickLangTitle(entry.itemObj)) +
                  '<div data-no-sweep="1"><span class="it-card-title" style="color:' + entry.color + '">' + escapeHtml(pickLangTitle(entry.itemObj)) + '</span><span class="it-card-en">' + escapeHtml(pickLangSub(entry.itemObj)) + '</span></div>' +
                '</div>' +
                '<div class="af-card-badges"><span class="rw-badge">' + escapeHtml(entry.badge) + '</span></div>' +
              '</div>' +
              renderStatList("目标首领：" + srcName + " (mlvl " + src.mlvl + ") · 单次击杀掉率：1 / " + odds.oneIn.toLocaleString() + " (" + odds.pct + ")", "#9ad8ff", false) +
              '<div class="it-card-note" style="display:flex;align-items:center;justify-content:space-between;gap:8px">' +
                '<span>当前参数：MF ' + dcMf + '% · /players ' + dcPlayers + '</span>' +
                '<button type="button" class="rw-detail-btn" data-jump-drop="' + escapeHtml(entry.nameEn) + '">对比全部首领</button>' +
              '</div>' +
            '</article>';
          }).join("");
        } else {
          const targetList = filteredItems.slice(0, 24);
          cardsHtml = targetList.map(entry => {
            const srcRanks = [];
            for (const src of dcData.sources) {
              const prob = computeSingleItemDropChance(src, entry.type, entry.code, entry.nameEn, dcMf, dcPlayers);
              if (prob > 0) srcRanks.push({ src, prob });
            }
            srcRanks.sort((a, b) => b.prob - a.prob);
            const topLines = srcRanks.slice(0, 6).map((r, idx) => {
              const nm = currentLang === "zhTW" ? (r.src.nameTw || r.src.nameZh) : currentLang === "enUS" ? r.src.nameEn : r.src.nameZh;
              const odds = formatOdds(r.prob);
              return "#" + (idx + 1) + " " + nm + "：1 / " + odds.oneIn.toLocaleString() + " (" + odds.pct + ")";
            }).join(" · ");
            return '<article class="it-card it-' + escapeHtml(entry.type) + '">' +
              '<div class="it-card-head">' +
                '<div class="it-card-title-row">' +
                  renderItemThumb(entry.icon, pickLangTitle(entry.itemObj)) +
                  '<div data-no-sweep="1"><span class="it-card-title" style="color:' + entry.color + '">' + escapeHtml(pickLangTitle(entry.itemObj)) + '</span><span class="it-card-en">' + escapeHtml(pickLangSub(entry.itemObj)) + '</span></div>' +
                '</div>' +
                '<div class="af-card-badges"><span class="rw-badge">' + escapeHtml(entry.badge) + '</span></div>' +
              '</div>' +
              renderStatList(topLines || "当前难度无直接掉落", "#8af49f", false) +
              '<div class="it-card-note">最佳刷取排行（MF ' + dcMf + '% · /players ' + dcPlayers + '，共 ' + srcRanks.length + ' 个来源可掉落）</div>' +
            '</article>';
          }).join("");
        }
      }

      grid.innerHTML = cardsHtml || '<div class="tz-empty">未找到匹配的物品资料</div>';

      grid.querySelectorAll("[data-jump-drop]").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const targetName = btn.dataset.jumpDrop;
          itActiveTab = "drops";
          itSubFilter = "all";
          dcMode = "item";
          itSearchQuery = targetName;
          const inp = document.getElementById("it-search-input");
          const clr = document.getElementById("it-search-clear");
          if (inp) inp.value = targetName;
          if (clr) clr.style.display = "block";
          document.querySelectorAll("#it-subtabs [data-it-tab]").forEach(b => b.classList.toggle("active", b.dataset.itTab === "drops"));
          document.querySelectorAll("#dc-mode-chips [data-dc-mode]").forEach(b => b.classList.toggle("active", b.dataset.dcMode === "item"));
          const srcRow = document.getElementById("dc-source-row");
          if (srcRow) srcRow.style.display = "none";
          renderItSubfilters();
          renderItemsGrid();
        });
      });

      grid.querySelectorAll("[data-jump-upgrade]").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          cubeUpTargetName = btn.dataset.jumpUpgrade;
          itActiveTab = "cube";
          itSubFilter = "all";
          document.querySelectorAll("#it-subtabs [data-it-tab]").forEach(b => b.classList.toggle("active", b.dataset.itTab === "cube"));
          const upSel = document.getElementById("cube-up-select");
          if (upSel) upSel.value = cubeUpTargetName;
          renderCubeUpgrader();
          renderItSubfilters();
          renderItemsGrid();
        });
      });

      if (itActiveTab === "unique") {
        grid.querySelectorAll("[data-grail-unique]").forEach(cb => {
          cb.addEventListener("change", (e) => {
            const key = e.target.dataset.grailUnique;
            const checked = e.target.checked;
            if (checked) grailUniques.add(key);
            else grailUniques.delete(key);
            saveGrailState();
            renderGrailSummary();
            if (itGrailFilter === "todo" || itGrailFilter === "done") {
              renderItemsGrid();
            } else {
              const card = e.target.closest(".it-card");
              if (card) card.classList.toggle("grail-done", checked);
            }
          });
        });
      }

      if (itActiveTab === "set") {
        grid.querySelectorAll("[data-grail-set]").forEach(cb => {
          cb.addEventListener("click", (e) => e.stopPropagation());
          cb.addEventListener("change", (e) => {
            const setId = e.target.dataset.grailSet;
            const checked = e.target.checked;
            const setItem = (itData.setItems || []).find(s => s.id === setId);
            const pcs = (setItem && setItem.detail && setItem.detail.pieces) ? setItem.detail.pieces : [];
            pcs.forEach(p => {
              if (checked) grailSetPieces.add(p.nameEn);
              else grailSetPieces.delete(p.nameEn);
            });
            saveGrailState();
            renderGrailSummary();
            if (itGrailFilter === "todo" || itGrailFilter === "done") {
              renderItemsGrid();
            } else {
              const card = e.target.closest(".it-card");
              if (card) card.classList.toggle("grail-done", checked);
              const badge = grid.querySelector('[data-grail-set-badge="' + setId + '"]');
              if (badge && setItem) {
                badge.textContent = (checked ? pcs.length : 0) + " / " + setItem.pieces + " 件";
                badge.classList.toggle("rw-badge-patch", checked);
              }
            }
          });
        });
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
        const isPieceDone = grailSetPieces.has(p.nameEn);
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
        return '<div class="it-set-piece' + (isPieceDone ? ' grail-done' : '') + '">' +
          '<div class="it-set-piece-head">' +
            '<div class="it-card-title-row">' +
              '<input type="checkbox" class="rw-check grail-piece-check" data-grail-piece="' + escapeHtml(p.nameEn) + '" title="圣杯收集：标记该部件已收集" ' + (isPieceDone ? 'checked' : '') + ' />' +
              pieceImg +
              '<div data-no-sweep="1"><span class="it-set-piece-title">' + escapeHtml(pickLangTitle(p)) + '</span> <span class="it-set-piece-sub">(' + escapeHtml(pickLangSub(p)) + ')</span></div>' +
            '</div>' +
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

      const modalBody = document.getElementById("it-set-modal-body");
      modalBody.innerHTML =
        '<div class="it-set-pieces-grid">' + piecesHtml + '</div>' +
        partialHtml +
        fullHtml;

      modalBody.querySelectorAll("[data-grail-piece]").forEach(cb => {
        cb.addEventListener("change", (e) => {
          const pieceKey = e.target.dataset.grailPiece;
          const checked = e.target.checked;
          if (checked) grailSetPieces.add(pieceKey);
          else grailSetPieces.delete(pieceKey);
          saveGrailState();
          renderGrailSummary();
          const pieceCard = e.target.closest(".it-set-piece");
          if (pieceCard) pieceCard.classList.toggle("grail-done", checked);

          const pcs = detail.pieces || [];
          const doneCount = pcs.filter(p => grailSetPieces.has(p.nameEn)).length;
          const isAllDone = pcs.length > 0 && doneCount === pcs.length;
          const outerCard = document.querySelector('[data-it-set="' + setId + '"]');
          if (outerCard) {
            outerCard.classList.toggle("grail-done", isAllDone);
            const outerCb = outerCard.querySelector("[data-grail-set]");
            if (outerCb) outerCb.checked = isAllDone;
            const outerBadge = outerCard.querySelector("[data-grail-set-badge]");
            if (outerBadge) {
              outerBadge.textContent = doneCount + " / " + setItem.pieces + " 件";
              outerBadge.classList.toggle("rw-badge-patch", isAllDone);
            }
          }
        });
      });

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

      document.querySelectorAll("#it-grail-chips [data-grail-filter]").forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll("#it-grail-chips [data-grail-filter]").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          itGrailFilter = btn.dataset.grailFilter;
          renderItemsGrid();
        });
      });

      const exportBtn = document.getElementById("grail-export-btn");
      if (exportBtn) {
        exportBtn.addEventListener("click", () => {
          const payload = {
            version: 1,
            exportedAt: new Date().toISOString(),
            uniques: [...grailUniques],
            setPieces: [...grailSetPieces],
            runewords: [...rwCompleted]
          };
          const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "d2r-holy-grail-" + new Date().toISOString().slice(0, 10) + ".json";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
      }

      const importBtn = document.getElementById("grail-import-btn");
      const importFile = document.getElementById("grail-import-file");
      if (importBtn && importFile) {
        importBtn.addEventListener("click", () => importFile.click());
        importFile.addEventListener("change", (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const data = JSON.parse(String(reader.result || "{}"));
              if (Array.isArray(data.uniques)) grailUniques = new Set(data.uniques);
              if (Array.isArray(data.setPieces)) grailSetPieces = new Set(data.setPieces);
              saveGrailState();
              renderGrailSummary();
              renderItemsGrid();
              if (Array.isArray(data.runewords)) {
                rwCompleted = new Set(data.runewords);
                saveRwStorage();
                renderRunewordsSummary();
                renderRunewordsList();
              }
            } catch (err) {
              alert("导入圣杯存档失败：JSON 格式无效");
            }
            importFile.value = "";
          };
          reader.readAsText(file);
        });
      }

      const resetBtn = document.getElementById("grail-reset-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          if (grailUniques.size === 0 && grailSetPieces.size === 0) return;
          if (!confirm("确定要清空所有暗金与绿色套装的圣杯收集进度吗？")) return;
          grailUniques.clear();
          grailSetPieces.clear();
          saveGrailState();
          renderGrailSummary();
          renderItemsGrid();
        });
      }

      document.querySelectorAll("#it-base-sockets-chips [data-it-sock]").forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll("#it-base-sockets-chips [data-it-sock]").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          itBaseSocketFilter = btn.dataset.itSock;
          renderItemsGrid();
        });
      });

      document.querySelectorAll("#dc-mode-chips [data-dc-mode]").forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll("#dc-mode-chips [data-dc-mode]").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          dcMode = btn.dataset.dcMode;
          const srcRow = document.getElementById("dc-source-row");
          if (srcRow) srcRow.style.display = dcMode === "source" ? "flex" : "none";
          renderItemsGrid();
        });
      });

      const dcSrcSelect = document.getElementById("dc-source-select");
      if (dcSrcSelect) {
        dcSrcSelect.addEventListener("change", (e) => {
          dcSourceId = e.target.value;
          renderItemsGrid();
        });
      }

      const dcSyncTzBtn = document.getElementById("dc-sync-tz-btn");
      if (dcSyncTzBtn) {
        dcSyncTzBtn.addEventListener("click", () => {
          dcMode = "source";
          document.querySelectorAll("#dc-mode-chips [data-dc-mode]").forEach(b => b.classList.toggle("active", b.dataset.dcMode === "source"));
          const srcRow = document.getElementById("dc-source-row");
          if (srcRow) srcRow.style.display = "flex";
          syncDcSourceToCurrentTz();
          renderItemsGrid();
        });
      }

      const tzJumpDropsBtn = document.getElementById("tz-jump-drops-btn");
      if (tzJumpDropsBtn) {
        tzJumpDropsBtn.addEventListener("click", () => {
          switchMainTab("items");
          itActiveTab = "drops";
          itSubFilter = "all";
          dcMode = "source";
          document.querySelectorAll("#it-subtabs [data-it-tab]").forEach(b => b.classList.toggle("active", b.dataset.itTab === "drops"));
          document.querySelectorAll("#dc-mode-chips [data-dc-mode]").forEach(b => b.classList.toggle("active", b.dataset.dcMode === "source"));
          const srcRow = document.getElementById("dc-source-row");
          if (srcRow) srcRow.style.display = "flex";
          syncDcSourceToCurrentTz();
          renderItSubfilters();
          renderItemsGrid();
        });
      }

      const dcMfInput = document.getElementById("dc-mf-input");
      if (dcMfInput) {
        dcMfInput.addEventListener("input", () => {
          dcMf = Math.min(1200, Math.max(0, Number(dcMfInput.value) || 0));
          document.querySelectorAll("#dc-mf-presets [data-dc-mf]").forEach(b => b.classList.toggle("active", Number(b.dataset.dcMf) === dcMf));
          renderItemsGrid();
        });
      }

      document.querySelectorAll("#dc-mf-presets [data-dc-mf]").forEach(btn => {
        btn.addEventListener("click", () => {
          dcMf = Number(btn.dataset.dcMf);
          if (dcMfInput) dcMfInput.value = String(dcMf);
          document.querySelectorAll("#dc-mf-presets [data-dc-mf]").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          renderItemsGrid();
        });
      });

      document.querySelectorAll("#dc-players-chips [data-dc-players]").forEach(btn => {
        btn.addEventListener("click", () => {
          dcPlayers = Number(btn.dataset.dcPlayers);
          document.querySelectorAll("#dc-players-chips [data-dc-players]").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
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

    /* 八大职业技能树与加点模拟器（含 3.4 新职业术士 Warlock） */
    const SK_STORAGE_KEY = "d2r-skill-builds-v1";
    const SK_MAX_POINTS = 110;
    let skClasses = [];
    let skActiveClassId = "war";
    let skSelectedSkillKey = null;
    let skBonusAll = 0;
    let skBuilds = {};

    function loadSkBuilds() {
      try {
        const raw = localStorage.getItem(SK_STORAGE_KEY);
        if (raw) skBuilds = JSON.parse(raw) || {};
      } catch (e) {
        skBuilds = {};
      }
    }

    function saveSkBuilds() {
      try {
        localStorage.setItem(SK_STORAGE_KEY, JSON.stringify(skBuilds));
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
      skSelectedSkillKey = sk.key;

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
            skActiveClassId = btn.dataset.skClass;
            const clsObj = getActiveClassObj();
            skSelectedSkillKey = clsObj && clsObj.skills[0] ? clsObj.skills[0].key : null;
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
              cellsHtml += '<div class="sk-cell-empty"></div>';
              continue;
            }
            const basePts = Number(build[sk.key] || 0);
            const effPts = basePts > 0 ? basePts + skBonusAll : 0;
            const clsList = ["sk-node"];
            if (basePts > 0) clsList.push("allocated");
            if (basePts >= 20) clsList.push("maxed");
            if (skSelectedSkillKey === sk.key) clsList.push("selected");

            const rankText = basePts > 0 && skBonusAll > 0
              ? (basePts + " (" + effPts + ")/20")
              : (basePts + " / 20");
            const tagText = sk.passive
              ? (currentLang === "enUS" ? "Passive" : "被动")
              : ("Lv." + sk.reqLvl);

            cellsHtml += '<div class="' + clsList.join(" ") + '" data-sk-node="' + escapeHtml(sk.key) + '">' +
              '<div class="sk-node-top">' +
                '<span class="sk-node-lvlreq">' + escapeHtml(tagText) + '</span>' +
                '<div class="sk-node-step-btns">' +
                  '<button type="button" class="sk-step-btn" data-sk-step="-1" data-sk-key="' + escapeHtml(sk.key) + '" title="-1">-</button>' +
                  '<button type="button" class="sk-step-btn" data-sk-step="1" data-sk-key="' + escapeHtml(sk.key) + '" title="+1">+</button>' +
                '</div>' +
              '</div>' +
              '<div class="sk-node-title" data-no-sweep="1">' + escapeHtml(pickSkLang(sk, "nameZh", "nameTw", "nameEn")) + '</div>' +
              '<div class="sk-node-foot">' +
                '<span class="sk-node-rank">' + escapeHtml(rankText) + '</span>' +
              '</div>' +
            '</div>';
          }
        }

        const tabTitle = pickSkLang(tab, "zhCN", "zhTW", "enUS");
        return '<div class="sk-tree-col">' +
          '<div class="sk-tree-head">' +
            '<span class="sk-tree-title" data-no-sweep="1">' + escapeHtml(tabTitle) + '</span>' +
            '<span class="sk-tree-pts">' + tabPoints + ' 点</span>' +
          '</div>' +
          '<div class="sk-matrix">' + cellsHtml + '</div>' +
        '</div>';
      }).join("");

      wrap.querySelectorAll("[data-sk-step]").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const k = btn.dataset.skKey;
          const step = Number(btn.dataset.skStep) * (e.shiftKey ? 5 : 1);
          modifySkillPoint(k, step);
        });
      });

      wrap.querySelectorAll("[data-sk-node]").forEach(node => {
        node.addEventListener("click", (e) => {
          const k = node.dataset.skNode;
          modifySkillPoint(k, e.shiftKey ? 5 : 1);
        });
        node.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          const k = node.dataset.skNode;
          modifySkillPoint(k, e.shiftKey ? -5 : -1);
        });
        node.addEventListener("mouseenter", () => {
          skSelectedSkillKey = node.dataset.skNode;
          wrap.querySelectorAll("[data-sk-node]").forEach(n => n.classList.toggle("selected", n.dataset.skNode === skSelectedSkillKey));
          renderSkillInspector();
        });
      });
    }

    function renderSkillInspector() {
      const clsObj = getActiveClassObj();
      if (!clsObj) return;
      const sk = clsObj.skills.find(s => s.key === skSelectedSkillKey) || clsObj.skills[0];
      if (!sk) return;

      const build = getClassBuild(clsObj.id);
      const basePts = Number(build[sk.key] || 0);
      const effLvl = basePts > 0 ? basePts + skBonusAll : 1;

      const titleEl = document.getElementById("sk-insp-title");
      const subEl = document.getElementById("sk-insp-sub");
      const bodyEl = document.getElementById("sk-insp-body");
      if (!titleEl || !subEl || !bodyEl) return;

      titleEl.textContent = pickSkLang(sk, "nameZh", "nameTw", "nameEn");
      const secName = currentLang === "enUS" ? sk.nameZh : sk.nameEn;
      subEl.textContent = secName + " · 需求等级 " + sk.reqLvl + (sk.passive ? " · 被动技能" : "") +
        " · 当前投入 " + basePts + " 点" + (basePts > 0 && skBonusAll > 0 ? ("（含装备共 " + effLvl + " 级）") : "");

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
      if (sk.dmg) {
        const dCur = computeSkillDamage(sk, clsObj, build, effLvl);
        const d1 = computeSkillDamage(sk, clsObj, build, 1);
        const d20 = computeSkillDamage(sk, clsObj, build, 20);
        if (dCur) {
          statParts.push("技能伤害（" + effLvl + "级）：" + dCur.min + " – " + dCur.max + (dCur.synPct > 0 ? ("（已含 +" + dCur.synPct + "% 协同加成）") : ""));
          statParts.push("成长对照：1级 " + d1.min + "–" + d1.max + " · 20级 " + d20.min + "–" + d20.max);
        }
      }
      if (statParts.length > 0) {
        lines.push(renderStatList(statParts.join(" · "), "#9ad8ff", false));
      }

      if (Array.isArray(sk.reqs) && sk.reqs.length > 0) {
        const reqNames = sk.reqs.map(rk => {
          const rSk = clsObj.skills.find(x => x.key === rk);
          const hasIt = Number(build[rk] || 0) > 0;
          const nm = rSk ? pickSkLang(rSk, "nameZh", "nameTw", "nameEn") : rk;
          return (hasIt ? "✓ " : "○ ") + nm;
        });
        lines.push('<div class="it-card-note">前置技能：' + escapeHtml(reqNames.join(" → ")) + '（点击技能可自动补齐前置）</div>');
      }

      if (Array.isArray(sk.synergies) && sk.synergies.length > 0) {
        const synItems = sk.synergies.map(s => pickSkLang(s, "zhCN", "zhTW", "enUS")).join(" · ");
        lines.push('<div class="it-set-bonus-box" style="margin-top:4px"><h4 class="it-set-bonus-title" style="color:#67e87a">协同技能加成（仅基础投入点数生效）</h4>' +
          renderStatList(synItems, "#8af49f", false) + '</div>');
      }

      bodyEl.innerHTML = lines.join("");
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

      // Weapon IAS Breakpoint calculation
      const wsm = Number(document.getElementById("bp-ias-wsm")?.value || 0);
      const curIas = Math.max(0, Number(document.getElementById("bp-ias-input")?.value || 0));
      const fanaLvl = Math.max(0, Number(document.getElementById("bp-ias-fana")?.value || 0));
      const bosLvl = Math.max(0, Number(document.getElementById("bp-ias-bos")?.value || 0));
      const fanaEias = fanaLvl > 0 ? Math.min(40, 10 + Math.floor((30 * ((110 * fanaLvl) / (fanaLvl + 6))) / 100)) : 0;
      const bosEias = bosLvl > 0 ? Math.min(60, 15 + Math.floor((45 * ((110 * bosLvl) / (bosLvl + 6))) / 100)) : 0;
      const skillEias = fanaEias + bosEias;

      const baseFrames = bp.iasBaseFrames || 15;
      const calcFramesForIas = (iasVal) => {
        const gearEias = Math.floor((120 * iasVal) / (120 + iasVal));
        const eias = Math.min(75, Math.max(-75, gearEias + skillEias - wsm));
        return Math.max(7, Math.ceil((256 * baseFrames) / Math.floor((256 * (100 + eias)) / 100)) - 1);
      };

      const iasTablePairs = [];
      let prevF = 999;
      for (let testIas = 0; testIas <= 200; testIas++) {
        const f = calcFramesForIas(testIas);
        if (f < prevF) {
          iasTablePairs.push([f, testIas]);
          prevF = f;
        }
      }
      const iasRes = renderBpTable(iasTablePairs, curIas, "IAS");
      document.getElementById("bp-ias-status").innerHTML = iasRes.statusHtml;
      document.getElementById("bp-ias-table-wrap").innerHTML = iasRes.tableHtml;

      // FBR + 75% Max Block Dexterity calculator
      const curFbr = Math.max(0, Number(document.getElementById("bp-fbr-input")?.value || 0));
      const fbrRes = renderBpTable(bp.fbr[0].frames, curFbr, "FBR");
      const shieldBase = Number(document.getElementById("bp-blk-shield")?.value || 42);
      const clvl = Math.min(99, Math.max(1, Number(document.getElementById("bp-blk-clvl")?.value || 90)));
      const skillBlk = Math.max(0, Number(document.getElementById("bp-blk-skill")?.value || 0));
      const totalShieldBlock = shieldBase + (bp.blockFactor - 20) + skillBlk;
      const reqDex75 = Math.ceil((75 * 2 * clvl) / Math.max(1, totalShieldBlock)) + 15;
      document.getElementById("bp-blk-status").innerHTML =
        "<strong>75% 满格挡所需敏捷：" + reqDex75 + " 点</strong>（" + clvl + " 级 · 有效盾牌格挡率 " + totalShieldBlock + "%）<br>" + fbrRes.statusHtml;
      document.getElementById("bp-fbr-table-wrap").innerHTML = fbrRes.tableHtml;
    }

    const MERC_VARIANTS = [
      { id: "a2-might", act: 2, name: "第二幕 · 沙漠米山（进攻 · 力量灵气 Might）", baseLvl: 75, hp: 1430, hpLvl: 40, str: 173, str8: 14, dex: 139, dex8: 12, def: 1027, defLvl: 28, res: 142, res8: 4, baseFrames: 16, skills: [{ name: "戳刺 Jab", base: 23, per32: 0 }, { name: "力量灵气 Might", base: 15, per32: 8, auraDesc: (l) => "全队物理伤害 +" + (30 + l * 10) + "%" }] },
      { id: "a2-hf", act: 2, name: "第二幕 · 沙漠米山（防御 · 神圣冰冻 Holy Freeze）", baseLvl: 75, hp: 1430, hpLvl: 40, str: 173, str8: 14, dex: 139, dex8: 12, def: 1027, defLvl: 28, res: 142, res8: 4, baseFrames: 16, skills: [{ name: "戳刺 Jab", base: 23, per32: 0 }, { name: "神圣冰冻 Holy Freeze", base: 16, per32: 0, auraDesc: (l) => "大范围冰冷控场减速 " + Math.min(58, 25 + l * 2) + "%" }] },
      { id: "a2-prayer", act: 2, name: "第二幕 · 沙漠米山（战斗 · 祈祷灵气 Prayer）", baseLvl: 75, hp: 1430, hpLvl: 40, str: 173, str8: 14, dex: 139, dex8: 12, def: 1027, defLvl: 28, res: 142, res8: 4, baseFrames: 16, skills: [{ name: "戳刺 Jab", base: 24, per32: 10 }, { name: "祈祷灵气 Prayer", base: 18, per32: 0, auraDesc: (l) => "单层每秒回血 +" + (l * 2 - 5) + "（配眼光+治愈头享 3 倍回血协同）" }] },
      { id: "a2-defiance", act: 2, name: "第二幕 · 沙漠米山（防御 · 反抗灵气 Defiance）", baseLvl: 75, hp: 1430, hpLvl: 40, str: 173, str8: 14, dex: 139, dex8: 12, def: 1027, defLvl: 28, res: 142, res8: 4, baseFrames: 16, skills: [{ name: "戳刺 Jab", base: 24, per32: 0 }, { name: "反抗灵气 Defiance", base: 18, per32: 0, auraDesc: (l) => "全队防御 +" + (60 + l * 10) + "%" }] },
      { id: "a2-ba", act: 2, name: "第二幕 · 沙漠米山（进攻 · 祝福瞄准 Blessed Aim）", baseLvl: 75, hp: 1430, hpLvl: 40, str: 173, str8: 14, dex: 139, dex8: 12, def: 1027, defLvl: 28, res: 142, res8: 4, baseFrames: 16, skills: [{ name: "戳刺 Jab", base: 24, per32: 0 }, { name: "祝福瞄准 Blessed Aim", base: 18, per32: 0, auraDesc: (l) => "全队命中率 +" + (60 + l * 15) + "%" }] },
      { id: "a1-cold", act: 1, name: "第一幕 · 萝格斥候（冰冷箭 + 冻结箭 + 内视）", baseLvl: 67, hp: 900, hpLvl: 30, str: 116, str8: 10, dex: 173, dex8: 16, def: 744, defLvl: 23, res: 121, res8: 5, baseFrames: 15, skills: [{ name: "内视 Inner Sight", base: 22, per32: 10, auraDesc: (l) => "降低周围敌人基础防御 -" + (40 + l * 45) }, { name: "冰冷箭 Cold Arrow", base: 22, per32: 10 }, { name: "冻结箭 Freezing Arrow", base: 7, per32: 3 }] },
      { id: "a1-fire", act: 1, name: "第一幕 · 萝格斥候（火焰箭 + 爆裂箭 + 内视）", baseLvl: 67, hp: 900, hpLvl: 30, str: 116, str8: 10, dex: 173, dex8: 16, def: 744, defLvl: 23, res: 121, res8: 5, baseFrames: 15, skills: [{ name: "内视 Inner Sight", base: 22, per32: 10 }, { name: "火焰箭 Fire Arrow", base: 22, per32: 10 }, { name: "爆裂箭 Exploding Arrow", base: 12, per32: 5 }] },
      { id: "a3-fire", act: 3, name: "第三幕 · 东方铁狼法师（火焰 · 强化 Enchant + 火球）", baseLvl: 79, hp: 1224, hpLvl: 34, str: 130, str8: 10, dex: 104, dex8: 8, def: 907, defLvl: 25, res: 155, res8: 5, baseFrames: 16, skills: [{ name: "火焰强化 Enchant", base: 26, per32: 20, auraDesc: (l) => "为主角、召唤物与全队附加高额火焰伤害与 +" + (20 + l * 9) + "% 命中率" }, { name: "火球术 Fire Ball", base: 25, per32: 10 }, { name: "火焰弹 Fire Bolt", base: 27, per32: 10 }] },
      { id: "a3-ltng", act: 3, name: "第三幕 · 东方铁狼法师（闪电 · 静电力场 Static Field + 闪电）", baseLvl: 79, hp: 1224, hpLvl: 34, str: 130, str8: 10, dex: 104, dex8: 8, def: 907, defLvl: 25, res: 155, res8: 5, baseFrames: 16, skills: [{ name: "静电力场 Static Field", base: 18, per32: 8, auraDesc: (l) => "群体削减怪物 25% 当前生命（半径 " + (3.3 + l * 0.66).toFixed(1) + " 码）" }, { name: "闪电 Lightning", base: 24, per32: 10 }, { name: "充能弹 Charged Bolt", base: 25, per32: 10 }] },
      { id: "a3-cold", act: 3, name: "第三幕 · 东方铁狼法师（冰冷 · 冰尖柱 + 寒冰装甲）", baseLvl: 79, hp: 1224, hpLvl: 34, str: 130, str8: 10, dex: 104, dex8: 8, def: 907, defLvl: 25, res: 155, res8: 5, baseFrames: 16, skills: [{ name: "冰尖柱 Glacial Spike", base: 22, per32: 10, auraDesc: () => "群体冻结控场" }, { name: "寒冰装甲 Chilling Armor", base: 27, per32: 15 }, { name: "冰风暴 Ice Blast", base: 27, per32: 10 }] },
      { id: "a5-frenzy", act: 5, name: "第五幕 · 哈洛加斯野蛮人（双持狂乱 Frenzy + 嘲讽 + 铁皮）", baseLvl: 80, hp: 1680, hpLvl: 45, str: 200, str8: 15, dex: 129, dex8: 10, def: 1332, defLvl: 35, res: 148, res8: 4, baseFrames: 14, skills: [{ name: "狂乱 Frenzy", base: 13, per32: 7, auraDesc: (l) => "攻速与移速极速叠加 (Lv." + l + ")" }, { name: "钢铁皮肤 Iron Skin", base: 12, per32: 6 }, { name: "嘲讽 Taunt", base: 17, per32: 6 }] },
      { id: "a5-bash", act: 5, name: "第五幕 · 哈洛加斯野蛮人（双手重剑 · 战吼 Battle Cry + 击晕）", baseLvl: 80, hp: 1680, hpLvl: 45, str: 200, str8: 15, dex: 129, dex8: 10, def: 1332, defLvl: 35, res: 148, res8: 4, baseFrames: 15, skills: [{ name: "战吼 Battle Cry", base: 19, per32: 8, auraDesc: (l) => "降低周围怪物防御 -" + (48 + l * 2) + "% 与伤害 -" + (24 + l) + "%" }, { name: "猛击 Bash", base: 25, per32: 10 }, { name: "击晕 Stun", base: 20, per32: 8 }] }
    ];

    const MERC_WEAPONS = [
      { id: "infinity-gt", name: "无形巨长斧「无限 Infinity」（Lv.12 信念 -85% 敌抗 · 40% CB）", wsm: -10, ias: 0, skills: 0, str: 0, allRes: 0, reqStr: 130, reqDex: 100, note: "元素流派（电法/标马/陷阱刺/火德/混沌术士）毕业首选" },
      { id: "insight-gt", name: "无形鲛尾巨斧「眼光 Insight」（Lv.17 冥思回蓝 · +5 全属性 · 35% FCR）", wsm: -10, ias: 0, skills: 0, str: 5, allRes: 0, reqStr: 142, reqDex: 103, note: "全法系无限回蓝，搭配祈祷米山+治愈头实现三倍回血" },
      { id: "reapers-eth", name: "无形「死神之丧钟」镶 13# Shael（33% 触发衰老 -50% 物抗 · 20% IAS · 15% LL）", wsm: -10, ias: 20, skills: 0, str: 0, allRes: 0, reqStr: 104, reqDex: 79, note: "物理流派与风德破物免控场神器" },
      { id: "insight-cv", name: "无形巨神长柄斧「眼光 Insight」（高面板 200 力量需求底材）", wsm: 10, ias: 0, skills: 0, str: 5, allRes: 0, reqStr: 200, reqDex: 45, note: "拉祖克必打 4 孔，需注意 200 力量门槛" },
      { id: "faith-bow", name: "大院长/阴影弓「信心 Faith」（A1 萝格 · Lv.15 狂热灵气 · +2 技能 · +15 全抗）", wsm: 0, ias: 0, skills: 2, str: 0, allRes: 15, reqStr: 108, reqDex: 152, note: "物理弓马/召唤流 A1 萝格毕业狂热弓" },
      { id: "plague-law", name: "幻化之刃「瘟疫 Plague」+「执法者 Lawbringer」（A5 狂乱 · 降抗+净化+衰老+庇护所）", wsm: -30, ias: 20, skills: 2, str: 10, allRes: 0, reqStr: 25, reqDex: 136, note: "A5 双持狂乱野蛮人最强辅助与破免组合" },
      { id: "spirit-dual", name: "水晶剑「精神」+ 统治者大盾「精神」（A3 铁狼 · +4 全技能 · +70% FCR）", wsm: 0, ias: 0, skills: 4, str: 0, allRes: 0, reqStr: 156, reqDex: 0, note: "A3 火焰强化/静电力场铁狼毕业双精神（需头/甲补足 156 力量拿统盾）" }
    ];

    const MERC_HELMS = [
      { id: "andy-ral", name: "安达利尔的面容 (镶 8# 拉尔抵消 -30% 火抗 · +2 技能 · 20% IAS · +30 力量)", ias: 20, skills: 2, str: 30, def: 350, fireRes: 0, coldRes: 0, ltngRes: 0, poisRes: 70, ll: 10 },
      { id: "andy-1530", name: "安达利尔的面容 (镶 15% IAS / 30% 火抗红白珠 · +2 技能 · 35% IAS · +30 力量)", ias: 35, skills: 2, str: 30, def: 350, fireRes: 0, coldRes: 0, ltngRes: 0, poisRes: 70, ll: 10 },
      { id: "andy-raw", name: "安达利尔的面容 (未镶嵌 · 注意 -30% 火抗缺口 · +2 技能 · 20% IAS · +30 力量)", ias: 20, skills: 2, str: 30, def: 350, fireRes: -30, coldRes: 0, ltngRes: 0, poisRes: 70, ll: 10 },
      { id: "cure-helm", name: "「治愈 Cure」无形精华头（Lv.1 净化灵气 · 祈祷+眼光+治愈三倍回血核心）", ias: 0, skills: 0, str: 0, def: 420, fireRes: 0, coldRes: 0, ltngRes: 0, poisRes: 50, ll: 0, hasCure: true },
      { id: "gface-15", name: "吉永之脸 (镶 15% IAS 珠 · 35% 压碎性打击 CB · 15% 致命 DS · +15 力量)", ias: 15, skills: 0, str: 15, def: 217, fireRes: 0, coldRes: 0, ltngRes: 0, poisRes: 0, ll: 0 },
      { id: "vgaze", name: "无形吸血鬼的凝视（20% 物理减伤 PDR · 8% 吸血 · 法术减伤 15）", ias: 0, skills: 0, str: 0, def: 378, fireRes: 0, coldRes: 0, ltngRes: 0, poisRes: 0, ll: 8 }
    ];

    const MERC_ARMORS = [
      { id: "fort-ap", name: "无形执政官铠甲「刚毅 Fortitude」（+300% 伤害 · +30 全抗 · +2200 防御 · 需 93 力量）", ias: 0, skills: 0, str: 0, def: 2250, allRes: 30, reqStr: 93, hpPerLvl: 1.5 },
      { id: "fort-sa", name: "无形神圣盔甲「刚毅 Fortitude」（+300% 伤害 · +30 全抗 · +2700 防御 · 需 222 力量）", ias: 0, skills: 0, str: 0, def: 2700, allRes: 30, reqStr: 222, hpPerLvl: 1.5 },
      { id: "treachery", name: "无形精华甲「背信 Treachery」（+45% IAS · 触发 Lv.15 能量消解 +60 全抗 +15% 物免）", ias: 45, skills: 0, str: 0, def: 750, allRes: 60, reqStr: 80, hpPerLvl: 0 },
      { id: "coh-eth", name: "无形执政官铠甲「荣耀之链 CoH」（+2 全技能 · +65 全抗 · 8% 吸血 · +20 力量）", ias: 0, skills: 2, str: 20, def: 1350, allRes: 65, reqStr: 93, hpPerLvl: 0 },
      { id: "duriel-up", name: "无形升阶「督瑞尔的壳」（无法冰冻 CBF · +15 力量 · +20 全抗/+50 冰抗 · +生命/级）", ias: 0, skills: 0, str: 15, def: 1950, allRes: 20, reqStr: 108, hpPerLvl: 1 }
    ];

    function initMercenarySimulator() {
      const vSel = document.getElementById("merc-variant-select");
      const wSel = document.getElementById("merc-weapon-select");
      const hSel = document.getElementById("merc-helm-select");
      const aSel = document.getElementById("merc-armor-select");
      if (!vSel || !wSel || !hSel || !aSel) return;

      if (!vSel.options.length) {
        vSel.innerHTML = MERC_VARIANTS.map(v => '<option value="' + escapeHtml(v.id) + '">' + escapeHtml(v.name) + '</option>').join("");
        wSel.innerHTML = MERC_WEAPONS.map(w => '<option value="' + escapeHtml(w.id) + '">' + escapeHtml(w.name) + '</option>').join("");
        hSel.innerHTML = MERC_HELMS.map(h => '<option value="' + escapeHtml(h.id) + '">' + escapeHtml(h.name) + '</option>').join("");
        aSel.innerHTML = MERC_ARMORS.map(a => '<option value="' + escapeHtml(a.id) + '">' + escapeHtml(a.name) + '</option>').join("");

        ["merc-lvl-input", "merc-variant-select", "merc-weapon-select", "merc-helm-select", "merc-armor-select"].forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.addEventListener("input", renderMercenarySimulator);
            el.addEventListener("change", renderMercenarySimulator);
          }
        });
      }
      renderMercenarySimulator();
    }

    function renderMercenarySimulator() {
      const vSel = document.getElementById("merc-variant-select");
      const wSel = document.getElementById("merc-weapon-select");
      const hSel = document.getElementById("merc-helm-select");
      const aSel = document.getElementById("merc-armor-select");
      const checkEl = document.getElementById("merc-equip-check");
      const bodyEl = document.getElementById("merc-stats-body");
      const badgeEl = document.getElementById("merc-act-badge");
      if (!vSel || !checkEl || !bodyEl) return;

      const merc = MERC_VARIANTS.find(v => v.id === vSel.value) || MERC_VARIANTS[0];
      const weap = MERC_WEAPONS.find(w => w.id === wSel.value) || MERC_WEAPONS[0];
      const helm = MERC_HELMS.find(h => h.id === hSel.value) || MERC_HELMS[0];
      const armo = MERC_ARMORS.find(a => a.id === aSel.value) || MERC_ARMORS[0];
      const lvl = Math.min(98, Math.max(merc.baseLvl, Number(document.getElementById("merc-lvl-input")?.value || 90)));

      if (badgeEl) badgeEl.textContent = "ACT " + merc.act + " · Lv." + lvl;

      const dLvl = Math.max(0, lvl - merc.baseLvl);
      const baseStr = merc.str + Math.floor((dLvl * merc.str8) / 8);
      const baseDex = merc.dex + Math.floor((dLvl * merc.dex8) / 8);
      const baseHp = merc.hp + dLvl * merc.hpLvl;
      const baseDef = merc.def + dLvl * merc.defLvl;
      const baseResHell = merc.res + Math.floor((dLvl * merc.res8) / 8) - 100;

      const totalStr = baseStr + weap.str + helm.str + armo.str;
      const totalDex = baseDex + (weap.str || 0);
      const totalHp = Math.round(baseHp + lvl * (armo.hpPerLvl || 0));
      const totalDef = baseDef + helm.def + armo.def;
      const bonusSkills = weap.skills + helm.skills + armo.skills;
      const totalIas = weap.ias + helm.ias + armo.ias;

      const fRes = Math.min(75, baseResHell + weap.allRes + armo.allRes + helm.fireRes);
      const cRes = Math.min(75, baseResHell + weap.allRes + armo.allRes + helm.coldRes);
      const lRes = Math.min(75, baseResHell + weap.allRes + armo.allRes + helm.ltngRes);
      const pRes = Math.min(85, baseResHell + weap.allRes + armo.allRes + helm.poisRes);

      const maxReqStr = Math.max(weap.reqStr || 0, armo.reqStr || 0);
      const canEquipStr = totalStr >= maxReqStr;
      checkEl.innerHTML = (canEquipStr
        ? ("✓ <strong>力量达标可穿戴全部装备</strong>（当前总力量 <strong>" + totalStr + "</strong> / 最高装备需求 <strong>" + maxReqStr + "</strong>，裸力量 " + baseStr + "）")
        : ("⚠️ <strong>力量不足警告！</strong>当前总力量 <strong>" + totalStr + "</strong>，低于所选底材最高需求 <strong>" + maxReqStr + "</strong>（还差 " + (maxReqStr - totalStr) + " 点力量，建议搭配安达利尔的面容或提升佣兵等级）")) +
        "<br>配装定位：" + escapeHtml(weap.note);

      // Compute IAS frame
      const gearEias = Math.floor((120 * totalIas) / (120 + totalIas));
      const eias = Math.min(75, Math.max(-75, gearEias - weap.wsm));
      const atkFrames = Math.max(8, Math.ceil((256 * merc.baseFrames) / Math.floor((256 * (100 + eias)) / 100)) - 1);
      const aps = (25 / atkFrames).toFixed(2);

      const skLines = merc.skills.map(sk => {
        const effL = sk.base + Math.floor((dLvl * sk.per32) / 32) + bonusSkills;
        const extra = sk.auraDesc ? (" — " + sk.auraDesc(effL)) : "";
        return sk.name + "：Lv." + effL + "（含装备 +" + bonusSkills + " 技能）" + extra;
      });
      if (merc.id === "a2-prayer" && weap.id.startsWith("insight") && helm.hasCure) {
        const pLvl = 18 + bonusSkills;
        const singleHeal = pLvl * 2 - 5;
        skLines.push("★ 祈祷 + 眼光(冥思) + 治愈(净化) 三重协同激活：全队每秒恢复 +" + (singleHeal * 3) + " 点生命，同时快速消除毒素与诅咒时间！");
      }

      const statSummary = [
        "生命值：" + totalHp.toLocaleString() + "（基础 " + baseHp + "） · 总防御：" + totalDef.toLocaleString(),
        "力量：" + totalStr + "（裸 " + baseStr + "） · 敏捷：" + totalDex + "（裸 " + baseDex + "）",
        "地狱四抗：火 " + fRes + "% · 冰 " + cRes + "% · 电 " + lRes + "% · 毒 " + pRes + "%（裸抗 " + baseResHell + "%）",
        "攻击速度：总 IAS " + totalIas + "%（底材 WSM [" + weap.wsm + "]） → 动作帧数 " + atkFrames + " 帧（每秒攻击 " + aps + " 次）"
      ].join(" · ");

      bodyEl.innerHTML =
        renderStatList(statSummary, "#9ad8ff", false) +
        '<div class="it-set-bonus-box" style="margin-top:8px;border-color:rgba(87,219,112,0.35)">' +
          '<h4 class="it-set-bonus-title" style="color:#67e87a">佣兵技能与灵气实时等级</h4>' +
          renderStatList(skLines.join(" · "), "#8af49f", false) +
        '</div>';
    }

    function renderSkillsAll() {
      if (!skClasses.length) return;
      renderSkillsClassTabs();
      renderSkillsTrees();
      renderSkillInspector();
      renderBreakpointsAll();
      initMercenarySimulator();
    }

    function parseSkillsHashBuild(hashValue) {
      if (!hashValue || !hashValue.startsWith("#skills:")) return;
      const parts = hashValue.slice(8).split(":");
      const cid = parts[0];
      const code = parts[1] || "";
      const clsObj = skClasses.find(c => c.id === cid);
      if (!clsObj) return;
      skActiveClassId = cid;
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
          skClasses = data.classes;
          parseSkillsHashBuild(window.location.hash);
          const clsObj = getActiveClassObj();
          if (clsObj && !skSelectedSkillKey && clsObj.skills[0]) {
            skSelectedSkillKey = clsObj.skills[0].key;
          }
          renderSkillsAll();
        }
      } catch (err) {
        console.error("加载职业技能树失败", err);
      }
    }

    function setupSkillsEvents() {
      document.querySelectorAll("#sk-view-subtabs [data-sk-view]").forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll("#sk-view-subtabs [data-sk-view]").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          const view = btn.dataset.skView;
          const pEl = document.getElementById("sk-view-planner");
          const bEl = document.getElementById("sk-view-breakpoints");
          const mEl = document.getElementById("sk-view-mercenary");
          if (pEl) pEl.style.display = view === "planner" ? "block" : "none";
          if (bEl) bEl.style.display = view === "breakpoints" ? "block" : "none";
          if (mEl) mEl.style.display = view === "mercenary" ? "block" : "none";
          renderBreakpointsAll();
          initMercenarySimulator();
        });
      });

      const fcrVarSel = document.getElementById("bp-fcr-variant");
      if (fcrVarSel) fcrVarSel.addEventListener("change", (e) => { bpFcrVariantIdx = Number(e.target.value) || 0; renderBreakpointsAll(); });
      const fhrVarSel = document.getElementById("bp-fhr-variant");
      if (fhrVarSel) fhrVarSel.addEventListener("change", (e) => { bpFhrVariantIdx = Number(e.target.value) || 0; renderBreakpointsAll(); });

      ["bp-fcr-input", "bp-fhr-input", "bp-ias-wsm", "bp-ias-input", "bp-ias-fana", "bp-ias-bos", "bp-fbr-input", "bp-blk-shield", "bp-blk-clvl", "bp-blk-skill"].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener("input", renderBreakpointsAll);
          el.addEventListener("change", renderBreakpointsAll);
        }
      });

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
        if (typeof renderSkillsAll === "function") renderSkillsAll();
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
    setupSkillsEvents();
    initMainTabs();
    load();
  </script>
</body>
</html>`;
}
