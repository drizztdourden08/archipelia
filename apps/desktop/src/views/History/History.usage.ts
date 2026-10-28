/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The History page: every finished or live run in a list, and for the picked run where it came from, who played, the config it ran with and its output.',
  useWhen: [
    'The History page, the top level entry after Sessions.',
  ],
  avoidWhen: [
    { case: 'The saved sessions to edit or start.', use: 'Sessions' },
    { case: 'One run that is live, with its room and widgets.', use: 'SessionDashboard' },
  ],
  rules: [
    'List the runs newest first with the session name, the date, the seed, the status and a chip that names the source: from the session with its changes, matched by name, or unknown.',
    'Filter the list by session, status and date with the three selects, and by text with the page header filter, read with usePageSearch.',
    'Show the detail of the picked run in this order: source, changes for this run, players, config, output.',
    'The source is a link to the saved session, or the words Session deleted when it is gone.',
    'Show a player origin as a tag, and the client and trust only for a player who joined; show nothing that the record does not hold.',
    'Run again with this config stays off until the session tabs land.',
    'Clean old runs is the action of the list header; it asks first with the count and says the output files go too.',
    'Deleting a run asks first through a danger confirm and is off while the run is live.',
    'Show a failed action as one plain sentence and keep its raw error in the app log.',
  ],
  a11y: [
    'The three selects are named by what they filter.',
    'The detail sections are regions named by their title; the changes and the players are real tables.',
    'An error is an alert.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the runs that were made from sessions'],
    rule: 'Every run, with its source, players, config and output.',
  },
  example: `import { History } from '../History';

const HistorySample = () => <History />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
