/* @layer renderer-app @kind config */
import type { LobbySeatStatus } from '@archipelia/design';

const NAME_LIMIT = 16;

const YAML_VALUE = 'yaml';

const NEW_PRESET_VALUE = 'new-preset';

const OWN_GAME = 'own-game';

const PRESET_PREFIX = 'preset:';

const YAML_EXTENSIONS = ['yaml', 'yml'];

const SEAT_EDITOR_CLASS = 'session-lobby__seat-editor';

const PLAYERS_TEXT = {
  saved: 'The players saved with this session. A direct player connects on their own and brings their own game, after you approve them.',
  noGame: 'No game installed yet. Add games in Games first.',
  none: 'No player of your own yet.',
  noneDirect: 'No player of your own. Players who join still play.',
} as const;

const SEAT_TEXT = {
  grid: 'Seats',
  add: 'Add player',
  saved: 'Saved',
  added: 'Added here',
  slot: 'Slot',
  waitingFor: 'Waiting for',
  toConnect: 'to connect',
  ownGame: 'Their own game',
  preset: 'Preset',
  noPreset: 'No preset',
  fromFile: 'From file',
  ready: 'Ready',
  readyTitle: 'This player has a game and a preset and is ready to run.',
  needsFix: 'Needs a fix',
  needsFixTitle: 'Run lists what this player is missing.',
  edit: 'Edit',
  keep: 'Keep in session',
  duplicate: 'Duplicate',
  remove: 'Remove',
  nameLabel: 'Name',
  gameLabel: 'Game',
  presetLabel: 'Preset',
  overridesLabel: 'Overrides',
  done: 'Done',
  editTitle: 'Edit player',
  player: 'player',
  players: 'players',
} as const;

const SEAT_STATUS = {
  ready: { label: SEAT_TEXT.ready, tone: 'success', title: SEAT_TEXT.readyTitle },
  needsFix: { label: SEAT_TEXT.needsFix, tone: 'warning', title: SEAT_TEXT.needsFixTitle },
} as const satisfies Record<string, LobbySeatStatus>;

const LOBBY_SCREEN = {
  loading: 'Loading the lobby',
  lobby: 'Lobby',
  lan: 'LAN',
  code: 'Session code',
  codeCopy: 'Copy session code',
  close: 'Close lobby',
  closeTab: 'Close tab',
  config: 'Config',
  configEdit: 'Edit',
  failed: 'The last run failed:',
} as const;

const CONFIG_TEXT = {
  hintCost: 'Hint cost',
  release: 'Release',
  race: 'Race',
  password: 'Password',
  joining: 'Joining',
  on: 'On',
  off: 'Off',
  set: 'Set',
  none: 'None',
  hostOnly: 'Host only',
  withApproval: 'Direct, with approval',
  open: 'Direct, open',
} as const;

const LOBBY_FAILURE = {
  run: 'Could not start the run.',
  close: 'Could not close the lobby.',
  yaml: 'Could not import that YAML file.',
  keep: 'Could not keep the player in the session.',
  preset: 'Could not make a preset for that player.',
} as const;

export {
  CONFIG_TEXT, LOBBY_FAILURE, LOBBY_SCREEN, NAME_LIMIT, NEW_PRESET_VALUE, OWN_GAME, PLAYERS_TEXT, PRESET_PREFIX, SEAT_EDITOR_CLASS, SEAT_STATUS, SEAT_TEXT, YAML_EXTENSIONS, YAML_VALUE,
};
