/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { CUSTOM_NUMBER } from '../src/compounds/OptionControl/behavior/choice-options.constants';
import { isChangedValue } from '../src/compounds/OptionControl/behavior/is-changed-value';
import { numberValue } from '../src/compounds/OptionControl/behavior/number-value';
import { stringList } from '../src/compounds/OptionControl/behavior/string-list';
import { tagsValue } from '../src/compounds/OptionControl/behavior/tags-value';
import { textValue } from '../src/compounds/OptionControl/behavior/text-value';
import { toggleValue } from '../src/compounds/OptionControl/behavior/toggle-value';
import { addCount } from '../src/compounds/OptionControl/behavior/add-count';
import { counterEntries } from '../src/compounds/OptionControl/behavior/counter-entries';
import { removeCount } from '../src/compounds/OptionControl/behavior/remove-count';
import { setCount } from '../src/compounds/OptionControl/behavior/set-count';
import { unusedKeys } from '../src/compounds/OptionControl/behavior/unused-keys';
import { formatJson } from '../src/compounds/OptionControl/behavior/format-json';
import { parseJson } from '../src/compounds/OptionControl/behavior/parse-json';
import { sameJson } from '../src/compounds/OptionControl/behavior/same-json';
import { customNumber } from '../src/compounds/OptionControl/behavior/custom-number';
import { namedPick } from '../src/compounds/OptionControl/behavior/named-pick';
import { namedSelection } from '../src/compounds/OptionControl/behavior/named-selection';
import { numberShown } from '../src/compounds/OptionControl/behavior/number-shown';
import { defOf } from './option-defs';

describe('values read back from controls', () => {
  test('toggle, text and number', () => {
    expect(toggleValue(true)).toBe(true);
    expect(toggleValue('yes')).toBe(false);
    expect(textValue(null)).toBe('');
    expect(textValue(12)).toBe('12');
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

  test('the selection follows a name or a matching number', () => {
    expect(namedSelection(def, 'easy')).toBe('easy');
    expect(namedSelection(def, 30)).toBe('normal');
    expect(namedSelection(def, 44)).toBe(CUSTOM_NUMBER);
  });

  test('a pick stores the number; custom keeps a number in range', () => {
    expect(namedPick(def, 'easy', 30)).toBe(20);
    expect(namedPick(def, CUSTOM_NUMBER, 44)).toBe(44);
    expect(namedPick(def, CUSTOM_NUMBER, 'easy')).toBe(30);
    expect(customNumber({ ...def, default: 0 }, 500)).toBe(1);
    expect(numberShown(def, 'easy')).toBe(20);
  });
});

describe('counter entries', () => {
  const def = defOf('start_inventory');

  test('set, add and remove keep counts', () => {
    expect(setCount({ Bombs: 1 }, 'Bombs', 3)).toEqual({ Bombs: 3 });
    expect(addCount({ Bombs: 1 }, ' Arrows ')).toEqual({ Bombs: 1, Arrows: 1 });
    expect(addCount({ Bombs: 1 }, 'Bombs')).toEqual({ Bombs: 1 });
    expect(addCount({}, '  ')).toEqual({});
    expect(removeCount({ Bombs: 1, Arrows: 2 }, 'Bombs')).toEqual({ Arrows: 2 });
  });

  test('entries skip anything that is not a count, unused keys come from the schema', () => {
    expect(counterEntries({ Bombs: 2, Bad: 'x' })).toEqual([['Bombs', 2]]);
    expect(counterEntries(['a'])).toEqual([]);
    expect(unusedKeys(def, { Bombs: 1 })).toEqual(['Arrows']);
  });
});

describe('JSON text', () => {
  test('a table and a list parse into their shape', () => {
    expect(parseJson('{"Moldorm": "Helmasaur"}', 'object')).toEqual({ value: { Moldorm: 'Helmasaur' } });
    expect(parseJson('[1, 2]', 'list')).toEqual({ value: [1, 2] });
  });

  test('the wrong shape or broken text is an error', () => {
    expect(parseJson('[1]', 'object').error).toMatch(/JSON table/);
    expect(parseJson('{', 'object').error).toMatch(/Not valid JSON/);
  });

  test('formatting round trips and sameJson ignores spacing', () => {
    expect(sameJson(formatJson({ a: 1 }), { a: 1 }, 'object')).toBe(true);
    expect(sameJson('{"a":1}', { a: 1 }, 'object')).toBe(true);
    expect(sameJson('{"a":2}', { a: 1 }, 'object')).toBe(false);
  });
});
