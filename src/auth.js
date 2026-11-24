import {
  ADMIN_RESET_TTL_SECONDS,
  MAX_JSON_BODY_BYTES,
  OAUTH_TTL_SECONDS,
  RECOVERY_CODE_COUNT,
  SESSION_TTL_SECONDS,
  VALID_CLASS_IDS,
  checkSameOriginCsrf,
  formatCookie,
  generateAdminResetCode,
  generateRecoveryCodes,
  getOAuthCookieName,
  getSessionCookieName,
  hashPassword,
  hashRecoveryCode,
  isSecureRequest,
  parseAccountIdentifier,
  randomToken,
  readOAuthStateCookie,
  readSessionToken,
  sanitizeAvatarUrl,
  sanitizeDisplayName,
  sanitizeReturnTo,
  sha256Base64Url,
  sha256Hex,
  timingSafeEqualStrings,
  validatePasswordInput,
  verifyPassword
} from "./auth-crypto.js";

const KEY_USER_PREFIX = "auth:user:";
const KEY_IDX_USERNAME_PREFIX = "auth:idx:username:";
const KEY_IDX_EMAIL_PREFIX = "auth:idx:email:";
const KEY_IDX_GOOGLE_PREFIX = "auth:idx:google:";
const KEY_SESS_PREFIX = "auth:sess:";
const KEY_OAUTH_PREFIX = "auth:oauth:";
const KEY_RL_PREFIX = "auth:rl:login:";
const KEY_RL_RESET_PREFIX = "auth:rl:reset:";
const KEY_ADMIN_RESET_PREFIX = "auth:admin-reset:";
const KEY_BUILDS_PREFIX = "auth:builds:";
const KEY_ADMIN_LIST = "auth:meta:admins";
const KEY_USER_LIST = "auth:idx:users";
const MAX_PRESETS = 30;
const LOGIN_RL_WINDOW_SECONDS = 600;
const LOGIN_RL_MAX_ATTEMPTS = 15;
const RESET_RL_MAX_ATTEMPTS = 10;

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

function authJson(data, status = 200, extraHeaders = {}) {
  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "cross-origin-resource-policy": "same-origin",
    vary: "Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site"
  });
  for (const [k, v] of Object.entries(extraHeaders)) {
    if (Array.isArray(v)) {
      for (const item of v) headers.append(k, item);
    } else if (v !== undefined && v !== null) {
      headers.set(k, v);
    }
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function authRedirect(location, extraHeaders = {}) {
  const headers = new Headers({
    location,
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer"
  });
  for (const [k, v] of Object.entries(extraHeaders)) {
    if (Array.isArray(v)) {
      for (const item of v) headers.append(k, item);
    } else if (v !== undefined && v !== null) {
      headers.set(k, v);
    }
  }
  return new Response(null, { status: 302, headers });
}

async function kvDelete(kv, key) {
  if (!kv) return;
  if (typeof kv.delete === "function") {
    await kv.delete(key);
  } else {
    await kv.put(key, "", { expirationTtl: 60 });
  }
}

async function readJsonBody(request, maxBytes = MAX_JSON_BODY_BYTES) {
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > maxBytes) {
    return { ok: false, status: 413, error: "请求数据过大" };
  }
  if (!raw.trim()) {
    return { ok: false, status: 400, error: "请求体不能为空" };
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false, status: 400, error: "无效的 JSON 对象" };
    }
    return { ok: true, data: parsed };
  } catch {
    return { ok: false, status: 400, error: "JSON 解析失败" };
  }
}

export function isGoogleOAuthConfigured(env) {
  return Boolean(
    env &&
      typeof env.GOOGLE_CLIENT_ID === "string" &&
      env.GOOGLE_CLIENT_ID.trim() &&
      typeof env.GOOGLE_CLIENT_SECRET === "string" &&
      env.GOOGLE_CLIENT_SECRET.trim()
  );
}

function toPublicUser(user, authMethod = "") {
  if (!user) return null;
  const hasPassword = Boolean(user.passwordHash);
  const role = user.role === "admin" ? "admin" : "user";
  return {
    id: user.id,
    username: user.username || "",
    email: user.email || "",
    displayName: user.displayName || user.username || user.email || "庇护之地玩家",
    avatarUrl: sanitizeAvatarUrl(user.avatarUrl),
    providers: Array.isArray(user.providers) ? user.providers : [],
    role,
    isAdmin: role === "admin",
    disabled: Boolean(user.disabled),
    hasPassword,
    recoveryCodesRemaining: Array.isArray(user.recoveryCodeHashes)
      ? user.recoveryCodeHashes.length
      : 0,
    canSetPasswordWithoutCurrent: !hasPassword || authMethod === "google"
  };
}

async function getAdminIds(env) {
  if (!env?.DCLONE_STATE) return [];
  const list = await env.DCLONE_STATE.get(KEY_ADMIN_LIST, "json");
  return Array.isArray(list) ? list.filter((id) => typeof id === "string" && id) : [];
}

async function saveAdminIds(env, ids) {
  const unique = [...new Set((ids || []).filter((id) => typeof id === "string" && id))];
  await env.DCLONE_STATE.put(KEY_ADMIN_LIST, JSON.stringify(unique));
  return unique;
}

async function getUserDirectoryIds(env) {
  if (!env?.DCLONE_STATE) return [];
  const list = await env.DCLONE_STATE.get(KEY_USER_LIST, "json");
  return Array.isArray(list) ? list.filter((id) => typeof id === "string" && id) : [];
}

async function registerUserInDirectory(env, userId) {
  if (!env?.DCLONE_STATE || !userId) return;
  const current = await getUserDirectoryIds(env);
  if (current.includes(userId)) return;
  const next = [userId, ...current].slice(0, 2000);
  await env.DCLONE_STATE.put(KEY_USER_LIST, JSON.stringify(next));
}

async function mergeUsersIntoDirectory(env, userIds) {
  if (!env?.DCLONE_STATE || !Array.isArray(userIds) || !userIds.length) return;
  const current = await getUserDirectoryIds(env);
  const currentSet = new Set(current);
  const missing = userIds.filter((id) => typeof id === "string" && id && !currentSet.has(id));
  if (!missing.length) return;
  const next = [...new Set([...missing, ...current])].slice(0, 2000);
  await env.DCLONE_STATE.put(KEY_USER_LIST, JSON.stringify(next));
}

