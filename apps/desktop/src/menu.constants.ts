/* @layer renderer-app @kind config */
import type { MenuEntry } from '@drizztdourden08/brock-react';

const MENU: MenuEntry[] = [
  { key: 'home', label: 'Home', screen: 'home' },
  { key: 'session', label: 'Session', screen: 'session' },
  'separator',
  { key: 'sessions', label: 'Sessions', screen: 'sessions' },
  { key: 'games', label: 'Games', screen: 'games' },
  { key: 'presets', label: 'Presets', screen: 'presets' },
  { key: 'servers', label: 'Servers', screen: 'servers' },
  'separator',
  { key: 'settings', label: 'Settings', screen: 'settings' },
  { key: 'data', label: 'Data', screen: 'data' },
  { key: 'about', label: 'About', screen: 'about' },
];

export { MENU };
