/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { groupKeyOf } from '../../src/stores/group-key-of';
import { groupNamesOf } from '../../src/stores/group-names-of';

describe('K2 item and location group names', { tags: ['critical'] }, () => {
  test('a group record gives its group names and anything else gives none', () => {
    expect(groupNamesOf({ Bottles: ['Bottle', 'Bottle (Bee)'], Bows: ['Bow'] })).toEqual(['Bottles', 'Bows']);
    expect(groupNamesOf(null)).toEqual([]);
    expect(groupNamesOf(['Bottles'])).toEqual([]);
  });

  test('the storage key names the game and the kind', () => {
    expect(groupKeyOf('item', 'Timespinner')).toBe('_read_item_name_groups_Timespinner');
    expect(groupKeyOf('location', 'Timespinner')).toBe('_read_location_name_groups_Timespinner');
  });
});
