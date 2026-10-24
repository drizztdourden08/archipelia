/* @layer core @kind types */
import type { SpawnWrap } from './spawn-command.type';

type PythonSpawn = { args: string[]; cwd: string; onLine?: (line: string) => void; keepStdin?: boolean; signal?: AbortSignal; wrap?: SpawnWrap };

export type { PythonSpawn };
