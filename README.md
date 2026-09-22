# Fér Bývanie – webová stránka

Jednostránkový web ubytovania **Fér Bývanie**, Polianky 15, 841 01 Bratislava – Dúbravka.

Postavené na [Astro](https://astro.build) (statický výstup, bez servera), s vlastným
optimalizovaním fotografií (AVIF/WebP, responzívne veľkosti, lazy loading) a písmom
Manrope hosťovaným priamo na webe (bez načítavania z Google Fonts).

## Spustenie

```bash
npm install
npm run dev        # vývojový server na http://localhost:4321
npm run build      # produkčný build do priečinka dist/
npm run preview    # náhľad produkčného buildu
```

Nasadenie: nahrajte obsah priečinka `dist/` na ľubovoľný statický hosting
(Netlify, Vercel, Cloudflare Pages, klasický webhosting cez FTP…).

**Pred nasadením** nastavte skutočnú doménu v `astro.config.mjs` (`site`) – používa sa
pre canonical URL, Open Graph obrázok a štruktúrované dáta.

## Fotografie

Originály (HEIC/PNG z telefónu) sú v priečinku `Photos/`. Web ich nepoužíva priamo:

```bash
npm run photos:convert   # Photos/*.HEIC|PNG  →  src/assets/photos/*.jpg
npm run photos:verify    # skontroluje, že každá fotografia z Photos/ je použitá na webe
```

Po pridaní novej fotografie:

1. skopírujte ju do `Photos/`,
2. spustite `npm run photos:convert`,
3. doplňte ju do inventára `src/data/photos.ts` (kategória, slovenský popis),
4. spustite `npm run build` a `npm run photos:verify`.

## Kde čo upraviť

| Čo                                        | Kde                        |
| ----------------------------------------- | -------------------------- |
| Telefón, e‑mail, adresa, cena, počty      | `src/data/site.ts`         |
| Fotografie, kategórie, popisy (alt texty) | `src/data/photos.ts`       |
| Texty jednotlivých sekcií                 | `src/components/*.astro`   |
| Farby, typografia, tlačidlá               | `src/styles/global.css`    |
| SEO (title, description, schema.org)      | `src/layouts/Base.astro`   |
| Ikony (favicon)                           | `public/favicon.svg` + `node scripts/make-icons.mjs` |
