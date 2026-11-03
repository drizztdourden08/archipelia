/* @layer core @kind logic */
import { GAME_LIMIT, GAME_NAME_LIMIT } from './options.constants';

const readGame = (value: unknown, index: number): string => {
  if (typeof value !== 'string' || value === '' || value.length > GAME_NAME_LIMIT) throw new Error(`options.allowedGames[${index}] must be text of 1 to ${GAME_NAME_LIMIT} characters`);
  return value;
};

const readGames = (value: unknown): string[] => {
  if (!Array.isArray(value) || value.length > GAME_LIMIT) throw new Error(`options.allowedGames must be a list of at most ${GAME_LIMIT} games`);
  return [...new Set(value.map(readGame))];
};

export { readGames };
