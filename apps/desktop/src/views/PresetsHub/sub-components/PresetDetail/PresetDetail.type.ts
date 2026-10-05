/* @layer renderer-app @kind types */
import type { GamePreset, GameSchema } from '@archipelia/model';
import type { PresetSave } from '../../PresetsHub.type';

type PresetDetailProps = {
  selected: GamePreset | null;
  schema?: GameSchema;
  onOpenGames: () => void;
  onDuplicate: (preset: GamePreset) => void;
  onDelete: (preset: GamePreset) => void;
  onDirtyChange: (dirty: boolean) => void;
  onSaveChange: (save: PresetSave | null) => void;
};

export type { PresetDetailProps };
