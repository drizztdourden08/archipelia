/* @layer server @kind logic */
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { CONFIG_ENV, CONFIG_FILE_NAME, CONFIG_FLAG, SYSTEM_CONFIG_FILE } from './config.constants';
import type { ConfigSource } from './server-config.type';

const configFilePath = (dataDir: string, args: readonly string[], env: ConfigSource): string | null => {
  const flag = args.find((arg) => arg.startsWith(CONFIG_FLAG))?.slice(CONFIG_FLAG.length);
  const named = [flag, env[CONFIG_ENV.file]].find((value) => value !== undefined && value !== '');
  if (named) return resolve(named);
  return [join(dataDir, CONFIG_FILE_NAME), SYSTEM_CONFIG_FILE].find((candidate) => existsSync(candidate)) ?? null;
};

export { configFilePath };
