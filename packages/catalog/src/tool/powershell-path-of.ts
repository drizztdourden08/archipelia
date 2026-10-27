/* @layer core @kind logic */
import { win32 } from 'node:path';
import { DRIVE_PATH, POWERSHELL_PATH } from './tool.constants';
import type { ToolEnv } from './tool.type';

const powershellPathOf = (env: ToolEnv): string | undefined => {
  const root = env.SystemRoot ?? env.windir;
  return root === undefined || !DRIVE_PATH.test(root) ? undefined : win32.join(root, ...POWERSHELL_PATH);
};

export { powershellPathOf };
