/* @layer core @kind logic */
import type { SourceBuildEnd } from '@archipelia/model';
import { stripPaths } from '@archipelia/engine';
import type { ActiveBuild, BuildDeps, BuildSession } from './build.type';

const endBuild = async (deps: BuildDeps, session: BuildSession, build: ActiveBuild, outcome: unknown): Promise<SourceBuildEnd> => {
  const cancelled = build.controller.signal.aborted;
  await session.close();
  if (cancelled) {
    deps.log?.('build: cancelled');
    return { status: 'cancelled' };
  }
  const message = stripPaths(outcome instanceof Error ? outcome.message : String(outcome)).slice(0, 400);
  deps.log?.(`build: failed: ${message}`);
  return { status: 'failed', message, log: [], retry: false };
};

export { endBuild };
