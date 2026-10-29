/* @layer core @kind logic */
import type { RegistryGame } from '@archipelia/trust';
import type { ReleasesRead } from '../versions/versions.type';
import type { GameState } from './read-game-state.type';
import { prereleaseTag } from './prerelease-tag';
import { readReleaseState } from './read-release-state';

const readGameState = async (game: RegistryGame, request: typeof fetch, readReleases: (repo: string) => Promise<ReleasesRead>): Promise<GameState> => {
  const state = await readReleaseState(game, request);
  if (state.kind !== 'none') return { state };
  const tag = await prereleaseTag(readReleases, game.release.repo).catch(() => undefined);
  return tag === undefined ? { state } : { state: await readReleaseState(game, request, tag), prerelease: tag };
};

export { readGameState };
