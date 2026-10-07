/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { nextRetry, RECONNECT_DELAYS_MS } from '../src/live-room';

const NOW = 1_000_000;

describe('nextRetry', () => {
  test('waits 2, 5, 10, 30 and 30 seconds over five tries', () => {
    expect(RECONNECT_DELAYS_MS).toEqual([2000, 5000, 10000, 30000, 30000]);
    const waits = [0, 1, 2, 3, 4].map((tried) => (nextRetry(tried, NOW)?.retryAt ?? 0) - NOW);
    expect(waits).toEqual([2000, 5000, 10000, 30000, 30000]);
  });

  test('counts the try it plans out of every try', () => {
    expect(nextRetry(0, NOW)).toEqual({ attempt: 1, attempts: 5, retryAt: NOW + 2000 });
    expect(nextRetry(3, NOW)).toEqual({ attempt: 4, attempts: 5, retryAt: NOW + 30000 });
  });

  test('stops once every try is spent', () => {
    expect(nextRetry(5, NOW)).toBeNull();
    expect(nextRetry(9, NOW)).toBeNull();
  });

  test('follows the delays it is given', () => {
    expect(nextRetry(1, NOW, [100, 200])).toEqual({ attempt: 2, attempts: 2, retryAt: NOW + 200 });
    expect(nextRetry(0, NOW, [])).toBeNull();
  });
});
