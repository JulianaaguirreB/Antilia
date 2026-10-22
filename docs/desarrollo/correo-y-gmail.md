# Correo real y selección de Gmail

Esta integración está implementada para configuración local. No se han conectado cuentas reales, enviado correos reales, publicado cambios ni aplicado migraciones en Neon con este avance.

## Dos servicios diferentes

- Envíos: Antilia manda recuperación de acceso, verificación y recordatorios mediante Resend o SMTP.
- Lectura: cada usuario autoriza a Google para consultar su Gmail con OAuth. La contraseña de Google nunca se pide en Antilia.

## Activar recuperación sin dominio propio

Para un piloto puede usarse un Gmail del equipo como remitente SMTP. La cuenta debe permitir contraseñas de aplicación y tener verificación en dos pasos; no todas las cuentas de organizaciones o con protección avanzada permiten este método.

1. En la cuenta de Google del remitente, revisa la verificación en dos pasos y crea una contraseña de aplicación: https://support.google.com/accounts/answer/185833?hl=es
2. Abre `backend/.env.integrations` en tu computador. Este archivo privado no se publica en Git.
3. Completa `SMTP_USER` con el Gmail del remitente, `SMTP_PASS` con la contraseña de aplicación y `SMTP_FROM` con `Antilia <correo-del-remitente@gmail.com>`. No uses la contraseña normal de Google ni pegues claves en chats.
4. Conserva `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465` y `SMTP_SECURE=true`.
5. Conserva `APP_URL=http://localhost:3102` para las pruebas locales. Reinicia el servidor.
6. Registra una cuenta de prueba tuya en la versión local, solicita recuperación y comprueba en el buzón el código o enlace. Comprueba que el código vence y no se puede reutilizar.

Para la versión publicada, configura estas variables en Vercel y usa la URL pública como `APP_URL`. No publiques `.env.integrations`. Los proveedores imponen límites de envío; SMTP no ofrece la misma garantía de idempotencia de Resend para reintentos de recordatorios.

Resend sigue siendo compatible mediante `RESEND_API_KEY` y `REMINDER_FROM`. Si ambos están presentes tienen prioridad sobre SMTP. Requiere un remitente autorizado por Resend para enviar a los destinatarios previstos.

## Configurar Google para lectura

1. Crea o selecciona un proyecto en https://console.cloud.google.com/ y habilita **Gmail API**.
2. Configura Google Auth Platform: nombre Antilia, correo de soporte, audiencia y usuarios de prueba. Para el piloto, agrega únicamente los participantes autorizados.
3. Declara el alcance `https://www.googleapis.com/auth/gmail.readonly`.
4. Crea un cliente OAuth de tipo aplicación web. Registra exactamente `http://localhost:3102/api/mailbox/callback` como URI de redirección local.
5. Guarda en `backend/.env.integrations` el ID y secreto en `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`. Conserva `GOOGLE_REDIRECT_URI=http://localhost:3102/api/mailbox/callback`. No envíes el secreto al frontend.
6. `GMAIL_TOKEN_KEY` es una clave de cifrado de 32 bytes en base64. La plantilla local ya contiene una clave generada. No la cambies después de conectar cuentas, salvo que vayas a reconectarlas. Para otros entornos genera una distinta.
7. Aplica las migraciones, reinicia el servidor y abre Correos. Pulsa Conectar con Google y selecciona el mismo Gmail que usas en Antilia.
8. Autoriza la lectura desde Google. Si Google bloquea el consentimiento, revisa la configuración y los usuarios de prueba; no ignores advertencias de seguridad.
9. Vuelve a Correos y pulsa Actualizar correos. Puedes continuar con mensajes anteriores y corregir una categoría.

Para producción registra también `https://antilia-delta.vercel.app/api/mailbox/callback`, establece las variables y aplica la nueva migración en el entorno correspondiente antes de publicar. Esto requiere un respaldo y la revisión del despliegue; no se ha ejecutado en este avance.

Gmail de solo lectura es un alcance restringido. Google puede exigir verificación y evaluación de seguridad al abrir la aplicación a usuarios externos, especialmente al almacenar datos del buzón en el servidor. El modo de pruebas limita los usuarios y puede hacer vencer los tokens de actualización a los siete días. No presentes el piloto como una integración pública verificada.

## Selección y almacenamiento

- La consulta excluye spam, papelera, promociones y categoría social.
- El clasificador descarta dominios Temu conocidos y asuntos promocionales. Los filtros no garantizan detectar todas las promociones o todo el spam.
- Los asuntos con palabras relacionadas se agrupan en Proyectos, Reuniones, Documentos y Trabajo, en ese orden de prioridad. Un mensaje puede cambiarse manualmente a cualquiera de esas categorías u Otros.
- Los mensajes sin coincidencias no se importan. Esta versión no lee automáticamente todos los mensajes personales ni aprende hábitos.
- Cada revisión procesa hasta 20 candidatos; el botón de mensajes anteriores permite continuar. Puedes activar revisión cada 90 segundos mientras Correos esté abierta. No hay un proceso de sincronización permanente con la app cerrada.
- Guardamos ID de Gmail, asunto, remitente, extracto, fecha y clasificación en la base de Antilia. No se guardan adjuntos ni el cuerpo completo. El texto se consulta bajo demanda y se muestra sin HTML, imágenes remotas ni enlaces ejecutables del mensaje.
- La clasificación manual se conserva en la siguiente sincronización. Cada usuario solo ve su selección.
- Los tokens de actualización se cifran con AES-256-GCM en el servidor. Estado OAuth de un solo uso, caducidad de diez minutos y PKCE protegen el enlace de autorización.
- Cambiar el correo de Antilia desconecta Gmail y elimina las copias anteriores. Desconectar Gmail elimina conexión, autorizaciones pendientes y mensajes de Antilia; no borra correos de Google. El permiso de Google puede retirarse además desde la cuenta de Google.

## Verificación

Las pruebas locales simulan Google y SMTP para no leer buzones ni enviar correos reales. Cubren clasificación, exclusión, estado OAuth de un solo uso, correo de cuenta coincidente, cifrado, sincronización sin duplicados, aislamiento, lectura y eliminación al desconectar. Una prueba con cuentas autorizadas sigue siendo necesaria.

Referencias: https://developers.google.com/workspace/gmail/api/auth/scopes · https://developers.google.com/identity/protocols/oauth2/web-server · https://developers.google.com/workspace/gmail/api/guides/filtering
