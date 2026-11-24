import {
  checkSameOriginCsrf,
  hashPassword,
  parseAccountIdentifier,
  sanitizeDisplayName,
  timingSafeEqualStrings,
  validatePasswordInput
} from "./auth-crypto.js";
import {
  KEY_BUILDS_PREFIX,
  KEY_IDX_EMAIL_PREFIX,
  KEY_IDX_GOOGLE_PREFIX,
  KEY_IDX_USERNAME_PREFIX,
  KEY_USER_PREFIX,
  authJson,
  createAdminResetCodeForUser,
  createSession,
  ensureBootstrapAdmin,
  getAdminIds,
  getAuthenticatedUser,
  getStoredUserBuilds,
  getUserById,
  getUserDirectoryIds,
  isGoogleOAuthConfigured,
  issueFreshRecoveryCodes,
  kvDelete,
  mergeUsersIntoDirectory,
  readJsonBody,
  registerUserInDirectory,
  removeUserFromDirectory,
  saveAdminIds,
  toPublicUser
} from "./auth.js";
import {
  getStoredState,
  getSystemConfig,
  updateSystemConfig
} from "./tracker.js";
import { getStorageBackendInfo } from "./storage.js";

const KEY_ADMIN_AUDIT_LOG = "admin:audit:log";
const MAX_AUDIT_LOGS = 100;

function getClientIp(request) {
  return (
    request?.headers?.get("cf-connecting-ip") ||
    request?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "local"
  );
}

async function getAdminAuditLogs(env) {
  if (!env?.DCLONE_STATE) return [];
  const raw = await env.DCLONE_STATE.get(KEY_ADMIN_AUDIT_LOG, "json");
  return Array.isArray(raw) ? raw : [];
}

async function appendAdminAuditLog(env, request, actorUser, { action, target = "", summary = "" }) {
  if (!env?.DCLONE_STATE) return;
  try {
    const existing = await getAdminAuditLogs(env);
    const entry = {
      id: crypto.randomUUID().slice(0, 12),
      time: new Date().toISOString(),
      actor: actorUser
        ? (actorUser.displayName || actorUser.username || actorUser.email || actorUser.id)
        : "system",
      actorId: actorUser?.id || "",
      action: String(action || ""),
      target: String(target || "").slice(0, 80),
      summary: String(summary || "").slice(0, 200),
      ip: getClientIp(request)
    };
    const next = [entry, ...existing].slice(0, MAX_AUDIT_LOGS);
    await env.DCLONE_STATE.put(KEY_ADMIN_AUDIT_LOG, JSON.stringify(next));
  } catch (err) {
    console.error("写入管理审计日志失败", err);
  }
}

async function requireAdminSession(request, env) {
  await ensureBootstrapAdmin(env);
  const auth = await getAuthenticatedUser(request, env);
  if (!auth) {
    return { ok: false, response: authJson({ ok: false, error: "请先使用管理员账号登录" }, 401) };
  }
  if (auth.user.role !== "admin") {
    return { ok: false, response: authJson({ ok: false, error: "需要管理员权限" }, 403) };
  }
  return { ok: true, auth };
}

