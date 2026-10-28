/* @layer core @kind logic */
import type { RegistryGame } from '@archipelia/trust';
import { STANDARD_MANIFEST } from '../first-party/first-party.constants';
import type { ManifestAsset, ReleaseSummary } from './versions.type';

const manifestAssetOf = ({ assets }: ReleaseSummary, game: RegistryGame | undefined): ManifestAsset | undefined => {
  const standard = assets.find((asset) => asset.name === STANDARD_MANIFEST);
  if (standard) return { ...standard, standard: true };
  const legacy = assets.find((asset) => asset.name === game?.release.manifest);
  return legacy ? { ...legacy, standard: false } : undefined;
};

export { manifestAssetOf };
