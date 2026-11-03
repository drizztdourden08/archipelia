/* @layer renderer-app @kind types */
import type { HostTarget } from '@archipelia/model';

type LayoutSeed = { name: string; host: HostTarget; lan: boolean; players: readonly string[] };

export type { LayoutSeed };
