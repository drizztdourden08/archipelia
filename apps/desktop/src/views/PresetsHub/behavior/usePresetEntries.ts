/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useSearchEntries } from '@drizztdourden08/brock-react';
import type { GamePreset } from '@archipelia/model';
import { presetAnchor } from './preset-anchor';

const usePresetEntries = (presets: readonly GamePreset[]): void => {
  const entries = useMemo(() => presets.map((preset) => ({
    id: preset.id,
    params: { presetId: preset.id },
    label: preset.name,
    description: `Preset for ${preset.game}`,
    keywords: ['preset', 'options', preset.game],
    anchor: presetAnchor(preset.id),
  })), [presets]);
  useSearchEntries(entries);
};

export { usePresetEntries };
