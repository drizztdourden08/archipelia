/* @layer renderer-app @kind types */
import type { GameSchema } from '@archipelia/model';

type FocusParams = {
  focusKey?: string | null;
  schema: GameSchema;
  query: string;
  tab: string;
  setTab: (tab: string) => void;
  setQuery: (query: string) => void;
  onFocused?: () => void;
};

export type { FocusParams };
