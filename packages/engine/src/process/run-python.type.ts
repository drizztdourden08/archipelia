/* @layer core @kind types */
import type { SpawnWrap } from './spawn-command.type';

type PythonRun = { args: string[]; cwd: string; onLine?: (line: string) => void; signal?: AbortSignal; wrap?: SpawnWrap };

type PythonResult = { code: number; lines: string[] };

export type { PythonResult, PythonRun };
