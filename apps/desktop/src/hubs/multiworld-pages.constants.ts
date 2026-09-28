/* @layer renderer-app @kind config */
import { createElement } from 'react';
import type { HubGroup } from '@drizztdourden08/brock-react';
import { SECTION } from '../navigation/app-navigation.constants';
import { HomeView } from '../views/HomeView';
import { PresetsHub } from '../views/PresetsHub';
import { ServerManager } from '../views/ServerManager';
import { SessionsLibrary } from '../views/SessionsLibrary';
import { GAME_TABS } from './game-tabs.constants';
import { hubPage } from './hub-page';
import { settingsPage } from './settings-page';

const MULTIWORLD_HOME = hubPage(SECTION.home, 'Home', 'house', () => createElement(HomeView));

const MULTIWORLD_GROUPS: HubGroup[] = [
  {
    id: 'library',
    label: 'Library',
    pages: [
      hubPage(SECTION.sessions, 'Sessions', 'layers', () => createElement(SessionsLibrary)),
      hubPage(SECTION.presets, 'Presets', 'sliders-horizontal', () => createElement(PresetsHub)),
      hubPage(SECTION.games, 'Games', 'gamepad-2', GAME_TABS),
    ],
  },
  {
    id: 'hosting',
    label: 'Hosting',
    pages: [
      hubPage(SECTION.servers, 'Servers', 'server', () => createElement(ServerManager)),
      settingsPage(SECTION.hosting, 'radio'),
      settingsPage(SECTION.gg, 'globe'),
    ],
  },
  {
    id: 'app',
    label: 'App',
    pages: [settingsPage(SECTION.general, 'settings'), settingsPage(SECTION.engine, 'cpu')],
  },
];

export { MULTIWORLD_GROUPS, MULTIWORLD_HOME };
