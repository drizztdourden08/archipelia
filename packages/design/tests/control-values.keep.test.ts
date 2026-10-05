/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { optionDef as option } from '@archipelia/model';
import { isChangedValue } from '../src/compounds/OptionControl/behavior/is-changed-value';
import { numberValue } from '../src/compounds/OptionControl/behavior/number-value';
import { stringList } from '../src/compounds/OptionControl/behavior/string-list';
import { tagsValue } from '../src/compounds/OptionControl/behavior/tags-value';
import { countsOf } from '../src/compounds/OptionControl/behavior/counts-of';
import { scalarsOf } from '../src/compounds/OptionControl/behavior/scalars-of';
import { keyValueLook } from '../src/compounds/OptionControl/behavior/key-value-look';
import { customNumber } from '../src/compounds/OptionControl/behavior/custom-number';
import { numberShown } from '../src/compounds/OptionControl/behavior/number-shown';
import { defOf } from './option-defs';

describe('values read back from controls', () => {
  test('numbers', () => {
    expect(numberValue(4)).toBe(4);
    expect(numberValue(Number.NaN)).toBeUndefined();
    expect(numberValue(null)).toBeUndefined();
  });

  test('a set is sorted and unique, a list keeps its order', () => {
    expect(tagsValue('set', ['b', 'a', 'b'])).toEqual(['a', 'b']);
    expect(tagsValue('list', ['b', 'a', 'b'])).toEqual(['b', 'a', 'b']);
    expect(stringList(['a', 2])).toEqual(['a', '2']);
    expect(stringList(3)).toEqual([]);
  });

  test('changed compares by value', () => {
    expect(isChangedValue({ a: 1 }, { a: 1 })).toBe(false);
    expect(isChangedValue([1], [2])).toBe(true);
  });
});

describe('named range', () => {
  const def = defOf('pieces');

  test('the number shown follows a name, a number or the default', () => {
    expect(numberShown(def, 'easy')).toBe(20);
    expect(numberShown(def, 44)).toBe(44);
    expect(numberShown(def, 'unknown')).toBe(30);
    expect(customNumber({ ...def, default: 0 }, 500)).toBe(1);
  });
});

describe('key values', () => {
  test('a counter counts from 0 over its valid names, and keeps only counts', () => {
    expect(keyValueLook(defOf('start_inventory'), {})).toEqual({ valueKind: 'count', keys: ['Arrows', 'Bombs'], min: 0, newValue: 1 });
    expect(countsOf({ Bombs: 2, Bad: 'x' })).toEqual({ Bombs: 2 });
    expect(countsOf(['a'])).toEqual({});
  });

  test('a dict of text or of numbers edits its own kind of value', () => {
    expect(keyValueLook(defOf('bosses'), { Moldorm: 'Helmasaur' })).toEqual({ valueKind: 'text', keys: undefined, newValue: '' });
    const weights = option({ key: 'w', kind: 'dict', default: { a: 1 } });
    expect(keyValueLook(weights, {})).toEqual({ valueKind: 'number', keys: undefined, newValue: 0 });
  });

  test('only names with a number or a text reach the editor', () => {
    expect(scalarsOf({ a: 1, b: 'x', c: [1], d: null })).toEqual({ a: 1, b: 'x' });
    expect(scalarsOf('text')).toEqual({});
  });
});
