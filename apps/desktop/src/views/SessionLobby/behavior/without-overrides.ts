/* @layer renderer-app @kind logic */
import type { SetPlayer } from '@archipelia/model';

const withoutOverrides = (player: SetPlayer): SetPlayer =>
  (player.source.kind === 'preset' ? { ...player, source: { ...player.source, overrides: {} } } : player);

export { withoutOverrides };
