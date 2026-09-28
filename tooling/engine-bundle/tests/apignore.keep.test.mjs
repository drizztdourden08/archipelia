/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { createIgnore } from '../src/official/apignore.mjs';

const GLOBAL = ['# comment', '__MACOSX', '.DS_Store', '__pycache__', '', '/archipelago.json', '/.apignore'];

describe('createIgnore', () => {
  test('a cache folder is dropped at any depth', () => {
    const ignored = createIgnore(GLOBAL);
    expect(ignored('__pycache__/a.pyc')).toBe(true);
    expect(ignored('data/__pycache__/b.pyc')).toBe(true);
    expect(ignored('data/items.json')).toBe(false);
  });

  test('an anchored name matches only at the world root', () => {
    const ignored = createIgnore(GLOBAL);
    expect(ignored('archipelago.json')).toBe(true);
    expect(ignored('data/archipelago.json')).toBe(false);
  });

  test('a world ignore can drop a folder and bring one file back', () => {
    const ignored = createIgnore([...GLOBAL, '/src/*', '!/src/keep.py']);
    expect(ignored('src/__init__.py')).toBe(true);
    expect(ignored('src/keep.py')).toBe(false);
    expect(ignored('rules/src/x.py')).toBe(false);
  });

  test('a double star crosses folders', () => {
    const ignored = createIgnore(['docs/**/*.png']);
    expect(ignored('docs/a/b/c.png')).toBe(true);
    expect(ignored('docs/c.png')).toBe(true);
    expect(ignored('docs/c.md')).toBe(false);
  });
});
