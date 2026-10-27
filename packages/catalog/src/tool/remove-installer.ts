/* @layer core @kind logic */
import { rm } from 'node:fs/promises';
import { dirname } from 'node:path';

const removeInstaller = (file: string): Promise<void> => rm(dirname(file), { recursive: true, force: true }).catch(() => undefined);

export { removeInstaller };
