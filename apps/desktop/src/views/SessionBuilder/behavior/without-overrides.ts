/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';

const withoutOverrides = (player: SessionPlayer) =>
  (player.source.kind === 'preset' ? { ...player, source: { ...player.source, overrides: {} } } : player);

export { withoutOverrides };
