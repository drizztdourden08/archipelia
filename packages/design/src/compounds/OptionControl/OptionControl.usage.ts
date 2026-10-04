/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The input for one game option, picked from the option definition: a toggle, a choice, a range, a counter, tags, a kit or JSON.',
  useWhen: [
    'Editing one option value inside a frame that already shows its label.',
    'A preset editor or a session override that needs the right input for each option kind.',
  ],
  avoidWhen: [
    { case: 'The option with its label, description and reset.', use: 'OptionFieldRow' },
    { case: 'An app setting with a fixed input kind.', use: 'SettingsRow' },
  ],
  rules: [
    'Pass the definition from the game schema; the control picks its input from the kind and the value.',
    'Pass the current value, never the default, and write the new value back through onChange.',
    'Draw the label outside it, usually through OptionField.',
  ],
  a11y: [
    'Each input is labelled from the option display name.',
    'The counter add field, its name picker and its Add button name the option, such as New name for Starting items.',
    'A disabled control stays visible and readable.',
  ],
  tree: {
    path: ['a value the user sets', 'a game option', 'its control alone'],
    rule: 'The input of one option, without its frame.',
  },
  example: `import type { OptionDef, OptionValue } from '@archipelia/model';
import { OptionControl } from '@archipelia/design';

const OptionControlSample = ({ def, value, onChange }: { def: OptionDef; value: OptionValue; onChange: (next: OptionValue) => void }) => (
  <OptionControl def={def} value={value} onChange={onChange} />
);
`,
  propsHash: '55b3df176564d56e',
} satisfies ComponentUsage;

export { usage };
