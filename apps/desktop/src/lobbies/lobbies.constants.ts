/* @layer renderer-app @kind config */
import type { NetworkMode } from '@archipelia/server/network';
import type { LobbyServerOptions } from './lobbies.type';

const LOCAL_SERVER = 'local';

const LOBBY_REQUESTS = [
  'lobby.create', 'lobby.lock', 'lobby.close', 'lobby.start', 'member.approve', 'member.refuse', 'member.remove', 'world.consent', 'room.stop',
] as const;

const INITIAL_NETWORK_MODE: NetworkMode = 'off';

const DEFAULT_SERVER_OPTIONS: LobbyServerOptions = { mode: INITIAL_NETWORK_MODE, publicLookup: true };

const SERVER_OPTIONS_FILE = 'listener.json';

const LOOPBACK_HOST = /^(localhost|127(\.\d{1,3}){3}|::1)$/i;

const PLAIN_REMOTE = 'ws:// is only for this computer. Use wss:// to reach another computer, so the admin token is never sent in clear.';

const NOT_AN_ADDRESS = 'Enter the address as ws://host:port, or wss://host:port for a server with TLS.';

const PIN_SEPARATORS = /[\s:]/g;
const PIN_DIGEST = /^[0-9a-f]{64}$/;
const PIN_PAIR = /.{2}/g;
const BRACKETS = /^\[|\]$/g;
const AUTHORITY = /^[a-z]+:\/\/([^/?#]*)/i;
const WRITTEN_PORT = /:(\d+)$/;
const MAX_PORT = 65535;

export {
  AUTHORITY, BRACKETS, LOOPBACK_HOST, MAX_PORT, PLAIN_REMOTE, PIN_DIGEST, PIN_PAIR, PIN_SEPARATORS, WRITTEN_PORT,
  DEFAULT_SERVER_OPTIONS, INITIAL_NETWORK_MODE, LOBBY_REQUESTS, LOCAL_SERVER, NOT_AN_ADDRESS, SERVER_OPTIONS_FILE };
