# Antilia Frontend

Frontend para Antilia.

## Desarrollo

Para ejecutar en modo de desarrollo necesitas usar dos terminales, una para el backend y otra para el frontend.

1.  **Terminal 1 (Backend):**
    Asegúrate de tener la base de datos corriendo (ej. `docker compose up -d`).
    En el directorio `backend/`, instala las dependencias y ejecuta el servidor de desarrollo (suele correr en `http://localhost:3000`).

2.  **Terminal 2 (Frontend):**
    En este directorio (`frontend/`), instala las dependencias y ejecuta el servidor de Vite:
    ```bash
    npm install
    npm run dev
    ```
    Vite está configurado para proxear automáticamente las peticiones a `/api` hacia `http://localhost:3000`.

## Construcción para Producción

Para construir la versión optimizada del frontend, ejecuta:

```bash
npm run build
```

Esto generará los archivos en la carpeta `dist/`.
En producción, el servidor Express (backend) está configurado para servir los archivos estáticos desde `frontend/dist/`.
