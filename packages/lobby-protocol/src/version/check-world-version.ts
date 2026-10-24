/* @layer protocol @kind logic */
import type { Failure } from '../protocol/protocol.type';

const checkWorldVersion = (fixed: string | undefined, game: string, worldVersion: string): Failure | null => {
  if (fixed === undefined || fixed === worldVersion) return null;
  return {
    code: 'world-version-conflict',
    message: `This lobby already uses ${game} ${fixed}. You sent ${game} ${worldVersion}. Use ${fixed} and join again.`,
    field: 'worlds',
  };
};

export { checkWorldVersion };
