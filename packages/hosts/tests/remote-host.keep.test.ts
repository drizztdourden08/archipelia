/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { ServerEntry, ServerSettings } from '@archipelia/model';
import { createRemoteHost, testServer } from '../src';
import type { SessionHost } from '../src';
import { createFakeSsh, PROBE } from './fake-ssh-session';

const server: ServerSettings = { hintCost: 10, releaseMode: 'auto', collectMode: 'auto', remainingMode: 'goal', autoShutdownMinutes: 0 };

const entry: ServerEntry = {
  id: 'srv', label: 'Box', host: 'box.example', port: 22, gamePort: 38281, apPath: '/srv/ap',
  auth: { kind: 'ssh-key', username: 'ap', keyPath: 'k' },
};

const hostWith = (fake: ReturnType<typeof createFakeSsh>) =>
  createRemoteHost({ entry, credentials: { privateKey: Buffer.from('k') }, onHostKey: () => true, connect: fake.connect, hostingTimeoutMs: 500, stopWaitSeconds: 1 });

const start = (host: SessionHost, password?: string) =>
  host.start({ sessionId: 'abc-1', sessionDir: 'C:/local/abc-1', seedFile: 'C:/local/abc-1/AP_9.zip', server, password });

const lines = (host: SessionHost) => {
  const out: string[] = [];
  host.onLog(({ text }) => out.push(text))();
  return out;
};

const dir = '/srv/ap/archipelia/sessions/abc-1';

describe('remote host', () => {
  test('uploads the seed, writes a private host.yaml, launches and waits for the hosting line', async () => {
    const fake = createFakeSsh();
    const host = hostWith(fake);
    const endpoint = await start(host, 'hunter2');
    expect(endpoint).toEqual({ host: 'box.example', port: 38281 });
    expect(fake.calls.uploads).toEqual([['C:/local/abc-1/AP_9.zip', `${dir}/AP_9.zip`]]);
    expect(fake.calls.files).toEqual([{ path: `${dir}/host.yaml`, data: 'server_options:\n  password: "hunter2"\n', mode: 0o600 }]);
    const launch = fake.calls.exec.find((cmd) => cmd.includes('mkfifo')) ?? '';
    expect(launch).toContain('systemd-run --user --collect --quiet --unit=archipelia-abc-1');
    expect(launch).toContain(`/srv/ap/.venv/bin/python -u /srv/ap/MultiServer.py ${dir}/AP_9.zip --host 0.0.0.0 --port 38281`);
    expect(launch).toContain('0<>console >server.log 2>&1');
    expect(fake.calls.exec).toContain(`rm -f ${dir}/host.yaml`);
    expect(fake.calls.exec.some((cmd) => cmd.includes('--password') || cmd.includes('hunter2'))).toBe(false);
    expect(lines(host).join('\n')).toContain('(Password: ***)');
    expect(lines(host).join('\n')).not.toContain('hunter2');
  });

  test('without lingering the server is detached with nohup setsid', async () => {
    const fake = createFakeSsh({ probe: PROBE.replace('linger=yes', 'linger=no') });
    await start(hostWith(fake));
    const launch = fake.calls.exec.find((cmd) => cmd.includes('mkfifo')) ?? '';
    expect(launch).toContain(`nohup setsid sh ${dir}/run.sh >/dev/null 2>&1 </dev/null &`);
    expect(launch).not.toContain('systemd-run');
  });

  test('commands are written into the console fifo, quoted', async () => {
    const fake = createFakeSsh();
    const host = hostWith(fake);
    await start(host);
    await host.command("/say it's $HOME");
    expect(fake.calls.exec.at(-1)).toContain(`timeout 5 sh -c 'printf '"'"'%s\\n'"'"' '"'"'/say it'"'"'"'"'"'"'"'"'s $HOME'"'"' > console'`);
    await expect(host.command('/a\n/b')).rejects.toThrow(/line break/);
  });

  test('stop sends /exit through the console, closes the log stream and the connection', async () => {
    const fake = createFakeSsh();
    const host = hostWith(fake);
    await start(host);
    await host.stop();
    const stop = fake.calls.exec.at(-1) ?? '';
    expect(stop).toContain("printf '\"'\"'/exit\\n'\"'\"' > console");
    expect(stop).toContain('systemctl --user stop archipelia-abc-1');
    expect(fake.calls.tailClosed).toBe(1);
    expect(fake.calls.ended).toBe(1);
    await expect(host.command('/players')).rejects.toThrow(/not running/);
  });

  test('a server that exits before hosting rejects and is cleaned up', async () => {
    const fake = createFakeSsh({ tailEndsEarly: true });
    await expect(start(hostWith(fake))).rejects.toThrow(/exited before hosting/);
    expect(fake.calls.exec.some((cmd) => cmd.includes("'/exit"))).toBe(true);
    expect(fake.calls.exec).toContain(`rm -f ${dir}/host.yaml`);
  });

  test('a missing MultiServer.py stops before anything is uploaded', async () => {
    const fake = createFakeSsh({ probe: PROBE.replace('multiserver=yes', 'multiserver=no') });
    await expect(start(hostWith(fake))).rejects.toThrow(/no MultiServer.py/);
    expect(fake.calls.uploads).toEqual([]);
  });
});

describe('testServer', () => {
  test('reports every check and ignores the advisory linger check for the verdict', async () => {
    const fake = createFakeSsh({ probe: PROBE.replace('linger=yes', 'linger=no') });
    const result = await testServer(entry, {}, { connect: fake.connect });
    expect(result.ok).toBe(true);
    expect(result.checks?.map((check) => [check.name, check.ok])).toEqual([
      ['connect', true], ['python', true], ['multiserver', true], ['ap-version', true], ['game-port', true], ['linger', false],
    ]);
    expect(fake.calls.ended).toBe(1);
  });

  test('an old python, another AP version and a busy port fail the test', async () => {
    const probe = PROBE.replace('pyver=3.12.3', 'pyver=3.10.4').replace('apver=0.6.7', 'apver=0.6.1').replace('port=free', 'port=busy');
    const result = await testServer(entry, {}, { connect: createFakeSsh({ probe }).connect });
    expect(result.ok).toBe(false);
    expect(result.checks?.filter((check) => !check.ok).map((check) => check.name)).toEqual(['python', 'ap-version', 'game-port']);
    expect(result.message).toMatch(/needs 3.11 to 3.13/);
  });

  test('a failed connection is one failed check', async () => {
    const connect = () => Promise.reject(new Error("the server's host key changed"));
    const result = await testServer(entry, {}, { connect });
    expect(result).toMatchObject({ ok: false, message: "the server's host key changed", checks: [{ name: 'connect', ok: false }] });
  });
});
