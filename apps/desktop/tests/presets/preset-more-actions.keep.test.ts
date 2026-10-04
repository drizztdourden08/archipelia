/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';
import type { MenuItem } from '@drizztdourden08/tessera/composites';
import { moreActions } from '../../src/views/PresetEditor/behavior/more-actions';

const handlers = () => ({ onDuplicate: vi.fn(), onImport: vi.fn(), onExport: vi.fn(), onResetAll: vi.fn(), onDelete: vi.fn() });

const itemsOf = (busy: boolean, calls = handlers()) => moreActions({ busy, ...calls }).flatMap((group) => group.items as MenuItem[]);

describe('preset editor more actions', () => {
  test('the menu holds the rare actions in order', () => {
    expect(itemsOf(false).map((item) => item.label)).toEqual(['Duplicate', 'Import YAML', 'Export YAML', 'Reset all to defaults', 'Delete']);
  });

  test('each item runs its handler and turns off while busy', () => {
    const calls = handlers();
    itemsOf(false, calls).forEach((item) => item.onSelect?.());
    expect(Object.values(calls).every((call) => call.mock.calls.length === 1)).toBe(true);
    expect(itemsOf(true).every((item) => item.disabled)).toBe(true);
  });
});
