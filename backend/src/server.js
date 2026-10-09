const app = require("./app");

const secret = process.env.JWT_SECRET || "";
if (!secret || secret.length < 32 || secret.startsWith("cambia-esto")) {
  console.error("Error: JWT_SECRET debe tener al menos 32 caracteres y no empezar con 'cambia-esto'.");
  process.exit(1);
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Logtech backend corriendo en http://localhost:${port}`);
});
