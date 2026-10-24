/* @layer core @kind logic */
import {
  ENGINE_DEFAULTS, ENGINE_DIR_ENV, markOffered, readActiveEngineStatus, readEngineState, resolvePythonRange, versionTag,
} from '@archipelia/engine';
import type { EngineEvent, EngineOverview, EngineStatus, StartupDecision } from '@archipelia/model';
import { engineEntries } from './engine-entries';
import type { EngineEnv, VersionSource } from '@archipelia/engine/install';
import { startupDecision } from '@archipelia/engine/install';

const createEngineReads = (env: EngineEnv, source: VersionSource, installing: () => boolean) => {
  const { root } = env;

  const status = async (): Promise<EngineStatus> => {
    const current = await readActiveEngineStatus(root);
    return installing() && current.state === 'missing' ? { ...current, state: 'building' } : current;
  };

  const overview = async (force = false): Promise<EngineOverview> => {
    const [state, feed] = await Promise.all([readEngineState(root), source.feed(force ? 'force' : 'auto')]);
    const [current, ranges, installed] = await Promise.all([status(), source.ranges(feed), engineEntries(env, state)]);
    const active = installed.find((engine) => engine.id === state.active);
    const latestAp = feed.releases[0]?.version;
    return { status: current, ...(active ? { active } : {}), installed, feed, tag: versionTag(feed, active), ...(latestAp ? { latestAp } : {}), ranges };
  };

  const announce = async (kind: EngineEvent['kind'], id: string) => {
    const current = await overview().catch(() => undefined);
    if (current) env.emit({ kind, id, overview: current });
  };

  const startup = async (): Promise<StartupDecision> => {
    if (process.env[ENGINE_DIR_ENV]) return { kind: 'none' };
    const [state, feed] = await Promise.all([readEngineState(root), source.feed('auto')]);
    return startupDecision({
      state, feed, target: env.target,
      rangeOf: (release) => source.rangeOf(release.version, release.tag)
        .catch(() => resolvePythonRange({ platform: env.platform, ap: release.version, defaults: ENGINE_DEFAULTS })),
    });
  };

  const offerShown = async (version: string) => {
    if (typeof version === 'string' && version !== '') await markOffered(root, version);
  };

  return { announce, offerShown, overview, startup, status };
};

export { createEngineReads };
