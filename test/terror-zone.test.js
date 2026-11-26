import assert from "node:assert/strict";
import test from "node:test";

import {
  appendTerrorZoneHistory,
  enrichTerrorZone,
  fetchTerrorZoneWithRetry,
  isTerrorZonePullDue,
  isTerrorZonePeriodStale,
  normalizeTerrorZone,
  projectTerrorZoneForDisplay,
  translateTerrorZone
} from "../src/terror-zone.js";

test("规范化当前和下一阶段恐怖区域", () => {
  const result = normalizeTerrorZone(
    {
      current: "Kurast Bazaar, Ruined Temple, and Disused Fane",
      next: "Arreat Plateau and Pit of Acheron"
    },
    "2026-06-13T00:00:00.000Z"
  );

  assert.equal(result.currentZh, "库拉斯特商场、破败神殿与废弃寺院");
  assert.equal(result.nextZh, "亚瑞特高原与冥河深坑");
  assert.deepEqual(
    result.currentDetails.immunities.map((item) => item.name),
    ["火焰", "冰冷", "闪电", "毒素"]
  );
  assert.equal(result.schemaVersion, 3);
  assert.equal(result.nextDetails.ratingText, "一般");
  assert.equal(result.nextDetails.rating, "C");
  assert.equal(result.checkedAt, "2026-06-13T00:00:00.000Z");
});

test("兼容嵌套接口字段并为未知区域保留英文名", () => {
  const result = normalizeTerrorZone({
    currentTerrorZone: { zone: "Unknown Current Zone" },
    nextTerrorZone: { zone: "Unknown Next Zone" }
  });

  assert.equal(result.currentZh, "Unknown Current Zone");
  assert.equal(result.nextZh, "Unknown Next Zone");
  assert.equal(translateTerrorZone("Unknown Next Zone"), "Unknown Next Zone");
});

test("将新版接口区域名称转换为中文", () => {
  assert.equal(
    translateTerrorZone("Burial Grounds, Crypt, and Mausoleum"),
    "埋骨之地、墓地与大陵墓"
  );
  assert.equal(
    translateTerrorZone("Nihlathak's Temple and Temple Halls"),
    "尼拉塞克神殿与神殿大厅"
  );
  assert.equal(
    translateTerrorZone("Tamoe Highland, Outer Cloister, and The Pit"),
    "泰摩高地、外侧回廊与地穴"
  );
  assert.equal(
    translateTerrorZone("Frozen Tundra and Infernal Pit"),
    "冰冻苔原与炼狱深坑"
  );
});

test("将错误映射的 schema 2 状态恢复为当前和下一阶段", () => {
  const result = enrichTerrorZone({
    schemaVersion: 2,
    current: "Arcane Sanctuary",
    previous: "Tamoe Highland, Outer Cloister, and The Pit",
    checkedAt: "2026-08-31T01:32:01.167Z"
  });

  assert.equal(result.schemaVersion, 3);
  assert.equal(result.currentZh, "泰摩高地、外侧回廊与地穴");
  assert.equal(result.nextZh, "神秘避难所");
});

test("缺少当前或下一阶段时拒绝无效响应", () => {
  assert.throws(
    () => normalizeTerrorZone({ current: "Travincal" }),
    /返回格式不正确/
  );
});

test("半小时边界后标记恐怖区域数据过期", () => {
  const terrorZone = { checkedAt: "2026-06-13T07:04:57.000Z" };
  assert.equal(
    isTerrorZonePeriodStale(
      terrorZone,
      Date.parse("2026-06-13T07:29:59.000Z")
    ),
    false
  );
  assert.equal(
    isTerrorZonePeriodStale(
      terrorZone,
      Date.parse("2026-06-13T07:30:00.000Z")
    ),
    true
  );
});

test("恐怖区域在未确认或边界后十分钟内持续拉取", () => {
  const staleZone = { checkedAt: "2026-06-13T07:04:57.000Z" };
  assert.equal(
    isTerrorZonePullDue(
      staleZone,
      Date.parse("2026-06-13T07:29:59.000Z")
    ),
    false
  );
  assert.equal(
    isTerrorZonePullDue(
      staleZone,
      Date.parse("2026-06-13T07:30:00.000Z")
    ),
    true
  );
  assert.equal(
    isTerrorZonePullDue(
      staleZone,
      Date.parse("2026-06-13T07:39:59.000Z")
    ),
    true
  );
  // 即使超过 10 分钟，只要当前半小时仍未确认就继续拉取
  assert.equal(
    isTerrorZonePullDue(
      staleZone,
      Date.parse("2026-06-13T07:40:00.000Z")
    ),
    true
  );
  // 本半小时已确认后，10 分钟窗口外不再拉取
  assert.equal(
    isTerrorZonePullDue(
      { checkedAt: "2026-06-13T07:31:00.000Z" },
      Date.parse("2026-06-13T07:40:00.000Z")
    ),
    false
  );
  assert.equal(
    isTerrorZonePullDue(
      { checkedAt: "2026-06-13T07:30:01.000Z" },
      Date.parse("2026-06-13T07:34:00.000Z")
    ),
    true
  );
});

