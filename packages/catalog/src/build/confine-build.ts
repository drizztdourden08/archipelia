/* @layer core @kind logic */
import type { SourceBuildJob } from '@archipelia/model';
import type { BuildSpec } from '@archipelia/engine';
import type { ActiveBuild, BuildDeps } from './build.type';
import { wrapOf } from './wrap-of';

const confineBuild = async (deps: Pick<BuildDeps, 'sandbox'>, build: ActiveBuild, job: SourceBuildJob, spec: BuildSpec): Promise<BuildSpec> => {
  const wrap = await wrapOf(deps, build, job);
  if (!wrap) return spec;
  const wrapped = wrap({ file: spec.command, args: spec.args, cwd: spec.cwd, env: spec.env });
  const env: Record<string, string> = {};
  for (const [name, value] of Object.entries(wrapped.env)) if (value !== undefined) env[name] = value;
  return { command: wrapped.file, args: wrapped.args, cwd: wrapped.cwd, env };
};

export { confineBuild };
