/* @layer tests @kind fixture */
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const WINDOWS_TAGS = [
  'cp312-cp312-win_amd64', 'cp312-abi3-win_amd64', 'cp312-none-win_amd64', 'cp311-abi3-win_amd64', 'cp310-abi3-win_amd64',
  'py312-none-win_amd64', 'py3-none-win_amd64', 'cp312-none-any', 'py312-none-any', 'py3-none-any', 'py311-none-any',
];

const LINUX_TAGS = ['cp312-cp312-manylinux_2_17_x86_64', 'cp312-cp312-manylinux2014_x86_64', 'cp312-abi3-manylinux_2_17_x86_64', 'py3-none-any'];

const writeWheelFile = async (file: string): Promise<string> => {
  const path = join(await mkdtemp(join(tmpdir(), 'archipelia-wheel-test-')), file);
  await writeFile(path, 'not read by pip in these tests');
  return path;
};

export { LINUX_TAGS, WINDOWS_TAGS, writeWheelFile };
