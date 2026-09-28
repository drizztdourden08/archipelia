/* @layer renderer-app @kind logic */
import { createDefaultLayout } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { SESSION_WIDGETS } from './widget-registry.constants';
import { PRESET } from './dock-preset.constants';

const sessionDockPreset = (): WidgetLayout => ({
  widgets: createDefaultLayout(SESSION_WIDGETS).widgets.map((w) => ({ ...w, opacity: 1, ...PRESET[w.id] })),
});

export { sessionDockPreset };
