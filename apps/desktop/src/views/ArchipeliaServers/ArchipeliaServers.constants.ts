/* @layer renderer-app @kind config */
import type { SettingsOption } from '@drizztdourden08/tessera/composites';
import type { NetworkMode } from '@archipelia/server/network';
import type { LanMatch, ServerDraft } from './ArchipeliaServers.type';

const MODE_OPTIONS: SettingsOption[] = [
  { value: 'lan', label: 'LAN only', hint: 'Computers on your network find this server by themselves. Nothing is opened on the router.' },
  { value: 'lan-and-internet', label: 'LAN and internet', hint: 'Also asks the router to open the ports. It needs a router that allows it.' },
  { value: 'off', label: 'Off', hint: 'Not announced and no router port. Players can still type the address.' },
];

const EMPTY_DRAFT: ServerDraft = { label: '', url: '', token: '', pin: '' };

const MODE_VALUES: readonly NetworkMode[] = ['lan', 'lan-and-internet', 'off'];

const NO_PIN = 'None. The connection is plain, or the certificate is one your computer trusts.';

const FORM_TEXT = {
  label: { title: 'Label', description: 'How the server is named in lists.', hint: 'Any name you like.' },
  url: { title: 'Address', description: 'Where the server listens, such as wss://play.example.net:38290.', hint: 'Use ws:// only for a server on your own network.' },
  token: { title: 'Admin token', description: 'The secret the server made at its first start.', hint: 'Stored in the vault, never in the settings.' },
  pin: { title: 'Certificate pin', description: 'The SHA-256 fingerprint of the server certificate.', hint: 'Leave it empty and test the server: the fingerprint is shown for you to trust.' },
} as const;

const NETWORK_TEXT = {
  mode: { title: 'Network mode', description: 'Who can find and reach the lobby server on this computer.', hint: 'There is no relay: reaching players over the internet is your own setup.' },
  lookup: {
    title: 'Look up my public address',
    description: 'Asks a public web service which address the internet sees, to tell whether your connection is shared with other customers.',
    hint: 'Used only in the mode LAN and internet. Off sends nothing.',
  },
} as const;

const REACH_TEXT = {
  noRouterRequest: 'Not asked for in this mode.',
  waitingRouter: 'Waiting for the router.',
  noLookup: 'Not used in this mode.',
  tlsOff: 'Off. The lobby is LAN-only until the server has TLS.',
  tlsOn: 'On',
  advertised: 'Yes, other computers on your network can see it.',
  notAdvertised: 'No.',
  notAdvertisedOff: 'No, the mode is Off.',
  notAdvertisedAutomated: 'No, this launch is automated.',
} as const;

const LAN_TEXT = {
  empty: 'No server found on your network. Servers announce themselves when their mode is LAN only or LAN and internet.',
  same: 'Same version as your engine',
  different: 'Another Archipelago version',
  unknown: 'You have no engine yet',
  self: 'This computer',
  open: 'Open lobbies',
  closed: 'No open lobby',
} as const;

const MATCH_LABEL: Record<LanMatch, string> = { same: LAN_TEXT.same, different: LAN_TEXT.different, unknown: LAN_TEXT.unknown };

const FAILURE = {
  apply: 'Could not change the network mode.',
  save: 'Could not save the server.',
  test: 'Could not test the server.',
  remove: 'Could not remove the server.',
  rename: 'Could not rename the server.',
  token: 'Could not store the admin token.',
  trust: 'Could not trust the certificate.',
} as const;

const NO_SERVER = 'Pick This computer, a remote server, or add a remote server to manage its lobbies here.';

const REMOTE_EMPTY = 'No remote server yet. Add one to manage its lobbies from here.';

const PROBLEM = {
  label: 'Give the server a label.',
  url: 'Enter the address as ws://host:port, or wss://host:port for a server with TLS.',
  token: 'Enter the admin token of the server.',
  pin: 'The pin is 64 hexadecimal digits, with or without colons.',
} as const;

export { EMPTY_DRAFT, FAILURE, FORM_TEXT, LAN_TEXT, MATCH_LABEL, MODE_OPTIONS, MODE_VALUES, NETWORK_TEXT, NO_PIN, NO_SERVER, PROBLEM, REACH_TEXT, REMOTE_EMPTY };
