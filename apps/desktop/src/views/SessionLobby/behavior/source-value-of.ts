/* @layer renderer-app @kind logic */
import type { SetPlayer } from '@archipelia/model';
import { PRESET_PREFIX, YAML_VALUE } from '../SessionLobby.constants';

const sourceValueOf = ({ source }: SetPlayer) => {
  if (source.kind === 'yaml') return YAML_VALUE;
  return source.presetId ? `${PRESET_PREFIX}${source.presetId}` : '';
};

export { sourceValueOf };
