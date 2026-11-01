/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { OPTIONS_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { tabBody } from './tab-body';
import { waitNamed } from './wait-named';

const checkJoinedOptions = async (tour: AppReviewTour, joiner: string) => {
  const opened = await clickNamed(tour, SELECTOR.button, `${OPTIONS_UI.view} ${joiner}`, tabBody(tour));
  const dialog = opened ? await waitNamed(tour, SELECTOR.dialog, OPTIONS_UI.title(joiner)) : null;
  const inputs = dialog ? tour.findAll(SELECTOR.field, dialog).length : 0;
  tour.check(
    `options-${joiner}`, dialog !== null && inputs === 0, 'the host reads the options of a player who joined in a dialog with no inputs', dialog ? 'the options dialog has inputs' : 'View options did not open the options of the player',
  );
  if (dialog) await clickNamed(tour, SELECTOR.button, OPTIONS_UI.close, dialog);
};

export { checkJoinedOptions };
