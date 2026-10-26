/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { normalizePackageName } from '../../src/packages/normalize-package-name';
import { parseRequirements } from '../../src/packages/parse-requirements';

describe('parseRequirements', () => {
  test('keeps plain names with versions, extras and markers, and skips comments and blanks', () => {
    const text = [
      '# the world needs these', '', 'numpy==2.5.1', 'Pillow>=10,<12  # imaging', 'requests[socks]~=2.32',
      'pywin32>=300; sys_platform == "win32"', 'tomli; python_version < "3.11" and (os_name == \'nt\' or extra in "dev")', '﻿',
    ].join('\r\n');
    expect(parseRequirements(text)).toEqual({
      packages: [
        'numpy==2.5.1', 'Pillow>=10,<12', 'requests[socks]~=2.32', 'pywin32>=300; sys_platform == "win32"',
        'tomli; python_version < "3.11" and (os_name == \'nt\' or extra in "dev")',
      ],
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

  test('LOW 4: options cannot ride after the semicolon', () => {
    const lines = [
      'foo; --hash=sha256:abc', 'foo; python_version < "3.11" --index-url https://evil.example', 'foo; -r other.txt',
      'foo; sys_platform == "win32" and', 'foo; ', 'foo; python_version', 'foo; python_version < "-1"', 'foo; unknown_marker == "x"',
      'foo; (python_version < "3.11"', 'foo; python_version < "3.11")', 'foo; "a" == "b" "c"',
    ];
    const parsed = parseRequirements(lines.join('\n'));
    expect(parsed.packages).toEqual([]);
    expect(parsed.refused).toEqual(lines.map((line) => line.trim()));
  });

  test('LOW 5: a name that is an archive or wheel file is refused', () => {
    const lines = ['evil.whl', 'evil-1.0-py3-none-any.whl', 'pkg.zip', 'pkg.tar.gz', 'pkg.tgz', 'pkg.tar', 'pkg.tar.bz2', 'pkg.tar.xz', 'pkg.egg', 'PKG.WHL', 'pkg.whl>=1'];
    const parsed = parseRequirements(lines.join('\n'));
    expect(parsed.packages).toEqual([]);
    expect(parsed.refused).toEqual(lines);
  });

  test('a dotted package name that is not an archive stays', () => {
    expect(parseRequirements('ruamel.yaml==0.18\nbackports.zoneinfo').packages).toEqual(['ruamel.yaml==0.18', 'backports.zoneinfo']);
  });

  test('an empty file declares nothing', () => {
    expect(parseRequirements('')).toEqual({ packages: [], refused: [] });
  });
});

describe('normalizePackageName', () => {
  test('follows PEP 503: lower case, runs of dash, underscore and dot become one dash', () => {
    expect(normalizePackageName('Foo_Bar')).toBe('foo-bar');
    expect(normalizePackageName('ruamel.yaml')).toBe('ruamel-yaml');
    expect(normalizePackageName('A--b__c..D')).toBe('a-b-c-d');
  });
});
