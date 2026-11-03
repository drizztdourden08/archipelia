/* @layer client-kit @kind logic */
import type { PlayerFile } from '../release-manifest/release.type';
import { createKitError } from '../errors/create-kit-error';
import { PLAYER_FILES } from '../release-manifest/release.constants';

const playerFileOf = (value: string | undefined): PlayerFile | undefined => {
  if (value === undefined) return undefined;
  const found = PLAYER_FILES.find((kind) => kind === value);
  if (found === undefined) throw createKitError('usage', `--player-file must be options or app, not "${value}".`);
  return found;
};

export { playerFileOf };
