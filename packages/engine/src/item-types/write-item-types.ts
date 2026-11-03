/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runPython } from '../process/run-python';
import { apRoot } from '../runtime/ap-root';
import { ITEM_TYPES_SCRIPT, ITEM_TYPES_SCRIPT_NAME } from './item-types-script.constants';
import type { ItemTypesWrite } from './write-item-types.type';

const writeItemTypes = async (runtime: EngineRuntime, { zip, out, signal }: ItemTypesWrite) => {
  const dir = await mkdtemp(join(tmpdir(), 'archipelia-item-types-'));
  try {
    const script = join(dir, ITEM_TYPES_SCRIPT_NAME);
    await writeFile(script, ITEM_TYPES_SCRIPT, 'utf8');
    const { code, lines } = await runPython(runtime, { args: [script, '--zip', zip, '--out', out], cwd: apRoot(runtime), signal });
    if (code !== 0) throw new Error(`${ITEM_TYPES_SCRIPT_NAME} exited ${code}: ${lines.slice(-5).join(' | ')}`);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

export { writeItemTypes };
