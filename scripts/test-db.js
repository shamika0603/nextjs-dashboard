const fs = require('fs');
const path = require('path');
const postgres = require('postgres');

// Manually load .env.local if present so we don't need dotenv installed
const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    const key = trimmed.slice(0, idx);
    const val = trimmed.slice(idx + 1);
    if (!process.env[key]) process.env[key] = val;
  });
}

async function test() {
  const url = process.env.POSTGRES_URL;
  console.log('POSTGRES_URL present:', !!url);
  if (!url) {
    console.error('POSTGRES_URL is not set. Please update .env.local or environment.');
    process.exit(2);
  }

  // Determine SSL usage
  const isLocalhost = /localhost|127\.0\.0\.1/.test(url);
  const forceSsl = process.env.POSTGRES_SSL !== 'false' && !isLocalhost;
  const sql = postgres(url, forceSsl ? { ssl: 'require' } : {});
  try {
    const res = await sql`SELECT 1 as result`;
    console.log('DB connection OK:', res[0]);
    process.exit(0);
  } catch (e) {
    console.error('DB connection failed:', e && e.message ? e.message : e);
    process.exit(3);
  } finally {
    try { await sql.end({ timeout: 1000 }); } catch (_) {}
  }
}

test();
