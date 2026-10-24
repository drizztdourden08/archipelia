/* @layer tooling-scripts @kind logic */
import { writeFile } from 'node:fs/promises';

const writeManifest = async (file, manifest) => {
  await writeFile(file, JSON.stringify(manifest, null, 2), 'utf8');
  return file;
};

export { writeManifest };
