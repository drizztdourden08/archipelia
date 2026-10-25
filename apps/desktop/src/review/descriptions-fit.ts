/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { DESCRIPTION_LINES } from './descriptions-fit.constants';
import { SELECTOR } from './review-dom.constants';

const cutAtTwoLines = (text: HTMLElement) => {
  const line = Number.parseFloat(getComputedStyle(text).lineHeight);
  return Number.isNaN(line) || text.getBoundingClientRect().height <= line * DESCRIPTION_LINES + 1;
};

const descriptionsFit = (tour: AppReviewTour) => {
  const texts = tour.findAll(SELECTOR.rowText);
  return texts.length > 0 && tour.findAll(SELECTOR.rowMore).length === 0 && texts.every(cutAtTwoLines);
};

export { descriptionsFit };
