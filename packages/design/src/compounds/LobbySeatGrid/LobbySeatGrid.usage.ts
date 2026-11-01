/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The grid of the seats of a session lobby: LobbySeat cards that use the width, two or more to a row, with an accent Add player tile last.',
  useWhen: [
    'The seats inside the LobbyStage of a session tab in its lobby phase.',
  ],
  avoidWhen: [
    { case: 'The players of a room that already runs.', use: 'PlayerStatusRow' },
    { case: 'Games to install.', use: 'GameCard' },
  ],
  rules: [
    'Put one LobbySeat per seat inside, in seat order: the players of the host, the held seats, then the players who joined.',
    'The Add player tile is always last; turn it off with addDisabled while the lobby is busy, never hide it.',
    'Name the grid with label, such as Seats.',
  ],
  a11y: [
    'The grid is a group named by label.',
    'The Add player tile is a button named by addLabel.',
  ],
  tree: {
    path: ['data', 'the seats of a session lobby'],
    rule: 'Every seat of one lobby with the way to add one.',
  },
  example: `import { LobbySeat, LobbySeatGrid } from '@archipelia/design';

const LobbySeatGridSample = ({ onAdd }: { onAdd: () => void }) => (
  <LobbySeatGrid label="Seats" addLabel="Add player" onAdd={onAdd}>
    <LobbySeat state="filled" name="Ana" game="APQuest" meta={['Slot 1 · APQuest · Saved']} status={{ label: 'Ready', tone: 'success' }} />
  </LobbySeatGrid>
);
`,
  propsHash: '46ad8fefe13dab22',
} satisfies ComponentUsage;

export { usage };
