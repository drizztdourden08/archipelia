/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { SESSIONS_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { isFree } from './is-free';
import { named } from './named';
import { waitText } from './wait-text';

const checkEditedSession = async (tour: AppReviewTour, edited: string, stacked: boolean) => {
  const root = () => tour.find(SELECTOR.layer);
  const changed = await waitText(tour, SESSIONS_UI.unsaved, root);
  tour.check('layout-unsaved', changed, `the setup of ${edited} counts its unsaved changes`, `the setup of ${edited} does not count its changes`);
  const once = named(tour, SELECTOR.button, SESSIONS_UI.once, root() ?? undefined);
  tour.check('layout-once', isFree(once), 'the edited session offers Run once with these changes', 'Run once with these changes is missing or off');
  await tour.capture(stacked ? 'detail' : 'split');
};

export { checkEditedSession };