async function handleAdminBootstrap(request, env) {
  await ensureBootstrapAdmin(env);
  const existingAdmins = await getAdminIds(env);
  if (existingAdmins.length > 0) {
    return authJson({ ok: false, error: "管理员账号已完成初始化，请直接登录" }, 409);
  }

  const parsed = await readJsonBody(request, 16 * 1024);
  if (!parsed.ok) return authJson({ ok: false, error: parsed.error }, parsed.status);

  if (env?.MANUAL_TRIGGER_TOKEN) {
    const authHeader = request.headers.get("authorization") || "";
    const bodyToken = String(parsed.data.bootstrapToken || "").trim();
    const headerOk = timingSafeEqualStrings(authHeader, `Bearer ${env.MANUAL_TRIGGER_TOKEN}`);
    const bodyOk = timingSafeEqualStrings(bodyToken, env.MANUAL_TRIGGER_TOKEN);
    if (!headerOk && !bodyOk) {
      return authJson({ ok: false, error: "初始化需要校验管理令牌 MANUAL_TRIGGER_TOKEN" }, 401);
    }
  }

  // Mode 1: Promote currently signed-in account to admin
  if (parsed.data.promoteCurrent === true) {
    const auth = await getAuthenticatedUser(request, env);
    if (!auth) {
      return authJson({ ok: false, error: "当前未登录账号，无法升级为管理员" }, 401);
    }
    const user = auth.user;
    user.role = "admin";
    user.updatedAt = new Date().toISOString();
    await Promise.all([
      env.DCLONE_STATE.put(`${KEY_USER_PREFIX}${user.id}`, JSON.stringify(user)),
      saveAdminIds(env, [user.id]),
      registerUserInDirectory(env, user.id)
    ]);
    await appendAdminAuditLog(env, request, user, {
      action: "admin.bootstrap",
      target: user.username || user.email || user.id,
      summary: "将当前登录账号升级为首个系统管理员"
    });
    return authJson({
      ok: true,
      user: toPublicUser(user, auth.authMethod),
      recoveryCodes: null
    });
  }

  // Mode 2: Create a fresh initial admin account
  const acc = parseAccountIdentifier(
    parsed.data.account ?? parsed.data.username ?? parsed.data.email ?? "admin"
  );
  if (!acc.ok) return authJson({ ok: false, error: acc.error }, 400);

  const pw = validatePasswordInput(parsed.data.password);
  if (!pw.ok) return authJson({ ok: false, error: pw.error }, 400);

  const idxKey =
    acc.kind === "email"
      ? `${KEY_IDX_EMAIL_PREFIX}${acc.email}`
      : `${KEY_IDX_USERNAME_PREFIX}${acc.username}`;
  const existingId = await env.DCLONE_STATE.get(idxKey);
  if (existingId) {
    return authJson(
      { ok: false, error: "该账号已存在，请换一个账号名，或先登录后将其升级为管理员" },
      409
    );
  }

  const now = new Date().toISOString();
  const userId = crypto.randomUUID();
  const passwordHash = await hashPassword(pw.password);
  const adminUser = {
    id: userId,
    username: acc.username,
    email: acc.email,
    displayName: sanitizeDisplayName(parsed.data.displayName, "庇护之地管理员"),
    avatarUrl: "",
    passwordHash,
    googleSub: "",
    providers: ["password"],
    role: "admin",
    sessionVersion: 1,
    recoveryCodeHashes: [],
    createdAt: now,
    updatedAt: now
  };
  const recoveryCodes = await issueFreshRecoveryCodes(adminUser);

  await Promise.all([
    env.DCLONE_STATE.put(`${KEY_USER_PREFIX}${userId}`, JSON.stringify(adminUser)),
    env.DCLONE_STATE.put(idxKey, userId),
    saveAdminIds(env, [userId]),
    registerUserInDirectory(env, userId)
  ]);

  const { cookieHeader } = await createSession(env, request, adminUser, "password");
  await appendAdminAuditLog(env, request, adminUser, {
    action: "admin.bootstrap",
    target: adminUser.username || adminUser.email || adminUser.id,
    summary: "初始化创建首个管理员账号"
  });
  return authJson(
    {
      ok: true,
      user: toPublicUser(adminUser, "password"),
      recoveryCodes
    },
    201,
    { "set-cookie": cookieHeader }
  );
}

