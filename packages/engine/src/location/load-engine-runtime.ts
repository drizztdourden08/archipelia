/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { engineFolder } from '../state/engine-folder';
import { loadRuntime } from './load-runtime';

const loadEngineRuntime = (engineRoot: string, id: string): Promise<EngineRuntime> => loadRuntime(engineFolder(engineRoot, id));

export { loadEngineRuntime };
