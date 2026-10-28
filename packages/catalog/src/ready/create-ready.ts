/* @layer core @kind logic */
import type { Registry } from '@archipelia/trust';
import { createReadySearch } from './create-ready-search';
import { NO_STATE } from './create-ready.constants';
import type { ReadyRead } from './create-ready.type';
import { isBlocked } from './is-blocked';
import { isListed } from './is-listed';
import { readReadyStates } from './read-ready-states';
import { readyEntry } from './ready-entry';
import type { ReadySearchDeps } from './ready.type';

const createReady = (deps: ReadySearchDeps) => {
  const { files, fetch: request = fetch, now = Date.now } = deps;
  const search = createReadySearch(deps);

  return async (force: boolean, registry: Registry): Promise<ReadyRead> => {
    const found = await search(force);
    const wanted = found.repos.filter((repo) => !isBlocked(registry, repo) && !isListed(registry, repo));
    const states = await readReadyStates({ files, request, now: now(), force, all: found.repos, wanted });
    const candidates = wanted.flatMap((repo) => {
      const entry = readyEntry(repo, states.get(repo.id) ?? NO_STATE);
      return entry ? [{ repo, entry }] : [];
    });
    return { search: found, candidates };
  };
};

export { createReady };
