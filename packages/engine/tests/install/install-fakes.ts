/* @layer tests @kind test */
import { vi } from 'vitest';
import type { EngineSpec } from '../../src';
import type { CarryResult, EngineChoice, EngineRuntime, InstalledEngine, InstalledGame, RecordGuard } from '@archipelia/model';
import type { EngineJob, InstallDeps } from '../../src/install/install-engine.type';
import type { SmokeOutcome } from '../../src/install/smoke/smoke.type';

const pickedChoice: EngineChoice = { ap: '0.6.8', python: '3.12.15', pythonRelease: '20261021' };

const testedChoice: EngineChoice = { ap: '0.6.7', python: '3.12.14', pythonRelease: '20260924' };

const runtimeOf = (id: string): EngineRuntime => ({
  id, apVersion: id === 'old' ? '0.6.7' : '0.6.8', apCommit: 'c0ffee', pythonVersion: '3.12.15', root: `/engines/${id}`,
  python: '', generate: '', multiServer: '', schemaScript: '',
});

const specOf = (id: string): EngineSpec => ({
  id, target: 'win32-x64', ap: { version: '0.6.8', commit: 'c0ffee' },
  python: { version: '3.12.15', release: '20261021', file: 'cpython.tar.gz', sha256: 'abc' }, requirements: { skip: [], extra: [], rules: [] },
});

const gameRecord = (apworld: string, game: string): InstalledGame => ({
  apworld, game, version: '1.0.0', source: 'index', installedAt: 100,
  schema: { game, worldVersion: '1', groups: [], options: [], presets: {} }, sha256: '', verified: false,
  layout: 'apworld', path: `custom_worlds/${apworld}.apworld`, requires: [],
});

const passed = (patch: Partial<SmokeOutcome> = {}): SmokeOutcome => ({ result: { ok: true, at: 1, warnings: [] }, broken: [], ...patch });

const fakeJob = () => {
  const controller = new AbortController();
  const job = {
    signal: controller.signal,
    step: vi.fn(),
    log: vi.fn(),
    skip: vi.fn(),
    done: vi.fn(),
    fail: vi.fn(),
  } satisfies EngineJob;
  return { job, controller };
};

const fakeGuard = (): RecordGuard => ({
  records: [gameRecord('alpha', 'Alpha'), gameRecord('beta', 'Beta')],
  note: vi.fn(() => Promise.resolve()),
  restore: vi.fn(() => Promise.resolve([])),
});

const fakeInstall = () => {
  const { job, controller } = fakeJob();
  const guard = fakeGuard();
  const carry: CarryResult = { copied: ['alpha'], reinstalled: ['beta'], problems: [], at: 5 };
  const deps = {
    job: () => job,
    resolve: vi.fn(() => Promise.resolve({ spec: specOf('new'), warnings: [] })),
    wasBuilt: vi.fn(() => Promise.resolve(false)),
    build: vi.fn(() => Promise.resolve()),
    runtimeOf: vi.fn((id: string) => Promise.resolve(runtimeOf(id))),
    active: vi.fn((): Promise<EngineRuntime | undefined> => Promise.resolve(runtimeOf('old'))),
    guardRecords: vi.fn(() => Promise.resolve(guard)),
    carry: vi.fn((): Promise<CarryResult> => Promise.resolve(carry)),
    smoke: vi.fn((): Promise<SmokeOutcome> => Promise.resolve(passed())),
    stamp: vi.fn(() => Promise.resolve()),
    describe: vi.fn((id: string): Promise<InstalledEngine> => Promise.resolve({
      id, ap: '0.6.8', apCommit: 'c0ffee', python: '3.12.15', pythonRelease: '20261021', target: 'win32-x64', builtAt: 1, state: 'ready',
    })),
    register: vi.fn(() => Promise.resolve()),
    activate: vi.fn(() => Promise.resolve()),
    discard: vi.fn(() => Promise.resolve()),
    fallback: vi.fn(() => Promise.resolve<EngineChoice | undefined>(testedChoice)),
  } satisfies InstallDeps;
  return { deps, job, controller, guard };
};

export { pickedChoice, fakeInstall, passed, runtimeOf, testedChoice };
