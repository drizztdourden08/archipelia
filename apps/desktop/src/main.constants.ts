/* @layer renderer-app @kind config */
import { createElement } from 'react';
import { defineScreen } from '@drizztdourden08/brock-react';
import type { BrockAppSettings, MenuEntry } from '@drizztdourden08/brock-react';
import { Icon } from '@drizztdourden08/tessera/primitives';
import { BASE_SCREEN } from './hooks/app-navigation.constants';
import { DEFAULT_SETTINGS } from './settings.constants';
import type { AppSettings } from './settings.type';
import { SessionDashboard } from './views/SessionDashboard';

const SETTINGS: BrockAppSettings<AppSettings> = { defaults: DEFAULT_SETTINGS };

const SCREENS = [
  defineScreen({
    id: BASE_SCREEN,
    title: 'Session',
    icon: createElement(Icon, { name: 'radio' }),
    header: 'own',
    render: () => createElement(SessionDashboard),
  }),
];

const MENU: MenuEntry[] = [
  'separator',
  { key: 'sessions', label: 'Sessions', icon: 'layers', bucket: 'multiworld', page: 'sessions' },
  { key: 'games', label: 'Games', icon: 'gamepad-2', bucket: 'multiworld', page: 'games' },
  { key: 'presets', label: 'Presets', icon: 'sliders-horizontal', bucket: 'multiworld', page: 'presets' },
  { key: 'servers', label: 'Servers', icon: 'server', bucket: 'multiworld', page: 'servers' },
];

export { MENU, SCREENS, SETTINGS };
