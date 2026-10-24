/* @layer core @kind logic */
import type { VersionFeed } from '@archipelia/model';
import { buildFeed } from './build-feed';
import { failedFeed } from './failed-feed';
import type { FeedCache } from './feed-cache.type';
import { FORCE_GAP_MS, HOUR_MS } from './feed-sources.constants';
import { fetchPythonBuilds } from './fetch-python-builds';
import { fetchReleases } from './fetch-releases';
import type { FeedRequest } from './read-version-feed.type';

const refresh = async ({ fetch, store, now, target }: FeedRequest, cache: FeedCache | undefined): Promise<FeedCache> => {
  const [releases, python] = await Promise.all([fetchReleases(fetch, cache?.etag), fetchPythonBuilds(fetch, target)]);
  const list = releases.kind === 'ok' ? releases.releases : cache?.releases;
  if (!list) throw new Error('Archipelago releases: not modified without a cache');
  const etag = releases.kind === 'ok' ? releases.etag : cache?.etag;
  const next: FeedCache = {
    version: 1,
    fetchedAt: now,
    target,
    ...(etag ? { etag } : {}),
    releases: list,
    pythonRelease: python.release,
    python: python.builds,
    ranges: cache?.ranges ?? {},
  };
  await store.write(next);
  return next;
};

const readVersionFeed = async (request: FeedRequest): Promise<VersionFeed> => {
  const { store, now, mode, target, defaults } = request;
  const stored = await store.read();
  const cache = stored?.target === target ? stored : undefined;
  if (mode === 'cache-only') return buildFeed(cache, cache ? 'cached' : 'never', defaults, target);
  const window = mode === 'force' ? FORCE_GAP_MS : defaults.feedTtlHours * HOUR_MS;
  if (cache && now - cache.fetchedAt < window) return buildFeed(cache, 'cached', defaults, target);
  try {
    return buildFeed(await refresh(request, cache), 'fresh', defaults, target);
  } catch (err) {
    return failedFeed(err, cache, defaults, target);
  }
};

export { readVersionFeed };
