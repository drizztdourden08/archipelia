/* @layer renderer-app @kind config */
import type { GeneratorSettings, ServerSettings } from '@archipelia/model';

const DEFAULT_SERVER: ServerSettings = {
  hintCost: 10, releaseMode: 'auto', collectMode: 'auto', remainingMode: 'goal', autoShutdownMinutes: 0,
};

const DEFAULT_GENERATOR: GeneratorSettings = { spoiler: 3, race: false, progressionBalancing: true };

const NAME_LIMIT = 16;

const DEFAULT_PORT = 38281;

const DEFAULT_GG_SITE = 'https://archipelago.gg';

const YAML_VALUE = 'yaml';

const NEW_PRESET_VALUE = 'new-preset';

const PRESET_PREFIX = 'preset:';

const YAML_EXTENSIONS = ['yaml', 'yml'];

const UNSAVED_SESSION = 'A session has changes that are not saved.';

export { DEFAULT_GENERATOR, DEFAULT_GG_SITE, DEFAULT_PORT, DEFAULT_SERVER, NAME_LIMIT, NEW_PRESET_VALUE, PRESET_PREFIX, UNSAVED_SESSION, YAML_EXTENSIONS, YAML_VALUE };
