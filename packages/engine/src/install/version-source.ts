/* @layer core @kind logic */
import { ENGINE_DEFAULTS, fetchTagCommit, readPythonRange, readVersionFeed, resolvePythonRange } from '../index';
import type { FeedMode } from '../index';
import type { EngineStateFile, PythonRange, VersionFeed } from '@archipelia/model';
import type { EngineEnv, VersionSource } from './engine-service.type';

const createVersionSource = (env: EngineEnv): VersionSource => {
  const feed = (mode: FeedMode) =>
    readVersionFeed({ fetch: env.fetch, store: env.feedStore, now: Date.now(), mode, target: env.target, defaults: ENGINE_DEFAULTS });

  const rangeOf = (ap: string, ref: string) =>
    readPythonRange({ fetch: env.fetch, store: env.feedStore, commit: ref, ap, platform: env.platform, defaults: ENGINE_DEFAULTS });

  const cachedRange = async (ap: string, ref: string): Promise<PythonRange | undefined> =>
    (await env.feedStore.read())?.ranges[`${ref}:${env.platform}`]
    ?? (ap === ENGINE_DEFAULTS.defaultAp.version ? resolvePythonRange({ platform: env.platform, ap, defaults: ENGINE_DEFAULTS }) : undefined);

  const ranges = async (current: VersionFeed) => {
    const online = current.state === 'fresh' || current.state === 'cached';
    const pairs = await Promise.all(current.releases.map(async ({ version, tag }) => {
      const range = await (online ? rangeOf(version, tag) : cachedRange(version, tag)).catch(() => undefined);
      return [version, range] as const;
    }));
    return Object.fromEntries(pairs.filter((pair): pair is readonly [string, PythonRange] => pair[1] !== undefined));
  };

  const commitOf = async (ap: string, state: EngineStateFile) => {
    if (ap === ENGINE_DEFAULTS.defaultAp.version) return ENGINE_DEFAULTS.defaultAp.commit;
    const kept = state.installed.find((engine) => engine.ap === ap && engine.apCommit !== '');
    if (kept) return kept.apCommit;
    const release = (await feed('cache-only')).releases.find((entry) => entry.version === ap);
    return fetchTagCommit(env.fetch, release?.tag ?? ap);
  };

  return { feed, rangeOf, ranges, commitOf };
};

export { createVersionSource };
