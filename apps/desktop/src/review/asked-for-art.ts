/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { useEnrichStore } from '../views/GameStore/behavior/useEnrichStore';

const askedForArt = async (tour: AppReviewTour): Promise<boolean> =>
  (await tour.waitFor(() => (Object.keys(useEnrichStore.getState().asked).length > 0 ? true : null))) === true;

export { askedForArt };
