/* @layer renderer-app @kind config */
import { defineTour } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { NEW_PRESET } from '../hooks/tour-targets.constants';

export default defineTour({
  id: 'welcome',
  title: 'Welcome to Archipelia',
  description: 'Four steps from a fresh install to your first hosted multiworld.',
  trigger: 'first-run',
  steps: [
    {
      id: 'hello',
      title: 'Welcome to Archipelia',
      body: 'I am Pelago. Four steps take you from a fresh install to a room your friends can join. Home lists them as a checklist until your first run; I will show you where each one lives.',
      mascot: 'wave',
      open: 'multiworld',
    },
    {
      id: 'engine',
      title: '1. The engine',
      body: 'Archipelia generates seeds and hosts rooms with its own copy of Archipelago. Set it up once here; it downloads about 90 MB.',
      target: { tour: 'engine-status' },
      mascot: 'scan',
      open: ROUTE.engine,
    },
    {
      id: 'games',
      title: '2. Games',
      body: 'Every game a player brings needs its world installed. Search the Official and Community lists, then press Add on a card.',
      target: { tour: 'game-store-tools' },
      mascot: 'curious',
      open: ROUTE.officialGames,
    },
    {
      id: 'preset',
      title: '3. A preset',
      body: 'A preset holds one game\'s options, ready to reuse. Press New preset to make your first one.',
      target: NEW_PRESET,
      advanceOn: { click: NEW_PRESET },
      mascot: 'point',
      open: ROUTE.presets,
    },
    {
      id: 'session',
      title: '4. A session',
      body: 'A session is a saved setup: the players, their presets and the server options. Press New session here, then Run to make a seed and host the room.',
      mascot: 'jump',
      open: ROUTE.sessions,
    },
    {
      id: 'done',
      title: 'That is the tour',
      body: 'You can take it again from the menu, under Take the tour, or from search.',
      mascot: 'happy',
    },
  ],
});
