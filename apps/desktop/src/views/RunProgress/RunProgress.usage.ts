/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The dialog that follows a session run from generation to hosting, with its log, cancel and hide.',
  useWhen: [
    'After Run in the sessions library or the session builder.',
    'Opening a run that is still generating or starting.',
  ],
  avoidWhen: [
    { case: 'The progress panel inside another frame.', use: 'RunProgressPanel' },
    { case: 'A room that is already hosting.', use: 'SessionDashboard' },
  ],
  rules: [
    'Pass launch as null to close it; useRunLauncher holds the launch.',
    'Hide keeps the run going; Cancel stops it.',
    'Title the dialog Running or Run failed with the session name.',
  ],
  a11y: [
    'The dialog is titled with the run state and the session name.',
    'Escape and Hide close it without stopping the run.',
  ],
  tree: {
    path: ['something over the page', 'a session run as it starts'],
    rule: 'The dialog over the page while a run starts.',
  },
  example: `import { RunProgress } from '../RunProgress';

const RunProgressSample = ({ onClose }: { onClose: () => void }) => <RunProgress launch={null} onClose={onClose} />;
`,
  propsHash: 'ba2bd218c2a1a1be',
} satisfies ComponentUsage;

export { usage };
