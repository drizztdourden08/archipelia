/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { SELECTOR } from './review-dom.constants';
import { isFree } from './is-free';
import { named } from './named';

const setToggle = async (tour: AppReviewTour, name: RegExp, on: boolean, root?: ParentNode): Promise<HTMLElement | null> => {
  const target = await tour.waitFor(() => {
    const found = named(tour, SELECTOR.toggle, name, root);
    return isFree(found) ? found : null;
  }, 15000);
  if (target && (target.getAttribute('aria-checked') === 'true') !== on) {
    tour.click(target);
    await tour.settle();
  }
  return target;
};

export { setToggle };
