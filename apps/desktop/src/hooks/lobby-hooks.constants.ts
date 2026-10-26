/* @layer renderer-app @kind config */
const LOAD_FAILED = 'Could not load your Archipelia servers.';

const STATUS_FAILED = 'Could not read the state of the lobby server.';

const LOBBY_LOAD_FAILED = 'Could not load the lobby of this session.';

const LAN_FAILED = 'Could not look for servers on your network.';

const OTHER_FAILURE = 'Something went wrong. Try again.';

const SESSION_FAILED = {
  template: 'Could not load the session.',
  data: 'Could not load the games, presets and servers.',
  gone: 'This session no longer exists. Back to Sessions lists the saved ones.',
  loading: 'Loading the session',
} as const;

const UNSAVED_SESSION = 'A session has changes that are not saved.';

const OPEN_LAN = {
  title: 'Open this computer to your network?',
  message: 'This session runs on your network, so this opens a network port and announces the server there. Windows may ask about the firewall: allow it for private networks. Stop on the lobby screen closes it.',
  confirmLabel: 'Open to my network',
  cancelLabel: 'Keep it private',
} as const;

export { LAN_FAILED, LOAD_FAILED, LOBBY_LOAD_FAILED, OPEN_LAN, OTHER_FAILURE, SESSION_FAILED, STATUS_FAILED, UNSAVED_SESSION };
