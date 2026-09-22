// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Doména webu sa nastavuje pri builde premennou prostredia SITE_URL,
  // napr. SITE_URL=https://www.vasadomena.sk npm run build
  // Používa sa pre canonical URL, absolútnu adresu Open Graph obrázka a štruktúrované dáta.
  // Bez nej sa canonical a og:url nevygenerujú (web funguje, len bez týchto SEO značiek).
  site: process.env.SITE_URL || undefined,
  output: 'static',
  trailingSlash: 'ignore',
  compressHTML: true,
  devToolbar: { enabled: false },
  build: {
    inlineStylesheets: 'auto',
  },
});
