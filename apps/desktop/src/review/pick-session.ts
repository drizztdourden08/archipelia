/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { SESSIONS_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { named } from './named';

const sessionsLayer = (tour: AppReviewTour): HTMLElement | null => {
  const layer = tour.find(SELECTOR.layer);
  return layer && tour.find(`ul[aria-label="${SESSIONS_UI.list}"]`, layer) ? layer : null;
};

const pickSession = async (tour: AppReviewTour, title: string): Promise<boolean> => {
  const layer = await tour.waitFor(() => sessionsLayer(tour));
  if (!layer) return false;
  const back = named(tour, SELECTOR.button, SESSIONS_UI.back, layer);
  if (back && back.getClientRects().length > 0) tour.click(back);
  return clickNamed(tour, SELECTOR.button, new RegExp(`^${title}\\b`), layer);
};

export { pickSession };
