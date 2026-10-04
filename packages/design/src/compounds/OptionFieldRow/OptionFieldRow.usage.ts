/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'One game option drawn from its definition: the frame with label and reset around the control that fits its kind.',
  useWhen: [
    'Each option of a preset editor.',
    'Each override row in the session builder.',
  ],
  avoidWhen: [
    { case: 'An option whose control is built by hand.', use: 'OptionField' },
    { case: 'The bare input without a frame.', use: 'OptionControl' },
  ],
  rules: [
    'Pass the definition and the current value; the row takes the label and description from the definition.',
    'Compute changed against what reset goes back to.',
    'Pass a hint only when it adds something the description does not say.',
  ],
  a11y: [
    'The row is a group named after the option display name.',
    'The reset button and the problem line follow OptionField.',
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
  propsHash: 'f4f59a21a2996aeb',
} satisfies ComponentUsage;

export { usage };
