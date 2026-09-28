/* @layer core @kind types */

type PythonRun = { args: string[]; cwd: string; onLine?: (line: string) => void; signal?: AbortSignal };

type PythonResult = { code: number; lines: string[] };

export type { PythonResult, PythonRun };
