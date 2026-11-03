/* @layer renderer-app @kind logic */
import type { SetPlayer } from '@archipelia/model';

const newSet = (slot: number, name: string, game: string, presetId: string): SetPlayer =>
  ({ kind: 'set', slot, name, game, source: { kind: 'preset', presetId, overrides: {} } });

export { newSet };
