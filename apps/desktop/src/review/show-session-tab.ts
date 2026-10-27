/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { tabStrip } from './tab-strip';

const showSessionTab = (tour: AppReviewTour, title: string): Promise<boolean> =>
  clickNamed(tour, SELECTOR.tab, new RegExp(`^${title}\b`), tabStrip(tour));

export { showSessionTab };
