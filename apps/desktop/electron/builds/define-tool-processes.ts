/* @layer electron-main @kind logic */
import type { ProcessJobs } from '@drizztdourden08/brock-electron/main';
import { TOOL_JOB } from '@archipelia/model';
import { parseToolId } from '@archipelia/catalog';
import { TOOL_ELEVATIONS, TOOL_LABEL, TOOL_SUCCESS_CODES, TOOL_TIMEOUT_MS } from './builds.constants';
import type { ToolSpecOf } from './define-tool-processes.type';

const defineToolProcesses = (processes: Pick<ProcessJobs, 'define'>, specOf: ToolSpecOf): void => {
  for (const elevation of TOOL_ELEVATIONS) {
    const id = TOOL_JOB[elevation];
    processes.define(id, {
      label: TOOL_LABEL[elevation],
      timeoutMs: TOOL_TIMEOUT_MS[elevation],
      successCodes: TOOL_SUCCESS_CODES,
      ...(elevation === 'system' ? { elevate: 'installer' as const, cancellable: true } : {}),
      parse: (raw) => ({ tool: parseToolId(raw) }),
      resolve: (args) => specOf(args),
    });
  }
};

export { defineToolProcesses };
