import assert from "node:assert/strict";
import test from "node:test";

import worker from "../src/index.js";

function createShareEnv() {
  const store = new Map();
  return {
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
    _store: store
  };
}

function extractSessionCookie(response) {
  const cookies = typeof response.headers.getSetCookie === "function"
    ? response.headers.getSetCookie()
    : [response.headers.get("set-cookie")].filter(Boolean);
  for (const raw of cookies) {
    const first = raw.split(";")[0].trim();
    if (first.startsWith("__Host-d2r_session=")) return first;
  }
  return "";
}

test("完整 BD 公开只读分享短链：创建、JSON 查询、SSR /build/:id 渲染与 XSS 防护", async () => {
  const env = createShareEnv();

  const payload = {
    classId: "pal",
    title: "悔恨狂热盾击圣骑 <script>alert(1)</script>",
    notes: '通刷 6BOSS 与地表暗黑"><img src=x onerror=alert(1)>',
    skills: {
      "Holy Shield": 20,
      Fanaticism: 20,
      Zeal: 20,
      Sacrifice: 20,
      Smite: 1
    },
    paperdoll: {
      charLvl: 93,
      charLoadout: {
        head: { cat: "set", id: "Guillaume's Face", eth: false, sockets: [{ customJewel: true, rarity: "magic", pre: [{ id: "fr", val: 30 }], suf: [{ id: "ias", val: 15 }] }], rolls: {} },
        amulet: { cat: "unique", id: "Highlord's Wrath", eth: false, sockets: [], rolls: {} },
        weapon: { cat: "rw", id: "grief", baseCode: "7cr", eth: false, supEd: 15, supAr: 3, sockets: [], rolls: {} },
        torso: { cat: "rw", id: "fortitude", baseCode: "utp", eth: false, supDef: 15, sockets: [], rolls: {} },
        offhand: { cat: "rw", id: "spirit", baseCode: "pab", eth: false, palModType: "res", palRes: 45, sockets: [], rolls: {} },
        gloves: { cat: "set", id: "Laying of Hands", eth: false, sockets: [], rolls: {} },
        ring1: { cat: "unique", id: "Raven Frost", eth: false, sockets: [], rolls: {} },
        belt: { cat: "unique", id: "String of Ears", eth: false, sockets: [], rolls: {} },
        ring2: null,
        boots: { cat: "unique", id: "Gore Rider", eth: false, sockets: [], rolls: {} }
      },
      swapLoadout: {
        weapon: { cat: "rw", id: "call-to-arms", baseCode: "crs", eth: false, sockets: [], rolls: { L2: 277, L5: 5, L6: 4 } },
        offhand: { cat: "rw", id: "spirit", baseCode: "pab", eth: false, palModType: "res", palRes: 45, sockets: [], rolls: {} }
      },
      activeWeaponSet: 1,
      mercLoadout: {
        head: { cat: "unique", id: "Andariel's Visage", eth: true, sockets: ["r08"], rolls: {} },
        torso: { cat: "rw", id: "fortitude", baseCode: "uar", eth: true, sockets: [], rolls: {} },
        weapon: { cat: "rw", id: "infinity", baseCode: "7wc", eth: true, sockets: [], rolls: {} },
        offhand: null
      },
      charBag: [
        { uid: "b1", charmId: "torch", tabPage: 0, rolls: { L1: 18, L2: 19 } },
        { uid: "b2", charmId: "anni", tabPage: 0, rolls: { L1: 20, L2: 19, L3: 10 } },
        { uid: "b3", charmId: "gc-sk-life", tabPage: 1, skin: 3, rolls: { L1: 42 } },
        { uid: "b4", charmId: "gc-sk-life", tabPage: 1, skin: 2, rolls: {} }
      ],
      statAlloc: { str: 110, dex: 130, vit: 240, enr: 0 },
      mercVariant: "a2-might",
      mercLvl: 93,
      mercEnabled: true,
      mercAuraOn: true,
      ctaOn: true,
      charAura: "fana-20",
      demonAura: "none",
      demonMlvl: 96,
      warlockHex: "none",
      enemyDebuff: "amp",
      selectedSkillKey: "Zeal",
      maxMode: false
    },
    summary: {
      hp: 3420,
      mana: 410,
      def: 16200,
      blockChance: 75,
      fcr: 35,
      fcrFrame: 12,
      fhr: 86,
      fhrFrame: 4,
      ias: 80,
      iasFrame: 7,
      fbr: 0,
      fbrFrame: 5,
      mf: 25,
      dr: 15,
      resF: 75,
      resC: 75,
      resL: 75,
      resP: 75,
      allSkillBonus: 7,
      skillBonuses: {
        all: 7,
        gearAll: 6,
        cta: 1,
        byTab: { 1: 2, 2: 0, 3: 0 },
        bySkill: {},
        fire: 0
      },
      totalStr: 185,
      totalDex: 158,
      totalVit: 320,
      totalEnr: 40,
      skillName: "热诚",
      skillLvl: 29,
      skillDmg: "4,200–5,600",
      dps: 17500,
      weaponName: "悔恨 (幻化之刃)",
      shieldName: "精神",
      merc: {
        enabled: true,
        innateAuraOn: true,
        variant: "a2-might",
        lvl: 92,
        hp: 3680,
        hpMult: 1.65,
        def: 5120,
        dmgMin: 2350,
        dmgMax: 6540,
        ar: 2680,
        str: 232,
        baseStr: 202,
        dex: 164,
        baseDex: 164,
        reqStr: 222,
        reqDex: 130,
        reqOk: true,
        allSkills: 3,
        resF: 75,
        resC: 75,
        resL: 80,
        resP: 85,
        baseResHell: 59,
        ias: 35,
        wsm: -10,
        fanaEias: 0,
        atkFrame: 10,
        aps: 2.5,
        ll: 10,
        cb: 40,
        ds: 0,
        dr: 0,
        cbf: false,
        skills: "戳刺 Jab Lv.26 · 力量灵气 Might Lv.22（全队物理伤害 +250%）",
        gearAuras: "信念 Lv.12"
      }
    }
  };

  // 1. Create public share link (anonymous)
  const createRes = await worker.fetch(
    new Request("https://d2r.example/api/builds/share", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "sec-fetch-site": "same-origin"
      },
      body: JSON.stringify(payload)
    }),
    env
  );
  assert.equal(createRes.status, 201);
  const created = await createRes.json();
  assert.equal(created.ok, true);
  assert.match(created.id, /^[a-z0-9]{8}$/);
  assert.equal(created.sharePath, `/build/${created.id}`);
  assert.equal(created.shareUrl, `https://d2r.example/build/${created.id}`);
  assert.equal(created.build.authorName, "庇护之地冒险者");
  assert.equal(created.build.authorUserId, undefined);

  // 2. Fetch JSON by share ID
  const getJsonRes = await worker.fetch(
    new Request(`https://d2r.example/api/builds/share/${created.id}`),
    env
  );
  assert.equal(getJsonRes.status, 200);
  const fetched = await getJsonRes.json();
  assert.equal(fetched.ok, true);
  assert.equal(fetched.build.classId, "pal");
  assert.equal(fetched.build.skills["Holy Shield"], 20);
  assert.equal(fetched.build.paperdoll.charLoadout.offhand.palRes, 45);
  assert.equal(fetched.build.paperdoll.charBag[2].skin, 3);
  assert.equal(fetched.build.paperdoll.charBag[3].skin, 2);
  assert.equal(fetched.build.summary.hp, 3420);

  // 3. Fetch SSR /build/:id read-only HTML page
  const pageRes = await worker.fetch(
    new Request(`https://d2r.example/build/${created.id}`),
    env
  );
  assert.equal(pageRes.status, 200);
  assert.equal(pageRes.headers.get("x-frame-options"), "DENY");
  assert.equal(pageRes.headers.get("x-content-type-options"), "nosniff");
  assert.match(pageRes.headers.get("content-security-policy") || "", /frame-ancestors 'none'/);

  const html = await pageRes.text();
  // Verify XSS payloads are strictly escaped
  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
  assert.doesNotMatch(html, /<img src=x onerror=alert\(1\)>/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  // Verify rich SSR content
  assert.match(html, /property="og:title"/);
  assert.match(html, /property="og:description"/);
  assert.match(html, new RegExp(`href="/\\?import_build=${created.id}#skills"`));
  assert.match(html, /圣骑士 \(Paladin\)/);
  assert.match(html, /悔恨/);
  assert.match(html, /精神/);
  assert.match(html, /副手组 II（W 键切换）/);
  assert.match(html, /战争召唤/);
  assert.match(html, /圣骑底材 \+45% 全抗/);
  assert.match(html, /自定义蓝珠宝\(2词缀\)/);
  assert.match(html, /安达利尔的面貌/);
  assert.match(html, /吉永之脸/);
  assert.match(html, /great_helm\.webp/);
  assert.match(html, /安置/);
  assert.match(html, /gloves_l\.webp/);
  assert.match(html, /pd-doll-grid/);
  assert.match(html, /pd-merc-grid/);
  assert.match(html, /pd-inv-grid/);
  assert.match(html, /inventory_paperdoll_weapon\.webp/);
  assert.match(html, /bd-char-doll-swap/);
  assert.match(html, /bd-char-inspector/);
  assert.match(html, /charm_large3\.webp/);
  assert.match(html, /charm_large2\.webp/);
  assert.match(html, /bd-merc-inspector/);
  assert.match(html, /bd-bag-inspector/);
  assert.match(html, /data-bd-target="bag"/);
  assert.match(html, /\+18 全属性 \[10–20\]/);
  assert.match(html, /\+19 所有抗性 \[10–20\]/);
  assert.match(html, /\+10% 经验获取 \[5–10\]/);
  assert.match(html, /\+42 生命 \[10–45\]/);
  assert.match(html, /bd-insp-stats/);
  assert.match(html, /Amn \+ Ral \+ Mal \+ Ist \+ Ohm/);
  assert.match(html, /\+277% 强化伤害 \[250–290\]/);
  assert.match(html, /\+5 战斗指挥 \[2–6\]/);
  assert.match(html, /\+4 战斗体制 \[1–6\]/);
  assert.match(html, /\+4 战嚎 \[1–4\]/);
  assert.match(html, /\+5–30 火焰伤害/);
  assert.match(html, /火焰抗性 \+30%/);
  assert.match(html, /class="lvl-calc-badge" title="按当前 Lv\.93 实时折算">\+139<\/span>\+\(1\.5 \* 等级\) 生命/);
  assert.match(html, /class="lvl-calc-badge" title="按当前 Lv\.93 实时折算">\+34%<\/span>\+\(0\.375\*等级\)% 致命打击/);
  assert.doesNotMatch(html, /\[object Object\]/, "套装部分加成对象应格式化为可读文本");
  assert.doesNotMatch(html, /gear-icon-ph/, "所有已穿戴装备均应有图标，不应退回空白占位");
  assert.match(html, /×2/); // 2x skiller GC grouped
  assert.match(html, /已分配 81 \/ 110 点/);
  assert.match(html, /装备\/CTA 技能加成：全\/职业 \+7（含 CTA \+1）/);
  assert.match(html, /Lv\.29<\/span><span class="sk-base-sub">\(20\+9\)<\/span>/);
  assert.match(html, /Lv\.27<\/span><span class="sk-base-sub">\(20\+7\)<\/span>/);
  assert.match(html, /class="bd-sk-node-badge is-boosted">29<\/span>/);
  assert.match(html, /id="bd-sk-view-list"/);
  assert.match(html, /id="bd-sk-view-tree"/);
  assert.match(html, /data-bd-sk-view="tree"/);
  assert.match(html, /class="bd-sk-edge is-active"/);
  assert.match(html, /class="bd-sk-node is-invested"/);
  assert.match(html, /<script src="\/assets\/theme-init\.js\?v=[a-f0-9]+"><\/script>/);
  assert.match(html, /data-theme-mode="auto"/);
  assert.match(html, /data-theme-mode="light"/);
  assert.match(html, /3,420/);
  assert.match(html, /17,500\/秒/);
  assert.match(html, /神圣之盾 Holy Shield（已开启/);
  assert.match(html, /merc-stats-wrap/);
  assert.match(html, /佣兵属性达标可穿戴全部装备/);
  assert.match(html, /3,680/);
  assert.match(html, /5,120/);
  assert.match(html, /2,350–6,540/);
  assert.match(html, /AR 2,680/);
  assert.match(html, /力 232/);
  assert.match(html, /75% \/ 75% \/ 80% \/ 85%/);
  assert.match(html, /10 帧<\/strong> \(2\.50 次\/秒\)/);
  assert.match(html, /吸血 10% · 压碎 40%/);
  assert.match(html, /力量灵气 Might Lv\.22/);
  assert.match(html, /信念 Lv\.12（装备光环在城里常驻生效）/);

  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(scriptMatch);
  assert.doesNotThrow(() => new Function(scriptMatch[1]));

  // 4. Nonexistent share ID returns 404 JSON & 404 HTML
  const missingJson = await worker.fetch(new Request("https://d2r.example/api/builds/share/zzzz9999"), env);
  assert.equal(missingJson.status, 404);
  const missingHtml = await worker.fetch(new Request("https://d2r.example/build/zzzz9999"), env);
  assert.equal(missingHtml.status, 404);
  assert.match(await missingHtml.text(), /未找到分享 BD/);
});

