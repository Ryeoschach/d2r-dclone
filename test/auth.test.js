import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import worker from "../src/index.js";
import { handleAuthOrUserRequest } from "../src/auth.js";
import { renderDashboard } from "../src/dashboard.js";

function createAuthEnv(extra = {}) {
  const store = new Map();
  return {
    MANUAL_TRIGGER_TOKEN: "test-token",
    DCLONE_STATE: {
      async get(key, type) {
        const val = store.get(key);
        if (val === undefined) return null;
        return type === "json" ? JSON.parse(val) : val;
      },
      async put(key, value) {
        store.set(key, String(value));
      },
      async delete(key) {
        store.delete(key);
      },
      async list({ prefix = "" } = {}) {
        const keys = [...store.keys()]
          .filter((k) => k.startsWith(prefix))
          .map((name) => ({ name }));
        return { keys, list_complete: true };
      }
    },
    _store: store,
    ...extra
  };
}

function getSetCookies(response) {
  if (typeof response.headers.getSetCookie === "function") {
    return response.headers.getSetCookie();
  }
  const single = response.headers.get("set-cookie");
  return single ? [single] : [];
}

function extractCookiePair(response, cookieName) {
  for (const raw of getSetCookies(response)) {
    const first = raw.split(";")[0].trim();
    if (first.startsWith(`${cookieName}=`)) {
      return { pair: first, raw };
    }
  }
  return null;
}

test("账号密码注册、登录、会话校验与退出登录流程（含 __Host- 安全 Cookie）", async () => {
  const env = createAuthEnv();

  // 未登录状态检查
  const meGuest = await worker.fetch(new Request("https://d2r.example/api/auth/me"), env);
  assert.equal(meGuest.status, 200);
  const meGuestJson = await meGuest.json();
  assert.equal(meGuestJson.authenticated, false);
  assert.equal(meGuestJson.googleEnabled, false);
  assert.equal(meGuestJson.user, null);

  // 密码过短拒绝
  const shortPwRes = await worker.fetch(
    new Request("https://d2r.example/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ account: "paladin01", password: "123" })
    }),
    env
  );
  assert.equal(shortPwRes.status, 400);

  // 正常注册
  const regRes = await worker.fetch(
    new Request("https://d2r.example/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        account: "圣骑士_Hero",
        displayName: "双梦圣骑",
        password: "StrongPassword123!"
      })
    }),
    env
  );
  assert.equal(regRes.status, 201);
  const regJson = await regRes.json();
  assert.equal(regJson.ok, true);
  assert.equal(regJson.user.displayName, "双梦圣骑");
  assert.equal(regJson.user.username, "圣骑士_hero");
  assert.equal("passwordHash" in regJson.user, false);

  const sessionCookie = extractCookiePair(regRes, "__Host-d2r_session");
  assert.ok(sessionCookie, "HTTPS 响应应签发 __Host-d2r_session");
  assert.match(sessionCookie.raw, /HttpOnly/i);
  assert.match(sessionCookie.raw, /Secure/i);
  assert.match(sessionCookie.raw, /SameSite=Lax/i);
  assert.match(sessionCookie.raw, /Path=\//i);
  assert.doesNotMatch(sessionCookie.raw, /Domain=/i);

  // 重复账号注册返回 409
  const dupRes = await worker.fetch(
    new Request("https://d2r.example/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ account: "圣骑士_hero", password: "AnotherPassword123!" })
    }),
    env
  );
  assert.equal(dupRes.status, 409);

  // 携带 Cookie 验证 /api/auth/me
  const meAuth = await worker.fetch(
    new Request("https://d2r.example/api/auth/me", {
      headers: { cookie: sessionCookie.pair }
    }),
    env
  );
  const meAuthJson = await meAuth.json();
  assert.equal(meAuthJson.authenticated, true);
  assert.equal(meAuthJson.user.id, regJson.user.id);

  // 错误密码登录失败
  const badLogin = await worker.fetch(
    new Request("https://d2r.example/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ account: "圣骑士_hero", password: "WrongPassword!" })
    }),
    env
  );
  assert.equal(badLogin.status, 401);

  // 退出登录应吊销 KV 会话并清理 Cookie
  const logoutRes = await worker.fetch(
    new Request("https://d2r.example/api/auth/logout", {
      method: "POST",
      headers: { cookie: sessionCookie.pair }
    }),
    env
  );
  assert.equal(logoutRes.status, 200);
  assert.equal(logoutRes.headers.get("clear-site-data"), '"cookies"');

  const meAfterLogout = await worker.fetch(
    new Request("https://d2r.example/api/auth/me", {
      headers: { cookie: sessionCookie.pair }
    }),
    env
  );
  assert.equal((await meAfterLogout.json()).authenticated, false);

  // 正确密码重新登录成功
  const reloginRes = await worker.fetch(
    new Request("https://d2r.example/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ account: "圣骑士_Hero", password: "StrongPassword123!" })
    }),
    env
  );
  assert.equal(reloginRes.status, 200);
  assert.ok(extractCookiePair(reloginRes, "__Host-d2r_session"));
});

