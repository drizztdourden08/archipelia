/* @layer renderer-app @kind logic */
import { createPane, removeEverywhere } from '@drizztdourden08/tessera/composites';
import type { SplitNode, WidgetLayout } from '@drizztdourden08/tessera/composites';
import { BOTTOM_ROW, ROW_SIZES, SESSION_WIDGET_IDS, TOP_ROW } from './session-layout.constants';

const isSessionWidget = (id: string): boolean => SESSION_WIDGET_IDS.some((sessionId) => sessionId === id);

const rowOf = (ids: readonly string[]): SplitNode =>
  ({ kind: 'split', axis: 'row', children: ids.map((id) => createPane([id])), sizes: ids.map(() => 1 / ids.length) });

const sessionLayout = (layout: WidgetLayout): WidgetLayout => {
  const rest = SESSION_WIDGET_IDS.reduce(removeEverywhere, layout);
  const frame = Object.fromEntries(Object.entries(rest.frame).filter(([id]) => !isSessionWidget(id)));
  return {
    ...rest,
    frame,
    dock: { kind: 'split', axis: 'column', children: [rowOf(TOP_ROW), rest.dock, rowOf(BOTTOM_ROW)], sizes: [...ROW_SIZES] },
  };
};

export { sessionLayout };
