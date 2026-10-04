/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Sessions page: the saved templates and the run history side by side, the builder while one is edited, and the run dialog.',
  useWhen: [
    'The Sessions page of the Library group.',
  ],
  avoidWhen: [
    { case: 'One template being edited.', use: 'SessionBuilder' },
    { case: 'A run in progress.', use: 'RunProgress' },
  ],
  rules: [
    'Open the builder in place of the lists while a template is edited.',
    'Open a run that is still starting in the run dialog, and any other run on the dashboard.',
    'Filter templates and runs with the same query.',
    'Deleting a template or a run is a danger button behind a danger confirm.',
  ],
  a11y: [
    'The filter field has a placeholder that says what it filters.',
    'The two lists are titled cards.',
    'An error is an alert.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the saved sessions and their runs'],
    rule: 'Every template and every run.',
  },
  example: `import { SessionsLibrary } from '../SessionsLibrary';

const SessionsLibrarySample = () => <SessionsLibrary />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
