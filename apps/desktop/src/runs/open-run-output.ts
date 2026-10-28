/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import type { Session } from '@archipelia/model';
import { appApi } from '../ipc/app-api';

const openRunOutput = async (run: Session): Promise<void> => {
  try {
    await appApi().sessionsOpenOutput(run.id);
  } catch (err) {
    toast(`The output folder of ${run.snapshot.name} did not open: ${(err as Error).message}`, { variant: 'danger' });
  }
};

export { openRunOutput };
