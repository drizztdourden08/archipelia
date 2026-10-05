/* @layer renderer-app @kind types */
import type { GamePreset, InstalledGame } from '@archipelia/model';
import type { usePresetCreator } from './behavior/usePresetCreator';

type ActionParams = { selectedId: string | null; select: (id: string | null) => void; follow: (id: string) => void };

type StartOption = { value: string; label: string };

type PresetRow = { preset: GamePreset; meta: string; group: string };

type PresetCreatorParams = { installed: InstalledGame[]; preferredGame?: string; onCreated: (id: string) => void };

type PresetCreator = ReturnType<typeof usePresetCreator>;

type PresetSave = () => Promise<boolean>;

export type { ActionParams, PresetCreator, PresetCreatorParams, PresetRow, PresetSave, StartOption };
