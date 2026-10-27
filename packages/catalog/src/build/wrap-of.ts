/* @layer core @kind logic */
import type { SourceBuildJob } from '@archipelia/model';
import type { SpawnWrap } from '@archipelia/engine';
import type { ActiveBuild, BuildDeps, BuildTools } from './build.type';

const wrapOf = async (deps: Pick<BuildDeps, 'sandbox'>, build: ActiveBuild, job: SourceBuildJob, tools: BuildTools = { path: [], rust: undefined }): Promise<SpawnWrap | undefined> => {
  const rust = tools.rust ? [tools.rust.cargo, tools.rust.rustup] : [];
  return (await deps.sandbox?.())?.confine({
    readOnly: [build.runtime.root, ...rust], readWrite: [build.dirs.work], network: job === 'tools' || job === 'crates' || (job === 'wheel' && build.rust), ...(tools.path.length > 0 ? { path: tools.path } : {}),
  });
};

export { wrapOf };
