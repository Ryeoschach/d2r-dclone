import { fetchTerrorZone } from "./terror-zone.js";

const STATE_KEY = "diablo-clone-state-v1";
const SETTINGS_KEY = "diablo-clone-settings-v1";
const DEFAULT_PULL_INTERVAL_MINUTES = 5;
const MAX_PULL_INTERVAL_MINUTES = 1440;

const PROGRESS_LABELS = {
  1: "恐怖凝视着庇护之地",
  2: "恐怖正逼近庇护之地",
  3: "恐怖开始在庇护之地形成",
  4: "恐怖蔓延至庇护之地",
  5: "恐怖即将在庇护之地释放",
  6: "迪亚波罗已入侵庇护之地"
};

const REGION_LABELS = {
  Asia: "亚洲",
  Americas: "美洲",
  Europe: "欧洲"
};

const EXPECTED_REGIONS = ["Asia", "Americas", "Europe"];

function combinationKey(server) {
  const region = server.region.replace(/Rotw$/i, "");
  return [
    server.rotw ? "rotw" : "lod",
    server.ladder ? "ladder" : "nonLadder",
    server.hardcore ? "HC" : "SC",
    region
  ].join(":");
}

export function normalizeServers(payload) {
  if (!payload || !Array.isArray(payload.servers)) {
    throw new Error("接口返回格式不正确：缺少 servers 数组");
  }

  return payload.servers.map((item) => {
    if (!item?.server || !Number.isInteger(item.progress)) {
      throw new Error("接口返回格式不正确：服务器记录缺少必要字段");
    }

    return {
      server: item.server,
      progress: item.progress,
      message: item.message ?? "",
      ladder: Boolean(item.ladder),
      hardcore: Boolean(item.hardcore),
      rotw: Boolean(item.rotw),
      region: String(item.region ?? ""),
      lastUpdate: Number(item.lastUpdate?.seconds ?? 0),
      lastWalk: Number(item.lastWalk?.seconds ?? 0)
    };
  });
}

export function validateServerCombinations(servers) {
  const actual = new Set(servers.map(combinationKey));
  if (actual.size !== servers.length) {
    throw new Error("接口返回格式不正确：存在重复的服务器组合");
  }

  const expected = [];
  for (const rotw of [false, true]) {
    for (const ladder of [false, true]) {
      for (const hardcore of [false, true]) {
        for (const region of EXPECTED_REGIONS) {
          expected.push(
            combinationKey({ rotw, ladder, hardcore, region })
          );
        }
      }
    }
  }

  const missing = expected.filter((key) => !actual.has(key));
  const unknown = [...actual].filter((key) => !expected.includes(key));
  if (missing.length > 0 || unknown.length > 0) {
    throw new Error(
      `服务器组合不完整：缺少 ${missing.length} 项，未知 ${unknown.length} 项`
    );
  }
}

export function findChanges(previousServers, currentServers) {
  const previous = new Map(
    (previousServers ?? []).map((server) => [server.server, server])
  );

  return currentServers.flatMap((server) => {
    const old = previous.get(server.server);
    if (!old) {
      return [{ type: "added", before: null, after: server }];
    }

    if (old.progress !== server.progress || old.lastWalk !== server.lastWalk) {
      return [{ type: "changed", before: old, after: server }];
    }

    return [];
  });
}

export async function getStoredState(env) {
  if (!env.DCLONE_STATE) {
    throw new Error("缺少 DCLONE_STATE KV 绑定");
  }
  return env.DCLONE_STATE.get(STATE_KEY, "json");
}

export async function getTrackerSettings(env) {
  if (!env.DCLONE_STATE) {
    throw new Error("缺少 DCLONE_STATE KV 绑定");
  }

  const stored = await env.DCLONE_STATE.get(SETTINGS_KEY, "json");
  const pullIntervalMinutes = Number(stored?.pullIntervalMinutes);
  return {
    pullIntervalMinutes:
      Number.isInteger(pullIntervalMinutes) &&
      pullIntervalMinutes >= 1 &&
      pullIntervalMinutes <= MAX_PULL_INTERVAL_MINUTES
        ? pullIntervalMinutes
        : DEFAULT_PULL_INTERVAL_MINUTES
  };
}

export async function setPullInterval(env, value) {
  const pullIntervalMinutes = Number(value);
  if (
    !Number.isInteger(pullIntervalMinutes) ||
    pullIntervalMinutes < 1 ||
    pullIntervalMinutes > MAX_PULL_INTERVAL_MINUTES
  ) {
    throw new Error("后台拉取间隔必须是 1 至 1440 之间的整数分钟");
  }

  await env.DCLONE_STATE.put(
    SETTINGS_KEY,
    JSON.stringify({ pullIntervalMinutes })
  );
  return { pullIntervalMinutes };
}

export function isPullDue(state, pullIntervalMinutes, now = Date.now()) {
  if (!state?.checkedAt) {
    return true;
  }

  const checkedAt = Date.parse(state.checkedAt);
  if (!Number.isFinite(checkedAt)) {
    return true;
  }

  const interval = pullIntervalMinutes * 60 * 1000;
  return Math.floor(now / interval) > Math.floor(checkedAt / interval);
}

