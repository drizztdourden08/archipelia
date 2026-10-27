/* @layer tests @kind fixture */
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll } from 'vitest';
import type { BuildRun } from '../src/build/build.type';
import { distroOf } from '../src/tool/distro-of';
import type { Probe, ProbeResult, ToolDeps, ToolHost } from '../src/tool/tool.type';

const SIGNED_BY_MICROSOFT = [
  'status=Valid',
  'subject=CN=Microsoft Corporation, O=Microsoft Corporation, L=Redmond, S=Washington, C=US',
  'chain=CN=Microsoft Corporation, O=Microsoft Corporation, L=Redmond, S=Washington, C=US',
  'chain=CN=Microsoft Code Signing PCA 2011, O=Microsoft Corporation, L=Redmond, S=Washington, C=US',
  'chain=CN=Microsoft Root Certificate Authority 2010, DC=com, DC=microsoft',
].join('\n');

const WINGET = 'C:\\Users\\me\\AppData\\Local\\Microsoft\\WindowsApps\\winget.exe';

const WINDOWS_ENV = { LOCALAPPDATA: 'C:\\Users\\me\\AppData\\Local', 'ProgramFiles(x86)': 'C:\\Program Files (x86)', SystemRoot: 'C:\\Windows', USERPROFILE: 'C:\\Users\\me' };

const OS_RELEASE: Record<string, string> = {
  ubuntu: 'NAME="Ubuntu"\nPRETTY_NAME="Ubuntu 24.04 LTS"\nID=ubuntu\nID_LIKE=debian\nVERSION_ID="24.04"',
  mint: 'NAME="Linux Mint"\nID=linuxmint\nID_LIKE="ubuntu debian"',
  fedora: 'NAME="Fedora Linux"\nPRETTY_NAME="Fedora Linux 41"\nID=fedora\nVARIANT_ID=workstation',
  rocky: 'NAME="Rocky Linux"\nID="rocky"\nID_LIKE="rhel centos fedora"',
  arch: 'NAME="Arch Linux"\nID=arch',
  manjaro: 'NAME="Manjaro Linux"\nID=manjaro\nID_LIKE=arch',
  suse: 'NAME="openSUSE Tumbleweed"\nID="opensuse-tumbleweed"\nID_LIKE="opensuse suse"',
  steamos: 'NAME="SteamOS"\nPRETTY_NAME="SteamOS Holo"\nID=steamos\nID_LIKE=arch',
  nixos: 'NAME=NixOS\nID=nixos',
  silverblue: 'NAME="Fedora Linux"\nID=fedora\nVARIANT_ID=silverblue',
  bazzite: 'NAME="Bazzite"\nID=bazzite\nID_LIKE="fedora"\nVARIANT_ID=kinoite',
  gentoo: 'NAME=Gentoo\nID=gentoo',
};

type Hosting = Partial<ToolHost> & { release?: string; ostree?: boolean };

const hostOf = (toolsDir: string, { release, ostree = false, ...patch }: Hosting = {}): ToolHost => {
  const platform = patch.platform ?? 'win32';
  const base: ToolHost = { platform, arch: 'x64', env: platform === 'win32' ? WINDOWS_ENV : { HOME: '/home/me' }, toolsDir };
  const withWinget = platform === 'win32' ? { ...base, winget: WINGET } : base;
  const withDistro = release === undefined ? withWinget : { ...withWinget, distro: distroOf(OS_RELEASE[release] ?? release, ostree) };
  return { ...withDistro, ...patch };
};

const noNetwork: typeof fetch = () => Promise.reject(new Error('no network in this test'));

const answer = (ok: boolean, out = ''): ProbeResult => ({ ok, out });

const probeOf = (answers: Record<string, ProbeResult> = {}) => {
  const calls: { file: string; args: string[]; env: Record<string, string> | undefined }[] = [];
  const probe: Probe = (file, args, env) => {
    calls.push({ file, args, env });
    return Promise.resolve(answers[file] ?? answer(false));
  };
  return { probe, calls };
};

const done = (lines: string[] = [], code = 0): BuildRun => ({ status: 'done', code, lines });

type Setup = {
  host?: Hosting;
  answers?: Record<string, ProbeResult>;
  fetch?: typeof fetch;
  run?: ToolDeps['run'];
  pins?: string[];
};

const registerToolBed = () => {
  const holder = { dir: '', count: 0 };
  beforeAll(async () => {
    holder.dir = await mkdtemp(join(tmpdir(), 'archipelia-tool-'));
  });
  afterAll(() => rm(holder.dir, { recursive: true, force: true }));
  const depsOf = ({ host = {}, answers, fetch: net, run, pins = [] }: Setup = {}) => {
    const { probe, calls } = probeOf(answers);
    const logs: string[] = [];
    const added: string[] = [];
    holder.count += 1;
    const hosting = hostOf(join(holder.dir, `tools-${holder.count}`), host);
    const deps: ToolDeps = {
      fetch: net ?? noNetwork,
      toolsDir: () => Promise.resolve(hosting.toolsDir),
      readHost: () => Promise.resolve(hosting),
      probe,
      run,
      hasTool: (_id, name) => pins.includes(name),
      addTool: (id, name) => {
        added.push(name);
        return Promise.resolve({ buildId: id, tools: [{ name, version: '3.31.6', pin: `${name}==3.31.6` }] } as never);
      },
      log: (message) => logs.push(message),
    };
    return { deps, calls, logs, added, host: hosting };
  };
  return { depsOf, dir: () => holder.dir };
};

export { answer, done, hostOf, OS_RELEASE, probeOf, registerToolBed, SIGNED_BY_MICROSOFT, WINDOWS_ENV, WINGET };
