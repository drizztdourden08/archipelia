/* @layer renderer-app @kind types */
import type { SourcePlan, SourceWheel } from '@archipelia/model';

type WheelDetailsProps = { plan: SourcePlan; wheel: SourceWheel; typed: string; onTyped: (typed: string) => void };

export type { WheelDetailsProps };
