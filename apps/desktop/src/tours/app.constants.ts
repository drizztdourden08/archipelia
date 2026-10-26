/* @layer renderer-app @kind config */
import type { TourStepDef } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { TOUR_PART, TOUR_ROUTE, TOUR_TARGET } from '../hooks/tour-targets.constants';

const APP_STEPS: readonly TourStepDef[] = [
  {
    id: 'engine',
    title: 'Engine',
    body: 'The engine is the copy of Archipelago that Archipelia keeps for itself. It generates seeds and hosts rooms, so you install nothing else.',
    target: TOUR_PART.page,
    mascot: 'scan',
    open: ROUTE.engine,
  },
  {
    id: 'engine-status',
    title: 'Engine status',
    body: 'Set it up once here. It downloads about 90 MB.',
    target: { tour: TOUR_TARGET.engineStatus },
    mascot: 'point',
    open: ROUTE.engine,
  },
  {
    id: 'engine-versions',
    title: 'Versions',
    body: 'Choose which Archipelago and Python versions to use. Apply switches the engine to them.',
    target: { tour: TOUR_TARGET.engineVersions },
    mascot: 'curious',
    open: ROUTE.engine,
  },
  {
    id: 'general',
    title: 'General',
    body: 'General holds the options of the window and the developer tools.',
    target: TOUR_PART.page,
    mascot: 'idea',
    open: TOUR_ROUTE.general,
  },
  {
    id: 'general-window',
    title: 'Window mode',
    body: 'Run windowed, borderless or fullscreen.',
    target: { setting: 'windowMode' },
    mascot: 'point',
    open: TOUR_ROUTE.general,
  },
  {
    id: 'storage',
    title: 'Storage',
    body: 'Storage shows what Archipelia keeps on disk. You can also back it up or restore it as a zip file.',
    target: TOUR_PART.page,
    mascot: 'scan',
    open: TOUR_ROUTE.storage,
  },
  {
    id: 'old-runs',
    title: 'Old runs',
    body: 'Old runs lists finished runs. Clean them up to free space.',
    target: TOUR_PART.page,
    mascot: 'curious',
    open: TOUR_ROUTE.oldRuns,
  },
];

export { APP_STEPS };
