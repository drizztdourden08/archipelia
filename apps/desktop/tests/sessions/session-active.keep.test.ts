/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { sessionActive } from '../../src/stores/session-active';

describe('session context', () => {
  test('a focused run or a hosting room makes the session context active', () => {
    const runs = [{ id: 'a', status: 'stopped' as const }, { id: 'b', status: 'hosting' as const }];
    expect(sessionActive('a', runs)).toBe(true);
    expect(sessionActive('', runs)).toBe(true);
    expect(sessionActive('', [{ id: 'a', status: 'stopped' as const }])).toBe(false);
    expect(sessionActive('gone', [])).toBe(false);
  });
});
