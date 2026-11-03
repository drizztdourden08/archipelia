/* @layer core @kind types */
import type { InstalledRelease, PlayerFile, WorldOrigin, WorldTrust } from '@archipelia/model';

type Extras = { trust?: WorldTrust | undefined; origin?: WorldOrigin | undefined; release?: InstalledRelease | undefined; playerFile?: PlayerFile | undefined };

export type { Extras };
