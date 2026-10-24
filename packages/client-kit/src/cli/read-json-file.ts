/* @layer client-kit @kind logic */
import { readFile } from 'node:fs/promises';
import { createKitError } from '../errors/create-kit-error';

const readJsonFile = async (path: string): Promise<unknown> => {
  let text: string;
  try {
    text = await readFile(path, 'utf8');
  } catch {
    throw createKitError('usage', `Cannot read ${path}.`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw createKitError('usage', `${path} is not JSON.`);
  }
};

export { readJsonFile };
