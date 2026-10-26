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
      body: 'Every game a player brings needs its world installed. Search and filter the worlds, then press the Add button on a card. Games sit in the menu under Library.',
      target: { tour: 'game-store-tools' },
      mascot: 'curious',
      open: ROUTE.games,
    },
    {
      id: 'preset',
      title: '3. A preset',
      body: 'A preset holds one game\'s options, ready to reuse. Presets sit under Library too. Press New preset to make your first one.',
      target: NEW_PRESET,
      advanceOn: { click: NEW_PRESET },
      mascot: 'point',
      open: ROUTE.presets,
    },
    {
      id: 'session',
      title: '4. A session',
      body: 'A session is a saved setup: where the room runs, the server options, and whether friends may join with their own Archipelia. Sessions sits right under Home in the sidebar. Press New session here, then Start session: its lobby opens, you add players there, and Run makes a seed and hosts the room. Join a session, on the same page, joins the session of another host.',
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
