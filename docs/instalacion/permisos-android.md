# Permisos de Android

Antilia 0.3.3 solicita acceso en el momento de usar una función, no durante el inicio de sesión ni al arrancar.

| Función | Acceso | Cuándo y alternativa |
|---|---|---|
| Tomar foto de perfil | Cámara | Al tocar Tomar una foto; también se puede elegir una imagen o conservar las iniciales. Solo se sube al guardar. |
| Foto para medir la mesa | Cámara | Al tocar Tomar foto de la mesa; también se puede elegir imagen o introducir medidas manualmente. La imagen no se sube. |
| Elegir imagen | Selector del sistema | El usuario selecciona una imagen. No se solicita acceso a toda la biblioteca, almacenamiento externo ni metadatos de ubicación. |
| Conectar Gmail | Autorización de Google | Flujo independiente de solo lectura y solo para cuentas del piloto autorizadas. |
| Recordatorios | Correo verificado y activación | Se envían por correo. No hay notificaciones nativas, por lo que no se solicita POST_NOTIFICATIONS. |

Se vuelve a comprobar Cámara en cada uso, respetando permisos de una sola vez, revocación y rechazo. Una denegación no abre la cámara ni dispara solicitudes en bucle. Si está bloqueada, la pantalla indica cómo habilitarla en Ajustes / Aplicaciones / Antilia / Permisos; la galería y las medidas manuales siguen disponibles. Cancelar el selector no se presenta como error ni reemplaza la foto anterior.

El manifiesto declara INTERNET y CAMERA; la cámara es opcional para la compatibilidad del dispositivo. No declara micrófono, contactos, ubicación ni permisos generales de fotos o archivos. Las solicitudes nuevas usan las APIs nativas de Camera 8.2.6 y no el input web para capturar en el APK.

La versión de navegador conserva su selector nativo del navegador. El sistema operativo y el navegador deciden cómo presentan sus cuadros de permiso. No se dibujan cuadros falsos que suplanten la autorización de Android.

## Verificación

`node qa/native-permissions.cjs`: primera solicitud limitada a Cámara, permiso ya concedido, nueva solicitud tras revocación, rechazo, cancelación y galería sin permiso amplio. También verifica el manifiesto. El APK debe actualizarse para recibir los cambios; desplegar la web no modifica un APK instalado.

Referencias: [Solicitudes en contexto](https://developer.android.com/training/permissions/requesting), [minimizar permisos](https://developer.android.com/privacy-and-security/minimize-permission-requests), [API de cámara](https://capacitorjs.com/docs/apis/camera).
