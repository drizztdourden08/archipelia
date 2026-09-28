/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { optionLabel } from '../../src/compounds/PlayerRow/behavior/option-label';

const OPTIONS = [{ value: 'soh', label: 'Ship of Harkinian' }, { value: 'ts', label: 'Timespinner' }];

describe('optionLabel', () => {
  test('names the chosen option', () => {
    expect(optionLabel(OPTIONS, 'ts', 'none')).toBe('Timespinner');
  });

  test('falls back when nothing matches', () => {
    expect(optionLabel(OPTIONS, '', 'none')).toBe('none');
  });
});
