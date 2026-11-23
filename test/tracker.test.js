import assert from "node:assert/strict";
import test from "node:test";

import {
  buildFeishuMessage,
  checkForUpdates,
  findChanges,
  formatServerName,
  getStoredState,
  getTrackerSettings,
  isPullDue,
  normalizeServers,
  setPullInterval,
  validateServerCombinations
} from "../src/tracker.js";
import { renderDashboard } from "../src/dashboard.js";

const server = {
  server: "ladderSoftcoreAsiaRotw",
  progress: 4,
  message: "Terror spreads across Sanctuary",
  ladder: true,
  hardcore: false,
  rotw: true,
  region: "AsiaRotw",
  lastUpdate: { seconds: 1781179410 },
  lastWalk: { seconds: 1780922270 }
};

test("规范化 API 数据", () => {
  const [result] = normalizeServers({ servers: [server] });
  assert.equal(result.lastUpdate, 1781179410);
  assert.equal(result.lastWalk, 1780922270);
  assert.equal(result.rotw, true);
});

test("忽略只有 lastUpdate 变化的记录", () => {
  const [before] = normalizeServers({ servers: [server] });
  const after = { ...before, lastUpdate: before.lastUpdate + 300 };
  assert.deepEqual(findChanges([before], [after]), []);
});

test("发现进度和触发时间变化", () => {
  const [before] = normalizeServers({ servers: [server] });
  const after = { ...before, progress: 5, lastWalk: before.lastWalk + 100 };
  const changes = findChanges([before], [after]);
  assert.equal(changes.length, 1);
  assert.equal(changes[0].before.progress, 4);
  assert.equal(changes[0].after.progress, 5);
});

test("生成中文服务器名和飞书卡片", () => {
  const [after] = normalizeServers({ servers: [server] });
  assert.equal(formatServerName(after), "亚洲｜术士君临｜天梯｜SC");

  const message = buildFeishuMessage([
    { type: "added", before: null, after }
  ]);
  const content = message.card.elements[0].content;
  assert.match(content, /术士君临/);
  assert.match(content, /4\/6 恐怖蔓延至庇护之地/);
});

test("验证接口包含全部 24 种组合", () => {
  const servers = [];
  for (const rotw of [false, true]) {
    for (const ladder of [false, true]) {
      for (const hardcore of [false, true]) {
        for (const region of ["Asia", "Americas", "Europe"]) {
          servers.push({
            server: `${ladder ? "ladder" : "nonLadder"}${hardcore ? "Hardcore" : "Softcore"}${region}${rotw ? "Rotw" : ""}`,
            progress: 1,
            message: "",
            ladder,
            hardcore,
            rotw,
            region: `${region}${rotw ? "Rotw" : ""}`,
            lastUpdate: 1,
            lastWalk: 0
          });
        }
      }
    }
  }

  assert.doesNotThrow(() => validateServerCombinations(servers));
  assert.throws(
    () => validateServerCombinations(servers.slice(1)),
    /服务器组合不完整/
  );
});

test("毁灭之王 HC 映射正确", () => {
  const [result] = normalizeServers({
    servers: [{
      ...server,
      server: "nonLadderHardcoreEurope",
      ladder: false,
      hardcore: true,
      rotw: false,
      region: "Europe"
    }]
  });

  assert.equal(formatServerName(result), "欧洲｜毁灭之王｜非天梯｜HC");
});

