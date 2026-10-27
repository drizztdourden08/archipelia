/* @layer renderer-app @kind config */
const IDLE_TEXT = {
  sessions: 'Open Sessions',
  newSession: 'New session',
  join: 'Join a session',
  none: 'No session is open. Run a session to open it here.',
  loading: 'Loading open sessions',
} as const;

const TABS_TEXT = { label: 'Open sessions', gone: 'Deleted session' } as const;

const TAB_MENU = {
  zone: 'session.tabs',
  label: 'Tab actions',
  close: 'Close',
  closeOthers: 'Close other tabs',
  onlyTab: 'There is no other tab.',
} as const;

const RESULTS_TEXT = {
  stopped: 'The room is stopped. Its seed and files stay in History.',
  again: 'Run again',
  history: 'Open in History',
  close: 'Close tab',
} as const;

export { IDLE_TEXT, RESULTS_TEXT, TAB_MENU, TABS_TEXT };
