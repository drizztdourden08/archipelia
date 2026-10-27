/* @layer renderer-app @kind config */
import type { TourStepDef } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { resetScreens } from '../hooks/reset-screens';
import { TOUR_PART, TOUR_RAIL, TOUR_ROUTE, TOUR_SCOPE, TOUR_TARGET } from '../hooks/tour-targets.constants';

const HOSTING_STEPS: readonly TourStepDef[] = [
  {
    id: 'hosting-servers',
    title: 'Hosting',
    body: 'Hosting is where rooms run and who can reach them.',
    hint: 'Click Servers.',
    advanceOn: { click: TOUR_RAIL.servers },
    mascot: 'point',
  },
  {
    id: 'servers',
    title: 'Servers',
    body: 'Servers are where rooms run. The lobby server is how friends find and join your session, on this computer, on your network or on a remote server.',
    target: TOUR_PART.page,
    mascot: 'curious',
    open: ROUTE.archipeliaServers,
    before: resetScreens(TOUR_SCOPE.servers),
  },
  {
    id: 'servers-local',
    title: 'Who can reach you',
    body: 'Network mode sets who can find the lobby server on this computer: your network only, the internet too, or nobody.',
    target: { tour: TOUR_TARGET.serversDetail },
    mascot: 'scan',
    open: ROUTE.archipeliaServers,
  },
  {
    id: 'hosting-defaults',
    title: 'Hosting defaults',
    body: 'Next are the defaults for new sessions.',
    hint: 'Click Hosting.',
    advanceOn: { click: TOUR_RAIL.hosting },
    mascot: 'point',
  },
  {
    id: 'hosting',
    title: 'Hosting',
    body: 'Hosting sets the defaults for new sessions: where they run and the rules of the server. Each session keeps its own copy, so changing a default never rewrites one.',
    target: TOUR_PART.page,
    mascot: 'idea',
    open: TOUR_ROUTE.hosting,
    before: resetScreens(TOUR_SCOPE.hosting),
  },
];

export { HOSTING_STEPS };
