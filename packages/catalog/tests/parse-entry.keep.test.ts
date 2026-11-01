/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { DEFAULT_INDEX } from '../src';
import { parseEntry } from '../src/parse-entry';

const LOCK = { demo: { '1.0.0': 'a'.repeat(64) } };

const parse = (text: string) => parseEntry(DEFAULT_INDEX, 'demo', text, LOCK);

describe('parseEntry', () => {
  test('K1 a world shipped with AP is official and has nothing to download', { tags: ['critical'] }, () => {
    const entry = parse('name = "A Link to the Past"\nsupported = true\n');
    expect(entry?.source).toBe('official');
    expect(entry?.versions).toEqual([]);
  });

  test('K1 default_url fills each version and the lock gives its hash', { tags: ['critical'] }, () => {
    const entry = parse('name = "Demo"\ndefault_url = "https://x/{{version}}/demo.apworld"\n[versions]\n"1.0.0" = {}\n');
    expect(entry?.versions[0]).toMatchObject({ version: '1.0.0', url: 'https://x/1.0.0/demo.apworld', sha256: 'a'.repeat(64) });
  });

  test('K1 a local version resolves inside the index repo', { tags: ['critical'] }, () => {
    const entry = parse('name = "Demo"\n[versions]\n"2.0.0" = { local = "../apworlds/demo-2.0.0.apworld" }\n');
    expect(entry?.versions[0]?.url).toBe('https://raw.githubusercontent.com/dowlle/Archipelago-index/main/apworlds/demo-2.0.0.apworld');
  });

  test('K1 a withdrawn world is left out', { tags: ['critical'] }, () => {
    expect(parse('name = "Gone"\ndisabled = true\n')).toBeUndefined();
  });

  test('K1 the latest fuzz run for a version wins and the display name falls back', { tags: ['critical'] }, () => {
    const entry = parse([
      'name = "Demo"', 'stability = "beta"', '[versions]', '"1.0.0" = { url = "https://x/demo.apworld" }',
      '[[fuzz_results]]', 'version = "1.0.0"', 'verdict = "flaky"', 'fuzzed_at = "2026-01-01"', 'seeds = 10', 'default_rate = 0.2',
      '[[fuzz_results]]', 'version = "1.0.0"', 'verdict = "clean"', 'fuzzed_at = "2026-02-01"', 'seeds = 20', 'default_rate = 0.01',
    ].join('\n'));
    expect(entry?.displayName).toBe('Demo');
    expect(entry?.stability).toBe('beta');
    expect(entry?.versions[0]?.fuzz).toEqual({ verdict: 'clean', fuzzedAt: '2026-02-01', seeds: 20, failRate: 0.01 });
  });

  test('K1 an unknown stability reads as unknown', { tags: ['critical'] }, () => {
    expect(parse('name = "Demo"\nstability = "shiny"\n')?.stability).toBe('unknown');
  });

  test('K1 a home that lists several links reads as its first link and the world is kept', { tags: ['critical'] }, () => {
    const entry = parse('name = "Demo"\nhome = ["https://x/a", "https://x/b"]\n[versions]\n"1.0.0" = { url = "https://x/demo.apworld" }\n');
    expect(entry?.home).toBe('https://x/a');
    expect(entry?.versions).toHaveLength(1);
  });

  test('K1 a home that is neither text nor a list of text is rejected', { tags: ['critical'] }, () => {
    expect(() => parse('name = "Demo"\nhome = 3\n')).toThrow(/expected shape/);
  });

  test('K1 a file without a name is rejected', { tags: ['critical'] }, () => {
    expect(() => parse('home = "https://x"\n')).toThrow(/expected shape/);
  });
});
