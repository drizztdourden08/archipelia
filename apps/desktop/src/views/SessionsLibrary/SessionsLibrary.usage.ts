/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Sessions page: the saved sessions, each with its start, edit and history link.',
  useWhen: [
    'The Sessions page, the top level entry after Home.',
  ],
  avoidWhen: [
    { case: 'One session being edited.', use: 'SessionBuilder' },
  ],
  rules: [
    'Put each session in search while the page is open, keyed by its id; picking it opens its Edit session sub-page.',
    'Open the builder as the New session or Edit session sub-page, never in place of the lists.',
    'Send a session to History with the History of this session item of its More actions menu; the label counts its runs. The runs themselves live in History, not here.',
    'Filter sessions with the page header filter, read with usePageSearch; New session is the header primary button.',
    'Deleting a session is an item of its More actions menu and asks through a danger confirm.',
    'Show a spinner in the card while the list loads; when the load fails, show its sentence with Retry in place of the card.',
    'Show a failed action as one plain sentence and keep its raw error in the app log.',
  ],
  a11y: [
    'The filter field is labelled with what it filters.',
    'The list is a titled card.',
    'An error is an alert.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the saved sessions'],
    rule: 'Every saved session.',
  },
  example: `import { SessionsLibrary } from '../SessionsLibrary';

const SessionsLibrarySample = () => <SessionsLibrary />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
