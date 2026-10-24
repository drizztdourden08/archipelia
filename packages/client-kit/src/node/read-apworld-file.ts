/* @layer client-kit @kind logic */
import { readFile } from 'node:fs/promises';
import type { ApworldFileInfo } from './node.type';
import { readApworld } from '../zip/read-apworld';
import { sha256Hex } from './sha256-hex';

const readApworldFile = async (file: string): Promise<ApworldFileInfo> => {
  const bytes = new Uint8Array(await readFile(file));
  return { ...readApworld(bytes), sha256: sha256Hex(bytes), size: bytes.length };
};

export { readApworldFile };
