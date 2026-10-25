/* @layer renderer-app @kind config */
const ROUTE = {
  sessions: 'sessions/sessions',
  newSession: 'sessions/sessions/new',
  games: 'multiworld/games',
  presets: 'multiworld/presets',
  engine: 'multiworld/engine',
  lobbies: 'multiworld/lobbies',
  newLobby: 'multiworld/lobbies/new',
  archipeliaServers: 'multiworld/servers/archipelia',
} as const;

const EDIT_SUB = 'edit';

export { EDIT_SUB, ROUTE };
