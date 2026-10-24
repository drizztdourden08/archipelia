/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import {
  LOBBY_INFO_LIMIT,
  LOBBY_INFO_MAX_REQUEST_BYTES,
  SERVER_SCHEMAS,
  lobbyJoinable,
  negotiateProtocol,
  validateMessage,
} from '../src';
import { loadScenario, runScenario } from '../src/testing';
import type { Scenario } from '../src/testing';

const messages = (scenario: Scenario, dir: 'c2s' | 's2c') =>
  scenario.lines.flatMap((line) => (line.dir === dir && 'msg' in line ? [line.msg] : []));

describe('lobby.info before any join', () => {
  test('the reply names the lobby version, the protocol version and what a client must match', () => {
    const [reply] = messages(loadScenario('lobby-info'), 's2c');
    expect(reply).toMatchObject({
      type: 'lobby.info.reply',
      protocol: { name: 'archipelia-lobby', version: 1 },
      lobby: { engine: { ap: '0.6.8' }, requires: { capabilities: ['slots.yaml'] }, admission: 'host-approval' },
    });
  });

  test('the reply carries no member list and no private state', () => {
    const properties = Object.keys(
      ((SERVER_SCHEMAS['lobby.info.reply'].properties.lobby as { properties: object }).properties),
    ).sort();
    expect(properties).toEqual(['admission', 'allowUnlisted', 'engine', 'joinable', 'name', 'phase', 'requires', 'worlds']);
    for (const name of ['lobby-info', 'lobby-info-locked']) {
      const text = JSON.stringify(messages(loadScenario(name), 's2c'));
      for (const secret of ['members', 'token', 'displayName', 'password', 'client']) {
        expect(text, `${name} leaks ${secret}`).not.toContain(`"${secret}"`);
      }
    }
  });

});

describe('lobby.info errors and limits', () => {
  test('a locked lobby answers and says it is not joinable', () => {
    const [reply] = messages(loadScenario('lobby-info-locked'), 's2c');
    expect(reply).toMatchObject({ lobby: { phase: 'locked', joinable: false } });
    expect(lobbyJoinable('locked', false)).toBe(false);
    expect(lobbyJoinable('open', true)).toBe(false);
    expect(lobbyJoinable('open', false)).toBe(true);
  });

  test('an unknown code gets lobby-not-found and a close with 4404', async () => {
    const scenario = loadScenario('lobby-info-unknown-code');
    const [error] = messages(scenario, 's2c');
    expect(error).toMatchObject({ code: 'lobby-not-found', fatal: true, field: 'lobby.code' });
    expect(scenario.lines.at(-1)).toEqual({ dir: 'close', code: 4404 });
    const run = await runScenario(scenario);
    expect(run.client.ok && run.server.ok).toBe(true);
  });

  test('a closed lobby and an unsupported protocol are errors with their own close codes', () => {
    expect(loadScenario('lobby-info-closed').lines.at(-1)).toEqual({ dir: 'close', code: 4410 });
    const unsupported = loadScenario('lobby-info-protocol-unsupported');
    expect(unsupported.lines.at(-1)).toEqual({ dir: 'close', code: 4401 });
    expect(messages(unsupported, 's2c')[0]?.message).toBe(
      (negotiateProtocol([2, 3]) as { failure: { message: string } }).failure.message,
    );
  });

  test('the request is rate limited after the documented count', () => {
    const scenario = loadScenario('lobby-info-rate-limit');
    const requests = messages(scenario, 'c2s');
    const replies = messages(scenario, 's2c');
    expect(requests).toHaveLength(LOBBY_INFO_LIMIT + 1);
    expect(replies.slice(0, LOBBY_INFO_LIMIT).every((reply) => reply.type === 'lobby.info.reply')).toBe(true);
    expect(replies.at(-1)).toMatchObject({ type: 'error', code: 'rate-limited', fatal: true });
    expect(scenario.lines.at(-1)).toEqual({ dir: 'close', code: 4429 });
  });

  test('the request has a size limit and the oversize fixture breaks it', () => {
    const [request] = messages(loadScenario('lobby-info-oversize'), 'c2s');
    expect(JSON.stringify(request).length).toBeGreaterThan(LOBBY_INFO_MAX_REQUEST_BYTES);
    const [normal] = messages(loadScenario('lobby-info'), 'c2s');
    expect(JSON.stringify(normal).length).toBeLessThan(LOBBY_INFO_MAX_REQUEST_BYTES);
  });

  test('a request needs a code and a protocol offer', () => {
    expect(validateMessage('c2s', { type: 'lobby.info', lobby: { code: 'K7QM-4XT2' } })[0]?.path).toBe('protocol');
    expect(
      validateMessage('c2s', { type: 'lobby.info', protocol: { name: 'archipelia-lobby', versions: [1] }, lobby: {} })[0]?.path,
    ).toBe('lobby.code');
  });

  test('the full RotP exchange starts with lobby.info on the same connection as the hello', () => {
    const lines = messages(loadScenario('approval-join'), 'c2s');
    expect(lines.slice(0, 2).map((line) => line.type)).toEqual(['lobby.info', 'hello']);
    expect(lines.slice(0, 2).map((line) => line.seq)).toEqual([1, 2]);
  });
});
