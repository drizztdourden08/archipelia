/* @layer renderer-app @kind config */
import type { TourStepDef } from '@drizztdourden08/brock-react';
import { TOUR_ROUTE } from '../hooks/tour-targets.constants';

const SHELL_STEPS: readonly TourStepDef[] = [
  {
    id: 'search',
    title: 'Search',
    body: 'Press Ctrl+K anywhere to search screens, settings, games and servers, and to run actions.',
    target: { shell: 'search' },
    mascot: 'scan',
    open: TOUR_ROUTE.home,
  },
  {
    id: 'title-bar',
    title: 'The title bar',
    body: 'The title bar stays with you on every screen. It holds the menu, search and the bug button, and while a room is hosting it adds a Hosting menu to open the room.',
    target: { shell: 'title-bar' },
    mascot: 'point',
    open: TOUR_ROUTE.home,
  },
  {
    id: 'report-bug',
    title: 'Report a bug',
    body: 'Found a problem? The bug button opens a report form.',
    target: { shell: 'report-bug' },
    mascot: 'alert',
    open: TOUR_ROUTE.home,
  },
  {
    id: 'menu',
    title: 'The menu',
    body: 'The menu opens every screen and the window options. Take the tour sits in it too.',
    target: { shell: 'menu' },
    mascot: 'point',
    open: TOUR_ROUTE.home,
  },
  {
    id: 'done',
    title: 'That is the tour',
    body: 'To take it again, open the menu and choose Take the tour, or search for it with Ctrl+K.',
    mascot: 'happy',
    open: TOUR_ROUTE.home,
  },
];

export { SHELL_STEPS };
