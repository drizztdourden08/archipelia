/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';
import { playerCommandGroups } from '../../src/views/SessionDashboard/behavior/player-command-groups';

describe('player command groups', () => {
  test('each player gets Release and Collect, which ask before they send', () => {
    const confirm = vi.fn();
    const groups = playerCommandGroups(['Ana', 'Bo'], confirm, false);
    expect(groups.map((group) => group.label)).toEqual(['Ana', 'Bo']);
    expect(groups[1]?.items.map((item) => ('label' in item ? item.label : ''))).toEqual(['Release Bo', 'Collect for Bo']);
    const collect = groups[1]?.items[1];
    if (collect && 'onSelect' in collect) collect.onSelect?.();
    expect(confirm).toHaveBeenCalledWith('/collect Bo', 'Collect for Bo', expect.stringContaining('sent to Bo'));
  });

  test('the items are off while no room is hosting', () => {
    const groups = playerCommandGroups(['Ana'], vi.fn(), true);
    expect(groups[0]?.items.every((item) => 'disabled' in item && item.disabled)).toBe(true);
  });
});
