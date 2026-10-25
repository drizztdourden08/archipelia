/* @layer renderer-app @kind config */
const REVIEW_GAME = { apworld: 'apquest', game: 'APQuest', card: 'APQuest' } as const;

const REVIEW_PRESET = 'Review preset';

const REVIEW_SESSION = 'Review session';

const REVIEW_PLAYERS = ['Ana', 'Bo'] as const;

const REVIEW_PORT = 38295;

const REVIEW_CHECKS = 3;

const RUN_TIMEOUT_MS = 240000;

const HEARTBEAT_MS = 10000;

const REVIEW_SERVER = { label: 'Review box', host: '192.0.2.10', user: 'ap', keyPath: 'C:\\keys\\review_ed25519', apPath: '/opt/archipelago' } as const;

const SERVER_PROBLEMS = ['Give the server a label.', 'Enter the host name or address.', 'Enter the user name.', 'The Archipelago path must be absolute.', 'Enter the path of the key file.'];

const SERVER_UNTOUCHED = 'Enter the host name or address.';

const SERVER_UI = { add: 'Add server', name: 'Server label', create: 'Add', save: 'Save', discard: 'Discard', remove: 'Remove', host: 'Host' } as const;

const SAVE_STATE = { dirty: /^Unsaved changes/, saved: /^Saved/, clean: /^No changes/ } as const;

const SERVER_FIELDS: [string, string][] = [
  ['Label', REVIEW_SERVER.label], ['Host', REVIEW_SERVER.host], ['User name', REVIEW_SERVER.user],
  ['Key file', REVIEW_SERVER.keyPath], ['Archipelago path on the host', REVIEW_SERVER.apPath],
];

const REVIEW_DIRECT = 'Review direct session';

const DIRECT_RUN_MS = 30000;

const REVIEW_PLAYER = 'Zelda';

const DIRECT_UI = {
  allow: /^Allow direct connection/, unlisted: /^Allow unlisted clients/, run: 'Run', offTitle: 'Turn off direct connection?', off: 'Turn it off', section: 'Direct connection',
} as const;

const JOIN_UI = { player: /^Player name/, display: /^Your name/, join: 'Join as a player', address: /^Server address/, code: /^Session code/, look: 'Look at the session' } as const;

const HOST_UI = {
  private: /^This computer only/, lan: /^My local network/, remote: /^A remote Archipelia server/, askTitle: 'Open this computer to your network?', open: 'Open to my network',
  stop: 'Stop', find: 'Find servers on my network', stopFind: 'Stop looking',
} as const;

const REVIEW_JOINER = 'Cy';

const STORAGE_FOLDERS = ['Sessions', 'Presets', 'Installed games'];

const GUARD_DIALOG = 'Unsaved changes';

export {
  DIRECT_RUN_MS, DIRECT_UI, GUARD_DIALOG, HEARTBEAT_MS, HOST_UI, JOIN_UI, REVIEW_CHECKS, REVIEW_DIRECT, REVIEW_GAME, REVIEW_JOINER, REVIEW_PLAYER, REVIEW_PLAYERS, REVIEW_PORT, REVIEW_PRESET, REVIEW_SERVER, REVIEW_SESSION, RUN_TIMEOUT_MS, SAVE_STATE, SERVER_FIELDS, SERVER_PROBLEMS,
  SERVER_UI, SERVER_UNTOUCHED, STORAGE_FOLDERS,
};
