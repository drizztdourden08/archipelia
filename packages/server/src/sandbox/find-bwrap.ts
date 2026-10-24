/* @layer core @kind logic */
import { access, constants } from 'node:fs/promises';
import { join } from 'node:path';
import { BWRAP_DIRS, BWRAP_NAME } from './sandbox.constants';

const findBwrap = async (dirs: string[] = BWRAP_DIRS): Promise<string | undefined> => {
  for (const dir of dirs) {
    const candidate = join(dir, BWRAP_NAME);
    if (await access(candidate, constants.X_OK).then(() => true, () => false)) return candidate;
  }
  return undefined;
};

export { findBwrap };
