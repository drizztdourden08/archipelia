/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'One lobby: its code and address, its settings, its players with their client facts, the consent dialog for unlisted worlds, and the results.',
  useWhen: [
    'The lobby sub-page of the Lobbies page.',
  ],
  avoidWhen: [
    { case: 'The list of lobbies.', use: 'LobbyList' },
  ],
  rules: [
    'Pass the id of the server and of the lobby; the view loads the lobby and follows its changes.',
    'Show the lobby code in a CopyValue.',
    'Show for each player the client name, id and version, whether it is registered and verified or unlisted, and its slots.',
    'Approve and Refuse a waiting player; Remove an approved one after asking.',
    'Ask for consent per unlisted world with a danger dialog whose focused button is Refuse.',
    'Lock and Start are actions of the header; Close lobby and Stop room ask first; Start is off while no slot is ready.',
    'Show the room address, seed, files and any failure once the lobby has started.',
  ],
  a11y: [
    'The header actions are a group named after the lobby.',
    'Each player is a card named after the player.',
    'An error is an alert with one plain sentence.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'one lobby of a server'],
    rule: 'The players and the room of one lobby.',
  },
  example: `import { LobbyDetail } from '../LobbyDetail';

const LobbyDetailSample = () => <LobbyDetail serverId="local" lobbyId="lb_1" />;
`,
  propsHash: '1c2e939db9f11c9e',
} satisfies ComponentUsage;

export { usage };
