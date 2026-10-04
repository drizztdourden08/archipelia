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

const SERVER_FIELDS: [string, string][] = [
  ['Label', REVIEW_SERVER.label], ['Host', REVIEW_SERVER.host], ['User name', REVIEW_SERVER.user],
  ['Key file', REVIEW_SERVER.keyPath], ['Archipelago path on the host', REVIEW_SERVER.apPath],
];

const STORAGE_FOLDERS = ['Sessions', 'Presets', 'Installed games'];

export {
  HEARTBEAT_MS, REVIEW_CHECKS, REVIEW_GAME, REVIEW_PLAYERS, REVIEW_PORT, REVIEW_PRESET, REVIEW_SERVER, REVIEW_SESSION, RUN_TIMEOUT_MS, SERVER_FIELDS, SERVER_PROBLEMS, SERVER_UNTOUCHED,
  STORAGE_FOLDERS,
};
