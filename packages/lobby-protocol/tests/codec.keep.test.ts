/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import {
  CLIENT_SCHEMAS,
  DEFAULT_LIMITS,
  ERROR_CODE_LIST,
  ERROR_RULES,
  LOBBY_INFO_MAX_REQUEST_BYTES,
  PRE_WELCOME_MAX_MESSAGE_BYTES,
  SERVER_SCHEMAS,
  closeCodeOf,
  createError,
  decodeMessage,
  encodeMessage,
  lobbyNotFoundFailure,
  rateLimitedFailure,
  validateMessage,
} from '../src';
import type { ErrorCode } from '../src';
import { SCENARIO_CATALOG, loadScenario } from '../src/testing';
import type { Scenario } from '../src/testing';
import { resolvePlaceholders } from '../src/testing/scenario/resolve-placeholders';
import { sampleOf } from '../src/testing/scenario/sample-of';

const SPEC_TABLE: Record<ErrorCode, [before: boolean, after: boolean, close: number | null]> = {
  'bad-message': [true, false, 4400],
  'protocol-unsupported': [true, true, 4401],
  'metadata-missing': [true, true, 4400],
  'lobby-not-found': [true, true, 4404],
  'lobby-closed': [true, true, 4410],
  'lobby-locked': [true, false, 4410],
  'lobby-full': [true, true, 4410],
  'version-mismatch': [true, false, 4409],
  'world-version-conflict': [true, false, 4409],
  'trust-failed': [true, true, 4403],
  'client-revoked': [true, true, 4403],
  'unlisted-not-allowed': [true, true, 4403],
  refused: [true, true, 4403],
  'resume-invalid': [true, true, 4403],
  'resume-replaced': [true, true, 4412],
  'slot-name-taken': [false, false, null],
  'upload-unexpected': [false, false, null],
  'upload-too-large': [false, false, null],
  'upload-hash-mismatch': [false, false, null],
  'yaml-invalid': [false, false, null],
  'world-invalid': [false, false, null],
  'consent-refused': [false, false, null],
  'rate-limited': [true, true, 4429],
  internal: [false, false, null],
};

const errorLines = (scenario: Scenario) =>
  scenario.lines.flatMap((line) => (line.dir === 's2c' && line.msg.type === 'error' ? [line.msg] : []));

const hello = (): string => {
  const line = loadScenario('open-join').lines.find((candidate) => candidate.dir === 'c2s');
  if (!line || !('msg' in line)) throw new Error('no hello in the fixture');
  return JSON.stringify(resolvePlaceholders(line.msg, sampleOf));
};

describe('error codes', () => {
  test('the table matches every row of the spec', () => {
    expect(Object.keys(SPEC_TABLE).sort()).toEqual([...ERROR_CODE_LIST].sort());
    for (const code of ERROR_CODE_LIST as ErrorCode[]) {
      const [before, after, close] = SPEC_TABLE[code];
      expect(createError({ code, message: 'm' }, { welcomed: false }).fatal, `${code} before`).toBe(before);
      expect(createError({ code, message: 'm' }, { welcomed: true }).fatal, `${code} after`).toBe(after);
      expect(ERROR_RULES[code].close, `${code} close`).toBe(close);
    }
  });

  test('a fatal error closes with its code and a non fatal one does not close', () => {
    const fatal = createError({ code: 'lobby-locked', message: 'm' }, { welcomed: false });
    const soft = createError({ code: 'lobby-locked', message: 'm' }, { welcomed: true });
    expect(closeCodeOf(fatal)).toBe(4410);
    expect(closeCodeOf(soft)).toBeNull();
  });

  test('optional fields travel and re is copied', () => {
    const error = createError(
      { code: 'rate-limited', message: 'm', retryAfter: 30, field: 'f', slot: 's', supported: [1], lobbyAp: '0.6.8' },
      { welcomed: false, re: 4 },
    );
    expect(error).toMatchObject({ re: 4, retryAfter: 30, field: 'f', slot: 's', supported: [1], lobbyAp: '0.6.8' });
    expect(validateMessage('s2c', error)).toEqual([]);
  });

  test('every error code is used by a fixture with the right fatal flag and close code', () => {
    const seen = new Set<string>();
    for (const scenario of SCENARIO_CATALOG.map((entry) => loadScenario(entry.name))) {
      scenario.lines.forEach((line, index) => {
        if (line.dir !== 's2c' || line.msg.type !== 'error') return;
        const code = line.msg.code as ErrorCode;
        seen.add(code);
        const [before, after] = SPEC_TABLE[code];
        expect([before, after], `${scenario.name} line ${index + 1}`).toContain(line.msg.fatal);
        const next = scenario.lines[index + 1];
        if (line.msg.fatal === true) expect(next, scenario.name).toMatchObject({ dir: 'close', code: ERROR_RULES[code].close });
      });
    }
    expect([...seen].sort()).toEqual([...ERROR_CODE_LIST].sort());
  });

  test('the standard texts in the fixtures match the helpers', () => {
    expect(errorLines(loadScenario('lobby-info-unknown-code'))[0]?.message).toBe(lobbyNotFoundFailure().message);
    expect(rateLimitedFailure(60).message).toBe('Too many attempts from this address. Try again in 60 seconds.');
  });
});

