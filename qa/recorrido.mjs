import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE_URL = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = join(import.meta.dirname, 'evidencias', stamp);
mkdirSync(outDir, { recursive: true });

let paso = 0;
const fallos = [];

async function captura(page, nombre) {
  paso += 1;
  await page.screenshot({ path: join(outDir, `${String(paso).padStart(2, '0')}-${nombre}.png`) });
}

function comprobar(condicion, mensaje) {
  if (condicion) {
    console.log(`PASA: ${mensaje}`);
  } else {
    console.error(`FALLA: ${mensaje}`);
    fallos.push(mensaje);
  }
}

const browser = await chromium.launch();
const context = await browser.newContext({ ...devices['Pixel 7'] });
const page = await context.newPage();
const erroresConsola = [];
page.on('console', (m) => { if (m.type() === 'error') erroresConsola.push(m.text()); });
page.setDefaultTimeout(30000);

try {
  console.log(`Probando ${BASE_URL}`);
  const inicio = Date.now();
  await page.goto(`${BASE_URL}/`);
  comprobar(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'La pantalla no desborda el ancho del celular');
  await page.waitForSelector('text=Iniciar Sesión');
  comprobar(true, `La pantalla de acceso carga (${Date.now() - inicio} ms)`);
  await captura(page, 'acceso');
  await page.click('text=Regístrate aquí');
  await page.click('text=Crear Cuenta');
  comprobar(await page.isVisible('text=El nombre es obligatorio'), 'El registro vacío muestra cómo corregir');
  await captura(page, 'registro-errores');

  await page.fill('#email', 'nombre..prueba@gmail.com');
  await page.locator('#email').blur();
  comprobar(await page.isVisible('text=Escribe un correo válido'), 'El correo con puntos repetidos se rechaza');
  await page.fill('#name', 'Usuario Prueba QA');
  await page.fill('#email', `qa-${Date.now()}@example.com`);
  await page.fill('#password', 'Orden2026');
  await page.fill('#confirmation', 'Orden2026');
  await page.click('text=Crear Cuenta');
  await page.waitForSelector('text=Hola, Usuario');
  comprobar(true, 'Después del registro se abre el panel principal');
  await captura(page, 'panel-vacio');
  for (const [titulo, tipo] of [['Ordenar escritorio', 'Física'], ['Limpiar Descargas', 'Correos y archivos']]) {
    await page.click('text=Nueva tarea');
    await page.fill('#new-task-title', titulo);
    await page.click(`label:has-text("${tipo}")`);
    await page.click('text=Guardar Tarea');
    await page.waitForSelector(`text=${titulo}`);
    comprobar(true, `Se crea la tarea ${tipo.toLowerCase()} "${titulo}"`);
  }
  comprobar(await page.isVisible('text=0 de 2 tareas'), 'El progreso del día muestra 0 de 2');
  await captura(page, 'panel-con-tareas');
  await page.click('button[aria-label="Completar tarea: Ordenar escritorio"]');
  await page.waitForSelector('text=¡Racha de 1 día!');
  comprobar(true, 'Al completar aparece el aviso de racha');
  comprobar(await page.isVisible('text=1 de 2 tareas'), 'El progreso sube a 1 de 2');
  comprobar(await page.isVisible('text=Racha: 1'), 'La racha se ve en la pantalla principal');
  await captura(page, 'tarea-completada');
  await page.click('button:has-text("Correos y archivos")');
  comprobar(!(await page.isVisible('text=Ordenar escritorio')), 'El filtro Digitales oculta las tareas físicas');
  await page.click('button:has-text("Todas")');
  await page.fill('#task-search', 'Limpiar');
  comprobar(!(await page.isVisible('text=Ordenar escritorio')), 'La búsqueda filtra las tareas');
  await page.fill('#task-search', '');
  await page.getByRole('button', { name: 'Historial', exact: true }).click();
  comprobar(await page.isVisible('text=Ordenar escritorio'), 'El historial muestra tareas completadas');
  comprobar(!(await page.isVisible('text=Limpiar Descargas')), 'El historial no mezcla tareas pendientes');
  await page.getByRole('button', { name: 'Hoy', exact: true }).click();

  await page.click('nav >> text=Progreso');
  await page.waitForSelector('text=Racha más alta: 1 día');
  comprobar(await page.isVisible('text=Últimos 7 días'), 'La actividad semanal aparece');
  comprobar(true, 'Progreso muestra la racha y el récord');
  await captura(page, 'progreso');

  await page.click('nav >> text=Perfil');
  await page.waitForSelector('text=Tareas hechas');
  await page.waitForTimeout(500);
  await captura(page, 'perfil');

  await page.reload();
  await page.waitForSelector('text=Este es tu espacio');
  comprobar(true, 'La sesión se mantiene al recargar');

  await page.click('text=Cerrar Sesión');
  await page.getByRole('button', { name: 'Salir', exact: true }).click();
  await page.waitForSelector('text=Iniciar Sesión');
  comprobar(true, 'Cerrar sesión vuelve a la pantalla de acceso');

  comprobar(erroresConsola.length === 0, `Sin errores en la consola${erroresConsola.length ? ': ' + erroresConsola.join(' | ') : ''}`);
  console.log(`Tiempo total: ${Date.now() - inicio} ms`);
} catch (err) {
  fallos.push(err.message);
  console.error(`FALLA: ${err.message}`);
  await captura(page, 'error').catch(() => {});
} finally {
  await browser.close();
}

console.log(`\nCapturas en ${outDir}`);
if (fallos.length > 0) {
  console.error(`${fallos.length} comprobación(es) fallaron.`);
  process.exit(1);
}
console.log('Todas las comprobaciones pasaron.');
