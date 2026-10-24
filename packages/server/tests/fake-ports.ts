/* @layer tests @kind test */
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { vi } from 'vitest';
import type { JobHandle, StartJob } from '@drizztdourden08/brock-core/jobs';
import type { DataEntry } from '@archipelia/model';
import type { CoreDomain, CoreEvent, CorePorts } from '../src';

const memoryDomain = (root: string): CoreDomain => {
  const stored = new Map<string, unknown>();
  const read = <T>(rel: string, fallback: T) => Promise.resolve(stored.has(rel) ? (stored.get(rel) as T) : fallback);
  const write = (rel: string, value: unknown) => { stored.set(rel, value); return Promise.resolve(); };
  return {
    dir: () => root,
    path: (rel = '') => join(root, rel),
    size: () => Promise.resolve(0),
    exists: (rel) => Promise.resolve(stored.has(rel)),
    readJson: read,
    writeJson: write,
    readText: (rel) => read<string | null>(rel, null),
    writeText: write,
    readBytes: (rel) => read<Uint8Array | null>(rel, null),
    writeBytes: write,
    list: (dir = '') => {
      const prefix = dir === '' ? '' : `${dir}/`;
      const inside = [...stored.keys()].filter((name) => name.startsWith(prefix)).map((name) => name.slice(prefix.length));
      const entries = new Map(inside.map((name): [string, DataEntry] => {
        const first = name.split('/')[0] ?? name;
        return [first, { name: first, isDirectory: first !== name }];
      }));
      return Promise.resolve([...entries.values()]);
    },
    remove: (rel) => { stored.delete(rel); return Promise.resolve(); },
  };
};

const fakeJobs = () => {
  const calls: string[] = [];
  const job: StartJob = (id, _steps, options) => {
    calls.push(`start ${id} ${options?.title ?? ''}`);
    const handle: JobHandle = {
      id, signal: new AbortController().signal, started: Promise.resolve(), ended: Promise.resolve('done'),
      step: (step) => calls.push(`step ${step}`),
      progress: () => undefined,
      line: () => undefined,
      log: () => undefined,
      skip: () => undefined,
      setCancellable: () => undefined,
      done: () => calls.push(`done ${id}`),
      fail: (error) => calls.push(`fail ${id} ${(error as Error).message}`),
      run: (work) => work(handle),
    };
    return handle;
  };
  return { calls, job };
};

const fakePorts = async (patch: Partial<CorePorts> = {}) => {
  const root = await mkdtemp(join(tmpdir(), 'archipelia-core-test-'));
  const domains = new Map<string, CoreDomain>();
  const events: CoreEvent[] = [];
  const logs: string[] = [];
  const secrets = new Map<string, string>();
  const jobs = fakeJobs();
  const ports: CorePorts = {
    domain: (id) => {
      const known = domains.get(id) ?? memoryDomain(join(root, id));
      domains.set(id, known);
      return known;
    },
    job: jobs.job,
    emit: (event) => { events.push(event); },
    secrets: {
      get: (name) => Promise.resolve(secrets.get(name) ?? null),
      set: (name, value) => { secrets.set(name, value); return Promise.resolve(); },
    },
    log: (message) => { logs.push(message); },
    network: { automation: false, lanHost: () => '192.168.1.20' },
    environment: { fetch: vi.fn(() => Promise.reject(new Error('offline'))), platform: 'win32', target: 'win32-x64' },
    ...patch,
  };
  return { ports, root, events, logs, jobs: jobs.calls, secrets };
};

export { fakePorts };
