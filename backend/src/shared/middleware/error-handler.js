function errorHandler(err, req, res, next) {
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
}

module.exports = { errorHandler };
