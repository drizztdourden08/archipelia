/* @layer core @kind logic */
import { readOptionsSchema } from '@archipelia/engine';
import type { EngineRuntime, GameSchema } from '@archipelia/model';
import type { LoadContext } from './load-failure.type';
import { loadError } from './load-error';

const readGameSchema = async (runtime: EngineRuntime, game: string, context?: LoadContext): Promise<GameSchema> => {
  const dump = await readOptionsSchema(runtime, [game]);
  const found = dump.schemas[game];
  if (!found) throw dump.errors[game] ? new Error(`${game}: ${dump.errors[game]}`) : await loadError(dump, game, context);
  const { unsupported: _unsupported, ...schema } = found;
  return schema;
};

export { readGameSchema };
