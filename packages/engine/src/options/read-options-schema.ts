/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { EngineRuntime } from '@archipelia/model';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { DumpedSchema, SchemaDump, SchemaRead } from './read-options-schema.type';
import { parseJson } from '../runtime/parse-json';
import { runPython } from '../process/run-python';
import { apRoot } from '../runtime/ap-root';

const isSchema = (value: unknown): value is DumpedSchema =>
  isRecord(value) && typeof value.game === 'string' && Array.isArray(value.options) && Array.isArray(value.groups);

const isDump = (value: unknown): value is SchemaDump =>
  isRecord(value) && isRecord(value.schemas) && isRecord(value.errors) && typeof value.seconds === 'number' && Array.isArray(value.failedWorlds)
  && Object.values(value.schemas).every(isSchema);

const readOptionsSchema = async (runtime: EngineRuntime, games: string[] = []): Promise<SchemaRead> => {
  const dir = await mkdtemp(join(tmpdir(), 'archipelia-schema-'));
  const out = join(dir, 'schema.json');
  try {
    const args = [runtime.schemaScript, '--out', out, ...games.flatMap((game) => ['--game', game])];
    const { code, lines } = await runPython(runtime, { args, cwd: apRoot(runtime) });
    if (code !== 0) throw new Error(`options_schema.py exited ${code}: ${lines.slice(-5).join(' | ')}`);
    return { ...parseJson(await readFile(out, 'utf8'), isDump, 'options schema dump'), lines };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

export { readOptionsSchema };
