/* @layer core @kind logic */
import { access, constants } from 'node:fs/promises';
import { join } from 'node:path';
import { TOOL_DIRS } from './sandbox.constants';

const findTool = async (name: string, dirs: string[] = TOOL_DIRS): Promise<string | undefined> => {
  for (const dir of dirs) {
    const candidate = join(dir, name);
    if (await access(candidate, constants.X_OK).then(() => true, () => false)) return candidate;
  }
  return undefined;
};

export { findTool };
