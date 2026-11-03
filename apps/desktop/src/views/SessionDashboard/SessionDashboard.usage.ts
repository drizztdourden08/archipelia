/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The room of one run as the same framed LobbyStage as the lobby: the name with the run state, the place, the player count and the uptime, Copy address and Stop, the address and the seed, the generation progress, a row per player with its commands, and the config line locked while running.',
  useWhen: [
    'The room phase of a session tab, once the session has a run.',
  ],
  avoidWhen: [
    { case: 'Past runs of a session.', use: 'History' },
  ],
  rules: [
    'Pass the id of the run to show; the tab that holds it owns which run that is and loads the runs.',
    'Ask before stopping a room.',
    'Keep the frame of the lobby so Run does not move the stage or the widgets around it.',
    'Show generation progress and errors inside the stage under the header, never in a separate dialog.',
    'Show a Set slot nobody has connected to as Waiting for its player with the slot name to connect as, never Offline.',
  ],
  a11y: [
    'The header comes first, with the run state as text.',
    'Errors are alerts.',
    'Each row menu is named after its player, such as Commands for Ana.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the room that is hosting'],
    rule: 'The room of one run, inside a session tab.',
  },
  example: `import { SessionDashboard } from '../SessionDashboard';

const SessionDashboardSample = () => <SessionDashboard sessionId="run-1" />;
`,
  propsHash: '5f4da8e951b3a87c',
} satisfies ComponentUsage;

export { usage };
