/* @layer core @kind types */

type PythonSpawn = { args: string[]; cwd: string; onLine?: (line: string) => void; keepStdin?: boolean; signal?: AbortSignal };

export type { PythonSpawn };
