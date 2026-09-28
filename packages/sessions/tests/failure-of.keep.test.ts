/* @layer tests @kind test */
import { expect, test } from 'vitest';
import { failureOf } from '../src/service/failure-of';

test('the last real error wins, atexit noise is ignored', () => {
  expect(failureOf(['start', 'ValueError: bad yaml', 'EOFError: EOF when reading a line'])).toBe('ValueError: bad yaml');
});

test('without an error line the last lines are the reason, and silence still gets a message', () => {
  expect(failureOf(['one', 'two', 'three', 'four'])).toBe('two three four');
  expect(failureOf([])).toBe('The generator stopped without saying why.');
});
