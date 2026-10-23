const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const target = path.join(root, 'frontend/dist/downloads');
fs.mkdirSync(target, { recursive: true });
for (const [source, name] of [['Antilia-Android.apk', 'antilia.apk'], ['Antilia-Android.sha256', 'antilia.sha256']]) {
  fs.copyFileSync(path.join(root, 'distribucion/android', source), path.join(target, name));
}
