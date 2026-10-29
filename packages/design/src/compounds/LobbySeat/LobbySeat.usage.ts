/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'One seat of a session lobby as a roomy card: the art of its game or its initials on a tinted square, the player name, its facts, a status or a reason, and its actions.',
  useWhen: [
    'A player of the host, a held seat or a player who joined, inside a LobbySeatGrid.',
  ],
  avoidWhen: [
    { case: 'A player of a room that already runs.', use: 'PlayerStatusRow' },
    { case: 'A game to install.', use: 'GameCard' },
  ],
  rules: [
    'Pass state filled for a seat with a player, held for a seat kept for a player who has not connected, attention for a player who waits on the host.',
    'Pass game and art: the art shows only when it is a real square picture; a wide or broken picture, or none, gives the initials of the game on a tinted square, so a screenshot is never squashed.',
    'Put the facts in meta, one line each, such as Slot 1 · Hollow Knight · Saved, then the preset or the client of the player.',
    'Give a filled seat a status such as Ready, and an attention seat a reason such as Waiting for approval.',
    'Put the next step in actions, at most one primary; put small tools such as Edit or Duplicate in tools, drawn as icon buttons in the corner.',
    'Pass onOpen to make the name a button that opens the player, and selected while it is open.',
    'A held seat draws no art: pass the slot as its name and what it waits for as meta.',
  ],
  a11y: [
    'The seat is an article named after its name, and the name is a level 3 heading.',
    'Each button carries the name of the player through nameSuffix, such as Approve Zelda.',
    'The art is decoration; the name and the meta say who and what.',
  ],
  tree: {
    path: ['data', 'a seat of a session lobby'],
    rule: 'One seat of a lobby, filled, held or waiting.',
  },
  example: `import { LobbySeat } from '@archipelia/design';

const LobbySeatSample = ({ onApprove }: { onApprove: () => void }) => (
  <LobbySeat
    state="attention"
    name="Zelda"
    game="Celeste"
    meta={['Celeste · Joined', 'Review client 1.0, unlisted']}
    reason="Waiting for approval"
    actions={[{ id: 'approve', label: 'Approve', nameSuffix: 'Zelda', primary: true, onSelect: onApprove }]}
  />
);
`,
  propsHash: '0ab3d883590c9a72',
} satisfies ComponentUsage;

export { usage };