export async function syncTerrorZone(
  env,
  fetchImpl = fetch,
  fetchedTerrorZone = null
) {
  const state = await getStoredState(env);
  if (!state) {
    throw new Error("尚无 DC 状态，无法单独保存恐怖区域");
  }

  const terrorZone = fetchedTerrorZone ?? await fetchTerrorZone(env, fetchImpl);
  await env.DCLONE_STATE.put(
    STATE_KEY,
    JSON.stringify({ ...state, terrorZone })
  );
  return terrorZone;
}

export function formatServerName(server, baseVersionName = "毁灭之王") {
  const rawRegion = server.region.replace(/Rotw$/i, "");
  const region = REGION_LABELS[rawRegion] ?? rawRegion;
  const version = server.rotw ? "术士君临" : baseVersionName;
  const ladder = server.ladder ? "天梯" : "非天梯";
  const hardcore = server.hardcore ? "HC" : "SC";
  return `${region}｜${version}｜${ladder}｜${hardcore}`;
}

function formatTimestamp(seconds, timeZone) {
  if (!seconds) {
    return "暂无记录";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date(seconds * 1000));
}

function progressText(progress) {
  return `${progress}/6 ${PROGRESS_LABELS[progress] ?? "未知状态"}`;
}

export function buildFeishuMessage(changes, options = {}) {
  const baseVersionName = options.baseVersionName ?? "毁灭之王";
  const timeZone = options.timeZone ?? "Asia/Shanghai";
  const lines = changes.map(({ type, before, after }) => {
    const title = formatServerName(after, baseVersionName);
    const transition =
      type === "added"
        ? `新增：${progressText(after.progress)}`
        : `${progressText(before.progress)} → ${progressText(after.progress)}`;
    const walkChanged =
      before && before.lastWalk !== after.lastWalk
        ? `\n上次触发：${formatTimestamp(after.lastWalk, timeZone)}`
        : "";

    return `**${title}**\n${transition}${walkChanged}\n数据更新时间：${formatTimestamp(after.lastUpdate, timeZone)}`;
  });

  return {
    msg_type: "interactive",
    card: {
      config: { wide_screen_mode: true },
      header: {
        template: "orange",
        title: { tag: "plain_text", content: "暗黑破坏神 Clone 状态更新" }
      },
      elements: [
        {
          tag: "markdown",
          content: lines.join("\n\n---\n\n")
        },
        {
          tag: "note",
          elements: [
            {
              tag: "plain_text",
              content: "数据来源：d2runewizard.com，按仪表盘配置定时检查"
            }
          ]
        }
      ]
    }
  };
}

async function createFeishuSignature(secret, timestamp) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(`${timestamp}\n${secret}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new Uint8Array());
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

async function sendFeishu(webhook, secret, message, fetchImpl) {
  const payload = { ...message };
  if (secret) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    payload.timestamp = timestamp;
    payload.sign = await createFeishuSignature(secret, timestamp);
  }

  const response = await fetchImpl(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`飞书通知失败：HTTP ${response.status}`);
  }

  const result = await response.json();
  if (result.code !== 0 && result.StatusCode !== 0) {
    throw new Error(`飞书通知失败：${result.msg ?? result.StatusMessage ?? "未知错误"}`);
  }
}

export async function checkForUpdates(env, fetchImpl = fetch, options = {}) {
  if (!env.DCLONE_STATE) {
    throw new Error("缺少 DCLONE_STATE KV 绑定");
  }
  if (!env.FEISHU_WEBHOOK) {
    throw new Error("缺少 FEISHU_WEBHOOK secret");
  }

  const apiResponse = await fetchImpl(
    env.API_URL ?? "https://d2runewizard.com/api/trackers/diablo-clone",
    { headers: { accept: "application/json" } }
  );
  if (!apiResponse.ok) {
    throw new Error(`状态接口请求失败：HTTP ${apiResponse.status}`);
  }

  const currentServers = normalizeServers(await apiResponse.json());
  validateServerCombinations(currentServers);
  const previousState = await getStoredState(env);
  const isFirstRun = !previousState;
  const changes = findChanges(previousState?.servers, currentServers);
  const shouldNotify =
    changes.length > 0 &&
    (!isFirstRun || String(env.NOTIFY_ON_FIRST_RUN).toLowerCase() === "true");

  if (shouldNotify) {
    const message = buildFeishuMessage(changes, {
      baseVersionName: env.BASE_VERSION_NAME,
      timeZone: env.TIME_ZONE
    });
    await sendFeishu(
      env.FEISHU_WEBHOOK,
      env.FEISHU_SECRET,
      message,
      fetchImpl
    );
  }

  await env.DCLONE_STATE.put(
    STATE_KEY,
    JSON.stringify({
      checkedAt: new Date().toISOString(),
      servers: currentServers,
      terrorZone: options.terrorZone ?? previousState?.terrorZone ?? null
    })
  );

  return {
    initialized: isFirstRun,
    notified: shouldNotify,
    changeCount: changes.length
  };
}
