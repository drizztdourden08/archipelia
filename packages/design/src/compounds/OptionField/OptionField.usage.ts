/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The frame around one game option: its name, a description that folds when long, a hint, a changed mark, a reset button and a problem line.',
  useWhen: [
    'Any control that edits a game option and needs the standard label and reset.',
    'An option whose control is built by hand, not from its definition.',
  ],
  avoidWhen: [
    { case: 'An option drawn from its definition, with the control picked for you.', use: 'OptionFieldRow' },
    { case: 'An app setting row.', use: 'SettingsRow' },
  ],
  rules: [
    'Put exactly one control in children.',
    'Set changed when the value differs from the preset or the default, so reset turns on.',
    'Pass problem only for a value the generator would refuse.',
    'Set advanced for an option the game hides in its simple view.',
  ],
  a11y: [
    'The field is a group named after the label.',
    'The reset button is named Reset and the label, and the problem line is an alert.',
    'The More and Less button reports whether the description is expanded.',
  ],
  tree: {
    path: ['a value the user sets', 'a game option', 'the frame around a control'],
    rule: 'The label, reset and problem line around one option.',
  },
  example: `import { NumberInput } from '@drizztdourden08/tessera/primitives';
import { OptionField } from '@archipelia/design';

const OptionFieldSample = ({ onReset }: { onReset: () => void }) => (
  <OptionField label="Starting hearts" description="Hearts the player starts with." changed onReset={onReset}>
    <NumberInput value={3} aria-label="Starting hearts" />
  </OptionField>
);
`,
  propsHash: '06d2c3eb5d70724a',
} satisfies ComponentUsage;

export { usage };