async function listKvUserIds(env) {
  if (!env?.DCLONE_STATE || typeof env.DCLONE_STATE.list !== "function") {
    return [];
  }
  const ids = [];
  let cursor;
  let pages = 0;
  try {
    do {
      const res = await env.DCLONE_STATE.list({
        prefix: KEY_USER_PREFIX,
        limit: 1000,
        cursor
      });
      const keys = Array.isArray(res?.keys) ? res.keys : [];
      for (const k of keys) {
        const name = typeof k === "string" ? k : k?.name;
        if (typeof name === "string" && name.startsWith(KEY_USER_PREFIX)) {
          const id = name.slice(KEY_USER_PREFIX.length);
          if (id) ids.push(id);
        }
      }
      cursor = res?.list_complete ? undefined : res?.cursor;
      pages += 1;
    } while (cursor && pages < 5 && ids.length < 2000);
  } catch (err) {
    console.error("扫描 KV 用户列表失败", err);
  }
  return ids;
}

async function listUsersSummary(env) {
  const [dirIds, adminIds, kvIds] = await Promise.all([
    getUserDirectoryIds(env),
    getAdminIds(env),
    listKvUserIds(env)
  ]);
  const allIds = [...new Set([...adminIds, ...dirIds, ...kvIds])];

  // Auto-backfill legacy users created before auth:idx:users index existed (single atomic KV write)
  if (kvIds.length > 0) {
    const dirSet = new Set(dirIds);
    const missingIds = kvIds.filter((id) => !dirSet.has(id));
    if (missingIds.length > 0) {
      await mergeUsersIntoDirectory(env, missingIds);
    }
  }

  const entries = await Promise.all(
    allIds.map(async (id) => {
      const [user, builds] = await Promise.all([
        getUserById(env, id),
        getStoredUserBuilds(env, id)
      ]);
      if (!user) return null;
      const skillClassCount = Object.values(builds?.skills || {}).filter((cls) =>
        Object.values(cls || {}).some((v) => Number(v || 0) > 0)
      ).length;
      const totalSkillPoints = Object.values(builds?.skills || {}).reduce(
        (sum, cls) =>
          sum + Object.values(cls || {}).reduce((s, v) => s + (Number(v || 0) || 0), 0),
        0
      );
      const equipClassCount = Object.keys(builds?.paperdoll || {}).length;
      const grailUniquesCount = Array.isArray(builds?.grail?.uniques) ? builds.grail.uniques.length : 0;
      const grailSetsCount = Array.isArray(builds?.grail?.setPieces) ? builds.grail.setPieces.length : 0;
      const grailCount = grailUniquesCount + grailSetsCount;
      const runewordsCount = Array.isArray(builds?.runewords) ? builds.runewords.length : 0;
      return {
        id: user.id,
        username: user.username || "",
        email: user.email || "",
        displayName: user.displayName || user.username || user.email || "庇护之地玩家",
        avatarUrl: user.avatarUrl || "",
        role: user.role === "admin" ? "admin" : "user",
        disabled: Boolean(user.disabled),
        providers: Array.isArray(user.providers) ? user.providers : [],
        hasPassword: Boolean(user.passwordHash),
        recoveryCodesRemaining: Array.isArray(user.recoveryCodeHashes)
          ? user.recoveryCodeHashes.length
          : 0,
        skillClassCount,
        totalSkillPoints,
        equipClassCount,
        presetCount: Array.isArray(builds?.presets) ? builds.presets.length : 0,
        grailUniquesCount,
        grailSetsCount,
        grailCount,
        runewordsCount,
        buildsUpdatedAt: builds?.updatedAt || null,
        createdAt: user.createdAt || null,
        updatedAt: user.updatedAt || null
      };
    })
  );
  return entries.filter(Boolean).sort((a, b) => {
    if (a.role !== b.role) return a.role === "admin" ? -1 : 1;
    return Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0);
  });
}