test("仪表盘包含完整分组和筛选入口", () => {
  const html = renderDashboard();
  assert.match(html, /暗黑 2 重置版 · 庇护之地实时战报/);
  assert.match(html, /Diablo II: Resurrected · Sanctuary Live/);
  assert.match(html, /实时掌握恐怖地带异动与迪亚波罗克隆入侵进度/);
  assert.match(html, /毁灭之王/);
  assert.match(html, /术士君临/);
  assert.match(html, /非天梯 SC/);
  assert.match(html, /天梯 HC/);
  assert.match(html, /4 阶以上/);
  assert.match(html, /页面数据自动刷新/);
  assert.match(html, /DC 后台接口拉取/);
  assert.match(html, /展示数据最近变更/);
  assert.match(html, /不会整页重载/);
  assert.match(html, /切换待确认时每 15 秒读取一次/);
  assert.match(html, /isAwaitingTerrorConfirmation/);
  assert.match(html, /15 \* 1000/);
  assert.match(html, /恐怖区域仍按整点、半点独立同步/);
  assert.match(html, /当前恐怖区域/);
  assert.match(html, /下一阶段恐怖区域/);
  assert.match(html, /terror-countdown/);
  assert.match(html, /区域每 30 分钟切换/);
  assert.match(html, /nextBoundary/);
  assert.match(html, /根据上一轮预测即时切换/);
  assert.match(html, /正在获取下一阶段/);
  assert.match(html, /terror-current-details/);
  assert.match(html, /常见免疫/);
  assert.match(html, /mobile-region-grid/);
  assert.ok(
    html.indexOf('renderDlc(data.servers, true, "术士君临")') <
      html.indexOf('renderDlc(data.servers, false, "毁灭之王")')
  );
  assert.match(html, /terror-module/);
  assert.match(html, /dclone-module/);
  assert.match(html, /settings-module/);
  assert.match(html, /main-nav-tabs/);
  assert.match(html, /main-tab-terror/);
  assert.match(html, /main-tab-dclone/);
  assert.match(html, /main-tab-runewords/);
  assert.match(html, /main-tab-affixes/);
  assert.match(html, /main-tab-items/);
  assert.match(html, /main-panel-terror/);
  assert.match(html, /main-panel-dclone/);
  assert.match(html, /main-panel-runewords/);
  assert.match(html, /main-panel-affixes/);
  assert.match(html, /main-panel-items/);
  assert.match(html, /物品资讯百科/);
  assert.match(html, /\/api\/items/);
  assert.match(html, /it-set-modal/);
  assert.match(html, /openSetDetail/);
  assert.match(html, /it-grail-summary/);
  assert.match(html, /圣杯总进度/);
  assert.match(html, /TC87 毕业稀有/);
  assert.match(html, /grail-export-btn/);
  assert.match(html, /grail-import-btn/);
  assert.match(html, /it-grail-filter-row/);
  assert.match(html, /main-tab-skills/);
  assert.match(html, /main-panel-skills/);
  assert.match(html, /\/api\/skills/);
  assert.match(html, /sk-trees-wrap/);
  assert.match(html, /sk-inspector/);
  assert.match(html, /\/api\/drops/);
  assert.match(html, /it-drops-console/);
  assert.match(html, /tz-jump-drops-btn/);
  assert.match(html, /sk-view-breakpoints/);
  assert.match(html, /bp-fcr-table-wrap/);
  assert.match(html, /bp-ias-table-wrap/);
  assert.match(html, /CLASS_BREAKPOINTS/);
  assert.match(html, /it-cube-sim-console/);
  assert.match(html, /cube-up-preview/);
  assert.match(html, /cube-sunder-preview/);
  assert.match(html, /sk-view-mercenary/);
  assert.match(html, /MERC_VARIANTS/);
  assert.match(html, /\/api\/paperdoll/);
  assert.match(html, /pd-char-grid/);
  assert.match(html, /pd-merc-grid/);
  assert.match(html, /pd-sockets-section/);
  assert.match(html, /pd-sliders-section/);
  assert.match(html, /pd-active-auras-list/);
  assert.match(html, /pd-sync-skills-btn/);
  assert.match(html, /renderPaperdollLiveStats/);
  assert.match(html, /pd-inv-grid/);
  assert.match(html, /pd-bag-add-select/);
  assert.match(html, /pd-bag-preset-btn/);
  assert.match(html, /pd-skill-select/);
  assert.match(html, /pd-skill-atk-result/);
  assert.match(html, /layoutInventoryBag/);
  assert.match(html, /computeSelectedSkillCombat/);
  assert.match(html, /pd-stat-alloc-box/);
  assert.match(html, /pd-warlock-demon-aura/);
  assert.match(html, /pd-warlock-demon-mlvl/);
  assert.match(html, /computeBoundDemonAura/);
  assert.match(html, /value="vigor"/);
  assert.match(html, /pd-enemy-debuff/);
  assert.match(html, /sk-synced-extra-badge/);
  assert.match(html, /data-pd-cat="craft"/);
  assert.match(html, /data-pd-cat="magic"/);
  assert.match(html, /data-pd-cat="rare"/);
  assert.match(html, /pd-item-combo/);
  assert.match(html, /pd-item-input/);
  assert.match(html, /pd-item-listbox/);
  assert.match(html, /pd-rw-base-combo/);
  assert.match(html, /pd-rw-base-input/);
  assert.match(html, /createSearchableCombo/);
  assert.match(html, /isComposing/);
  assert.match(html, /pd-craft-skill-row/);
  assert.match(html, /pd-affix-builder/);
  assert.match(html, /pd-affix-filter/);
  assert.match(html, /preserveRollsAcrossAffixEdit/);
  assert.match(html, /data-pd-roll-num/);
  assert.match(html, /renderAffixBuilder/);
  assert.match(html, /getMagicRareAffixPool/);
  assert.match(html, /renderStatAllocator/);
  assert.match(html, /getSkillTreeBonusForSkill/);
  assert.match(html, /pd-warlock-hex-buff/);
  assert.match(html, /pd-save-build-btn/);
  assert.match(html, /pd-reset-class-set-btn/);
  assert.match(html, /d2r_paperdoll_builds_v1/);
  assert.match(html, /getDefaultClassSetLoadout/);
  assert.match(html, /expandCompositeStatLines/);
  assert.match(html, /computeWeaponSkillMetaStats/);
  assert.match(html, /computePassiveMasteryBonuses/);
  assert.match(html, /computeCharPassiveSheetBonuses/);
  assert.match(html, /getPassiveHardPoints/);
  assert.match(html, /buildCraftedRawStatsText/);
  assert.match(html, /levitateReqRedPct/);
  assert.match(html, /pd-hover-tooltip/);
  assert.match(html, /buildPaperdollHoverTooltipHtml/);
  assert.match(html, /scaleFlatPhysWithEd/);
  assert.match(html, /computeEchoingStrikeDisplayScale/);
  assert.match(html, /merc\.res4\) \/ 4/);
  assert.match(html, /nonBoHp/);
  assert.match(html, /extraFlatDef/);
  assert.match(html, /enchant-23/);
  assert.match(html, /pd-merc-enabled/);
  assert.match(html, /merc-disabled/);
  assert.match(html, /pd-merc-aura-on/);
  assert.match(html, /游戏 C 键面板攻击力/);
  assert.match(html, /实战真实单次/);
  assert.match(html, /自带技能与光环/);
  const subtabsMatch = html.match(/id="sk-view-subtabs"[\s\S]*?<\/div>/);
  assert.ok(subtabsMatch, "应包含技能子标签页容器");
  assert.ok(
    subtabsMatch[0].indexOf('data-sk-view="mercenary"') < subtabsMatch[0].indexOf('data-sk-view="breakpoints"'),
    "配装标签页应排在档位速查标签页之前"
  );
  assert.match(html, /物品词缀/);
  assert.match(html, /\/api\/affixes/);
  assert.match(html, /af-list/);
  assert.match(html, /af-view-sim/);
  assert.match(html, /sim-base-select/);
  assert.match(html, /rollSimulatedItem/);

  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(scriptMatch, "仪表盘应当包含内联脚本");
  assert.doesNotThrow(() => new Function(scriptMatch[1]), "仪表盘内联脚本语法必须合法");
  assert.match(html, /符文之语 100% 记事/);
  assert.match(html, /\/api\/runewords/);
  assert.match(html, /rw-rune-grid/);
  assert.match(html, /rw-mode-chips/);
  assert.match(html, /rw-list/);
  assert.match(html, /rw-detail-modal/);
  assert.match(html, /openRunewordDetail/);
  assert.match(html, /switchMainTab/);
  assert.match(html, /initMainTabs/);
  assert.match(html, /TERROR ZONE/);
  assert.match(html, /DIABLO CLONE/);
  assert.match(html, /immunity-f/);
  assert.match(html, /rating-s/);
  assert.match(html, /tz-directory-section/);
  assert.match(html, /恐怖地带全图鉴与历史记录查询/);
  assert.match(html, /全部区域图鉴/);
  assert.match(html, /轮换历史记录/);
  assert.match(html, /tz-catalog-grid/);
  assert.match(html, /tz-history-container/);
  assert.match(html, /\/api\/terror-zones/);
  assert.match(html, /storedAutoRefresh === null/);
  assert.match(html, /updateSyncAge/);
  assert.match(html, /data-auto-minutes="5"/);
  assert.match(html, /\/api\/settings/);
  assert.match(html, /\/api\/status/);
});

