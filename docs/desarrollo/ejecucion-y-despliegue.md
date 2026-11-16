# Desarrollo y despliegue de Antilia

Ejecuta los comandos desde las carpetas del proyecto que se indican, no desde docs. Para la rama developer, después de clonar selecciona esa rama con `git switch developer`.

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

