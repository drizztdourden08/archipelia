/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The room of one run: its status bar with Stop, and its summary, shown inside the tab of a session once it has run.',
  useWhen: [
    'The room phase of a session tab, once the session has a run.',
  ],
  avoidWhen: [
    { case: 'Past runs of a session.', use: 'History' },
  ],
  rules: [
    'Pass the id of the run to show; the tab that holds it owns which run that is and loads the runs.',
    'Ask before stopping a room.',
    'Draw a summary tile that sums up a widget as an ActionTile that opens it, Players and Hints; keep a tile that only reads a value, Checks and Uptime, a StatTile.',
  ],
  a11y: [
    'The status bar comes first, with the status as text.',
    'Errors are alerts.',
    'Each summary tile that opens a widget names its chevron after it, such as Show the Players widget.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the room that is hosting'],
    rule: 'The room of one run, inside a session tab.',
  },
  example: `import { SessionDashboard } from '../SessionDashboard';

const SessionDashboardSample = () => <SessionDashboard sessionId="run-1" />;
`,
  propsHash: '5f4da8e951b3a87c',
} satisfies ComponentUsage;

export { usage };
