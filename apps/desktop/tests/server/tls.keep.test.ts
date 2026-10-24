/* @layer tests @kind test */
import { X509Certificate } from 'node:crypto';
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { DOMAIN } from '@archipelia/model';
import { createNodeDomains } from '@archipelia/server/node';
import { fingerprintOf } from '../../server/tls/fingerprint-of';
import { makeCertificate } from '../../server/tls/make-certificate';
import { resolveTls } from '../../server/tls/resolve-tls';
import { subjectNames } from '../../server/tls/subject-names';
import { TLS_CERT_FILE, TLS_KEY_FILE } from '../../server/tls/tls.constants';
import { freePort } from './support/free-port';
import { runStarted } from './support/run-started';
import { upgradeOverTls } from './support/upgrade-over-tls';
import { writeConfig } from './support/write-config';

const OFF = { key: '', cert: '', selfSigned: false };
const AUTO = { key: '', cert: '', selfSigned: true };

let dir = '';

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'archipelia-tls-'));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
});

const files = () => createNodeDomains(dir).domain(DOMAIN.server);

describe('the server certificate', () => {
  test('is made on the first start, kept on the next and pinned by its SHA-256 fingerprint', async () => {
    const first = await resolveTls(AUTO, files());
    expect(first).toMatchObject({ source: 'generated' });
    expect(first?.fingerprint).toMatch(/^([0-9A-F]{2}:){31}[0-9A-F]{2}$/);
    expect(first?.fingerprint).toBe(fingerprintOf(first?.cert ?? ''));
    const second = await resolveTls(AUTO, files());
    expect(second?.fingerprint).toBe(first?.fingerprint);
    expect(await readFile(files().path(TLS_CERT_FILE), 'utf8')).toBe(first?.cert);
  });

  test('is made again when it is about to expire', async () => {
    const first = await resolveTls(AUTO, files());
    const later = Date.now() + 3640 * 24 * 60 * 60 * 1000;
    const renewed = await resolveTls(AUTO, files(), later);
    expect(renewed?.fingerprint).not.toBe(first?.fingerprint);
  });

  test('keeps its key file for the owner alone', async () => {
    await resolveTls(AUTO, files());
    expect(await readFile(files().path(TLS_KEY_FILE), 'utf8')).toContain('BEGIN PRIVATE KEY');
    if (process.platform !== 'win32') expect((await stat(files().path(TLS_KEY_FILE))).mode & 0o077).toBe(0);
  });

  test('names the host and the loopback address', async () => {
    const made = await makeCertificate(subjectNames());
    const names = new X509Certificate(made.cert).subjectAltName ?? '';
    expect(names).toContain('DNS:localhost');
    expect(names).toContain('IP Address:127.0.0.1');
  });

  test('is the configured pair when both paths are set, and a half pair is refused', async () => {
    const made = await makeCertificate(subjectNames());
    const key = join(dir, 'k.pem');
    const cert = join(dir, 'c.pem');
    await writeFile(key, made.key);
    await writeFile(cert, made.cert);
    expect(await resolveTls({ key, cert, selfSigned: true }, files())).toMatchObject({ source: 'configured', fingerprint: fingerprintOf(made.cert) });
    await expect(resolveTls({ key, cert: '', selfSigned: true }, files())).rejects.toThrow('set together');
  });

  test('is absent when self-signing is off and no pair is configured', async () => {
    expect(await resolveTls(OFF, files())).toBeNull();
  });
});

describe('the started server with a self-signed certificate', () => {
  test('answers a TLS handshake with the fingerprint it printed and upgrades a websocket', async () => {
    const port = await freePort();
    await writeConfig(dir, `port = ${port}\nnetwork = "off"\nloopback = true\npublicLookup = false\n[engine]\nauto = false\n`);
    const server = await runStarted(dir);
    try {
      const seen = await upgradeOverTls(port);
      const printed = server.lines.find((line) => line.includes('SHA-256 fingerprint'));
      expect(printed).toContain(seen.fingerprint);
      expect(seen.status).toContain('101');
      expect(server.lines.join('\n')).toContain(`wss://127.0.0.1:${port}`);
    } finally {
      await server.stop();
    }
  }, 60000);
});
