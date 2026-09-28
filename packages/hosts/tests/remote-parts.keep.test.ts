/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { createHostVerifier, fingerprintSha256, normalizeFingerprint } from '../src';
import { parseProbe } from '../src/remote/parse-probe';
import { HOSTING } from '../src/remote/hosting-wait.constants';
import { createLineSplitter } from '../src/remote/line-splitter';
import { remoteLayout } from '../src/remote/remote-layout';
import { shellQuote } from '../src/remote/shell-quote';
import { authConfig } from '../src/remote/auth-config';

const KEY = Buffer.from('abc');
const KEY_SHA = 'SHA256:ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0';

const answerOf = (verify: (key: Buffer, answer: (valid: boolean) => void) => void, key: Buffer) =>
  new Promise<boolean>((resolve) => verify(key, resolve));

describe('host key pinning', () => {
  test('the fingerprint matches the OpenSSH SHA256 form', () => {
    expect(fingerprintSha256(KEY)).toBe(KEY_SHA);
    expect(normalizeFingerprint('ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0=')).toBe(KEY_SHA);
  });

  test('a pinned key must match', async () => {
    expect(await answerOf(createHostVerifier(KEY_SHA, () => false).verify, KEY)).toBe(true);
    const pin = createHostVerifier(KEY_SHA, () => true);
    expect(await answerOf(pin.verify, Buffer.from('other'))).toBe(false);
    expect(pin.refusal()).toMatch(/host key changed/);
  });

  test('an unpinned key asks, and the answer decides', async () => {
    const seen: string[] = [];
    const accept = createHostVerifier(undefined, (sha) => { seen.push(sha); return Promise.resolve(true); });
    expect(await answerOf(accept.verify, KEY)).toBe(true);
    expect(seen).toEqual([KEY_SHA]);
    const refuse = createHostVerifier(undefined, () => false);
    expect(await answerOf(refuse.verify, KEY)).toBe(false);
    expect(refuse.refusal()).toMatch(/not accepted/);
  });
});

describe('remote parts', () => {
  test('shellQuote leaves plain words and single-quotes the rest', () => {
    expect(shellQuote('/srv/ap/MultiServer.py')).toBe('/srv/ap/MultiServer.py');
    expect(shellQuote("it's")).toBe(`'it'"'"'s'`);
    expect(shellQuote('$HOME')).toBe("'$HOME'");
  });

  test('the hosting line gives the port', () => {
    expect('[x]: Hosting game at 0.0.0.0:38281 (Password: ***)'.match(HOSTING)?.[1]).toBe('38281');
  });

  test('the line splitter holds partial lines and split characters', () => {
    const out: string[] = [];
    const push = createLineSplitter((line) => out.push(line));
    const bytes = Buffer.from('one\r\ntwé\n', 'utf8');
    push(bytes.subarray(0, 8));
    push(bytes.subarray(8));
    expect(out).toEqual(['one', 'twé']);
  });

  test('the probe output is parsed by key', () => {
    expect(parseProbe('ap=/a\npython=/usr/bin/python3\npyver=3.12.1\nmultiserver=yes\napver=0.6.7\nsystemd=no\nlinger=\n')).toEqual({
      apPath: '/a', python: '/usr/bin/python3', pythonVersion: '3.12.1', multiServer: true, apVersion: '0.6.7', systemd: false, linger: false, portFree: undefined,
    });
  });

  test('the session folder refuses unsafe ids and relative paths', () => {
    expect(remoteLayout('/srv/ap', 's-1', 'x/AP.zip').zip).toBe('/srv/ap/archipelia/sessions/s-1/AP.zip');
    expect(() => remoteLayout('/srv/ap', '../x', 'AP.zip')).toThrow(/session id/);
    expect(() => remoteLayout('srv/ap', 's-1', 'AP.zip')).toThrow(/absolute/);
  });

  test('auth needs the secret its kind asks for', () => {
    expect(() => authConfig({ kind: 'ssh-key', username: 'u', keyPath: 'k' }, {})).toThrow(/private key/);
    expect(() => authConfig({ kind: 'ssh-password', username: 'u', passwordRef: 'r' }, {})).toThrow(/password/);
    expect(authConfig({ kind: 'ssh-password', username: 'u', passwordRef: 'r' }, { password: 'p' })).toEqual({ username: 'u', password: 'p' });
  });
});
