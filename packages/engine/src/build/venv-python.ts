/* @layer core @kind logic */
import { join } from 'node:path';

const venvPython = (venv: string, platform: NodeJS.Platform = process.platform): string =>
  (platform === 'win32' ? join(venv, 'Scripts', 'python.exe') : join(venv, 'bin', 'python'));

export { venvPython };
