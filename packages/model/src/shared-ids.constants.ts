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
  tools: 'tools',
} as const;

const ENGINE_JOB = 'archipelia-engine-setup';

const BUILD_JOB = { venv: 'ap-build-venv', tools: 'ap-build-tools', crates: 'ap-build-crates', wheel: 'ap-build-wheel' } as const;

const TOOL_JOB = { none: 'ap-tool-user', system: 'ap-tool-system' } as const;

const RUN_JOB_PREFIX = 'archipelia-run-';

const LOBBY_TEMPLATE_PREFIX = 'lobby-';

export { BUILD_JOB, DOMAIN, ENGINE_JOB, LOBBY_TEMPLATE_PREFIX, RUN_JOB_PREFIX, TOOL_JOB };
