/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { readSeats } from '../../src/listener/admin/options/read-seats';

describe('K1 the held seats of an admin request', { tags: ['critical'] }, () => {
  test('keeps a list of names, an empty list and an absent field apart', () => {
    expect(readSeats(['Alice', 'Bob'])).toEqual(['Alice', 'Bob']);
    expect(readSeats([])).toEqual([]);
    expect(readSeats(undefined)).toBeUndefined();
  });

  test('refuses a name that is empty, too long or not text, and a repeated name', () => {
    expect(() => readSeats([''])).toThrow('seats[0]');
    expect(() => readSeats(['a'.repeat(17)])).toThrow('seats[0]');
    expect(() => readSeats([4])).toThrow('seats[0]');
    expect(() => readSeats('Alice')).toThrow('at most');
    expect(() => readSeats(['Alice', 'ALICE'])).toThrow('repeat');
  });
});
