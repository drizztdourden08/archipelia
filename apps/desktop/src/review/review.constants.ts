/* @layer renderer-app @kind config */
const REVIEW_GAME = { apworld: 'apquest', game: 'APQuest', card: 'APQuest' } as const;

const REVIEW_PRESET = 'Review preset';

const REVIEW_SESSION = 'Review session';

const REVIEW_PLAYERS = ['Ana', 'Bo'] as const;

const REVIEW_PORT = 38295;

const REVIEW_CHECKS = 3;

const RUN_TIMEOUT_MS = 240000;

const HEARTBEAT_MS = 10000;

const HEARTBEAT_LIMIT_MS = 600000;

const MS_PER_SECOND = 1000;

const SERVER_ANSWER_MS = 10000;

const LISTEN_WAIT_MS = 30000;

const LISTEN_POLL_MS = 100;

const REVIEW_SERVER = { label: 'Review box', host: '192.0.2.10', user: 'ap', keyPath: 'C:\\keys\\review_ed25519', apPath: '/opt/archipelago' } as const;

const SERVER_PROBLEMS = ['Give the server a label.', 'Enter the host name or address.', 'Enter the user name.', 'The Archipelago path must be absolute.', 'Enter the path of the key file.'];

const SERVER_UNTOUCHED = 'Enter the host name or address.';

const SERVER_UI = { add: 'Add server', name: 'Server label', create: 'Add', save: 'Save', discard: 'Discard', remove: 'Remove', host: 'Host', back: 'Back' } as const;

const SAVE_STATE = { dirty: /^Unsaved changes/, saved: /^Saved/, clean: /^No changes/ } as const;

const SERVER_FIELDS: [string, string][] = [
  ['Label', REVIEW_SERVER.label], ['Host', REVIEW_SERVER.host], ['User name', REVIEW_SERVER.user],
  ['Key file', REVIEW_SERVER.keyPath], ['Archipelago path on the host', REVIEW_SERVER.apPath],
];

const REVIEW_DIRECT = 'Review direct session';

const DIRECT_RUN_MS = 30000;

const REVIEW_PLAYER = 'Zelda';

const DIRECT_UI = { allow: /^Allow direct connection/, unlisted: /^Allow unlisted clients/, section: /how players join/i } as const;

const LOBBY_UI = {
  start: 'Save and run', run: 'Run', close: 'Close lobby', closeTitle: 'Close the lobby?', open: 'Open lobby',
} as const;

const TAB_UI = { stopAndClose: 'Stop the room and close' } as const;

const SEAT_UI = { card: '.seat-card', pending: 'attention', add: 'Add player', refuse: 'Refuse' } as const;

const REVIEW_SECOND = 'Review second session';

const JOIN_UI = { player: /^Player name/, display: /^Your name/, join: 'Join as a player', address: /^Server address/, code: /^Session code/, look: 'Look at the session' } as const;

const HOST_UI = {
  local: /^Local\b/, lan: /^LAN\b/, remote: /^Remote\b/, askTitle: 'Open this computer to your network?', open: 'Open to my network',
  stop: 'Stop', find: 'Find servers on my network', stopFind: 'Stop looking',
} as const;

const REVIEW_JOINER = 'Cy';

const STORAGE_FOLDERS = ['Sessions', 'Presets', 'Installed games'];

const GUARD_DIALOG = 'Unsaved changes';

export {
  DIRECT_RUN_MS, DIRECT_UI, GUARD_DIALOG, HEARTBEAT_LIMIT_MS, HEARTBEAT_MS, HOST_UI, JOIN_UI, LISTEN_POLL_MS, LISTEN_WAIT_MS, LOBBY_UI, MS_PER_SECOND, REVIEW_CHECKS, REVIEW_DIRECT, REVIEW_GAME, REVIEW_JOINER, REVIEW_PLAYER, REVIEW_PLAYERS, REVIEW_PORT, REVIEW_PRESET, REVIEW_SECOND, REVIEW_SERVER, REVIEW_SESSION, RUN_TIMEOUT_MS, SAVE_STATE, SEAT_UI, SERVER_ANSWER_MS, SERVER_FIELDS, SERVER_PROBLEMS,
  SERVER_UI, SERVER_UNTOUCHED, STORAGE_FOLDERS, TAB_UI,
};
