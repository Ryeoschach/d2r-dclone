import assert from "node:assert/strict";
import test from "node:test";

import {
  getAllTerrorZones,
  getTerrorZoneMetadata
} from "../src/terror-zone-metadata.js";

test("返回恐怖区域的常见免疫和评级", () => {
  const details = getTerrorZoneMetadata("Ancient Tunnels");

  assert.deepEqual(
    details.immunities.map((item) => item.name),
    ["火焰", "闪电", "毒素", "魔法"]
  );
  assert.equal(details.rating, "A");
  assert.equal(details.ratingText, "优秀");
  assert.equal(details.act, 2);

  const durance = getTerrorZoneMetadata("Durance of Hate");
  assert.equal(durance.rating, "B");
  assert.equal(durance.ratingText, "良好");
});

test("兼容接口区域名称别名", () => {
  const details = getTerrorZoneMetadata("Chaos Sanctuary");

  assert.deepEqual(
    details.immunities.map((item) => item.name),
    ["火焰", "冰冷", "闪电"]
  );
  assert.equal(details.rating, "S");
  assert.equal(details.ratingText, "极佳");
  assert.equal(details.act, 4);
});

test("未标注免疫和未知区域均安全回退", () => {
  assert.deepEqual(getTerrorZoneMetadata("Moo Moo Farm").immunities, []);
  assert.equal(getTerrorZoneMetadata("Moo Moo Farm").rating, "S");
  assert.equal(getTerrorZoneMetadata("Moo Moo Farm").act, 1);
  assert.equal(getTerrorZoneMetadata("Unknown Zone").ratingText, "未评级");
});

test("导出全部 37 个恐怖地带完整图鉴列表", () => {
  const allZones = getAllTerrorZones();
  assert.equal(allZones.length, 37);

  const act1 = allZones.filter((item) => item.act === 1);
  const act2 = allZones.filter((item) => item.act === 2);
  const act3 = allZones.filter((item) => item.act === 3);
  const act4 = allZones.filter((item) => item.act === 4);
  const act5 = allZones.filter((item) => item.act === 5);

  assert.equal(act1.length, 12);
  assert.equal(act2.length, 8);
  assert.equal(act3.length, 6);
  assert.equal(act4.length, 3);
  assert.equal(act5.length, 8);

  const cow = allZones.find((item) => item.zone === "Moo Moo Farm");
  assert.equal(cow.zoneZh, "秘密奶牛关");
  assert.equal(cow.rating, "S");
});
