/* @layer core @kind types */
import type { EngineDefaults } from './engine-defaults.type';
import type { FeedStore } from './feed-cache.type';
import type { FetchLike } from './fetch-like.type';

type RangeRequest = {
  fetch: FetchLike;
  store: FeedStore;
  commit: string;
  ap: string;
  platform: string;
  defaults: EngineDefaults;
};

export type { RangeRequest };
