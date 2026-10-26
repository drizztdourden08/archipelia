/* @layer core @kind logic */
import { writeFile } from 'node:fs/promises';
import type { SourceBuildRequest, SourceBuilt } from '@archipelia/model';
import type { ActiveBuild, Archive, BuildDeps, BuildSession } from './build.type';
import { BUILD_TEXT } from './build-text.constants';
import { endBuild } from './end-build';
import { keepForRetry } from './keep-for-retry';
import { readAcceptedArchive } from './read-accepted-archive';
import { resetBuild } from './reset-build';
import { runStep } from './run-step';
import { storeBuiltWheel } from './store-built-wheel';
import { toolsFileOf } from './tools-file-of';
import { unpackArchive } from './unpack-archive';

const readyBuild = (session: BuildSession, id: string): { build: ActiveBuild; archive: Archive } => {
  const build = session.current();
  if (build?.id !== id || build.phase !== 'ready' || build.archive === undefined) throw new Error(BUILD_TEXT.none);
  return { build, archive: build.archive };
};

const makeWheel = async (deps: BuildDeps, build: ActiveBuild) => {
  if (build.pins.length > 0) {
    await writeFile(build.dirs.tools, toolsFileOf(build.pins), 'utf8');
    const stopped = await runStep(deps, build, 'tools');
    if (stopped) return stopped;
  }
  return runStep(deps, build, 'wheel');
};

const runBuild = async (deps: BuildDeps, session: BuildSession, request: SourceBuildRequest): Promise<SourceBuilt> => {
  const { build, archive } = readyBuild(session, request.buildId);
  try {
    const bytes = await readAcceptedArchive(build, archive, request);
    const again = build.used;
    await resetBuild(build, again);
    build.phase = 'building';
    build.used = true;
    deps.log?.(`build: accepted ${build.pins.length} build tools for source sha256 ${archive.sha256}`);
    const remade = again ? await runStep(deps, build, 'venv') : undefined;
    if (remade) return await keepForRetry(session, build, remade);
    deps.log?.(`build: unpacked ${await unpackArchive(bytes, build.dirs.src)} files`);
    const stopped = await makeWheel(deps, build);
    if (stopped) return await keepForRetry(session, build, stopped);
    const source = await storeBuiltWheel(build, archive.sha256);
    deps.log?.(`build: built ${source.name} ${source.version}, wheel sha256 ${source.sha256}`);
    await session.close();
    return { status: 'built', source };
  } catch (err) {
    return endBuild(deps, session, build, err);
  }
};

export { runBuild };
