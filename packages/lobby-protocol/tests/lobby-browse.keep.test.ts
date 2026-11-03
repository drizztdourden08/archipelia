/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { LOBBY_INFO_MAX_REQUEST_BYTES, PRE_WELCOME_MAX_MESSAGE_BYTES, decodeMessage, validateMessage } from '../src';
import { SAMPLE_VALUES } from '../src/testing/scenario/sample-values';
import { loadScenario, runScenario } from '../src/testing';

const PROTOCOL_OFFER = { name: 'archipelia-lobby', versions: [1] };
const BROWSE = { type: 'lobby.browse', seq: 1, protocol: PROTOCOL_OFFER };
const LISTED = {
  name: 'Friday seed',
  joinToken: SAMPLE_VALUES.join,
  engine: { ap: '0.6.8' },
  admission: 'host-approval',
  allowUnlisted: false,
  joinable: true,
  seats: { total: 16, free: 12 },
};
const REPLY = {
  type: 'lobby.browse.reply',
  re: 1,
  protocol: { name: 'archipelia-lobby', version: 1 },
  server: { name: 'Archipelia', version: '1.5.0' },
  lobbies: [LISTED],
};
const opts = { direction: 'c2s' as const, maxBytes: PRE_WELCOME_MAX_MESSAGE_BYTES };
const infoWith = (lobby: Record<string, string>) => ({ type: 'lobby.info', protocol: PROTOCOL_OFFER, lobby });

describe('K1 lobby.browse messages', () => {
  test('a browse request and its reply validate', { tags: ['critical'] }, () => {
    expect(validateMessage('c2s', BROWSE)).toEqual([]);
    expect(validateMessage('s2c', REPLY)).toEqual([]);
    expect(validateMessage('s2c', { ...REPLY, lobbies: [] })).toEqual([]);
  });

  test('a listed lobby without its join token is refused', { tags: ['critical'] }, () => {
    const withoutToken = Object.fromEntries(Object.entries(LISTED).filter(([key]) => key !== 'joinToken'));
    expect(validateMessage('s2c', { ...REPLY, lobbies: [withoutToken] })).not.toEqual([]);
  });

  test('a lobby ref takes a code or a join token, never both and never neither', { tags: ['critical'] }, () => {
    expect(validateMessage('c2s', infoWith({ code: 'K7QM-4XT2' }))).toEqual([]);
    expect(validateMessage('c2s', infoWith({ joinToken: SAMPLE_VALUES.join }))).toEqual([]);
    expect(validateMessage('c2s', infoWith({ code: 'K7QM-4XT2', joinToken: SAMPLE_VALUES.join }))).not.toEqual([]);
    expect(validateMessage('c2s', infoWith({}))).not.toEqual([]);
    expect(validateMessage('c2s', infoWith({ joinToken: 'short' }))).not.toEqual([]);
  });

  test('a lobby.browse request over 1024 bytes is refused', { tags: ['critical'] }, () => {
    const padded = JSON.stringify({ ...BROWSE, pad: 'x'.repeat(LOBBY_INFO_MAX_REQUEST_BYTES) });
    expect(decodeMessage(padded, opts)).toMatchObject({
      ok: false,
      failure: { code: 'bad-message', message: 'A lobby.browse request is at most 1024 bytes.' },
    });
  });
});

describe('K2 an older server answers the new requests cleanly', () => {
  test.each(['lobby-browse-old-server', 'join-token-old-server'])('%s plays through', { tags: ['critical'] }, async (name) => {
    const run = await runScenario(loadScenario(name));
    expect({ client: run.client.failure, server: run.server.failure }).toEqual({ client: undefined, server: undefined });
  });
});

describe('K2 browsing and joining by token, fake client against fake server', () => {
  test.each(['lobby-browse', 'lobby-browse-join', 'lobby-browse-hidden'])('%s plays through', { tags: ['critical'] }, async (name) => {
    const run = await runScenario(loadScenario(name));
    expect({ client: run.client.failure, server: run.server.failure }).toEqual({ client: undefined, server: undefined });
  });
});
