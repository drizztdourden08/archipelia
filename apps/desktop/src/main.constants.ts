/* @layer renderer-app @kind config */
import type { BrockAppSettings } from '@drizztdourden08/brock-react';
import { sessionScreen } from './navigation/SessionScreen';
import { renderSettingControl } from './setting-controls/render-setting-control';
import { DEFAULT_SETTINGS } from './settings.constants';
import type { AppSettings } from './settings.type';

const SETTINGS: BrockAppSettings<AppSettings> = { defaults: DEFAULT_SETTINGS, renderControl: renderSettingControl };

const SCREENS = [sessionScreen];

export { SCREENS, SETTINGS };
