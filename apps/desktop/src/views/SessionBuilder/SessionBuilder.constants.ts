/* @layer renderer-app @kind config */
import type { GeneratorSettings, ServerSettings } from '@archipelia/model';
import type { DirectOptions } from '../../lobbies/lobbies.type';

const DEFAULT_SERVER: ServerSettings = {
  hintCost: 10, releaseMode: 'auto', collectMode: 'auto', remainingMode: 'goal', autoShutdownMinutes: 0,
};

const DEFAULT_GENERATOR: GeneratorSettings = { spoiler: 3, race: false, progressionBalancing: true };

const NAME_LIMIT = 16;

const DEFAULT_DIRECT: DirectOptions = { admission: 'host-approval', allowUnlisted: false };

const DISABLE_DIRECT = {
  title: 'Turn off direct connection?',
  message: 'The lobby of this session closes. Connected players leave, and a room that runs from it stops.',
  confirmLabel: 'Turn it off',
  variant: 'danger',
} as const;

const DEFAULT_PORT = 38281;

const DEFAULT_GG_SITE = 'https://archipelago.gg';

const YAML_VALUE = 'yaml';

const NEW_PRESET_VALUE = 'new-preset';

const PRESET_PREFIX = 'preset:';

const YAML_EXTENSIONS = ['yaml', 'yml'];

const PLAYER_GRID_CLASS = 'session-builder__players';

const PLAYERS_TEXT = {
  manual: 'A player picks any installed game, then one of its presets or an imported file.',
  direct: 'The players you host yourself. Players who connect show below; the list can stay empty.',
  none: 'No player yet.',
  noneDirect: 'No player of your own. Players who connect still play.',
  noGame: 'No game installed yet. Add games in Games first.',
  added: 'Added here',
  addedTitle: 'You added this player to the session.',
} as const;

const UNSAVED_SESSION = 'A session has changes that are not saved.';

const FAILURE = {
  template: 'Could not load the session.',
  data: 'Could not load the games, presets and servers.',
  save: 'Could not save the session.',
  run: 'Could not start the run.',
  password: 'Could not clear the room password.',
  yaml: 'Could not import that YAML file.',
  preset: 'Could not make a preset for that player.',
  direct: 'Could not change the direct connection of the session.',
  other: 'Something went wrong. Try again.',
} as const;

const ACTION_KEYS = ['save', 'run', 'password', 'yaml', 'preset', 'direct'] as const;

export { ACTION_KEYS, DEFAULT_DIRECT, DEFAULT_GENERATOR, DISABLE_DIRECT, DEFAULT_GG_SITE, DEFAULT_PORT, DEFAULT_SERVER, FAILURE, NAME_LIMIT, NEW_PRESET_VALUE, PLAYER_GRID_CLASS, PLAYERS_TEXT, PRESET_PREFIX, UNSAVED_SESSION, YAML_EXTENSIONS, YAML_VALUE };
