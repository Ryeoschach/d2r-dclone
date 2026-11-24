const PBKDF2_ITERATIONS = 100_000;
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const OAUTH_TTL_SECONDS = 60 * 10;
const MAX_JSON_BODY_BYTES = 512 * 1024;
const VALID_CLASS_IDS = new Set([
  "ama",
  "ass",
  "nec",
  "bar",
  "pal",
  "sor",
  "dru",
  "war"
]);

const encoder = new TextEncoder();

export {
  PBKDF2_ITERATIONS,
  SESSION_TTL_SECONDS,
  OAUTH_TTL_SECONDS,
  MAX_JSON_BODY_BYTES,
  VALID_CLASS_IDS
};

export function toBase64Url(bytes) {
  let binary = "";
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i += 1) {
    binary += String.fromCharCode(arr[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function fromBase64Url(str) {
  const padded = String(str || "")
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(String(str || "").length / 4) * 4, "=");
  const binary = atob(padded);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

export function randomToken(byteLen = 32) {
  const bytes = new Uint8Array(byteLen);
  crypto.getRandomValues(bytes);
  return toBase64Url(bytes);
}

export async function sha256Hex(input) {
  const buf = await crypto.subtle.digest("SHA-256", encoder.encode(String(input)));
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function sha256Base64Url(input) {
  const buf = await crypto.subtle.digest("SHA-256", encoder.encode(String(input)));
  return toBase64Url(new Uint8Array(buf));
}

export function timingSafeEqualBytes(a, b) {
  if (!(a instanceof Uint8Array) || !(b instanceof Uint8Array)) return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

export async function hashPassword(password) {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(String(password)),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations: PBKDF2_ITERATIONS
    },
    key,
    256
  );
  return `pbkdf2_sha256$${PBKDF2_ITERATIONS}$${toBase64Url(salt)}$${toBase64Url(new Uint8Array(bits))}`;
}

const DUMMY_HASH =
  "pbkdf2_sha256$100000$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

export async function verifyPassword(password, storedHash) {
  const target = typeof storedHash === "string" && storedHash.startsWith("pbkdf2_sha256$")
    ? storedHash
    : DUMMY_HASH;
  const parts = target.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2_sha256") return false;
  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations < 10_000 || iterations > PBKDF2_ITERATIONS) {
    return false;
  }
  let salt;
  let expected;
  try {
    salt = fromBase64Url(parts[2]);
    expected = fromBase64Url(parts[3]);
  } catch {
    return false;
  }
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(String(password || "")),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations
    },
    key,
    expected.length * 8
  );
  const matched = timingSafeEqualBytes(new Uint8Array(bits), expected);
  return typeof storedHash === "string" && storedHash.startsWith("pbkdf2_sha256$") && matched;
}

export function isSecureRequest(request) {
  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return true;
  }
}

export function parseCookies(request) {
  const header = request.headers.get("cookie") || "";
  const out = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx <= 0) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (!key) continue;
    try {
      out[key] = decodeURIComponent(val);
    } catch {
      out[key] = val;
    }
  }
  return out;
}

export function formatCookie(name, value, { secure, maxAge, sameSite = "Lax" } = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, "Path=/", "HttpOnly", `SameSite=${sameSite}`];
  if (secure) parts.push("Secure");
  if (typeof maxAge === "number") parts.push(`Max-Age=${Math.max(0, Math.floor(maxAge))}`);
  return parts.join("; ");
}

export function getSessionCookieName(request) {
  return isSecureRequest(request) ? "__Host-d2r_session" : "d2r_session";
}

export function getOAuthCookieName(request) {
  return isSecureRequest(request) ? "__Host-d2r_oauth" : "d2r_oauth";
}

export function readSessionToken(request) {
  const cookies = parseCookies(request);
  return cookies["__Host-d2r_session"] || cookies.d2r_session || "";
}

