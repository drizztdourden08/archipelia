/* @layer renderer-app @kind config */
import type { TourStepDef } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { resetScreens } from '../hooks/reset-screens';
import { TOUR_PART, TOUR_SCOPE, TOUR_TARGET } from '../hooks/tour-targets.constants';

const SESSIONS_STEPS: readonly TourStepDef[] = [
  {
    id: 'sessions',
    title: 'Sessions',
    body: 'A session is a saved setup: who plays, which games and presets, and where the room runs. This page lists your sessions and every run made from them. To play in a room that someone else hosts, use Join a session.',
    target: TOUR_PART.page,
    mascot: 'point',
    open: ROUTE.sessions,
    before: resetScreens(TOUR_SCOPE.sessions),
  },
  {
    id: 'sessions-list',
    title: 'Your sessions',
    body: 'Start on a session opens its lobby. The lobby is where you add the players and press Run, which makes the seed and hosts the room. Edit changes the setup.',
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
    body: 'The setup page holds the session itself: its name, where the room runs, direct connection and the server options. Save keeps it. Start session opens its lobby.',
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
];

export { SESSIONS_STEPS };
