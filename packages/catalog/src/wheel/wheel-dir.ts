/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { wheelRoot } from '@archipelia/engine';
import { join } from 'node:path';
import { SHA256 } from './wheel.constants';

const wheelDir = (runtime: EngineRuntime, sha256: string): string => {
  if (!SHA256.test(sha256)) throw new Error('That wheel is not valid.');
  return join(wheelRoot(runtime), sha256);
};

export { wheelDir };
