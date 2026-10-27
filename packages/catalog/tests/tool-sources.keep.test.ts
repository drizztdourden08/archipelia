/* @layer tests @kind test */
import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { downloadInstaller } from '../src/tool/download-installer';
import { prepareBootstrapper } from '../src/tool/prepare-bootstrapper';
import { prepareRustup } from '../src/tool/prepare-rustup';
import { rustupUrlOf } from '../src/tool/rustup-url-of';
import { wingetPathOf } from '../src/tool/winget-path-of';
import { answer, registerToolBed, SIGNED_BY_MICROSOFT } from './tool.fixtures';

type Route = () => Response;

const netOf = (routes: Record<string, Route>) => {
  const seen: { url: string; redirect: string | undefined }[] = [];
  const net = ((input: string | URL | Request, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    seen.push({ url, redirect: init?.redirect });
    const route = routes[url];
    return Promise.resolve(route ? route() : new Response('', { status: 404 }));
  }) as typeof fetch;
  return { net, seen };
};

const bytesOf = (text: string) => new TextEncoder().encode(text);

const sha256Of = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');

const redirect = (to: string): Route => () => new Response(null, { status: 302, headers: { location: to } });

const ok = (body: string | Uint8Array): Route => () => new Response(body);

const HOSTS = ['example.org'] as const;

describe('the path of winget', () => {
  const env = { LOCALAPPDATA: 'C:\\Users\\me\\AppData\\Local' };

  test('is the app alias of the user, when it is there', async () => {
    const checked: string[] = [];
    const found = await wingetPathOf(env, (path) => {
      checked.push(path);
      return Promise.resolve(true);
    });
    expect(found).toBe('C:\\Users\\me\\AppData\\Local\\Microsoft\\WindowsApps\\winget.exe');
    expect(checked).toEqual([found]);
  });

  test('is nothing when the alias is missing', async () => {
    expect(await wingetPathOf(env, () => Promise.resolve(false))).toBeUndefined();
  });

  test.each([
    ['no folder of local data', {}],
    ['a relative folder', { LOCALAPPDATA: 'AppData\\Local' }],
    ['a network folder', { LOCALAPPDATA: '\\\\server\\share\\Local' }],
    ['a root-relative folder', { LOCALAPPDATA: '\\Users\\me' }],
  ])('is not taken from %s', async (_name, bad) => {
    expect(await wingetPathOf(bad, () => Promise.resolve(true))).toBeUndefined();
  });
});

describe('the addresses of the installers', () => {
  test.each([
    ['win32', 'x64', 'https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe'],
    ['win32', 'arm64', 'https://static.rust-lang.org/rustup/dist/aarch64-pc-windows-msvc/rustup-init.exe'],
    ['linux', 'x64', 'https://static.rust-lang.org/rustup/dist/x86_64-unknown-linux-gnu/rustup-init'],
    ['linux', 'arm64', 'https://static.rust-lang.org/rustup/dist/aarch64-unknown-linux-gnu/rustup-init'],
    ['darwin', 'x64', 'https://static.rust-lang.org/rustup/dist/x86_64-apple-darwin/rustup-init'],
    ['darwin', 'arm64', 'https://static.rust-lang.org/rustup/dist/aarch64-apple-darwin/rustup-init'],
  ] as const)('rustup-init on %s %s is one fixed address on static.rust-lang.org', (platform, arch, url) => {
    expect(rustupUrlOf({ platform, arch })).toBe(url);
  });

  test('there is none for a system without a rustup build', () => {
    expect(rustupUrlOf({ platform: 'freebsd', arch: 'x64' })).toBeUndefined();
    expect(rustupUrlOf({ platform: 'win32', arch: 'ia32' })).toBeUndefined();
  });
});

describe('downloading an installer', () => {
  const limits = { url: 'https://example.org/a.exe', hosts: HOSTS, maxBytes: 100 };

  test('reads the body of an allowed address, following no redirect by itself', async () => {
    const { net, seen } = netOf({ 'https://example.org/a.exe': ok('hello') });
    expect(new TextDecoder().decode(await downloadInstaller(net, limits))).toBe('hello');
    expect(seen).toEqual([{ url: 'https://example.org/a.exe', redirect: 'manual' }]);
  });

  test.each([
    ['plain http', 'http://example.org/a.exe'],
    ['another host', 'https://evil.example/a.exe'],
    ['a lookalike host', 'https://example.org.evil.example/a.exe'],
    ['credentials in the address', 'https://user:pass@example.org/a.exe'],
    ['a file address', 'file:///C:/Windows/System32/cmd.exe'],
  ])('refuses %s without asking the network', async (_name, url) => {
    const { net, seen } = netOf({});
    await expect(downloadInstaller(net, { ...limits, url })).rejects.toThrow();
    expect(seen).toEqual([]);
  });

  test('follows a redirect inside the allowed hosts and refuses one that leaves them', async () => {
    const inside = netOf({ 'https://example.org/a.exe': redirect('https://cdn.example.org/b.exe'), 'https://cdn.example.org/b.exe': ok('ok') });
    expect(new TextDecoder().decode(await downloadInstaller(inside.net, limits))).toBe('ok');
    const outside = netOf({ 'https://example.org/a.exe': redirect('https://evil.example/b.exe'), 'https://evil.example/b.exe': ok('bad') });
    await expect(downloadInstaller(outside.net, limits)).rejects.toThrow(/not one Archipelia accepts/);
    expect(outside.seen.map((call) => call.url)).toEqual(['https://example.org/a.exe']);
  });

  test('gives up on a circle of redirects, a bad answer and a body that is too large', async () => {
    const circle = netOf({ 'https://example.org/a.exe': redirect('https://example.org/a.exe') });
    await expect(downloadInstaller(circle.net, limits)).rejects.toThrow(/circle/);
    await expect(downloadInstaller(netOf({}).net, limits)).rejects.toThrow(/could not download/);
    await expect(downloadInstaller(netOf({ 'https://example.org/a.exe': ok('x'.repeat(101)) }).net, limits)).rejects.toThrow(/larger/);
  });

  test('stops reading a body without a length as soon as it passes the limit', async () => {
    let pulled = 0;
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulled += 1;
        controller.enqueue(new Uint8Array(60));
      },
    });
    const net = netOf({ 'https://example.org/a.exe': () => new Response(body) }).net;
    await expect(downloadInstaller(net, limits)).rejects.toThrow(/larger/);
    expect(pulled).toBeLessThan(5);
  });
});

