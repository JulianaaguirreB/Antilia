require("dotenv").config();
const pg = require("pg");
const { Pool } = pg;

pg.types.setTypeParser(1082, v => v);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? (process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'false' ? { rejectUnauthorized: false } : true) : false,
});

module.exports = { pool };
