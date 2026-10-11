# Antilia

Aplicación web para celular que ayuda a asistentes administrativos de empresas medianas de Bogotá a mantener ordenado su espacio de trabajo físico y digital en pocos minutos al día. Proyecto del equipo Antilia para PIETI 2026-2.

**App publicada:** https://antilia-delta.vercel.app

Publicación comprobada el 11 de octubre de 2026: Vercel con PostgreSQL de Neon en plan Free. Pasaron las 14 comprobaciones del recorrido automático en vista de celular: acceso, validación del formulario, registro, tareas físicas y digitales, completar, progreso, racha, filtros, perfil, sesión al recargar y cierre de sesión. También se probaron registro, login, persistencia y racha por la API pública con datos ficticios. La prueba automática no sustituye la comprobación desde un celular ajeno al equipo.

## Qué hace la versión v0.1 (Release 1)

El job principal es: **crear una cuenta → ver las tareas de orden del día → completar una → ver la racha actualizada.**

| # | Función | Dónde se ve |
|---|---|---|
| 1 | Registro e inicio de sesión con correo y contraseña. La sesión dura 7 días. | Pantallas Acceso y Registro |
| 2 | Crear una tarea física o digital con solo título y tipo | Botón "Nueva tarea" |
| 3 | Completar una tarea con un toque, con la barra "Progreso del día" | Inicio |
| 4 | Racha de días seguidos y racha más alta, con aviso al subir | Inicio y Progreso |
| 5 | Filtros Físicas/Digitales, errores que dicen cómo corregir y diseño para celular | Todas las pantallas |

Todavía no incluye: inicio de sesión con Google, recordatorio por correo, bloqueo después de intentos fallidos ni la gráfica de los últimos 7 días.

## Cómo está organizado

```
Antilia/
├── backend/     API REST en Node.js + Express + PostgreSQL (JWT y bcrypt)
├── frontend/    Interfaz en React + TypeScript + Tailwind (Vite)
├── api/         Entrada de la API cuando se despliega en Vercel
├── qa/          Prueba automática del recorrido completo en vista de celular
└── vercel.json  Configuración del despliegue
```

En local, el backend sirve la API en `/api` y también la interfaz ya compilada (`frontend/dist`), así que todo queda en `http://localhost:3000`. En Vercel, la interfaz se publica como archivos estáticos y `/api/*` llega a la misma app de Express.

## Ejecutar en local

### Requisitos

