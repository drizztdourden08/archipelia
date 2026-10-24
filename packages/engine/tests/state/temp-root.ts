/* @layer tests @kind test */
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const roots: string[] = [];

const tempRoot = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'archipelia-engine-'));
  roots.push(root);
  return root;
};

const cleanTempRoots = async (): Promise<void> => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
};

const writeEngineFolder = async (root: string, name: string, manifest: Record<string, unknown>): Promise<string> => {
  const dir = join(root, name);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'engine.json'), JSON.stringify(manifest), 'utf8');
  return dir;
};

export { cleanTempRoots, tempRoot, writeEngineFolder };
