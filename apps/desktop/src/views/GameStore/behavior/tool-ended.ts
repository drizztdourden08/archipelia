/* @layer renderer-app @kind logic */
import type { BuildStage } from '@archipelia/design';
import { sourceBuildStart } from './source-build-start';
import { TOOL_RESULT } from './usePackageSource.constants';
import type { ToolEndRun } from './usePackageSource.type';

const toolEnded = async ({ run, end }: ToolEndRun): Promise<void> => {
  const { state, build, missing, log, tool, setStep } = run;
  const at = (stage: BuildStage) => setStep({ kind: 'build', candidate: state.candidate, plan: state.plan, stage });
  if (end.status === 'cancelled') return at({ kind: 'missing', build, missing, log, tool });
  if (end.status === 'failed') return at({ kind: 'failed', build, message: end.message, log: end.log });
  const next = end.plan ?? build;
  if (end.after === 'check') return sourceBuildStart({ ...run, build: next });
  return at({ kind: 'paused', build: next, message: TOOL_RESULT[end.after], log: end.log });
};

export { toolEnded };
