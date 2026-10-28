/* @layer renderer-app @kind config */
import type { LobbyPhase, MemberAdmission } from '@archipelia/model';

const PHASE_EVENT: Record<LobbyPhase, string> = {
  open: 'The lobby is open',
  locked: 'The lobby is locked',
  generating: 'Making the seed',
  hosting: 'The room is hosting',
  closed: 'The lobby is closed',
  failed: 'The run failed',
};

const ADMISSION_EVENT: Record<MemberAdmission, string> = {
  pending: 'is waiting for approval',
  approved: 'was approved',
  refused: 'was refused',
  removed: 'was removed',
};

const LOBBY_EVENTS = { opened: 'The lobby opened', ready: 'is ready', joined: 'connected' } as const;

const LOG_LIMIT = 200;

export { ADMISSION_EVENT, LOBBY_EVENTS, LOG_LIMIT, PHASE_EVENT };
