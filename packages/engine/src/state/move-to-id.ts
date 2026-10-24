/* @layer core @kind logic */
import { rename } from 'node:fs/promises';
import { engineFolder } from './engine-folder';
import { pathExists } from './path-exists';

const moveToId = async (engineRoot: string, name: string, id: string): Promise<string> => {
  if (id === name || (await pathExists(engineFolder(engineRoot, id)))) return name;
  try {
    await rename(engineFolder(engineRoot, name), engineFolder(engineRoot, id));
    return id;
  } catch {
    return name;
  }
};

export { moveToId };