test("登录用户分享 BD 自动署名为昵称，跨站请求被拦截，高频创建触发限流", async () => {
  const env = createShareEnv();

  // Register user
  const regRes = await worker.fetch(
    new Request("https://d2r.example/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json", "sec-fetch-site": "same-origin" },
      body: JSON.stringify({
        account: "warlock_pro",
        displayName: "术士大师",
        password: "StrongPassword123!"
      })
    }),
    env
  );
  assert.equal(regRes.status, 201);
  const sessionCookie = extractSessionCookie(regRes);
  assert.ok(sessionCookie);

  // Cross-site POST blocked with 403
  const csrfBlocked = await worker.fetch(
    new Request("https://d2r.example/api/builds/share", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "sec-fetch-site": "cross-site",
        cookie: sessionCookie
      },
      body: JSON.stringify({ classId: "war", skills: { "Hex Purge": 20 } })
    }),
    env
  );
  assert.equal(csrfBlocked.status, 403);

  // Logged-in share attaches displayName
  const okRes = await worker.fetch(
    new Request("https://d2r.example/api/builds/share", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "sec-fetch-site": "same-origin",
        "cf-connecting-ip": "203.0.113.10",
        cookie: sessionCookie
      },
      body: JSON.stringify({ classId: "war", title: "回响术士", skills: { "Hex Purge": 20 } })
    }),
    env
  );
  assert.equal(okRes.status, 201);
  const okData = await okRes.json();
  assert.equal(okData.build.authorName, "术士大师");
  assert.equal(okData.build.authorUserId, undefined);

  // Rate limit after 20 creates from same IP
  for (let i = 0; i < 19; i += 1) {
    const r = await worker.fetch(
      new Request("https://d2r.example/api/builds/share", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "sec-fetch-site": "same-origin",
          "cf-connecting-ip": "203.0.113.10"
        },
        body: JSON.stringify({ classId: "sor", skills: { Blizzard: 20 } })
      }),
      env
    );
    assert.equal(r.status, 201);
  }

  const rlRes = await worker.fetch(
    new Request("https://d2r.example/api/builds/share", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "sec-fetch-site": "same-origin",
        "cf-connecting-ip": "203.0.113.10"
      },
      body: JSON.stringify({ classId: "sor", skills: { Blizzard: 20 } })
    }),
    env
  );
  assert.equal(rlRes.status, 429);
});

