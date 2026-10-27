/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { SELECTOR } from './review-dom.constants';

const tabBody = (tour: AppReviewTour): HTMLElement | undefined => tour.find(SELECTOR.tabBody) ?? undefined;

export { tabBody };
