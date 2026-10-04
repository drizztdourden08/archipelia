/* @layer tests @kind helper */
import { installWorld, readCatalog } from '@archipelia/catalog';
import type { SessionPlayer } from '@archipelia/model';
import { ENGINE_DIR } from './e2e-inputs';
import type { RigContext } from './multiworld-rig';

const SOH = 'oot_soh';

const sohPlayer = async ({ games: files, cache, presets }: RigContext, slot: number, name: string): Promise<SessionPlayer> => {
  const catalog = await readCatalog({ files: cache, cacheDir: 'catalog' });
  const entry = catalog.entries.find((candidate) => candidate.apworld === SOH);
  const latest = entry?.versions.at(-1);
  if (!entry || !latest) throw new Error('the index has no Ship of Harkinian version');
  const installed = await installWorld({ engineDir: ENGINE_DIR, files, entry, version: latest.version });
  const preset = await presets.create({ game: installed.game, name: 'Defaults' });
  return { slot, name, game: installed.game, source: { kind: 'preset', presetId: preset.id, overrides: {} } };
};

export { sohPlayer };
