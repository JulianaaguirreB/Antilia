const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { pool } = require("./infrastructure/database/pool");

async function migrate() {
  const dir = path.join(__dirname, "..", "migrations");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

  const client = await pool.connect();
  try {
    await client.query("SELECT pg_advisory_lock(472914)");
    await client.query("CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, checksum TEXT NOT NULL, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())");
    for (const file of files) {
      const sql = fs.readFileSync(path.join(dir, file), "utf8");
      const checksum = crypto.createHash('sha256').update(sql.replace(/\r\n/g, '\n')).digest('hex');
      const existing = await client.query("SELECT checksum FROM schema_migrations WHERE name = $1", [file]);
      if (existing.rows.length) {
        if (existing.rows[0].checksum !== checksum) throw new Error(`La migración aplicada ${file} cambió. Crea una migración nueva.`);
        continue;
      }
      await client.query('BEGIN');
      try {
        console.log(`Aplicando ${file}...`);
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name, checksum) VALUES ($1, $2)', [file, checksum]);
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
    console.log("Migraciones aplicadas correctamente.");
  } finally {
    await client.query('SELECT pg_advisory_unlock(472914)').catch(() => {});
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error("Error en la migración:", err.message);
  process.exit(1);
});
