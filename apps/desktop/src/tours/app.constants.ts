/* @layer renderer-app @kind config */
import type { TourStepDef } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { TOUR_PART, TOUR_RAIL } from '../hooks/tour-targets.constants';

const APP_STEPS: readonly TourStepDef[] = [
  {
    id: 'engine-open',
    title: 'The engine',
    body: 'The last stop is the engine.',
    hint: 'Click Engine.',
    advanceOn: { click: TOUR_RAIL.engine },
    mascot: 'point',
  },
  {
    id: 'engine',
    title: 'Engine',
    body: 'The engine is the copy of Archipelago that Archipelia keeps for itself. It generates seeds and hosts rooms, so you install nothing else. This page installs it and picks its versions.',
    target: TOUR_PART.page,
    mascot: 'scan',
    open: ROUTE.engine,
  },
  {
    id: 'done',
    title: 'That is the tour',
    body: 'To take it again, open the menu and choose Take the tour, or search for it with Ctrl+K.',
    mascot: 'happy',
  },
];

export { APP_STEPS };
