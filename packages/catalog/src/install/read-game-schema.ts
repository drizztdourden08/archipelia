/* @layer core @kind logic */
import { readOptionsSchema } from '@archipelia/engine';
import type { SchemaRead } from '@archipelia/engine';
import type { EngineRuntime, GameSchema } from '@archipelia/model';
import { ERROR_LINE } from './read-game-schema.constants';

const loadFailure = ({ failedWorlds, lines }: SchemaRead) => {
  const cause = lines.filter((line) => ERROR_LINE.test(line)).at(-1)?.trim();
  const worlds = failedWorlds.length ? `failed to load: ${failedWorlds.join(', ')}` : 'the world did not load in the engine';
  return cause ? `${worlds} (${cause})` : worlds;
};

const readGameSchema = async (runtime: EngineRuntime, game: string): Promise<GameSchema> => {
  const dump = await readOptionsSchema(runtime, [game]);
  const found = dump.schemas[game];
  if (!found) throw new Error(`${game}: ${dump.errors[game] ?? loadFailure(dump)}`);
  const { unsupported: _unsupported, ...schema } = found;
  return schema;
};

export { readGameSchema };
