/* @layer core @kind logic */
import type { StartJob } from '@drizztdourden08/brock-core/jobs';
import { ENGINE_JOB } from '@archipelia/model';
import { SWITCH_JOB_TITLE, SWITCH_STEPS } from './engine-steps.constants';
import type { InstallDeps } from './install-engine.type';
import { switchEngine } from './switch-engine';

const runSwitchJob = async (startJob: StartJob, deps: InstallDeps, id: string): Promise<void> => {
  const job = startJob(ENGINE_JOB, SWITCH_STEPS, { title: SWITCH_JOB_TITLE, cancellable: false });
  try {
    const target = await deps.runtimeOf(id);
    const from = await deps.active();
    job.step('worlds', 'Carrying your worlds');
    const pass = await switchEngine(deps, { id, since: 0, ...(from ? { from } : {}) });
    pass?.problems.forEach((problem) => job.log(`${problem.game} did not carry over: ${problem.reason}`, 'warn'));
    job.step('switch');
    job.done(`Archipelago ${target.apVersion} is now the engine`);
  } catch (err) {
    job.fail(err);
    throw err;
  }
};

export { runSwitchJob };
