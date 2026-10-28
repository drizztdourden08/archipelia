/* @layer core @kind logic */
import type { InstalledGame, PackageSource, WorldOrigin, WorldTrust } from '@archipelia/model';

const recordedExtras = (packages: string[], sources: PackageSource[], trust?: WorldTrust, origin?: WorldOrigin): Partial<InstalledGame> => ({
  ...(packages.length > 0 ? { packages } : {}),
  ...(sources.length > 0 ? { sources } : {}),
  ...(trust ? { trust } : {}),
  ...(origin ? { origin } : {}),
});

export { recordedExtras };
