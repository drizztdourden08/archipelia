/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { readOptionsSchema } from '@archipelia/engine';

const newGames = async (runtime: EngineRuntime, known: string[]) => {
  const dump = await readOptionsSchema(runtime);
  return Object.keys(dump.schemas).filter((game) => !known.includes(game));
};

export { newGames };
