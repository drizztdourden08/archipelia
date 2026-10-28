/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The seat cards of the players who connected to a session that takes direct connections: Host approval on the card, Remove for an approved player, and the consent for unlisted worlds.',
  useWhen: [
    'Inside the SeatGrid of the lobby phase of a session tab, after the seats of the host, while Allow direct connections is on.',
  ],
  avoidWhen: [
    { case: 'The players the host adds by hand, and the results of the room.', use: 'SessionLobby' },
    { case: 'The settings of the direct connection.', use: 'SessionBuilder' },
  ],
  rules: [
    'Pass the id of the server and of the lobby of the session; the view loads the lobby and follows its changes.',
    'Return one SeatCard per client that waits or was approved, to sit in a SeatGrid; the host slots are the seats of the session.',
    'Draw a waiting player as an attention seat with Approve and Refuse on the card; an approved player is a filled seat with Remove.',
    'Show on the card the games, the client name and version, whether it is registered and verified or unlisted, and the first slot that is not ready.',
    'Pass lead to draw the art of the game of the first slot; the view has none of its own.',
    'Ask for consent per unlisted world with a danger dialog whose focused button is Refuse, opened from Review the world of on the card.',
  ],
  a11y: [
    'Each seat is a card named after the player, and its buttons carry the name of the player, such as Approve Zelda.',
    'An error is an alert with one plain sentence.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the players who connected to a session'],
    rule: 'The connected players of one session.',
  },
  example: `import { LobbyMembers } from '../LobbyMembers';

const LobbyMembersSample = () => <LobbyMembers serverId="local" lobbyId="lb_1" />;
`,
  propsHash: 'c000f77f2d5c12db',
} satisfies ComponentUsage;

export { usage };
