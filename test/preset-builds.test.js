import assert from "node:assert/strict";
import test from "node:test";

import worker from "../src/index.js";
import { getPresetBuildsCatalog } from "../src/preset-builds.js";
import { getSkillsCatalog } from "../src/skills-catalog.js";
import { getItemsCatalog } from "../src/items-metadata.js";
import { getRunewordsCatalog } from "../src/runewords-metadata.js";
import { getPaperdollCatalog } from "../src/paperdoll-data.js";

test("D2R 3.4 热门流派预设库覆盖全部 8 大职业，且所有技能/装备/底材/符文之语/咒符 ID 严格有效", async () => {
  const res = await worker.fetch(new Request("https://d2r.example/api/presets"), {});
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.ok, true);
  assert.equal(body.version, "3.4");
  assert.ok(Array.isArray(body.presets) && body.presets.length >= 16);

  const skillsCat = getSkillsCatalog();
  const itemsCat = getItemsCatalog();
  const rwCat = getRunewordsCatalog();
  const pdCat = getPaperdollCatalog();

  const classMap = new Map((skillsCat.classes || []).map((c) => [c.id, new Set((c.skills || []).map((s) => s.key))]));
  const uniqueSet = new Set((itemsCat.uniqueItems || []).map((u) => u.nameEn));
  const setPieceSet = new Set((itemsCat.setItems || []).flatMap((s) => (s.detail?.pieces || []).map((p) => p.nameEn)));
  const rwSet = new Set((rwCat.runewords || []).map((r) => r.id));
  const baseSet = new Set(Object.keys(pdCat.baseRules || {}));
  const socketSet = new Set((pdCat.socketables || []).map((s) => s.id));
  const charmSet = new Set((pdCat.inventoryCharms || []).map((c) => c.id));

  const perClassCount = new Map();
  const seenIds = new Set();

  for (const preset of getPresetBuildsCatalog().presets) {
    assert.ok(!seenIds.has(preset.id), `重复的预设 ID: ${preset.id}`);
    seenIds.add(preset.id);

    const validSkills = classMap.get(preset.classId);
    assert.ok(validSkills, `未知职业 ID: ${preset.classId}`);
    perClassCount.set(preset.classId, (perClassCount.get(preset.classId) || 0) + 1);

    assert.ok(validSkills.has(preset.selectedSkillKey), `${preset.id} 主攻技能不存在: ${preset.selectedSkillKey}`);
    let ptsSum = 0;
    for (const [k, v] of Object.entries(preset.skills || {})) {
      assert.ok(validSkills.has(k), `${preset.id} 技能不存在: ${k}`);
      assert.ok(Number.isInteger(v) && v >= 1 && v <= 20, `${preset.id} 技能点数非法: ${k}=${v}`);
      ptsSum += v;
    }
    assert.ok(ptsSum > 0 && ptsSum <= 110, `${preset.id} 技能总点数超限: ${ptsSum}`);

    const validateLoadout = (loadout, tag) => {
      for (const [slot, eq] of Object.entries(loadout || {})) {
        if (!eq) continue;
        if (eq.cat === "unique") {
          assert.ok(uniqueSet.has(eq.id), `${preset.id} ${tag}.${slot} 暗金不存在: ${eq.id}`);
        } else if (eq.cat === "set") {
          assert.ok(setPieceSet.has(eq.id), `${preset.id} ${tag}.${slot} 套装不存在: ${eq.id}`);
        } else if (eq.cat === "rw") {
          assert.ok(rwSet.has(eq.id), `${preset.id} ${tag}.${slot} 符文之语不存在: ${eq.id}`);
          assert.ok(baseSet.has(eq.baseCode), `${preset.id} ${tag}.${slot} 底材不存在: ${eq.baseCode}`);
        } else {
          assert.fail(`${preset.id} ${tag}.${slot} 未知分类: ${eq.cat}`);
        }
        for (const sk of eq.sockets || []) {
          assert.ok(socketSet.has(sk), `${preset.id} ${tag}.${slot} 镶嵌物不存在: ${sk}`);
        }
      }
    };

    validateLoadout(preset.paperdoll.charLoadout, "charLoadout");
    validateLoadout(preset.paperdoll.swapLoadout, "swapLoadout");
    validateLoadout(preset.paperdoll.mercLoadout, "mercLoadout");

    for (const b of preset.paperdoll.charBag || []) {
      assert.ok(charmSet.has(b.charmId), `${preset.id} 咒符不存在: ${b.charmId}`);
    }
  }

  for (const cid of ["war", "sor", "pal", "ama", "nec", "bar", "dru", "ass"]) {
    assert.ok((perClassCount.get(cid) || 0) >= 2, `职业 ${cid} 至少应包含 2 套预设`);
  }
});
