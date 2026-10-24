/* @layer tests @kind test */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { EngineRuntime } from '@archipelia/model';

const createLocalHost = vi.hoisted(() => vi.fn((options: { bindHost?: string; advertiseHost: string }) => ({ kind: 'local', options })));
vi.mock('../src/local/local-host', () => ({ createLocalHost }));

const { createHostFactory, hostBinding } = await import('../src');

const runtime = {} as EngineRuntime;
const lan = () => '192.168.1.20';

const buildLocal = async (automation: boolean) => {
  const factory = createHostFactory({
    runtime: () => Promise.resolve(runtime),
    secrets: { get: () => Promise.resolve(null), set: () => Promise.resolve() },
    servers: { require: () => Promise.reject(new Error('unused')) },
    ggOwnerSecret: 'owner',
    ...hostBinding(automation, lan),
  });
  await factory({ kind: 'local', port: 38281 });
  return createLocalHost.mock.calls[0]?.[0];
};

describe('host binding', () => {
  beforeEach(() => createLocalHost.mockClear());

  test('an automation launch binds and advertises loopback', async () => {
    const options = await buildLocal(true);
    expect(options?.bindHost).toBe('127.0.0.1');
    expect(options?.advertiseHost).toBe('127.0.0.1');
  });

  test('a normal launch binds every interface and advertises the LAN address', async () => {
    const options = await buildLocal(false);
    expect(options?.bindHost).toBe('0.0.0.0');
    expect(options?.advertiseHost).toBe('192.168.1.20');
  });
});
