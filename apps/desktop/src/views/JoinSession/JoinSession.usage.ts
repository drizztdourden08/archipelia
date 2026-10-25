/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Join a session path: servers found on your network, an address and a session code, a look at what the session needs, the player Archipelia sends, and the sessions joined with their state and results.',
  useWhen: [
    'The Join a session sub-page of the Sessions page.',
  ],
  avoidWhen: [
    { case: 'The sessions you host.', use: 'SessionBuilder' },
    { case: 'The servers you saved to manage.', use: 'ArchipeliaServers' },
  ],
  rules: [
    'Listen for servers on the network only after the user asks, and stop when the user stops or leaves.',
    'Accept host:port; reach a computer outside the private network only through wss://.',
    'Ask the session with lobby.info before anything is uploaded, and say plainly when its Archipelago version differs from the engine of this computer.',
    'Pick an installed game, then its defaults, one of its presets or an imported player file.',
    'Show each joined session with its admission state, the state of its slot, and once it runs the room address, the address on this computer, the password, the slot and the files.',
    'A joined session comes back by itself after a restart; Reconnect, Leave and Forget name the session.',
  ],
  a11y: [
    'Address, code and the player fields are labelled; a problem is the error note of its field.',
    'A refused look or join is an alert with one plain sentence.',
    'Every copy button is named by what it copies.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'joining a session of another host'],
    rule: 'One player per join.',
  },
  example: `import { JoinSession } from '../JoinSession';

const JoinSessionSample = () => <JoinSession />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
