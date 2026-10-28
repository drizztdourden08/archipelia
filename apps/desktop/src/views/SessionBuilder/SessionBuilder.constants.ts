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

const BUILDER_COLUMN_MIN = 420;

const SETUP_TEXT = {
  live: 'This session has an open tab. Go to its tab shows it. Where and direct connections change once you close its lobby.',
  onceBlocked: 'The name, Where and the password change only with Save and run.',
  noName: 'The session needs a name.',
  noServer: 'Pick a server to host on.',
  directPlace: 'Direct connections need Local, LAN or an Archipelia server under Where.',
  directSeat: 'A player is set to connect directly. Turn on Allow direct connections, or switch that player off.',
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

export { BUILDER_COLUMN_MIN, BUILDER_FAILURE, BUTTON_LABEL, DEFAULT_DIRECT, DEFAULT_GENERATOR, DEFAULT_GG_SITE, DEFAULT_PORT, DEFAULT_SERVER, SETUP_TEXT };