test("云端技能与装备存档读写、命名方案增删与跨账号隔离", async () => {
  const env = createAuthEnv();

  // 未登录访问返回 401
  const unauthGet = await worker.fetch(new Request("https://d2r.example/api/user/builds"), env);
  assert.equal(unauthGet.status, 401);

  // 注册用户 A 与用户 B
  const regA = await worker.fetch(
    new Request("https://d2r.example/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ account: "userA@example.com", password: "PasswordA123!" })
    }),
    env
  );
  const cookieA = extractCookiePair(regA, "__Host-d2r_session").pair;

  const regB = await worker.fetch(
    new Request("https://d2r.example/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ account: "userB@example.com", password: "PasswordB123!" })
    }),
    env
  );
  const cookieB = extractCookiePair(regB, "__Host-d2r_session").pair;

  // 用户 A 保存技能与纸娃娃装备（含非法职业与越界点数应自动清洗）
  const putRes = await worker.fetch(
    new Request("https://d2r.example/api/user/builds", {
      method: "PUT",
      headers: { "content-type": "application/json", cookie: cookieA },
      body: JSON.stringify({
        activeClassId: "pal",
        skills: {
          pal: { Fanaticism: 20, "Holy Shield": 20, InvalidHigh: 99 },
          evilClass: { Hack: 20 }
        },
        paperdoll: {
          pal: {
            charLvl: 93,
            charLoadout: {
              weapon: { cat: "rw", id: "grief", baseCode: "7cr" },
              offhand: { cat: "rw", id: "exile", baseCode: "pab", eth: true, palModType: "res", palRes: 45 }
            }
          }
        }
      })
    }),
    env
  );
  assert.equal(putRes.status, 200);
  const putJson = await putRes.json();
  assert.equal(putJson.ok, true);
  assert.ok(putJson.updatedAt);

  // 用户 A 保存一套命名方案
  const presetRes = await worker.fetch(
    new Request("https://d2r.example/api/user/presets", {
      method: "POST",
      headers: { "content-type": "application/json", cookie: cookieA },
      body: JSON.stringify({
        name: "盾击 6Boss 圣骑士",
        classId: "pal",
        skills: { Fanaticism: 20, Smite: 20, "Holy Shield": 20 },
        paperdoll: { charLvl: 93, charAura: "fana-20" }
      })
    }),
    env
  );
  assert.equal(presetRes.status, 201);
  const presetJson = await presetRes.json();
  assert.equal(presetJson.presets.length, 1);
  const presetId = presetJson.preset.id;

  // 再次 PUT /api/user/builds（不带 presets）不应覆盖已保存的 presets
  const putAgain = await worker.fetch(
    new Request("https://d2r.example/api/user/builds", {
      method: "PUT",
      headers: { "content-type": "application/json", cookie: cookieA },
      body: JSON.stringify({
        activeClassId: "pal",
        skills: { pal: { Fanaticism: 20, Zeal: 20 } }
      })
    }),
    env
  );
  assert.equal(putAgain.status, 200);

  // 读取用户 A 存档校验
  const getA = await worker.fetch(
    new Request("https://d2r.example/api/user/builds", { headers: { cookie: cookieA } }),
    env
  );
  const dataA = (await getA.json()).data;
  assert.equal(dataA.activeClassId, "pal");
  assert.deepEqual(dataA.skills.pal, { Fanaticism: 20, Zeal: 20 });
  assert.equal(dataA.skills.evilClass, undefined);
  assert.equal(dataA.paperdoll.pal.charLoadout.offhand.palRes, 45);
  assert.equal(dataA.presets.length, 1);
  assert.equal(dataA.presets[0].name, "盾击 6Boss 圣骑士");

  // 用户 B 无法看到用户 A 的存档
  const getB = await worker.fetch(
    new Request("https://d2r.example/api/user/builds", { headers: { cookie: cookieB } }),
    env
  );
  assert.equal((await getB.json()).data, null);

  // 删除用户 A 的方案
  const delRes = await worker.fetch(
    new Request(`https://d2r.example/api/user/presets/${encodeURIComponent(presetId)}`, {
      method: "DELETE",
      headers: { cookie: cookieA }
    }),
    env
  );
  assert.equal(delRes.status, 200);
  assert.equal((await delRes.json()).presets.length, 0);
});

test("Google OAuth 2.0 PKCE 授权、防重放、防开放重定向与同邮箱账号自动合并", async () => {
  const env = createAuthEnv({
    GOOGLE_CLIENT_ID: "google-client-id-test",
    GOOGLE_CLIENT_SECRET: "google-client-secret-test"
  });

  // 先用邮箱密码注册账号，测试后续 Google 登录同邮箱自动绑定
  const regEmail = await worker.fetch(
    new Request("https://d2r.example/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        account: "sanctuary@gmail.com",
        displayName: "原邮箱玩家",
        password: "MySecurePassword123!"
      })
    }),
    env
  );
  const origUser = (await regEmail.json()).user;

  // /api/auth/me 显示已启用 Google 登录
  const meRes = await worker.fetch(new Request("https://d2r.example/api/auth/me"), env);
  assert.equal((await meRes.json()).googleEnabled, true);

  // 发起 Google 登录（故意传入恶意 returnTo 测试防开放重定向）
  const startUrl = new URL("https://d2r.example/api/auth/google/start?returnTo=https://evil.com/phish");
  const startRes = await handleAuthOrUserRequest(new Request(startUrl), env, startUrl);
  assert.equal(startRes.status, 302);
  const loc = new URL(startRes.headers.get("location"));
  assert.equal(loc.origin, "https://accounts.google.com");
  assert.equal(loc.searchParams.get("client_id"), "google-client-id-test");
  assert.equal(loc.searchParams.get("code_challenge_method"), "S256");
  assert.ok(loc.searchParams.get("code_challenge"));
  const state = loc.searchParams.get("state");
  assert.ok(state);
  const oauthCookie = extractCookiePair(startRes, "__Host-d2r_oauth");
  assert.ok(oauthCookie);

  // Mock Google Token + UserInfo 接口
  const mockFetch = async (url, init) => {
    if (String(url).includes("oauth2.googleapis.com/token")) {
      assert.match(String(init.body), /code_verifier=/);
      return new Response(JSON.stringify({ access_token: "mock-google-access-token" }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }
    if (String(url).includes("openidconnect.googleapis.com/v1/userinfo")) {
      return new Response(
        JSON.stringify({
          sub: "google-sub-999888",
          email: "sanctuary@gmail.com",
          email_verified: true,
          name: "Google Sanctuary",
          picture: "https://lh3.googleusercontent.com/avatar.png"
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }
    throw new Error(`Unexpected fetch: ${url}`);
  };

  // 回调校验：错误 state 应拒绝
  const badCbUrl = new URL(`https://d2r.example/api/auth/google/callback?code=abc&state=wrong-state`);
  const badCb = await handleAuthOrUserRequest(
    new Request(badCbUrl, { headers: { cookie: oauthCookie.pair } }),
    env,
    badCbUrl,
    mockFetch
  );
  assert.equal(badCb.status, 302);
  assert.match(badCb.headers.get("location"), /auth_error=google_state_invalid/);

  // 回调校验：正常完成登录并合并原邮箱账号，且恶意 returnTo 已回退到 /
  const cbUrl = new URL(`https://d2r.example/api/auth/google/callback?code=auth-code-123&state=${encodeURIComponent(state)}`);
  const cbRes = await handleAuthOrUserRequest(
    new Request(cbUrl, { headers: { cookie: oauthCookie.pair } }),
    env,
    cbUrl,
    mockFetch
  );
  assert.equal(cbRes.status, 302);
  assert.equal(cbRes.headers.get("location"), "/?auth=google_ok");

  const sessCookie = extractCookiePair(cbRes, "__Host-d2r_session");
  assert.ok(sessCookie, "Google 登录成功后应签发会话 Cookie");

  const meAfterGoogle = await worker.fetch(
    new Request("https://d2r.example/api/auth/me", { headers: { cookie: sessCookie.pair } }),
    env
  );
  const meAfterJson = await meAfterGoogle.json();
  assert.equal(meAfterJson.authenticated, true);
  assert.equal(meAfterJson.user.id, origUser.id, "同已验证邮箱应自动合并为同一用户 ID");
  assert.deepEqual(meAfterJson.user.providers.sort(), ["google", "password"]);
  assert.equal(meAfterJson.user.avatarUrl, "https://lh3.googleusercontent.com/avatar.png");

  // 同一 state 重放必须失效
  const replayRes = await handleAuthOrUserRequest(
    new Request(cbUrl, { headers: { cookie: oauthCookie.pair } }),
    env,
    cbUrl,
    mockFetch
  );
  assert.equal(replayRes.status, 302);
  assert.match(replayRes.headers.get("location"), /auth_error=google_state_expired/);
});

test("Fetch Metadata 与 Origin 跨站防护（先于鉴权拒绝）及仪表盘安全响应头与脚本语法校验", async () => {
  const env = createAuthEnv();

  // 跨站 Sec-Fetch-Site 拒绝
  const crossSite = await worker.fetch(
    new Request("https://d2r.example/api/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "sec-fetch-site": "cross-site"
      },
      body: JSON.stringify({ account: "a", password: "b" })
    }),
    env
  );
  assert.equal(crossSite.status, 403);
  assert.match(crossSite.headers.get("vary") || "", /Sec-Fetch-Site/i);

  // 同站子域 same-site 亦拒绝（防止 *.workers.dev 邻居子域跨站调用）
  const sameSite = await worker.fetch(
    new Request("https://d2r.example/api/user/builds", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "sec-fetch-site": "same-site"
      },
      body: JSON.stringify({ skills: {} })
    }),
    env
  );
  assert.equal(sameSite.status, 403);

  // 跨源 Origin 拒绝
  const badOrigin = await worker.fetch(
    new Request("https://d2r.example/api/auth/logout", {
      method: "POST",
      headers: { origin: "https://evil.example" }
    }),
    env
  );
  assert.equal(badOrigin.status, 403);

  // 首页 HTML 响应头与原生 dialog/autofill 规范检查 + 客户端 JS 语法解析
  const htmlRes = await worker.fetch(new Request("https://d2r.example/"), env);
  assert.equal(htmlRes.status, 200);
  assert.equal(htmlRes.headers.get("x-frame-options"), "DENY");
  assert.equal(htmlRes.headers.get("cross-origin-opener-policy"), "same-origin-allow-popups");
  assert.equal(htmlRes.headers.get("cross-origin-resource-policy"), "same-origin");
  assert.match(htmlRes.headers.get("content-security-policy") || "", /frame-ancestors 'none'/);

  const html = renderDashboard();
  const dashboardCss = fs.readFileSync(new URL("../public/assets/dashboard.css", import.meta.url), "utf8");
  const dashboardJs = fs.readFileSync(new URL("../public/assets/dashboard.js", import.meta.url), "utf8");
  assert.match(html, /<dialog class="auth-dialog" id="auth-dialog" closedby="any" aria-labelledby="auth-dialog-title">/);
  assert.doesNotMatch(html, /id="auth-dialog"[^>]*role="dialog"/);
  assert.doesNotMatch(html, /id="auth-dialog"[^>]*aria-modal=/);
  assert.match(html, /autocomplete="current-password"/);
  assert.match(html, /autocomplete="new-password"/);
  assert.match(dashboardCss, /overscroll-behavior:\s*contain/);
  assert.match(html, /<link rel="stylesheet" href="\/assets\/dashboard\.css\?v=/);
  assert.match(html, /<script src="\/assets\/dashboard\.js\?v=[^"]+" defer><\/script>/);

  // 校验拆分后的前端主脚本无语法错误
  assert.doesNotThrow(() => new Function(dashboardJs), "主脚本 public/assets/dashboard.js 必须无 JS 语法错误");
});

