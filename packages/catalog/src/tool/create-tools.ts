/* @layer core @kind logic */
import type { SourceBuildTool, SourceToolAsk, SourceToolEnd, SourceToolFound, SourceToolPlan, SourceToolStart } from '@archipelia/model';
import { CMAKE_PACKAGE } from './tool.constants';
import type { ToolDeps, ToolHost } from './tool.type';
import { detectTool } from './detect-tool';
import { parseToolAsk } from './parse-tool-ask';
import { parseToolId } from './parse-tool-id';
import { parseToolStart } from './parse-tool-start';
import { runToolInstall } from './run-tool-install';
import { toolKeyOf } from './tool-key-of';
import { toolPlanOf } from './tool-plan-of';
import { toolSpecOf } from './tool-spec-of';
import { BLOCKED_TEXT, TOOL_TEXT } from './tool-text.constants';

const createTools = (deps: ToolDeps) => {
  let granted: SourceBuildTool | undefined;
  let installing = false;

  const hostOf = async (): Promise<ToolHost> => deps.readHost(await deps.toolsDir());

  const foundOf = (ask: SourceToolAsk, host: ToolHost): Promise<SourceToolFound> => {
    if (toolKeyOf(ask.tool, host.platform) === 'cmake') return Promise.resolve(deps.hasTool(ask.buildId, CMAKE_PACKAGE) ? 'found' : 'missing');
    return detectTool(ask.tool, host, deps.probe);
  };

  const plan = async (raw: SourceToolAsk): Promise<SourceToolPlan> => {
    const ask = parseToolAsk(raw);
    const host = await hostOf();
    return toolPlanOf(ask.tool, host, await foundOf(ask, host));
  };

  const specOf = async (raw: unknown) => {
    const tool = parseToolId(raw);
    if (granted !== tool) throw new Error(TOOL_TEXT.notAsked);
    granted = undefined;
    return toolSpecOf(deps, tool, await hostOf());
  };

  const installOnce = async (start: SourceToolStart): Promise<SourceToolEnd> => {
    const host = await hostOf();
    const { install: offer, blocked } = toolPlanOf(start.tool, host, 'unknown');
    if (!offer) throw new Error(BLOCKED_TEXT[blocked ?? 'unsupported']);
    if (offer.command !== start.command) throw new Error(TOOL_TEXT.changed);
    deps.log?.(`tool: installing ${start.tool}: ${offer.command}`);
    if (toolKeyOf(start.tool, host.platform) === 'cmake') {
      return { status: 'done', after: 'check', found: 'found', log: [], plan: await deps.addTool(start.buildId, CMAKE_PACKAGE) };
    }
    granted = start.tool;
    return runToolInstall(deps, host, start, offer);
  };

  const install = async (raw: unknown): Promise<SourceToolEnd> => {
    const start = parseToolStart(raw);
    if (installing) throw new Error(TOOL_TEXT.busy);
    installing = true;
    try {
      return await installOnce(start);
    } finally {
      installing = false;
      granted = undefined;
    }
  };

  return { install, plan, specOf };
};

export { createTools };
