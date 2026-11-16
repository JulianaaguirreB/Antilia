import { chromium, devices } from 'playwright';
import assert from 'node:assert/strict';

const base = process.env.BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
let passed = 0;
const check = (value, label) => { assert.ok(value, label); passed++; console.log('PASA:', label); };
try {
  const context = await browser.newContext({ ...devices['Pixel 7'] });
  const page = await context.newPage();
  await page.goto(base + '/#/acceso');
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  const manifest = await page.evaluate(async () => (await fetch(document.querySelector('link[rel="manifest"]').href)).json());
  check(manifest.display === 'standalone' && manifest.scope === '/' && manifest.start_url === '/#/inicio', 'Configuración de app independiente');
  for (const icon of manifest.icons) {
    const response = await page.request.get(base + icon.src);
    check(response.ok() && response.headers()['content-type'].includes('image/png'), 'Ícono disponible: ' + icon.sizes + ' ' + icon.purpose);
  }
  const cdp = await context.newCDPSession(page);
  const installability = await cdp.send('Page.getInstallabilityErrors');
  check(installability.installabilityErrors.length === 0, 'Chromium no reporta errores de instalación');
  await page.getByRole('button', { name: 'Cómo instalar Antilia', exact: true }).click();
  check(await page.getByText('Antilia en tu pantalla de inicio', { exact: true }).isVisible(), 'Ayuda de instalación disponible');
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Pantalla sin desborde horizontal');
  await page.evaluate(() => {
    const event = new Event('beforeinstallprompt', { cancelable: true });
    event.prompt = async () => {};
    event.userChoice = Promise.resolve({ outcome: 'dismissed' });
    window.dispatchEvent(event);
  });
  await page.getByRole('button', { name: 'Instalar Antilia en este dispositivo', exact: true }).click();
  check(await page.getByRole('status').innerText().then(text => text.includes('después')), 'Cancelar instalación no afirma que se instaló');
  await page.evaluate(() => window.dispatchEvent(new Event('appinstalled')));
  check(await page.getByRole('button', { name: 'Cómo instalar Antilia', exact: true }).count() === 0, 'Oculta la ayuda tras instalación confirmada');
  await page.reload();
  await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
  await context.setOffline(true);
  await page.goto(base + '/?offline-test=1');
  check(await page.getByRole('heading', { name: 'Volvamos a conectarnos' }).isVisible(), 'Arranque sin red muestra estado claro');
  const cachePaths = await page.evaluate(async () => {
    const result = [];
    for (const name of await caches.keys()) {
      for (const request of await (await caches.open(name)).keys()) result.push(new URL(request.url).pathname);
    }
    return result;
  });
  check(cachePaths.every(path => !path.startsWith('/api/')) && !cachePaths.includes('/'), 'No almacena API ni pantallas privadas en caché');
  await context.setOffline(false);
  await page.getByRole('button', { name: 'Volver a intentar' }).click();
  await page.getByRole('heading', { name: 'Qué bueno verte' }).waitFor();
  check(true, 'Se recupera al volver la conexión');
  await context.close();
  const ios = await browser.newContext({ ...devices['iPhone 13'] });
  const iphone = await ios.newPage();
  await iphone.goto(base + '/#/acceso');
  await iphone.getByRole('button', { name: 'Cómo instalar Antilia', exact: true }).click();
  check(await iphone.getByText(/Abre esta dirección en Safari/).isVisible(), 'Instrucciones específicas de iPhone');
  await ios.close();
  console.log('Total:', passed, 'comprobaciones de PWA. No equivale a instalar en un teléfono físico.');
} finally { await browser.close(); }
