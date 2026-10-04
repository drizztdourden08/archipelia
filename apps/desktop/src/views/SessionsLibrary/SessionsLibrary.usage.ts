/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Sessions page: the saved sessions and their runs side by side.',
  useWhen: [
    'The Sessions page of the Library group.',
  ],
  avoidWhen: [
    { case: 'One session being edited.', use: 'SessionBuilder' },
  ],
  rules: [
    'Put each session in search while the page is open, keyed by its id; picking it opens its Edit session sub-page.',
    'Open the builder as the New session or Edit session sub-page, never in place of the lists.',
    'Open a run that is still generating or starting in its job dialog, and any other run on the dashboard; Show log opens the job dialog of any run.',
    'Filter sessions and runs with the page header filter, read with usePageSearch; New session is the header primary button.',
    'Deleting a run is a danger button and deleting a session is an item of its More actions menu; both ask through a danger confirm.',
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
