
function validateString(val, name, min, max) {
  if (typeof val !== 'string') throw { status: 400, message: `${name} debe ser texto.`, isValidation: true };
  const trimmed = val.trim();
  if (trimmed.length < min || trimmed.length > max) {
    throw { status: 400, message: `${name} debe tener entre ${min} y ${max} caracteres.`, isValidation: true };
  }
  return trimmed;
}

function validateEmail(val) {
  if (typeof val !== 'string') throw { status: 400, message: "email debe ser texto.", isValidation: true };
  const trimmed = val.trim().toLowerCase();
  if (trimmed.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    throw { status: 400, message: "email inválido.", isValidation: true };
  }
  return trimmed;
}

function validatePassword(val) {
  if (typeof val !== 'string') throw { status: 400, message: "password debe ser texto.", isValidation: true };
  if (Buffer.byteLength(val, "utf8") > 72) {
    throw { status: 400, message: "La contraseña es demasiado larga (máximo 72 bytes).", isValidation: true };
  }
  if (val.length < 8 || val.length > 72 || !/^(?=.*[A-Za-z])(?=.*\d)/.test(val)) {
    throw { status: 400, message: "La contraseña debe tener entre 8 y 72 caracteres, con al menos una letra y un número.", isValidation: true };
  }
  return val;
}

function validateType(val) {
  if (typeof val !== 'string' || (val !== 'fisica' && val !== 'digital')) {
    throw { status: 400, message: "type debe ser 'fisica' o 'digital'.", isValidation: true };
  }
  return val;
}

module.exports = { validateString, validateEmail, validatePassword, validateType };
