/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { nameOf } from './name-of';

const named = (tour: AppReviewTour, selector: string, name: string | RegExp, root?: ParentNode): HTMLElement | null =>
  tour.findAll(selector, root).find((el) => (typeof name === 'string' ? nameOf(el) === name : name.test(nameOf(el)))) ?? null;

export { named };
