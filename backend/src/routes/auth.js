const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");
const { validateString, validateEmail, validatePassword } = require("../validate");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/register", async (req, res, next) => {
  try {
    const name = validateString(req.body.name, "name", 1, 80);
    const email = validateEmail(req.body.email);
    const password = validatePassword(req.body.password);

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `WITH new_user AS (
        INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at
      ), new_streak AS (
        INSERT INTO streaks (user_id, current_streak, best_streak, last_active_date) SELECT id, 0, 0, NULL FROM new_user
      )
      SELECT id, name, email, created_at FROM new_user`,
      [name, email, passwordHash]
    );
    const user = result.rows[0];

    const token = signToken(user.id);
    res.status(201).json({ token, user });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: "Ya existe una cuenta con ese correo." });
    }
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const email = validateEmail(req.body.email);
    const password = req.body.password;
    if (typeof password !== "string") {
      throw { status: 400, message: "password debe ser texto.", isValidation: true };
    }
    if (password.length < 1) {
      throw { status: 400, message: "password debe tener al menos 1 carácter.", isValidation: true };
    }
    if (Buffer.byteLength(password, "utf8") > 72) {
      throw { status: 400, message: "La contraseña es demasiado larga (máximo 72 bytes).", isValidation: true };
    }

    const result = await pool.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = $1",
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    const token = signToken(user.id);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