async function handleAdminOverview(request, env) {
  const gate = await requireAdminSession(request, env);
  if (!gate.ok) return gate.response;

  const [settings, state, users] = await Promise.all([
    getSystemConfig(env),
    getStoredState(env),
    listUsersSummary(env)
  ]);

  const adminCount = users.filter((u) => u.role === "admin").length;
  const usersWithBuilds = users.filter(
    (u) =>
      u.skillClassCount > 0 ||
      u.equipClassCount > 0 ||
      u.presetCount > 0 ||
      u.grailCount > 0 ||
      u.runewordsCount > 0
  ).length;

  return authJson({
    ok: true,
    settings,
    runtime: {
      lastCheckedAt: state?.checkedAt || null,
      currentTerrorZone: state?.terrorZone?.currentZh || state?.terrorZone?.current || null,
      nextTerrorZone: state?.terrorZone?.nextZh || state?.terrorZone?.next || null,
      serverCount: Array.isArray(state?.servers) ? state.servers.length : 0,
      googleOAuthConfigured: isGoogleOAuthConfigured(env),
      feishuWebhookConfigured: Boolean(env?.FEISHU_WEBHOOK),
      feishuSecretConfigured: Boolean(env?.FEISHU_SECRET),
      manualTokenConfigured: Boolean(env?.MANUAL_TRIGGER_TOKEN),
      adminEnvConfigured: Boolean(
        typeof env?.ADMIN_PASSWORD === "string" && env.ADMIN_PASSWORD.length >= 8
      ),
      storageBackend: getStorageBackendInfo(env),
      timeZone: env?.TIME_ZONE || "Asia/Shanghai"
    },
    stats: {
      totalUsers: users.length,
      adminCount,
      usersWithBuilds
    }
  });
}

async function handleAdminUpdateSettings(request, env) {
  const gate = await requireAdminSession(request, env);
  if (!gate.ok) return gate.response;

  const parsed = await readJsonBody(request, 16 * 1024);
  if (!parsed.ok) return authJson({ ok: false, error: parsed.error }, parsed.status);

  try {
    const settings = await updateSystemConfig(env, parsed.data);
    await appendAdminAuditLog(env, request, gate.auth.user, {
      action: "settings.update",
      target: "system-config",
      summary: `自动刷新=${settings.pageAutoRefreshEnabled ? `${settings.pageAutoRefreshMinutes}分` : "关闭"} · 后台拉取=${settings.pullIntervalMinutes}分`
    });
    return authJson({ ok: true, settings });
  } catch (err) {
    return authJson({ ok: false, error: err.message || "保存系统设置失败" }, 400);
  }
}

async function handleAdminListUsers(request, env) {
  const gate = await requireAdminSession(request, env);
  if (!gate.ok) return gate.response;

  const users = await listUsersSummary(env);
  return authJson({ ok: true, users });
}

async function handleAdminUserResetToken(request, env, userId) {
  const gate = await requireAdminSession(request, env);
  if (!gate.ok) return gate.response;

  const target = await getUserById(env, userId);
  if (!target) {
    return authJson({ ok: false, error: "未找到该用户" }, 404);
  }
  const payload = await createAdminResetCodeForUser(env, target);
  await appendAdminAuditLog(env, request, gate.auth.user, {
    action: "user.reset_code",
    target: target.username || target.email || target.id,
    summary: "签发 15 分钟一次性应急密码重置码"
  });
  return authJson({ ok: true, ...payload });
}

async function handleAdminUpdateUserRole(request, env, userId) {
  const gate = await requireAdminSession(request, env);
  if (!gate.ok) return gate.response;

  const parsed = await readJsonBody(request, 8 * 1024);
  if (!parsed.ok) return authJson({ ok: false, error: parsed.error }, parsed.status);

  const nextRole = parsed.data.role === "admin" ? "admin" : parsed.data.role === "user" ? "user" : "";
  if (!nextRole) {
    return authJson({ ok: false, error: "角色必须为 admin 或 user" }, 400);
  }

  const target = await getUserById(env, userId);
  if (!target) {
    return authJson({ ok: false, error: "未找到该用户" }, 404);
  }

  const adminIds = await getAdminIds(env);
  if (nextRole === "user" && target.role === "admin") {
    const remaining = adminIds.filter((id) => id !== target.id);
    if (remaining.length === 0) {
      return authJson({ ok: false, error: "系统至少需要保留 1 个管理员账号" }, 400);
    }
    await saveAdminIds(env, remaining);
  } else if (nextRole === "admin") {
    await saveAdminIds(env, [...adminIds, target.id]);
  }

  target.role = nextRole;
  target.updatedAt = new Date().toISOString();
  await env.DCLONE_STATE.put(`${KEY_USER_PREFIX}${target.id}`, JSON.stringify(target));
  await appendAdminAuditLog(env, request, gate.auth.user, {
    action: "user.role",
    target: target.username || target.email || target.id,
    summary: `调整角色为 ${nextRole === "admin" ? "管理员" : "普通用户"}`
  });
  return authJson({ ok: true, user: toPublicUser(target) });
}

