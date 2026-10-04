/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { waitNamed } from './wait-named';

const clickNamed = async (tour: AppReviewTour, selector: string, name: string | RegExp, root?: ParentNode): Promise<boolean> => {
  const target = await waitNamed(tour, selector, name, root);
  if (target) tour.click(target);
  return target !== null;
};

export { clickNamed };
