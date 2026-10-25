/* @layer renderer-app @kind config */
const DEFAULT_PLAYER_NAME = 'Host';

const NO_PRESET = '';

const MAX_NAME = 16;

const TEXT = {
  intro: 'You host this lobby. Add your own player so you can play in it too. The host needs no approval, so your player is ready at once.',
  noGames: 'No game is installed yet. Install one in Games, then add your player here.',
  name: 'Each player in the lobby needs its own name, at most 16 characters.',
  defaults: 'Game defaults',
} as const;

const FAILURE = { add: 'Could not add your player.' } as const;

const PROBLEM = { name: 'Give your player a name of 1 to 16 characters.', game: 'Pick a game.' } as const;

export { DEFAULT_PLAYER_NAME, FAILURE, MAX_NAME, NO_PRESET, PROBLEM, TEXT };
