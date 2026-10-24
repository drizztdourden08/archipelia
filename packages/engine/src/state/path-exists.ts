/* @layer core @kind logic */
import { stat } from 'node:fs/promises';

const pathExists = (path: string): Promise<boolean> => stat(path).then(() => true, () => false);

export { pathExists };
