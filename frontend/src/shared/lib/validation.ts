export function validateEmail(email: string) {
  const e = email.trim();
  if (!e) return 'El correo es obligatorio';
  if (e.length > 254) return 'El correo es demasiado largo';
  if (!/^(?!.*\.\.)([A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/.test(e)) return 'Escribe un correo válido, por ejemplo nombre@gmail.com';
  return null;
}

export function validatePassword(password: string) {
  if (!password) return 'La contraseña es obligatoria';
  const encoder = new TextEncoder();
  const bytes = encoder.encode(password).length;
  if (password.length < 8 || bytes > 72) return 'Usa al menos 8 caracteres y un máximo de 72 bytes';
  if (!/[A-Za-z]/.test(password)) return 'Debe contener al menos una letra';
  if (!/[0-9]/.test(password)) return 'Debe contener al menos un número';
  return null;
}

export function validateName(name: string) {
  const n = name.trim();
  if (!n) return 'El nombre es obligatorio';
  if (!/[\p{L}]/u.test(n)) return 'Escribe tu nombre con letras';
  if (n.length > 80) return 'El nombre es demasiado largo';
  return null;
}

export function validateTitle(title: string) {
  const t = title.trim();
  if (!t) return 'El título es obligatorio';
  if (t.length > 120) return 'El título es demasiado largo';
  return null;
}
