/* @layer renderer-app @kind logic */
import type { SourceChoice } from '../SessionBuilder.type';
import { NEW_PRESET_VALUE, PRESET_PREFIX, YAML_VALUE } from '../SessionBuilder.constants';

const parseSource = (value: string): SourceChoice => {
  if (value === YAML_VALUE) return { kind: 'yaml' };
  if (value === NEW_PRESET_VALUE) return { kind: 'new-preset' };
  return { kind: 'preset', presetId: value.startsWith(PRESET_PREFIX) ? value.slice(PRESET_PREFIX.length) : value };
};

export { parseSource };
