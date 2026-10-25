/* @layer core @kind logic */
import { ENGINE_TEXT } from './engine-text.constants';
import type { RemoveDeps } from './remove-engine.type';
import { unusedDownloads } from './unused-downloads';

const removeEngine = async (deps: RemoveDeps, id: string): Promise<void> => {
  const state = await deps.state();
  const engine = state.installed.find((entry) => entry.id === id);
  if (!engine) throw new Error(ENGINE_TEXT.unknown);
  const use = deps.inUse(id);
  if (use) throw new Error(use);
  await deps.forget(id);
  await deps.discard(id);
  const kept = state.installed.filter((entry) => entry.id !== id);
  for (const name of unusedDownloads(await deps.downloads(), engine, kept)) await deps.dropDownload(name);
};

export { removeEngine };
