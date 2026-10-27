/* @layer tests @kind test */
import { createHash } from 'node:crypto';
import { describe, expect, test } from 'vitest';
import type { SourceBuildTool } from '@archipelia/model';
import { createTools } from '../src/tool/create-tools';
import type { ToolRunner } from '../src/tool/tool.type';
import { answer, done, registerToolBed, WINGET } from './tool.fixtures';

const bed = registerToolBed();

const BUILD = '11111111-2222-3333-4444-555555555555';

const WINGET_COMMAND = `${WINGET} install --id Microsoft.VisualStudio.2022.BuildTools -e --accept-package-agreements --accept-source-agreements --override "--quiet --wait --norestart --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"`;

const VSWHERE = 'C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vswhere.exe';

type Seen = { elevation: string; tool: SourceBuildTool; spec: Awaited<ReturnType<ReturnType<typeof createTools>['specOf']>> };

const toolsWith = (setup: Parameters<typeof bed.depsOf>[0] = {}, result: Awaited<ReturnType<ToolRunner>> = done()) => {
  const seen: Seen[] = [];
  const holder: { tools?: ReturnType<typeof createTools> } = {};
  const run: ToolRunner = async (elevation, tool) => {
    seen.push({ elevation, tool, spec: await (holder.tools as ReturnType<typeof createTools>).specOf({ tool }) });
    return result;
  };
  const made = bed.depsOf({ ...setup, run: setup.run ?? run });
  holder.tools = createTools(made.deps);
  return { ...made, tools: holder.tools, seen };
};

const startOf = (tool: SourceBuildTool, command: string, patch: object = {}) => ({ tool, buildId: BUILD, command, confirmed: true, ...patch });

describe('what Archipelia offers for a missing tool', () => {
  test('is the plan of this system: the command, the size and who asks for permission', async () => {
    const { tools } = toolsWith({ answers: { [VSWHERE]: answer(false) } });
    const plan = await tools.plan({ tool: 'msvc', buildId: BUILD });
    expect(plan).toMatchObject({ tool: 'msvc', os: 'windows', found: 'missing', install: { command: WINGET_COMMAND, elevation: 'system', restart: true } });
    expect(plan.how).toBe(WINGET_COMMAND);
  });

  test('says found when the tool is already there, and asks the build for CMake', async () => {
    const found = toolsWith({ answers: { [VSWHERE]: answer(true, 'C:\\BuildTools') } });
    expect((await found.tools.plan({ tool: 'msvc', buildId: BUILD })).found).toBe('found');
    const cmake = toolsWith({ pins: ['cmake'] });
    expect((await cmake.tools.plan({ tool: 'cmake', buildId: BUILD })).found).toBe('found');
    expect((await toolsWith().tools.plan({ tool: 'cmake', buildId: BUILD })).found).toBe('missing');
  });

  test('refuses a tool that is not in the table', async () => {
    const { tools } = toolsWith();
    await expect(tools.plan({ tool: 'rm -rf /' as SourceBuildTool, buildId: BUILD })).rejects.toThrow(/not valid/);
    await expect(tools.plan({ tool: 'msvc', buildId: '../../etc' })).rejects.toThrow(/not valid/);
  });
});

