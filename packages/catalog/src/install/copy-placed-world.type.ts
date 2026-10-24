/* @layer core @kind types */
import type { EngineRuntime, InstalledGame } from '@archipelia/model';

type CopyPlacedRequest = { from: EngineRuntime; to: EngineRuntime; record: InstalledGame };

export type { CopyPlacedRequest };
