/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { worldEntry as entry, worldInstalled as installed } from './game-handlers.fixtures';
import { buildRows } from '../../src/views/GameStore/behavior/build-rows';
import { gridSectionsOf } from '../../src/views/GameStore/behavior/grid-sections-of';
import { noReleaseCount } from '../../src/views/GameStore/behavior/no-release-count';
import { sectionsOf } from '../../src/views/GameStore/behavior/sections-of';
import { summaryOf } from '../../src/views/GameStore/behavior/summary-of';

const INDEX = Array.from({ length: 1004 }, (_, at) => entry(`world_${at}`, 'index', ['1.0.0']));
const UNRELEASED = Array.from({ length: 23 }, (_, at) => entry(`soon_${at}`, 'index'));
const BUILT_IN = Array.from({ length: 81 }, (_, at) => entry(`builtin_${at}`, 'official'));
const ENTRIES = [...BUILT_IN, ...INDEX, ...UNRELEASED, entry('rotp', 'first-party', ['0.1.0'])];

const sizes = (tab: Parameters<typeof sectionsOf>[1], rows: ReturnType<typeof buildRows>) => sectionsOf(rows, tab).map((section) => [section.id, section.rows.length]);

describe('games totals', () => {
  const rows = buildRows(ENTRIES, [installed('world_1', '1.0.0'), installed('world_2', '0.9.0')]);

  test('a world with no release is left out of the sections and counted apart, so no entry is lost', () => {
    expect(rows).toHaveLength(BUILT_IN.length + INDEX.length + 1);
    expect(noReleaseCount(ENTRIES)).toBe(UNRELEASED.length);
    expect(rows.length + noReleaseCount(ENTRIES)).toBe(ENTRIES.length);
  });

  test('the sections of the All tab add up to the worlds of the status bar', () => {
    const counts = sectionsOf(rows, 'all').map((section) => section.rows.length);
    expect(counts).toEqual([2, 81, 1, 1002]);
    expect(counts.reduce((sum, count) => sum + count, 0)).toBe(summaryOf(rows, rows.length, '0.6.7', 23).worlds);
  });

  test('the status bar counts the whole library whatever the tab shows', () => {
    const summary = summaryOf(rows, 12, '0.6.7', 23);
    expect(summary).toMatchObject({ worlds: 1086, installed: 2, updates: 1, noRelease: 23, shown: 12, apVersion: '0.6.7' });
  });

  test('each dedicated tab holds its own set under one heading', () => {
    expect(sizes('installed', rows)).toEqual([['installed', 2]]);
    expect(sizes('built-in', rows)).toEqual([['built-in', 81]]);
    expect(sizes('archipelia-ready', rows)).toEqual([['archipelia-ready', 1]]);
    expect(sizes('archipelago-index', rows)).toEqual([['archipelago-index', 1004]]);
    expect(sizes('updates', rows)).toEqual([['updates', 1]]);
  });

  test('an installed index world is under Installed on All and still under Archipelago index on its tab', () => {
    expect(sectionsOf(rows, 'all')[3]?.rows).toHaveLength(1002);
    expect(sectionsOf(rows, 'archipelago-index')[0]?.rows).toHaveLength(1004);
  });

  test('the grid keeps an empty Installed heading on All until a search or filter is on', () => {
    const none = buildRows(ENTRIES, []);
    expect(gridSectionsOf(sectionsOf(none, 'all'), 'all', false).map((section) => section.id)).toEqual(['installed', 'built-in', 'archipelia-ready', 'archipelago-index']);
    expect(gridSectionsOf(sectionsOf(none, 'all'), 'all', true).map((section) => section.id)).toEqual(['built-in', 'archipelia-ready', 'archipelago-index']);
    expect(gridSectionsOf(sectionsOf(none, 'installed'), 'installed', false)).toEqual([]);
  });
});
