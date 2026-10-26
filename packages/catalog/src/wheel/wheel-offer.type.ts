/* @layer core @kind types */
import type { SourceWheel, SourceWheelState } from '@archipelia/model';

type Offer = { state: SourceWheelState; wheel?: SourceWheel | undefined };

export type { Offer };
