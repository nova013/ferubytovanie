// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // TODO: Pred nasadením nahraďte skutočnou doménou webu.
  // Používa sa pre canonical URL, Open Graph obrázok a štruktúrované dáta (schema.org).
  site: 'https://www.ferbyvanie.sk',
  output: 'static',
  trailingSlash: 'ignore',
  compressHTML: true,
  devToolbar: { enabled: false },
  build: {
    inlineStylesheets: 'auto',
  },
});
