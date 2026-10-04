/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Export page of the Data hub: saves every preset and saved session to one zip file the user picks.',
  useWhen: [
    'The Export page of the Data bucket.',
  ],
  avoidWhen: [
    { case: 'Bringing a library zip back in.', use: 'LibraryImport' },
    { case: 'One player file of a preset.', use: 'PresetEditor' },
  ],
  rules: [
    'Ask where to save with the save dialog, named archipelia-library.zip by default.',
    'Report where the file went in the status line, and toast it.',
    'Keep the button disabled while the export runs.',
  ],
  a11y: [
    'The result is a status line, read when it changes.',
    'The button says what it exports: Export presets and sessions.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the data on disk', 'a library export'],
    rule: 'Take the presets and sessions to another machine or keep a backup.',
  },
  example: `import { LibraryExport } from '../LibraryExport';

const LibraryExportSample = () => <LibraryExport />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
