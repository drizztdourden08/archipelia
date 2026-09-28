/* @layer renderer-app @kind types */
import type { GamePreset, GameSchema } from '@archipelia/model';

type PresetDetailProps = {
  selected: GamePreset | null;
  schema?: GameSchema;
  onOpenGames: () => void;
  onDuplicate: (preset: GamePreset) => void;
  onDelete: (preset: GamePreset) => void;
  onDirtyChange: (dirty: boolean) => void;
};

export type { PresetDetailProps };
