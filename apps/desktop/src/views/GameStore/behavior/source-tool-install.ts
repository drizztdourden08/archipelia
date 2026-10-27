/* @layer renderer-app @kind logic */
import { jobs } from '@drizztdourden08/brock-react';
import { TOOL_JOB } from '@archipelia/model';
import { appApi } from '../../../ipc/app-api';
import { reasonOf } from './reason-of';
import { toolEnded } from './tool-ended';
import { SOURCE_FAILURE } from './usePackageSource.constants';
import type { ToolInstallRun } from './usePackageSource.type';

const sourceToolInstall = async (run: ToolInstallRun): Promise<void> => {
  const { state, build, tool, setStep } = run;
  const offer = tool.install;
  if (!offer) return;
  for (const id of Object.values(TOOL_JOB)) jobs.dismiss(id);
  setStep({ ...state, stage: { kind: 'installing', build, tool } });
  try {
    const end = await appApi().sourcesToolInstall({ tool: tool.tool, buildId: build.buildId, command: offer.command, confirmed: true });
    await toolEnded({ run, end });
  } catch (err) {
    setStep({ ...state, stage: { kind: 'failed', build, message: reasonOf(err, SOURCE_FAILURE.tool), log: [] } });
  }
};

export { sourceToolInstall };
