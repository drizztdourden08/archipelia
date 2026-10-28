/* @layer renderer-app @kind config */
import type { DirectConnection, MemberAdmission } from '@archipelia/model';
import type { NetworkMode } from '@archipelia/server/network';
import type { LobbyServerOptions } from './lobbies.type';

const LOCAL_SERVER = 'local';

const CLOSED_DOOR: DirectConnection = { admission: 'host-approval', allowUnlisted: false };

const CONNECTED_ADMISSIONS: readonly MemberAdmission[] = ['pending', 'approved'];

const LOBBY_REQUESTS = [
  'lobby.create', 'lobby.update', 'lobby.lock', 'lobby.unlock', 'lobby.close', 'lobby.start', 'member.approve', 'member.refuse', 'member.remove', 'member.host', 'world.consent', 'room.stop',
] as const;

const INITIAL_NETWORK_MODE: NetworkMode = 'off';

const DEFAULT_SERVER_OPTIONS: LobbyServerOptions = { mode: INITIAL_NETWORK_MODE, publicLookup: true };

const SERVER_OPTIONS_FILE = 'listener.json';

const LOOPBACK_HOST = /^(localhost|127(\.\d{1,3}){3}|::1)$/i;

const LOOPBACK = '127.0.0.1';

const ROOM_PASSWORDS_IN_MEMORY = 'This computer has no keyring, so room passwords live in memory only. They are gone when Archipelia closes, and so are the rooms.';

const PLAIN_REMOTE = 'ws:// is only for this computer. Use wss:// to reach another computer, so the admin token is never sent in clear.';

const NOT_AN_ADDRESS = 'Enter the address as ws://host:port, or wss://host:port for a server with TLS.';

const NOT_A_JOIN_ADDRESS = 'Enter the address as host:port, such as 192.168.1.20:38290.';

const NEEDS_WSS = 'Use wss:// to reach a computer outside your network, so nothing travels in clear.';

const PRIVATE_HOST = /^(10(\.\d{1,3}){3}|192\.168(\.\d{1,3}){2}|172\.(1[6-9]|2\d|3[01])(\.\d{1,3}){2}|169\.254(\.\d{1,3}){2}|[^.]+\.local|f[cd][0-9a-f]{2}:.*|fe80:.*)$/i;

const CONNECTION_TEXT = {
  local: 'The room runs on this computer. Only this computer can reach it.',
  lan: 'The room runs on this computer, open to your network.',
  gg: 'archipelago.gg hosts the room. Its address shows once the room runs.',
  ssh: 'A machine over SSH hosts the room. Its address shows once the room runs.',
  archipelia: 'An Archipelia server holds the lobby and runs the room.',
  roomHere: 'Room on this computer',
  roomLan: 'Room on your network',
} as const;

const SCHEME = /^[a-z]+:\/\//i;

const PIN_SEPARATORS = /[\s:]/g;
const PIN_DIGEST = /^[0-9a-f]{64}$/;
const PIN_PAIR = /.{2}/g;
const BRACKETS = /^\[|\]$/g;
const AUTHORITY = /^[a-z]+:\/\/([^/?#]*)/i;
const WRITTEN_PORT = /:(\d+)$/;
const MAX_PORT = 65535;

export {
  AUTHORITY, BRACKETS, LOOPBACK, LOOPBACK_HOST, MAX_PORT, NEEDS_WSS, NOT_A_JOIN_ADDRESS, PLAIN_REMOTE, PRIVATE_HOST, SCHEME, PIN_DIGEST, PIN_PAIR, PIN_SEPARATORS, WRITTEN_PORT,
  CLOSED_DOOR, CONNECTED_ADMISSIONS, CONNECTION_TEXT, ROOM_PASSWORDS_IN_MEMORY, DEFAULT_SERVER_OPTIONS, INITIAL_NETWORK_MODE, LOBBY_REQUESTS, LOCAL_SERVER, NOT_AN_ADDRESS, SERVER_OPTIONS_FILE };
