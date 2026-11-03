/* @layer renderer-app @kind logic */
import type { SetPlayer } from '@archipelia/model';

const withPreset = (player: SetPlayer, presetId: string): SetPlayer => ({
  ...player, source: { kind: 'preset', presetId, overrides: player.source.kind === 'preset' ? player.source.overrides : {} },
});

export { withPreset };
