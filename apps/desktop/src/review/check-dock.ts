/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { LOBBY_STAGE } from './review.constants';

const docked = (tour: AppReviewTour, id: string): boolean =>
  tour.find(`[data-widget-id="${id}"], [data-drag-tab="${id}"]`) !== null;

const checkDock = (tour: AppReviewTour) => {
  const missing = LOBBY_STAGE.widgets.filter((id) => !docked(tour, id));
  tour.check('lobby-stage-dock', missing.length === 0, `the default layout docks ${LOBBY_STAGE.widgets.join(', ')} around the tab, as a frame or as a tab of its group`, `the default layout misses ${missing.join(', ')}`);
};

export { checkDock };
