/* @layer renderer-app @kind config */
import type { TourStepDef } from '@drizztdourden08/brock-react';
import { TOUR_PART, TOUR_ROUTE, TOUR_TARGET } from '../hooks/tour-targets.constants';

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
    body: 'The list on the left holds every screen: Sessions first, then Library, Hosting and App. Pick one to open it.',
    target: TOUR_PART.rail,
    mascot: 'point',
    open: TOUR_ROUTE.home,
  },
  {
    id: 'home-aside',
    title: 'Setup and recent runs',
    body: 'Until your first run, a checklist shows what is left: the engine, a game, a preset and a session. After that, your recent runs sit here.',
    target: { tour: TOUR_TARGET.homeAside },
    mascot: 'curious',
    open: TOUR_ROUTE.home,
  },
];

export { HOME_STEPS };
