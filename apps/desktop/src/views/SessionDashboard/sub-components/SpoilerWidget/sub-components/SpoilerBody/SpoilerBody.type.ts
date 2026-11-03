/* @layer renderer-app @kind types */
import type { SpoilerGroup } from '@archipelia/design';
import type { SpoilerLog } from '@archipelia/sessions/spoiler';
import type { SpoilerState } from '../../SpoilerWidget.type';

type SpoilerBodyProps = {
  log: SpoilerLog;
  text: string;
  root: SpoilerGroup | null;
  state: SpoilerState;
};

export type { SpoilerBodyProps };
