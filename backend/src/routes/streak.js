const express = require("express");
const { pool } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT current_streak, best_streak, last_active_date FROM streaks WHERE user_id = $1",
      [req.userId]
    );
    const streak = result.rows[0] || { current_streak: 0, best_streak: 0, last_active_date: null };
    res.json({ streak });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo consultar la racha." });
  }
});

module.exports = router;
