/* @layer tests @kind test */
import type { ExecResult, SshSession, StreamHandle } from '../src';

type FakeOptions = { probe?: string; hostingLine?: string; tailEndsEarly?: boolean };

const PROBE = ['ap=/srv/ap', 'python=/srv/ap/.venv/bin/python', 'pyver=3.12.3', 'multiserver=yes', 'apver=0.6.7', 'systemd=yes', 'linger=yes', 'port=free'].join('\n');

const createFakeSsh = ({ probe = PROBE, hostingLine = 'Hosting game at 0.0.0.0:38281 (Password: hunter2)', tailEndsEarly = false }: FakeOptions = {}) => {
  const calls = { exec: [] as string[], uploads: [] as [string, string][], files: [] as { path: string; data: string; mode: number }[], ended: 0, tailClosed: 0 };
  let open = true;

  const exec = (command: string): Promise<ExecResult> => {
    calls.exec.push(command);
    return Promise.resolve({ code: 0, stdout: command.startsWith('AP=') ? probe : '', stderr: '' });
  };

  const stream = (command: string, onLine: (line: string) => void): Promise<StreamHandle> => {
    calls.exec.push(command);
    let finish: (code: number | null) => void = () => {};
    const done = new Promise<number | null>((resolve) => { finish = resolve; });
    setTimeout(() => {
      onLine('Loading multiworld');
      if (tailEndsEarly) finish(0);
      else onLine(hostingLine);
    }, 5);
    return Promise.resolve({ done, close: () => { calls.tailClosed += 1; finish(null); } });
  };

  const session: SshSession = {
    exec,
    stream,
    upload: (localPath, remotePath) => { calls.uploads.push([localPath, remotePath]); return Promise.resolve(); },
    writeFile: (path, data, mode) => { calls.files.push({ path, data, mode }); return Promise.resolve(); },
    isOpen: () => open,
    end: () => { calls.ended += 1; open = false; },
  };

  return { calls, session, connect: () => { open = true; return Promise.resolve(session); } };
};

export { createFakeSsh, PROBE };
