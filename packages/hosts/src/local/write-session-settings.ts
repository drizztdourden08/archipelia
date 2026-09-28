/* @layer core @kind logic */
import { join } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { SETTINGS_FILE } from './session-settings-file.constants';

const writeSessionSettings = async (sessionDir: string, password?: string) => {
  const path = join(sessionDir, SETTINGS_FILE);
  const lines = ['server_options:', `  password: ${password ? JSON.stringify(password) : 'null'}`, ''];
  await writeFile(path, lines.join('\n'), { encoding: 'utf8', mode: 0o600 });
  return path;
};

export { writeSessionSettings };
