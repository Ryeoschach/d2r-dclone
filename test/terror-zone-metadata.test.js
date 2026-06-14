import assert from "node:assert/strict";
import test from "node:test";

import { getTerrorZoneMetadata } from "../src/terror-zone-metadata.js";

test("返回恐怖区域的常见免疫和评级", () => {
  const details = getTerrorZoneMetadata("Durance of Hate");

  assert.deepEqual(
    details.immunities.map((item) => item.name),
    ["火焰", "冰冷", "闪电", "毒素"]
  );
  assert.equal(details.rating, "A");
  assert.equal(details.ratingText, "优秀");
});

test("兼容接口区域名称别名", () => {
  const details = getTerrorZoneMetadata("Chaos Sanctuary");

  assert.deepEqual(
    details.immunities.map((item) => item.name),
    ["火焰", "冰冷", "闪电"]
  );
  assert.equal(details.rating, "F");
});

test("未标注免疫和未知区域均安全回退", () => {
  assert.deepEqual(getTerrorZoneMetadata("Moo Moo Farm").immunities, []);
  assert.equal(getTerrorZoneMetadata("Moo Moo Farm").rating, "S");
  assert.equal(getTerrorZoneMetadata("Unknown Zone").ratingText, "未评级");
});
