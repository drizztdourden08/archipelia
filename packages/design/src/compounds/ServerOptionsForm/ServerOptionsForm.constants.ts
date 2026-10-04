/* @layer renderer-app @kind config */
import type { SettingsOption } from '@drizztdourden08/tessera/composites';
import type { RowText } from './ServerOptionsForm.type';

const SPOILER_OPTIONS: SettingsOption[] = [
  { value: '0', label: 'None', hint: 'No spoiler log is written.' },
  { value: '1', label: 'Basic', hint: 'Lists where every item is.' },
  { value: '2', label: 'Playthrough', hint: 'Adds an order that beats the seed.' },
  { value: '3', label: 'Full with paths', hint: 'Adds how each key location is reached.' },
];

const RELEASE_OPTIONS: SettingsOption[] = [
  { value: 'disabled', label: 'Disabled', hint: 'Never allowed.' },
  { value: 'enabled', label: 'Enabled', hint: 'Allowed by command at any time.' },
  { value: 'auto', label: 'Auto', hint: 'Happens on its own once the player reaches their goal.' },
  { value: 'auto-enabled', label: 'Auto and enabled', hint: 'Happens at goal, and is allowed by command before it.' },
  { value: 'goal', label: 'After goal', hint: 'Allowed by command once the player reaches their goal.' },
];

const REMAINING_OPTIONS: SettingsOption[] = [
  { value: 'disabled', label: 'Disabled', hint: 'Never allowed.' },
  { value: 'enabled', label: 'Enabled', hint: 'Allowed at any time.' },
  { value: 'goal', label: 'After goal', hint: 'Allowed once the player reaches their goal.' },
];

const HOST_OPTIONS: SettingsOption[] = [
  { value: 'local', label: 'This computer', hint: 'Runs the server here; players connect to this computer.' },
  { value: 'archipelago-gg', label: 'archipelago.gg', hint: 'Uploads the seed and the website hosts the room.' },
  { value: 'remote', label: 'Remote server', hint: 'Runs the server on a saved server over SSH.' },
];

const NO_SERVER_TEXT = 'No remote server yet. Add one in Servers.';

const PASSWORD_STORED_HINT = 'A password is stored. Type to replace it.';

const HINT_COST_RANGE = { min: 0, max: 100, step: 1 };

const PORT_RANGE = { min: 1024, max: 65535, step: 1 };

const SHUTDOWN_RANGE = { min: 0, step: 1, unit: 'minutes' };

const SERVER_TEXT = {
  localPort: {
    label: 'Local port',
    description: 'Players connect to this computer on this port.',
    hint: 'Between 1024 and 65535; open it in the firewall for players outside this network.',
    keywords: 'network firewall',
  },
  hintCost: { label: 'Hint cost', description: "Percent of a player's checks that one hint costs.", hint: 'At 0 every hint is free.' },
  releaseMode: {
    label: 'Release mode',
    description: 'When a player may send out every item left in their world.',
    hint: 'Auto releases once the player reaches their goal.',
  },
  collectMode: {
    label: 'Collect mode',
    description: 'When a player may take back every item of theirs left in other worlds.',
    hint: 'Auto collects once the player reaches their goal.',
  },
  remainingMode: {
    label: 'Remaining mode',
    description: 'When a player may list the items still missing from their world.',
    hint: 'After goal allows it once the player reaches their goal.',
  },
  autoShutdownMinutes: {
    label: 'Auto shutdown',
    description: 'Minutes without activity before the server stops. 0 keeps it up.',
    hint: 'Counts from the last location check any player sent.',
    keywords: 'idle timeout stop',
  },
} as const satisfies Record<string, RowText>;

const GENERATION_TEXT = {
  spoiler: { label: 'Spoiler', description: 'How much the spoiler log of the seed tells.', hint: 'Full with paths also shows how each key location is reached.' },
  race: { label: 'Race mode', description: 'Hides the spoiler and the seed details from players.', hint: 'For races, where nobody may look ahead.' },
  progressionBalancing: {
    label: 'Progression balancing',
    description: 'Moves key items earlier for players who would wait.',
    hint: 'Off keeps every placement as rolled.',
  },
} as const satisfies Record<string, RowText>;

const HOST_TEXT = {
  host: { label: 'Host', description: 'Where this session runs its server.', hint: 'The Hosting settings pick it for new sessions.' },
  server: { label: 'Server', description: 'The saved server that hosts the room.', hint: 'Add or edit servers in Servers.' },
  password: { label: 'Room password', description: 'Players type it to join the room.', hint: 'Kept in the vault, never in the saved session.' },
} as const satisfies Record<string, RowText>;

export {
  GENERATION_TEXT, HINT_COST_RANGE, HOST_OPTIONS, HOST_TEXT, NO_SERVER_TEXT, PASSWORD_STORED_HINT, PORT_RANGE, RELEASE_OPTIONS, REMAINING_OPTIONS,
  SERVER_TEXT, SHUTDOWN_RANGE, SPOILER_OPTIONS,
};
