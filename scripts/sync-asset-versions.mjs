import fs from "node:fs";
import crypto from "node:crypto";

const css = fs.readFileSync("public/assets/dashboard.css", "utf8");
const js = fs.readFileSync("public/assets/dashboard.js", "utf8");

// Validate JS syntax before updating version hash
new Function(js);

const cssVer = crypto.createHash("sha256").update(css).digest("hex").slice(0, 10);
const jsVer = crypto.createHash("sha256").update(js).digest("hex").slice(0, 10);

let src = fs.readFileSync("src/dashboard.js", "utf8");
src = src.replace(
  /export const DASHBOARD_CSS_VERSION = "[a-f0-9]+";/,
  `export const DASHBOARD_CSS_VERSION = "${cssVer}";`
);
src = src.replace(
  /export const DASHBOARD_JS_VERSION = "[a-f0-9]+";/,
  `export const DASHBOARD_JS_VERSION = "${jsVer}";`
);

fs.writeFileSync("src/dashboard.js", src, "utf8");
console.log(`Synced dashboard asset hashes: css=${cssVer}, js=${jsVer}`);
