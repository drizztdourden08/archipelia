/* @layer renderer-app @kind config */
import type { DirectConnection, GeneratorSettings, ServerSettings } from '@archipelia/model';
import type { BuilderButton } from './SessionBuilder.type';

const DEFAULT_SERVER: ServerSettings = {
  hintCost: 10, releaseMode: 'auto', collectMode: 'auto', remainingMode: 'goal', autoShutdownMinutes: 0,
};

const DEFAULT_GENERATOR: GeneratorSettings = { spoiler: 3, race: false, progressionBalancing: true };

const DEFAULT_DIRECT: DirectConnection = { admission: 'host-approval', allowUnlisted: false, allowedGames: [] };

const DEFAULT_PORT = 38281;

const DEFAULT_GG_SITE = 'https://archipelago.gg';

const SETUP_TEXT = {
  live: 'This session has an open tab. Go to its tab shows it. Where and direct connections change once you close its lobby.',
  onceBlocked: 'The name, Where and the password change only with Save and run.',
} as const;

const EDITOR_TEXT = {
  name: 'Session name',
  join: 'How players join',
  where: 'Where',
  password: 'Password',
  world: 'World',
  change: 'Change',
  advanced: 'Advanced',
  advancedEnd: 'Port, generation and server rules',
  tabOpen: 'Tab open',
  saved: 'Saved',
  server: 'Server',
} as const;

const SLOTS_TEXT = {
  heading: 'Slots',
  none: 'No slots yet',
  where: 'Slots are added and set up in the lobby.',
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

export { BUILDER_FAILURE, BUTTON_LABEL, DEFAULT_DIRECT, DEFAULT_GENERATOR, DEFAULT_GG_SITE, DEFAULT_PORT, DEFAULT_SERVER, EDITOR_TEXT, SETUP_TEXT, SLOTS_TEXT };
