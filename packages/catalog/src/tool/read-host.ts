/* @layer core @kind logic */
import { lstat, readFile } from 'node:fs/promises';
import { OS_RELEASE_FILE, OSTREE_MARKER } from './tool.constants';
import type { Probe, ToolHost } from './tool.type';
import { distroOf } from './distro-of';
import { resolveWinget } from './resolve-winget';

const exists = (path: string): Promise<boolean> => lstat(path).then(() => true, () => false);

const readHost = async (toolsDir: string, probe: Probe): Promise<ToolHost> => {
  const base: ToolHost = { platform: process.platform, arch: process.arch, env: process.env, toolsDir };
  if (base.platform === 'win32') return { ...base, winget: await resolveWinget(base.env, exists, probe) };
  if (base.platform !== 'linux') return base;
  const text = await readFile(OS_RELEASE_FILE, 'utf8').catch(() => '');
  return { ...base, distro: distroOf(text, await exists(OSTREE_MARKER)) };
};

export { readHost };
