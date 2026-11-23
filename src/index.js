import { renderDashboard } from "./dashboard.js";
import {
  checkForUpdates,
  getStoredState,
  getTrackerSettings,
  isPullDue,
  setPullInterval,
  syncTerrorZone
} from "./tracker.js";
import { fetchTerrorZone, isTerrorZonePullDue } from "./terror-zone.js";
import { getAllTerrorZones } from "./terror-zone-metadata.js";
import { getRunewordsCatalog } from "./runewords-metadata.js";
import { getAffixesCatalog } from "./affixes-metadata.js";
import { getItemsCatalog } from "./items-metadata.js";
import { getSkillsCatalog } from "./skills-catalog.js";
import { getDropCalculatorData } from "./drop-calculator.js";
import { getPaperdollCatalog } from "./paperdoll-data.js";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function html(content) {
  return new Response(content, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store, no-cache, must-revalidate",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer"
    }
  });
}

async function run(env, options = {}) {
  try {
    return await checkForUpdates(env, fetch, options);
  } catch (error) {
    console.error("检查 Diablo Clone 状态失败", error);
    throw error;
  }
}

function isAuthorized(request, env) {
  return Boolean(env.MANUAL_TRIGGER_TOKEN) &&
    request.headers.get("authorization") ===
      `Bearer ${env.MANUAL_TRIGGER_TOKEN}`;
}

async function runScheduled(env) {
  const [state, settings] = await Promise.all([
    getStoredState(env),
    getTrackerSettings(env)
  ]);

  const cloneDue = isPullDue(settings.pullIntervalMinutes);
  const terrorZoneDue = isTerrorZonePullDue(state?.terrorZone);
  const result = {
    cloneSkipped: !cloneDue,
    terrorZoneSkipped: !terrorZoneDue,
    pullIntervalMinutes: settings.pullIntervalMinutes
  };

  let terrorZone;
  if (terrorZoneDue) {
    try {
      terrorZone = await fetchTerrorZone(env);
    } catch (error) {
      console.error("同步恐怖区域失败", error);
      result.terrorZoneError = error.message;
    }
  }

  if (cloneDue) {
    result.clone = await run(env, { terrorZone });
  }

  if (!cloneDue && terrorZone) {
    try {
      result.terrorZone = await syncTerrorZone(env, fetch, terrorZone);
    } catch (error) {
      console.error("同步恐怖区域失败", error);
      result.terrorZoneError = error.message;
    }
  } else if (terrorZone) {
    result.terrorZone = terrorZone;
  }

  return result;
}

export default {
  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(runScheduled(env));
  },

  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return html(renderDashboard());
    }

    if (request.method === "GET" && url.pathname === "/api/terror-zones") {
      return json({ ok: true, terrorZones: getAllTerrorZones() });
    }

    if (request.method === "GET" && url.pathname === "/api/runewords") {
      return json({ ok: true, ...getRunewordsCatalog() });
    }

    if (request.method === "GET" && url.pathname === "/api/affixes") {
      return json({ ok: true, ...getAffixesCatalog() });
    }

    if (request.method === "GET" && url.pathname === "/api/items") {
      return json({ ok: true, ...getItemsCatalog() });
    }

    if (request.method === "GET" && url.pathname === "/api/skills") {
      return json({ ok: true, ...getSkillsCatalog() });
    }

    if (request.method === "GET" && url.pathname === "/api/drops") {
      return json({ ok: true, ...getDropCalculatorData() });
    }

    if (request.method === "GET" && url.pathname === "/api/paperdoll") {
      return json({ ok: true, ...getPaperdollCatalog() });
    }

    if (request.method === "GET" && url.pathname === "/api/status") {
      const state = await getStoredState(env);
      if (!state) {
        return json(
          { ok: false, error: "尚无状态数据，请等待首次定时任务执行" },
          503
        );
      }
      return json(state);
    }

    if (request.method === "GET" && url.pathname === "/api/settings") {
      return json(await getTrackerSettings(env));
    }

    if (request.method === "POST" && url.pathname === "/api/settings") {
      if (!env.MANUAL_TRIGGER_TOKEN) {
        return json({ ok: false, error: "未配置管理令牌" }, 503);
      }
      if (!isAuthorized(request, env)) {
        return json({ ok: false, error: "未授权" }, 401);
      }

      try {
        const body = await request.json();
        return json({
          ok: true,
          ...(await setPullInterval(env, body.pullIntervalMinutes))
        });
      } catch (error) {
        return json({ ok: false, error: error.message }, 400);
      }
    }

    if (request.method === "POST" && url.pathname === "/run") {
      if (!env.MANUAL_TRIGGER_TOKEN) {
        return json({ ok: false, error: "未配置手动触发令牌" }, 503);
      }

      if (!isAuthorized(request, env)) {
        return json({ ok: false, error: "未授权" }, 401);
      }

      try {
        let terrorZone = null;
        try {
          terrorZone = await fetchTerrorZone(env);
        } catch (error) {
          console.error("手动同步恐怖区域失败", error);
        }
        const clone = await run(env, { terrorZone });
        return json({ ok: true, ...clone, terrorZone });
      } catch (error) {
        return json({ ok: false, error: error.message }, 502);
      }
    }

    return json({ ok: false, error: "未找到" }, 404);
  }
};
