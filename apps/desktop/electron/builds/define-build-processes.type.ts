/* @layer electron-main @kind types */
import type { BuildSpec } from '@archipelia/engine';
import type { SourceBuildJob } from '@archipelia/model';

type SpecOf = (job: SourceBuildJob, raw: unknown) => Promise<BuildSpec>;

export type { SpecOf };
