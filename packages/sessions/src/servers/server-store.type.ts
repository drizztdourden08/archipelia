/* @layer core @kind types */
import type { createServerStore } from './create-server-store';

type ServerStore = ReturnType<typeof createServerStore>;

export type { ServerStore };
