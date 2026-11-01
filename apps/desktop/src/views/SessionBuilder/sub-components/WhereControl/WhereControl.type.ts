/* @layer renderer-app @kind types */
import type { useSessionPlace } from '../../behavior/useSessionPlace';

type WhereControlProps = {
  place: ReturnType<typeof useSessionPlace>;
  locked: boolean;
  busy: boolean;
};

export type { WhereControlProps };
