/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The New lobby sub-page: name, Host approval, Allow unlisted clients, the room host, the engine version and the slot limit.',
  useWhen: [
    'The New lobby sub-page of the Lobbies page.',
  ],
  avoidWhen: [
    { case: 'The list of lobbies.', use: 'LobbyList' },
    { case: 'A lobby that already exists.', use: 'LobbyDetail' },
  ],
  rules: [
    'Create the lobby on the server picked in the Lobbies page.',
    'Show the Archipelago version as the engine of the server, read only.',
    'Default to host approval on, unlisted clients off and the room on the server computer.',
    'Offer the remote machine only for the server on this computer, and only when a machine is saved.',
    'Show each problem under its row once Create lobby was pressed; a create with problems creates nothing.',
    'Open the detail of the new lobby when it is created.',
  ],
  a11y: [
    'Every row is labelled by its title.',
    'A problem is the error note of its row.',
    'An error is an alert with one plain sentence.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'a lobby being opened'],
    rule: 'The settings of one new lobby.',
  },
  example: `import { LobbyCreate } from '../LobbyCreate';

const LobbyCreateSample = () => <LobbyCreate />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
