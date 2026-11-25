import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const JS_DIR = "public/assets/js";
const MODULE_FILES = [
  "shared.js",
  "i18n-dict.js",
  "core.js",
  "tab-runewords.js",
  "tab-affixes.js",
  "tab-items.js",
  "tab-skills.js"
];

const sha10 = (text) => crypto.createHash("sha256").update(text).digest("hex").slice(0, 10);

// 1. Validate shared.js & compute its version first so dependents can bust its cache cleanly
const sharedPath = path.join(JS_DIR, "shared.js");
execFileSync(process.execPath, ["--check", sharedPath], { stdio: "pipe" });
const sharedVer = sha10(fs.readFileSync(sharedPath, "utf8"));

const versions = { "shared.js": sharedVer };

// 2. Stamp shared.js version on static imports, syntax-check, and hash every remaining ES module
for (const file of MODULE_FILES) {
  if (file === "shared.js") continue;
  const fullPath = path.join(JS_DIR, file);
  let code = fs.readFileSync(fullPath, "utf8");
  const stamped = code.replace(
    /from\s+"\.\/shared\.js(?:\?v=[a-f0-9]+)?";/g,
    `from "./shared.js?v=${sharedVer}";`
  );
  if (stamped !== code) {
    fs.writeFileSync(fullPath, stamped, "utf8");
    code = stamped;
  }
  execFileSync(process.execPath, ["--check", fullPath], { stdio: "pipe" });
  versions[file] = sha10(code);
}

const css = fs.readFileSync("public/assets/dashboard.css", "utf8");
const cssVer = sha10(css);
const themeInitPath = "public/assets/theme-init.js";
execFileSync(process.execPath, ["--check", themeInitPath], { stdio: "pipe" });
const themeVer = sha10(fs.readFileSync(themeInitPath, "utf8"));
const jsVer = versions["core.js"];

let src = fs.readFileSync("src/dashboard.js", "utf8");
src = src.replace(
  /export const DASHBOARD_CSS_VERSION = "[a-f0-9]+";/,
  `export const DASHBOARD_CSS_VERSION = "${cssVer}";`
);
src = src.replace(
  /export const DASHBOARD_JS_VERSION = "[a-f0-9]+";/,
  `export const DASHBOARD_JS_VERSION = "${jsVer}";`
);
src = src.replace(
  /export const DASHBOARD_THEME_VERSION = "[a-f0-9]+";/,
  `export const DASHBOARD_THEME_VERSION = "${themeVer}";`
);
src = src.replace(
  /export const DASHBOARD_ASSET_VERSIONS = \{[\s\S]*?\};/,
  `export const DASHBOARD_ASSET_VERSIONS = ${JSON.stringify(versions, null, 2)};`
);

fs.writeFileSync("src/dashboard.js", src, "utf8");
console.log(`Synced dashboard asset hashes: css=${cssVer}, theme=${themeVer}, core=${jsVer}, modules=${MODULE_FILES.length}`);
