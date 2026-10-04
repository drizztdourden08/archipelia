/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'One player of a hosted room: slot, name, game, connection status, checks done and a progress bar.',
  useWhen: [
    'The players list of the session dashboard while a room is hosting.',
    'Any read only view of who is in a room and how far they are.',
  ],
  avoidWhen: [
    { case: 'A player slot being set up before the run.', use: 'PlayerRow' },
    { case: 'A single number with a label.', use: 'StatRow' },
  ],
  rules: [
    'Write checks as done of total, such as 12 of 80.',
    'Pass progress as null until the room reports the totals.',
    'Pick statusTone from the connection: success connected, neutral not yet, danger lost.',
  ],
  a11y: [
    'The row is a list item, so place it inside a list.',
    'The status is text, so it reads without its colour.',
  ],
  tree: {
    path: ['data', 'a player of a session', 'in a live room'],
    rule: 'One player of a running room with progress.',
  },
  example: `import { PlayerStatusRow } from '@archipelia/design';

const PlayerStatusRowSample = () => (
  <div role="list">
    <PlayerStatusRow slot={1} name="Ana" game="Timespinner" status="connected" statusTone="success" checks="12 of 80" progress={{ value: 12, max: 80 }} />
  </div>
);
`,
  propsHash: '498100cf95aa6e9a',
} satisfies ComponentUsage;

export { usage };
