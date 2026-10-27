/* @layer renderer-app @kind config */
import type { TourStepDef } from '@drizztdourden08/brock-react';
import { closeScreens } from '../hooks/close-screens';
import { TOUR_PART } from '../hooks/tour-targets.constants';

const INTRO_STEPS: readonly TourStepDef[] = [
  {
    id: 'hello',
    title: 'Welcome to Archipelia',
    body: 'Archipelia is a multiworld manager for Archipelago. Pick your games, set their options, host the session here, on your network or on a remote server, and let friends join. The goal is one shared game for everyone, without a command line. I am Pelago, and I will show you around.',
    intro: true,
    art: 'product-mark',
    mascot: 'wave',
  },
  {
    id: 'menu-open',
    title: 'The menu',
    body: 'Everything starts in the menu, in the top left corner.',
    hint: 'Click the menu button to open it.',
    advanceOn: { click: { shell: 'menu' } },
    mascot: 'point',
    before: closeScreens,
  },
  {
    id: 'menu-entries',
    title: 'What the menu holds',
    body: 'The menu opens every screen and the window options. Search and Report a bug sit here too, and so does Take the tour.',
    target: TOUR_PART.menuPanel,
    openMenu: 'menu',
    placement: 'right-start',
    mascot: 'scan',
  },
  {
    id: 'menu-home',
    title: 'Open Home',
    body: 'Home is where Archipelia starts.',
    hint: 'Click Home in the menu.',
    target: TOUR_PART.menuHome,
    advanceOn: { click: TOUR_PART.menuHome },
    openMenu: 'menu',
    placement: 'right-start',
    mascot: 'point',
  },
];

export { INTRO_STEPS };
