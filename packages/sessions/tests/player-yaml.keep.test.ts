/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { parse } from 'yaml';
import type { SessionPlayer } from '@archipelia/model';
import { gameOfYaml, renderImportedYaml, renderPresetYaml } from '../src';

const player = (source: SessionPlayer['source']): SessionPlayer => ({ slot: 1, name: 'Alice', game: 'Timespinner', source });

describe('player yaml', () => {
  test('a preset player writes the game block under the game name', () => {
    const yaml = renderPresetYaml(player({ kind: 'preset', presetId: 'p', overrides: {} }), { death_link: true, goal: 'x' });
    expect(parse(yaml)).toEqual({ name: 'Alice', game: 'Timespinner', description: 'Written by Archipelia', Timespinner: { death_link: true, goal: 'x' } });
  });

  test('an imported file keeps its content and takes the session name', () => {
    const source = 'name: Somebody\ngame: Relic of the Past\nRelic of the Past:\n  pre_rolled:\n    world: abc\n';
    const out: unknown = parse(renderImportedYaml(player({ kind: 'yaml', fileName: 'r.yaml', yaml: source }), source));
    expect(out).toMatchObject({ name: 'Alice', 'Relic of the Past': { pre_rolled: { world: 'abc' } } });
  });

  test('an imported file with two players is refused', () => {
    const source = 'name: A\ngame: X\n---\nname: B\ngame: Y\n';
    expect(() => renderImportedYaml(player({ kind: 'yaml', fileName: 'r.yaml', yaml: source }), source)).toThrow(/exactly one player/);
  });

  test('gameOfYaml reads the game field', () => {
    expect(gameOfYaml('name: A\ngame: Hollow Knight\n')).toBe('Hollow Knight');
  });
});
