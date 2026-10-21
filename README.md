# Antilia

Aplicación para iPhone y web que ayuda al personal administrativo a organizar tareas físicas y digitales en pocos minutos al día.

- **Usar la app:** https://antilia-delta.vercel.app
- **Instalar en iPhone:** [descargar el IPA e instrucciones](distribucion/ios/README.md).
- **Instalar desde el navegador:** [guía de la web instalable](docs/instalacion/web-instalable.md).
- **Trabajar en el proyecto:** [ejecución local, pruebas y despliegue](docs/desarrollo/ejecucion-y-despliegue.md).
- **Consultar las guías:** [índice de documentación](docs/README.md).

## Organización

```text
Antilia/
├── frontend/       Pantallas React, estilos, íconos y configuración iPhone
│   ├── src/        Componentes, pantallas y conexión con la API
│   └── public/     Íconos, manifiesto y recursos estáticos
├── backend/        Servidor Express y PostgreSQL
│   ├── src/        Rutas, servicios, permisos y conexión de datos
│   ├── migrations/ Cambios versionados de la base de datos
│   ├── scripts/    Arranque de prueba, recordatorios y comprobaciones
│   └── test/       Pruebas del backend
├── api/            Entrada de Express para Vercel
├── qa/             Pruebas de recorridos y datos de prueba
├── distribucion/
│   └── ios/        IPA descargable, hash e instrucciones
├── docs/
│   ├── producto/   Diseño y alcance
│   ├── instalacion/ Guías de instalación
│   ├── uso/        Uso de la cámara
│   ├── desarrollo/ API, ejecución y publicación
│   └── entregas/   Seguimiento de entregas
├── .github/
│   └── workflows/  Compilación automática del IPA
└── vercel.json     Instalación, compilación y rutas de Vercel
```

## Estado del producto

Incluye tareas, perfil, espacios, agenda, tablero, mediciones, distribución del escritorio guardada en el servidor, mascota de racha Astra y sesiones de orden de cinco minutos. El cliente iPhone consulta la API HTTPS de Vercel y PostgreSQL de Neon; el computador del equipo no necesita estar encendido. La vista de desarrollo local usa datos separados.

Las mejoras están en `developer`; `main` conserva la versión anterior. El IPA distribuido indica el commit de su compilación en sus instrucciones. La prueba en el iPhone físico sigue siendo necesaria. El correo automático y la recuperación requieren configurar proveedor y remitente. La cámara estima distancias con una referencia, sin escaneo 3D ni detección automática de objetos.

## Guías principales

- [Diseño y alcance](docs/producto/diseno-y-alcance.md)
- [API y servicios del backend](docs/desarrollo/backend.md)
- [Medir con cámara](docs/uso/medir-con-camara.md)
- [Instalar con Sideloadly](docs/instalacion/iphone-sideloadly.md)
- [Pruebas de la app](qa/README.md)
- [Seguimiento del Release 2](docs/entregas/release2.md)

## Equipo

| Integrante | Rol |
|---|---|
| Alejandro Macías | Diseño UX |
| Juan Fernando Herrera | Frontend |
| Juliana Aguirre Ballesteros | Backend |
| Samuel Montealegre | QA |
| Nicolás Silva García | Tech Lead |

No suban `.env`, claves reales ni `node_modules`. `.env.example` es la plantilla de configuración.
