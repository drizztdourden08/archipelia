/* @layer renderer-app @kind logic */
import { appApi } from '../../../ipc/app-api';
import { buildStageOf } from './build-stage-of';
import { plannedStep } from './planned-step';
import { reasonOf } from './reason-of';
import { sourceToolPlan } from './source-tool-plan';
import { SOURCE_FAILURE } from './usePackageSource.constants';
import type { BuildStartRun } from './usePackageSource.type';

const sourceBuildStart = async ({ aim, state, build, install, setStep, close }: BuildStartRun): Promise<void> => {
  const at = (stage: BuildStartRun['state']['stage']) => setStep({ ...state, stage });
  at({ kind: 'building', build });
  try {
    const built = await appApi().sourcesBuildStart({ buildId: build.buildId, archiveSha256: build.archiveSha256, tools: build.tools.map((tool) => tool.pin) });
    if (built.status === 'cancelled') return;
    if (built.status !== 'built') {
      if (built.status === 'missing') at({ kind: 'missing', build, missing: built.missing, log: built.log, tool: await sourceToolPlan(build, built.missing) });
      else at(buildStageOf(built, build));
      return;
    }
    const { request } = aim;
    if (!request || request.kind === 'official') {
      setStep(plannedStep(state));
      return;
    }
    const installed = await install({ ...request, wheels: [built.source.sha256] }, aim.key);
    if (installed === true) close();
    else setStep(plannedStep(state));
  } catch (err) {
    at({ kind: 'failed', build: undefined, message: reasonOf(err, SOURCE_FAILURE.build), log: [] });
  }
};

export { sourceBuildStart };
