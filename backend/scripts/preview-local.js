const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const { Pool } = require('pg');
const dotenv = require('dotenv');

async function start() {
  const adminUrl = new URL(process.env.TEST_DATABASE_URL || 'postgresql://logtech:logtech@127.0.0.1:5432/logtech');
  if (!['localhost', '127.0.0.1', '[::1]'].includes(adminUrl.hostname)) throw new Error('La vista de desarrollo solo usa PostgreSQL local.');
  const database = 'antilia_release2_preview';
  const admin = new Pool({ connectionString: adminUrl.toString(), connectionTimeoutMillis: 5000 });
  try {
    const existing = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [database]);
    if (!existing.rows.length) await admin.query(`CREATE DATABASE "${database}"`);
  } finally { await admin.end(); }
  const targetUrl = new URL(adminUrl);
  targetUrl.pathname = `/${database}`;
  const envFile = path.join(__dirname, '..', '.env.preview');
  const existing = fs.existsSync(envFile) ? dotenv.parse(fs.readFileSync(envFile)) : {};
  const secret = existing.JWT_SECRET || crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(envFile, `DATABASE_URL=${targetUrl}\nDATABASE_SSL=false\nJWT_SECRET=${secret}\nPORT=3102\n`, { mode: 0o600 });
  Object.assign(process.env, dotenv.parse(fs.readFileSync(envFile)));
  delete process.env.RESEND_API_KEY;
  delete process.env.REMINDER_FROM;
  delete process.env.CRON_SECRET;
  const migration = spawnSync(process.execPath, [path.join(__dirname, '..', 'src', 'migrate.js')], { env: process.env, stdio: 'inherit' });
  if (migration.status !== 0) throw new Error('No se pudo preparar la base de desarrollo.');
  require('../src/server');
}
start().catch(error => { console.error(error.message); process.exitCode = 1; });
