/* @layer tests @kind helper */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const writeConfig = async (dataDir: string, toml: string): Promise<void> => {
  await mkdir(dataDir, { recursive: true });
  await writeFile(join(dataDir, 'server.toml'), toml);
};

export { writeConfig };
