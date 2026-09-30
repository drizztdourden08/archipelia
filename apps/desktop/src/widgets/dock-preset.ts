/* @layer renderer-app @kind logic */
import { MAIN_NODE, createDefaultLayout } from '@drizztdourden08/tessera/composites';
import type { PaneNode, SplitNode, WidgetFrame, WidgetLayout } from '@drizztdourden08/tessera/composites';
import { SESSION_WIDGETS } from './widget-registry.constants';
import { BOTTOM_ROW, ROW_SIZES, TOP_ROW } from './dock-preset.constants';

const paneFor = (id: string): PaneNode => ({ kind: 'pane', key: `preset-${id}`, widgets: [id], active: id, makeRoom: false });

const rowOf = (ids: readonly string[]): SplitNode =>
  ({ kind: 'split', axis: 'row', children: ids.map(paneFor), sizes: ids.map(() => 1 / ids.length) });

const frameOfAll = (): Record<string, WidgetFrame> =>
  Object.fromEntries(SESSION_WIDGETS.map(({ id, defaultVisibility }) => [id, { opacity: 1, show: defaultVisibility }]));

const sessionDockPreset = (): WidgetLayout => ({
  ...createDefaultLayout(),
  dock: { kind: 'split', axis: 'column', children: [rowOf(TOP_ROW), { ...MAIN_NODE }, rowOf(BOTTOM_ROW)], sizes: [...ROW_SIZES] },
  frame: frameOfAll(),
});

export { sessionDockPreset };
