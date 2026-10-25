/* @layer core @kind logic */
import { readOptionsSchema } from '@archipelia/engine';
import type { EngineRuntime, GameSchema } from '@archipelia/model';
import type { LoadContext } from './load-failure.type';
import { loadFailure } from './load-failure';

const readGameSchema = async (runtime: EngineRuntime, game: string, context?: LoadContext): Promise<GameSchema> => {
  const dump = await readOptionsSchema(runtime, [game]);
  const found = dump.schemas[game];
  if (!found) throw new Error(dump.errors[game] ? `${game}: ${dump.errors[game]}` : loadFailure(dump, game, context));
  const { unsupported: _unsupported, ...schema } = found;
  return schema;
};

export { readGameSchema };
