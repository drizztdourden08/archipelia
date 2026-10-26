/* @layer core @kind logic */
import type { SourcePlan, SourceBuildPrepared } from '@archipelia/model';
import { resolvePackages, venvPython } from '@archipelia/engine';
import type { BuildDeps, BuildSession } from './build.type';
import { buildPlanOf } from './build-plan-of';
import { assertPinsHashed } from './assert-pins-hashed';
import { isConfined } from './is-confined';
import { downloadArchive } from './download-archive';
import { endBuild } from './end-build';
import { openBuild } from './open-build';
import { parseBuildRequires } from './parse-build-requires';
import { readArchiveFile } from './read-archive-file';
import { runStep } from './run-step';
import { PYPROJECT } from './build.constants';

const prepareBuild = async (deps: BuildDeps, session: BuildSession, plan: SourcePlan): Promise<SourceBuildPrepared> => {
  const build = await openBuild(deps, session, plan);
  const { dirs, controller, runtime } = build;
  try {
    const site = { owner: plan.owner, repo: plan.repo, sha: plan.pin.sha };
    const archive = await downloadArchive(site, deps.fetch, { dir: dirs.work, signal: controller.signal });
    build.archive = archive;
    deps.log?.(`build: downloaded ${archive.size} bytes, sha256 ${archive.sha256}`);
    const requires = parseBuildRequires(await readArchiveFile(archive.file, PYPROJECT));
    const stopped = await runStep(deps, build, 'venv');
    if (stopped) {
      await session.close();
      return stopped;
    }
    build.pins = await resolvePackages({ ...runtime, python: venvPython(dirs.venv) }, requires, { signal: controller.signal });
    assertPinsHashed(build.pins);
    build.phase = 'ready';
    return { status: 'ready', plan: buildPlanOf(build, archive, await isConfined(deps, build)) };
  } catch (err) {
    return endBuild(deps, session, build, err);
  }
};

export { prepareBuild };
