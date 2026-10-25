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
  lobbyServers: 'lobbyServers',
  joins: 'joins',
} as const;

const ENGINE_JOB = 'archipelia-engine-setup';

const RUN_JOB_PREFIX = 'archipelia-run-';

const LOBBY_TEMPLATE_PREFIX = 'lobby-';

export { DOMAIN, ENGINE_JOB, LOBBY_TEMPLATE_PREFIX, RUN_JOB_PREFIX };
