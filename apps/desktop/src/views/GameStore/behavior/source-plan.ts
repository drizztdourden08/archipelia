/* @layer renderer-app @kind logic */
import { appApi } from '../../../ipc/app-api';
import { reasonOf } from './reason-of';
import { SOURCE_FAILURE } from './usePackageSource.constants';
import type { PlanRun } from './usePackageSource.type';

const sourcePlan = async ({ aim, candidate, setStep }: PlanRun): Promise<void> => {
  setStep({ kind: 'planning', candidate });
  try {
    const plan = await appApi().sourcesPlan({ owner: candidate.owner, repo: candidate.repo, module: aim.module });
    setStep({ kind: 'plan', candidate, plan, checking: false, stillMissing: false, installing: false });
  } catch (err) {
    setStep({ kind: 'failed', message: reasonOf(err, SOURCE_FAILURE.plan) });
  }
};

export { sourcePlan };
