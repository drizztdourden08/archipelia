/* @layer renderer-app @kind types */
import type { GamePreset, GameSchema, InstalledGame } from '@archipelia/model';
import type { usePresetCreator } from './behavior/usePresetCreator';

type ActionParams = { select: (id: string | null) => void; report: (message: string | null) => void };

type StartOption = { value: string; label: string };

type PresetsHubProps = { presetId?: string };

type PresetRow = { preset: GamePreset; changed: number; meta: string };

type PresetGroup = { game: string; schema?: GameSchema; rows: PresetRow[] };

type PresetCreatorParams = { installed: InstalledGame[]; onCreated: (id: string) => void };

type PresetCreator = ReturnType<typeof usePresetCreator>;

export type { ActionParams, PresetCreator, PresetCreatorParams, PresetGroup, PresetRow, PresetsHubProps, StartOption };
