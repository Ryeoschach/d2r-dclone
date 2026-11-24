-- Optional Cloudflare D1 schema for replacing KV write quota (100k writes/day on D1 free tier vs 1k/day on KV).
-- Apply with:
--   npx wrangler d1 execute d2r-sanctuary-db --remote --file=migrations/0001_kv_store.sql

CREATE TABLE IF NOT EXISTS kv_store (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  expires_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_kv_store_expires ON kv_store(expires_at);
