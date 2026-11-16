# Backend y pantallas de Release 2

Trabajo en la rama `developer`. La app pública de Release 1 sigue en https://antilia-delta.vercel.app. Estas mejoras se prueban por separado antes de integrarlas.

## Abrir la versión nueva en el computador

Se necesita Node.js y Docker Desktop encendido. Desde la raíz del repositorio:

```powershell
docker compose -f backend/docker-compose.yml up -d
cd frontend
npm.cmd ci
npm.cmd run build
cd ../backend
npm.cmd ci
npm.cmd run preview:release2
```

Abrir http://localhost:3102/#/bienvenida y crear una cuenta local. El comando crea la base local `antilia_release2_preview`, aplica las migraciones y conserva sus datos entre arranques. Las cuentas de la app pública son independientes. La vista local requiere el computador encendido. No se envían correos en esta vista.

## Funciones

Todas las rutas están bajo `/api`. Salvo health, capabilities, registro, login y recuperación de acceso, requieren `Authorization: Bearer <token>`. Cada usuario solo puede consultar y cambiar sus propios datos.

| Ruta | Uso |
|---|---|
| POST /auth/register, /auth/login | Crear cuenta e iniciar sesión |
| GET, PATCH /auth/me | Consultar y editar perfil; cambiar correo requiere current_password |
| GET, POST /spaces | Listar y crear espacios físicos o digitales |
| GET, PATCH /spaces/:id | Consultar y editar espacio |
| POST /spaces/:id/archive | Archivar un espacio sin tareas pendientes |
| GET, POST /tasks | Consultar y crear tareas |
| PATCH /tasks/:id | Editar título, tipo, espacio, fecha, referencia y estado pendiente/en_progreso |
| PATCH /tasks/:id/complete | Completar y actualizar racha |
| POST /tasks/:id/archive | Archivar un pendiente sin sumar a la racha |
| GET, POST /shifts | Consultar y crear turnos |
| PATCH /shifts/:id | Cambiar turno; se rechazan cruces de horario |
| POST /shifts/:id/archive | Retirar turno |
| GET /stats?days=30 | Serie personal de tareas completadas, incluyendo días sin actividad |
| POST /email-verification/request, /confirm | Solicitar y confirmar un código de propiedad del correo |
| POST /password-reset/request, /confirm | Recuperar acceso; el cambio de contraseña invalida sesiones anteriores |
| GET, POST /reminders | Consultar y crear recordatorios |
| PATCH /reminders/:id | Editar, activar o desactivar |
| GET /reminders/:id/deliveries | Consultar historial de intentos |
| POST /internal/reminders/dispatch | Procesar envíos con secreto del programador |

Tareas: `type` admite `fisica` o `digital`; `digital_kind` admite `general`, `correo` o `archivo`. `reference_url` solo admite HTTPS sin credenciales. Las pantallas Correos y Archivos organizan pendientes con referencias: no leen un buzón ni suben archivos. Kanban usa estados guardados en la base.

Fechas y turnos requieren ISO 8601 con zona explícita. La interfaz muestra horarios de Bogotá. Recordatorios admiten `schedule_type: once` con `scheduled_at`, o `daily` con `local_time: HH:mm` y `timezone: America/Bogota`. Los códigos de correo y recuperación vencen a los 30 minutos, solo se almacenan sus hashes y se consumen una vez.

## Activar correo fuera de la vista local

Configurar `RESEND_API_KEY`, `REMINDER_FROM` con remitente verificado y `CRON_SECRET` aleatorio de al menos 32 caracteres. Nunca subir estas variables al repositorio. El usuario también debe verificar su correo antes de activar recordatorios.

Programar una llamada POST cada minuto a `/api/internal/reminders/dispatch` con `Authorization: Bearer <CRON_SECRET>`, o ejecutar `npm.cmd run reminders:dispatch` desde un programador del servidor. Definir un secreto por sí solo no instala este trabajo periódico. El endpoint no está configurado como cron de Vercel en este cambio.

Los envíos usan una clave estable para evitar duplicados, control concurrente e historial. Se reintentan fallos transitorios dentro de una ventana de cinco minutos; vencidos quedan registrados sin enviarse tarde. Las pruebas de correo usan un proveedor simulado; todavía se requiere comprobar un envío real con un remitente configurado.

## Base de datos y publicación

`npm.cmd run migrate` registra migraciones aplicadas y verifica que no cambien. Cada archivo se aplica en una transacción; no editar archivos ya aplicados. Los cambios nuevos van en otra migración. Crear respaldo antes de migrar una base con datos reales.

Para publicar esta rama, primero conectar una base de pruebas separada de producción, configurar variables, aplicar migraciones y comprobar los recorridos en su URL. No conectar una vista previa nueva a la base de Release 1 sin preparar y revisar la migración. Este trabajo no modifica la base pública ni reemplaza main.

## Comprobaciones

```powershell
cd backend
npm.cmd run test:release2
$env:BASE_URL='http://localhost:3102'
npm.cmd run smoke
cd ../qa
npm.cmd ci
npm.cmd run recorrido:release2
```

La suite de backend crea y elimina su propia base temporal en PostgreSQL local. Nunca acepta una dirección remota para esa prueba. La suite de navegador requiere la vista local activa y guarda capturas ignoradas por Git en `qa/evidencias`.
