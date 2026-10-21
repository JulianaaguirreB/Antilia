const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../../infrastructure/database/pool");
const { validateString, validateEmail, validatePassword } = require("../../shared/validate");
const { requireAuth } = require("../../shared/middleware/auth");
const { route, problem, transaction } = require('../../shared/http');
const { body } = require('../../shared/release2-validation');

const router = express.Router();

function signToken(userId, version = 0) {
  return jwt.sign({ sub: userId, version }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/register", async (req, res, next) => {
  try {
    body(req.body, ['name', 'email', 'password']);
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
    body(req.body, ['email', 'password']);
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
      "SELECT id, name, email, password_hash, token_version FROM users WHERE email = $1",
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

    const token = signToken(user.id, user.token_version);
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
      "SELECT id, name, email, email_verified_at, updated_at, created_at FROM users WHERE id = $1",
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

router.patch('/me', requireAuth, route(async (req, res) => {
  const input = body(req.body, ['name', 'email', 'current_password']);
  if (input.name === undefined && input.email === undefined) throw problem(400, 'Incluye name o email.');
  try {
    const user = await transaction(async client => {
      const found = await client.query('SELECT * FROM users WHERE id = $1 FOR UPDATE', [req.userId]);
      if (!found.rows.length) throw problem(404, 'Usuario no encontrado.');
      const previous = found.rows[0];
      const name = input.name === undefined ? previous.name : validateString(input.name, 'name', 1, 80);
      const email = input.email === undefined ? previous.email : validateEmail(input.email);
      const changedEmail = email !== previous.email;
      if (changedEmail) {
        if (typeof input.current_password !== 'string' || Buffer.byteLength(input.current_password, 'utf8') > 72 || !await bcrypt.compare(input.current_password, previous.password_hash)) throw problem(401, 'Confirma tu contraseña actual para cambiar el correo.');
        await client.query('DELETE FROM email_verifications WHERE user_id = $1', [req.userId]);
        await client.query('UPDATE reminders SET enabled = false, updated_at = now() WHERE user_id = $1', [req.userId]);
      }
      const result = await client.query('UPDATE users SET name = $1, email = $2, email_verified_at = CASE WHEN $3 THEN NULL ELSE email_verified_at END, updated_at = now() WHERE id = $4 RETURNING id, name, email, email_verified_at, created_at, updated_at', [name, email, changedEmail, req.userId]);
      return result.rows[0];
    });
    res.json({ user });
  } catch (error) {
    if (error.code === '23505') throw problem(409, 'Ya existe una cuenta con ese correo.');
    throw error;
  }
}));

module.exports = router;
