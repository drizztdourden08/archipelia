/* @layer renderer-app @kind config */
import type { TourStepDef } from '@drizztdourden08/brock-react';
import { TOUR_PART, TOUR_RAIL, TOUR_ROUTE } from '../hooks/tour-targets.constants';

const HOME_STEPS: readonly TourStepDef[] = [
  {
    id: 'home',
    title: 'Home',
    body: 'Home is your starting point. It shows the state of the engine, what to do next and your latest runs.',
    target: TOUR_PART.hero,
    mascot: 'point',
    open: TOUR_ROUTE.home,
  },
  {
    id: 'rail',
    title: 'The sidebar',
    body: 'The list on the left holds every screen: Sessions first, then Library, Hosting and App.',
    hint: 'Click Sessions to open it.',
    target: TOUR_PART.rail,
    advanceOn: { click: TOUR_RAIL.sessions },
    mascot: 'point',
    open: TOUR_ROUTE.home,
  },
];

export { HOME_STEPS };
