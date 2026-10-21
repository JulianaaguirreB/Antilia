require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const apiRoutes = require("./routes");
const { errorHandler } = require("./shared/middleware/error-handler");

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
  res.json({ email_configured: require('./infrastructure/mail/email').emailConfigured(), scheduler_configured: Boolean(process.env.CRON_SECRET && process.env.CRON_SECRET.length >= 32), timezone: 'America/Bogota' });
});

app.use("/api", apiRoutes);

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

app.use(errorHandler);

module.exports = app;

