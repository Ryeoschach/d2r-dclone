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
      grid-template-columns: minmax(0, 1fr) clamp(270px, 23%, 340px);
      gap: 14px;
      align-items: start;
    }
    .sk-trees-wrap {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
    }
    .sk-tree-col {
      padding: 10px 8px;
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
      gap: 6px;
    }
    .sk-cell-empty {
      min-height: 76px;
      border-radius: 8px;
      border: 1px dashed rgba(255, 255, 255, 0.04);
      background: rgba(0, 0, 0, 0.14);
    }
    .sk-node {
      position: relative;
      min-width: 0;
      min-height: 76px;
      padding: 6px 5px;
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
      border-color: #56d4ff;
      background: linear-gradient(145deg, rgba(16, 62, 108, 0.96), rgba(10, 28, 54, 0.99));
      outline: 2px solid #56d4ff;
      outline-offset: 0;
      box-shadow: 0 0 14px rgba(86, 212, 255, 0.45), inset 0 0 14px rgba(86, 212, 255, 0.24);
    }
    .sk-node-pick {
      appearance: none;
      width: 100%;
      min-width: 0;
      margin: 0;
      padding: 0;
      border: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      gap: 4px;
    }
    .sk-node-pick:focus-visible {
      outline: 2px solid #f5cf7b;
      outline-offset: 2px;
      border-radius: 6px;
    }
    .sk-node-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2px;
      min-width: 0;
      font-size: 9.5px;
      color: var(--muted);
    }
    .sk-node-lvlreq {
      padding: 1px 3px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.06);
      font-weight: 700;
      white-space: nowrap;
      flex-shrink: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sk-node.selected .sk-node-lvlreq {
      background: rgba(86, 212, 255, 0.2);
      color: #cdefff;
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
    .sk-node.selected .sk-node-title { color: #e8f8ff; }
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
    .sk-node.selected .sk-node-rank { color: #8ee5ff; }
    .sk-node-step-btns {
      display: inline-flex;
      gap: 2px;
      flex-shrink: 0;
    }
    .sk-step-btn {
      width: 18px;
      height: 18px;
      padding: 0;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.22);
      background: rgba(0, 0, 0, 0.5);
      color: #e6d7c3;
      font-size: 12px;
      font-weight: 800;
      line-height: 1;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .sk-step-btn:focus-visible {
      outline: 2px solid #f5cf7b;
      outline-offset: 1px;
    }
    .sk-step-btn:hover {
      border-color: #f5cf7b;
      color: #fff;
      background: rgba(213, 167, 72, 0.28);
    }
    .sk-node.selected .sk-step-btn {
      border-color: rgba(126, 224, 255, 0.52);
      background: rgba(7, 22, 42, 0.72);
      color: #e8f8ff;
    }
    .sk-node.selected .sk-step-btn:hover {
      border-color: #8ee5ff;
      background: rgba(86, 212, 255, 0.34);
      color: #fff;
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
    .pd-aura-bar {
      margin-bottom: 14px;
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid rgba(245, 207, 123, 0.42);
      background: linear-gradient(135deg, rgba(38, 28, 16, 0.92), rgba(18, 14, 14, 0.96));
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .pd-workspace {
      display: grid;
      grid-template-columns: 1.05fr 0.95fr 1.25fr;
      gap: 14px;
      align-items: start;
    }
    .pd-doll-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-areas:
        "weapon head    offhand"
        "weapon torso   offhand"
        "gloves belt    boots"
        "ring1  amulet  ring2";
      gap: 7px;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid rgba(213, 167, 72, 0.28);
      background:
        radial-gradient(circle at 50% 35%, rgba(56, 38, 22, 0.42), rgba(10, 8, 8, 0.96)),
        repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 16px),
        repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 16px);
    }
    .pd-inv-wrap {
      margin-top: 10px;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid rgba(182, 146, 86, 0.36);
      background: rgba(12, 10, 9, 0.92);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .pd-inv-grid {
      display: grid;
      grid-template-columns: repeat(10, minmax(0, 1fr));
      grid-template-rows: repeat(4, 34px);
      gap: 2px;
      padding: 4px;
      border-radius: 6px;
      border: 1px solid rgba(213, 167, 72, 0.32);
      background: #090808;
    }
    .pd-inv-cell {
      border: 1px solid rgba(255, 255, 255, 0.06);
      background: rgba(255, 255, 255, 0.018);
      border-radius: 2px;
    }
    .pd-inv-item {
      border-radius: 4px;
      border: 1px solid rgba(104, 164, 255, 0.68);
      background: linear-gradient(180deg, rgba(24, 36, 62, 0.95), rgba(12, 18, 34, 0.98));
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2px 1px;
      overflow: hidden;
      transition: all .14s ease;
      z-index: 2;
      position: relative;
    }
    .pd-inv-item:hover {
      border-color: #ffd573;
      filter: brightness(1.12);
    }
    .pd-inv-item.is-unique {
      border-color: rgba(213, 167, 72, 0.88);
      background: linear-gradient(180deg, rgba(50, 35, 16, 0.96), rgba(22, 16, 10, 0.98));
    }
    .pd-inv-item.is-util {
      border-color: rgba(160, 165, 175, 0.55);
      background: linear-gradient(180deg, rgba(36, 37, 42, 0.94), rgba(18, 19, 22, 0.98));
    }
    .pd-inv-item.active-bag {
      outline: 2px solid #ff8a75;
      box-shadow: 0 0 10px rgba(255, 138, 117, 0.45);
      z-index: 4;
    }
    .pd-inv-item img {
      max-width: 88%;
      max-height: 60%;
      object-fit: contain;
      filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.95));
    }
    .pd-inv-item-tag {
      font-size: 9px;
      font-weight: 800;
      line-height: 1.05;
      color: #b7d7ff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .pd-inv-item.is-unique .pd-inv-item-tag { color: #ffd573; }
    .pd-inv-item.is-util .pd-inv-item-tag { color: #c4c9d4; }
    .pd-skill-atk-box {
      margin-top: 10px;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid rgba(255, 138, 117, 0.42);
      background: linear-gradient(135deg, rgba(40, 20, 18, 0.86), rgba(16, 12, 14, 0.96));
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .pd-skill-notes-details {
      margin-top: 6px;
      border-radius: 8px;
      border: 1px solid rgba(255, 138, 117, 0.24);
      background: rgba(10, 12, 18, 0.56);
    }
    .pd-skill-notes-summary {
      list-style: none;
      display: flex;
      align-items: center;
      gap: 0.55ch;
      min-block-size: 30px;
      padding: 5px 10px;
      cursor: pointer;
      user-select: none;
      font-size: 11.5px;
      font-weight: 700;
      color: #f0c98a;
      border-radius: 7px;
    }
    .pd-skill-notes-summary::-webkit-details-marker {
      display: none;
    }
    .pd-skill-notes-summary:hover {
      color: #ffe3a8;
      background: rgba(245, 207, 123, 0.08);
    }
    .pd-skill-notes-summary:focus-visible {
      outline: 2px solid #f5cf7b;
      outline-offset: 2px;
    }
    .pd-skill-notes-summary::before {
      content: "";
      inline-size: 0.9em;
      block-size: 0.9em;
      flex-shrink: 0;
      background-color: currentColor;
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 4.25L6 7.75L9.5 4.25' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat center / contain;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 4.25L6 7.75L9.5 4.25' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat center / contain;
      rotate: -90deg;
    }
    .pd-skill-notes-details[open] > .pd-skill-notes-summary::before {
      rotate: 0deg;
    }
    .pd-skill-notes-details::details-content {
      interpolate-size: allow-keywords;
      overflow: clip;
      contain: layout;
    }
    .pd-skill-notes-details:not([open])::details-content {
      block-size: 0;
    }
    @media (prefers-reduced-motion: no-preference) {
      .pd-skill-notes-summary::before {
        transition: rotate 0.2s ease;
      }
      .pd-skill-notes-details::details-content {
        transition: block-size 0.24s ease-in-out, content-visibility 0.24s allow-discrete, display 0.24s allow-discrete;
      }
    }
    .pd-skill-notes-body {
      padding: 4px 10px 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    .pd-sheet-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      margin-top: 8px;
    }
    .pd-sheet-card {
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(11, 13, 18, 0.88);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .pd-sheet-title {
      font-size: 11px;
      font-weight: 800;
      color: #f5cf7b;
      letter-spacing: 0.4px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 3px;
      margin-bottom: 2px;
    }
    .pd-sheet-kv {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 6px;
      font-size: 11.5px;
      line-height: 1.45;
    }
    .pd-sheet-k { color: var(--muted); }
    .pd-sheet-v { color: #e2eeff; font-weight: 700; text-align: right; }
    @media (max-width: 640px) {
      .pd-sheet-grid { grid-template-columns: 1fr; }
    }
    .pd-merc-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      padding: 12px;
      border-radius: 10px;
      border: 1px solid rgba(87, 219, 112, 0.28);
      background:
        radial-gradient(circle at 50% 35%, rgba(22, 48, 32, 0.42), rgba(10, 12, 10, 0.96));
    }
    .pd-merc-content {
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: opacity .2s ease, filter .2s ease;
    }
    .pd-merc-ctrl-group {
      transition: opacity .2s ease, filter .2s ease;
    }
    .bp-card.merc-disabled {
      border-color: rgba(145, 154, 170, 0.28) !important;
      background: linear-gradient(180deg, rgba(24, 26, 30, 0.72), rgba(14, 15, 18, 0.88));
    }
    .bp-card.merc-disabled .pd-merc-ctrl-group,
    .bp-card.merc-disabled .pd-merc-content {
      filter: grayscale(1);
      opacity: 0.42;
      pointer-events: none;
      user-select: none;
    }
    .bp-card.merc-disabled .bp-card-title {
      color: #8f98a8 !important;
      filter: grayscale(1);
    }
    .pd-slot {
      position: relative;
      min-height: 74px;
      padding: 6px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background-color: rgba(14, 11, 10, 0.88);
      background-repeat: no-repeat;
      background-position: center;
      background-size: 46px 46px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      transition: all .15s ease;
      overflow: hidden;
    }
    .pd-slot.tall { min-height: 112px; background-size: 56px 84px; }
    .pd-slot.mini { min-height: 58px; background-size: 32px 32px; }
    .pd-slot:hover {
      border-color: rgba(245, 207, 123, 0.75);
      transform: translateY(-1px);
    }
    .pd-slot.active-slot {
      outline: 2px solid #ff8a75;
      outline-offset: 1px;
      box-shadow: 0 0 14px rgba(255, 138, 117, 0.35);
    }
    .pd-slot.equipped {
      background-image: none !important;
      border-color: rgba(213, 167, 72, 0.65);
      background-color: rgba(28, 21, 14, 0.94);
    }
    .pd-slot.equipped.q-set {
      border-color: rgba(87, 219, 112, 0.72);
      background-color: rgba(14, 32, 20, 0.94);
    }
    .pd-slot.equipped.q-rw {
      border-color: rgba(255, 178, 107, 0.8);
      background-color: rgba(34, 22, 12, 0.95);
    }
    .pd-slot.equipped.q-craft {
      border-color: rgba(255, 150, 48, 0.88);
      background-color: rgba(44, 24, 10, 0.96);
    }
    .pd-slot.q-craft .pd-slot-name { color: #ffaa4d; }
    .pd-slot.equipped.q-magic {
      border-color: rgba(105, 169, 255, 0.85);
      background-color: rgba(12, 24, 46, 0.96);
    }
    .pd-slot.q-magic .pd-slot-name { color: #7cb6ff; }
    .pd-slot.equipped.q-rare {
      border-color: rgba(248, 233, 122, 0.88);
      background-color: rgba(40, 36, 12, 0.96);
    }
    .pd-slot.q-rare .pd-slot-name { color: #f8e97a; }
    .pd-combo {
      position: relative;
      flex: 1;
      min-width: 0;
    }
    .pd-combo-field {
      position: relative;
      display: flex;
      align-items: center;
      border: 1px solid rgba(130, 102, 68, 0.55);
      border-radius: 8px;
      background: rgba(15, 13, 12, 0.94);
      transition: border-color .15s ease, box-shadow .15s ease;
    }
    .pd-combo-field:focus-within {
      border-color: #f5cf7b;
      box-shadow: 0 0 0 2px rgba(245, 207, 123, 0.22);
    }
    .pd-combo-input {
      width: 100%;
      min-width: 0;
      height: 32px;
      padding: 0 54px 0 10px;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: var(--text);
      font: inherit;
      font-size: 12.5px;
      outline: none;
    }
    .pd-combo-input::placeholder {
      color: var(--muted);
      opacity: 0.85;
    }
    .pd-combo-clear,
    .pd-combo-toggle {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border: 0;
      border-radius: 5px;
      background: transparent;
      color: var(--muted);
      cursor: pointer;
      font-size: 13px;
      line-height: 1;
      transition: color .12s ease, background .12s ease, transform .15s ease;
    }
    .pd-combo-clear { right: 26px; font-size: 15px; }
    .pd-combo-toggle { right: 4px; }
    .pd-combo-clear:hover,
    .pd-combo-toggle:hover {
      color: #ffe08c;
      background: rgba(245, 207, 123, 0.14);
    }
    .pd-combo-clear:focus-visible,
    .pd-combo-toggle:focus-visible {
      outline: 2px solid #f5cf7b;
      outline-offset: 1px;
    }
    .pd-combo.is-open .pd-combo-toggle {
      transform: translateY(-50%) rotate(180deg);
      color: #f5cf7b;
    }
    .pd-combo-menu {
      position: absolute;
      inset-inline: 0;
      top: calc(100% + 4px);
      z-index: 95;
      max-height: 280px;
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: 4px;
      border-radius: 9px;
      border: 1px solid rgba(245, 207, 123, 0.48);
      background: rgba(14, 13, 15, 0.98);
      box-shadow: 0 14px 32px rgba(0, 0, 0, 0.72);
    }
    .pd-combo-menu.open-up {
      top: auto;
      bottom: calc(100% + 4px);
    }
    .pd-combo-menu[hidden] {
      display: none;
    }
    .pd-combo-meta-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      padding: 4px 8px 5px;
      margin-bottom: 3px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 11px;
      color: var(--muted);
    }
    .pd-combo-opt {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 6px 8px;
      border: 1px solid transparent;
      border-radius: 6px;
      background: transparent;
      color: #e6dfd2;
      font: inherit;
      font-size: 12px;
      text-align: left;
      cursor: pointer;
      transition: background .1s ease, border-color .1s ease;
    }
    .pd-combo-opt:hover,
    .pd-combo-opt.is-active {
      background: rgba(245, 207, 123, 0.14);
      border-color: rgba(245, 207, 123, 0.36);
      color: #ffe8a6;
    }
    .pd-combo-opt.is-selected {
      background: rgba(94, 196, 142, 0.14);
      border-color: rgba(94, 196, 142, 0.45);
    }
    .pd-combo-opt.is-base-jump {
      color: #9df5b0;
      border-color: rgba(103, 232, 122, 0.25);
      background: rgba(20, 40, 26, 0.48);
    }
    .pd-combo-opt-main {
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
    }
    .pd-combo-opt-title {
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pd-combo-opt-sub {
      font-size: 10.5px;
      color: var(--muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pd-combo-opt-tag {
      flex-shrink: 0;
      font-size: 10.5px;
      font-weight: 700;
      color: #8af49f;
    }
    .pd-combo-empty {
      padding: 8px;
      font-size: 11.5px;
      color: #ffb3a7;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .pd-combo-jump-row {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
    .pd-search-hit {
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid rgba(154, 216, 255, 0.32);
      background: rgba(25, 36, 56, 0.85);
      color: #dbeaff;
      font-size: 11.5px;
      cursor: pointer;
      text-align: left;
      transition: border-color .12s ease, background .12s ease;
    }
    .pd-search-hit:hover {
      border-color: #f5cf7b;
      background: rgba(54, 42, 20, 0.92);
      color: #ffe28f;
    }
    .pd-search-hit.is-base-hit {
      border-color: rgba(103, 232, 122, 0.4);
      color: #a6f7b5;
    }
    .pd-affix-builder {
      display: none;
      flex-direction: column;
      gap: 8px;
      padding: 10px 11px;
      border-radius: 10px;
      border: 1px solid rgba(105, 169, 255, 0.45);
      background: rgba(10, 18, 34, 0.94);
    }
    .pd-affix-builder.is-rare {
      border-color: rgba(248, 233, 122, 0.5);
      background: rgba(28, 25, 10, 0.92);
    }
    .pd-affix-builder.is-craft {
      border-color: rgba(255, 168, 76, 0.55);
      background: rgba(34, 20, 8, 0.93);
    }
    .pd-affix-row {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .pd-affix-chips {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .pd-affix-chip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid rgba(105, 169, 255, 0.32);
      background: rgba(18, 30, 52, 0.85);
      font-size: 11.5px;
      color: #cfe4ff;
    }
    .pd-affix-chip.is-suffix {
      border-color: rgba(245, 207, 123, 0.35);
      background: rgba(38, 28, 14, 0.85);
      color: #ffe3a3;
    }
    .pd-affix-chip-del {
      border: none;
      background: rgba(255, 107, 87, 0.2);
      color: #ff9b8f;
      border-radius: 4px;
      padding: 1px 6px;
      cursor: pointer;
      font-size: 11px;
      font-weight: 800;
    }
    .pd-affix-chip-del:hover { background: rgba(255, 107, 87, 0.45); color: #fff; }
    .pd-hover-tooltip {
      position: fixed;
      z-index: 9999;
      display: none;
      pointer-events: none;
      min-width: 245px;
      max-width: 365px;
      padding: 11px 13px;
      border-radius: 10px;
      border: 1.5px solid rgba(213, 167, 72, 0.72);
      background: linear-gradient(180deg, rgba(14, 16, 24, 0.98), rgba(8, 10, 16, 0.98));
      box-shadow: 0 14px 36px rgba(0, 0, 0, 0.78), inset 0 0 0 1px rgba(255, 224, 140, 0.12);
      color: #e9f0ff;
      font-size: 12px;
      line-height: 1.5;
    }
    .pd-hover-tooltip.q-set { border-color: rgba(82, 230, 106, 0.75); }
    .pd-hover-tooltip.q-craft { border-color: rgba(255, 158, 61, 0.8); }
    .pd-hover-tooltip.q-rare { border-color: rgba(248, 233, 122, 0.78); }
    .pd-hover-tooltip.q-magic { border-color: rgba(105, 169, 255, 0.78); }
    .pd-tt-head {
      display: flex;
      align-items: center;
      gap: 9px;
      padding-bottom: 7px;
      margin-bottom: 7px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    }
    .pd-tt-ico {
      width: 34px;
      height: 34px;
      object-fit: contain;
      flex-shrink: 0;
    }
    .pd-tt-title {
      font-size: 13.5px;
      font-weight: 800;
      line-height: 1.25;
    }
    .pd-tt-sub {
      font-size: 11px;
      color: #a9b5cc;
      margin-top: 2px;
    }
    .pd-tt-meta {
      font-size: 11.5px;
      color: #d7e2f5;
      margin-bottom: 6px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .pd-tt-stats {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
      color: #8ebdff;
      font-size: 11.8px;
    }
    .pd-tt-socks {
      margin-top: 6px;
      padding-top: 6px;
      border-top: 1px dashed rgba(255, 213, 115, 0.28);
      display: flex;
      flex-direction: column;
      gap: 2px;
      color: #ffd573;
      font-size: 11.5px;
    }
    .pd-tt-set {
      margin-top: 7px;
      padding-top: 6px;
      border-top: 1px solid rgba(82, 230, 106, 0.28);
      color: #67e87a;
      font-size: 11.3px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .pd-tt-foot {
      margin-top: 7px;
      padding-top: 5px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 10.5px;
      color: #8c98b0;
      text-align: right;
    }
    .pd-inv-item.is-magic-blank {
      border-color: rgba(105, 169, 255, 0.8);
      background: rgba(14, 28, 56, 0.92);
    }
    .pd-inv-item.is-magic-blank .pd-inv-item-tag { color: #7cb6ff; }
    .pd-alloc-box {
      margin-top: 10px;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid rgba(104, 164, 255, 0.36);
      background: rgba(12, 16, 26, 0.92);
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    .pd-alloc-row {
      display: grid;
      grid-template-columns: 74px 1fr auto;
      align-items: center;
      gap: 6px;
      font-size: 11.5px;
      padding: 4px 6px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid rgba(255, 255, 255, 0.06);
    }
    .pd-alloc-ctrl {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      flex-wrap: wrap;
    }
    .pd-alloc-btn {
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.16);
      background: rgba(255, 255, 255, 0.06);
      color: #e4ecfa;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
    }
    .pd-alloc-btn:hover { border-color: #f5cf7b; color: #ffe08c; }
    .pd-alloc-input {
      width: 52px;
      height: 24px;
      padding: 0 4px;
      border-radius: 4px;
      border: 1px solid rgba(245, 207, 123, 0.45);
      background: rgba(8, 10, 14, 0.95);
      color: #ffe08c;
      font-size: 12px;
      font-weight: 800;
      text-align: center;
    }
    .pd-slot.locked-slot {
      opacity: 0.42;
      border-style: dashed;
    }
    .pd-slot-label {
      font-size: 10px;
      color: var(--muted);
      font-weight: 700;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .pd-slot-img {
      max-width: 46px;
      max-height: 52px;
      object-fit: contain;
      filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.9));
      margin: 2px 0;
    }
    .pd-slot-name {
      font-size: 11px;
      font-weight: 800;
      color: #f5cf7b;
      line-height: 1.2;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pd-slot.q-set .pd-slot-name { color: #67e87a; }
    .pd-slot.q-rw .pd-slot-name { color: #ffb26b; }
    .pd-sock-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 6px;
    }
    .pd-sock-slot-box {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 6px 8px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(10, 8, 8, 0.75);
    }
    .pd-sock-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .pd-sock-ico {
      width: 24px;
      height: 24px;
      object-fit: contain;
      flex-shrink: 0;
    }
    .pd-pal-shield-fs {
      margin: 0;
      padding: 7px 10px;
      border-radius: 8px;
      border: 1px solid rgba(245, 207, 123, 0.42);
      background: rgba(42, 30, 12, 0.56);
      display: none;
      flex-direction: column;
      gap: 6px;
      font-size: 11.5px;
      color: #ffe8b0;
    }
    .pd-pal-shield-fs legend {
      padding: 0 5px;
      font-size: 11.5px;
      font-weight: 800;
      color: #ffd573;
    }
    .pd-pal-mod-radios {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .pd-pal-radio-lbl {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      white-space: nowrap;
    }
    .pd-pal-mod-inputs {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .pd-jewel-builder {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 7px 9px;
      border-radius: 7px;
      border: 1px solid rgba(105, 169, 255, 0.36);
      background: rgba(14, 24, 42, 0.68);
      font-size: 11.5px;
    }
    .pd-jewel-builder.is-rare {
      border-color: rgba(248, 233, 122, 0.42);
      background: rgba(38, 30, 12, 0.62);
    }
    .pd-jewel-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      flex-wrap: wrap;
      font-size: 11px;
    }
    .pd-jewel-row {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .pd-jewel-row label {
      font-size: 11px;
      color: #9ad8ff;
      white-space: nowrap;
      min-width: 44px;
    }
    .pd-jewel-builder.is-rare .pd-jewel-row label {
      color: #ffe08c;
    }
    .pd-jewel-chip-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .pd-jewel-chip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      padding: 3px 7px;
      border-radius: 6px;
      border: 1px solid rgba(248, 233, 122, 0.3);
      background: rgba(0, 0, 0, 0.35);
      font-size: 11.5px;
    }
    .pd-jewel-val-inp {
      width: 54px;
      height: 24px;
      padding: 1px 5px;
      border-radius: 5px;
      border: 1px solid rgba(154, 216, 255, 0.4);
      background: #10151f;
      color: #ffd573;
      font-weight: 700;
      font-size: 11.5px;
      text-align: center;
    }
    .pd-slider-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 7px 10px;
      border-radius: 8px;
      border: 1px solid rgba(104, 164, 255, 0.22);
      background: rgba(12, 16, 24, 0.85);
      font-size: 12px;
    }
    @media (max-width: 1240px) {
      .pd-workspace { grid-template-columns: 1fr; }
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
          <button class="af-subtab" data-sk-view="mercenary" type="button"><img class="ui-tab-icon" src="/images/ui/desertmercenaryicon.webp" alt=""><span>角色 & 四幕佣兵真实纸娃娃自由配装 / 打孔镶嵌 / 变量与光环联动</span></button>
          <button class="af-subtab" data-sk-view="breakpoints" type="button"><img class="ui-tab-icon" src="/images/ui/sprint.webp" alt=""><span>全职业档位速查 & 攻速/施法/格挡计算器 (FCR / FHR / FBR / IAS)</span></button>
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
            <span id="sk-synced-extra-badge" style="display:none;font-size:11.5px;color:#9ad8ff;background:rgba(104,164,255,0.14);border:1px solid rgba(104,164,255,0.38);padding:2px 8px;border-radius:999px"></span>
          </div>
          <div class="rw-actions">
            <button class="rw-btn" id="sk-share-btn" type="button">复制加点分享链接</button>
            <button class="rw-btn rw-btn-danger" id="sk-reset-btn" type="button">重置当前职业加点</button>
          </div>
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
                    <option value="might">力量 Might (+物理伤)</option>
                    <option value="conv">信念 Conviction (-敌火/冰/电抗 · -敌防)</option>
                    <option value="ba">祝福瞄准 Blessed Aim (+攻击准确率 AR)</option>
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
                <label class="sk-bonus-ctrl" style="cursor:pointer">
                  <input type="checkbox" class="rw-check" id="pd-cta-bo" checked />
                  <span>战争召唤 CTA 战吼 (+1 全技能 · +65% 生命/法力)</span>
                </label>
              </div>
            </div>
          </div>

          <div class="pd-workspace">
            <!-- 1. 左侧：角色真实纸娃娃配装盘 (纯 10 部位) + 10x4 游戏背包 + 技能攻击力与完整人物面板 -->
            <article class="bp-card" style="border-color:rgba(213,167,72,0.45)">
              <div class="bp-card-head">
                <h3 class="bp-card-title" style="color:#f5cf7b" id="pd-char-title">角色真实配装纸娃娃</h3>
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                  <label class="sk-bonus-ctrl">
                    <span>等级</span>
                    <input type="number" class="sk-bonus-input" id="pd-char-lvl" min="1" max="99" value="90" style="width:50px;height:26px" />
                  </label>
                  <button type="button" class="rw-btn" id="pd-save-build-btn" style="padding:3px 8px;font-size:11px;border-color:rgba(103,232,122,0.55);color:#8af49f">💾 保存配装</button>
                  <button type="button" class="rw-btn" id="pd-reset-class-set-btn" style="padding:3px 8px;font-size:11px;border-color:rgba(103,232,122,0.35);color:#b9f6ca">🔄 恢复本职业套装</button>
                  <button type="button" class="rw-btn" id="pd-char-preset-btn" style="padding:3px 8px;font-size:11px">切换毕业暗金/符文预设</button>
                  <button type="button" class="rw-btn" id="pd-sync-skills-btn" style="padding:3px 8px;font-size:11px;border-color:rgba(154,216,255,0.45);color:#9ad8ff">同步 +技能至技能树</button>
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
                <div style="font-size:11px;color:var(--muted)">提示：点击背包内任意咒符，可在右侧编辑器调节其变量滑块、切换技能系别、复制或移出背包。</div>
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

              <!-- 完整人物属性面板 (D2R Character Sheet + 高级属性) -->
              <div id="pd-char-stats"></div>
            </article>

            <!-- 2. 中间：四幕佣兵真实纸娃娃配装盘 (4 部位 + 流派成长) -->
            <article class="bp-card" id="pd-merc-card" style="border-color:rgba(87,219,112,0.42)">
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
            <article class="bp-card" style="border-color:rgba(255,138,117,0.5);position:sticky;top:72px">
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
                    <span style="color:#9ad8ff;font-weight:700;white-space:nowrap" title="D2R 超强底材 (Superior) 原生词缀：武器可带 +5–15% 强化伤害 与 +1–3 攻击准确率，防具可带 +5–15% 强化防御（注意：若符文之语 ED 滑块已按游戏合并后的总 ED 填写，此处超强 ED 保持 0 即可避免重复计算）">✨ 超强底材 (Superior)：</span>
                    <label id="pd-sup-ed-wrap" style="display:inline-flex;align-items:center;gap:4px">
                      <span>ED +</span>
                      <input type="number" class="sk-bonus-input" id="pd-sup-ed" min="0" max="15" value="0" style="width:46px;height:24px;font-size:11.5px" />
                      <span>%</span>
                    </label>
                    <label id="pd-sup-ar-wrap" style="display:inline-flex;align-items:center;gap:4px">
                      <span>准确率 +</span>
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

  <div id="pd-hover-tooltip" class="pd-hover-tooltip" role="tooltip" aria-hidden="true"></div>
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
          if (typeof renderPaperdollAll === "function") renderPaperdollAll();
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
          if (typeof renderPaperdollAll === "function") renderPaperdollAll();
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
          if (typeof renderPaperdollAll === "function") renderPaperdollAll();
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
    let skBonusByTab = { 1: 0, 2: 0, 3: 0 };
    let skBonusBySkill = {};
    let skBonusFire = 0;
    let skBonusClassId = "";
    let skBuilds = {};

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
              skActiveClassId = nextCid;
              if (typeof loadPaperdollStateForClass === "function") loadPaperdollStateForClass(skActiveClassId);
            }
            const clsObj = getActiveClassObj();
            skSelectedSkillKey = null;
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
            const totalBonus = getSkillTreeBonusForSkill(sk);
            const effPts = basePts > 0 ? basePts + totalBonus : 0;
            const isSel = skSelectedSkillKey === sk.key;
            const clsList = ["sk-node"];
            if (basePts > 0) clsList.push("allocated");
            if (basePts >= 20) clsList.push("maxed");
            if (isSel) clsList.push("selected");

            const rankText = basePts > 0 && totalBonus > 0
              ? (basePts + " (" + effPts + ")/20")
              : (basePts + " / 20");
            const tagText = sk.passive
              ? (currentLang === "enUS" ? "Passive" : "被动")
              : ("Lv." + sk.reqLvl);
            const skTitle = pickSkLang(sk, "nameZh", "nameTw", "nameEn");

            cellsHtml += '<div class="' + clsList.join(" ") + '" data-sk-node="' + escapeHtml(sk.key) + '">' +
              '<div class="sk-node-top">' +
                '<span class="sk-node-lvlreq">' + escapeHtml(tagText) + '</span>' +
                '<div class="sk-node-step-btns">' +
                  '<button type="button" class="sk-step-btn" data-sk-step="-1" data-sk-key="' + escapeHtml(sk.key) + '" aria-label="减少 ' + escapeHtml(skTitle) + ' 技能点" title="减 1 点（Shift -5）">-</button>' +
                  '<button type="button" class="sk-step-btn" data-sk-step="1" data-sk-key="' + escapeHtml(sk.key) + '" aria-label="增加 ' + escapeHtml(skTitle) + ' 技能点" title="加 1 点（Shift +5）">+</button>' +
                '</div>' +
              '</div>' +
              '<button type="button" class="sk-node-pick" data-sk-pick="' + escapeHtml(sk.key) + '" aria-pressed="' + (isSel ? "true" : "false") + '">' +
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
          '<div class="sk-matrix">' + cellsHtml + '</div>' +
        '</div>';
      }).join("");
      renderSkSyncedExtraBadge();

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
        renderSkillInspector();
      };

      wrap.querySelectorAll("[data-sk-node]").forEach(node => {
        node.addEventListener("click", (e) => {
          if (e.target && e.target.closest && e.target.closest("[data-sk-step]")) return;
          toggleSelectSkillNode(node.dataset.skNode);
        });
        node.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          const k = node.dataset.skNode;
          modifySkillPoint(k, e.shiftKey ? -5 : -1);
        });
      });
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

      titleEl.textContent = pickSkLang(sk, "nameZh", "nameTw", "nameEn");
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

    let pdData = null;
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

    function getBaseSearchText(b) {
      if (!b) return "";
      return (b.nameZh || "") + " " + (b.aliasZh || "") + " " + (b.nameEn || "") + " " + (b.code || "");
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
          if (/^4\\s*孔/.test(rangeText) && maxBaseSocks < 4) continue;
          if (/^3\\s*孔/.test(rangeText) && maxBaseSocks < 3) continue;
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
        const clean = line.replace(/\\[[^\\]]+\\]/g, "").trim();
        const sm = clean.match(/^(\\d+)\\s*孔$/);
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
        const clean = l.replace(/\\[[^\\]]+\\]/g, "").trim();
        let m;
        if ((m = clean.match(/\\+(\\d+)\\s*([^\\d%+\\s·]+技能|[^\\d%+\\s·]+法术|[^\\d%+\\s·]+灵气|[^\\d%+\\s·]+技艺|[^\\d%+\\s·]+训练)/))) { parts.push("+" + m[1] + m[2].slice(0, 2)); }
        else if ((m = clean.match(/\\+(\\d+)\\s*(?:命中值|AR)/i))) { parts.push(m[1] + "AR"); }
        else if ((m = clean.match(/\\+(\\d+)%\\s*(?:快速打击恢复|FHR)/i))) { parts.push(m[1] + "FHR"); }
        else if ((m = clean.match(/\\+(\\d+)%\\s*(?:高速跑步|FRW)/i))) { parts.push(m[1] + "FRW"); }
        else if ((m = clean.match(/\\+(\\d+)\\s*生命/))) { parts.push(m[1] + "命"); }
        else if ((m = clean.match(/\\+(\\d+)\\s*法力/))) { parts.push(m[1] + "蓝"); }
        else if ((m = clean.match(/\\+(\\d+)%\\s*所有抗性/))) { parts.push(m[1] + "全"); }
        else if ((m = clean.match(/(火|冰|电|毒)[^\\d+]*\\+(\\d+)%/))) { parts.push(m[2] + m[1]); }
        else if ((m = clean.match(/\\+(\\d+)%\\s*.*MF/i))) { parts.push(m[1] + "MF"); }
        else if ((m = clean.match(/\\+(\\d+)\\s*最大伤害/))) { parts.push(m[1] + "M"); }
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

    const PD_STORAGE_KEY = "d2r_paperdoll_builds_v1";
    let pdSavedByClass = {};
    let pdStateLoadedForClass = "";

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

    function cloneJsonSafe(val, fallback) {
      try { return JSON.parse(JSON.stringify(val)); } catch (e) { return fallback; }
    }

    function loadAllSavedPaperdollBuilds() {
      try {
        const raw = localStorage.getItem(PD_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") pdSavedByClass = parsed;
        }
      } catch (e) {
        pdSavedByClass = {};
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

        pdSavedByClass[cid] = {
          charLoadout: cloneJsonSafe(pdCharLoadout, getDefaultClassSetLoadout(cid)),
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
          charAura: cAuraEl ? cAuraEl.value : "none",
          demonAura: normalizeDemonAuraId(dAuraEl ? dAuraEl.value : "none"),
          demonMlvl: dMlvlEl ? Math.min(99, Math.max(1, Number(dMlvlEl.value || 96))) : 96,
          warlockHex: hexEl ? hexEl.value : "none",
          enemyDebuff: debuffEl ? debuffEl.value : "none",
          selectedSkillKey: pdSelectedSkillKey || "",
          maxMode: maxEl ? Boolean(maxEl.checked) : false
        };
        localStorage.setItem(PD_STORAGE_KEY, JSON.stringify(pdSavedByClass));
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
        setVal("pd-char-aura", saved.charAura || "none");
        setVal("pd-warlock-demon-aura", normalizeDemonAuraId(saved.demonAura || "none"));
        setVal("pd-warlock-demon-mlvl", saved.demonMlvl || 96);
        setVal("pd-warlock-hex-buff", saved.warlockHex || "none");
        setVal("pd-enemy-debuff", saved.enemyDebuff || "none");
        setChk("pd-skill-max-mode", Boolean(saved.maxMode));
      } else {
        pdCharLoadout = getDefaultClassSetLoadout(cid);
        pdMercLoadout = getDefaultMercLoadout();
        pdCharBag = [];
        pdBagNextUid = 1;
        pdStatAlloc = { str: 0, dex: 0, vit: 0, enr: 0 };
        pdSelectedSkillKey = "";
        const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = String(v); };
        const setChk = (id, v) => { const el = document.getElementById(id); if (el) el.checked = Boolean(v); };
        setChk("pd-merc-enabled", true);
        setChk("pd-merc-aura-on", true);
        setVal("pd-char-aura", "none");
        setVal("pd-warlock-demon-aura", "none");
        setVal("pd-warlock-demon-mlvl", 96);
        setVal("pd-warlock-hex-buff", "none");
        setVal("pd-enemy-debuff", "none");
      }
      pdActiveTarget = "char";
      pdActiveBagUid = null;
      pdActiveSlot = pdCharLoadout.weapon ? "weapon" : "head";
      pdStateLoadedForClass = cid;
    }

    function getBaseRule(code) {
      return (pdData && pdData.baseRules && pdData.baseRules[code]) || null;
    }

    function normalizeDemonAuraId(v) {
      const s = String(v || "none").trim();
      if (!s || s === "none") return "none";
      return s.replace(/-\\d+$/, "");
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
      const tokens = String(rw.basesZh || "").split(/\\s*\\/\\s*/).map(s => s.trim()).filter(Boolean);
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
      if (typeof rw.stats === "string") return rw.stats.split(/\\s*(?:·|\\||\\n)\\s*/).filter(Boolean);
      return [];
    }

    function expandCompositeStatLines(statsText) {
      const rawParts = Array.isArray(statsText)
        ? statsText.flatMap(x => String(x || "").split(/\\s*(?:·|\\||\\n)\\s*/))
        : String(statsText || "").split(/\\s*(?:·|\\||\\n)\\s*/);
      const out = [];
      for (const raw of rawParts) {
        const line = String(raw || "").trim();
        if (!line) continue;
        // 1) Split independent stats joined by " / " (e.g. "+10–15 力量 / +10–15 敏捷", "+2–6 战斗指挥 / +1–6 战斗体制 / +1–4 战嚎")
        const normSlash = line.replace(/）\\//g, "） / ");
        const subParts = normSlash.split(/\\s+\\/\\s+(?=[+-]?\\d|需求|伤害)/).map(x => x.trim()).filter(Boolean);
        for (const p of subParts) {
          let m;
          // 2) Expand shorthand multi-element / multi-stat roll lines into independently adjustable lines
          if ((m = p.match(/^冰\\/电\\/火抗性\\s*(.+)$/))) {
            out.push("冰冷抗性 " + m[1], "闪电抗性 " + m[1], "火焰抗性 " + m[1]);
          } else if ((m = p.match(/^([+-]?\\d+(?:[–-]\\d+)?%)\\s*火\\/电抗$/))) {
            out.push("火焰抗性 " + m[1], "闪电抗性 " + m[1]);
          } else if ((m = p.match(/^([+-]?\\d+(?:[–-]\\d+)?%)\\s*冰\\/火\\/电伤$/))) {
            out.push(m[1] + " 冰冷技能伤害", m[1] + " 火焰技能伤害", m[1] + " 闪电技能伤害");
          } else if ((m = p.match(/^([+-]?\\d+(?:[–-]\\d+)?%)\\s*电\\/火伤$/))) {
            out.push(m[1] + " 闪电技能伤害", m[1] + " 火焰技能伤害");
          } else if ((m = p.match(/^([+-]?\\d+(?:[–-]\\d+)?%)\\s*冰冷\\s*\\/\\s*闪电\\s*\\/\\s*火焰技能伤害$/))) {
            out.push(m[1] + " 冰冷技能伤害", m[1] + " 闪电技能伤害", m[1] + " 火焰技能伤害");
          } else if ((m = p.match(/^伤害\\/魔伤减少\\s*(.+)$/))) {
            out.push("物理伤害减少 " + m[1] + " (PDR)", "魔法伤害减少 " + m[1] + " (MDR)");
          } else if ((m = p.match(/^(\\d+(?:[–-]\\d+)?)\\s*EK\\/LK$/i))) {
            out.push("+" + m[1] + " 每杀一个敌人恢复法力 (MAEK)", "+" + m[1] + " 每杀一个敌人恢复生命 (LAEK)");
          } else if ((m = p.match(/^(\\+\\d+(?:[–-]\\d+)?)\\s*击杀生命\\/法力$/))) {
            out.push(m[1] + " 每杀一个敌人恢复生命 (LAEK)", m[1] + " 每杀一个敌人恢复法力 (MAEK)");
          } else if ((m = p.match(/^(\\+\\d+(?:[–-]\\d+)?)\\s*召唤\\/毒素与白骨\\/诅咒技能$/))) {
            out.push(m[1] + " 召唤技能", m[1] + " 毒素与白骨技能", m[1] + " 诅咒技能");
          } else if ((m = p.match(/^(\\+\\d+(?:[–-]\\d+)?)\\s*冰\\/火\\/电支配(?:（.*?）)?$/))) {
            out.push(m[1] + " 冰冷支配", m[1] + " 火焰支配", m[1] + " 闪电支配");
          } else if ((m = p.match(/^(\\+\\d+(?:[–-]\\d+)?)\\s*火焰波\\s*\\/\\s*火焰之环$/))) {
            out.push(m[1] + " 火焰波", m[1] + " 火焰之环");
          } else if ((m = p.match(/^(\\+\\d+(?:[–-]\\d+)?)\\s*血沸\\/吞噬\\/恶魔精通$/))) {
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
        if (/^[+-]?\\d+\\s*[–-]\\s*\\d+\\s*(?:火焰|冰冷|闪电|毒素|魔法)?伤害/i.test(line)) return;
        if (/附加\\s*\\d+\\s*[–-]\\s*\\d+/i.test(line)) return;
        const m = line.match(/([+-]?)(\\d+(?:\\.\\d+)?)\\s*[–-]\\s*(\\d+(?:\\.\\d+)?)(%?)/);
        if (m) {
          const a = Number(m[2]);
          const b = Number(m[3]);
          if (b > a) {
            const hasDec = m[2].includes(".") || m[3].includes(".");
            const invertBest = /自身\\s*-|自身物理承受伤害/.test(line);
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

    function formatItemLinesWithRolls(statsText, rollsObj) {
      const { lines, vars } = extractVariableRanges(statsText);
      const varByIdx = new Map(vars.map(v => [v.lineIdx, v]));
      return lines.map((line, idx) => {
        const v = varByIdx.get(idx);
        if (!v) return line;
        const curVal = (rollsObj && rollsObj[v.key] !== undefined) ? Number(rollsObj[v.key]) : v.best;
        return line.replace(/([+-]?)\\d+(?:\\.\\d+)?\\s*[–-]\\s*\\d+(?:\\.\\d+)?/, "$1" + curVal) + " [" + v.min + "–" + v.max + "]";
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
        icon: isRare ? "/images/items/misc/body_part/fragment_lightning.webp" : "/images/items/misc/body_part/fragment_magic.webp",
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
        titleZh = "[手工] " + c.nameZh.replace(/\\s*\\([^)]*\\)$/, "");
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
      const sockLines = [];
      let reqReducePct = 0;
      if (maxSocks > 0 && Array.isArray(eq.sockets)) {
        eq.sockets.slice(0, maxSocks).forEach((sid, idx) => {
          if (!sid) return;
          if (isCustomJewelSocket(sid)) {
            const jInfo = resolveCustomJewelInfo(sid);
            if (jInfo && jInfo.bonusText) {
              sockLines.push("【孔 " + (idx + 1) + " · " + jInfo.nameZh + "】" + jInfo.bonusText);
              const rm = jInfo.bonusText.match(/需求\\s*-(\\d+)%/);
              if (rm) reqReducePct += Number(rm[1]);
            }
            return;
          }
          const sObj = (pdData.socketables || []).find(x => x.id === sid);
          const bTxt = getSocketableBonusText(sid, bRule);
          if (sObj && bTxt) {
            sockLines.push("【孔 " + (idx + 1) + " · " + sObj.nameZh + "】" + bTxt);
            const rm = bTxt.match(/需求\\s*-(\\d+)%/);
            if (rm) reqReducePct += Number(rm[1]);
          }
        });
      }
      rolledLines.forEach(l => {
        const rm = l.match(/需求\\s*-(\\d+)%/);
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
          txt = txt.replace(/\\[[^\\]]+\\]/g, "").replace(/([+-]?\\d+(?:\\.\\d+)?)\\s*\\/\\s*级/g, "+($1 * 等级)").replace(/([+-]?\\d+)%\\s*FBR\\s*\\/\\s*格挡/gi, "$1% FBR / $1% 提高格挡几率").trim();
          txt.split(/\\s*[\\/·]\\s*/).forEach(part => {
            const clean = part.trim();
            if (!clean) return;
            let rm;
            if ((rm = clean.match(/\\+?\\(\\s*(\\d+(?:\\.\\d+)?)(%?)\\s*\\*\\s*等级\\s*\\)(%?)\\s*(.*)/))) {
              const val = Math.floor(Number(rm[1]) * actorLvl);
              const hasPct = Boolean(rm[2] || rm[3]);
              const tail = rm[4] || "";
              if (isWeapSlot && hasPct && !tail.includes("对恶魔") && !tail.includes("对不死") && /强化伤害|增强伤害|ED/i.test(tail)) tmpAcc.weapEd += val;
              if (isWeapSlot && tail.includes("最大伤害")) tmpAcc.flatMax += val;
              if (!isWeapSlot && tail.includes("防御")) tmpAcc.flatDef += val;
              return;
            }
            if (isWeapSlot) {
              if (!clean.includes("对恶魔") && !clean.includes("对不死") && (rm = clean.match(/\\+(\\d+)%\\s*(?:强化伤害|增强伤害|ED)(?!%)/i))) {
                tmpAcc.weapEd += Number(rm[1]);
              }
              if (!/火焰|冰冷|闪电|毒素|魔法|对恶魔|对不死|技能/.test(clean) && (rm = clean.match(/\\+(\\d+)\\s*[–-]\\s*(\\d+)\\s*伤害(?!加深|减少|转化)/))) {
                tmpAcc.flatMin += Number(rm[1]);
                tmpAcc.flatMax += Number(rm[2]);
              }
              if ((rm = clean.match(/\\+(\\d+)\\s*最小伤害/))) tmpAcc.flatMin += Number(rm[1]);
              if ((rm = clean.match(/\\+(\\d+)\\s*最大伤害/))) tmpAcc.flatMax += Number(rm[1]);
            } else {
              if ((rm = clean.match(/\\+(\\d+)%\\s*强化防御/))) tmpAcc.defEd += Number(rm[1]);
              else if (!clean.includes("远程") && !clean.includes("目标") && (rm = clean.match(/\\+(\\d+)\\s*防御(?!值?对)/))) tmpAcc.flatDef += Number(rm[1]);
              if ((rm = clean.match(/([+-]?\\d+)%\\s*(?:提高格挡几率|格挡几率|格挡率|格挡(?!速))/))) tmpAcc.blockBonus += Number(rm[1]);
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
      let cleanRaw = String(line).replace(/^【[^】]+】/, "").replace(/\\[\\d+(?:\\.\\d+)?[–-]\\d+(?:\\.\\d+)?\\]/g, "");
      // Expand multi-element resistance shorthands like "冰/电/火抗性 +25%" before splitting on "/"
      cleanRaw = cleanRaw.replace(/((?:火|冰|电|毒)(?:\\s*\\/\\s*(?:火|冰|电|毒))+)抗性?\\s*([+-]?\\d+)%?/g, (_, els, v) => {
        const map = { "火": "火焰抗性", "冰": "冰冷抗性", "电": "闪电抗性", "毒": "毒素抗性" };
        return els.split(/\\s*\\/\\s*/).map(e => (map[e] || e) + " " + v + "%").join(" / ");
      });
      cleanRaw = cleanRaw.replace(/([+-]?\\d+)%\\s*((?:火|冰|电|毒)(?:\\s*\\/\\s*(?:火|冰|电|毒))+)抗性?/g, (_, v, els) => {
        const map = { "火": "火焰抗性", "冰": "冰冷抗性", "电": "闪电抗性", "毒": "毒素抗性" };
        return els.split(/\\s*\\/\\s*/).map(e => (map[e] || e) + " " + v + "%").join(" / ");
      });
      // Expand multi-stat shorthands like "+30% FBR/格挡", "+20 力/体", "+20 力/敏", "+20 力/精" before splitting on "/"
      cleanRaw = cleanRaw
        .replace(/([+-]?\\d+)%\\s*FBR\\s*\\/\\s*格挡/gi, "$1% FBR / $1% 提高格挡几率")
        .replace(/([+-]?\\d+)\\s*力\\s*\\/\\s*体/g, "$1 力量 / $1 体力")
        .replace(/([+-]?\\d+)\\s*力\\s*\\/\\s*敏/g, "$1 力量 / $1 敏捷")
        .replace(/([+-]?\\d+)\\s*力\\s*\\/\\s*精/g, "$1 力量 / $1 精力");
      // Normalize short per-level notation "+1.5/级" before splitting on "/"
      cleanRaw = cleanRaw.replace(/\\+?(\\d+(?:\\.\\d+)?)\\s*\\/\\s*级/g, "+($1 * 等级)");
      const subParts = cleanRaw.split(/\\s*[\\/·]\\s*/);
      const isWeapon = Boolean(ctx && ctx.isWeapon);
      const itemAcc = ctx && ctx.itemAcc;
      for (const part of subParts) {
        const clean = part.trim();
        if (!clean) continue;
        let m;
        if ((m = clean.match(/\\+?\\(\\s*(\\d+(?:\\.\\d+)?)(%?)\\s*\\*\\s*等级\\s*\\)(%?)\\s*(.*)/))) {
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
        if (/\\+生命\\(按等级\\)/.test(clean)) {
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
            { key: "Enchant", re: /\\+(\\d+)\\s*(?:火焰强化|附魔火焰|附魔)/, charge: false },
            { key: "Enchant", re: /(?:等级\\s*(\\d+)|(\\d+)\\s*级)\\s*(?:火焰强化|强化|附魔)/, charge: true },
            { key: "Fire Ball", re: /\\+(\\d+)\\s*火球/, charge: false },
            { key: "Fire Wall", re: /\\+(\\d+)\\s*(?:火墙|火焰之墙)/, charge: false },
            { key: "Meteor", re: /\\+(\\d+)\\s*陨石/, charge: false },
            { key: "Whirlwind", re: /\\+(\\d+)\\s*(?:旋风斩|旋风)/, charge: false },
            { key: "Zeal", re: /\\+(\\d+)\\s*(?:热忱|白热)/, charge: false },
            { key: "Berserk", re: /\\+(\\d+)\\s*(?:狂战士|狂暴)/, charge: false },
            { key: "Vengeance", re: /\\+(\\d+)\\s*复仇/, charge: false },
            { key: "Teleport", re: /\\+(\\d+)\\s*(?:传送术|传送)/, charge: false },
            { key: "Werebear", re: /\\+(\\d+)\\s*变熊/, charge: false },
            { key: "Werewolf", re: /\\+(\\d+)\\s*狼人变化/, charge: false },
            { key: "Lycanthropy", re: /\\+(\\d+)\\s*变形术/, charge: false },
            { key: "Feral Rage", re: /\\+(\\d+)\\s*野性狂暴/, charge: false },
            { key: "Valkyrie", re: /\\+(\\d+)\\s*女武神/, charge: false }
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

        if ((m = clean.match(/\\+(\\d+)\\s*(?:所有技能|全部技能|全技能|All Skills)/i))) {
          tot.skills += Number(m[1]);
        } else if (isCharActor && (m = clean.match(/\\+(\\d+)\\s*(?:随机职业技能|本职业全部技能|本职业技能)/))) {
          tot.classSkills += Number(m[1]);
        } else if ((m = clean.match(/\\+(\\d+)\\s*本系技能/))) {
          const p = (ctx && ctx.tabPage) || 1;
          tot.tabSkills[p] = (tot.tabSkills[p] || 0) + Number(m[1]);
        } else if (isCharActor && (m = clean.match(/\\+(\\d+)\\s*(?:随机)?(亚马逊|法师|死灵法师|死灵|圣骑士|野蛮人|德鲁伊|刺客|术士)技能/))) {
          const clsMap = { "亚马逊": "ama", "法师": "sor", "死灵法师": "nec", "死灵": "nec", "圣骑士": "pal", "野蛮人": "bar", "德鲁伊": "dru", "刺客": "ass", "术士": "war" };
          if (clsMap[m[2]] === cid) tot.classSkills += Number(m[1]);
        } else if (isCharActor && (m = clean.match(/\\+(\\d+)\\s*(火焰技能|火系技能)/))) {
          const v = Number(m[1]);
          if (cid === "sor") tot.tabSkills[1] = (tot.tabSkills[1] || 0) + v;
          else tot.fireSkills += v;
        } else if (isCharActor && (m = clean.match(/\\+(\\d+)\\s*([^\\d%+\\s·|]+)/))) {
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
        if ((m = clean.match(/([+-]?\\d+)%\\s*(?:快速施法|更快速施法|FCR)/i))) tot.fcr += Number(m[1]);
        if ((m = clean.match(/([+-]?\\d+)%\\s*(?:快速打击恢复|更快速打击回复|FHR)/i))) tot.fhr += Number(m[1]);
        if ((m = clean.match(/([+-]?\\d+)%\\s*(?:提高攻击速度|攻击速度|攻速|IAS)/i))) tot.ias += Number(m[1]);
        if ((m = clean.match(/([+-]?\\d+)%\\s*(?:高速跑步|更快速跑步|高跑|FRW)/i))) tot.frw += Number(m[1]);
        if ((m = clean.match(/([+-]?\\d+)%\\s*(?:更快速格挡率|快速格挡速度|FBR)/i))) tot.fbr += Number(m[1]);
        if ((m = clean.match(/([+-]?\\d+)%\\s*(?:提高格挡几率|格挡几率|格挡率|格挡(?!速))/))) tot.blockPct += Number(m[1]);
        if ((m = clean.match(/([+-]?\\d+)\\s*(?:力量|力(?![量度]))/))) tot.str += Number(m[1]);
        if ((m = clean.match(/([+-]?\\d+)\\s*敏捷/))) tot.dex += Number(m[1]);
        if ((m = clean.match(/([+-]?\\d+)\\s*(?:体力|活力)/))) tot.vit += Number(m[1]);
        if ((m = clean.match(/([+-]?\\d+)\\s*精力/))) tot.enr += Number(m[1]);
        if ((m = clean.match(/([+-]?\\d+)\\s*(?:所有属性|全属性)/))) {
          const v = Number(m[1]);
          tot.str += v; tot.dex += v; tot.vit += v; tot.enr += v;
        }
        // Flat Life & Mana & % Life/Mana
        if (!clean.includes("偷取") && !clean.includes("恢复") && !clean.includes("上限") && !clean.includes("消灭") && !clean.includes("转化")) {
          if ((m = clean.match(/([+-]\\d+)\\s*生命(?!上限|偷取|恢复)/))) tot.flatHp += Number(m[1]);
          if ((m = clean.match(/([+-]\\d+)\\s*法力(?!上限|偷取|恢复)/))) tot.flatMana += Number(m[1]);
        }
        if ((m = clean.match(/生命上限提高\\s*(\\d+)%|\\+(\\d+)%\\s*生命上限/))) tot.hpPct += Number(m[1] || m[2]);
        if ((m = clean.match(/法力上限提高\\s*(\\d+)%|\\+(\\d+)%\\s*法力上限/))) tot.manaPct += Number(m[1] || m[2]);

        // Attack Rating (Flat AR & % AR) & ITD & -Target Def
        if (!clean.includes("对恶魔") && !clean.includes("对不死")) {
          if ((m = clean.match(/\\+(\\d+)\\s*(?:命中值|攻击准确率|命中率|命中(?!加成)|AR)(?!%)/i))) tot.flatAr += Number(m[1]);
          if ((m = clean.match(/(\\d+)%\\s*(?:加成命中率|命中率加成|命中加成|额外攻击准确率|攻击准确率加成|命中(?!率)|AR)/i))) tot.arPct += Number(m[1]);
        }
        if (/无视目标防御|ITD/i.test(clean)) tot.itd = true;
        if ((m = clean.match(/-(\\d+)%\\s*目标防御/))) tot.targetDefPct += Number(m[1]);

        // Weapon/Off-Weapon ED%, Flat Damage, Min/Max Damage & Flat Elemental Attack Damage
        if (!clean.includes("对恶魔") && !clean.includes("对不死")) {
          if ((m = clean.match(/\\+(\\d+)%\\s*(?:强化伤害|增强伤害|ED)(?!%)/i))) {
            const ed = Number(m[1]);
            if (isWeapon) {
              if (itemAcc) itemAcc.weapEd += ed;
            } else {
              tot.offWeaponEdPct += ed;
            }
          }
        }
        if ((m = clean.match(/^伤害\\s*\\+(\\d+)/))) {
          tot.flatDmg += Number(m[1]);
        } else if (!/火焰|冰冷|闪电|毒素|魔法|对恶魔|对不死|技能/.test(clean) && (m = clean.match(/\\+(\\d+)\\s*[–-]\\s*(\\d+)\\s*伤害(?!加深|减少|转化)/))) {
          tot.flatMinDmg += Number(m[1]);
          tot.flatMaxDmg += Number(m[2]);
        }
        if ((m = clean.match(/\\+(\\d+)\\s*最小伤害/))) tot.flatMinDmg += Number(m[1]);
        if ((m = clean.match(/\\+(\\d+)\\s*最大伤害/))) tot.flatMaxDmg += Number(m[1]);
        if (tot.flatEleMin && (m = clean.match(/\\+(\\d+)\\s*[–-]\\s*(\\d+)\\s*(火焰|冰冷|闪电|毒素|魔法)伤害/))) {
          const ek = m[3] === "火焰" ? "fire" : m[3] === "冰冷" ? "cold" : m[3] === "闪电" ? "ltng" : m[3] === "毒素" ? "pois" : "mag";
          tot.flatEleMin[ek] = (tot.flatEleMin[ek] || 0) + Number(m[1]);
          tot.flatEleMax[ek] = (tot.flatEleMax[ek] || 0) + Number(m[2]);
        } else if (tot.flatEleMin && (m = clean.match(/\\+(\\d+)\\s*(火焰|冰冷|闪电|毒素|魔法)伤害/))) {
          const ek = m[2] === "火焰" ? "fire" : m[2] === "冰冷" ? "cold" : m[2] === "闪电" ? "ltng" : m[2] === "毒素" ? "pois" : "mag";
          const ev = Number(m[1]);
          tot.flatEleMin[ek] = (tot.flatEleMin[ek] || 0) + ev;
          tot.flatEleMax[ek] = (tot.flatEleMax[ek] || 0) + ev;
        }

        // Armor Defense ED% & Flat Defense
        if ((m = clean.match(/\\+(\\d+)%\\s*强化防御/))) {
          if (itemAcc) itemAcc.defEd += Number(m[1]);
        } else if (!clean.includes("远程") && !clean.includes("目标") && (m = clean.match(/\\+(\\d+)\\s*防御(?!值?对)/))) {
          const dVal = Number(m[1]);
          tot.flatDef += dVal;
          if (itemAcc) itemAcc.flatDef += dVal;
          else if (tot.extraFlatDef !== undefined) tot.extraFlatDef += dVal;
        }

        // Resistances & Max Resistances
        if (clean.includes("上限") || clean.includes("最大")) {
          if ((m = clean.match(/\\+(\\d+)%\\s*(?:最大)?(?:所有抗性|全抗)(?:上限)?/))) {
            const mv = Number(m[1]);
            tot.maxFRes += mv; tot.maxCRes += mv; tot.maxLRes += mv; tot.maxPRes += mv;
          }
          if ((m = clean.match(/\\+(\\d+)%\\s*(?:最大)?火焰抗性/))) tot.maxFRes += Number(m[1]);
          if ((m = clean.match(/\\+(\\d+)%\\s*(?:最大)?冰冷抗性/))) tot.maxCRes += Number(m[1]);
          if ((m = clean.match(/\\+(\\d+)%\\s*(?:最大)?闪电抗性/))) tot.maxLRes += Number(m[1]);
          if ((m = clean.match(/\\+(\\d+)%\\s*(?:最大)?毒素抗性/))) tot.maxPRes += Number(m[1]);
        } else {
          if ((m = clean.match(/(?:所有抗性|全抗)\\s*([+-]?\\d+)%?|([+-]?\\d+)%?\\s*(?:所有抗性|全抗)/))) {
            const v = Number(m[1] || m[2]);
            tot.fRes += v; tot.cRes += v; tot.lRes += v; tot.pRes += v;
          }
          if ((m = clean.match(/火焰抗性\\s*([+-]?\\d+)%|([+-]?\\d+)%\\s*火(?:焰)?抗/))) {
            const v = Number(m[1] || m[2]);
            const sig = "fRes:" + v;
            if (!itemSeen || !itemSeen.has(sig)) { tot.fRes += v; if (itemSeen) itemSeen.add(sig); }
          }
          if ((m = clean.match(/冰冷抗性\\s*([+-]?\\d+)%|([+-]?\\d+)%\\s*冰(?:冷)?抗/))) {
            const v = Number(m[1] || m[2]);
            const sig = "cRes:" + v;
            if (!itemSeen || !itemSeen.has(sig)) { tot.cRes += v; if (itemSeen) itemSeen.add(sig); }
          }
          if ((m = clean.match(/闪电抗性\\s*([+-]?\\d+)%|([+-]?\\d+)%\\s*(?:闪电|电)抗/))) {
            const v = Number(m[1] || m[2]);
            const sig = "lRes:" + v;
            if (!itemSeen || !itemSeen.has(sig)) { tot.lRes += v; if (itemSeen) itemSeen.add(sig); }
          }
          if ((m = clean.match(/毒素抗性\\s*([+-]?\\d+)%|([+-]?\\d+)%\\s*毒(?:素)?抗/))) {
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
        if ((m = clean.match(/自身物理承受伤害\\s*\\+(\\d+)%/))) {
          tot.drPct -= Number(m[1]);
        }

        // Element Skill Damage & Enemy Pierce
        if ((m = clean.match(/\\+(\\d+)%\\s*(火焰|冰冷|闪电|毒素|魔法|火|冰|电|毒)(?:技能)?伤/))) {
          const v = Number(m[1]);
          const k = m[2].startsWith("火") ? "fire" : m[2].startsWith("冰") ? "cold" : m[2].startsWith("电") || m[2].startsWith("闪") ? "ltng" : m[2].startsWith("毒") ? "pois" : "mag";
          tot.eleDmg[k] = (tot.eleDmg[k] || 0) + v;
        }
        if ((m = clean.match(/-(\\d+)%\\s*敌人(火焰|冰冷|闪电|毒素|物理|魔法|火|冰|电|毒)抗/))) {
          const v = Number(m[1]);
          const k = m[2].startsWith("火") ? "fire" : m[2].startsWith("冰") ? "cold" : m[2].startsWith("电") || m[2].startsWith("闪") ? "ltng" : m[2].startsWith("毒") ? "pois" : m[2].startsWith("物") ? "phys" : "mag";
          tot.elePierce[k] = (tot.elePierce[k] || 0) + v;
          tot.pierce.push(m[2] + " -" + v + "%");
        }

        // Leech, MAEK/LAEK, CB/DS/OW, DR/PDR/MDR, CBF, MF/EG/Exp
        if ((m = clean.match(/([+-]?\\d+)%\\s*(?:更佳机会取得魔法装备|额外几率获得魔法物品|寻宝|MF)/i))) tot.mf += Number(m[1]);
        if ((m = clean.match(/([+-]?\\d+)%\\s*(?:额外金币|EG)/i))) tot.eg += Number(m[1]);
        if ((m = clean.match(/\\+(\\d+)%\\s*经验获取/))) tot.expPct += Number(m[1]);
        if ((m = clean.match(/(\\d+)%\\s*(?:几率造成)?(?:压碎性打击|压碎打击|粉碎打击|CB)/i))) tot.cb += Number(m[1]);
        if ((m = clean.match(/(\\d+)%\\s*(?:几率造成)?(?:致命一击|致命打击|双倍打击|DS)/i))) tot.ds += Number(m[1]);
        if ((m = clean.match(/(\\d+)%\\s*(?:几率造成)?(?:撕裂伤口|撕开伤口|OW)/i))) tot.ow += Number(m[1]);
        if ((m = clean.match(/(\\d+)%\\s*(?:击中偷取生命|生命偷取|LL)/i))) tot.ll += Number(m[1]);
        if ((m = clean.match(/(\\d+)%\\s*(?:击中偷取法力|法力偷取|ML)/i))) tot.ml += Number(m[1]);
        if ((m = clean.match(/\\+(\\d+)\\s*(?:每杀一个敌人恢复法力|每次消灭恢复法力|MAEK)/i))) tot.maek += Number(m[1]);
        if ((m = clean.match(/\\+(\\d+)\\s*(?:每杀一个敌人恢复生命|每次消灭恢复生命|LAEK)/i))) tot.laek += Number(m[1]);
        if ((m = clean.match(/(?:物理伤害减[少免]|伤害减少)\\s*(\\d+)%|(\\d+)%\\s*物理伤害减[少免]/))) tot.drPct += Number(m[1] || m[2]);
        else if ((m = clean.match(/(?:物理伤害减[少免]|伤害减少)\\s*(\\d+)(?!%)/))) tot.pdr += Number(m[1]);
        if ((m = clean.match(/(?:法术伤害减少|魔法伤害减[少免])\\s*(\\d+)(?!%)/))) tot.mdr += Number(m[1]);
        if (/无法冰冻|CBF/i.test(clean)) tot.cbf = true;

        if ((m = clean.match(/(?:装备后?赋予|赋予)\\s*(\\d+)\\s*级\\s*([^\\s（(·]+?)(?:灵气)?(?:\\s|$|（|\\()/))) {
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
            const pm = String(pb).match(/(\\d+)\\s*件/);
            const reqCount = pm ? Number(pm[1]) : 2;
            if (count >= reqCount) {
              const body = String(pb).replace(/^[^:：]*[:：]\\s*/, "");
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
                const pm = String(pb).match(/(\\d+)\\s*件/);
                const reqCount = pm ? Number(pm[1]) : 2;
                if (count >= reqCount) {
                  const body = String(pb).replace(/^[^:：]*[:：]\\s*/, "");
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
              '<img class="pd-tt-ico" src="' + escapeHtml(def.icon) + '" alt="" />' +
              '<div><div class="pd-tt-title" style="color:' + tCol + '">' + escapeHtml(def.nameZh) + '</div>' +
              '<div class="pd-tt-sub">' + escapeHtml(def.nameEn) + ' · 占格 ' + def.w + '×' + def.h + escapeHtml(tabNote) + '</div></div>' +
            '</div>' +
            statsHtml +
            '<div class="pd-tt-foot">点击可在右侧微调变量 / 自选词缀 / 复制或移出</div>'
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

      const statsHtml = info.rolledLines.length
        ? '<ul class="pd-tt-stats">' + info.rolledLines.map(l => '<li>' + escapeHtml(l) + '</li>').join("") + '</ul>'
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
            const pm = String(pb).match(/(\\d+)\\s*件/);
            const req = pm ? Number(pm[1]) : 2;
            const active = cnt >= req;
            setLines.push('<div style="color:' + (active ? '#67e87a' : '#6f7c91') + '">' + (active ? '✓ ' : '○ ') + escapeHtml(pb) + '</div>');
          });
        }
        setLines.push('<div style="margin-top:4px;font-weight:700;color:#ffe08c">' + escapeHtml(info.setObj.nameZh) + '（已穿戴 ' + cnt + '/' + info.setObj.pieces + ' 件）</div>');
        if (info.setObj.detail && Array.isArray(info.setObj.detail.partialBonuses)) {
          info.setObj.detail.partialBonuses.forEach(pb => {
            const req = (pb && typeof pb === "object") ? (Number(pb.count) || 2) : ((String(pb).match(/(\\d+)\\s*件/) || [])[1] || 2);
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

        return '<div class="' + classes.join(" ") + '" data-pd-target="' + target + '" data-pd-slot="' + s.id + '" style="' + areaStyle + 'background-image:url(' + s.bg + ')">' +
          '<div class="pd-slot-label"><span>' + escapeHtml(s.label) + '</span>' + sockBadge + '</div>' +
          (info && info.icon ? '<img class="pd-slot-img" src="' + escapeHtml(info.icon) + '" alt="" />' : '<div style="height:34px"></div>') +
          '<div class="pd-slot-name">' + escapeHtml(isLocked ? "副手已锁定" : (info ? ((eq.eth ? "[无形] " : "") + info.titleZh) : "点击配装")) + '</div>' +
        '</div>';
      }).join("");

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

    function renderInventoryBag() {
      const grid = document.getElementById("pd-inv-grid");
      const usageEl = document.getElementById("pd-bag-usage");
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
        html += '<div class="' + cls.join(" ") + '" data-bag-uid="' + escapeHtml(p.item.uid) + '" style="grid-column:' + (p.x + 1) + ' / span ' + p.w + ';grid-row:' + (p.y + 1) + ' / span ' + p.h + '">' +
          '<img src="' + escapeHtml(p.def.icon) + '" alt="" />' +
          '<span class="pd-inv-item-tag">' + escapeHtml(tag) + '</span>' +
        '</div>';
      }
      grid.innerHTML = html;

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
              '<img src="' + escapeHtml(def.icon) + '" alt="" style="width:30px;height:30px;object-fit:contain">' +
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
      const allLines = info.rolledLines.concat(info.sockLines);
      const bodyHtml = allLines.length
        ? renderStatList(allLines.join(" · "), "#9ad8ff", false)
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
          const displayLine = v.rawLine.replace(/([+-]?)\\d+(?:\\.\\d+)?\\s*[–-]\\s*\\d+(?:\\.\\d+)?/, "$1" + curVal);
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
          if (lblEl) lblEl.textContent = v.rawLine.replace(/([+-]?)\\d+(?:\\.\\d+)?\\s*[–-]\\s*\\d+(?:\\.\\d+)?/, "$1" + clamped);
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
        const tokens = q.toLowerCase().split(/\\s+/).filter(Boolean);
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

      const allLegalBases = Object.values(pdData.baseRules || {}).filter(b =>
        isBaseRuleLegalForTargetSlot(pdActiveTarget, pdActiveSlot, b)
      );
      const legalSocketBases = allLegalBases.filter(b => b.maxSockets > 0);
      const matchTokens = (text, q) => {
        const hay = String(text || "").toLowerCase();
        return String(q || "").toLowerCase().split(/\\s+/).filter(Boolean).every(t => hay.includes(t));
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
            return {
              value: b.code,
              title: b.nameZh,
              displayLabel: b.nameZh + " (" + b.maxSockets + "孔 · 需力" + b.reqStr + blkInfo + ")",
              sub: b.nameEn + " · 最多 " + b.maxSockets + "孔 · 需力 " + b.reqStr + blkInfo + (b.type === "ashd" ? " · 圣骑士专属" : ""),
              tag: b.maxSockets + "孔",
              searchText: getBaseSearchText(b) + " " + b.maxSockets + "孔 " + b.reqStr + (b.type === "ashd" ? " 圣骑士盾" : "")
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
            comboItems = allLegalBases.map(b => ({
              value: b.code,
              cat: pdActiveCat,
              title: b.nameZh,
              displayLabel: b.nameZh + " (" + b.nameEn + (b.maxSockets > 0 ? (" · 最多" + b.maxSockets + "孔") : "") + ")",
              sub: b.nameEn + (b.maxSockets > 0 ? (" · 最多 " + b.maxSockets + "孔") : "") + " · 需力 " + b.reqStr,
              tag: b.maxSockets > 0 ? (b.maxSockets + "孔") : "",
              searchText: getBaseSearchText(b) + " " + b.reqStr
            }));
            if (curEq && curEq.cat === pdActiveCat) {
              selectedVal = curEq.baseCode || curEq.id;
              const hit = comboItems.find(x => x.value === selectedVal);
              selectedLabel = hit ? hit.displayLabel : "";
            }
            comboPlaceholder = "输入搜" + qLabel + "底材，或点击下拉选择 (" + comboItems.length + " 种)...";
          }
        } else if (pdActiveCat === "base") {
          comboItems = legalSocketBases.map(b => ({
            value: b.code,
            cat: "base",
            title: b.nameZh,
            displayLabel: b.nameZh + " (" + b.nameEn + " · 最大 " + b.maxSockets + "孔)",
            sub: b.nameEn + " · 最大 " + b.maxSockets + "孔 · 需力 " + b.reqStr,
            tag: b.maxSockets + "孔",
            searchText: getBaseSearchText(b) + " " + b.maxSockets + "孔 " + b.reqStr
          }));
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

    function computeCharPassiveSheetBonuses(clsObj, build, charTot, allSkillBonus, maxMode, loadout) {
      const out = { allRes: 0, maxFRes: 0, maxCRes: 0, maxLRes: 0, defPct: 0, frw: 0, blockPct: 0, weaponBlock: 0, smiteMin: 0, smiteMax: 0, notes: [] };
      if (!clsObj) return out;
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
          const hs = getInfo("Holy Shield", 0);
          if (hs.lvl > 0) {
            out.blockPct = evalDiminishing(hs.lvl, 10, 40);
            const hsDef = 25 + (hs.lvl - 1) * 15;
            out.defPct += hsDef;
            const hsSk = clsObj.skills.find(s => s.key === "Holy Shield");
            if (hsSk && hsSk.dmg) {
              out.smiteMin = computeScaledValue(hsSk.dmg.min, hsSk.dmg.hitShift || 8, hs.lvl);
              out.smiteMax = computeScaledValue(hsSk.dmg.max, hsSk.dmg.hitShift || 8, hs.lvl);
            }
            out.notes.push("圣盾术 Lv." + hs.lvl + "（格挡 +" + out.blockPct + "% · 防御 +" + hsDef + "%" + (out.smiteMax > 0 ? (" · 盾击 +" + out.smiteMin + "–" + out.smiteMax) : "") + "）");
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
        teamBuffs.hpPct += 65;
        teamBuffs.manaPct += 65;
        teamAuras.push({ tag: "战斗体制 + 战斗命令 (CTA)", detail: "全队 +1 所有技能 · +65% 生命/法力上限", color: "#ffd573" });
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
      const totalAllPlusClass = charTot.skills + (charTot.classSkills || 0) + ctaSkillBonus;
      const passiveSheet = computeCharPassiveSheetBonuses(clsObj, getClassBuild(skActiveClassId), charTot, totalAllPlusClass, maxMode, pdCharLoadout);
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
      const fbrInfo = bp.fbr && bp.fbr[0] ? evalBp(bp.fbr[0].frames, charTot.fbr) : { curFrame: "-", nextNeed: null };
      const charGearEias = Math.floor((120 * charTot.ias) / (120 + charTot.ias));
      const charEias = Math.min(75, Math.max(-75, charGearEias + teamBuffs.fanaEias + (teamBuffs.hexEias || 0) - charTot.mainWsm));
      const charAtkFrame = Math.max(7, Math.ceil((256 * (bp.iasBaseFrames || 15)) / Math.floor((256 * (100 + charEias)) / 100)) - 1);

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
        syncBtn.textContent = "同步技能至技能树 (全+" + totalAllPlusClass + (extraSkillParts.length ? (" · " + extraSkillParts.join("/")) : "") + ")";
      }

      // Render Selected Skill Attack Power Card
      const combat = computeSelectedSkillCombat({
        clsObj, charTot, charLvl, totalStr, totalDex, ctaSkillBonus, teamBuffs,
        charFcrFrame: fcrInfo.curFrame, charAtkFrame, maxMode
      });
      const atkResultEl = document.getElementById("pd-skill-atk-result");
      if (atkResultEl) {
        const typeColors = { phys: "#f5cf7b", fire: "#ff7a59", cold: "#64b5f6", ltng: "#ffe066", pois: "#67e87a", mag: "#c792ea" };
        const typeNames = { phys: "物理", fire: "火焰", cold: "冰冷", ltng: "闪电", pois: "毒素", mag: "魔法" };
        const tc = typeColors[combat.dmgType] || "#ffd573";
        const tn = typeNames[combat.dmgType] || "伤害";
        atkResultEl.innerHTML =
          '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px">' +
            '<div class="pd-sheet-card" style="border-color:rgba(255,138,117,0.35)">' +
              '<div style="font-size:10.5px;color:var(--muted)">选定技能有效等级</div>' +
              '<div style="font-size:15px;font-weight:900;color:#ffe08c">Lv.' + combat.effLvl + '</div>' +
              '<div style="font-size:10.5px;color:var(--muted)">耗蓝 ' + combat.manaCost + (combat.tabBonus ? (' · 含分系/单技+' + combat.tabBonus) : '') + '</div>' +
            '</div>' +
            '<div class="pd-sheet-card" style="border-color:rgba(245,207,123,0.4)">' +
              '<div style="font-size:10.5px;color:var(--muted)">' + (combat.lcsMax > 0 ? ('游戏 C 键面板攻击力 (' + tn + ')') : ('面板技能攻击力 (' + tn + ')')) + '</div>' +
              '<div style="font-size:15px;font-weight:900;color:' + tc + '">' + (combat.lcsMax > 0 ? (combat.lcsMin.toLocaleString() + ' – ' + combat.lcsMax.toLocaleString()) : (combat.dmgMax > 0 ? (combat.dmgMin.toLocaleString() + ' – ' + combat.dmgMax.toLocaleString()) : '辅助技能')) + '</div>' +
              (combat.lcsMax > 0 ? ('<div style="font-size:10.5px;color:#8af49f">实战真实单次 ≈ ' + combat.dmgMin.toLocaleString() + ' – ' + combat.dmgMax.toLocaleString() + '</div>') : '') +
              '<div style="font-size:10.5px;color:var(--muted)">' + (combat.dps > 0 ? ('理论 DPS ≈ ' + combat.dps.toLocaleString() + '/秒' + (combat.lcsMax > 0 ? ' (按真实伤)' : '')) : '无直接单次伤害') + '</div>' +
            '</div>' +
            '<div class="pd-sheet-card" style="border-color:rgba(104,164,255,0.4)">' +
              '<div style="font-size:10.5px;color:var(--muted)">攻击准确率 AR (对 Lv.85)</div>' +
              '<div style="font-size:15px;font-weight:900;color:#9ad8ff">' + combat.skillAr.toLocaleString() + '</div>' +
              '<div style="font-size:10.5px;color:#8af49f">实战命中率 ' + combat.hitPct + '%</div>' +
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

      const kv = (k, v) => '<div class="pd-sheet-kv"><span class="pd-sheet-k">' + k + '</span><span class="pd-sheet-v">' + v + '</span></div>';
      const charStatsEl = document.getElementById("pd-char-stats");
      if (charStatsEl) {
        const bagLayout = layoutInventoryBag(pdCharBag);
        const gearWarn = (totalStr < charTot.maxReqStr || totalDex < charTot.maxReqDex)
          ? '<span style="color:#ff8a75">⚠️ 力/敏未达穿戴需求</span>'
          : '<span style="color:#67e87a">✓ 穿戴需求达标</span>';
        charStatsEl.innerHTML =
          '<div class="pd-sheet-grid">' +
            '<div class="pd-sheet-card">' +
              '<div class="pd-sheet-title">四维汇总与技能加成 (剩余 ' + allocState.rem + ' 点)</div>' +
              kv("装备穿戴校验", gearWarn) +
              kv("全技能 / 职业技能", '<span style="color:#ffd573">+' + totalAllPlusClass + '</span> <span style="color:var(--muted);font-size:10.5px">(全+' + (charTot.skills + ctaSkillBonus) + ' · 职业+' + (charTot.classSkills || 0) + ')</span>') +
              kv("分系 / 单技能加成", extraSkillParts.length ? ('<span style="color:#9ad8ff">' + extraSkillParts.join(" · ") + '</span>') : "无") +
              kv("体力 / 精力总值", totalVit + ' / ' + totalEnr) +
              (passiveSheet.notes.length ? kv("职业被动联动", '<span style="color:#8af49f;font-size:11px">' + escapeHtml(passiveSheet.notes.join(" · ")) + '</span>') : '') +
            '</div>' +
            '<div class="pd-sheet-card">' +
              '<div class="pd-sheet-title">生存、防御与格挡</div>' +
              kv("总生命值 Life", '<span style="color:#ff8a75">' + charTotalHp.toLocaleString() + '</span>') +
              kv("总法力值 Mana", '<span style="color:#78b7ff">' + charTotalMana.toLocaleString() + '</span>') +
              kv("总防御值 Defense", charTotalDef.toLocaleString() + (teamBuffs.defPct ? (' <span style="color:#8af49f">(+' + teamBuffs.defPct + '%)</span>') : '')) +
              kv("实际格挡率 Block", (charTot.shieldBlock > 0 ? (charBlockChance + '% (FBR ' + charTot.fbr + '% → ' + fbrInfo.curFrame + '帧)') : (passiveSheet.weaponBlock > 0 ? ('<span style="color:#8af49f">' + passiveSheet.weaponBlock + '% (双爪武器格挡)</span>') : '未持盾 (0%)'))) +
              kv("无法冰冻 CBF", charTot.cbf ? '<span style="color:#67e87a">✓ 已具备</span>' : '<span style="color:#ff9b8f">✗ 未具备</span>') +
            '</div>' +
            '<div class="pd-sheet-card">' +
              '<div class="pd-sheet-title">攻击、准确 AR 与速度档位</div>' +
              kv("准确值 Attack Rating", '<span style="color:#9ad8ff">' + combat.normalAr.toLocaleString() + '</span> <span style="color:var(--muted);font-size:10.5px">(命中 ' + combat.normalHitPct + '%)</span>') +
              kv("普攻面板伤害", combat.normalMin.toLocaleString() + ' – ' + combat.normalMax.toLocaleString()) +
              kv("快速施法 FCR", charTot.fcr + '% → <strong>' + fcrInfo.curFrame + ' 帧</strong>' + (fcrInfo.nextNeed ? (' <span style="color:var(--muted);font-size:10px">(距' + fcrInfo.nextNeed.frame + '帧差' + fcrInfo.nextNeed.need + ')</span>') : ' <span style="color:#67e87a">(满档)</span>')) +
              kv("打击恢复 FHR", charTot.fhr + '% → <strong>' + fhrInfo.curFrame + ' 帧</strong>' + (fhrInfo.nextNeed ? (' <span style="color:var(--muted);font-size:10px">(差' + fhrInfo.nextNeed.need + ')</span>') : '')) +
              kv("攻速 IAS / 高跑 FRW", charTot.ias + '%' + (teamBuffs.hexEias ? (' (+邪咒 ' + teamBuffs.hexEias + '% EIAS)') : '') + ' → ' + charAtkFrame + ' 帧 · 高跑 +' + (charTot.frw + passiveSheet.frw + (teamBuffs.frw || 0)) + '%' + ((passiveSheet.frw || teamBuffs.frw) ? (' (' + [passiveSheet.frw ? '含加速' : '', teamBuffs.frw ? ('含活力+' + teamBuffs.frw + '%') : ''].filter(Boolean).join('·') + ')') : '')) +
            '</div>' +
            '<div class="pd-sheet-card">' +
              '<div class="pd-sheet-title">地狱四抗 (含安亚+30) 与减伤</div>' +
              kv("火焰抗性 Fire", fmtRes(rawFRes, maxF)) +
              kv("冰冷抗性 Cold", fmtRes(rawCRes, maxC)) +
              kv("闪电抗性 Ltng", fmtRes(rawLRes, maxL)) +
              kv("毒素抗性 Pois", fmtRes(rawPRes, maxP)) +
              kv("物理减伤 / PDR / MDR", 'DR ' + effDr + '% (上限50%) · PDR ' + charTot.pdr + ' · MDR ' + charTot.mdr) +
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
              kv("寻宝率 MF", '<span style="color:#ffd573">+' + charTot.mf + '%</span>') +
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
      renderPaperdollSlotGrid("pd-char-grid", "char", PD_CHAR_SLOTS, pdCharLoadout);
      renderPaperdollSlotGrid("pd-merc-grid", "merc", PD_MERC_SLOTS, pdMercLoadout);
      renderInventoryBag();
      renderSlotEditor();
      renderPaperdollLiveStats();
    }

    async function initMercenarySimulator() {
      let pdJustLoaded = false;
      if (!pdData) {
        try {
          const res = await fetch("/api/paperdoll", { cache: "no-store" });
          const d = await res.json();
          if (d && d.ok) {
            pdData = d;
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

        ["merc-lvl-input", "pd-merc-aura-on", "pd-char-lvl", "pd-char-aura", "pd-warlock-demon-aura", "pd-warlock-demon-mlvl", "pd-warlock-hex-buff", "pd-enemy-debuff", "pd-cta-bo", "pd-skill-max-mode"].forEach(id => {
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

        const unequipBtn = document.getElementById("pd-unequip-btn");
        if (unequipBtn) {
          unequipBtn.addEventListener("click", () => {
            if (pdActiveTarget === "bag") {
              pdCharBag = pdCharBag.filter(x => x.uid !== pdActiveBagUid);
              pdActiveBagUid = pdCharBag[0] ? pdCharBag[0].uid : null;
              if (!pdActiveBagUid) pdActiveTarget = "char";
              renderPaperdollAll();
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

        const syncSkillsBtn = document.getElementById("pd-sync-skills-btn");
        if (syncSkillsBtn) {
          syncSkillsBtn.addEventListener("click", () => {
            skBonusAll = Math.min(35, Math.max(0, pdLastSyncPayload.all || 0));
            skBonusByTab = Object.assign({ 1: 0, 2: 0, 3: 0 }, pdLastSyncPayload.byTab || {});
            skBonusBySkill = Object.assign({}, pdLastSyncPayload.bySkill || {});
            skBonusFire = pdLastSyncPayload.fire || 0;
            skBonusClassId = skActiveClassId;
            const bonusInp = document.getElementById("sk-bonus-all");
            if (bonusInp) bonusInp.value = String(skBonusAll);
            renderSkillsTrees();
            renderSkillInspector();
            const orig = syncSkillsBtn.textContent;
            syncSkillsBtn.textContent = "✓ 已同步全/分系/单技能至技能树";
            setTimeout(() => { syncSkillsBtn.textContent = orig; }, 1800);
          });
        }

        const saveBuildBtn = document.getElementById("pd-save-build-btn");
        if (saveBuildBtn) {
          saveBuildBtn.addEventListener("click", () => {
            pdStateLoadedForClass = skActiveClassId;
            savePaperdollState(skActiveClassId);
            const orig = saveBuildBtn.textContent;
            saveBuildBtn.textContent = "✓ 配装已保存至本地";
            setTimeout(() => { saveBuildBtn.textContent = orig; }, 1800);
          });
        }

        const resetClassSetBtn = document.getElementById("pd-reset-class-set-btn");
        if (resetClassSetBtn) {
          resetClassSetBtn.addEventListener("click", () => {
            pdCharLoadout = getDefaultClassSetLoadout(skActiveClassId);
            pdActiveTarget = "char";
            pdActiveSlot = pdCharLoadout.weapon ? "weapon" : "head";
            pdStateLoadedForClass = skActiveClassId;
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
          document.getElementById("it-set-modal"),
          document.getElementById("pd-hover-tooltip")
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
