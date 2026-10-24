/* @layer tests @kind helper */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const writeFiles = async (dir: string, files: Readonly<Record<string, string>>): Promise<void> => {
  for (const [name, content] of Object.entries(files)) {
    await mkdir(dirname(join(dir, name)), { recursive: true });
    await writeFile(join(dir, name), content);
  }
};

export { writeFiles };
