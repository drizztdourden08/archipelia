/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Sessions page: the saved sessions and their runs side by side, the builder while one is edited, and the run dialog.',
  useWhen: [
    'The Sessions page of the Library group.',
  ],
  avoidWhen: [
    { case: 'One session being edited.', use: 'SessionBuilder' },
    { case: 'A run in progress.', use: 'RunProgress' },
  ],
  rules: [
    'Put each session in search while the page is open, and open the builder on a new session when the page is opened with the create param.',
    'Open the builder in place of the lists while a session is edited.',
    'Open a run that is still starting in the run dialog, and any other run on the dashboard.',
    'Filter sessions and runs with the same query.',
    'Deleting a session or a run is a danger button behind a danger confirm.',
  ],
  a11y: [
    'The filter field is labelled with what it filters.',
    'The two lists are titled cards.',
    'An error is an alert.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the saved sessions and their runs'],
    rule: 'Every saved session and every run.',
  },
  example: `import { SessionsLibrary } from '../SessionsLibrary';

const SessionsLibrarySample = () => <SessionsLibrary />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
