/* @layer electron-main @kind types */
import type { createServerStore } from './server-store';

type ServerStore = ReturnType<typeof createServerStore>;

export type { ServerStore };
