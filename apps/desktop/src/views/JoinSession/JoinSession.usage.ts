/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Join a lobby path: servers found on your network, plus a manual address and lobby code, with a look at what the lobby needs.',
  useWhen: [
    'The Lobbies page, below Where to host.',
    'Any screen that lets a player reach a lobby on another computer.',
  ],
  avoidWhen: [
    { case: 'The lobbies you host.', use: 'LobbyList' },
    { case: 'The servers you saved to manage.', use: 'ArchipeliaServers' },
  ],
  rules: [
    'Listen for servers on the network only after the user asks, and stop when the user stops or leaves.',
    'Accept host:port; reach a computer outside the private network only through wss://.',
    'Ask the lobby with lobby.info before anything is uploaded: name, Archipelago version and whether it is open.',
    'Say plainly that joining from Archipelia comes next, and name another client to use now.',
  ],
  a11y: [
    'Address and code are labelled fields; a problem is the error note of its field.',
    'A refused look is an alert with one plain sentence.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'joining a lobby of another computer'],
    rule: 'One lookup at a time.',
  },
  example: `import { JoinLobby } from '../JoinLobby';

const JoinLobbySample = () => <JoinLobby />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
