/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';
import { omitKey } from './omit-key';

const withoutOverride = (player: SessionPlayer, key: string) => {
  if (player.source.kind !== 'preset') return player;
  return { ...player, source: { ...player.source, overrides: omitKey(player.source.overrides, key) } };
};

export { withoutOverride };
