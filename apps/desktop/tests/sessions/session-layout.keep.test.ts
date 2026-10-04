/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import {
  createDefaultLayout, dockOnEdge, isWidgetOpen, layoutTree, mainRectOf, migrateLayout, placementOf, popOutWidget, widgetsIn,
} from '@drizztdourden08/tessera/composites';
import type { LayoutNode, Rect, WidgetLayout } from '@drizztdourden08/tessera/composites';
import { sessionLayout } from '../../src/session-widgets/session-layout';
import { BOTTOM_ROW, SESSION_WIDGET_IDS, TOP_ROW } from '../../src/session-widgets/session-layout.constants';

const STAGE: Rect = { x: 0, y: 0, width: 1280, height: 760 };

const MIN_PANE = { width: 240, height: 200 };

const rowsOf = (node: LayoutNode): string[][] =>
  (node.kind === 'split' && node.axis === 'column' ? node.children.map(widgetsIn) : [widgetsIn(node)]);

const edited = (): WidgetLayout => {
  const withLogs = dockOnEdge(createDefaultLayout(), 'logs', 'right');
  const docked = dockOnEdge(withLogs, 'players', 'left');
  const floated: WidgetLayout = { ...docked, floating: [{ id: 'hints', x: 0.1, y: 0.1, width: 300, height: 200 }] };
  return { ...popOutWidget(floated, 'console'), frame: { hints: { opacity: 0.5, show: 'always' }, logs: { opacity: 0.8, show: 'always' } } };
};

describe('session widget layout', () => {
  test('from a fresh layout: players, hints and room on top, the main view, log and console below, spoiler closed', () => {
    const laid = sessionLayout(createDefaultLayout());
    expect(rowsOf(laid.dock)).toEqual([[...TOP_ROW], [], [...BOTTOM_ROW]]);
    expect(placementOf(laid, 'spoiler')).toBeNull();
    for (const id of [...TOP_ROW, ...BOTTOM_ROW]) expect(placementOf(laid, id), id).toBe('docked');
  });

  test('a reset keeps the other widgets and drops every earlier place and frame of a session widget', () => {
    const laid = sessionLayout(edited());
    expect(isWidgetOpen(laid, 'logs')).toBe(true);
    expect(laid.frame).toEqual({ logs: { opacity: 0.8, show: 'always' } });
    expect(laid.floating).toEqual([]);
    expect(laid.popped).toEqual([]);
    const docked = widgetsIn(laid.dock);
    expect(new Set(docked).size).toBe(docked.length);
    expect(docked.filter((id) => SESSION_WIDGET_IDS.includes(id as never)).sort()).toEqual([...TOP_ROW, ...BOTTOM_ROW].sort());
  });

  test('resetting twice gives the same rows, and the layout survives a save and a load', () => {
    const once = sessionLayout(edited());
    const twice = sessionLayout(once);
    expect(rowsOf(twice.dock)).toEqual(rowsOf(once.dock));
    expect(migrateLayout(JSON.parse(JSON.stringify(once)))).toEqual(once);
  });

  test('on a 1280 by 760 stage every pane is readable and the main view keeps the middle band', () => {
    const laid = layoutTree(sessionLayout(createDefaultLayout()).dock, STAGE);
    const panes = laid.leaves.filter((leaf) => leaf.node.kind === 'pane').map((leaf) => leaf.rect);
    expect(panes).toHaveLength(TOP_ROW.length + BOTTOM_ROW.length);
    for (const rect of panes) {
      expect(rect.width).toBeGreaterThanOrEqual(MIN_PANE.width);
      expect(rect.height).toBeGreaterThanOrEqual(MIN_PANE.height);
    }
    const main = mainRectOf(laid);
    expect(main?.width).toBe(STAGE.width);
    expect(main?.height).toBeGreaterThanOrEqual(MIN_PANE.height);
  });
});