function summarizeEquippedSlot(item) {
  if (!item || typeof item !== "object") return "";
  return String(item.id || item.name || item.baseCode || item.cat || "").slice(0, 48);
}

async function handleAdminGetUserDetail(request, env, userId) {
  const gate = await requireAdminSession(request, env);
  if (!gate.ok) return gate.response;

  const [user, builds] = await Promise.all([
    getUserById(env, userId),
    getStoredUserBuilds(env, userId)
  ]);
  if (!user) {
    return authJson({ ok: false, error: "未找到该用户" }, 404);
  }

  const classIds = [
    ...new Set([
      ...Object.keys(builds?.skills || {}),
      ...Object.keys(builds?.paperdoll || {})
    ])
  ];
  const classes = classIds
    .map((cid) => {
      const skObj = builds?.skills?.[cid] || {};
      const skillEntries = Object.entries(skObj)
        .filter(([, pts]) => Number(pts || 0) > 0)
        .sort((a, b) => Number(b[1]) - Number(a[1]));
      const skillPoints = skillEntries.reduce((s, [, v]) => s + Number(v || 0), 0);
      const pd = builds?.paperdoll?.[cid] || null;
      const loadout = pd?.charLoadout || {};
      const equippedSlots = Object.entries(loadout)
        .filter(([, it]) => Boolean(it))
        .map(([slot, it]) => ({ slot, label: summarizeEquippedSlot(it) }));
      return {
        classId: cid,
        skillPoints,
        topSkills: skillEntries.slice(0, 8).map(([key, pts]) => ({ key, pts: Number(pts) })),
        hasPaperdoll: Boolean(pd),
        charLvl: pd ? Number(pd.charLvl || 90) : null,
        equippedSlotsCount: equippedSlots.length,
        equippedSlots,
        charmCount: Array.isArray(pd?.charBag) ? pd.charBag.length : 0,
        mercVariant: pd?.mercVariant || ""
      };
    })
    .filter((c) => c.skillPoints > 0 || c.hasPaperdoll);

  const presets = (builds?.presets || []).map((p) => ({
    id: p.id,
    name: p.name,
    classId: p.classId,
    skillPoints: Object.values(p.skills || {}).reduce((s, v) => s + Number(v || 0), 0),
    hasPaperdoll: Boolean(p.paperdoll),
    updatedAt: p.updatedAt || null
  }));

  return authJson({
    ok: true,
    user: {
      ...toPublicUser(user),
      sessionVersion: Number(user.sessionVersion || 1),
      createdAt: user.createdAt || null,
      updatedAt: user.updatedAt || null
    },
    builds: {
      updatedAt: builds?.updatedAt || null,
      activeClassId: builds?.activeClassId || "",
      classes,
      presets,
      grail: {
        uniquesCount: Array.isArray(builds?.grail?.uniques) ? builds.grail.uniques.length : 0,
        setPiecesCount: Array.isArray(builds?.grail?.setPieces) ? builds.grail.setPieces.length : 0
      },
      runewordsCount: Array.isArray(builds?.runewords) ? builds.runewords.length : 0
    }
  });
}

