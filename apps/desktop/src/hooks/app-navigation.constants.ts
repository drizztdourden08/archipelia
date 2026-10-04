/* @layer renderer-app @kind config */
const BASE_SCREEN = 'session';

const ROUTE = {
  sessions: 'multiworld/sessions',
  games: 'multiworld/games',
  engine: 'multiworld/engine',
} as const;

export { BASE_SCREEN, ROUTE };
