/* @layer core @kind logic */
import type { Endpoint } from '@archipelia/model';
import { basename } from 'node:path';
import type { RemoteHostOptions, SshSession } from './remote.type';
import type { HostProbe } from './host-probe.type';
import type { HostStart, SessionHost } from '../session-host.type';
import { connectSsh } from './connect-ssh';
import { createRedactingHub } from '../gg-host/redacting-hub';
import type { Run } from './remote-host.type';
import { consoleScript } from './console-script';
import { launchScript } from './launch-script';
import { prepareScript } from './prepare-script';
import { stopScript } from './stop-script';
import { tailScript } from './tail-script';
import { serverArgs } from '../local/server-args';
import { waitForHosting } from './hosting-wait';
import { parseProbe } from './parse-probe';
import { probeScript } from './probe-script';
import { remoteLayout } from './remote-layout';
import { settingsYaml } from './session-settings';
import { shellQuote } from './shell-quote';

const mustExec = async (ssh: SshSession, script: string, what: string) => {
  const { code, stdout, stderr } = await ssh.exec(script);
  if (code !== 0) throw new Error(`${what} failed (exit ${code}): ${(stderr || stdout).trim()}`);
  return stdout;
};

const assertLaunchable = ({ python, multiServer, apPath }: HostProbe) => {
  if (!python) throw new Error('python3 was not found on the server');
  if (!multiServer) throw new Error(`no MultiServer.py in ${apPath} on the server`);
};

const createRemoteHost = (options: RemoteHostOptions): SessionHost => {
  const { entry, credentials, onHostKey, connect = connectSsh, hostingTimeoutMs = 120000, stopWaitSeconds = 15 } = options;
  const hub = createRedactingHub();
  let session: SshSession | undefined;
  let run: Run | undefined;

  const ensureSession = async () => {
    if (!session?.isOpen()) session = await connect({ entry, credentials, onHostKey });
    return session;
  };

  const halt = async ({ layout, systemd, tail }: Run) => {
    const ssh = await ensureSession();
    const { code } = await ssh.exec(stopScript(layout, stopWaitSeconds, systemd));
    tail?.close();
    if (code !== 0) throw new Error(`the server did not stop (exit ${code})`);
  };

  const launch = async (ssh: SshSession, current: Run, probe: HostProbe, { server }: HostStart) => {
    const since = Date.now();
    const args = serverArgs(server, entry.gamePort, '0.0.0.0');
    await mustExec(ssh, launchScript({ layout: current.layout, python: probe.python, args, systemd: current.systemd }), 'starting MultiServer');
    current.tail = await ssh.stream(tailScript(current.layout), hub.push);
    await waitForHosting(hub, current.tail, hostingTimeoutMs, since);
  };

  const start = async (input: HostStart): Promise<Endpoint> => {
    if (run) throw new Error('this host is already running');
    const ssh = await ensureSession();
    const probe = parseProbe(await mustExec(ssh, probeScript(entry.apPath, entry.gamePort), 'probing the server'));
    assertLaunchable(probe);
    const current: Run = { layout: remoteLayout(probe.apPath, input.sessionId, basename(input.seedFile)), systemd: probe.systemd && probe.linger };
    await mustExec(ssh, prepareScript(current.layout), 'preparing the session folder');
    run = current;
    try {
      await ssh.upload(input.seedFile, current.layout.zip);
      await ssh.writeFile(current.layout.settings, settingsYaml(input.password), 0o600);
      await launch(ssh, current, probe, input);
      return { host: entry.host, port: entry.gamePort };
    } catch (error) {
      await halt(current).catch(() => undefined);
      run = undefined;
      throw error;
    } finally {
      await ssh.exec(`rm -f ${shellQuote(current.layout.settings)}`).catch(() => undefined);
    }
  };

  const command = async (cmd: string) => {
    if (!run) throw new Error('the server is not running');
    await mustExec(await ensureSession(), consoleScript(run.layout, cmd), 'sending the command');
  };

  const stop = async () => {
    const current = run;
    if (!current) return;
    try {
      await halt(current);
    } finally {
      run = undefined;
      session?.end();
      session = undefined;
    }
  };

  return { kind: 'remote', start, command, onLog: hub.subscribe, stop };
};

export { createRemoteHost };
