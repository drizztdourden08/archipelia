/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Old runs page of the Data hub: how many runs are kept, how many are old, and a button that removes the old ones.',
  useWhen: [
    'The Old runs page of the Data bucket.',
  ],
  avoidWhen: [
    { case: 'A list of the runs themselves.', use: 'RunRow' },
  ],
  rules: [
    'A run is old after the clean age and only when it no longer generates, starts or hosts.',
    'Removing old runs is a danger button that asks first with the count and says the output files go too.',
    'Report the result in the status line under the card, or a failure as one plain sentence in an alert.',
  ],
  a11y: [
    'The result is a status line, read when it changes.',
    'The button names the age it removes, such as Remove runs older than 30 days.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the old runs to clean'],
    rule: 'Free the space taken by runs nobody opens any more.',
  },
  example: `import { OldRuns } from '../OldRuns';

const OldRunsSample = () => <OldRuns />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
