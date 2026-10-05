/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Presets page: a MasterDetail with every preset grouped by game in a ManagedList beside the editor of the picked one, with the create form in the list and a question over the editor before unsaved edits are lost.',
  useWhen: [
    'The Presets page of the Library group.',
  ],
  avoidWhen: [
    { case: 'One preset in its editor.', use: 'PresetEditor' },
    { case: 'Saved servers beside their editor.', use: 'ServerManager' },
  ],
  rules: [
    'Put each preset in search while the page is open, keyed by its id with its presetId as the param, so picking it selects that preset.',
    'Group the presets by game, and name a group whose game is not installed.',
    'Open the create form from New preset; when no game is installed, say so in the form and offer Open Games.',
    'Pass the dirty state and the save of the editor, so picking another preset, New preset or Back asks over the editor first; leaving the page asks through the leave guard of the editor.',
    'After a create or a duplicate, open the new preset only when the editor holds no unsaved edit.',
    'Ask before deleting a preset: the trash of a row asks in place, the Delete of the editor names what uses it.',
  ],
  a11y: [
    'The list and the detail are two regions of the master detail layout; the list is a section named Presets.',
    'The create form is a group named New preset, and focus moves into it.',
    'The question over the editor is an alertdialog that takes focus on Stay here.',
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
