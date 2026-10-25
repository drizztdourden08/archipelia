/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import type { LobbyServiceDeps } from '../lobby/lobby-service.type';
import { noSandbox } from '../sandbox/no-sandbox';
import type { TestDepsInput } from './testing.type';

const runtimeOf = (root: string): EngineRuntime => ({
  id: 'test', apVersion: '0.6.8', apCommit: 'test', pythonVersion: '3.12.0', root, python: `${root}/python/bin/python3`, generate: 'Generate.py', multiServer: 'MultiServer.py', schemaScript: 'schema.py',
});

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

export { testDeps };
