const app = require("./app");

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET es obligatorio");
  process.exit(1);
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Logtech backend corriendo en http://localhost:${port}`);
});
