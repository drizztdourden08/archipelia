/* @layer renderer-app @kind config */
import type { TourStepDef } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { NEW_PRESET, TOUR_PART, TOUR_TARGET } from '../hooks/tour-targets.constants';

const GAMES_STEPS: readonly TourStepDef[] = [
  {
    id: 'games',
    title: 'Games',
    body: 'Games lists every Archipelago world you can play. A game must have its world installed before a session can use it.',
    target: TOUR_PART.page,
    mascot: 'curious',
    open: ROUTE.games,
  },
  {
    id: 'games-tabs',
    title: 'Tabs',
    body: 'The tabs narrow the list: all worlds, the ones you installed, built-in, Archipelia ready and Archipelago index worlds, and updates.',
    target: TOUR_PART.tabs,
    mascot: 'point',
    open: ROUTE.games,
  },
  {
    id: 'games-tools',
    title: 'Search and filters',
    body: 'Search by name, or add a filter. The refresh button reloads the index of worlds.',
    target: { tour: TOUR_TARGET.gamesTools },
    mascot: 'scan',
    open: ROUTE.games,
  },
  {
    id: 'games-grid',
    title: 'The worlds',
    body: 'Each card is a world. Press Add to install it, or open the card for its details and notes.',
    target: { tour: TOUR_TARGET.gamesGrid },
    mascot: 'curious',
    open: ROUTE.games,
  },
  {
    id: 'games-status',
    title: 'The status bar',
    body: 'The bar counts worlds and updates. Add from file installs an apworld file you downloaded yourself.',
    target: TOUR_PART.gamesStatus,
    mascot: 'point',
    open: ROUTE.games,
  },
];

const PRESETS_STEPS: readonly TourStepDef[] = [
  {
    id: 'presets',
    title: 'Presets',
    body: 'A preset holds the options of one game, ready to reuse in any session. Pick one on the left to edit it.',
    target: TOUR_PART.page,
    mascot: 'idea',
    open: ROUTE.presets,
  },
  {
    id: 'presets-new',
    title: 'New preset',
    body: 'New preset makes one. Choose a game, name it, then set its options.',
    target: NEW_PRESET,
    mascot: 'point',
    open: ROUTE.presets,
  },
  {
    id: 'presets-options',
    title: 'The options',
    body: 'Pick a preset to edit it. Its options are grouped in tabs, and the search box finds one by name. Save keeps your changes.',
    target: { tour: TOUR_TARGET.presetsOptions },
    mascot: 'scan',
    open: ROUTE.presets,
  },
];

export { GAMES_STEPS, PRESETS_STEPS };
