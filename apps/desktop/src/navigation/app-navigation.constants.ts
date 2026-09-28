/* @layer renderer-app @kind config */

const BASE_SCREEN = 'session';

const MULTIWORLD_HUB = 'multiworld';

const DATA_HUB = 'data';

const SECTION = {
  home: 'home',
  sessions: 'sessions',
  presets: 'presets',
  games: 'games',
  servers: 'servers',
  hosting: 'hosting',
  gg: 'archipelago-gg',
  general: 'general',
  engine: 'engine',
  about: 'about',
  overview: 'overview',
  runs: 'runs',
  export: 'export',
  import: 'import',
} as const;

export { BASE_SCREEN, DATA_HUB, MULTIWORLD_HUB, SECTION };
