/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Every option of a game in one panel built from its schema: a tab per option group with a count of changed options, Basic rows first and an Advanced group after them, a search box, Reset all and a reset on each changed row. In read-only mode each value is a tag.',
  useWhen: [
    'A preset editor, a slot dialog or a session override that edits the options of one game.',
    'Showing the options another player chose, read-only.',
  ],
  avoidWhen: [
    { case: 'One option row on its own.', use: 'OptionControl' },
    { case: 'The bare input of one option.', use: 'OptionControl' },
  ],
  rules: [
    'Pass the game schema and the current values; an option missing from values shows its default.',
    'Pass onChange to make it editable; Reset all and each row reset write the default back through onChange, one key at a time.',
    'Pass readOnly to show every value as a tag with no reset and no inputs.',
    'The schema groups become the tabs; a schema with no groups gets one Options tab. An option without the simple or complex visibility is Advanced.',
    'A choice of up to four values is a segmented control, a longer one a dropdown, a range of up to 100 a slider, a wider one a number box.',
    'Lines of a description that explain a choice value, written as value: text, move under the description as a short list.',
    'Pass problems keyed by option key to write a problem under the input, and onProblem to hear a JSON input that does not parse.',
    'Pass focusKey to open the tab of an option, clear a search that hides it and focus its input; onFocused tells when it is done.',
  ],
  a11y: [
    'The tabs are Tabs with arrow keys, and a tab names its count of changed options.',
    'Each input sits in a group named after the option; a problem is an alert.',
    'The reset of a row is named Reset and the option, and the changed mark is written as text.',
  ],
  tree: {
    path: ['a value the user sets', 'a game option', 'every option of a game, in tabs'],
    rule: 'All the options of one game from its schema.',
  },
  example: `import type { GameSchema, OptionValue } from '@archipelia/model';
import { GameOptionsPanel } from '@archipelia/design';

const GameOptionsPanelSample = ({ schema, values, onChange }: {
  schema: GameSchema;
  values: Record<string, OptionValue>;
  onChange: (key: string, value: OptionValue) => void;
}) => <GameOptionsPanel schema={schema} values={values} onChange={onChange} />;
`,
  propsHash: '82ca09d59db627a8',
} satisfies ComponentUsage;

export { usage };
