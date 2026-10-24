/* @layer core @kind logic */
import type { FeedState, VersionFeed } from '@archipelia/model';
import { compareVersions } from './compare-versions';
import type { EngineDefaults } from './engine-defaults.type';
import type { FeedCache } from './feed-cache.type';
import { withPinnedPython } from './with-pinned-python';

const buildFeed = (cache: FeedCache | undefined, state: FeedState, defaults: EngineDefaults, target: string): VersionFeed => ({
  state,
  ...(cache ? { checkedAt: cache.fetchedAt } : {}),
  releases: (cache?.releases ?? []).filter((release) => compareVersions(release.version, defaults.minAp) >= 0),
  python: withPinnedPython(cache?.python ?? [], defaults, target),
});

export { buildFeed };
