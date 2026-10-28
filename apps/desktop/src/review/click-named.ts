/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { isFree } from './is-free';
import { named } from './named';

const clickNamed = async (tour: AppReviewTour, selector: string, name: string | RegExp, root?: ParentNode): Promise<boolean> => {
  const target = await tour.waitFor(() => {
    const found = named(tour, selector, name, root);
    return isFree(found) ? found : null;
  });
  if (target) tour.click(target);
  return target !== null;
};

export { clickNamed };
