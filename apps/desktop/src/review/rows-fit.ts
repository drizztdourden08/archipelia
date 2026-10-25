/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { SELECTOR } from './review-dom.constants';

const spillsOver = (row: HTMLElement, tour: AppReviewTour) => {
  const reset = tour.find(SELECTOR.rowReset, row);
  const control = tour.find(SELECTOR.rowControl, row);
  if (!reset || !control) return false;
  const edge = reset.getBoundingClientRect().left;
  return tour.findAll('*', control).some((el) => el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().right > edge + 1);
};

const rowsFit = (tour: AppReviewTour) => {
  const rows = tour.findAll(SELECTOR.optionRow);
  return rows.length > 0 && !rows.some((row) => spillsOver(row, tour));
};

export { rowsFit };
