/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Where to host choice: this computer only, my local network (LAN), or a saved remote Archipelia server, with the state and the addresses of the network.',
  useWhen: [
    'The Lobbies page, above the lobbies.',
    'Any screen that lets the host decide where players reach the lobby server.',
  ],
  avoidWhen: [
    { case: 'The advanced network settings such as the internet mode.', use: 'ArchipeliaServers' },
    { case: 'The lobbies of a server.', use: 'LobbyList' },
  ],
  rules: [
    'Offer three options, each with one plain sentence: This computer only, My local network (LAN), A remote Archipelia server.',
    'Choosing the LAN asks once, in plain words, before it opens a port and announces the server; it then listens and announces at once.',
    'While the network is on, show On your network at the LAN address and port, both addresses with a copy button, whether it is announced, and a Stop action.',
    'Choosing This computer only stops all networking at once; no confirmation is needed.',
    'Keep the internet mode out of this choice; it stays an advanced setting of the server.',
    'The choice decides the server the Lobbies page works on.',
  ],
  a11y: [
    'The three options are one radio group named Where to host.',
    'A failure is an alert with one plain sentence.',
    'Every copy button is named by what it copies.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'where to host the lobby server'],
    rule: 'One choice for the whole app.',
  },
  example: `import { HostChoice } from '../HostChoice';

const HostChoiceSample = () => <HostChoice />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
