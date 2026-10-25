/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { optionDef as option } from '@archipelia/model';
import { choiceOptions } from '../src/compounds/OptionControl/behavior/choice-options';
import { controlSizeOf } from '../src/compounds/OptionControl/behavior/control-size';
import { hintOf } from '../src/compounds/OptionControl/behavior/option-hint';
import { helpOf } from '../src/compounds/OptionFieldRow/behavior/help-of';
import { defOf } from './option-defs';

const choice = (labels: string[]) => option({ key: 'c', kind: 'choice', default: labels[0] ?? '', choices: labels.map((label) => ({ value: label, label })) });

describe('controlSizeOf', () => {
  test('a toggle is as small as it is, a number is compact and a slider has one steady width', () => {
    expect(controlSizeOf(defOf('death_link'), 'toggle')).toBe('auto');
    expect(controlSizeOf(option({ key: 'n', kind: 'range', default: 1 }), 'range')).toBe('xs');
    expect(controlSizeOf(defOf('crystals'), 'range')).toBe('md');
    expect(controlSizeOf(defOf('pieces'), 'named-range')).toBe('md');
  });

  test('a select takes the width of its longest label, not of the one shown', () => {
    expect(controlSizeOf(choice(['on', 'off']), 'choice')).toBe('sm');
    expect(controlSizeOf(choice(['on', 'a much longer name']), 'choice')).toBe('md');
    expect(controlSizeOf(choice(['a name that is far longer than the rest']), 'choice')).toBe('lg');
  });

  test('lists and tables take the row', () => {
    expect(controlSizeOf(defOf('bosses'), 'json-object')).toBe('full');
    expect(controlSizeOf(defOf('exclude'), 'tags')).toBe('full');
  });
});

describe('helpOf', () => {
  test('a short one-line description needs no hint, a long or multi-line one gets its full text', () => {
    expect(helpOf('Pick the goal.')).toBeUndefined();
    expect(helpOf('')).toBeUndefined();
    expect(helpOf('x'.repeat(61))).toBe('x'.repeat(61));
    expect(helpOf('First line.\nSecond line.')).toBe('First line.\nSecond line.');
  });
});

describe('random on a choice', () => {
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
