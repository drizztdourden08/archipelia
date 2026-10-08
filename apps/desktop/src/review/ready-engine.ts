/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import type { EngineStatus } from '@archipelia/model';
import { appApi } from '../ipc/app-api';
import { withHeartbeat } from './with-heartbeat';

const readyEngine = async (tour: AppReviewTour): Promise<EngineStatus> => {
  const api = appApi();
  const status = await api.engineStatus();
  if (status.state === 'ready') return status;
  const startedAt = Date.now();
  const built = await withHeartbeat(tour, api.engineSetup(), () => `the engine set up is running, ${Math.round((Date.now() - startedAt) / 1000)} s in`);
  tour.check('engine-set-up', built.state === 'ready', 'the review set the engine up from nothing', `the engine set up ended ${built.state}: ${built.error ?? 'no error given'}`);
  return built;
};

export { readyEngine };
