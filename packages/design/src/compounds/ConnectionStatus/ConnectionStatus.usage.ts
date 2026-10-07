/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The state of the live view of a room, with the reason under it, a Retry that counts down to the next try and the room password when it asks for one.',
  useWhen: [
    'A widget that shows live data from a room and says whether it is connected.',
    'A connection the app opens again by itself after a wait, with Retry to skip the wait.',
  ],
  avoidWhen: [
    { case: 'The state of a run, such as Hosting or Stopped.', use: 'SessionStatusBar' },
    { case: 'A load or an action that failed and is not a connection.', use: 'ErrorCallout' },
  ],
  rules: [
    'Pass the phase of the connection; the words and tones come from CONNECTION_STATUS, so every widget reads the same.',
    'Put the reason in detail as one plain sentence, such as Live data shows while the room is hosting.',
    'Pass onRetry to offer Retry while the phase is reconnecting, closed or failed; keep the timer in the app and pass retryAt, attempt and attempts.',
    'Set retrying while a try runs, so Retry shows a spinner and takes no second click.',
    'Pass auth, such as a PasswordInput and a Connect button, for the password phase; it shows only then.',
  ],
  a11y: [
    'The status is a live region, so a new phase is read when it changes.',
    'Retry is named Retry, or Retry now while a countdown runs, and the countdown line describes it.',
  ],
  tree: {
    path: ['a status, a count or a label', 'the state something is in'],
    rule: 'The phase of a live connection to a room, with its retry and password.',
  },
  example: `import { ConnectionStatus } from '@archipelia/design';

const ConnectionStatusSample = ({ nextTry, onRetry }: { nextTry: number | null; onRetry: () => void }) => (
  <ConnectionStatus
    phase="reconnecting"
    detail="The room stopped answering."
    onRetry={onRetry}
    retryAt={nextTry}
    attempt={2}
    attempts={5}
  />
);
`,
  propsHash: 'df0e4daeee88739b',
} satisfies ComponentUsage;

export { usage };
