/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { tabStrip } from './tab-strip';

const stripHas = async (tour: AppReviewTour, ...parts: string[]): Promise<boolean> => {
  const found = await tour.waitFor(() => {
    const text = tabStrip(tour)?.innerText ?? '';
    return parts.every((part) => text.includes(part)) ? true : null;
  });
  return found === true;
};

export { stripHas };
