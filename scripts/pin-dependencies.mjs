import fs from 'node:fs';
const manifest = JSON.parse(
  fs.readFileSync('package.json', 'utf8').replace(/^\uFEFF/, ''),
);
const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
for (const group of ['dependencies', 'devDependencies']) {
  for (const name of Object.keys(manifest[group] || {}))
    manifest[group][name] = lock.packages[`node_modules/${name}`].version;
  lock.packages[''][group] = { ...manifest[group] };
}
fs.writeFileSync('package.json', JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync('package-lock.json', JSON.stringify(lock, null, 2) + '\n');
