/* @layer core @kind logic */
import { readOptionsSchema } from '../../index';
import type { EngineRuntime } from '@archipelia/model';
import type { SchemaCheck } from './smoke.type';

const readSmokeSchemas = async (runtime: EngineRuntime, games: string[]): Promise<SchemaCheck> => {
  const dump = await readOptionsSchema(runtime, games);
  return { loaded: Object.keys(dump.schemas), errors: dump.errors };
};

export { readSmokeSchemas };
