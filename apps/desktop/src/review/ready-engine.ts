/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import type { EngineStatus } from '@archipelia/model';
import { appApi } from '../ipc/app-api';

const readyEngine = async (tour: AppReviewTour): Promise<EngineStatus> => {
  const api = appApi();
  const status = await api.engineStatus();
  if (status.state === 'ready') return status;
  const built = await api.engineSetup();
  tour.check('engine-set-up', built.state === 'ready', 'the review set the engine up from nothing', `the engine set up ended ${built.state}: ${built.error ?? 'no error given'}`);
  return built;
};

export { readyEngine };
