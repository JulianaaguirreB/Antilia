require("dotenv").config();
const { Pool } = require("pg");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

if (!process.env.DATABASE_URL) {
  console.error("FAIL: DATABASE_URL is not defined");
  process.exit(1);
}

const dbUrl = new URL(process.env.DATABASE_URL);
const force = process.argv.includes("--force");
if (!force && dbUrl.hostname !== "localhost" && dbUrl.hostname !== "127.0.0.1") {
  console.error("FAIL: DATABASE_URL no es localhost ni 127.0.0.1. Usa --force para correr en otro host.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? (process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'false' ? { rejectUnauthorized: false } : true) : false,
});

let failures = 0;

function assertEqual(actual, expected, msg) {
  if (actual !== expected) {
    console.error(`FAIL: ${msg} (Expected: ${expected}, Actual: ${actual})`);
    failures++;
    return false;
  }
  console.log(`PASS: ${msg}`);
  return true;
}

async function run() {
  let client;
  try {
    client = await pool.connect();

    // 1. registro
    const email = `streak${Date.now()}@test.com`;
    let res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Streak Test", email, password: "Password123" })
    });
    let json = await res.json();
    const token = json.token;
    const userId = json.user.id;

    // Fija last_active_date en ayer
    await client.query("UPDATE streaks SET current_streak = 5, best_streak = 5, last_active_date = (now() AT TIME ZONE 'America/Bogota')::date - 1 WHERE user_id = $1", [userId]);

    res = await fetch(`${BASE_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ title: "T1", type: "fisica" })
    });
    json = await res.json();
    let t1 = json.task.id;

    res = await fetch(`${BASE_URL}/api/tasks/${t1}/complete`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` }
    });
    json = await res.json();
    assertEqual(json.streak.current_streak, 6, "Subió racha desde ayer (5 -> 6)");
    assertEqual(json.streak.best_streak, 6, "Subió best_streak (5 -> 6)");

    // Fija last_active_date en hace 3 días
    await client.query("UPDATE streaks SET current_streak = 6, best_streak = 6, last_active_date = (now() AT TIME ZONE 'America/Bogota')::date - 3 WHERE user_id = $1", [userId]);

    res = await fetch(`${BASE_URL}/api/streak`, { headers: { "Authorization": `Bearer ${token}` }});
    json = await res.json();
    assertEqual(json.streak.current_streak, 0, "GET /streak con racha caducada da 0");

    res = await fetch(`${BASE_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ title: "T2", type: "fisica" })
    });
    json = await res.json();
    let t2 = json.task.id;

    res = await fetch(`${BASE_URL}/api/tasks/${t2}/complete`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` }
    });
    json = await res.json();
    assertEqual(json.streak.current_streak, 1, "Racha vuelve a 1 tras 3 días");
    assertEqual(json.streak.best_streak, 6, "Conserva best_streak = 6");

  } catch (err) {
    console.error("FAIL: Error in script", err);
    failures++;
  } finally {
    if (client) client.release();
    pool.end();
  }
  if (failures > 0) process.exit(1);
}

run();