test("方案 1：注册签发 5 个一次性恢复码、重置踢旧会话、用光自动补发新 5 个与手动重生成", async () => {
  const env = createAuthEnv();

  // 注册返回 5 个恢复码，且 KV 中绝不存明文恢复码
  const regRes = await worker.fetch(
    new Request("https://d2r.example/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ account: "recovery_pal", password: "InitPassword123!" })
    }),
    env
  );
  assert.equal(regRes.status, 201);
  const regJson = await regRes.json();
  assert.equal(regJson.recoveryCodes.length, 5);
  assert.equal(regJson.user.recoveryCodesRemaining, 5);
  for (const code of regJson.recoveryCodes) {
    assert.match(code, /^D2R-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/);
    for (const val of env._store.values()) {
      assert.equal(val.includes(code), false, "KV 严禁存储明文恢复码");
    }
  }
  const oldSessionCookie = extractCookiePair(regRes, "__Host-d2r_session").pair;

  // 使用第 1 个恢复码重置密码（忽略大小写与连字符）
  const reset1 = await worker.fetch(
    new Request("https://d2r.example/api/auth/reset-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        account: "recovery_pal",
        code: regJson.recoveryCodes[0].toLowerCase().replace(/-/g, " "),
        newPassword: "ResetPassword1!"
      })
    }),
    env
  );
  assert.equal(reset1.status, 200);
  const r1Json = await reset1.json();
  assert.equal(r1Json.user.recoveryCodesRemaining, 4);
  assert.equal(r1Json.autoRegenerated, false);
  assert.equal(r1Json.recoveryCodes, null);

  // 旧会话必须因 sessionVersion 递增立即失效
  const meOld = await worker.fetch(
    new Request("https://d2r.example/api/auth/me", { headers: { cookie: oldSessionCookie } }),
    env
  );
  assert.equal((await meOld.json()).authenticated, false);

  // 重放第 1 个恢复码必须被拒绝
  const replay1 = await worker.fetch(
    new Request("https://d2r.example/api/auth/reset-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        account: "recovery_pal",
        code: regJson.recoveryCodes[0],
        newPassword: "ReplayPassword1!"
      })
    }),
    env
  );
  assert.equal(replay1.status, 401);

  // 依次用完剩余第 2、3、4、5 个恢复码，用完最后 1 个时必须自动补发全新 5 个
  let lastResJson = null;
  let latestCookie = null;
  for (let i = 1; i < 5; i += 1) {
    const res = await worker.fetch(
      new Request("https://d2r.example/api/auth/reset-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          account: "recovery_pal",
          code: regJson.recoveryCodes[i],
          newPassword: `ResetPassword${i + 1}!`
        })
      }),
      env
    );
    assert.equal(res.status, 200);
    lastResJson = await res.json();
    latestCookie = extractCookiePair(res, "__Host-d2r_session").pair;
  }
  assert.equal(lastResJson.autoRegenerated, true, "用光第 5 个恢复码时必须自动补发新一批");
  assert.equal(lastResJson.recoveryCodes.length, 5);
  assert.equal(lastResJson.user.recoveryCodesRemaining, 5);

  // 手动重新生成新恢复码应作废旧批次
  const regenRes = await worker.fetch(
    new Request("https://d2r.example/api/auth/recovery-codes/regenerate", {
      method: "POST",
      headers: { cookie: latestCookie }
    }),
    env
  );
  assert.equal(regenRes.status, 200);
  const regenJson = await regenRes.json();
  assert.equal(regenJson.recoveryCodes.length, 5);

  const oldBatchAfterRegen = await worker.fetch(
    new Request("https://d2r.example/api/auth/reset-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        account: "recovery_pal",
        code: lastResJson.recoveryCodes[0],
        newPassword: "ShouldFail123!"
      })
    }),
    env
  );
  assert.equal(oldBatchAfterRegen.status, 401);

  // 登录后改密：密码登录必须校验当前密码
  const badChange = await worker.fetch(
    new Request("https://d2r.example/api/auth/change-password", {
      method: "POST",
      headers: { "content-type": "application/json", cookie: latestCookie },
      body: JSON.stringify({ currentPassword: "WrongCurrent!", newPassword: "NewChanged123!" })
    }),
    env
  );
  assert.equal(badChange.status, 401);

  const okChange = await worker.fetch(
    new Request("https://d2r.example/api/auth/change-password", {
      method: "POST",
      headers: { "content-type": "application/json", cookie: latestCookie },
      body: JSON.stringify({ currentPassword: "ResetPassword5!", newPassword: "NewChanged123!" })
    }),
    env
  );
  assert.equal(okChange.status, 200);
});

