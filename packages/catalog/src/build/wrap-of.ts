/* @layer core @kind logic */
import type { SourceBuildJob } from '@archipelia/model';
import type { SpawnWrap } from '@archipelia/engine';
import type { ActiveBuild, BuildDeps } from './build.type';

const wrapOf = async (deps: Pick<BuildDeps, 'sandbox'>, build: ActiveBuild, job: SourceBuildJob): Promise<SpawnWrap | undefined> =>
  (await deps.sandbox?.())?.confine({ readOnly: [build.runtime.root], readWrite: [build.dirs.work], network: job === 'tools' });

export { wrapOf };
