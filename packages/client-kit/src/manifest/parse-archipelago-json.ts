/* @layer client-kit @kind logic */
import type { ArchipelagoManifest } from './archipelago-manifest.type';
import { createFailer } from '../errors/create-failer';
import { parseApVersion } from '../versions/parse-ap-version';
import { isTextList } from './is-text-list';

const fail = createFailer('invalid-manifest', 'archipelago.json is not valid: ');

const textField = (record: Record<string, unknown>, key: string): string => {
  const value = record[key];
  if (typeof value !== 'string' || value === '') return fail(`${key} must be a non-empty text.`);
  return value;
};

const versionField = (record: Record<string, unknown>, key: string): string | undefined => {
  const value = record[key];
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || parseApVersion(value) === null) return fail(`${key} must look like 0.6.8.`);
  return value;
};

const numberField = (record: Record<string, unknown>, key: string): number | undefined => {
  const value = record[key];
  if (value === undefined) return undefined;
  if (typeof value !== 'number' || !Number.isInteger(value)) return fail(`${key} must be a whole number.`);
  return value;
};

const authorsField = (record: Record<string, unknown>): readonly string[] | undefined => {
  const value = record.authors;
  if (value === undefined) return undefined;
  return isTextList(value) ? value : fail('authors must be a list of texts.');
};

const parseArchipelagoJson = (text: string): ArchipelagoManifest => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return fail('the text is not JSON.');
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return fail('the top level must be an object.');
  const record = parsed as Record<string, unknown>;
  const manifest: ArchipelagoManifest = { game: textField(record, 'game'), worldVersion: textField(record, 'world_version') };
  const minimumAp = versionField(record, 'minimum_ap_version');
  const maximumAp = versionField(record, 'maximum_ap_version');
  const authors = authorsField(record);
  const version = numberField(record, 'version');
  const compatibleVersion = numberField(record, 'compatible_version');
  if (minimumAp !== undefined) manifest.minimumAp = minimumAp;
  if (maximumAp !== undefined) manifest.maximumAp = maximumAp;
  if (authors !== undefined) manifest.authors = authors;
  if (version !== undefined) manifest.version = version;
  if (compatibleVersion !== undefined) manifest.compatibleVersion = compatibleVersion;
  return manifest;
};

export { parseArchipelagoJson };
