/* @layer renderer-app @kind types */
import type { SettingsPatch } from '@drizztdourden08/brock-react';
import type { AppSettings, NumberSettingKey } from '../../settings.type';

interface NumberSettingProps {
  settingKey: NumberSettingKey;
  settings: AppSettings;
  onChange: SettingsPatch<AppSettings>;
}

export type { NumberSettingProps };
