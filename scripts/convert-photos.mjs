/**
 * Konvertuje všetky fotografie z priečinka `Photos/` (HEIC / PNG / JPG)
 * do webovo použiteľných JPEG súborov v `src/assets/photos/`.
 *
 * Astro potom pri builde z týchto zdrojov generuje responzívne AVIF/WebP varianty.
 * Spustenie: `npm run photos:convert`
 */
import { readdir, mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import heicConvert from 'heic-convert';
import { isExcluded } from './photo-config.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = path.join(ROOT, 'Photos');
const TARGET_DIR = path.join(ROOT, 'src', 'assets', 'photos');

// Najdlhšia strana zdrojového JPEG-u. 2400 px stačí aj pre hero na 1920 px displejoch
// a výrazne zmenšuje objem dát, s ktorými musí build pracovať.
const MAX_EDGE = 2400;
const JPEG_QUALITY = 90;

const HEIC_EXT = new Set(['.heic', '.heif']);
const RASTER_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp']);

async function decodeToBuffer(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const input = await readFile(filePath);
  if (HEIC_EXT.has(ext)) {
    // heic-convert aplikuje transformácie z HEIF kontajnera (rotácia / zrkadlenie).
    return Buffer.from(await heicConvert({ buffer: input, format: 'JPEG', quality: 1 }));
  }
  if (RASTER_EXT.has(ext)) return input;
  return null;
}

async function main() {
  await mkdir(TARGET_DIR, { recursive: true });
  const entries = (await readdir(SOURCE_DIR)).sort();
  const results = [];

  for (const name of entries) {
    const src = path.join(SOURCE_DIR, name);
    if (!(await stat(src)).isFile()) continue;
    if (isExcluded(name)) {
      console.log(`Vynechávam (zámerne nepoužitá): ${name}`);
      continue;
    }
    const buffer = await decodeToBuffer(src);
    if (!buffer) {
      console.warn(`Preskakujem nepodporovaný súbor: ${name}`);
      continue;
    }
    const base = path.parse(name).name.toLowerCase();
    const out = path.join(TARGET_DIR, `${base}.jpg`);

    const image = sharp(buffer).rotate(); // rotate() bez argumentu = rešpektuj EXIF orientáciu
    const meta = await image.metadata();
    const info = await image
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(out);

    results.push({ name, out: path.relative(ROOT, out), src: `${meta.width}x${meta.height}`, dst: `${info.width}x${info.height}`, kb: Math.round(info.size / 1024) });
  }

  console.table(results);
  console.log(`Hotovo: ${results.length} fotografií → ${path.relative(ROOT, TARGET_DIR)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
