/* @layer renderer-app @kind config */
const LOAD_FAILED = 'Could not load your Archipelia servers.';

const STATUS_FAILED = 'Could not read the state of the lobby server.';

const LOBBY_LOAD_FAILED = 'Could not load the lobby of this session.';

const STATUS_POLL_MS = 5000;

const LAN_FAILED = 'Could not look for servers on your network.';

const OTHER_FAILURE = 'Something went wrong. Try again.';

const SESSION_FAILED = {
  template: 'Could not load the session.',
  data: 'Could not load the games, presets and servers.',
  gone: 'This session no longer exists. Back to Sessions lists the saved ones.',
  loading: 'Loading the session',
} as const;

const RUN_AGAIN_GONE = 'The saved session of this run is gone, so it cannot run again. New session builds one.';

const UNSAVED_SESSION = 'A session has changes that are not saved.';

const OPEN_LAN = {
  title: 'Open this computer to your network?',
  message: 'This session runs on your network, so its room opens a network port, and with direct connections on the lobby opens one too and is announced there. Archipelia asks this once. Windows may ask about the firewall: allow it for private networks.',
  confirmLabel: 'Open to my network',
  cancelLabel: 'Keep it private',
} as const;

export { LAN_FAILED, LOAD_FAILED, LOBBY_LOAD_FAILED, OPEN_LAN, OTHER_FAILURE, RUN_AGAIN_GONE, SESSION_FAILED, STATUS_FAILED, STATUS_POLL_MS, UNSAVED_SESSION };
