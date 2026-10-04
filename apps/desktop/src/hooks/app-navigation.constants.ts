/* @layer renderer-app @kind config */
const ROUTE = {
  sessions: 'multiworld/sessions',
  games: 'multiworld/games',
  presets: 'multiworld/presets',
  officialGames: 'multiworld/games/official',
  installedGames: 'multiworld/games/installed',
  engine: 'multiworld/engine',
} as const;

const CREATE_PARAM = 'create';

export { CREATE_PARAM, ROUTE };
