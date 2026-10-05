/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The editor of one preset: its name, the option groups with search, every option row, a SaveBar for save and discard, and the More actions menu with duplicate, import and export of its yaml, reset and delete.',
  useWhen: [
    'The detail side of the Presets page once a preset is picked.',
  ],
  avoidWhen: [
    { case: 'The presets list with its detail side.', use: 'PresetsHub' },
    { case: 'One option row on its own.', use: 'OptionFieldRow' },
  ],
  rules: [
    'Report dirty changes through onDirtyChange and the save through onSaveChange, so the hub asks over the editor before it shows another preset, and guard them with useUnsavedChanges so a page switch, Back, Escape, the hub switch, the close button and Quit ask first.',
    'Put the SaveBar last: Not saved with the reason while a value would be refused by the generator, the name is empty or a JSON option does not parse, and Save does nothing until it is fixed.',
    'Discard goes back to the last saved version and is off while nothing changed.',
    'Put Duplicate, Import YAML, Export YAML, Reset all to defaults and Delete in the More actions menu.',
    'Take duplicate and delete from the hub, which asks before it deletes.',
    'Toast the outcome of a save, saved or not saved with the reason.',
  ],
  a11y: [
    'The name field is labelled Preset name.',
    'Each option row names its control after the option; a row problem is an alert.',
    'The save state is a status region; import and export results are a status line, their failures an alert.',
    'The option groups are a tablist whose labels count the changed options.',
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
  <PresetEditor preset={preset} schema={schema} onDuplicate={noop} onDelete={noop} onDirtyChange={noop} onSaveChange={noop} />
);
`,
  propsHash: '02a11dd90d3a424c',
} satisfies ComponentUsage;

export { usage };
