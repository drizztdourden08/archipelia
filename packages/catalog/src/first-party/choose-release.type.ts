/* @layer core @kind types */
import type { CatalogVersion } from '@archipelia/model';

type ChosenRelease = { target: CatalogVersion; bundleUrl?: string };

export type { ChosenRelease };
