/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Import page of the Data hub: adds the presets and session templates of an exported zip file to the library.',
  useWhen: [
    'The Import page of the Data bucket.',
  ],
  avoidWhen: [
    { case: 'Saving the library to a zip file.', use: 'LibraryExport' },
    { case: 'One player file brought into a session.', use: 'SessionBuilder' },
  ],
  rules: [
    'Pick the zip file with the file picker; a cancelled pick changes nothing and says nothing.',
    'Report how many presets and templates came in, in the status line and in a toast.',
    'Keep the button disabled while the import runs.',
  ],
  a11y: [
    'The result is a status line, read when it changes.',
    'The button says what it opens: Import a zip file.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the data on disk', 'a library import'],
    rule: 'Bring back a library saved on this or another machine.',
  },
  example: `import { LibraryImport } from '../LibraryImport';

const LibraryImportSample = () => <LibraryImport />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
