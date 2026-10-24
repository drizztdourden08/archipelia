/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Lobbies page: the lobbies of the chosen server, with its address for players.',
  useWhen: [
    'The Lobbies page of the Lobbies group.',
  ],
  avoidWhen: [
    { case: 'One lobby with its players.', use: 'LobbyDetail' },
    { case: 'Opening a lobby.', use: 'LobbyCreate' },
  ],
  rules: [
    'Pick the server first: This computer or a saved remote server.',
    'Show the address players join at with a copy button.',
    'Open a lobby on its detail sub-page when a row is activated; New lobby is the header primary button.',
    'Warn when the lobby server on this computer is not running.',
    'Show a failed load as one plain sentence with Retry and keep the raw error in the app log.',
  ],
  a11y: [
    'The server field is labelled Server.',
    'The list is named Lobbies and its rows are buttons.',
    'An error is an alert.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the lobbies of a server'],
    rule: 'Every lobby of the chosen server.',
  },
  example: `import { LobbyList } from '../LobbyList';

const LobbyListSample = () => <LobbyList />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
