/* @layer core @kind logic */
import { dirname } from 'node:path';

const pythonHome = (python: string) => dirname(dirname(python));

export { pythonHome };
