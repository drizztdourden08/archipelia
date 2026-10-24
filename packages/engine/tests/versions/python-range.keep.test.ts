/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { checkPythonFit, describePythonRange, ENGINE_DEFAULTS, parsePythonRange, pickPythonBuild, resolvePythonRange } from '../../src';
import { MODULE_UPDATE_0_6_0, MODULE_UPDATE_0_6_8 } from './fixtures/module-update.fixtures';

const build = (version: string) => ({ version, release: '1', target: 'win32-x64', file: `cpython-${version}`, sha256: 'a' });

describe('parsePythonRange', () => {
  test('0.6.8 on Windows declares 3.11.9 up to 3.14 with a warning below 3.11.13', () => {
    expect(parsePythonRange(MODULE_UPDATE_0_6_8, 'win32')).toEqual({
      min: '3.11.9',
      maxExclusive: '3.14.0',
      warnBelow: '3.11.13',
      source: 'declared',
    });
  });

  test('0.6.8 on macOS reads the same branch as Windows', () => {
    expect(parsePythonRange(MODULE_UPDATE_0_6_8, 'darwin')).toEqual(parsePythonRange(MODULE_UPDATE_0_6_8, 'win32'));
  });

  test('0.6.8 on Linux reads the other branch and has no warning', () => {
    expect(parsePythonRange(MODULE_UPDATE_0_6_8, 'linux')).toEqual({ min: '3.11.0', maxExclusive: '3.14.0', source: 'declared' });
  });

  test('0.6.0 on Windows declares a minimum only', () => {
    expect(parsePythonRange(MODULE_UPDATE_0_6_0, 'win32')).toEqual({ min: '3.10.11', warnBelow: '3.10.15', source: 'declared' });
  });

  test('0.6.0 on Linux declares a minimum only', () => {
    expect(parsePythonRange(MODULE_UPDATE_0_6_0, 'linux')).toEqual({ min: '3.10.1', source: 'declared' });
  });

  test('a file with no version check gives nothing', () => {
    expect(parsePythonRange('import os\nprint(os.name)\n', 'win32')).toBeUndefined();
  });
});

describe('resolvePythonRange', () => {
  const defaults = ENGINE_DEFAULTS;

  test('a declared maximum is kept as declared', () => {
    expect(resolvePythonRange({ moduleUpdate: MODULE_UPDATE_0_6_8, platform: 'win32', ap: '0.6.8', defaults }).source).toBe('declared');
  });

  test('a missing maximum takes the ceiling of the app defaults', () => {
    expect(resolvePythonRange({ moduleUpdate: MODULE_UPDATE_0_6_0, platform: 'win32', ap: '0.6.0', defaults })).toEqual({
      min: '3.10.11',
      maxExclusive: '3.13.0',
      warnBelow: '3.10.15',
      source: 'defaults',
    });
  });

  test('a missing maximum with no ceiling is unknown', () => {
    const range = resolvePythonRange({ moduleUpdate: MODULE_UPDATE_0_6_0, platform: 'win32', ap: '0.6.5', defaults });
    expect(range.source).toBe('unknown');
    expect(range.maxExclusive).toBeUndefined();
  });

  test('an unreadable file falls back to the app defaults', () => {
    const range = resolvePythonRange({ moduleUpdate: 'nothing here', platform: 'win32', ap: '0.6.8', defaults });
    expect(range).toEqual({ ...defaults.fallbackRange, source: 'defaults' });
  });

  test('no file at all falls back to the app defaults', () => {
    expect(resolvePythonRange({ platform: 'linux', ap: '0.6.8', defaults }).source).toBe('defaults');
  });
});

describe('checkPythonFit', () => {
  const range = { min: '3.11.9', maxExclusive: '3.14.0', warnBelow: '3.11.13', source: 'declared' } as const;

  test('a build inside the range fits', () => {
    expect(checkPythonFit('3.12.15', range, '0.6.8', '3.12')).toEqual({ fits: true });
  });

  test('a build above the range is refused with the range in words', () => {
    expect(checkPythonFit('3.14.9', range, '0.6.8', '3.12')).toEqual({ fits: false, hint: 'Archipelago 0.6.8 needs 3.11.9 to 3.13.x' });
  });

  test('a build below the minimum is refused', () => {
    expect(checkPythonFit('3.10.20', range, '0.6.8', '3.12').fits).toBe(false);
  });

  test('a build under the warning line still fits with a hint', () => {
    expect(checkPythonFit('3.11.10', range, '0.6.8', '3.12')).toEqual({
      fits: true,
      hint: 'Archipelago warns this Python has security issues',
    });
  });

  test('an unknown maximum warns about lines newer than the tested one', () => {
    const open = { min: '3.10.11', source: 'unknown' } as const;
    expect(checkPythonFit('3.13.17', open, '0.6.5', '3.12').hint).toBe('Archipelago 0.6.5 does not name a newest Python. 3.13 is untested.');
    expect(checkPythonFit('3.12.15', open, '0.6.5', '3.12')).toEqual({ fits: true });
  });
});

describe('describePythonRange', () => {
  test('words for a closed, an open and an odd maximum', () => {
    expect(describePythonRange({ min: '3.11.9', maxExclusive: '3.14.0', source: 'declared' })).toBe('3.11.9 to 3.13.x');
    expect(describePythonRange({ min: '3.10.11', source: 'unknown' })).toBe('3.10.11 or newer');
    expect(describePythonRange({ min: '3.10.1', maxExclusive: '3.12.4', source: 'declared' })).toBe('3.10.1 below 3.12.4');
  });
});

describe('pickPythonBuild', () => {
  const builds = [build('3.14.9'), build('3.13.17'), build('3.12.15'), build('3.11.17')];
  const range = { min: '3.11.9', maxExclusive: '3.14.0', source: 'declared' } as const;

  test('takes the newest fitting build', () => {
    expect(pickPythonBuild(builds, range)?.version).toBe('3.13.17');
  });

  test('keeps the preferred line when it fits', () => {
    expect(pickPythonBuild(builds, range, '3.12')?.version).toBe('3.12.15');
  });

  test('leaves the preferred line when it does not fit', () => {
    expect(pickPythonBuild(builds, range, '3.14')?.version).toBe('3.13.17');
  });

  test('gives nothing when nothing fits', () => {
    expect(pickPythonBuild(builds, { min: '3.15.0', source: 'declared' })).toBeUndefined();
  });
});
