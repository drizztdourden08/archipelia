/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { TOKEN_LENGTH, checkHello, decodeMessage, formatLobbyCode, normalizeLobbyCode, resumeOutcome } from '../src';
import type { Hello } from '../src';
import { hashToken, newToken, sha256Hex } from '../src/node';
import { loadScenario, runScenario } from '../src/testing';
import type { Scenario } from '../src/testing';

const firstHello = (scenario: Scenario): Hello => {
  const line = scenario.lines.find((candidate) => candidate.dir === 'c2s' && 'msg' in candidate && candidate.msg.type === 'hello');
  if (line?.dir !== 'c2s' || !('msg' in line)) throw new Error('no hello');
  return line.msg as Hello;
};

describe('the member token and its resume path', () => {
  test('a token is 43 URL safe characters and never repeats', () => {
    const tokens = new Set(Array.from({ length: 50 }, () => newToken()));
    expect(tokens.size).toBe(50);
    for (const token of tokens) expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(TOKEN_LENGTH).toBe(43);
  });

  test('the server stores a hash that differs from the token', () => {
    const token = newToken();
    expect(hashToken(token)).toBe(sha256Hex(token));
    expect(hashToken(token)).not.toBe(token);
    expect(hashToken(token)).toMatch(/^[0-9a-f]{64}$/);
  });

  test('a pending member that resumes gets its pending state back, then the approval', async () => {
    const scenario = loadScenario('resume-pending');
    const run = await runScenario(scenario);
    expect(run.client.ok && run.server.ok).toBe(true);
    const resumed = scenario.lines.find((line) => line.dir === 's2c' && line.msg.type === 'welcome' && line.msg.member !== undefined && (line.msg.member as { resumed?: boolean }).resumed === true);
    expect(resumed).toBeDefined();
    expect(JSON.stringify(resumed)).toContain('"admission":"pending"');
  });

  test('outcomes by stored admission', () => {
    expect(resumeOutcome({ admission: 'pending' })).toEqual({ kind: 'welcome', admission: 'pending' });
    expect(resumeOutcome({ admission: 'approved' })).toEqual({ kind: 'welcome', admission: 'approved' });
    expect(resumeOutcome({ admission: 'refused', reason: 'Not in this group' })).toMatchObject({
      kind: 'error',
      failure: { code: 'refused', message: 'The host refused this player. Not in this group' },
    });
    expect(resumeOutcome({ admission: 'removed' })).toMatchObject({ kind: 'error', failure: { code: 'refused' } });
    expect(resumeOutcome(null)).toMatchObject({ kind: 'error', failure: { code: 'resume-invalid', field: 'resume' } });
  });

  test('the fixtures use the texts the outcome builds', () => {
    const invalid = resumeOutcome(null);
    const refused = resumeOutcome({ admission: 'refused', reason: 'Not in this group' });
    const texts = (name: string) =>
      loadScenario(name).lines.flatMap((line) => (line.dir === 's2c' && line.msg.type === 'error' ? [line.msg.message] : []));
    expect(texts('resume-invalid')).toEqual([invalid.kind === 'error' ? invalid.failure.message : '']);
    expect(texts('resume-refused')).toEqual([refused.kind === 'error' ? refused.failure.message : '']);
  });

  test('a resume token of the wrong length is a malformed hello', () => {
    const hello = { ...firstHello(loadScenario('resume-invalid')), resume: 'short' };
    expect(decodeMessage(JSON.stringify(hello), { direction: 'c2s', maxBytes: 65536 })).toMatchObject({
      ok: false,
      failure: { code: 'metadata-missing', field: 'resume' },
    });
  });

  test('a resumed welcome keeps the token and marks resumed', () => {
    const scenario = loadScenario('approval-join');
    const welcomes = scenario.lines.flatMap((line) => (line.dir === 's2c' && line.msg.type === 'welcome' ? [line.msg] : []));
    expect(welcomes).toHaveLength(2);
    const [first, second] = welcomes.map((welcome) => welcome.member as { token: string; resumed?: boolean });
    expect(first?.token).toBe('$token');
    expect(second).toMatchObject({ token: '$token', resumed: true });
  });
});

describe('lobby codes', () => {
  test('a code is normalised from any case, with or without the dash', () => {
    expect(normalizeLobbyCode('k7qm-4xt2')).toBe('K7QM4XT2');
    expect(normalizeLobbyCode('K7QM4XT2')).toBe('K7QM4XT2');
    expect(normalizeLobbyCode(' K7QM-4XT2 ')).toBe('K7QM4XT2');
  });

  test('look alike letters fold to digits as Crockford says', () => {
    expect(normalizeLobbyCode('OOLL-IIO1')).toBe('00111101');
  });

  test('wrong lengths and letters outside the alphabet are refused', () => {
    expect(normalizeLobbyCode('K7QM-4XT')).toBeNull();
    expect(normalizeLobbyCode('K7QM-4XTU')).toBeNull();
    expect(normalizeLobbyCode('K7QM--4XT2')).toBeNull();
  });

  test('a code is shown with a dash after the fourth character', () => {
    expect(formatLobbyCode('k7qm4xt2')).toBe('K7QM-4XT2');
    expect(formatLobbyCode('nope')).toBeNull();
  });
});

describe('hello metadata beyond the schema', () => {
  const base = (): Hello => structuredClone(firstHello(loadScenario('open-join')));

  test('a complete hello passes', () => {
    expect(checkHello(base())).toBeNull();
  });

  test('the slots.yaml capability is required', () => {
    const hello = { ...base(), capabilities: ['worlds.upload'] };
    expect(checkHello(hello)).toMatchObject({ code: 'metadata-missing', field: 'capabilities' });
  });

  test('worlds need the worlds.upload capability', () => {
    const hello = { ...base(), capabilities: ['slots.yaml'] };
    expect(checkHello(hello)).toMatchObject({ code: 'metadata-missing', field: 'worlds' });
    expect(checkHello({ ...hello, worlds: [] })).toBeNull();
  });

  test('each slot game has one world and each world has a slot', () => {
    const hello = base();
    expect(checkHello({ ...hello, worlds: [] })?.message).toContain('No world was sent');
    const world = hello.worlds[0];
    if (!world) throw new Error('no world');
    expect(checkHello({ ...hello, worlds: [world, world] })?.message).toContain('at most one world');
    expect(checkHello({ ...hello, worlds: [world, { ...world, game: 'Other' }] })?.message).toContain('No slot uses');
  });
});