export function readOAuthStateCookie(request) {
  const cookies = parseCookies(request);
  return cookies["__Host-d2r_oauth"] || cookies.d2r_oauth || "";
}

export function checkSameOriginCsrf(request, url) {
  const site = (request.headers.get("sec-fetch-site") || "").trim().toLowerCase();
  if (site && site !== "same-origin" && site !== "none") {
    return false;
  }
  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
    const origin = (request.headers.get("origin") || "").trim();
    if (origin && origin !== url.origin) {
      return false;
    }
  }
  return true;
}

export function sanitizeReturnTo(raw) {
  const s = String(raw || "/").trim();
  if (!s.startsWith("/") || s.startsWith("//") || /[\r\n\\]/.test(s)) {
    return "/";
  }
  return s.slice(0, 200);
}

export function sanitizeAvatarUrl(raw) {
  const s = String(raw || "").trim();
  if (!s || s.length > 500) return "";
  try {
    const parsed = new URL(s);
    if (parsed.protocol === "https:") return parsed.toString();
  } catch {
    return "";
  }
  return "";
}

export function parseAccountIdentifier(raw) {
  const trimmed = String(raw || "").trim();
  if (!trimmed) {
    return { ok: false, error: "请输入账号或邮箱" };
  }
  if (trimmed.includes("@")) {
    if (trimmed.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      return { ok: false, error: "邮箱格式不正确" };
    }
    const email = trimmed.toLowerCase();
    return {
      ok: true,
      kind: "email",
      email,
      username: "",
      defaultDisplayName: trimmed.split("@")[0].slice(0, 32)
    };
  }
  if (!/^[\p{L}\p{N}_.-]{3,32}$/u.test(trimmed)) {
    return { ok: false, error: "账号需为 3–32 位字母、数字、中文或 _.- 字符" };
  }
  return {
    ok: true,
    kind: "username",
    username: trimmed.toLowerCase(),
    email: "",
    defaultDisplayName: trimmed.slice(0, 32)
  };
}

export function validatePasswordInput(raw) {
  if (typeof raw !== "string") return { ok: false, error: "请输入密码" };
  if (raw.length < 8) return { ok: false, error: "密码长度至少需要 8 位" };
  if (raw.length > 128) return { ok: false, error: "密码长度不能超过 128 位" };
  return { ok: true, password: raw };
}

export function sanitizeDisplayName(raw, fallback) {
  const cleaned = String(raw || "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, 40);
  return cleaned || String(fallback || "庇护之地玩家").slice(0, 40);
}

const RECOVERY_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // 32 chars (exact power of 2, no 0/O/1/I)
export const RECOVERY_CODE_COUNT = 5;
export const ADMIN_RESET_TTL_SECONDS = 60 * 15;

function randomBase32Group(len) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < len; i += 1) {
    out += RECOVERY_ALPHABET[bytes[i] & 31];
  }
  return out;
}

export function generateRecoveryCodes(count = RECOVERY_CODE_COUNT) {
  const codes = [];
  for (let i = 0; i < count; i += 1) {
    codes.push(
      `D2R-${randomBase32Group(4)}-${randomBase32Group(4)}-${randomBase32Group(4)}`
    );
  }
  return codes;
}

export function generateAdminResetCode() {
  return `ADM-${randomBase32Group(4)}-${randomBase32Group(4)}-${randomBase32Group(4)}-${randomBase32Group(4)}`;
}

export function normalizeRecoveryCode(raw) {
  return String(raw || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export async function hashRecoveryCode(rawCode) {
  const norm = normalizeRecoveryCode(rawCode);
  if (norm.length < 12) return "";
  return sha256Hex(`d2r-recovery-v1:${norm}`);
}

export function timingSafeEqualStrings(a, b) {
  const ba = encoder.encode(String(a || ""));
  const bb = encoder.encode(String(b || ""));
  if (ba.length !== bb.length) return false;
  return timingSafeEqualBytes(ba, bb);
}
