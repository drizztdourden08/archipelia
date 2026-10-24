/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import {
  checkClientVersion,
  checkWorldRange,
  checkWorldVersion,
  compareApVersions,
  negotiateProtocol,
  parseApVersion,
} from '../src';
import { loadScenario } from '../src/testing';
import type { Scenario } from '../src/testing';

const client = { name: 'Relic of the Past', version: '0.22.0' };

const errorTextOf = (scenario: Scenario): unknown => {
  const line = scenario.lines.find((candidate) => candidate.dir === 's2c' && candidate.msg.type === 'error');
  return line?.dir === 's2c' ? line.msg.message : undefined;
};

describe('the client and the host run the same Archipelago version', () => {
  test('the same version passes', () => {
    expect(checkClientVersion('0.6.8', { client, archipelago: { version: '0.6.8' } })).toBeNull();
  });

  test.each(['0.6.7', '0.6.9', '0.7.0', '1.0.0'])('%s is refused, older or newer alike', (version) => {
    const failure = checkClientVersion('0.6.8', { client, archipelago: { version } });
    expect(failure?.code).toBe('version-mismatch');
  });

  test('the refusal names the lobby version in the text and in a field', () => {
    const failure = checkClientVersion('0.6.9', { client, archipelago: { version: '0.6.8' } });
    expect(failure?.message).toContain('This lobby runs Archipelago 0.6.9.');
    expect(failure?.message).toContain('Relic of the Past 0.22.0 runs Archipelago 0.6.8.');
    expect(failure?.message).toContain('Switch to Archipelago 0.6.9');
    expect(failure?.lobbyAp).toBe('0.6.9');
    expect(failure?.field).toBe('archipelago.version');
  });

  test('a range is not accepted: the version field is a single version', () => {
    const failure = checkClientVersion('0.6.8', { client, archipelago: { version: '0.6.4' } });
    expect(failure).not.toBeNull();
  });

  test('the version-mismatch fixture carries the same sentence the function builds', () => {
    const failure = checkClientVersion('0.6.9', { client, archipelago: { version: '0.6.8' } });
    expect(errorTextOf(loadScenario('version-mismatch'))).toBe(failure?.message);
  });

  test('the world range check still holds the lobby version', () => {
    const world = { game: 'Relic of the Past', worldVersion: '0.1.0' };
    expect(checkWorldRange('0.6.8', { ...world, minimumAp: '0.6.4' })).toBeNull();
    expect(checkWorldRange('0.6.8', { ...world, minimumAp: '0.6.4', maximumAp: '0.6.8' })).toBeNull();
    expect(checkWorldRange('0.6.3', { ...world, minimumAp: '0.6.4' })?.code).toBe('version-mismatch');
    expect(checkWorldRange('0.6.9', { ...world, maximumAp: '0.6.8' }, 'Link')?.slot).toBe('Link');
  });

  test('the world-range-mismatch fixture carries the sentence the function builds', () => {
    const failure = checkWorldRange('0.6.8', { game: 'Relic of the Past', worldVersion: '0.1.0', minimumAp: '0.6.9' });
    expect(errorTextOf(loadScenario('world-range-mismatch'))).toBe(failure?.message);
  });

  test('versions compare by number, not by text', () => {
    expect(compareApVersions('0.6.10', '0.6.9')).toBe(1);
    expect(compareApVersions('0.6.8', '0.6.8')).toBe(0);
    expect(compareApVersions('0.5.99', '0.6.0')).toBe(-1);
    expect(parseApVersion('0.6')).toBeNull();
  });
});

describe('world versions', () => {
  test('the first world fixes the version', () => {
    expect(checkWorldVersion(undefined, 'Relic of the Past', '0.1.0')).toBeNull();
    expect(checkWorldVersion('0.1.0', 'Relic of the Past', '0.1.0')).toBeNull();
    expect(checkWorldVersion('0.2.0', 'Relic of the Past', '0.1.0')?.code).toBe('world-version-conflict');
  });

  test('the world-version-conflict fixture carries the sentence the function builds', () => {
    const failure = checkWorldVersion('0.2.0', 'Relic of the Past', '0.1.0');
    expect(errorTextOf(loadScenario('world-version-conflict'))).toBe(failure?.message);
  });
});

describe('protocol versions', () => {
  test('the highest common major wins', () => {
    expect(negotiateProtocol([3, 1, 2])).toEqual({ ok: true, version: 1 });
  });

  test('no common major names the supported ones', () => {
    const outcome = negotiateProtocol([2]);
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.failure.supported).toEqual([1]);
      expect(errorTextOf(loadScenario('protocol-unsupported'))).toBe(outcome.failure.message);
    }
  });
});
