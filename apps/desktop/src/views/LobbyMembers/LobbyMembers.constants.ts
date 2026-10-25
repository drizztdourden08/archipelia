/* @layer renderer-app @kind config */
import type { LobbyPhase, TrustLevel } from '@archipelia/model';
import type { TrustTag } from './LobbyMembers.type';

const MEMBER_EDITABLE_PHASES: readonly LobbyPhase[] = ['open', 'locked', 'failed'];

const SHOWN_ADMISSIONS = ['pending', 'approved'];

const EMPTY = 'Nobody has connected yet. Give players the address and the session code below.';

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

export { EMPTY, FAILURE, MEMBER_EDITABLE_PHASES, SHOWN_ADMISSIONS, TRUST_TAGS };
