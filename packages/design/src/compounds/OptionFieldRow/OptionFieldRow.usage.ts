/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'One game option drawn from its definition: a FormRow with its name, its description that folds when long, its hint, the changed mark and reset, around the input that fits its kind.',
  useWhen: [
    'Each option of a preset editor.',
    'Each override row in the session builder.',
  ],
  avoidWhen: [
    { case: 'An option row whose control is built by hand.', use: 'FormRow' },
    { case: 'The bare input without a row.', use: 'OptionControl' },
  ],
  rules: [
    'Pass the definition and the current value; the row takes the label, the description and the advanced tag from the definition.',
    'Compute changed against what reset goes back to.',
    'Pass a hint only when it adds something the description does not say.',
    'Pass onProblem with a stable callback to hold a save while a JSON option does not parse.',
  ],
  a11y: [
    'The name of the row is the label of its control, so the control is named after the option display name.',
    'The reset button is named Reset and the label, and the problem line is an alert.',
    'The More and Less button reports whether the description is expanded and is named after the label, such as More about Starting hearts.',
  ],
  tree: {
    path: ['a value the user sets', 'a game option', 'the whole row from its definition'],
    rule: 'A full option row built from the game schema.',
  },
  example: `import type { OptionDef, OptionValue } from '@archipelia/model';
import { OptionFieldRow } from '@archipelia/design';

const OptionFieldRowSample = ({ def, value, onChange, onReset }: {
  def: OptionDef;
  value: OptionValue;
  onChange: (next: OptionValue) => void;
  onReset: () => void;
}) => <OptionFieldRow def={def} value={value} changed={false} onChange={onChange} onReset={onReset} />;
`,
  propsHash: '75283e39062d4e64',
} satisfies ComponentUsage;

export { usage };
