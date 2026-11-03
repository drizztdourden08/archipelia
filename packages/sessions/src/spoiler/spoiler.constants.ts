/* @layer core @kind config */
const VERSION_LINE = /^Archipelago Version (\S+)\s+-\s+Seed:\s*(\S+)/;

const PLAYER_LINE = /^Player (\d+): (.*)$/;

const SECTION_LINE = /^([A-Z][^:]*):\s*$/;

const SPHERE_OPEN = /^(\d+): \{\s*$/;

const ENTRANCE_LINE = /^(.*?) (<=>|=>|<=) (.*)$/;

const PATH_STEP_PREFIX = /^\s*(=>)?\s*/;

const GAME_KEY = 'Game';

const SINGLE_PLAYER_NAME = 'Player 1';

const SECTION_TITLE = {
  locations: 'locations',
  playthrough: 'playthrough',
  entrances: 'entrances',
  paths: 'paths',
  unreachable: 'unreachable progression items',
} as const;

const FLAG_PROGRESSION = 1;

const FLAG_USEFUL = 2;

const FLAG_TRAP = 4;

const KEY_JOIN = '\u0000';

export {
  ENTRANCE_LINE, FLAG_PROGRESSION, FLAG_TRAP, FLAG_USEFUL, GAME_KEY, KEY_JOIN, PATH_STEP_PREFIX, PLAYER_LINE, SECTION_LINE, SECTION_TITLE,
  SINGLE_PLAYER_NAME, SPHERE_OPEN, VERSION_LINE,
};
