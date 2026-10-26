/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';

const withPreset = (player: SessionPlayer, presetId: string): SessionPlayer => ({
  ...player, source: { kind: 'preset', presetId, overrides: player.source.kind === 'preset' ? player.source.overrides : {} },
});

export { withPreset };
