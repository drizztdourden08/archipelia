/* @layer renderer-app @kind config */
const NAME_LIMIT = 16;

const YAML_VALUE = 'yaml';

const NEW_PRESET_VALUE = 'new-preset';

const PRESET_PREFIX = 'preset:';

const YAML_EXTENSIONS = ['yaml', 'yml'];

const PLAYER_GRID_CLASS = 'session-lobby__players';

const PLAYERS_TEXT = {
  manual: 'Your own players. Each picks an installed game, then one of its presets or an imported file.',
  direct: 'Your own players, then the players who joined. The list of your own can stay empty.',
  noGame: 'No game installed yet. Add games in Games first.',
  none: 'No player of your own yet.',
  noneDirect: 'No player of your own. Players who join still play.',
  added: 'Added here',
  addedTitle: 'You added this player to the session.',
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
  preset: 'Could not make a preset for that player.',
} as const;

export {
  LOBBY_FAILURE, LOBBY_SCREEN, NAME_LIMIT, NEW_PRESET_VALUE, PLAYER_GRID_CLASS, PLAYERS_TEXT, PRESET_PREFIX, YAML_EXTENSIONS, YAML_VALUE,
};