describe('installing a tool', () => {
  test('runs the winget command of the table and checks again when it ends', async () => {
    const { tools, seen, logs } = toolsWith({ answers: { [VSWHERE]: answer(true, 'C:\\BuildTools') } });
    const end = await tools.install(startOf('msvc', WINGET_COMMAND));
    expect(end).toEqual({ status: 'done', after: 'check', found: 'found', log: [] });
    expect(seen).toHaveLength(1);
    expect(seen[0]?.elevation).toBe('system');
    expect(seen[0]?.spec.command).toBe(WINGET);
    expect(seen[0]?.spec.args.slice(0, 4)).toEqual(['install', '--id', 'Microsoft.VisualStudio.2022.BuildTools', '-e']);
    expect(logs.some((line) => line.includes(WINGET_COMMAND))).toBe(true);
  });

  test('asks for a restart when the installer ends with 3010', async () => {
    const { tools } = toolsWith({}, done([], 3010));
    expect(await tools.install(startOf('msvc', WINGET_COMMAND))).toMatchObject({ status: 'done', after: 'restart', found: 'missing' });
  });

  test('refuses to run until the user clicks, and when the command changed since it was shown', async () => {
    const { tools, seen } = toolsWith();
    await expect(tools.install(startOf('msvc', WINGET_COMMAND, { confirmed: false }))).rejects.toThrow(/Click Install/);
    await expect(tools.install(startOf('msvc', `${WINGET_COMMAND} --extra`))).rejects.toThrow(/changed/);
    await expect(tools.install(startOf('msvc', WINGET_COMMAND, { command: 7 }))).rejects.toThrow(/not valid/);
    await expect(tools.install(startOf('msvc', 'x'.repeat(3000)))).rejects.toThrow(/not valid/);
    expect(seen).toEqual([]);
  });

  test('is refused on an immutable system', async () => {
    const { tools, seen } = toolsWith({ host: { platform: 'linux', release: 'steamos' } });
    await expect(tools.install(startOf('compiler', 'pkexec /usr/bin/pacman -S --needed --noconfirm base-devel'))).rejects.toThrow(/read-only/);
    expect(seen).toEqual([]);
  });

  test('is refused for a tool that cannot be installed here', async () => {
    const { tools } = toolsWith();
    await expect(tools.install(startOf('headers', ''))).rejects.toThrow(/cannot install/);
    await expect(tools.install(startOf('xcode', 'xcode-select --install'))).rejects.toThrow(/cannot install/);
  });

});

describe('installing on Linux and macOS', () => {
  test('runs a package manager only through pkexec, with the absolute path of both', async () => {
    const { tools, seen } = toolsWith({ host: { platform: 'linux', release: 'ubuntu' }, answers: { '/usr/bin/cc': answer(true) } });
    await tools.install(startOf('compiler', 'pkexec /usr/bin/apt-get install -y build-essential'));
    expect(seen[0]?.spec).toMatchObject({ command: '/usr/bin/pkexec', args: ['/usr/bin/apt-get', 'install', '-y', 'build-essential'], env: {} });
  });

  test('opens the Apple installer and waits for the user to finish it', async () => {
    const { tools, seen } = toolsWith({ host: { platform: 'darwin', arch: 'arm64' } });
    expect(await tools.install(startOf('xcode', 'xcode-select --install'))).toMatchObject({ status: 'done', after: 'dialog', found: 'missing' });
    expect(seen[0]?.spec).toMatchObject({ command: '/usr/bin/xcode-select', args: ['--install'] });
  });

  test('counts xcode-select as done when it says the tools are already there', async () => {
    const failed = { status: 'failed' as const, code: 1, lines: ['xcode-select: error: command line tools are already installed'], error: 'exit 1' };
    const { tools } = toolsWith({ host: { platform: 'darwin' }, answers: { '/usr/bin/xcode-select': answer(true, '/Library/Developer/CommandLineTools') } }, failed);
    expect(await tools.install(startOf('xcode', 'xcode-select --install'))).toMatchObject({ status: 'done', after: 'check', found: 'found' });
  });

  test('reports a failed installer with its log, without paths', async () => {
    const failed = { status: 'failed' as const, code: 1, lines: ['installing', 'could not write C:\\Users\\me\\secret\\file'], error: 'It exited with 1' };
    const { tools } = toolsWith({}, failed);
    const end = await tools.install(startOf('msvc', WINGET_COMMAND));
    expect(end).toMatchObject({ status: 'failed', message: 'It exited with 1' });
    expect(JSON.stringify(end)).not.toContain('secret');
  });

  test('reports a refused job and a cancelled one', async () => {
    const rejected = { status: 'rejected' as const, code: null, lines: [], error: 'The installer is not signed' };
    expect(await toolsWith({}, rejected).tools.install(startOf('msvc', WINGET_COMMAND))).toMatchObject({ status: 'failed', message: 'The installer is not signed' });
    const cancelled = { status: 'cancelled' as const, code: null, lines: [] };
    expect(await toolsWith({}, cancelled).tools.install(startOf('msvc', WINGET_COMMAND))).toEqual({ status: 'cancelled' });
  });

  test('works in the desktop app only', async () => {
    const made = bed.depsOf({});
    await expect(createTools(made.deps).install(startOf('msvc', WINGET_COMMAND))).rejects.toThrow(/desktop app only/);
  });
});

