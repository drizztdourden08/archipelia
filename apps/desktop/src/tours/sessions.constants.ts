/* @layer renderer-app @kind config */
import type { TourStepDef } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { TOUR_PART, TOUR_TARGET } from '../hooks/tour-targets.constants';

const SESSIONS_STEPS: readonly TourStepDef[] = [
  {
    id: 'sessions',
    title: 'Sessions',
    body: 'A session is a saved setup: who plays, which games and presets, and where the room runs. This page lists your sessions. Their runs are kept in History. To play in a room that someone else hosts, use Join a session.',
    target: TOUR_PART.page,
    mascot: 'point',
    open: ROUTE.sessions,
    reset: true,
  },
  {
    id: 'sessions-list',
    title: 'Your sessions',
    body: 'Start on a session opens it as a tab in the main window. The tab starts in the lobby: you add the players there and press Run, which makes the seed and hosts the room. Edit changes the setup.',
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
    body: 'The setup page holds the session itself: its name, where the room runs, direct connection and the server options. Save keeps it. Start session opens its tab.',
    target: { tour: TOUR_TARGET.builderBar },
    mascot: 'idea',
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
    body: 'Every run is kept here with the session it came from, the changes it ran with, who played and its seed and files. Pick a run to see them. The menu of a session has a link to the runs of that session.',
    target: { tour: TOUR_TARGET.historyList },
    mascot: 'curious',
    open: ROUTE.history,
  },
];

export { SESSIONS_STEPS };
