/* @layer tests @kind test */
import nock from 'nock';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { loadTrustedRoot } from '../src/verify/load-trusted-root';
import { verifyWorld } from '../src/verify/verify-world';
import type { RegistryClient } from '../src/registry/registry.type';
import { makeApworld } from './make-apworld';
import { memoryFiles } from './memory-files';
import type { Identity, MintedSigstore } from './mint.type';
import { mintSigstore } from './mint-sigstore';
import { rotpClient } from './rotp-client';
import { statementOf } from './statement-of';

const IDENTITY: Identity = {
  repo: 'drizztdourden08/relic-of-the-past',
  workflow: '.github/workflows/release.yml',
  ref: 'refs/heads/main',
};

const GAME = 'Relic of the Past';

let sigstore: MintedSigstore;
let bytes: Uint8Array;
let bundle: unknown;
let client: RegistryClient;

const withTrust = (patch: Partial<RegistryClient['trust']>): RegistryClient => ({ ...client, trust: { ...client.trust, ...patch } });

const failure = (verdict: ReturnType<typeof verifyWorld>) => (verdict.ok ? null : { code: verdict.code, reason: verdict.reason });

beforeAll(async () => {
  sigstore = await mintSigstore();
  bytes = makeApworld(GAME);
  bundle = await sigstore.attest(statementOf(bytes), IDENTITY);
  client = rotpClient();
});

