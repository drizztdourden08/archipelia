/* @layer tests @kind test */
import type { DataFiles, EngineRuntime, Session, SessionTemplate } from '@archipelia/model';
import type { LobbyRun } from '@archipelia/sessions';
import type { Registry } from '@archipelia/trust';
import type { LobbyServiceDeps, LobbyStore, LobbyTrust } from '../../src/lobby/lobby-service.type';
import { noSandbox } from '../../src/sandbox/no-sandbox';
import type { SandboxRunner } from '../../src/sandbox/sandbox.type';

const SIGNER = { identity: 'test', repo: 'r', workflow: 'w', ref: 'main' };

const registryOf = (status: 'active' | 'revoked'): Registry => ({
  format: 1,
  games: [],
  clients: [{
    id: 'relic-of-the-past', name: 'Relic of the Past', homepage: 'https://github.com/drizztdourden08/relic-of-the-past', games: ['Relic of the Past'], status,
    trust: { method: 'github-attestation', repo: 'drizztdourden08/relic-of-the-past', workflow: '.github/workflows/release.yml', refs: ['refs/heads/main'], issuer: 'https://token.actions.githubusercontent.com' },
  }],
});

const fakeTrust = (status: 'active' | 'revoked', proofFails = false, world?: () => Promise<void>): LobbyTrust => ({
  registry: () => Promise.resolve(registryOf(status)),
  verifyProof: () => Promise.resolve(proofFails ? { ok: false, code: 'trust-failed', reason: 'chain-invalid', detail: 'test' } : { ok: true, signer: SIGNER }),
  verifyWorld: async () => {
    await world?.();
    return { ok: true, sha256: '', game: 'Relic of the Past', signer: SIGNER };
  },
});

const runtimeOf = (root: string): EngineRuntime => ({
  id: 'test', apVersion: '0.6.8', apCommit: 'test', pythonVersion: '3.12.0', root, python: `${root}/python/bin/python3`, generate: 'Generate.py', multiServer: 'MultiServer.py', schemaScript: 'schema.py',
});

type TestDepsInput = {
  store: LobbyStore;
  output: DataFiles;
  root: string;
  trust: LobbyTrust;
  run: (template: SessionTemplate, lobby: LobbyRun) => Promise<Session>;
  sandbox?: SandboxRunner;
};

const testDeps = ({ store, output, root, trust, run, sandbox = noSandbox('test') }: TestDepsInput): LobbyServiceDeps => {
  const secrets = new Map<string, string>();
  return {
    store,
    trust,
    runner: { run, stop: () => Promise.resolve(), running: () => true, runtimeFor: () => Promise.resolve(runtimeOf(root)), output },
    overlay: ({ runtime }) => Promise.resolve(runtime),
    sandbox: () => Promise.resolve(sandbox),
    secrets: { get: (key) => Promise.resolve(secrets.get(key) ?? null), set: (key, value) => Promise.resolve(void secrets.set(key, value)) },
    activeEngine: () => Promise.resolve(undefined),
    serverVersion: '0.9.0',
    log: () => undefined,
    emit: () => undefined,
    newCode: () => 'K7QM4XT2',
  };
};

export { fakeTrust, testDeps };
