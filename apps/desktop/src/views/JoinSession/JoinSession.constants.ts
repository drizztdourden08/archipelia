/* @layer renderer-app @kind config */
const DEFAULTS_VALUE = '';

const YAML_VALUE = 'yaml';

const YAML_EXTENSIONS = ['yaml', 'yml'];

const TEXT = {
  intro: 'Join a session that another host runs, as a player. Look for servers on your network, or type the address and the session code you were given.',
  empty: 'No other server found on your network yet. A server shows up here when its host chose My local network (LAN).',
  looking: 'Looking for servers on your network.',
  notLooking: 'Archipelia listens on your network only while you look for servers.',
  joinable: 'Open for players',
  notJoinable: 'Not open for players now',
  open: 'Open sessions',
  closed: 'No open session',
  listedOnly: 'This session takes listed clients only. Archipelia joins as an unlisted client, so ask the host to turn on Allow unlisted clients.',
  defaults: 'Game defaults',
  importFile: 'Import a player file',
  player: 'Your player',
  playerIntro: 'Pick the game you play and its options. Archipelia sends the player file, and the world of the game when it has one, to the host.',
  noGames: 'No game installed yet. Add games in Games first.',
  noJoins: 'You have not joined a session yet.',
  joined: 'Joined sessions',
  versionMismatch: (lobbyAp: string, localAp: string) =>
    `This session runs Archipelago ${lobbyAp}. This computer runs Archipelago ${localAp}. Install Archipelago ${lobbyAp} in Engine, then join again.`,
} as const;

const PROBLEM = {
  name: 'A player name holds 1 to 16 characters.',
  displayName: 'Your name holds 1 to 32 characters.',
  game: 'Pick a game.',
  file: 'Import a player file first.',
} as const;

const FAILURE = {
  probe: 'Could not look at the session.',
  join: 'Could not join the session.',
  file: 'Could not import that player file.',
  load: 'Could not load the sessions you joined.',
  leave: 'Could not leave the session.',
  resume: 'Could not reconnect to the session.',
} as const;

const NAME_LIMIT = 16;

const DISPLAY_LIMIT = 32;

export { DEFAULTS_VALUE, DISPLAY_LIMIT, FAILURE, NAME_LIMIT, PROBLEM, TEXT, YAML_EXTENSIONS, YAML_VALUE };
