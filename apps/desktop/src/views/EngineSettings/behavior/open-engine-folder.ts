/* @layer renderer-app @kind logic */
import { requireHostApi, toast } from '@drizztdourden08/brock-react';
import { logFailure } from '../../../hooks/log-failure';
import { FAILURE } from '../EngineSettings.constants';

const openEngineFolder = async (dir: string): Promise<void> => {
  try {
    const result = await requireHostApi().openFolder(dir);
    if (!result.success) throw new Error(result.error);
  } catch (err) {
    logFailure(FAILURE.open, err);
    toast(FAILURE.open, { variant: 'danger' });
  }
};

export { openEngineFolder };
