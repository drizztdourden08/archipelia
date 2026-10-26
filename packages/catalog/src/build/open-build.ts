/* @layer core @kind logic */
import { randomUUID } from 'node:crypto';
import { mkdir, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { SourcePlan } from '@archipelia/model';
import { buildDirsOf, readRuntime } from '@archipelia/engine';
import type { ActiveBuild, BuildDeps, BuildSession } from './build.type';
import { BUILD_TEXT } from './build-text.constants';
import { BUILD_PREFIX } from './build.constants';
import { sweepBuilds } from './sweep-builds';

const openBuild = async (deps: BuildDeps, session: BuildSession, plan: SourcePlan): Promise<ActiveBuild> => {
  if (session.current()?.phase === 'building') throw new Error(BUILD_TEXT.busy);
  await session.close();
  const runtime = await readRuntime(await deps.engineDir());
  void sweepBuilds().catch(() => undefined);
  const dirs = buildDirsOf(await mkdtemp(join(tmpdir(), BUILD_PREFIX)));
  await Promise.all([mkdir(dirs.scratch), mkdir(dirs.out)]);
  const build: ActiveBuild = { id: randomUUID(), plan, runtime, dirs, controller: new AbortController(), phase: 'preparing', used: false, pins: [] };
  session.open(build);
  deps.log?.(`build: preparing ${plan.owner}/${plan.repo} at ${plan.pin.sha}`);
  return build;
};

export { openBuild };
