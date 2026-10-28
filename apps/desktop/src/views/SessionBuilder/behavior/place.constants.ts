/* @layer renderer-app @kind config */
const GG_VALUE = 'gg';

const SSH_PREFIX = 'ssh:';

const LOBBY_PREFIX = 'lobby:';

const NEEDS_PLACE = 'Direct connections need Local, LAN or an Archipelia server under Where.';

const PLACE_TEXT = {
  where: { title: 'Where', description: 'Where the room runs and who can reach it: this computer, your network, or a remote server.' },
  local: 'This computer only. The room and the lobby stay on this computer, and nothing is announced on your network.',
  lan: 'This computer, open to your local network: any Archipelago client on it can reach the room. The lobby port opens and the session is announced on the network only with direct connections on. Run asks once before it opens a network port.',
  remote: 'A remote server: archipelago.gg, a machine over SSH, or an Archipelia server.',
  live: 'Close the lobby of this session first to change where it runs.',
  noArchipelia: 'Direct connections on a remote server need an Archipelia server, and none is saved yet. Add one on the Servers page.',
} as const;

const REMOTE_TEXT = {
  row: { title: 'Server', description: 'The remote server that runs the session.', hint: 'Add or edit servers on the Servers page.' },
  gg: 'The website hosts the room.',
  ssh: 'Runs the room on this machine over SSH.',
  lobby: 'Runs the lobby and the room on this server.',
  needsNoDirect: 'Direct connections on a remote server need an Archipelia server. Turn them off to use this one.',
} as const;

const DIRECT_TEXT = {
  allow: {
    title: 'Allow direct connections',
    description: 'Players with an Archipelia client join the lobby of this session and add their own players.',
  },
  reach: {
    local: 'Only clients on this computer can join, because Where is Local.',
    lan: 'Clients on your network can join, because Where is LAN.',
    archipelia: 'Clients that reach the Archipelia server can join.',
    gg: NEEDS_PLACE,
    ssh: NEEDS_PLACE,
  },
  mismatch: 'Direct connections do not work with archipelago.gg or SSH. Pick Local, LAN or an Archipelia server under Where, or turn this off.',
  live: 'Close the lobby of this session first to change this.',
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
  worlds: {
    title: 'Joins directly',
    description: 'These worlds of the session have a client that joins the lobby from inside the game.',
    hint: 'Those players join from the game itself.',
    unlisted: 'A world marked with a warning is not in the registry, so its client joins as unlisted. Turn on Allow unlisted clients, or it cannot join.',
  },
  password: { title: 'Room password', description: 'Players type it to join the room.', hint: 'Kept in the vault, never in the saved session.' },
  passwordStored: 'A password is stored. Type to replace it.',
  passwordRemote: 'An Archipelia server makes its own room password and gives it to the players with their files.',
} as const;

export { DIRECT_TEXT, GG_VALUE, LOBBY_PREFIX, PLACE_TEXT, REMOTE_TEXT, SSH_PREFIX };
