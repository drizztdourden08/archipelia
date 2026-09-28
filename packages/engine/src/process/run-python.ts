/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import type { PythonResult, PythonRun } from './run-python.type';
import { spawnPython } from './spawn-python';

const runPython = (runtime: EngineRuntime, { args, cwd, onLine, signal }: PythonRun) =>
  new Promise<PythonResult>((resolve, reject) => {
    const lines: string[] = [];
    const take = (line: string) => {
      lines.push(line);
      onLine?.(line);
    };
    const child = spawnPython(runtime, { args, cwd, onLine: take, signal });
    child.on('error', reject);
    child.on('close', (code) => resolve({ code: code ?? -1, lines }));
  });

export { runPython };
