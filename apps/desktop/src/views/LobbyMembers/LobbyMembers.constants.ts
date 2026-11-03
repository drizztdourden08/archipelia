/* @layer renderer-app @kind config */
import type { LobbySeatTone } from '@archipelia/design';
import type { LobbyPhase, TrustLevel } from '@archipelia/model';
import type { TrustTag } from './LobbyMembers.type';

const MEMBER_EDITABLE_PHASES: readonly LobbyPhase[] = ['open', 'locked', 'failed'];

const MEMBER_TEXT = {
  pending: 'Waiting for your approval',
  joined: 'Joined',
  ready: 'Ready',
  approve: 'Approve',
  refuse: 'Refuse',
  remove: 'Remove',
  review: 'Review the world of',
  options: 'View options',
  sideLabel: 'Slot type',
  seat: (seat: string, pending: boolean) => (pending ? `Wants the seat ${seat}` : `Seat ${seat}`),
} as const;

const OPTION_TEXT = {
  title: (seat: string | undefined, name: string) => (seat ? `Slot ${seat} · ${name}` : name),
  name: 'Name',
  game: 'Game',
  sentBy: 'Sent by',
  noGame: 'No game sent yet',
  asks: 'Asks to join',
  close: 'Close',
  readOnly: 'You can read these options. You cannot change them.',
  loading: 'Loading the options.',
  failed: 'Could not load the options of this player.',
  notSent: 'This player has not sent the file yet.',
  unreadable: 'The file of this player could not be read as YAML.',
  noOptions: (game: string) => `The file sets no options for ${game}.`,
  slot: (name: string, game: string) => `${name}, ${game}`,
  notInstalled: 'This game is not installed here, so the options show under the names in the file.',
  raw: 'Player file (YAML)',
  plainGroup: 'Options',
  otherGroup: 'Other options',
  notSet: 'Not set',
  none: 'None',
  on: 'On',
  off: 'Off',
} as const;

const SEAT_TONES: readonly LobbySeatTone[] = ['success', 'warning', 'danger', 'info'];

const FAILURE = {
  approve: 'Could not approve the player.',
  refuse: 'Could not refuse the player.',
  remove: 'Could not remove the player.',
  consent: 'Could not save your answer about the world.',
} as const;

const TRUST_TAGS: Record<TrustLevel, TrustTag> = {
  verified: { text: 'Registered and verified', color: 'success', title: 'The client is in the registry and its world is signed by it.' },
  unlisted: { text: 'Unlisted', color: 'warning', title: 'The client is not in the registry. Each of its worlds needs your consent.' },
};

export { FAILURE, MEMBER_EDITABLE_PHASES, MEMBER_TEXT, OPTION_TEXT, SEAT_TONES, TRUST_TAGS };
