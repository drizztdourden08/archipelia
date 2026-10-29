/* @layer core @kind logic */
import type { Registry } from '@archipelia/trust';
import { NONE } from '../first-party/read-first-party.constants';
import { withPrerelease } from '../first-party/with-prerelease';
import { createReleaseReader } from '../versions/create-release-reader';
import { createReadySearch } from './create-ready-search';
import type { ReadyRead } from './create-ready.type';
import { isBlocked } from './is-blocked';
import { isListed } from './is-listed';
import { readReadyStates } from './read-ready-states';
import { readyEntry } from './ready-entry';
import type { ReadySearchDeps } from './ready.type';

const createReady = (deps: ReadySearchDeps) => {
  const { files, fetch: request = fetch, now = Date.now } = deps;
  const search = createReadySearch(deps);
  const readReleases = deps.readReleases ?? createReleaseReader(deps);

  return async (force: boolean, registry: Registry): Promise<ReadyRead> => {
    const found = await search(force);
    const wanted = found.repos.filter((repo) => !isBlocked(registry, repo) && !isListed(registry, repo));
    const states = await readReadyStates({ files, request, now: now(), force, all: found.repos, wanted, readReleases });
    const candidates = wanted.flatMap((repo) => {
      const { state, prerelease } = states.get(repo.id) ?? NONE;
      const entry = readyEntry(repo, state, prerelease);
      return entry ? [{ repo, entry: withPrerelease(entry, prerelease) }] : [];
    });
    return { search: found, candidates };
  };
};

export { createReady };
