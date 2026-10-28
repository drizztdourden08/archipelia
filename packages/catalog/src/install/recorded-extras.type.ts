/* @layer core @kind types */
import type { InstalledRelease, WorldOrigin, WorldTrust } from '@archipelia/model';

type Extras = { trust?: WorldTrust | undefined; origin?: WorldOrigin | undefined; release?: InstalledRelease | undefined };

export type { Extras };
