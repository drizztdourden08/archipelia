/* @layer server @kind logic */
import { resolve } from 'node:path';
import type { ConfigSource } from '../config/server-config.type';
import { DATA_ENV, DATA_FLAG, DEFAULT_DATA_FOLDER, STATE_ENV } from './data-folder.constants';

const firstState = (value: string): string => (value.startsWith('/') ? (value.split(':')[0] ?? '') : value);

const dataFolder = (args: readonly string[], env: ConfigSource, cwd: string): string => {
  const flag = args.find((arg) => arg.startsWith(DATA_FLAG))?.slice(DATA_FLAG.length);
  const chosen = [flag, env[DATA_ENV], firstState(env[STATE_ENV] ?? ''), DEFAULT_DATA_FOLDER].find((entry) => entry !== undefined && entry !== '');
  return resolve(cwd, chosen ?? DEFAULT_DATA_FOLDER);
};

export { dataFolder };
