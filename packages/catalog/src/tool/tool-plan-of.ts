/* @layer core @kind logic */
import type { SourceBuildTool, SourceToolFound, SourceToolPlan } from '@archipelia/model';
import { OS_OF } from './tool.constants';
import type { ToolHost } from './tool.type';
import { howOf } from './how-of';
import { recipeOf } from './recipe-of';

const toolPlanOf = (tool: SourceBuildTool, host: ToolHost, found: SourceToolFound): SourceToolPlan => {
  const pick = recipeOf(tool, host);
  const base: SourceToolPlan = { tool, os: OS_OF[host.platform] ?? 'other', found, how: howOf(tool, host, pick), distro: host.distro?.name };
  if ('blocked' in pick) return { ...base, blocked: pick.blocked };
  const { shown, size, source, elevation, restart } = pick.recipe;
  return { ...base, install: { command: shown, size, source, elevation, restart } };
};

export { toolPlanOf };
