/* @layer core @kind logic */
import { loadRegistry } from '@archipelia/trust';
import type { LoadRegistryDeps, LoadRegistryOptions } from '@archipelia/trust';
import { mapPool } from '../pool';
import { firstPartyEntry } from './first-party-entry';
import { MANIFEST_CONCURRENCY } from './first-party.constants';
import type { FirstPartyRead, ReleaseState } from './first-party.type';
import { readReleaseState } from './read-release-state';

const failed = (state: ReleaseState, game: string) => (state.kind === 'failed' ? [`${game}: ${state.message}`] : []);

const readFirstParty = async (deps: LoadRegistryDeps, options: LoadRegistryOptions = {}): Promise<FirstPartyRead> => {
  const load = await loadRegistry(deps, options);
  const request = deps.fetch ?? fetch;
  const states = await mapPool(load.registry.games, MANIFEST_CONCURRENCY, (game) => readReleaseState(game, request));
  return {
    entries: load.registry.games.map((game, i) => firstPartyEntry(game, states[i] ?? { kind: 'none' })),
    clients: load.registry.clients,
    problems: [...load.problems, ...load.registry.games.flatMap((game, i) => failed(states[i] ?? { kind: 'none' }, game.game))],
    source: load.source,
  };
};

export { readFirstParty };