test("方案 3 + Google 兜底：管理员令牌签发 15 分钟应急重置码、一次性消费与 Google 登录后免旧密设密", async () => {
  const env = createAuthEnv({
    GOOGLE_CLIENT_ID: "google-client-id-test",
    GOOGLE_CLIENT_SECRET: "google-client-secret-test"
  });

  // 注册纯用户名账号
  await worker.fetch(
    new Request("https://d2r.example/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ account: "lost_all_codes", password: "OldPassword123!" })
    }),
    env
  );

  // 未携带正确管理令牌拒绝
  const unauthAdmin = await worker.fetch(
    new Request("https://d2r.example/api/auth/admin/reset-token", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer wrong-token" },
      body: JSON.stringify({ account: "lost_all_codes" })
    }),
    env
  );
  assert.equal(unauthAdmin.status, 401);

  // 携带有效 MANUAL_TRIGGER_TOKEN 生成 15 分钟应急重置码
  const adminRes = await worker.fetch(
    new Request("https://d2r.example/api/auth/admin/reset-token", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer test-token" },
      body: JSON.stringify({ account: "lost_all_codes" })
    }),
    env
  );
  assert.equal(adminRes.status, 200);
  const adminJson = await adminRes.json();
  assert.match(adminJson.resetCode, /^ADM-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/);
  assert.equal(adminJson.expiresInSeconds, 900);

  // 用户凭应急码重设密码 -> 成功并自动补发 5 个新恢复码
  const userReset = await worker.fetch(
    new Request("https://d2r.example/api/auth/reset-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        account: "lost_all_codes",
        code: adminJson.resetCode,
        newPassword: "BrandNewPassword99!"
      })
    }),
    env
  );
  assert.equal(userReset.status, 200);
  const userResetJson = await userReset.json();
  assert.equal(userResetJson.usedAdminCode, true);
  assert.equal(userResetJson.recoveryCodes.length, 5);

  // 应急码一次性消费，重放必失败
  const adminReplay = await worker.fetch(
    new Request("https://d2r.example/api/auth/reset-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        account: "lost_all_codes",
        code: adminJson.resetCode,
        newPassword: "SecondTry99!"
      })
    }),
    env
  );
  assert.equal(adminReplay.status, 401);

  // Google 登录后免旧密码直接设密 + 自动签发 5 个恢复码
  const startUrl = new URL("https://d2r.example/api/auth/google/start");
  const startRes = await handleAuthOrUserRequest(new Request(startUrl), env, startUrl);
  const state = new URL(startRes.headers.get("location")).searchParams.get("state");
  const oauthCookie = extractCookiePair(startRes, "__Host-d2r_oauth").pair;
  const mockFetch = async (url) => {
    if (String(url).includes("oauth2.googleapis.com/token")) {
      return new Response(JSON.stringify({ access_token: "tok" }), { status: 200 });
    }
    return new Response(
      JSON.stringify({ sub: "gsub-google-only", email: "gplayer@gmail.com", email_verified: true, name: "GPlayer" }),
      { status: 200 }
    );
  };
  const cbUrl = new URL(`https://d2r.example/api/auth/google/callback?code=c1&state=${encodeURIComponent(state)}`);
  const cbRes = await handleAuthOrUserRequest(
    new Request(cbUrl, { headers: { cookie: oauthCookie } }),
    env,
    cbUrl,
    mockFetch
  );
  const googleSession = extractCookiePair(cbRes, "__Host-d2r_session").pair;

  const setPwViaGoogle = await worker.fetch(
    new Request("https://d2r.example/api/auth/change-password", {
      method: "POST",
      headers: { "content-type": "application/json", cookie: googleSession },
      body: JSON.stringify({ newPassword: "GoogleBackedPw123!" })
    }),
    env
  );
  assert.equal(setPwViaGoogle.status, 200);
  const gPwJson = await setPwViaGoogle.json();
  assert.equal(gPwJson.user.hasPassword, true);
  assert.equal(gPwJson.recoveryCodes.length, 5);
});

