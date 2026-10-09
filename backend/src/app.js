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

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "antilia-backend", release: "v0.1" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/streak", streakRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});


const frontendDist = path.join(__dirname, "..", "..", "frontend", "dist");
app.use(express.static(frontendDist));

app.get(/^(?!\/api)/, (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"), (err) => {
    if (err) {
      res.status(404).json({ error: "Ruta no encontrada." });
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: err.message || "Solicitud inválida." });
  }
  if (err.statusCode >= 400 && err.statusCode < 500) {
    return res.status(err.statusCode).json({ error: err.message || "Solicitud inválida." });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: "JSON inválido." });
  }
  res.status(500).json({ error: "Error interno." });
});

module.exports = app;

