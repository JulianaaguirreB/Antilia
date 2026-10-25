# Antilia para Android

[Descargar APK](https://antilia-delta.vercel.app/downloads/antilia.apk) · [Huella SHA-256](https://antilia-delta.vercel.app/downloads/antilia.sha256)

Versión 0.3.4, compilación 6. Requiere Android 7 o posterior e internet. Conserva la firma anterior para actualizar sin desinstalar. Incluye bienvenida por correo al registrarse, navegación Atrás entre pantallas con confirmación al salir, accesos superiores a Inicio, foto de perfil, vestidor de Lumi con gafas, landing pública y la interfaz inspirada en Lumi, bienvenida animada y navegación Correos y archivos, además de tres mesas 3D, tarjetas personalizables, medición de ancho y fondo con corrección de perspectiva y Lumi. Se conecta a la API pública de Antilia y a los datos existentes de cada cuenta: tareas, recuperación por correo y acceso a Gmail para los usuarios autorizados del piloto.

1. Abre la web de Antilia desde el teléfono Android y pulsa **Descargar Antilia para Android (APK)**.
2. Abre el archivo descargado. Si Android lo solicita, permite que ese navegador instale el archivo y confirma la instalación.
3. Abre Antilia desde su icono e inicia sesión con tu cuenta habitual.

La descarga es directa; no está publicada en Play Store. El APK no sirve para iPhone. El computador del equipo no necesita estar encendido para usar la app.

## Construcción y actualización

El proyecto nativo está en `frontend/android`. Requiere Node.js 22+, JDK 21 y Android SDK 36. Desde `frontend`, ejecuta `npm ci`, `npm run build` y `npx cap sync android`. Desde `frontend/android`, ejecuta `gradlew assembleRelease` y firma el APK de salida con la clave de distribución de Antilia, utilizando `zipalign` y `apksigner` de Android SDK. Comprueba la firma antes de sustituir el archivo distribuido.

La clave y su configuración se conservan localmente en `frontend/android/.signing/`, excluidas de Git. Respáldalas de forma privada: las actualizaciones deben conservar la misma firma. No publiques el keystore ni sus contraseñas. Incrementa `versionCode` en cada actualización.

Vercel ejecuta `frontend/scripts/copy-downloads.cjs` después de construir la web. Esto publica el APK en `/downloads/antilia.apk` sin meter el instalador dentro de los recursos de las aplicaciones nativas. Una compilación nativa nueva debe hacerse antes de sustituir el APK distribuido; cambiar la web no actualiza automáticamente el APK instalado.

## Verificación

Comprueba la firma con `apksigner verify --verbose --print-certs`, la alineación con `zipalign -c -P 16 4` y los metadatos con `aapt dump badging`. La prueba `qa/android-download.cjs` verifica el botón en Android, su ausencia en iPhone y la descarga de un archivo APK real. La instalación y los permisos deben comprobarse también en un teléfono Android físico.

La cámara se solicita únicamente al tomar una foto de perfil o medir la mesa. La galería abre el selector del sistema sin permiso general de almacenamiento. Rechazar o cancelar no bloquea las tareas; se puede usar una foto elegida o introducir medidas manuales. [Permisos de Android](../../docs/instalacion/permisos-android.md).
