/* @layer tests @kind test */
import { posix, win32 } from 'node:path';
import { describe, expect, test } from 'vitest';
import { detectTool } from '../src/tool/detect-tool';
import { answer, hostOf, probeOf } from './tool.fixtures';

const TOOLS = 'C:\\Users\\me\\tools';

const NIX_TOOLS = '/home/me/tools';

const VSWHERE = 'C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vswhere.exe';

describe('finding a build tool on Windows', () => {
  test('asks vswhere, by its absolute path under Program Files (x86), for the C++ tools', async () => {
    const { probe, calls } = probeOf({ [VSWHERE]: answer(true, 'C:\\BuildTools\r\n') });
    expect(await detectTool('msvc', hostOf(TOOLS), probe)).toBe('found');
    expect(calls).toEqual([{
      file: VSWHERE,
      args: ['-latest', '-products', '*', '-requires', 'Microsoft.VisualStudio.Component.VC.Tools.x86.x64', '-property', 'installationPath'],
      env: undefined,
    }]);
  });

  test('says missing when vswhere prints nothing, fails or is not installed', async () => {
    expect(await detectTool('msvc', hostOf(TOOLS), probeOf({ [VSWHERE]: answer(true, '  \r\n') }).probe)).toBe('missing');
    expect(await detectTool('msvc', hostOf(TOOLS), probeOf({ [VSWHERE]: answer(false) }).probe)).toBe('missing');
    expect(await detectTool('msvc', hostOf(TOOLS), probeOf().probe)).toBe('missing');
  });

  test('uses the Program Files (x86) of the machine when it has one', async () => {
    const env = { 'ProgramFiles(x86)': 'D:\\Programs (x86)' };
    const { probe, calls } = probeOf();
    await detectTool('msvc', hostOf(TOOLS, { env }), probe);
    expect(calls[0]?.file).toBe('D:\\Programs (x86)\\Microsoft Visual Studio\\Installer\\vswhere.exe');
  });

  test('a missing generic compiler on Windows is the C++ Build Tools', async () => {
    const { probe, calls } = probeOf({ [VSWHERE]: answer(true, 'C:\\BuildTools') });
    expect(await detectTool('compiler', hostOf(TOOLS), probe)).toBe('found');
    expect(calls).toHaveLength(1);
  });
});

describe('finding a build tool on Linux', () => {
  const linux = hostOf(NIX_TOOLS, { platform: 'linux', release: 'ubuntu' });

  test.each(['/usr/bin/cc', '/usr/bin/gcc', '/usr/bin/clang'])('finds a C compiler at %s', async (file) => {
    expect(await detectTool('compiler', linux, probeOf({ [file]: answer(true, 'cc 13') }).probe)).toBe('found');
  });

  test('says missing when no compiler answers', async () => {
    const { probe, calls } = probeOf();
    expect(await detectTool('compiler', linux, probe)).toBe('missing');
    expect(calls.map((call) => call.file)).toEqual(['/usr/bin/cc', '/usr/bin/gcc', '/usr/bin/clang']);
    expect(calls.every((call) => call.args.join(' ') === '--version')).toBe(true);
  });
});

describe('finding a build tool on macOS', () => {
  const mac = hostOf(TOOLS, { platform: 'darwin', arch: 'arm64' });

  test('asks xcode-select -p', async () => {
    const { probe, calls } = probeOf({ '/usr/bin/xcode-select': answer(true, '/Library/Developer/CommandLineTools') });
    expect(await detectTool('xcode', mac, probe)).toBe('found');
    expect(calls).toEqual([{ file: '/usr/bin/xcode-select', args: ['-p'], env: undefined }]);
  });

  test('treats a missing C compiler as the Xcode command line tools', async () => {
    expect(await detectTool('compiler', mac, probeOf().probe)).toBe('missing');
  });
});

describe('finding Rust', () => {
  test('looks only in the cargo folder of Archipelia, the one a confined build can see', async () => {
    const { probe, calls } = probeOf();
    expect(await detectTool('rust', hostOf(NIX_TOOLS, { platform: 'linux', release: 'ubuntu' }), probe)).toBe('missing');
    expect(calls.map((call) => call.file)).toEqual([posix.join(NIX_TOOLS, 'cargo', 'bin', 'cargo')]);
    expect(calls.every((call) => call.args.join(' ') === '--version')).toBe(true);
  });

  test('finds the cargo that Archipelia installed', async () => {
    const own = win32.join(TOOLS, 'cargo', 'bin', 'cargo.exe');
    expect(await detectTool('rust', hostOf(TOOLS), probeOf({ [own]: answer(true, 'cargo 1.90') }).probe)).toBe('found');
  });
});

describe('what has no probe', () => {
  test('CMake and the headers are not looked for on the system', async () => {
    const { probe, calls } = probeOf();
    expect(await detectTool('cmake', hostOf(TOOLS), probe)).toBe('unknown');
    expect(await detectTool('headers', hostOf(TOOLS), probe)).toBe('unknown');
    expect(await detectTool('python-headers', hostOf(TOOLS), probe)).toBe('unknown');
    expect(calls).toEqual([]);
  });
});
