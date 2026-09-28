/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';
import { PRESET_PREFIX, YAML_VALUE } from '../SessionBuilder.constants';

const sourceValueOf = (player: SessionPlayer) => {
  if (player.source.kind === 'yaml') return YAML_VALUE;
  return player.source.presetId ? `${PRESET_PREFIX}${player.source.presetId}` : '';
};

export { sourceValueOf };
