/* @layer renderer-app @kind config */
import type { PlayerStatus } from '@archipelia/sessions/live-room';
import type { RowLook } from '../SessionDashboard.type';

const RUN_STAGE_TEXT = {
  running: 'Running',
  lan: 'LAN',
  up: 'Up',
  seed: 'Seed',
  copySeed: 'Copy seed',
  copyAddress: 'Copy address',
  stop: 'Stop',
  config: 'Config',
  locked: 'Locked while running',
  rejoin: 'Rejoin only',
  players: 'Players',
  set: 'Set',
  direct: 'Direct',
  connectAs: 'connect as',
  goalDone: 'goal done',
  goalOpen: 'goal not done',
  commandsFor: 'Commands for',
  hintFor: 'Hint for',
  commandFailed: 'The room did not take the command. The app log has the cause.',
} as const;

const ROW_STATUS: Record<PlayerStatus, RowLook> = {
  unknown: { label: 'Not seen', tone: 'neutral' },
  offline: { label: 'Offline', tone: 'neutral' },
  connected: { label: 'Connected', tone: 'success' },
  ready: { label: 'Ready', tone: 'warning' },
  playing: { label: 'Playing', tone: 'success' },
  goal: { label: 'Goal', tone: 'success' },
};

const ROW_WAITING: RowLook = { label: 'Waiting for its player', tone: 'info' };

const CONSOLE_WIDGET = 'console';

export { CONSOLE_WIDGET, ROW_STATUS, ROW_WAITING, RUN_STAGE_TEXT };
