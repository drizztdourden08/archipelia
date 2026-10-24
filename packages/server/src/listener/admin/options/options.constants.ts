/* @layer core @kind config */
const ADMISSIONS = ['open', 'host-approval'] as const;

const RELEASE_MODES = ['disabled', 'enabled', 'auto', 'auto-enabled', 'goal'] as const;

const REMAINING_MODES = ['disabled', 'enabled', 'goal'] as const;

const SPOILER_LEVELS = [0, 1, 2, 3] as const;

const OPTION_KEYS = ['admission', 'allowUnlisted', 'maxSlots', 'room', 'generator', 'server'] as const;

const GENERATOR_KEYS = ['spoiler', 'race', 'progressionBalancing'] as const;

const SERVER_KEYS = ['hintCost', 'releaseMode', 'collectMode', 'remainingMode', 'autoShutdownMinutes'] as const;

const ROOM_KEYS = { local: ['kind', 'port'], 'archipelago-gg': ['kind', 'baseUrl'], remote: ['kind', 'serverId'] } as const;

const ENGINE_KEYS = ['id', 'ap', 'python'] as const;

const SLOT_RANGE = { min: 1, max: 500 };

const PORT_RANGE = { min: 1024, max: 65535 };

const HINT_RANGE = { min: 0, max: 100 };

const SHUTDOWN_RANGE = { min: 0, max: 525600 };

const TEXT_LIMIT = 200;

export {
  ADMISSIONS, ENGINE_KEYS, GENERATOR_KEYS, HINT_RANGE, OPTION_KEYS, PORT_RANGE, RELEASE_MODES, REMAINING_MODES, ROOM_KEYS, SERVER_KEYS, SHUTDOWN_RANGE, SLOT_RANGE,
  SPOILER_LEVELS, TEXT_LIMIT,
};
