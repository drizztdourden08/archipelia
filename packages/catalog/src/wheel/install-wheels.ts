/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { installWheel } from '@archipelia/engine';
import { failedText } from '../install/failed-text';
import type { LoadedWheel } from './wheel.type';

const installWheels = async (runtime: EngineRuntime, label: string, wheels: readonly LoadedWheel[]): Promise<void> => {
  for (const { file, source } of wheels) {
    try {
      await installWheel(runtime, { file, sha256: source.sha256 });
    } catch (err) {
      throw new Error(failedText(label, [source.name], err instanceof Error ? err.message : String(err)), { cause: err });
    }
  }
};

export { installWheels };
