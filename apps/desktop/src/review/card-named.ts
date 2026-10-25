/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { SELECTOR } from './review-dom.constants';
import { nameOf } from './name-of';

const cardNamed = (tour: AppReviewTour, title: string): HTMLElement | null =>
  tour.findAll(SELECTOR.gameCard).find((card) => {
    const heading = tour.find(SELECTOR.cardTitle, card);
    return heading !== null && nameOf(heading) === title;
  }) ?? null;

export { cardNamed };
