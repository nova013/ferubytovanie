/**
 * Jediný zdroj pravdy pre všetky údaje o ubytovaní.
 * Všetky komponenty čítajú kontaktné údaje, cenu a fakty odtiaľto.
 */

const NBSP = ' ';

export const site = {
  name: 'Fér Bývanie',
  tagline: 'Ubytovanie · Bratislava – Dúbravka',

  phoneDisplay: `+421${NBSP}948${NBSP}717${NBSP}950`,
  phoneHref: 'tel:+421948717950',
  phoneE164: '+421948717950',

  email: 'zkgroupsro@gmail.com',
  emailHref: 'mailto:zkgroupsro@gmail.com',

  address: {
    street: 'Polianky 15',
    postalCode: `841${NBSP}01`,
    city: 'Bratislava',
    district: 'Dúbravka',
    countryCode: 'SK',
  },
  /** Jednoriadková adresa na zobrazenie. */
  addressLine: `Polianky 15, 841${NBSP}01 Bratislava – Dúbravka`,

  maps: {
    /** Trasa v Google Maps (otvorí navigáciu k adrese). */
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=Polianky+15%2C+841+01+Bratislava',
    /** Miesto v Google Maps. */
    placeUrl:
      'https://www.google.com/maps/search/?api=1&query=Polianky+15%2C+841+01+Bratislava',
    /** Vložená mapa (bez API kľúča). */
    embedUrl:
      'https://www.google.com/maps?q=Polianky+15%2C+841+01+Bratislava&z=16&hl=sk&output=embed',
  },

  price: {
    amount: 10,
    /** Zobrazená cena s pevnou medzerou pred symbolom meny. */
    display: `10${NBSP}€`,
    unit: 'za noc a lôžko',
  },

  facts: {
    rooms: 50,
    beds: 100,
    bedsPerRoom: '2 – 3',
    kitchens: 3,
    bathrooms: 3,
  },

  seo: {
    title: 'Fér Bývanie | Ubytovanie Bratislava – Dúbravka od 10 € / noc',
    description:
      'Cenovo dostupné ubytovanie v Bratislave – Dúbravke na Polianky 15. 50 izieb s 2 – 3 lôžkami, spoločné kuchyne a kúpeľne, Wi-Fi, práčky a parkovanie v cene. Už od 10 € za noc a lôžko. Zavolajte: +421 948 717 950.',
    ogImageAlt: 'Budova ubytovania Fér Bývanie na Polianky 15 v Bratislave – Dúbravke',
  },
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const nav: NavItem[] = [
  { label: 'Ubytovanie', href: '#ubytovanie' },
  { label: 'Vybavenie', href: '#vybavenie' },
  { label: 'Cenník', href: '#cennik' },
  { label: 'Fotogaléria', href: '#fotogaleria' },
  { label: 'Lokalita', href: '#lokalita' },
  { label: 'Kontakt', href: '#kontakt' },
];
