/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { LOBBY_STAGE } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { named } from './named';

const labelOf = (id: string): string => `${id.charAt(0).toUpperCase()}${id.slice(1)}`;

const docked = (tour: AppReviewTour, id: string): boolean =>
  tour.find(`[data-widget-id="${id}"]`) !== null || named(tour, SELECTOR.tab, new RegExp(`^${labelOf(id)}\\b`)) !== null;

const checkDock = (tour: AppReviewTour) => {
  const missing = LOBBY_STAGE.widgets.filter((id) => !docked(tour, id));
  tour.check('lobby-stage-dock', missing.length === 0, `the default layout docks ${LOBBY_STAGE.widgets.join(', ')} around the tab`, `the default layout misses ${missing.join(', ')}`);
};

export { checkDock };
