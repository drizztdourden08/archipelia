/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The framed stage of a session tab in its lobby phase: the session name with its chips and actions, the session code to copy, the seats and editors in its body, and the configuration line at its foot.',
  useWhen: [
    'The lobby phase of a session tab, around the LobbySeatGrid.',
  ],
  avoidWhen: [
    { case: 'A room that hosts.', use: 'SessionStatusBar' },
    { case: 'A plain page header.', use: 'ContentHeader' },
  ],
  rules: [
    'Pass the session name as title, the phase, the place and the changes from saved as chips, and Close lobby and Run as actions, Run last and primary.',
    'Pass code with the session code; it shows large and monospace with a Copy button.',
    'Put a short reason that keeps Run off in note.',
    'Put the notices, the seats and the seat editor in the body, in that order.',
    'Pass config with the facts of the setup, such as Hint cost 5 or Release Auto, and the Edit action that opens the setup.',
    'Inside a column flex parent the stage grows to its height, so the space under the seats belongs to the frame.',
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
    code={{ label: 'Session code', value: 'K7QF-22', copyLabel: 'Copy session code' }}
    config={{ label: 'Config', facts: [{ label: 'Hint cost', value: '5' }], editLabel: 'Edit', onEdit }}
  >
    {null}
  </LobbyStage>
);
`,
  propsHash: '7a30b0a9ec0de666',
} satisfies ComponentUsage;

export { usage };
