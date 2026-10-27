/* @layer renderer-app @kind types */
import type { LiveTab } from '../live/live.type';

type LiveState = {
  tabs: LiveTab[];
  load: () => Promise<void>;
  apply: (tabs: LiveTab[]) => void;
};

export type { LiveState };
