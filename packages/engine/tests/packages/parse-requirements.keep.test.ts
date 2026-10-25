/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { parseRequirements } from '../../src/packages/parse-requirements';

describe('parseRequirements', () => {
  test('keeps plain names with versions, extras and markers, and skips comments and blanks', () => {
    const text = [
      '# the world needs these', '', 'numpy==2.5.1', 'Pillow>=10,<12  # imaging', 'requests[socks]~=2.32',
      'pywin32>=300; sys_platform == "win32"', '﻿',
    ].join('\r\n');
    expect(parseRequirements(text)).toEqual({
      packages: ['numpy==2.5.1', 'Pillow>=10,<12', 'requests[socks]~=2.32', 'pywin32>=300; sys_platform == "win32"'],
      refused: [],
    });
  });

  test('joins a line that ends in a backslash', () => {
    expect(parseRequirements('numpy>=2\\\n,<3\n').packages).toEqual(['numpy>=2 ,<3']);
  });

  test('refuses options, urls, paths and direct references', () => {
    const lines = [
      '-r other.txt', '-e .', '--index-url https://evil.example/simple', '--extra-index-url=https://evil.example', '--hash=sha256:abc',
      'git+https://github.com/x/y.git', 'https://example.com/y-1.0-py3-none-any.whl', 'y @ https://example.com/y.whl', './local/pkg', 'numpy==2 --hash=sha256:abc',
    ];
    const parsed = parseRequirements(lines.join('\n'));
    expect(parsed.packages).toEqual([]);
    expect(parsed.refused).toEqual(lines);
  });

  test('an empty file declares nothing', () => {
    expect(parseRequirements('')).toEqual({ packages: [], refused: [] });
  });
});
