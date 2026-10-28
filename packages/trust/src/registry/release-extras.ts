/* @layer core @kind logic */
import { isRepoId } from './is-repo-id';
import { RELEASE_KIND_BUILDS } from './parse-release.constants';
import type { RegistryRelease } from './registry.type';

const isKnown = (repoId: unknown, kind: unknown): boolean =>
  (repoId === undefined || isRepoId(repoId)) && (kind === undefined || kind === RELEASE_KIND_BUILDS);

const releaseExtras = (repoId: unknown, kind: unknown): Pick<RegistryRelease, 'repoId' | 'kind'> | null => {
  if (!isKnown(repoId, kind)) return null;
  return {
    ...(isRepoId(repoId) ? { repoId } : {}),
    ...(kind === RELEASE_KIND_BUILDS ? { kind: RELEASE_KIND_BUILDS } : {}),
  };
};

export { releaseExtras };
