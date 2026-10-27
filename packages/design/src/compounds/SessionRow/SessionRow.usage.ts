/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'One saved session: its name, a meta line, the number of players, the edit and run buttons and a menu with its history, duplicate and delete.',
  useWhen: [
    'Each session in the Sessions card of the Sessions page.',
    'Any list of sessions that can be run again.',
  ],
  avoidWhen: [
    { case: 'A past run of a session.', use: 'ListItemRow' },
    { case: 'The presets of every game.', use: 'ItemList' },
  ],
  rules: [
    'Write meta as the games of the session; playersLabel as the count, such as 3 players; historyLabel as the link text, such as History of this session (12 runs).',
    'Set busy while any action of the list runs, so nothing runs twice.',
    'Every callback takes the session id; double click edits.',
    'Edit and Start stay on the row; History, Duplicate and Delete sit in the More actions menu, Delete in the danger tone. The caller asks before Delete removes anything.',
  ],
  a11y: [
    'Each button is named after the session, such as Start Friday run, Edit session Friday run and More actions for Friday run.',
    'The players count is text in a Tag.',
  ],
  tree: {
    path: ['data', 'a saved session'],
    rule: 'One session to edit or run.',
  },
  example: `import { SessionRow } from '@archipelia/design';

const noop = () => {};

const SessionRowSample = () => (
  <SessionRow id="t1" name="Friday run" meta="Timespinner, Ship of Harkinian" playersLabel="2 players" historyLabel="History of this session (3 runs)" onEdit={noop} onStart={noop} onHistory={noop} onDuplicate={noop} onDelete={noop} />
);
`,
  propsHash: '3a095118f9105366',
} satisfies ComponentUsage;

export { usage };
