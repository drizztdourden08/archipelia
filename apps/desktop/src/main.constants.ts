/* @layer renderer-app @kind config */
import { APP_SCREENS } from './screens/app-screens.constants';
import { homeScreen } from './screens/HomeScreen';
import { DEFAULT_SETTINGS, SETTINGS_TABS } from './settings.constants';

const SETTINGS = { defaults: DEFAULT_SETTINGS, tabs: SETTINGS_TABS };

const SCREENS = [homeScreen, ...APP_SCREENS];

const SCREEN_GROUPS = [
  { id: 'library', label: 'Library' },
  { id: 'app', label: 'App' },
];

export { SCREEN_GROUPS, SCREENS, SETTINGS };
