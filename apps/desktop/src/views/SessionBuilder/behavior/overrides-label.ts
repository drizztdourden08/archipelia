/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';

const overridesLabel = (player: SessionPlayer) => {
  if (player.source.kind === 'yaml') return 'from file';
  const count = Object.keys(player.source.overrides).length;
  return count ? `${count} changed` : 'none';
};

export { overridesLabel };
