/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The lobby phase of a session tab: a stage header with the phase, Where, the changes from the saved session and the session code, the players of the host with their games and presets, the players who joined with approval, and Run.',
  useWhen: [
    'Inside the tab of a session that has not run yet.',
  ],
  avoidWhen: [
    { case: 'The name, Where, direct connections, the room password and the world settings.', use: 'SessionBuilder' },
    { case: 'The list of sessions and runs.', use: 'SessionsLibrary' },
  ],
  rules: [
    'Pass the live tab; the screen loads the saved session of that tab and says when it is gone, with a way to close the tab.',
    'Players added or changed here belong to this run only: they become overrides of the tab, sent when Run starts, and the saved session stays as it was.',
    'Show how many changes differ from the saved session as a chip, with the list in its tooltip.',
    'Draw the players of the host with RowGrid, one column per field.',
    'Show the players who joined with LobbyMembers under the players of the host while direct connections are on.',
    'Run is off with a plain reason until at least one player is ready, own or joined and approved; a Run with player problems shows the list and runs nothing.',
    'Close lobby asks only when someone joined, closes the lobby and the tab.',
    'Once the tab has a run, the tab draws the room in its place, with LobbyState for a session whose room runs on an Archipelia server.',
  ],
  a11y: [
    'The players are a RowGrid named Players: each row is a group named after the player and its row, each input is named by its column.',
    'An off Run is described by its reason.',
    'An error is an alert with one plain sentence, and Retry when a load failed.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'a session that started, with its lobby and players'],
    rule: 'The lobby and the players of one started session.',
  },
  example: `import type { LiveTab } from '../../live/live.type';
import { SessionLobby } from '../SessionLobby';

const SessionLobbySample = ({ tab }: { tab: LiveTab }) => <SessionLobby tab={tab} />;
`,
  propsHash: '151f744cb4ba60d9',
} satisfies ComponentUsage;

export { usage };
