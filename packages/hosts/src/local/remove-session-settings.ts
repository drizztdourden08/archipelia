/* @layer core @kind logic */
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { SETTINGS_FILE } from './session-settings-file.constants';

const removeSessionSettings = (sessionDir: string) => rm(join(sessionDir, SETTINGS_FILE), { force: true });

export { removeSessionSettings };
