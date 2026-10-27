/* @layer renderer-app @kind config */
const ROUTE = {
  sessions: 'multiworld/sessions',
  newSession: 'multiworld/sessions/new',
  joinSession: 'multiworld/sessions/join',
  games: 'multiworld/games',
  builtInGames: 'multiworld/games/built-in',
  presets: 'multiworld/presets',
  engine: 'multiworld/engine',
  archipeliaServers: 'multiworld/servers/archipelia',
} as const;

const EDIT_SUB = 'edit';

const LOBBY_SUB = 'lobby';

export { EDIT_SUB, LOBBY_SUB, ROUTE };
