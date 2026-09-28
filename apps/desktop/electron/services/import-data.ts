/* @layer electron-main @kind logic */
import type { GamePreset, SessionTemplate } from '@archipelia/model';
import { strFromU8, unzipSync } from 'fflate';
import type { AppServices } from './app-services.type';
import { MANIFEST, PRESETS, TEMPLATES } from './data-transfer.constants';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isPreset = (value: unknown): value is GamePreset =>
  isRecord(value) && typeof value.id === 'string' && typeof value.game === 'string' && typeof value.name === 'string'
  && isRecord(value.values);

const isTemplate = (value: unknown): value is SessionTemplate =>
  isRecord(value) && typeof value.id === 'string' && typeof value.name === 'string' && Array.isArray(value.players)
  && isRecord(value.generator) && isRecord(value.server) && isRecord(value.host);

const parseEntry = (bytes: Uint8Array): unknown => {
  try {
    return JSON.parse(strFromU8(bytes));
  } catch {
    return undefined;
  }
};

const importData = async ({ presets, templates }: AppServices, bytes: Uint8Array) => {
  const entries = unzipSync(bytes);
  if (!entries[MANIFEST]) throw new Error('this file is not an Archipelia export');
  const parsed = Object.entries(entries).map(([name, data]) => ({ name, value: parseEntry(data) }));
  const presetRecords = parsed.filter((e) => e.name.startsWith(PRESETS)).map((e) => e.value).filter(isPreset);
  const templateRecords = parsed.filter((e) => e.name.startsWith(TEMPLATES)).map((e) => e.value).filter(isTemplate);
  for (const preset of presetRecords) await presets.put(preset);
  for (const template of templateRecords) await templates.put(template);
  return { presets: presetRecords.length, templates: templateRecords.length };
};

export { importData };
