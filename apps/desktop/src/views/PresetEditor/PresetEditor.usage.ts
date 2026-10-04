/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The editor of one preset: its name, the option groups with search, every option row, save, revert, reset, import and export of its yaml.',
  useWhen: [
    'The detail side of the Presets page once a preset is picked.',
  ],
  avoidWhen: [
    { case: 'The presets list with its detail side.', use: 'PresetsHub' },
    { case: 'One option row on its own.', use: 'OptionFieldRow' },
  ],
  rules: [
    'Report dirty changes through onDirtyChange so the hub asks before it shows another preset, and guard them with useUnsavedChanges so a page switch, Back, Escape, the hub switch, the close button and Quit ask first.',
    'Keep save off while a value would be refused by the generator.',
    'Keep Save and Revert in view; Revert goes back to the last saved version and is off while nothing changed.',
    'Put Duplicate, Import YAML, Export YAML, Reset all to defaults and Delete in the More actions menu.',
    'Take duplicate and delete from the hub, which asks before it deletes.',
    'Toast the outcome of a save, saved or not saved with the reason.',
  ],
  a11y: [
    'The name field is labelled Preset name.',
    'Problems are an alert; the save result is a status line.',
    'The option groups are a tablist.',
    'More actions is an icon button named More actions that opens a menu.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'one preset being edited'],
    rule: 'Every option of one preset.',
  },
  example: `import type { GamePreset, GameSchema } from '@archipelia/model';
import { PresetEditor } from '../PresetEditor';

const noop = () => {};

const PresetEditorSample = ({ preset, schema }: { preset: GamePreset; schema: GameSchema }) => (
  <PresetEditor preset={preset} schema={schema} onDuplicate={noop} onDelete={noop} onDirtyChange={noop} />
);
`,
  propsHash: 'f4ae36cdab0f0e57',
} satisfies ComponentUsage;

export { usage };
