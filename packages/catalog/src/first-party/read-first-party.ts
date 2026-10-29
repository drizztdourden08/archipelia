/* @layer core @kind logic */
import { loadRegistry } from '@archipelia/trust';
import type { LoadRegistryOptions } from '@archipelia/trust';
import { mapPool } from '../pool';
import { createReleaseReader } from '../versions/create-release-reader';
import { firstPartyEntry } from './first-party-entry';
import { MANIFEST_CONCURRENCY } from './first-party.constants';
import type { FirstPartyDeps, FirstPartyRead } from './first-party.type';
import type { GameState } from './read-game-state.type';
import { readGameState } from './read-game-state';
import { withPrerelease } from './with-prerelease';

const NONE: GameState = { state: { kind: 'none' } };

const failed = ({ state }: GameState, game: string) => (state.kind === 'failed' ? [`${game}: ${state.message}`] : []);

const readFirstParty = async (deps: FirstPartyDeps, options: LoadRegistryOptions = {}): Promise<FirstPartyRead> => {
  const load = await loadRegistry(deps, options);
  const request = deps.fetch ?? fetch;
  const readReleases = deps.readReleases ?? createReleaseReader(deps);
  const states = await mapPool(load.registry.games, MANIFEST_CONCURRENCY, (game) => readGameState(game, request, readReleases));
  return {
    entries: load.registry.games.map((game, i) => {
      const { state, prerelease } = states[i] ?? NONE;
      return withPrerelease(firstPartyEntry(game, state, prerelease), prerelease);
    }),
    clients: load.registry.clients,
    registry: load.registry,
    problems: [...load.problems, ...load.registry.games.flatMap((game, i) => failed(states[i] ?? NONE, game.game))],
    source: load.source,
  };
};

export { readFirstParty };
