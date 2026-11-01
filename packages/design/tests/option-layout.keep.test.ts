/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { optionDef as option } from '@archipelia/model';
import { choiceOptions } from '../src/compounds/OptionControl/behavior/choice-options';
import { hintOf } from '../src/compounds/OptionControl/behavior/option-hint';

describe('K1 random on a choice', { tags: ['critical'] }, () => {
  const medallion = option({ key: 'misery_mire_medallion', kind: 'choice', default: 'random', choices: [{ value: 'ether', label: 'ether' }, { value: 'quake', label: 'quake' }] });

  test('the select offers Random after the listed choices, once', () => {
    expect(choiceOptions(medallion).map((entry) => entry.value)).toEqual(['ether', 'quake', 'random']);
    const listed = option({ key: 'x', kind: 'choice', default: 'random', choices: [{ value: 'random', label: 'random' }, { value: 'ether', label: 'ether' }] });
    expect(choiceOptions(listed).map((entry) => entry.value)).toEqual(['random', 'ether']);
  });

  test('the default reads as Random in the hint', () => {
    expect(hintOf(medallion)).toContain('Random');
  });
});
