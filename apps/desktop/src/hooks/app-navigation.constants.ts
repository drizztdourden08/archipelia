/* @layer renderer-app @kind config */
const ROUTE = {
  sessions: 'multiworld/sessions',
  newSession: 'multiworld/sessions/new',
  joinSession: 'multiworld/sessions/join',
  history: 'multiworld/history',
  games: 'multiworld/games',
  builtInGames: 'multiworld/games/built-in',
  presets: 'multiworld/presets',
  engine: 'multiworld/engine',
  archipeliaServers: 'multiworld/servers/archipelia',
} as const;

const EDIT_SUB = 'edit';

export { EDIT_SUB, ROUTE };
