/* @layer core @kind logic */
import { win32 } from 'node:path';
import { DRIVE_PATH, WINGET_PATH } from './tool.constants';
import type { ToolEnv } from './tool.type';

const wingetPathOf = async (env: ToolEnv, exists: (path: string) => Promise<boolean>): Promise<string | undefined> => {
  const base = env.LOCALAPPDATA;
  if (base === undefined || !DRIVE_PATH.test(base)) return undefined;
  const path = win32.join(base, ...WINGET_PATH);
  return (await exists(path)) ? path : undefined;
};

export { wingetPathOf };
