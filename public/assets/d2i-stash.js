// Pure client-side D2R 3.4 (v105) Shared Stash (.d2i) parser, 10x10 auto-packer, incremental merger & exporter.
// Verified byte-for-byte against native ModernSharedStashSoftCoreV2.d2i (7 tabs: 5 Normal + 1 AdvancedStash + 1 Chronicle).
import {
  D2S_MAGIC,
  D2R_HUFFMAN_CODES,
  D2S_ADV_STACKABLE_META,
  D2S_ITEM_SIZES,
  encodeD2rV5Item
} from "./d2s-exporter.js?v=7276ddeb64";

const STASH_W = 10;
const STASH_H = 10;
const TAB_HEADER_SIZE = 64;
const D2I_VERSION = 105;

const HUFFMAN_REV = new Map(Object.entries(D2R_HUFFMAN_CODES).map(([ch, bits]) => [bits, ch]));

function concatBytes(chunks) {
  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return out;
}

export function getItemGridSize(code) {
  const clean = String(code || "").trim().toLowerCase();
  const sz = D2S_ITEM_SIZES[clean];
  return sz ? [sz[0], sz[1]] : [1, 1];
}

export function createEmptyGrid(w = STASH_W, h = STASH_H) {
  return Array.from({ length: h }, () => Array(w).fill(false));
}

/**
 * Pack items (each having `code`, or explicit `w`/`h`) into a 10x10 stash grid without overlaps.
 * Optionally accepts a pre-populated `occupied` boolean[10][10] grid.
 */
export function packItemsInto10x10(items, occupied = null) {
  const occ = occupied
    ? occupied.map((row) => [...row])
    : createEmptyGrid(STASH_W, STASH_H);

  const enriched = (items || []).map((item, idx) => {
    const [gw, gh] = getItemGridSize(item && item.code);
    const w = Math.max(1, Math.min(STASH_W, Number(item && item.w) || gw));
    const h = Math.max(1, Math.min(STASH_H, Number(item && item.h) || gh));
    return { item, w, h, idx };
  });

  // Pack larger items first for optimal space utilization
  const sorted = [...enriched].sort((a, b) => (b.h * 10 + b.w) - (a.h * 10 + a.w) || a.idx - b.idx);
  const placed = [];
  const overflow = [];

  for (const entry of sorted) {
    let pos = null;
    for (let x = 0; x <= STASH_W - entry.w && !pos; x += 1) {
      for (let y = 0; y <= STASH_H - entry.h && !pos; y += 1) {
        let fits = true;
        for (let dx = 0; dx < entry.w && fits; dx += 1) {
          for (let dy = 0; dy < entry.h && fits; dy += 1) {
            if (occ[y + dy][x + dx]) fits = false;
          }
        }
        if (fits) pos = { x, y };
      }
    }
    if (pos) {
      for (let dx = 0; dx < entry.w; dx += 1) {
        for (let dy = 0; dy < entry.h; dy += 1) {
          occ[pos.y + dy][pos.x + dx] = true;
        }
      }
      placed.push({ ...entry.item, x: pos.x, y: pos.y, w: entry.w, h: entry.h, location: 0, equippedId: 0, storePage: 5 });
    } else {
      overflow.push(entry.item);
    }
  }

  let usedCells = 0;
  for (let y = 0; y < STASH_H; y += 1) {
    for (let x = 0; x < STASH_W; x += 1) {
      if (occ[y][x]) usedCells += 1;
    }
  }
  return { placed, overflow, occupied: occ, usedCells, freeCells: STASH_W * STASH_H - usedCells };
}

/**
 * Encode a single stackable Rune / Gem / Material / Rejuv Potion for D2R 3.4 Tab 5 (AdvancedStash).
 * Matches native ModernSharedStashSoftCoreV2.d2i bit-for-bit:
 * - Simple stackables (runes, gems, rejuvs): simple=true, hasQty=1, 8-bit qty
 * - Quest materials (keys, organs, essences, token, shards, statues): simple=false, quality=2, stats=[], hasAdvQty=1, 8-bit qty
 */
export function encodeAdvancedStackItem(code, qty, itemId = 0x30000001) {
  const clean = String(code || "").trim().toLowerCase();
  const meta = D2S_ADV_STACKABLE_META[clean];
  if (!meta) return new Uint8Array(0);
  const clamped = Math.min(99, Math.max(1, Math.round(Number(qty) || 1)));
  return encodeD2rV5Item({
    code: clean,
    simple: !meta.complex,
    v105: true,
    location: 0,
    equippedId: 0,
    x: clamped & 0x0f,
    y: (clamped >>> 4) & 0x0f,
    storePage: 5,
    quality: 2,
    ilvl: 85,
    itemId,
    stats: [],
    advQty: clamped
  });
}

