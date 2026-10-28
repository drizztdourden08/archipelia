/* @layer core @kind logic */
import type { RegistryGame } from '@archipelia/trust';
import { MAX_MANIFEST_BYTES, STANDARD_MANIFEST } from './first-party.constants';
import type { ReleaseState } from './first-party.type';
import type { Classify } from './read-release-state.type';
import { legacyState } from './legacy-state';
import { readReleaseAsset } from './read-release-asset';
import { releaseUrl } from './release-url';
import { standardState } from './standard-state';

const readState = async (url: string, request: typeof fetch, classify: Classify): Promise<ReleaseState> => {
  try {
    const manifest = await readReleaseAsset(url, request, MAX_MANIFEST_BYTES);
    return manifest === null ? { kind: 'none' } : classify(manifest);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { kind: 'failed', message: message.startsWith(url) ? message : `${url}: ${message}` };
  }
};

const isUsable = (state: ReleaseState): boolean => state.kind === 'found' || state.kind === 'builds';

const readReleaseState = async (game: RegistryGame, request: typeof fetch, tag?: string): Promise<ReleaseState> => {
  const { repo, manifest } = game.release;
  const standard = await readState(releaseUrl(repo, STANDARD_MANIFEST, tag), request, (value) => standardState(value, game));
  if (isUsable(standard)) return standard;
  const legacy = await readState(releaseUrl(repo, manifest, tag), request, legacyState(game));
  return standard.kind === 'failed' && legacy.kind === 'none' ? standard : legacy;
};

export { readReleaseState };
