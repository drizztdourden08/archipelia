/* @layer core @kind types */
import type { OptionValue } from '@archipelia/model';
import type { createPresetStore } from './preset-store';

type PresetInput = { game: string; name: string; values?: Record<string, OptionValue> };

type PresetStore = ReturnType<typeof createPresetStore>;

export type { PresetInput, PresetStore };
