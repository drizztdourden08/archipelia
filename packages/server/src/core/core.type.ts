/* @layer core @kind types */
import type { createCore } from './create-core';

type Core = ReturnType<typeof createCore>;

export type { Core };
