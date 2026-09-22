/**
 * Vygeneruje rastrové ikony (apple-touch-icon.png, favicon.ico) z public/favicon.svg.
 * Spustenie: `node scripts/make-icons.mjs`
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');

const svg = await readFile(path.join(PUBLIC, 'favicon.svg'));

// Apple touch icon – 180×180 px
await sharp(svg, { density: 384 })
  .resize(180, 180)
  .png()
  .toFile(path.join(PUBLIC, 'apple-touch-icon.png'));

// favicon.ico – jednoduchý ICO kontajner s jedným 32×32 PNG obrázkom
const png32 = await sharp(svg, { density: 384 }).resize(32, 32).png().toBuffer();
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // rezervované
header.writeUInt16LE(1, 2); // typ: ikona
header.writeUInt16LE(1, 4); // počet obrázkov
const entry = Buffer.alloc(16);
entry.writeUInt8(32, 0); // šírka
entry.writeUInt8(32, 1); // výška
entry.writeUInt8(0, 2); // paleta
entry.writeUInt8(0, 3); // rezervované
entry.writeUInt16LE(1, 4); // farebné roviny
entry.writeUInt16LE(32, 6); // bitov na pixel
entry.writeUInt32LE(png32.length, 8); // veľkosť dát
entry.writeUInt32LE(6 + 16, 12); // offset dát
await writeFile(path.join(PUBLIC, 'favicon.ico'), Buffer.concat([header, entry, png32]));

console.log('Ikony vygenerované: public/apple-touch-icon.png, public/favicon.ico');
