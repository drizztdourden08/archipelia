/* @layer core @kind types */
import type { OptionValue } from './options.type';

type GamePreset = {
  id: string;
  game: string;
  name: string;
  values: Record<string, OptionValue>;
  updatedAt: number;
};

export type { GamePreset };
