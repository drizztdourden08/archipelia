/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { SERVER_SCHEMAS, lobbyJoinable, validateMessage } from '../src';
import { loadScenario } from '../src/testing';
import type { Scenario } from '../src/testing';

const messages = (scenario: Scenario, dir: 'c2s' | 's2c') =>
  scenario.lines.flatMap((line) => (line.dir === dir && 'msg' in line ? [line.msg] : []));

describe('K4 lobby.info before any join', { tags: ['standard'] }, () => {
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

describe('K1 lobby.info errors and limits', { tags: ['critical'] }, () => {
  test('a locked lobby or a lobby with a full house is not joinable', () => {
    expect(lobbyJoinable('locked', false)).toBe(false);
    expect(lobbyJoinable('open', true)).toBe(false);
    expect(lobbyJoinable('open', false)).toBe(true);
  });

  test('a request needs a code and a protocol offer', () => {
    expect(validateMessage('c2s', { type: 'lobby.info', lobby: { code: 'K7QM-4XT2' } })[0]?.path).toBe('protocol');
    expect(
      validateMessage('c2s', { type: 'lobby.info', protocol: { name: 'archipelia-lobby', versions: [1] }, lobby: {} })[0]?.path,
    ).toBe('lobby.code');
  });
});