test("后台拉取间隔默认 5 分钟并可写入 KV", async () => {
  const values = new Map();
  const env = {
    DCLONE_STATE: {
      async get(key, type) {
        const value = values.get(key);
        return type === "json" && value ? JSON.parse(value) : value ?? null;
      },
      async put(key, value) {
        values.set(key, value);
      }
    }
  };

  assert.deepEqual(await getTrackerSettings(env), { pullIntervalMinutes: 5 });
  assert.deepEqual(await setPullInterval(env, 2), { pullIntervalMinutes: 2 });
  assert.deepEqual(await getTrackerSettings(env), { pullIntervalMinutes: 2 });
  await assert.rejects(() => setPullInterval(env, 0), /1 至 1440/);
  await assert.rejects(() => setPullInterval(env, 1.5), /1 至 1440/);
});

test("读取旧 KV 状态时即时补充恐怖区域资料", async () => {
  const env = {
    DCLONE_STATE: {
      async get() {
        return {
          servers: [],
          terrorZone: {
            current: "Durance of Hate",
            next: "Moo Moo Farm",
            checkedAt: "2026-06-15T00:00:00.000Z"
          }
        };
      }
    }
  };

  const state = await getStoredState(env);
  assert.equal(state.terrorZone.current, "Durance of Hate");
  assert.equal(state.terrorZone.currentZh, "憎恨囚牢");
  assert.equal(state.terrorZone.next, "Moo Moo Farm");
  assert.equal(state.terrorZone.nextZh, "秘密奶牛关");
  assert.equal(state.terrorZone.nextDetails.rating, "S");
});

