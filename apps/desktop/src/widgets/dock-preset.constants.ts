/* @layer renderer-app @kind config */
import type { WidgetState } from '@drizztdourden08/tessera/composites';

const PRESET: Record<string, Partial<WidgetState>> = {
  players: { visible: true, mode: 'docked', side: 'top', order: 0 },
  hints: { visible: true, mode: 'docked', side: 'top', order: 1 },
  room: { visible: true, mode: 'docked', side: 'top', order: 2 },
  log: { visible: true, mode: 'docked', side: 'bottom', order: 0 },
  console: { visible: true, mode: 'docked', side: 'bottom', order: 1 },
  spoiler: { visible: false, mode: 'floating', x: 24, y: 24 },
};

export { PRESET };