async function handleAdminCreateUser(request, env) {
  const gate = await requireAdminSession(request, env);
  if (!gate.ok) return gate.response;

  const parsed = await readJsonBody(request, 16 * 1024);
  if (!parsed.ok) return authJson({ ok: false, error: parsed.error }, parsed.status);

  const acc = parseAccountIdentifier(
    parsed.data.account ?? parsed.data.username ?? parsed.data.email
  );
  if (!acc.ok) return authJson({ ok: false, error: acc.error }, 400);

  const pw = validatePasswordInput(parsed.data.password);
  if (!pw.ok) return authJson({ ok: false, error: pw.error }, 400);

  const role = parsed.data.role === "admin" ? "admin" : "user";
  const idxKey =
    acc.kind === "email"
      ? `${KEY_IDX_EMAIL_PREFIX}${acc.email}`
      : `${KEY_IDX_USERNAME_PREFIX}${acc.username}`;
  if (await env.DCLONE_STATE.get(idxKey)) {
    return authJson(
      { ok: false, error: acc.kind === "email" ? "该邮箱已被注册" : "该账号已被注册" },
      409
    );
  }

  const now = new Date().toISOString();
  const userId = crypto.randomUUID();
  const passwordHash = await hashPassword(pw.password);
  const newUser = {
    id: userId,
    username: acc.username,
    email: acc.email,
    displayName: sanitizeDisplayName(parsed.data.displayName, acc.defaultDisplayName),
    avatarUrl: "",
    passwordHash,
    googleSub: "",
    providers: ["password"],
    role,
    disabled: false,
    sessionVersion: 1,
    recoveryCodeHashes: [],
    createdAt: now,
    updatedAt: now
  };
  const recoveryCodes = await issueFreshRecoveryCodes(newUser);
  const tasks = [
    env.DCLONE_STATE.put(`${KEY_USER_PREFIX}${userId}`, JSON.stringify(newUser)),
    env.DCLONE_STATE.put(idxKey, userId),
    registerUserInDirectory(env, userId)
  ];
  if (role === "admin") {
    const admins = await getAdminIds(env);
    tasks.push(saveAdminIds(env, [...admins, userId]));
  }
  await Promise.all(tasks);
  await appendAdminAuditLog(env, request, gate.auth.user, {
    action: "user.create",
    target: newUser.username || newUser.email || newUser.id,
    summary: `新建账号（角色：${role === "admin" ? "管理员" : "普通用户"}，昵称：${newUser.displayName}）`
  });

  return authJson({ ok: true, user: toPublicUser(newUser), recoveryCodes }, 201);
}

async function handleAdminUpdateUserStatus(request, env, userId) {
  const gate = await requireAdminSession(request, env);
  if (!gate.ok) return gate.response;

  const parsed = await readJsonBody(request, 8 * 1024);
  if (!parsed.ok) return authJson({ ok: false, error: parsed.error }, parsed.status);

  if (typeof parsed.data.disabled !== "boolean") {
    return authJson({ ok: false, error: "disabled 必须为布尔值" }, 400);
  }
  const disabled = parsed.data.disabled;

  const target = await getUserById(env, userId);
  if (!target) return authJson({ ok: false, error: "未找到该用户" }, 404);

  if (disabled && target.id === gate.auth.user.id) {
    return authJson({ ok: false, error: "不能禁用当前登录的管理员账号" }, 400);
  }
  if (disabled && target.role === "admin") {
    const adminIds = await getAdminIds(env);
    const otherActiveAdmins = (
      await Promise.all(adminIds.filter((id) => id !== target.id).map((id) => getUserById(env, id)))
    ).filter((u) => u && u.role === "admin" && !u.disabled);
    if (otherActiveAdmins.length === 0) {
      return authJson({ ok: false, error: "系统至少需要保留 1 个可用的管理员账号" }, 400);
    }
  }

  target.disabled = disabled;
  if (disabled) {
    target.sessionVersion = Number(target.sessionVersion || 1) + 1;
  }
  target.updatedAt = new Date().toISOString();
  await env.DCLONE_STATE.put(`${KEY_USER_PREFIX}${target.id}`, JSON.stringify(target));
  await appendAdminAuditLog(env, request, gate.auth.user, {
    action: "user.status",
    target: target.username || target.email || target.id,
    summary: disabled ? "禁用账号并踢出全设备会话" : "重新启用账号"
  });
  return authJson({ ok: true, user: toPublicUser(target) });
}

