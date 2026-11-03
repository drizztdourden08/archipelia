/* @layer core @kind types */
import type { GamePreset, InstalledGame } from '@archipelia/model';

type LibraryView = { installed: InstalledGame[]; presets: GamePreset[] };

type ProblemField = 'name' | 'game' | 'source' | 'option';

type TemplateProblem = { message: string; field: ProblemField; slot: number; optionKey?: string; optionLabel?: string };

export type { LibraryView, ProblemField, TemplateProblem };
