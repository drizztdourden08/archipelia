/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { checkWorldFit, compareApVersions, parseApVersion } from '../src';
import { ROTP_RANGE } from './helpers/rotp-world.constants';

describe('Archipelago versions', () => {
  test('parse and compare by number, not by text', () => {
    expect(parseApVersion('0.6.8')).toEqual([0, 6, 8]);
    expect(parseApVersion('0.6')).toBeNull();
    expect(parseApVersion('v0.6.8')).toBeNull();
    expect(compareApVersions('0.6.10', '0.6.9')).toBe(1);
    expect(compareApVersions('0.6.8', '0.6.8')).toBe(0);
    expect(compareApVersions('0.5.9', '0.6.0')).toBe(-1);
    expect(() => compareApVersions('x', '0.6.0')).toThrow('"x" is not an Archipelago version');
  });
});

describe('a world fits an exact Archipelago version', () => {
  test('a world with only a minimum is open ended', () => {
    expect(checkWorldFit(ROTP_RANGE, '0.6.4')).toEqual({ fits: true });
    expect(checkWorldFit(ROTP_RANGE, '0.6.8')).toEqual({ fits: true });
    expect(checkWorldFit(ROTP_RANGE, '1.2.0')).toEqual({ fits: true });
  });

  test('a version below the minimum is too old, with a sentence naming both sides', () => {
    const fit = checkWorldFit(ROTP_RANGE, '0.6.3');
    expect(fit).toEqual({
      fits: false,
      reason: 'too-old',
      message: 'Relic of the Past 0.1.0 supports Archipelago 0.6.4 and newer, not Archipelago 0.6.3.',
    });
  });

  test('a maximum makes newer versions too new, and both bounds hold', () => {
    const range = { ...ROTP_RANGE, maximumAp: '0.6.8' };
    expect(checkWorldFit(range, '0.6.8')).toEqual({ fits: true });
    const fit = checkWorldFit(range, '0.6.9');
    expect(fit.fits).toBe(false);
    expect(fit.fits ? '' : fit.reason).toBe('too-new');
    expect(fit.fits ? '' : fit.message).toContain('Archipelago 0.6.4 to 0.6.8');
  });

  test('a world with no range fits everything and a bad version is reported', () => {
    expect(checkWorldFit({}, '0.1.0')).toEqual({ fits: true });
    const fit = checkWorldFit(ROTP_RANGE, 'latest');
    expect(fit.fits ? '' : fit.reason).toBe('invalid-version');
    const badBound = checkWorldFit({ minimumAp: 'x' }, '0.6.8');
    expect(badBound.fits ? '' : badBound.reason).toBe('invalid-version');
  });
});