async function ensureBootstrapAdmin(env) {
  if (!env?.DCLONE_STATE) return false;
  const existingAdmins = await getAdminIds(env);
  if (existingAdmins.length > 0) return true;

  const envPassword = typeof env.ADMIN_PASSWORD === "string" ? env.ADMIN_PASSWORD : "";
  if (envPassword.length < 8) return false;

  const rawAcc = String(env.ADMIN_ACCOUNT || "admin").trim();
  const acc = parseAccountIdentifier(rawAcc);
  if (!acc.ok) return false;

  const idxKey =
    acc.kind === "email"
      ? `${KEY_IDX_EMAIL_PREFIX}${acc.email}`
      : `${KEY_IDX_USERNAME_PREFIX}${acc.username}`;
  const existingUserId = await env.DCLONE_STATE.get(idxKey);
  const now = new Date().toISOString();

  if (existingUserId) {
    const existingUser = await getUserById(env, existingUserId);
    if (existingUser) {
      existingUser.role = "admin";
      if (!existingUser.passwordHash) {
        existingUser.passwordHash = await hashPassword(envPassword);
        const provs = new Set(Array.isArray(existingUser.providers) ? existingUser.providers : []);
        provs.add("password");
        existingUser.providers = [...provs];
      }
      if (!Array.isArray(existingUser.recoveryCodeHashes) || existingUser.recoveryCodeHashes.length === 0) {
        await issueFreshRecoveryCodes(existingUser);
      }
      existingUser.updatedAt = now;
      await env.DCLONE_STATE.put(`${KEY_USER_PREFIX}${existingUser.id}`, JSON.stringify(existingUser));
      await saveAdminIds(env, [existingUser.id]);
      await registerUserInDirectory(env, existingUser.id);
      return true;
    }
  }

  const userId = crypto.randomUUID();
  const passwordHash = await hashPassword(envPassword);
  const adminUser = {
    id: userId,
    username: acc.username,
    email: acc.email,
    displayName: sanitizeDisplayName(env.ADMIN_DISPLAY_NAME, "庇护之地管理员"),
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
  await issueFreshRecoveryCodes(adminUser);
  await Promise.all([
    env.DCLONE_STATE.put(`${KEY_USER_PREFIX}${userId}`, JSON.stringify(adminUser)),
    env.DCLONE_STATE.put(idxKey, userId),
    saveAdminIds(env, [userId]),
    registerUserInDirectory(env, userId)
  ]);
  return true;
}

async function createAdminResetCodeForUser(env, user) {
  const resetCode = generateAdminResetCode();
  const codeHash = await hashRecoveryCode(resetCode);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ADMIN_RESET_TTL_SECONDS * 1000).toISOString();
  await env.DCLONE_STATE.put(
    `${KEY_ADMIN_RESET_PREFIX}${codeHash}`,
    JSON.stringify({ userId: user.id, createdAt: now.toISOString(), expiresAt }),
    { expirationTtl: ADMIN_RESET_TTL_SECONDS }
  );
  return {
    account: user.username || user.email || user.id,
    displayName: user.displayName || user.username || user.email || "庇护之地玩家",
    resetCode,
    expiresInSeconds: ADMIN_RESET_TTL_SECONDS,
    expiresAt
  };
}

async function removeUserFromDirectory(env, userId) {
  if (!env?.DCLONE_STATE || !userId) return;
  const current = await getUserDirectoryIds(env);
  const next = current.filter((id) => id !== userId);
  await env.DCLONE_STATE.put(KEY_USER_LIST, JSON.stringify(next));
}

export async function resolveInitialAuthContext(request, env) {
  if (!env?.DCLONE_STATE) return null;
  try {
    await ensureBootstrapAdmin(env);
    const [auth, adminIds] = await Promise.all([
      getAuthenticatedUser(request, env),
      getAdminIds(env)
    ]);
    return {
      authenticated: Boolean(auth),
      adminInitialized: adminIds.length > 0,
      requiresTokenForBootstrap: Boolean(env?.MANUAL_TRIGGER_TOKEN),
      googleEnabled: isGoogleOAuthConfigured(env),
      isAdmin: Boolean(auth && auth.user.role === "admin"),
      user: auth ? toPublicUser(auth.user, auth.authMethod) : null
    };
  } catch {
    return null;
  }
}

export async function getAuthenticatedAdmin(request, env) {
  await ensureBootstrapAdmin(env);
  const auth = await getAuthenticatedUser(request, env);
  if (!auth || auth.user.role !== "admin") return null;
  return auth;
}

async function issueFreshRecoveryCodes(user) {
  const codes = generateRecoveryCodes(RECOVERY_CODE_COUNT);
  const hashes = await Promise.all(codes.map((c) => hashRecoveryCode(c)));
  user.recoveryCodeHashes = hashes;
  return codes;
}

async function getUserById(env, userId) {
  if (!userId || !env?.DCLONE_STATE) return null;
  const user = await env.DCLONE_STATE.get(`${KEY_USER_PREFIX}${userId}`, "json");
  return user && user.id ? user : null;
}

async function findUserByAccount(env, rawAccount) {
  const normalized = String(rawAccount || "").trim().toLowerCase();
  if (!normalized || !env?.DCLONE_STATE) return null;
  const idxKey = normalized.includes("@")
    ? `${KEY_IDX_EMAIL_PREFIX}${normalized}`
    : `${KEY_IDX_USERNAME_PREFIX}${normalized}`;
  const userId = await env.DCLONE_STATE.get(idxKey);
  if (!userId) return null;
  return getUserById(env, userId);
}

async function createSession(env, request, user, authMethod = "password") {
  const userId = typeof user === "string" ? user : user.id;
  const sessionVersion =
    typeof user === "object" && user ? Number(user.sessionVersion || 1) : 1;
  const rawToken = randomToken(32);
  const tokenHash = await sha256Hex(rawToken);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_SECONDS * 1000).toISOString();
  await env.DCLONE_STATE.put(
    `${KEY_SESS_PREFIX}${tokenHash}`,
    JSON.stringify({
      userId,
      sessionVersion,
      authMethod,
      createdAt: now.toISOString(),
      expiresAt
    }),
    { expirationTtl: SESSION_TTL_SECONDS }
  );
  const cookieHeader = formatCookie(getSessionCookieName(request), rawToken, {
    secure: isSecureRequest(request),
    maxAge: SESSION_TTL_SECONDS,
    sameSite: "Lax"
  });
  return { cookieHeader, expiresAt };
}

