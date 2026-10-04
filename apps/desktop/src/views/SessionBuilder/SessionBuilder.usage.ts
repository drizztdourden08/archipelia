/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The session builder: its name, the players with their games and presets, the overrides of the picked player, and the generation and server options.',
  useWhen: [
    'The New session and Edit session sub-pages of the Sessions page.',
  ],
  avoidWhen: [
    { case: 'The list of sessions and runs.', use: 'SessionsLibrary' },
    { case: 'The options of one preset.', use: 'PresetEditor' },
  ],
  rules: [
    'Pass no templateId for a new session, or the id of the saved one to edit; the builder loads it and says when it is gone.',
    'Turn Run off while the problem list is not empty.',
    'Save the session before running it.',
    'Guard unsaved edits with useUnsavedChanges, so Back, Escape, the hub switch, the close button and Quit ask first.',
    'Show the run dialog over the builder once Run saves the session.',
  ],
  a11y: [
    'The session name field is labelled.',
    'Each player row is a group named after its slot.',
    'An error is an alert with one plain sentence, and Retry when a load failed.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'a session being built'],
    rule: 'The players and options of one session.',
  },
  example: `import { SessionBuilder } from '../SessionBuilder';

const SessionBuilderSample = ({ templateId }: { templateId?: string }) => <SessionBuilder templateId={templateId} />;
`,
  propsHash: '2ce78803ad7c1e1c',
} satisfies ComponentUsage;

export { usage };
