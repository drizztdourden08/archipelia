/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { join } from 'node:path';

const apRoot = (runtime: EngineRuntime) => join(runtime.root, 'ap');

export { apRoot };
