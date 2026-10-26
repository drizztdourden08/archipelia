/* @layer renderer-app @kind config */
import type { TourStepDef } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { TOUR_PART, TOUR_ROUTE, TOUR_TARGET } from '../hooks/tour-targets.constants';

const HOSTING_STEPS: readonly TourStepDef[] = [
  {
    id: 'servers',
    title: 'Servers',
    body: 'Servers are where rooms run. The lobby server is how friends find and join your session, on this computer, on your network or on a remote server.',
    target: TOUR_PART.page,
    mascot: 'curious',
    open: ROUTE.archipeliaServers,
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
    id: 'machines',
    title: 'Machines',
    body: 'A machine is a remote computer that can host rooms for you, reached over SSH. Add one, then test it.',
    target: TOUR_PART.page,
    mascot: 'point',
    open: TOUR_ROUTE.machines,
  },
  {
    id: 'hosting',
    title: 'Hosting',
    body: 'Hosting sets the defaults for new sessions: where they run and the rules of the server.',
    target: TOUR_PART.page,
    mascot: 'idea',
    open: TOUR_ROUTE.hosting,
  },
  {
    id: 'hosting-host',
    title: 'Default host',
    body: 'Default host picks where a new session runs. Each session keeps its own copy, so changing this never rewrites one.',
    target: { setting: 'hostingDefaultHost' },
    mascot: 'point',
    open: TOUR_ROUTE.hosting,
  },
  {
    id: 'archipelago-gg',
    title: 'archipelago.gg',
    body: 'archipelago.gg is the public Archipelago website. A session can host its room there, and this page keeps the site address and your owner id.',
    target: TOUR_PART.page,
    mascot: 'curious',
    open: TOUR_ROUTE.archipelagoGg,
  },
];

export { HOSTING_STEPS };
