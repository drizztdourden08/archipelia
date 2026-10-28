/* @layer core @kind logic */
import type { Registry } from '@archipelia/trust';
import { isRelease } from './is-release';
import type { ReadyRepo } from './ready.type';

const isListed = (registry: Registry, repo: ReadyRepo): boolean => registry.games.some((game) => isRelease(game.release, repo));

export { isListed };
