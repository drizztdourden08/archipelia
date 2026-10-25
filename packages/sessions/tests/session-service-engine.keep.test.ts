/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';
import type { EngineRuntime, HostTarget, Session, SessionEngine, SessionTemplate } from '@archipelia/model';
import type { HostBinding, HostLogLine, SessionHost } from '@archipelia/hosts';
import { runtimeOf } from './runtime-of';

const generate = vi.hoisted(() => vi.fn());
vi.mock('@archipelia/engine', async (original) => ({ ...(await original<object>()), generate }));
vi.mock('../src/output/read-output', () => ({ readOutput: () => Promise.resolve({ output: { zip: 'AP.zip', files: [], generateLog: '' }, seed: '1' }) }));
vi.mock('../src/players/write-players', () => ({ writePlayers: () => Promise.resolve() }));

const { createSessionService } = await import('../src/service/session-service');
const { hostSession } = await import('../src/service/host-session');


const templateOf = (host: HostTarget): SessionTemplate => ({
  id: 't', name: 'T', players: [], host, updatedAt: 0,
  generator: { spoiler: 0, race: false, progressionBalancing: true },
  server: { hintCost: 10, releaseMode: 'auto', collectMode: 'auto', remainingMode: 'goal', autoShutdownMinutes: 0 },
});

const sessionOf = (host: HostTarget, engine?: SessionEngine): Session => ({
  id: 's1', snapshot: templateOf(host), status: 'starting', createdAt: 0, engine, output: { zip: 'AP.zip', files: [], generateLog: '' },
});

const fakeHost = (kind: HostTarget['kind']): SessionHost => ({
  kind,
  start: () => Promise.resolve({ host: 'h', port: 1 }),
  command: () => Promise.resolve(),
  onLog: () => () => undefined,
  stop: () => Promise.resolve(),
});

const depsWith = (extra: Record<string, unknown>) => {
  const events: { type: string; line?: HostLogLine; session?: Session }[] = [];
  const hostFor = vi.fn((target: HostTarget, _runtime?: EngineRuntime, _binding?: HostBinding) => Promise.resolve(fakeHost(target.kind)));
  const stored = new Map<string, Session>();
  const deps = {
    files: { path: (rel = '') => `/data/${rel}`, writeText: () => Promise.resolve(), writeJson: () => Promise.resolve() },
    runtime: () => Promise.resolve(runtimeOf('ap-0.6.8', '0.6.8')),
    runs: { put: (session: Session) => { stored.set(session.id, session); return Promise.resolve(); }, get: (id: string) => Promise.resolve(stored.get(id)) },
    hostFor, resolveSecret: () => Promise.resolve(null),
    emit: (event: { type: string }) => events.push(event),
    ...extra,
  };
  return { deps: deps as never, events, hostFor, stored };
};

describe('hostSession engine choice', () => {
  test('a local session is hosted on its own engine when installed', async () => {
    const own = runtimeOf('ap-0.6.6', '0.6.6');
    const { deps, hostFor, events } = depsWith({ runtimeFor: () => Promise.resolve(own) });
    await hostSession({ deps, live: new Map() }, sessionOf({ kind: 'local', port: 38281 }, { id: 'ap-0.6.6', ap: '0.6.6', python: '3.12.14' }));
    expect(hostFor).toHaveBeenCalledWith({ kind: 'local', port: 38281 }, own);
    expect(events).toEqual([]);
  });

  test('an engine that is gone falls back to the active one and warns when older', async () => {
    const { deps, hostFor, events } = depsWith({ runtime: () => Promise.resolve(runtimeOf('ap-0.6.5', '0.6.5')), runtimeFor: () => Promise.resolve(undefined) });
    await hostSession({ deps, live: new Map() }, sessionOf({ kind: 'local', port: 1 }));
    expect(hostFor.mock.calls[0]?.[1]?.id).toBe('ap-0.6.5');
    expect(events).toHaveLength(1);
    expect(events[0]?.line?.text).toMatch(/^Warning: .*Archipelago 0\.6\.7.*older Archipelago 0\.6\.5/);
  });

  test('a lobby room is hosted with the binding of the lobby, and a plain session is not', async () => {
    const binding = { bindHost: '127.0.0.1', advertiseHost: () => '127.0.0.1' };
    const { deps, hostFor } = depsWith({ lobbyBinding: () => binding });
    await hostSession({ deps, live: new Map() }, { ...sessionOf({ kind: 'local', port: 38281 }), lobbyId: 'lb_1' });
    expect(hostFor.mock.calls[0]?.[2]).toBe(binding);
    await hostSession({ deps, live: new Map() }, sessionOf({ kind: 'local', port: 38281 }));
    expect(hostFor.mock.calls[1]).toHaveLength(2);
  });

  test('a remote session warns when the last test showed an older server', async () => {
    const { deps, hostFor, events } = depsWith({ remoteApVersion: () => Promise.resolve('0.6.2') });
    await hostSession({ deps, live: new Map() }, sessionOf({ kind: 'remote', serverId: 'srv' }));
    expect(hostFor).toHaveBeenCalledWith({ kind: 'remote', serverId: 'srv' }, undefined);
    expect(events[0]?.line?.text).toMatch(/^Warning: .*last tested with 0\.6\.2/);
  });

  test('a remote session starts without a warning when the version lookup fails', async () => {
    const { deps, events } = depsWith({ remoteApVersion: () => Promise.reject(new Error('no list')) });
    await hostSession({ deps, live: new Map() }, sessionOf({ kind: 'remote', serverId: 'srv' }));
    expect(events).toEqual([]);
  });
});

describe('session service', () => {
  test('a new session records the engine that generates it', async () => {
    generate.mockResolvedValue({ ok: true, lines: [], zip: 'AP.zip' });
    const { deps, stored } = depsWith({});
    const session = await createSessionService(deps).run(templateOf({ kind: 'local', port: 1 }));
    expect(generate).toHaveBeenCalled();
    const call: unknown = generate.mock.calls[0]?.[0];
    expect(call).toMatchObject({ runtime: { id: 'ap-0.6.8' } });
    expect(stored.get(session.id)?.engine).toEqual({ id: 'ap-0.6.8', ap: '0.6.8', python: '3.12.15' });
  });
});