test("管理后台初始化（/api/admin/bootstrap）、权限隔离、系统设置迁移与用户管理全流程", async () => {
  const env = createAuthEnv();

  // 1) 未初始化管理员前，/api/admin/status 显示未初始化且要求校验 MANUAL_TRIGGER_TOKEN
  const st0 = await worker.fetch(new Request("https://d2r.example/api/admin/status"), env);
  assert.equal(st0.status, 200);
  const st0Json = await st0.json();
  assert.equal(st0Json.adminInitialized, false);
  assert.equal(st0Json.requiresTokenForBootstrap, true);

  // 未提供管理令牌时初始化应返回 401
  const badBoot = await worker.fetch(
    new Request("https://d2r.example/api/admin/bootstrap", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ account: "admin", password: "AdminPassword123!" })
    }),
    env
  );
  assert.equal(badBoot.status, 401);

  // 携带正确管理令牌初始化首个管理员账号 -> 201 + 5 个恢复码 + 管理员会话 Cookie
  const okBoot = await worker.fetch(
    new Request("https://d2r.example/api/admin/bootstrap", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        bootstrapToken: "test-token",
        account: "admin",
        displayName: "庇护之地大祭司",
        password: "AdminPassword123!"
      })
    }),
    env
  );
  assert.equal(okBoot.status, 201);
  const bootJson = await okBoot.json();
  assert.equal(bootJson.user.isAdmin, true);
  assert.equal(bootJson.user.role, "admin");
  assert.equal(bootJson.recoveryCodes.length, 5);
  const adminCookie = extractCookiePair(okBoot, "__Host-d2r_session").pair;

  // 二次调用 /api/admin/bootstrap 必须永久返回 409
  const secondBoot = await worker.fetch(
    new Request("https://d2r.example/api/admin/bootstrap", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        bootstrapToken: "test-token",
        account: "admin2",
        password: "AdminPassword999!"
      })
    }),
    env
  );
  assert.equal(secondBoot.status, 409);

  // 2) 注册普通用户，校验其无法访问任何管理接口（403）
  const regUser = await worker.fetch(
    new Request("https://d2r.example/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ account: "normal_pal", password: "NormalPassword123!" })
    }),
    env
  );
  const normalUser = (await regUser.json()).user;
  assert.equal(normalUser.isAdmin, false);
  const normalCookie = extractCookiePair(regUser, "__Host-d2r_session").pair;

  const forbidOverview = await worker.fetch(
    new Request("https://d2r.example/api/admin/overview", { headers: { cookie: normalCookie } }),
    env
  );
  assert.equal(forbidOverview.status, 403);

  const forbidSettings = await worker.fetch(
    new Request("https://d2r.example/api/admin/settings", {
      method: "PUT",
      headers: { "content-type": "application/json", cookie: normalCookie },
      body: JSON.stringify({ pullIntervalMinutes: 3 })
    }),
    env
  );
  assert.equal(forbidSettings.status, 403);

  // 3) 管理员在管理后台修改全局自动刷新与 DC 拉取间隔（无需再传管理令牌）
  const saveCfg = await worker.fetch(
    new Request("https://d2r.example/api/admin/settings", {
      method: "PUT",
      headers: { "content-type": "application/json", cookie: adminCookie },
      body: JSON.stringify({
        pullIntervalMinutes: 3,
        pageAutoRefreshEnabled: false,
        pageAutoRefreshMinutes: 4
      })
    }),
    env
  );
  assert.equal(saveCfg.status, 200);
  const cfgJson = await saveCfg.json();
  assert.deepEqual(cfgJson.settings, {
    pullIntervalMinutes: 3,
    pageAutoRefreshEnabled: false,
    pageAutoRefreshMinutes: 4
  });

  // 前台公开读取 /api/system-config 与兼容接口 /api/settings 同步更新
  const pubCfg = await (await worker.fetch(new Request("https://d2r.example/api/system-config"), env)).json();
  assert.equal(pubCfg.pullIntervalMinutes, 3);
  assert.equal(pubCfg.pageAutoRefreshEnabled, false);
  assert.equal(pubCfg.pageAutoRefreshMinutes, 4);

  const legacySettings = await (await worker.fetch(new Request("https://d2r.example/api/settings"), env)).json();
  assert.deepEqual(legacySettings, { pullIntervalMinutes: 3 });

  // 4) 管理员读取用户目录、防最后管理员自降、签发应急重置码与升降级角色
  const usersRes = await worker.fetch(
    new Request("https://d2r.example/api/admin/users", { headers: { cookie: adminCookie } }),
    env
  );
  assert.equal(usersRes.status, 200);
  const usersJson = await usersRes.json();
  assert.equal(usersJson.users.length, 2);
  for (const u of usersJson.users) {
    assert.equal("passwordHash" in u, false);
    assert.equal("recoveryCodeHashes" in u, false);
  }

  // 禁止降级唯一管理员
  const demoteLast = await worker.fetch(
    new Request(`https://d2r.example/api/admin/users/${encodeURIComponent(bootJson.user.id)}/role`, {
      method: "POST",
      headers: { "content-type": "application/json", cookie: adminCookie },
      body: JSON.stringify({ role: "user" })
    }),
    env
  );
  assert.equal(demoteLast.status, 400);

  // 提升普通用户为管理员 -> 成功
  const promoteNormal = await worker.fetch(
    new Request(`https://d2r.example/api/admin/users/${encodeURIComponent(normalUser.id)}/role`, {
      method: "POST",
      headers: { "content-type": "application/json", cookie: adminCookie },
      body: JSON.stringify({ role: "admin" })
    }),
    env
  );
  assert.equal(promoteNormal.status, 200);
  assert.equal((await promoteNormal.json()).user.isAdmin, true);

  // 通过用户列表为普通用户签发 15 分钟应急重置码
  const issueReset = await worker.fetch(
    new Request(`https://d2r.example/api/admin/users/${encodeURIComponent(normalUser.id)}/reset-token`, {
      method: "POST",
      headers: { cookie: adminCookie }
    }),
    env
  );
  assert.equal(issueReset.status, 200);
  assert.match((await issueReset.json()).resetCode, /^ADM-/);

  // 5) GET /admin 返回带安全响应头的独立管理后台 HTML（含响应式表格规范）
  const adminPageRes = await worker.fetch(new Request("https://d2r.example/admin"), env);
  assert.equal(adminPageRes.status, 200);
  assert.equal(adminPageRes.headers.get("x-frame-options"), "DENY");
  assert.match(adminPageRes.headers.get("content-security-policy") || "", /frame-ancestors 'none'/);
  const adminPageHtml = await adminPageRes.text();
  assert.match(adminPageHtml, /<div tabindex="0" role="region" aria-labelledby="adm-users-caption" class="table-wrapper">/);
  assert.match(adminPageHtml, /@container \(width < 760px\)/);
});

test("环境变量 ADMIN_PASSWORD 自动初始化管理员账号并可直接登录", async () => {
  const env = createAuthEnv({
    ADMIN_ACCOUNT: "sanctuary_admin",
    ADMIN_PASSWORD: "EnvSecretPassword2026!",
    ADMIN_DISPLAY_NAME: "自动初始化管理员"
  });

  // 直接用预设账号密码登录时自动完成初始化
  const loginRes = await worker.fetch(
    new Request("https://d2r.example/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ account: "sanctuary_admin", password: "EnvSecretPassword2026!" })
    }),
    env
  );
  assert.equal(loginRes.status, 200);
  const loginJson = await loginRes.json();
  assert.equal(loginJson.user.isAdmin, true);
  assert.equal(loginJson.user.displayName, "自动初始化管理员");
  assert.equal(loginJson.user.recoveryCodesRemaining, 5);
});

