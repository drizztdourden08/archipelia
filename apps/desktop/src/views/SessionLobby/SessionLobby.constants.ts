/* @layer renderer-app @kind config */
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
  heading: 'Players',
  hint: 'Pick a seat to change its player. A player who connects directly takes a seat once you approve them.',
  grid: 'Seats',
  add: 'Add player',
  saved: 'Saved',
  savedTitle: 'This player is saved with the session.',
  added: 'Added here',
  addedTitle: 'You added this player for this run only.',
  slot: 'Slot',
  waitingFor: 'Waiting for',
  toConnect: 'to connect',
  ownGame: 'Their own game',
  noPreset: 'no preset',
  fromFile: 'from file',
  keep: 'Keep in session',
  duplicate: 'Duplicate',
  remove: 'Remove',
  nameLabel: 'Name',
  gameLabel: 'Game',
  presetLabel: 'Preset',
  overridesLabel: 'Overrides',
  done: 'Done',
  editTitle: 'Edit player',
} as const;

const LOBBY_SCREEN = {
  loading: 'Loading the lobby',
  where: 'Where',
  code: 'Session code',
  codeCopy: 'session code',
  edit: 'Edit setup',
  close: 'Close lobby',
  closeTab: 'Close tab',
} as const;

const LOBBY_FAILURE = {
  run: 'Could not start the run.',
  close: 'Could not close the lobby.',
  yaml: 'Could not import that YAML file.',
  keep: 'Could not keep the player in the session.',
  preset: 'Could not make a preset for that player.',
} as const;

export {
  LOBBY_FAILURE, LOBBY_SCREEN, NAME_LIMIT, NEW_PRESET_VALUE, OWN_GAME, PLAYERS_TEXT, PRESET_PREFIX, SEAT_EDITOR_CLASS, SEAT_TEXT, YAML_EXTENSIONS, YAML_VALUE,
};
