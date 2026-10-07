/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { LogRow } from '@drizztdourden08/tessera/composites';
import { lastRows } from '../src/compounds/CommandConsole/behavior/last-rows';
import { CONSOLE_ROW_LIMIT } from '../src/compounds/CommandConsole/CommandConsole.constants';

const rowsOf = (count: number): LogRow[] =>
  Array.from({ length: count }, (_, i) => ({ id: `r${i}`, gutter: '', tag: '', kind: 'reply', message: `line ${i}` }));

describe('lastRows', () => {
  test('keeps the last 200 rows by default limit', () => {
    expect(CONSOLE_ROW_LIMIT).toBe(200);
    const shown = lastRows(rowsOf(250), CONSOLE_ROW_LIMIT);
    expect(shown).toHaveLength(200);
    expect(shown[0]?.id).toBe('r50');
    expect(shown.at(-1)?.id).toBe('r249');
  });

  test('gives back the same list when it fits', () => {
    const rows = rowsOf(3);
    expect(lastRows(rows, 3)).toBe(rows);
    expect(lastRows(rows, 10)).toBe(rows);
  });

  test('shows nothing for a limit of zero', () => {
    expect(lastRows(rowsOf(4), 0)).toEqual([]);
  });
});
