/* @layer core @kind types */
import type { DataFiles } from '@archipelia/model';
import type { ReadyRepo } from './ready.type';

type StatesParams = { files: DataFiles; request: typeof fetch; now: number; force: boolean; all: ReadyRepo[]; wanted: ReadyRepo[] };

export type { StatesParams };
