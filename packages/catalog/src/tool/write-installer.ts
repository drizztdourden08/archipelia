/* @layer core @kind logic */
import { randomUUID } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { EXECUTABLE, INSTALLER_DIR } from './tool.constants';

const writeInstaller = async (toolsDir: string, name: string, bytes: Uint8Array): Promise<string> => {
  const root = join(toolsDir, INSTALLER_DIR);
  await rm(root, { recursive: true, force: true }).catch(() => undefined);
  const dir = join(root, randomUUID());
  await mkdir(dir, { recursive: true });
  const file = join(dir, name);
  await writeFile(file, bytes, { mode: EXECUTABLE });
  return file;
};

export { writeInstaller };
