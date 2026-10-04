/* @layer renderer-app @kind logic */
import { requireHostApi, toast } from '@drizztdourden08/brock-react';
import { DOMAIN } from '../../../storage/domains.constants';
import { logFailure } from '../../../hooks/log-failure';
import { FAILURE } from '../EngineSettings.constants';

const openEngineFolder = async (): Promise<void> => {
  try {
    const result = await requireHostApi().revealDataDomain(DOMAIN.engine);
    if (!result.success) throw new Error(result.error);
  } catch (err) {
    logFailure(FAILURE.open, err);
    toast(FAILURE.open, { variant: 'danger' });
  }
};

export { openEngineFolder };
