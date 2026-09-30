/* @layer renderer-app @kind config */
import { nav } from '@drizztdourden08/brock-react';
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { DATA_HUB, MULTIWORLD_HUB, SECTION } from './navigation/app-navigation.constants';

const openSection = (section: string) => () => nav.open(MULTIWORLD_HUB, { section });

const MENU: MenuEntry[] = [
  { key: 'multiworld', label: 'Multiworld', icon: 'layers', onClick: openSection(SECTION.home) },
  'separator',
  { key: 'sessions', label: 'Sessions', icon: 'layers', onClick: openSection(SECTION.sessions) },
  { key: 'games', label: 'Games', icon: 'gamepad-2', onClick: openSection(SECTION.games) },
  { key: 'presets', label: 'Presets', icon: 'sliders-horizontal', onClick: openSection(SECTION.presets) },
  { key: 'servers', label: 'Servers', icon: 'server', onClick: openSection(SECTION.servers) },
  'separator',
  { key: 'data', label: 'Data', icon: 'hard-drive', onClick: () => nav.open(DATA_HUB) },
  { key: 'settings', label: 'Settings', icon: 'settings', screen: 'settings' },
  { key: 'about', label: 'About', icon: 'info', screen: 'about' },
];

export { MENU };
