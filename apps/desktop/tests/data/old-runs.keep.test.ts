/* @layer tests @kind test */
import { expect, test } from 'vitest';
import type { Session } from '@archipelia/model';
import { olderThan } from '../../src/views/OldRuns/behavior/old-runs';

const DAY = 24 * 60 * 60 * 1000;
const run = (id: string, status: Session['status'], ageDays: number): Session =>
  ({ id, status, createdAt: 100 * DAY - ageDays * DAY } as Session);

test('only finished runs older than the limit are stale', () => {
  const runs = [run('a', 'stopped', 40), run('b', 'failed', 31), run('c', 'hosting', 90), run('d', 'stopped', 5)];
  expect(olderThan(runs, 30, 100 * DAY).map((r) => r.id)).toEqual(['a', 'b']);
});