function makeTabHeader(tabType, totalTabLength, gold = 0) {
  const hdr = new Uint8Array(TAB_HEADER_SIZE);
  const dv = new DataView(hdr.buffer);
  dv.setUint32(0x00, D2S_MAGIC, true);
  dv.setUint32(0x04, 2, true); // D2R 3.4 shared stash format v2
  dv.setUint32(0x08, D2I_VERSION, true); // 105
  dv.setUint32(0x0c, Math.max(0, Math.min(2500000, Math.round(Number(gold) || 0))), true);
  dv.setUint32(0x10, totalTabLength, true);
  dv.setUint32(0x14, tabType, true);
  return hdr;
}

function makeEmptyChronicleTab() {
  // Valid 148-byte empty D2R 3.4 Chronicle tab (64B header + 84B body starting with 0xc0eaedc0, version 1)
  const body = new Uint8Array(84);
  body[0] = 0xc0;
  body[1] = 0xed;
  body[2] = 0xea;
  body[3] = 0xc0;
  body[4] = 0x01;
  return concatBytes([makeTabHeader(2, TAB_HEADER_SIZE + body.length, 0), body]);
}

function decodeBitReader(bytes, startByte) {
  let bpos = startByte * 8;
  const totalBits = bytes.length * 8;
  const rb = (n) => {
    if (bpos + n > totalBits) throw new RangeError("Unexpected EOF in .d2i bitstream");
    let v = 0;
    for (let i = 0; i < n; i += 1) {
      v += ((bytes[bpos >>> 3] >>> (bpos & 7)) & 1) * (2 ** i);
      bpos += 1;
    }
    return v;
  };
  const readHuff = () => {
    let s = "";
    for (let k = 0; k < 4; k += 1) {
      let acc = "";
      while (!HUFFMAN_REV.has(acc)) {
        acc += rb(1) ? "1" : "0";
        if (acc.length > 12) throw new Error("Invalid Huffman code in .d2i");
      }
      s += HUFFMAN_REV.get(acc);
    }
    return s.trim();
  };
  const align = () => {
    const mod = bpos & 7;
    if (mod !== 0) bpos += 8 - mod;
  };
  return { rb, readHuff, align, bytePos: () => bpos >>> 3 };
}

/**
 * Scan raw bytes of a Normal Tab (type=0) to mark occupied 10x10 grid cells conservatively
 * without requiring full stat-list parsing of arbitrary user items (so any rare/crafted/modded item is 100% preserved).
 */
function scanNormalTabOccupancy(tabBytes) {
  const occ = createEmptyGrid(STASH_W, STASH_H);
  if (tabBytes.length < TAB_HEADER_SIZE + 4) return occ;
  // Scan for valid D2R v105 item headers: bit 4 (0x10) + bit 23 (0x800000), ver=5, loc=0, storePage=5
  for (let i = TAB_HEADER_SIZE + 4; i <= tabBytes.length - 9; i += 1) {
    const f =
      tabBytes[i] |
      (tabBytes[i + 1] << 8) |
      (tabBytes[i + 2] << 16) |
      ((tabBytes[i + 3] << 24) >>> 0);
    if ((f & 0x00800010) !== 0x00800010) continue;
    if ((f & 0xfb000000) !== 0) continue;
    if ((tabBytes[i + 4] & 7) !== 5) continue; // ver=5
    const loc = (tabBytes[i + 4] >>> 3) & 7;
    if (loc !== 0) continue;
    try {
      const r = decodeBitReader(tabBytes, i);
      r.rb(32); r.rb(3); r.rb(3); r.rb(4);
      const x = r.rb(4);
      const y = r.rb(4);
      const sp = r.rb(3);
      if (sp !== 5 || x >= STASH_W || y >= STASH_H) continue;
      const code = r.readHuff();
      if (!/^[a-z0-9]{3}$/.test(code)) continue;
      const [w, h] = getItemGridSize(code);
      for (let dx = 0; dx < w && x + dx < STASH_W; dx += 1) {
        for (let dy = 0; dy < h && y + dy < STASH_H; dy += 1) {
          occ[y + dy][x + dx] = true;
        }
      }
    } catch {
      // Ignore false-positive header matches
    }
  }
  return occ;
}

/**
 * Parse all stackable items in Tab 5 (AdvancedStash, tabType=1) into a Map<code, qty>.
 */
