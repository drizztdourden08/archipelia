/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The base screen: the room that is hosting with its status bar and summary, under the session widgets Brock docks around it, or the idle state when none is.',
  useWhen: [
    'The base layer under every hub, drawn by the session screen.',
  ],
  avoidWhen: [
    { case: 'A run that is still generating.', use: 'RunProgress' },
    { case: 'Past runs of a session.', use: 'RunRow' },
  ],
  rules: [
    'Pass an empty sessionId to show the newest hosting run.',
    'Load the runs when it opens; the runs boot task loads them first.',
    'Ask before stopping a room.',
  ],
  a11y: [
    'The status bar comes first, with the status as text.',
    'Errors are alerts.',
    'The idle state names what to do next.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the room that is hosting'],
    rule: 'The live room under every hub.',
  },
  example: `import { SessionDashboard } from '../SessionDashboard';

const SessionDashboardSample = () => <SessionDashboard sessionId="" />;
`,
  propsHash: '5f4da8e951b3a87c',
} satisfies ComponentUsage;

export { usage };
