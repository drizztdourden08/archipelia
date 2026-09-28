/* @layer renderer-app @kind config */
import type { WidgetDefinition } from '@drizztdourden08/tessera/composites';

const SESSION_WIDGETS: readonly WidgetDefinition[] = [
  {
    id: 'players', label: 'Players', defaultVisibility: 'always', defaultSide: 'top',
    defaultDockedSize: 260, defaultFloatingSize: { width: 360, height: 300 },
  },
  {
    id: 'hints', label: 'Hints', defaultVisibility: 'always', defaultSide: 'top',
    defaultDockedSize: 260, defaultFloatingSize: { width: 380, height: 300 },
  },
  {
    id: 'room', label: 'Room', defaultVisibility: 'always', defaultSide: 'top',
    defaultDockedSize: 260, defaultFloatingSize: { width: 340, height: 300 },
  },
  {
    id: 'log', label: 'Log', defaultVisibility: 'always', defaultSide: 'bottom',
    defaultDockedSize: 300, defaultFloatingSize: { width: 640, height: 320 },
  },
  {
    id: 'console', label: 'Console', defaultVisibility: 'always', defaultSide: 'bottom',
    defaultDockedSize: 300, defaultFloatingSize: { width: 380, height: 300 },
  },
  {
    id: 'spoiler', label: 'Spoiler', defaultVisibility: 'always', defaultSide: 'bottom',
    defaultDockedSize: 300, defaultFloatingSize: { width: 560, height: 360 },
  },
];

const SESSION_DOCK_KEY = 'archipelia:session-dock:v2';

export { SESSION_DOCK_KEY, SESSION_WIDGETS };
