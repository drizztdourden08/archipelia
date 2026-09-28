/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { computeDockedStyles } from '@drizztdourden08/tessera/composites';
import { SESSION_DOCK_PRESET } from '../../src/widgets/session-dock.constants';
import { sessionDockPreset } from '../../src/widgets/dock-preset';
import { SESSION_WIDGETS } from '../../src/widgets/widget-registry.constants';

const byId = (id: string) => SESSION_DOCK_PRESET.widgets.find((w) => w.id === id);

describe('session dock preset', () => {
  test('carries every registered widget once', () => {
    expect(SESSION_DOCK_PRESET.widgets.map((w) => w.id).sort()).toEqual(SESSION_WIDGETS.map((d) => d.id).sort());
  });

  test('players, hints and room share the top row; log and console share the bottom row', () => {
    const row = (side: string) => SESSION_DOCK_PRESET.widgets
      .filter((w) => w.visible && w.mode === 'docked' && w.side === side)
      .sort((a, b) => a.order - b.order)
      .map((w) => w.id);
    expect(row('top')).toEqual(['players', 'hints', 'room']);
    expect(row('bottom')).toEqual(['log', 'console']);
    expect(row('left')).toEqual([]);
    expect(row('right')).toEqual([]);
  });

  test('the spoiler starts hidden and floating', () => {
    expect(byId('spoiler')).toMatchObject({ visible: false, mode: 'floating' });
  });

  test('a fresh preset is a new object each time', () => {
    expect(sessionDockPreset()).not.toBe(sessionDockPreset());
    expect(sessionDockPreset()).toEqual(SESSION_DOCK_PRESET);
  });

  test('inside a container the docked frames use the box, never the viewport', () => {
    const visible = SESSION_DOCK_PRESET.widgets.filter((w) => w.visible);
    const { styles } = computeDockedStyles(visible, 0, 'container');
    const log = styles.get('log');
    expect(log).toMatchObject({ position: 'absolute', bottom: 0, left: '0px' });
    expect(styles.get('players')).toMatchObject({ position: 'absolute', top: 0 });
    expect(JSON.stringify([...styles.values()])).not.toMatch(/\d+v[hw]/);
  });
});
