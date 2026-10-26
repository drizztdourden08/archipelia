/* @layer renderer-app @kind config */
const ROUTE = {
  sessions: 'multiworld/sessions',
  newSession: 'multiworld/sessions/new',
  joinSession: 'multiworld/sessions/join',
  games: 'multiworld/games',
  officialGames: 'multiworld/games/official',
  presets: 'multiworld/presets',
  engine: 'multiworld/engine',
  archipeliaServers: 'multiworld/servers/archipelia',
} as const;

const EDIT_SUB = 'edit';

export { EDIT_SUB, ROUTE };
