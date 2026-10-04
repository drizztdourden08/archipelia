/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { choiceOptions } from '../src/compounds/OptionControl/behavior/choice-options';
import { CUSTOM_NUMBER } from '../src/compounds/OptionControl/behavior/choice-options.constants';
import { namedOptions } from '../src/compounds/OptionControl/behavior/named-options';
import { titleCase } from '../src/compounds/OptionControl/behavior/title-case';
import { controlKindOf } from '../src/compounds/OptionControl/behavior/control-kind';
import { PICKER_MAX } from '../src/compounds/OptionControl/behavior/set-kind.constants';
import { optionDescriptor } from '../src/compounds/OptionControl/behavior/option-descriptor';
import { hintOf } from '../src/compounds/OptionControl/behavior/option-hint';
import { optionDef as option } from '@archipelia/model';
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
    expect(controlKindOf(defOf('bosses'), {})).toBe('json-object');
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
});

describe('optionDescriptor', () => {
  test('maps option kinds to field kit kinds', () => {
    expect(optionDescriptor(defOf('death_link'))).toMatchObject({ path: 'death_link', label: 'Death link', kind: 'boolean' });
    expect(optionDescriptor(defOf('goal'))).toMatchObject({ kind: 'enum', options: ['ganon', 'crystals_only'] });
    expect(optionDescriptor(defOf('crystals')).kind).toBe('number');
    expect(optionDescriptor(defOf('seed_name')).kind).toBe('string');
    expect(optionDescriptor(defOf('bosses')).kind).toBe('object');
  });

  test('a set carries its element kind, and hidden follows visibility', () => {
    expect(optionDescriptor(defOf('exclude')).of).toMatchObject({ kind: 'enum', options: ['Bow', 'Hookshot'] });
    expect(optionDescriptor(defOf('exclude')).hidden).toBe(false);
    expect(optionDescriptor(defOf('plando')).hidden).toBe(true);
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

  test('named options end with a custom number entry', () => {
    const options = namedOptions(defOf('pieces'));
    expect(options[0]).toEqual({ value: 'easy', label: 'Easy (20)' });
    expect(options.at(-1)?.value).toBe(CUSTOM_NUMBER);
  });

  test('hints show the bounds and the default', () => {
    expect(hintOf(defOf('crystals'))).toBe('0 to 7 · default 7');
    expect(hintOf(defOf('pieces'))).toBe('1 to 90 or a named value · default Normal (30)');
    expect(hintOf(defOf('goal'), 'crystals_only', 'preset')).toBe('preset Crystals Only');
    expect(hintOf(defOf('death_link'))).toBe('default off');
    expect(hintOf(defOf('exclude'))).toBeUndefined();
  });
});
