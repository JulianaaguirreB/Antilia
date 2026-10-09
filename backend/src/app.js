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
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "JSON inválido." });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "La solicitud es demasiado grande." });
  }

  const status = err.status || err.statusCode || 500;

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