test("首屏 SSR 登录态直出（零刷新闪烁）与 /admin/users 专属用户管理/查看全链路", async () => {
  const env = createAuthEnv();

  // 初始化管理员（昵称故意包含 XSS 字符测试转义安全性）
  const boot = await worker.fetch(
    new Request("https://d2r.example/api/admin/bootstrap", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        bootstrapToken: "test-token",
        account: "root_admin",
        displayName: "圣骑</script><b>管</b>",
        password: "AdminRootPassword99!"
      })
    }),
    env
  );
  assert.equal(boot.status, 201);
  const bootJson = await boot.json();
  const adminCookie = extractCookiePair(boot, "__Host-d2r_session").pair;

  // 1) 已登录管理员刷新首页 / -> 首屏 HTML 直接渲染已登录态 + 管理后台按钮 + Vary: Cookie（零闪烁）
  const homeAuthRes = await worker.fetch(
    new Request("https://d2r.example/", { headers: { cookie: adminCookie } }),
    env
  );
  assert.equal(homeAuthRes.status, 200);
  assert.match(homeAuthRes.headers.get("cache-control") || "", /private/i);
  assert.match(homeAuthRes.headers.get("vary") || "", /Cookie/i);
  const homeAuthHtml = await homeAuthRes.text();
  assert.match(homeAuthHtml, /class="auth-pill-btn logged-in"/);
  assert.match(homeAuthHtml, /id="admin-entry-link"[^>]*display:inline-flex/);
  assert.match(homeAuthHtml, /☁ 已登录云端同步/);
  assert.doesNotMatch(homeAuthHtml, /圣骑<\/script><b>/, "SSR 昵称必须完成 HTML/JSON 转义防 XSS");
  assert.match(homeAuthHtml, /\\u003c\/script\\u003e/);

  // 2) 未登录访客访问首页 / -> 首屏直接为未登录态
  const homeGuestHtml = await (await worker.fetch(new Request("https://d2r.example/"), env)).text();
  assert.match(homeGuestHtml, /class="auth-pill-btn" id="auth-open-btn"/);
  assert.match(homeGuestHtml, /"authenticated":false/);

  // 3) 管理员访问 /admin/users -> 首屏直接渲染用户管理子页 + aria-current="page"（不闪烁 loading）
  const usersPageRes = await worker.fetch(
    new Request("https://d2r.example/admin/users", { headers: { cookie: adminCookie } }),
    env
  );
  assert.equal(usersPageRes.status, 200);
  const usersPageHtml = await usersPageRes.text();
  assert.match(usersPageHtml, /id="adm-console-view" style="display:flex/);
  assert.match(usersPageHtml, /id="adm-page-users" style="display:flex/);
  assert.match(usersPageHtml, /href="\/admin\/users" aria-current="page"/);

  // 4) 管理员直接新建普通用户 -> 返回 5 个恢复码
  const createRes = await worker.fetch(
    new Request("https://d2r.example/api/admin/users", {
      method: "POST",
      headers: { "content-type": "application/json", cookie: adminCookie },
      body: JSON.stringify({
        account: "pal_member",
        displayName: "双梦圣骑士成员",
        password: "MemberPassword123!",
        role: "user"
      })
    }),
    env
  );
  assert.equal(createRes.status, 201);
  const created = await createRes.json();
  assert.equal(created.user.role, "user");
  assert.equal(created.recoveryCodes.length, 5);
  const memberId = created.user.id;

  // 新建用户登录后保存云端技能、装备与命名方案
  const memberLogin = await worker.fetch(
    new Request("https://d2r.example/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ account: "pal_member", password: "MemberPassword123!" })
    }),
    env
  );
  const memberCookie = extractCookiePair(memberLogin, "__Host-d2r_session").pair;
  await worker.fetch(
    new Request("https://d2r.example/api/user/builds", {
      method: "PUT",
      headers: { "content-type": "application/json", cookie: memberCookie },
      body: JSON.stringify({
        activeClassId: "pal",
        skills: { pal: { Fanaticism: 20, Zeal: 20, "Holy Shield": 15 } },
        paperdoll: { pal: { charLvl: 95, charLoadout: { weapon: { cat: "rw", id: "grief" } }, charBag: [{ id: "torch" }] } }
      })
    }),
    env
  );
  await worker.fetch(
    new Request("https://d2r.example/api/user/presets", {
      method: "POST",
      headers: { "content-type": "application/json", cookie: memberCookie },
      body: JSON.stringify({ name: "热诚 6Boss", classId: "pal", skills: { Zeal: 20 }, paperdoll: { charLvl: 95 } })
    }),
    env
  );

  // 5) 管理员查看该用户完整详情（GET /api/admin/users/:id）
  const detailRes = await worker.fetch(
    new Request(`https://d2r.example/api/admin/users/${encodeURIComponent(memberId)}`, {
      headers: { cookie: adminCookie }
    }),
    env
  );
  assert.equal(detailRes.status, 200);
  const detail = await detailRes.json();
  assert.equal(detail.user.username, "pal_member");
  assert.equal("passwordHash" in detail.user, false);
  assert.equal(detail.builds.classes.length, 1);
  assert.equal(detail.builds.classes[0].classId, "pal");
  assert.equal(detail.builds.classes[0].skillPoints, 55);
  assert.equal(detail.builds.classes[0].equippedSlotsCount, 1);
  assert.equal(detail.builds.classes[0].charmCount, 1);
  assert.equal(detail.builds.presets.length, 1);
  assert.equal(detail.builds.presets[0].name, "热诚 6Boss");

  // 6) 强制踢下线 -> 旧会话立刻失效
  const revokeRes = await worker.fetch(
    new Request(`https://d2r.example/api/admin/users/${encodeURIComponent(memberId)}/revoke-sessions`, {
      method: "POST",
      headers: { cookie: adminCookie }
    }),
    env
  );
  assert.equal(revokeRes.status, 200);
  const meRevoked = await (
    await worker.fetch(new Request("https://d2r.example/api/auth/me", { headers: { cookie: memberCookie } }), env)
  ).json();
  assert.equal(meRevoked.authenticated, false);

  // 7) 禁用账号 -> 拒绝登录（403）且不能禁用自己（400）
  const selfDisable = await worker.fetch(
    new Request(`https://d2r.example/api/admin/users/${encodeURIComponent(bootJson.user.id)}/status`, {
      method: "POST",
      headers: { "content-type": "application/json", cookie: adminCookie },
      body: JSON.stringify({ disabled: true })
    }),
    env
  );
  assert.equal(selfDisable.status, 400);

  const disRes = await worker.fetch(
    new Request(`https://d2r.example/api/admin/users/${encodeURIComponent(memberId)}/status`, {
      method: "POST",
      headers: { "content-type": "application/json", cookie: adminCookie },
      body: JSON.stringify({ disabled: true })
    }),
    env
  );
  assert.equal(disRes.status, 200);
  assert.equal((await disRes.json()).user.disabled, true);

  const disabledLogin = await worker.fetch(
    new Request("https://d2r.example/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ account: "pal_member", password: "MemberPassword123!" })
    }),
    env
  );
  assert.equal(disabledLogin.status, 403);

  // 8) 删除用户 -> 清理账号与云端存档，且禁止删除自己
  const selfDel = await worker.fetch(
    new Request(`https://d2r.example/api/admin/users/${encodeURIComponent(bootJson.user.id)}`, {
      method: "DELETE",
      headers: { cookie: adminCookie }
    }),
    env
  );
  assert.equal(selfDel.status, 400);

  const delMember = await worker.fetch(
    new Request(`https://d2r.example/api/admin/users/${encodeURIComponent(memberId)}`, {
      method: "DELETE",
      headers: { cookie: adminCookie }
    }),
    env
  );
  assert.equal(delMember.status, 200);

  const afterDelDetail = await worker.fetch(
    new Request(`https://d2r.example/api/admin/users/${encodeURIComponent(memberId)}`, {
      headers: { cookie: adminCookie }
    }),
    env
  );
  assert.equal(afterDelDetail.status, 404);
});

