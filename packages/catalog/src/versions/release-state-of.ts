/* @layer core @kind logic */
import type { RegistryGame } from '@archipelia/trust';
import type { ReleaseState } from '../first-party/first-party.type';
import { legacyState } from '../first-party/legacy-state';
import { stateOfManifest } from '../ready/state-of-manifest';
import type { ManifestAsset } from './versions.type';

const releaseStateOf = (manifest: Record<string, unknown> | null, asset: ManifestAsset, game: RegistryGame | undefined): ReleaseState => {
  if (manifest === null) return { kind: 'none' };
  if (asset.standard || !game) return stateOfManifest(manifest, game);
  try {
    return legacyState(game)(manifest);
  } catch (error) {
    return { kind: 'failed', message: error instanceof Error ? error.message : String(error) };
  }
};

export { releaseStateOf };
