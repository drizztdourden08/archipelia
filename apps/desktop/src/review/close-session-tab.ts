/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { tabStrip } from './tab-strip';
import { waitNamed } from './wait-named';

const closeSessionTab = async (tour: AppReviewTour, title: string, ask?: string): Promise<HTMLElement | null> => {
  await clickNamed(tour, SELECTOR.button, new RegExp(`^Close.*${title}`), tabStrip(tour));
  if (!ask) return null;
  const dialog = await waitNamed(tour, SELECTOR.dialog, ask);
  if (dialog) await clickNamed(tour, SELECTOR.button, ask, dialog);
  return dialog;
};

export { closeSessionTab };
