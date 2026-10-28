/* @layer core @kind logic */
import type { Registry } from '@archipelia/trust';
import type { ReadyRepo } from './ready.type';

const isBlocked = (registry: Registry, repo: ReadyRepo): boolean => registry.blocked.some((entry) => entry.repoId === repo.id);

export { isBlocked };
