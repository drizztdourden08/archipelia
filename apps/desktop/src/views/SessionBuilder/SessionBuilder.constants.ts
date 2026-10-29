/* @layer renderer-app @kind config */
import type { DirectConnection, GeneratorSettings, ServerSettings } from '@archipelia/model';
import type { BuilderButton } from './SessionBuilder.type';

const DEFAULT_SERVER: ServerSettings = {
  hintCost: 10, releaseMode: 'auto', collectMode: 'auto', remainingMode: 'goal', autoShutdownMinutes: 0,
};

const DEFAULT_GENERATOR: GeneratorSettings = { spoiler: 3, race: false, progressionBalancing: true };

const DEFAULT_DIRECT: DirectConnection = { admission: 'host-approval', allowUnlisted: false };

const DEFAULT_PORT = 38281;

const DEFAULT_GG_SITE = 'https://archipelago.gg';

const SETUP_TEXT = {
  live: 'This session has an open tab. Go to its tab shows it. Where and direct connections change once you close its lobby.',
  onceBlocked: 'The name, Where and the password change only with Save and run.',
  noName: 'The session needs a name.',
  noServer: 'Pick a server to host on.',
  directPlace: 'Direct connections need Local, LAN or an Archipelia server under Where.',
  directSeat: 'A player is set to connect directly. Turn on Allow direct connections, or switch that player off.',
} as const;

const EDITOR_TEXT = {
  name: 'Session name',
  join: 'How players join',
  where: 'Where',
  direct: 'Direct',
  password: 'Password',
  world: 'World',
  change: 'Change',
  advanced: 'Advanced',
  advancedEnd: 'Port, generation and server rules',
  tabOpen: 'Tab open',
  saved: 'Saved',
  server: 'Server',
} as const;

const PLAYER_TEXT = {
  heading: 'Players',
  add: 'Add player',
  direct: 'Connects directly',
  ownGame: 'Brings their own game',
  noGame: 'No game picked yet',
  noPreset: 'no preset',
  fallback: 'fallback',
  yaml: 'YAML',
  preset: 'preset',
  edit: 'Edit',
  done: 'Done',
  duplicate: 'Duplicate',
  remove: 'Remove',
  name: 'Name',
  game: 'Game',
  source: 'Preset',
  overrides: 'Overrides',
  none: 'No player yet. Add player saves one with the session.',
  noneDirect: 'No player yet. Players can still join directly, or Add player saves one.',
  noInstalled: 'No game is installed yet. Install one on the Games page, or turn on direct connections.',
} as const;

const BUTTON_LABEL: Record<BuilderButton, string> = {
  tab: 'Go to its tab',
  run: 'Run',
  once: 'Run once with these changes',
  'save-run': 'Save and run',
  save: 'Save',
  discard: 'Discard',
};

const BUILDER_FAILURE = {
  save: 'Could not save the session.',
  start: 'Could not start the session.',
  password: 'Could not clear the room password.',
} as const;

export { BUILDER_FAILURE, BUTTON_LABEL, DEFAULT_DIRECT, DEFAULT_GENERATOR, DEFAULT_GG_SITE, DEFAULT_PORT, DEFAULT_SERVER, EDITOR_TEXT, PLAYER_TEXT, SETUP_TEXT };
