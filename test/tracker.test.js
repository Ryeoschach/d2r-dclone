import assert from "node:assert/strict";
import test from "node:test";

import {
  buildFeishuMessage,
  findChanges,
  formatServerName,
  normalizeServers,
  validateServerCombinations
} from "../src/tracker.js";
import { renderDashboard } from "../src/dashboard.js";

const server = {
  server: "ladderSoftcoreAsiaRotw",
  progress: 4,
  message: "Terror spreads across Sanctuary",
  ladder: true,
  hardcore: false,
  rotw: true,
  region: "AsiaRotw",
  lastUpdate: { seconds: 1781179410 },
  lastWalk: { seconds: 1780922270 }
};

test("规范化 API 数据", () => {
  const [result] = normalizeServers({ servers: [server] });
  assert.equal(result.lastUpdate, 1781179410);
  assert.equal(result.lastWalk, 1780922270);
  assert.equal(result.rotw, true);
});

test("忽略只有 lastUpdate 变化的记录", () => {
  const [before] = normalizeServers({ servers: [server] });
  const after = { ...before, lastUpdate: before.lastUpdate + 300 };
  assert.deepEqual(findChanges([before], [after]), []);
});

test("发现进度和触发时间变化", () => {
  const [before] = normalizeServers({ servers: [server] });
  const after = { ...before, progress: 5, lastWalk: before.lastWalk + 100 };
  const changes = findChanges([before], [after]);
  assert.equal(changes.length, 1);
  assert.equal(changes[0].before.progress, 4);
  assert.equal(changes[0].after.progress, 5);
});

test("生成中文服务器名和飞书卡片", () => {
  const [after] = normalizeServers({ servers: [server] });
  assert.equal(formatServerName(after), "亚洲｜术士君临｜天梯｜SC");

  const message = buildFeishuMessage([
    { type: "added", before: null, after }
  ]);
  const content = message.card.elements[0].content;
  assert.match(content, /术士君临/);
  assert.match(content, /4\/6 恐怖蔓延至庇护之地/);
});

test("验证接口包含全部 24 种组合", () => {
  const servers = [];
  for (const rotw of [false, true]) {
    for (const ladder of [false, true]) {
      for (const hardcore of [false, true]) {
        for (const region of ["Asia", "Americas", "Europe"]) {
          servers.push({
            server: `${ladder ? "ladder" : "nonLadder"}${hardcore ? "Hardcore" : "Softcore"}${region}${rotw ? "Rotw" : ""}`,
            progress: 1,
            message: "",
            ladder,
            hardcore,
            rotw,
            region: `${region}${rotw ? "Rotw" : ""}`,
            lastUpdate: 1,
            lastWalk: 0
          });
        }
      }
    }
  }

  assert.doesNotThrow(() => validateServerCombinations(servers));
  assert.throws(
    () => validateServerCombinations(servers.slice(1)),
    /服务器组合不完整/
  );
});

test("毁灭之王 HC 映射正确", () => {
  const [result] = normalizeServers({
    servers: [{
      ...server,
      server: "nonLadderHardcoreEurope",
      ladder: false,
      hardcore: true,
      rotw: false,
      region: "Europe"
    }]
  });

  assert.equal(formatServerName(result), "欧洲｜毁灭之王｜非天梯｜HC");
});

test("仪表盘包含完整分组和筛选入口", () => {
  const html = renderDashboard();
  assert.match(html, /毁灭之王/);
  assert.match(html, /术士君临/);
  assert.match(html, /非天梯 SC/);
  assert.match(html, /天梯 HC/);
  assert.match(html, /4 阶以上/);
  assert.match(html, /\/api\/status/);
});
