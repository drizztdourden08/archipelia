/* @layer renderer-app @kind types */
import type { SpoilerGroup } from '@archipelia/design';
import type { SpoilerLog } from '@archipelia/sessions/spoiler';
import type { useSpoilerState } from '../../behavior/useSpoilerState';

type SpoilerBodyProps = {
  log: SpoilerLog;
  text: string;
  root: SpoilerGroup | null;
  state: ReturnType<typeof useSpoilerState>;
};

export type { SpoilerBodyProps };
