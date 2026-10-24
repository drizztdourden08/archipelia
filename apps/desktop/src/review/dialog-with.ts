/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { SELECTOR } from './review-dom.constants';

const dialogWith = (tour: AppReviewTour, marker: string | RegExp) => (): HTMLElement | null =>
  tour.findAll(SELECTOR.dialog).find((el) => (typeof marker === 'string' ? el.innerText.includes(marker) : marker.test(el.innerText))) ?? null;

export { dialogWith };
