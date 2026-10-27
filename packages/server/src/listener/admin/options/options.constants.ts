/* @layer core @kind config */
import { ADMISSIONS, RELEASE_MODES, REMAINING_MODES, SPOILER_LEVELS } from '@archipelia/model';

const OPTION_KEYS = ['admission', 'allowUnlisted', 'maxSlots', 'room', 'generator', 'server'] as const;

const GENERATOR_KEYS = ['spoiler', 'race', 'progressionBalancing'] as const;

const SERVER_KEYS = ['hintCost', 'releaseMode', 'collectMode', 'remainingMode', 'autoShutdownMinutes'] as const;

const ROOM_KEYS = { local: ['kind', 'port'], 'archipelago-gg': ['kind', 'baseUrl'], remote: ['kind', 'serverId'] } as const;

const ENGINE_KEYS = ['id', 'ap', 'python'] as const;

const SOURCE_KEYS = ['sessionId', 'sessionName', 'overrides'] as const;

const OVERRIDE_KEYS = ['field', 'label', 'from', 'to'] as const;

const SLOT_ORIGINS = ['saved', 'added'] as const;

const OVERRIDES_MAX = 100;

const OVERRIDE_TEXT_LIMIT = 1000;

const SLOT_RANGE ={ min: 1, max: 500 };

const PORT_RANGE = { min: 1024, max: 65535 };

const HINT_RANGE = { min: 0, max: 100 };

const SHUTDOWN_RANGE = { min: 0, max: 525600 };

const TEXT_LIMIT = 200;

export {
  ADMISSIONS, ENGINE_KEYS, GENERATOR_KEYS, HINT_RANGE, OPTION_KEYS, OVERRIDE_KEYS, OVERRIDE_TEXT_LIMIT, OVERRIDES_MAX, PORT_RANGE, RELEASE_MODES, REMAINING_MODES, ROOM_KEYS,
  SERVER_KEYS, SHUTDOWN_RANGE, SLOT_ORIGINS, SLOT_RANGE, SOURCE_KEYS, SPOILER_LEVELS, TEXT_LIMIT,
};
