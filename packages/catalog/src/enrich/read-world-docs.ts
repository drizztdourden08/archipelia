/* @layer core @kind logic */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { apRoot, readRuntime } from '@archipelia/engine';
import { APWORLD_LIMITS, zipEntries, zipEntryBytes } from '@archipelia/model/zip';
import { officialDir } from '../official/official-dir';
import type { DocsParams } from './enrich.type';
import { MAX_DOC_CHARS } from './enrich.constants';
import { pickDocName } from './pick-doc-name';

const fromFolder = async ({ engineDir, apworld, game }: DocsParams): Promise<string | undefined> => {
  const dir = join(apRoot(await readRuntime(engineDir)), 'worlds', apworld, 'docs');
  const name = pickDocName(await readdir(dir).catch(() => []), game);
  return name ? readFile(join(dir, name), 'utf8') : undefined;
};

const fromOfficialZip = async ({ engineDir, apworld, game, file }: DocsParams): Promise<string | undefined> => {
  if (!file) return undefined;
  const bytes = new Uint8Array(await readFile(join(await officialDir(engineDir), file)));
  const entries = zipEntries(bytes, APWORLD_LIMITS);
  const prefix = `${apworld}/docs/`;
  const names = entries.filter((entry) => entry.name.startsWith(prefix)).map((entry) => entry.name.slice(prefix.length));
  const name = pickDocName(names, game);
  const entry = entries.find((candidate) => candidate.name === `${prefix}${name}`);
  return entry ? new TextDecoder().decode(zipEntryBytes(bytes, entry)) : undefined;
};

const readWorldDocs = async (params: DocsParams): Promise<string | undefined> => {
  const text = (await fromFolder(params).catch(() => undefined)) ?? (await fromOfficialZip(params).catch(() => undefined));
  return text?.slice(0, MAX_DOC_CHARS);
};

export { readWorldDocs };
