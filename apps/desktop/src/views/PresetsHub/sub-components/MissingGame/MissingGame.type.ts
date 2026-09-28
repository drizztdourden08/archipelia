/* @layer renderer-app @kind types */
import type { GamePreset } from '@archipelia/model';

type MissingGameProps = { preset: GamePreset; onOpenGames: () => void; onDelete: (preset: GamePreset) => void };

export type { MissingGameProps };
