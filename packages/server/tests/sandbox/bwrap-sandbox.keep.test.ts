/* @layer tests @kind test */
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { runPython } from '@archipelia/engine';
import type { EngineRuntime } from '@archipelia/model';
import { detectSandbox } from '../../src/sandbox/detect-sandbox';
import { bwrapFeatures } from '../../src/sandbox/bwrap-features';
import { findTool } from '../../src/sandbox/find-tool';
import { noSandbox } from '../../src/sandbox/no-sandbox';
import { probeBwrap } from '../../src/sandbox/probe-bwrap';

const PYTHON = '/usr/bin/python3';

const WORLD = [
  'import json, socket, sys',
  'secret, escape, port, ok = sys.argv[1:5]',
  'def attempt(action):',
  '    try:',
  '        action()',
  '        return "done"',
  '    except OSError:',
  '        return "blocked"',
  'def write(path, text):',
  '    with open(path, "w") as handle:',
  '        handle.write(text)',
  'def read(path):',
  '    with open(path) as handle:',
  '        return handle.read()',
  'report = {',
  '    "readSecret": attempt(lambda: read(secret)),',
  '    "readSystem": attempt(lambda: read("/etc/passwd")),',
  '    "writeSystem": attempt(lambda: write("/usr/escape.txt", "escaped")),',
  '    "localSocket": attempt(lambda: socket.create_connection(("127.0.0.1", int(port)), timeout=3)),',
  '    "remoteSocket": attempt(lambda: socket.create_connection(("1.1.1.1", 53), timeout=3)),',
  '}',
  'attempt(lambda: write(escape, "escaped"))',
  'report["writeRun"] = attempt(lambda: write(ok, "ok"))',
  'print(json.dumps(report))',
].join('\n');

const runner = process.platform === 'linux'
  ? await detectSandbox({ platform: 'linux', find: () => findTool('bwrap'), features: bwrapFeatures, problem: probeBwrap })
  : noSandbox('not Linux');

const runtimeOf = (root: string): EngineRuntime => ({
  id: 'system', apVersion: '0', apCommit: 'none', pythonVersion: '3', root, python: PYTHON, generate: '', multiServer: '', schemaScript: '',
});

let work = '';

beforeEach(async () => {
  work = await mkdtemp(join(tmpdir(), 'archipelia-bwrap-'));
});

afterEach(async () => {
  await rm(work, { recursive: true, force: true });
});

describe.runIf(runner.mode === 'bwrap' && existsSync(PYTHON))('a real bubblewrap sandbox on Linux (skipped without bwrap; CI runs it once Brock 0.87 workflows: { testEnv: { linuxPackages: ["bubblewrap"], userNamespaces: true } } is on)', () => {
  test('a world cannot read or write outside its overlay and run folder, nor open a socket', async () => {
    const overlay = join(work, 'overlay');
    const run = join(work, 'run');
    await mkdir(overlay, { recursive: true });
    await mkdir(run, { recursive: true });
    await writeFile(join(overlay, 'world.py'), WORLD);
    await writeFile(join(work, 'secret.txt'), 'host secret');
    const server = createServer((socket) => socket.end());
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address() as AddressInfo;
    const wrap = runner.confine({ readOnly: [], readWrite: [overlay, run] });
    const args = [join(overlay, 'world.py'), join(work, 'secret.txt'), join(work, 'escape.txt'), String(port), join(run, 'ok.txt')];
    const result = await runPython(runtimeOf(work), { args, cwd: overlay, wrap }).finally(() => server.close());
    expect(result.code).toBe(0);
    expect(JSON.parse(result.lines.at(-1) ?? '{}')).toEqual({
      readSecret: 'blocked', readSystem: 'blocked', writeSystem: 'blocked', localSocket: 'blocked', remoteSocket: 'blocked', writeRun: 'done',
    });
    expect(existsSync(join(work, 'escape.txt'))).toBe(false);
    expect(await readFile(join(run, 'ok.txt'), 'utf8')).toBe('ok');
  }, 30000);
});