async function getAuthenticatedUser(request, env) {
  if (!env?.DCLONE_STATE) return null;
  const rawToken = readSessionToken(request);
  if (!rawToken) return null;
  const tokenHash = await sha256Hex(rawToken);
  const sess = await env.DCLONE_STATE.get(`${KEY_SESS_PREFIX}${tokenHash}`, "json");
  if (!sess || !sess.userId) return null;
  if (sess.expiresAt && Date.parse(sess.expiresAt) <= Date.now()) {
    await kvDelete(env.DCLONE_STATE, `${KEY_SESS_PREFIX}${tokenHash}`);
    return null;
  }
  const user = await getUserById(env, sess.userId);
  if (!user || user.disabled) return null;
  if (Number(sess.sessionVersion || 1) !== Number(user.sessionVersion || 1)) {
    await kvDelete(env.DCLONE_STATE, `${KEY_SESS_PREFIX}${tokenHash}`);
    return null;
  }
  return { user, tokenHash, authMethod: sess.authMethod || "password" };
}

async function checkLoginRateLimit(request, env, accountKey) {
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for") ||
    "local";
  const rlKey = `${KEY_RL_PREFIX}${await sha256Hex(`${ip}:${accountKey}`)}`;
  const raw = await env.DCLONE_STATE.get(rlKey, "json");
  const count = Number(raw?.count || 0);
  return { rlKey, count, blocked: count >= LOGIN_RL_MAX_ATTEMPTS };
}

async function recordLoginFailure(env, rlKey, prevCount) {
  await env.DCLONE_STATE.put(
    rlKey,
    JSON.stringify({ count: prevCount + 1, updatedAt: new Date().toISOString() }),
    { expirationTtl: LOGIN_RL_WINDOW_SECONDS }
  );
}

async function handleRegister(request, env) {
  const parsed = await readJsonBody(request, 16 * 1024);
  if (!parsed.ok) return authJson({ ok: false, error: parsed.error }, parsed.status);

  const acc = parseAccountIdentifier(parsed.data.account ?? parsed.data.username ?? parsed.data.email);
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
      { ok: false, error: acc.kind === "email" ? "该邮箱已被注册" : "该账号已被注册" },
      409
    );
  }

  const now = new Date().toISOString();
  const userId = crypto.randomUUID();
  const passwordHash = await hashPassword(pw.password);
  const user = {
    id: userId,
    username: acc.username,
    email: acc.email,
    displayName: sanitizeDisplayName(parsed.data.displayName, acc.defaultDisplayName),
    avatarUrl: "",
    passwordHash,
    googleSub: "",
    providers: ["password"],
    role: "user",
    sessionVersion: 1,
    recoveryCodeHashes: [],
    createdAt: now,
    updatedAt: now
  };
  const recoveryCodes = await issueFreshRecoveryCodes(user);

  await Promise.all([
    env.DCLONE_STATE.put(`${KEY_USER_PREFIX}${userId}`, JSON.stringify(user)),
    env.DCLONE_STATE.put(idxKey, userId),
    registerUserInDirectory(env, userId)
  ]);

  const { cookieHeader } = await createSession(env, request, user, "password");
  return authJson(
    {
      ok: true,
      user: toPublicUser(user, "password"),
      recoveryCodes,
      googleEnabled: isGoogleOAuthConfigured(env)
    },
    201,
    { "set-cookie": cookieHeader }
  );
}

async function handleLogin(request, env) {
  await ensureBootstrapAdmin(env);
  const parsed = await readJsonBody(request, 16 * 1024);
  if (!parsed.ok) return authJson({ ok: false, error: parsed.error }, parsed.status);

  const rawAccount = String(
    parsed.data.account ?? parsed.data.username ?? parsed.data.email ?? ""
  )
    .trim()
    .toLowerCase();
  const password = typeof parsed.data.password === "string" ? parsed.data.password : "";
  if (!rawAccount || !password) {
    return authJson({ ok: false, error: "请输入账号和密码" }, 400);
  }

  const rl = await checkLoginRateLimit(request, env, rawAccount);
  if (rl.blocked) {
    return authJson({ ok: false, error: "登录失败次数过多，请 10 分钟后再试" }, 429);
  }

  let userId = null;
  if (rawAccount.includes("@")) {
    userId = await env.DCLONE_STATE.get(`${KEY_IDX_EMAIL_PREFIX}${rawAccount}`);
  } else {
    userId = await env.DCLONE_STATE.get(`${KEY_IDX_USERNAME_PREFIX}${rawAccount}`);
  }

  const user = userId ? await getUserById(env, userId) : null;
  const verified = await verifyPassword(password, user?.passwordHash || "");
  if (!user || !verified) {
    await recordLoginFailure(env, rl.rlKey, rl.count);
    const hasGoogleOnly = user && !user.passwordHash && user.googleSub;
    return authJson(
      {
        ok: false,
        error: hasGoogleOnly
          ? "该邮箱通过 Google 账号注册，请点击「使用 Google 账号登录」"
          : "账号或密码错误"
      },
      401
    );
  }
  if (user.disabled) {
    return authJson({ ok: false, error: "该账号已被管理员禁用，请联系站长" }, 403);
  }

  if (rl.count > 0) {
    await kvDelete(env.DCLONE_STATE, rl.rlKey);
  }

  const { cookieHeader } = await createSession(env, request, user, "password");
  return authJson(
    {
      ok: true,
      user: toPublicUser(user, "password"),
      googleEnabled: isGoogleOAuthConfigured(env)
    },
    200,
    { "set-cookie": cookieHeader }
  );
}

async function handleLogout(request, env) {
  const rawToken = readSessionToken(request);
  if (rawToken && env?.DCLONE_STATE) {
    const tokenHash = await sha256Hex(rawToken);
    await kvDelete(env.DCLONE_STATE, `${KEY_SESS_PREFIX}${tokenHash}`);
  }
  const secure = isSecureRequest(request);
  const cookies = [
    formatCookie("d2r_session", "", { secure, maxAge: 0, sameSite: "Lax" })
  ];
  if (secure) {
    cookies.push(
      formatCookie("__Host-d2r_session", "", { secure: true, maxAge: 0, sameSite: "Lax" })
    );
  }
  return authJson({ ok: true }, 200, {
    "set-cookie": cookies,
    "clear-site-data": '"cookies"'
  });
}

