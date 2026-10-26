/* @layer renderer-app @kind config */
import type { TourStepDef } from '@drizztdourden08/brock-react';
import { TOUR_ROUTE } from '../hooks/tour-targets.constants';

const INTRO_STEPS: readonly TourStepDef[] = [
  {
    id: 'hello',
    title: 'Welcome to Archipelia',
    body: 'Archipelia is a multiworld manager for Archipelago. Pick your games, set their options, host the session here, on your network or on a remote server, and let friends join. The goal is one shared game for everyone, without a command line. I am Pelago, and I will show you around.',
    mascot: 'wave',
    open: TOUR_ROUTE.home,
  },
];

export { INTRO_STEPS };
