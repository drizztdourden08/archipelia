/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A load or an action of the app that failed: one plain sentence and, for a load, a Retry button that runs it again.',
  useWhen: [
    'A list, a file or a page that could not be loaded.',
    'An action such as install, save or delete that did not go through.',
  ],
  avoidWhen: [
    { case: 'A note that stays on the page and is not a failure.', use: 'Callout' },
    { case: 'A long job that failed with its steps and log.', use: 'TaskProgress' },
  ],
  rules: [
    'Write the message as one plain sentence about the action, such as Could not load your sessions.',
    'Never show the raw error: log it to the app log and show the sentence.',
    'Pass onRetry when running the same load again can help; leave it out for an action the user can click again.',
  ],
  a11y: [
    'The callout is an alert, read when it shows.',
    'Retry is a labelled button after the sentence.',
  ],
  tree: {
    path: ['feedback', 'a part of the page failed'],
    rule: 'A failed load or action with a plain sentence.',
  },
  example: `import { ErrorCallout } from '@archipelia/design';

const ErrorCalloutSample = ({ onRetry }: { onRetry: () => void }) => (
  <ErrorCallout message="Could not load your sessions." onRetry={onRetry} />
);
`,
  propsHash: 'ca87709308a534e4',
} satisfies ComponentUsage;

export { usage };
