/* @layer core @kind logic */
import type { Probe, ToolEnv } from './tool.type';
import { verifyWinget } from './verify-winget';
import { wingetPathOf } from './winget-path-of';

const resolveWinget = async (env: ToolEnv, exists: (path: string) => Promise<boolean>, probe: Probe): Promise<string | undefined> => {
  const path = await wingetPathOf(env, exists);
  return path !== undefined && (await verifyWinget(probe, env)) ? path : undefined;
};

export { resolveWinget };
