/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { parseBuildRequires } from '../src/build/parse-build-requires';

const withRequires = (body: string) => `[project]\nname = "ctrando"\n\n[build-system]\n${body}\n`;

describe('the build requirements of a project', () => {
  test('are read from the build-system table of pyproject.toml', () => {
    expect(parseBuildRequires(withRequires('requires = ["setuptools>=61", "wheel", "Cython>=3.0,<4"]\nbuild-backend = "setuptools.build_meta"')))
      .toEqual(['setuptools>=61', 'wheel', 'Cython>=3.0,<4']);
  });

  test('are read across lines, with comments, single quotes, extras and markers', () => {
    const body = ['requires = [', "  'setuptools>=61',  # the backend", '  "setuptools-scm[toml]>=6.2",', '  "tomli>=1; python_version < \'3.11\'",', ']'].join('\n');
    const requires = parseBuildRequires(withRequires(body));
    expect(requires).toHaveLength(3);
    expect(requires.slice(0, 2)).toEqual(['setuptools>=61', 'setuptools-scm[toml]>=6.2']);
    expect(requires[2]).toMatch(/^tomli>=1; python_version/);
  });

  test('fall back to setuptools and wheel when there is no pyproject.toml or no build-system table', () => {
    expect(parseBuildRequires(undefined)).toEqual(['setuptools>=40.8.0', 'wheel']);
    expect(parseBuildRequires('[project]\nname = "ctrando"\n')).toEqual(['setuptools>=40.8.0', 'wheel']);
  });

  test('may be an empty list', () => {
    expect(parseBuildRequires(withRequires('requires = []'))).toEqual([]);
  });

  test.each([
    'foo @ git+https://evil.example/foo.git',
    'foo @ https://evil.example/foo-1.0-py3-none-any.whl',
    '-r other.txt',
    '--index-url https://evil.example/simple',
    'https://evil.example/foo-1.0.tar.gz',
    './local-backend',
    'foo-1.0.tar.gz',
    'setuptools>=61\\nevil',
  ])('refuses the line %j, so nothing like it is installed', (line) => {
    expect(() => parseBuildRequires(withRequires(`requires = ["setuptools", "${line}"]`))).toThrow('will not install');
  });

  const names = Array.from({ length: 41 }, (_, at) => `"pkg${at}"`).join(', ');

  test.each([
    withRequires('build-backend = "x"'),
    withRequires('requires = "setuptools"'),
    withRequires('requires = [1, 2]'),
    withRequires(`requires = [${names}]`),
    '[build-system\nrequires = ',
    'build-system = "x"',
  ])('refuses build settings that cannot be read: %j', (text) => {
    expect(() => parseBuildRequires(text)).toThrow('cannot be read');
  });
});
