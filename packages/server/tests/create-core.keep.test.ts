/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';
import type { SessionTemplate } from '@archipelia/model';
import { DOMAIN } from '@archipelia/model';
import { fakePorts } from './fake-ports';

const hostBinding = vi.hoisted(() => vi.fn((_automation: boolean, lanHost: () => string) => ({ bindHost: '127.0.0.1', advertiseHost: lanHost })));
vi.mock('@archipelia/hosts', async (original) => ({ ...(await original<object>()), hostBinding }));

const { createCore } = await import('../src');

const NOT_SET_UP = /not set up yet/i;

const template: SessionTemplate = {
  id: 't1', name: 'Saturday', players: [], updatedAt: 0, host: { kind: 'local', port: 38281 },
  generator: { spoiler: 3, race: false, progressionBalancing: true },
  server: { hintCost: 10, releaseMode: 'auto', collectMode: 'auto', remainingMode: 'goal', autoShutdownMinutes: 0 },
};

describe('createCore', () => {
  test('wires every service the desktop used to build itself', async () => {
    const { ports } = await fakePorts();
    const core = createCore(ports);
    expect(Object.keys(core).sort()).toEqual([
      'adminToken', 'catalog', 'dispose', 'engine', 'installed', 'lobbies', 'lobbyPasswords', 'presets', 'roomSecret', 'runJobs', 'runs', 'runtime', 'sandbox', 'servers', 'sessionFiles', 'sessions',
      'setLanRoom', 'setLobbyNetworkMode', 'templates', 'watchLobbies',
    ]);
    expect(await core.installed()).toEqual([]);
    expect(await core.presets.list()).toEqual([]);
    expect(await core.servers.list()).toEqual([]);
    expect(await core.runs.list()).toEqual([]);
  });

  test('reads and writes through the domains the port gives', async () => {
    const { ports } = await fakePorts();
    const core = createCore(ports);
    await core.templates.save(template);
    expect((await core.templates.list()).map((entry) => entry.id)).toEqual(['t1']);
    expect(await ports.domain(DOMAIN.sessions).list()).not.toEqual([]);
  });

  test('the engine lives in the folder of the engine domain and starts missing', async () => {
    const { ports } = await fakePorts();
    const core = createCore(ports);
    const status = await core.engine.status();
    expect(status.state).toBe('missing');
    expect(status.dir).toBe(ports.domain(DOMAIN.engine).dir());
  });

  test('an engine install runs as a job on the job port', async () => {
    const { ports, jobs } = await fakePorts();
    const core = createCore(ports);
    const result = await core.engine.install({ ap: '0.6.8', python: '3.12.15', pythonRelease: '20261021' });
    expect(result.outcome).toBe('failed');
    expect(jobs[0]).toBe('start archipelia-engine-setup Installing the engine');
    expect(jobs.some((call) => call.startsWith('fail archipelia-engine-setup'))).toBe(true);
  });

});

describe('createCore jobs and events', () => {
  test('a bad engine choice is refused before any job starts', async () => {
    const { ports, jobs } = await fakePorts();
    const core = createCore(ports);
    await expect(core.engine.install({ ap: '' } as never)).rejects.toThrow('The engine choice is not valid.');
    expect(jobs).toEqual([]);
  });

  test('a session event reaches the emit port and drives the run job', async () => {
    const { ports, events, jobs } = await fakePorts();
    const core = createCore(ports);
    const session = await core.sessions.run(template);
    expect(session.status).toBe('failed');
    expect(session.error).toMatch(NOT_SET_UP);
    expect(events.length).toBeGreaterThan(1);
    expect(events.every((entry) => entry.kind === 'session' && entry.event.type === 'session')).toBe(true);
    expect(jobs[0]).toBe(`start archipelia-run-${session.id} Running Saturday`);
    expect(jobs.some((call) => call.startsWith(`fail archipelia-run-${session.id} `))).toBe(true);
  });

  test('the network port decides the binding', async () => {
    const lanHost = () => '10.0.0.5';
    const { ports } = await fakePorts({ network: { automation: true, lanHost } });
    createCore(ports);
    expect(hostBinding).toHaveBeenLastCalledWith(true, lanHost);
  });

  test('dispose stops the local servers and does not throw', async () => {
    const { ports, logs } = await fakePorts();
    const core = createCore(ports);
    await expect(core.dispose()).resolves.toBeUndefined();
    expect(logs).toEqual([]);
  });
});
