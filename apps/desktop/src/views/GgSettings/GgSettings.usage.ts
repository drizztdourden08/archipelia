/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The archipelago.gg page: the site address, whether an owner id is kept, and opening or forgetting the rooms of that owner.',
  useWhen: [
    'The archipelago.gg custom page of the Hosting settings group.',
  ],
  avoidWhen: [
    { case: 'A setting row with a fixed input kind.', use: 'SettingsRow' },
    { case: 'The saved SSH servers.', use: 'ServerManager' },
  ],
  rules: [
    'Take the settings and the patch from the page; the view writes only ggBaseUrl.',
    'Keep the owner id in the vault; the view only asks whether one exists.',
    'Mark the site field and the owner buttons with their search anchors.',
  ],
  a11y: [
    'The site field has a visible label and a hint.',
    'The owner buttons say what they do and turn off when there is no owner.',
    'An error is an alert.',
  ],
  tree: {
    path: ['a full screen view', 'a page of the multiworld app', 'the archipelago.gg address'],
    rule: 'Where sessions are hosted on the website.',
  },
  example: `import type { AppSettings } from '../../settings.type';
import { GgSettings } from '../GgSettings';

const GgSettingsSample = ({ settings, onChange }: { settings: AppSettings; onChange: (patch: Partial<AppSettings>) => void }) => (
  <GgSettings settings={settings} onChange={onChange} />
);
`,
  propsHash: '3d45ef3466fb77dd',
} satisfies ComponentUsage;

export { usage };
