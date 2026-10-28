/* @layer core @kind types */
import type { ReleasesRead } from './versions.type';

type Hit = { at: number; read: Promise<ReleasesRead> };

export type { Hit };
