/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import {
  isWidgetOpen, layoutTree, mainRectOf, migrateLayout, placementOf, removeEverywhere, widgetsIn,
} from '@drizztdourden08/tessera/composites';
import type { LayoutNode, Rect } from '@drizztdourden08/tessera/composites';
import { SESSION_DOCK_PRESET } from '../../src/widgets/session-dock.constants';
import { sessionDockPreset } from '../../src/widgets/dock-preset';
import { openSessionWidget } from '../../src/widgets/open-session-widget';
import { SESSION_WIDGETS } from '../../src/widgets/widget-registry.constants';

const DOCK: Rect = { x: 0, y: 0, width: 1200, height: 600 };

const rowsOf = (node: LayoutNode): string[][] =>
  (node.kind === 'split' && node.axis === 'column' ? node.children.map(widgetsIn) : [widgetsIn(node)]);

const rectOf = (id: string) => layoutTree(SESSION_DOCK_PRESET.dock, DOCK).leaves
  .find((leaf) => leaf.node.kind === 'pane' && leaf.node.widgets.includes(id))?.rect;

describe('session dock preset', () => {
  test('every registered widget has a place: docked once, or a frame to open into', () => {
    const docked = widgetsIn(SESSION_DOCK_PRESET.dock);
    expect(new Set(docked).size).toBe(docked.length);
    expect(Object.keys(SESSION_DOCK_PRESET.frame).sort()).toEqual(SESSION_WIDGETS.map((d) => d.id).sort());
    for (const { id } of SESSION_WIDGETS) {
      const opened = isWidgetOpen(SESSION_DOCK_PRESET, id) ? SESSION_DOCK_PRESET : openSessionWidget(SESSION_DOCK_PRESET, id);
      expect(placementOf(opened, id), `${id} has a place`).not.toBeNull();
    }
  });

  test('players, hints and room share the top row; log and console share the bottom row', () => {
    expect(rowsOf(SESSION_DOCK_PRESET.dock)).toEqual([['players', 'hints', 'room'], [], ['log', 'console']]);
  });

  test('the spoiler starts closed and opens floating inside the dock', () => {
    expect(placementOf(SESSION_DOCK_PRESET, 'spoiler')).toBeNull();
    const opened = openSessionWidget(SESSION_DOCK_PRESET, 'spoiler');
    expect(placementOf(opened, 'spoiler')).toBe('floating');
    expect(widgetsIn(opened.dock)).toEqual(widgetsIn(SESSION_DOCK_PRESET.dock));
  });

  test('reset gives the preset back: a fresh preset is a new, equal, valid v2 layout', () => {
    const edited = openSessionWidget(removeEverywhere(SESSION_DOCK_PRESET, 'hints'), 'spoiler');
    expect(edited).not.toEqual(SESSION_DOCK_PRESET);
    expect(sessionDockPreset()).not.toBe(sessionDockPreset());
    expect(sessionDockPreset()).toEqual(SESSION_DOCK_PRESET);
    expect(migrateLayout(JSON.parse(JSON.stringify(SESSION_DOCK_PRESET)))).toEqual(SESSION_DOCK_PRESET);
  });

  test('inside the dock box the panes tile without overlap and floats may use the whole box', () => {
    const laid = layoutTree(SESSION_DOCK_PRESET.dock, DOCK);
    const panes = laid.leaves.filter((leaf) => leaf.node.kind === 'pane').map((leaf) => leaf.rect);
    for (const r of panes) {
      expect(r.x >= 0 && r.y >= 0 && r.x + r.width <= DOCK.width && r.y + r.height <= DOCK.height).toBe(true);
    }
    const players = rectOf('players');
    const log = rectOf('log');
    expect(players && log && players.y + players.height < log.y).toBe(true);
    expect(mainRectOf(laid)).toEqual(DOCK);
  });
});
