/* @layer core @kind logic */
import type { Registry } from '@archipelia/trust';
import { isRelease } from './is-release';
import type { ReadyRepo } from './ready.type';
import { sameName } from './same-name';

const isImpostor = (registry: Registry, repo: ReadyRepo): boolean =>
  registry.games.some((game) => sameName(game.release.repo, repo.fullName) && !isRelease(game.release, repo));

export { isImpostor };
