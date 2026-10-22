# Pruebas de la app

Estas pruebas abren un navegador y revisan recorridos completos. Las pruebas con cuentas y tareas crean datos ficticios; usa el entorno local separado.

## Preparación

Desde la raíz del repositorio, instala las herramientas:

```powershell
npm.cmd ci --prefix qa
Set-Location qa
npx.cmd playwright install chromium
Set-Location ..
```

Prepara y compila la app siguiendo la [guía de desarrollo](../docs/desarrollo/ejecucion-y-despliegue.md). Para los recorridos del Release 2, inicia el entorno separado en otra terminal:

```powershell
npm.cmd run preview:release2 --prefix backend
```

## Recorridos

Ejecuta los archivos desde la raíz del repositorio. El entorno de prueba del Release 2 usa el puerto 3102.

| Archivo | Qué comprueba |
|---|---|
| `recorrido.mjs` | Recorrido original en tamaño de celular |
| `recorrido-release2.mjs` | Integración de los módulos del Release 2 |
| `instalacion.mjs` | Manifiesto, instalación web y recursos sin conexión |
| `camara.mjs` | Medición con una foto de referencia y guardado |
| `escritorio-mascota.mjs` | Guardado del escritorio y estados de la mascota |
| `sesion.mjs` | Temporizador, pausa, recarga y tarea completada |
| `mailbox.mjs` | Bandeja simulada, lectura segura, categorías, desconexión y recuperación sin proveedor |

Por ejemplo:

```powershell
node qa/recorrido-release2.mjs
node qa/camara.mjs
node qa/escritorio-mascota.mjs
node qa/sesion.mjs
```

Revisa el `BASE_URL` de cada archivo antes de ejecutarlo: el recorrido original y la prueba de instalación tienen otros puertos predeterminados. Las evidencias se guardan en `qa/evidencias/` y no se publican en Git. `fixtures/` contiene imágenes de prueba.

Las pruebas de cámara usan una imagen conocida y las de racha simulan estados visuales. No reemplazan una prueba física en iPhone ni la validación con usuarios reales.

Para las pruebas del servidor, consulta la [guía de desarrollo](../docs/desarrollo/ejecucion-y-despliegue.md).
