/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Servers page: the saved SSH servers beside the form of the picked one, with test, trust, save and remove.',
  useWhen: [
    'The Servers page of the Hosting group.',
  ],
  avoidWhen: [
    { case: 'The archipelago.gg host.', use: 'GgSettings' },
    { case: 'Picking a saved server in a session.', use: 'ServerOptionsForm' },
  ],
  rules: [
    'Keep passwords and passphrases in the vault; the form holds them only while typed.',
    'Turn save off while the draft has a problem, and list the problems.',
    'Test a server before trusting its host key.',
    'Remove is a danger button that asks first and names what loses the server.',
  ],
  a11y: [
    'The server list rows are buttons, pressed while selected.',
    'The heading of the detail names the server.',
    'An error is an alert.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the saved servers'],
    rule: 'The machines that can host a session.',
  },
  example: `import { ServerManager } from '../ServerManager';

const ServerManagerSample = () => <ServerManager />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