afterAll(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

describe('verifyWorld with a valid attestation', () => {
  test('accepts the bytes, names the signer and the game', () => {
    const verdict = verifyWorld(bytes, bundle, client, sigstore.trustedRoot);
    expect(verdict).toMatchObject({
      ok: true,
      game: GAME,
      signer: { repo: IDENTITY.repo, workflow: IDENTITY.workflow, ref: IDENTITY.ref },
    });
  });

  test('accepts any ref the registry lists', async () => {
    const master = await sigstore.attest(statementOf(bytes), { ...IDENTITY, ref: 'refs/heads/master' });
    expect(verifyWorld(bytes, master, client, sigstore.trustedRoot).ok).toBe(true);
  });

  test('works offline from a cached trusted root', async () => {
    const files = memoryFiles();
    await loadTrustedRoot({ files, fetchRoot: () => Promise.resolve(sigstore.trustedRoot) });
    const offline = await loadTrustedRoot(
      { files, fetchRoot: () => Promise.reject(new Error('offline')), now: () => Date.now() + 3 * 24 * 3_600_000 },
    );
    expect(offline.source).toBe('cache');
    expect(verifyWorld(bytes, bundle, client, offline.root).ok).toBe(true);
  });
});

describe('verifyWorld refuses the identity', () => {
  test('changed bytes', () => {
    const changed = bytes.slice();
    changed[changed.length - 1] = (changed[changed.length - 1] ?? 0) ^ 1;
    expect(failure(verifyWorld(changed, bundle, client, sigstore.trustedRoot))).toEqual({ code: 'trust-failed', reason: 'digest-mismatch' });
  });

  test('another repo in the registry entry', () => {
    const wrong = withTrust({ repo: 'someone/else' });
    expect(failure(verifyWorld(bytes, bundle, wrong, sigstore.trustedRoot))).toEqual({ code: 'trust-failed', reason: 'signer-mismatch' });
  });

  test('a bundle signed by another repo', async () => {
    const impostor = await sigstore.attest(statementOf(bytes), { ...IDENTITY, repo: 'someone/else' });
    expect(failure(verifyWorld(bytes, impostor, client, sigstore.trustedRoot))).toEqual({ code: 'trust-failed', reason: 'signer-mismatch' });
  });

  test('another workflow in the registry entry', () => {
    const wrong = withTrust({ workflow: '.github/workflows/other.yml' });
    expect(failure(verifyWorld(bytes, bundle, wrong, sigstore.trustedRoot))).toEqual({ code: 'trust-failed', reason: 'signer-mismatch' });
  });

  test('a bundle signed by another workflow', async () => {
    const other = await sigstore.attest(statementOf(bytes), { ...IDENTITY, workflow: '.github/workflows/ci.yml' });
    expect(failure(verifyWorld(bytes, other, client, sigstore.trustedRoot))).toEqual({ code: 'trust-failed', reason: 'signer-mismatch' });
  });

  test('a ref the registry does not list', async () => {
    const branch = await sigstore.attest(statementOf(bytes), { ...IDENTITY, ref: 'refs/heads/feature' });
    expect(failure(verifyWorld(bytes, branch, client, sigstore.trustedRoot))).toEqual({ code: 'trust-failed', reason: 'signer-mismatch' });
  });

  test('another issuer in the registry entry', () => {
    const wrong = withTrust({ issuer: 'https://accounts.example.com' });
    expect(failure(verifyWorld(bytes, bundle, wrong, sigstore.trustedRoot))).toEqual({ code: 'trust-failed', reason: 'signer-mismatch' });
  });

});

describe('verifyWorld refuses the proof', () => {
  test('a revoked client, with the code the protocol names', () => {
    const revoked: RegistryClient = { ...client, status: 'revoked' };
    expect(failure(verifyWorld(bytes, bundle, revoked, sigstore.trustedRoot))).toEqual({ code: 'client-revoked', reason: 'revoked' });
  });

  test('a certificate authority that expired before the signing', () => {
    expect(failure(verifyWorld(bytes, bundle, client, sigstore.expiredRoot))).toEqual({ code: 'trust-failed', reason: 'chain-invalid' });
  });

  test('a trusted root that does not hold the signing authority', () => {
    const root = { ...sigstore.trustedRoot, certificateAuthorities: [] };
    expect(failure(verifyWorld(bytes, bundle, client, root))).toEqual({ code: 'trust-failed', reason: 'chain-invalid' });
  });

  test('a trusted root that does not hold the transparency log', () => {
    const root = { ...sigstore.trustedRoot, tlogs: [] };
    expect(failure(verifyWorld(bytes, bundle, client, root))).toEqual({ code: 'trust-failed', reason: 'chain-invalid' });
  });

  test('a bundle whose signature was changed', () => {
    const copy = structuredClone(bundle) as { dsseEnvelope: { signatures: { sig: string }[] } };
    const [first] = copy.dsseEnvelope.signatures;
    if (first) first.sig = Buffer.alloc(70, 7).toString('base64');
    expect(failure(verifyWorld(bytes, copy, client, sigstore.trustedRoot))?.code).toBe('trust-failed');
  });

  test('a predicate that is not SLSA provenance', async () => {
    const other = await sigstore.attest(statementOf(bytes, 'https://example.com/predicate'), IDENTITY);
    expect(failure(verifyWorld(bytes, other, client, sigstore.trustedRoot))).toEqual({ code: 'trust-failed', reason: 'predicate-mismatch' });
  });

  test('a game the client is not listed for', async () => {
    const stray = makeApworld('Some Other Game');
    const signed = await sigstore.attest(statementOf(stray), IDENTITY);
    expect(failure(verifyWorld(stray, signed, client, sigstore.trustedRoot))).toEqual({ code: 'trust-failed', reason: 'game-mismatch' });
  });

  test('signed bytes that are not an apworld', async () => {
    const junk = new TextEncoder().encode('not a zip');
    const signed = await sigstore.attest(statementOf(junk), IDENTITY);
    expect(failure(verifyWorld(junk, signed, client, sigstore.trustedRoot))).toEqual({ code: 'trust-failed', reason: 'world-unreadable' });
  });

  test('something that is not a bundle', () => {
    expect(failure(verifyWorld(bytes, { hello: 'world' }, client, sigstore.trustedRoot))).toEqual({ code: 'trust-failed', reason: 'bundle-invalid' });
    expect(failure(verifyWorld(bytes, null, client, sigstore.trustedRoot))).toEqual({ code: 'trust-failed', reason: 'bundle-invalid' });
  });
});