test("「我分享的 BD」短链列表 GET /api/user/shares 与撤销 DELETE /api/builds/share/:id（鉴权/CSRF/越权防护）", async () => {
  const env = createShareEnv();

  // Unauthenticated list returns 401
  const anonList = await worker.fetch(new Request("https://d2r.example/api/user/shares"), env);
  assert.equal(anonList.status, 401);

  // Register Alice & Bob
  const regAlice = await worker.fetch(
    new Request("https://d2r.example/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json", "sec-fetch-site": "same-origin" },
      body: JSON.stringify({ account: "alice_bd", displayName: "爱丽丝", password: "StrongPassword123!" })
    }),
    env
  );
  assert.equal(regAlice.status, 201);
  const aliceCookie = extractSessionCookie(regAlice);

  const regBob = await worker.fetch(
    new Request("https://d2r.example/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json", "sec-fetch-site": "same-origin" },
      body: JSON.stringify({ account: "bob_bd", displayName: "鲍勃", password: "StrongPassword123!" })
    }),
    env
  );
  assert.equal(regBob.status, 201);
  const bobCookie = extractSessionCookie(regBob);

  // Alice creates two shares
  const share1Res = await worker.fetch(
    new Request("https://d2r.example/api/builds/share", {
      method: "POST",
      headers: { "content-type": "application/json", "sec-fetch-site": "same-origin", cookie: aliceCookie },
      body: JSON.stringify({ classId: "sor", title: "暴风雪开荒", paperdoll: { charLvl: 88 }, skills: { Blizzard: 20 } })
    }),
    env
  );
  assert.equal(share1Res.status, 201);
  const s1 = await share1Res.json();

  const share2Res = await worker.fetch(
    new Request("https://d2r.example/api/builds/share", {
      method: "POST",
      headers: { "content-type": "application/json", "sec-fetch-site": "same-origin", cookie: aliceCookie },
      body: JSON.stringify({ classId: "war", title: "恶魔吞噬术士", paperdoll: { charLvl: 95 }, skills: { "Hex Purge": 20 } })
    }),
    env
  );
  assert.equal(share2Res.status, 201);
  const s2 = await share2Res.json();

  // Alice lists her shares (newest first)
  const listRes = await worker.fetch(
    new Request("https://d2r.example/api/user/shares", { headers: { cookie: aliceCookie } }),
    env
  );
  assert.equal(listRes.status, 200);
  const listData = await listRes.json();
  assert.equal(listData.ok, true);
  assert.equal(listData.shares.length, 2);
  assert.equal(listData.shares[0].id, s2.id);
  assert.equal(listData.shares[0].title, "恶魔吞噬术士");
  assert.equal(listData.shares[0].charLvl, 95);
  assert.equal(listData.shares[0].shareUrl, `https://d2r.example/build/${s2.id}`);
  assert.equal(listData.shares[1].id, s1.id);

  // Cross-site DELETE blocked with 403
  const csrfDel = await worker.fetch(
    new Request(`https://d2r.example/api/builds/share/${s1.id}`, {
      method: "DELETE",
      headers: { "sec-fetch-site": "cross-site", cookie: aliceCookie }
    }),
    env
  );
  assert.equal(csrfDel.status, 403);

  // Unauthenticated DELETE returns 401
  const anonDel = await worker.fetch(
    new Request(`https://d2r.example/api/builds/share/${s1.id}`, {
      method: "DELETE",
      headers: { "sec-fetch-site": "same-origin" }
    }),
    env
  );
  assert.equal(anonDel.status, 401);

  // Bob cannot revoke Alice's share (403)
  const bobDel = await worker.fetch(
    new Request(`https://d2r.example/api/builds/share/${s1.id}`, {
      method: "DELETE",
      headers: { "sec-fetch-site": "same-origin", cookie: bobCookie }
    }),
    env
  );
  assert.equal(bobDel.status, 403);

  // Alice revokes s1 (200)
  const aliceDel = await worker.fetch(
    new Request(`https://d2r.example/api/builds/share/${s1.id}`, {
      method: "DELETE",
      headers: { "sec-fetch-site": "same-origin", cookie: aliceCookie }
    }),
    env
  );
  assert.equal(aliceDel.status, 200);
  assert.deepEqual(await aliceDel.json(), { ok: true, id: s1.id, deleted: true });

  // Revoked share returns 404 on JSON & SSR page
  assert.equal((await worker.fetch(new Request(`https://d2r.example/api/builds/share/${s1.id}`), env)).status, 404);
  assert.equal((await worker.fetch(new Request(`https://d2r.example/build/${s1.id}`), env)).status, 404);

  // Alice's share list now only has s2
  const listAfter = await (await worker.fetch(
    new Request("https://d2r.example/api/user/shares", { headers: { cookie: aliceCookie } }),
    env
  )).json();
  assert.equal(listAfter.shares.length, 1);
  assert.equal(listAfter.shares[0].id, s2.id);
});
