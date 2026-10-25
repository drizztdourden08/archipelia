/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Add my player: the host picks an installed game, a preset and a name, and the lobby gets a host player that is approved at once.',
  useWhen: [
    'The lobby detail, while the lobby is open.',
    'Any screen where the host of a lobby also plays.',
  ],
  avoidWhen: [
    { case: 'A player who joins from another computer.', use: 'JoinLobby' },
    { case: 'Approving or removing the players that joined.', use: 'LobbyDetail' },
  ],
  rules: [
    'Offer the installed games, the presets of the chosen game, or the defaults of the game.',
    'Build the player YAML from the preset in the app; the server holds the world of the host already.',
    'Send it through the in-process admin path as a host member; the server approves it at once.',
    'Show a missing or too long name under its field once Add my player was pressed.',
  ],
  a11y: [
    'Every field is labelled; a problem is the error note of its field.',
    'A failure is an alert with one plain sentence.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the player the host adds'],
    rule: 'One host player at a time.',
  },
  example: `import { HostPlayer } from '../HostPlayer';

const HostPlayerSample = () => <HostPlayer serverId="local" lobbyId="lb_1" />;
`,
  propsHash: '1c2e939db9f11c9e',
} satisfies ComponentUsage;

export { usage };
