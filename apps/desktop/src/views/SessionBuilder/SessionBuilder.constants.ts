/* @layer renderer-app @kind config */
import type { DirectConnection, GeneratorSettings, ServerSettings } from '@archipelia/model';

const DEFAULT_SERVER: ServerSettings = {
  hintCost: 10, releaseMode: 'auto', collectMode: 'auto', remainingMode: 'goal', autoShutdownMinutes: 0,
};

const DEFAULT_GENERATOR: GeneratorSettings = { spoiler: 3, race: false, progressionBalancing: true };

const DEFAULT_DIRECT: DirectConnection = { admission: 'host-approval', allowUnlisted: false };

const DEFAULT_PORT = 38281;

const DEFAULT_GG_SITE = 'https://archipelago.gg';

const BUILDER_COLUMN_MIN = 420;

const SETUP_TEXT = {
  start: 'Start session',
  live: 'This session is running its lobby. Start session shows it. Where and direct connections change once you close the lobby.',
  noName: 'The session needs a name.',
  noServer: 'Pick a server to host on.',
  directPlace: 'Direct connections need Local, LAN or an Archipelia server under Where.',
} as const;

const BUILDER_FAILURE = {
  save: 'Could not save the session.',
  start: 'Could not start the session.',
  password: 'Could not clear the room password.',
} as const;

export { BUILDER_COLUMN_MIN, BUILDER_FAILURE, DEFAULT_DIRECT, DEFAULT_GENERATOR, DEFAULT_GG_SITE, DEFAULT_PORT, DEFAULT_SERVER, SETUP_TEXT };
