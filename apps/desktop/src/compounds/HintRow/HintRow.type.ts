/* @layer renderer-app @kind types */
import type { StatusTone } from '@drizztdourden08/tessera/primitives';

type HintRowProps = {
  item: string;
  receiver: string;
  finder: string;
  location: string;
  entrance: string;
  state: string;
  stateTone: StatusTone;
};

export type { HintRowProps };
