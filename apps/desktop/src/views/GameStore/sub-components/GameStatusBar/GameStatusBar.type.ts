/* @layer renderer-app @kind types */
import type { GameSummary } from '../../GameStore.type';

type GameStatusBarProps = {
  summary: GameSummary;
  loading: boolean;
  filtered: boolean;
  adding: boolean;
  onAddFromFile: () => void;
};

export type { GameStatusBarProps };
