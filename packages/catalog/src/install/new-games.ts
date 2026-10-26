/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { readOptionsSchema } from '@archipelia/engine';

const newGames = async (runtime: EngineRuntime, known: string[]) => {
  const read = await readOptionsSchema(runtime);
  return { games: Object.keys(read.schemas).filter((game) => !known.includes(game)), read };
};

export { newGames };