function getGoogleRedirectUri(url, env) {
  if (env?.GOOGLE_REDIRECT_URI && String(env.GOOGLE_REDIRECT_URI).trim()) {
    return String(env.GOOGLE_REDIRECT_URI).trim();
  }
  return `${url.origin}/api/auth/google/callback`;
}

function appendQueryToReturnTo(returnTo, paramName, paramValue) {
  const [pathAndQuery, hashPart] = sanitizeReturnTo(returnTo).split("#");
  const sep = pathAndQuery.includes("?") ? "&" : "?";
  const next = `${pathAndQuery}${sep}${encodeURIComponent(paramName)}=${encodeURIComponent(paramValue)}`;
  return hashPart ? `${next}#${hashPart}` : next;
}

async function handleGoogleStart(request, env, url) {
  if (!isGoogleOAuthConfigured(env)) {
    return authRedirect(appendQueryToReturnTo("/", "auth_error", "google_not_configured"));
  }
  const state = randomToken(24);
  const codeVerifier = randomToken(32);
  const codeChallenge = await sha256Base64Url(codeVerifier);
  const returnTo = sanitizeReturnTo(url.searchParams.get("returnTo") || "/");
  const stateHash = await sha256Hex(state);

  await env.DCLONE_STATE.put(
    `${KEY_OAUTH_PREFIX}${stateHash}`,
    JSON.stringify({ codeVerifier, returnTo, createdAt: new Date().toISOString() }),
    { expirationTtl: OAUTH_TTL_SECONDS }
  );

  const authUrl = new URL(GOOGLE_AUTH_URL);
  authUrl.searchParams.set("client_id", env.GOOGLE_CLIENT_ID.trim());
  authUrl.searchParams.set("redirect_uri", getGoogleRedirectUri(url, env));
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("code_challenge", codeChallenge);
  authUrl.searchParams.set("code_challenge_method", "S256");
  authUrl.searchParams.set("prompt", "select_account");

  const oauthCookie = formatCookie(getOAuthCookieName(request), state, {
    secure: isSecureRequest(request),
    maxAge: OAUTH_TTL_SECONDS,
    sameSite: "Lax"
  });
  return authRedirect(authUrl.toString(), { "set-cookie": oauthCookie });
}

async function handleGoogleCallback(request, env, url, fetchImpl = fetch) {
  const secure = isSecureRequest(request);
  const clearOAuthCookie = formatCookie(getOAuthCookieName(request), "", {
    secure,
    maxAge: 0,
    sameSite: "Lax"
  });

  if (!isGoogleOAuthConfigured(env)) {
    return authRedirect(appendQueryToReturnTo("/", "auth_error", "google_not_configured"), {
      "set-cookie": clearOAuthCookie
    });
  }

  const oauthErr = url.searchParams.get("error");
  if (oauthErr) {
    return authRedirect(appendQueryToReturnTo("/", "auth_error", "google_denied"), {
      "set-cookie": clearOAuthCookie
    });
  }

  const code = url.searchParams.get("code") || "";
  const state = url.searchParams.get("state") || "";
  const cookieState = readOAuthStateCookie(request);
  if (!code || !state || !cookieState || state !== cookieState) {
    return authRedirect(appendQueryToReturnTo("/", "auth_error", "google_state_invalid"), {
      "set-cookie": clearOAuthCookie
    });
  }

  const stateKey = `${KEY_OAUTH_PREFIX}${await sha256Hex(state)}`;
  const stored = await env.DCLONE_STATE.get(stateKey, "json");
  await kvDelete(env.DCLONE_STATE, stateKey);
  if (!stored || !stored.codeVerifier) {
    return authRedirect(appendQueryToReturnTo("/", "auth_error", "google_state_expired"), {
      "set-cookie": clearOAuthCookie
    });
  }

  const returnTo = sanitizeReturnTo(stored.returnTo || "/");

  try {
    const tokenRes = await fetchImpl(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID.trim(),
        client_secret: env.GOOGLE_CLIENT_SECRET.trim(),
        redirect_uri: getGoogleRedirectUri(url, env),
        grant_type: "authorization_code",
        code_verifier: stored.codeVerifier
      }).toString()
    });
    if (!tokenRes.ok) {
      return authRedirect(appendQueryToReturnTo(returnTo, "auth_error", "google_token_failed"), {
        "set-cookie": clearOAuthCookie
      });
    }
    const tokenData = await tokenRes.json();
    const accessToken = tokenData?.access_token;
    if (!accessToken) {
      return authRedirect(appendQueryToReturnTo(returnTo, "auth_error", "google_token_missing"), {
        "set-cookie": clearOAuthCookie
      });
    }

    const profileRes = await fetchImpl(GOOGLE_USERINFO_URL, {
      headers: { authorization: `Bearer ${accessToken}` }
    });
    if (!profileRes.ok) {
      return authRedirect(appendQueryToReturnTo(returnTo, "auth_error", "google_profile_failed"), {
        "set-cookie": clearOAuthCookie
      });
    }
    const profile = await profileRes.json();
    const googleSub = String(profile?.sub || "").trim();
    if (!googleSub) {
      return authRedirect(appendQueryToReturnTo(returnTo, "auth_error", "google_profile_invalid"), {
        "set-cookie": clearOAuthCookie
      });
    }

    const email =
      profile?.email && profile?.email_verified === true
        ? String(profile.email).trim().toLowerCase()
        : "";
    const avatarUrl = sanitizeAvatarUrl(profile?.picture);
    const displayName = sanitizeDisplayName(
      profile?.name,
      email ? email.split("@")[0] : "Google 玩家"
    );
    const now = new Date().toISOString();

    let userId = await env.DCLONE_STATE.get(`${KEY_IDX_GOOGLE_PREFIX}${googleSub}`);
    let user = userId ? await getUserById(env, userId) : null;

    if (!user && email) {
      const byEmailId = await env.DCLONE_STATE.get(`${KEY_IDX_EMAIL_PREFIX}${email}`);
      if (byEmailId) {
        user = await getUserById(env, byEmailId);
      }
    }

    if (user) {
      if (user.disabled) {
        return authRedirect(appendQueryToReturnTo(returnTo, "auth_error", "account_disabled"), {
          "set-cookie": clearOAuthCookie
        });
      }
      user.googleSub = googleSub;
      if (email && !user.email) user.email = email;
      if (avatarUrl) user.avatarUrl = avatarUrl;
      if (!user.displayName) user.displayName = displayName;
      const provs = new Set(Array.isArray(user.providers) ? user.providers : []);
      provs.add("google");
      user.providers = [...provs];
      user.updatedAt = now;
      await Promise.all([
        env.DCLONE_STATE.put(`${KEY_USER_PREFIX}${user.id}`, JSON.stringify(user)),
        env.DCLONE_STATE.put(`${KEY_IDX_GOOGLE_PREFIX}${googleSub}`, user.id),
        email ? env.DCLONE_STATE.put(`${KEY_IDX_EMAIL_PREFIX}${email}`, user.id) : Promise.resolve()
      ]);
    } else {
      userId = crypto.randomUUID();
      user = {
        id: userId,
        username: "",
        email,
        displayName,
        avatarUrl,
        passwordHash: "",
        googleSub,
        providers: ["google"],
        role: "user",
        sessionVersion: 1,
        recoveryCodeHashes: [],
        createdAt: now,
        updatedAt: now
      };
      await Promise.all([
        env.DCLONE_STATE.put(`${KEY_USER_PREFIX}${userId}`, JSON.stringify(user)),
        env.DCLONE_STATE.put(`${KEY_IDX_GOOGLE_PREFIX}${googleSub}`, userId),
        email ? env.DCLONE_STATE.put(`${KEY_IDX_EMAIL_PREFIX}${email}`, userId) : Promise.resolve(),
        registerUserInDirectory(env, userId)
      ]);
    }

    const { cookieHeader } = await createSession(env, request, user, "google");
    return authRedirect(appendQueryToReturnTo(returnTo, "auth", "google_ok"), {
      "set-cookie": [clearOAuthCookie, cookieHeader]
    });
  } catch (err) {
    console.error("Google OAuth 回调失败", err);
    return authRedirect(appendQueryToReturnTo(returnTo, "auth_error", "google_exchange_error"), {
      "set-cookie": clearOAuthCookie
    });
  }
}

