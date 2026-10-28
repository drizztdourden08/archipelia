/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The players who connected to a session that takes direct connections: their client facts, Host approval, and the consent for unlisted worlds.',
  useWhen: [
    'Inside the Players card of the lobby phase of a session tab, under the players the host added, while Allow direct connections is on.',
  ],
  avoidWhen: [
    { case: 'The players the host adds by hand, and the results of the room.', use: 'SessionLobby' },
    { case: 'The settings of the direct connection.', use: 'SessionBuilder' },
  ],
  rules: [
    'Pass the id of the server and of the lobby of the session; the view loads the lobby and follows its changes.',
    'Show only clients that wait or were approved, each tagged Connected; the host slots are the players of the session, tagged Added here.',
    'Show for each player the client name, id and version, whether it is registered and verified or unlisted, and its slots.',
    'Approve and Refuse a waiting player; Remove an approved one after asking.',
    'Ask for consent per unlisted world with a danger dialog whose focused button is Refuse.',
  ],
  a11y: [
    'Each player is a card named after the player.',
    'An error is an alert with one plain sentence.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the players who connected to a session'],
    rule: 'The connected players of one session.',
  },
  example: `import { LobbyMembers } from '../LobbyMembers';

const LobbyMembersSample = () => <LobbyMembers serverId="local" lobbyId="lb_1" />;
`,
  propsHash: '1c2e939db9f11c9e',
} satisfies ComponentUsage;

export { usage };
