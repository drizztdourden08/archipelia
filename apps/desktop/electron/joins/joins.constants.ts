/* @layer electron-main @kind config */
import type { ClientInfo } from '@drizztdourden08/archipelia-lobby-protocol';

const JOINS_FILE = 'joins.json';

const FILES_DIR = 'files';

const REPLY_TIMEOUT_MS = 20000;

const UPLOAD_TIMEOUT_MS = 120000;

const DISPLAY_NAME_LIMIT = 32;

const SLOT_NAME_LIMIT = 16;

const FALLBACK_WORLD_VERSION = '0.0.0';

const SEMVER = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;

const APWORLD_EXTENSION = '.apworld';

const MANIFEST_NAME = 'archipelago.json';

const CLIENT_ID = 'archipelia';

const CLIENT_OS: Record<string, ClientInfo['platform']['os']> = { win32: 'windows', darwin: 'macos', linux: 'linux', android: 'android' };

const CLIENT_ARCH: Record<string, ClientInfo['platform']['arch']> = { x64: 'x64', arm64: 'arm64' };

const CLIENT_HOMEPAGE = 'https://github.com/drizztdourden08/archipelia';

const TEXT = {
  noEngine: 'Set up the Archipelago engine in Engine before you join a session.',
  notJoinable: 'This session does not take new players now. Ask the host to open it again.',
  listedOnly: 'This session takes listed clients only, and Archipelia joins as an unlisted client. Ask the host to turn on Allow unlisted clients.',
  noGame: 'That game is not installed. Add it in Games first.',
  noReply: 'The server did not answer in time.',
  closed: 'The connection to the session closed. Reconnect to come back with your place.',
  unknownJoin: 'This join is not in the list any more.',
  badName: `A player name holds 1 to ${SLOT_NAME_LIMIT} characters.`,
  badDisplay: `Your name holds 1 to ${DISPLAY_NAME_LIMIT} characters.`,
  leftLobby: 'You left this session.',
  failed: 'The session failed: ',
  stopped: 'The room stopped.',
  badFile: 'A file from the host did not arrive whole. Reconnect to fetch it again.',
  uploadFailed: 'The server did not take a file. Reconnect to send it again.',
  refused: 'The host refused you.',
  making: 'The host started the session. The seed is being made.',
} as const;

const RESUMABLE = ['connecting', 'pending', 'approved', 'started', 'offline', 'failed'] as const;

const ENDING_CODES = ['refused', 'resume-invalid', 'lobby-closed'] as const;

export {
  APWORLD_EXTENSION, CLIENT_ARCH, CLIENT_HOMEPAGE, CLIENT_OS, MANIFEST_NAME, CLIENT_ID, DISPLAY_NAME_LIMIT, ENDING_CODES, FALLBACK_WORLD_VERSION, FILES_DIR, JOINS_FILE, REPLY_TIMEOUT_MS, RESUMABLE, SEMVER, SLOT_NAME_LIMIT,
  TEXT, UPLOAD_TIMEOUT_MS,
};