function sanitizeSkillsMap(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out = {};
  for (const [cid, clsBuild] of Object.entries(raw)) {
    if (!VALID_CLASS_IDS.has(cid)) continue;
    if (!clsBuild || typeof clsBuild !== "object" || Array.isArray(clsBuild)) continue;
    const cleanBuild = {};
    for (const [skKey, pts] of Object.entries(clsBuild)) {
      if (typeof skKey !== "string" || !skKey || skKey.length > 64) continue;
      const n = Math.floor(Number(pts));
      if (Number.isFinite(n) && n > 0 && n <= 20) {
        cleanBuild[skKey] = n;
      }
    }
    out[cid] = cleanBuild;
  }
  return out;
}

function sanitizeSingleClassSkills(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out = {};
  for (const [skKey, pts] of Object.entries(raw)) {
    if (typeof skKey !== "string" || !skKey || skKey.length > 64) continue;
    const n = Math.floor(Number(pts));
    if (Number.isFinite(n) && n > 0 && n <= 20) {
      out[skKey] = n;
    }
  }
  return out;
}

function sanitizePaperdollMap(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out = {};
  for (const [cid, state] of Object.entries(raw)) {
    if (!VALID_CLASS_IDS.has(cid)) continue;
    if (!state || typeof state !== "object" || Array.isArray(state)) continue;
    out[cid] = state;
  }
  return out;
}

function sanitizePresetsArray(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  const seen = new Set();
  for (const item of raw) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    if (out.length >= MAX_PRESETS) break;
    const id = String(item.id || "").trim().slice(0, 64);
    const classId = String(item.classId || "").trim();
    const name = String(item.name || "")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .trim()
      .slice(0, 48);
    if (!id || seen.has(id) || !VALID_CLASS_IDS.has(classId) || !name) continue;
    seen.add(id);
    out.push({
      id,
      name,
      classId,
      skills: sanitizeSingleClassSkills(item.skills),
      paperdoll:
        item.paperdoll && typeof item.paperdoll === "object" && !Array.isArray(item.paperdoll)
          ? item.paperdoll
          : null,
      updatedAt:
        typeof item.updatedAt === "string" && item.updatedAt
          ? item.updatedAt
          : new Date().toISOString()
    });
  }
  return out;
}

function sanitizeStringIdList(raw, maxItems = 600, maxLen = 120) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  const seen = new Set();
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const cleaned = item.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, maxLen);
    if (!cleaned || seen.has(cleaned)) continue;
    seen.add(cleaned);
    out.push(cleaned);
    if (out.length >= maxItems) break;
  }
  return out;
}

function sanitizeGrailObject(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { uniques: [], setPieces: [] };
  }
  return {
    uniques: sanitizeStringIdList(raw.uniques, 600, 120),
    setPieces: sanitizeStringIdList(raw.setPieces, 300, 120)
  };
}

async function getStoredUserBuilds(env, userId) {
  const existing = await env.DCLONE_STATE.get(`${KEY_BUILDS_PREFIX}${userId}`, "json");
  if (!existing || typeof existing !== "object") return null;
  return {
    version: 1,
    updatedAt: existing.updatedAt || null,
    activeClassId: VALID_CLASS_IDS.has(existing.activeClassId) ? existing.activeClassId : "",
    skills: sanitizeSkillsMap(existing.skills),
    paperdoll: sanitizePaperdollMap(existing.paperdoll),
    presets: sanitizePresetsArray(existing.presets),
    grail: sanitizeGrailObject(existing.grail),
    runewords: sanitizeStringIdList(existing.runewords, 200, 80)
  };
}

async function handleGetBuilds(request, env) {
  const auth = await getAuthenticatedUser(request, env);
  if (!auth) return authJson({ ok: false, error: "请先登录账号" }, 401);
  const data = await getStoredUserBuilds(env, auth.user.id);
  return authJson({ ok: true, data });
}

