/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'One past run of a session in the history: when, where it was hosted, its status and the open, log and delete actions.',
  useWhen: [
    'Each run in the history card of the sessions page.',
    'Any list of session runs that can be reopened.',
  ],
  avoidWhen: [
    { case: 'A saved template that has not run.', use: 'TemplateRow' },
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
    'The status is text in a Status.',
  ],
  tree: {
    path: ['data', 'a past run of a session'],
    rule: 'One run in the history with its actions.',
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
      status={{ label: 'stopped', tone: 'neutral' }}
      hasLog
      canDelete
      onOpen={noop}
      onShowLog={noop}
      onDelete={noop}
    />
  </div>
);
`,
  propsHash: '086d8d975f593478',
} satisfies ComponentUsage;

export { usage };
