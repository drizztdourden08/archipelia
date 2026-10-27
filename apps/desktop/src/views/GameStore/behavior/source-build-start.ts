/* @layer renderer-app @kind logic */
import type { BuildStage } from '@archipelia/design';
import { appApi } from '../../../ipc/app-api';
import { buildStageOf } from './build-stage-of';
import { reasonOf } from './reason-of';
import { sourceToolPlan } from './source-tool-plan';
import { SOURCE_FAILURE } from './usePackageSource.constants';
import type { BuildStartRun } from './usePackageSource.type';

const sourceBuildStart = async ({ aim, state, build, install, finishing, setStep }: BuildStartRun): Promise<void> => {
  const { candidate, plan } = state;
  const at = (stage: BuildStage) => setStep({ kind: 'build', candidate, plan, stage });
  at({ kind: 'building', build });
  try {
    const built = await appApi().sourcesBuildStart({ buildId: build.buildId, archiveSha256: build.archiveSha256, tools: build.tools.map((tool) => tool.pin) });
    if (built.status === 'cancelled') return;
    if (built.status !== 'built') {
      if (built.status === 'missing') at({ kind: 'missing', build, missing: built.missing, log: built.log, tool: await sourceToolPlan(build, built.missing) });
      else at(buildStageOf(built, build));
      return;
    }
    at({ kind: 'built', build });
    const { request } = aim;
    await finishing(SOURCE_FAILURE.build, () => (!request || request.kind === 'official' ? Promise.resolve(undefined) : install({ ...request, wheels: [built.source.sha256] }, aim.key)));
  } catch (err) {
    at({ kind: 'failed', build: undefined, message: reasonOf(err, SOURCE_FAILURE.build), log: [] });
  }
};

export { sourceBuildStart };
