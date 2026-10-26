/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { join } from 'node:path';

const wheelRoot = (runtime: EngineRuntime) => join(runtime.root, 'wheels');

export { wheelRoot };
