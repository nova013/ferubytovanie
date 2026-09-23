/**
 * Automatická kontrola vygenerovaného webu (dist/index.html).
 * Spustenie po builde: `node scripts/qa.mjs`
 */
import { readFile, access, stat, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const html = await readFile(path.join(DIST, 'index.html'), 'utf8');
const exists = (f) => access(f).then(() => true, () => false);

const results = [];
const check = (name, ok, detail = '') => results.push({ kontrola: name, výsledok: ok ? 'OK' : 'CHYBA', detail });

// 1. Odkazy na súbory (obrázky, CSS, JS) – žiadne nefunkčné cesty
const refs = new Set();
for (const m of html.matchAll(/(?:src|href|srcset|content)="([^"]+)"/g)) {
  for (const part of m[1].split(',')) {
    const url = part.trim().split(/\s+/)[0];
    if (url.startsWith('/') && !url.startsWith('//')) refs.add(url.split('#')[0].split('?')[0]);
  }
}
for (const m of html.matchAll(/data-full="([^"]+)"/g)) refs.add(m[1]);
const missing = [];
for (const ref of refs) if (ref !== '/' && !(await exists(path.join(DIST, decodeURIComponent(ref))))) missing.push(ref);
check('Žiadne nefunkčné lokálne odkazy', missing.length === 0, `${refs.size} odkazov, chýba: ${missing.join(', ') || '0'}`);

// 2. Telefónne a e-mailové odkazy
const tels = [...html.matchAll(/href="(tel:[^"]*)"/g)].map((m) => m[1]);
check('Všetky tel: odkazy = tel:+421948717950', tels.length > 0 && tels.every((t) => t === 'tel:+421948717950'), `${tels.length} odkazov`);
const mails = [...html.matchAll(/href="(mailto:[^"]*)"/g)].map((m) => m[1]);
check('Všetky mailto: odkazy správne', mails.length > 0 && mails.every((t) => t === 'mailto:zkgroupsro@gmail.com'), `${mails.length} odkazov`);

// 3. Obrázky – alt text, rozmery
const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
const content = imgs.filter((i) => !i.includes('id="lightbox-img"'));
const noAlt = content.filter((i) => !/\balt="[^"]+"/.test(i));
const noDims = content.filter((i) => !/\bwidth="\d+"/.test(i) || !/\bheight="\d+"/.test(i));
check('Každý obrázok má alt text', noAlt.length === 0, `${content.length} obrázkov`);
check('Každý obrázok má width/height (bez posunu rozloženia)', noDims.length === 0);
const first = content[0] || '';
check(
  'Prvý obrázok = main-building, eager + fetchpriority=high',
  /main-building\./.test(first) && /loading="eager"/.test(first) && /fetchpriority="high"/.test(first),
);
const lazy = content.slice(1).filter((i) => /loading="lazy"/.test(i)).length;
check('Ostatné obrázky sa načítavajú lazy', lazy === content.length - 1, `${lazy}/${content.length - 1}`);

// 4. Viditeľný text – fakty a jazyk
const visible = html
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;| /g, ' ')
  .replace(/‑/g, '-')
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ');
const attrText = [...html.matchAll(/\b(?:alt|aria-label|title|content|placeholder|data-caption)="([^"]*)"/g)]
  .map((m) => m[1].replace(/ /g, ' ').replace(/‑/g, '-'))
  .join(' | ');
const all = `${visible} ${attrText}`;

