/* @layer electron-main @kind logic */
import { strToU8, zipSync } from 'fflate';
import type { AppServices } from './app-services.type';
import { MANIFEST, PRESETS, TEMPLATES } from './data-transfer.constants';

const exportData = async ({ presets, templates }: AppServices) => {
  const entries: Record<string, Uint8Array> = { [MANIFEST]: strToU8(JSON.stringify({ version: 1, at: Date.now() })) };
  for (const preset of await presets.list()) entries[`${PRESETS}${preset.id}.json`] = strToU8(JSON.stringify(preset, null, 2));
  for (const template of await templates.list()) entries[`${TEMPLATES}${template.id}.json`] = strToU8(JSON.stringify(template, null, 2));
  return zipSync(entries);
};

export { exportData };