function parseAdvancedStashTab(tabBytes) {
  const stackMap = new Map();
  if (tabBytes.length < TAB_HEADER_SIZE + 4) return stackMap;
  if (tabBytes[TAB_HEADER_SIZE] !== 0x4a || tabBytes[TAB_HEADER_SIZE + 1] !== 0x4d) return stackMap;
  const r = decodeBitReader(tabBytes, TAB_HEADER_SIZE);
  r.rb(16); // 'JM'
  const count = r.rb(16);
  for (let i = 0; i < count; i += 1) {
    const flags = r.rb(32);
    r.rb(3); // ver
    r.rb(3); // loc
    r.rb(4); // eq
    const x = r.rb(4);
    const y = r.rb(4);
    r.rb(3); // sp
    const code = r.readHuff();
    const simple = Boolean(flags & 0x200000);
    if (simple) {
      r.rb(1); // realm
      const hasQty = r.rb(1);
      const qty = hasQty ? r.rb(8) : 1;
      r.align();
      stackMap.set(code, Math.max(1, Math.min(99, qty || ((y << 4) | x) || 1)));
      continue;
    }
    // Complex quest material in AdvancedStash (quality=2, empty stat list, hasAdvQty=1 + 8-bit qty)
    r.rb(3); // nrSock
    r.rb(32); // itemId
    r.rb(7); // ilvl
    const q = r.rb(4);
    if (r.rb(1)) r.rb(3);
    if (r.rb(1)) r.rb(11);
    if (q === 1 || q === 3) r.rb(3);
    else if (q === 4) { r.rb(11); r.rb(11); }
    else if (q === 5 || q === 7) r.rb(12);
    r.rb(1); // realm
    r.rb(1); // v105 flag
    // Skip stat list until 0x1ff (empty for quest materials)
    while (r.rb(9) !== 0x1ff) {
      // Safeguard against unexpected non-empty stats
      throw new Error(`Unexpected stat in AdvancedStash complex item ${code}`);
    }
    const hasAdvQty = r.rb(1);
    const qty = hasAdvQty ? r.rb(8) : 1;
    r.align();
    stackMap.set(code, Math.max(1, Math.min(99, qty || ((y << 4) | x) || 1)));
  }
  return stackMap;
}

/**
 * Parse a D2R 3.4 (v105) ModernSharedStash*.d2i file into its constituent tabs.
 */
export function parseD2iBuffer(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  if (bytes.length < TAB_HEADER_SIZE) {
    throw new Error("文件过小，不是有效的 D2R 3.4 共享仓库 (.d2i) 文件");
  }
  const tabs = [];
  let off = 0;
  while (off + TAB_HEADER_SIZE <= bytes.length) {
    const dv = new DataView(bytes.buffer, bytes.byteOffset + off, bytes.length - off);
    const magic = dv.getUint32(0x00, true);
    if (magic !== D2S_MAGIC) {
      throw new Error(`共享仓库页头签名不匹配（偏移 0x${off.toString(16)}）`);
    }
    const format = dv.getUint32(0x04, true);
    const version = dv.getUint32(0x08, true);
    const gold = dv.getUint32(0x0c, true);
    const tabLen = dv.getUint32(0x10, true);
    const tabType = dv.getUint32(0x14, true);
    if (tabLen < TAB_HEADER_SIZE || off + tabLen > bytes.length) {
      throw new Error(`共享仓库页长度异常（tabLen=${tabLen}，剩余=${bytes.length - off}）`);
    }
    const raw = bytes.slice(off, off + tabLen);
    tabs.push({ format, version, gold, tabLen, tabType, raw });
    off += tabLen;
  }
  if (tabs.length === 0) {
    throw new Error("未在 .d2i 文件中解析到任何仓库页");
  }

  const normalTabs = tabs
    .filter((t) => t.tabType === 0)
    .map((t) => {
      const count = t.raw.length >= TAB_HEADER_SIZE + 4
        ? (t.raw[TAB_HEADER_SIZE + 2] | (t.raw[TAB_HEADER_SIZE + 3] << 8))
        : 0;
      const rawItemsBody = t.raw.length > TAB_HEADER_SIZE + 4 ? t.raw.slice(TAB_HEADER_SIZE + 4) : new Uint8Array(0);
      return {
        gold: t.gold,
        itemCount: count,
        rawItemsBody,
        occupied: scanNormalTabOccupancy(t.raw),
        raw: t.raw
      };
    });

  const advTab = tabs.find((t) => t.tabType === 1) || null;
  const chronicleTab = tabs.find((t) => t.tabType === 2) || null;
  const stackables = advTab ? parseAdvancedStashTab(advTab.raw) : new Map();

  return {
    version: tabs[0].version,
    tabCount: tabs.length,
    normalTabs,
    advancedTab: advTab,
    chronicleTab,
    stackables: Object.fromEntries(stackables.entries()),
    totalStackTypes: stackables.size,
    totalNormalItems: normalTabs.reduce((s, t) => s + t.itemCount, 0)
  };
}

