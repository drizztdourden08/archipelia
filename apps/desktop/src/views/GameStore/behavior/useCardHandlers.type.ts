/* @layer renderer-app @kind types */
import type { useGameStore } from './useGameStore';

type CardHandlersParams = {
  store: ReturnType<typeof useGameStore>;
  setOpened: (key: string | null) => void;
};

export type { CardHandlersParams };
