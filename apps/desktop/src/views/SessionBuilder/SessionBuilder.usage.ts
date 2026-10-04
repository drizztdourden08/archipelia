/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The session builder: its name, the players with their games and presets, the overrides of the picked player, and the generation and server options.',
  useWhen: [
    'Creating or editing a session template from the sessions library.',
  ],
  avoidWhen: [
    { case: 'The list of templates and runs.', use: 'SessionsLibrary' },
    { case: 'The options of one preset.', use: 'PresetEditor' },
  ],
  rules: [
    'Start from a template: newTemplate for a new one, the saved one to edit.',
    'Turn Run off while the problem list is not empty.',
    'Save the template before running it.',
  ],
  a11y: [
    'The template name field is labelled.',
    'Each player row is a group named after its slot.',
    'An error is an alert.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'a session being built'],
    rule: 'The players and options of one session.',
  },
  example: `import type { SessionTemplate } from '@archipelia/model';
import { SessionBuilder } from '../SessionBuilder';

const SessionBuilderSample = ({ initial, onBack, onRun }: {
  initial: SessionTemplate;
  onBack: () => void;
  onRun: (template: SessionTemplate) => void;
}) => <SessionBuilder initial={initial} onBack={onBack} onRun={onRun} />;
`,
  propsHash: '90237815ca84afa6',
} satisfies ComponentUsage;

export { usage };
