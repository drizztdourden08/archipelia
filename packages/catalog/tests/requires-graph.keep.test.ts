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
  test('a world without requirements installs alone', () => {
    expect(installOrder(INDEX, 'sm')).toEqual(['sm']);
  });

  test('requirements come first, each once', () => {
    expect(installOrder(INDEX, 'combo')).toEqual(['sm', 'alttp', 'smz3', 'combo']);
  });

  test('an unknown world is refused', () => {
    expect(() => installOrder(INDEX, 'nope')).toThrow(/not an official world/);
  });

  test('a cycle is refused', () => {
    const cyclic = [{ apworld: 'a', requires: ['b'] }, { apworld: 'b', requires: ['a'] }];
    expect(() => installOrder(cyclic, 'a')).toThrow(/a -> b -> a/);
  });
});

describe('dependentsOf', () => {
  test('lists the installed worlds that need one', () => {
    expect(dependentsOf(INDEX, 'alttp')).toEqual(['smz3', 'combo']);
    expect(dependentsOf(INDEX, 'combo')).toEqual([]);
  });
});
