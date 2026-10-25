# Registro y navegación

Al crear una cuenta enviamos una bienvenida al correo registrado. Esperamos la respuesta del proveedor antes de finalizar; un fallo de correo no elimina la cuenta ni bloquea el acceso. Inicio muestra el estado y permite reintentar. El reintento requiere sesión, solo utiliza el correo propio, espera un minuto entre intentos y no vuelve a enviar una bienvenida ya entregada al proveedor. La confirmación de propiedad del correo sigue siendo un proceso separado desde Perfil.

En Android, Atrás cierra primero el diálogo visible, recorre las pantallas visitadas y pide confirmación antes de salir desde Inicio. Los formularios no se cierran durante su guardado. El inicio y cierre de sesión reinician el recorrido; Volver usa la pantalla anterior y tiene un destino de respaldo cuando se abrió un enlace directamente. La versión instalada debe actualizarse al APK 0.3.4 para recibir este cambio.

## Comprobaciones del 25 de octubre

- 23 pruebas del servidor con PostgreSQL aislado: bienvenida, reintento, fallo del proveedor, aislamiento de cuentas, recuperación, verificación, tareas, agenda, Gmail y recordatorios.
- Recorrido local real: 15 comprobaciones de registro, espacios, tareas, tablero, turnos, recordatorios, perfil, persistencia y mediciones. El servidor local confirmó correo y programador desactivados; no se enviaron mensajes a destinatarios externos.
- 14 botones superiores comprobados con clics reales; Volver e historial, cierre de sesión cancelable y reintento de bienvenida. Datos de interfaz simulados.
- Revisión de 20 pantallas y anchuras 320/390/430, sin errores del navegador ni desbordes.
- Puente Android simulado: una sola suscripción, diálogos primero, historial, cancelación/confirmación de salida y reinicio de sesión. Permisos de cámara y galería conservados.

La pulsación y el gesto Atrás en un teléfono Android físico siguen pendientes de comprobación. Estas pruebas técnicas no sustituyen la validación con usuarios del curso.
