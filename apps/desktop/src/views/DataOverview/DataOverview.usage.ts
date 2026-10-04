/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Overview page of the Data hub: where the data folder is, its total size, and the files and size of each kind of data.',
  useWhen: [
    'The Overview page of the Data bucket.',
  ],
  avoidWhen: [
    { case: 'A headline size on its own.', use: 'StatTile' },
    { case: 'The old runs to remove.', use: 'OldRuns' },
  ],
  rules: [
    'Read the sizes when the page opens; the view keeps no copy between visits.',
    'Offer Open folder only where the platform can reveal it.',
    'A failed read is an alert with a Retry button; a failed refresh keeps the last sizes under the alert.',
  ],
  a11y: [
    'Errors are alerts.',
    'Each kind of data is a card titled with its name, with Files and Size rows.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the data on disk', 'the folder sizes'],
    rule: 'How much Archipelia keeps on disk and where.',
  },
  example: `import { DataOverview } from '../DataOverview';

const DataOverviewSample = () => <DataOverview />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
