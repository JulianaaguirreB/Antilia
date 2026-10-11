export function validateEmail(email: string) {
  const e = email.trim();
  if (!e) return 'El correo es obligatorio';
  if (e.length > 254) return 'El correo es demasiado largo';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return 'Formato de correo inválido';
  return null;
}

export function validatePassword(password: string) {
  if (!password) return 'La contraseña es obligatoria';
  const encoder = new TextEncoder();
  const bytes = encoder.encode(password).length;
  if (bytes < 8 || bytes > 72) return 'Debe tener entre 8 y 72 bytes (caracteres)';
  if (!/[A-Za-z]/.test(password)) return 'Debe contener al menos una letra';
  if (!/[0-9]/.test(password)) return 'Debe contener al menos un número';
  return null;
}

export function validateName(name: string) {
  const n = name.trim();
  if (!n) return 'El nombre es obligatorio';
  if (n.length > 80) return 'El nombre es demasiado largo';
  return null;
}

export function validateTitle(title: string) {
  const t = title.trim();
  if (!t) return 'El título es obligatorio';
  if (t.length > 120) return 'El título es demasiado largo';
  return null;
}
