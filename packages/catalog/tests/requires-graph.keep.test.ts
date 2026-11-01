/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { dependentsOf } from '../src/official/dependents-of';
import { installOrder } from '../src/official/install-order';

const INDEX = [
  { apworld: 'alttp', requires: [] },
  { apworld: 'sm', requires: [] },
  { apworld: 'smz3', requires: ['sm', 'alttp'] },
  { apworld: 'combo', requires: ['smz3', 'alttp'] },
];

describe('installOrder', () => {
  test('K1 a world without requirements installs alone', { tags: ['critical'] }, () => {
    expect(installOrder(INDEX, 'sm')).toEqual(['sm']);
  });

  test('K1 requirements come first, each once', { tags: ['critical'] }, () => {
    expect(installOrder(INDEX, 'combo')).toEqual(['sm', 'alttp', 'smz3', 'combo']);
  });

  test('K1 an unknown world is refused', { tags: ['critical'] }, () => {
    expect(() => installOrder(INDEX, 'nope')).toThrow(/not an official world/);
  });

  test('K1 a cycle is refused', { tags: ['critical'] }, () => {
    const cyclic = [{ apworld: 'a', requires: ['b'] }, { apworld: 'b', requires: ['a'] }];
    expect(() => installOrder(cyclic, 'a')).toThrow(/a -> b -> a/);
  });
});

describe('dependentsOf', () => {
  test('K1 lists the installed worlds that need one', { tags: ['critical'] }, () => {
    expect(dependentsOf(INDEX, 'alttp')).toEqual(['smz3', 'combo']);
    expect(dependentsOf(INDEX, 'combo')).toEqual([]);
  });
});
