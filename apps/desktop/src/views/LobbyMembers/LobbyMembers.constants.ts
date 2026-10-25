/* @layer renderer-app @kind config */
import type { LobbyPhase, LobbyRoom, TrustLevel } from '@archipelia/model';
import type { TrustTag } from './LobbyDetail.type';

const STARTABLE_PHASES: readonly LobbyPhase[] = ['open', 'locked', 'failed'];

const MEMBER_EDITABLE_PHASES: readonly LobbyPhase[] = ['open', 'locked', 'failed'];

const RESULT_PHASES: readonly LobbyPhase[] = ['hosting', 'closed', 'failed'];

const NO_READY_SLOT = 'No slot is ready to play yet. Approve a player and wait for its files.';

const FAILURE = {
  load: 'Could not load the lobby.',
  lock: 'Could not lock the lobby.',
  start: 'Could not start the lobby.',
  close: 'Could not close the lobby.',
  stopRoom: 'Could not stop the room.',
  approve: 'Could not approve the player.',
  refuse: 'Could not refuse the player.',
  remove: 'Could not remove the player.',
  consent: 'Could not save your answer about the world.',
} as const;

const TRUST_TAGS: Record<TrustLevel, TrustTag> = {
  verified: { text: 'Registered and verified', color: 'success', title: 'The client is in the registry and its world is signed by it.' },
  unlisted: { text: 'Unlisted', color: 'warning', title: 'The client is not in the registry. Each of its worlds needs your consent.' },
};

const TLS_TEXT: Record<LobbyRoom['tls'], string> = { yes: 'TLS', no: 'No TLS', auto: 'TLS when the host has it' };

const GONE = 'This lobby is not on the server any more.';

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export { DATE_FORMAT, FAILURE, GONE, MEMBER_EDITABLE_PHASES, NO_READY_SLOT, RESULT_PHASES, STARTABLE_PHASES, TLS_TEXT, TRUST_TAGS };
