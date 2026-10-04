/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { GamePreset, SessionTemplate } from '@archipelia/model';
import { strFromU8, unzipSync } from 'fflate';
import type { LibraryImportResult, LibraryStores } from './library-transfer.type';
import { MANIFEST, PRESETS, TEMPLATES } from './library-transfer.constants';

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

const importLibrary = async ({ presets, templates }: LibraryStores, bytes: Uint8Array): Promise<LibraryImportResult> => {
  const entries = unzipSync(bytes);
  if (!entries[MANIFEST]) throw new Error('this file is not an Archipelia export');
  const parsed = Object.entries(entries).map(([name, data]) => ({ name, value: parseEntry(data) }));
  const presetRecords = parsed.filter((e) => e.name.startsWith(PRESETS)).map((e) => e.value).filter(isPreset);
  const templateRecords = parsed.filter((e) => e.name.startsWith(TEMPLATES)).map((e) => e.value).filter(isTemplate);
  for (const preset of presetRecords) await presets.put(preset);
  for (const template of templateRecords) await templates.put(template);
  return { presets: presetRecords.length, templates: templateRecords.length };
};

export { importLibrary };
