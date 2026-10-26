/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The live screen of a started session: its lobby, the players of the host with their games and presets, the players who joined with approval, the connection status and addresses, Run, and the running room after Run.',
  useWhen: [
    'The lobby sub-page of the Sessions page, which Start session opens for every type of session.',
  ],
  avoidWhen: [
    { case: 'The name, Where, direct connections, the room password and the world settings.', use: 'SessionBuilder' },
    { case: 'The list of sessions and runs.', use: 'SessionsLibrary' },
  ],
  rules: [
    'Pass the id of the saved session; the screen loads it and says when it is gone.',
    'Without an open lobby, say so and make the main action Start session.',
    'Draw the players of the host with RowGrid, one column per field; a session saved with players shows them here as its own players, to edit, keep or remove before Run.',
    'Show the players who joined with LobbyMembers under the players of the host while direct connections are on.',
    'Run is off with a plain reason until at least one player is ready, own or joined and approved; a Run with player problems shows the list and runs nothing.',
    'Show the addresses with copy buttons when the room is on LAN or the lobby takes direct connections, with the status of the lobby server and Stop when this computer is open to the network.',
    'Close lobby asks first, closes the lobby and goes back to the setup page.',
    'Once a run of this lobby exists on this computer, show it with SessionDashboard in place of the players and the connection.',
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
  example: `import { SessionLobby } from '../SessionLobby';

const SessionLobbySample = () => <SessionLobby templateId="t1" />;
`,
  propsHash: '5e904b6264df0178',
} satisfies ComponentUsage;

export { usage };
