/* @layer renderer-app @kind config */
const ROUTE = {
  sessions: 'multiworld/sessions',
  newSession: 'multiworld/sessions/new',
  games: 'multiworld/games',
  presets: 'multiworld/presets',
  officialGames: 'multiworld/games/official',
  installedGames: 'multiworld/games/installed',
  engine: 'multiworld/engine',
} as const;

const EDIT_SUB = 'edit';

export { EDIT_SUB, ROUTE };
