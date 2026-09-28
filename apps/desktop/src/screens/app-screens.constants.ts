/* @layer renderer-app @kind config */
import { sessionScreen } from './SessionScreen';
import { sessionsScreen } from './SessionsScreen';
import { gamesScreen } from './GamesScreen';
import { presetsScreen } from './PresetsScreen';
import { serversScreen } from './ServersScreen';
import { dataScreen } from './DataScreen';

const APP_SCREENS = [sessionScreen, sessionsScreen, gamesScreen, presetsScreen, serversScreen, dataScreen];

export { APP_SCREENS };
