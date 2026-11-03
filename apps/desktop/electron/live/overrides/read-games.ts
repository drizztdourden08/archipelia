/* @layer electron-main @kind logic */
import { LIVE_TEXT } from '../live.constants';
import { readText } from './read-text';

const readGames = (value: unknown): string[] => {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new Error(LIVE_TEXT.badOverride('direct.allowedGames'));
  return value.map((game, index) => readText(`direct.allowedGames[${index}]`, game));
};

export { readGames };