describe('decoding', () => {
  const opts = { direction: 'c2s' as const, maxBytes: PRE_WELCOME_MAX_MESSAGE_BYTES };

  test('a valid hello decodes', () => {
    const outcome = decodeMessage(hello(), opts);
    expect(outcome).toMatchObject({ ok: true, known: true });
  });

  test('text that is not JSON is a bad message', () => {
    const outcome = decodeMessage('nope', opts);
    expect(outcome).toMatchObject({ ok: false, failure: { code: 'bad-message', message: 'The message is not a JSON object.' } });
  });

  test('a JSON array is a bad message', () => {
    expect(decodeMessage('[1]', opts).ok).toBe(false);
  });

  test('an unknown client type is a bad message that names the type', () => {
    const outcome = decodeMessage('{"type":"dance","seq":5}', opts);
    expect(outcome).toMatchObject({ ok: false, failure: { code: 'bad-message', field: 'type', message: 'The type dance is not known.' } });
  });

  test('an unknown server type is passed through for the client to ignore', () => {
    const outcome = decodeMessage('{"type":"future.thing"}', { direction: 's2c', maxBytes: 1000 });
    expect(outcome).toMatchObject({ ok: true, known: false });
  });

  test('a hello with a missing field gets metadata-missing and the field name', () => {
    const text = JSON.stringify({ ...JSON.parse(hello()) as object, client: { id: 'abc', name: 'N', platform: { os: 'linux', arch: 'x64' } } });
    const outcome = decodeMessage(text, opts);
    expect(outcome).toMatchObject({ ok: false, failure: { code: 'metadata-missing', field: 'client.version' } });
  });

  test('another message with a missing field is a bad message', () => {
    const outcome = decodeMessage('{"type":"ready","seq":1}', opts);
    expect(outcome).toMatchObject({ ok: false, failure: { code: 'bad-message', field: 'ready' } });
  });

  test('a message over the limit is refused before it is parsed', () => {
    const big = JSON.stringify({ type: 'leave', pad: 'x'.repeat(PRE_WELCOME_MAX_MESSAGE_BYTES) });
    const outcome = decodeMessage(big, opts);
    expect(outcome).toMatchObject({ ok: false, failure: { code: 'bad-message' } });
    expect(decodeMessage(big, { direction: 'c2s', maxBytes: DEFAULT_LIMITS.maxMessageBytes }).ok).toBe(true);
  });

  test('the limit counts bytes, not characters', () => {
    const text = JSON.stringify({ type: 'leave', pad: 'é'.repeat(40) });
    expect(decodeMessage(text, { direction: 'c2s', maxBytes: 80 }).ok).toBe(false);
  });

  test('a lobby.info request over its own limit is refused', () => {
    const base = { type: 'lobby.info', protocol: { name: 'archipelia-lobby', versions: [1] }, lobby: { code: 'K7QM-4XT2' } };
    expect(decodeMessage(JSON.stringify(base), opts).ok).toBe(true);
    const padded = JSON.stringify({ ...base, pad: 'x'.repeat(LOBBY_INFO_MAX_REQUEST_BYTES) });
    expect(decodeMessage(padded, opts)).toMatchObject({
      ok: false,
      failure: { message: 'A lobby.info request is at most 1024 bytes.' },
    });
  });

  test('encoding refuses a message over the limit', () => {
    expect(() => encodeMessage({ type: 'leave' }, 5)).toThrow('limit is 5');
    expect(encodeMessage({ type: 'leave' })).toBe('{"type":"leave"}');
  });

  test('every message type has a schema in its direction', () => {
    expect(Object.keys(CLIENT_SCHEMAS)).toHaveLength(8);
    expect(Object.keys(SERVER_SCHEMAS)).toHaveLength(14);
  });
});
