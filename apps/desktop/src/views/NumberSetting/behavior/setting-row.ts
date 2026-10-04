/* @layer renderer-app @kind logic */
import type { SettingItem } from '@drizztdourden08/brock-react';
import hostingSections from '../../../screens/multiworld/hosting/hosting.settings';

const settingRow = (key: string): SettingItem | undefined =>
  hostingSections.flatMap((section) => section.items ?? []).find((item) => item.key === key);

export { settingRow };
