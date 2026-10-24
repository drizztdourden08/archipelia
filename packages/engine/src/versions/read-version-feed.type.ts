/* @layer core @kind types */
import type { EngineDefaults } from './engine-defaults.type';
import type { FeedStore } from './feed-cache.type';
import type { FetchLike } from './fetch-like.type';

type FeedMode = 'auto' | 'force' | 'cache-only';

type FeedRequest = {
  fetch: FetchLike;
  store: FeedStore;
  now: number;
  mode: FeedMode;
  target: string;
  defaults: EngineDefaults;
};

export type { FeedMode, FeedRequest };
