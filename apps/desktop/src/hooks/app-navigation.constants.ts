/* @layer renderer-app @kind config */
const ROUTE = {
  sessions: 'sessions/sessions',
  newSession: 'sessions/sessions/new',
  joinSession: 'sessions/sessions/join',
  games: 'multiworld/games',
  officialGames: 'multiworld/games/official',
  presets: 'multiworld/presets',
  engine: 'multiworld/engine',
  archipeliaServers: 'multiworld/servers/archipelia',
} as const;

const EDIT_SUB = 'edit';

export { EDIT_SUB, ROUTE };