async function handlePutBuilds(request, env) {
  const auth = await getAuthenticatedUser(request, env);
  if (!auth) return authJson({ ok: false, error: "请先登录账号" }, 401);

  const parsed = await readJsonBody(request, MAX_JSON_BODY_BYTES);
  if (!parsed.ok) return authJson({ ok: false, error: parsed.error }, parsed.status);

  const existing = (await getStoredUserBuilds(env, auth.user.id)) || {
    version: 1,
    updatedAt: null,
    activeClassId: "",
    skills: {},
    paperdoll: {},
    presets: [],
    grail: { uniques: [], setPieces: [] },
    runewords: []
  };

  const now = new Date().toISOString();
  const next = {
    version: 1,
    updatedAt: now,
    activeClassId: VALID_CLASS_IDS.has(parsed.data.activeClassId)
      ? parsed.data.activeClassId
      : existing.activeClassId || "",
    skills:
      parsed.data.skills !== undefined
        ? sanitizeSkillsMap(parsed.data.skills)
        : existing.skills,
    paperdoll:
      parsed.data.paperdoll !== undefined
        ? sanitizePaperdollMap(parsed.data.paperdoll)
        : existing.paperdoll,
    presets:
      parsed.data.presets !== undefined
        ? sanitizePresetsArray(parsed.data.presets)
        : existing.presets,
    grail:
      parsed.data.grail !== undefined
        ? sanitizeGrailObject(parsed.data.grail)
        : existing.grail,
    runewords:
      parsed.data.runewords !== undefined
        ? sanitizeStringIdList(parsed.data.runewords, 200, 80)
        : existing.runewords
  };

  const serialized = JSON.stringify(next);
  if (new TextEncoder().encode(serialized).length > MAX_JSON_BODY_BYTES) {
    return authJson({ ok: false, error: "存档总容量超过上限（512 KB）" }, 413);
  }

  await env.DCLONE_STATE.put(`${KEY_BUILDS_PREFIX}${auth.user.id}`, serialized);
  return authJson({
    ok: true,
    updatedAt: now,
    presetCount: next.presets.length,
    grailCount: next.grail.uniques.length + next.grail.setPieces.length,
    runewordsCount: next.runewords.length
  });
}

