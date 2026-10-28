/* @layer renderer-app @kind config */
const LIST_WIDTH = { initial: 380, min: 300, max: 560 } as const;

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

const TEXT = {
  noSessions: 'No session yet. New session builds one.',
  noMatch: 'No session matches',
  pick: 'Pick a session to see its setup and its players.',
  neverRun: 'never run',
  join: 'Join a session',
} as const;

const LEAVE_UNSAVED = {
  title: 'Leave this session?',
  message: 'The session on the right has changes that are not saved. Leaving it drops them.',
  confirmLabel: 'Discard changes',
  cancelLabel: 'Keep editing',
} as const;

const FAILURE = {
  load: 'Could not load your sessions.',
  duplicate: 'Could not duplicate the session.',
  deleteSession: 'Could not delete the session.',
} as const;

export { DATE_FORMAT, FAILURE, LEAVE_UNSAVED, LIST_WIDTH, TEXT };
