/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { fieldControl } from '../src/compounds/OptionField/behavior/field-control';

describe('fieldControl', () => {
  test('a function child gets the id of the label', () => {
    expect(fieldControl((labelId) => `control of ${labelId}`, 'label-1')).toBe('control of label-1');
  });

  test('a plain child is drawn as it is', () => {
    expect(fieldControl('control', 'label-1')).toBe('control');
  });
});
