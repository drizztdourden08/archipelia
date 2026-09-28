/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { DEFAULT_INDEX } from '../src';
import { parseEntry } from '../src/parse-entry';

const LOCK = { demo: { '1.0.0': 'a'.repeat(64) } };

const parse = (text: string) => parseEntry(DEFAULT_INDEX, 'demo', text, LOCK);

describe('parseEntry', () => {
  test('a world shipped with AP is official and has nothing to download', () => {
    const entry = parse('name = "A Link to the Past"\nsupported = true\n');
    expect(entry?.source).toBe('official');
    expect(entry?.versions).toEqual([]);
  });

  test('default_url fills each version and the lock gives its hash', () => {
    const entry = parse('name = "Demo"\ndefault_url = "https://x/{{version}}/demo.apworld"\n[versions]\n"1.0.0" = {}\n');
    expect(entry?.versions[0]).toMatchObject({ version: '1.0.0', url: 'https://x/1.0.0/demo.apworld', sha256: 'a'.repeat(64) });
  });

  test('a local version resolves inside the index repo', () => {
    const entry = parse('name = "Demo"\n[versions]\n"2.0.0" = { local = "../apworlds/demo-2.0.0.apworld" }\n');
    expect(entry?.versions[0]?.url).toBe('https://raw.githubusercontent.com/dowlle/Archipelago-index/main/apworlds/demo-2.0.0.apworld');
  });

  test('a withdrawn world is left out', () => {
    expect(parse('name = "Gone"\ndisabled = true\n')).toBeUndefined();
  });

  test('the latest fuzz run for a version wins and the display name falls back', () => {
    const entry = parse([
      'name = "Demo"', 'stability = "beta"', '[versions]', '"1.0.0" = { url = "https://x/demo.apworld" }',
      '[[fuzz_results]]', 'version = "1.0.0"', 'verdict = "flaky"', 'fuzzed_at = "2026-01-01"', 'seeds = 10', 'default_rate = 0.2',
      '[[fuzz_results]]', 'version = "1.0.0"', 'verdict = "clean"', 'fuzzed_at = "2026-02-01"', 'seeds = 20', 'default_rate = 0.01',
    ].join('\n'));
    expect(entry?.displayName).toBe('Demo');
    expect(entry?.stability).toBe('beta');
    expect(entry?.versions[0]?.fuzz).toEqual({ verdict: 'clean', fuzzedAt: '2026-02-01', seeds: 20, failRate: 0.01 });
  });

  test('an unknown stability reads as unknown', () => {
    expect(parse('name = "Demo"\nstability = "shiny"\n')?.stability).toBe('unknown');
  });

  test('a file without a name is rejected', () => {
    expect(() => parse('home = "https://x"\n')).toThrow(/expected shape/);
  });
});
