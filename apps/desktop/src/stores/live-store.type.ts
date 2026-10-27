/* @layer renderer-app @kind types */
import type { LiveTab } from '../live/live.type';

type LiveState = {
  tabs: LiveTab[];
  activeId: string | null;
  loaded: boolean;
  load: () => Promise<void>;
  apply: (tabs: LiveTab[]) => void;
  include: (tab: LiveTab) => void;
  activate: (tabId: string) => void;
  move: (from: number, to: number) => void;
};

export type { LiveState };
