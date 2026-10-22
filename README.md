# Antilia · Release 2

Organiza tu espacio de trabajo, completa tus pendientes y construye un hábito de orden.

Antilia es una aplicación para personal administrativo de oficinas medianas en Bogotá. Reúne tareas físicas y digitales, espacios, turnos y progreso personal en una interfaz pensada para celular. Está disponible en web y como cliente para iPhone.

**[Abrir Antilia](https://antilia-delta.vercel.app)** · **[Descargar APK Android](https://antilia-delta.vercel.app/downloads/antilia.apk)** · **[Instalar en iPhone](distribucion/ios/README.md)** · **[Documentación](docs/README.md)**

> Correo: Gmail de solo lectura y recuperación por SMTP activos en la URL pública. Se verificaron la importación de un mensaje relevante y la recepción del correo de recuperación. El piloto de Google permite dos cuentas de prueba; cada usuario debe autorizar su buzón. [Configuración](docs/desarrollo/correo-y-gmail.md).

## Release 2

| Dato | Información |
|---|---|
| Entrega | 25 de octubre de 2026, 23:59 |
| Rama de trabajo | `developer` |
| Tag previsto | `v0.2`, pendiente de crear al cerrar la entrega |
| Estado | Desarrollo implementado; evidencias de validación y cierre de entrega pendientes |

El objetivo de este release es mejorar el producto con resultados de la validación del Release 1. Tener funciones implementadas no reemplaza los resultados de usuarios, el SUS ni los hallazgos que exige la entrega.

## Qué puedes hacer

| Función | Resultado para el usuario |
|---|---|
| Cuenta y acceso | Registrarse, iniciar sesión y editar el perfil |
| Tareas físicas y digitales | Crear, editar, completar y archivar pendientes |
| Tablero | Organizar tareas por estado y conservar los cambios |
| Espacios | Crear espacios y asociarles tareas |
| Mi escritorio | Guardar medidas y distribución, y recuperarlas al volver |
| Medición con cámara | Estimar medidas usando una foto y una referencia de tamaño conocido |
| Agenda | Registrar turnos y evitar cruces de horario |
| Progreso y Astra | Consultar estadísticas, racha y récord, con una mascota animada |
| Sesión de orden | Usar un temporizador de cinco minutos con pausa y recuperación al recargar |
| Recordatorios | Guardar la configuración; el envío real requiere proveedor de correo y programador |

El recorrido principal es: **crear cuenta → organizar una tarea → completarla → consultar la racha y el progreso**. El temporizador por sí solo no completa tareas ni concede una racha.

## Cambios candidatos a updates

Estos cambios deben comprobarse en la URL pública y registrarse en el reporte. Los identificadores de hallazgos se completan con evidencia real; no se asignan por suposición.

| # | Tipo | Cambio | Criterio de terminado | Origen actual |
|---|---|---|---|---|
| 01 | Nueva | Gestión de espacios | Crear y editar un espacio conserva los datos al recargar | Alcance de organización física; hallazgo por vincular |
| 02 | Nueva | Tablero de tareas | Mover una tarea entre estados conserva el cambio | Alcance de organización digital; hallazgo por vincular |
| 03 | Nueva | Agenda de turnos | Guarda un turno y rechaza un horario cruzado | Alcance de actividades; hallazgo por vincular |
| 04 | Edición | Perfil editable | Guarda nombre y exige contraseña para cambiar correo | Alcance de cuenta; hallazgo por vincular |
| 05 | Nueva | Escritorio personal | Guarda medidas y distribución para consultarlas después | Diseño de espacios; hallazgo por vincular |

**Para entregar, al menos dos updates deben citar el hallazgo real que los originó y mostrar la respuesta visible a ese problema.** Esta tabla es una propuesta de registro, no una validación ya realizada.

## Ejecutar en tu computador

Necesitas Git, Node.js 22.12 o posterior compatible con las dependencias y Docker Desktop con el motor funcionando. La primera instalación depende del tiempo de descarga de paquetes e imágenes.

En PowerShell, clona el proyecto y selecciona la rama:

```powershell
git clone --branch developer https://github.com/JulianaaguirreB/Antilia.git
Set-Location Antilia
Set-Location backend
npm.cmd ci
```

Crea la configuración local. Ejecuta este paso solo si todavía no tienes `backend/.env`; vuelve a generar la clave si se trata de un entorno nuevo:

```powershell
node -e "const fs=require('fs');const c=require('crypto');if(fs.existsSync('.env'))throw new Error('.env ya existe; conserva tu configuración');let s=fs.readFileSync('.env.example','utf8');s=s.replace(/^JWT_SECRET=.*$/m,'JWT_SECRET='+c.randomBytes(32).toString('hex'));fs.writeFileSync('.env',s)"
```

Inicia PostgreSQL, aplica las migraciones, compila las pantallas y arranca el servidor:

```powershell
docker compose up -d
npm.cmd run migrate
Set-Location ../frontend
npm.cmd ci
npm.cmd run build
Set-Location ../backend
npm.cmd start
```

Abre **http://localhost:3000** y deja esa terminal abierta. Puedes comprobar la respuesta del servidor en **http://localhost:3000/api/health**; esta respuesta no demuestra por sí sola que todos los recorridos funcionen.

Para editar las pantallas con recarga automática, ejecuta `npm.cmd run dev` en `frontend/` y en otra terminal el mismo comando en `backend/`. Abre **http://localhost:5173**. En macOS y Linux usa `npm` en lugar de `npm.cmd`. Más detalles en la [guía de ejecución y despliegue](docs/desarrollo/ejecucion-y-despliegue.md).

## Configuración y servidor público

| Variable | Uso |
|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL |
| `JWT_SECRET` | Clave privada de sesiones de al menos 32 caracteres |
| `PORT` | Puerto local; por defecto 3000 |
| `DATABASE_SSL` | Activar conexión TLS cuando el proveedor lo requiera |
| `RESEND_API_KEY` | Clave del proveedor para enviar correos |
| `REMINDER_FROM` | Remitente autorizado por el proveedor |
| `CRON_SECRET` | Secreto separado para ejecutar el despacho de recordatorios |

La versión pública usa **Vercel para la web y API** y **Neon para PostgreSQL**. El computador del equipo no necesita estar encendido. El cliente iPhone se conecta al servidor público por HTTPS. El entorno local usa su propia base de datos.

Vercel toma la configuración de `vercel.json` desde la raíz del repositorio. Las variables reales se configuran en el servicio de publicación. Los recordatorios necesitan además programar la ejecución del despacho; agregar las claves no instala un programador automáticamente.

No publiques `.env`, contraseñas, tokens ni cadenas privadas de conexión.

## Arquitectura

```text
Antilia/
├── frontend/
│   ├── src/app/                Inicio, navegación y estilos
│   ├── src/features/           Pantallas y componentes por función
│   ├── src/shared/             Cliente API, interfaz y utilidades comunes
│   └── public/                 Íconos y recursos de instalación web
├── backend/
│   ├── src/modules/            Rutas y servicios por función
│   ├── src/shared/             Permisos, validaciones y errores
│   ├── src/infrastructure/     PostgreSQL y correo
│   ├── migrations/             Cambios de esquema versionados
│   ├── scripts/                Operación y entorno local
│   └── test/                   Pruebas de integración
├── api/                        Entrada del servidor para Vercel
├── qa/                         Recorridos de navegador y datos de prueba
├── distribucion/ios/           IPA e instrucciones de instalación
├── docs/                       Producto, uso, desarrollo y entregas
├── .github/workflows/          Compilación del IPA
└── vercel.json                 Configuración de publicación
```

Tecnologías principales: React, TypeScript, Vite, Tailwind CSS, Capacitor, Node.js, Express y PostgreSQL. Consulta las [reglas de arquitectura](docs/desarrollo/arquitectura.md) antes de agregar módulos.

## Comprobaciones

Desde la raíz del repositorio:

```powershell
npm.cmd run build --prefix frontend
npm.cmd run test:release2 --prefix backend
```

Las pruebas del backend usan PostgreSQL local y crean una base temporal separada. En la revisión técnica del 21 de octubre pasaron **18 pruebas de integración** y la compilación del frontend. Se comprueban permisos entre usuarios, tareas, espacios, turnos, estadísticas, correo, recuperación y escritorio. Esto no equivale a una validación con personas reales ni a una instalación física en iPhone.

Los recorridos de navegador y su preparación están en [qa/README.md](qa/README.md).

## Límites actuales

- Los correos reales de verificación, recuperación y recordatorios requieren configurar proveedor, remitente y, para recordatorios, ejecución programada.
- Los recordatorios siguen un horario configurado; no aprenden hábitos automáticamente.
- La cámara usa una referencia conocida para estimar medidas. No hace escaneo 3D ni detecta objetos automáticamente.
- Los pendientes manuales siguen separados de Gmail. La nueva selección de correo requiere OAuth de Google y no está activada hasta configurarlo; los archivos no se sincronizan con almacenamiento externo.
- Los datos se actualizan al consultar o realizar cambios; no hay sincronización instantánea entre dispositivos.
- El IPA es una compilación sin firma que se instala con Sideloadly. Su versión está indicada en la guía; la instalación y los permisos deben comprobarse en un iPhone físico.

## Pendientes para cerrar la entrega

| Requisito de la Junta | Evidencia necesaria |
|---|---|
| Validación del Release 1 | Cinco o más usuarios del segmento, resultados por tarea, SUS y hallazgos priorizados |
| Cambios por evidencia | Al menos dos updates vinculados a hallazgos reales |
| Cinco updates publicados | Cada cambio verificable en la URL y registrado con su criterio de terminado |
| Landing pública | Problema, propuesta de valor, tres pasos, captura real, llamado a la acción y analítica comprobada |
| Video | Enlace abierto a un video narrado de dos a tres minutos sobre la URL real |
| Reporte PDF | Tabla de updates, evidencias y costos, aunque sean cero |
| Próxima validación | Usuarios, tareas y criterios para el 26 de octubre al 8 de noviembre |
| Cierre del repositorio | Revisar contribuciones de todos y crear el tag `v0.2` sobre la versión entregada |
| Prueba externa | Comprobar la URL desde un celular que no pertenezca al equipo |

No se incluyen resultados de usuarios, enlaces de video ni costos sin confirmar. El [seguimiento del 16 de octubre](docs/entregas/release2.md) conserva el estado de ese avance; esta página describe el estado técnico revisado el 21 de octubre.

## Equipo

| Integrante | Responsabilidad |
|---|---|
| Alejandro Macías | Diseño UX |
| Juan Fernando Herrera | Frontend |
| Juliana Aguirre Ballesteros | Backend |
| Samuel Montealegre | QA |
| Nicolás Silva García | Tech Lead |

## Guías

- [Índice de documentación](docs/README.md)
- [Diseño y alcance](docs/producto/diseno-y-alcance.md)
- [API y servicios del backend](docs/desarrollo/backend.md)
- [Medición con cámara](docs/uso/medir-con-camara.md)
- [Instalación en iPhone](docs/instalacion/iphone-sideloadly.md)
- [Instalación desde el navegador](docs/instalacion/web-instalable.md)
