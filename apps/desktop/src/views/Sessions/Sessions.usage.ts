/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Sessions page: the saved sessions in a list, and for the picked one its setup, its saved players and its Run actions.',
  useWhen: [
    'The Sessions page, the top level entry after Home.',
  ],
  avoidWhen: [
    { case: 'The runs of a session, their output and their logs.', use: 'History' },
    { case: 'The lobby, the room, the addresses and the status of a session that is open.', use: 'SessionLobby' },
  ],
  rules: [
    'List each saved session with its name, where it runs, its player count and the date of its last run; the list has its own filter.',
    'Show the setup of the picked session on the right with SessionBuilder: the form, the Players section and the Run actions.',
    'Put each session in search while the page is open, keyed by its id; picking it opens its Edit session sub-page.',
    'Open New session as a sub-page from the header primary button, and Join a session from the list header.',
    'Ask before the picked session changes while the form on the right holds unsaved edits.',
    'Duplicate and Delete are items of the row menu; deleting asks through a danger confirm and the runs stay in History.',
    'Show a run, a lobby, a status or an address nowhere on this page.',
    'Show a spinner in the list while it loads; when the load fails, show its sentence with Retry above the list.',
    'Show a failed action as one plain sentence and keep its raw error in the app log.',
  ],
  a11y: [
    'The filter field is labelled with what it filters.',
    'The list is named Sessions and the detail is a region named session.',
    'An error is an alert.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the saved sessions'],
    rule: 'Every saved session, with the setup of the picked one.',
  },
  example: `import { Sessions } from '../Sessions';

const SessionsSample = () => <Sessions />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
