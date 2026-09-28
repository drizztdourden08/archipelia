/* @layer renderer-app @kind logic */
import type { GameSchema } from '@archipelia/model';
import { parse } from 'yaml';
import { coercePresetValues, isLoose } from '../../../option-fields';
import type { CoercedValues } from '../../../option-fields';

const gamesOf = (game: unknown): string[] => {
  if (typeof game === 'string') return [game];
  return isLoose(game) ? Object.keys(game) : [];
};

const importPlayerYaml = (text: string, schema: GameSchema): CoercedValues => {
  const document: unknown = parse(text);
  if (!isLoose(document)) throw new Error('This file is not a player yaml.');
  const games = gamesOf(document.game);
  if (!games.includes(schema.game)) {
    throw new Error(`This file is for ${games.join(', ') || 'no game'}, not ${schema.game}.`);
  }
  const block = document[schema.game];
  if (!isLoose(block)) throw new Error(`This file has no ${schema.game} options.`);
  return coercePresetValues(schema, block);
};

export { importPlayerYaml };
