/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { coerceOptionValue } from '../src/compounds/OptionControl/behavior/coerce-option-value';
import { defOf } from './option-defs';

describe('coerceOptionValue', () => {
  test('toggles read words and weights', () => {
    expect(coerceOptionValue(defOf('death_link'), 'on')).toBe(true);
    expect(coerceOptionValue(defOf('death_link'), 'false')).toBe(false);
    expect(coerceOptionValue(defOf('death_link'), { true: 0, false: 50 })).toBe(false);
    expect(coerceOptionValue(defOf('death_link'), 'maybe')).toBeUndefined();
  });

  test('choices match value or label, any case', () => {
    expect(coerceOptionValue(defOf('goal'), 'Crystals Only')).toBe('crystals_only');
    expect(coerceOptionValue(defOf('goal'), 'GANON')).toBe('ganon');
    expect(coerceOptionValue(defOf('goal'), 'random')).toBe('random');
  });

  test('ranges take numbers, numeric text and names', () => {
    expect(coerceOptionValue(defOf('crystals'), '5')).toBe(5);
    expect(coerceOptionValue(defOf('pieces'), 'Easy')).toBe('easy');
    expect(coerceOptionValue(defOf('crystals'), [1])).toBeUndefined();
  });

  test('collections keep their shape', () => {
    expect(coerceOptionValue(defOf('exclude'), ['Bow', 3])).toEqual(['Bow', '3']);
    expect(coerceOptionValue(defOf('start_inventory'), { Bombs: '2' })).toEqual({ Bombs: 2 });
    expect(coerceOptionValue(defOf('start_inventory'), { Bombs: 'x' })).toBeUndefined();
    expect(coerceOptionValue(defOf('bosses'), { Moldorm: 'Arrghus' })).toEqual({ Moldorm: 'Arrghus' });
    expect(coerceOptionValue(defOf('plando'), [{ item: 'Bow' }])).toEqual([{ item: 'Bow' }]);
  });
});
