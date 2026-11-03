/* @layer renderer-app @kind config */
import type { SessionStatus } from '@archipelia/model';
import type { TagUrgencyColor } from '@drizztdourden08/tessera/primitives';
import type { RunStatusView } from './stage.type';

const PHASE_URGENT: readonly TagUrgencyColor[] = ['success', 'warning', 'danger', 'info'];

const COUNT_TEXT = { player: 'player', players: 'players' } as const;

const STAGE_GAMES_TEXT = { label: 'Allowed games', any: 'Any game' } as const;

const CONFIG_TEXT = {
  hintCost: 'Hint cost',
  release: 'Release',
  race: 'Race',
  password: 'Password',
  joining: 'Joining',
  on: 'On',
  off: 'Off',
  set: 'Set',
  none: 'None',
  hostOnly: 'Host only',
  withApproval: 'Direct, with approval',
  open: 'Direct, open',
} as const;

const RUN_STATUS: Record<SessionStatus, RunStatusView> = {
  draft: { label: 'Draft', tone: 'neutral' },
  generating: { label: 'Generating', tone: 'warning' },
  starting: { label: 'Starting', tone: 'warning' },
  hosting: { label: 'Hosting', tone: 'success' },
  stopped: { label: 'Stopped', tone: 'neutral' },
  failed: { label: 'Failed', tone: 'danger' },
};

export { CONFIG_TEXT, COUNT_TEXT, PHASE_URGENT, RUN_STATUS, STAGE_GAMES_TEXT };
