/* @layer renderer-app @kind types */
import type { BadgeVariant } from '@drizztdourden08/tessera/primitives';

type HintRowProps = {
  item: string;
  receiver: string;
  finder: string;
  location: string;
  entrance: string;
  state: string;
  stateVariant: BadgeVariant;
};

export type { HintRowProps };
