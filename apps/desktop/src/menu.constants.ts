/* @layer renderer-app @kind config */
import type { MenuEntry } from '@drizztdourden08/brock-react';

const MENU: MenuEntry[] = [
  'separator',
  { key: 'sessions', label: 'Sessions', icon: 'layers', bucket: 'multiworld', page: 'sessions' },
  { key: 'games', label: 'Games', icon: 'gamepad-2', bucket: 'multiworld', page: 'games' },
  { key: 'presets', label: 'Presets', icon: 'sliders-horizontal', bucket: 'multiworld', page: 'presets' },
  { key: 'servers', label: 'Servers', icon: 'server', bucket: 'multiworld', page: 'servers' },
];

export { MENU };
