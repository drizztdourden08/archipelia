/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import type { ReleaseState } from '../first-party/first-party.type';
import { listedEntry } from '../first-party/listed-entry';
import type { ReadyRepo } from './ready.type';

const readyEntry = (repo: ReadyRepo, state: ReleaseState): CatalogEntry | undefined => {
  if (state.kind !== 'found' && state.kind !== 'builds') return undefined;
  const { game, module } = state.manifest;
  if (!module) return undefined;
  const entry = listedEntry({
    module, game, displayName: game, home: `https://github.com/${repo.fullName}`, tags: [], repo: repo.fullName, world: '', bundle: '',
  }, state);
  return {
    ...entry,
    discovered: {
      repoId: repo.id, repo: repo.fullName, owner: repo.owner, stars: repo.stars, pushedAt: repo.pushedAt, createdAt: repo.createdAt, direct: repo.direct,
    },
  };
};

export { readyEntry };
