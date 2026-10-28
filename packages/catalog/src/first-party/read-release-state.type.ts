/* @layer core @kind types */
import type { ReleaseState } from './first-party.type';

type Classify = (manifest: unknown) => ReleaseState;

export type { Classify };
