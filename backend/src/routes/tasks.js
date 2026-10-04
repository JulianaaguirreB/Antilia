const express = require("express");
const { pool } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);
router.get("/", async (req, res) => {
  const status = req.query.status === "completada" ? "completada" : "pendiente";
  try {
    const result = await pool.query(
      "SELECT id, title, type, status, created_at, completed_at FROM tasks WHERE user_id = $1 AND status = $2 ORDER BY created_at ASC",
      [req.userId, status]
    );
    res.json({ tasks: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudieron consultar las tareas." });
  }
});
router.post("/", async (req, res) => {
  const { title, type } = req.body;

  if (!title || !["fisica", "digital"].includes(type)) {
    return res.status(400).json({ error: "title es obligatorio y type debe ser 'fisica' o 'digital'." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO tasks (user_id, title, type) VALUES ($1, $2, $3) RETURNING id, title, type, status, created_at",
      [req.userId, title, type]
    );
    res.status(201).json({ task: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo crear la tarea." });
  }
});
router.patch("/:id/complete", async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const taskResult = await client.query(
      "UPDATE tasks SET status = 'completada', completed_at = now() WHERE id = $1 AND user_id = $2 AND status = 'pendiente' RETURNING id, title, type, status, completed_at",
      [req.params.id, req.userId]
    );

    if (taskResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Tarea no encontrada o ya estaba completada." });
    }

    const streak = await updateStreakOnCompletion(client, req.userId);

    await client.query("COMMIT");
    res.json({ task: taskResult.rows[0], streak });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "No se pudo completar la tarea." });
  } finally {
    client.release();
  }
});
async function updateStreakOnCompletion(client, userId) {
  const current = await client.query(
    "SELECT current_streak, best_streak, last_active_date FROM streaks WHERE user_id = $1 FOR UPDATE",
    [userId]
  );
  const row = current.rows[0] || { current_streak: 0, best_streak: 0, last_active_date: null };

  const todayResult = await client.query("SELECT CURRENT_DATE AS today");
  const today = todayResult.rows[0].today;

  let newStreak = row.current_streak;

  if (!row.last_active_date) {
    newStreak = 1;
  } else {
    const diffDays = await client.query(
      "SELECT ($1::date - $2::date) AS diff",
      [today, row.last_active_date]
    );
    const diff = diffDays.rows[0].diff;

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
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id)
     DO UPDATE SET current_streak = $2, best_streak = $3, last_active_date = $4
     RETURNING current_streak, best_streak, last_active_date`,
    [userId, newStreak, newBest, today]
  );

  return updated.rows[0];
}

module.exports = router;
