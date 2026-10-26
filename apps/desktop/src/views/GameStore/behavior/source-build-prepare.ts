/* @layer renderer-app @kind logic */
import { jobs } from '@drizztdourden08/brock-react';
import { BUILD_JOB } from '@archipelia/model';
import { appApi } from '../../../ipc/app-api';
import { buildStageOf } from './build-stage-of';
import { reasonOf } from './reason-of';
import { SOURCE_FAILURE } from './usePackageSource.constants';
import type { BuildPrepareRun } from './usePackageSource.type';

const sourceBuildPrepare = async ({ aim, state, setStep }: BuildPrepareRun): Promise<void> => {
  const at = (stage: BuildPrepareRun['state']['stage']) => setStep({ ...state, stage });
  for (const id of Object.values(BUILD_JOB)) jobs.dismiss(id);
  at({ kind: 'preparing' });
  try {
    const made = await appApi().sourcesBuildPrepare({ owner: state.plan.owner, repo: state.plan.repo, module: aim.module, confirmed: true });
    if (made.status === 'cancelled') return;
    at(made.status === 'ready' ? { kind: 'ready', build: made.plan } : buildStageOf(made, undefined));
  } catch (err) {
    at({ kind: 'failed', build: undefined, message: reasonOf(err, SOURCE_FAILURE.build), log: [] });
  }
};

export { sourceBuildPrepare };
