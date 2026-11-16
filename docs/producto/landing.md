# Presentación pública de Antilia

La raíz https://antilia-delta.vercel.app/ es pública. Las rutas de cuenta y organización continúan protegidas; una app nativa abre el recorrido de la aplicación, no la landing.

Incluye problema, propuesta de valor, tres pasos, capturas reales de una cuenta local de demostración, CTA central con logo y baile exclusivo de Lumi, información de instalación y equipo al final. Los roles se transcribieron del archivo de planificación suministrado por el equipo. Solo la foto de Juliana se recibió y se publicó con autorización; los otros retratos son espacios reservados con iniciales. No hay testimonios, resultados de validación ni cifras de adopción inventadas.

## Métricas

Perfil → Visitas a la landing abre `#/visitas` para las cuentas incluidas en `LANDING_ANALYTICS_ADMINS`. El backend comprueba la autorización; ocultar el botón no es la única protección. El panel muestra 30 días y permite exportar CSV.

La migración 008 agrega contadores por día de Bogotá, evento, dispositivo y origen general. No retiene identificadores de visitantes, IP, correo ni URL de referencia. Los eventos se envían sin credenciales. Se respeta Do Not Track y Global Privacy Control. El almacenamiento de sesión impide repetir el mismo evento en la misma pestaña y origen al recargar. Dos pestañas o dispositivos pueden contar dos visitas: no es una métrica de personas únicas. Los clics en descarga no prueban una instalación.

Eventos: visita, probar app, abrir opciones, APK Android, abrir web en iPhone e IPA. Orígenes admitidos: directo, WhatsApp, Instagram, QR y otro. Un bloqueo de rastreo o de red puede reducir los conteos. Son contadores de interés, no evidencia de validación ni un mecanismo antifraude.

Enlaces para difusión por el equipo, sin datos personales:

- WhatsApp: https://antilia-delta.vercel.app/?utm_source=whatsapp
- Instagram: https://antilia-delta.vercel.app/?utm_source=instagram
- QR: https://antilia-delta.vercel.app/?utm_source=qr

No se enviaron mensajes ni se publicaron anuncios en nombre del equipo. El tráfico de participantes reales debe conseguirlo el equipo y distinguirlo de las revisiones técnicas.

## Instalación

En computador, «Descarga ahora» abre la app web. En celular ofrece Android o iPhone/iPad. Android descarga un APK firmado por el proyecto. iPhone recomienda abrir Safari y añadir a inicio; el IPA es una opción avanzada y necesita firma externa. No se promete instalación directa, publicación en App Store ni solución al bloqueo de Apple.

Los binarios se copian a `dist/downloads` después de construir la web; no se incluyen dentro de los recursos nativos para evitar anidar APK e IPA en las aplicaciones.

## Comprobaciones

`qa/landing.cjs`: datos locales, sin visitas de prueba en producción; comprueba escritorio/móvil, rutas, imágenes, selección de plataforma, contadores, opt-out, permisos, CSV y pausa del baile. `qa/capture-landing.cjs` produce capturas con una cuenta local de demostración, sin respuestas de API simuladas.
