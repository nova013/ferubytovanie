/**
 * Fotografie z priečinka `Photos/`, ktoré sa na webe zámerne nepoužívajú.
 * Skript `photos:convert` ich neprevádza a `photos:verify` ich nekontroluje.
 * Názvy súborov sa porovnávajú bez ohľadu na veľké a malé písmená.
 */
export const EXCLUDED_PHOTOS = [
  // Poštové schránky – majiteľ požiadal 23. 9. 2026 o ich odstránenie z webu.
  'mailbox.jpg',
];

export const isExcluded = (fileName) =>
  EXCLUDED_PHOTOS.some((name) => name.toLowerCase() === fileName.toLowerCase());
