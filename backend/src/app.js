require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const streakRoutes = require("./routes/streak");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "logtech-backend", release: "v0.1" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/streak", streakRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});

module.exports = app;
