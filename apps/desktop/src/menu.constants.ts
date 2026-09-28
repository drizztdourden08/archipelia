/* @layer renderer-app @kind config */
import { nav } from '@drizztdourden08/brock-react';
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { DATA_HUB, MULTIWORLD_HUB, SECTION } from './navigation/app-navigation.constants';

const openSection = (section: string) => () => nav.open(MULTIWORLD_HUB, { section });

const MENU: MenuEntry[] = [
  { key: 'home', label: 'Home', onClick: openSection(SECTION.home) },
  'separator',
  { key: 'sessions', label: 'Sessions', onClick: openSection(SECTION.sessions) },
  { key: 'games', label: 'Games', onClick: openSection(SECTION.games) },
  { key: 'presets', label: 'Presets', onClick: openSection(SECTION.presets) },
  { key: 'servers', label: 'Servers', onClick: openSection(SECTION.servers) },
  'separator',
  { key: 'data', label: 'Data', onClick: () => nav.open(DATA_HUB) },
  { key: 'settings', label: 'Settings', onClick: openSection(SECTION.general) },
  { key: 'about', label: 'About', screen: 'about' },
];

export { MENU };
