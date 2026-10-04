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
    'Draw the label outside it, usually through OptionField, and pass the id of that label as labelId.',
  ],
  a11y: [
    'With labelId, each input points at the visible label through aria-labelledby; where the Tessera input cannot take it, the input sits in a group named by the label or takes the display name.',
    'Without labelId, each input is labelled from the option display name.',
    'A counter row is named by the option label and its name, and its Remove button by the name, such as Remove Bombs.',
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
  propsHash: '5bbe2fc25df75fbb',
} satisfies ComponentUsage;

export { usage };
