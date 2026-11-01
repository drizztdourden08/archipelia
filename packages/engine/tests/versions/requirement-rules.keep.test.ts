/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { applyRequirementRules, compareVersions, ENGINE_DEFAULTS, versionInRange } from '../../src';

describe('K1 compareVersions', { tags: ['critical'] }, () => {
  test('orders by number, not by text', () => {
    expect(compareVersions('0.6.10', '0.6.9')).toBe(1);
    expect(compareVersions('3.12.15', '3.12.15')).toBe(0);
    expect(compareVersions('3.9.0', '3.12.0')).toBe(-1);
  });

  test('a short version counts missing parts as zero', () => {
    expect(compareVersions('3.12', '3.12.0')).toBe(0);
  });
});

describe('K1 versionInRange', { tags: ['critical'] }, () => {
  test('every comparator must hold', () => {
    expect(versionInRange('0.6.8', '>=0.6.2 <0.7.0')).toBe(true);
    expect(versionInRange('0.7.0', '>=0.6.2 <0.7.0')).toBe(false);
    expect(versionInRange('0.6.1', '>=0.6.2')).toBe(false);
  });

  test('a partial bound reads as zeros', () => {
    expect(versionInRange('3.12.0', '>=3.12')).toBe(true);
    expect(versionInRange('3.11.17', '>=3.12')).toBe(false);
  });

  test('a bare version means equal', () => {
    expect(versionInRange('0.6.8', '0.6.8')).toBe(true);
    expect(versionInRange('0.6.7', '=0.6.8')).toBe(false);
  });

  test('a word that is not a comparator is an error', () => {
    expect(() => versionInRange('0.6.8', '^0.6')).toThrow(/not a version comparator/);
  });
});

describe('K1 applyRequirementRules', { tags: ['critical'] }, () => {
  const { requirementRules } = ENGINE_DEFAULTS;

  test('the seed rules skip the GUI packages and add requests everywhere', () => {
    const applied = applyRequirementRules(requirementRules, '0.6.8', '3.11.17');
    expect(applied.skip).toEqual(['kivy', 'kivymd', 'pyshortcuts']);
    expect(applied.extra).toEqual(['requests==2.32.5']);
  });

  test('setuptools joins from Python 3.12', () => {
    expect(applyRequirementRules(requirementRules, '0.6.8', '3.12.15').extra).toEqual(['requests==2.32.5', 'setuptools==80.9.0']);
  });

  test('a version no rule names still gets the open ended rules', () => {
    expect(applyRequirementRules(requirementRules, '0.9.0', '3.13.1').skip).toContain('kivy');
  });

  test('skips are a union and the later extra wins by package name', () => {
    const applied = applyRequirementRules(
      [
        { skip: ['Kivy'], extra: ['requests==2.0.0', 'Pillow==1'] },
        { ap: '>=0.6.0', skip: ['kivy', 'sdl2'], extra: ['requests>=2.32'] },
        { ap: '>=0.7.0', skip: ['never'], extra: ['never==1'] },
      ],
      '0.6.8',
      '3.12.0',
    );
    expect(applied.skip).toEqual(['kivy', 'sdl2']);
    expect(applied.extra).toEqual(['requests>=2.32', 'Pillow==1']);
  });
});
