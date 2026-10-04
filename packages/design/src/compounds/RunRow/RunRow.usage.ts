/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'One past run of a session in Runs: when, where it was hosted, its status and the open, log and delete actions.',
  useWhen: [
    'Each run in the Runs card of the Sessions page.',
    'Any list of runs that can be reopened.',
  ],
  avoidWhen: [
    { case: 'A saved session to edit or run.', use: 'SessionRow' },
    { case: 'Runs to sort and filter in columns.', use: 'DataTable' },
  ],
  rules: [
    'Write when as a short relative time and host as the host label.',
    'Set canDelete to false for a run that is still hosting.',
    'Pass error only for a run that failed.',
    'Every callback takes the run id.',
  ],
  a11y: [
    'The row is a list item; double click and the Open button do the same.',
    'Each button is named after the run, such as Open run Friday run and Delete run Friday run.',
    'The status is text in a Status, from RUN_STATUS, the one status map the status bar and Home use too.',
  ],
  tree: {
    path: ['data', 'a past run of a session'],
    rule: 'One run in Runs with its actions.',
  },
  example: `import { RunRow } from '@archipelia/design';

const noop = () => {};

const RunRowSample = () => (
  <div role="list">
    <RunRow
      id="r1"
      when="2 hours ago"
      name="Friday run"
      host="This computer"
      status={{ label: 'Stopped', tone: 'neutral' }}
      hasLog
      canDelete
      onOpen={noop}
      onShowLog={noop}
      onDelete={noop}
    />
  </div>
);
`,
  propsHash: '1b5d21c26ba72b33',
} satisfies ComponentUsage;

export { usage };
