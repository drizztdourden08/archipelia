/* @layer client-kit @kind logic */
import type { ArchipelagoManifest } from '../manifest/archipelago-manifest.type';
import { parseArchipelagoJson } from '../manifest/parse-archipelago-json';
import { readApworldContents } from './read-apworld-contents';

const readApworld = (bytes: Uint8Array): { module: string; manifest: ArchipelagoManifest; entries: readonly string[] } => {
  const { module, manifestText, entries } = readApworldContents(bytes);
  return { module, manifest: parseArchipelagoJson(manifestText), entries };
};

export { readApworld };
