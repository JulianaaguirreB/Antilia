require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const streakRoutes = require("./routes/streak");

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) res.set('Cache-Control', 'no-store');
  if (req.body === undefined) req.body = {};
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "antilia-backend", release: "v0.2-dev" });
});

app.get('/api/capabilities', (req, res) => {
  res.json({ email_configured: require('./services/email').emailConfigured(), scheduler_configured: Boolean(process.env.CRON_SECRET && process.env.CRON_SECRET.length >= 32), timezone: 'America/Bogota' });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/streak", streakRoutes);
app.use('/api/spaces', require('./routes/spaces'));
app.use('/api/shifts', require('./routes/shifts'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/email-verification', require('./routes/email-verification'));
app.use('/api/password-reset', require('./routes/password-reset'));
app.use('/api/internal', require('./routes/internal'));

app.use("/api", (req, res) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});


const frontendDist = path.join(__dirname, "..", "..", "frontend", "dist");
app.use(express.static(frontendDist));

app.get(/^(?!\/api)/, (req, res, next) => {
  if (req.path.match(/\.[a-z0-9]+$/i)) {
    return res.status(404).json({ error: "Ruta no encontrada." });
  }
  res.sendFile(path.join(frontendDist, "index.html"), (err) => {
    if (err) {
      res.status(404).json({ error: "Ruta no encontrada." });
    }
  });
});

app.use((err, req, res, next) => {
  const invalidJson = (err.status === 400 || err.statusCode === 400) && !err.isValidation && (err.name === "SyntaxError" || /json|unexpected token|expected property name/i.test(err.message || ""));
  if (err.type === "entity.parse.failed" || invalidJson) {
    return res.status(400).json({ error: "JSON inválido." });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "La solicitud es demasiado grande." });
  }

  const status = err.status || err.statusCode || 500;
  if (status === 503 && err.isValidation) return res.status(503).json({ error: err.message });

  if (status >= 400 && status < 500) {
    if (err.isValidation) {
      return res.status(status).json({ error: err.message });
    }
    return res.status(status).json({ error: "Solicitud inválida." });
  }

  console.error(err);
  res.status(500).json({ error: "Error interno." });
});

module.exports = app;

