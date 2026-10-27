/* @layer core @kind logic */
import { delimiter, join } from 'node:path';
import type { SourceBuildJob } from '@archipelia/model';
import type { BuildSpec } from '@archipelia/engine';
import type { ActiveBuild, BuildDeps, BuildTools } from './build.type';
import { buildToolsOf } from './build-tools-of';
import { CARGO_HOME_DIR } from './build.constants';
import { wrapOf } from './wrap-of';

const homesOf = (tools: BuildTools, build: ActiveBuild): Record<string, string> => {
  if (!tools.rust) return {};
  return { CARGO_HOME: join(build.dirs.work, CARGO_HOME_DIR), RUSTUP_HOME: tools.rust.rustup };
};

const openEnv = (env: Record<string, string>, tools: BuildTools): Record<string, string> => {
  const path = [...tools.path, process.env.PATH ?? ''].filter((part) => part !== '').join(delimiter);
  return tools.path.length > 0 ? { ...env, PATH: path } : env;
};

const confineBuild = async (deps: Pick<BuildDeps, 'sandbox' | 'toolsDir'>, build: ActiveBuild, job: SourceBuildJob, spec: BuildSpec): Promise<BuildSpec> => {
  const tools = await buildToolsOf(deps, build, job);
  const wrap = await wrapOf(deps, build, job, tools);
  const env = { ...spec.env, ...homesOf(tools, build) };
  if (!wrap) return { ...spec, env: openEnv(env, tools) };
  const wrapped = wrap({ file: spec.command, args: spec.args, cwd: spec.cwd, env });
  const confined: Record<string, string> = {};
  for (const [name, value] of Object.entries(wrapped.env)) if (value !== undefined) confined[name] = value;
  return { command: wrapped.file, args: wrapped.args, cwd: wrapped.cwd, env: confined };
};

export { confineBuild };
