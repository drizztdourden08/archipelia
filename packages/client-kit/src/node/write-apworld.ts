/* @layer client-kit @kind logic */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const writeApworld = async (file: string, bytes: Uint8Array): Promise<void> => {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, bytes);
};

export { writeApworld };
