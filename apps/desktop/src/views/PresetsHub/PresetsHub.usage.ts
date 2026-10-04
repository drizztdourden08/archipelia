/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Presets page: every preset grouped by game beside the editor of the picked one, with the create dialog and a confirm before discarding or deleting.',
  useWhen: [
    'The Presets page of the Library group.',
  ],
  avoidWhen: [
    { case: 'One preset in its editor.', use: 'PresetEditor' },
    { case: 'A preset in a list.', use: 'PresetListItem' },
  ],
  rules: [
    'Put each preset in search while the page is open, keyed by its id with its presetId as the param, so picking it selects that preset.',
    'Ask before leaving a preset with unsaved changes.',
    'Ask before deleting a preset, and name what uses it.',
    'When no game is installed, say so in a caption under New preset and offer Open Games beside it.',
  ],
  a11y: [
    'The list and the detail are two regions of the master detail layout.',
    'Each confirm has a title and a danger button that says what it does.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the presets of every game'],
    rule: 'Every preset, picked from a list.',
  },
  example: `import { PresetsHub } from '../PresetsHub';

const PresetsHubSample = () => <PresetsHub />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