async function handleSavePreset(request, env) {
  const auth = await getAuthenticatedUser(request, env);
  if (!auth) return authJson({ ok: false, error: "请先登录账号" }, 401);

  const parsed = await readJsonBody(request, 256 * 1024);
  if (!parsed.ok) return authJson({ ok: false, error: parsed.error }, parsed.status);

  const classId = String(parsed.data.classId || "").trim();
  if (!VALID_CLASS_IDS.has(classId)) {
    return authJson({ ok: false, error: "无效的职业标识" }, 400);
  }
  const name = String(parsed.data.name || "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, 48);
  if (!name) {
    return authJson({ ok: false, error: "请填写方案名称" }, 400);
  }

  const existing = (await getStoredUserBuilds(env, auth.user.id)) || {
    version: 1,
    updatedAt: null,
    activeClassId: classId,
    skills: {},
    paperdoll: {},
    presets: []
  };

  const now = new Date().toISOString();
  const reqId = String(parsed.data.id || "").trim().slice(0, 64);
  const existingIdx = reqId ? existing.presets.findIndex((p) => p.id === reqId) : -1;
  if (existingIdx < 0 && existing.presets.length >= MAX_PRESETS) {
    return authJson({ ok: false, error: `最多保存 ${MAX_PRESETS} 套云端方案，请先删除旧方案` }, 400);
  }

  const preset = {
    id: existingIdx >= 0 ? reqId : `preset-${crypto.randomUUID()}`,
    name,
    classId,
    skills: sanitizeSingleClassSkills(parsed.data.skills),
    paperdoll:
      parsed.data.paperdoll &&
      typeof parsed.data.paperdoll === "object" &&
      !Array.isArray(parsed.data.paperdoll)
        ? parsed.data.paperdoll
        : null,
    updatedAt: now
  };

  const presets = [...existing.presets];
  if (existingIdx >= 0) {
    presets[existingIdx] = preset;
  } else {
    presets.unshift(preset);
  }

  const next = {
    ...existing,
    updatedAt: now,
    presets
  };
  const serialized = JSON.stringify(next);
  if (new TextEncoder().encode(serialized).length > MAX_JSON_BODY_BYTES) {
    return authJson({ ok: false, error: "存档总容量超过上限（512 KB）" }, 413);
  }

  await env.DCLONE_STATE.put(`${KEY_BUILDS_PREFIX}${auth.user.id}`, serialized);
  return authJson({ ok: true, preset, presets, updatedAt: now }, existingIdx >= 0 ? 200 : 201);
}

async function handleDeletePreset(request, env, presetId) {
  const auth = await getAuthenticatedUser(request, env);
  if (!auth) return authJson({ ok: false, error: "请先登录账号" }, 401);

  const existing = await getStoredUserBuilds(env, auth.user.id);
  if (!existing) {
    return authJson({ ok: true, presets: [], updatedAt: new Date().toISOString() });
  }

  const nextPresets = existing.presets.filter((p) => p.id !== presetId);
  const now = new Date().toISOString();
  const next = {
    ...existing,
    updatedAt: now,
    presets: nextPresets
  };
  await env.DCLONE_STATE.put(`${KEY_BUILDS_PREFIX}${auth.user.id}`, JSON.stringify(next));
  return authJson({ ok: true, presets: nextPresets, updatedAt: now });
}

async function handleUpdateUserProfile(request, env) {
  const auth = await getAuthenticatedUser(request, env);
  if (!auth) return authJson({ ok: false, error: "请先登录账号" }, 401);

  const parsed = await readJsonBody(request, 4096);
  if (!parsed.ok) return authJson({ ok: false, error: parsed.error }, parsed.status);

  const rawName = String(parsed.data.displayName ?? "").replace(/[\u0000-\u001F\u007F]/g, "").trim();
  if (!rawName) {
    return authJson({ ok: false, error: "昵称不能为空" }, 400);
  }
  const cleanName = sanitizeDisplayName(rawName, "");
  if (!cleanName) {
    return authJson({ ok: false, error: "请输入有效的昵称（1–32 个字符）" }, 400);
  }

  const user = auth.user;
  user.displayName = cleanName;
  user.updatedAt = new Date().toISOString();
  await env.DCLONE_STATE.put(`${KEY_USER_PREFIX}${user.id}`, JSON.stringify(user));

  return authJson({
    ok: true,
    user: toPublicUser(user, auth.authMethod)
  });
}

async function checkResetRateLimit(request, env, accountKey) {
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for") ||
    "local";
  const rlKey = `${KEY_RL_RESET_PREFIX}${await sha256Hex(`${ip}:${accountKey}`)}`;
  const raw = await env.DCLONE_STATE.get(rlKey, "json");
  const count = Number(raw?.count || 0);
  return { rlKey, count, blocked: count >= RESET_RL_MAX_ATTEMPTS };
}

async function handleResetPassword(request, env) {
  const parsed = await readJsonBody(request, 16 * 1024);
  if (!parsed.ok) return authJson({ ok: false, error: parsed.error }, parsed.status);

  const rawAccount = String(
    parsed.data.account ?? parsed.data.username ?? parsed.data.email ?? ""
  )
    .trim()
    .toLowerCase();
  const rawCode = String(parsed.data.code ?? parsed.data.recoveryCode ?? "").trim();
  if (!rawAccount || !rawCode) {
    return authJson({ ok: false, error: "请输入账号和恢复码 / 应急重置码" }, 400);
  }

  const pw = validatePasswordInput(parsed.data.newPassword ?? parsed.data.password);
  if (!pw.ok) return authJson({ ok: false, error: pw.error }, 400);

  const rl = await checkResetRateLimit(request, env, rawAccount);
  if (rl.blocked) {
    return authJson({ ok: false, error: "尝试次数过多，请 10 分钟后再试" }, 429);
  }

  const codeHash = await hashRecoveryCode(rawCode);
  const user = await findUserByAccount(env, rawAccount);
  if (!user || !codeHash) {
    await recordLoginFailure(env, rl.rlKey, rl.count);
    return authJson({ ok: false, error: "账号或恢复码无效 / 已过期" }, 401);
  }
  if (user.disabled) {
    return authJson({ ok: false, error: "该账号已被管理员禁用，请联系站长" }, 403);
  }

  let matched = false;
  let usedAdminCode = false;

  // 1) Check Admin 15-min one-time emergency reset code
  const adminKey = `${KEY_ADMIN_RESET_PREFIX}${codeHash}`;
  const adminRec = await env.DCLONE_STATE.get(adminKey, "json");
  if (adminRec && adminRec.userId === user.id) {
    const expired = adminRec.expiresAt && Date.parse(adminRec.expiresAt) <= Date.now();
    await kvDelete(env.DCLONE_STATE, adminKey);
    if (!expired) {
      matched = true;
      usedAdminCode = true;
    }
  }

  // 2) Check user's own one-time recovery codes
  if (!matched && Array.isArray(user.recoveryCodeHashes) && user.recoveryCodeHashes.length) {
    let matchedIdx = -1;
    for (let i = 0; i < user.recoveryCodeHashes.length; i += 1) {
      if (timingSafeEqualStrings(user.recoveryCodeHashes[i], codeHash)) {
        matchedIdx = i;
      }
    }
    if (matchedIdx >= 0) {
      matched = true;
      user.recoveryCodeHashes = user.recoveryCodeHashes.filter((_, i) => i !== matchedIdx);
    }
  }

  if (!matched) {
    await recordLoginFailure(env, rl.rlKey, rl.count);
    return authJson({ ok: false, error: "账号或恢复码无效 / 已过期" }, 401);
  }

  if (rl.count > 0) {
    await kvDelete(env.DCLONE_STATE, rl.rlKey);
  }

  const now = new Date().toISOString();
  user.passwordHash = await hashPassword(pw.password);
  const provs = new Set(Array.isArray(user.providers) ? user.providers : []);
  provs.add("password");
  user.providers = [...provs];
  user.sessionVersion = Number(user.sessionVersion || 1) + 1;
  user.updatedAt = now;

  // Auto-replenish 5 fresh recovery codes if user just spent their last one or used an admin code with 0 left
  let freshRecoveryCodes = null;
  if (!Array.isArray(user.recoveryCodeHashes) || user.recoveryCodeHashes.length === 0 || usedAdminCode) {
    freshRecoveryCodes = await issueFreshRecoveryCodes(user);
  }

  await env.DCLONE_STATE.put(`${KEY_USER_PREFIX}${user.id}`, JSON.stringify(user));

  const { cookieHeader } = await createSession(env, request, user, "recovery");
  return authJson(
    {
      ok: true,
      user: toPublicUser(user, "recovery"),
      usedAdminCode,
      autoRegenerated: Boolean(freshRecoveryCodes),
      recoveryCodes: freshRecoveryCodes,
      googleEnabled: isGoogleOAuthConfigured(env)
    },
    200,
    { "set-cookie": cookieHeader }
  );
}

async function handleChangePassword(request, env) {
  const auth = await getAuthenticatedUser(request, env);
  if (!auth) return authJson({ ok: false, error: "请先登录账号" }, 401);

  const parsed = await readJsonBody(request, 16 * 1024);
  if (!parsed.ok) return authJson({ ok: false, error: parsed.error }, parsed.status);

  const pw = validatePasswordInput(parsed.data.newPassword ?? parsed.data.password);
  if (!pw.ok) return authJson({ ok: false, error: pw.error }, 400);

  const { user, authMethod } = auth;
  const needCurrent = Boolean(user.passwordHash) && authMethod !== "google";
  if (needCurrent) {
    const currentPassword =
      typeof parsed.data.currentPassword === "string" ? parsed.data.currentPassword : "";
    if (!currentPassword) {
      return authJson({ ok: false, error: "请输入当前登录密码" }, 400);
    }
    const okCur = await verifyPassword(currentPassword, user.passwordHash);
    if (!okCur) {
      return authJson({ ok: false, error: "当前登录密码不正确" }, 401);
    }
  }

  user.passwordHash = await hashPassword(pw.password);
  const provs = new Set(Array.isArray(user.providers) ? user.providers : []);
  provs.add("password");
  user.providers = [...provs];
  user.sessionVersion = Number(user.sessionVersion || 1) + 1;
  user.updatedAt = new Date().toISOString();

  let freshRecoveryCodes = null;
  if (!Array.isArray(user.recoveryCodeHashes) || user.recoveryCodeHashes.length === 0) {
    freshRecoveryCodes = await issueFreshRecoveryCodes(user);
  }

  await env.DCLONE_STATE.put(`${KEY_USER_PREFIX}${user.id}`, JSON.stringify(user));

  // Issue a fresh session for current device while invalidating all old sessions via sessionVersion bump
  await kvDelete(env.DCLONE_STATE, `${KEY_SESS_PREFIX}${auth.tokenHash}`);
  const { cookieHeader } = await createSession(env, request, user, authMethod);
  return authJson(
    {
      ok: true,
      user: toPublicUser(user, authMethod),
      recoveryCodes: freshRecoveryCodes
    },
    200,
    { "set-cookie": cookieHeader }
  );
}

async function handleRegenerateRecoveryCodes(request, env) {
  const auth = await getAuthenticatedUser(request, env);
  if (!auth) return authJson({ ok: false, error: "请先登录账号" }, 401);

  const { user, authMethod } = auth;
  const recoveryCodes = await issueFreshRecoveryCodes(user);
  user.updatedAt = new Date().toISOString();
  await env.DCLONE_STATE.put(`${KEY_USER_PREFIX}${user.id}`, JSON.stringify(user));
  return authJson({
    ok: true,
    user: toPublicUser(user, authMethod),
    recoveryCodes,
    recoveryCodesRemaining: recoveryCodes.length
  });
}

async function handleAdminGenerateResetToken(request, env) {
  const adminSession = await getAuthenticatedAdmin(request, env);
  const authHeader = request.headers.get("authorization") || "";
  const tokenAuthorized =
    Boolean(env?.MANUAL_TRIGGER_TOKEN) &&
    timingSafeEqualStrings(authHeader, `Bearer ${env.MANUAL_TRIGGER_TOKEN}`);

  if (!adminSession && !tokenAuthorized) {
    if (!env?.MANUAL_TRIGGER_TOKEN && !authHeader) {
      return authJson({ ok: false, error: "需要管理员登录或管理令牌权限" }, 401);
    }
    return authJson({ ok: false, error: "管理令牌未授权" }, 401);
  }

  const parsed = await readJsonBody(request, 16 * 1024);
  if (!parsed.ok) return authJson({ ok: false, error: parsed.error }, parsed.status);

  const rawAccount = String(
    parsed.data.account ?? parsed.data.username ?? parsed.data.email ?? ""
  )
    .trim()
    .toLowerCase();
  if (!rawAccount) {
    return authJson({ ok: false, error: "请输入需要重置的账号或邮箱" }, 400);
  }

  const user = await findUserByAccount(env, rawAccount);
  if (!user) {
    return authJson({ ok: false, error: "未找到该账号" }, 404);
  }

  const payload = await createAdminResetCodeForUser(env, user);
  return authJson({ ok: true, ...payload });
}

export async function handleAuthOrUserRequest(request, env, url, fetchImpl = fetch) {
  const path = url.pathname;
  const isAuthPath = path.startsWith("/api/auth/");
  const isUserPath = path.startsWith("/api/user/");
  if (!isAuthPath && !isUserPath) return null;

  if (!env?.DCLONE_STATE) {
    return authJson({ ok: false, error: "云端存储未配置" }, 503);
  }

  // OAuth top-level redirects are initiated by navigation (and callback comes cross-site from Google)
  if (request.method === "GET" && path === "/api/auth/google/start") {
    return handleGoogleStart(request, env, url);
  }
  if (request.method === "GET" && path === "/api/auth/google/callback") {
    return handleGoogleCallback(request, env, url, fetchImpl);
  }

  // Reject cross-site requests before any auth/KV lookups (Fetch Metadata + Origin)
  if (!checkSameOriginCsrf(request, url)) {
    return authJson({ ok: false, error: "禁止跨站请求" }, 403);
  }

  if (request.method === "GET" && path === "/api/auth/me") {
    await ensureBootstrapAdmin(env);
    const [auth, adminIds] = await Promise.all([
      getAuthenticatedUser(request, env),
      getAdminIds(env)
    ]);
    return authJson({
      ok: true,
      authenticated: Boolean(auth),
      adminInitialized: adminIds.length > 0,
      googleEnabled: isGoogleOAuthConfigured(env),
      user: auth ? toPublicUser(auth.user, auth.authMethod) : null
    });
  }

  if (request.method === "POST" && path === "/api/auth/register") {
    return handleRegister(request, env);
  }
  if (request.method === "POST" && path === "/api/auth/login") {
    return handleLogin(request, env);
  }
  if (request.method === "POST" && path === "/api/auth/logout") {
    return handleLogout(request, env);
  }
  if (request.method === "POST" && path === "/api/auth/reset-password") {
    return handleResetPassword(request, env);
  }
  if (request.method === "POST" && path === "/api/auth/change-password") {
    return handleChangePassword(request, env);
  }
  if (request.method === "POST" && path === "/api/auth/recovery-codes/regenerate") {
    return handleRegenerateRecoveryCodes(request, env);
  }
  if (request.method === "POST" && path === "/api/auth/admin/reset-token") {
    return handleAdminGenerateResetToken(request, env);
  }

  if ((request.method === "PATCH" || request.method === "POST") && path === "/api/user/profile") {
    return handleUpdateUserProfile(request, env);
  }
  if (request.method === "GET" && path === "/api/user/builds") {
    return handleGetBuilds(request, env);
  }
  if (request.method === "PUT" && path === "/api/user/builds") {
    return handlePutBuilds(request, env);
  }
  if (request.method === "POST" && path === "/api/user/presets") {
    return handleSavePreset(request, env);
  }
  if (request.method === "DELETE" && path.startsWith("/api/user/presets/")) {
    let presetId = "";
    try {
      presetId = decodeURIComponent(path.slice("/api/user/presets/".length));
    } catch {
      return authJson({ ok: false, error: "无效的方案 ID" }, 400);
    }
    if (!presetId) return authJson({ ok: false, error: "缺少方案 ID" }, 400);
    return handleDeletePreset(request, env, presetId);
  }

  return authJson({ ok: false, error: "不支持的认证接口" }, 404);
}

export {
  KEY_USER_PREFIX,
  KEY_IDX_USERNAME_PREFIX,
  KEY_IDX_EMAIL_PREFIX,
  KEY_IDX_GOOGLE_PREFIX,
  KEY_BUILDS_PREFIX,
  kvDelete,
  authJson,
  readJsonBody,
  toPublicUser,
  issueFreshRecoveryCodes,
  getUserById,
  findUserByAccount,
  createSession,
  getAuthenticatedUser,
  getAdminIds,
  saveAdminIds,
  getUserDirectoryIds,
  registerUserInDirectory,
  mergeUsersIntoDirectory,
  removeUserFromDirectory,
  ensureBootstrapAdmin,
  createAdminResetCodeForUser,
  getStoredUserBuilds
};
