/* @layer core @kind config */
import type { GeneratorSettings, ServerSettings } from '@archipelia/model';

const SERVER_NAME = 'Archipelia';

const OPEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const ROOM_TTL_MS = 24 * 60 * 60 * 1000;

const DEFAULT_ROOM_PORT = 38281;
const DEFAULT_MAX_SLOTS = 16;

const ROOM_SECRET_PREFIX = 'lobby-room-';
const LOBBY_ID_PREFIX = 'lb_';
const MEMBER_ID_PREFIX = 'm_';
const FILE_ID_PREFIX = 'f_';

const LOBBY_GENERATOR: GeneratorSettings = { spoiler: 1, race: false, progressionBalancing: true };
const LOBBY_SERVER: ServerSettings = { hintCost: 10, releaseMode: 'goal', collectMode: 'goal', remainingMode: 'goal', autoShutdownMinutes: 0 };

const LOBBY_FILE = 'lobby.json';
const FILES_DIR = 'files';
const OVERLAY_DIR = 'overlay';

export {
  DEFAULT_MAX_SLOTS, DEFAULT_ROOM_PORT, FILE_ID_PREFIX, FILES_DIR, LOBBY_FILE, LOBBY_GENERATOR, LOBBY_ID_PREFIX, LOBBY_SERVER, MEMBER_ID_PREFIX, OPEN_TTL_MS, OVERLAY_DIR,
  ROOM_SECRET_PREFIX, ROOM_TTL_MS, SERVER_NAME,
};
