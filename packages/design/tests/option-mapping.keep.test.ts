/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { choiceOptions } from '../src/compounds/OptionControl/behavior/choice-options';
import { rangeNames } from '../src/compounds/OptionControl/behavior/range-names';
import { rangeBounds } from '../src/compounds/OptionControl/behavior/range-bounds';
import { titleCase } from '../src/compounds/OptionControl/behavior/title-case';
import { controlKindOf } from '../src/compounds/OptionControl/behavior/control-kind';
import { PICKER_MAX } from '../src/compounds/OptionControl/behavior/set-kind.constants';
import { hintOf } from '../src/compounds/OptionControl/behavior/option-hint';
import { optionDef as option } from '@archipelia/model';
import type { OptionValue } from '@archipelia/model';
import { defOf } from './option-defs';

describe('controlKindOf', () => {
  test('each option kind picks its control', () => {
    expect(controlKindOf(defOf('death_link'), false)).toBe('toggle');
    expect(controlKindOf(defOf('goal'), 'ganon')).toBe('choice');
    expect(controlKindOf(defOf('crystals'), 7)).toBe('range');
    expect(controlKindOf(defOf('pieces'), 30)).toBe('named-range');
    expect(controlKindOf(defOf('seed_name'), '')).toBe('text');
    expect(controlKindOf(defOf('start_inventory'), {})).toBe('counter');
    expect(controlKindOf(defOf('exclude'), [])).toBe('set-picker');
    expect(controlKindOf(defOf('bosses'), {})).toBe('key-values');
  });

  test('a named range without names is a plain range', () => {
    expect(controlKindOf(option({ key: 'n', kind: 'named-range', default: 1, namedValues: {} }), 1)).toBe('range');
  });

  test('a set picks tags when its names are many or unknown', () => {
    const many = Array.from({ length: PICKER_MAX + 1 }, (_, i) => `Item ${i}`);
    expect(controlKindOf(option({ key: 's', kind: 'set', default: [], validKeys: many }), [])).toBe('set-tags');
    expect(controlKindOf(option({ key: 's', kind: 'set', default: [] }), [])).toBe('tags');
  });

  test('a list of strings is tags, anything else is JSON', () => {
    expect(controlKindOf(defOf('plando'), ['a'])).toBe('tags');
    expect(controlKindOf(defOf('plando'), [{ item: 'Bow' }])).toBe('json-list');
  });

  test('a dict one level deep of numbers or of text is key values, anything deeper or empty is JSON', () => {
    const plain = option({ key: 'd', kind: 'dict', default: {} });
    const dict = (value: OptionValue) => controlKindOf(plain, value);
    expect(dict({ Bow: 2 })).toBe('key-values');
    expect(dict({ Bow: 'Hookshot' })).toBe('key-values');
    expect(dict({ Bow: 2, Hookshot: 'left' })).toBe('json-object');
    expect(dict({ Bow: { count: 2 } })).toBe('json-object');
    expect(dict({})).toBe('json-object');
  });
});

describe('labels and hints', () => {
  test('titleCase turns underscores into words', () => {
    expect(titleCase('crystals_only')).toBe('Crystals Only');
    expect(titleCase("ganon's tower")).toBe("Ganon's Tower");
  });

  test('choice labels are title cased, values kept', () => {
    expect(choiceOptions(defOf('goal'))).toEqual([
      { value: 'ganon', label: 'Ganon' }, { value: 'crystals_only', label: 'Crystals Only' },
    ]);
  });

  test('named values become the labels of a slider, one per number', () => {
    expect(rangeNames(defOf('pieces'))).toEqual([[20, 'Easy'], [30, 'Normal']]);
    expect(rangeNames(option({ key: 'n', kind: 'named-range', default: 1, namedValues: { normal: 1, default: 1 } }))).toEqual([[1, 'Normal']]);
  });

  test('the bounds of a named range come from its range, else from its names', () => {
    expect(rangeBounds(defOf('pieces'))).toEqual({ min: 1, max: 90 });
    expect(rangeBounds(option({ key: 'n', kind: 'named-range', default: 1, namedValues: { low: 2, high: 9 } }))).toEqual({ min: 2, max: 9 });
  });

  test('hints show the bounds and the default', () => {
    expect(hintOf(defOf('crystals'))).toBe('0 to 7 · default 7');
    expect(hintOf(defOf('pieces'))).toBe('1 to 90 or a named value · default Normal (30)');
    expect(hintOf(defOf('goal'), 'crystals_only', 'preset')).toBe('preset Crystals Only');
    expect(hintOf(defOf('death_link'))).toBe('default off');
    expect(hintOf(defOf('exclude'))).toBeUndefined();
  });
});
