/* @layer renderer-app @kind logic */
import { jobs, toast } from '@drizztdourden08/brock-react';
import type { Session } from '@archipelia/model';
import { appApi } from '../ipc/app-api';
import { runJobId } from '../jobs/run-job-id';

const showRunJob = async (run: Session): Promise<void> => {
  try {
    await appApi().sessionsShowJob(run.id);
    jobs.open(runJobId(run.id));
  } catch (err) {
    toast(`The log of ${run.snapshot.name} did not open: ${(err as Error).message}`, { variant: 'danger' });
  }
};

export { showRunJob };
