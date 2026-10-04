/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'One preset in the presets list: its name, a meta line and a mark when its game is not installed.',
  useWhen: [
    'The list side of the presets page.',
    'Any picker of saved presets where one is selected at a time.',
  ],
  avoidWhen: [
    { case: 'A saved session template with run and edit actions.', use: 'TemplateRow' },
    { case: 'A preset as a dropdown choice.', use: 'Select' },
  ],
  rules: [
    'Write meta as the game and the number of changed options.',
    'Set unavailable when the game of the preset is not installed; it stays selectable.',
    'Select by id; keep the selection in the view.',
  ],
  a11y: [
    'The row is a button, pressed while selected.',
    'The not installed mark is text, read after the name.',
  ],
  tree: {
    path: ['data', 'a preset in a list'],
    rule: 'One preset to pick in the list.',
  },
  example: `import { PresetListItem } from '@archipelia/design';

const PresetListItemSample = ({ onSelect }: { onSelect: (id: string) => void }) => (
  <PresetListItem id="p1" name="Short run" meta="Timespinner, 4 changes" selected onSelect={onSelect} />
);
`,
  propsHash: '7932f440d030578f',
} satisfies ComponentUsage;

export { usage };
