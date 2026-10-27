/* @layer core @kind logic */
import { mkdir } from 'node:fs/promises';
import type { SourceBuildTool } from '@archipelia/model';
import type { ToolDeps, ToolHost, ToolRecipe, ToolSpec } from './tool.type';
import type { Installer } from './installer.type';
import { prepareBootstrapper } from './prepare-bootstrapper';
import { prepareRustup } from './prepare-rustup';
import { recheckInstaller } from './recheck-installer';
import { recipeOf } from './recipe-of';
import { rustHomesOf } from './rust-homes-of';
import { BLOCKED_TEXT, TOOL_TEXT } from './tool-text.constants';

const plain = (host: ToolHost, recipe: ToolRecipe, command: string, env: Record<string, string> = {}): ToolSpec => ({ command, args: recipe.args, cwd: host.toolsDir, env });

const installerFile = async (deps: ToolDeps, host: ToolHost, installer: Installer, signed: boolean): Promise<string> => {
  await recheckInstaller(deps.probe, host, installer, signed);
  return installer.file;
};

const rustEnv = (host: ToolHost): Record<string, string> => {
  const homes = rustHomesOf(host.toolsDir);
  return { CARGO_HOME: homes.cargo, RUSTUP_HOME: homes.rustup, RUSTUP_INIT_SKIP_PATH_CHECK: 'yes' };
};

const specOfRecipe = async (deps: ToolDeps, host: ToolHost, recipe: ToolRecipe): Promise<ToolSpec> => {
  switch (recipe.kind) {
    case 'bootstrapper':
      return plain(host, recipe, await installerFile(deps, host, await prepareBootstrapper(deps, host), true));
    case 'rustup':
      return plain(host, recipe, await installerFile(deps, host, await prepareRustup(deps, host), false), rustEnv(host));
    case 'pip':
      throw new Error(TOOL_TEXT.noPip);
    case 'winget':
    case 'pkexec':
    case 'xcode':
      return plain(host, recipe, recipe.file);
  }
};

const toolSpecOf = async (deps: ToolDeps, tool: SourceBuildTool, host: ToolHost): Promise<ToolSpec> => {
  const pick = recipeOf(tool, host);
  if ('blocked' in pick) throw new Error(BLOCKED_TEXT[pick.blocked]);
  await mkdir(host.toolsDir, { recursive: true });
  return specOfRecipe(deps, host, pick.recipe);
};

export { toolSpecOf };
