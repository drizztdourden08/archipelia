/* @layer renderer-app @kind logic */
import type { SettingsOption } from '@drizztdourden08/tessera/composites';

const versionOption = (version: string, notes: readonly (string | false)[]): SettingsOption => {
  const hint = notes.filter(Boolean).join(', ');
  return hint ? { value: version, label: version, hint } : { value: version, label: version };
};

export { versionOption };
