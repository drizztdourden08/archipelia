/* @layer renderer-app @kind logic */
import type { GameRow } from '../GameStore.type';

const isPrerelease = ({ entry, installed, state }: GameRow): boolean => {
  if (installed?.release?.prerelease) return true;
  return entry.firstParty?.prerelease === true && (!installed || state === 'update');
};

export { isPrerelease };
