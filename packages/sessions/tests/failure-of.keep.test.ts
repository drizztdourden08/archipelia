/* @layer tests @kind test */
import { expect, test } from 'vitest';
import { failureOf } from '../src/service/failure-of';

test('K1 the last real error wins, atexit noise is ignored', { tags: ['critical'] }, () => {
  expect(failureOf(['start', 'ValueError: bad yaml', 'EOFError: EOF when reading a line'])).toBe('ValueError: bad yaml');
});

test('K1 without an error line the last lines are the reason, and silence still gets a message', { tags: ['critical'] }, () => {
  expect(failureOf(['one', 'two', 'three', 'four'])).toBe('two three four');
  expect(failureOf([])).toBe('The generator stopped without saying why.');
});
