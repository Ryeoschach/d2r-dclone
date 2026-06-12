import assert from "node:assert/strict";
import test from "node:test";

import {
  isTerrorZonePullDue,
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

  assert.equal(result.currentZh, "库拉斯特商场、残破神殿与废弃圣堂");
  assert.equal(result.nextZh, "亚瑞特高原与亚巴顿深坑");
  assert.equal(result.checkedAt, "2026-06-13T00:00:00.000Z");
});

test("兼容嵌套接口字段并为未知区域保留英文名", () => {
  const result = normalizeTerrorZone({
    currentTerrorZone: { zone: "Unknown Current Zone" },
    nextTerrorZone: { zone: "Unknown Next Zone" }
  });

  assert.equal(result.currentZh, "Unknown Current Zone");
  assert.equal(translateTerrorZone("Unknown Next Zone"), "Unknown Next Zone");
});

test("缺少当前或下一阶段时拒绝无效响应", () => {
  assert.throws(
    () => normalizeTerrorZone({ current: "Travincal" }),
    /返回格式不正确/
  );
});

test("恐怖区域仅跨整点或半点后重新拉取", () => {
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
  assert.equal(isTerrorZonePullDue(null, Date.now()), true);
});
