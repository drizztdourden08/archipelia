/* @layer server @kind logic */
import { readFileSync } from 'node:fs';
import { parse } from 'smol-toml';
import { configFilePath } from './config-file-path';
import { ConfigProblem } from './config-problem';
import { pickConfig } from './pick-config';
import type { ConfigSource, LoadedConfig } from './server-config.type';

const loadConfig = (dataDir: string, args: readonly string[], env: ConfigSource): LoadedConfig => {
  const file = configFilePath(dataDir, args, env);
  let values: unknown = {};
  if (file) {
    try {
      values = parse(readFileSync(file, 'utf8'));
    } catch (error) {
      throw new ConfigProblem(file, error instanceof Error ? error.message : String(error));
    }
  }
  return { config: pickConfig(values, env), file };
};

export { loadConfig };
