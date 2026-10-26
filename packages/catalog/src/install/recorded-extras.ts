/* @layer core @kind logic */
import type { InstalledGame, PackageSource, WorldTrust } from '@archipelia/model';

const recordedExtras = (packages: string[], sources: PackageSource[], trust?: WorldTrust): Partial<InstalledGame> => ({
  ...(packages.length > 0 ? { packages } : {}),
  ...(sources.length > 0 ? { sources } : {}),
  ...(trust ? { trust } : {}),
});

export { recordedExtras };
