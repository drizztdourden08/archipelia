/* @layer core @kind logic */
import type { FallbackParams, RegistryLoad } from './load-registry.type';

const registryFallback = ({ stored, floor, error }: FallbackParams): RegistryLoad => {
  const problems = [error instanceof Error ? error.message : String(error)];
  if (stored) return { registry: stored.registry, source: 'cache', fetchedAt: stored.cache.fetchedAt, problems };
  return { registry: floor(), source: 'floor', fetchedAt: null, problems };
};

export { registryFallback };
