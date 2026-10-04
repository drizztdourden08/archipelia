/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { named } from './named';

const waitNamed = (tour: AppReviewTour, selector: string, name: string | RegExp, root?: ParentNode) =>
  tour.waitFor(() => named(tour, selector, name, root));

export { waitNamed };
