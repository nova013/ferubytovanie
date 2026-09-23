/**
 * Overí, že KAŽDÁ fotografia z priečinka `Photos/` je:
 *   1. prevedená do `src/assets/photos/<nazov>.jpg`,
 *   2. uvedená v inventári `src/data/photos.ts`,
 *   3. (ak existuje build) skutočne použitá vo vygenerovanom `dist/index.html`.
 *
 * Spustenie: `npm run photos:verify`  (ideálne po `npm run build`)
 */
import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isExcluded } from './photo-config.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = path.join(ROOT, 'Photos');
const ASSETS_DIR = path.join(ROOT, 'src', 'assets', 'photos');
const INVENTORY = path.join(ROOT, 'src', 'data', 'photos.ts');
const DIST_HTML = path.join(ROOT, 'dist', 'index.html');

const IMAGE_EXT = new Set(['.heic', '.heif', '.png', '.jpg', '.jpeg', '.webp']);

const exists = (file) =>
  access(file).then(
    () => true,
    () => false,
  );

const allOriginals = (await readdir(SOURCE_DIR))
  .filter((name) => IMAGE_EXT.has(path.extname(name).toLowerCase()))
  .sort();
const excluded = allOriginals.filter(isExcluded);
const originals = allOriginals.filter((name) => !isExcluded(name));

const inventory = await readFile(INVENTORY, 'utf8');
const distHtml = (await exists(DIST_HTML)) ? await readFile(DIST_HTML, 'utf8') : null;

let failures = 0;
const rows = [];

for (const name of originals) {
  const base = path.parse(name).name.toLowerCase();
  const converted = await exists(path.join(ASSETS_DIR, `${base}.jpg`));
  const listed = new RegExp(`file:\\s*['"]${base}['"]`).test(inventory);
  // Astro zachováva pôvodný názov súboru v optimalizovaných variantoch: /_astro/<base>.<hash>.webp
  const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const used = distHtml
    ? new RegExp(`/_astro/${escaped}\\.[A-Za-z0-9_-]+\\.(?:avif|webp|jpe?g|png)`).test(distHtml)
    : null;

  const ok = converted && listed && used !== false;
  if (!ok) failures += 1;

  rows.push({
    fotografia: name,
    prevedena: converted ? 'áno' : 'CHÝBA',
    v_inventari: listed ? 'áno' : 'CHÝBA',
    v_builde: used === null ? '(bez buildu)' : used ? 'áno' : 'NEPOUŽITÁ',
  });
}

console.table(rows);

if (excluded.length) {
  console.log(`Zámerne vynechané (scripts/photo-config.mjs): ${excluded.join(', ')}`);
}

if (!distHtml) {
  console.log('Upozornenie: dist/index.html neexistuje – použitie v builde nebolo overené. Spustite „npm run build“.');
}

if (failures > 0) {
  console.error(`CHYBA: ${failures} z ${originals.length} fotografií nespĺňa všetky podmienky.`);
  process.exit(1);
}

console.log(`OK: všetkých ${originals.length} fotografií je prevedených, v inventári${distHtml ? ' a použitých na webe' : ''}.`);