test("恐怖区域重试机制：失败或返回旧数据时按间隔重试直到拿到新数据", async () => {
  let calls = 0;
  const slept = [];
  const previous = {
    current: "The Pit",
    next: "Tristram",
    checkedAt: "2026-06-13T07:02:00.000Z"
  };
  const fakeFetch = async () => {
    calls += 1;
    if (calls === 1) {
      return new Response("upstream error", { status: 502 });
    }
    if (calls === 2) {
      return new Response(
        JSON.stringify({ current: "The Pit", next: "Tristram" }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ current: "Tristram", next: "Chaos Sanctuary" }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  };

  const result = await fetchTerrorZoneWithRetry(
    {},
    {
      fetchImpl: fakeFetch,
      previousTerrorZone: previous,
      maxAttempts: 3,
      retryDelayMs: 8000,
      now: Date.parse("2026-06-13T07:30:05.000Z"),
      sleepFn: async (ms) => slept.push(ms)
    }
  );

  assert.equal(calls, 3);
  assert.deepEqual(slept, [8000, 8000]);
  assert.equal(result.current, "Tristram");
  assert.equal(result.next, "Chaos Sanctuary");
});

test("追加并维护恐怖地带历史轮换队列", () => {
  const t1 = normalizeTerrorZone(
    { current: "The Pit", next: "Tristram" },
    "2026-06-13T07:00:00.000Z"
  );
  const t2 = normalizeTerrorZone(
    { current: "Tristram", next: "Moo Moo Farm" },
    "2026-06-13T07:30:00.000Z"
  );

  let history = appendTerrorZoneHistory([], t1, "2026-06-13T07:00:00.000Z");
  assert.equal(history.length, 1);
  assert.equal(history[0].zone, "The Pit");
  assert.equal(history[0].zoneZh, "地穴");
  assert.equal(history[0].act, 1);

  // 同一轮（同一半小时）不重复追加，而是更新
  history = appendTerrorZoneHistory(history, t1, "2026-06-13T07:05:00.000Z");
  assert.equal(history.length, 1);

  // 新半小时轮换追加到头部
  history = appendTerrorZoneHistory(history, t2, "2026-06-13T07:30:00.000Z");
  assert.equal(history.length, 2);
  assert.equal(history[0].zone, "Tristram");
  assert.equal(history[1].zone, "The Pit");
});

test("整点/半点即时晋升下一阶段为目前恐怖区域并将下一阶段置为待获取", () => {
  const stored = normalizeTerrorZone(
    { current: "The Pit", next: "Chaos Sanctuary" },
    "2026-06-13T07:01:30.000Z"
  );

  // 边界前 1 秒：仍保持当前与下阶段预告
  const before = projectTerrorZoneForDisplay(stored, Date.parse("2026-06-13T07:29:59.000Z"));
  assert.equal(before.current, "The Pit");
  assert.equal(before.next, "Chaos Sanctuary");
  assert.equal(before.isRolledOver, false);
  assert.equal(before.awaitingNext, false);

  // 刚过半点（07:30:00）：立即将 Chaos Sanctuary 晋升为目前恐怖区域，next 置空待获取
  const rolled = projectTerrorZoneForDisplay(stored, Date.parse("2026-06-13T07:30:00.000Z"));
  assert.equal(rolled.current, "Chaos Sanctuary");
  assert.equal(rolled.currentZh, "混沌避难所");
  assert.equal(rolled.currentDetails?.rating, "S");
  assert.equal(rolled.next, null);
  assert.equal(rolled.nextZh, null);
  assert.equal(rolled.isRolledOver, true);
  assert.equal(rolled.awaitingNext, true);

  // 超过 1 个周期未同步（08:00:00）：标记过期且不误晋升
  const stale = projectTerrorZoneForDisplay(stored, Date.parse("2026-06-13T08:00:00.000Z"));
  assert.equal(stale.next, null);
  assert.equal(stale.awaitingNext, true);
  assert.equal(stale.isStale, true);
  assert.equal(stale.isRolledOver, false);
});
