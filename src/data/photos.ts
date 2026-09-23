import type { ImageMetadata } from 'astro';

/**
 * Inventár všetkých fotografií ubytovania.
 *
 * Zdrojové súbory sú v priečinku `Photos/` (originály z telefónu, prevažne HEIC).
 * Skript `npm run photos:convert` ich prevedie do `src/assets/photos/<nazov>.jpg`
 * a Astro z nich pri builde generuje optimalizované AVIF/WebP varianty.
 *
 * `npm run photos:verify` kontroluje, že každá fotografia z `Photos/`
 * je v tomto inventári a je použitá na webe.
 */

export type PhotoCategoryId = 'exterier' | 'izby' | 'kuchyne' | 'kupelne' | 'spolocne';

export interface PhotoCategory {
  id: PhotoCategoryId;
  label: string;
}

export const categories: PhotoCategory[] = [
  { id: 'exterier', label: 'Exteriér' },
  { id: 'izby', label: 'Izby' },
  { id: 'kuchyne', label: 'Kuchyne' },
  { id: 'kupelne', label: 'Kúpeľne' },
  { id: 'spolocne', label: 'Spoločné priestory' },
];

interface PhotoInput {
  /** Názov súboru bez prípony – zhodný s originálom v priečinku `Photos/`. */
  file: string;
  category: PhotoCategoryId;
  /** Popis obrázka pre čítačky obrazovky a vyhľadávače. */
  alt: string;
  /** Krátky popis zobrazený v zväčšenom náhľade. */
  caption: string;
}

export interface Photo extends PhotoInput {
  src: ImageMetadata;
  orientation: 'landscape' | 'portrait';
}

const inventory: PhotoInput[] = [
  // Exteriér
  {
    file: 'main-building',
    category: 'exterier',
    alt: 'Budova ubytovania Fér Bývanie na ulici Polianky 15 v Bratislave – Dúbravke s parkoviskom pred vchodom',
    caption: 'Budova ubytovania a parkovisko pred vchodom',
  },
  {
    file: 'main-building-1',
    category: 'exterier',
    alt: 'Pohľad na budovu Fér Bývanie z parkoviska',
    caption: 'Pohľad na budovu z parkoviska',
  },
  {
    file: 'main-building-2',
    category: 'exterier',
    alt: 'Budova ubytovania, parkovisko a vstupná brána',
    caption: 'Budova, parkovisko a vstupná brána',
  },
  {
    file: 'main-building-3',
    category: 'exterier',
    alt: 'Vstup do budovy s prístreškom, lavičkou a zeleňou v gabiónových kvetináčoch',
    caption: 'Vstup do budovy',
  },

  // Izby
  {
    file: 'three-room',
    category: 'izby',
    alt: 'Trojlôžková izba s tromi lôžkami, skriňou, chladničkou a stolom so stoličkami',
    caption: 'Trojlôžková izba',
  },
  {
    file: 'two-room-1',
    category: 'izby',
    alt: 'Dvojlôžková izba s dvoma posteľami, nočnými stolíkmi a oknom',
    caption: 'Dvojlôžková izba',
  },
  {
    file: 'two-room',
    category: 'izby',
    alt: 'Dvojlôžková izba so skriňou, chladničkou, stolom a dvoma posteľami',
    caption: 'Dvojlôžková izba so stolom a skriňou',
  },

  // Kuchyne
  {
    file: 'kitchen',
    category: 'kuchyne',
    alt: 'Spoločná kuchyňa s kuchynskou linkou, varnými platňami, mikrovlnkou, stolmi a sedačkou',
    caption: 'Spoločná kuchyňa so sedením',
  },
  {
    file: 'kitchen-1',
    category: 'kuchyne',
    alt: 'Spoločná kuchyňa s drevenou kuchynskou linkou, drezom a stolmi',
    caption: 'Spoločná kuchyňa',
  },
  {
    file: 'kitchen-2',
    category: 'kuchyne',
    alt: 'Spoločná kuchyňa s jedálenskými stolmi, rúrou a mikrovlnkou',
    caption: 'Spoločná kuchyňa s jedálenskými stolmi',
  },

  // Kúpeľne
  {
    file: 'showers',
    category: 'kupelne',
    alt: 'Sprchovacie kúty so sklenenými dverami v spoločnej kúpeľni',
    caption: 'Sprchovacie kúty',
  },
  {
    file: 'showers-1',
    category: 'kupelne',
    alt: 'Sprchovací kút so sprchou v spoločnej kúpeľni',
    caption: 'Sprchovací kút',
  },
  {
    file: 'showers-2',
    category: 'kupelne',
    alt: 'Spoločná kúpeľňa so sprchovacími kútmi a práčkou',
    caption: 'Kúpeľňa s práčkou',
  },
  {
    file: 'sinks',
    category: 'kupelne',
    alt: 'Rad umývadiel so zrkadlami v spoločnej kúpeľni',
    caption: 'Umývadlá v spoločnej kúpeľni',
  },
  {
    file: 'sink',
    category: 'kupelne',
    alt: 'Umývadlo so zrkadlom v spoločnej kúpeľni',
    caption: 'Umývadlo so zrkadlom',
  },
  {
    file: 'toilets',
    category: 'kupelne',
    alt: 'Toaletné kabínky v spoločnej kúpeľni',
    caption: 'Toaletné kabínky',
  },
  {
    file: 'toilet',
    category: 'kupelne',
    alt: 'Toaleta v samostatnej kabínke',
    caption: 'Toaleta',
  },
  {
    file: 'urinals',
    category: 'kupelne',
    alt: 'Pisoáre v spoločnej kúpeľni',
    caption: 'Pisoáre',
  },

  // Spoločné priestory
  {
    file: 'hallway',
    category: 'spolocne',
    alt: 'Chodba s dverami do izieb, rohožami pred dverami a hasiacim prístrojom',
    caption: 'Chodba k izbám',
  },
  {
    file: 'stairs',
    category: 'spolocne',
    alt: 'Schodisko v budove s presvetlením zo sklobetónu',
    caption: 'Schodisko',
  },
  {
    file: 'stairs-1',
    category: 'spolocne',
    alt: 'Schodisko so zábradlím medzi podlažiami',
    caption: 'Schodisko medzi podlažiami',
  },
];

const files = import.meta.glob<ImageMetadata>('../assets/photos/*.jpg', {
  eager: true,
  import: 'default',
});

function resolveImage(file: string): ImageMetadata {
  const key = `../assets/photos/${file}.jpg`;
  const image = files[key];
  if (!image) {
    throw new Error(
      `Fotografia „${file}.jpg“ sa nenašla v src/assets/photos. Spustite „npm run photos:convert“.`,
    );
  }
  return image;
}

export const photos: Photo[] = inventory.map((item) => {
  const src = resolveImage(item.file);
  return {
    ...item,
    src,
    orientation: src.width >= src.height ? 'landscape' : 'portrait',
  };
});

/** Vráti fotografiu podľa názvu súboru (bez prípony). */
export function photo(file: string): Photo {
  const found = photos.find((p) => p.file === file);
  if (!found) throw new Error(`Fotografia „${file}“ nie je v inventári (src/data/photos.ts).`);
  return found;
}

export function countByCategory(id: PhotoCategoryId): number {
  return photos.filter((p) => p.category === id).length;
}
