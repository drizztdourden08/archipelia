/* @layer renderer-app @kind config */
import type { RadioOption } from '@drizztdourden08/tessera/primitives';
import type { HostWhere } from './HostChoice.type';

const WHERE_OPTIONS: RadioOption<HostWhere>[] = [
  { value: 'private', label: 'This computer only', description: 'Private. Nothing listens on the network, and only this computer can join.' },
  { value: 'lan', label: 'My local network (LAN)', description: 'Other computers on your network can find this server and join. This opens a network port.' },
  { value: 'remote', label: 'A remote Archipelia server', description: 'Use a server you saved, such as one that a friend or a host runs.' },
];

const OPEN_LAN = {
  title: 'Open this computer to your network?',
  message: 'This opens a network port and announces the server on your network, so other computers can find your lobbies and join them. Windows may ask about the firewall: allow it for private networks. You can stop it here at any time.',
  confirmLabel: 'Open to my network',
  cancelLabel: 'Keep it private',
} as const;

const FAILURE = { mode: 'Could not change where this computer hosts.' } as const;

const TEXT = {
  privateNow: 'Only this computer can reach the lobby server. Nothing is announced and no network port is open.',
  automated: 'This launch is automated, so the server stays on this computer and nothing is announced on the network.',
  internet: 'The internet option is also on. It is an advanced setting of the server on the Servers page.',
  starting: 'The lobby server is starting.',
  announced: 'Yes, other computers on your network can see it.',
  notAnnounced: 'Not yet.',
  stillOpen: 'This computer is still open to your network. Choose This computer only to stop it.',
  noRemote: 'No remote server is saved yet. Add one on the Servers page, then pick it here.',
  lockedHere: 'The lobby of this session runs on this computer. Turn Allow direct connection off to pick another server.',
  lockedRemote: 'The lobby of this session runs on a remote server. Turn Allow direct connection off to pick another place.',
} as const;

export { FAILURE, OPEN_LAN, TEXT, WHERE_OPTIONS };
