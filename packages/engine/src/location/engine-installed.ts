/* @layer core @kind logic */
import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { RUNTIME_FILE } from '../runtime/read-runtime.constants';

const engineInstalled = (engineDir: string) =>
  access(join(engineDir, RUNTIME_FILE)).then(() => true, () => false);

export { engineInstalled };
