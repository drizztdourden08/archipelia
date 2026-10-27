/* @layer core @kind logic */
import type { SourceToolAfter, SourceToolEnd, SourceToolFound, SourceToolInstall, SourceToolStart } from '@archipelia/model';
import { stripPaths } from '@archipelia/engine';
import { MAX_LOG_LINES } from '../build/build.constants';
import { RESTART_CODE } from './tool.constants';
import type { ToolDeps, ToolHost } from './tool.type';
import { detectTool } from './detect-tool';
import { toolKeyOf } from './tool-key-of';
import { TOOL_TEXT } from './tool-text.constants';

const afterOf = (key: string | undefined, code: number | null, found: SourceToolFound): SourceToolAfter => {
  if (code === RESTART_CODE) return 'restart';
  return key === 'xcode' && found !== 'found' ? 'dialog' : 'check';
};

const runToolInstall = async (deps: ToolDeps, host: ToolHost, start: SourceToolStart, install: SourceToolInstall): Promise<SourceToolEnd> => {
  if (!deps.run) throw new Error(TOOL_TEXT.desktopOnly);
  const run = await deps.run(install.elevation, start.tool);
  deps.log?.(`tool: ${start.tool} install ${run.status}${run.code === null ? '' : ` with code ${run.code}`}`);
  if (run.status === 'cancelled') return { status: 'cancelled' };
  const log = run.lines.slice(-MAX_LOG_LINES).map(stripPaths);
  const key = toolKeyOf(start.tool, host.platform);
  const found = await detectTool(start.tool, host, deps.probe);
  const apple = key === 'xcode' && found === 'found';
  if (run.status !== 'done' && !apple) return { status: 'failed', message: run.error ? stripPaths(run.error).slice(0, 300) : TOOL_TEXT.failed, log };
  return { status: 'done', after: afterOf(key, run.code, found), found, log };
};

export { runToolInstall };