test("自动发现并回填早期注册、尚未进入 auth:idx:users 目录的历史用户（如 creed）", async () => {
  const env = createAuthEnv();

  // 初始化管理员
  const boot = await worker.fetch(
    new Request("https://d2r.example/api/admin/bootstrap", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        bootstrapToken: "test-token",
        account: "admin",
        password: "AdminPassword123!"
      })
    }),
    env
  );
  const adminCookie = extractCookiePair(boot, "__Host-d2r_session").pair;

  // 模拟在引入 auth:idx:users 目录之前注册的旧用户 creed（仅存在于 auth:user:<id> 与 auth:idx:username:creed）
  const legacyId = "legacy-creed-uuid-001";
  await env.DCLONE_STATE.put(
    `auth:user:${legacyId}`,
    JSON.stringify({
      id: legacyId,
      username: "creed",
      email: "",
      displayName: "creed",
      providers: ["password"],
      passwordHash: "pbkdf2_sha256$100000$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      createdAt: "2026-11-23T06:00:00.000Z"
    })
  );
  await env.DCLONE_STATE.put("auth:idx:username:creed", legacyId);

  // 管理后台用户列表与概览应立即通过 KV list() 扫描出 creed 并自动回填目录
  const usersRes = await worker.fetch(
    new Request("https://d2r.example/api/admin/users", { headers: { cookie: adminCookie } }),
    env
  );
  assert.equal(usersRes.status, 200);
  const { users } = await usersRes.json();
  assert.equal(users.length, 2);
  assert.ok(users.some((u) => u.id === legacyId && u.username === "creed" && u.role === "user"));

  // 验证 auth:idx:users 已自动回填
  const dirAfter = await env.DCLONE_STATE.get("auth:idx:users", "json");
  assert.ok(Array.isArray(dirAfter) && dirAfter.includes(legacyId));
});

test("云端存档完整同步圣杯进度（暗金/套装）与符文之语记事本，并在管理后台准确统计", async () => {
  const env = createAuthEnv();

  // 初始化管理员与普通玩家
  const boot = await worker.fetch(
    new Request("https://d2r.example/api/admin/bootstrap", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        bootstrapToken: "test-token",
        account: "admin",
        password: "AdminPassword123!"
      })
    }),
    env
  );
  const adminCookie = extractCookiePair(boot, "__Host-d2r_session").pair;

  const reg = await worker.fetch(
    new Request("https://d2r.example/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ account: "grail_hunter", password: "GrailPassword123!" })
    }),
    env
  );
  const userJson = await reg.json();
  const userCookie = extractCookiePair(reg, "__Host-d2r_session").pair;

  // 上传圣杯暗金/套装 + 符文之语打卡（含重复项与控制字符，验证清洗去重）
  const put1 = await worker.fetch(
    new Request("https://d2r.example/api/user/builds", {
      method: "PUT",
      headers: { "content-type": "application/json", cookie: userCookie },
      body: JSON.stringify({
        grail: {
          uniques: ["Griffon's Eye", "Griffon's Eye", "Harlequin Crest (Shako)", "  "],
          setPieces: ["Tal Rasha's Guardianship", "Immortal King's Soul Cage"]
        },
        runewords: ["enigma", "infinity", "enigma", "spirit"]
      })
    }),
    env
  );
  assert.equal(put1.status, 200);
  const put1Json = await put1.json();
  assert.equal(put1Json.grailCount, 4);
  assert.equal(put1Json.runewordsCount, 3);

  // 后续局部 PUT（仅更新 skills）严禁覆盖已保存的圣杯与符文之语
  const put2 = await worker.fetch(
    new Request("https://d2r.example/api/user/builds", {
      method: "PUT",
      headers: { "content-type": "application/json", cookie: userCookie },
      body: JSON.stringify({
        activeClassId: "sor",
        skills: { sor: { Blizzard: 20 } }
      })
    }),
    env
  );
  assert.equal(put2.status, 200);

  const got = await (
    await worker.fetch(new Request("https://d2r.example/api/user/builds", { headers: { cookie: userCookie } }), env)
  ).json();
  assert.deepEqual(got.data.grail.uniques, ["Griffon's Eye", "Harlequin Crest (Shako)"]);
  assert.deepEqual(got.data.grail.setPieces, ["Tal Rasha's Guardianship", "Immortal King's Soul Cage"]);
  assert.deepEqual(got.data.runewords, ["enigma", "infinity", "spirit"]);

  // 管理后台用户列表与用户详情应准确展示圣杯与符文之语统计
  const usersList = await (
    await worker.fetch(new Request("https://d2r.example/api/admin/users", { headers: { cookie: adminCookie } }), env)
  ).json();
  const hunterRow = usersList.users.find((u) => u.id === userJson.user.id);
  assert.ok(hunterRow);
  assert.equal(hunterRow.grailUniquesCount, 2);
  assert.equal(hunterRow.grailSetsCount, 2);
  assert.equal(hunterRow.grailCount, 4);
  assert.equal(hunterRow.runewordsCount, 3);

  const detail = await (
    await worker.fetch(
      new Request(`https://d2r.example/api/admin/users/${encodeURIComponent(userJson.user.id)}`, {
        headers: { cookie: adminCookie }
      }),
      env
    )
  ).json();
  assert.deepEqual(detail.builds.grail, { uniquesCount: 2, setPiecesCount: 2 });
  assert.equal(detail.builds.runewordsCount, 3);

  // 首屏 SSR HTML 应包含圣杯与符文之语云端同步按钮
  const html = await (
    await worker.fetch(new Request("https://d2r.example/", { headers: { cookie: userCookie } }), env)
  ).text();
  assert.match(html, /id="rw-cloud-sync-btn"[^>]*>☁ 符文已云端同步/);
  assert.match(html, /id="grail-cloud-sync-btn"[^>]*>☁ 圣杯已云端同步/);
});

