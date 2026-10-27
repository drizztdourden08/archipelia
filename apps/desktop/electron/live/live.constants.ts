/* @layer electron-main @kind config */
const LIVE_FILE = 'live-sessions.json';

const OVERRIDES_ROOT = 'overrides';

const OVERRIDE_KEYS = ['players', 'lan', 'direct', 'server', 'generator'] as const;

const SERVER_OVERRIDE_KEYS = ['hintCost', 'releaseMode', 'collectMode', 'remainingMode', 'autoShutdownMinutes'] as const;

const GENERATOR_OVERRIDE_KEYS = ['spoiler', 'race', 'progressionBalancing'] as const;

const DIRECT_OVERRIDE_KEYS = ['admission', 'allowUnlisted'] as const;

const PLAYER_KEYS = ['slot', 'name', 'game', 'source', 'direct'] as const;

const PRESET_SOURCE_KEYS = ['kind', 'presetId', 'overrides'] as const;

const YAML_SOURCE_KEYS = ['kind', 'fileName', 'yaml'] as const;

const HINT_MAX = 100;

const SHUTDOWN_MAX = 525600;

const PLAYERS_MAX = 500;

const CLOSE_MODES = ['lobby', 'room', 'run'] as const;

const LIVE_TEXT = {
  notSaved: 'This session is not saved, so it cannot start. Save it first.',
  noTab: 'This session has no open tab.',
  deleted: 'The saved session of this tab is gone. Close the tab.',
  moved: 'Where changed since the lobby opened. Close the lobby, then start the session again.',
  problems: (first: string) => `The session cannot start: ${first}`,
  closeBusy: 'The session is generating or hosting. Stop the room or cancel the run first.',
  noRun: 'This session has no run to cancel.',
  remoteCancel: 'A run on an Archipelia server cannot be cancelled from here.',
  notAnOverride: (key: string) => `The override ${key} is not allowed.`,
  badOverride: (key: string) => `The override ${key} has a wrong value.`,
  badMode: 'The close mode must be lobby, room or run.',
} as const;

export {
  CLOSE_MODES, DIRECT_OVERRIDE_KEYS, GENERATOR_OVERRIDE_KEYS, HINT_MAX, LIVE_FILE, LIVE_TEXT, OVERRIDE_KEYS, OVERRIDES_ROOT, PLAYER_KEYS, PLAYERS_MAX, PRESET_SOURCE_KEYS,
  SERVER_OVERRIDE_KEYS, SHUTDOWN_MAX, YAML_SOURCE_KEYS,
};
