/* @layer renderer-app @kind config */
import type { TourStepDef } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { openFirstLobby } from '../hooks/open-first-lobby';
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
    body: 'Start opens the lobby of the session. Edit changes the setup. The menu on a row duplicates or deletes it.',
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
    title: 'The session setup',
    body: 'The setup page holds the session itself: its name, where the room runs, direct connection and the server options. Save keeps it. Start session opens its lobby.',
    target: { tour: TOUR_TARGET.builderBar },
    mascot: 'idea',
    open: ROUTE.newSession,
  },
  {
    id: 'lobby',
    title: 'The lobby',
    body: 'The lobby is where you add the players, let friends in and run the room. Nothing goes on the network until you start the session.',
    target: TOUR_PART.page,
    mascot: 'curious',
    before: openFirstLobby,
  },
  {
    id: 'lobby-players',
    title: 'Players',
    body: 'Add a player for each game. Pick the game and its preset. Friends who join with their own Archipelia show up here, and you approve them before the run.',
    target: { tour: TOUR_TARGET.lobbyPlayers },
    mascot: 'scan',
    before: openFirstLobby,
  },
  {
    id: 'lobby-connection',
    title: 'Connection',
    body: 'This card shows where the room runs and the addresses friends use to connect.',
    target: { tour: TOUR_TARGET.lobbyConnection },
    mascot: 'point',
    before: openFirstLobby,
  },
  {
    id: 'lobby-run',
    title: 'Start and run',
    body: 'Start session opens the lobby to friends. Run then makes the seed and hosts the room. When the button is off, the reason sits beside it.',
    target: { tour: TOUR_TARGET.lobbyRun },
    mascot: 'happy',
    before: openFirstLobby,
  },
];

export { SESSIONS_STEPS };
