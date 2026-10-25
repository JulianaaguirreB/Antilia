const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const base = process.env.BASE_URL || 'http://localhost:3102';
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const android = await browser.newContext({ viewport: { width: 393, height: 852 }, userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36' });
    const page = await android.newPage();
    await page.goto(base + '/#/acceso');
    const apk = page.getByRole('link', { name: 'Descargar Antilia para Android (APK)', exact: true });
    await apk.waitFor();
    assert.equal(await apk.getAttribute('href'), '/downloads/antilia.apk?v=5');
    assert.equal(await apk.getAttribute('download'), 'Antilia-Android.apk');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    const file = await page.request.get(base + '/downloads/antilia.apk');
    assert.equal(file.status(), 200);
    const data = await file.body();
    assert.equal(data.subarray(0, 2).toString(), 'PK');
    assert.ok(data.length > 1000000);
    const expected = fs.readFileSync('distribucion/android/Antilia-Android.sha256', 'utf8').trim().split(/\s+/)[0];
    assert.equal(crypto.createHash('sha256').update(data).digest('hex'), expected);
    if (new URL(base).protocol === 'https:') {
      assert.match(file.headers()['content-type'], /application\/vnd\.android\.package-archive/);
      assert.match(file.headers()['content-disposition'], /attachment; filename="Antilia-Android.apk"/);
    }
    fs.mkdirSync('qa/evidencias/apk', { recursive: true });
    await page.screenshot({ path: 'qa/evidencias/apk/android.png', fullPage: true });
    const ios = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' });
    const iphone = await ios.newPage();
    await iphone.goto(base + '/#/acceso');
    await iphone.getByRole('button', { name: 'Cómo instalar Antilia', exact: true }).waitFor();
    assert.equal(await iphone.getByRole('link', { name: 'Descargar Antilia para Android (APK)', exact: true }).count(), 0);
    console.log('Android: botón APK y archivo real disponibles, sin desbordamiento. iPhone: no muestra descarga incompatible.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
