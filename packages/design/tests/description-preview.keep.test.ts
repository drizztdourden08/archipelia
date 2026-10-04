/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { descriptionPreview } from '../src/compounds/OptionField/behavior/description-preview';

describe('descriptionPreview', () => {
  test('long descriptions get a preview', () => {
    expect(descriptionPreview(' Short. ')).toEqual({ preview: 'Short.', long: false });
    const long = descriptionPreview('one\ntwo\nthree');
    expect(long).toEqual({ preview: 'one\ntwo...', long: true });
    expect(descriptionPreview('word '.repeat(60)).preview.length).toBeLessThanOrEqual(183);
  });
});