- [Node.js 22 LTS](https://nodejs.org/) (incluye npm)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) abierto y con el motor funcionando, para la base de datos. Si ya tienes PostgreSQL, puedes omitir Docker y poner tu cadena en `DATABASE_URL`.
- Git

### Windows (PowerShell)

```powershell
git clone https://github.com/JulianaaguirreB/Antilia.git
Set-Location .\Antilia

# 1. Backend: dependencias y configuración
Set-Location .\backend
npm.cmd ci
node -e "const fs=require('fs');const c=require('crypto');let s=fs.readFileSync('.env.example','utf8');s=s.replace(/^JWT_SECRET=.*$/m,'JWT_SECRET='+c.randomBytes(32).toString('hex'));fs.writeFileSync('.env',s)"

# 2. Base de datos (la primera vez descarga PostgreSQL)
docker compose up -d
npm.cmd run migrate

# 3. Frontend: compilar la interfaz
Set-Location ..\frontend
npm.cmd ci
npm.cmd run build

# 4. Arrancar
Set-Location ..\backend
npm.cmd start
```

### macOS / Linux

```bash
git clone https://github.com/JulianaaguirreB/Antilia.git
cd Antilia/backend
npm ci
node -e "const fs=require('fs');const c=require('crypto');let s=fs.readFileSync('.env.example','utf8');s=s.replace(/^JWT_SECRET=.*$/m,'JWT_SECRET='+c.randomBytes(32).toString('hex'));fs.writeFileSync('.env',s)"
docker compose up -d
npm run migrate
cd ../frontend && npm ci && npm run build
cd ../backend && npm start
```

Abre **http://localhost:3000**. Para probar con el celular en la misma red Wi-Fi, usa la IP del computador, por ejemplo `http://192.168.1.20:3000`.

El comando `node -e ...` crea `backend/.env` a partir de `.env.example` con una clave `JWT_SECRET` aleatoria. El servidor no arranca si la clave es la de ejemplo.

### Modo desarrollo (para editar la interfaz)

Usa dos terminales: `npm run dev` en `backend/` y `npm run dev` en `frontend/`. Luego abre `http://localhost:5173`. Vite recarga los cambios al instante y envía `/api` al backend del puerto 3000.

### Problemas comunes

| Síntoma | Causa probable |
|---|---|
| `JWT_SECRET debe tener al menos 32 caracteres` | Falta el paso del comando `node -e` o se borró `.env` |
| `ECONNREFUSED ... 5432` | Docker Desktop no está abierto o `docker compose up -d` no terminó |
| `{"error":"Ruta no encontrada."}` en `localhost:3000` | No se compiló la interfaz (`npm run build` en `frontend/`) |
| En PowerShell, `npm` dice que la ejecución de scripts está deshabilitada | Usa `npm.cmd` en lugar de `npm` |

## Pruebas

Con el servidor corriendo, desde `backend/`:

```bash
npm run smoke          # 33 comprobaciones de la API
npm run smoke:streak   # reglas de la racha (solo con base local)
```

Recorrido completo en un navegador con pantalla de celular (registro, tareas, racha, progreso, perfil). Desde `qa/`:

```bash
npm ci
npx playwright install chromium
npm run recorrido
```

Para probar la versión publicada: `$env:BASE_URL="https://..."; npm.cmd run recorrido` en PowerShell, o `BASE_URL=https://... npm run recorrido` en macOS/Linux. Las capturas quedan en `qa/evidencias/`. Cada ejecución crea una cuenta de prueba nueva.

## Despliegue en Vercel

1. Crear una base PostgreSQL gratuita (por ejemplo, Neon desde *Vercel → Storage*) y copiar su cadena de conexión.
2. Crear las tablas una sola vez desde tu computador, en `backend/`:
   ```powershell
   $env:DATABASE_URL="postgresql://...?sslmode=require"; $env:DATABASE_SSL="true"; npm.cmd run migrate
   ```
3. En Vercel, importar el repositorio con **Root Directory vacío (la raíz del repo)** y Framework Preset **Other**. `vercel.json` ya define la instalación, la compilación y las rutas.
4. En *Settings → Environment Variables*, agregar:
   - `DATABASE_URL`: la cadena de la base
   - `DATABASE_SSL`: `true`
   - `JWT_SECRET`: un texto aleatorio de 64 caracteres. Puedes generarlo con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
5. Desplegar y comprobar `https://<tu-app>.vercel.app/api/health`. Debe responder `"status":"ok"`.

Si falta una variable, la API responde con un error que dice cuál es.

## Rutas de la API

| Método | Ruta | Función |
|---|---|---|
| GET | `/api/health` | Estado del servidor |
| POST | `/api/auth/register` | Crear cuenta |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Consultar el usuario |
| GET | `/api/tasks` | Tareas pendientes (`?status=completada` o `?status=all`; `?type=fisica` o `?type=digital`) |
| POST | `/api/tasks` | Crear tarea `{ title, type: "fisica" \| "digital" }` |
| PATCH | `/api/tasks/:id/complete` | Completar tarea y actualizar la racha |
| GET | `/api/streak` | Racha actual y récord |

Las rutas de usuario, tareas y racha requieren `Authorization: Bearer <token>`. Registro y login devuelven ese token.

**Regla de la racha** (hora de Bogotá): al completar la primera tarea del día, la racha sube en 1 si la última actividad fue ayer y vuelve a 1 si fue antes. Si pasa un día completo sin completar tareas, la racha mostrada es 0. Siempre se conserva el récord.

## Equipo

| Integrante | Rol |
|---|---|
| Alejandro Macías | Diseño UX |
| Juan Fernando Herrera | Frontend |
| Juliana Aguirre Ballesteros | Backend |
| Samuel Montealegre | QA |
| Nicolás Silva García | Tech Lead |

No suban `.env`, claves reales ni `node_modules`. `.env.example` es la plantilla de configuración.
