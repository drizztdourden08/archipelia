/* @layer tests @kind fixture */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { strToU8, zipSync } from 'fflate';

const writeZip = async (dir: string, name: string, entries: Record<string, string>): Promise<string> => {
  const file = join(dir, name);
  await writeFile(file, zipSync(Object.fromEntries(Object.entries(entries).map(([k, v]) => [k, strToU8(v)]))));
  return file;
};

export { writeZip };
