/* @layer renderer-app @kind config */
import type { LobbyPhase, LobbyRoom } from '@archipelia/model';

const RESULT_PHASES: readonly LobbyPhase[] = ['hosting', 'closed', 'failed'];

const TLS_TEXT: Record<LobbyRoom['tls'], string> = { yes: 'TLS', no: 'No TLS', auto: 'TLS when the host has it' };

const SERVER_DOWN = 'The lobby server on this computer is not running, so players cannot join. The Servers page says why.';

const SERVER_STARTING = 'The lobby server on this computer is starting.';

const TEXT = {
  allow: {
    title: 'Allow direct connection',
    description: 'Players with an Archipelia client connect to this session and become its players. Run makes one seed with your players and theirs.',
    hint: 'Turning it on opens a lobby on the server you pick under Where to host.',
  },
  approval: {
    title: 'Host approval',
    description: 'You approve each player before the server parses or runs anything they sent. Turn it off to accept every player at once.',
    hint: 'Keep it on: a session code can leak.',
  },
  unlisted: {
    title: 'Allow unlisted clients',
    description: 'Let clients that are not in the registry join, Archipelia among them. Each of their worlds needs your consent before it runs.',
    hint: 'An unlisted world runs its Python code with your user rights.',
  },
  gone: 'The lobby of this session is not on the server any more. Turn Allow direct connection off and on again to open a new one.',
  ran: 'This session already ran. Turn Allow direct connection off and on again to take players for a new run.',
  join: 'How players join',
} as const;

export { RESULT_PHASES, SERVER_DOWN, SERVER_STARTING, TEXT, TLS_TEXT };
