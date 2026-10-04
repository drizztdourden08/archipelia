/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'One saved session template: its name, a meta line, the number of players and the edit, duplicate, delete and run actions.',
  useWhen: [
    'Each template in the templates card of the sessions page.',
    'Any list of sessions that can be run again.',
  ],
  avoidWhen: [
    { case: 'A past run of a template.', use: 'RunRow' },
    { case: 'A preset of one game.', use: 'PresetListItem' },
  ],
  rules: [
    'Write meta as the games of the session; playersLabel as the count, such as 3 players.',
    'Set busy while any action of the list runs, so nothing runs twice.',
    'Every callback takes the template id; double click edits.',
  ],
  a11y: [
    'Each button has a visible label.',
    'The players count is text in a Tag.',
  ],
  tree: {
    path: ['data', 'a saved session template'],
    rule: 'One template to edit or run.',
  },
  example: `import { TemplateRow } from '@archipelia/design';

const noop = () => {};

const TemplateRowSample = () => (
  <TemplateRow id="t1" name="Friday run" meta="Timespinner, Ship of Harkinian" playersLabel="2 players" onEdit={noop} onRun={noop} onDuplicate={noop} onDelete={noop} />
);
`,
  propsHash: '3466e6da9ca8b629',
} satisfies ComponentUsage;

export { usage };