describe('two installs at once', () => {
  test('are refused while one is running, and the grant of the first stays its own', async () => {
    const holder: { tools?: ReturnType<typeof createTools> } = {};
    const second: { error?: unknown } = {};
    const run: ToolRunner = async (_elevation, tool) => {
      await (holder.tools as ReturnType<typeof createTools>).install(startOf('msvc', WINGET_COMMAND)).catch((error: unknown) => { second.error = error; });
      await (holder.tools as ReturnType<typeof createTools>).specOf({ tool });
      return done();
    };
    const made = bed.depsOf({ run });
    holder.tools = createTools(made.deps);
    expect(await holder.tools.install(startOf('msvc', WINGET_COMMAND))).toMatchObject({ status: 'done' });
    expect(String(second.error)).toMatch(/already installing/);
  });
});

describe('the program the job runs', () => {
  test('is built only after an install click, once', async () => {
    const { tools } = toolsWith();
    await expect(tools.specOf({ tool: 'msvc' })).rejects.toThrow(/after you click Install/);
    await tools.install(startOf('msvc', WINGET_COMMAND));
    await expect(tools.specOf({ tool: 'msvc' })).rejects.toThrow(/after you click Install/);
  });

  test('is not built for another tool than the one the user asked for', async () => {
    const holder: { tools?: ReturnType<typeof createTools> } = {};
    const run: ToolRunner = async () => {
      await (holder.tools as ReturnType<typeof createTools>).specOf({ tool: 'rust' });
      return done();
    };
    const made = bed.depsOf({ run });
    holder.tools = createTools(made.deps);
    await expect(holder.tools.install(startOf('msvc', WINGET_COMMAND))).rejects.toThrow(/after you click Install/);
  });

  test('for Rust is the downloaded rustup-init with the per-user folders and no shell', async () => {
    const installer = new TextEncoder().encode('rustup bytes');
    const url = 'https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe';
    const sum = createHash('sha256').update(installer).digest('hex');
    const net = ((input: string | URL) => Promise.resolve(String(input) === url ? new Response(installer) : new Response(sum))) as typeof fetch;
    const { tools, seen, host } = toolsWith({ fetch: net });
    const command = 'rustup-init.exe -y --no-modify-path --profile minimal';
    expect(await tools.install(startOf('rust', command))).toMatchObject({ status: 'done', after: 'check' });
    expect(seen[0]?.elevation).toBe('none');
    expect(seen[0]?.spec.args).toEqual(['-y', '--no-modify-path', '--profile', 'minimal']);
    expect(seen[0]?.spec.command.startsWith(host.toolsDir)).toBe(true);
    expect(seen[0]?.spec.env).toMatchObject({ RUSTUP_INIT_SKIP_PATH_CHECK: 'yes' });
    expect(seen[0]?.spec.env.CARGO_HOME).toContain('cargo');
    expect(seen[0]?.spec.env.RUSTUP_HOME).toContain('rustup');
  });
});

describe('CMake', () => {
  test('is added to the build as a pinned wheel, not run as a program', async () => {
    const { tools, added, seen } = toolsWith({ host: { platform: 'linux', release: 'ubuntu' } });
    const command = 'python -m pip install --only-binary=:all: --require-hashes cmake';
    const end = await tools.install(startOf('cmake', command));
    expect(added).toEqual(['cmake']);
    expect(end).toMatchObject({ status: 'done', after: 'check', found: 'found', plan: { buildId: BUILD } });
    expect(seen).toEqual([]);
  });
});
