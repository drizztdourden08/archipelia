/* @layer renderer-app @kind config */
import type { TourStepDef } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { TOUR_PART, TOUR_RAIL, TOUR_ROUTE, TOUR_TARGET } from '../hooks/tour-targets.constants';

const LIBRARY_STEPS: readonly TourStepDef[] = [
  {
    id: 'library-games',
    title: 'The Library',
    body: 'The Library holds the games you can play and the presets that set their options.',
    hint: 'Click Games.',
    advanceOn: { click: TOUR_RAIL.games },
    mascot: 'point',
  },
  {
    id: 'games',
    title: 'Games',
    body: 'Games lists every Archipelago world you can play, by source: Built-in, Archipelia ready and Archipelago index. A game must have its world installed before a session can use it. Press the install button on a card to add it.',
    target: TOUR_PART.page,
    mascot: 'curious',
    open: TOUR_ROUTE.games,
    reset: true,
  },
  {
    id: 'games-tabs',
    title: 'Tabs',
    body: 'The tabs narrow the list: all worlds, the ones you installed, built-in, Archipelia ready and Archipelago index worlds, and updates.',
    target: TOUR_PART.tabs,
    mascot: 'point',
    open: TOUR_ROUTE.games,
  },
  {
    id: 'games-tools',
    title: 'Search and filters',
    body: 'Search by name, or add a filter. The refresh button reloads the index of worlds.',
    target: { tour: TOUR_TARGET.gamesTools },
    mascot: 'scan',
    open: TOUR_ROUTE.games,
  },
  {
    id: 'library-presets',
    title: 'Presets',
    body: 'Presets come next.',
    hint: 'Click Presets.',
    advanceOn: { click: TOUR_RAIL.presets },
    mascot: 'point',
  },
  {
    id: 'presets',
    title: 'Presets',
    body: 'A preset holds the options of one game, ready to reuse in any session. New preset makes one. Pick a preset on the left to edit it.',
    target: TOUR_PART.page,
    mascot: 'idea',
    open: ROUTE.presets,
    reset: true,
  },
];

export { LIBRARY_STEPS };
