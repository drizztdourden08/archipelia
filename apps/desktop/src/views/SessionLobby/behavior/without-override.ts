/* @layer renderer-app @kind logic */
import type { SetPlayer } from '@archipelia/model';
import { omitKey } from './omit-key';

const withoutOverride = (player: SetPlayer, key: string): SetPlayer => {
  if (player.source.kind !== 'preset') return player;
  return { ...player, source: { ...player.source, overrides: omitKey(player.source.overrides, key) } };
};

export { withoutOverride };
