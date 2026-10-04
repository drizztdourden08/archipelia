/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'One player slot of the session builder: name, game, preset or file, the override count and the row actions.',
  useWhen: [
    'Each player in the players card of the session builder.',
    'Any editable list of session slots where each slot picks a game and a preset.',
  ],
  avoidWhen: [
    { case: 'A player of a running room, read only.', use: 'PlayerStatusRow' },
    { case: 'A record with many fields edited in a dialog.', use: 'CreateRecordDialog' },
  ],
  rules: [
    'Every callback takes the slot number, so one handler serves every row.',
    'Set selected on the row whose overrides are open.',
    'Set canEdit only when the slot has a game and a preset to override.',
    'Show the import button only for the yaml source; the row does that from source.',
  ],
  a11y: [
    'The row is a group named Player and the slot number.',
    'The name, game and preset inputs and every button are named after the player, such as Remove player 2.',
  ],
  tree: {
    path: ['data', 'a player of a session', 'in the session builder'],
    rule: 'One editable slot of the session.',
  },
  example: `import { PlayerRow } from '@archipelia/design';

const noop = () => {};

const PlayerRowSample = () => (
  <PlayerRow
    slot={1}
    name="Ana"
    game="Timespinner"
    source="preset-1"
    gameOptions={[{ value: 'Timespinner', label: 'Timespinner' }]}
    sourceOptions={[{ value: 'preset-1', label: 'Default' }]}
    overrides="2 changes"
    changed
    selected={false}
    canEdit
    onName={noop}
    onGame={noop}
    onSource={noop}
    onImport={noop}
    onEdit={noop}
    onDuplicate={noop}
    onRemove={noop}
  />
);
`,
  propsHash: 'b9d59bc8bacb5de5',
} satisfies ComponentUsage;

export { usage };
