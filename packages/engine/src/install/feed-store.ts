/* @layer core @kind logic */
import type { FeedCache, FeedStore } from '../index';
import type { DataFiles } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import { FEED_FILE } from './feed-store.constants';

const isFeedCache = (value: unknown): value is FeedCache =>
  isRecord(value) && value.version === 1 && typeof value.fetchedAt === 'number' && typeof value.target === 'string'
  && Array.isArray(value.releases) && Array.isArray(value.python) && isRecord(value.ranges);

const createFeedStore = (files: DataFiles): FeedStore => {
  let tail: Promise<unknown> = Promise.resolve();

  const read = async () => {
    const stored = await files.readJson<unknown>(FEED_FILE, null).catch(() => null);
    return isFeedCache(stored) ? stored : undefined;
  };

  const write = (cache: FeedCache) => {
    const run = tail.then(async () => {
      const current = await read();
      await files.writeJson(FEED_FILE, { ...cache, ranges: { ...current?.ranges, ...cache.ranges } });
    });
    tail = run.catch(() => undefined);
    return run;
  };

  return { read, write };
};

export { createFeedStore };