async function handleAdminRevokeUserSessions(request, env, userId) {
  const gate = await requireAdminSession(request, env);
  if (!gate.ok) return gate.response;

  const target = await getUserById(env, userId);
  if (!target) return authJson({ ok: false, error: "未找到该用户" }, 404);

  target.sessionVersion = Number(target.sessionVersion || 1) + 1;
  target.updatedAt = new Date().toISOString();
  await env.DCLONE_STATE.put(`${KEY_USER_PREFIX}${target.id}`, JSON.stringify(target));
  await appendAdminAuditLog(env, request, gate.auth.user, {
    action: "user.revoke_sessions",
    target: target.username || target.email || target.id,
    summary: `强制吊销全部登录会话（v${target.sessionVersion}）`
  });
  return authJson({
    ok: true,
    user: toPublicUser(target),
    sessionVersion: target.sessionVersion
  });
}

async function handleAdminDeleteUser(request, env, userId) {
  const gate = await requireAdminSession(request, env);
  if (!gate.ok) return gate.response;

  const target = await getUserById(env, userId);
  if (!target) return authJson({ ok: false, error: "未找到该用户" }, 404);

  if (target.id === gate.auth.user.id) {
    return authJson({ ok: false, error: "不能删除当前登录的管理员账号" }, 400);
  }
  const adminIds = await getAdminIds(env);
  if (target.role === "admin") {
    const remaining = adminIds.filter((id) => id !== target.id);
    if (remaining.length === 0) {
      return authJson({ ok: false, error: "系统至少需要保留 1 个管理员账号" }, 400);
    }
    await saveAdminIds(env, remaining);
  }

  const deletions = [
    kvDelete(env.DCLONE_STATE, `${KEY_USER_PREFIX}${target.id}`),
    kvDelete(env.DCLONE_STATE, `${KEY_BUILDS_PREFIX}${target.id}`),
    removeUserFromDirectory(env, target.id)
  ];
  if (target.username) {
    const owner = await env.DCLONE_STATE.get(`${KEY_IDX_USERNAME_PREFIX}${target.username}`);
    if (owner === target.id) {
      deletions.push(kvDelete(env.DCLONE_STATE, `${KEY_IDX_USERNAME_PREFIX}${target.username}`));
    }
  }
  if (target.email) {
    const owner = await env.DCLONE_STATE.get(`${KEY_IDX_EMAIL_PREFIX}${target.email}`);
    if (owner === target.id) {
      deletions.push(kvDelete(env.DCLONE_STATE, `${KEY_IDX_EMAIL_PREFIX}${target.email}`));
    }
  }
  if (target.googleSub) {
    const owner = await env.DCLONE_STATE.get(`${KEY_IDX_GOOGLE_PREFIX}${target.googleSub}`);
    if (owner === target.id) {
      deletions.push(kvDelete(env.DCLONE_STATE, `${KEY_IDX_GOOGLE_PREFIX}${target.googleSub}`));
    }
  }
  await Promise.all(deletions);
  await appendAdminAuditLog(env, request, gate.auth.user, {
    action: "user.delete",
    target: target.username || target.email || target.id,
    summary: `永久删除账号及其云端存档（${target.displayName || target.id}）`
  });
  return authJson({ ok: true, deletedUserId: target.id });
}

