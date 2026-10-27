/* @layer core @kind logic */
import type { SourceBuildJob, SourceBuildRequest, SourcePlan } from '@archipelia/model';
import type { BuildDeps } from './build.type';
import { addBuildTool } from './add-build-tool';
import { buildSpecOf } from './build-spec-of';
import { createBuildSession } from './create-build-session';
import { prepareBuild } from './prepare-build';
import { runBuild } from './run-build';

const createBuilds = (deps: BuildDeps) => {
  const session = createBuildSession((message) => deps.log?.(message));
  return {
    prepare: (plan: SourcePlan) => prepareBuild(deps, session, plan),
    build: (request: SourceBuildRequest) => runBuild(deps, session, request),
    cancel: (): void => {
      const build = session.current();
      build?.controller.abort();
      if (build?.phase === 'ready') void session.close();
    },
    specOf: (job: SourceBuildJob, raw: unknown) => buildSpecOf(deps, session, job, raw),
    hasTool: (id: string, name: string): boolean => {
      const build = session.current();
      return build?.id === id && build.pins.some((pin) => pin.name.toLowerCase() === name);
    },
    addTool: (id: string, name: string) => addBuildTool(deps, session, id, name),
    dispose: () => session.close(),
  };
};

export { createBuilds };
