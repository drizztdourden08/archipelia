/* @layer core @kind logic */
import { REGISTRY_REFRESH_MS } from './registry.constants';

const registryIsFresh = (fetchedAt: number, now: number, force: boolean | undefined) =>
  force !== true && now - fetchedAt < REGISTRY_REFRESH_MS;

export { registryIsFresh };
