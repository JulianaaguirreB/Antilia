import { useEffect, useState, type MouseEvent } from "react";

const assetPathPrefix = "/assets";
const imgTiliaDay7 = `${assetPathPrefix}/cfc41.png`;
const imgSignal = `${assetPathPrefix}/434ba.svg`;
const imgIosWifiSignal = `${assetPathPrefix}/3432a.svg`;
const imgIosBatteryFull = `${assetPathPrefix}/af690.svg`;
const imgArrowLeft = `${assetPathPrefix}/87d55.svg`;
const imgApple = `${assetPathPrefix}/95ef6.svg`;
const imgAvatar = `${assetPathPrefix}/cbd82.svg`;
const imgCheckCircle = `${assetPathPrefix}/5a3ec.svg`;
const imgShieldCheck = `${assetPathPrefix}/c46e6.svg`;
const imgCircleX = `${assetPathPrefix}/7908b.svg`;
const imgIosSignal = `${assetPathPrefix}/07dbc.svg`;
const imgIosWifiSignal1 = `${assetPathPrefix}/3f01d.svg`;
const imgIosBatteryFull1 = `${assetPathPrefix}/de792.svg`;
const imgCircleX1 = `${assetPathPrefix}/ee41d.svg`;
const imgIosSignal1 = `${assetPathPrefix}/b8986.svg`;
const imgIosWifiSignal2 = `${assetPathPrefix}/bc0c3.svg`;
const imgIosBatteryFull2 = `${assetPathPrefix}/3ff93.svg`;
const imgCircleX2 = `${assetPathPrefix}/e3fe0.svg`;
const imgMail = `${assetPathPrefix}/58510.svg`;
const imgLock = `${assetPathPrefix}/355ca.svg`;
const imgLine = `${assetPathPrefix}/66980.svg`;
const imgCircleX3 = `${assetPathPrefix}/621ec.svg`;
const imgApple1 = `${assetPathPrefix}/71c16.svg`;
const imgBox = `${assetPathPrefix}/8f82c.svg`;
const imgComputer = `${assetPathPrefix}/df8e4.svg`;
const imgCheck = `${assetPathPrefix}/ab182.svg`;
const imgHome = `${assetPathPrefix}/d36d0.svg`;
const imgBox1 = `${assetPathPrefix}/41a5b.svg`;
const imgComputer1 = `${assetPathPrefix}/ab9b5.svg`;
const imgBarChart = `${assetPathPrefix}/5aa14.svg`;
const imgUser = `${assetPathPrefix}/d2478.svg`;
const imgChevronLeft = `${assetPathPrefix}/5e2cc.svg`;
const imgSearch = `${assetPathPrefix}/49337.svg`;
const imgCheck1 = `${assetPathPrefix}/6ae9f.svg`;
const imgCheck2 = `${assetPathPrefix}/4bd7b.svg`;
const imgHome1 = `${assetPathPrefix}/181df.svg`;
const imgBox2 = `${assetPathPrefix}/d8747.svg`;
const imgComputer2 = `${assetPathPrefix}/2b52d.svg`;
const imgBarChart1 = `${assetPathPrefix}/8ac52.svg`;
const imgComputer3 = `${assetPathPrefix}/373c1.svg`;
const imgBarChart2 = `${assetPathPrefix}/fdc03.svg`;
const imgMail1 = `${assetPathPrefix}/0f7cd.svg`;
const imgDivider = `${assetPathPrefix}/6ec19.svg`;
const imgIosSignal2 = `${assetPathPrefix}/b0613.svg`;
const imgIosWifiSignal3 = `${assetPathPrefix}/d791f.svg`;
const imgIosBatteryFull3 = `${assetPathPrefix}/39deb.svg`;
const imgUserCog = `${assetPathPrefix}/be736.svg`;
const imgVector = `${assetPathPrefix}/68b54.svg`;
const imgLine1 = `${assetPathPrefix}/464c1.svg`;
const imgBell = `${assetPathPrefix}/f7d0e.svg`;
const imgShieldCheck1 = `${assetPathPrefix}/4df04.svg`;
const imgBox3 = `${assetPathPrefix}/f9609.svg`;
const imgUser1 = `${assetPathPrefix}/6f93c.svg`;
const imgChevronLeft1 = `${assetPathPrefix}/b3b8e.svg`;
const imgUserPen = `${assetPathPrefix}/4107d.svg`;
const imgIconMail = `${assetPathPrefix}/2748d.svg`;
const imgMapPinHouse = `${assetPathPrefix}/5faaf.svg`;
const imgLine2 = `${assetPathPrefix}/4a5e8.svg`;
const imgBox4 = `${assetPathPrefix}/37b1f.svg`;
const imgLayoutPanelLeft = `${assetPathPrefix}/0b78e.svg`;
const imgComputer4 = `${assetPathPrefix}/d656c.svg`;
const imgMoonStar = `${assetPathPrefix}/76e8a.svg`;
const imgToggleActive = `${assetPathPrefix}/14bfc.svg`;
const imgEllipse = `${assetPathPrefix}/f02b3.svg`;
const imgEllipse1 = `${assetPathPrefix}/006cf.svg`;
const imgIconDesk = `${assetPathPrefix}/f30fd.svg`;
const imgToggleInactive = `${assetPathPrefix}/25911.svg`;
const imgBarChart3 = `${assetPathPrefix}/122a5.svg`;
const imgAlertTriangle = `${assetPathPrefix}/78b27.svg`;
const imgEllipse2 = `${assetPathPrefix}/7fc09.svg`;
const imgEllipse3 = `${assetPathPrefix}/fe40e.svg`;
const imgFlashlight = `${assetPathPrefix}/ec409.svg`;
const imgIconMail1 = `${assetPathPrefix}/9a8f0.svg`;
const imgSparkles = `${assetPathPrefix}/3555f.svg`;
const imgUser2 = `${assetPathPrefix}/dcfa0.svg`;
const imgLockKeyhole = `${assetPathPrefix}/286f6.svg`;

const HOME = "antilia-ui-03-principal";
const ACCESS = "antilia-ui-02-acceso";
const BACK_TARGETS: Record<string, string> = {
  "Acceso con Apple": ACCESS,
  "Acceso con Google": ACCESS,
  "antilia-ui-04-organizacion-fisica": HOME,
  "antilia-ui-05-organizacion-digital": HOME,
  "antilia-ui-06-racha": HOME,
  "antilia-ui-07-correos": "antilia-ui-05-organizacion-digital",
  "antilia-ui-08-ranking": HOME,
  "antilia-ui-09-orden-escritorio": "antilia-ui-04-organizacion-fisica",
  "antilia-ui-11-datos": "antilia-ui-10-cuenta",
  "antilia-ui-12-medir-espacio": "antilia-ui-10-cuenta",
  "antilia-ui-13-archivos": "antilia-ui-05-organizacion-digital",
  "antilia-ui-14-recordatorios": "antilia-ui-10-cuenta",
  "antilia-ui-15-cerrar-sesion": "antilia-ui-10-cuenta",
  "antilia-ui-16-estado": HOME,
  "antilia-ui-17-recuperar-contrasena": ACCESS,
};