test("用户昵称自助修改 /api/user/profile（含认证、CSRF 与空昵称校验）", async () => {
  const env = createAuthEnv();

  // 未登录拒绝 401
  const guestRes = await worker.fetch(
    new Request("https://d2r.example/api/user/profile", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ displayName: "访客改名" })
    }),
    env
  );
  assert.equal(guestRes.status, 401);

  // 注册普通账号
  const regRes = await worker.fetch(
    new Request("https://d2r.example/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ account: "rename_hero", displayName: "初始名称", password: "StrongPassword123!" })
    }),
    env
  );
  assert.equal(regRes.status, 201);
  const cookie = extractCookiePair(regRes, "__Host-d2r_session").pair;

  // 跨站 CSRF 拒绝 403
  const csrfRes = await worker.fetch(
    new Request("https://d2r.example/api/user/profile", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        cookie,
        origin: "https://evil.example"
      },
      body: JSON.stringify({ displayName: "被劫持昵称" })
    }),
    env
  );
  assert.equal(csrfRes.status, 403);

  // 空昵称拒绝 400
  const emptyRes = await worker.fetch(
    new Request("https://d2r.example/api/user/profile", {
      method: "PATCH",
      headers: { "content-type": "application/json", cookie },
      body: JSON.stringify({ displayName: "   " })
    }),
    env
  );
  assert.equal(emptyRes.status, 400);

  // 正常 PATCH 修改昵称
  const patchRes = await worker.fetch(
    new Request("https://d2r.example/api/user/profile", {
      method: "PATCH",
      headers: { "content-type": "application/json", cookie },
      body: JSON.stringify({ displayName: "  99级双热圣骑  " })
    }),
    env
  );
  assert.equal(patchRes.status, 200);
  const patchJson = await patchRes.json();
  assert.equal(patchJson.ok, true);
  assert.equal(patchJson.user.displayName, "99级双热圣骑");

  // /api/auth/me 同步返回新昵称
  const meJson = await (
    await worker.fetch(new Request("https://d2r.example/api/auth/me", { headers: { cookie } }), env)
  ).json();
  assert.equal(meJson.user.displayName, "99级双热圣骑");

  // 也兼容 POST /api/user/profile
  const postRes = await worker.fetch(
    new Request("https://d2r.example/api/user/profile", {
      method: "POST",
      headers: { "content-type": "application/json", cookie },
      body: JSON.stringify({ displayName: "火法大师" })
    }),
    env
  );
  assert.equal(postRes.status, 200);
  assert.equal((await postRes.json()).user.displayName, "火法大师");
});

test("管理后台审计日志 /api/admin/audit-logs 与存储引擎信息（权限校验与全操作记录）", async () => {
  const env = createAuthEnv();

  // 未登录拒绝 401
  const guestLogs = await worker.fetch(new Request("https://d2r.example/api/admin/audit-logs"), env);
  assert.equal(guestLogs.status, 401);

  // 初始化管理员（会记录 admin.bootstrap）
  const boot = await worker.fetch(
    new Request("https://d2r.example/api/admin/bootstrap", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        bootstrapToken: "test-token",
        account: "root_admin",
        displayName: "总管理员",
        password: "AdminPassword123!"
      })
    }),
    env
  );
  assert.equal(boot.status, 201);
  const adminCookie = extractCookiePair(boot, "__Host-d2r_session").pair;

  // 普通用户无权读取审计日志（403）
  const regUser = await worker.fetch(
    new Request("https://d2r.example/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ account: "normal_player", password: "PlayerPassword123!" })
    }),
    env
  );
  const userCookie = extractCookiePair(regUser, "__Host-d2r_session").pair;
  const forbidLogs = await worker.fetch(
    new Request("https://d2r.example/api/admin/audit-logs", { headers: { cookie: userCookie } }),
    env
  );
  assert.equal(forbidLogs.status, 403);

  // 管理员依次执行敏感操作：改设置 -> 创建用户 -> 切角色 -> 禁用 -> 签发重置码 -> 吊销会话 -> 删除用户
  const setRes = await worker.fetch(
    new Request("https://d2r.example/api/admin/settings", {
      method: "PUT",
      headers: { "content-type": "application/json", cookie: adminCookie },
      body: JSON.stringify({ pullIntervalMinutes: 3, pageAutoRefreshEnabled: true, pageAutoRefreshMinutes: 5 })
    }),
    env
  );
  assert.equal(setRes.status, 200);

  const createRes = await worker.fetch(
    new Request("https://d2r.example/api/admin/users", {
      method: "POST",
      headers: { "content-type": "application/json", cookie: adminCookie },
      body: JSON.stringify({ account: "audit_target", displayName: "审计测试号", role: "user", password: "TargetPassword123!" })
    }),
    env
  );
  assert.equal(createRes.status, 201);
  const targetId = (await createRes.json()).user.id;

  const roleRes = await worker.fetch(
    new Request(`https://d2r.example/api/admin/users/${encodeURIComponent(targetId)}/role`, {
      method: "POST",
      headers: { "content-type": "application/json", cookie: adminCookie },
      body: JSON.stringify({ role: "admin" })
    }),
    env
  );
  assert.equal(roleRes.status, 200);

  const statusRes = await worker.fetch(
    new Request(`https://d2r.example/api/admin/users/${encodeURIComponent(targetId)}/status`, {
      method: "POST",
      headers: { "content-type": "application/json", cookie: adminCookie },
      body: JSON.stringify({ disabled: true })
    }),
    env
  );
  assert.equal(statusRes.status, 200);

  const resetRes = await worker.fetch(
    new Request(`https://d2r.example/api/admin/users/${encodeURIComponent(targetId)}/reset-token`, {
      method: "POST",
      headers: { cookie: adminCookie }
    }),
    env
  );
  assert.equal(resetRes.status, 200);

  const revokeRes = await worker.fetch(
    new Request(`https://d2r.example/api/admin/users/${encodeURIComponent(targetId)}/revoke-sessions`, {
      method: "POST",
      headers: { cookie: adminCookie }
    }),
    env
  );
  assert.equal(revokeRes.status, 200);

  const delRes = await worker.fetch(
    new Request(`https://d2r.example/api/admin/users/${encodeURIComponent(targetId)}`, {
      method: "DELETE",
      headers: { cookie: adminCookie }
    }),
    env
  );
  assert.equal(delRes.status, 200);

  // 查询审计日志接口
  const logsRes = await worker.fetch(
    new Request("https://d2r.example/api/admin/audit-logs?limit=20", { headers: { cookie: adminCookie } }),
    env
  );
  assert.equal(logsRes.status, 200);
  const logsJson = await logsRes.json();
  assert.equal(logsJson.ok, true);
  assert.ok(logsJson.storageBackend && logsJson.storageBackend.backend === "kv");
  const actions = logsJson.logs.map((l) => l.action);
  for (const expected of [
    "user.delete",
    "user.revoke_sessions",
    "user.reset_code",
    "user.status",
    "user.role",
    "user.create",
    "settings.update",
    "admin.bootstrap"
  ]) {
    assert.ok(actions.includes(expected), `审计日志应包含操作 ${expected}，实际: ${actions.join(", ")}`);
  }
  assert.equal(logsJson.logs[0].action, "user.delete", "最新一条审计日志应排在最前");
  assert.equal(logsJson.logs[0].actor, "总管理员");
  assert.ok(logsJson.logs[0].time && logsJson.logs[0].summary);

  // 概览接口也应返回 runtime.storageBackend 信息
  const overviewJson = await (
    await worker.fetch(new Request("https://d2r.example/api/admin/overview", { headers: { cookie: adminCookie } }), env)
  ).json();
  assert.equal(overviewJson.runtime.storageBackend.backend, "kv");
});
