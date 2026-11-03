/* @layer core @kind logic */
import type { InstalledGame, PackageSource } from '@archipelia/model';
import type { Extras } from './recorded-extras.type';

const recordedExtras = (packages: string[], sources: PackageSource[], { trust, origin, release, playerFile }: Extras): Partial<InstalledGame> => ({
  ...(packages.length > 0 ? { packages } : {}),
  ...(sources.length > 0 ? { sources } : {}),
  ...(trust ? { trust } : {}),
  ...(origin ? { origin } : {}),
  ...(release ? { release } : {}),
  ...(playerFile ? { playerFile } : {}),
});

export { recordedExtras };
