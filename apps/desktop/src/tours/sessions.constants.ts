/* @layer renderer-app @kind config */
import type { TourStepDef } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { TOUR_PART, TOUR_TARGET } from '../hooks/tour-targets.constants';

const SESSIONS_STEPS: readonly TourStepDef[] = [
  {
    id: 'sessions',
    title: 'Sessions',
    body: 'A session is a saved setup: where the room runs, how players join and which players are saved with it. The list is on the left and the setup of the picked session is on the right. Their runs are kept in History. To play in a room that someone else hosts, use Join a session.',
    target: TOUR_PART.page,
    mascot: 'point',
    open: ROUTE.sessions,
    reset: true,
  },
  {
    id: 'sessions-list',
    title: 'Your sessions',
    body: 'Pick a session to see its setup. The filter narrows the list, and the menu of a row duplicates or deletes it. Run opens the session as a tab in the main window, where the lobby shows a seat card for each player. Players who join wait on a card for your approval, and you press Run again to make the seed and host the room.',
    target: { tour: TOUR_TARGET.sessionsList },
    mascot: 'curious',
    open: ROUTE.sessions,
  },
  {
    id: 'sessions-new',
    title: 'New session',
    body: 'New session builds a setup from scratch.',
    hint: 'Click New session to see the setup page.',
    advanceOn: { click: TOUR_PART.newSession },
    mascot: 'point',
    open: ROUTE.sessions,
  },
  {
    id: 'sessions-builder',
    title: 'The session setup',
    body: 'The setup holds the session itself: its name, where the room runs, direct connections, the room password and a short line of the world settings. The port and every world setting sit under Advanced. Save keeps it and Run opens its tab. With unsaved changes, Run once uses them for one run and leaves the saved session as it is.',
    target: { tour: TOUR_TARGET.builderBar },
    mascot: 'idea',
    open: ROUTE.newSession,
  },
  {
    id: 'sessions-players',
    title: 'Saved players',
    body: 'The players saved with the session, one line each. Click a player to change their name, game and preset. Their switch lets them connect on their own and bring their own game, after you approve them. Such a player can stay without a game. A game set here is the fallback used if they have not joined when you run.',
    target: { tour: TOUR_TARGET.sessionsPlayers },
    mascot: 'curious',
    open: ROUTE.newSession,
  },
  {
    id: 'sessions-back',
    title: 'Back to Sessions',
    body: 'Nothing is saved until you press Save, so you can leave this page.',
    hint: 'Click Back.',
    advanceOn: { click: TOUR_PART.back },
    mascot: 'point',
    open: ROUTE.newSession,
  },
  {
    id: 'history',
    title: 'History',
    body: 'Every run is kept here with the session it came from, the changes it ran with, who played and its seed and files. Pick a run to see them. The setup of a session has a link to the runs of that session.',
    target: { tour: TOUR_TARGET.historyList },
    mascot: 'curious',
    open: ROUTE.history,
  },
];

export { SESSIONS_STEPS };