/**
 * Build a complete D2R 3.4 (v105) 7-tab ModernSharedStashSoftCoreV2.d2i / HardCoreV2.d2i binary buffer.
 * Supports either fresh generation OR non-destructive merge onto an uploaded user `.d2i`
 * (preserving existing 5 normal tabs, merging stackables in Tab 5, and preserving Tab 6 Chronicle verbatim).
 */
export function buildD2iBuffer({
  baseD2iBytes = null,
  normalTabItems = [[], [], [], [], []],
  stackables = {},
  gold = 2500000,
  hardcore = false,
  replaceStackables = false
} = {}) {
  const parsed = baseD2iBytes ? parseD2iBuffer(baseD2iBytes) : null;
  const tabChunks = [];
  let addedGearCount = 0;
  let overflowGearCount = 0;
  let idSeq = 0x30000100;

  // Tabs 0..4: 5 Normal 10x10 Shared Stash tabs
  for (let t = 0; t < 5; t += 1) {
    const existing = parsed && parsed.normalTabs[t] ? parsed.normalTabs[t] : null;
    const newSpecs = Array.isArray(normalTabItems && normalTabItems[t]) ? normalTabItems[t] : [];
    const tabGold = existing ? existing.gold : (t === 0 ? gold : 0);

    if (newSpecs.length === 0 && existing) {
      tabChunks.push(existing.raw);
      continue;
    }

    const packed = packItemsInto10x10(newSpecs, existing ? existing.occupied : null);
    overflowGearCount += packed.overflow.length;
    const encodedNew = [];
    for (const spec of packed.placed) {
      const bytes = encodeD2rV5Item({
        ...spec,
        v105: true,
        location: 0,
        equippedId: 0,
        storePage: 5,
        itemId: spec.itemId || (idSeq += 1)
      });
      if (bytes && bytes.length > 0) encodedNew.push(bytes);
    }
    addedGearCount += encodedNew.length;

    const totalCount = (existing ? existing.itemCount : 0) + encodedNew.length;
    const jmHead = new Uint8Array(4);
    jmHead[0] = 0x4a;
    jmHead[1] = 0x4d;
    new DataView(jmHead.buffer).setUint16(2, totalCount, true);
    const body = concatBytes([
      jmHead,
      ...(existing && existing.rawItemsBody.length ? [existing.rawItemsBody] : []),
      ...encodedNew
    ]);
    tabChunks.push(concatBytes([makeTabHeader(0, TAB_HEADER_SIZE + body.length, tabGold), body]));
  }

  // Tab 5: AdvancedStash (tabType=1) — all stackable Runes, Gems, Materials, Rejuv Potions (1..99)
  const mergedStacks = new Map();
  if (parsed && !replaceStackables) {
    for (const [code, qty] of Object.entries(parsed.stackables || {})) {
      if (qty > 0 && D2S_ADV_STACKABLE_META[code]) mergedStacks.set(code, Math.min(99, Math.max(1, qty)));
    }
  }
  for (const [code, qty] of Object.entries(stackables || {})) {
    const clean = String(code || "").trim().toLowerCase();
    if (!D2S_ADV_STACKABLE_META[clean]) continue;
    const n = Math.round(Number(qty) || 0);
    if (n <= 0) {
      mergedStacks.delete(clean);
    } else {
      mergedStacks.set(clean, Math.min(99, n));
    }
  }

  const advChunks = [];
  for (const [code, qty] of mergedStacks.entries()) {
    const chunk = encodeAdvancedStackItem(code, qty, (idSeq += 1));
    if (chunk && chunk.length > 0) advChunks.push(chunk);
  }
  const advJmHead = new Uint8Array(4);
  advJmHead[0] = 0x4a;
  advJmHead[1] = 0x4d;
  new DataView(advJmHead.buffer).setUint16(2, advChunks.length, true);
  const advBody = concatBytes([advJmHead, ...advChunks]);
  tabChunks.push(concatBytes([makeTabHeader(1, TAB_HEADER_SIZE + advBody.length, 0), advBody]));

  // Tab 6: Chronicle (tabType=2) — preserve verbatim if base .d2i provided, else valid empty 148-byte Chronicle
  if (parsed && parsed.chronicleTab) {
    tabChunks.push(parsed.chronicleTab.raw);
  } else {
    tabChunks.push(makeEmptyChronicleTab());
  }

  const bytes = concatBytes(tabChunks);
  return {
    bytes,
    filename: hardcore ? "ModernSharedStashHardCoreV2.d2i" : "ModernSharedStashSoftCoreV2.d2i",
    meta: {
      version: D2I_VERSION,
      mergedFromExisting: Boolean(parsed),
      addedGearCount,
      overflowGearCount,
      stackTypeCount: advChunks.length,
      totalStackUnits: [...mergedStacks.values()].reduce((s, v) => s + v, 0),
      byteLength: bytes.length
    }
  };
}
