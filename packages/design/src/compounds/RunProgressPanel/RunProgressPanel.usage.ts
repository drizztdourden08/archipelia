/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The progress of one session run: a bar, the current line, the steps from generation to hosting, the seed, the error and an optional log.',
  useWhen: [
    'The body of the run dialog while a session generates and starts.',
    'Any view that follows a run of the engine step by step.',
  ],
  avoidWhen: [
    { case: 'A bar alone with no steps.', use: 'ProgressBar' },
    { case: 'Steps of a task the user moves through.', use: 'Stepper' },
  ],
  rules: [
    'Pass percent from 0 to 100 and the line that says what runs now.',
    'Mark exactly one step current while it runs; on failure keep it current and set failed.',
    'Pass seed once the generator reports it.',
    'Show the log on demand; the panel keeps no toggle.',
  ],
  a11y: [
    'The bar is a live progress bar while the run goes on.',
    'The error is an alert.',
    'The steps are a vertical Stepper: each step reads its number, its label and whether it is done, current or failed.',
  ],
  tree: {
    path: ['feedback', 'a session as it generates and starts'],
    rule: 'The bar and steps of one run.',
  },
  example: `import { RunProgressPanel } from '@archipelia/design';

const RunProgressPanelSample = () => (
  <RunProgressPanel
    percent={40}
    line="Generating the seed"
    steps={[{ id: 'generate', label: 'Generate', state: 'current' }, { id: 'host', label: 'Host', state: 'pending' }]}
    failed={false}
    logRows={[]}
    showLog={false}
    logEmpty="No output yet"
  />
);
`,
  propsHash: 'e5270d9e6a1a9169',
} satisfies ComponentUsage;

export { usage };
