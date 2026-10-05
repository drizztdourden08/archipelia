/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The input for one game option, picked from the option definition: a Toggle, a Select, a Slider, a Slider with named values, a Combobox of picks, a TagInput, a KeyValueEditor or an editable JSON CodeBlock.',
  useWhen: [
    'Editing one option value inside a FormRow or a Field that already shows its label.',
    'A preset editor or a session override that needs the right input for each option kind.',
  ],
  avoidWhen: [
    { case: 'The option with its label, description and reset.', use: 'OptionFieldRow' },
    { case: 'An app setting with a fixed input kind.', use: 'SettingsRow' },
  ],
  rules: [
    'Pass the definition from the game schema; the control picks its input from the kind and the value.',
    'Pass the current value, never the default, and write the new value back through onChange.',
    'Draw it inside a FormRow or a Field, usually through OptionFieldRow, so the row names the input.',
    'A counter, and a dict one level deep of numbers or of text, is a KeyValueEditor; any other dict or list that is not text is an editable JSON CodeBlock, checked with JSON.parse.',
    'Pass onProblem to hear while the JSON text does not parse or is not the right shape; it hears null once the text parses or the input goes away.',
  ],
  a11y: [
    'Each input takes the id and the label of its FormRow or Field, so it is named after the option display name.',
    'A named range is a Slider with labels at the named values and a number field for any other value, both named by the label.',
    'A set with few names is a Combobox that draws the picks as removable tags and searches as you type, named by the label.',
    'A KeyValueEditor is a group named by the label.',
    'The Slider of a range and its number field take the option display name.',
    'A disabled control stays visible and readable.',
  ],
  tree: {
    path: ['a value the user sets', 'a game option', 'its control alone'],
    rule: 'The input of one option, without its row.',
  },
  example: `import type { OptionDef, OptionValue } from '@archipelia/model';
import { FormRow } from '@drizztdourden08/tessera/composites';
import { OptionControl } from '@archipelia/design';

const OptionControlSample = ({ def, value, onChange }: { def: OptionDef; value: OptionValue; onChange: (next: OptionValue) => void }) => (
  <FormRow label={def.displayName}>
    <OptionControl def={def} value={value} onChange={onChange} />
  </FormRow>
);
`,
  propsHash: 'ec5bd1132a0d591a',
} satisfies ComponentUsage;

export { usage };
