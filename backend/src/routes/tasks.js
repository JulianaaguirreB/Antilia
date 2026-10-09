const express = require("express");
const { pool } = require("../db");
const { requireAuth } = require("../middleware/auth");
const { validateString, validateType } = require("../validate");

const router = express.Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    let status = req.query.status;
    if (status !== "completada" && status !== "all") {
      status = "pendiente";
    }

    let type = req.query.type;
    if (type !== undefined) {
      if (type !== "fisica" && type !== "digital") {
        return res.status(400).json({ error: "type debe ser 'fisica' o 'digital'." });
      }
    }

    let query = "SELECT id, title, type, status, created_at, completed_at FROM tasks WHERE user_id = $1";
    const params = [req.userId];
    let paramIndex = 2;

    if (status !== "all") {
      query += ` AND status = $${paramIndex++}`;
      params.push(status);
    }
    
    if (type) {
      query += ` AND type = $${paramIndex++}`;
      params.push(type);
    }

    query += " ORDER BY created_at ASC";

    const result = await pool.query(query, params);
    res.json({ tasks: result.rows });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const title = validateString(req.body.title, "title", 1, 120);
    const type = validateType(req.body.type);

    const result = await pool.query(
      "INSERT INTO tasks (user_id, title, type) VALUES ($1, $2, $3) RETURNING id, title, type, status, created_at",
      [req.userId, title, type]
    );
    res.status(201).json({ task: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/complete", async (req, res, next) => {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.params.id)) {
    return res.status(404).json({ error: "Tarea no encontrada." });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const taskResult = await client.query(
      "UPDATE tasks SET status = 'completada', completed_at = now() WHERE id = $1 AND user_id = $2 AND status = 'pendiente' RETURNING id, title, type, status, completed_at",
      [req.params.id, req.userId]
    );

    if (taskResult.rows.length === 0) {
      await client.query("ROLLBACK").catch(() => {});
      return res.status(404).json({ error: "Tarea no encontrada o ya estaba completada." });
    }

    const streak = await updateStreakOnCompletion(client, req.userId);

    await client.query("COMMIT");
    res.json({ task: taskResult.rows[0], streak });
  } catch (err) {
    if (client) await client.query("ROLLBACK").catch(() => {});
    next(err);
  } finally {
    if (client) client.release();
  }
});

async function updateStreakOnCompletion(client, userId) {
  const current = await client.query(
    "SELECT current_streak, best_streak, (now() AT TIME ZONE 'America/Bogota')::date - last_active_date AS diff FROM streaks WHERE user_id = $1 FOR UPDATE",
    [userId]
  );
  const row = current.rows[0] || { current_streak: 0, best_streak: 0, diff: null };

  let newStreak = row.current_streak;

  if (row.diff === null) {
    newStreak = 1;
  } else {
    const diff = row.diff;

    if (diff === 0) {
      newStreak = row.current_streak;
    } else if (diff === 1) {
      newStreak = row.current_streak + 1;
    } else {
      newStreak = 1;
    }
  }

  const newBest = Math.max(newStreak, row.best_streak);

  const updated = await client.query(
    `INSERT INTO streaks (user_id, current_streak, best_streak, last_active_date)
     VALUES ($1, $2, $3, (now() AT TIME ZONE 'America/Bogota')::date)
     ON CONFLICT (user_id)
     DO UPDATE SET current_streak = $2, best_streak = $3, last_active_date = (now() AT TIME ZONE 'America/Bogota')::date
     RETURNING current_streak, best_streak, last_active_date`,
    [userId, newStreak, newBest]
  );

  return updated.rows[0];
}

module.exports = router;
