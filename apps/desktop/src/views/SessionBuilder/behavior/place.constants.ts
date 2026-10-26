/* @layer renderer-app @kind config */
const GG_VALUE = 'gg';

const SSH_PREFIX = 'ssh:';

const LOBBY_PREFIX = 'lobby:';

const PLACE_TEXT = {
  where: { title: 'Where', description: 'Where the session lives: on this computer, open to your network, or on a remote server.' },
  local: 'The room runs on this computer.',
  localDirect: 'This computer only. The lobby is private and nothing is announced on your network.',
  lan: 'My local network. Other computers on your network find the lobby and join it. This opens a network port.',
  lanOff: 'Turn on Allow direct connections first, so players on your network have a lobby to join.',
  remote: 'A remote server: archipelago.gg, a machine over SSH, or an Archipelia server.',
  noArchipelia: 'No Archipelia server is saved yet. Add one on the Servers page.',
  lockedHere: 'Players are connected to this session on this computer. Remove them first to move the session to another server.',
  lockedRemote: 'Players are connected to this session on a remote server. Remove them first to move the session.',
} as const;

const REMOTE_TEXT = {
  row: { title: 'Server', description: 'The remote server that runs the session.', hint: 'Add or edit servers on the Servers page.' },
  gg: 'The website hosts the room.',
  ssh: 'Runs the room on this machine over SSH.',
  lobby: 'Runs the lobby and the room on this server.',
  needsNoDirect: 'Direct connections need Local, LAN or an Archipelia server.',
  needsDirect: 'An Archipelia server takes direct connections. Turn on Allow direct connections to use it.',
} as const;

const DIRECT_TEXT = {
  allow: {
    title: 'Allow direct connections',
    description: 'Players with an Archipelia client join the lobby of this session and become its players.',
    hint: 'Direct connections run on this computer or an Archipelia server, so turning it on moves a room on archipelago.gg or SSH to Local.',
  },
  approval: {
    title: 'Host approval',
    description: 'You approve each player before the server parses or runs anything they sent. Turn it off to accept every player at once.',
    hint: 'Keep it on: a session code can leak.',
  },
  unlisted: {
    title: 'Allow unlisted clients',
    description: 'Let clients that are not in the registry join, Archipelia among them. Each of their worlds needs your consent before it runs.',
    hint: 'An unlisted world runs its Python code with your user rights.',
  },
  password: { title: 'Room password', description: 'Players type it to join the room.', hint: 'Kept in the vault, never in the saved session.' },
  passwordStored: 'A password is stored. Type to replace it.',
} as const;

const OPEN_LAN = {
  title: 'Open this computer to your network?',
  message: 'This opens a network port and announces the server on your network, so other computers can find your lobbies and join them. Windows may ask about the firewall: allow it for private networks. You can stop it here at any time.',
  confirmLabel: 'Open to my network',
  cancelLabel: 'Keep it private',
} as const;

const MODE_FAILURE = 'Could not change where this computer hosts.';

export { DIRECT_TEXT, GG_VALUE, LOBBY_PREFIX, MODE_FAILURE, OPEN_LAN, PLACE_TEXT, REMOTE_TEXT, SSH_PREFIX };
