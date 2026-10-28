/* @layer core @kind types */
import type { CatalogEntry } from '@archipelia/model';
import type { RegistryGame } from '@archipelia/trust';
import type { ManifestAsset, ReleaseSummary } from './versions.type';

type CheckParams = {
  entry: CatalogEntry;
  game: RegistryGame | undefined;
  ap: string | undefined;
  release: ReleaseSummary;
  asset: ManifestAsset | undefined;
  builds: string[];
  manifest: Record<string, unknown> | null | undefined;
  checked: boolean;
};

export type { CheckParams };
