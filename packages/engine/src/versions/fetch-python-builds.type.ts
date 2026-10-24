/* @layer core @kind types */
import type { PythonBuild } from '@archipelia/model';

type PythonBuildsOutcome = { release: string; builds: PythonBuild[] };

export type { PythonBuildsOutcome };
