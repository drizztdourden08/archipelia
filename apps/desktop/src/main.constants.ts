/* @layer renderer-app @kind config */
import { dataHub } from './hubs/data-hub';
import { multiworldHub } from './hubs/multiworld-hub';
import { sessionScreen } from './screens/SessionScreen';
import { settingsScreen } from './screens/SettingsScreen';
import { DEFAULT_SETTINGS, SETTINGS_TABS } from './settings.constants';

const SETTINGS = { defaults: DEFAULT_SETTINGS, tabs: SETTINGS_TABS };

const SCREENS = [sessionScreen, multiworldHub, dataHub, settingsScreen];

export { SCREENS, SETTINGS };