test("按照最后同步时间判断后台拉取是否到期", () => {
  const sameMinute = Date.parse("2026-06-13T00:10:59.000Z");
  assert.equal(isPullDue(1, sameMinute), true);
  assert.equal(isPullDue(2, sameMinute), true);
  assert.equal(
    isPullDue(2, Date.parse("2026-06-13T00:11:00.000Z")),
    false
  );
  assert.equal(
    isPullDue(5, Date.parse("2026-06-13T00:15:00.000Z")),
    true
  );
});

test("每分钟轮询但状态无变化时不重复写 KV", async () => {
  const apiServers = [];
  for (const rotw of [false, true]) {
    for (const ladder of [false, true]) {
      for (const hardcore of [false, true]) {
        for (const region of ["Asia", "Americas", "Europe"]) {
          apiServers.push({
            server: `${ladder ? "ladder" : "nonLadder"}${hardcore ? "Hardcore" : "Softcore"}${region}${rotw ? "Rotw" : ""}`,
            progress: 1,
            message: "Terror gazes upon Sanctuary",
            ladder,
            hardcore,
            rotw,
            region: `${region}${rotw ? "Rotw" : ""}`,
            lastUpdate: { seconds: 100 },
            lastWalk: { seconds: 0 }
          });
        }
      }
    }
  }

  const values = new Map();
  let putCount = 0;
  const env = {
    FEISHU_WEBHOOK: "https://example.com/webhook",
    NOTIFY_ON_FIRST_RUN: "false",
    DCLONE_STATE: {
      async get(key, type) {
        const value = values.get(key);
        return type === "json" && value ? JSON.parse(value) : value ?? null;
      },
      async put(key, value) {
        putCount += 1;
        values.set(key, value);
      }
    }
  };
  const fetchImpl = async () => new Response(
    JSON.stringify({ servers: apiServers }),
    { headers: { "content-type": "application/json" } }
  );

  const first = await checkForUpdates(env, fetchImpl);
  const second = await checkForUpdates(env, fetchImpl);

  assert.equal(first.stateWritten, true);
  assert.equal(second.stateWritten, false);
  assert.equal(putCount, 1);
});

test("DC 变化不会刷新未变化恐怖区域的确认时间", async () => {
  const apiServers = [];
  for (const rotw of [false, true]) {
    for (const ladder of [false, true]) {
      for (const hardcore of [false, true]) {
        for (const region of ["Asia", "Americas", "Europe"]) {
          apiServers.push({
            server: `${ladder ? "ladder" : "nonLadder"}${hardcore ? "Hardcore" : "Softcore"}${region}${rotw ? "Rotw" : ""}`,
            progress: 2,
            message: "Terror approaches Sanctuary",
            ladder,
            hardcore,
            rotw,
            region: `${region}${rotw ? "Rotw" : ""}`,
            lastUpdate: { seconds: 200 },
            lastWalk: { seconds: 0 }
          });
        }
      }
    }
  }

  const oldCheckedAt = "2026-08-30T15:04:32.000Z";
  let writtenState;
  const env = {
    FEISHU_WEBHOOK: "https://example.com/webhook",
    DCLONE_STATE: {
      async get(key) {
        if (key !== "diablo-clone-state-v1") return null;
        return {
          checkedAt: oldCheckedAt,
          servers: apiServers.map((item) => ({
            ...item,
            progress: 1,
            lastUpdate: 100,
            lastWalk: 0
          })),
          terrorZone: {
            schemaVersion: 2,
            current: "Far Oasis",
            currentZh: "遥远绿洲",
            previous: "Burial Grounds, Crypt, and Mausoleum",
            checkedAt: oldCheckedAt
          }
        };
      },
      async put(_key, value) {
        writtenState = JSON.parse(value);
      }
    }
  };
  const fetchImpl = async (url) => {
    if (url === env.FEISHU_WEBHOOK) {
      return new Response(JSON.stringify({ code: 0 }));
    }
    return new Response(JSON.stringify({ servers: apiServers }));
  };

  await checkForUpdates(env, fetchImpl, {
    terrorZone: {
      schemaVersion: 3,
      current: "Burial Grounds, Crypt, and Mausoleum",
      next: "Far Oasis",
      checkedAt: "2026-08-30T15:30:00.000Z"
    }
  });

  assert.equal(writtenState.terrorZone.checkedAt, oldCheckedAt);
});