const facts = {
  'Fér Bývanie': /Fér Bývanie/,
  'Polianky 15': /Polianky 15/,
  '841 01 Bratislava – Dúbravka': /841 01 Bratislava – Dúbravka/,
  '+421 948 717 950': /\+421 948 717 950/,
  'zkgroupsro@gmail.com': /zkgroupsro@gmail\.com/,
  '10 € za noc a lôžko': /10 € za noc a lôžko/,
  '50 izieb': /50 izieb/,
  '2 – 3 lôžka': /2 – 3 lôžk/,
  '100 lôžok': /100 lôžok/,
  '3 spoločné kuchyne': /3 spoločné kuchyne/,
  '3 spoločné kúpeľne': /3 spoločné kúpeľne/,
  'Wi-Fi': /Wi-Fi/,
  'parkovanie': /[Pp]arkovanie/,
  'práčky': /[Pp]ráčk/,
  'zákaz zvierat': /Domáce zvieratá nie sú povolené/,
  'kamerový systém': /kamerovým systémom/,
  'Kaufland 500 m': /Kaufland[^.]{0,40}500 m/,
  'autoumyváreň v areáli': /autoumyváreň/i,
  'autoservis v areáli': /autoservis/i,
  'pneuservis v areáli': /pneuservis/i,
  'text o službách v areáli': /Počas pobytu môžete využiť služby priamo v našom areáli/,
  'záverečná veta o službách': /Pohodlné ubytovanie, praktické služby a všetko na jednom mieste\./,
};
const missingFacts = Object.entries(facts).filter(([, re]) => !re.test(all)).map(([k]) => k);
check('Všetky požadované fakty sú na stránke', missingFacts.length === 0, missingFacts.join(', '));

const forbidden = /\b(luxusn|prémiov|exkluzív|recenzi|hodnoteni|raňajk|klimatiz|recepci|nonstop|24\/7|Lorem|ipsum)\w*/gi;
const forbiddenHits = [...new Set((all.match(forbidden) || []).map((s) => s.toLowerCase()))];
check('Žiadne vymyslené služby / výplňový text', forbiddenHits.length === 0, forbiddenHits.join(', '));

// „menu“ je bežné slovenské slovo, preto nie je v zozname.
const english = /\b(the|and|with|your|call us|book now|gallery|contact|close|next|previous|loading|read more|click|photo|price|rooms?|welcome|home|about|open|view)\b/gi;
const englishHits = [...new Set((all.match(english) || []).map((s) => s.toLowerCase()))];
check('Žiadne anglické slová v texte a atribútoch', englishHits.length === 0, englishHits.join(', '));
check('Jazyk dokumentu = sk', /<html[^>]*lang="sk"/.test(html));

// 5. SEO
check('Cena je pevná – nikde „od 10 €“', !/\bod 10 €/i.test(all));
check('<title>', /<title>Fér Bývanie \| Ubytovanie Bratislava – Dúbravka za 10 € \/ noc<\/title>/.test(html));
check('meta description', /<meta name="description" content="[^"]{120,}"/.test(html));
check('Open Graph title/description', /og:title/.test(html) && /og:description/.test(html));
check('JSON-LD LodgingBusiness', /"@type":"LodgingBusiness"/.test(html));

// 6. Mapa – poloha podľa súradníc budovy (textová adresa v Google ukazuje zlú budovu)
const COORDS = /48\.176901(?:,|%2C)17\.060359/;
const iframeSrc = (html.match(/<iframe[^>]*src="([^"]+)"/) || [])[1] || '';
const mapLinks = [...html.matchAll(/href="(https:\/\/www\.google\.com\/maps[^"]*)"/g)].map((m) => m[1]);
check('Mapa ukazuje na súradnice budovy', COORDS.test(iframeSrc), iframeSrc.slice(0, 70));
check(
  'Všetky odkazy na Google Maps smerujú na súradnice',
  mapLinks.length > 0 && mapLinks.every((l) => COORDS.test(l)),
  `${mapLinks.length} odkazov`,
);
check('JSON-LD obsahuje súradnice', /"latitude":48\.176901,"longitude":17\.060359/.test(html));
const h1 = (html.match(/<h1\b/g) || []).length;
check('Práve jeden H1', h1 === 1, `${h1}`);

// 7. Veľkosť
const assets = path.join(DIST, '_astro');
let total = 0;
for (const f of await readdir(assets)) total += (await stat(path.join(assets, f))).size;
const htmlKb = Math.round(Buffer.byteLength(html) / 1024);
check('Veľkosť HTML', htmlKb < 200, `${htmlKb} kB, všetky súbory v _astro spolu ${(total / 1024 / 1024).toFixed(1)} MB`);

console.table(results);
const failed = results.filter((r) => r.výsledok !== 'OK').length;
if (failed) {
  console.error(`${failed} kontrol zlyhalo.`);
  process.exit(1);
}
console.log('Všetky kontroly prešli.');
