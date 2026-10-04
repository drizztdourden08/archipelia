/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'One part of the Data hub: the folder sizes, the old runs to clean, the library export or the library import.',
  useWhen: [
    'The pages of the Data bucket, one part per page.',
  ],
  avoidWhen: [
    { case: 'A headline size on its own.', use: 'StatCard' },
    { case: 'A list of the runs themselves.', use: 'RunRow' },
  ],
  rules: [
    'Pick the part from the page that draws it; one page shows one part.',
    'Keep the work in useDataView; the view only lays out the buttons and the message.',
    'Report the result of an export, import or clean in the status line, not in a toast.',
    'Removing old runs is a danger button that asks first with the count and says the output files go too.',
  ],
  a11y: [
    'The result of each action is a status line, read when it changes.',
    'Each button names what it does and to what, such as Export presets and templates.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the data on disk'],
    rule: 'What Archipelia keeps on disk and how to move it.',
  },
  example: `import { DataView } from '../DataView';

const DataViewSample = () => <DataView part="overview" />;
`,
  propsHash: 'dbd54b2428c82309',
} satisfies ComponentUsage;

export { usage };