export async function handleAdminApiRequest(request, env, url, { runManualSync } = {}) {
  const path = url.pathname;
  if (!path.startsWith("/api/admin/")) return null;

  if (!env?.DCLONE_STATE) {
    return authJson({ ok: false, error: "云端存储未配置" }, 503);
  }

  if (!checkSameOriginCsrf(request, url)) {
    return authJson({ ok: false, error: "禁止跨站请求" }, 403);
  }

  if (request.method === "GET" && path === "/api/admin/status") {
    await ensureBootstrapAdmin(env);
    const [adminIds, auth] = await Promise.all([
      getAdminIds(env),
      getAuthenticatedUser(request, env)
    ]);
    return authJson({
      ok: true,
      adminInitialized: adminIds.length > 0,
      requiresTokenForBootstrap: Boolean(env?.MANUAL_TRIGGER_TOKEN),
      authenticated: Boolean(auth),
      isAdmin: Boolean(auth && auth.user.role === "admin"),
      googleEnabled: isGoogleOAuthConfigured(env),
      user: auth ? toPublicUser(auth.user, auth.authMethod) : null
    });
  }

  if (request.method === "POST" && path === "/api/admin/bootstrap") {
    return handleAdminBootstrap(request, env);
  }

  if (request.method === "GET" && path === "/api/admin/overview") {
    return handleAdminOverview(request, env);
  }

  if (request.method === "PUT" && path === "/api/admin/settings") {
    return handleAdminUpdateSettings(request, env);
  }

  if (request.method === "GET" && path === "/api/admin/audit-logs") {
    const gate = await requireAdminSession(request, env);
    if (!gate.ok) return gate.response;
    const logs = await getAdminAuditLogs(env);
    return authJson({ ok: true, logs, storageBackend: getStorageBackendInfo(env) });
  }

  if (request.method === "POST" && path === "/api/admin/sync") {
    const gate = await requireAdminSession(request, env);
    if (!gate.ok) return gate.response;
    if (typeof runManualSync !== "function") {
      return authJson({ ok: false, error: "同步执行器不可用" }, 500);
    }
    try {
      const result = await runManualSync(env);
      await appendAdminAuditLog(env, request, gate.auth.user, {
        action: "sync.manual",
        target: "dclone+tz",
        summary: "手动触发全服地表暗黑与恐怖地带同步"
      });
      return authJson({ ok: true, ...result });
    } catch (err) {
      return authJson({ ok: false, error: err.message || "手动同步失败" }, 502);
    }
  }

  if (request.method === "GET" && path === "/api/admin/users") {
    return handleAdminListUsers(request, env);
  }
  if (request.method === "POST" && path === "/api/admin/users") {
    return handleAdminCreateUser(request, env);
  }

  const singleUserMatch = path.match(/^\/api\/admin\/users\/([^/]+)$/);
  if (singleUserMatch) {
    let userId = "";
    try {
      userId = decodeURIComponent(singleUserMatch[1]);
    } catch {
      return authJson({ ok: false, error: "无效的用户 ID" }, 400);
    }
    if (request.method === "GET") return handleAdminGetUserDetail(request, env, userId);
    if (request.method === "DELETE") return handleAdminDeleteUser(request, env, userId);
  }

  const userMatch = path.match(/^\/api\/admin\/users\/([^/]+)\/(reset-token|role|status|revoke-sessions)$/);
  if (request.method === "POST" && userMatch) {
    let userId = "";
    try {
      userId = decodeURIComponent(userMatch[1]);
    } catch {
      return authJson({ ok: false, error: "无效的用户 ID" }, 400);
    }
    if (userMatch[2] === "reset-token") return handleAdminUserResetToken(request, env, userId);
    if (userMatch[2] === "role") return handleAdminUpdateUserRole(request, env, userId);
    if (userMatch[2] === "status") return handleAdminUpdateUserStatus(request, env, userId);
    if (userMatch[2] === "revoke-sessions") return handleAdminRevokeUserSessions(request, env, userId);
  }

  return authJson({ ok: false, error: "不支持的管理接口" }, 404);
}
