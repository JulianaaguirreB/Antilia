# Antilia

Aplicación móvil para ayudar a asistentes administrativos a organizar su espacio físico y digital de trabajo. Repositorio compartido del equipo para PIETI 2026-2.

## Código disponible

`backend/` contiene la API en Node.js, Express y PostgreSQL. Incluye registro, inicio de sesión, consulta de usuario, creación y consulta de tareas, completar tareas y rachas. La autenticación de esta versión usa JWT y contraseñas protegidas con bcrypt.

El frontend todavía no está incluido. El backend devuelve datos JSON y no tiene una página de inicio en `/`. El recorrido de registro, login, crear tarea, consultar tareas, completar y ver racha se probó localmente. Todavía no se ha comprobado una entrega pública integrada.

## Ejecutar en Windows

Necesitas Node.js, npm y Docker Desktop con el motor funcionando. Después de clonar el repositorio, entra a `backend`, donde está `package.json`.

```powershell
git clone https://github.com/JulianaaguirreB/Antilia.git
Set-Location .\Antilia\backend
npm.cmd ci
if (!(Test-Path .env)) { Copy-Item .env.example .env }
```

Genera una clave local de acceso. Este comando reemplaza solo la clave de ejemplo y conserva el resto de `.env`:

```powershell
node -e "const fs=require('fs');const crypto=require('crypto');const p='.env';let s=fs.readFileSync(p,'utf8');s=s.replace(/^JWT_SECRET=cambia-esto-por-un-secreto-largo-y-aleatorio\r?$/m,'JWT_SECRET='+crypto.randomBytes(32).toString('hex'));fs.writeFileSync(p,s)"
```

Ejecuta estos comandos uno por uno. La primera descarga de PostgreSQL depende de tu conexión. Si un paso falla, corrígelo antes de continuar.

```powershell
docker compose up -d
npm.cmd run migrate
npm.cmd run dev
```

Mantén esa terminal abierta. Desde otra terminal:

```powershell
Invoke-RestMethod http://localhost:3000/api/health
```

La respuesta debe incluir `status: ok`. Este resultado comprueba el servidor; las rutas de usuarios y tareas también necesitan PostgreSQL. Para usar una base ya existente, configura `DATABASE_URL` en `.env` y omite el comando de Docker. Las credenciales del archivo Compose son solo para desarrollo local.

## Probar el recorrido del backend

Usa una base de desarrollo. La siguiente prueba crea una cuenta y una tarea:

```powershell
$base = 'http://localhost:3000/api'
$email = 'prueba-' + [guid]::NewGuid().ToString('N') + '@example.com'
$body = @{name='Prueba local';email=$email;password='PruebaLocal1234'} | ConvertTo-Json
$registro = Invoke-RestMethod -Uri "$base/auth/register" -Method Post -ContentType 'application/json' -Body $body
$loginBody = @{email=$email;password='PruebaLocal1234'} | ConvertTo-Json
$login = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -ContentType 'application/json' -Body $loginBody
$headers = @{Authorization='Bearer ' + $login.token}
$taskBody = @{title='Ordenar Descargas';type='digital'} | ConvertTo-Json
$creada = Invoke-RestMethod -Uri "$base/tasks" -Method Post -ContentType 'application/json' -Headers $headers -Body $taskBody
Invoke-RestMethod -Uri "$base/tasks" -Headers $headers
Invoke-RestMethod -Uri "$base/tasks/$($creada.task.id)/complete" -Method Patch -Headers $headers
Invoke-RestMethod -Uri "$base/streak" -Headers $headers
```

## Rutas disponibles

| Método | Ruta | Función |
|---|---|---|
| GET | `/api/health` | Estado del servidor |
| POST | `/api/auth/register` | Crear cuenta |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Consultar el usuario |
| GET | `/api/tasks` | Consultar tareas pendientes |
| GET | `/api/tasks?status=completada` | Consultar tareas completadas |
| POST | `/api/tasks` | Crear tarea física o digital |
| PATCH | `/api/tasks/:id/complete` | Completar tarea y actualizar racha |
| GET | `/api/streak` | Consultar racha y récord |

Las rutas de usuario, tareas y racha requieren `Authorization: Bearer <token>`. Registro y login devuelven ese token.

## Estado de Release 1

Este repositorio contiene el backend actual. Los cinco cambios propuestos son acceso, consulta de tareas, creación de tareas, completar tareas y racha. Para contarlos como updates de la entrega, deben poder usarse desde la aplicación publicada.

Quedan pendientes la integración con frontend, URL pública, video, reporte con costos reales, plan de validación y tag de la entrega. También deben revisarse validación de entradas, errores de conexión, registro en una transacción, fecha de Bogotá para rachas y verificación TLS para bases remotas.

## Trabajo en equipo

Agreguen el frontend y los documentos del proyecto en sus propias carpetas. No suban `.env`, claves reales ni `node_modules`. El archivo `.env.example` sirve como plantilla de configuración.
