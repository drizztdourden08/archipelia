/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The framed stage of a session tab, the same frame from the lobby to the running room: the session name with its chips and actions, the code line, the seats or the player rows in its body, and the configuration line at its foot.',
  useWhen: [
    'The lobby phase of a session tab, around the LobbySeatGrid.',
    'The running room of the same tab, around its player rows, so Run moves the contents on and keeps the frame in place.',
  ],
  avoidWhen: [
    { case: 'A plain page header.', use: 'ContentHeader' },
  ],
  rules: [
    'Pass the session name as title and the phase, the place and the count as chips. In the lobby the actions are Close lobby and Run, Run last and primary; while running they are Copy address and Stop.',
    'Pass codes with the session code in the lobby, and the address and the seed while running; each shows large and monospace, with a Copy button when it has a copyLabel.',
    'Put a short reason that keeps Run off in note.',
    'Put the progress, the problems and the notices first in the body, under the header, then the seats or the player rows.',
    'Pass config with the facts of the setup, such as Hint cost 5 or Release Auto, and games with the allowed games. Pass the Edit action in the lobby, and locked with a short sentence while running.',
    'The stage hugs its content with a minimum height, so the config line follows the seats; the header keeps the name, the chips and the actions on one row, and only the chips wrap.',
  ],
  a11y: [
    'The stage is a region named by title, and the title is a level 2 heading.',
    'The facts of the configuration are a description list.',
  ],
  tree: {
    path: ['layout', 'the stage of a session lobby'],
    rule: 'The frame of one lobby with its header, seats and setup.',
  },
  example: `import { LobbyStage } from '@archipelia/design';

const LobbyStageSample = ({ onEdit }: { onEdit: () => void }) => (
  <LobbyStage
    title="Sunday run"
    codes={[{ label: 'Session code', value: 'K7QF-22', copyLabel: 'Copy session code' }]}
    config={{ label: 'Config', facts: [{ label: 'Hint cost', value: '5' }], editLabel: 'Edit', onEdit }}
  >
    {null}
  </LobbyStage>
);
`,
  propsHash: 'b1a4958a8b3128a1',
} satisfies ComponentUsage;

export { usage };
