/* @layer client-kit @kind logic */
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createKitError } from '../errors/create-kit-error';
import { INDEX_SUFFIX } from './node.constants';

const findIndexFile = async (dir: string, module: string | undefined): Promise<string> => {
  if (module !== undefined) return join(dir, `${module}${INDEX_SUFFIX}`);
  const names = (await readdir(dir)).filter((name) => name.endsWith(INDEX_SUFFIX));
  if (names.length !== 1) {
    throw createKitError('invalid-input', `Expected one *${INDEX_SUFFIX} index in ${dir}, found ${names.length}. Run build-set first, or name the module.`);
  }
  return join(dir, names[0] ?? '');
};

export { findIndexFile };
