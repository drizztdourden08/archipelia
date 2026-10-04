/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { ENGINE_DIR_ENV, readEngineStatus } from '@archipelia/engine';
import { buildEngine } from '@archipelia/engine-bundle';
import type { EngineStatus } from '@archipelia/model';
import { ENGINE_JOB } from '../../src/jobs/jobs.constants';
import { engineDirOf } from './engine-dir-of';
import { engineRoot } from './engine-root';
import { ENGINE_JOB_TITLE, ENGINE_STEPS } from './engine-steps.constants';

const setUpEngine = async (ctx: MainContext): Promise<EngineStatus> => {
  const dir = engineDirOf(ctx);
  if (process.env[ENGINE_DIR_ENV]) return { ...(await readEngineStatus(dir)), error: `${ENGINE_DIR_ENV} points at an engine managed outside the app` };
  const job = ctx.job(ENGINE_JOB, ENGINE_STEPS, { title: ENGINE_JOB_TITLE, cancellable: false });
  try {
    await buildEngine({ buildDir: engineRoot(ctx), onLine: (line) => job.log(line), onStep: (step, line) => job.step(step, line), onSkip: (step) => job.skip(step) });
    const status = await readEngineStatus(dir);
    if (status.state === 'ready') job.done(`Archipelago ${status.apVersion} is ready`);
    else job.fail(status.error ?? 'the engine did not load after the set up');
    return status;
  } catch (err) {
    job.fail(err);
    ctx.log(`engine setup failed: ${(err as Error).message}`, 'error');
    return { state: 'failed', dir, error: (err as Error).message };
  }
};

export { setUpEngine };
