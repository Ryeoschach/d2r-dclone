import assert from "node:assert/strict";
import test from "node:test";

import {
  appendTerrorZoneHistory,
  enrichTerrorZone,
  isTerrorZonePullDue,
  isTerrorZonePeriodStale,
  normalizeTerrorZone,
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

test("恐怖区域在边界后十分钟内重试", () => {
  const terrorZone = { checkedAt: "2026-06-13T07:04:57.000Z" };
  assert.equal(
    isTerrorZonePullDue(
      terrorZone,
      Date.parse("2026-06-13T07:29:59.000Z")
    ),
    false
  );
  assert.equal(
    isTerrorZonePullDue(
      terrorZone,
      Date.parse("2026-06-13T07:30:00.000Z")
    ),
    true
  );
  assert.equal(
    isTerrorZonePullDue(
      terrorZone,
      Date.parse("2026-06-13T07:39:59.000Z")
    ),
    true
  );
  assert.equal(
    isTerrorZonePullDue(
      terrorZone,
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
