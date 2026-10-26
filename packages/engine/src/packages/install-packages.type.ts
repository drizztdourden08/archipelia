/* @layer core @kind types */
import type { EngineRuntime } from '@archipelia/model';
import type { PythonResult, PythonRun } from '../process/run-python.type';

type PythonRunner = (runtime: EngineRuntime, run: PythonRun) => Promise<PythonResult>;

type InstallPackagesOptions = { signal?: AbortSignal; run?: PythonRunner };

export type { InstallPackagesOptions, PythonRunner };