export default function FigmaScreens() {
  const [screen, setScreen] = useState("antilia-ui-01-inicio");
  const [notice, setNotice] = useState("");
  const [nightReminder, setNightReminder] = useState(true);
  const [weeklyReminder, setWeeklyReminder] = useState(false);

  useEffect(() => {
    if (screen !== "antilia-ui-01-inicio") return;
    const timer = window.setTimeout(() => setScreen(ACCESS), 1500);
    return () => window.clearTimeout(timer);
  }, [screen]);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 1800);
  }

  function handleNavigation(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const namedTarget = target.closest<HTMLElement>("[data-name]");
    const name = namedTarget?.dataset.name ?? "";
    const nodeId = namedTarget?.dataset.nodeId ?? "";
    const text = (namedTarget?.textContent ?? target.textContent ?? "").replace(/\s+/g, " ").trim();

    if (screen === "antilia-ui-01-inicio") {
      setScreen(ACCESS);
      return;
    }

    if (name === "arrow-left" || name === "chevron-left") {
      setScreen(BACK_TARGETS[screen] ?? HOME);
      return;
    }

    if (screen === "antilia-ui-14-recordatorios" && nodeId === "3:1156") {
      setNightReminder((active) => !active);
      showNotice(nightReminder ? "Recordatorio nocturno desactivado" : "Recordatorio nocturno activado");
      return;
    }

    if (screen === "antilia-ui-14-recordatorios" && nodeId === "3:1187") {
      setWeeklyReminder((active) => !active);
      showNotice(weeklyReminder ? "Recordatorio semanal desactivado" : "Recordatorio semanal activado");
      return;
    }

    if (text === "Inicio") return setScreen(HOME);
    if (text === "Físico") return setScreen("antilia-ui-04-organizacion-fisica");
    if (text === "Digital") return setScreen("antilia-ui-05-organizacion-digital");
    if (text === "Progreso") return setScreen("antilia-ui-08-ranking");
    if (text === "Perfil") return setScreen("antilia-ui-10-cuenta");

    if (screen === ACCESS) {
      if (text.includes("Olvidaste")) return setScreen("antilia-ui-17-recuperar-contrasena");
      if (name === "Google" || text === "Google") return setScreen("Acceso con Google");
      if (name === "Apple" || text === "Apple") return setScreen("Acceso con Apple");
      if (text.includes("Regístrate")) return setScreen("Registro de nuevo usuario");
      if (text.includes("Iniciar Sesión")) return setScreen(HOME);
    }

    if (screen === HOME) {
      if (text.includes("Org. Física")) return setScreen("antilia-ui-04-organizacion-fisica");
      if (text.includes("Org. Digital")) return setScreen("antilia-ui-05-organizacion-digital");
      if (text.includes("Progreso del Día")) return setScreen("antilia-ui-16-estado");
      if (text.includes("Nivel 4")) return setScreen("antilia-ui-06-racha");
    }

    if (screen === "antilia-ui-04-organizacion-fisica" && text.includes("Espacio: Escritorio")) {
      return setScreen("antilia-ui-09-orden-escritorio");
    }

    if (screen === "antilia-ui-05-organizacion-digital") {
      if (text.includes("Limpieza de archivos")) return setScreen("antilia-ui-13-archivos");
      if (text.includes("Limpieza de correos")) return setScreen("antilia-ui-07-correos");
    }

    if (screen === "antilia-ui-10-cuenta") {
      if (text.includes("Modificar Perfil")) return setScreen("antilia-ui-11-datos");
      if (text.includes("Recordatorios y Alertas")) return setScreen("antilia-ui-14-recordatorios");
      if (text.includes("Privacidad y Datos")) return setScreen("antilia-ui-12-medir-espacio");
      if (text.includes("Cerrar Sesión")) return setScreen("antilia-ui-15-cerrar-sesion");
    }

    if (screen === "antilia-ui-09-orden-escritorio" && text.includes("Recomendación")) {
      return setScreen("antilia-ui-12-medir-espacio");
    }

    if (screen === "antilia-ui-11-datos" && text.includes("Guardar Cambios")) {
      showNotice("Cambios guardados");
      return setScreen("antilia-ui-10-cuenta");
    }

    if (screen === "antilia-ui-07-correos") {
      if (text === "Archivar") return showNotice("Correo archivado");
      if (text === "Eliminar") return showNotice("Correo eliminado");
    }

    if (screen === "antilia-ui-13-archivos") {
      if (text === "Organizar") return showNotice("Archivo organizado");
      if (text === "Archivar") return showNotice("Archivo archivado");
      if (text === "Eliminar") return showNotice("Archivo eliminado");
    }

    if (screen === "antilia-ui-12-medir-espacio" && text.includes("Iniciar Escaneo")) {
      return showNotice("Escaneo de área iniciado");
    }

    if (screen === "antilia-ui-15-cerrar-sesion") {
      if (text.includes("Sí, cerrar sesión")) return setScreen(ACCESS);
      if (text === "Cancelar") return setScreen("antilia-ui-10-cuenta");
    }

    if (screen === "antilia-ui-17-recuperar-contrasena" && text.includes("Enviar Enlace")) {
      showNotice("Enlace enviado");
      return setScreen(ACCESS);
    }

    if (screen === "antilia-ui-17-recuperar-contrasena" && text.includes("Inicia sesión aquí")) {
      return setScreen(ACCESS);
    }

    if (screen === "Registro de nuevo usuario" && text.includes("Crear Cuenta")) {
      return setScreen(HOME);
    }

    if (screen === "Registro de nuevo usuario" && text.includes("Inicia sesión")) {
      return setScreen(ACCESS);
    }

    if (screen === "Acceso con Google" || screen === "Acceso con Apple") {
      if (text === "Cancelar") return setScreen(ACCESS);
      if (text.includes("Continuar con")) return setScreen(HOME);
    }
  }

  return (
    <div
      className="antilia-app relative min-h-[100dvh] w-full"
      data-node-id="2011:23"
      data-screen={screen}
      onClick={handleNavigation}
    >
      <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[683px] items-start justify-between left-0 overflow-clip rounded-[32px] top-0 w-[393px]" data-node-id="40:313" data-name="Acceso con Apple">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="40:314" data-name="Contenido superior">
          <div className="content-stretch flex h-[44px] items-center justify-between overflow-clip px-[24px] relative shrink-0 w-full" data-node-id="40:315" data-name="Barra de estado">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="40:316">
              9:41
            </p>
            <div className="content-stretch flex gap-[6px] items-center overflow-clip relative shrink-0" data-node-id="40:317" data-name="Indicadores">
              <div className="relative shrink-0 size-[17px]" data-node-id="40:392" data-name="signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSignal} />
              </div>
              <div className="relative shrink-0 size-[17px]" data-node-id="40:395" data-name="ios-wifi-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosWifiSignal} />
              </div>
              <div className="h-[17px] relative shrink-0 w-[24px]" data-node-id="40:398" data-name="ios-battery-full">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosBatteryFull} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex items-center justify-between overflow-clip pb-[18px] pt-[14px] px-[24px] relative shrink-0 w-full" data-node-id="40:321" data-name="Navegación">
            <div className="relative shrink-0 size-[22px]" data-node-id="40:401" data-name="arrow-left">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgArrowLeft} />
            </div>
            <div className="content-stretch flex gap-[8px] items-center overflow-clip relative shrink-0" data-node-id="40:323" data-name="Marca">
              <div className="bg-[#0b55ff] content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[15px] shrink-0 size-[30px]" data-node-id="40:324" data-name="Símbolo">
                <p className="[word-break:break-word] font-['Inter:Extra_Bold'] font-extrabold leading-[normal] not-italic relative shrink-0 text-[17px] text-white whitespace-nowrap" data-node-id="40:325">
                  A
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Extra_Bold'] font-extrabold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[18px] whitespace-nowrap" data-node-id="40:326">
                ANTILIA
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[24px] items-center pt-[24px] px-[24px] relative shrink-0 w-full" data-node-id="40:327" data-name="Autorización">
            <div className="bg-[#111827] content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[38px] shadow-[0px_10px_30px_0px_rgba(15,23,42,0.07)] shrink-0 size-[76px]" data-node-id="40:328" data-name="Proveedor">
              <div className="relative shrink-0 size-[38px]" data-node-id="40:404" data-name="apple">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgApple} />
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-center not-italic overflow-clip relative shrink-0 text-center w-full" data-node-id="40:330" data-name="Introducción">
              <p className="font-['Inter:Extra_Bold'] font-extrabold leading-[normal] min-w-full relative shrink-0 text-[#0f172a] text-[24px] w-[min-content]" data-node-id="40:331">
                Continuar con Apple
              </p>
              <p className="font-['Inter:Regular'] font-normal leading-[1.45] relative shrink-0 text-[#475569] text-[14px] w-[300px]" data-node-id="40:332">
                Apple compartirá tu nombre, correo electrónico y foto de perfil con Antilia.
              </p>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] items-center overflow-clip p-[16px] relative rounded-[20px] shadow-[0px_10px_30px_0px_rgba(15,23,42,0.07)] shrink-0 w-full" data-node-id="40:333" data-name="Cuenta seleccionada">
              <div className="relative shrink-0 size-[44px]" data-node-id="40:334" data-name="Avatar">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAvatar} />
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[3px] items-start leading-[normal] min-w-px not-italic overflow-clip relative whitespace-nowrap" data-node-id="40:335" data-name="Datos">
                <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[14px]" data-node-id="40:336">
                  María González
                </p>
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[12px]" data-node-id="40:337">
                  maria@icloud.com
                </p>
              </div>
              <div className="relative shrink-0 size-[20px]" data-node-id="40:407" data-name="check-circle">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheckCircle} />
              </div>
            </div>
            <div className="bg-[#e6edff] content-stretch flex gap-[10px] items-start overflow-clip p-[14px] relative rounded-[16px] shrink-0 w-full" data-node-id="40:339" data-name="Aviso">
              <div className="relative shrink-0 size-[20px]" data-node-id="40:410" data-name="shield-check">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShieldCheck} />
              </div>
              <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[1.45] min-w-px not-italic relative text-[#475569] text-[12px]" data-node-id="40:341">
                Tus datos se usarán únicamente para crear tu cuenta y mantenerla segura.
              </p>
            </div>
            <div className="bg-[#0b55ff] content-stretch flex flex-col h-[50px] items-center justify-center overflow-clip px-[24px] relative rounded-[14px] shrink-0 w-full" data-node-id="40:342" data-name="Botón principal">
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[15px] text-white whitespace-nowrap" data-node-id="40:343">
                Continuar con Apple
              </p>
            </div>
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0b55ff] text-[14px] whitespace-nowrap" data-node-id="40:344">
              Cancelar
            </p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[12px] items-center overflow-clip px-[24px] relative shrink-0 w-full" data-node-id="40:345" data-name="Pie">
          <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[1.4] not-italic relative shrink-0 text-[#94a3b8] text-[12px] text-center w-[320px]" data-node-id="40:346">
            Al continuar aceptas los términos de Antilia.
          </p>
          <div className="content-stretch flex flex-col h-[24px] items-center justify-center overflow-clip relative shrink-0 w-full" data-node-id="40:347" data-name="Indicador de inicio">
            <div className="bg-[#0f172a] h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-node-id="40:348" data-name="Barra" />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[683px] items-start justify-between left-0 overflow-clip rounded-[32px] top-0 w-[393px]" data-node-id="40:276" data-name="Acceso con Google">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="40:277" data-name="Contenido superior">
          <div className="content-stretch flex h-[44px] items-center justify-between overflow-clip px-[24px] relative shrink-0 w-full" data-node-id="40:278" data-name="Barra de estado">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="40:279">
              9:41
            </p>
            <div className="content-stretch flex gap-[6px] items-center overflow-clip relative shrink-0" data-node-id="40:280" data-name="Indicadores">
              <div className="relative shrink-0 size-[17px]" data-node-id="40:371" data-name="signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSignal} />
              </div>
              <div className="relative shrink-0 size-[17px]" data-node-id="40:374" data-name="ios-wifi-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosWifiSignal} />
              </div>
              <div className="h-[17px] relative shrink-0 w-[24px]" data-node-id="40:377" data-name="ios-battery-full">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosBatteryFull} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex items-center justify-between overflow-clip pb-[18px] pt-[14px] px-[24px] relative shrink-0 w-full" data-node-id="40:284" data-name="Navegación">
            <div className="relative shrink-0 size-[22px]" data-node-id="40:380" data-name="arrow-left">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgArrowLeft} />
            </div>
            <div className="content-stretch flex gap-[8px] items-center overflow-clip relative shrink-0" data-node-id="40:286" data-name="Marca">
              <div className="bg-[#0b55ff] content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[15px] shrink-0 size-[30px]" data-node-id="40:287" data-name="Símbolo">
                <p className="[word-break:break-word] font-['Inter:Extra_Bold'] font-extrabold leading-[normal] not-italic relative shrink-0 text-[17px] text-white whitespace-nowrap" data-node-id="40:288">
                  A
                </p>
              </div>
              <p className="[word-break:break-word] font-['Inter:Extra_Bold'] font-extrabold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[18px] whitespace-nowrap" data-node-id="40:289">
                ANTILIA
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[24px] items-center pt-[24px] px-[24px] relative shrink-0 w-full" data-node-id="40:290" data-name="Autorización">
            <div className="bg-white content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[38px] shadow-[0px_10px_30px_0px_rgba(15,23,42,0.07)] shrink-0 size-[76px]" data-node-id="40:291" data-name="Proveedor">
              <div className="relative shrink-0 size-[38px]" data-node-id="40:383" data-name="circle-x">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCircleX} />
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-center not-italic overflow-clip relative shrink-0 text-center w-full" data-node-id="40:293" data-name="Introducción">
              <p className="font-['Inter:Extra_Bold'] font-extrabold leading-[normal] min-w-full relative shrink-0 text-[#0f172a] text-[24px] w-[min-content]" data-node-id="40:294">
                Continuar con Google
              </p>
              <p className="font-['Inter:Regular'] font-normal leading-[1.45] relative shrink-0 text-[#475569] text-[14px] w-[300px]" data-node-id="40:295">
                Google compartirá tu nombre, correo electrónico y foto de perfil con Antilia.
              </p>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] items-center overflow-clip p-[16px] relative rounded-[20px] shadow-[0px_10px_30px_0px_rgba(15,23,42,0.07)] shrink-0 w-full" data-node-id="40:296" data-name="Cuenta seleccionada">
              <div className="relative shrink-0 size-[44px]" data-node-id="40:297" data-name="Avatar">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAvatar} />
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[3px] items-start leading-[normal] min-w-px not-italic overflow-clip relative whitespace-nowrap" data-node-id="40:298" data-name="Datos">
                <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[14px]" data-node-id="40:299">
                  María González
                </p>
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[12px]" data-node-id="40:300">
                  maria.gonzalez@gmail.com
                </p>
              </div>
              <div className="relative shrink-0 size-[20px]" data-node-id="40:386" data-name="check-circle">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheckCircle} />
              </div>
            </div>
            <div className="bg-[#e6edff] content-stretch flex gap-[10px] items-start overflow-clip p-[14px] relative rounded-[16px] shrink-0 w-full" data-node-id="40:302" data-name="Aviso">
              <div className="relative shrink-0 size-[20px]" data-node-id="40:389" data-name="shield-check">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShieldCheck} />
              </div>
              <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[1.45] min-w-px not-italic relative text-[#475569] text-[12px]" data-node-id="40:304">
                Tus datos se usarán únicamente para crear tu cuenta y mantenerla segura.
              </p>
            </div>
            <div className="bg-[#0b55ff] content-stretch flex flex-col h-[50px] items-center justify-center overflow-clip px-[24px] relative rounded-[14px] shrink-0 w-full" data-node-id="40:305" data-name="Botón principal">
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[15px] text-white whitespace-nowrap" data-node-id="40:306">
                Continuar con Google
              </p>
            </div>
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0b55ff] text-[14px] whitespace-nowrap" data-node-id="40:307">
              Cancelar
            </p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[12px] items-center overflow-clip px-[24px] relative shrink-0 w-full" data-node-id="40:308" data-name="Pie">
          <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[1.4] not-italic relative shrink-0 text-[#94a3b8] text-[12px] text-center w-[320px]" data-node-id="40:309">
            Al continuar aceptas los términos de Antilia.
          </p>
          <div className="content-stretch flex flex-col h-[24px] items-center justify-center overflow-clip relative shrink-0 w-full" data-node-id="40:310" data-name="Indicador de inicio">
            <div className="bg-[#0f172a] h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-node-id="40:311" data-name="Barra" />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#004cff] content-stretch flex flex-col h-[844px] items-start left-0 min-h-[844px] overflow-clip rounded-[32px] top-0 w-[393px]" data-node-id="3:12" data-name="antilia-ui-01-inicio">
        <div className="content-stretch flex h-[44px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="3:13" data-name="Status-Bar">
          <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[15px] text-white whitespace-nowrap" data-node-id="3:14">
            9:41
          </p>
          <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="3:15" data-name="Icons">
            <div className="relative shrink-0 size-[18px]" data-node-id="3:584" data-name="ios-signal">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosSignal} />
            </div>
            <div className="relative shrink-0 size-[18px]" data-node-id="3:587" data-name="ios-wifi-signal">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosWifiSignal1} />
            </div>
            <div className="h-[18px] relative shrink-0 w-[26px]" data-node-id="3:593" data-name="ios-battery-full">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosBatteryFull1} />
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[32px] h-[776px] items-center justify-center p-[24px] relative shrink-0 w-full" data-node-id="3:19" data-name="Content">
          <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0" data-node-id="3:20" data-name="Logo-Frame">
            <div className="bg-white content-stretch flex flex-col items-center justify-center relative rounded-[40px] shrink-0 size-[80px]" data-node-id="3:21" data-name="Icon-Container">
              <div className="relative shrink-0 size-[48px]" data-node-id="3:824" data-name="circle-x">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCircleX1} />
              </div>
            </div>
            <p className="[word-break:break-word] font-['Inter:Extra_Bold'] font-extrabold leading-[normal] not-italic relative shrink-0 text-[38px] text-white whitespace-nowrap" data-node-id="3:23">
              ANTILIA
            </p>
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#e6edff] text-[16px] text-center w-[280px]" data-node-id="3:24">
              Ordena tu espacio físico y digital para liberar tu mente
            </p>
          </div>
          <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-node-id="3:25" data-name="Indicator">
            <div className="bg-white relative rounded-[4px] shrink-0 size-[8px]" data-node-id="3:26" data-name="Rectangle" />
            <div className="bg-[rgba(255,255,255,0.4)] relative rounded-[4px] shrink-0 size-[8px]" data-node-id="3:27" data-name="Rectangle" />
            <div className="bg-[rgba(255,255,255,0.4)] relative rounded-[4px] shrink-0 size-[8px]" data-node-id="3:28" data-name="Rectangle" />
          </div>
        </div>
        <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-full" data-node-id="3:29" data-name="Footer-Accent">
          <div className="bg-white h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-node-id="3:30" data-name="Pill" />
        </div>
      </div>
      <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[844px] items-start justify-between left-0 min-h-[844px] overflow-clip rounded-[32px] top-0 w-[393px]" data-node-id="3:32" data-name="antilia-ui-02-acceso">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:33" data-name="Top">
          <div className="content-stretch flex h-[44px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="3:34" data-name="Status-Bar">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="3:35">
              9:41
            </p>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="3:36" data-name="Icons">
              <div className="relative shrink-0 size-[18px]" data-node-id="3:590" data-name="ios-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosSignal1} />
              </div>
              <div className="relative shrink-0 size-[18px]" data-node-id="3:596" data-name="ios-wifi-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosWifiSignal2} />
              </div>
              <div className="h-[18px] relative shrink-0 w-[26px]" data-node-id="3:599" data-name="ios-battery-full">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosBatteryFull2} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex items-center justify-between px-[24px] py-[16px] relative shrink-0 w-full" data-node-id="3:40" data-name="Screen-Header">
            <div className="content-stretch flex flex-[1_0_0] items-center min-w-px relative" data-node-id="3:41" data-name="Left">
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:42" data-name="Title-Group">
                <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[22px] w-full" data-node-id="3:43">
                  Empezar
                </p>
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[13px] w-full" data-node-id="3:44">
                  Únete a Antilia y mantén el orden
                </p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[20px] items-start p-[24px] relative shrink-0 w-full" data-node-id="3:45" data-name="Form">
            <div className="bg-[#e6edff] content-stretch flex gap-[12px] items-center p-[12px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:46" data-name="Sketch-Lighthouse">
              <div className="relative shrink-0 size-[32px]" data-node-id="3:827" data-name="circle-x">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCircleX2} />
              </div>
              <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Semi_Bold'] font-semibold leading-[normal] min-w-px not-italic relative text-[#004cff] text-[13px]" data-node-id="3:48">{`"El faro guía tu organización en el caos cotidiano."`}</p>
            </div>
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-node-id="3:49" data-name="Input-Group">
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[13px] whitespace-nowrap" data-node-id="3:50">
                Correo Electrónico
              </p>
              <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] h-[48px] items-center px-[16px] relative rounded-[12px] shrink-0 w-full" data-node-id="3:51" data-name="Input">
                <div className="relative shrink-0 size-[20px]" data-node-id="3:602" data-name="mail">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMail} />
                </div>
                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[#475569] text-[14px]" data-node-id="3:53">
                  ejemplo@antilia.com
                </p>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-node-id="3:54" data-name="Input-Group">
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[13px] whitespace-nowrap" data-node-id="3:55">
                Contraseña
              </p>
              <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] h-[48px] items-center px-[16px] relative rounded-[12px] shrink-0 w-full" data-node-id="3:56" data-name="Input">
                <div className="relative shrink-0 size-[20px]" data-node-id="3:605" data-name="lock">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLock} />
                </div>
                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[#475569] text-[14px]" data-node-id="3:58">
                  ••••••••
                </p>
              </div>
            </div>
            <div className="content-stretch flex items-start justify-end relative shrink-0 w-full" data-node-id="3:59" data-name="Forgot">
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[13px] whitespace-nowrap" data-node-id="3:60">
                ¿Olvidaste tu contraseña?
              </p>
            </div>
            <div className="bg-[#004cff] content-stretch flex h-[50px] items-center justify-center px-[24px] relative rounded-[14px] shrink-0 w-full" data-node-id="3:61" data-name="Button">
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[15px] text-center text-white whitespace-nowrap" data-node-id="3:62">
                Iniciar Sesión
              </p>
            </div>
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="3:63" data-name="Divider">
              <div className="flex-[1_0_0] h-0 min-w-px relative" data-node-id="3:64" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap" data-node-id="3:65">
                o continuar con
              </p>
              <div className="flex-[1_0_0] h-0 min-w-px relative" data-node-id="3:66" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine} />
                </div>
              </div>
            </div>
            <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-node-id="3:67" data-name="Social">
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] gap-[8px] h-[48px] items-center justify-center min-w-px relative rounded-[12px]" data-node-id="3:68" data-name="Google">
                <div className="relative shrink-0 size-[20px]" data-node-id="3:794" data-name="circle-x">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCircleX3} />
                </div>
                <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap" data-node-id="3:70">
                  Google
                </p>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] gap-[8px] h-[48px] items-center justify-center min-w-px relative rounded-[12px]" data-node-id="3:71" data-name="Apple">
                <div className="relative shrink-0 size-[20px]" data-node-id="3:608" data-name="apple">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgApple1} />
                </div>
                <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap" data-node-id="3:73">
                  Apple
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-center p-[24px] relative shrink-0 w-full" data-node-id="3:74" data-name="Bottom">
          <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[0] not-italic relative shrink-0 text-[#475569] text-[14px] whitespace-nowrap" data-node-id="3:75">
            <span className="leading-[normal]">{`¿No tienes cuenta? `}</span>
            <span className="font-['Inter:Bold'] font-bold leading-[normal] text-[#004cff]">Regístrate aquí</span>
          </p>
          <div className="bg-[#0f172a] h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-node-id="3:76" data-name="Indicator" />
        </div>
      </div>
      <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[844px] items-start justify-between left-0 min-h-[844px] overflow-clip rounded-[32px] top-0 w-[392px]" data-node-id="3:78" data-name="antilia-ui-03-principal">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:79" data-name="Top">
          <div className="content-stretch flex h-[44px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="3:80" data-name="Status-Bar">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="3:81">
              9:41
            </p>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="3:82" data-name="Icons">
              <div className="relative shrink-0 size-[18px]" data-node-id="3:611" data-name="ios-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosSignal1} />
              </div>
              <div className="relative shrink-0 size-[18px]" data-node-id="3:614" data-name="ios-wifi-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosWifiSignal2} />
              </div>
              <div className="h-[18px] relative shrink-0 w-[26px]" data-node-id="3:617" data-name="ios-battery-full">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosBatteryFull2} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex items-center justify-between px-[24px] py-[16px] relative shrink-0 w-full" data-node-id="3:86" data-name="Screen-Header">
            <div className="content-stretch flex flex-[1_0_0] items-center min-w-px relative" data-node-id="3:87" data-name="Left">
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:88" data-name="Title-Group">
                <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[22px] w-full" data-node-id="3:89">
                  Hola, Manuel
                </p>
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[13px] w-full" data-node-id="3:90">
                  Tu mente se ordena con tu entorno
                </p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[20px] items-start p-[24px] relative shrink-0 w-full" data-node-id="3:91" data-name="Content">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:92" data-name="Card">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="3:93" data-name="Card-Header">
                <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="3:94" data-name="Title-Block">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap" data-node-id="3:95">
                    Progreso del Día
                  </p>
                </div>
                <div className="bg-[#e6edff] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[8px] shrink-0" data-node-id="3:96" data-name="Badge">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[11px] whitespace-nowrap" data-node-id="3:97">
                    Nivel 4
                  </p>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="3:98" data-name="Progress-Bar-Container">
                <div className="[word-break:break-word] content-stretch flex items-start justify-between leading-[normal] not-italic relative shrink-0 text-[12px] w-full whitespace-nowrap" data-node-id="3:99" data-name="Labels">
                  <p className="font-['Inter:Semi_Bold'] font-semibold relative shrink-0 text-[#004cff]" data-node-id="3:100">
                    75% Completado
                  </p>
                  <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569]" data-node-id="3:101">
                    3 de 4 tareas
                  </p>
                </div>
                <div className="bg-[#e6edff] content-stretch flex h-[12px] items-start overflow-clip relative rounded-[6px] shrink-0 w-full" data-node-id="3:102" data-name="Bar">
                  <div className="bg-[#004cff] h-full relative shrink-0 w-[260px]" data-node-id="3:103" data-name="Fill" />
                </div>
              </div>
            </div>
            <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-node-id="3:104" data-name="Split-Cards">
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px p-[16px] relative rounded-[16px]" data-node-id="3:105" data-name="Phys-Card">
                <div className="relative shrink-0 size-[32px]" data-node-id="3:620" data-name="box">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBox} />
                </div>
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap" data-node-id="3:107">
                  Org. Física
                </p>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:108">
                  2 áreas por ordenar
                </p>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px p-[16px] relative rounded-[16px]" data-node-id="3:109" data-name="Dig-Card">
                <div className="relative shrink-0 size-[32px]" data-node-id="3:797" data-name="computer">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgComputer} />
                </div>
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap" data-node-id="3:111">
                  Org. Digital
                </p>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:112">
                  4 correos en bandeja
                </p>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:113" data-name="Card">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="3:114" data-name="Card-Header">
                <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="3:115" data-name="Title-Block">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap" data-node-id="3:116">
                    Tareas de Hoy
                  </p>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full" data-node-id="3:117" data-name="Tasks-List">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="3:118" data-name="Task">
                  <div className="bg-[#004cff] border-2 border-[#004cff] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[6px] shrink-0 size-[22px]" data-node-id="3:119" data-name="Checkbox">
                    <div className="relative shrink-0 size-[14px]" data-node-id="3:623" data-name="check">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheck} />
                    </div>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:121" data-name="Details">
                    <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-['Inter:Medium'] font-medium line-through min-w-full relative shrink-0 text-[#0f172a] text-[14px] w-[min-content]" data-node-id="3:122">
                      Despejar centro de escritorio
                    </p>
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:123">
                      Físico
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="3:124" data-name="Task">
                  <div className="bg-[#004cff] border-2 border-[#004cff] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[6px] shrink-0 size-[22px]" data-node-id="3:125" data-name="Checkbox">
                    <div className="relative shrink-0 size-[14px]" data-node-id="3:626" data-name="check">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheck} />
                    </div>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:127" data-name="Details">
                    <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-['Inter:Medium'] font-medium line-through min-w-full relative shrink-0 text-[#0f172a] text-[14px] w-[min-content]" data-node-id="3:128">
                      Vaciar carpeta Descargas
                    </p>
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:129">
                      Digital
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="3:130" data-name="Task">
                  <div className="bg-white border-2 border-[#475569] border-solid relative rounded-[6px] shrink-0 size-[22px]" data-node-id="3:131" data-name="Checkbox" />
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:132" data-name="Details">
                    <p className="font-['Inter:Medium'] font-medium min-w-full relative shrink-0 text-[#0f172a] text-[14px] w-[min-content]" data-node-id="3:133">
                      Clasificar correspondencia física
                    </p>
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:134">
                      Físico
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="3:135" data-name="Task">
                  <div className="bg-white border-2 border-[#475569] border-solid relative rounded-[6px] shrink-0 size-[22px]" data-node-id="3:136" data-name="Checkbox" />
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:137" data-name="Details">
                    <p className="font-['Inter:Medium'] font-medium min-w-full relative shrink-0 text-[#0f172a] text-[14px] w-[min-content]" data-node-id="3:138">
                      Responder correos urgentes
                    </p>
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:139">
                      Digital
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex items-center justify-between px-[16px] py-[12px] relative shrink-0 w-full" data-node-id="45:59" data-name="Nav-Links">
          <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="45:60" data-name="Tab-home">
            <div className="relative shrink-0 size-[24px]" data-node-id="45:61" data-name="home">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHome} />
            </div>
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[11px] whitespace-nowrap" data-node-id="45:63">
              Inicio
            </p>
          </div>
          <div className="content-stretch flex flex-col items-center relative shrink-0 w-[64px]" data-node-id="45:64" data-name="Tab-physical">
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="45:84" data-name="Tab-physical">
              <div className="relative shrink-0 size-[24px]" data-node-id="45:85" data-name="box">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBox1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="45:87">
                Físico
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="45:68" data-name="Tab-digital">
            <div className="relative shrink-0 size-[24px]" data-node-id="45:69" data-name="computer">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgComputer1} />
            </div>
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="45:71">
              Digital
            </p>
          </div>
          <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="45:72" data-name="Tab-progress">
            <div className="relative shrink-0 size-[24px]" data-node-id="45:73" data-name="bar-chart">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBarChart} />
            </div>
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="45:75">
              Progreso
            </p>
          </div>
          <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="45:76" data-name="Tab-profile">
            <div className="overflow-clip relative shrink-0 size-[24px]" data-node-id="45:77" data-name="user">
              <div className="absolute inset-[16.67%]" data-node-id="45:78" data-name="user">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUser} />
              </div>
            </div>
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="45:80">
              Perfil
            </p>
          </div>
        </div>
        <div className="bg-white border-[#e2e8f0] border-solid border-t content-stretch flex flex-col h-[24px] items-start relative shrink-0 w-[390px]" data-node-id="45:58" data-name="Bottom-Nav">
          <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-full" data-node-id="45:81" data-name="Home-Indicator">
            <div className="bg-[#0f172a] h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-node-id="45:82" data-name="Pill" />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[844px] items-start justify-between left-0 min-h-[844px] overflow-clip rounded-[32px] top-0 w-[393px]" data-node-id="3:157" data-name="antilia-ui-04-organizacion-fisica">
        <div className="content-stretch flex flex-col h-[755px] items-start relative shrink-0 w-full" data-node-id="3:158" data-name="Top">
          <div className="content-stretch flex h-[44px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="3:159" data-name="Status-Bar">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="3:160">
              9:41
            </p>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="3:161" data-name="Icons">
              <div className="relative shrink-0 size-[18px]" data-node-id="3:638" data-name="ios-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosSignal1} />
              </div>
              <div className="relative shrink-0 size-[18px]" data-node-id="3:641" data-name="ios-wifi-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosWifiSignal2} />
              </div>
              <div className="h-[18px] relative shrink-0 w-[26px]" data-node-id="3:644" data-name="ios-battery-full">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosBatteryFull2} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex items-center justify-between px-[24px] py-[16px] relative shrink-0 w-full" data-node-id="3:165" data-name="Screen-Header">
            <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-node-id="3:166" data-name="Left">
              <div className="bg-[#f8fafc] content-stretch flex flex-col items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="3:167" data-name="Back-Btn">
                <div className="relative shrink-0 size-[20px]" data-node-id="3:647" data-name="chevron-left">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronLeft} />
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:169" data-name="Title-Group">
                <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[22px] w-full" data-node-id="3:170">
                  Organización Física
                </p>
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[13px] w-full" data-node-id="3:171">
                  Controla tu entorno tridimensional
                </p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[20px] items-start p-[24px] relative shrink-0 w-full" data-node-id="3:172" data-name="Content">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] h-[44px] items-center px-[16px] relative rounded-[12px] shrink-0 w-full" data-node-id="3:173" data-name="Search">
              <div className="relative shrink-0 size-[18px]" data-node-id="3:650" data-name="search">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearch} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[14px] whitespace-nowrap" data-node-id="3:175">
                Buscar áreas físicas...
              </p>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:176" data-name="Card">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="3:177" data-name="Card-Header">
                <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="3:178" data-name="Title-Block">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap" data-node-id="3:179">
                    Espacio: Escritorio
                  </p>
                </div>
                <div className="bg-[#e6edff] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[8px] shrink-0" data-node-id="3:180" data-name="Badge">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[11px] whitespace-nowrap" data-node-id="3:181">
                    En progreso
                  </p>
                </div>
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[13px] w-full" data-node-id="3:182">
                Tu estación de trabajo principal necesita un respiro. Libera espacio para enfocarte.
              </p>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="3:183" data-name="Steps">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="3:184" data-name="Task">
                  <div className="bg-[#004cff] border-2 border-[#004cff] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[6px] shrink-0 size-[22px]" data-node-id="3:185" data-name="Checkbox">
                    <div className="relative shrink-0 size-[14px]" data-node-id="3:653" data-name="check">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheck} />
                    </div>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:187" data-name="Details">
                    <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-['Inter:Medium'] font-medium line-through min-w-full relative shrink-0 text-[#0f172a] text-[14px] w-[min-content]" data-node-id="3:188">
                      Retirar tazas y platos sucios
                    </p>
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:189">
                      Físico
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="3:190" data-name="Task">
                  <div className="bg-white border-2 border-[#475569] border-solid relative rounded-[6px] shrink-0 size-[22px]" data-node-id="3:191" data-name="Checkbox" />
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:192" data-name="Details">
                    <p className="font-['Inter:Medium'] font-medium min-w-full relative shrink-0 text-[#0f172a] text-[14px] w-[min-content]" data-node-id="3:193">
                      Clasificar lapiceros y libretas
                    </p>
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:194">
                      Físico
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:195" data-name="Card">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="3:196" data-name="Card-Header">
                <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="3:197" data-name="Title-Block">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap" data-node-id="3:198">
                    Espacio: Biblioteca/Estante
                  </p>
                </div>
                <div className="bg-[#e6edff] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[8px] shrink-0" data-node-id="3:199" data-name="Badge">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[11px] whitespace-nowrap" data-node-id="3:200">
                    Completado
                  </p>
                </div>
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#475569] text-[13px] w-[min-content]" data-node-id="3:201">
                Libros ordenados por categoría para facilitar tu lectura.
              </p>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="3:202" data-name="Completed-Stamp">
                <div className="relative shrink-0 size-[20px]" data-node-id="3:656" data-name="check">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheck1} />
                </div>
                <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[13px] whitespace-nowrap" data-node-id="3:204">
                  Todo en orden
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="45:156" data-name="Card">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="45:157" data-name="Card-Header">
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-node-id="45:158" data-name="Title-Block">
                <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[16px]" data-node-id="45:159">
                  Calendario Semanal
                </p>
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[12px]" data-node-id="45:160">
                  Rutina de limpieza digital
                </p>
              </div>
            </div>
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="45:161" data-name="Calendar-Row">
              <div className="content-stretch flex flex-col gap-[6px] items-center relative shrink-0" data-node-id="45:162" data-name="Day-L">
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap" data-node-id="45:163">
                  L
                </p>
                <div className="bg-[#004cff] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="45:164" data-name="Dot">
                  <div className="relative shrink-0 size-[16px]" data-node-id="45:165" data-name="check">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheck2} />
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[6px] items-center relative shrink-0" data-node-id="45:167" data-name="Day-M">
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap" data-node-id="45:168">
                  M
                </p>
                <div className="bg-[#004cff] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="45:169" data-name="Dot">
                  <div className="relative shrink-0 size-[16px]" data-node-id="45:170" data-name="check">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheck2} />
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[6px] items-center relative shrink-0" data-node-id="45:172" data-name="Day-M">
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap" data-node-id="45:173">
                  M
                </p>
                <div className="bg-[#004cff] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="45:174" data-name="Dot">
                  <div className="relative shrink-0 size-[16px]" data-node-id="45:175" data-name="check">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheck2} />
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[6px] items-center relative shrink-0" data-node-id="45:177" data-name="Day-J">
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap" data-node-id="45:178">
                  J
                </p>
                <div className="bg-[#e6edff] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="45:179" data-name="Dot">
                  <div className="bg-[#004cff] relative rounded-[3px] shrink-0 size-[6px]" data-node-id="45:180" data-name="Rectangle" />
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[6px] items-center relative shrink-0" data-node-id="45:181" data-name="Day-V">
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap" data-node-id="45:182">
                  V
                </p>
                <div className="bg-[#e6edff] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="45:183" data-name="Dot">
                  <div className="bg-[#004cff] relative rounded-[3px] shrink-0 size-[6px]" data-node-id="45:184" data-name="Rectangle" />
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[6px] items-center relative shrink-0" data-node-id="45:185" data-name="Day-S">
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap" data-node-id="45:186">
                  S
                </p>
                <div className="bg-[#e6edff] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="45:187" data-name="Dot">
                  <div className="bg-[#004cff] relative rounded-[3px] shrink-0 size-[6px]" data-node-id="45:188" data-name="Rectangle" />
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[6px] items-center relative shrink-0" data-node-id="45:189" data-name="Day-D">
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap" data-node-id="45:190">
                  D
                </p>
                <div className="bg-[#e6edff] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="45:191" data-name="Dot">
                  <div className="bg-[#004cff] relative rounded-[3px] shrink-0 size-[6px]" data-node-id="45:192" data-name="Rectangle" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-[#e2e8f0] border-solid border-t content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:205" data-name="Bottom-Nav">
          <div className="content-stretch flex items-center justify-between px-[16px] py-[12px] relative shrink-0 w-full" data-node-id="3:206" data-name="Nav-Links">
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:207" data-name="Tab-home">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:659" data-name="home">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHome1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:209">
                Inicio
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:210" data-name="Tab-physical">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:662" data-name="box">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBox2} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[11px] whitespace-nowrap" data-node-id="3:212">
                Físico
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:213" data-name="Tab-digital">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:803" data-name="computer">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgComputer2} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:215">
                Digital
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:216" data-name="Tab-progress">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:665" data-name="bar-chart">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBarChart1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:218">
                Progreso
              </p>
            </div>
          </div>
          <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-full" data-node-id="3:219" data-name="Home-Indicator">
            <div className="bg-[#0f172a] h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-node-id="3:220" data-name="Pill" />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[844px] items-start left-0 min-h-[844px] overflow-clip rounded-[32px] top-0 w-[393px]" data-node-id="3:222" data-name="antilia-ui-05-organizacion-digital">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:223" data-name="Top">
          <div className="content-stretch flex h-[44px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="3:224" data-name="Status-Bar">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="3:225">
              9:41
            </p>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="3:226" data-name="Icons">
              <div className="relative shrink-0 size-[18px]" data-node-id="3:668" data-name="ios-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosSignal1} />
              </div>
              <div className="relative shrink-0 size-[18px]" data-node-id="3:671" data-name="ios-wifi-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosWifiSignal2} />
              </div>
              <div className="h-[18px] relative shrink-0 w-[26px]" data-node-id="3:674" data-name="ios-battery-full">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosBatteryFull2} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex items-center justify-between px-[24px] py-[16px] relative shrink-0 w-full" data-node-id="3:230" data-name="Screen-Header">
            <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-node-id="3:231" data-name="Left">
              <div className="bg-[#f8fafc] content-stretch flex flex-col items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="3:232" data-name="Back-Btn">
                <div className="relative shrink-0 size-[20px]" data-node-id="3:677" data-name="chevron-left">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronLeft} />
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:234" data-name="Title-Group">
                <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[22px] w-full" data-node-id="3:235">
                  Organización Digital
                </p>
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[13px] w-full" data-node-id="3:236">
                  Limpia tu espacio virtual
                </p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[20px] items-start p-[24px] relative shrink-0 w-full" data-node-id="3:237" data-name="Content">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:238" data-name="Card">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="3:239" data-name="Card-Header">
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-node-id="3:240" data-name="Title-Block">
                  <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[16px]" data-node-id="3:241">
                    Calendario Semanal
                  </p>
                  <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[12px]" data-node-id="3:242">
                    Rutina de limpieza digital
                  </p>
                </div>
              </div>
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="3:243" data-name="Calendar-Row">
                <div className="content-stretch flex flex-col gap-[6px] items-center relative shrink-0" data-node-id="3:244" data-name="Day-L">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap" data-node-id="3:245">
                    L
                  </p>
                  <div className="bg-[#004cff] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="3:246" data-name="Dot">
                    <div className="relative shrink-0 size-[16px]" data-node-id="3:680" data-name="check">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheck2} />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[6px] items-center relative shrink-0" data-node-id="3:248" data-name="Day-M">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap" data-node-id="3:249">
                    M
                  </p>
                  <div className="bg-[#004cff] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="3:250" data-name="Dot">
                    <div className="relative shrink-0 size-[16px]" data-node-id="3:683" data-name="check">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheck2} />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[6px] items-center relative shrink-0" data-node-id="3:252" data-name="Day-M">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap" data-node-id="3:253">
                    M
                  </p>
                  <div className="bg-[#004cff] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="3:254" data-name="Dot">
                    <div className="relative shrink-0 size-[16px]" data-node-id="3:686" data-name="check">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheck2} />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[6px] items-center relative shrink-0" data-node-id="3:256" data-name="Day-J">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap" data-node-id="3:257">
                    J
                  </p>
                  <div className="bg-[#e6edff] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="3:258" data-name="Dot">
                    <div className="bg-[#004cff] relative rounded-[3px] shrink-0 size-[6px]" data-node-id="3:259" data-name="Rectangle" />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[6px] items-center relative shrink-0" data-node-id="3:260" data-name="Day-V">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap" data-node-id="3:261">
                    V
                  </p>
                  <div className="bg-[#e6edff] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="3:262" data-name="Dot">
                    <div className="bg-[#004cff] relative rounded-[3px] shrink-0 size-[6px]" data-node-id="3:263" data-name="Rectangle" />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[6px] items-center relative shrink-0" data-node-id="3:264" data-name="Day-S">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap" data-node-id="3:265">
                    S
                  </p>
                  <div className="bg-[#e6edff] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="3:266" data-name="Dot">
                    <div className="bg-[#004cff] relative rounded-[3px] shrink-0 size-[6px]" data-node-id="3:267" data-name="Rectangle" />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[6px] items-center relative shrink-0" data-node-id="3:268" data-name="Day-D">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap" data-node-id="3:269">
                    D
                  </p>
                  <div className="bg-[#e6edff] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="3:270" data-name="Dot">
                    <div className="bg-[#004cff] relative rounded-[3px] shrink-0 size-[6px]" data-node-id="3:271" data-name="Rectangle" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:272" data-name="Card">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="3:273" data-name="Card-Header">
                <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="3:274" data-name="Title-Block">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap" data-node-id="3:275">
                    Rutinas Digitales
                  </p>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="3:276" data-name="Routines">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="3:277" data-name="Task">
                  <div className="bg-[#004cff] border-2 border-[#004cff] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[6px] shrink-0 size-[22px]" data-node-id="3:278" data-name="Checkbox">
                    <div className="relative shrink-0 size-[14px]" data-node-id="3:689" data-name="check">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheck} />
                    </div>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:280" data-name="Details">
                    <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-['Inter:Medium'] font-medium line-through min-w-full relative shrink-0 text-[#0f172a] text-[14px] w-[min-content]" data-node-id="3:281">
                      Organizar Escritorio de PC (Sombra de iconos)
                    </p>
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:282">
                      Digital
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="3:283" data-name="Task">
                  <div className="bg-[#004cff] border-2 border-[#004cff] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[6px] shrink-0 size-[22px]" data-node-id="3:284" data-name="Checkbox">
                    <div className="relative shrink-0 size-[14px]" data-node-id="3:692" data-name="check">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheck} />
                    </div>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:286" data-name="Details">
                    <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-['Inter:Medium'] font-medium line-through min-w-full relative shrink-0 text-[#0f172a] text-[14px] w-[min-content]" data-node-id="3:287">
                      Vaciar Papelera de Reciclaje
                    </p>
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:288">
                      Digital
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="3:289" data-name="Task">
                  <div className="bg-white border-2 border-[#475569] border-solid relative rounded-[6px] shrink-0 size-[22px]" data-node-id="3:290" data-name="Checkbox" />
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:291" data-name="Details">
                    <p className="font-['Inter:Medium'] font-medium min-w-full relative shrink-0 text-[#0f172a] text-[14px] w-[min-content]" data-node-id="3:292">
                      Clasificar capturas de pantalla
                    </p>
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:293">
                      Digital
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] h-[235px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="45:123" data-name="Card">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="45:124" data-name="Card-Header">
            <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="45:125" data-name="Title-Block">
              <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#295edb] text-[16px] whitespace-nowrap" data-node-id="45:126">
                Limpieza
              </p>
            </div>
          </div>
          <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[13px] w-full" data-node-id="45:129">
            Elimina archivos y correos no deseados
          </p>
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="45:130" data-name="Steps">
            <div className="content-stretch flex items-center relative rounded-[1px] shrink-0 w-full" data-node-id="45:131" data-name="Task">
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-node-id="45:135" data-name="Details">
                <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[normal] not-italic relative shrink-0 text-[#325bba] text-[20px] w-full" data-node-id="45:136">
                  Limpieza de archivos
                </p>
              </div>
            </div>
          </div>
          <div className="h-[24px] relative shrink-0 w-full" data-node-id="45:138" data-name="Task" />
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="45:140" data-name="Details">
            <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[20px] w-full" data-node-id="45:141">
              Limpieza de correos
            </p>
          </div>
        </div>
        <div className="bg-white border-[#e2e8f0] border-solid border-t content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:294" data-name="Bottom-Nav">
          <div className="content-stretch flex items-center justify-between px-[16px] py-[12px] relative shrink-0 w-full" data-node-id="3:295" data-name="Nav-Links">
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:296" data-name="Tab-home">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:695" data-name="home">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHome1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:298">
                Inicio
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:299" data-name="Tab-physical">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:698" data-name="box">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBox1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:301">
                Físico
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:302" data-name="Tab-digital">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:806" data-name="computer">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgComputer3} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[11px] whitespace-nowrap" data-node-id="3:304">
                Digital
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:305" data-name="Tab-progress">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:701" data-name="bar-chart">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBarChart1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:307">
                Progreso
              </p>
            </div>
          </div>
          <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-full" data-node-id="3:308" data-name="Home-Indicator">
            <div className="bg-[#0f172a] h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-node-id="3:309" data-name="Pill" />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[844px] items-start left-0 min-h-[844px] overflow-clip rounded-[32px] top-0 w-[393px]" data-node-id="3:311" data-name="antilia-ui-06-racha">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:312" data-name="Top">
          <div className="content-stretch flex h-[44px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="3:313" data-name="Status-Bar">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="3:314">
              9:41
            </p>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="3:315" data-name="Icons">
              <div className="relative shrink-0 size-[18px]" data-node-id="3:704" data-name="ios-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosSignal1} />
              </div>
              <div className="relative shrink-0 size-[18px]" data-node-id="3:707" data-name="ios-wifi-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosWifiSignal2} />
              </div>
              <div className="h-[18px] relative shrink-0 w-[26px]" data-node-id="3:710" data-name="ios-battery-full">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosBatteryFull2} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex items-center justify-between px-[24px] py-[16px] relative shrink-0 w-full" data-node-id="3:319" data-name="Screen-Header">
            <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-node-id="3:320" data-name="Left">
              <div className="bg-[#f8fafc] content-stretch flex flex-col items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="3:321" data-name="Back-Btn">
                <div className="relative shrink-0 size-[20px]" data-node-id="3:713" data-name="chevron-left">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronLeft} />
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:323" data-name="Title-Group">
                <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[22px] w-full" data-node-id="3:324">
                  Mi Racha
                </p>
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[13px] w-full" data-node-id="3:325">
                  Tu constancia rinde frutos
                </p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[20px] items-start p-[24px] relative shrink-0 w-full" data-node-id="3:326" data-name="Content">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:327" data-name="Card">
              <div className="content-stretch flex flex-col gap-[12px] items-center py-[16px] relative shrink-0 w-full" data-node-id="3:328" data-name="Streak-Hero">
                <div className="h-[120px] relative shrink-0 w-[96px]" data-node-id="3:329" data-name="Tilia-Day7">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img alt="" className="absolute h-[140.25%] left-[-13.76%] max-w-none top-0 w-[127.39%]" src={imgTiliaDay7} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Inter:Extra_Bold'] font-extrabold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[56px] whitespace-nowrap" data-node-id="3:331">
                  7 Días
                </p>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#475569] text-[14px] text-center w-[min-content]" data-node-id="3:332">
                  ¡Racha más alta! Sigue manteniendo tu entorno despejado.
                </p>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:333" data-name="Card">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="3:334" data-name="Card-Header">
                <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="3:335" data-name="Title-Block">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap" data-node-id="3:336">
                    Estadísticas de Esfuerzo
                  </p>
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex gap-[12px] items-start leading-[normal] not-italic relative shrink-0 w-full whitespace-nowrap" data-node-id="3:337" data-name="Stats-Row">
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-center min-w-px relative" data-node-id="3:338" data-name="Stat">
                  <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#004cff] text-[20px]" data-node-id="3:339">
                    14
                  </p>
                  <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px]" data-node-id="3:340">
                    Tareas Físicas
                  </p>
                </div>
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-center min-w-px relative" data-node-id="3:341" data-name="Stat">
                  <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#004cff] text-[20px]" data-node-id="3:342">
                    22
                  </p>
                  <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px]" data-node-id="3:343">
                    Tareas Digitales
                  </p>
                </div>
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-center min-w-px relative" data-node-id="3:344" data-name="Stat">
                  <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#004cff] text-[20px]" data-node-id="3:345">
                    95%
                  </p>
                  <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px]" data-node-id="3:346">
                    Consistencia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-[#e2e8f0] border-solid border-t content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:347" data-name="Bottom-Nav">
          <div className="content-stretch flex items-center justify-between px-[16px] py-[12px] relative shrink-0 w-full" data-node-id="3:348" data-name="Nav-Links">
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:349" data-name="Tab-home">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:716" data-name="home">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHome1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:351">
                Inicio
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:352" data-name="Tab-physical">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:719" data-name="box">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBox1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:354">
                Físico
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:355" data-name="Tab-digital">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:809" data-name="computer">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgComputer2} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:357">
                Digital
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:358" data-name="Tab-progress">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:722" data-name="bar-chart">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBarChart2} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[11px] whitespace-nowrap" data-node-id="3:360">
                Progreso
              </p>
            </div>
          </div>
          <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-full" data-node-id="3:361" data-name="Home-Indicator">
            <div className="bg-[#0f172a] h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-node-id="3:362" data-name="Pill" />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[844px] items-start left-0 min-h-[844px] overflow-clip rounded-[32px] top-0 w-[393px]" data-node-id="3:364" data-name="antilia-ui-07-correos">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:365" data-name="Top">
          <div className="content-stretch flex h-[44px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="3:366" data-name="Status-Bar">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="3:367">
              9:41
            </p>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="3:368" data-name="Icons">
              <div className="relative shrink-0 size-[18px]" data-node-id="3:725" data-name="ios-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosSignal1} />
              </div>
              <div className="relative shrink-0 size-[18px]" data-node-id="3:728" data-name="ios-wifi-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosWifiSignal2} />
              </div>
              <div className="h-[18px] relative shrink-0 w-[26px]" data-node-id="3:731" data-name="ios-battery-full">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosBatteryFull2} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex items-center justify-between px-[24px] py-[16px] relative shrink-0 w-full" data-node-id="3:372" data-name="Screen-Header">
            <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-node-id="3:373" data-name="Left">
              <div className="bg-[#f8fafc] content-stretch flex flex-col items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="3:374" data-name="Back-Btn">
                <div className="relative shrink-0 size-[20px]" data-node-id="3:734" data-name="chevron-left">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronLeft} />
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:376" data-name="Title-Group">
                <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[22px] w-full" data-node-id="3:377">
                  Limpieza de Correos
                </p>
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[13px] w-full" data-node-id="3:378">
                  Zen en tu bandeja de entrada
                </p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start p-[24px] relative shrink-0 w-full" data-node-id="3:379" data-name="Content">
            <div className="bg-[#e6edff] content-stretch flex gap-[12px] items-center p-[12px] relative rounded-[12px] shrink-0 w-full" data-node-id="3:380" data-name="Stats-Mini">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:737" data-name="mail">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMail1} />
              </div>
              <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Semi_Bold'] font-semibold leading-[normal] min-w-px not-italic relative text-[#004cff] text-[13px]" data-node-id="3:382">
                Meta de hoy: Menos de 5 correos sin clasificar.
              </p>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[10px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:383" data-name="Email-0">
              <div className="[word-break:break-word] content-stretch flex items-start justify-between leading-[normal] not-italic relative shrink-0 w-full whitespace-nowrap" data-node-id="3:384" data-name="Row-Header">
                <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[14px]" data-node-id="3:385">
                  Soporte Técnico
                </p>
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px]" data-node-id="3:386">
                  10:24 AM
                </p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 w-full whitespace-nowrap" data-node-id="3:387" data-name="Details">
                <p className="font-['Inter:Semi_Bold'] font-semibold relative shrink-0 text-[#0f172a] text-[13px]" data-node-id="3:388">
                  Actualización de cuenta de servicio
                </p>
                <p className="font-['Inter:Regular'] font-normal min-w-full overflow-hidden relative shrink-0 text-[#475569] text-[12px] text-ellipsis w-[min-content]" data-node-id="3:389">
                  Tu suscripción se renovará automáticamente el próximo...
                </p>
              </div>
              <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-node-id="3:390" data-name="Actions">
                <div className="bg-[#f8fafc] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[8px] shrink-0" data-node-id="3:391" data-name="Action-Btn">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap" data-node-id="3:392">
                    Archivar
                  </p>
                </div>
                <div className="bg-[rgba(0,76,255,0.08)] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[8px] shrink-0" data-node-id="3:393" data-name="Action-Btn-Delete">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[12px] whitespace-nowrap" data-node-id="3:394">
                    Eliminar
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[10px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:395" data-name="Email-1">
              <div className="[word-break:break-word] content-stretch flex items-start justify-between leading-[normal] not-italic relative shrink-0 w-full whitespace-nowrap" data-node-id="3:396" data-name="Row-Header">
                <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[14px]" data-node-id="3:397">
                  Inmobiliaria Norte
                </p>
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px]" data-node-id="3:398">
                  10:24 AM
                </p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 w-full whitespace-nowrap" data-node-id="3:399" data-name="Details">
                <p className="font-['Inter:Semi_Bold'] font-semibold relative shrink-0 text-[#0f172a] text-[13px]" data-node-id="3:400">
                  Contrato de arrendamiento digital
                </p>
                <p className="font-['Inter:Regular'] font-normal min-w-full overflow-hidden relative shrink-0 text-[#475569] text-[12px] text-ellipsis w-[min-content]" data-node-id="3:401">
                  Favor de revisar los campos firmados por la contraparte...
                </p>
              </div>
              <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-node-id="3:402" data-name="Actions">
                <div className="bg-[#f8fafc] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[8px] shrink-0" data-node-id="3:403" data-name="Action-Btn">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap" data-node-id="3:404">
                    Archivar
                  </p>
                </div>
                <div className="bg-[rgba(0,76,255,0.08)] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[8px] shrink-0" data-node-id="3:405" data-name="Action-Btn-Delete">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[12px] whitespace-nowrap" data-node-id="3:406">
                    Eliminar
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[10px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:407" data-name="Email-2">
              <div className="[word-break:break-word] content-stretch flex items-start justify-between leading-[normal] not-italic relative shrink-0 w-full whitespace-nowrap" data-node-id="3:408" data-name="Row-Header">
                <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[14px]" data-node-id="3:409">
                  Newsletter Tech
                </p>
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px]" data-node-id="3:410">
                  10:24 AM
                </p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 w-full whitespace-nowrap" data-node-id="3:411" data-name="Details">
                <p className="font-['Inter:Semi_Bold'] font-semibold relative shrink-0 text-[#0f172a] text-[13px]" data-node-id="3:412">
                  El futuro de las interfaces minimalistas
                </p>
                <p className="font-['Inter:Regular'] font-normal min-w-full overflow-hidden relative shrink-0 text-[#475569] text-[12px] text-ellipsis w-[min-content]" data-node-id="3:413">
                  Hoy exploramos por qué la reducción de elementos físicos...
                </p>
              </div>
              <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-node-id="3:414" data-name="Actions">
                <div className="bg-[#f8fafc] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[8px] shrink-0" data-node-id="3:415" data-name="Action-Btn">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap" data-node-id="3:416">
                    Archivar
                  </p>
                </div>
                <div className="bg-[rgba(0,76,255,0.08)] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[8px] shrink-0" data-node-id="3:417" data-name="Action-Btn-Delete">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[12px] whitespace-nowrap" data-node-id="3:418">
                    Eliminar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-[#e2e8f0] border-solid border-t content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:419" data-name="Bottom-Nav">
          <div className="content-stretch flex items-center justify-between px-[16px] py-[12px] relative shrink-0 w-full" data-node-id="3:420" data-name="Nav-Links">
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:421" data-name="Tab-home">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:740" data-name="home">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHome1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:423">
                Inicio
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:424" data-name="Tab-physical">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:743" data-name="box">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBox1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:426">
                Físico
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:427" data-name="Tab-digital">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:812" data-name="computer">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgComputer3} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[11px] whitespace-nowrap" data-node-id="3:429">
                Digital
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:430" data-name="Tab-progress">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:746" data-name="bar-chart">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBarChart1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:432">
                Progreso
              </p>
            </div>
          </div>
          <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-full" data-node-id="3:433" data-name="Home-Indicator">
            <div className="bg-[#0f172a] h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-node-id="3:434" data-name="Pill" />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[844px] items-start justify-between left-0 min-h-[844px] overflow-clip rounded-[32px] top-0 w-[392px]" data-node-id="3:436" data-name="antilia-ui-08-ranking">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:437" data-name="Top">
          <div className="content-stretch flex h-[44px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="3:438" data-name="Status-Bar">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="3:439">
              9:41
            </p>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="3:440" data-name="Icons">
              <div className="relative shrink-0 size-[18px]" data-node-id="3:749" data-name="ios-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosSignal1} />
              </div>
              <div className="relative shrink-0 size-[18px]" data-node-id="3:752" data-name="ios-wifi-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosWifiSignal2} />
              </div>
              <div className="h-[18px] relative shrink-0 w-[26px]" data-node-id="3:755" data-name="ios-battery-full">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosBatteryFull2} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex items-center justify-between px-[24px] py-[16px] relative shrink-0 w-full" data-node-id="3:444" data-name="Screen-Header">
            <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-node-id="3:445" data-name="Left">
              <div className="bg-[#f8fafc] content-stretch flex flex-col items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="3:446" data-name="Back-Btn">
                <div className="relative shrink-0 size-[20px]" data-node-id="3:758" data-name="chevron-left">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronLeft} />
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:448" data-name="Title-Group">
                <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[22px] w-full" data-node-id="3:449">
                  Métricas y Logros
                </p>
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[13px] w-full" data-node-id="3:450">
                  Tu constancia de un vistazo
                </p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[20px] items-start p-[24px] relative shrink-0 w-full" data-node-id="3:451" data-name="Content">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:452" data-name="Card">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="3:453" data-name="Card-Header">
                <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="3:454" data-name="Title-Block">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap" data-node-id="3:455">
                    Eficiencia de Limpieza
                  </p>
                </div>
              </div>
              <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-node-id="3:456" data-name="Chart-Container">
                <div className="content-stretch flex h-[120px] items-end justify-between relative shrink-0 w-full" data-node-id="3:457" data-name="Bars">
                  <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[24px]" data-node-id="3:458" data-name="Bar-Col">
                    <div className="bg-[#e6edff] h-[40px] relative rounded-[4px] shrink-0 w-[16px]" data-node-id="3:459" data-name="Bar" />
                    <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:460">
                      L
                    </p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[24px]" data-node-id="3:461" data-name="Bar-Col">
                    <div className="bg-[#e6edff] h-[70px] relative rounded-[4px] shrink-0 w-[16px]" data-node-id="3:462" data-name="Bar" />
                    <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:463">
                      M
                    </p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[24px]" data-node-id="3:464" data-name="Bar-Col">
                    <div className="bg-[#e6edff] h-[95px] relative rounded-[4px] shrink-0 w-[16px]" data-node-id="3:465" data-name="Bar" />
                    <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:466">
                      M
                    </p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[24px]" data-node-id="3:467" data-name="Bar-Col">
                    <div className="bg-[#e6edff] h-[55px] relative rounded-[4px] shrink-0 w-[16px]" data-node-id="3:468" data-name="Bar" />
                    <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:469">
                      J
                    </p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[24px]" data-node-id="3:470" data-name="Bar-Col">
                    <div className="bg-[#e6edff] h-[85px] relative rounded-[4px] shrink-0 w-[16px]" data-node-id="3:471" data-name="Bar" />
                    <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:472">
                      V
                    </p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[24px]" data-node-id="3:473" data-name="Bar-Col">
                    <div className="bg-[#004cff] h-[100px] relative rounded-[4px] shrink-0 w-[16px]" data-node-id="3:474" data-name="Bar" />
                    <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:475">
                      S
                    </p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[24px]" data-node-id="3:476" data-name="Bar-Col">
                    <div className="bg-[#e6edff] h-[30px] relative rounded-[4px] shrink-0 w-[16px]" data-node-id="3:477" data-name="Bar" />
                    <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:478">
                      D
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:479" data-name="Card">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="3:480" data-name="Card-Header">
                <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="3:481" data-name="Title-Block">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap" data-node-id="3:482">
                    Comunidad Antilia
                  </p>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="3:483" data-name="Ranking-List">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="3:484" data-name="User-Row">
                  <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-node-id="3:485" data-name="Left">
                    <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[14px] whitespace-nowrap" data-node-id="3:486">
                      #1
                    </p>
                    <div className="bg-[#e6edff] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="3:487" data-name="Avatar">
                      <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[12px] whitespace-nowrap" data-node-id="3:488">
                        ML
                      </p>
                    </div>
                    <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap" data-node-id="3:489">
                      Manuel L. (Tú)
                    </p>
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[14px] whitespace-nowrap" data-node-id="3:490">
                    1,420 XP
                  </p>
                </div>
                <div className="h-0 relative shrink-0 w-full" data-node-id="3:491" data-name="Divider">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img alt="" className="block max-w-none size-full" src={imgDivider} />
                  </div>
                </div>
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="3:492" data-name="User-Row-2">
                  <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-node-id="3:493" data-name="Left">
                    <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[14px] whitespace-nowrap" data-node-id="3:494">
                      #2
                    </p>
                    <div className="bg-[#e2e8f0] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-node-id="3:495" data-name="Avatar">
                      <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap" data-node-id="3:496">
                        SA
                      </p>
                    </div>
                    <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap" data-node-id="3:497">
                      Sofía A.
                    </p>
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[14px] whitespace-nowrap" data-node-id="3:498">
                    1,280 XP
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-[#e2e8f0] border-solid border-t content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:499" data-name="Bottom-Nav">
          <div className="content-stretch flex items-center justify-between px-[16px] py-[12px] relative shrink-0 w-full" data-node-id="3:500" data-name="Nav-Links">
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:501" data-name="Tab-home">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:761" data-name="home">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHome1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:503">
                Inicio
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:504" data-name="Tab-physical">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:764" data-name="box">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBox1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:506">
                Físico
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:507" data-name="Tab-digital">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:815" data-name="computer">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgComputer2} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:509">
                Digital
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:510" data-name="Tab-progress">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:767" data-name="bar-chart">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBarChart2} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[11px] whitespace-nowrap" data-node-id="3:512">
                Progreso
              </p>
            </div>
          </div>
          <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-full" data-node-id="3:513" data-name="Home-Indicator">
            <div className="bg-[#0f172a] h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-node-id="3:514" data-name="Pill" />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[844px] items-start left-0 min-h-[844px] overflow-clip rounded-[32px] top-0 w-[393px]" data-node-id="3:516" data-name="antilia-ui-09-orden-escritorio">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:517" data-name="Top">
          <div className="content-stretch flex h-[44px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="3:518" data-name="Status-Bar">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="3:519">
              9:41
            </p>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="3:520" data-name="Icons">
              <div className="relative shrink-0 size-[18px]" data-node-id="3:770" data-name="ios-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosSignal1} />
              </div>
              <div className="relative shrink-0 size-[18px]" data-node-id="3:773" data-name="ios-wifi-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosWifiSignal2} />
              </div>
              <div className="h-[18px] relative shrink-0 w-[26px]" data-node-id="3:776" data-name="ios-battery-full">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosBatteryFull2} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex items-center justify-between px-[24px] py-[16px] relative shrink-0 w-full" data-node-id="3:524" data-name="Screen-Header">
            <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-node-id="3:525" data-name="Left">
              <div className="bg-[#f8fafc] content-stretch flex flex-col items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="3:526" data-name="Back-Btn">
                <div className="relative shrink-0 size-[20px]" data-node-id="3:779" data-name="chevron-left">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronLeft} />
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:528" data-name="Title-Group">
                <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[22px] w-full" data-node-id="3:529">
                  Orden del Escritorio
                </p>
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[13px] w-full" data-node-id="3:530">
                  Tu espacio de trabajo ideal
                </p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[20px] items-start p-[24px] relative shrink-0 w-full" data-node-id="3:531" data-name="Content">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-center p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:532" data-name="Desk-Map">
              <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap" data-node-id="3:533">
                Esquema de Distribución
              </p>
              <div className="bg-[#f8fafc] content-stretch flex flex-col gap-[12px] h-[140px] items-start p-[12px] relative rounded-[12px] shrink-0 w-full" data-node-id="3:534" data-name="Visual-Grid">
                <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="3:535" data-name="Frame">
                  <div className="bg-[#e6edff] border border-[#004cff] border-solid content-stretch flex h-[32px] items-center justify-center relative rounded-[6px] shrink-0 w-[60px]" data-node-id="3:536" data-name="Left-Corner">
                    <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[10px] whitespace-nowrap" data-node-id="3:537">
                      Luz / Faro
                    </p>
                  </div>
                  <div className="bg-white border-[#475569] border-[1.5px] border-solid content-stretch flex h-[32px] items-center justify-center relative rounded-[6px] shrink-0 w-[120px]" data-node-id="3:538" data-name="Monitor">
                    <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[10px] whitespace-nowrap" data-node-id="3:539">
                      Monitor Principal
                    </p>
                  </div>
                  <div className="bg-[#e2e8f0] content-stretch flex h-[32px] items-center justify-center relative rounded-[6px] shrink-0 w-[60px]" data-node-id="3:540" data-name="Right-Corner">
                    <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[10px] whitespace-nowrap" data-node-id="3:541">
                      Plantas
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] items-start min-h-px relative w-full" data-node-id="3:542" data-name="Frame">
                  <div className="bg-white border border-[#004cff] border-dashed content-stretch flex flex-[1_0_0] h-full items-center justify-center min-w-px relative rounded-[8px]" data-node-id="3:543" data-name="Keyboard-Area">
                    <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[12px] whitespace-nowrap" data-node-id="3:544">
                      Zona Libre: Mantener Despejada
                    </p>
                  </div>
                </div>
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#475569] text-[12px] text-center w-[min-content]" data-node-id="3:545">
                Recomendación: El 70% central de tu escritorio debe estar completamente libre de objetos no esenciales.
              </p>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:546" data-name="Card">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="3:547" data-name="Card-Header">
                <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="3:548" data-name="Title-Block">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap" data-node-id="3:549">
                    Pasos de Limpieza Física
                  </p>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="3:550" data-name="Steps">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="3:551" data-name="Task">
                  <div className="bg-[#004cff] border-2 border-[#004cff] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[6px] shrink-0 size-[22px]" data-node-id="3:552" data-name="Checkbox">
                    <div className="relative shrink-0 size-[14px]" data-node-id="3:782" data-name="check">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheck} />
                    </div>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:554" data-name="Details">
                    <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-['Inter:Medium'] font-medium line-through min-w-full relative shrink-0 text-[#0f172a] text-[14px] w-[min-content]" data-node-id="3:555">
                      Limpiar superficie de polvo
                    </p>
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:556">
                      Físico
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="3:557" data-name="Task">
                  <div className="bg-white border-2 border-[#475569] border-solid relative rounded-[6px] shrink-0 size-[22px]" data-node-id="3:558" data-name="Checkbox" />
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:559" data-name="Details">
                    <p className="font-['Inter:Medium'] font-medium min-w-full relative shrink-0 text-[#0f172a] text-[14px] w-[min-content]" data-node-id="3:560">
                      Colocar la lámpara a la izquierda
                    </p>
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:561">
                      Físico
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="3:562" data-name="Task">
                  <div className="bg-white border-2 border-[#475569] border-solid relative rounded-[6px] shrink-0 size-[22px]" data-node-id="3:563" data-name="Checkbox" />
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:564" data-name="Details">
                    <p className="font-['Inter:Medium'] font-medium min-w-full relative shrink-0 text-[#0f172a] text-[14px] w-[min-content]" data-node-id="3:565">
                      Ocultar cables detrás de la mesa
                    </p>
                    <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:566">
                      Físico
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-[#e2e8f0] border-solid border-t content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:567" data-name="Bottom-Nav">
          <div className="content-stretch flex items-center justify-between px-[16px] py-[12px] relative shrink-0 w-full" data-node-id="3:568" data-name="Nav-Links">
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:569" data-name="Tab-home">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:785" data-name="home">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHome1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:571">
                Inicio
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:572" data-name="Tab-physical">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:788" data-name="box">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBox2} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[11px] whitespace-nowrap" data-node-id="3:574">
                Físico
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:575" data-name="Tab-digital">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:818" data-name="computer">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgComputer2} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:577">
                Digital
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[72px]" data-node-id="3:578" data-name="Tab-progress">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:791" data-name="bar-chart">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBarChart1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:580">
                Progreso
              </p>
            </div>
          </div>
          <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-full" data-node-id="3:581" data-name="Home-Indicator">
            <div className="bg-[#0f172a] h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-node-id="3:582" data-name="Pill" />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[844px] items-start left-0 min-h-[844px] overflow-clip rounded-[32px] top-0 w-[415px]" data-node-id="3:838" data-name="antilia-ui-10-cuenta">
        <div className="content-stretch flex flex-col h-[755px] items-start relative shrink-0 w-[412px]" data-node-id="3:839" data-name="Top">
          <div className="content-stretch flex h-[44px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="3:840" data-name="Status-Bar">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="3:841">
              9:41
            </p>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="3:842" data-name="Icons">
              <div className="relative shrink-0 size-[18px]" data-node-id="3:843" data-name="ios-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosSignal2} />
              </div>
              <div className="relative shrink-0 size-[18px]" data-node-id="3:845" data-name="ios-wifi-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosWifiSignal3} />
              </div>
              <div className="h-[18px] relative shrink-0 w-[26px]" data-node-id="3:847" data-name="ios-battery-full">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosBatteryFull3} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex items-center px-[24px] py-[16px] relative shrink-0 w-full" data-node-id="3:849" data-name="Screen-Header">
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:850" data-name="Title-Group">
              <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[22px] w-full" data-node-id="3:851">
                Mi Cuenta
              </p>
              <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[13px] w-full" data-node-id="3:852">
                Manuel L. • Administrador
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[20px] items-start p-[24px] relative shrink-0 w-full" data-node-id="3:853" data-name="Content">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center p-[20px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:854" data-name="Avatar-Card">
              <div className="bg-[#e6edff] content-stretch flex items-center justify-center relative rounded-[32px] shrink-0 size-[64px]" data-node-id="3:855" data-name="Avatar-Large">
                <p className="[word-break:break-word] font-['Inter:Extra_Bold'] font-extrabold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[22px] whitespace-nowrap" data-node-id="3:856">
                  ML
                </p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="3:857" data-name="User-Meta">
                <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[18px]" data-node-id="3:858">
                  Manuel L.
                </p>
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[13px]" data-node-id="3:859">
                  Miembro desde Septiembre 2026
                </p>
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex gap-[12px] items-start leading-[normal] not-italic relative shrink-0 w-full whitespace-nowrap" data-node-id="3:860" data-name="Quick-Stats">
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[16px] relative rounded-[16px]" data-node-id="3:861" data-name="Stat">
                <p className="font-['Inter:Extra_Bold'] font-extrabold relative shrink-0 text-[#004cff] text-[20px]" data-node-id="3:862">
                  36
                </p>
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[12px]" data-node-id="3:863">
                  Tareas hechas
                </p>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[16px] relative rounded-[16px]" data-node-id="3:864" data-name="Stat">
                <p className="font-['Inter:Extra_Bold'] font-extrabold relative shrink-0 text-[#004cff] text-[20px]" data-node-id="3:865">
                  95%
                </p>
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[12px]" data-node-id="3:866">
                  Constancia
                </p>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:867" data-name="Card">
              <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap" data-node-id="3:868">
                Configuración
              </p>
              <div className="content-stretch flex h-[19px] items-center justify-between relative shrink-0 w-[315px]" data-node-id="3:869" data-name="Option-Row">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-node-id="3:870" data-name="Left">
                  <div className="relative shrink-0 size-[20px]" data-node-id="3:871" data-name="icon-user">
                    <div className="absolute left-0 size-[31px] top-[-3px]" data-node-id="3:1413" data-name="user-cog">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUserCog} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap" data-node-id="3:873">
                    Modificar Perfil
                  </p>
                </div>
                <div className="h-[19px] relative shrink-0 w-[12px]" data-node-id="3:1372" data-name="Vector">
                  <div className="absolute inset-[-5.26%_-13.43%_-5.26%_-8.33%]">
                    <img alt="" className="block max-w-none size-full" src={imgVector} />
                  </div>
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-node-id="3:876" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine1} />
                </div>
              </div>
              <div className="content-stretch flex h-[18px] items-center justify-between relative shrink-0 w-[315px]" data-node-id="3:877" data-name="Option-Row">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-node-id="3:878" data-name="Left">
                  <div className="relative shrink-0 size-[20px]" data-node-id="3:879" data-name="icon-bell">
                    <div className="absolute left-[-5px] size-[30px] top-[-5px]" data-node-id="20:38" data-name="Bell">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBell} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap" data-node-id="3:881">
                    Recordatorios y Alertas
                  </p>
                </div>
                <div className="h-[19px] relative shrink-0 w-[12px]" data-node-id="3:1375" data-name="Vector">
                  <div className="absolute inset-[-5.26%_-13.43%_-5.26%_-8.33%]">
                    <img alt="" className="block max-w-none size-full" src={imgVector} />
                  </div>
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-node-id="3:884" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine1} />
                </div>
              </div>
              <div className="content-stretch flex h-[22px] items-center justify-between relative shrink-0 w-[265px]" data-node-id="3:885" data-name="Option-Row">
                <div className="content-stretch flex gap-[12px] h-[24px] items-center relative shrink-0 w-[323px]" data-node-id="3:886" data-name="Left">
                  <div className="relative shrink-0 size-[20px]" data-node-id="3:887" data-name="icon-shield">
                    <div className="absolute left-0 size-[31px] top-[-3px]" data-node-id="3:1407" data-name="shield-check">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShieldCheck1} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold h-[20px] leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[14px] w-[259px]" data-node-id="3:889">
                    Privacidad y Datos
                  </p>
                  <div className="h-[19px] relative shrink-0 w-[12px]" data-node-id="35:60" data-name="Vector">
                    <div className="absolute inset-[-5.26%_-13.43%_-5.26%_-8.33%]">
                      <img alt="" className="block max-w-none size-full" src={imgVector} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-node-id="3:892" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine1} />
                </div>
              </div>
              <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-[315px]" data-node-id="3:893" data-name="Option-Row">
                <div className="content-stretch flex items-center relative shrink-0" data-node-id="3:894" data-name="Left">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[14px] whitespace-nowrap" data-node-id="3:897">
                    Cerrar Sesión
                  </p>
                </div>
                <div className="h-[19px] relative shrink-0 w-[12px]" data-node-id="3:1378" data-name="Vector">
                  <div className="absolute inset-[-5.26%_-13.43%_-5.26%_-8.33%]">
                    <img alt="" className="block max-w-none size-full" src={imgVector} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-[#e2e8f0] border-solid border-t content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:898" data-name="Bottom-Nav">
          <div className="content-stretch flex items-center justify-between px-[16px] py-[12px] relative shrink-0 w-full" data-node-id="3:899" data-name="Nav-Links">
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:900" data-name="Tab-home">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:901" data-name="home">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHome1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:903">
                Inicio
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:904" data-name="Tab-physical">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:905" data-name="box">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBox3} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:907">
                Físico
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:908" data-name="Tab-digital">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:909" data-name="computer">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgComputer1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:911">
                Digital
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:912" data-name="Tab-progress">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:913" data-name="bar-chart">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBarChart} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:915">
                Progreso
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:916" data-name="Tab-profile">
              <div className="overflow-clip relative shrink-0 size-[24px]" data-node-id="3:917" data-name="user">
                <div className="absolute inset-[16.67%]" data-node-id="3:1386" data-name="user">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUser1} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[11px] whitespace-nowrap" data-node-id="3:919">
                Perfil
              </p>
            </div>
          </div>
          <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-full" data-node-id="3:920" data-name="Home-Indicator">
            <div className="bg-[#0f172a] h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-node-id="3:921" data-name="Pill" />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[844px] items-start left-0 min-h-[844px] overflow-clip rounded-[32px] top-0 w-[393px]" data-node-id="3:923" data-name="antilia-ui-11-datos">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:924" data-name="Top">
          <div className="content-stretch flex h-[44px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="3:925" data-name="Status-Bar">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="3:926">
              9:41
            </p>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="3:927" data-name="Icons">
              <div className="relative shrink-0 size-[18px]" data-node-id="3:928" data-name="ios-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosSignal2} />
              </div>
              <div className="relative shrink-0 size-[18px]" data-node-id="3:930" data-name="ios-wifi-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosWifiSignal3} />
              </div>
              <div className="h-[18px] relative shrink-0 w-[26px]" data-node-id="3:932" data-name="ios-battery-full">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosBatteryFull3} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[16px] relative shrink-0 w-full" data-node-id="3:934" data-name="Screen-Header">
            <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="3:935" data-name="Back-Btn">
              <div className="relative shrink-0 size-[20px]" data-node-id="3:936" data-name="chevron-left">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronLeft1} />
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:938" data-name="Title-Group">
              <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[22px] w-full" data-node-id="3:939">
                Modificar Perfil
              </p>
              <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[13px] w-full" data-node-id="3:940">
                Edita tus datos personales
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[20px] items-start p-[24px] relative shrink-0 w-full" data-node-id="3:941" data-name="Content">
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-node-id="3:942" data-name="Input-Group">
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[13px] whitespace-nowrap" data-node-id="3:943">
                Nombre Completo
              </p>
              <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] h-[48px] items-center px-[16px] relative rounded-[12px] shrink-0 w-full" data-node-id="3:944" data-name="Input">
                <div className="relative shrink-0 size-[20px]" data-node-id="3:945" data-name="icon-user">
                  <div className="absolute left-[-5px] size-[30px] top-[-5px]" data-node-id="3:1419" data-name="user-pen">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUserPen} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap" data-node-id="3:947">
                  Manuel L.
                </p>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-node-id="3:948" data-name="Input-Group">
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[13px] whitespace-nowrap" data-node-id="3:949">
                Correo Electrónico
              </p>
              <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] h-[48px] items-center px-[16px] relative rounded-[12px] shrink-0 w-full" data-node-id="3:950" data-name="Input">
                <div className="relative shrink-0 size-[20px]" data-node-id="3:951" data-name="icon-mail">
                  <div className="absolute inset-[0_-25%_-25%_-25%]">
                    <img alt="" className="block max-w-none size-full" src={imgIconMail} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap" data-node-id="3:953">
                  manuel@antilia.com
                </p>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-node-id="3:954" data-name="Input-Group">
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[13px] whitespace-nowrap" data-node-id="3:955">
                Área de Enfoque Principal
              </p>
              <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] h-[48px] items-center px-[16px] relative rounded-[12px] shrink-0 w-full" data-node-id="3:956" data-name="Input">
                <div className="relative shrink-0 size-[20px]" data-node-id="3:957" data-name="icon-workspace">
                  <div className="absolute left-[-5px] size-[30px] top-[-5px]" data-node-id="3:1410" data-name="map-pin-house">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMapPinHouse} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap" data-node-id="3:959">
                  Escritorio y Biblioteca
                </p>
              </div>
            </div>
            <div className="bg-[#004cff] content-stretch flex h-[50px] items-center justify-center px-[24px] relative rounded-[14px] shrink-0 w-full" data-node-id="3:960" data-name="Button">
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[15px] text-center text-white whitespace-nowrap" data-node-id="3:961">
                Guardar Cambios
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white border-[#e2e8f0] border-solid border-t content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:962" data-name="Bottom-Nav">
          <div className="content-stretch flex items-center justify-between px-[16px] py-[12px] relative shrink-0 w-full" data-node-id="3:963" data-name="Nav-Links">
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:964" data-name="Tab-home">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:965" data-name="home">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHome1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:967">
                Inicio
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:968" data-name="Tab-physical">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:969" data-name="box">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBox3} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:971">
                Físico
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:972" data-name="Tab-digital">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:973" data-name="computer">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgComputer1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:975">
                Digital
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:976" data-name="Tab-progress">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:977" data-name="bar-chart">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBarChart} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:979">
                Progreso
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:980" data-name="Tab-profile">
              <div className="overflow-clip relative shrink-0 size-[24px]" data-node-id="3:981" data-name="user">
                <div className="absolute inset-[16.67%]" data-node-id="3:1389" data-name="user">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUser1} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[11px] whitespace-nowrap" data-node-id="3:983">
                Perfil
              </p>
            </div>
          </div>
          <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-full" data-node-id="3:984" data-name="Home-Indicator">
            <div className="bg-[#0f172a] h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-node-id="3:985" data-name="Pill" />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[844px] items-start left-0 min-h-[844px] overflow-clip rounded-[32px] top-0 w-[393px]" data-node-id="3:987" data-name="antilia-ui-12-medir-espacio">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:988" data-name="Top">
          <div className="content-stretch flex h-[44px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="3:989" data-name="Status-Bar">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="3:990">
              9:41
            </p>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="3:991" data-name="Icons">
              <div className="relative shrink-0 size-[18px]" data-node-id="3:992" data-name="ios-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosSignal2} />
              </div>
              <div className="relative shrink-0 size-[18px]" data-node-id="3:994" data-name="ios-wifi-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosWifiSignal3} />
              </div>
              <div className="h-[18px] relative shrink-0 w-[26px]" data-node-id="3:996" data-name="ios-battery-full">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosBatteryFull3} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[16px] relative shrink-0 w-full" data-node-id="3:998" data-name="Screen-Header">
            <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="3:999" data-name="Back-Btn">
              <div className="relative shrink-0 size-[20px]" data-node-id="3:1000" data-name="chevron-left">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronLeft1} />
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:1002" data-name="Title-Group">
              <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[22px] w-full" data-node-id="3:1003">
                Medir Espacio
              </p>
              <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[13px] w-full" data-node-id="3:1004">
                Regla del 70% libre para enfoque
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[20px] items-start p-[24px] relative shrink-0 w-full" data-node-id="3:1005" data-name="Content">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-center p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:1006" data-name="Visualizer-Frame">
              <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap" data-node-id="3:1007">
                Distribución de Escritorio Recomendada
              </p>
              <div className="bg-[#e6edff] border-2 border-[#004cff] border-dashed content-stretch flex flex-col gap-[12px] h-[160px] items-start p-[12px] relative rounded-[12px] shrink-0 w-full" data-node-id="3:1008" data-name="Virtual-AR-Mesh">
                <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="3:1009" data-name="Frame">
                  <div className="bg-white border-[#004cff] border-[1.5px] border-solid content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-node-id="3:1010" data-name="Lamp">
                    <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[10px] whitespace-nowrap" data-node-id="3:1011">
                      Lámpara (Izq)
                    </p>
                  </div>
                  <div className="bg-white border-2 border-[#10b981] border-solid content-stretch flex items-start px-[16px] py-[6px] relative rounded-[6px] shrink-0" data-node-id="3:1012" data-name="CleanZone">
                    <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap" data-node-id="3:1013">
                      70% LIBRE
                    </p>
                  </div>
                  <div className="bg-[#e2e8f0] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-node-id="3:1014" data-name="Tray">
                    <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[10px] whitespace-nowrap" data-node-id="3:1015">
                      Archivador
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-h-px relative w-full" data-node-id="3:1016" data-name="Guidance">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[12px] text-center whitespace-nowrap" data-node-id="3:1017">
                    Coloca tu cámara a 30cm del centro
                  </p>
                </div>
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#475569] text-[12px] text-center w-[min-content]" data-node-id="3:1018">
                Mueve los objetos hacia los extremos para despejar el campo visual primario.
              </p>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:1019" data-name="Card">
              <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap" data-node-id="3:1020">
                Estado Actual de Medición
              </p>
              <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] not-italic relative shrink-0 text-[13px] w-full whitespace-nowrap" data-node-id="3:1021" data-name="Metric-Row">
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569]" data-node-id="3:1022">
                  Ancho de Zona Despejada:
                </p>
                <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#004cff]" data-node-id="3:1023">
                  54 cm
                </p>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-node-id="3:1024" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgLine2} />
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] not-italic relative shrink-0 text-[13px] w-full whitespace-nowrap" data-node-id="3:1025" data-name="Metric-Row">
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569]" data-node-id="3:1026">
                  Objetos no esenciales detectados:
                </p>
                <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#ef4444]" data-node-id="3:1027">
                  3 detectados
                </p>
              </div>
            </div>
            <div className="bg-[#004cff] content-stretch flex h-[48px] items-center justify-center px-[24px] relative rounded-[14px] shrink-0 w-full" data-node-id="3:1028" data-name="Button">
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap" data-node-id="3:1029">
                Iniciar Escaneo de Área
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white border-[#e2e8f0] border-solid border-t content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:1030" data-name="Bottom-Nav">
          <div className="content-stretch flex items-center justify-between px-[16px] py-[12px] relative shrink-0 w-full" data-node-id="3:1031" data-name="Nav-Links">
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1032" data-name="Tab-home">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:1033" data-name="home">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHome1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1035">
                Inicio
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1036" data-name="Tab-physical">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:1037" data-name="box">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBox4} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[11px] whitespace-nowrap" data-node-id="3:1039">
                Físico
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1040" data-name="Tab-digital">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:1041" data-name="computer">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgComputer1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1043">
                Digital
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1044" data-name="Tab-progress">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:1045" data-name="bar-chart">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBarChart} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1047">
                Progreso
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1048" data-name="Tab-profile">
              <div className="overflow-clip relative shrink-0 size-[24px]" data-node-id="3:1049" data-name="user">
                <div className="absolute inset-[16.67%]" data-node-id="3:1392" data-name="user">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUser} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1051">
                Perfil
              </p>
            </div>
          </div>
          <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-full" data-node-id="3:1052" data-name="Home-Indicator">
            <div className="bg-[#0f172a] h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-node-id="3:1053" data-name="Pill" />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[844px] items-start left-0 min-h-[844px] overflow-clip rounded-[32px] top-0 w-[392px]" data-node-id="3:1055" data-name="antilia-ui-13-archivos">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:1056" data-name="Top">
          <div className="content-stretch flex h-[44px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="3:1057" data-name="Status-Bar">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="3:1058">
              9:41
            </p>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="3:1059" data-name="Icons">
              <div className="relative shrink-0 size-[18px]" data-node-id="3:1060" data-name="ios-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosSignal2} />
              </div>
              <div className="relative shrink-0 size-[18px]" data-node-id="3:1062" data-name="ios-wifi-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosWifiSignal3} />
              </div>
              <div className="h-[18px] relative shrink-0 w-[26px]" data-node-id="3:1064" data-name="ios-battery-full">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosBatteryFull3} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[16px] relative shrink-0 w-full" data-node-id="3:1066" data-name="Screen-Header">
            <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="3:1067" data-name="Back-Btn">
              <div className="relative shrink-0 size-[20px]" data-node-id="3:1068" data-name="chevron-left">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronLeft1} />
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:1070" data-name="Title-Group">
              <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[22px] w-full" data-node-id="3:1071">
                Limpieza de Archivos
              </p>
              <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[13px] w-full" data-node-id="3:1072">
                Organiza capturas y descargas
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[20px] items-start p-[24px] relative shrink-0 w-full" data-node-id="3:1073" data-name="Content">
            <div className="bg-[#e6edff] content-stretch flex gap-[12px] items-center p-[12px] relative rounded-[12px] shrink-0 w-full" data-node-id="3:1074" data-name="File-Meta">
              <div className="overflow-clip relative shrink-0 size-[24px]" data-node-id="3:1075" data-name="folder">
                <div className="absolute left-0 size-[100px] top-0" data-node-id="3:1416" data-name="layout-panel-left">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLayoutPanelLeft} />
                </div>
              </div>
              <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Semi_Bold'] font-semibold leading-[normal] min-w-px not-italic relative text-[#004cff] text-[13px]" data-node-id="3:1077">
                Se detectaron 4.2 GB de archivos basura esta semana.
              </p>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:1078" data-name="Card">
              <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap" data-node-id="3:1079">
                Bandeja de Entrada Digital
              </p>
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="3:1080" data-name="File-Item">
                <div className="bg-[#f8fafc] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-node-id="3:1081" data-name="Icon-Type">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap" data-node-id="3:1082">
                    IMG
                  </p>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="3:1083" data-name="Details">
                  <p className="font-['Inter:Semi_Bold'] font-semibold relative shrink-0 text-[#0f172a] text-[14px]" data-node-id="3:1084">
                    Screenshot_2026_09.png
                  </p>
                  <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px]" data-node-id="3:1085">
                    Capturas de Pantalla • 2.4 MB
                  </p>
                </div>
                <div className="bg-[#e6edff] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-node-id="3:1086" data-name="Action">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[11px] whitespace-nowrap" data-node-id="3:1087">
                    Organizar
                  </p>
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-node-id="3:1088" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgDivider} />
                </div>
              </div>
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="3:1089" data-name="File-Item">
                <div className="bg-[#f8fafc] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-node-id="3:1090" data-name="Icon-Type">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap" data-node-id="3:1091">
                    PDF
                  </p>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="3:1092" data-name="Details">
                  <p className="font-['Inter:Semi_Bold'] font-semibold relative shrink-0 text-[#0f172a] text-[14px]" data-node-id="3:1093">
                    Factura_Internet_Norte.pdf
                  </p>
                  <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px]" data-node-id="3:1094">
                    Descargas • 1.1 MB
                  </p>
                </div>
                <div className="bg-[#e6edff] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-node-id="3:1095" data-name="Action">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[11px] whitespace-nowrap" data-node-id="3:1096">
                    Archivar
                  </p>
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-node-id="3:1097" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img alt="" className="block max-w-none size-full" src={imgDivider} />
                </div>
              </div>
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-node-id="3:1098" data-name="File-Item">
                <div className="bg-[#f8fafc] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-node-id="3:1099" data-name="Icon-Type">
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap" data-node-id="3:1100">
                    ZIP
                  </p>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative whitespace-nowrap" data-node-id="3:1101" data-name="Details">
                  <p className="font-['Inter:Semi_Bold'] font-semibold relative shrink-0 text-[#0f172a] text-[14px]" data-node-id="3:1102">
                    proyecto_final_respaldo.zip
                  </p>
                  <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px]" data-node-id="3:1103">
                    Papelera • 140 MB
                  </p>
                </div>
                <div className="bg-[rgba(239,68,68,0.08)] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-node-id="3:1104" data-name="Action">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap" data-node-id="3:1105">
                    Eliminar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-[#e2e8f0] border-solid border-t content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:1106" data-name="Bottom-Nav">
          <div className="content-stretch flex items-center justify-between px-[16px] py-[12px] relative shrink-0 w-full" data-node-id="3:1107" data-name="Nav-Links">
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1108" data-name="Tab-home">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:1109" data-name="home">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHome1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1111">
                Inicio
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1112" data-name="Tab-physical">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:1113" data-name="box">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBox3} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1115">
                Físico
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1116" data-name="Tab-digital">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:1117" data-name="computer">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgComputer4} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[11px] whitespace-nowrap" data-node-id="3:1119">
                Digital
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1120" data-name="Tab-progress">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:1121" data-name="bar-chart">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBarChart} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1123">
                Progreso
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1124" data-name="Tab-profile">
              <div className="overflow-clip relative shrink-0 size-[24px]" data-node-id="3:1125" data-name="user">
                <div className="absolute inset-[16.67%]" data-node-id="3:1395" data-name="user">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUser} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1127">
                Perfil
              </p>
            </div>
          </div>
          <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-full" data-node-id="3:1128" data-name="Home-Indicator">
            <div className="bg-[#0f172a] h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-node-id="3:1129" data-name="Pill" />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[844px] items-start justify-between left-0 min-h-[844px] overflow-clip rounded-[32px] top-0 w-[393px]" data-node-id="3:1131" data-name="antilia-ui-14-recordatorios">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:1132" data-name="Top">
          <div className="content-stretch flex h-[44px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="3:1133" data-name="Status-Bar">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="3:1134">
              9:41
            </p>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="3:1135" data-name="Icons">
              <div className="relative shrink-0 size-[18px]" data-node-id="3:1136" data-name="ios-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosSignal2} />
              </div>
              <div className="relative shrink-0 size-[18px]" data-node-id="3:1138" data-name="ios-wifi-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosWifiSignal3} />
              </div>
              <div className="h-[18px] relative shrink-0 w-[26px]" data-node-id="3:1140" data-name="ios-battery-full">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosBatteryFull3} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[16px] relative shrink-0 w-full" data-node-id="3:1142" data-name="Screen-Header">
            <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="3:1143" data-name="Back-Btn">
              <div className="relative shrink-0 size-[20px]" data-node-id="3:1144" data-name="chevron-left">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronLeft1} />
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:1146" data-name="Title-Group">
              <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[22px] w-full" data-node-id="3:1147">
                Recordatorios
              </p>
              <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[13px] w-full" data-node-id="3:1148">
                Rutinas para mantener el orden
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[20px] items-start p-[24px] relative shrink-0 w-full" data-node-id="3:1149" data-name="Content">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:1150" data-name="Reminder-Card">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="3:1151" data-name="Header-Meta">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="3:1152" data-name="Frame">
                  <div className="overflow-clip relative shrink-0 size-[20px]" data-node-id="3:1153" data-name="icon-moon">
                    <div className="absolute left-0 size-[20px] top-0" data-node-id="3:1380" data-name="moon-star">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMoonStar} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="3:1155">
                    Zen Nocturno (Digital)
                  </p>
                </div>
                <div className="h-[24px] relative shrink-0 w-[44px]" data-node-id="3:1156" data-name={nightReminder ? "Toggle-Active" : "Toggle-Inactive"}>
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={nightReminder ? imgToggleActive : imgToggleInactive} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[13px] w-full" data-node-id="3:1158">
                Recordatorio para archivar bandejas de entrada a las 10:00 PM cada noche.
              </p>
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="3:1159" data-name="Weekly-Dots">
                <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0" data-node-id="3:1160" data-name="Dot-Wrapper">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1161">
                    L
                  </p>
                  <div className="relative shrink-0 size-[8px]" data-node-id="3:1162" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0" data-node-id="3:1163" data-name="Dot-Wrapper">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1164">
                    M
                  </p>
                  <div className="relative shrink-0 size-[8px]" data-node-id="3:1165" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0" data-node-id="3:1166" data-name="Dot-Wrapper">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1167">
                    M
                  </p>
                  <div className="relative shrink-0 size-[8px]" data-node-id="3:1168" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0" data-node-id="3:1169" data-name="Dot-Wrapper">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1170">
                    J
                  </p>
                  <div className="relative shrink-0 size-[8px]" data-node-id="3:1171" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0" data-node-id="3:1172" data-name="Dot-Wrapper">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1173">
                    V
                  </p>
                  <div className="relative shrink-0 size-[8px]" data-node-id="3:1174" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0" data-node-id="3:1175" data-name="Dot-Wrapper">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1176">
                    S
                  </p>
                  <div className="relative shrink-0 size-[8px]" data-node-id="3:1177" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse1} />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0" data-node-id="3:1178" data-name="Dot-Wrapper">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1179">
                    D
                  </p>
                  <div className="relative shrink-0 size-[8px]" data-node-id="3:1180" data-name="Ellipse">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse1} />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:1181" data-name="Reminder-Card-Inactive">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="3:1182" data-name="Header-Meta">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="3:1183" data-name="Frame">
                  <div className="relative shrink-0 size-[20px]" data-node-id="3:1184" data-name="icon-desk">
                    <div className="absolute inset-[0_-20%_-33.31%_0]">
                      <img alt="" className="block max-w-none size-full" src={imgIconDesk} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="3:1186">
                    Despeje Semanal (Físico)
                  </p>
                </div>
                <div className="h-[24px] relative shrink-0 w-[44px]" data-node-id="3:1187" data-name={weeklyReminder ? "Toggle-Active" : "Toggle-Inactive"}>
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={weeklyReminder ? imgToggleActive : imgToggleInactive} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[13px] w-full" data-node-id="3:1189">
                Sábados de limpieza de centro de escritorio y librero.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white border-[#e2e8f0] border-solid border-t content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:1190" data-name="Bottom-Nav">
          <div className="content-stretch flex items-center justify-between px-[16px] py-[12px] relative shrink-0 w-full" data-node-id="3:1191" data-name="Nav-Links">
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1192" data-name="Tab-home">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:1193" data-name="home">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHome1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1195">
                Inicio
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1196" data-name="Tab-physical">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:1197" data-name="box">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBox3} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1199">
                Físico
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1200" data-name="Tab-digital">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:1201" data-name="computer">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgComputer1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1203">
                Digital
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1204" data-name="Tab-progress">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:1205" data-name="bar-chart">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBarChart3} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[11px] whitespace-nowrap" data-node-id="3:1207">
                Progreso
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1208" data-name="Tab-profile">
              <div className="overflow-clip relative shrink-0 size-[24px]" data-node-id="3:1209" data-name="user">
                <div className="absolute inset-[16.67%]" data-node-id="3:1398" data-name="user">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUser} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1211">
                Perfil
              </p>
            </div>
          </div>
          <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-full" data-node-id="3:1212" data-name="Home-Indicator">
            <div className="bg-[#0f172a] h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-node-id="3:1213" data-name="Pill" />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[844px] items-start left-0 min-h-[844px] overflow-clip rounded-[32px] top-0 w-[393px]" data-node-id="3:1215" data-name="antilia-ui-15-cerrar-sesion">
        <div className="content-stretch flex flex-col h-[756px] items-start relative shrink-0 w-full" data-node-id="3:1216" data-name="Top">
          <div className="content-stretch flex h-[44px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="3:1217" data-name="Status-Bar">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="3:1218">
              9:41
            </p>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="3:1219" data-name="Icons">
              <div className="relative shrink-0 size-[18px]" data-node-id="3:1220" data-name="ios-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosSignal2} />
              </div>
              <div className="relative shrink-0 size-[18px]" data-node-id="3:1222" data-name="ios-wifi-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosWifiSignal3} />
              </div>
              <div className="h-[18px] relative shrink-0 w-[26px]" data-node-id="3:1224" data-name="ios-battery-full">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosBatteryFull3} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start opacity-30 p-[24px] relative shrink-0 w-full" data-node-id="3:1226" data-name="Background-Sim">
            <div className="content-stretch flex items-center px-[24px] py-[16px] relative shrink-0 w-full" data-node-id="3:1227" data-name="Screen-Header">
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:1228" data-name="Title-Group">
                <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[22px] w-full" data-node-id="3:1229">
                  Mi Cuenta
                </p>
                <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[13px] w-full" data-node-id="3:1230">
                  Manuel L.
                </p>
              </div>
            </div>
            <div className="[word-break:break-word] bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start leading-[normal] not-italic p-[16px] relative rounded-[16px] shrink-0 w-full whitespace-nowrap" data-node-id="3:1231" data-name="Card">
              <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[16px]" data-node-id="3:1232">
                Configuración de Cuenta
              </p>
              <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[14px] text-black" data-node-id="3:1233">
                Información de perfil
              </p>
              <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[14px] text-black" data-node-id="3:1234">
                Seguridad y contraseñas
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col items-start p-[24px] relative shrink-0 w-full" data-node-id="3:1235" data-name="Modal-Focus">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_12px_12px_rgba(0,0,0,0.06)] flex flex-col gap-[20px] items-start p-[24px] relative rounded-[24px] shrink-0 w-full" data-node-id="3:1236" data-name="Alert-Modal">
              <div className="content-stretch flex flex-col gap-[8px] h-[155px] items-center relative shrink-0 w-full" data-node-id="3:1237" data-name="Header">
                <div className="bg-[rgba(239,68,68,0.08)] content-stretch flex items-center justify-center relative rounded-[28px] shrink-0 size-[56px]" data-node-id="3:1238" data-name="Icon-Alert">
                  <div className="relative shrink-0 size-[28px]" data-node-id="3:1239" data-name="alert-triangle">
                    <div className="absolute left-[-3.5px] size-[36px] top-[-6px]" data-node-id="3:1422" data-name="alert-triangle">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAlertTriangle} />
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[18px] text-center whitespace-nowrap" data-node-id="3:1241">
                  ¿Cerrar Sesión?
                </p>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#475569] text-[13px] text-center w-[min-content]" data-node-id="3:1242">
                  Tendrás que volver a ingresar tus credenciales para acceder a tus áreas de orden.
                </p>
              </div>
              <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-node-id="3:1243" data-name="Actions">
                <div className="bg-[#ef4444] content-stretch flex items-center justify-center px-[16px] py-[12px] relative rounded-[12px] shrink-0 w-full" data-node-id="3:1244" data-name="Confirm-Btn">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap" data-node-id="3:1245">
                    Sí, cerrar sesión
                  </p>
                </div>
                <div className="border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center px-[16px] py-[12px] relative rounded-[12px] shrink-0 w-full" data-node-id="3:1246" data-name="Cancel-Btn">
                  <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap" data-node-id="3:1247">
                    Cancelar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-[#e2e8f0] border-solid border-t content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:1248" data-name="Bottom-Nav">
          <div className="content-stretch flex items-center justify-between px-[16px] py-[12px] relative shrink-0 w-full" data-node-id="3:1249" data-name="Nav-Links">
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1250" data-name="Tab-home">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:1251" data-name="home">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHome1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1253">
                Inicio
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1254" data-name="Tab-physical">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:1255" data-name="box">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBox3} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1257">
                Físico
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1258" data-name="Tab-digital">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:1259" data-name="computer">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgComputer1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1261">
                Digital
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1262" data-name="Tab-progress">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:1263" data-name="bar-chart">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBarChart} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1265">
                Progreso
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1266" data-name="Tab-profile">
              <div className="overflow-clip relative shrink-0 size-[24px]" data-node-id="3:1267" data-name="user">
                <div className="absolute inset-[16.67%]" data-node-id="3:1401" data-name="user">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUser1} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[11px] whitespace-nowrap" data-node-id="3:1269">
                Perfil
              </p>
            </div>
          </div>
          <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-full" data-node-id="3:1270" data-name="Home-Indicator">
            <div className="bg-[#0f172a] h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-node-id="3:1271" data-name="Pill" />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[844px] items-start justify-between left-0 min-h-[844px] overflow-clip rounded-[32px] top-0 w-[393px]" data-node-id="3:1273" data-name="antilia-ui-16-estado">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:1274" data-name="Top">
          <div className="content-stretch flex h-[44px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="3:1275" data-name="Status-Bar">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="3:1276">
              9:41
            </p>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="3:1277" data-name="Icons">
              <div className="relative shrink-0 size-[18px]" data-node-id="3:1278" data-name="ios-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosSignal2} />
              </div>
              <div className="relative shrink-0 size-[18px]" data-node-id="3:1280" data-name="ios-wifi-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosWifiSignal3} />
              </div>
              <div className="h-[18px] relative shrink-0 w-[26px]" data-node-id="3:1282" data-name="ios-battery-full">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosBatteryFull3} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[12px] items-center px-[24px] py-[16px] relative shrink-0 w-full" data-node-id="3:1284" data-name="Screen-Header">
            <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="3:1285" data-name="Back-Btn">
              <div className="relative shrink-0 size-[20px]" data-node-id="3:1286" data-name="chevron-left">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronLeft1} />
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px not-italic relative" data-node-id="3:1288" data-name="Title-Group">
              <p className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#0f172a] text-[22px] w-full" data-node-id="3:1289">
                Estado General
              </p>
              <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[13px] w-full" data-node-id="3:1290">
                Métricas unificadas de tu mente
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[20px] items-start p-[24px] relative shrink-0 w-full" data-node-id="3:1291" data-name="Content">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-center p-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="3:1292" data-name="Zen-Indicator">
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[14px] whitespace-nowrap" data-node-id="3:1293">
                Nivel de Orden Consolidado
              </p>
              <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[110px]" data-node-id="3:1294" data-name="Circular-Ring">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[110px] top-1/2" data-node-id="3:1295" data-name="Ellipse">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse2} />
                </div>
                <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[110px] top-1/2" data-node-id="3:1296" data-name="Ellipse">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3} />
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-center leading-[normal] not-italic relative shrink-0 whitespace-nowrap" data-node-id="3:1297" data-name="Inner-Label">
                  <p className="font-['Inter:Extra_Bold'] font-extrabold relative shrink-0 text-[#0f172a] text-[28px]" data-node-id="3:1298">
                    78%
                  </p>
                  <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[11px]" data-node-id="3:1299">
                    Excelente
                  </p>
                </div>
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] min-w-full not-italic relative shrink-0 text-[#475569] text-[12px] text-center w-[min-content]" data-node-id="3:1300">
                Has mantenido un promedio alto gracias a tus limpiezas diarias.
              </p>
            </div>
            <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-node-id="3:1301" data-name="Comparison">
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px p-[16px] relative rounded-[16px]" data-node-id="3:1302" data-name="Comp-Item">
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap" data-node-id="3:1303">
                  Físico (80%)
                </p>
                <div className="bg-[#e6edff] content-stretch flex h-[6px] items-start relative rounded-[3px] shrink-0 w-full" data-node-id="3:1304" data-name="Bar">
                  <div className="bg-[#004cff] h-full relative shrink-0 w-[80px]" data-node-id="3:1305" data-name="Rectangle" />
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px p-[16px] relative rounded-[16px]" data-node-id="3:1306" data-name="Comp-Item">
                <p className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap" data-node-id="3:1307">
                  Digital (76%)
                </p>
                <div className="bg-[#e6edff] content-stretch flex h-[6px] items-start relative rounded-[3px] shrink-0 w-full" data-node-id="3:1308" data-name="Bar">
                  <div className="bg-[#004cff] h-full relative shrink-0 w-[76px]" data-node-id="3:1309" data-name="Rectangle" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-[#e2e8f0] border-solid border-t content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:1310" data-name="Bottom-Nav">
          <div className="content-stretch flex items-center justify-between px-[16px] py-[12px] relative shrink-0 w-full" data-node-id="3:1311" data-name="Nav-Links">
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1312" data-name="Tab-home">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:1313" data-name="home">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHome1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1315">
                Inicio
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1316" data-name="Tab-physical">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:1317" data-name="box">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBox3} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1319">
                Físico
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1320" data-name="Tab-digital">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:1321" data-name="computer">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgComputer1} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1323">
                Digital
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1324" data-name="Tab-progress">
              <div className="relative shrink-0 size-[24px]" data-node-id="3:1325" data-name="bar-chart">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBarChart3} />
              </div>
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#004cff] text-[11px] whitespace-nowrap" data-node-id="3:1327">
                Progreso
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[64px]" data-node-id="3:1328" data-name="Tab-profile">
              <div className="overflow-clip relative shrink-0 size-[24px]" data-node-id="3:1329" data-name="user">
                <div className="absolute inset-[16.67%]" data-node-id="3:1404" data-name="user">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUser} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[11px] whitespace-nowrap" data-node-id="3:1331">
                Perfil
              </p>
            </div>
          </div>
          <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-full" data-node-id="3:1332" data-name="Home-Indicator">
            <div className="bg-[#0f172a] h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-node-id="3:1333" data-name="Pill" />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[844px] items-start left-0 min-h-[844px] overflow-clip rounded-[32px] top-0 w-[393px]" data-node-id="3:1335" data-name="antilia-ui-17-recuperar-contrasena">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:1336" data-name="Top">
          <div className="content-stretch flex h-[44px] items-center justify-between px-[24px] relative shrink-0 w-full" data-node-id="3:1337" data-name="Status-Bar">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="3:1338">
              9:41
            </p>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-node-id="3:1339" data-name="Icons">
              <div className="relative shrink-0 size-[18px]" data-node-id="3:1340" data-name="ios-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosSignal2} />
              </div>
              <div className="relative shrink-0 size-[18px]" data-node-id="3:1342" data-name="ios-wifi-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosWifiSignal3} />
              </div>
              <div className="h-[18px] relative shrink-0 w-[26px]" data-node-id="3:1344" data-name="ios-battery-full">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosBatteryFull3} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[32px] h-[600px] items-center justify-center p-[24px] relative shrink-0 w-full" data-node-id="3:1346" data-name="Content">
            <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0" data-node-id="3:1347" data-name="Art-Section">
              <div className="bg-[#e6edff] content-stretch flex flex-col items-center justify-center relative rounded-[40px] shrink-0 size-[80px]" data-node-id="3:1348" data-name="Lighthouse-Icon">
                <div className="relative shrink-0 size-[40px]" data-node-id="3:1349" data-name="flashlight">
                  <div className="absolute h-[50px] left-[-8px] top-[-4.5px] w-[55px]" data-node-id="3:1368" data-name="flashlight">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFlashlight} />
                  </div>
                </div>
              </div>
              <p className="[word-break:break-word] font-['Inter:Extra_Bold'] font-extrabold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[24px] whitespace-nowrap" data-node-id="3:1351">
                Recuperar Contraseña
              </p>
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[14px] text-center w-[280px]" data-node-id="3:1352">
                Ingresa tu correo electrónico registrado y te enviaremos una clave temporal.
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-node-id="3:1353" data-name="Input-Group">
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[13px] whitespace-nowrap" data-node-id="3:1354">
                Correo Electrónico
              </p>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] h-[48px] items-center px-[16px] relative rounded-[12px] shrink-0 w-full" data-node-id="3:1355" data-name="Input">
                <div className="relative shrink-0 size-[20px]" data-node-id="3:1356" data-name="icon-mail">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconMail1} />
                </div>
                <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[14px] whitespace-nowrap" data-node-id="3:1358">
                  ejemplo@antilia.com
                </p>
              </div>
            </div>
            <div className="bg-[#004cff] content-stretch flex h-[50px] items-center justify-center px-[24px] relative rounded-[14px] shrink-0 w-full" data-node-id="3:1359" data-name="Button">
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[15px] text-center text-white whitespace-nowrap" data-node-id="3:1360">
                Enviar Enlace
              </p>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-center p-[24px] relative shrink-0 w-full" data-node-id="3:1361" data-name="Bottom-Row">
          <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[0] not-italic relative shrink-0 text-[#475569] text-[14px] whitespace-nowrap" data-node-id="3:1362">
            <span className="leading-[normal]">{`¿Recordaste tu contraseña? `}</span>
            <span className="font-['Inter:Bold'] font-bold leading-[normal] text-[#004cff]">Inicia sesión aquí</span>
          </p>
          <div className="bg-[#0f172a] h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-node-id="3:1363" data-name="Indicator" />
        </div>
      </div>
      <div className="absolute bg-[#f8fafc] content-stretch flex flex-col h-[699px] items-start justify-between left-0 overflow-clip rounded-[32px] top-0 w-[392px]" data-node-id="40:235" data-name="Registro de nuevo usuario">
        <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-node-id="40:236" data-name="Contenido superior">
          <div className="content-stretch flex h-[44px] items-center justify-between overflow-clip px-[24px] relative shrink-0 w-full" data-node-id="40:237" data-name="Barra de estado">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap" data-node-id="40:238">
              9:41
            </p>
            <div className="content-stretch flex gap-[6px] items-center overflow-clip relative shrink-0" data-node-id="40:239" data-name="Indicadores">
              <div className="relative shrink-0 size-[17px]" data-node-id="40:350" data-name="signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSignal} />
              </div>
              <div className="relative shrink-0 size-[17px]" data-node-id="40:353" data-name="ios-wifi-signal">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosWifiSignal} />
              </div>
              <div className="h-[17px] relative shrink-0 w-[24px]" data-node-id="40:356" data-name="ios-battery-full">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIosBatteryFull} />
              </div>
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic overflow-clip pb-[16px] pt-[14px] px-[24px] relative shrink-0 w-full whitespace-nowrap" data-node-id="40:243" data-name="Encabezado">
            <p className="font-['Inter:Extra_Bold'] font-extrabold relative shrink-0 text-[#0f172a] text-[24px]" data-node-id="40:244">
              Crea tu cuenta
            </p>
            <p className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#475569] text-[13px]" data-node-id="40:245">
              Empieza a ordenar tu espacio con Antilia
            </p>
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip pt-[8px] px-[24px] relative shrink-0 w-full" data-node-id="40:246" data-name="Formulario">
            <div className="bg-[#e6edff] content-stretch flex gap-[12px] items-center overflow-clip p-[12px] relative rounded-[16px] shrink-0 w-full" data-node-id="40:247" data-name="Mensaje">
              <div className="relative shrink-0 size-[28px]" data-node-id="40:359" data-name="sparkles">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSparkles} />
              </div>
              <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Semi_Bold'] font-semibold leading-[normal] min-w-px not-italic relative text-[#0b55ff] text-[13px]" data-node-id="40:249">
                Un pequeño paso para una vida más ligera.
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[6px] items-start overflow-clip relative shrink-0 w-full" data-node-id="40:250" data-name="Campo">
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[13px] whitespace-nowrap" data-node-id="40:251">
                Nombre completo
              </p>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] h-[48px] items-center overflow-clip px-[16px] relative rounded-[12px] shrink-0 w-full" data-node-id="40:252" data-name="Entrada">
                <div className="relative shrink-0 size-[20px]" data-node-id="40:362" data-name="user">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUser2} />
                </div>
                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[#475569] text-[14px]" data-node-id="40:254">
                  Tu nombre
                </p>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[6px] items-start overflow-clip relative shrink-0 w-full" data-node-id="40:255" data-name="Campo">
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[13px] whitespace-nowrap" data-node-id="40:256">
                Correo electrónico
              </p>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] h-[48px] items-center overflow-clip px-[16px] relative rounded-[12px] shrink-0 w-full" data-node-id="40:257" data-name="Entrada">
                <div className="relative shrink-0 size-[20px]" data-node-id="40:365" data-name="mail">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgMail} />
                </div>
                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[#475569] text-[14px]" data-node-id="40:259">
                  ejemplo@antilia.com
                </p>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[6px] items-start overflow-clip relative shrink-0 w-full" data-node-id="40:260" data-name="Campo">
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[13px] whitespace-nowrap" data-node-id="40:261">
                Contraseña
              </p>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] h-[48px] items-center overflow-clip px-[16px] relative rounded-[12px] shrink-0 w-full" data-node-id="40:262" data-name="Entrada">
                <div className="relative shrink-0 size-[20px]" data-node-id="40:368" data-name="lock-keyhole">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLockKeyhole} />
                </div>
                <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[#475569] text-[14px]" data-node-id="40:264">
                  ••••••••
                </p>
              </div>
            </div>
            <div className="content-stretch flex gap-[7px] items-center overflow-clip relative shrink-0" data-node-id="40:265" data-name="Requisito">
              <div className="bg-[#0b55ff] relative rounded-[3px] shrink-0 size-[6px]" data-node-id="40:266" data-name="Punto" />
              <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap" data-node-id="40:267">
                Mínimo 8 caracteres
              </p>
            </div>
            <div className="bg-[#0b55ff] content-stretch flex flex-col h-[50px] items-center justify-center overflow-clip px-[24px] relative rounded-[14px] shrink-0 w-full" data-node-id="40:268" data-name="Botón principal">
              <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[15px] text-white whitespace-nowrap" data-node-id="40:269">
                Crear Cuenta
              </p>
            </div>
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[0] min-w-full not-italic relative shrink-0 text-[#475569] text-[12px] text-center w-[min-content]" data-node-id="40:270">
              <span className="leading-[1.4]">{`Al registrarte aceptas los `}</span>
              <span className="font-['Inter:Semi_Bold'] font-semibold leading-[1.4] text-[#0b55ff]">Términos</span>
              <span className="leading-[1.4]">{` y la `}</span>
              <span className="font-['Inter:Semi_Bold'] font-semibold leading-[1.4] text-[#0b55ff]">Política de privacidad</span>
              <span className="leading-[1.4]">.</span>
            </p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-center overflow-clip pt-[8px] px-[24px] relative shrink-0 w-full" data-node-id="40:271" data-name="Pie">
          <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[0] not-italic relative shrink-0 text-[#475569] text-[14px] whitespace-nowrap" data-node-id="40:272">
            <span className="leading-[normal]">{`¿Ya tienes cuenta? `}</span>
            <span className="font-['Inter:Bold'] font-bold leading-[normal] text-[#0b55ff]">Inicia sesión</span>
          </p>
          <div className="content-stretch flex flex-col h-[24px] items-center justify-center overflow-clip relative shrink-0 w-full" data-node-id="40:273" data-name="Indicador de inicio">
            <div className="bg-[#0f172a] h-[5px] relative rounded-[100px] shrink-0 w-[134px]" data-node-id="40:274" data-name="Barra" />
          </div>
        </div>
      </div>
      {notice && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#0f172a] px-4 py-3 font-['Inter:Semi_Bold'] text-[13px] text-white shadow-lg">
          {notice}
        </div>
      )}
    </div>
  );
}
