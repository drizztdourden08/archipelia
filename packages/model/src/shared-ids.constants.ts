/* @layer core @kind config */
const DOMAIN = {
  sessions: 'sessions',
  presets: 'presets',
  servers: 'servers',
  games: 'games',
  engine: 'engine',
  cache: 'cache',
  lobbies: 'lobbies',
  server: 'server',
} as const;

const ENGINE_JOB = 'archipelia-engine-setup';

const RUN_JOB_PREFIX = 'archipelia-run-';

export { DOMAIN, ENGINE_JOB, RUN_JOB_PREFIX };
