/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'One number setting row: the label, the description and a number field held between its bounds.',
  useWhen: [
    'A settings row whose value is a number with no slider, such as the local port or the auto shutdown minutes.',
  ],
  avoidWhen: [
    { case: 'A number picked on a short scale, such as the hint cost in percent.', use: 'SettingsRow' },
    { case: 'A choice between a few named values.', use: 'SettingsRow' },
  ],
  rules: [
    'Reach it through renderNumberSetting, the settings renderControl, never from a page.',
    'Keep the bounds in NUMBER_BOUNDS and the words in the settings page row.',
    'Remove it once Brock settings rows take a number control.',
  ],
  a11y: [
    'The field has a visible label and the row description as its hint.',
    'The row hint is the title of the field, read on hover and focus.',
  ],
  tree: {
    path: ['a value the user sets', 'an app setting typed as a number'],
    rule: 'A settings row the Brock controls cannot draw yet.',
  },
  example: `import type { AppSettings } from '../../settings.type';
import { NumberSetting } from '../NumberSetting';

const NumberSettingSample = ({ settings, onChange }: { settings: AppSettings; onChange: (patch: Partial<AppSettings>) => void }) => (
  <NumberSetting settingKey="hostingLocalPort" settings={settings} onChange={onChange} />
);
`,
  propsHash: '220f54c7f0f15d20',
} satisfies ComponentUsage;

export { usage };
