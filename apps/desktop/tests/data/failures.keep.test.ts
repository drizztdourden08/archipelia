/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';

const logged = vi.hoisted(() => [] as { channel: string; message: string; level?: string }[]);

vi.mock('@drizztdourden08/brock-react', () => ({
  getAppLog: () => ({ log: (channel: string, message: string, level?: string) => logged.push({ channel, message, level }) }),
}));

const { failWith } = await import('../../src/hooks/fail-with');
const { logFailure } = await import('../../src/hooks/log-failure');

describe('failures', () => {
  test('a failed action throws its plain sentence and logs the raw error', async () => {
    logged.length = 0;
    const work = failWith('Could not load your sessions.', () => Promise.reject(new Error('ENOENT: sessions.json')));
    await expect(work()).rejects.toThrow(/^Could not load your sessions\.$/);
    expect(logged).toEqual([{ channel: 'app', message: 'Could not load your sessions. ENOENT: sessions.json', level: 'error' }]);
  });

  test('a work that succeeds returns its result and logs nothing', async () => {
    logged.length = 0;
    await expect(failWith('Could not save the server.', () => Promise.resolve(3))()).resolves.toBe(3);
    expect(logged).toEqual([]);
  });

  test('a raw text error is logged as is', () => {
    logged.length = 0;
    logFailure('Could not connect to the room.', 'InvalidSlot');
    expect(logged[0]?.message).toBe('Could not connect to the room. InvalidSlot');
  });
});
