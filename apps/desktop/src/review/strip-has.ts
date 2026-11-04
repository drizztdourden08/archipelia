/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { tabStrip } from './tab-strip';

const stripHas = async (tour: AppReviewTour, ...parts: string[]): Promise<boolean> => {
  const found = await tour.waitFor(() => {
    const strip = tabStrip(tour);
    const titles = [...(strip?.querySelectorAll('[title]') ?? [])].map((el) => el.getAttribute('title')).join(' ');
    const text = `${strip?.textContent ?? ''} ${titles}`;
    return parts.every((part) => text.includes(part)) ? true : null;
  });
  return found === true;
};

export { stripHas };
