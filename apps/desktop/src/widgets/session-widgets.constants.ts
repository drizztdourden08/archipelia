/* @layer renderer-app @kind config */
import type { WidgetDef } from '@drizztdourden08/brock-react';
import { sessionWidget } from './session-widget';

const SESSION_WIDGETS: readonly WidgetDef[] = [
  sessionWidget({ id: 'players', label: 'Players', icon: 'users', defaultSide: 'top', defaultDockedSize: 260, defaultFloatingSize: { width: 360, height: 300 } }),
  sessionWidget({ id: 'hints', label: 'Hints', icon: 'compass', defaultSide: 'top', defaultDockedSize: 260, defaultFloatingSize: { width: 380, height: 300 } }),
  sessionWidget({ id: 'room', label: 'Room', icon: 'house', defaultSide: 'top', defaultDockedSize: 260, defaultFloatingSize: { width: 340, height: 300 } }),
  sessionWidget({ id: 'log', label: 'Log', icon: 'file-text', defaultSide: 'bottom', defaultDockedSize: 300, defaultFloatingSize: { width: 640, height: 320 } }),
  sessionWidget({ id: 'console', label: 'Console', icon: 'send', defaultSide: 'bottom', defaultDockedSize: 300, defaultFloatingSize: { width: 380, height: 300 } }),
  sessionWidget({ id: 'spoiler', label: 'Spoiler', icon: 'eye-off', defaultSide: 'right', defaultDockedSize: 420, defaultFloatingSize: { width: 560, height: 360 } }),
];

export { SESSION_WIDGETS };
