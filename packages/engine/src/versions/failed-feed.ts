/* @layer core @kind logic */
import type { VersionFeed } from '@archipelia/model';
import { buildFeed } from './build-feed';
import type { EngineDefaults } from './engine-defaults.type';
import type { FeedCache } from './feed-cache.type';
import { FeedError } from './feed-error';

const failedFeed = (err: unknown, cache: FeedCache | undefined, defaults: EngineDefaults, target: string): VersionFeed => {
  const error = (err as Error).message;
  if (err instanceof FeedError && err.kind === 'rate-limited') {
    return { ...buildFeed(cache, 'rate-limited', defaults, target), error, ...(err.retryAt ? { retryAt: err.retryAt } : {}) };
  }
  return { ...buildFeed(cache, 'offline', defaults, target), error };
};

export { failedFeed };
