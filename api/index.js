// Punto de entrada de la API cuando la app corre en Vercel.
// Vercel publica el frontend compilado (frontend/dist) como archivos estáticos
// y envía todas las peticiones /api/* a esta función, que reutiliza la misma
// app de Express del backend. En local se sigue usando backend/src/server.js.
const app = require("../backend/src/app");

function configError() {
  const secret = process.env.JWT_SECRET || "";
  if (!process.env.DATABASE_URL) {
    return "Falta la variable DATABASE_URL en Vercel.";
  }
  if (secret.length < 32 || secret.startsWith("cambia-esto")) {
    return "JWT_SECRET en Vercel debe tener al menos 32 caracteres.";
  }
  return null;
}

module.exports = (req, res) => {
  const error = configError();
  if (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(JSON.stringify({ error }));
  }
  return app(req, res);
};
