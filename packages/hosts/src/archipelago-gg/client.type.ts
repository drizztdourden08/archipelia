/* @layer core @kind types */
import type { createGgClient } from './client';

type GgClient = ReturnType<typeof createGgClient>;

export type { GgClient };