describe('rustup-init', () => {
  const bed = registerToolBed();
  const URL = 'https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe';
  const installer = bytesOf('rustup-init bytes');

  test('is downloaded from its fixed address, checked against the checksum next to it and kept in the tools folder', async () => {
    const { net, seen } = netOf({ [URL]: ok(installer), [`${URL}.sha256`]: ok(`${sha256Of(installer)} *rustup-init.exe\n`) });
    const { deps, host } = bed.depsOf({ fetch: net });
    const { file } = await prepareRustup(deps, host);
    expect(seen.map((call) => call.url)).toEqual([URL, `${URL}.sha256`]);
    expect(file.startsWith(join(host.toolsDir, 'installers'))).toBe(true);
    expect(new Uint8Array(await readFile(file))).toEqual(installer);
  });

  test('is refused, and not kept, when it does not match the checksum', async () => {
    const { net } = netOf({ [URL]: ok(installer), [`${URL}.sha256`]: ok(`${'0'.repeat(64)}\n`) });
    const { deps, host } = bed.depsOf({ fetch: net });
    await expect(prepareRustup(deps, host)).rejects.toThrow(/checksum/);
    expect(await readdir(join(host.toolsDir, 'installers')).catch(() => [])).toEqual([]);
  });

  test('is refused when there is no checksum to compare', async () => {
    const { net } = netOf({ [URL]: ok(installer) });
    const { deps, host } = bed.depsOf({ fetch: net });
    await expect(prepareRustup(deps, host)).rejects.toThrow();
  });
});

describe('the Visual Studio installer', () => {
  const bed = registerToolBed();
  const FIRST = 'https://aka.ms/vs/17/release/vs_BuildTools.exe';
  const LAST = 'https://download.visualstudio.microsoft.com/download/pr/vs_BuildTools.exe';
  const POWERSHELL = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';
  const SIGNED = SIGNED_BY_MICROSOFT;
  const net = () => netOf({ [FIRST]: redirect(LAST), [LAST]: ok(bytesOf('vs bootstrapper')) });

  test('comes from aka.ms and is run only after Windows says Microsoft signed it', async () => {
    const routes = net();
    const { deps, host, calls } = bed.depsOf({ fetch: routes.net, answers: { [POWERSHELL]: answer(true, `${SIGNED}\r\n`) } });
    const { file } = await prepareBootstrapper(deps, host);
    expect(routes.seen.map((call) => call.url)).toEqual([FIRST, LAST]);
    expect(file.endsWith('vs_BuildTools.exe')).toBe(true);
    expect(calls).toHaveLength(1);
    expect(calls[0]?.file).toBe(POWERSHELL);
    expect(calls[0]?.args).toEqual(expect.arrayContaining(['-NoProfile', '-NonInteractive']));
    expect(calls[0]?.env).toEqual({ ARCHIPELIA_CHECK: file });
    expect(calls[0]?.args.join(' ')).not.toContain(file);
  });

  test.each([
    ['an invalid signature', answer(true, SIGNED.replace('status=Valid', 'status=HashMismatch'))],
    ['another signer', answer(true, SIGNED.replaceAll('O=Microsoft Corporation', 'O=Evil Corporation'))],
    ['a check that fails', answer(false)],
    ['an empty answer', answer(true, '')],
  ])('is refused and removed after %s', async (_name, verdict) => {
    const { deps, host } = bed.depsOf({ fetch: net().net, answers: { [POWERSHELL]: verdict } });
    await expect(prepareBootstrapper(deps, host)).rejects.toThrow(/signed/);
    expect(await readdir(join(host.toolsDir, 'installers')).then((dirs) => dirs.length, () => 0)).toBe(0);
  });

  test('is refused when the system folder is not a drive path', async () => {
    const { deps, host } = bed.depsOf({ fetch: net().net, host: { env: { SystemRoot: '\\\\server\\share' } } });
    await expect(prepareBootstrapper(deps, host)).rejects.toThrow(/signed/);
  });
});
