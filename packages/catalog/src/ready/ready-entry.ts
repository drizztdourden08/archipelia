/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import type { ReleaseState } from '../first-party/first-party.type';
import { listedEntry } from '../first-party/listed-entry';
import { cleanName } from './clean-name';
import type { ReadyRepo } from './ready.type';

const readyEntry = (repo: ReadyRepo, state: ReleaseState, tag?: string): CatalogEntry | undefined => {
  if (state.kind !== 'found' && state.kind !== 'builds') return undefined;
  const { module } = state.manifest;
  const game = cleanName(state.manifest.game);
  if (!module || game === '') return undefined;
  const entry = listedEntry({
    module, game, displayName: game, home: `https://github.com/${repo.fullName}`, tags: [], repo: repo.fullName, world: '', bundle: '',
  }, state, tag);
  return {
    ...entry,
    discovered: {
      repoId: repo.id, repo: repo.fullName, owner: repo.owner, stars: repo.stars, pushedAt: repo.pushedAt, createdAt: repo.createdAt, direct: repo.direct,
    },
  };
};

export { readyEntry };
