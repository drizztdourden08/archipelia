/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { PublicLookupFetch } from '../../src/network';
import { createPublicLookup } from '../../src/network';

const answering = (answers: Record<string, string | Error>, asked: string[]): PublicLookupFetch => (url) => {
  asked.push(url);
  const answer = answers[url];
  if (answer instanceof Error || answer === undefined) return Promise.reject(answer ?? new Error('offline'));
  return Promise.resolve({ ok: true, text: () => Promise.resolve(answer) });
};

describe('the public address lookup', () => {
  test('asks ipify first and reports the address it found', async () => {
    const asked: string[] = [];
    const lookup = createPublicLookup({ fetch: answering({ 'https://api.ipify.org': '203.0.113.7' }, asked) });
    expect(lookup.outcome()).toBe('skipped');
    expect(await lookup.lookup()).toBe('203.0.113.7');
    expect(lookup.outcome()).toBe('found');
    expect(asked).toEqual(['https://api.ipify.org']);
  });

  test('falls back to the Amazon echo and trims its answer', async () => {
    const asked: string[] = [];
    const answers = { 'https://api.ipify.org': new Error('timeout'), 'https://checkip.amazonaws.com': '198.51.100.4\n' };
    expect(await createPublicLookup({ fetch: answering(answers, asked) }).lookup()).toBe('198.51.100.4');
    expect(asked).toEqual(['https://api.ipify.org', 'https://checkip.amazonaws.com']);
  });

  test('refuses an answer that is not an IPv4 address and reports the failure', async () => {
    const lookup = createPublicLookup({ fetch: answering({ 'https://api.ipify.org': '<html>', 'https://checkip.amazonaws.com': '999.1.1.1' }, []) });
    expect(await lookup.lookup()).toBeNull();
    expect(lookup.outcome()).toBe('failed');
  });
});
