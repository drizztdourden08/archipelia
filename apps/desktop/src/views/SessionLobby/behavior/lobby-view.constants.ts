/* @layer renderer-app @kind config */
import type { LobbyPhase, LobbyRoom } from '@archipelia/model';

const RESULT_PHASES: readonly LobbyPhase[] = ['hosting', 'closed', 'failed'];

const TLS_TEXT: Record<LobbyRoom['tls'], string> = { yes: 'TLS', no: 'No TLS', auto: 'TLS when the host has it' };

const SERVER_DOWN = 'The lobby server on this computer is not running, so the session cannot take players. The Servers page says why.';

const SERVER_STARTING = 'The lobby server on this computer is starting.';

const LOBBY_TEXT = {
  lobby: 'Lobby',
  join: 'How players join',
  gone: 'The lobby of this session is not on the server any more. Start session opens a new one.',
  ran: 'This session already ran. Start session opens a new lobby for a new run.',
  closing: 'An earlier lobby of this session is not closed yet, because its server did not answer. Archipelia keeps trying until it closes.',
} as const;

const NETWORK_TEXT = {
  privateNow: 'Only this computer can reach the lobby server. Nothing is announced and no network port is open.',
  automated: 'This launch is automated, so the server stays on this computer and nothing is announced on the network.',
  internet: 'The internet option is also on. It is an advanced setting of the server on the Servers page.',
  starting: 'The lobby server is starting.',
  announced: 'Yes, other computers on your network can see it.',
  notAnnounced: 'Not yet.',
  stillOpen: 'This computer is still open to your network. Stop closes it.',
} as const;

export { LOBBY_TEXT, NETWORK_TEXT, RESULT_PHASES, SERVER_DOWN, SERVER_STARTING, TLS_TEXT };
