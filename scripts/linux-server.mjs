import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import worker from "../src/index.js";
import { createNodeSqliteKvAdapter } from "../src/sqlite-storage.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "0.0.0.0";
const DATA_PATH = process.env.DATA_PATH || path.join(ROOT_DIR, "data", "d2r-sanctuary.sqlite");
const ENABLE_CRON = process.env.ENABLE_CRON !== "false";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2"
};

const sqliteStore = createNodeSqliteKvAdapter(DATA_PATH);

const workerEnv = {
  DCLONE_STATE: sqliteStore,
  API_URL: process.env.API_URL || "https://d2runewizard.com/api/trackers/diablo-clone",
  TERROR_ZONE_API_URL: process.env.TERROR_ZONE_API_URL || "https://d2runewizard.com/api/trackers/terror-zone",
  BASE_VERSION_NAME: process.env.BASE_VERSION_NAME || "毁灭之王",
  TIME_ZONE: process.env.TIME_ZONE || "Asia/Shanghai",
  NOTIFY_ON_FIRST_RUN: process.env.NOTIFY_ON_FIRST_RUN || "true",
  FEISHU_WEBHOOK_URL: process.env.FEISHU_WEBHOOK_URL || "",
  MANUAL_TRIGGER_TOKEN: process.env.MANUAL_TRIGGER_TOKEN || "",
  ADMIN_ACCOUNT: process.env.ADMIN_ACCOUNT || "",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "",
  ADMIN_DISPLAY_NAME: process.env.ADMIN_DISPLAY_NAME || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || ""
};

function tryServeStaticAsset(reqPath, res) {
  if (!reqPath || reqPath === "/" || reqPath.includes("\0")) return false;
  let decoded;
  try {
    decoded = decodeURIComponent(reqPath);
  } catch {
    return false;
  }
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const fullPath = path.resolve(PUBLIC_DIR, `.${normalized.startsWith("/") ? normalized : `/${normalized}`}`);
  if (!fullPath.startsWith(PUBLIC_DIR + path.sep)) return false;
  if (!fs.existsSync(fullPath)) return false;
  const stat = fs.statSync(fullPath);
  if (!stat.isFile()) return false;

  const ext = path.extname(fullPath).toLowerCase();
  const mime = MIME_TYPES[ext] || "application/octet-stream";
  const cacheControl = normalized === "/sw.js"
    ? "no-cache, no-store, must-revalidate"
    : (normalized.startsWith("/assets/") || normalized.startsWith("/images/")
      ? "public, max-age=86400"
      : "public, max-age=300");

  res.writeHead(200, {
    "content-type": mime,
    "content-length": stat.size,
    "cache-control": cacheControl,
    "x-content-type-options": "nosniff"
  });
  fs.createReadStream(fullPath).pipe(res);
  return true;
}

async function readNodeRequestBody(req) {
  if (req.method === "GET" || req.method === "HEAD") return undefined;
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > 2 * 1024 * 1024) {
      throw new Error("Request body too large");
    }
    chunks.push(chunk);
  }
  return chunks.length ? Buffer.concat(chunks) : undefined;
}

const server = http.createServer(async (req, res) => {
  try {
    const proto = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers["x-forwarded-host"] || req.headers.host || `127.0.0.1:${PORT}`;
    const fullUrl = new URL(req.url || "/", `${proto}://${host}`);

    if ((req.method === "GET" || req.method === "HEAD") && tryServeStaticAsset(fullUrl.pathname, res)) {
      return;
    }

    const body = await readNodeRequestBody(req);
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (v === undefined) continue;
      if (Array.isArray(v)) v.forEach((item) => headers.append(k, item));
      else headers.set(k, v);
    }

    const webReq = new Request(fullUrl.toString(), {
      method: req.method || "GET",
      headers,
      body
    });
    const webRes = await worker.fetch(webReq, workerEnv);

    const outHeaders = {};
    const setCookies = typeof webRes.headers.getSetCookie === "function" ? webRes.headers.getSetCookie() : [];
    for (const [k, v] of webRes.headers.entries()) {
      if (k.toLowerCase() === "set-cookie") continue;
      outHeaders[k] = v;
    }
    if (setCookies.length) outHeaders["set-cookie"] = setCookies;

    res.writeHead(webRes.status, outHeaders);
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    const buf = Buffer.from(await webRes.arrayBuffer());
    res.end(buf);
  } catch (err) {
    console.error("[linux-server] request error:", err);
    if (!res.headersSent) {
      res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
    }
    res.end(JSON.stringify({ ok: false, error: "内部服务错误" }));
  }
});

let cronTimer = null;
if (ENABLE_CRON) {
  const tick = () => {
    worker.scheduled({}, workerEnv, {
      waitUntil(promise) {
        Promise.resolve(promise).catch((err) => console.error("[linux-server] cron error:", err));
      }
    });
    sqliteStore.purgeExpired().catch(() => {});
  };
  cronTimer = setInterval(tick, 60 * 1000);
  setTimeout(tick, 3000);
}

server.listen(PORT, HOST, () => {
  console.log(`[D2R Sanctuary Linux Server] http://${HOST}:${PORT}`);
  console.log(`[D2R Sanctuary SQLite Store] ${DATA_PATH} (WAL mode, cron=${ENABLE_CRON})`);
});

const shutdown = () => {
  if (cronTimer) clearInterval(cronTimer);
  server.close(() => {
    try { sqliteStore.close(); } catch {}
    process.exit(0);
  });
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
