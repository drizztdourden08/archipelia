/* @layer renderer-app @kind logic */
import { defineReviewStep, widgets } from '@drizztdourden08/brock-react';
import { REVIEW_SESSION } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { checkWidgets } from './check-widgets';
import { SPOILER_WIDGET, STOPPED_WIDGETS } from './widget-content.constants';
import { waitText } from './wait-text';

export default defineReviewStep({
  run: async (tour) => {
    await tour.resetUi();
    widgets.reset();
    const shown = await waitText(tour, REVIEW_SESSION, () => tour.find(SELECTOR.dashboard));
    tour.check('dashboard-run', shown, `the base screen shows the stopped ${REVIEW_SESSION}`, 'the base screen shows no seeded run');
    await checkWidgets(tour, STOPPED_WIDGETS, 'stopped');
    await tour.capture('stopped-run');
    await checkWidgets(tour, SPOILER_WIDGET, 'stopped');
    await tour.capture('spoiler');
    widgets.reset();
  },
});
