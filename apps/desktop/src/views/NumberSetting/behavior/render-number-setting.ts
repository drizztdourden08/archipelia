/* @layer renderer-app @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import type { SettingsPatch } from '@drizztdourden08/brock-react';
import type { AppSettings } from '../../../settings.type';
import { NumberSetting } from '../NumberSetting';
import { isNumberSetting } from './is-number-setting';

const renderNumberSetting = (key: string, settings: AppSettings, onChange: SettingsPatch<AppSettings>): ReactNode | null =>
  (isNumberSetting(key) ? createElement(NumberSetting, { settingKey: key, settings, onChange }) : null);

export { renderNumberSetting };
