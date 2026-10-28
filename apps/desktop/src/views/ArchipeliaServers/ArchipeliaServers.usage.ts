/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: "The Archipelia servers tab of the Servers page: this computer's lobby server with its network mode and a one-line status that opens the Network widget, the remote servers you manage, and the servers found on your network.",
  useWhen: [
    'The Archipelia servers tab of the Servers page in the Hosting group.',
  ],
  avoidWhen: [
    { case: 'The machines you reach over SSH.', use: 'ServerManager' },
    { case: 'The direct connection of a session.', use: 'SessionBuilder' },
  ],
  rules: [
    'Show This computer first, then the saved remote servers, then the servers found on the network, in the list pane.',
    'Change the network mode or the public address check at once; the server restarts its listener and the one-line status follows.',
    'Keep the reach facts, the room addresses and Stop in the Network widget; the page shows one line with the lobby address and the mode, and a button that opens the widget.',
    'Show the explanation of a shared connection as a warning when the server reports one; Archipelia has no relay.',
    'Say that the lobby is LAN-only until the server has TLS.',
    'Keep the admin token of a remote server in the vault; the saved entry holds only a reference.',
    'Trust a certificate only after the test shows its fingerprint and the user presses Trust this certificate.',
    'List each server found on the network with its name, address, Archipelago version and whether it matches the engine.',
  ],
  a11y: [
    'The list pane is named Archipelia servers and the detail pane server.',
    'A warning is a callout with one plain sentence.',
    'Every copy button is named by what it copies.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the lobby servers you use'],
    rule: 'This computer and every saved remote server.',
  },
  example: `import { ArchipeliaServers } from '../ArchipeliaServers';

const ArchipeliaServersSample = () => <ArchipeliaServers />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
