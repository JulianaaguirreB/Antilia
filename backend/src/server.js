const app = require("./app");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Logtech backend corriendo en http://localhost:${port}`);
});
