/* @layer renderer-app @kind config */
import type { TourStepDef } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { TOUR_PART, TOUR_TARGET } from '../hooks/tour-targets.constants';

const SESSIONS_STEPS: readonly TourStepDef[] = [
  {
    id: 'sessions',
    title: 'Sessions',
    body: 'A session is a saved setup: who plays, which games and presets, and where the room runs. This page lists your sessions and every run made from them. New session, at the top right, builds one.',
    target: TOUR_PART.page,
    mascot: 'point',
    open: ROUTE.sessions,
  },
  {
    id: 'sessions-list',
    title: 'Your sessions',
    body: 'Run makes a seed and hosts the room. Edit changes the setup. The menu on a row duplicates or deletes it.',
    target: { tour: TOUR_TARGET.sessionsList },
    mascot: 'curious',
    open: ROUTE.sessions,
  },
  {
    id: 'sessions-runs',
    title: 'Your runs',
    body: 'Each run keeps its seed, its log and its files. Open one to see the room, copy its address or stop it.',
    target: { tour: TOUR_TARGET.sessionsRuns },
    mascot: 'scan',
    open: ROUTE.sessions,
  },
  {
    id: 'sessions-join',
    title: 'Join a session',
    body: 'To play in a room that someone else hosts, press Join a session. Pick a server on your network or use a session code.',
    target: { tour: TOUR_TARGET.sessionsJoin },
    mascot: 'point',
    open: ROUTE.sessions,
  },
  {
    id: 'sessions-builder',
    title: 'The session builder',
    body: 'The builder sets the players, the game and preset of each one, and the server options. Name the session here, then Save keeps it and Run hosts it.',
    target: { tour: TOUR_TARGET.builderBar },
    mascot: 'idea',
    open: ROUTE.newSession,
  },
];

export { SESSIONS_STEPS };
