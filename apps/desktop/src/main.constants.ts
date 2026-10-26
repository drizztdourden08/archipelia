/* @layer renderer-app @kind config */
import type { BrockAppSettings, TitleBarActionsMenu } from '@drizztdourden08/brock-react';
import { DEFAULT_SETTINGS } from './settings.constants';
import type { AppSettings } from './settings.type';

const SETTINGS: BrockAppSettings<AppSettings> = { defaults: DEFAULT_SETTINGS };

const TITLE_BAR_MENU: TitleBarActionsMenu = { label: 'Hosting', icon: 'radio' };

export { SETTINGS, TITLE_BAR_MENU };
