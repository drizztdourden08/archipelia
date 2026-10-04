/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The owner id row of the archipelago.gg settings page: whether an owner id is kept, and opening or forgetting the rooms of that owner.',
  useWhen: [
    'The owner id row of the archipelago.gg settings page.',
  ],
  avoidWhen: [
    { case: 'The site address or another setting with a fixed input kind.', use: 'SettingsRow' },
    { case: 'The saved SSH servers.', use: 'ServerManager' },
  ],
  rules: [
    'Reach it through renderGgOwner, the settings renderControl, never from a page.',
    'Keep the owner id in the vault; the view only asks whether one exists.',
    'Forget the owner id is a danger button that asks first and says the rooms are lost.',
  ],
  a11y: [
    'The owner buttons say what they do and turn off when there is no owner.',
    'An error is an alert.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the archipelago.gg owner id'],
    rule: 'Where sessions are hosted on the website.',
  },
  example: `import { GgOwner } from '../GgOwner/GgOwner';

const GgOwnerSample = () => <GgOwner baseUrl="https://archipelago.gg" />;
`,
  propsHash: '3c53fa4e5ded1b72',
} satisfies ComponentUsage;

export { usage };
