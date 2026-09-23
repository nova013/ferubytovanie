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

  /**
   * Presná poloha budovy (od majiteľa, Google Maps „Polianky 3091“).
   * Google podľa textovej adresy „Polianky 15“ ukazuje nesprávnu budovu,
   * preto všetky mapové odkazy používajú súradnice.
   */
  geo: {
    latitude: 48.176901,
    longitude: 17.060359,
  },

  maps: {
    /** Trasa v Google Maps (otvorí navigáciu k budove). */
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=48.176901%2C17.060359',
    /** Miesto v Google Maps. */
    placeUrl: 'https://www.google.com/maps/search/?api=1&query=48.176901%2C17.060359',
    /** Vložená mapa (bez API kľúča). */
    embedUrl: 'https://www.google.com/maps?q=48.176901,17.060359&z=17&hl=sk&output=embed',
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

  /** Areál a okolie – údaje od majiteľa. */
  area: {
    kauflandDistance: `500${NBSP}m`,
  },

  /** Služby priamo v areáli – texty od majiteľa. */
  services: [
    { icon: 'droplets', title: 'Autoumyváreň', text: 'Doprajte svojmu autu čistotu.' },
    { icon: 'wrench', title: 'Autoservis', text: 'Drobné opravy a servis.' },
    { icon: 'tire', title: 'Pneuservis', text: 'Prezutie a starostlivosť o pneumatiky.' },
  ],

  seo: {
    title: 'Fér Bývanie | Ubytovanie Bratislava – Dúbravka za 10 € / noc',
    description:
      'Cenovo dostupné ubytovanie v Bratislave – Dúbravke na ulici Polianky 15. 50 izieb s 2 – 3 lôžkami, spoločné kuchyne a kúpeľne, Wi-Fi, práčky a parkovanie v cene. 10 € za noc a lôžko. Kaufland 500 m. Zavolajte: +421 948 717 950.',
    ogImageAlt: 'Budova ubytovania Fér Bývanie na ulici Polianky 15 v Bratislave – Dúbravke',
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
