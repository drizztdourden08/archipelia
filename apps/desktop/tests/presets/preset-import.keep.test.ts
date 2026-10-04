/* @layer tests @kind test */
import { parse } from 'yaml';
import { describe, expect, test } from 'vitest';
import { coercePresetValues } from '@archipelia/design';
import { exportPlayerYaml } from '../../src/views/PresetEditor/behavior/export-player-yaml';
import { PLAYER_NAME } from '../../src/views/PresetEditor/PresetEditor.constants';
import { yamlFileName } from '../../src/views/PresetEditor/behavior/yaml-file-name';
import { importPlayerYaml } from '../../src/views/PresetEditor/behavior/import-player-yaml';
import { importSummary } from '../../src/views/PresetEditor/behavior/import-summary';
import { newPresetValues } from '../../src/views/PresetsHub/behavior/new-preset-values';
import { startFromOptions } from '../../src/views/PresetsHub/behavior/start-from-options';
import { DEMO } from './demo-schema';

describe('coercePresetValues', () => {
  test('unknown keys and unreadable values are skipped', () => {
    const { values, skipped } = coercePresetValues(DEMO, { crystals: 2, removed: true, death_link: 'maybe' });
    expect(values).toEqual({ crystals: 2 });
    expect(skipped).toEqual(['removed', 'death_link']);
  });
});

describe('player yaml', () => {
  const FILE = [
    'name: Link',
    'game: Demo',
    'Demo:',
    '  goal: crystals_only',
    '  crystals: 4',
    '  progression_balancing: 50',
    'Other:',
    '  goal: ganon',
  ].join('\n');

  test('import takes the game block and keeps known keys', () => {
    expect(importPlayerYaml(FILE, DEMO)).toEqual({ values: { goal: 'crystals_only', crystals: 4 }, skipped: ['progression_balancing'] });
  });

  test('a weighted game list is accepted when it names this game', () => {
    const weighted = FILE.replace('game: Demo', 'game:\n  Demo: 1\n  Other: 1');
    expect(importPlayerYaml(weighted, DEMO).values).toMatchObject({ crystals: 4 });
  });

  test('another game or no block is refused', () => {
    expect(() => importPlayerYaml('game: Other\nOther: {}', DEMO)).toThrow(/for Other, not Demo/);
    expect(() => importPlayerYaml('game: Demo', DEMO)).toThrow(/no Demo options/);
    expect(() => importPlayerYaml('- a', DEMO)).toThrow(/not a player yaml/);
  });

  test('the summary names what was skipped', () => {
    expect(importSummary('a.yaml', 2, [])).toBe('Imported 2 options from a.yaml.');
    expect(importSummary('a.yaml', 1, ['x', 'y'])).toBe('Imported 1 options from a.yaml. Skipped x, y.');
  });

  test('export writes the resolved values under the game', () => {
    const written = parse(exportPlayerYaml(DEMO, { crystals: 2 })) as Record<string, Record<string, unknown>>;
    expect(written.name).toBe(PLAYER_NAME);
    expect(written.game).toBe('Demo');
    expect(written.Demo).toMatchObject({ crystals: 2, goal: 'ganon', death_link: false });
  });

  test('file names drop characters Windows refuses', () => {
    expect(yamlFileName('Open: keysanity?')).toBe('Open- keysanity-.yaml');
    expect(yamlFileName('  ')).toBe('preset.yaml');
  });
});

describe('new preset from a built-in preset', () => {
  test('keeps only changed, known and readable values', () => {
    expect(newPresetValues(DEMO, 'Fast')).toEqual({ crystals: 3, death_link: true });
    expect(newPresetValues(DEMO, '')).toEqual({});
  });

  test('offers the game defaults and every built-in preset', () => {
    expect(startFromOptions(DEMO).map((entry) => entry.label)).toEqual(['Game defaults', 'Start from: Fast']);
    expect(startFromOptions(undefined)).toHaveLength(1);
  });
});
