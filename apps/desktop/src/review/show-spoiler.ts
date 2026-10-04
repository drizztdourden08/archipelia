/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { named } from './named';
import { waitNamed } from './wait-named';

const showSpoiler = async (tour: AppReviewTour): Promise<void> => {
  const frame = await tour.openWidget('spoiler');
  const shownBefore = frame ? named(tour, SELECTOR.button, 'Hide spoiler', frame) : null;
  if (shownBefore) tour.click(shownBefore);
  const covered = frame ? await clickNamed(tour, SELECTOR.button, 'Show spoiler', frame) : false;
  tour.check('spoiler-covered', covered, 'the spoiler is covered behind Show spoiler', 'the spoiler widget has no Show spoiler button');
  const hide = frame ? await waitNamed(tour, SELECTOR.button, 'Hide spoiler', frame) : null;
  tour.check('spoiler-hide', hide !== null, 'a shown spoiler offers Hide spoiler', 'a shown spoiler has no Hide spoiler button');
};

export { showSpoiler };
