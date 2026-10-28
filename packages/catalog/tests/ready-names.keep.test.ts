/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { cleanName } from '../src/ready/clean-name';
import { sameName } from '../src/ready/same-name';

describe('names from a topic repository', () => {
  test('drops control and direction characters, folds the width and caps the length', () => {
    expect(cleanName('Star\u202E Quest\u200B')).toBe('Star Quest');
    expect(cleanName('Star\u0000\u0007 Quest')).toBe('Star Quest');
    expect(cleanName('\uFF33\uFF54\uFF41\uFF52  Quest')).toBe('Star Quest');
    expect(Array.from(cleanName('x'.repeat(500)))).toHaveLength(80);
  });

  test('look-alikes of a name are the same name', () => {
    expect(sameName('Relic of the Past', 'R\u0435lic \u043Ef the Past')).toBe(true);
    expect(sameName('Relic of the Past', 'Relic\u200B of the Past')).toBe(true);
    expect(sameName('Relic of the Past', '\uFF32elic of the Past')).toBe(true);
    expect(sameName('Relic of the Past', 'Relic of the Pasture')).toBe(false);
  });
});
