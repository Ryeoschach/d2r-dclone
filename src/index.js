import { renderDashboard } from "./dashboard.js";
import { renderAdminDashboard } from "./admin-dashboard.js";
import {
  checkForUpdates,
  getStoredState,
  getSystemConfig,
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
import { getPresetBuildsCatalog } from "./preset-builds.js";
import {
  getAuthenticatedAdmin,
  handleAuthOrUserRequest,
  resolveInitialAuthContext
} from "./auth.js";
import { handleAdminApiRequest } from "./admin-api.js";
import { handleSharedBuildRequest } from "./shared-builds.js";
import { resolveStorageEnv } from "./storage.js";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff"
    }
  });
}

function html(content) {
  return new Response(content, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "private, no-store, no-cache, must-revalidate",
      vary: "Cookie",
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
      "content-security-policy": "frame-ancestors 'none'; object-src 'none'; base-uri 'self'",
      "cross-origin-opener-policy": "same-origin-allow-popups",
      "cross-origin-resource-policy": "same-origin",
      "referrer-policy": "strict-origin-when-cross-origin"
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

async function runManualSync(env) {
  let terrorZone = null;
  try {
    terrorZone = await fetchTerrorZone(env);
  } catch (error) {
    console.error("手动同步恐怖区域失败", error);
  }
  const clone = await run(env, { terrorZone });
  return { ...clone, terrorZone };
}

export default {
  async scheduled(_controller, rawEnv, ctx) {
    const env = resolveStorageEnv(rawEnv);
    ctx.waitUntil(runScheduled(env));
  },

  async fetch(request, rawEnv) {
    const env = resolveStorageEnv(rawEnv);
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/admin/")) {
      const adminResponse = await handleAdminApiRequest(request, env, url, {
        runManualSync
      });
      if (adminResponse) return adminResponse;
    }

    if (
      url.pathname === "/api/user/shares" ||
      url.pathname === "/api/builds/share" ||
      url.pathname.startsWith("/api/builds/share/") ||
      url.pathname.startsWith("/build/")
    ) {
      const shareResponse = await handleSharedBuildRequest(request, env, url);
      if (shareResponse) return shareResponse;
    }

    if (url.pathname.startsWith("/api/auth/") || url.pathname.startsWith("/api/user/")) {
      const authResponse = await handleAuthOrUserRequest(request, env, url);
      if (authResponse) return authResponse;
    }

    if (
      request.method === "GET" &&
      (url.pathname === "/admin" ||
        url.pathname === "/admin/" ||
        url.pathname === "/admin/users" ||
        url.pathname === "/admin/users/")
    ) {
      const initialAuth = await resolveInitialAuthContext(request, env);
      const activePage = url.pathname.startsWith("/admin/users") ? "users" : "settings";
      return html(renderAdminDashboard({ initialAuth, activePage }));
    }

    if (request.method === "GET" && url.pathname === "/") {
      const initialAuth = await resolveInitialAuthContext(request, env);
      return html(renderDashboard({ initialAuth }));
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

    if (request.method === "GET" && url.pathname === "/api/presets") {
      return json({ ok: true, ...getPresetBuildsCatalog() });
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

    if (request.method === "GET" && url.pathname === "/api/system-config") {
      return json({ ok: true, ...(await getSystemConfig(env)) });
    }

    if (request.method === "GET" && url.pathname === "/api/settings") {
      return json(await getTrackerSettings(env));
    }

    if (request.method === "POST" && url.pathname === "/api/settings") {
      const adminAuth = await getAuthenticatedAdmin(request, env);
      if (!adminAuth) {
        if (!env.MANUAL_TRIGGER_TOKEN) {
          return json({ ok: false, error: "未配置管理令牌" }, 503);
        }
        if (!isAuthorized(request, env)) {
          return json({ ok: false, error: "未授权" }, 401);
        }
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
      const adminAuth = await getAuthenticatedAdmin(request, env);
      if (!adminAuth) {
        if (!env.MANUAL_TRIGGER_TOKEN) {
          return json({ ok: false, error: "未配置手动触发令牌" }, 503);
        }
        if (!isAuthorized(request, env)) {
          return json({ ok: false, error: "未授权" }, 401);
        }
      }

      try {
        const synced = await runManualSync(env);
        return json({ ok: true, ...synced });
      } catch (error) {
        return json({ ok: false, error: error.message }, 502);
      }
    }

    return json({ ok: false, error: "未找到" }, 404);
  }
};
