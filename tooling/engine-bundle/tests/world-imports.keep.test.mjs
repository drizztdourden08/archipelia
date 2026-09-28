/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { worldImports } from '../src/official/world-imports.mjs';

const OFFICIAL = new Set(['alttp', 'sm', 'smz3', 'demo']);

const scan = (files) => worldImports(files, 'demo', OFFICIAL);

describe('worldImports', () => {
  test('a top level import of another world is required', () => {
    expect(scan([{ path: '__init__.py', source: 'from worlds.sm import Rom\n' }])).toEqual({ requires: ['sm'], optional: [] });
  });

  test('an import inside try is optional', () => {
    const source = 'x = 1\ntry:\n    from worlds.alttp import ALTTPWorld\nexcept ImportError:\n    pass\n';
    expect(scan([{ path: 'Items.py', source }])).toEqual({ requires: [], optional: ['alttp'] });
  });

  test('relative imports count only when they climb to the worlds package', () => {
    const files = [
      { path: 'Rules.py', source: 'from ..smz3 import a\nfrom .data import b\n' },
      { path: 'sub/mod.py', source: 'from ..alttp import c\nfrom ...sm import d\n' },
    ];
    expect(scan(files)).toEqual({ requires: ['sm', 'smz3'], optional: [] });
  });

  test('itself, libraries and unknown worlds are ignored', () => {
    const source = 'from worlds.demo import x\nfrom worlds._bizhawk import y\nfrom worlds.generic import z\nimport worlds.tracker\n';
    expect(scan([{ path: '__init__.py', source }])).toEqual({ requires: [], optional: [] });
  });

  test('a hard import wins over an optional one', () => {
    const files = [
      { path: 'a.py', source: 'try:\n    import worlds.alttp\nexcept Exception:\n    pass\n' },
      { path: 'b.py', source: 'import worlds.alttp\n' },
    ];
    expect(scan(files)).toEqual({ requires: ['alttp'], optional: [] });
  });
});
